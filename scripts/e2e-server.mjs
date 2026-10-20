import { mkdir, writeFile } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { resolve } from 'node:path';
// Simulated releases are isolated in ignored test artifacts. Never ship in public/.
const directory = resolve('artifacts/e2e-cache');
await mkdir(directory, { recursive: true });
const base = 'https://github.com/pascal-fortunati/hikari-releases/releases';
const release = {
  id: 999999,
  tag_name: 'v9.9.0-test',
  name: 'Fixture de test',
  body: '## Fixture de test\n\n### Lecteur\n\n- **Correction simulée**, uniquement dans les tests.',
  html_url: `${base}/tag/v9.9.0-test`,
  published_at: '2026-10-19T09:00:00Z',
  draft: false,
  prerelease: false,
  assets: [
    {
      name: 'Hikari.exe',
      size: 15000000,
      digest: `sha256:${'a'.repeat(64)}`,
      browser_download_url: `${base}/download/v9.9.0-test/Hikari.exe`,
    },
  ],
};
await writeFile(
  resolve(directory, 'releases-v1.json'),
  JSON.stringify({ version: 1, checkedAt: Date.now(), latest: release, releases: [release] })
);
const child = spawn(
  process.execPath,
  ['node_modules/next/dist/bin/next', 'start', '--hostname', '127.0.0.1', '--port', '43124'],
  { stdio: 'inherit', env: { ...process.env, RELEASE_CACHE_DIR: directory } }
);
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => child.kill(signal));
child.on('exit', (code) => process.exit(code ?? 0));
