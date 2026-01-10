import { crawlSiteAsync } from "./crawl";
import { writeCSVReport } from "./report";

async function main() {
  const args = process.argv.slice(2);

  if (args.length < 1) {
    console.error("error: missing base URL");
    process.exit(1);
  } else if (args.length < 3) {
    console.error("error: missing maxConcurrency or maxPages");
    process.exit(1);
  } else if (args.length > 3) {
    console.error("error: too many arguments");
    process.exit(1);
  }

  const baseURL = args[0];
  const maxConcurrency = Number(args[1]);
  const maxPages = Number(args[2]);

  if (Number.isNaN(maxConcurrency) || Number.isNaN(maxPages)) {
    console.error("error: maxConcurrency and maxPages must be numbers");
    process.exit(1);
  }

  console.log(
    `starting at ${baseURL} with concurrency=${maxConcurrency} maxPages=${maxPages}`,
  );

  const pageData = await crawlSiteAsync(baseURL, maxConcurrency, maxPages);

  // write CSV instead of printing all page details
  writeCSVReport(pageData);

  console.log("Report written to report.csv");
}

main();