import { exec } from 'node:child_process';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { promisify } from 'node:util';
import { extractPageTitle } from '../utils/extract-page-title.mjs';
import { getNextNumericIssue } from '../utils/get-next-numeric-issue.mjs';
import { randomDelay } from '../utils/random-delay.mjs';

const execPromise = promisify(exec);

export async function fetchBytesDevNewsletter(
    newsletterDir,
    currentIssue,
    config = {}
) {
    const nextIssue = getNextNumericIssue(currentIssue);
    const newsletterName = path.basename(newsletterDir);

    const url = config.urlTemplate
        ? config.urlTemplate.replace('{issue}', nextIssue)
        : `https://${newsletterName}/archives/${nextIssue}`;

    const outputPath = path.join(newsletterDir, `${nextIssue}.html`);

    console.log(`Attempting to fetch: ${url}`);

    await randomDelay(3, 5);

    try {
        // Use curl to follow redirects and output the final URL
        const curlCommand = `curl -sL -o "${outputPath}" "${url}"`;
        await execPromise(curlCommand);

        // Read the content of the fetched file
        const htmlContent = await fs.readFile(outputPath, 'utf-8');
        const fetchedTitle = extractPageTitle(htmlContent);

        if (fetchedTitle === '404') {
            console.log(`No new issue available for ${newsletterName}.`);
            await fs.unlink(outputPath);
            return false;
        }

        console.log(
            `Successfully fetched new issue ${nextIssue} for ${newsletterName}`
        );
        return true;
    } catch (error) {
        console.error(
            `Failed to fetch issue ${nextIssue} for ${newsletterName}`
        );
        try {
            await fs.unlink(outputPath);
        } catch (unlinkError) {
            // Ignore if file doesn't exist
        }
        return false;
    }
}
