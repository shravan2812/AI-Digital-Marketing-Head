import pool from "../db/connection.js";
import type { Role } from "../constants/roles.js";

export const getTeamMembers = async (agencyId: string) => {
  const result = await pool.query(
    `
    SELECT
      u.id,
      u.name,
      u.email,
      am.role
    FROM agency_members am
    INNER JOIN users u
      ON u.id = am.user_id
    WHERE am.agency_id = $1
    ORDER BY u.created_at ASC
    `,
    [agencyId]
  );

  return result.rows;
};

export const changeMemberRole = async (
  agencyId: string,
  userId: string,
  newRole: Role
) => {
  const result = await pool.query(
    `
    UPDATE agency_members
    SET role = $1
    WHERE agency_id = $2
      AND user_id = $3
    RETURNING
      user_id,
      agency_id,
      role
    `,
    [newRole, agencyId, userId]
  );

  return result.rows[0] ?? null;
};

export const deactivateMember = async (
  agencyId: string,
  userId: string
) => {
  const result = await pool.query(
    `
    UPDATE agency_members
    SET status = 'INACTIVE'
    WHERE agency_id = $1
      AND user_id = $2
      AND status = 'ACTIVE'
    RETURNING
      user_id,
      agency_id,
      role,
      status
    `,
    [agencyId, userId]
  );

  return result.rows[0] ?? null;
};

export const removeMember = async (
  agencyId: string,
  userId: string
) => {
  const result = await pool.query(
    `
    DELETE FROM agency_members
    WHERE agency_id = $1
      AND user_id = $2
    RETURNING
      user_id,
      agency_id,
      role,
      status
    `,
    [agencyId, userId]
  );

  return result.rows[0] ?? null;
};

