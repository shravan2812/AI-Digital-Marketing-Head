import pool from "../db/connection.js";

export const getAgencyById = async (agencyId: string) => {
  const result = await pool.query(
    `
    SELECT
      id,
      name,
      slug,
      logo_url,
      website,
      created_at,
      updated_at
    FROM agencies
    WHERE id = $1
    `,
    [agencyId]
  );

  return result.rows[0] ?? null;
};

export const updateAgency = async (
  agencyId: string,
  name: string,
  website: string | null
) => {
  const result = await pool.query(
    `
    UPDATE agencies
    SET
      name = $1,
      website = $2,
      updated_at = NOW()
    WHERE id = $3
    RETURNING
      id,
      name,
      slug,
      logo_url,
      website,
      created_at,
      updated_at
    `,
    [name, website, agencyId]
  );

  return result.rows[0] ?? null;
};