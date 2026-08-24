import type { ParsedWebsite } from "./htmlParser.service.js";

export interface SeoCheck {
  key: string;
  title: string;
  passed: boolean;
  message: string;
}

export interface SeoAnalysis {
  checks: SeoCheck[];
  score: number;
}

export const analyzeSeo = (
  website: ParsedWebsite
): SeoAnalysis => {
  const checks: SeoCheck[] = [];

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
  if (website.h1Count === 1) {
    checks.push({
      key: "single_h1",
      title: "Single H1",
      passed: true,
      message: "The page contains exactly one H1 heading.",
    });
  } else if (website.h1Count === 0) {
    checks.push({
      key: "single_h1",
      title: "Single H1",
      passed: false,
      message: "The page does not contain an H1 heading.",
    });
  } else {
    checks.push({
      key: "single_h1",
      title: "Single H1",
      passed: false,
      message: `The page contains ${website.h1Count} H1 headings.`,
    });
  }

  // Images
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
      message: "All images have alt text.",
    });
  } else {
    checks.push({
      key: "image_alt",
      title: "Image alt text",
      passed: false,
      message: `${website.imagesWithoutAlt} of ${website.imageCount} images are missing alt text.`,
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