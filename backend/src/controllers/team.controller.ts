import type { Response } from "express";
import type { AuthenticatedRequest } from "../middleware/auth.middleware.js";
import {
  getTeamMembers,
  changeMemberRole,
  deactivateMember,
  removeMember,
} from "../services/team.service.js";
import { ROLES, type Role } from "../constants/roles.js";

export const getTeamMembersController = async (
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

    const members = await getTeamMembers(agencyId);

    return res.status(200).json({
      success: true,
      members,
    });
  } catch (error) {
    console.error("Get team members error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get team members",
    });
  }
};

export const changeMemberRoleController = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const agencyId = req.user?.agencyId;
    const userId = req.params.userId as string;
    const { role } = req.body;

    if (!agencyId) {
      return res.status(400).json({
        success: false,
        message: "Agency information is missing",
      });
    }

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    if (!role || !Object.values(ROLES).includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role",
      });
    }

    const updatedMember = await changeMemberRole(
      agencyId,
      userId,
      role as Role
    );

    if (!updatedMember) {
      return res.status(404).json({
        success: false,
        message: "Team member not found in this agency",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Member role updated successfully",
      member: updatedMember,
    });
  } catch (error) {
    console.error("Change member role error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to change member role",
    });
  }
};

export const deactivateMemberController = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const agencyId = req.user?.agencyId;
    const userId = req.params.userId as string;

    if (!agencyId) {
      return res.status(400).json({
        success: false,
        message: "Agency information is missing",
      });
    }

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const deactivatedMember = await deactivateMember(
      agencyId,
      userId
    );

    if (!deactivatedMember) {
      return res.status(404).json({
        success: false,
        message: "Active team member not found in this agency",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Team member deactivated successfully",
      member: deactivatedMember,
    });
  } catch (error) {
    console.error("Deactivate member error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to deactivate team member",
    });
  }
};

export const removeMemberController = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    console.log("DELETE member", req.params.userId);
    const agencyId = req.user?.agencyId;
    const userId = req.params.userId as string;

    console.log("REMOVE MEMBER DEBUG:", {
      agencyId,
      userId,
      userIdLength: userId?.length,
      userIdJSON: JSON.stringify(userId),
    });

    if (!agencyId) {
      return res.status(400).json({
        success: false,
        message: "Agency information is missing",
      });
    }

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const removedMember = await removeMember(
      agencyId,
      userId
    );

    if (!removedMember) {
      return res.status(404).json({
        success: false,
        message: "Team member not found in this agency",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Team member removed successfully",
      member: removedMember,
    });
  } catch (error) {
    console.error("Remove member error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to remove team member",
    });
  }
};