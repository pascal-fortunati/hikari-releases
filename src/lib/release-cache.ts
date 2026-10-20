import { z } from 'zod';

export const REPOSITORY = 'pascal-fortunati/hikari-releases';
export const GITHUB_URL = `https://github.com/${REPOSITORY}`;
export const RELEASES_URL = `${GITHUB_URL}/releases`;
export const REFRESH_MS = 300_000;
const tagSchema = z.string().regex(/^[A-Za-z0-9][A-Za-z0-9._+-]{0,99}$/);
const assetSchema = z.object({
  name: z.string().max(200),
  size: z.number().int().nonnegative(),
  browser_download_url: z.string().url(),
  digest: z.string().nullable().optional(),
});
const releaseSchema = z.object({
  id: z.number().int().positive(),
  tag_name: tagSchema,
  name: z.string().max(500).nullable(),
  body: z.string().max(150_000).nullable(),
  html_url: z.string().url(),
  published_at: z.string().datetime().nullable(),
  draft: z.boolean(),
  prerelease: z.boolean(),
  assets: z.array(assetSchema).max(100),
});
export type Release = z.infer<typeof releaseSchema>;
export type Asset = z.infer<typeof assetSchema>;

export function validateRelease(value: unknown): Release {
  const release = releaseSchema.parse(value);
  if (release.html_url !== `${RELEASES_URL}/tag/${encodeURIComponent(release.tag_name)}`) {
    throw new Error('Unexpected release URL');
  }
  if (!release.published_at && !release.draft) throw new Error('Missing publication date');
  return release;
}

export function officialAsset(release: Release | null, name = 'Hikari.exe'): Asset | null {
  if (!release || release.draft || release.prerelease) return null;
  const expected = `${RELEASES_URL}/download/${encodeURIComponent(release.tag_name)}/${name}`;
  return (
    release.assets.find(
      (asset) => asset.name === name && asset.size > 0 && asset.browser_download_url === expected
    ) ?? null
  );
}

export function checksum(asset: Asset | null): string | null {
  return asset?.digest?.match(/^sha256:([a-f0-9]{64})$/i)?.[1]?.toLowerCase() ?? null;
}

const snapshotSchema = z.object({
  version: z.literal(1),
  checkedAt: z.number().nonnegative(),
  latest: releaseSchema.nullable(),
  releases: z.array(releaseSchema).max(2000),
});
type Snapshot = z.infer<typeof snapshotSchema>;
export type ReleaseState = Snapshot & { stale: boolean; unavailable: boolean };
export interface SnapshotStore {
  read(): Promise<unknown>;
  write(value: Snapshot): Promise<void>;
}
interface CacheOptions {
  fetcher?: typeof fetch;
  now?: () => number;
  store: SnapshotStore;
  token?: string;
  log?: (message: string) => void;
}

/** One snapshot for latest + history. Refresh on demand, not at build time.
 * No second HTML/ISR TTL: a visitor after 5 min awaits the refresh once.
 * Single-flight per process, bounded network, persistent last-known-good. */
export class ReleaseCache {
  private snapshot: Snapshot = { version: 1, checkedAt: 0, latest: null, releases: [] };
  private loaded = false;
  private attempted = false;
  private retryAt = 0;
  private failed = false;
  private pending: Promise<ReleaseState> | null = null;
  private readonly fetcher: typeof fetch;
  private readonly now: () => number;
  private readonly etags = new Map<string, { etag: string; body: unknown }>();
  constructor(private options: CacheOptions) {
    this.fetcher = options.fetcher ?? fetch;
    this.now = options.now ?? Date.now;
  }
  get(): Promise<ReleaseState> {
    this.pending ??= this.refresh().finally(() => {
      this.pending = null;
    });
    return this.pending;
  }
  private state(): ReleaseState {
    return {
      ...this.snapshot,
      stale: this.failed || this.now() - this.snapshot.checkedAt >= REFRESH_MS,
      unavailable: !this.snapshot.checkedAt,
    };
  }
  private async request(path: string): Promise<unknown> {
    const cached = this.etags.get(path);
    const headers: Record<string, string> = {
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'Hikari-official-site',
    };
    if (this.options.token) headers.Authorization = `Bearer ${this.options.token}`;
    if (cached) headers['If-None-Match'] = cached.etag;
    const response = await this.fetcher(`https://api.github.com/repos/${REPOSITORY}/${path}`, {
      headers,
      cache: 'no-store',
      redirect: 'error',
      signal: AbortSignal.timeout(8000),
    });
    if (response.status === 304 && cached) return cached.body;
    if (response.status === 404 && path === 'releases/latest') return null;
    if (!response.ok) {
      if (response.status === 403 || response.status === 429) {
        const reset = Number(response.headers.get('x-ratelimit-reset')) * 1000;
        const retry = Number(response.headers.get('retry-after')) * 1000;
        this.retryAt = Math.max(
          this.retryAt,
          Math.min(this.now() + 3_600_000, Math.max(reset || 0, this.now() + (retry || 60_000)))
        );
      }
      throw new Error(`GitHub HTTP ${response.status}`);
    }
    // Bound the streamed body too, rather than trusting Content-Length.
    const reader = response.body?.getReader();
    if (!reader) throw new Error('Empty GitHub response');
    const chunks: Uint8Array[] = [];
    let bytes = 0;
    try {
      while (true) {
        const result = await reader.read();
        if (result.done) break;
        bytes += result.value.byteLength;
        if (bytes > 4_000_000) {
          await reader.cancel();
          throw new Error('GitHub response too large');
        }
        chunks.push(result.value);
      }
    } finally {
      reader.releaseLock();
    }
    const body: unknown = JSON.parse(Buffer.concat(chunks).toString('utf8'));
    const etag = response.headers.get('etag');
    if (etag) this.etags.set(path, { etag, body });
    return body;
  }
  private async refresh(): Promise<ReleaseState> {
    if (!this.loaded) {
      this.loaded = true;
      try {
        const stored = snapshotSchema.parse(await this.options.store.read());
        if (stored.checkedAt > this.now() + 60_000) throw new Error('Future snapshot');
        if (stored.latest) {
          validateRelease(stored.latest);
          if (stored.latest.draft || stored.latest.prerelease)
            throw new Error('Stored latest is not stable');
        }
        stored.releases.forEach((r) => {
          validateRelease(r);
          if (r.draft || r.prerelease) throw new Error('Stored history is not stable');
        });
        this.snapshot = stored;
      } catch {
        /* Missing/corrupt disk cache: fetch official data. */
      }
    }
    if (
      (this.snapshot.checkedAt &&
        this.now() - this.snapshot.checkedAt < REFRESH_MS &&
        !this.failed) ||
      (this.attempted && this.now() < this.retryAt)
    )
      return this.state();
    this.attempted = true;
    this.retryAt = this.now() + 60_000;
    try {
      const [latestData, firstPage] = await Promise.all([
        this.request('releases/latest'),
        this.request('releases?per_page=100&page=1'),
      ]);
      const latest = latestData === null ? null : validateRelease(latestData);
      if (latest?.draft || latest?.prerelease) throw new Error('Latest is not stable');
      const releases: Release[] = [];
      let data = firstPage;
      for (let page = 1; page <= 20; page++) {
        const raw = z.array(z.unknown()).max(100).parse(data);
        releases.push(...raw.map(validateRelease).filter((r) => !r.draft && !r.prerelease));
        if (raw.length < 100) break;
        if (page === 20) throw new Error('Release history exceeds safety bound');
        data = await this.request(`releases?per_page=100&page=${page + 1}`);
      }
      const byId = new Map(releases.map((r) => [r.id, r]));
      if (latest) byId.set(latest.id, latest);
      const unique = [...byId.values()];
      unique.sort((a, b) => Date.parse(b.published_at!) - Date.parse(a.published_at!));
      this.snapshot = { version: 1, checkedAt: this.now(), latest, releases: unique };
      this.failed = false;
      try {
        await this.options.store.write(this.snapshot);
      } catch {
        this.options.log?.('releases.cache_write_failed');
      }
    } catch {
      this.failed = true;
      this.options.log?.('releases.refresh_failed (last valid snapshot retained)');
    }
    return this.state();
  }
}
