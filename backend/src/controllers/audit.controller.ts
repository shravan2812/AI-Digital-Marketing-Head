import type { Response } from "express";
import type { AuthenticatedRequest } from "../middleware/auth.middleware.js";
import {
    createAudit,
} from "../services/audit.service.js";
import type { CreateAuditInput } from "../types/audit.types.js";
import {
    validateAuditUrl,
} from "../validators/audit.validator.js";

export const createAuditController = async (
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

        const { clientId, url } = req.body;

        if (
            !clientId ||
            typeof clientId !== "string"
        ) {
            return res.status(400).json({
                success: false,
                message: "Client ID is required",
            });
        }

        const urlError = validateAuditUrl(url);

        if (urlError) {
            return res.status(400).json({
                success: false,
                message: urlError,
            });
        }

        const auditInput: CreateAuditInput = {
            clientId: clientId.trim(),
            url: url.trim(),
        };

        const audit = await createAudit(
            agencyId,
            auditInput
        );

        return res.status(201).json({
            success: true,
            message: "Website audit created successfully",
            audit,
        });
    } catch (error) {
        console.error("Create audit error:", error);

        if (
            error instanceof Error &&
            error.message === "Client not found"
        ) {
            return res.status(404).json({
                success: false,
                message: "Client not found",
            });
        }

        return res.status(500).json({
            success: false,
            message: "Failed to create website audit",
        });
    }
};