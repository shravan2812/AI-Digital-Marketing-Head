import * as cheerio from "cheerio";

export interface ParsedWebsite {
  title: string | null;
  metaDescription: string | null;

  h1: string | null;
  h1Count: number;
  h2Count: number;

  wordCount: number;

  imageCount: number;
  imagesWithoutAlt: number;

  linkCount: number;
}

export const parseWebsiteHtml = (
  html: string
): ParsedWebsite => {
  const $ = cheerio.load(html);

  const title = $("title").first().text().trim() || null;

  const metaDescription =
    $('meta[name="description"]')
      .attr("content")
      ?.trim() || null;

  const h1Elements = $("h1");

  const h1 =
    h1Elements.first().text().trim() || null;

  const h1Count = h1Elements.length;

  const h2Count = $("h2").length;

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

  images.each((_, element) => {
    const alt = $(element).attr("alt");

    if (
      alt === undefined ||
      alt.trim() === ""
    ) {
      imagesWithoutAlt++;
    }
  });

  const linkCount = $("a[href]").length;

  return {
    title,
    metaDescription,
    h1,
    h1Count,
    h2Count,
    wordCount,
    imageCount,
    imagesWithoutAlt,
    linkCount,
  };
};