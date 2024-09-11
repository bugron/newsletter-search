import { promises as fs } from 'node:fs';
import path from 'node:path';
import { getConfig } from './utils/get-config.mjs';
import { getFetcher } from './utils/get-fetcher.mjs';
import {
    NEWSLETTERS_DIR_NAME,
    getNewsletterNames,
} from './utils/get-newsletter-names.mjs';

async function findLatestHtmlFile(dir) {
    const files = await fs.readdir(dir);
    const htmlFiles = files.filter((file) => path.extname(file) === '.html');
    return htmlFiles.sort((a, b) => Number.parseInt(b) - Number.parseInt(a))[0];
}

async function fetchNewsletter(newsletter) {
    try {
        const newsletterDir = path.join(NEWSLETTERS_DIR_NAME, newsletter);

        const stats = await fs.stat(newsletterDir);
        if (!stats.isDirectory()) {
            return console.log(`${newsletter} is not a directory. Skipping.`);
        }

        const fetcher = getFetcher(newsletter);
        if (!fetcher) {
            return console.log(`No fetcher found for ${newsletter}. Skipping.`);
        }

        console.log(`Fetching ${newsletter}`);

        const config = await getConfig(newsletter);
        const latestFile = await findLatestHtmlFile(newsletterDir);

        if (latestFile) {
            const currentIssue = path.basename(latestFile, '.html');
            let newIssueFound = await fetcher(
                newsletterDir,
                currentIssue,
                config
            );

            let attempts = 0;
            const maxAttempts = 2;

            while (newIssueFound && attempts < maxAttempts) {
                const nextIssue = (
                    Number.parseInt(currentIssue) + 1
                ).toString();
                newIssueFound = await fetcher(newsletterDir, nextIssue, config);
                attempts++;
            }

            if (attempts >= maxAttempts) {
                console.log(
                    `Reached maximum attempts (${maxAttempts}) for ${newsletter}. Stopping.`
                );
            }
        } else {
            console.log(`No HTML files found in ${newsletterDir}`);
        }
    } catch (error) {
        console.error(`An error occurred while fetching ${newsletter}:`, error);
    }
}

async function fetchNewsletters() {
    try {
        const newsletters = getNewsletterNames();
        const fetchPromises = newsletters.map(fetchNewsletter);
        await Promise.all(fetchPromises);
    } catch (error) {
        console.error(
            'An error occurred while reading newsletters directory:',
            error
        );
    }
}

fetchNewsletters();
