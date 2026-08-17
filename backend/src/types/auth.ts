import type { Role } from "../constants/roles.js";

export interface AuthUser {
  userId: string;
  agencyId: string;
  role: Role;
}