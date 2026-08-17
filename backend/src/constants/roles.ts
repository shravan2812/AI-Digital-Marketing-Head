export const ROLES = {
  ADMIN: "ADMIN",
  MANAGER: "MANAGER",
  TEAM_MEMBER: "TEAM_MEMBER",
} as const;

export type Role = typeof ROLES[keyof typeof ROLES];