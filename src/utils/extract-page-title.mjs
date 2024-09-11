import { parse } from 'node-html-parser';

export function extractPageTitle(htmlContent) {
    const root = parse(htmlContent);
    return root.querySelector('title')?.textContent || '';
}
