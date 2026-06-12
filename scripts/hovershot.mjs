import puppeteer from 'puppeteer-core';
const EXE =
  '/Users/nils/.cache/puppeteer/chrome-headless-shell/mac_arm-148.0.7778.97/chrome-headless-shell-mac-arm64/chrome-headless-shell';
const b = await puppeteer.launch({
  executablePath: EXE,
  headless: 'shell',
  args: ['--no-sandbox', '--force-color-profile=srgb'],
});
const p = await b.newPage();
if (process.env.DARK) await p.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: 'dark' }]);
await p.setViewport({ width: 1100, height: 1000, deviceScaleFactor: 2 });
await p.goto('http://localhost:4321/agents', { waitUntil: 'networkidle0' });
const rows = await p.$$('.prose table tbody tr');
await rows[1].hover();
await new Promise((r) => setTimeout(r, 250));
const tbl = await p.$('.prose table');
await tbl.screenshot({ path: '/tmp/hover_table.png' });
await b.close();
console.log('captured, rows:', rows.length);
