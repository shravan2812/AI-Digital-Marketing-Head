import axios from "axios";

export interface WebsiteFetchResult {
  html: string;
  statusCode: number;
  responseTimeMs: number;
}

export const fetchWebsite = async (
  url: string
): Promise<WebsiteFetchResult> => {
  const startTime = Date.now();

  const response = await axios.get<string>(url, {
    timeout: 15000,

    headers: {
      "User-Agent":
        "Mozilla/5.0 (compatible; AgencyWebsiteAuditor/1.0)",
    },

    validateStatus: () => true,
  });

  const responseTimeMs = Date.now() - startTime;

  return {
    html: response.data,
    statusCode: response.status,
    responseTimeMs,
  };
};