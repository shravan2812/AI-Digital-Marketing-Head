import { Router } from "express";

import { createClientController } from "../controllers/client.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/role.middleware.js";
import { ROLES } from "../constants/roles.js";

const router = Router();

router.post(
  "/",
  authenticate,
  requireRole(ROLES.ADMIN, ROLES.MANAGER),
  createClientController
);

export default router;