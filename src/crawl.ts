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



export function getH1FromHTML(html: string): string{
    return ""
}

export function getFirstParagraphFromHTML(html: string): string{
    return ""
}