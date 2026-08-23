import { apiRequest } from "./api";

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
}

export const getTeamMembers = async () => {
  return apiRequest("/team/members");
};