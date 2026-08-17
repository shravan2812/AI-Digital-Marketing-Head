export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  agencyName: string;
}

export const validateRegisterInput = (
  data: RegisterInput
): string | null => {
  if (!data.name || data.name.trim().length < 2) {
    return "Name must be at least 2 characters long";
  }

  if (!data.email || !data.email.includes("@")) {
    return "Please provide a valid email";
  }

  if (!data.password || data.password.length < 8) {
    return "Password must be at least 8 characters long";
  }

  if (!data.agencyName || data.agencyName.trim().length < 2) {
    return "Agency name must be at least 2 characters long";
  }

  return null;
};