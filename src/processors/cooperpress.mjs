import fs from 'node:fs/promises';
import { parse } from 'node-html-parser';
import { getRandomValue } from '../utils/get-random-value.mjs';
import { newsletterProcessor } from '../utils/processor.mjs';

export async function processCooperpressNewsletter(newsletter, config = {}) {
    await newsletterProcessor(newsletter, config, async (root, file) => {
        const dateString = root
            .querySelector('title')
            ?.textContent.split(':')[1]
            .trim();

        if (!dateString) {
            return console.error('No date string found', newsletter, file);
        }

        const date = new Date(dateString);
        const formattedDate = date.toISOString().split('T')[0];

        // remove sponsor links
        for (const element of root.querySelectorAll('.tag-sponsor')) {
            element.closest('table').remove();
        }

        const mainLinkElements = root.querySelectorAll('.mainlink');
        for (const mainLinkElement of mainLinkElements) {
            mainLinkElement.firstChild?.setAttribute?.(
                'data-pagefind-meta',
                'url[href]'
            );

            await fs.writeFile(
                `./newsletters/${newsletter}/${getRandomValue()}.html`,
                parse(`<div id="content">
            <h1 data-pagefind-sort="date:${formattedDate}">${mainLinkElement}</h1>
            <p>${mainLinkElement.nextSibling?.toString().replace(' — ', '')}</p>
        </div>`).toString()
            );
        }

        const paragraphElements = root.querySelectorAll('ul li p');
        for (const paragraphElement of paragraphElements) {
            paragraphElement.setAttribute('data-pagefind-meta', 'title');
            paragraphElement
                .querySelectorAll('a')[0]
                ?.setAttribute('data-pagefind-meta', 'url[href]');

            await fs.writeFile(
                `./newsletters/${newsletter}/${getRandomValue()}.html`,
                parse(`<div id="content">
    <h1 data-pagefind-sort="date:${formattedDate}">${paragraphElement.querySelectorAll('a')[0]?.textContent}</h1>
    <p>${paragraphElement.toString().replace(' — ', '')}</p>
</div>`).toString()
            );
        }
    });
}
