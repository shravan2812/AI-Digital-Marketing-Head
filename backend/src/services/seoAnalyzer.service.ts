import type { ParsedWebsite } from "./htmlParser.service.js";

export interface SeoCheck {
    key: string;
    title: string;
    passed: boolean;
    message: string;
}

export interface SeoAnalysis {
    score: number;
    checks: SeoCheck[];
}

export const analyzeSeo = (
    website: ParsedWebsite,
    url: string
): SeoAnalysis => {
    const checks: SeoCheck[] = [];
    const isHttps =
        url.startsWith("https://");

    // Title
    if (!website.title) {
        checks.push({
            key: "title_exists",
            title: "Page title exists",
            passed: false,
            message: "The page does not have a title tag.",
        });
    } else {
        checks.push({
            key: "title_exists",
            title: "Page title exists",
            passed: true,
            message: "The page has a title tag.",
        });
    }

    // Title length
    if (!website.title) {
        checks.push({
            key: "title_length",
            title: "Title length",
            passed: false,
            message: "A title is required before its length can be evaluated.",
        });
    } else if (
        website.title.length >= 30 &&
        website.title.length <= 60
    ) {
        checks.push({
            key: "title_length",
            title: "Title length",
            passed: true,
            message: `Title length is ${website.title.length} characters.`,
        });
    } else {
        checks.push({
            key: "title_length",
            title: "Title length",
            passed: false,
            message: `Title length is ${website.title.length} characters. Aim for roughly 30–60 characters.`,
        });
    }

    // Meta description
    if (!website.metaDescription) {
        checks.push({
            key: "meta_description_exists",
            title: "Meta description exists",
            passed: false,
            message: "The page does not have a meta description.",
        });
    } else {
        checks.push({
            key: "meta_description_exists",
            title: "Meta description exists",
            passed: true,
            message: "The page has a meta description.",
        });
    }

    // Meta description length
    if (!website.metaDescription) {
        checks.push({
            key: "meta_description_length",
            title: "Meta description length",
            passed: false,
            message:
                "A meta description is required before its length can be evaluated.",
        });
    } else if (
        website.metaDescription.length >= 70 &&
        website.metaDescription.length <= 160
    ) {
        checks.push({
            key: "meta_description_length",
            title: "Meta description length",
            passed: true,
            message: `Meta description length is ${website.metaDescription.length} characters.`,
        });
    } else {
        checks.push({
            key: "meta_description_length",
            title: "Meta description length",
            passed: false,
            message: `Meta description length is ${website.metaDescription.length} characters. Aim for roughly 70–160 characters.`,
        });
    }

    // H1
    // H1 content
    if (website.h1Count === 1) {
        if (website.h1Texts[0]?.trim()) {
            checks.push({
                key: "h1_content",
                title: "H1 contains text",
                passed: true,
                message: "The H1 contains meaningful text.",
            });
        } else {
            checks.push({
                key: "h1_content",
                title: "H1 contains text",
                passed: false,
                message: "The H1 element is empty.",
            });
        }
    }

    // H2 structure
    if (website.h2Count > 0) {
        checks.push({
            key: "h2_exists",
            title: "Uses H2 headings",
            passed: true,
            message: `The page contains ${website.h2Count} H2 heading${website.h2Count !== 1 ? "s" : ""
                }.`,
        });
    } else {
        checks.push({
            key: "h2_exists",
            title: "Uses H2 headings",
            passed: false,
            message: "The page does not contain any H2 headings.",
        });
    }
    // Images
    // Image accessibility
    if (website.imageCount === 0) {
        checks.push({
            key: "image_alt",
            title: "Image alt text",
            passed: true,
            message: "No images were found on the page.",
        });
    } else if (website.imagesWithoutAlt === 0) {
        checks.push({
            key: "image_alt",
            title: "Image alt text",
            passed: true,
            message:
                "All images have an alt attribute.",
        });
    } else {
        checks.push({
            key: "image_alt",
            title: "Image alt text",
            passed: false,
            message:
                `${website.imagesWithoutAlt} of ${website.imageCount} images do not have an alt attribute.`,
        });
    }
    // Image alt coverage
    if (website.imageCount > 0) {
        const altCoverage = Math.round(
            (website.imagesWithAlt /
                website.imageCount) *
            100
        );

        checks.push({
            key: "image_alt_coverage",
            title: "Image alt text coverage",
            passed: altCoverage >= 80,
            message:
                `${altCoverage}% of images have non-empty alt text.`,
        });
    }
    // Link analysis
    if (website.linkCount === 0) {
        checks.push({
            key: "links_exist",
            title: "Links exist",
            passed: false,
            message:
                "No links with href attributes were found on the page.",
        });
    } else {
        checks.push({
            key: "links_exist",
            title: "Links exist",
            passed: true,
            message:
                `${website.linkCount} links with href attributes were found.`,
        });
    }

    // Internal links
    if (website.internalLinkCount > 0) {
        checks.push({
            key: "internal_links",
            title: "Internal links",
            passed: true,
            message:
                `${website.internalLinkCount} internal link${website.internalLinkCount !== 1
                    ? "s"
                    : ""
                } were found.`,
        });
    } else {
        checks.push({
            key: "internal_links",
            title: "Internal links",
            passed: false,
            message:
                "No internal links were found on the page.",
        });
    }
    if (isHttps) {
        checks.push({
            key: "https",
            title: "HTTPS enabled",
            passed: true,
            message:
                "The website is using HTTPS.",
        });
    } else {
        checks.push({
            key: "https",
            title: "HTTPS enabled",
            passed: false,
            message:
                "The website is not using HTTPS.",
        });
    }
    if (website.hasCanonical) {
        checks.push({
            key: "canonical",
            title: "Canonical URL",
            passed: true,
            message:
                "The page contains a canonical URL.",
        });
    } else {
        checks.push({
            key: "canonical",
            title: "Canonical URL",
            passed: false,
            message:
                "The page does not contain a canonical URL.",
        });
    }
    if (website.hasViewport) {
        checks.push({
            key: "viewport",
            title: "Viewport meta tag",
            passed: true,
            message:
                "The page contains a viewport meta tag.",
        });
    } else {
        checks.push({
            key: "viewport",
            title: "Viewport meta tag",
            passed: false,
            message:
                "The page does not contain a viewport meta tag.",
        });
    }
    if (website.htmlLang) {
        checks.push({
            key: "html_lang",
            title: "HTML language attribute",
            passed: true,
            message:
                `The page declares language "${website.htmlLang}".`,
        });
    } else {
        checks.push({
            key: "html_lang",
            title: "HTML language attribute",
            passed: false,
            message:
                "The HTML element does not declare a language.",
        });
    }
    if (website.hasRobotsMeta) {
        checks.push({
            key: "robots_meta",
            title: "Robots meta tag",
            passed: true,
            message:
                `Robots meta tag found: ${website.robotsContent}`,
        });
    } else {
        checks.push({
            key: "robots_meta",
            title: "Robots meta tag",
            passed: true,
            message:
                "No robots meta tag was found.",
        });
    }
    // Performance checks

    const htmlSizeKb =
        website.htmlSizeBytes / 1024;

    if (htmlSizeKb <= 500) {
        checks.push({
            key: "html_size",
            title: "HTML document size",
            passed: true,
            message:
                `HTML document size is ${htmlSizeKb.toFixed(
                    1
                )} KB.`,
        });
    } else {
        checks.push({
            key: "html_size",
            title: "HTML document size",
            passed: false,
            message:
                `HTML document size is ${htmlSizeKb.toFixed(
                    1
                )} KB, which is relatively large.`,
        });
    }

    if (website.scriptCount <= 10) {
        checks.push({
            key: "script_count",
            title: "JavaScript usage",
            passed: true,
            message:
                `${website.scriptCount} script elements were found.`,
        });
    } else {
        checks.push({
            key: "script_count",
            title: "JavaScript usage",
            passed: false,
            message:
                `${website.scriptCount} script elements were found.`,
        });
    }
    if (website.imageCount === 0) {
        checks.push({
            key: "lazy_images",
            title: "Lazy-loaded images",
            passed: true,
            message:
                "No images were found on the page.",
        });
    } else {
        const lazyPercentage =
            Math.round(
                (website.lazyLoadedImageCount /
                    website.imageCount) *
                100
            );

        checks.push({
            key: "lazy_images",
            title: "Lazy-loaded images",
            passed: lazyPercentage >= 50,
            message:
                `${lazyPercentage}% of images use lazy loading.`,
        });
    }
    // Calculate score
    const passedChecks = checks.filter(
        (check) => check.passed
    ).length;

    const score =
        checks.length === 0
            ? 0
            : Math.round(
                (passedChecks / checks.length) * 100
            );

    return {
        checks,
        score,
    };
};