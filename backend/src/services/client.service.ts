import pool from "../db/connection.js";

export interface CreateClientInput {
  name: string;
  website?: string;
  industry?: string;
  description?: string;
}

export const createClient = async (
  agencyId: string,
  data: CreateClientInput
) => {
  const result = await pool.query(
    `
    INSERT INTO clients (
      agency_id,
      name,
      website,
      industry,
      description
    )
    VALUES ($1, $2, $3, $4, $5)
    RETURNING
      id,
      agency_id,
      name,
      website,
      industry,
      description,
      status,
      created_at,
      updated_at
    `,
    [
      agencyId,
      data.name,
      data.website ?? null,
      data.industry ?? null,
      data.description ?? null,
    ]
  );

  return result.rows[0];
};