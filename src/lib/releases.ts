import 'server-only';
import { cache } from 'react';
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { randomUUID } from 'node:crypto';
import { ReleaseCache } from './release-cache';

const directory = process.env.RELEASE_CACHE_DIR ?? join(process.cwd(), 'data');
const filename = join(directory, 'releases-v1.json');
const releases = new ReleaseCache({
  token: process.env.GITHUB_TOKEN,
  log: (message) => console.warn(message),
  store: {
    async read() {
      return JSON.parse(await readFile(filename, 'utf8'));
    },
    async write(value) {
      await mkdir(directory, { recursive: true });
      const temporary = `${filename}.${randomUUID()}.tmp`;
      await writeFile(temporary, JSON.stringify(value), { mode: 0o600 });
      await rename(temporary, filename);
    },
  },
});
export const getReleases = cache(() => releases.get());
