import type { Response } from "express";
import type { AuthenticatedRequest } from "../middleware/auth.middleware.js";
import {
  createClient,
  type CreateClientInput,
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