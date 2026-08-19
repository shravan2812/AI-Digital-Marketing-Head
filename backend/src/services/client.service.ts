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

export interface GetClientsFilters {
  status?: string;
  industry?: string;
  search?: string;
}

export const getClients = async (
  agencyId: string,
  filters: GetClientsFilters = {}
) => {
  const values: unknown[] = [agencyId];

  const conditions: string[] = [
    "agency_id = $1",
  ];

  if (filters.status) {
    values.push(filters.status);

    conditions.push(
      `status = $${values.length}`
    );
  }

  if (filters.industry) {
    values.push(filters.industry);

    conditions.push(
      `LOWER(industry) = LOWER($${values.length})`
    );
  }

  if (filters.search) {
    values.push(`%${filters.search}%`);

    conditions.push(
      `LOWER(name) LIKE LOWER($${values.length})`
    );
  }

  const result = await pool.query(
    `
    SELECT
      id,
      agency_id,
      name,
      website,
      industry,
      description,
      status,
      created_at,
      updated_at
    FROM clients
    WHERE ${conditions.join(" AND ")}
    ORDER BY created_at DESC
    `,
    values
  );

  return result.rows;
};

export const getClientById = async (
  agencyId: string,
  clientId: string
) => {
  const result = await pool.query(
    `
    SELECT
      id,
      agency_id,
      name,
      website,
      industry,
      description,
      status,
      created_at,
      updated_at
    FROM clients
    WHERE id = $1
      AND agency_id = $2
    LIMIT 1
    `,
    [clientId, agencyId]
  );

  return result.rows[0] ?? null;
};

export interface UpdateClientInput {
  name?: string;
  website?: string | null;
  industry?: string | null;
  description?: string | null;
}

export const updateClient = async (
  agencyId: string,
  clientId: string,
  data: UpdateClientInput
) => {
  const result = await pool.query(
    `
    UPDATE clients
    SET
      name = COALESCE($1, name),
      website = COALESCE($2, website),
      industry = COALESCE($3, industry),
      description = COALESCE($4, description),
      updated_at = NOW()
    WHERE id = $5
      AND agency_id = $6
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
      data.name ?? null,
      data.website ?? null,
      data.industry ?? null,
      data.description ?? null,
      clientId,
      agencyId,
    ]
  );

  return result.rows[0] ?? null;
};

export const deactivateClient = async (
  agencyId: string,
  clientId: string
) => {
  const result = await pool.query(
    `
    UPDATE clients
    SET
      status = 'INACTIVE',
      updated_at = NOW()
    WHERE id = $1
      AND agency_id = $2
      AND status = 'ACTIVE'
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
    [clientId, agencyId]
  );

  return result.rows[0] ?? null;
};

export const deleteClient = async (
  agencyId: string,
  clientId: string
) => {
  const result = await pool.query(
    `
    DELETE FROM clients
    WHERE id = $1
      AND agency_id = $2
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
    [clientId, agencyId]
  );

  return result.rows[0] ?? null;
};

export interface GetClientsFilters {
  status?: string;
  industry?: string;
  search?: string;
}

