import Image from 'next/image';
import Link from 'next/link';
import { ThemeButton } from './theme-button';
import { Icon } from './icon';

export function Logo() {
  return (
    <span className="brand">
      <Image
        src="/brand/logo-dark.webp"
        width={160}
        height={60}
        alt="Hikari"
        className="when-dark"
        loading="eager"
      />
      <Image
        src="/brand/logo-light.webp"
        width={160}
        height={60}
        alt="Hikari"
        className="when-light"
        loading="eager"
      />
    </span>
  );
}
export function Header() {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link href="/" aria-label="Hikari, accueil">
          <Logo />
        </Link>
        <div className="navbar header-navigation">
          <nav aria-label="Navigation principale" className="desktop-nav">
            <Link href="/#decouvrir">L’application</Link>
            <Link href="/hikari-ia">
              Hikari IA
              <span className="nav-dot" aria-hidden="true" />
            </Link>
            <Link href="/captures">En images</Link>
            <Link href="/versions">Nouveautés</Link>
          </nav>
        </div>
        <div className="header-actions">
          <ThemeButton />
          <Link href="/telecharger" className="btn btn-primary btn-sm header-download">
            <Icon name="download" />
            Télécharger
          </Link>
          <button
            className="collapse-toggle btn btn-circle btn-text mobile-toggle"
            type="button"
            aria-label="Ouvrir le menu"
            aria-expanded="false"
            aria-controls="mobile-menu"
            data-collapse="#mobile-menu"
          >
            <Icon name="menu" />
          </button>
        </div>
        <nav id="mobile-menu" className="collapse hidden mobile-nav" aria-label="Navigation mobile">
          <Link href="/#decouvrir">Découvrir Hikari</Link>
          <Link href="/hikari-ia">Hikari IA</Link>
          <Link href="/captures">Captures</Link>
          <Link href="/versions">Nouveautés</Link>
          <Link href="/installation">Installation et FAQ</Link>
          <Link href="/telecharger">Télécharger pour Windows</Link>
        </nav>
      </div>
    </header>
  );
}
