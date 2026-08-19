import { Router } from "express";
import {
  getTeamMembersController,
  changeMemberRoleController,
  deactivateMemberController,
  removeMemberController,
} from "../controllers/team.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/role.middleware.js";
import { ROLES } from "../constants/roles.js";


const router = Router();

router.get(
  "/members",
  authenticate,
  getTeamMembersController
);

router.put(
  "/members/:userId/role",
  authenticate,
  requireRole(ROLES.ADMIN),
  changeMemberRoleController
);

router.put(
  "/members/:userId/deactivate",
  authenticate,
  requireRole(ROLES.ADMIN),
  deactivateMemberController
);

router.delete(
  "/members/:userId",
  authenticate,
  requireRole(ROLES.ADMIN),
  removeMemberController
);

export default router;