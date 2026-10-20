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
        description="Installation, moteurs IA, raccourcis et questions pratiques. Tout ce qu’il faut pour prendre Hikari en main."
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
            Hikari IA reste optionnelle et nécessite une carte NVIDIA RTX. Installez ses composants
            depuis les paramètres du lecteur. Le moteur Restauration est ensuite téléchargé en
            arrière-plan, environ 110 Mo.
          </p>
          <p>
            Pendant la lecture, ouvrez le panneau Hikari IA puis choisissez{' '}
            <strong>Automatique</strong> pour laisser Hikari adapter les traitements à la définition
            et à la cadence de la vidéo. Les modes Rapide et Restauration et les réglages manuels
            restent disponibles.
          </p>
          <p>
            À la première utilisation d’une définition, une préparation du moteur pour votre carte
            peut prendre une à trois minutes. La vidéo continue sans traitement pendant ce temps.
            Vous pouvez désactiver Hikari IA à tout moment.
          </p>
          <p>
            La fluidité dépend du GPU, de la vidéo et du profil choisi. Aucun niveau de performance
            universel n’est garanti, notamment pour une sortie 4K.
          </p>
          <h3>Deux moteurs, un mode Automatique</h3>
          <ul>
            <li>
              <strong>Rapide :</strong> amélioration courante et sources HD. Profils Performance,
              Balanced et Quality ; variantes Standard et Sharp.
            </li>
            <li>
              <strong>Restauration :</strong> reconstruction des traits et réduction du bruit. En
              Automatique, ×4 jusqu’au 576p et ×2 jusqu’au 720p, tant que la lecture reste fluide.
            </li>
            <li>
              <strong>Automatique :</strong> choisit d’après la définition et la cadence, puis
              surveille la fluidité. Hikari passe au moteur Rapide si nécessaire.
            </li>
          </ul>
          <p>
            La touche C compare la lecture standard et les moteurs Rapide ou Restauration
            disponibles. Les statistiques vidéo permettent de vérifier le moteur actif et la
            définition après traitement.
          </p>
          <p>Maj + C enregistre les captures de comparaison dans Images → Hikari → Comparaisons.</p>
          <Link className="text-link" href="/hikari-ia">
            Comprendre les moteurs et le traitement GPU <Icon name="arrow_outward" />
          </Link>
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
