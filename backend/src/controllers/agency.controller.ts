import type { Response } from "express";
import type { AuthenticatedRequest } from "../middleware/auth.middleware.js";
import { getAgencyById,updateAgency } from "../services/agency.service.js";

export const getMyAgency = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const agencyId = req.user!.agencyId;

    const agency = await getAgencyById(agencyId);

    if (!agency) {
      return res.status(404).json({
        success: false,
        message: "Agency not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: agency,
    });
  } catch (error) {
    console.error("Get agency error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch agency",
    });
  }
};
// <--------------------------><--------------------------->
export const updateMyAgency = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const agencyId = req.user!.agencyId;

    const { name, website } = req.body;

    if (!name || typeof name !== "string") {
      return res.status(400).json({
        success: false,
        message: "Agency name is required",
      });
    }

    if (website !== undefined && website !== null && typeof website !== "string") {
      return res.status(400).json({
        success: false,
        message: "Website must be a string",
      });
    }

    const agency = await updateAgency(
      agencyId,
      name.trim(),
      website?.trim() || null
    );

    if (!agency) {
      return res.status(404).json({
        success: false,
        message: "Agency not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Agency updated successfully",
      data: agency,
    });
  } catch (error) {
    console.error("Update agency error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update agency",
    });
  }
};