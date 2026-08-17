import { Router } from "express";
import { ROLES } from "../constants/roles.js";
import { requireRole } from "../middleware/role.middleware.js";

import {
  authenticate,
  type AuthenticatedRequest,
} from "../middleware/auth.middleware.js";

const router = Router();

router.get(
  "/",
  authenticate,
  (req: AuthenticatedRequest, res) => {
    res.json({
      success: true,
      user: req.user,
    });
  }
);

router.get(
  "/admin",
  authenticate,
  requireRole(ROLES.ADMIN),
  (req: AuthenticatedRequest, res) => {
    res.json({
      success: true,
      message: "You are an ADMIN",
      user: req.user,
    });
  }
);

export default router;