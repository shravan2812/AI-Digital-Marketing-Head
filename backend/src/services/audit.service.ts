import pool from "../db/connection.js";

import type {
    WebsiteAudit,
    CreateAuditInput,
} from "../types/audit.types.js";

import {
    fetchWebsite,
} from "./websiteFetcher.service.js";

import {
    parseWebsiteHtml,
} from "./htmlParser.service.js";

import {
    analyzeSeo,
} from "./seoAnalyzer.service.js";

export const createAudit = async (
    agencyId: string,
    input: CreateAuditInput
): Promise<WebsiteAudit> => {
    const { clientId, url } = input;

    // Verify that the client belongs to this agency.
    const clientResult = await pool.query(
        `
      SELECT id
      FROM clients
      WHERE id = $1
        AND agency_id = $2
        AND status = 'ACTIVE'
      LIMIT 1
    `,
        [clientId, agencyId]
    );

    if (clientResult.rows.length === 0) {
        throw new Error("Client not found");
    }

    // Create the audit.
    const auditResult = await pool.query(
        `
      INSERT INTO website_audits (
        client_id,
        url,
        status
      )
      VALUES ($1, $2, 'PENDING')
      RETURNING
        id,
        client_id,
        url,
        status,
        performance_score,
        seo_score,
        accessibility_score,
        best_practices_score,
        pages_scanned,
        audit_data,
        error_message,
        started_at,
        completed_at,
        created_at,
        updated_at
    `,
        [clientId, url]
    );

    const audit = auditResult.rows[0] as WebsiteAudit;

    // Start the audit.
    await runAudit(audit.id);

    // Return the latest version of the audit.
    const updatedAuditResult = await pool.query(
        `
      SELECT
        id,
        client_id,
        url,
        status,
        performance_score,
        seo_score,
        accessibility_score,
        best_practices_score,
        pages_scanned,
        audit_data,
        error_message,
        started_at,
        completed_at,
        created_at,
        updated_at
      FROM website_audits
      WHERE id = $1
    `,
        [audit.id]
    );

    return updatedAuditResult.rows[0] as WebsiteAudit;
};

export const runAudit = async (
    auditId: string
): Promise<void> => {
    // Mark audit as RUNNING.
    await pool.query(
        `
      UPDATE website_audits
      SET
        status = 'RUNNING',
        started_at = NOW(),
        updated_at = NOW()
      WHERE id = $1
    `,
        [auditId]
    );

    try {
        // Get the audit URL.
        const auditResult = await pool.query(
            `
        SELECT url
        FROM website_audits
        WHERE id = $1
      `,
            [auditId]
        );

        if (auditResult.rows.length === 0) {
            throw new Error("Audit not found");
        }

        const url = auditResult.rows[0].url as string;

        // Fetch the website.
        const website = await fetchWebsite(url);



        console.log(
            `Fetched ${url} - ${website.statusCode} - ${website.responseTimeMs}ms`
        );

        const parsedWebsite = parseWebsiteHtml(
            website.html,
            url
        );

        const seoAnalysis = analyzeSeo(
            parsedWebsite,
            url
        );

        // For now, we are only storing basic fetch information.
        await pool.query(
            `
        UPDATE website_audits
        SET
          status = 'COMPLETED',
          pages_scanned = 1,
          audit_data = $1,
          completed_at = NOW(),
          updated_at = NOW()
        WHERE id = $2
      `,
            [
                JSON.stringify({
                    statusCode: website.statusCode,
                    responseTimeMs: website.responseTimeMs,
                    htmlLength: website.html.length,

                    parsed: parsedWebsite,

                    seo: seoAnalysis,
                }),
                auditId,
            ]
        );
    } catch (error) {
        console.error(
            `Audit ${auditId} failed:`,
            error
        );

        const errorMessage =
            error instanceof Error
                ? error.message
                : "Unknown audit error";

        await pool.query(
            `
        UPDATE website_audits
        SET
          status = 'FAILED',
          error_message = $1,
          completed_at = NOW(),
          updated_at = NOW()
        WHERE id = $2
      `,
            [errorMessage, auditId]
        );
    }
};

export const getAuditById = async (
    auditId: string,
    agencyId: string
): Promise<WebsiteAudit | null> => {
    const result = await pool.query(
        `
        SELECT
            wa.id,
            wa.client_id,
            wa.url,
            wa.status,
            wa.performance_score,
            wa.seo_score,
            wa.accessibility_score,
            wa.best_practices_score,
            wa.pages_scanned,
            wa.audit_data,
            wa.error_message,
            wa.started_at,
            wa.completed_at,
            wa.created_at,
            wa.updated_at
        FROM website_audits wa
        INNER JOIN clients c
            ON c.id = wa.client_id
        WHERE wa.id = $1
          AND c.agency_id = $2
        LIMIT 1
        `,
        [auditId, agencyId]
    );

    if (result.rows.length === 0) {
        return null;
    }

    return result.rows[0] as WebsiteAudit;
};