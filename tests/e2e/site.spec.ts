import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { preparePageForCapture } from '../../scripts/browser-readiness.mjs';

test('all pages, images, metadata and official download links work', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
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
    const response = await page.goto(route);
    expect(response?.status()).toBe(200);
    await expect(page.locator('html')).toHaveAttribute('data-flyon-ready', 'true');
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      `https://hikari.pascal-fortunati.fr${route === '/' ? '' : route}`
    );
    await expect(page).toHaveTitle(/Hikari/);
    await preparePageForCapture(page);
    await expect
      .poll(() =>
        page.locator('img').evaluateAll(
          (images) =>
            images.filter((image) => {
              const img = image as HTMLImageElement;
              return img.getClientRects().length && (!img.complete || img.naturalWidth === 0);
            }).length
        )
      )
      .toBe(0);
    const broken = await page.locator('img').evaluateAll((images) =>
      images
        .filter((image) => {
          const img = image as HTMLImageElement;
          return img.getClientRects().length && (!img.complete || img.naturalWidth === 0);
        })
        .map((i) => (i as HTMLImageElement).src)
    );
    expect(broken).toEqual([]);
  }
  await page.goto('/telecharger');
  const download = page.getByRole('link', { name: 'Télécharger pour Windows', exact: true });
  await expect(download).toHaveAttribute(
    'href',
    /^https:\/\/github\.com\/pascal-fortunati\/hikari-releases\/releases\/download\/v[^/]+\/Hikari\.exe$/
  );
  await expect(page.getByText('SHA-256 de Hikari.exe, publié par GitHub')).toBeVisible();
  await page.goto('/versions');
  await expect(page.locator('.markdown li').first()).toBeVisible();
  expect(errors).toEqual([]);
});

test('themes persist before reload and FlyonUI tabs and FAQ respond to keyboard and pointer', async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'hikari-dark');
  await page.getByRole('button', { name: 'Changer de thème' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'hikari-light');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'hikari-light');
  await expect(page.locator('html')).toHaveAttribute('data-flyon-ready', 'true');
  await page.getByRole('tab', { name: 'Clair', exact: true }).click();
  await expect(page.locator('#preview-light')).toBeVisible();
  await expect(page.locator('#preview-dark')).toBeHidden();
  await page.getByRole('tab', { name: 'Clair', exact: true }).press('ArrowLeft');
  await expect(page.locator('#preview-dark')).toBeVisible();
  const faq = page.getByRole('button', {
    name: 'Sur quelles versions de Windows fonctionne Hikari ?',
  });
  await faq.click();
  await expect(faq).toHaveAttribute('aria-expanded', 'true');
  await expect(page.locator('#answer-0')).toBeVisible();
  await faq.press('Enter');
  await expect(faq).toHaveAttribute('aria-expanded', 'false');
});

test('gallery filters, modal, arrow navigation, escape and focus return work', async ({ page }) => {
  await page.goto('/captures');
  await page.getByRole('button', { name: 'Lecteur', exact: true }).click();
  await expect(page.locator('.gallery-item')).toHaveCount(1);
  const trigger = page.getByRole('button', { name: 'Agrandir : Lecteur vidéo natif' });
  await expect(trigger).toBeEnabled();
  await trigger.click();
  const modal = page.getByRole('dialog');
  await expect(modal).toBeVisible();
  await expect(modal).toHaveClass(/opened/);
  await expect.poll(() => modal.evaluate((element) => getComputedStyle(element).opacity)).toBe('1');
  const enlargedImage = modal.locator('.modal-body img');
  await expect(enlargedImage).toBeVisible();
  await expect
    .poll(() =>
      enlargedImage.evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0)
    )
    .toBe(true);
  const imageRect = await enlargedImage.boundingBox();
  expect(imageRect?.width).toBeGreaterThan(200);
  expect(imageRect?.height).toBeGreaterThan(100);
  const accessibility = await new AxeBuilder({ page })
    .include('#gallery-modal')
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
    .analyze();
  expect(accessibility.violations).toEqual([]);
  await page.getByRole('button', { name: 'Fermer la capture' }).focus();
  await page.keyboard.press('Shift+Tab');
  await expect(page.getByRole('button', { name: 'Capture suivante' })).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: 'Fermer la capture' })).toBeFocused();
  await page.getByRole('button', { name: 'Capture suivante' }).click();
  await expect(page.locator('#gallery-modal-title')).toHaveText('Interface claire');
  await page.keyboard.press('ArrowLeft');
  await expect(page.locator('#gallery-modal-title')).toHaveText('Lecteur vidéo natif');
  await page.keyboard.press('Escape');
  await expect(modal).toBeHidden();
  await expect(trigger).toBeFocused();
  await page.getByRole('button', { name: 'Tout', exact: true }).click();
  await expect(page.locator('.gallery-item')).toHaveCount(7);
});

test('mobile navigation opens and survives client navigation', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('data-flyon-ready', 'true');
  const menu = page.getByRole('button', { name: 'Ouvrir le menu' });
  await menu.click();
  await expect(page.locator('#mobile-menu')).toBeVisible();
  await page
    .getByRole('navigation', { name: 'Navigation mobile' })
    .getByRole('link', { name: 'Captures' })
    .click();
  await expect(page).toHaveURL(/\/captures$/);
  await expect(page.locator('html')).toHaveAttribute('data-flyon-ready', 'true');
  await menu.click();
  await expect(page.locator('#mobile-menu')).toBeVisible();
});

test('layouts remain within the viewport from 320px to 4K, in both themes', async ({ page }) => {
  test.setTimeout(120_000);
  await page.goto('/');
  for (const width of [320, 360, 390, 768, 1024, 1440, 1920, 3840]) {
    await page.setViewportSize({ width, height: width < 768 ? 844 : 1080 });
    for (const theme of ['hikari-dark', 'hikari-light']) {
      await page.evaluate((value) => localStorage.setItem('hikari-theme', value), theme);
      for (const route of [
        '/',
        '/hikari-ia',
        '/captures',
        '/telecharger',
        '/versions',
        '/installation',
      ]) {
        await page.goto(route);
        await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
        const size = await page.evaluate(() => ({
          width: innerWidth,
          scroll: document.documentElement.scrollWidth,
        }));
        expect(size.scroll, `${route} ${theme} ${width}px`).toBeLessThanOrEqual(size.width);
        if (route === '/' && [360, 1440].includes(width)) {
          await preparePageForCapture(page);
          await expect
            .poll(() =>
              page.locator('img').evaluateAll(
                (images) =>
                  images.filter((image) => {
                    const img = image as HTMLImageElement;
                    return img.getClientRects().length && (!img.complete || !img.naturalWidth);
                  }).length
              )
            )
            .toBe(0);
          await page.screenshot({ path: `artifacts/home-${theme}-${width}.png`, fullPage: true });
        }
      }
    }
  }
});

test('important pages pass axe WCAG AA in both themes', async ({ page }) => {
  test.setTimeout(120_000);
  await page.goto('/');
  for (const theme of ['hikari-dark', 'hikari-light']) {
    await page.evaluate((value) => localStorage.setItem('hikari-theme', value), theme);
    for (const route of [
      '/',
      '/hikari-ia',
      '/captures',
      '/telecharger',
      '/versions',
      '/installation',
    ]) {
      await page.goto(route);
      await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
      await expect(page.locator('html')).toHaveAttribute('data-flyon-ready', 'true');
      await page.evaluate(() => document.fonts.ready);
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
        .analyze();
      expect(
        results.violations.map((v) => ({
          id: v.id,
          nodes: v.nodes.map((n) => ({ target: n.target, detail: n.failureSummary })),
        })),
        `${route} ${theme}`
      ).toEqual([]);
    }
  }
});

test('health, sitemap, robots, security headers and 404 work', async ({ request }) => {
  const health = await request.get('/api/health');
  expect(health.ok()).toBeTruthy();
  expect(await health.json()).toEqual({ status: 'ok', service: 'hikari-site' });
  const response = await request.get('/');
  expect(response.headers()['x-content-type-options']).toBe('nosniff');
  expect(response.headers()['content-security-policy']).toContain("frame-ancestors 'none'");
  expect(response.headers()['content-security-policy']).not.toContain("'unsafe-eval'");
  expect((await request.get('/sitemap.xml')).ok()).toBeTruthy();
  expect((await request.get('/robots.txt')).ok()).toBeTruthy();
  expect((await request.get('/introuvable')).status()).toBe(404);
});

test('waves animate, parallax follows scrolling and reduced motion stops the background', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  await expect(page.locator('.ambient-waves')).toHaveCount(2);
  await expect(page.locator('.site-footer .ambient-waves-footer')).toHaveCount(1);
  await expect(page.locator('.ambient-waves path[stroke]')).toHaveCount(0);
  expect(
    await page
      .locator('.site-footer')
      .evaluate((element) => getComputedStyle(element).borderTopWidth)
  ).toBe('0px');
  const wave = page.locator('.hero-scene .wave-layer-back');
  await expect
    .poll(() => wave.evaluate((element) => getComputedStyle(element).animationName))
    .toBe('wave-drift');
  const stage = page.locator('.hero-stage');
  await expect
    .poll(() => stage.evaluate((element) => getComputedStyle(element).translate))
    .not.toBe('none');
  const initialDepth = await stage.evaluate((element) => getComputedStyle(element).translate);
  await page.mouse.wheel(0, 350);
  await expect
    .poll(() => stage.evaluate((element) => getComputedStyle(element).translate))
    .not.toBe(initialDepth);
  await expect(page.locator('[data-parallax][style]')).toHaveCount(0);
  const header = await page.locator('.site-header').evaluate((element) => ({
    top: element.getBoundingClientRect().top,
    width: element.getBoundingClientRect().width,
    viewport: innerWidth,
  }));
  expect(header.top).toBe(0);
  expect(header.width).toBe(header.viewport);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect
    .poll(() => stage.evaluate((element) => getComputedStyle(element).translate))
    .toBe('none');
  await expect
    .poll(() => wave.evaluate((element) => getComputedStyle(element).animationName))
    .toBe('none');
  await expect
    .poll(() =>
      page
        .locator('.hero-scene .ambient-waves')
        .evaluate((element) => getComputedStyle(element).transform)
    )
    .toBe('none');
});
