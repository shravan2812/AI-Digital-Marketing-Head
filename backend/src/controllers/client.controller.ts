import type { Response } from "express";
import type { AuthenticatedRequest } from "../middleware/auth.middleware.js";
import {
  createClient,
  getClients,
  getClientById,
  updateClient,
  deactivateClient,
  deleteClient,
  type CreateClientInput,
  type UpdateClientInput,
} from "../services/client.service.js";

export const createClientController = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const agencyId = req.user?.agencyId;

    if (!agencyId) {
      return res.status(400).json({
        success: false,
        message: "Agency information is missing",
      });
    }

    const { name, website, industry, description } = req.body;

    if (!name || typeof name !== "string" || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Client name is required",
      });
    }

    const clientData: CreateClientInput = {
      name: name.trim(),
      website:
        typeof website === "string" && website.trim()
          ? website.trim()
          : undefined,
      industry:
        typeof industry === "string" && industry.trim()
          ? industry.trim()
          : undefined,
      description:
        typeof description === "string" && description.trim()
          ? description.trim()
          : undefined,
    };

    const client = await createClient(
      agencyId,
      clientData
    );

    return res.status(201).json({
      success: true,
      message: "Client created successfully",
      client,
    });
  } catch (error) {
    console.error("Create client error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create client",
    });
  }
};

export const getClientsController = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const agencyId = req.user?.agencyId;

    if (!agencyId) {
      return res.status(400).json({
        success: false,
        message: "Agency information is missing",
      });
    }

    const status =
      typeof req.query.status === "string"
        ? req.query.status
        : undefined;

    const industry =
      typeof req.query.industry === "string"
        ? req.query.industry
        : undefined;

    const search =
      typeof req.query.search === "string"
        ? req.query.search
        : undefined;

    const clients = await getClients(
      agencyId,
      {
        status,
        industry,
        search,
      }
    );

    return res.status(200).json({
      success: true,
      clients,
    });
  } catch (error) {
    console.error("Get clients error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get clients",
    });
  }
};

export const getClientByIdController = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const agencyId = req.user?.agencyId;
    const clientId = req.params.clientId as string;

    if (!agencyId) {
      return res.status(400).json({
        success: false,
        message: "Agency information is missing",
      });
    }

    if (!clientId) {
      return res.status(400).json({
        success: false,
        message: "Client ID is required",
      });
    }

    const client = await getClientById(
      agencyId,
      clientId
    );

    if (!client) {
      return res.status(404).json({
        success: false,
        message: "Client not found",
      });
    }

    return res.status(200).json({
      success: true,
      client,
    });
  } catch (error) {
    console.error("Get client error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get client",
    });
  }
};

export const updateClientController = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const agencyId = req.user?.agencyId;
    const clientId = req.params.clientId as string;

    if (!agencyId) {
      return res.status(400).json({
        success: false,
        message: "Agency information is missing",
      });
    }

    if (!clientId) {
      return res.status(400).json({
        success: false,
        message: "Client ID is required",
      });
    }

    const {
      name,
      website,
      industry,
      description,
    } = req.body;

    const clientData: UpdateClientInput = {};

    if (name !== undefined) {
      if (
        typeof name !== "string" ||
        !name.trim()
      ) {
        return res.status(400).json({
          success: false,
          message: "Client name cannot be empty",
        });
      }

      clientData.name = name.trim();
    }

    if (website !== undefined) {
      clientData.website =
        typeof website === "string"
          ? website.trim() || null
          : null;
    }

    if (industry !== undefined) {
      clientData.industry =
        typeof industry === "string"
          ? industry.trim() || null
          : null;
    }

    if (description !== undefined) {
      clientData.description =
        typeof description === "string"
          ? description.trim() || null
          : null;
    }

    if (Object.keys(clientData).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No fields provided for update",
      });
    }

    const client = await updateClient(
      agencyId,
      clientId,
      clientData
    );

    if (!client) {
      return res.status(404).json({
        success: false,
        message: "Client not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Client updated successfully",
      client,
    });
  } catch (error) {
    console.error("Update client error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update client",
    });
  }
};

export const deactivateClientController = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const agencyId = req.user?.agencyId;
    const clientId = req.params.clientId as string;

    if (!agencyId) {
      return res.status(400).json({
        success: false,
        message: "Agency information is missing",
      });
    }

    if (!clientId) {
      return res.status(400).json({
        success: false,
        message: "Client ID is required",
      });
    }

    const client = await deactivateClient(
      agencyId,
      clientId
    );

    if (!client) {
      return res.status(404).json({
        success: false,
        message: "Active client not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Client deactivated successfully",
      client,
    });
  } catch (error) {
    console.error("Deactivate client error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to deactivate client",
    });
  }
};

export const deleteClientController = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const agencyId = req.user?.agencyId;
    const clientId = req.params.clientId as string;

    if (!agencyId) {
      return res.status(400).json({
        success: false,
        message: "Agency information is missing",
      });
    }

    if (!clientId) {
      return res.status(400).json({
        success: false,
        message: "Client ID is required",
      });
    }

    const deletedClient = await deleteClient(
      agencyId,
      clientId
    );

    if (!deletedClient) {
      return res.status(404).json({
        success: false,
        message: "Client not found in this agency",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Client deleted successfully",
      client: deletedClient,
    });
  } catch (error) {
    console.error("Delete client error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete client",
    });
  }
};