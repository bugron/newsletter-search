import fs from 'node:fs/promises';
import path from 'node:path';

const PUBLIC_DIR = 'public';
const INDEX_HTML_PATH = path.join(PUBLIC_DIR, 'index.html');
const PAGEFIND_CSS_PATH = path.join(PUBLIC_DIR, 'pagefind', 'pagefind-ui.css');
const PAGEFIND_JS_PATH = path.join(PUBLIC_DIR, 'pagefind', 'pagefind-ui.js');

async function inlinePagefindFiles() {
    try {
        // Read files
        const [indexHtml, pagefindCss, pagefindJs] = await Promise.all([
            fs.readFile(INDEX_HTML_PATH, 'utf-8'),
            fs.readFile(PAGEFIND_CSS_PATH, 'utf-8'),
            fs.readFile(PAGEFIND_JS_PATH, 'utf-8'),
        ]);

        // Replace CSS link with inline style
        const inlinedCss = indexHtml.replace(
            /<link href="\/pagefind\/pagefind-ui\.css" rel="stylesheet" \/>/,
            `<style>${pagefindCss}</style>`
        );

        // Replace JS script with inline script
        const inlinedHtml = inlinedCss.replace(
            /<script src="\/pagefind\/pagefind-ui\.js" type="text\/javascript"><\/script>/,
            `<script>${pagefindJs}</script>`
        );

        // Write the modified HTML back to the file
        await fs.writeFile(INDEX_HTML_PATH, inlinedHtml);

        console.log('Pagefind CSS and JS have been inlined in index.html');
    } catch (error) {
        console.error('Error inlining Pagefind files:', error);
    }
}

inlinePagefindFiles();
