import crypto from "crypto";

import pool from "../db/connection.js";
import type { Role } from "../constants/roles.js";

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