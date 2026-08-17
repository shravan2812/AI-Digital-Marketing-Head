import type { Response } from "express";

import type { AuthenticatedRequest } from "../middleware/auth.middleware.js";

import { ROLES } from "../constants/roles.js";
import { INVITABLE_ROLES } from "../constants/invitation.js";

import {
    createInvitation,
    isAgencyMemberByEmail,
    hasPendingInvitation,
} from "../services/invitation.service.js";



export const createInvitationController = async (
    req: AuthenticatedRequest,
    res: Response
) => {
    try {
        const agencyId = req.user!.agencyId;

        const {
            email,
            role,
        } = req.body;

        if (!email || typeof email !== "string") {
            return res.status(400).json({
                success: false,
                message: "Email is required",
            });
        }

        if (!email.includes("@")) {
            return res.status(400).json({
                success: false,
                message: "Please provide a valid email",
            });
        }

        if (!INVITABLE_ROLES.includes(role)) {
            return res.status(400).json({
                success: false,
                message: "Invalid invitation role",
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        const alreadyMember = await isAgencyMemberByEmail(
            agencyId,
            normalizedEmail
        );

        if (alreadyMember) {
            return res.status(409).json({
                success: false,
                message: "This user is already a member of your agency",
            });
        }

        const invitationExists = await hasPendingInvitation(
            agencyId,
            normalizedEmail
        );

        if (invitationExists) {
            return res.status(409).json({
                success: false,
                message: "A pending invitation already exists for this email",
            });
        }

        const result = await createInvitation(
            agencyId,
            normalizedEmail,
            role
        );

        return res.status(201).json({
            success: true,
            message: "Invitation created successfully",
            data: result,
        });
        } catch (error) {
        console.error(
            "Create invitation error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to create invitation",
        });
    }
};

