
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const buildDir = path.resolve(__dirname, '../dist');
const indexFile = path.join(buildDir, 'index.html');
const notFoundFile = path.join(buildDir, '404.html');

console.log('Creating 404.html for GitHub Pages SPA support...');

if (fs.existsSync(indexFile)) {
    fs.copyFileSync(indexFile, notFoundFile);
    console.log('✅ 404.html created successfully!');
} else {
    console.error('❌ Error: dist/index.html not found. Make sure to run the build first.');
    process.exit(1);
}
