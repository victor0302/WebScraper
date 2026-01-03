import {test, expect} from 'vitest';
import {normalizeURL,getH1FromHTML,getFirstParagraphFromHTML} from './crawl';

test('normalizeURL strips protocol', () =>{
    const input = 'https://blog.boot.dev/path';
    const actual = normalizeURL(input);
    const expected = 'blog.boot.dev/path';
    expect(actual).toBe(expected)
});

test('normalizeURL strips protocol', () =>{
    const input = 'https://blog.boot.dev/path/';
    const actual = normalizeURL(input);
    const expected = 'blog.boot.dev/path';
    expect(actual).toBe(expected)
});

test("getH1FromHTML basic"), () => {
    const inputBody = '<html><body><h1> Test Title </h1></body></html>';
    const actual = getH1FromHTML(inputBody);
    const expected = "Test Title";
    expect(actual).toEqual(expected)
}

test("getH1FromHTML basic"), () => {
    const inputBody = '<html><body><h1> Test </h1></body></html>';
    const actual = getH1FromHTML(inputBody);
    const expected = "Test";
    expect(actual).toEqual(expected)
}

test("getH1FromHTML basic"), () => {
    const inputBody = '<html><body><h1> Test Title 2</h1></body></html>';
    const actual = getH1FromHTML(inputBody);
    const expected = "Test Title 2";
    expect(actual).toEqual(expected)
}



test("getFirstParagraphFromHTML main priority", () => {
  const inputBody = `
    <html><body>
      <p>Outside paragraph.</p>
      <main>
        <p>Main paragraph.</p>
      </main>
    </body></html>
  `;
  const actual = getFirstParagraphFromHTML(inputBody);
  const expected = "Main paragraph.";
  expect(actual).toEqual(expected);
});

test("getFirstParagraphFromHTML main priority", () => {
  const inputBody = `
    <html><body>
      <p>Outside paragraph.</p>
      <main>
        <p>Main paragraph.</p>
      </main>
    </body></html>
  `;
  const actual = getFirstParagraphFromHTML(inputBody);
  const expected = "Main paragraph.";
  expect(actual).toEqual(expected);
});

test("getFirstParagraphFromHTML main priority", () => {
  const inputBody = `
    <html><body>
      <p>Outside paragraph.</p>
      <main>
        <p>Main paragraph.</p>
      </main>
    </body></html>
  `;
  const actual = getFirstParagraphFromHTML(inputBody);
  const expected = "Main paragraph.";
  expect(actual).toEqual(expected);
});
