import { chromium } from '@playwright/test';
import { preparePageForCapture } from './browser-readiness.mjs';

const origin = process.env.PREVIEW_URL ?? 'http://127.0.0.1:43123';
const browser = await chromium.launch({ channel: 'chrome' });
const issues = [];
let visited = 0;
try {
  for (const theme of ['hikari-light', 'hikari-dark']) {
    const page = await browser.newPage({
      viewport: { width: 1440, height: 1000 },
      reducedMotion: 'reduce',
    });
    page.on('pageerror', (error) =>
      issues.push({ theme, type: 'pageerror', message: error.message })
    );
    page.on('console', (message) => {
      if (['error', 'warning'].includes(message.type()))
        issues.push({ theme, type: message.type(), message: message.text() });
    });
    await page.addInitScript((value) => localStorage.setItem('hikari-theme', value), theme);
    for (const route of [
      '/',
      '/hikari-ia',
      '/captures',
      '/telecharger',
      '/versions',
      '/installation',
      '/credits',
      '/mentions-legales',
    ]) {
      const response = await page.goto(`${origin}${route}`);
      if (response?.status() !== 200) throw new Error(`${route}: HTTP ${response?.status()}`);
      if (!response.headers()['content-security-policy']?.includes("'unsafe-eval'"))
        throw new Error('Development CSP is missing React debugging support');
      await preparePageForCapture(page);
      if (route === '/hikari-ia') {
        await page.screenshot({ path: `artifacts/redesign/ia-${theme}-desktop.png` });
        await page.screenshot({ path: `artifacts/redesign/ia-${theme}-page.png`, fullPage: true });
      }
      if (route === '/') {
        await page.screenshot({ path: `artifacts/redesign/final-${theme}-desktop.png` });
        await page.screenshot({
          path: `artifacts/redesign/final-${theme}-page.png`,
          fullPage: true,
        });
        await page
          .locator('.site-footer')
          .screenshot({ path: `artifacts/redesign/final-${theme}-footer.png` });
        await page
          .locator('.planning-section')
          .screenshot({ path: `artifacts/redesign/final-${theme}-planning.png` });
        const header = await page.locator('.site-header').evaluate((element) => ({
          width: element.getBoundingClientRect().width,
          viewport: innerWidth,
          navBackground: getComputedStyle(element.querySelector('.navbar')).backgroundColor,
        }));
        if (header.width !== header.viewport || header.navBackground !== 'rgba(0, 0, 0, 0)')
          throw new Error('Header surface is not continuous');
      }
      visited++;
    }
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${origin}/`);
    await preparePageForCapture(page);
    await page.screenshot({ path: `artifacts/redesign/final-${theme}-mobile.png`, fullPage: true });
    // Exercise client navigation and remounting after motion has started.
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.reload();
    await page.waitForFunction(() => document.querySelector('.hero-stage')?.getAnimations().length);
    await page.mouse.wheel(0, 350);
    if (await page.locator('[data-parallax][style]').count())
      throw new Error('Motion modified React-owned HTML attributes');
    await page.locator('.site-header a[aria-label="Hikari, accueil"]').click();
    await page.getByRole('link', { name: 'Installation et FAQ complète' }).click();
    await page.waitForURL('**/installation');
    await page.locator('.site-header a[aria-label="Hikari, accueil"]').click();
    await page.waitForURL(`${origin}/`);
    await page.waitForFunction(() => document.querySelector('.hero-stage')?.getAnimations().length);
    await page.reload();
    await page.waitForFunction(() => document.querySelector('.hero-stage')?.getAnimations().length);
    await page.close();
  }
  console.log(JSON.stringify({ visited, issues }, null, 2));
  if (issues.length) process.exitCode = 1;
} finally {
  await browser.close();
}
