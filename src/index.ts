import { crawlPage } from "./crawl"

async function main() {
  const args = process.argv.slice(2)
  if (args.length < 1) {
    console.error("error: missing base URL")
    process.exit(1)
  } else if (args.length > 1) {
    console.error("error: too many base URLs")
    process.exit(1)
  } else {
    const baseURL = args[0]
    console.log(`starting at ${baseURL}`)

    const pages = await crawlPage(baseURL)
    console.log(pages)
  }
}

main()