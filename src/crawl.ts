import {JSDOM} from 'jsdom';
import { umask } from 'node:process';

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

