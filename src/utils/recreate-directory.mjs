import fs from 'node:fs/promises';

export async function recreateNewsletterDirectory(newsletter) {
    await fs.rm(`./newsletters/${newsletter}`, {
        recursive: true,
        force: true,
    });
    await fs.mkdir(`./newsletters/${newsletter}`, { recursive: true });
}
