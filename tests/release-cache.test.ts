import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  ReleaseCache,
  REFRESH_MS,
  officialAsset,
  checksum,
  validateRelease,
  type Release,
  type SnapshotStore,
} from '../src/lib/release-cache';

const root = 'https://github.com/pascal-fortunati/hikari-releases/releases';
function release(tag = 'v1.0.0', id = 1): Release {
  return {
    id,
    tag_name: tag,
    name: 'Hikari',
    body: '## Nouveautés\n\n- Une amélioration.',
    html_url: `${root}/tag/${tag}`,
    published_at: '2026-10-19T09:00:00Z',
    draft: false,
    prerelease: false,
    assets: [
      {
        name: 'Hikari.exe',
        size: 15000000,
        browser_download_url: `${root}/download/${tag}/Hikari.exe`,
        digest: `sha256:${'a'.repeat(64)}`,
      },
    ],
  };
}
function harness() {
  let clock = Date.parse('2026-10-20T12:00:00Z');
  let current: Release | null = release();
  let history = [current!];
  let saved: unknown;
  let status = 200;
  let calls = 0;
  let etag = '"first"';
  let rateReset: string | undefined;
  const requests: RequestInit[] = [];
  const store: SnapshotStore = {
    async read() {
      return saved;
    },
    async write(value) {
      saved = structuredClone(value);
    },
  };
  const fetcher: typeof fetch = async (url, init) => {
    calls++;
    requests.push(init!);
    const latest = String(url).endsWith('/latest');
    if (status !== 200)
      return new Response(null, {
        status,
        headers: rateReset ? { 'x-ratelimit-reset': rateReset } : {},
      });
    if ((init?.headers as Record<string, string>)['If-None-Match'] === etag)
      return new Response(null, { status: 304 });
    return Response.json(latest ? current : history, { headers: { etag } });
  };
  return {
    store,
    fetcher,
    now: () => clock,
    advance: (ms = REFRESH_MS) => {
      clock += ms;
    },
    setCurrent: (r: Release | null) => {
      current = r;
      history = r ? [r, ...history] : [];
      etag = `"${clock}"`;
    },
    setHistory: (r: Release[]) => {
      history = r;
    },
    fail: (code = 500, reset?: number) => {
      status = code;
      rateReset = reset?.toString();
    },
    calls: () => calls,
    requests,
    saved: () => saved,
    corrupt: (value: unknown) => {
      saved = value;
    },
  };
}

test('validates the public release and strictly selects Hikari.exe', () => {
  const r = validateRelease(release());
  assert.equal(officialAsset(r)?.name, 'Hikari.exe');
  assert.equal(checksum(officialAsset(r)), 'a'.repeat(64));
  assert.throws(() => validateRelease({ ...r, html_url: 'https://evil.test' }));
  assert.throws(() => validateRelease({ ...r, published_at: null }));
  assert.throws(() => validateRelease({ ...r, tag_name: '../evil' }));
});
test('rejects missing, empty, foreign and mismatched executable URLs', () => {
  const r = release();
  for (const url of [
    'http://github.com/pascal-fortunati/hikari-releases/releases/download/v1.0.0/Hikari.exe',
    'https://evil.test/Hikari.exe',
    `${root}/download/v2.0.0/Hikari.exe`,
    `${root}/download/v1.0.0/Hikari.exe?x=1`,
  ]) {
    assert.equal(
      officialAsset({ ...r, assets: [{ ...r.assets[0], browser_download_url: url }] }),
      null
    );
  }
  assert.equal(officialAsset({ ...r, assets: [] }), null);
  assert.equal(officialAsset({ ...r, assets: [{ ...r.assets[0], size: 0 }] }), null);
  assert.equal(officialAsset({ ...r, prerelease: true }), null);
  assert.equal(officialAsset({ ...r, draft: true }), null);
  assert.equal(checksum({ ...r.assets[0], digest: 'sha256:invalid' }), null);
});
test('coalesces simultaneous visitors and caches the two GitHub requests for five minutes', async () => {
  const h = harness();
  const cache = new ReleaseCache(h);
  const results = await Promise.all(Array.from({ length: 30 }, () => cache.get()));
  assert.equal(h.calls(), 2);
  assert.ok(results.every((r) => r.latest?.tag_name === 'v1.0.0' && !r.stale));
  h.advance(REFRESH_MS - 1);
  await cache.get();
  assert.equal(h.calls(), 2);
  h.advance(1);
  await cache.get();
  assert.equal(h.calls(), 4);
  assert.ok(
    h.requests[2].headers && (h.requests[2].headers as Record<string, string>)['If-None-Match']
  );
});
test('discovers a new official release and its executable without rebuilding', async () => {
  const h = harness();
  const cache = new ReleaseCache(h);
  await cache.get();
  h.advance();
  h.setCurrent(release('v1.1.0', 2));
  const next = await cache.get();
  assert.equal(next.latest?.tag_name, 'v1.1.0');
  assert.equal(
    officialAsset(next.latest)?.browser_download_url,
    `${root}/download/v1.1.0/Hikari.exe`
  );
  assert.equal(next.releases.length, 2);
  assert.equal(next.stale, false);
});
test('keeps the last valid snapshot through network errors and across process restarts', async () => {
  const h = harness();
  const first = new ReleaseCache(h);
  await first.get();
  h.advance();
  h.fail();
  const restarted = new ReleaseCache(h);
  const state = await restarted.get();
  assert.equal(state.latest?.tag_name, 'v1.0.0');
  assert.equal(state.stale, true);
  assert.equal(state.unavailable, false);
  const count = h.calls();
  await restarted.get();
  assert.equal(h.calls(), count);
  h.advance(60_000);
  await restarted.get();
  assert.equal(h.calls(), count + 2);
});
test('recovers a fresh cache from disk without calling GitHub', async () => {
  const h = harness();
  await new ReleaseCache(h).get();
  const count = h.calls();
  const state = await new ReleaseCache(h).get();
  assert.equal(h.calls(), count);
  assert.equal(state.stale, false);
});
test('does not replace valid data with malformed GitHub responses', async () => {
  const h = harness();
  const cache = new ReleaseCache(h);
  await cache.get();
  const saved = h.saved();
  h.advance();
  h.setCurrent({ ...release(), html_url: 'https://evil.test' });
  const state = await cache.get();
  assert.equal(state.latest?.html_url, `${root}/tag/v1.0.0`);
  assert.equal(state.stale, true);
  assert.deepEqual(h.saved(), saved);
});
test('filters drafts and prereleases out of the history and rejects a prerelease latest', async () => {
  const h = harness();
  h.setHistory([
    release(),
    { ...release('v2.0.0', 2), prerelease: true },
    { ...release('v3.0.0', 3), draft: true, published_at: null },
  ]);
  const cache = new ReleaseCache(h);
  const state = await cache.get();
  assert.equal(state.releases.length, 1);
  h.advance();
  h.setCurrent({ ...release('v2.0.0', 2), prerelease: true });
  assert.equal((await cache.get()).latest?.tag_name, 'v1.0.0');
});
test('honors rate limit reset and avoids retrying for each visitor', async () => {
  const h = harness();
  h.fail(403, (h.now() + 600_000) / 1000);
  const cache = new ReleaseCache(h);
  const state = await cache.get();
  assert.equal(state.unavailable, true);
  assert.equal(state.latest, null);
  h.advance();
  await cache.get();
  assert.equal(h.calls(), 2);
  h.advance();
  await cache.get();
  assert.equal(h.calls(), 4);
});
test('handles an empty repository without inventing a version or a download', async () => {
  const h = harness();
  const fetcher: typeof fetch = async (url) =>
    String(url).endsWith('/latest') ? new Response(null, { status: 404 }) : Response.json([]);
  const state = await new ReleaseCache({ ...h, fetcher }).get();
  assert.equal(state.latest, null);
  assert.deepEqual(state.releases, []);
  assert.equal(state.unavailable, false);
  assert.equal(officialAsset(state.latest), null);
});
test('keeps usable memory data when writing the snapshot fails', async () => {
  const h = harness();
  const log: string[] = [];
  const cache = new ReleaseCache({
    ...h,
    store: {
      ...h.store,
      async write() {
        throw new Error('readonly');
      },
    },
    log: (m) => log.push(m),
  });
  assert.equal((await cache.get()).latest?.tag_name, 'v1.0.0');
  assert.ok(log.includes('releases.cache_write_failed'));
});
test('rejects corrupt stored URLs and refetches official data', async () => {
  const h = harness();
  h.corrupt({
    version: 1,
    checkedAt: h.now(),
    latest: { ...release(), html_url: 'https://evil.test' },
    releases: [],
  });
  const state = await new ReleaseCache(h).get();
  assert.equal(state.latest?.html_url, `${root}/tag/v1.0.0`);
  assert.equal(h.calls(), 2);
});
test('network timeouts expose an honest unavailable state on a cold start', async () => {
  const h = harness();
  const fetcher: typeof fetch = async () => {
    throw new Error('timeout');
  };
  const state = await new ReleaseCache({ ...h, fetcher }).get();
  assert.equal(state.unavailable, true);
  assert.equal(state.latest, null);
  assert.equal(state.stale, true);
});
test('all requests stay server-side on a fixed API origin, with no automatic redirects', async () => {
  const h = harness();
  await new ReleaseCache({ ...h, token: 'test-only-secret' }).get();
  assert.equal(
    (h.requests[0].headers as Record<string, string>).Authorization,
    'Bearer test-only-secret'
  );
  assert.ok(
    h.requests.every(
      (r) => r.redirect === 'error' && r.cache === 'no-store' && r.signal instanceof AbortSignal
    )
  );
});
test('fetches additional GitHub history pages rather than silently truncating at 100', async () => {
  const h = harness();
  const urls: string[] = [];
  const rows = Array.from({ length: 100 }, (_, i) => release(`v1.0.${i}`, i + 1));
  const fetcher: typeof fetch = async (url) => {
    urls.push(String(url));
    return Response.json(
      String(url).endsWith('/latest')
        ? rows[0]
        : new URL(String(url)).searchParams.get('page') === '1'
          ? rows
          : [release('v0.9.0', 101)]
    );
  };
  const state = await new ReleaseCache({ ...h, fetcher }).get();
  assert.equal(state.releases.length, 101);
  assert.equal(urls.length, 3);
  assert.ok(urls[2].endsWith('page=2'));
});
test('latest notes override an older history entry for the same release', async () => {
  const h = harness();
  h.setHistory([{ ...release(), body: 'old' }]);
  const state = await new ReleaseCache(h).get();
  assert.equal(state.releases[0].body, state.latest?.body);
});
