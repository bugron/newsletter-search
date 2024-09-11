import fs from 'node:fs/promises';
import path from 'node:path';

const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
});
const filePath = path.resolve('./public/index.html');

try {
    const data = await fs.readFile(filePath, 'utf8');

    const updatedContent = data.replace('CURRENT_DATE', currentDate);

    await fs.writeFile(filePath, updatedContent, 'utf8');

    console.log('Successfully updated the date in index.html');
} catch (err) {
    console.error('Error:', err);
}
