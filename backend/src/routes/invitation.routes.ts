import { Router } from "express";

import {
  createInvitationController,
} from "../controllers/invitation.controller.js";

import {
  authenticate,
} from "../middleware/auth.middleware.js";

import {
  requireRole,
} from "../middleware/role.middleware.js";

import {
  ROLES,
} from "../constants/roles.js";

const router = Router();

router.post(
  "/",
  authenticate,
  requireRole(ROLES.ADMIN),
  createInvitationController
);

export default router;