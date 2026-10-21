import type { Metadata } from 'next';
import Link from 'next/link';
import { Icon } from '@/components/icon';
import { Screenshot } from '@/components/screenshot';

export const metadata: Metadata = {
  title: 'Hikari IA — Le moteur maison, les profils et le traitement GPU',
  description:
    'Un moteur conçu pour les animés, six profils de rendu, des réglages en direct et un choix mémorisé par série. Découvre le fonctionnement de Hikari IA sur NVIDIA RTX.',
  alternates: { canonical: '/hikari-ia' },
};

const chapters = [
  ['moteurs', 'Le moteur Hikari'],
  ['profils', 'Les six profils'],
  ['automatique', 'Le choix automatique'],
  ['pipeline', 'Dans le GPU'],
  ['preparation', 'La première lecture'],
  ['verification', 'Comparer et mesurer'],
] as const;

const profiles = [
  {
    icon: 'auto_fix_high',
    title: 'Automatique',
    label: 'LE POINT DE DÉPART',
    text: 'Hikari choisit selon la vidéo : Restauré pour la SD, Fidèle pour la HD, Naturel si le moteur Hikari ne peut pas suivre. Le panneau indique le rendu appliqué.',
  },
  {
    icon: 'contrast',
    title: 'Remasterisé',
    label: 'UN RENDU AFFIRMÉ',
    text: 'Des traits noirs et nets, des blancs francs et des couleurs vives. Pour donner davantage de présence à l’image.',
  },
  {
    icon: 'auto_awesome',
    title: 'Restauré',
    label: 'NET, SANS EXCÈS',
    text: 'Le moteur Hikari avec une accentuation modérée des traits et des aplats. Une image propre, sans pousser les réglages.',
  },
  {
    icon: 'palette',
    title: 'Fidèle',
    label: 'LE MODÈLE SEUL',
    text: 'La restauration Hikari sans accentuation ajoutée. Pour garder le dessin et les couleurs au centre du rendu.',
  },
  {
    icon: 'eco',
    title: 'Naturel',
    label: 'UN TRAITEMENT LÉGER',
    text: 'Un agrandissement plus léger, au plus près de l’original. Ce profil couvre aussi les sources HD à 60 images/s lorsque le moteur Hikari atteint sa limite.',
  },
  {
    icon: 'tune',
    title: 'Personnalisé',
    label: 'À TA FAÇON',
    text: 'Netteté, vivacité, noirceur et épaisseur des traits : quatre réglages appliqués en direct, sans relancer la vidéo ni recompiler le moteur.',
  },
];

const automaticRules = [
  [
    'SD · jusqu’au 576p',
    'Restauré · ×4',
    'Jusqu’à environ 60 images/s, avec le modèle ×4 installé.',
  ],
  ['HD · au-delà du 576p, jusqu’au 720p', 'Fidèle · ×2', 'Jusqu’à environ 60 images/s.'],
  [
    'Full HD · au-delà du 720p, jusqu’au 1080p',
    'Fidèle · ×2',
    'Jusqu’à environ 30 images/s. Une source 1080p peut ainsi être agrandie en 4K.',
  ],
  [
    'HD à cadence plus élevée · ou moteur Hikari non fluide',
    'Naturel',
    'Le rendu léger prend le relais, dans les limites des modèles disponibles.',
  ],
  [
    'Au-delà du 1080p · ou d’environ 60 images/s',
    'Lecture standard',
    'Les modèles actuels ne couvrent pas ces sources. Le lecteur reste disponible sans traitement IA.',
  ],
] as const;

const pipeline = [
  {
    icon: 'movie',
    title: 'Décoder sur le GPU',
    text: 'Les images vidéo 8 ou 10 bits arrivent depuis le décodeur, aux formats NV12 ou P010. Les transferts du traitement restent en mémoire GPU.',
  },
  {
    icon: 'memory',
    title: 'Restaurer avec Hikari',
    text: 'TensorRT exécute le modèle en FP16. Le réseau travaille sur la luminance et la couleur à définition réduite, puis reconstruit l’image agrandie.',
  },
  {
    icon: 'tune',
    title: 'Appliquer ton rendu',
    text: 'Les quatre réglages font partie du calcul. Ils sont relus pendant la lecture et appliqués aux images suivantes, sans reconstruire le moteur.',
  },
  {
    icon: 'monitor',
    title: 'Afficher dans le lecteur',
    text: 'La sortie YUV 4:4:4 16 bits revient au lecteur natif. Les finitions et l’adaptation à ton écran complètent le rendu.',
  },
];

export default function HikariIAPage() {
  return (
    <div className="ia-page">
      <section className="container ia-hero">
        <div>
          <p className="eyebrow">
            <Icon name="memory" /> HIKARI IA · LE MOTEUR MAISON
          </p>
          <h1>
            Hikari IA,
            <br />
            <em>à ta façon.</em>
          </h1>
          <p className="ia-lead">
            Un modèle conçu pour les animés. Six profils pour choisir ton rendu. Et toute la
            puissance de ta NVIDIA RTX, directement dans le lecteur : du DVD à agrandir à l’épisode
            en Full HD.
          </p>
          <div className="ia-hero-actions">
            <a href="#profils" className="btn btn-primary">
              Trouver mon rendu <Icon name="south" />
            </a>
            <Link href="/installation#hikari-ia" className="text-link">
              Installer Hikari IA <Icon name="arrow_outward" />
            </Link>
          </div>
          <ul className="ia-tags" aria-label="Caractéristiques Hikari IA">
            <li>Modèle Hikari</li>
            <li>NVIDIA RTX · TensorRT</li>
            <li>Réglages en direct</li>
            <li>Traitement local</li>
          </ul>
        </div>
        <figure className="ia-hero-visual" data-reveal>
          <div className="ia-visual-label">
            <span>INTÉGRÉ AU LECTEUR HIKARI</span>
            <Icon name="play_circle" />
          </div>
          <Screenshot
            id="player"
            alt="Le lecteur vidéo natif Hikari, avec amélioration de l’image intégrée"
            priority
          />
          <div className="ia-signal" aria-label="Du décodage à l’écran">
            <span>Vidéo</span>
            <Icon name="east" />
            <strong>Moteur Hikari · GPU</strong>
            <Icon name="east" />
            <span>Écran</span>
          </div>
          <figcaption>Ton épisode, ton profil, dans le même lecteur.</figcaption>
        </figure>
      </section>

      <nav className="container ia-chapters" aria-label="Sommaire Hikari IA">
        {chapters.map(([id, label], index) => (
          <a href={`#${id}`} key={id}>
            <span>0{index + 1}</span>
            {label}
          </a>
        ))}
      </nav>

      <section className="container ia-section" id="moteurs">
        <div className="ia-heading" data-reveal>
          <div>
            <p className="eyebrow">01 / CONÇU POUR HIKARI</p>
            <h2>
              Un moteur maison.
              <br />
              <em>Le dessin d’abord.</em>
            </h2>
          </div>
          <p>
            Le moteur Hikari restaure et agrandit les images pendant la lecture. Son modèle a été
            conçu et entraîné pour Hikari, avec une attention particulière aux traits, aux aplats et
            aux couleurs des animés.
          </p>
        </div>
        <div className="ia-engine-grid">
          <article className="card ia-engine-card" data-reveal>
            <div className="ia-engine-label">
              <Icon name="draw" />
              <span>DU MODÈLE AU LECTEUR</span>
            </div>
            <h3>Hikari.</h3>
            <p>
              Une architecture et des poids propres au projet. L’entraînement utilise des images
              procédurales générées pour Hikari, sans images ni poids de modèles tiers dans ce
              modèle.
            </p>
            <dl className="ia-options">
              <div>
                <dt>Préserver le dessin</dt>
                <dd>Reconstruire les lignes et garder les couleurs au plus près de la source.</dd>
              </div>
              <div>
                <dt>Choisir le caractère de l’image</dt>
                <dd>
                  Du modèle seul à un rendu plus affirmé, avec des réglages intégrés au traitement.
                </dd>
              </div>
              <div>
                <dt>Tout faire en local</dt>
                <dd>
                  Les images sont traitées sur ta carte graphique, sans envoi à un service IA
                  distant.
                </dd>
              </div>
            </dl>
          </article>
          <article
            className="card ia-engine-card ia-engine-restore"
            data-theme="hikari-dark"
            data-reveal
          >
            <div className="ia-engine-label">
              <Icon name="zoom_out_map" />
              <span>DEUX FACTEURS D’AGRANDISSEMENT</span>
            </div>
            <h3>
              Plus grand.
              <br />
              Plus net.
            </h3>
            <div className="ia-scale-grid">
              <div>
                <strong>×4</strong>
                <span>
                  Sources DVD / SD
                  <br />
                  jusqu’au 576p
                </span>
              </div>
              <div>
                <strong>×2</strong>
                <span>
                  Sources HD / Full HD
                  <br />
                  jusqu’au 1080p
                </span>
              </div>
            </div>
            <p>
              Le facteur s’applique à la largeur et à la hauteur. Le ×4 enchaîne deux passes ×2 ; le
              lecteur adapte ensuite l’image à ton écran.
            </p>
            <p className="ia-engine-note">
              La cadence et ta carte comptent aussi. Automatique choisit un traitement adapté et
              surveille la fluidité pendant la lecture.
            </p>
          </article>
        </div>
        <details className="ia-disclosure">
          <summary>Comment le modèle limite-t-il le coût du calcul ?</summary>
          <p>
            L’architecture HKN-Y traite la luminance et la couleur en YCbCr 4:2:0, sur une grille
            contenant un quart des pixels. Des convolutions à large contexte servent à lire les
            structures du dessin. Les calculs sont regroupés dans un graphe TensorRT : entrée vidéo,
            réseau, réglages et conversion de sortie s’exécutent dans le même moteur.
          </p>
        </details>
      </section>

      <section className="container ia-section" id="profils">
        <div className="ia-heading" data-reveal>
          <div>
            <p className="eyebrow">02 / SIX PROFILS DE RENDU</p>
            <h2>
              Choisis une image.
              <br />
              <em>Hikari fait le reste.</em>
            </h2>
          </div>
          <p>
            Pas besoin de choisir un moteur technique. Sélectionne le rendu qui te plaît, ou
            commence en Automatique : Hikari choisit selon l’épisode.
          </p>
        </div>
        <div className="ia-detail-grid ia-profile-grid">
          {profiles.map((profile) => (
            <article key={profile.title} data-reveal>
              <Icon name={profile.icon} />
              <span className="ia-profile-label">{profile.label}</span>
              <h3>{profile.title}</h3>
              <p>{profile.text}</p>
            </article>
          ))}
        </div>
        <div className="ia-series-profile" data-reveal>
          <Icon name="bookmarks" />
          <div>
            <h3>Un animé, un profil.</h3>
            <p>
              Choisis un profil pendant la lecture : il est retenu pour toute la série. Les autres
              animés suivent ton profil par défaut, Automatique sur une nouvelle installation. Tu
              peux revenir à ce profil par défaut à tout moment.
            </p>
          </div>
        </div>
        <div id="reglages" className="ia-detail-grid ia-settings-grid">
          <article>
            <Icon name="deblur" />
            <h3>Netteté</h3>
            <p>
              Dose la précision des traits. À 1, le modèle agit seul ; tu peux atténuer ou accentuer
              son rendu.
            </p>
          </article>
          <article>
            <Icon name="wb_sunny" />
            <h3>Vivacité</h3>
            <p>Donne davantage de présence aux blancs et au contraste local.</p>
          </article>
          <article>
            <Icon name="contrast" />
            <h3>Noirceur des traits</h3>
            <p>Renforce les lignes ou éclaircis-les avec une valeur négative.</p>
          </article>
          <article>
            <Icon name="line_weight" />
            <h3>Épaisseur des traits</h3>
            <p>
              Épaissis les contours, ou affine-les avec une valeur négative. Les changements
              s’appliquent en direct.
            </p>
          </article>
        </div>
      </section>

      <section className="container ia-section" id="automatique">
        <div className="ia-heading" data-reveal>
          <div>
            <p className="eyebrow">03 / AUTOMATIQUE, VIDÉO PAR VIDÉO</p>
            <h2>
              La bonne dose.
              <br />
              <em>Au bon moment.</em>
            </h2>
          </div>
          <p>
            Définition, cadence, composants installés : Hikari choisit le profil et
            l’agrandissement. Le panneau explique ce qui est réellement appliqué à la vidéo en
            cours.
          </p>
        </div>
        <div className="ia-table-wrap">
          <table className="ia-table">
            <caption>
              Choix du profil Automatique, sous réserve des composants installés et de la fluidité
              mesurée. Les seuils de définition tiennent compte du nombre de pixels de la source.
            </caption>
            <thead>
              <tr>
                <th scope="col">La source</th>
                <th scope="col">Le rendu</th>
                <th scope="col">La cadence et les conditions</th>
              </tr>
            </thead>
            <tbody>
              {automaticRules.map(([source, profile, detail]) => (
                <tr key={source}>
                  <th scope="row">{source}</th>
                  <td>
                    <strong>{profile}</strong>
                  </td>
                  <td>{detail}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="ia-detail-grid">
          <article>
            <Icon name="query_stats" />
            <h3>La lecture reste la référence.</h3>
            <p>
              Automatique suit les images perdues, l’écart audio/vidéo et le budget du moteur. Si le
              traitement Hikari ne suit plus, le rendu Naturel prend le relais lorsqu’il est
              disponible.
            </p>
          </article>
          <article>
            <Icon name="slow_motion_video" />
            <h3>La cadence après désentrelacement compte.</h3>
            <p>
              Un DVD entrelacé peut produire deux images par image d’origine après désentrelacement.
              Hikari tient compte de cette cadence effective.
            </p>
          </article>
          <article>
            <Icon name="tune" />
            <h3>Ton profil reste ton choix.</h3>
            <p>
              Le basculement lié aux mesures de fluidité concerne Automatique. Un profil manuel
              reste sélectionné ; si la source dépasse les limites du modèle, le panneau indique le
              rendu de repli.
            </p>
          </article>
        </div>
        <details className="ia-disclosure">
          <summary>Comment la fluidité est-elle vérifiée ?</summary>
          <p>
            Après le démarrage, Hikari mesure des fenêtres de 10 secondes de lecture effective : au
            maximum 1 % d’images perdues, 80 ms d’écart audio/vidéo et un moteur dans son budget.
            Pauses, buffering et comparaisons sont exclus. Une source mesurée non fluide est écartée
            du moteur Hikari pour cette combinaison de définition et de cadence pendant la session.
          </p>
        </details>
        <div className="ia-series-profile" data-reveal>
          <Icon name="motion_photos_on" />
          <div>
            <h3>Mouvement fluide, aussi pour les panoramiques.</h3>
            <p>
              Le lecteur cale la vidéo sur la fréquence de l’écran et adoucit le passage entre les
              images. Les panoramiques à 24 ou 25 images/s saccadent moins, sans génération d’images
              par IA. Ce réglage vidéo est activé par défaut et reste désactivable, indépendamment
              du profil Hikari IA.
            </p>
          </div>
        </div>
      </section>

      <section className="ia-gpu-section" id="pipeline" data-theme="hikari-dark">
        <div className="container">
          <div className="ia-heading" data-reveal>
            <div>
              <p className="eyebrow">04 / LE PARCOURS D’UNE IMAGE</p>
              <h2>
                Du décodage au rendu.
                <br />
                <em>Sur ta RTX.</em>
              </h2>
            </div>
            <p>
              Le modèle Hikari et son intégration C++ travaillent avec le lecteur natif. Un seul
              moteur TensorRT réunit les étapes de traitement de chaque image ; aucun environnement
              Python n’est nécessaire dans l’application.
            </p>
          </div>
          <ol className="ia-pipeline">
            {pipeline.map((step, index) => (
              <li key={step.title} data-reveal>
                <div className="ia-pipeline-top">
                  <Icon name={step.icon} />
                  <span>0{index + 1}</span>
                </div>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </li>
            ))}
          </ol>
          <div className="ia-gpu-notes">
            <p>
              <Icon name="gradient" />
              <span>
                <strong>Les finitions restent disponibles.</strong> Lissage des dégradés, grain fin
                et mise à l’échelle haute qualité complètent le rendu du modèle.
              </span>
            </p>
            <p>
              <Icon name="closed_caption" />
              <span>
                <strong>Le lecteur garde ses commandes.</strong> Pistes audio, sous-titres,
                navigation dans l’épisode et plein écran restent accessibles pendant le traitement.
              </span>
            </p>
          </div>
        </div>
      </section>

      <section className="container ia-section" id="preparation">
        <div className="ia-heading" data-reveal>
          <div>
            <p className="eyebrow">05 / PRÉPARÉ UNE FOIS, RÉUTILISÉ ENSUITE</p>
            <h2>
              Moins d’attente.
              <br />
              <em>Plus d’épisodes.</em>
            </h2>
          </div>
          <p>
            Le composant du moteur Hikari pèse environ 5 Mo, en complément des composants NVIDIA de
            Hikari IA. Ses moteurs dynamiques servent ensuite pour toutes les définitions couvertes.
          </p>
        </div>
        <ol className="ia-install-steps">
          <li>
            <span>01</span>
            <div>
              <h3>Installer Hikari IA</h3>
              <p>
                Sur une machine NVIDIA RTX, installe les composants depuis les paramètres du
                lecteur. Le moteur Hikari se télécharge ensuite automatiquement en arrière-plan.
                L’intégrité des téléchargements est vérifiée par SHA-256. Hikari IA est activé par
                défaut sur une nouvelle installation.
              </p>
            </div>
          </li>
          <li>
            <span>02</span>
            <div>
              <h3>Préparer les variantes pour ta carte</h3>
              <p>
                À la première utilisation, TensorRT prépare un moteur par facteur d’agrandissement
                et format vidéo 8/10 bits. Une barre de progression suit l’opération ; l’épisode
                continue sans IA en attendant. Sur la RTX 5070 Ti de référence : environ 24 secondes
                pour ×2 et 40 secondes pour ×4.
              </p>
            </div>
          </li>
          <li>
            <span>03</span>
            <div>
              <h3>Passer d’une définition à l’autre</h3>
              <p>
                Le même moteur dynamique traite les différentes définitions : changer de série ou
                passer du 720p au 1080p ne demande plus de compilation par définition. Les variantes
                déjà préparées sont conservées sur ton ordinateur.
              </p>
            </div>
          </li>
        </ol>
        <p className="ia-side-note">
          Un facteur ou un format utilisé pour la première fois, une mise à jour du modèle ou un
          changement de GPU peut nécessiter une nouvelle préparation. Sa durée dépend de ta
          configuration.
        </p>
      </section>

      <section className="container ia-section" id="verification">
        <div className="ia-heading" data-reveal>
          <div>
            <p className="eyebrow">06 / VOIR ET VÉRIFIER</p>
            <h2>
              Compare à l’écran.
              <br />
              <em>Regarde les mesures.</em>
            </h2>
          </div>
          <p>
            Le panneau indique le profil choisi et le rendu appliqué. Les statistiques montrent ce
            que fait le lecteur : définition de sortie, cadence, coût GPU et fluidité.
          </p>
        </div>
        <div className="ia-verification-grid">
          <article className="ia-compare-card">
            <kbd className="kbd">C</kbd>
            <h3>La même vidéo, plusieurs rendus.</h3>
            <ol>
              <li>Lecture standard</li>
              <li>Rendu Naturel</li>
              <li>Moteur Hikari</li>
            </ol>
            <p>
              La touche C fait défiler les traitements disponibles. Revenir au rendu configuré
              conserve tes réglages.
            </p>
            <p>
              <strong>Maj + C</strong> enregistre des captures de la même image dans Images → Hikari
              → Comparaisons, à la taille d’affichage du lecteur.
            </p>
          </article>
          <article className="ia-diagnostic-card">
            <Icon name="monitor_heart" />
            <h3>Le diagnostic du lecteur</h3>
            <ul>
              <li>Profil par défaut, profil de la série et rendu appliqué.</li>
              <li>Définition source, sortie du modèle et sortie des filtres.</li>
              <li>Cadence, images perdues et décodage matériel.</li>
              <li>Temps GPU par image, budget de calcul et fluidité audio/vidéo.</li>
              <li>Progression de la préparation, composants installés et erreurs éventuelles.</li>
            </ul>
          </article>
        </div>
        <details className="ia-disclosure ia-measurements">
          <summary>Les mesures du moteur Hikari sur RTX 5070 Ti</summary>
          <p>
            Mesures du 21 octobre 2026 sur NVIDIA RTX 5070 Ti, avec TensorRT 11.3. Le banc utilise
            le graphe NV12 complet : transferts en mémoire GPU, modèle, réglages et conversion de
            sortie.
          </p>
          <div className="ia-table-wrap">
            <table className="ia-table">
              <caption>Temps par image du moteur Hikari · banc natif · RTX 5070 Ti</caption>
              <thead>
                <tr>
                  <th scope="col">Source</th>
                  <th scope="col">Agrandissement</th>
                  <th scope="col">Temps GPU par image</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">SD · 720 × 528</th>
                  <td>×4</td>
                  <td>12,5 ms</td>
                </tr>
                <tr>
                  <th scope="row">720p</th>
                  <td>×2</td>
                  <td>6,0 ms</td>
                </tr>
                <tr>
                  <th scope="row">1080p</th>
                  <td>×2</td>
                  <td>14,8 ms</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            Ces mesures concernent le moteur natif, pas le coût total du lecteur. Elles ne
            garantissent pas le même débit sur toutes les RTX : la carte, la cadence, la source et
            les finitions comptent aussi. Automatique vérifie la fluidité pendant la lecture réelle.
          </p>
        </details>
      </section>

      <section className="container ia-bottom-cta">
        <div>
          <p className="eyebrow">TON PREMIER ÉPISODE AVEC HIKARI IA</p>
          <h2>
            Commence en
            <br />
            <em>Automatique.</em>
          </h2>
          <p>
            Une NVIDIA RTX pour l’IA. Le lecteur standard fonctionne aussi sans RTX, et tu peux
            désactiver les traitements à tout moment.
          </p>
        </div>
        <div>
          <Link href="/telecharger" className="btn btn-primary btn-lg">
            <Icon name="download" />
            Télécharger Hikari
          </Link>
          <Link href="/installation#hikari-ia" className="text-link">
            Installation et configuration <Icon name="arrow_outward" />
          </Link>
        </div>
      </section>
    </div>
  );
}
