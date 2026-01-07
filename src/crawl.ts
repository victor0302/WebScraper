import {JSDOM} from 'jsdom';
import { error } from 'node:console';
import { url } from 'node:inspector';
import { umask } from 'node:process';

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


export async function getHTML (url:string){
    try{
        const response = await fetch(url, {
            headers: {
                "User-Agent": "BootCrawler/1.0",
            }
        });
        if (response.status >= 400){
            console.error(" 400 error status");
            return ;

        }
        const contentType = response.headers.get("content-type")
        if (!contentType || !contentType.includes("text/html")){
            console.error("non-HTML response");
            return;
        }
         const body = await response.text();
         console.log(body);
    } catch (err) {
        console.error(err)

    }   
}