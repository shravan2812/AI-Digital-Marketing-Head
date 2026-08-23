const API_BASE_URL = "http://localhost:5000/api";

export const apiRequest = async (
  endpoint: string,
  options: RequestInit = {}
) => {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_BASE_URL}${endpoint}`,
    {
      ...options,
      headers: {
        "Content-Type": "application/json",

        ...(token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : {}),

        ...options.headers,
      },
    }
  );

  const result = await response.json();

  // Unauthorized
  if (response.status === 401) {
    localStorage.removeItem("token");

    window.location.href = "/login";

    throw new Error(
      result.message || "Unauthorized"
    );
  }

  // Other API errors
  if (!response.ok) {
    throw new Error(
      result.message || "API request failed"
    );
  }

  return result;
};