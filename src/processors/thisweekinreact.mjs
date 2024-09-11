import fs from 'node:fs/promises';
import { parse } from 'node-html-parser';
import { getRandomValue } from '../utils/get-random-value.mjs';
import { newsletterProcessor } from '../utils/processor.mjs';

export async function processThisweekinreactNewsletter(
    newsletter,
    config = {}
) {
    await newsletterProcessor(newsletter, config, async (root) => {
        const dateString = root
            .querySelector('meta[property="article:published_time"]')
            .getAttribute('content');

        if (!dateString) {
            return console.error('No date string found', newsletter, file);
        }

        const formattedDate = dateString?.split('T')[0];

        for (const element of root.querySelectorAll('p')) {
            if (
                element.textContent
                    .toLowerCase()
                    .includes('support the newsletter')
            ) {
                element.nextElementSibling?.remove();
                element.remove();
            }
        }

        // find all h2 elements with id containing "sponsor", and remove them and the following elements until the next h2
        const h2Elements = root.querySelectorAll('h2');
        for (const h2Element of h2Elements) {
            if (h2Element.id.toLowerCase().includes('sponsor')) {
                const elementsToRemove = [h2Element];
                let nextElement = h2Element.nextElementSibling;
                while (
                    nextElement &&
                    nextElement.tagName.toLowerCase() !== 'h2'
                ) {
                    elementsToRemove.push(nextElement);
                    nextElement = nextElement.nextElementSibling;
                }
                for (const element of elementsToRemove) {
                    element.remove();
                }
            }
        }

        const paragraphElements = root.querySelectorAll('ul li');
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
