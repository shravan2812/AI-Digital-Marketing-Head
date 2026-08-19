import crypto from "crypto";
import bcrypt from "bcryptjs";
import pool from "../db/connection.js";
import type { Role } from "../constants/roles.js";
import { sendEmail } from "../utils/email.js";

export const isAgencyMemberByEmail = async (
    agencyId: string,
    email: string
) => {
    const result = await pool.query(
        `
    SELECT 1
    FROM users u
    INNER JOIN agency_members am
      ON am.user_id = u.id
    WHERE am.agency_id = $1
      AND LOWER(u.email) = LOWER($2)
    LIMIT 1
    `,
        [agencyId, email]
    );

    return result.rowCount !== null && result.rowCount > 0;
};

export const createInvitation = async (
    agencyId: string,
    email: string,
    role: Role
) => {
    const token = crypto.randomBytes(32).toString("hex");

    const expiresAt = new Date();

    expiresAt.setHours(
        expiresAt.getHours() + 48
    );

    const result = await pool.query(
        `
    INSERT INTO invitations (
      agency_id,
      email,
      role,
      token,
      expires_at
    )
    VALUES ($1, $2, $3, $4, $5)
    RETURNING
      id,
      agency_id,
      email,
      role,
      expires_at,
      created_at
    `,
        [
            agencyId,
            email.toLowerCase(),
            role,
            token,
            expiresAt,
        ]
    );

    const invitationUrl =
        `${process.env.FRONTEND_URL}/invitations/accept?token=${token}`;

    await sendEmail({
        to: email,
        subject: "You have been invited to join AI Digital SaaS",
        html: `
    <h1>You have been invited!</h1>

    <p>
      You have been invited to join AI Digital SaaS.
    </p>

    <p>
      Your role will be: <strong>${role}</strong>
    </p>

    <p>
      Click the button below to accept your invitation:
    </p>

    <p>
      <a
        href="${invitationUrl}"
        style="
          display: inline-block;
          padding: 12px 20px;
          background: #2563eb;
          color: white;
          text-decoration: none;
          border-radius: 6px;
        "
      >
        Accept Invitation
      </a>
    </p>

    <p>
      This invitation expires in 48 hours.
    </p>
  `,
    });

    return {
        invitation: result.rows[0],
        token,
    };
};

export const hasPendingInvitation = async (
    agencyId: string,
    email: string
) => {
    const result = await pool.query(
        `
    SELECT 1
    FROM invitations
    WHERE agency_id = $1
      AND LOWER(email) = LOWER($2)
      AND accepted_at IS NULL
      AND expires_at > NOW()
    LIMIT 1
    `,
        [agencyId, email]
    );

    return result.rowCount !== null && result.rowCount > 0;
};

export const acceptInvitation = async (
    token: string,
    name: string,
    password: string
) => {
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        const invitationResult = await client.query(
            `
      SELECT
        id,
        agency_id,
        email,
        role,
        token,
        expires_at,
        accepted_at
      FROM invitations
      WHERE token = $1
      FOR UPDATE
      `,
            [token]
        );

        const invitation = invitationResult.rows[0];

        if (!invitation) {
            throw new Error("INVITATION_NOT_FOUND");
        }

        if (invitation.accepted_at) {
            throw new Error("INVITATION_ALREADY_ACCEPTED");
        }

        if (new Date(invitation.expires_at) <= new Date()) {
            throw new Error("INVITATION_EXPIRED");
        }

        const existingUserResult = await client.query(
            `
      SELECT id
      FROM users
      WHERE LOWER(email) = LOWER($1)
      `,
            [invitation.email]
        );

        if (existingUserResult.rows.length > 0) {
            throw new Error("USER_ALREADY_EXISTS");
        }

        const passwordHash = await bcrypt.hash(password, 12);

        const userResult = await client.query(
            `
      INSERT INTO users (
        name,
        email,
        password_hash,
        email_verified
      )
      VALUES ($1, $2, $3, TRUE)
      RETURNING id, name, email
      `,
            [
                name.trim(),
                invitation.email.toLowerCase(),
                passwordHash,
            ]
        );

        const user = userResult.rows[0];

        await client.query(
            `
      INSERT INTO agency_members (
        agency_id,
        user_id,
        role
      )
      VALUES ($1, $2, $3)
      `,
            [
                invitation.agency_id,
                user.id,
                invitation.role,
            ]
        );

        await client.query(
            `
      UPDATE invitations
      SET accepted_at = NOW()
      WHERE id = $1
      `,
            [invitation.id]
        );

        await client.query("COMMIT");

        return {
            user,
            agencyId: invitation.agency_id,
            role: invitation.role,
        };
    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
};