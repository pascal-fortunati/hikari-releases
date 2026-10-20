/** Load images through normal scrolling, without changing React-owned attributes.
 * @param {import('@playwright/test').Page} page
 */
export async function preparePageForCapture(page) {
  await page.waitForFunction(() => document.documentElement.dataset.flyonReady === 'true');
  await page.evaluate(() => document.fonts.ready);
  const initialScroll = await page.evaluate(() => window.scrollY);
  const { height, step } = await page.evaluate(() => ({
    height: document.documentElement.scrollHeight,
    step: Math.max(300, innerHeight * 0.8),
  }));
  // Trusted wheel input reproduces a real visit and ends the initial LCP window.
  // Programmatic scrolling alone can falsely classify below-fold images as LCP.
  for (let top = initialScroll; top < height; top += step) {
    await page.mouse.wheel(0, step);
    await page.waitForTimeout(65);
  }
  await page.waitForFunction(() =>
    [...document.images].every(
      (image) => !image.getClientRects().length || (image.complete && image.naturalWidth > 0)
    )
  );
  await page.evaluate((top) => window.scrollTo({ top, behavior: 'instant' }), initialScroll);
  await page.evaluate(async () => {
    await Promise.all(
      [...document.images]
        .filter((image) => image.getClientRects().length)
        .map((image) => image.decode())
    );
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  });
}
