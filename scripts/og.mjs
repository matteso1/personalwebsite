import puppeteer from 'puppeteer-core';
import { fileURLToPath } from 'node:url';

const browser = await puppeteer.launch({
  executablePath: process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: true,
  args: ['--force-color-profile=srgb'],
});
try {
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 });
  const base = process.env.OG_BASE || 'http://localhost:4321';
  await page.goto(base + '/og-card', { waitUntil: 'networkidle0' });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({
    path: fileURLToPath(new URL('../public/og.png', import.meta.url)),
    clip: { x: 0, y: 0, width: 1200, height: 630 },
  });
  console.log('public/og.png written');
} finally {
  await browser.close();
}
