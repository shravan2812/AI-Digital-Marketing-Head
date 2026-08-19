import type { Request,Response } from "express";
import type { AuthenticatedRequest } from "../middleware/auth.middleware.js";
import { ROLES } from "../constants/roles.js";
import { INVITABLE_ROLES } from "../constants/invitation.js";
import {
    createInvitation,
    isAgencyMemberByEmail,
    hasPendingInvitation,
    acceptInvitation
} from "../services/invitation.service.js";

interface AcceptInvitationBody {
  token: string;
  name: string;
  password: string;
}

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

export const acceptInvitationController = async (
  req: Request<{}, {}, AcceptInvitationBody>,
  res: Response
) => {
  try {
    const {
      token,
      name,
      password,
    } = req.body;

    if (!token || typeof token !== "string") {
      return res.status(400).json({
        success: false,
        message: "Invitation token is required",
      });
    }

    if (!name || typeof name !== "string") {
      return res.status(400).json({
        success: false,
        message: "Name is required",
      });
    }

    if (!password || typeof password !== "string") {
      return res.status(400).json({
        success: false,
        message: "Password is required",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters",
      });
    }

    const result = await acceptInvitation(
      token.trim(),
      name,
      password
    );

    return res.status(201).json({
      success: true,
      message: "Invitation accepted successfully",
      data: result,
    });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "INVITATION_NOT_FOUND") {
        return res.status(404).json({
          success: false,
          message: "Invitation not found",
        });
      }

      if (
        error.message ===
        "INVITATION_ALREADY_ACCEPTED"
      ) {
        return res.status(409).json({
          success: false,
          message: "Invitation has already been accepted",
        });
      }

      if (error.message === "INVITATION_EXPIRED") {
        return res.status(410).json({
          success: false,
          message: "Invitation has expired",
        });
      }

      if (error.message === "USER_ALREADY_EXISTS") {
        return res.status(409).json({
          success: false,
          message: "A user with this email already exists",
        });
      }
    }

    console.error(
      "Accept invitation error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to accept invitation",
    });
  }
};



