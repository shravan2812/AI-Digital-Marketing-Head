import { Router } from "express";

import { authenticate } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/role.middleware.js";
import { ROLES } from "../constants/roles.js";

import {
  createAuditController,
} from "../controllers/audit.controller.js";

const router = Router();

router.post(
  "/",
  authenticate,
  requireRole(ROLES.ADMIN, ROLES.MANAGER),
  createAuditController
);

export default router;