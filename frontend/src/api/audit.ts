import { apiRequest } from "./api";

export interface CreateAuditResponse {
    success: boolean;
    message: string;
    audit: {
        id: string;
        url: string;
        status: string;
        created_at: string;
    };
}

export const createAudit = async (
  clientId: string,
  url: string
): Promise<CreateAuditResponse> => {
  return apiRequest("/audits", {
    method: "POST",
    body: JSON.stringify({
      clientId,
      url,
    }),
  });
};
export interface Audit {
    id: string;
    url: string;
    status: string;
    audit_data: {
        parsed: {
            title: string | null;
            metaDescription: string | null;

            h1: string | null;
            h1Count: number;
            h1Texts: string[];

            h2Count: number;
            h2Texts: string[];

            wordCount: number;

            imageCount: number;
            imagesWithoutAlt: number;
            imagesWithAlt: number;
            emptyAltCount: number;

            linkCount: number;
            internalLinkCount: number;
            externalLinkCount: number;
            linksWithoutHref: number;

            hasCanonical: boolean;
            canonicalUrl: string | null;

            hasRobotsMeta: boolean;
            robotsContent: string | null;

            hasViewport: boolean;
            viewportContent: string | null;

            htmlLang: string | null;

            htmlSizeBytes: number;
            scriptCount: number;
            stylesheetCount: number;
            styleTagCount: number;
            lazyLoadedImageCount: number;
        };

        seo: {
            score: number;
            checks: {
                key: string;
                title: string;
                passed: boolean;
                message: string;
            }[];
        };
    } | null;

    error_message: string | null;
    created_at: string;
    completed_at: string | null;
}

export interface GetAuditResponse {
    success: boolean;
    audit: Audit;
}

export const getAudit = async (
    auditId: string
): Promise<GetAuditResponse> => {
    return apiRequest(`/audits/${auditId}`);
};