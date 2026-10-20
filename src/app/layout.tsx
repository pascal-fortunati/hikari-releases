import type { Metadata } from 'next';
import '@fontsource-variable/manrope';
import '@fontsource-variable/fraunces/opsz.css';
import '@fontsource-variable/fraunces/opsz-italic.css';
import 'material-icons/iconfont/round.css';
import './globals.css';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Flyon } from '@/components/flyon';
import { ExperienceMotion } from '@/components/experience-motion';
import { getReleases } from '@/lib/releases';
import { SITE_URL } from '@/lib/content';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: 'Hikari — Vos animés et mangas sur Windows', template: '%s · Hikari' },
  description:
    'Animés en VF et VOSTFR, mangas, planning hebdomadaire et lecteur natif avec deux moteurs Hikari IA sur NVIDIA RTX. Découvre Hikari pour Windows.',
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    siteName: 'Hikari',
    title: 'Hikari — Animés, mangas, planning et Hikari IA',
    description:
      'Tes animés, tes mangas, le planning des sorties et deux moteurs IA pour améliorer l’image. Dans la même application Windows.',
    images: [
      {
        url: '/opengraph-image.png',
        width: 1200,
        height: 630,
        alt: 'Hikari et son interface officielle',
      },
    ],
  },
  twitter: { card: 'summary_large_image' },
};
const themeScript = `(function(){var t;try{t=localStorage.getItem('hikari-theme')}catch(e){}if(t!=='hikari-dark'&&t!=='hikari-light')t=matchMedia('(prefers-color-scheme: light)').matches?'hikari-light':'hikari-dark';document.documentElement.dataset.theme=t})()`;
export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const state = await getReleases();
  return (
    <html lang="fr" data-theme="hikari-dark" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <a className="skip-link" href="#contenu">
          Aller au contenu
        </a>
        <Header />
        <main id="contenu">{children}</main>
        <Footer version={state.latest?.tag_name} />
        <Flyon />
        <ExperienceMotion />
      </body>
    </html>
  );
}
