export type AuditStatus =
  | "PENDING"
  | "RUNNING"
  | "COMPLETED"
  | "FAILED";

export interface WebsiteAudit {
  id: string;
  client_id: string;
  url: string;

  status: AuditStatus;

  performance_score: number | null;
  seo_score: number | null;
  accessibility_score: number | null;
  best_practices_score: number | null;

  pages_scanned: number;

  audit_data: Record<string, unknown> | null;

  error_message: string | null;

  started_at: string | null;
  completed_at: string | null;

  created_at: string;
  updated_at: string;
}

export interface CreateAuditInput {
  clientId: string;
  url: string;
}

export interface AuditResult {
  performanceScore: number;
  seoScore: number;
  accessibilityScore: number;
  bestPracticesScore: number;

  pagesScanned: number;

  auditData: Record<string, unknown>;
}