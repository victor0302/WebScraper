import {test, expect} from 'vitest';
import {normalizeURL,getH1FromHTML,getFirstParagraphFromHTML} from './crawl';

test('normalizeURL strips protocol', () =>{
    const input = 'https://blog.boot.dev/path';
    const actual = normalizeURL(input);
    const expected = 'blog.boot.dev/path';
    expect(actual).toBe(expected)
});

test('normalizeURL strips protocol with /', () =>{
    const input = 'https://blog.boot.dev/path/';
    const actual = normalizeURL(input);
    const expected = 'blog.boot.dev/path';
    expect(actual).toBe(expected)
});

test("getH1FromHTML basic", () => {
    const inputBody = '<html><body><h1>Test Title</h1></body></html>';
    const actual = getH1FromHTML(inputBody);
    const expected = "Test Title";
    expect(actual).toEqual(expected)
})

test("getH1FromHTML finds h1 nested inside main or div", () => {
    const html = `<html><body><main><div><h1>Deep H1</h1></div></main></body></html>`;
    const actual = getH1FromHTML(html);
    expect(actual).toEqual("Deep H1");
});

test("getH1FromHTML returns empty string if no h1 found", () => {
    const html = `<html><body><p>Just a paragraph</p></body></html>`;
    const actual = getH1FromHTML(html);
    const expected = "";
    expect(actual).toEqual(expected);
});



test("getFirstParagraphFromHTML prefers paragraph inside main", () => {
    const html = `
    <html>
        <body>
            <p>I am usually first, but ignore me!</p>
            <main>
                <p>I am the main content!</p>
            </main>
        </body>
    </html>`;
    const actual = getFirstParagraphFromHTML(html);
    expect(actual).toEqual("I am the main content!");
});

test("getFirstParagraphFromHTML falls back to first p if no main exists", () => {
    const html = `<html><body><p>First fallback paragraph</p></body></html>`;
    const actual = getFirstParagraphFromHTML(html);
    expect(actual).toEqual("First fallback paragraph");
});

test("getFirstParagraphFromHTML returns empty string if no p tags", () => {
    const html = `<html><body><h1>Just a title</h1></body></html>`;
    const actual = getFirstParagraphFromHTML(html);
    const expected = ""
    expect(actual).toEqual(expected);
});