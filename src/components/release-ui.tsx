import Link from 'next/link';
import { Icon } from './icon';
import { officialAsset, RELEASES_URL, type Release, type ReleaseState } from '@/lib/release-cache';
import { dateLabel, sizeLabel } from '@/lib/content';

export function DownloadButton({
  release,
  large = false,
}: {
  release: Release | null;
  large?: boolean;
}) {
  const asset = officialAsset(release);
  return (
    <a
      className={`btn btn-primary download-button ${large ? 'btn-lg' : ''}`}
      href={asset?.browser_download_url ?? RELEASES_URL}
    >
      <Icon name={asset ? 'download' : 'open_in_new'} />
      {asset ? 'Télécharger pour Windows' : 'Voir les versions sur GitHub'}
    </a>
  );
}
export function ReleaseMeta({ release }: { release: Release | null }) {
  const asset = officialAsset(release);
  return (
    <p className="release-meta">
      <Icon name="desktop_windows" />
      Windows 10 / 11 · 64 bits
      {release && (
        <>
          {' '}
          <span aria-hidden="true">·</span> {release.tag_name}
          {asset && <> · {sizeLabel(asset.size)}</>}
        </>
      )}
    </p>
  );
}
export function ReleaseNotice({ state }: { state: ReleaseState }) {
  if (!state.stale && !state.unavailable) return null;
  return (
    <div className="alert alert-soft alert-warning release-notice" role="status">
      <Icon name="info" />
      <span>
        {state.unavailable
          ? 'Les versions GitHub sont momentanément indisponibles.'
          : 'La synchronisation GitHub est momentanément indisponible. Les dernières informations vérifiées sont conservées.'}{' '}
        <a className="link" href={RELEASES_URL}>
          Consulter GitHub
        </a>
      </span>
    </div>
  );
}
export function LatestRelease({ release }: { release: Release | null }) {
  if (!release) return null;
  return (
    <Link href="/versions" className="latest-pill">
      <span className="status status-success" aria-hidden="true" />
      <span>{release.tag_name} est disponible</span>
      <span className="pill-divider" />
      <span className="muted">Les nouveautés</span>
      <Icon name="arrow_forward" />
    </Link>
  );
}
export function ReleaseDate({ release }: { release: Release }) {
  return (
    <time dateTime={release.published_at ?? undefined}>{dateLabel(release.published_at)}</time>
  );
}
