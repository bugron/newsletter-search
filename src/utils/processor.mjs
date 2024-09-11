import fs from 'node:fs/promises';
import { parse } from 'node-html-parser';
import { recreateNewsletterDirectory } from '../utils/recreate-directory.mjs';
import { removeElements } from '../utils/remove-elements.mjs';

export async function newsletterProcessor(newsletter, config, customProcessor) {
    await recreateNewsletterDirectory(newsletter);

    const files = (
        await fs.readdir(`./original_newsletters/${newsletter}`)
    ).filter((file) => file.endsWith('.html'));

    for (const file of files) {
        const html = await fs.readFile(
            `./original_newsletters/${newsletter}/${file}`,
            'utf8'
        );

        const root = parse(html);

        removeElements(root, config.elementsToRemove);

        await customProcessor(root, file);
    }
}
