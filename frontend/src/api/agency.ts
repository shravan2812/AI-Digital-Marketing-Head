import { apiRequest } from "./api";

export const getMyAgency = async () => {
  return apiRequest("/agency");
};