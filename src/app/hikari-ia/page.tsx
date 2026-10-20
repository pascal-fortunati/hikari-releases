import type { Metadata } from 'next';
import Link from 'next/link';
import { Icon } from '@/components/icon';
import { Screenshot } from '@/components/screenshot';

export const metadata: Metadata = {
  title: 'Hikari IA — Moteurs, traitement GPU et fonctionnement',
  description:
    'Comment Hikari IA améliore tes animés : moteurs Rapide et Restauration, choix automatique, pipeline GPU TensorRT, réglages, comparaison et préparation des moteurs.',
  alternates: { canonical: '/hikari-ia' },
};

const chapters = [
  ['moteurs', 'Les deux moteurs'],
  ['automatique', 'Le choix automatique'],
  ['pipeline', 'Dans le GPU'],
  ['preparation', 'La première lecture'],
  ['reglages', 'Les réglages'],
  ['verification', 'Comparer et mesurer'],
] as const;

const automaticRules = [
  [
    'SD · jusqu’au 576p',
    'Restauration ×4',
    'À environ 30 images/s maximum, si le modèle est installé et la lecture fluide.',
  ],
  [
    'HD · au-delà du 576p, jusqu’au 720p',
    'Restauration ×2',
    'Même contrôle de cadence et de fluidité. Le débruitage conservateur est choisi.',
  ],
  [
    'Jusqu’au 1080p · ou cadence trop élevée pour Restauration',
    'Rapide · Quality',
    'La variante dépend de la définition. Le profil couvre aussi les vidéos jusqu’à 60 images/s.',
  ],
  [
    'Au-delà du 1080p · ou de la cadence couverte',
    'Lecture standard',
    'Hikari désactive le traitement IA lorsque les modèles ne couvrent pas la source.',
  ],
] as const;

const pipeline = [
  {
    icon: 'movie',
    title: 'Décoder la vidéo',
    text: 'Le lecteur décode les images sur le GPU. Le moteur Restauration accepte les entrées 8 bits et 10 bits, dans les formats NV12 et P010.',
  },
  {
    icon: 'analytics',
    title: 'Analyser l’image',
    text: 'Une première partie du calcul extrait les statistiques nécessaires au modèle. Elles sont recalculées à chaque image dans le chemin TensorRT actuel.',
  },
  {
    icon: 'memory',
    title: 'Reconstruire et agrandir',
    text: 'Le réseau reçoit l’image et ces statistiques, reconstruit les traits et produit une image agrandie en calcul FP16. Les conversions de couleur font partie des graphes GPU.',
  },
  {
    icon: 'monitor',
    title: 'Renvoyer au lecteur',
    text: 'La sortie est convertie en YUV 4:4:4 16 bits, puis transmise à la surface vidéo du lecteur. Les finitions et l’adaptation à l’écran viennent ensuite.',
  },
];

export default function HikariIAPage() {
  return (
    <div className="ia-page">
      <section className="container ia-hero">
        <div>
          <p className="eyebrow">
            <Icon name="memory" /> HIKARI IA · SOUS LE CAPOT
          </p>
          <h1>
            Hikari IA,
            <br />
            <em>image par image.</em>
          </h1>
          <p className="ia-lead">
            Deux moteurs, du calcul sur ta NVIDIA RTX et un mode Automatique qui surveille la
            fluidité. Voici ce qui se passe entre la vidéo source et ton écran.
          </p>
          <div className="ia-hero-actions">
            <a href="#moteurs" className="btn btn-primary">
              Comprendre les moteurs <Icon name="south" />
            </a>
            <Link href="/installation#hikari-ia" className="text-link">
              Installer Hikari IA <Icon name="arrow_outward" />
            </Link>
          </div>
          <ul className="ia-tags" aria-label="Caractéristiques Hikari IA">
            <li>NVIDIA RTX</li>
            <li>TensorRT</li>
            <li>Intégration C++</li>
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
            alt="Le lecteur vidéo natif Hikari dans lequel les traitements IA sont intégrés"
            priority
          />
          <div className="ia-signal" aria-label="Du décodage à l’écran">
            <span>Vidéo</span>
            <Icon name="east" />
            <strong>Hikari IA · GPU</strong>
            <Icon name="east" />
            <span>Écran</span>
          </div>
          <figcaption>Hikari IA, directement dans ton lecteur vidéo.</figcaption>
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
            <p className="eyebrow">01 / DEUX MOTEURS COMPLÉMENTAIRES</p>
            <h2>
              La même vidéo.
              <br />
              <em>Deux façons de la traiter.</em>
            </h2>
          </div>
          <p>
            Hikari utilise un moteur IA à la fois. Tu peux le choisir dans le panneau Hikari IA ou
            laisser le mode Automatique décider pour chaque vidéo.
          </p>
        </div>
        <div className="ia-engine-grid">
          <article className="card ia-engine-card" data-reveal>
            <div className="ia-engine-label">
              <Icon name="speed" />
              <span>AMÉLIORATION COURANTE</span>
            </div>
            <h3>Rapide</h3>
            <p>
              Un agrandissement IA adapté aux animés SD et HD, avec des profils pour équilibrer le
              coût du calcul et le traitement choisi.
            </p>
            <dl className="ia-options">
              <div>
                <dt>Performance</dt>
                <dd>Un modèle HD allégé, pour réduire la charge sur la carte graphique.</dd>
              </div>
              <div>
                <dt>Balanced</dt>
                <dd>Le modèle HD complet pour les vidéos à 24 ou 30 images/s.</dd>
              </div>
              <div>
                <dt>Quality</dt>
                <dd>
                  Le même modèle que Balanced à 24/30 images/s, avec une chaîne supplémentaire pour
                  la HD jusqu’à 60 images/s.
                </dd>
              </div>
            </dl>
            <p className="ia-engine-note">
              <strong>Standard ou Sharp :</strong> un rendu fidèle à la source, ou des contours plus
              accentués sur les sources HD. Sur les vrais DVD SD, deux passes successives SD puis HD
              permettent un agrandissement ×4.
            </p>
          </article>
          <article
            className="card ia-engine-card ia-engine-restore"
            data-theme="hikari-dark"
            data-reveal
          >
            <div className="ia-engine-label">
              <Icon name="auto_fix_high" />
              <span>TRAITS & DÉBRUITAGE</span>
            </div>
            <h3>Restauration</h3>
            <p>
              Pour les épisodes dont les contours et les aplats ont souffert : reconstruction des
              traits, réduction du bruit et agrandissement dans le même traitement.
            </p>
            <div className="ia-scale-grid">
              <div>
                <strong>×4</strong>
                <span>
                  Sources SD
                  <br />
                  jusqu’au 576p
                </span>
              </div>
              <div>
                <strong>×2</strong>
                <span>
                  Sources HD
                  <br />
                  jusqu’au 720p
                </span>
              </div>
            </div>
            <p>
              Le facteur s’applique à la largeur et à la hauteur de l’image. Le lecteur adapte
              ensuite cette sortie à ton écran.
            </p>
            <p className="ia-engine-note">
              Modèle Standard, Pro ou Sans SE ; débruitage conservateur, désactivé ou plus prononcé
              selon les modèles installés. La fluidité dépend de ta carte et de la vidéo.
            </p>
          </article>
        </div>
      </section>

      <section className="container ia-section" id="automatique">
        <div className="ia-heading" data-reveal>
          <div>
            <p className="eyebrow">02 / AUTOMATIQUE, AVEC DES RÈGLES PRÉCISES</p>
            <h2>
              La définition compte.
              <br />
              <em>La cadence aussi.</em>
            </h2>
          </div>
          <p>
            Hikari lit la taille et la cadence de la source, vérifie les moteurs installés et
            choisit le traitement. Le panneau explique le choix appliqué à la vidéo en cours.
          </p>
        </div>
        <div className="ia-table-wrap">
          <table className="ia-table">
            <caption>
              Règles du mode Automatique, sous réserve des composants disponibles et de la fluidité.
            </caption>
            <thead>
              <tr>
                <th scope="col">La source</th>
                <th scope="col">Le choix</th>
                <th scope="col">Ce qui compte</th>
              </tr>
            </thead>
            <tbody>
              {automaticRules.map(([source, engine, detail]) => (
                <tr key={source}>
                  <th scope="row">{source}</th>
                  <td>
                    <strong>{engine}</strong>
                  </td>
                  <td>{detail}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="ia-detail-grid">
          <article>
            <Icon name="slow_motion_video" />
            <h3>Le désentrelacement change la cadence.</h3>
            <p>
              Une source entrelacée peut fournir deux images par image d’origine après
              désentrelacement. Hikari utilise cette cadence effective pour choisir un moteur
              capable de suivre.
            </p>
          </article>
          <article>
            <Icon name="query_stats" />
            <h3>La fluidité est mesurée pendant la lecture.</h3>
            <p>
              Par fenêtres de 10 secondes de lecture effective, Hikari suit les images perdues,
              l’écart audio/vidéo et le budget du moteur. Si Restauration ne suit plus, Automatique
              passe au moteur Rapide.
            </p>
          </article>
          <article>
            <Icon name="tune" />
            <h3>Ton choix manuel reste ton choix.</h3>
            <p>
              Le basculement automatique concerne le mode Automatique. En sélection manuelle, les
              mesures restent visibles ; Hikari respecte le moteur demandé.
            </p>
          </article>
        </div>
        <details className="ia-disclosure">
          <summary>Quels seuils sont surveillés ?</summary>
          <p>
            Après une phase de démarrage, la mesure exige au maximum 1 % d’images perdues, un écart
            audio/vidéo maximal de 80 ms et un moteur dans son budget de calcul. Les pauses, le
            buffering et les comparaisons ne comptent pas comme de la lecture continue. Une
            combinaison de définition et de cadence mesurée non fluide reste écartée de Restauration
            pour la session.
          </p>
        </details>
      </section>

      <section className="ia-gpu-section" id="pipeline" data-theme="hikari-dark">
        <div className="container">
          <div className="ia-heading" data-reveal>
            <div>
              <p className="eyebrow">03 / LE PARCOURS D’UNE IMAGE</p>
              <h2>
                Du décodage au rendu.
                <br />
                <em>Sur le GPU.</em>
              </h2>
            </div>
            <p>
              Le moteur Restauration est intégré en C++ au lecteur natif. Son pipeline TensorRT
              sépare l’analyse, la restauration et la conversion de sortie pour exécuter les calculs
              sur la carte graphique.
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
              <Icon name="developer_board" />
              <span>
                <strong>Copies GPU vers GPU.</strong> Le traitement Restauration évite
                l’aller-retour des images par la mémoire du processeur. Le flux de calcul est
                synchronisé avec celui du décodeur.
              </span>
            </p>
            <p>
              <Icon name="desktop_windows" />
              <span>
                <strong>Calcul local.</strong> Les images ne sont pas envoyées à un service IA. Les
                téléchargements des composants et l’accès aux sources vidéo restent des échanges
                réseau distincts.
              </span>
            </p>
          </div>
        </div>
      </section>

      <section className="container ia-section" id="preparation">
        <div className="ia-heading" data-reveal>
          <div>
            <p className="eyebrow">04 / PRÉPARER UNE FOIS, RÉUTILISER ENSUITE</p>
            <h2>
              Le premier lancement
              <br />
              <em>travaille un peu plus.</em>
            </h2>
          </div>
          <p>
            Un modèle doit être préparé pour ta carte et le format de la vidéo. Hikari affiche la
            progression pendant ce calcul, puis conserve les moteurs pour les lectures suivantes.
          </p>
        </div>
        <ol className="ia-install-steps">
          <li>
            <span>01</span>
            <div>
              <h3>Installer les composants</h3>
              <p>
                Depuis les paramètres du lecteur, installe Hikari IA sur une machine NVIDIA RTX. Le
                composant Restauration se télécharge ensuite en arrière-plan, environ 110 Mo.
                L’intégrité des téléchargements est vérifiée par SHA-256.
              </p>
            </div>
          </li>
          <li>
            <span>02</span>
            <div>
              <h3>Préparer le moteur pour la vidéo</h3>
              <p>
                À la première utilisation d’une combinaison de modèle, définition et format,
                TensorRT compile les moteurs adaptés au GPU. Cela peut prendre une à trois minutes.
                L’épisode continue sans IA pendant la préparation.
              </p>
            </div>
          </li>
          <li>
            <span>03</span>
            <div>
              <h3>Retrouver le moteur en cache</h3>
              <p>
                Les moteurs préparés sont conservés localement. Le cache tient compte du GPU, de la
                version TensorRT, du modèle, du facteur d’agrandissement, de la définition et du
                format 8/10 bits. Un cache d’optimisation partagé aide aussi les préparations
                suivantes.
              </p>
            </div>
          </li>
        </ol>
        <p className="ia-side-note">
          Une nouvelle combinaison peut demander une nouvelle préparation. Le panneau du lecteur
          indique l’étape et une estimation fondée sur les préparations précédentes.
        </p>
      </section>

      <section className="container ia-section" id="reglages">
        <div className="ia-heading" data-reveal>
          <div>
            <p className="eyebrow">05 / CHOISIR LE RENDU</p>
            <h2>
              Les traits d’abord.
              <br />
              <em>Les finitions ensuite.</em>
            </h2>
          </div>
          <p>
            Le panneau Hikari IA réunit le choix du moteur et les finitions. Les réglages se
            modifient pendant la lecture ; Automatique applique les valeurs recommandées.
          </p>
        </div>
        <div className="ia-detail-grid ia-settings-grid">
          <article>
            <Icon name="texture" />
            <h3>Débruitage</h3>
            <p>
              Dans Restauration, le mode conservateur préserve les traits sans lissage ajouté. Tu
              peux choisir sans débruitage ou les niveaux léger, moyen et fort lorsqu’ils sont
              fournis par le modèle installé.
            </p>
          </article>
          <article>
            <Icon name="gradient" />
            <h3>Lissage des dégradés</h3>
            <p>
              Atténue les bandes visibles dans les ciels, les ombres et les aplats. Trois intensités
              : léger, recommandé et fort.
            </p>
          </article>
          <article>
            <Icon name="grain" />
            <h3>Grain fin</h3>
            <p>
              Ajoute une texture de grain dont tu règles l’intensité. Son activation et son dosage
              restent séparés du moteur IA.
            </p>
          </article>
          <article>
            <Icon name="fit_screen" />
            <h3>Mise à l’échelle haute qualité</h3>
            <p>
              Adapte le rendu final à l’écran avec le profil haute qualité du lecteur, après le
              traitement IA.
            </p>
          </article>
          <article>
            <Icon name="deblur" />
            <h3>Sources entrelacées</h3>
            <p>
              Le réglage vidéo propose un désentrelacement automatique, forcé ou désactivé. En
              Automatique, sa cadence de sortie est prise en compte par le choix du moteur IA.
            </p>
          </article>
          <article>
            <Icon name="closed_caption" />
            <h3>Les commandes du lecteur restent là</h3>
            <p>
              Sous-titres, pistes audio, navigation dans l’épisode et plein écran restent gérés par
              le lecteur natif pendant l’amélioration de l’image.
            </p>
          </article>
        </div>
      </section>

      <section className="container ia-section" id="verification">
        <div className="ia-heading" data-reveal>
          <div>
            <p className="eyebrow">06 / VOIR ET VÉRIFIER</p>
            <h2>
              Compare le rendu.
              <br />
              <em>Lis les vraies mesures.</em>
            </h2>
          </div>
          <p>
            Hikari distingue les réglages demandés du traitement réellement confirmé par le moteur.
            Le statut « Active · vérifiée » repose sur les informations de la lecture en cours.
          </p>
        </div>
        <div className="ia-verification-grid">
          <article className="ia-compare-card">
            <kbd className="kbd">C</kbd>
            <h3>Compare les moteurs.</h3>
            <ol>
              <li>Lecture standard</li>
              <li>Hikari IA · Rapide</li>
              <li>Hikari IA · Restauration</li>
            </ol>
            <p>
              La touche C fait défiler les rendus disponibles sur la vidéo en cours. Le retour au
              rendu configuré conserve tes réglages.
            </p>
            <p>
              <strong>Maj + C</strong> enregistre des captures de la même image pour les moteurs
              disponibles. Elles sont sauvegardées dans Images → Hikari → Comparaisons.
            </p>
          </article>
          <article className="ia-diagnostic-card">
            <Icon name="monitor_heart" />
            <h3>Le diagnostic du lecteur</h3>
            <ul>
              <li>Moteur actif, profil demandé et profil confirmé.</li>
              <li>Définition source, sortie du modèle et sortie des filtres.</li>
              <li>Cadence, images perdues et décodage matériel.</li>
              <li>
                Pour Restauration : coût GPU par image, latence, budget et mesure de fluidité
                audio/vidéo.
              </li>
              <li>État de préparation, modèles installés et erreurs éventuelles.</li>
            </ul>
          </article>
        </div>
        <details className="ia-disclosure ia-measurements">
          <summary>Les mesures de développement derrière les choix du mode Automatique</summary>
          <p>
            Mesures documentées le 20 octobre 2026 sur une NVIDIA RTX 5070 Ti 16 Go. Pour
            Restauration ×2, le banc TensorRT mesure les deux étapes analyse et restauration sur un
            GPU libre :
          </p>
          <div className="ia-table-wrap">
            <table className="ia-table">
              <caption>Temps GPU analyse + restauration · RTX 5070 Ti · agrandissement ×2</caption>
              <thead>
                <tr>
                  <th scope="col">Source</th>
                  <th scope="col">Analyse + restauration</th>
                  <th scope="col">Budget à environ 24 i/s</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">480p</th>
                  <td>11,2 ms</td>
                  <td>41,7 ms</td>
                </tr>
                <tr>
                  <th scope="row">576p</th>
                  <td>15,9 ms</td>
                  <td>41,7 ms</td>
                </tr>
                <tr>
                  <th scope="row">720p</th>
                  <td>26,4 ms</td>
                  <td>41,7 ms</td>
                </tr>
                <tr>
                  <th scope="row">1080p</th>
                  <td>57,1 ms</td>
                  <td>41,7 ms — budget dépassé</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            Ces temps isolent l’analyse et la restauration ; ils ne représentent pas le coût total
            du lecteur. Les essais en lecture réelle ont également validé le passage de 720p à 1440p
            sur cette carte. Les résultats dépendent du GPU, de la cadence et de la source : le
            contrôle de fluidité pendant la lecture reste décisif.
          </p>
        </details>
      </section>

      <section className="container ia-bottom-cta">
        <div>
          <p className="eyebrow">À TOI DE CHOISIR LE RENDU</p>
          <h2>
            Commence en
            <br />
            <em>Automatique.</em>
          </h2>
          <p>
            Une NVIDIA RTX pour les moteurs IA. Le lecteur standard reste disponible sans RTX, et
            les traitements peuvent être désactivés à tout moment.
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
