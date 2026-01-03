import {JSDOM} from 'jsdom';

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