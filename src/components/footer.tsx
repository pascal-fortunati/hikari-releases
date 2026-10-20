import Link from 'next/link';
import { Logo } from './header';
import { GITHUB_URL } from '@/lib/release-cache';
import { AmbientWaves } from './ambient-waves';

export function Footer({ version }: { version?: string }) {
  return (
    <footer className="site-footer">
      <AmbientWaves variant="footer" />
      <div className="container">
        <div className="footer-top">
          <div>
            <Link href="/" aria-label="Hikari, accueil">
              <Logo />
            </Link>
            <p>Animés. Mangas. Hikari.</p>
            <span className="small muted">
              Ton catalogue, ton planning et ton lecteur sur Windows.
            </span>
          </div>
          <nav aria-label="Liens utiles">
            <Link href="/hikari-ia">Hikari IA · Fonctionnement</Link>
            <Link href="/telecharger">Télécharger{version ? ` · ${version}` : ''}</Link>
            <Link href="/versions">Historique des versions</Link>
            <Link href="/installation">Installation et FAQ</Link>
          </nav>
          <nav aria-label="À propos">
            <a href={GITHUB_URL}>GitHub officiel ↗</a>
            <a href="https://pascal-fortunati.fr">Pascal Fortunati ↗</a>
            <Link href="/credits">Crédits et licences</Link>
            <Link href="/mentions-legales">Mentions et confidentialité</Link>
          </nav>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Pascal Fortunati · Hikari</span>
          <span>Lecteur natif · Planning des animés · Hikari IA</span>
        </div>
      </div>
    </footer>
  );
}
