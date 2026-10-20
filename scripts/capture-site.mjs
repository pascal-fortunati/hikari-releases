import { chromium } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
import { preparePageForCapture } from './browser-readiness.mjs';

const baseURL = process.env.PREVIEW_URL ?? 'http://127.0.0.1:43125';
const directory = 'artifacts/previews';
await mkdir(directory, { recursive: true });
const browser = await chromium.launch({ channel: 'chrome' });
const cases = [
  ['accueil-sombre-desktop', '/', 1440, 'hikari-dark'],
  ['accueil-clair-desktop', '/', 1440, 'hikari-light'],
  ['accueil-sombre-mobile', '/', 390, 'hikari-dark'],
  ['accueil-clair-mobile', '/', 390, 'hikari-light'],
  ['captures-tablette', '/captures', 768, 'hikari-dark'],
  ['telechargement-desktop', '/telecharger', 1440, 'hikari-light'],
  ['versions-mobile', '/versions', 360, 'hikari-dark'],
];
try {
  for (const [name, route, width, theme] of cases) {
    const page = await browser.newPage({
      viewport: { width, height: 1000 },
      reducedMotion: 'reduce',
    });
    await page.addInitScript((value) => localStorage.setItem('hikari-theme', value), theme);
    const response = await page.goto(`${baseURL}${route}`);
    if (response?.status() !== 200) throw new Error(`Preview failed: ${route}`);
    await preparePageForCapture(page);
    await page.screenshot({ path: `${directory}/${name}.png`, fullPage: true });
    console.log(`${directory}/${name}.png`);
    await page.close();
  }
} finally {
  await browser.close();
}
