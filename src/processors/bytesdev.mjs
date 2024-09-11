import fs from 'node:fs/promises';
import { parse } from 'node-html-parser';
import { getRandomValue } from '../utils/get-random-value.mjs';
import { newsletterProcessor } from '../utils/processor.mjs';

export async function processBytesNewsletter(newsletter, config = {}) {
    await newsletterProcessor(newsletter, config, async (root) => {
        const dateString = JSON.parse(
            root.getElementById('__NEXT_DATA__').textContent
        ).props.pageProps.post.data.date;

        if (!dateString) {
            return console.error('No date string found', newsletter, file);
        }

        const date = new Date(dateString);
        const formattedDate = date.toISOString().split('T')[0];

        const paragraphElements = root.querySelectorAll('ol li');
        for (const paragraphElement of paragraphElements) {
            const link = paragraphElement.querySelector('a');
            if (!link) {
                continue;
            }

            link.setAttribute?.('data-pagefind-meta', 'url[href]');

            await fs.writeFile(
                `./newsletters/${newsletter}/${getRandomValue()}.html`,
                parse(`<div id="content">
    <h1 data-pagefind-sort="date:${formattedDate}">${paragraphElement.textContent}</h1>
    ${paragraphElement}
</div>`).toString()
            );
        }
    });
}
