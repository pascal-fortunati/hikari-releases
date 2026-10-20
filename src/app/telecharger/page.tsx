import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getReleases } from '@/lib/releases';
import { checksum, officialAsset, RELEASES_URL } from '@/lib/release-cache';
import { DownloadButton, ReleaseDate, ReleaseMeta, ReleaseNotice } from '@/components/release-ui';
import { Icon } from '@/components/icon';
import { PageIntro } from '@/components/page-intro';
export const metadata: Metadata = {
  title: 'Télécharger pour Windows',
  description:
    'Téléchargez la dernière version stable de Hikari.exe depuis GitHub. Installation, configuration requise et vérification SHA-256.',
  alternates: { canonical: '/telecharger' },
};
export default async function DownloadPage() {
  const state = await getReleases();
  const release = state.latest;
  const asset = officialAsset(release);
  const sums = officialAsset(release, 'SHA256SUMS.txt');
  const digest = checksum(asset);
  return (
    <div className="container">
      <PageIntro
        eyebrow="TON PROCHAIN ÉPISODE COMMENCE ICI"
        title={
          <>
            Télécharge Hikari.
            <br />
            <em>Et lance-toi.</em>
          </>
        }
        description="Animés, mangas, planning et Hikari IA. Retrouve le fichier officiel pour Windows, les prérequis et les étapes d’installation."
        meta={
          <>
            <Icon name="desktop_windows" />
            Windows 10 / 11 · 64 bits
          </>
        }
      >
        <div className="download-brand-display">
          <Image src="/brand/icon.webp" width={256} height={241} alt="" loading="eager" />
          <span>HIKARI POUR WINDOWS</span>
          <strong>{release?.tag_name ?? 'Version officielle'}</strong>
        </div>
      </PageIntro>
      <ReleaseNotice state={state} />
      <div className="page-content download-layout">
        <section className="card download-card" data-reveal>
          <Image
            className="brand-icon"
            src="/brand/icon.webp"
            width={256}
            height={241}
            alt="Logo Hikari"
          />
          <span className="badge badge-soft badge-success">
            {release ? `Version stable · ${release.tag_name}` : 'Version à vérifier sur GitHub'}
          </span>
          <h2>Hikari pour Windows</h2>
          {release && (
            <span className="download-date">
              Publiée le <ReleaseDate release={release} />
            </span>
          )}
          <ReleaseMeta release={release} />
          {!asset && (
            <div className="alert alert-soft alert-warning info-alert" role="status">
              <Icon name="info" />
              <span>
                Aucun fichier Hikari.exe officiel valide n’est actuellement disponible dans les
                données synchronisées. Consultez la release GitHub.
              </span>
            </div>
          )}
          <DownloadButton release={release} large />
          <div className="download-links">
            <a className="text-link" href={release?.html_url ?? RELEASES_URL}>
              Release officielle
              <Icon name="open_in_new" />
            </a>
            <Link className="text-link" href="/versions">
              Notes de version
              <Icon name="arrow_forward" />
            </Link>
          </div>
          <div className="requirements">
            <h3>Configuration requise</h3>
            <dl>
              <dt>Système</dt>
              <dd>Windows 10 ou 11 · 64 bits</dd>
              <dt>Connexion</dt>
              <dd>Internet pour le catalogue et la lecture</dd>
              <dt>Lecteur vidéo</dt>
              <dd>Composant à installer au premier usage, environ 70 Mo</dd>
              <dt>Hikari IA</dt>
              <dd>Optionnel · carte NVIDIA RTX requise</dd>
            </dl>
          </div>
          {(digest || sums) && (
            <div className="checksum">
              <strong>Vérifier l’intégrité du téléchargement</strong>
              {digest && (
                <>
                  <span className="small muted">SHA-256 de Hikari.exe, publié par GitHub :</span>
                  <p>
                    <code>{digest}</code>
                  </p>
                </>
              )}
              {sums && (
                <a className="text-link mt-3" href={sums.browser_download_url}>
                  Télécharger SHA256SUMS.txt
                  <Icon name="download" />
                </a>
              )}
              <pre>
                <code>Get-FileHash .\Hikari.exe -Algorithm SHA256</code>
              </pre>
              <p className="small muted mt-2">
                Dans PowerShell, exécutez cette commande dans le dossier du fichier. Comparez
                l’empreinte complète avec celle publiée.
              </p>
            </div>
          )}
        </section>
        <section className="install-copy" data-reveal>
          <p className="eyebrow">DE L’INSTALLATION À LA LECTURE</p>
          <h2>
            Installe Hikari.
            <br />
            <em>Lance ton épisode.</em>
          </h2>
          <ol className="install-steps">
            <li>
              <div>
                <h3>Télécharge le fichier officiel.</h3>
                <p>Télécharge Hikari.exe depuis la version officielle pour Windows.</p>
              </div>
            </li>
            <li>
              <div>
                <h3>Choisis ton dossier.</h3>
                <p>Place Hikari.exe dans le dossier de ton choix, puis lance-le.</p>
              </div>
            </li>
            <li>
              <div>
                <h3>Lance l’application.</h3>
                <p>
                  Au premier lancement, le catalogue et les images s’enrichissent en arrière-plan. À
                  la première lecture, installez le moteur vidéo depuis les paramètres.
                </p>
              </div>
            </li>
          </ol>
          <div className="alert alert-soft alert-warning info-alert">
            <Icon name="verified_user" />
            <div>
              <strong>Un exécutable pas encore signé.</strong>
              <p>
                Windows peut afficher une alerte SmartScreen. Vérifiez la provenance GitHub et
                l’empreinte SHA-256 avant de décider de l’exécuter. Si un doute subsiste,
                interrompez l’installation.
              </p>
            </div>
          </div>
          <div className="requirements">
            <h3>Et pour Hikari IA ?</h3>
            <p className="small muted">
              Les composants IA se téléchargent séparément depuis l’application. Le moteur
              Restauration ajoute environ 110 Mo et se prépare pour votre GPU à la première
              utilisation d’une définition. La lecture standard reste disponible pendant cette
              préparation.
            </p>
          </div>
          <Link href="/installation" className="text-link mt-6">
            Consulter le guide et la FAQ
            <Icon name="arrow_forward" />
          </Link>
        </section>
      </div>
    </div>
  );
}
