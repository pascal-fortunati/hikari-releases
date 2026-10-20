import sharp from 'sharp';
import { mkdir, readdir } from 'node:fs/promises';
import { join } from 'node:path';

// Existing public screenshots only; no screenshot fabrication.
await mkdir('public/screenshots', { recursive: true });
for (const name of await readdir('docs/screenshots')) {
  if (!name.endsWith('.jpg')) continue;
  await sharp(join('docs/screenshots', name))
    .webp({ quality: 88 })
    .toFile(join('public/screenshots', name.replace('.jpg', '.webp')));
}
// Brand sources are deliberately copied once from the authorized application.
// Future builds use public/brand, and never need the private Windows checkout.
await mkdir('public/brand', { recursive: true });
if (process.argv.includes('--import-brand')) {
  for (const [source, target] of [
    ['logo.png', 'icon'],
    ['logo_complet.png', 'logo-dark'],
    ['logo_complet_light.png', 'logo-light'],
  ]) {
    const input = sharp(join('E:/Dev/Hikari', source)).trim();
    await input
      .resize({ width: target === 'icon' ? 256 : 640 })
      .webp({ quality: 95 })
      .toFile(`public/brand/${target}.webp`);
  }
  await sharp('public/brand/icon.webp').resize(64, 64).png().toFile('src/app/icon.png');
  await sharp('public/brand/icon.webp').resize(180, 180).png().toFile('src/app/apple-icon.png');
}
const backdrop = Buffer.from(
  `<svg width="1200" height="630"><rect width="1200" height="630" fill="#0e1626"/><text x="70" y="290" fill="#e7edf6" font-size="55" font-family="sans-serif" font-weight="bold">Tes animés.</text><text x="70" y="365" fill="#f7bd8f" font-size="55" font-family="sans-serif" font-weight="bold">Tes mangas.</text><text x="70" y="450" fill="#b7c6df" font-size="23" font-family="sans-serif">Planning, lecteur natif et Hikari IA.</text><text x="70" y="560" fill="#9db9e8" font-size="19" font-family="sans-serif">hikari.pascal-fortunati.fr</text></svg>`
);
const logo = await sharp('public/brand/logo-dark.webp').resize({ width: 240 }).toBuffer();
const screen = await sharp('public/screenshots/home-dark.webp').resize({ width: 680 }).toBuffer();
await sharp(backdrop)
  .composite([
    { input: logo, left: 60, top: 50 },
    { input: screen, left: 600, top: 120 },
  ])
  .png()
  .toFile('public/opengraph-image.png');
