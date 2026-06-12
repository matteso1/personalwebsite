import puppeteer from 'puppeteer-core';
const EXE =
  '/Users/nils/.cache/puppeteer/chrome-headless-shell/mac_arm-148.0.7778.97/chrome-headless-shell-mac-arm64/chrome-headless-shell';
const base = process.env.BASE || 'http://localhost:4321';
const routes = process.argv[2]
  ? process.argv[2].split(',')
  : ['/', '/work', '/work/thaw', '/writing', '/writing/project-gorgon', '/about', '/agents'];
const width = Number(process.argv[3] || 1000);
const browser = await puppeteer.launch({
  executablePath: EXE,
  headless: "shell",
  args: ['--no-sandbox', '--force-color-profile=srgb'],
});
const page = await browser.newPage();
if (process.env.DARK) {
  await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: 'dark' }]);
}
await page.setViewport({ width, height: 1000, deviceScaleFactor: 2 });
for (const r of routes) {
  await page.goto(base + r, { waitUntil: 'networkidle0' });
  await new Promise((res) => setTimeout(res, 250));
  const name = r === '/' ? 'home' : r.replace(/\//g, '_').replace(/^_/, '');
  const path = `/tmp/ns_${width}_${name}.png`;
  await page.screenshot({ path, fullPage: true });
  console.log('shot', path);
}
await browser.close();
