import { Router } from "express";

import { getMyAgency,updateMyAgency } from "../controllers/agency.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/role.middleware.js";
import { ROLES } from "../constants/roles.js";

const router = Router();

router.get(
  "/",
  authenticate,
  getMyAgency
);

router.put(
  "/",
  authenticate,
  requireRole(ROLES.ADMIN),
  updateMyAgency
);

export default router;