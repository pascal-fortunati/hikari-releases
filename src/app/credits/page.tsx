import type { Metadata } from 'next';
import { PageIntro, PageStamp } from '@/components/page-intro';
export const metadata: Metadata = {
  title: 'Crédits et licences',
  description:
    'Les composants, projets et services qui contribuent à Hikari et à son site officiel.',
  alternates: { canonical: '/credits' },
};
export default function CreditsPage() {
  return (
    <div className="container">
      <PageIntro
        eyebrow="LES PROJETS DERRIÈRE HIKARI"
        title={
          <>
            Du code.
            <br />
            <em>Et des contributions.</em>
          </>
        }
        description="Les projets, outils et services qui contribuent à Hikari. Leurs auteurs, leurs crédits et leurs licences."
      >
        <PageStamp icon="code" label="DÉVELOPPEMENT & INTÉGRATION" value="Hikari">
          Par Pascal Fortunati.
        </PageStamp>
      </PageIntro>
      <nav className="document-nav" aria-label="Sommaire des crédits">
        <a href="#application">Application & IA</a>
        <a href="#metadonnees">Métadonnées</a>
        <a href="#site">Site officiel</a>
      </nav>
      <div className="page-content article-width document-content">
        <section id="application" data-reveal>
          <h2>Hikari et Hikari IA</h2>
          <p>
            Hikari est développé par Pascal Fortunati. L’intégration native, l’orchestration et les
            optimisations propres à Hikari ne constituent pas une revendication de création de
            l’ensemble des modèles neuronaux utilisés.
          </p>
          <ul>
            <li>
              <a href="https://mpv.io/">mpv / libmpv</a> : lecture multimédia. Les conditions de
              licence du build distribué et de ses dépendances s’appliquent.
            </li>
            <li>
              <a href="https://github.com/the-database/mpv-AnimeJaNai/releases/tag/3.7.0">
                mpv-AnimeJaNai 3.7.0
              </a>{' '}
              et{' '}
              <a href="https://github.com/the-database/mpv-winbuild/releases/tag/2026-10-07-d6d93599d5">
                build libmpv associé
              </a>{' '}
              : composants du moteur de lecture et d’inférence.
            </li>
            <li>
              <a href="https://github.com/bilibili/ailab/tree/main/Real-CUGAN">
                Real-CUGAN, bilibili
              </a>{' '}
              : modèles de restauration, licence MIT. Les crédits et licences sont également fournis
              avec le composant Restauration téléchargé par l’application.
            </li>
            <li>
              <a href="https://developer.nvidia.com/tensorrt">NVIDIA TensorRT</a> : accélération de
              l’inférence, soumise aux conditions de NVIDIA.
            </li>
            <li>
              <a href="https://wails.io/">Wails</a>, <a href="https://go.dev/">Go</a> et{' '}
              <a href="https://react.dev/">React</a> : socle de l’application Windows.
            </li>
          </ul>
          <p>
            Ce site ne redistribue aucun exécutable ni modèle. Les téléchargements pointent vers les
            releases officielles ; les licences complètes des composants doivent être consultées
            dans leurs distributions respectives.
          </p>
        </section>
        <section id="metadonnees" data-reveal>
          <h2>Métadonnées et contenus</h2>
          <p>
            Ce produit utilise l’API <a href="https://www.themoviedb.org/">TMDB</a>, sans être
            approuvé ni certifié par TMDB. Les correspondances de titres s’appuient également sur{' '}
            <a href="https://github.com/Fribb/anime-lists">Fribb/anime-lists</a>.
          </p>
          <p>
            Les visuels d’œuvres visibles dans les captures restent la propriété de leurs ayants
            droit. Hikari n’héberge aucune vidéo. La disponibilité des contenus dépend des services
            tiers ; accédez uniquement aux contenus pour lesquels vous disposez des autorisations
            nécessaires.
          </p>
        </section>
        <section id="site" data-reveal>
          <h2>Le site officiel</h2>
          <ul>
            <li>
              <a href="https://nextjs.org/">Next.js</a>, React,{' '}
              <a href="https://tailwindcss.com/">Tailwind CSS</a> et{' '}
              <a href="https://flyonui.com/">FlyonUI</a> : licences MIT.
            </li>
            <li>
              <a href="https://github.com/google/material-design-icons">Material Icons</a> : licence
              Apache 2.0.
            </li>
            <li>
              <a href="https://github.com/sharanda/manrope">Manrope</a> et{' '}
              <a href="https://github.com/undercasetype/Fraunces">Fraunces</a> : SIL Open Font
              License 1.1.
            </li>
          </ul>
          <p>
            Le logo et les thèmes proviennent de l’application Hikari. Les captures sont celles
            publiées dans le{' '}
            <a href="https://github.com/pascal-fortunati/hikari-releases">dépôt public officiel</a>.
          </p>
          <p>
            Les textes complets des licences et les notices des dépendances du site sont disponibles
            dans le <a href="/THIRD_PARTY_NOTICES.txt">fichier des notices tierces</a>.
          </p>
        </section>
      </div>
    </div>
  );
}
