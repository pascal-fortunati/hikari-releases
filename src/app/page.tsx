import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { getReleases } from '@/lib/releases';
import { DownloadButton, LatestRelease, ReleaseMeta, ReleaseNotice } from '@/components/release-ui';
import { Screenshot } from '@/components/screenshot';
import { Icon } from '@/components/icon';
import { FAQ } from '@/components/faq';
import { AmbientWaves } from '@/components/ambient-waves';
import { SITE_URL } from '@/lib/content';

export const metadata: Metadata = { alternates: { canonical: '/' } };
const modes = [
  {
    number: '01',
    icon: 'auto_fix_high',
    title: 'Automatique',
    label: 'Tu lances l’épisode, Hikari choisit',
    text: 'Définition, cadence, fluidité : Hikari choisit le moteur et ses réglages. Si la Restauration ralentit la lecture, il passe au moteur Rapide.',
    recommended: true,
  },
  {
    number: '02',
    icon: 'speed',
    title: 'Rapide',
    label: 'Le moteur pour la HD',
    text: 'Trois profils — Performance, Balanced et Quality — et deux variantes : Standard pour un rendu fidèle, Sharp pour accentuer les contours. Les sources DVD peuvent être traitées en deux passes.',
  },
  {
    number: '03',
    icon: 'texture',
    title: 'Restauration',
    label: 'Le moteur pour les sources abîmées',
    text: 'Reconstruit les traits et réduit le bruit des vieux animés et des vidéos compressées. En Automatique : agrandissement ×4 jusqu’au 576p, ×2 jusqu’au 720p, si la lecture reste fluide.',
  },
];

export default async function Home() {
  const state = await getReleases();
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Hikari',
    operatingSystem: 'Windows 10, Windows 11 (64 bits)',
    applicationCategory: 'MultimediaApplication',
    url: SITE_URL,
    ...(state.latest ? { softwareVersion: state.latest.tag_name } : {}),
    author: { '@type': 'Person', name: 'Pascal Fortunati', url: 'https://pascal-fortunati.fr' },
  };
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, '\\u003c'),
        }}
      />
      <section className="hero-scene">
        <AmbientWaves />
        <div className="container hero">
          <div className="hero-copy">
            <p className="eyebrow">
              <span className="eyebrow-line" />
              ANIMÉS · MANGAS · WINDOWS
            </p>
            <h1>
              <span>Tes animés.</span>
              <span>Tes mangas.</span>
              <em>Ton appli.</em>
            </h1>
            <p className="hero-description">
              Regarde tes séries en VF ou VOSTFR, lis tes mangas et retrouve les sorties de la
              semaine. Avec <strong>Hikari IA</strong>, améliore l’image de tes épisodes directement
              dans le lecteur.
            </p>
            <div className="hero-actions">
              <DownloadButton release={state.latest} large />
              <a href="#decouvrir" className="btn btn-text btn-lg discover-button">
                Explorer Hikari
                <Icon name="arrow_downward" />
              </a>
            </div>
            <ReleaseMeta release={state.latest} />
            <a className="hero-ia-link" href="#hikari-ia">
              <span className="ia-link-icon">
                <Icon name="memory" />
              </span>
              <span>
                <strong>Hikari IA : deux moteurs dans ton lecteur.</strong>
                <span>Rapide & Restauration · accélérés par NVIDIA RTX</span>
              </span>
              <Icon name="arrow_outward" />
            </a>
          </div>
          <div className="hero-stage" data-tilt data-parallax="0.055">
            <div className="collage-back">
              <Screenshot
                id="catalog-dark"
                alt="Le catalogue réel de Hikari et ses affiches de séries"
                priority
              />
              <span className="collage-label">DÉCOUVRIR.</span>
            </div>
            <div className="collage-main">
              <Screenshot
                id="home-dark"
                alt="Accueil réel de Hikari dans son thème sombre"
                priority
                className="when-dark"
              />
              <Screenshot
                id="home-light"
                alt="Accueil réel de Hikari dans son thème clair"
                priority
                className="when-light"
              />
            </div>
            <div className="collage-player">
              <Screenshot
                id="player"
                alt="Le lecteur vidéo intégré de Hikari, capture officielle"
                priority
              />
              <span>
                <Icon name="play_circle" />
                JUSTE UN ÉPISODE DE PLUS.
              </span>
            </div>
            <div className="collage-note">
              <Image src="/brand/icon.webp" alt="" width={256} height={241} />
              <span>
                Pas besoin de chercher.<small>Ton épisode reprend à la bonne seconde.</small>
              </span>
            </div>
            <div className="stage-index" aria-hidden="true">
              <span>REGARDER.</span>
              <span>LIRE.</span>
              <span>RECOMMENCER.</span>
            </div>
          </div>
          <div className="hero-bottom">
            <a href="#decouvrir" className="scroll-invitation">
              <Icon name="south" />
              <span>CE QU’IL Y A DANS HIKARI</span>
            </a>
            <LatestRelease release={state.latest} />
          </div>
        </div>
        <div className="container">
          <ReleaseNotice state={state} />
        </div>
      </section>
      <div className="benefit-strip">
        <div className="container">
          <span>
            <Icon name="desktop_windows" />
            Pensé pour Windows
          </span>
          <span>
            <Icon name="video_library" />
            Animés & mangas réunis
          </span>
          <span>
            <Icon name="memory" />
            Le moteur Hikari IA
          </span>
          <span>
            <Icon name="lock_outline" />
            Sans compte Hikari
          </span>
        </div>
      </div>
      <section className="section container experience-section" id="decouvrir">
        <div className="section-heading" data-reveal>
          <div>
            <p className="eyebrow">01 / REGARDER, LIRE, RETROUVER</p>
            <h2>
              Tout ce que tu suis.
              <br />
              <em>Dans la même appli.</em>
            </h2>
          </div>
          <p>
            Animés, mangas, favoris et reprise de lecture.
            <br />
            Tu peux fermer Hikari. Il retient où tu en es.
          </p>
        </div>
        <div className="experience-grid">
          <article className="card experience-card anime-card" data-reveal>
            <div className="experience-card-copy">
              <span className="feature-category">
                <Icon name="video_library" />
                ANIMÉS · VF / VOSTFR
              </span>
              <h3>
                Saisons, films, OAV.
                <br />
                <em>Enfin regroupés.</em>
              </h3>
              <p>
                Les saisons d’une série restent ensemble, dans l’ordre chronologique. Avec les
                résumés, les personnages, les vignettes d’épisodes et les langues disponibles.
              </p>
              <Link href="/captures" className="text-link">
                Parcourir les captures
                <Icon name="arrow_outward" />
              </Link>
            </div>
            <div className="anime-card-art">
              <Screenshot
                id="detail-dark"
                alt="Fiche réelle Hikari regroupant les saisons d’une série"
              />
            </div>
          </article>
          <article className="card experience-card manga-card" data-reveal>
            <span className="feature-category">
              <Icon name="auto_stories" />
              MANGAS & WEBTOONS
            </span>
            <div className="manga-art" aria-hidden="true">
              <span className="book-page page-one" />
              <span className="book-page page-two" />
              <span className="book-page page-three" />
              <Icon name="auto_stories" />
            </div>
            <h3>
              Encore
              <br />
              <em>un chapitre.</em>
            </h3>
            <p>
              Lecture japonaise ou française, double page sur grand écran, défilement webtoon :
              Hikari choisit le mode adapté et retient ta page. Les nouveaux chapitres sont sur
              l’accueil, avec un lien entre chaque animé et son manga quand il existe.
            </p>
            <div className="reading-modes">
              <span>Manga</span>
              <span>Double page</span>
              <span>Webtoon</span>
            </div>
          </article>
          <article className="card experience-card player-card" data-reveal>
            <div className="player-card-art">
              <Screenshot id="player" alt="Capture officielle du lecteur natif de Hikari" />
            </div>
            <div className="player-card-copy">
              <span className="feature-category">
                <Icon name="play_circle" />
                LECTEUR NATIF
              </span>
              <h3>
                Lance <em>l’épisode.</em>
              </h3>
              <p>
                Reprise à la seconde près, épisodes qui s’enchaînent, audio et sous-titres
                réglables. Passe l’opening quand les repères sont disponibles. La touche P garde la
                vidéo dans une petite fenêtre au-dessus de tes autres applis.
              </p>
            </div>
          </article>
          <article className="card experience-card everyday-card" data-reveal>
            <span className="feature-category">
              <Icon name="bookmark_added" />
              RECHERCHE & SUIVI
            </span>
            <h3>
              Tu cherches quoi ?
              <br />
              <em>Ctrl + K.</em>
            </h3>
            <div className="everyday-list">
              <div>
                <Icon name="history" />
                <span>
                  <strong>Une recherche pour les deux catalogues.</strong>
                  <span>Animés et mangas apparaissent dans les mêmes résultats.</span>
                </span>
              </div>
              <div>
                <Icon name="calendar_month" />
                <span>
                  <strong>Ton historique, au bon endroit.</strong>
                  <span>Épisode, chapitre, page : la progression est enregistrée.</span>
                </span>
              </div>
              <div>
                <Icon name="favorite_border" />
                <span>
                  <strong>Au clavier ou à la télécommande.</strong>
                  <span>Flèches pour naviguer, Entrée pour ouvrir, Retour pour revenir.</span>
                </span>
              </div>
            </div>
          </article>
        </div>
      </section>
      <section className="section container planning-section" id="planning">
        <div className="planning-copy" data-reveal>
          <p className="eyebrow">02 / LE PLANNING DES ANIMÉS</p>
          <h2>
            Ça sort quand ?
            <br />
            <em>Regarde ton planning.</em>
          </h2>
          <p>
            Les diffusions de la semaine, jour par jour, directement dans Hikari. Tes favoris sont
            signalés et les séries présentes dans le catalogue s’ouvrent d’un clic.
          </p>
          <p className="small muted">
            Les horaires de diffusion au Japon sont convertis à ton heure locale. La disponibilité
            des épisodes dans Hikari dépend ensuite des sources.
          </p>
        </div>
        <div className="planning-overview" data-reveal>
          <div className="planning-overview-heading">
            <Icon name="calendar_month" />
            <span>Ta semaine d’animés</span>
            <span className="badge badge-soft badge-primary">Lun → Dim</span>
          </div>
          <ol className="planning-week" aria-label="Organisation du planning par jour">
            {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((day) => (
              <li key={day}>{day}</li>
            ))}
          </ol>
          <ul className="planning-features">
            <li>
              <Icon name="filter_list" />
              <span>Affiche tout le planning ou seulement les titres dans Hikari.</span>
            </li>
            <li>
              <Icon name="favorite_border" />
              <span>Repère tes favoris sans parcourir toute la liste.</span>
            </li>
            <li>
              <Icon name="open_in_new" />
              <span>Ouvre la fiche d’une série du catalogue depuis son épisode.</span>
            </li>
          </ul>
        </div>
      </section>
      <section className="intelligence-section" id="hikari-ia">
        <div className="container">
          <div className="intelligence-panel" data-theme="hikari-dark">
            <div className="intelligence-heading" data-reveal>
              <span className="ai-signature">
                <Icon name="memory" />
                Hikari <em>IA</em>
              </span>
              <span className="hardware-label">
                <span className="status status-success" aria-hidden="true" />
                ACCÉLÉRÉ PAR TA NVIDIA RTX
              </span>
            </div>
            <div className="intelligence-main">
              <div className="intelligence-copy" data-reveal>
                <p className="eyebrow">03 / LE MOTEUR HIKARI IA</p>
                <h2>
                  Un vieil animé.
                  <br />
                  Une image
                  <br />
                  <em>plus nette.</em>
                </h2>
                <p>
                  Des contours flous, du bruit, une source qui a mal vieilli ?{' '}
                  <strong>
                    Hikari IA agrandit l’image, reconstruit les traits et réduit le bruit pendant
                    que tu regardes ton épisode.
                  </strong>
                </p>
                <p>
                  Deux moteurs complémentaires, intégrés au lecteur natif : <strong>Rapide</strong>{' '}
                  pour l’amélioration courante et <strong>Restauration</strong> pour les sources
                  plus dégradées. Le traitement tourne sur ta carte NVIDIA RTX via TensorRT, avec
                  une intégration en C++.
                </p>
                <Link href="/hikari-ia" className="text-link">
                  Comment fonctionne Hikari IA ?
                  <Icon name="arrow_outward" />
                </Link>
              </div>
              <div className="intelligence-visual" data-reveal>
                <div className="image-mat" data-parallax="0.035">
                  <Screenshot
                    id="player"
                    alt="Le lecteur vidéo natif de Hikari et ses commandes intégrées"
                  />
                  <span className="image-mat-caption">
                    L’AMÉLIORATION SE FAIT PENDANT LA LECTURE.
                  </span>
                </div>
                <ol className="processing-flow" aria-label="Fonctionnement du moteur Hikari IA">
                  <li>
                    <Icon name="movie" />
                    <span>Vidéo source</span>
                  </li>
                  <li aria-hidden="true">
                    <Icon name="east" />
                  </li>
                  <li className="processing-engine">
                    <Icon name="memory" />
                    <span>Hikari IA · GPU</span>
                  </li>
                  <li aria-hidden="true">
                    <Icon name="east" />
                  </li>
                  <li>
                    <Icon name="monitor" />
                    <span>Ton écran</span>
                  </li>
                </ol>
              </div>
            </div>
            <div className="ai-modes">
              {modes.map((mode) => (
                <article
                  className={`card ai-mode ${mode.recommended ? 'ai-mode-recommended' : ''}`}
                  key={mode.title}
                  data-reveal
                >
                  <div className="ai-mode-top">
                    <Icon name={mode.icon} />
                    <span>{mode.recommended ? 'RECOMMANDÉ' : mode.number}</span>
                  </div>
                  <h3>{mode.title}</h3>
                  <p className="ai-mode-label">{mode.label}</p>
                  <p>{mode.text}</p>
                </article>
              ))}
            </div>
            <div className="ai-controls" data-reveal>
              <div>
                <Icon name="compare" />
                <h3>Compare avec C.</h3>
                <p>
                  Passe de la lecture standard au moteur Rapide ou Restauration selon les moteurs
                  disponibles. Tu vois ce qui change.
                </p>
              </div>
              <div>
                <Icon name="tune" />
                <h3>Règle le rendu.</h3>
                <p>
                  Lissage des dégradés, grain fin et mise à l’échelle haute qualité : les finitions
                  se règlent pendant la lecture.
                </p>
              </div>
              <div>
                <Icon name="query_stats" />
                <h3>Vérifie ce qui tourne.</h3>
                <p>
                  Le panneau indique le moteur actif. Les statistiques vidéo affichent la définition
                  de sortie, la cadence et les images perdues.
                </p>
              </div>
            </div>
            <details className="ai-setup">
              <summary>Et à la première utilisation ?</summary>
              <p>
                Installe Hikari IA depuis les paramètres du lecteur. Restauration se télécharge
                ensuite en arrière-plan, environ 110 Mo. À la première lecture d’une définition, le
                moteur se prépare pour ta carte : une à trois minutes, avec une progression visible.
                La vidéo continue sans IA en attendant ; le moteur préparé est conservé pour les
                prochaines lectures.
              </p>
            </details>
            <div className="intelligence-footer">
              <span>
                <Icon name="toggle_on" />
                Tu peux désactiver Hikari IA à tout moment.
              </span>
              <p>
                NVIDIA RTX requise pour les moteurs IA. La fluidité et les agrandissements possibles
                dépendent de ta carte, de la source et des traitements. Le lecteur standard
                fonctionne sans RTX.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="section container theme-section">
        <div className="theme-layout">
          <div className="theme-copy" data-reveal>
            <p className="eyebrow">04 / CLAIR OU SOMBRE</p>
            <h2>
              Team clair ?
              <br />
              <em>Team sombre ?</em>
            </h2>
            <p>
              Les deux sont là. Change de thème depuis la barre du haut ; Hikari garde ton choix.
              Voici les deux interfaces de l’application.
            </p>
            <nav
              className="tabs tabs-box theme-tabs"
              aria-label="Aperçus des thèmes"
              role="tablist"
            >
              <button
                type="button"
                className="tab active"
                id="tab-dark"
                data-tab="#preview-dark"
                aria-controls="preview-dark"
                aria-selected="true"
                role="tab"
              >
                <Icon name="dark_mode" />
                Sombre
              </button>
              <button
                type="button"
                className="tab"
                id="tab-light"
                data-tab="#preview-light"
                aria-controls="preview-light"
                aria-selected="false"
                role="tab"
              >
                <Icon name="light_mode" />
                Clair
              </button>
            </nav>
            <Link href="/captures" className="text-link">
              Explorer toutes les captures
              <Icon name="arrow_outward" />
            </Link>
          </div>
          <div className="theme-preview" data-reveal data-parallax="0.035">
            <div className="theme-preview-label">
              <span>UNE INTERFACE, DEUX AMBIANCES.</span>
              <span aria-hidden="true">◐</span>
            </div>
            <div id="preview-dark" role="tabpanel" aria-labelledby="tab-dark">
              <Screenshot id="home-dark" alt="Aperçu du thème Hikari sombre officiel" priority />
            </div>
            <div id="preview-light" className="hidden" role="tabpanel" aria-labelledby="tab-light">
              <Screenshot id="home-light" alt="Aperçu du thème Hikari clair officiel" priority />
            </div>
          </div>
        </div>
      </section>
      <section className="section container faq-section">
        <div data-reveal>
          <p className="eyebrow">05 / LES QUESTIONS PRATIQUES</p>
          <h2>
            Avant de
            <br />
            <em>télécharger.</em>
          </h2>
          <p>
            Windows, installation, données locales.
            <br />
            Les réponses sont ici.
          </p>
          <Link href="/installation" className="text-link">
            Installation et FAQ complète
            <Icon name="arrow_outward" />
          </Link>
        </div>
        <FAQ compact />
      </section>
      <section className="container final-cta">
        <div className="cta-copy">
          <p className="eyebrow">DISPONIBLE SUR WINDOWS 10 & 11 · 64 BITS</p>
          <h2>
            Ton prochain épisode ?
            <br />
            <em>Lance Hikari.</em>
          </h2>
          <p>Animés, mangas, planning et Hikari IA. Sans compte Hikari à créer.</p>
        </div>
        <div className="cta-action">
          <Image src="/brand/icon.webp" width={256} height={241} alt="" />
          <DownloadButton release={state.latest} large />
          <ReleaseMeta release={state.latest} />
        </div>
      </section>
    </>
  );
}
