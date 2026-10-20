import type { Metadata } from 'next';
import Link from 'next/link';
import { getReleases } from '@/lib/releases';
import { officialAsset, RELEASES_URL } from '@/lib/release-cache';
import { ReleaseDate, ReleaseNotice } from '@/components/release-ui';
import { Markdown } from '@/components/markdown';
import { Icon } from '@/components/icon';
import { PageIntro, PageStamp } from '@/components/page-intro';
export const metadata: Metadata = {
  title: 'Nouveautés et versions',
  description:
    'Toutes les nouveautés et les notes des versions stables officielles de Hikari, synchronisées avec GitHub Releases.',
  alternates: { canonical: '/versions' },
};
const perPage = 5;
export default async function VersionsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const state = await getReleases();
  const { page: requested } = await searchParams;
  const pages = Math.max(1, Math.ceil(state.releases.length / perPage));
  const page = Math.min(pages, Math.max(1, Number(requested) || 1)) | 0;
  const releases = state.releases.slice((page - 1) * perPage, page * perPage);
  return (
    <div className="container">
      <PageIntro
        eyebrow="LE JOURNAL DE HIKARI"
        title={
          <>
            Ce qui change.
            <br />
            <em>Version après version.</em>
          </>
        }
        description="Nouveaux moteurs IA, fonctions du lecteur, mangas et corrections : retrouve ce qui a changé dans chaque version de l’application."
        meta={
          <>
            <Icon name="desktop_windows" />
            Versions stables pour Windows
          </>
        }
      >
        <PageStamp
          icon="new_releases"
          label="DERNIÈRE VERSION STABLE"
          value={state.latest?.tag_name ?? 'À vérifier'}
        >
          {state.latest ? <ReleaseDate release={state.latest} /> : 'Consulter GitHub'}
        </PageStamp>
      </PageIntro>
      <div className="page-content versions-content">
        <ReleaseNotice state={state} />
        <div className="page-section-label">
          <p className="eyebrow">HISTORIQUE DES PUBLICATIONS</p>
          <span>
            {state.releases.length} version{state.releases.length > 1 ? 's' : ''} stable
            {state.releases.length > 1 ? 's' : ''}
          </span>
        </div>
        <div className="version-list">
          {releases.map((release) => {
            const asset = officialAsset(release);
            return (
              <article
                className={`card version-card ${release.id === state.latest?.id ? 'version-card-latest' : ''}`}
                key={release.id}
                id={release.tag_name}
                data-reveal
              >
                <div className="version-meta">
                  <h2>{release.tag_name}</h2>
                  <ReleaseDate release={release} />
                  {release.id === state.latest?.id && (
                    <span className="badge badge-soft badge-success">Dernière version</span>
                  )}
                </div>
                <div className="version-detail">
                  <Markdown>
                    {release.body || 'Les notes de cette version sont disponibles sur GitHub.'}
                  </Markdown>
                  <div className="version-links">
                    {asset && (
                      <a className="btn btn-primary btn-sm" href={asset.browser_download_url}>
                        <Icon name="download" />
                        Télécharger cette version
                      </a>
                    )}
                    <a href={release.html_url} className="text-link">
                      Voir sur GitHub
                      <Icon name="open_in_new" />
                    </a>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
        {!releases.length && (
          <div className="card download-card">
            <p>Consulte les dernières versions de Hikari sur GitHub.</p>
            <a className="text-link mt-4" href={RELEASES_URL}>
              Consulter les releases officielles
              <Icon name="open_in_new" />
            </a>
          </div>
        )}
        {pages > 1 && (
          <nav className="pagination" aria-label="Pages des versions">
            {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
              <Link
                key={n}
                className={`btn btn-sm ${n === page ? 'btn-primary' : 'btn-outline'}`}
                href={`/versions?page=${n}`}
                aria-label={`Page ${n}`}
                aria-current={n === page ? 'page' : undefined}
              >
                {n}
              </Link>
            ))}
          </nav>
        )}
        <a className="text-link mt-3" href={RELEASES_URL}>
          Toutes les publications sur GitHub
          <Icon name="open_in_new" />
        </a>
      </div>
    </div>
  );
}
