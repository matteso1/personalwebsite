import puppeteer from 'puppeteer-core';
const EXE =
  '/Users/nils/.cache/puppeteer/chrome-headless-shell/mac_arm-148.0.7778.97/chrome-headless-shell-mac-arm64/chrome-headless-shell';
const browser = await puppeteer.launch({
  executablePath: EXE,
  headless: 'shell',
  args: ['--no-sandbox', '--force-color-profile=srgb'],
});
const page = await browser.newPage();
await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 });
const base = process.env.OG_BASE || 'http://localhost:4321';
await page.goto(base + '/og-card', { waitUntil: 'networkidle0' });
await new Promise((r) => setTimeout(r, 500));
await page.screenshot({
  path: '/Users/nils/Desktop/nils-site/public/og.png',
  clip: { x: 0, y: 0, width: 1200, height: 630 },
});
await browser.close();
console.log('og.png written');
