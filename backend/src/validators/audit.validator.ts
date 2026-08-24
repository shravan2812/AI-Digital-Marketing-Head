export const validateAuditUrl = (
  value: unknown
): string | null => {
  if (typeof value !== "string" || !value.trim()) {
    return "Website URL is required";
  }

  const url = value.trim();

  try {
    const parsedUrl = new URL(url);

    if (
      parsedUrl.protocol !== "http:" &&
      parsedUrl.protocol !== "https:"
    ) {
      return "Website URL must use HTTP or HTTPS";
    }

    if (!parsedUrl.hostname) {
      return "Website URL must contain a valid hostname";
    }

    return null;
  } catch {
    return "Invalid website URL";
  }
};