import * as cheerio from "cheerio";

export interface ParsedWebsite {
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
}

export const parseWebsiteHtml = (
    html: string,
    baseUrl: string
): ParsedWebsite => {
    const $ = cheerio.load(html);
    const base = new URL(baseUrl);
    const baseHostname = base.hostname;

    const title = $("title").first().text().trim() || null;

    const metaDescription =
        $('meta[name="description"]')
            .attr("content")
            ?.trim() || null;

    const h1Elements = $("h1");

    const h1Texts: string[] = [];

    const htmlSizeBytes = Buffer.byteLength(
        html,
        "utf8"
    );

    const scriptCount = $("script").length;
    const stylesheetCount =
        $('link[rel="stylesheet"]').length;
    const styleTagCount =
        $("style").length;


    h1Elements.each((_, element) => {
        const text = $(element).text().trim();

        if (text) {
            h1Texts.push(text);
        }
    });

    const h1 = h1Texts[0] || null;

    const h1Count = h1Elements.length;

    const h2Elements = $("h2");

    const h2Texts: string[] = [];

    h2Elements.each((_, element) => {
        const text = $(element).text().trim();

        if (text) {
            h2Texts.push(text);
        }
    });

    const h2Count = h2Elements.length;

    const bodyText = $("body")
        .text()
        .replace(/\s+/g, " ")
        .trim();

    const wordCount = bodyText
        ? bodyText.split(/\s+/).length
        : 0;

    const images = $("img");

    const imageCount = images.length;

    let imagesWithoutAlt = 0;
    let imagesWithAlt = 0;
    let emptyAltCount = 0;

    images.each((_, element) => {
        const alt = $(element).attr("alt");

        // No alt attribute at all
        if (alt === undefined) {
            imagesWithoutAlt++;
            return;
        }

        // alt="" is intentionally empty
        if (alt.trim() === "") {
            emptyAltCount++;
            return;
        }

        // Image has non-empty alt text
        imagesWithAlt++;
    });

    const links = $("a");

    let linkCount = 0;
    let internalLinkCount = 0;
    let externalLinkCount = 0;
    let linksWithoutHref = 0;

    links.each((_, element) => {
        const href = $(element).attr("href");

        if (!href) {
            linksWithoutHref++;
            return;
        }

        linkCount++;

        try {
            const linkUrl = new URL(
                href,
                baseUrl
            );

            if (
                linkUrl.hostname === baseHostname
            ) {
                internalLinkCount++;
            } else {
                externalLinkCount++;
            }
        } catch {
            // Ignore invalid URLs for now.
        }
    });

    const canonicalUrl =
        $('link[rel="canonical"]')
            .attr("href")
            ?.trim() || null;

    const hasCanonical = Boolean(
        canonicalUrl
    );

    const robotsContent =
        $('meta[name="robots"]')
            .attr("content")
            ?.trim() || null;

    const hasRobotsMeta = Boolean(
        robotsContent
    );

    const viewportContent =
        $('meta[name="viewport"]')
            .attr("content")
            ?.trim() || null;

    const hasViewport = Boolean(
        viewportContent
    );

    const htmlLang =
        $("html")
            .attr("lang")
            ?.trim() || null;

    let lazyLoadedImageCount = 0;

    images.each((_, element) => {
        const loading = $(element)
            .attr("loading")
            ?.trim()
            .toLowerCase();

        if (loading === "lazy") {
            lazyLoadedImageCount++;
        }
    });
    return {
        title,
        metaDescription,

        h1,
        h1Count,
        h1Texts,

        h2Count,
        h2Texts,

        wordCount,

        imageCount,
        imagesWithoutAlt,
        imagesWithAlt,
        emptyAltCount,

        linkCount,
        internalLinkCount,
        externalLinkCount,
        linksWithoutHref,

        hasCanonical,
        canonicalUrl,

        hasRobotsMeta,
        robotsContent,

        hasViewport,
        viewportContent,

        htmlLang,

        htmlSizeBytes,
        scriptCount,
        stylesheetCount,
        styleTagCount,
        lazyLoadedImageCount,
    };
};