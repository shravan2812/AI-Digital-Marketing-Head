import { Router } from "express";

import { createClientController,
    getClientsController,
    getClientByIdController,
    updateClientController,
    deactivateClientController,
    deleteClientController } 
from "../controllers/client.controller.js";
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

router.get(
  "/",
  authenticate,
  getClientsController
);

router.get(
  "/:clientId",
  authenticate,
  getClientByIdController
);

router.put(
  "/:clientId",
  authenticate,
  requireRole(ROLES.ADMIN, ROLES.MANAGER),
  updateClientController
);

router.put(
  "/:clientId/deactivate",
  authenticate,
  requireRole(ROLES.ADMIN, ROLES.MANAGER),
  deactivateClientController
);

router.delete(
  "/:clientId",
  authenticate,
  requireRole(ROLES.ADMIN),
  deleteClientController
);

export default router;