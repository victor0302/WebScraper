import {JSDOM} from 'jsdom';
import pLimit from 'p-limit';

export interface ExtractedPageData{
    url: string;
    h1: string;
    first_paragraph: string;
    outgoing_links: string[];
    image_urls: string[]
}

export function normalizeURL (url:string): string{
    const urlObj = new URL(url);
    const hostPath = urlObj.hostname;
    const routePath = urlObj.pathname;
    const fullPath = hostPath + routePath;
    if (fullPath.endsWith("/")){
        const newFullPath = fullPath.slice(0,-1);
        return newFullPath;
    }
    
    return fullPath;
}



export function getH1FromHTML(html: string):string{
    const dom = new JSDOM (html);
    const h1 = dom.window.document.querySelector("h1");
    if(h1 === null){
        return '';
    }
    return h1.textContent
}

export function getFirstParagraphFromHTML(html: string):string{
    const dom = new JSDOM (html);
    const element = dom.window.document.querySelector("main p");
    if(element === null){
        const paragraph = dom.window.document.querySelector("p");
        if(paragraph === null){
            return ""
        }
        return paragraph.textContent
    }
    return element.textContent

}

export function getURLsFromHTML (html: string, baseURL:string): string[]{
    const dom = new JSDOM (html)
    const anchorElements = dom.window.document.querySelectorAll("a")
    const urls: string [] = [];
    for (const anchorElement of anchorElements){
        if ( anchorElement.hasAttribute('href')){
             const href =anchorElement.getAttribute('href') as string
             try{
                const urlObj = new URL(href,baseURL)
                if(urlObj.href.endsWith('/')){
                    urls.push(urlObj.href.slice(0,-1))
                }
                else{
                    urls.push(urlObj.href)
                }
             }
             catch (err){
                console.log(`Bad URL found: ${(err as Error).message}`);
             }
        }

    }
    return urls;
}

export function getImagesFromHTML(html: string, baseURL: string): string[] {
    const dom = new JSDOM(html);
    const imageElements = dom.window.document.querySelectorAll("img");
    const urls: string[] = [];
    
    for (const imageElement of imageElements) {
        if (imageElement.hasAttribute('src')) {
            const src = imageElement.getAttribute('src') as string;
            try {
                const urlObj = new URL(src, baseURL);
                
                if (urlObj.href.endsWith('/')) {
                    urls.push(urlObj.href.slice(0, -1));
                } else {
                    urls.push(urlObj.href);
                }
            } catch (err) {
                console.log(`Bad Image URL found: ${(err as Error).message}`);
            }
        }
    }
    return urls;
}

export function extractPageData(html: string, pageURL: string): ExtractedPageData {
    let finalUrl = pageURL;
    try {
        const urlObj = new URL(pageURL);
        if (urlObj.href.endsWith('/')) {
            finalUrl = urlObj.href.slice(0, -1);
        } else {
            finalUrl = urlObj.href;
        }
    } catch (e) {
        console.log(`Error parsing page URL: ${pageURL}`);
    }

    const header = getH1FromHTML(html);
    const first_p = getFirstParagraphFromHTML(html);
    const outgoing_links = getURLsFromHTML(html, pageURL);
    const image_urls = getImagesFromHTML(html, pageURL);

    return {
        url: finalUrl,             
        h1: header,
        first_paragraph: first_p,  
        outgoing_links: outgoing_links,
        image_urls: image_urls
    };
}

class ConcurrentCrawler {
  private baseURL: string;
  private pages: Record<string, number>;
  private limit: ReturnType<typeof pLimit>;
  private maxPages: number;
  private shouldStop: boolean;
  private allTasks: Set<Promise<void>>;
  private abortController: AbortController;

  constructor(
    baseURL: string,
    maxConcurrency: number = 5,
    maxPages: number = Infinity,
  ) {
    this.baseURL = baseURL;
    this.pages = {};
    this.limit = pLimit(maxConcurrency);
    this.maxPages = maxPages;
    this.shouldStop = false;
    this.allTasks = new Set();
    this.abortController = new AbortController();
  }

  private addPageVisit(normalizedURL: string): boolean {
    if (this.pages[normalizedURL]) {
      this.pages[normalizedURL] += 1;
      return false;
    } else {
      this.pages[normalizedURL] = 1;
      return true;
    }
  }

  private async getHTML(currentURL: string): Promise<string> {
    return await this.limit(async () => {
      let res;
      try {
        res = await fetch(currentURL, {
          headers: { "User-Agent": "BootCrawler/1.0" },
          signal: this.abortController.signal,
        });
      } catch (err) {
        throw new Error(`Got Network error: ${(err as Error).message}`);
      }

      if (res.status > 399) {
        throw new Error(`Got HTTP error: ${res.status} ${res.statusText}`);
      }

      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("text/html")) {
        throw new Error(`Got non-HTML response: ${contentType}`);
      }

      return res.text();
    });
  }

  private async crawlPage(currentURL: string): Promise<void> {
    const currentURLObj = new URL(currentURL);
    const baseURLObj = new URL(this.baseURL);
    if (currentURLObj.hostname !== baseURLObj.hostname) {
      return;
    }

    const normalizedURL = normalizeURL(currentURL);

    if (!this.addPageVisit(normalizedURL)) {
      return;
    }

    console.log(`crawling ${currentURL}`);

    let html = "";
    try {
      html = await this.getHTML(currentURL);
    } catch (err) {
      console.log((err as Error).message);
      return;
    }

    const nextURLs = getURLsFromHTML(html, this.baseURL);
    const crawlPromises = nextURLs.map((nextURL) =>
      this.crawlPage(nextURL),
    );

    await Promise.all(crawlPromises);
  }

  async crawl(): Promise<Record<string, number>> {
    await this.crawlPage(this.baseURL);
    return this.pages;
  }
}

export async function crawlSiteAsync(
  baseURL: string,
  maxConcurrency: number = 5,
  maxPages: number = Infinity,
): Promise<Record<string, number>> {
  const crawler = new ConcurrentCrawler(baseURL, maxConcurrency, maxPages);
  return await crawler.crawl();
}


