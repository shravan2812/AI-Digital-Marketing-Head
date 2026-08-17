import bcrypt from "bcryptjs";
import pool from "../db/connection.js";
import jwt from "jsonwebtoken";
import type { RegisterInput } from "../validators/auth.validator.js";

export const registerUser = async (input: RegisterInput) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const existingUser = await client.query(
      "SELECT id FROM users WHERE email = $1",
      [input.email.toLowerCase()]
    );

    if (existingUser.rows.length > 0) {
      throw new Error("An account with this email already exists");
    }

    const passwordHash = await bcrypt.hash(input.password, 12);

    const userResult = await client.query(
      `
      INSERT INTO users (
        name,
        email,
        password_hash
      )
      VALUES ($1, $2, $3)
      RETURNING id, name, email, created_at
      `,
      [
        input.name.trim(),
        input.email.toLowerCase(),
        passwordHash,
      ]
    );

    const user = userResult.rows[0];

    const slug = input.agencyName
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    const agencyResult = await client.query(
      `
      INSERT INTO agencies (
        name,
        slug
      )
      VALUES ($1, $2)
      RETURNING id, name, slug
      `,
      [
        input.agencyName.trim(),
        slug,
      ]
    );

    const agency = agencyResult.rows[0];

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
        agency.id,
        user.id,
        "ADMIN",
      ]
    );

    await client.query("COMMIT");

    return {
      user,
      agency,
      role: "ADMIN",
    };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

export const loginUser = async (
  email: string,
  password: string
) => {
  const result = await pool.query(
    `
    SELECT
      u.id,
      u.name,
      u.email,
      u.password_hash,
      am.agency_id,
      am.role
    FROM users u
    JOIN agency_members am
      ON am.user_id = u.id
    WHERE u.email = $1
      AND u.status = 'ACTIVE'
      AND am.status = 'ACTIVE'
    `,
    [email.toLowerCase()]
  );

  if (result.rows.length === 0) {
    throw new Error("Invalid email or password");
  }

  const user = result.rows[0];

  const passwordMatches = await bcrypt.compare(
    password,
    user.password_hash
  );

  if (!passwordMatches) {
    throw new Error("Invalid email or password");
  }

  const token = jwt.sign(
    {
      userId: user.id,
      agencyId: user.agency_id,
      role: user.role,
    },
    process.env.JWT_SECRET!,
    {
      expiresIn: "1h",
    }
  );

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
    agencyId: user.agency_id,
    role: user.role,
    token,
  };
};