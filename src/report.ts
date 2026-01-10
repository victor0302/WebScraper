import * as fs from "node:fs";
import * as path from "node:path";
import type { ExtractedPageData } from "./crawl";

function csvEscape(field: string) {
  const str = field ?? "";
  const needsQuoting = /[",\n]/.test(str);
  const escaped = str.replace(/"/g, '""');
  return needsQuoting ? `"${escaped}"` : escaped;
}

export function writeCSVReport(
  pageData: Record<string, ExtractedPageData>,
  filename = "report.csv",
): void {
  const filePath = path.resolve(process.cwd(), filename);

  const headers = [
    "page_url",
    "h1",
    "first_paragraph",
    "outgoing_link_urls",
    "image_urls",
  ];

  const rows: string[] = [headers.join(",")];

  for (const page of Object.values(pageData)) {
    const pageUrl = page.url;
    const h1 = page.h1;
    const firstParagraph = page.first_paragraph;
    const outgoingLinks = page.outgoing_links.join(";");
    const imageUrls = page.image_urls.join(";");

    const row = [
      csvEscape(pageUrl),
      csvEscape(h1),
      csvEscape(firstParagraph),
      csvEscape(outgoingLinks),
      csvEscape(imageUrls),
    ].join(",");

    rows.push(row);
  }

  const csvContent = rows.join("\n");
  fs.writeFileSync(filePath, csvContent, "utf-8");
}