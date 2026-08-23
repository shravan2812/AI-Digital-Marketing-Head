import { apiRequest } from "./api";

export interface CreateClientInput {
  name: string;
  website?: string;
  industry?: string;
  description?: string;
}

export interface UpdateClientInput {
  name?: string;
  website?: string | null;
  industry?: string | null;
  description?: string | null;
}

export const getClients = async () => {
  return apiRequest("/clients");
};

export const createClient = async (
  data: CreateClientInput
) => {
  return apiRequest("/clients", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const updateClient = async (
  clientId: string,
  data: UpdateClientInput
) => {
  return apiRequest(`/clients/${clientId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

export const deactivateClient = async (
  clientId: string
) => {
  return apiRequest(
    `/clients/${clientId}/deactivate`,
    {
      method: "PUT",
    }
  );
};

export const deleteClient = async (
  clientId: string
) => {
  return apiRequest(`/clients/${clientId}`, {
    method: "DELETE",
  });
};

export const getClientById = async (
  clientId: string
) => {
  return apiRequest(`/clients/${clientId}`);
};