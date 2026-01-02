import {test, expect} from 'vitest';
import {normalizeURL} from './crawl';

test('normalizeURL strips protocol', () =>{
    const input = 'https://blog.boot.dev/path';
    const actual = normalizeURL(input);
    const expected = 'blog.boot.dev/path';
    expect(actual).toBe(expected)
});