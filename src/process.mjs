import { getConfig } from './utils/get-config.mjs';
import { getNewsletterNames } from './utils/get-newsletter-names.mjs';
import { getProcessor } from './utils/get-processor.mjs';

async function process() {
    // Get list of newsletters from directories in original_newsletters
    const newsletters = getNewsletterNames();

    // Process newsletters in parallel
    const processingPromises = newsletters.map(async (newsletter) => {
        try {
            console.log(`Processing ${newsletter}...`);

            const processor = getProcessor(newsletter);

            if (!processor) {
                throw new Error(`No processor found for ${newsletter}`);
            }

            await processor(newsletter, getConfig(newsletter));
            console.log(`Successfully processed ${newsletter}`);
        } catch (error) {
            console.error(`Error processing ${newsletter}:`, error.message);
            // Continue with other newsletters despite this error
        }
    });

    // Wait for all newsletters to be processed, regardless of success or failure
    await Promise.allSettled(processingPromises);

    console.log('Newsletter processing complete.');
}

process();
