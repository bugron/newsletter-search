import fs from 'node:fs';
import path from 'node:path';

export const getNewsletterNames = () => {
    const newsletters = fs
        .readdirSync(path.resolve(process.cwd(), NEWSLETTERS_DIR_NAME), {
            withFileTypes: true,
        })
        .filter((dirent) => dirent.isDirectory())
        .map((dirent) => dirent.name);

    return newsletters;
};

export const NEWSLETTERS_DIR_NAME = 'original_newsletters';
