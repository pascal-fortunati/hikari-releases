import type { Metadata } from 'next';
import Link from 'next/link';
import { FAQ } from '@/components/faq';
import { Icon } from '@/components/icon';
import { PageIntro, PageStamp } from '@/components/page-intro';
export const metadata: Metadata = {
  title: 'Installation et questions fréquentes',
  description:
    'Tout pour bien démarrer avec Hikari sur Windows : installation, mises à jour, données locales et configuration Hikari IA.',
  alternates: { canonical: '/installation' },
};
export default function InstallationPage() {
  return (
    <div className="container">
      <PageIntro
        eyebrow="LE GUIDE POUR DÉMARRER"
        title={
          <>
            Prêt à lancer
            <br />
            <em>ton premier épisode ?</em>
          </>
        }
        description="Installation, profils Hikari IA, raccourcis et questions pratiques. Tout ce qu’il faut pour prendre Hikari en main."
      >
        <PageStamp icon="keyboard" label="UN RACCOURCI À RETENIR" value={<kbd>Ctrl + K</kbd>}>
          Cherche un animé ou un manga, depuis toute l’application.
        </PageStamp>
      </PageIntro>
      <nav className="document-nav" aria-label="Sommaire du guide">
        <a href="#installation">
          <Icon name="download" />
          Installer
        </a>
        <a href="#hikari-ia">
          <Icon name="memory" />
          Configurer l’IA
        </a>
        <a href="#raccourcis">
          <Icon name="keyboard" />
          Raccourcis
        </a>
        <a href="#questions">
          <Icon name="help_outline" />
          Questions
        </a>
      </nav>
      <div className="page-content article-width document-content">
        <section id="installation" data-reveal>
          <h2>La première installation</h2>
          <p>
            Windows 10 ou 11 en 64 bits et une connexion Internet suffisent pour commencer.
            Téléchargez Hikari.exe depuis la release officielle, vérifiez son empreinte puis
            placez-le dans votre dossier.
          </p>
          <p>
            Au premier lancement, Hikari prépare son catalogue et les images. Les fiches
            s’enrichissent en arrière-plan : laissez-lui quelques minutes. Installez le lecteur
            vidéo depuis les paramètres lors de votre première lecture, environ 70 Mo.
          </p>
          <Link className="text-link" href="/telecharger">
            Télécharger et vérifier le fichier
            <Icon name="arrow_forward" />
          </Link>
        </section>
        <section id="hikari-ia" data-reveal>
          <h2>Bien démarrer avec Hikari IA</h2>
          <p>
            Hikari IA nécessite une carte NVIDIA RTX. Installez les composants depuis les paramètres
            du lecteur : le moteur Hikari est ensuite téléchargé automatiquement en arrière-plan,
            environ 5 Mo supplémentaires. Sur une nouvelle installation, l’IA et le profil
            Automatique sont activés par défaut ; vous pouvez désactiver l’IA à tout moment.
          </p>
          <p>
            Pendant la lecture, ouvrez le panneau Hikari IA puis choisissez{' '}
            <strong>Automatique</strong> pour laisser Hikari choisir le rendu selon la définition,
            la cadence et la fluidité. Le panneau indique le profil réellement appliqué.
          </p>
          <p>
            À la première utilisation, le moteur se prépare pour votre GPU, par facteur
            d’agrandissement et format vidéo. Sur la RTX 5070 Ti de référence, comptez environ 24
            secondes pour ×2 et 40 secondes pour ×4 ; la durée varie selon votre carte. Une barre de
            progression suit cette étape et la vidéo continue sans IA en attendant. Le moteur
            préparé sert ensuite pour les différentes définitions.
          </p>
          <p>
            La fluidité dépend du GPU, de la vidéo et du profil choisi. Aucun niveau de performance
            universel n’est garanti, notamment pour une sortie 4K.
          </p>
          <h3>Six profils, un choix mémorisé par animé</h3>
          <ul>
            <li>
              <strong>Automatique :</strong> Restauré pour les sources SD, Fidèle pour la HD,
              Naturel lorsque le moteur Hikari ne peut pas suivre.
            </li>
            <li>
              <strong>Remasterisé, Restauré, Fidèle :</strong> un rendu affirmé, modéré ou le modèle
              Hikari sans accentuation ajoutée. Agrandissement ×4 jusqu’au 576p et ×2 jusqu’au
              1080p, dans les limites de cadence du moteur.
            </li>
            <li>
              <strong>Naturel :</strong> un agrandissement plus léger, qui couvre aussi les sources
              HD à 60 images/s.
            </li>
            <li>
              <strong>Personnalisé :</strong> netteté, vivacité, noirceur et épaisseur des traits,
              appliquées en direct pendant la lecture.
            </li>
          </ul>
          <p>
            Un profil choisi pendant la lecture est mémorisé pour toute la série. Les autres animés
            suivent votre profil par défaut. La touche C compare la lecture standard, le rendu
            Naturel et le moteur Hikari disponibles ; les statistiques vidéo montrent le traitement
            actif et la définition de sortie.
          </p>
          <p>Maj + C enregistre les captures de comparaison dans Images → Hikari → Comparaisons.</p>
          <Link className="text-link" href="/hikari-ia">
            Comprendre les profils et le traitement GPU <Icon name="arrow_outward" />
          </Link>
          <h3>Mouvement fluide</h3>
          <p>
            Activé par défaut dans les réglages vidéo, Mouvement fluide cale la lecture sur la
            fréquence de l’écran et adoucit les transitions entre les images. Les panoramiques des
            épisodes à 24 ou 25 images/s saccadent moins. Ce réglage reste indépendant de l’IA et
            peut être désactivé.
          </p>
        </section>
        <section id="raccourcis" data-reveal>
          <h2>Vos raccourcis, à portée de main</h2>
          <ul>
            <li>
              <kbd className="kbd kbd-sm">Ctrl + K</kbd> Rechercher un titre
            </li>
            <li>
              <kbd className="kbd kbd-sm">Espace</kbd> Lecture ou pause
            </li>
            <li>
              <kbd className="kbd kbd-sm">← / →</kbd> Reculer ou avancer de 10 secondes
            </li>
            <li>
              <kbd className="kbd kbd-sm">F</kbd> Passer en plein écran
            </li>
            <li>
              <kbd className="kbd kbd-sm">P</kbd> Activer l’image dans l’image
            </li>
            <li>
              <kbd className="kbd kbd-sm">C</kbd> Comparer les traitements Hikari IA
            </li>
          </ul>
        </section>
        <section id="questions" data-reveal>
          <h2>Vos questions</h2>
          <FAQ />
        </section>
      </div>
    </div>
  );
}
