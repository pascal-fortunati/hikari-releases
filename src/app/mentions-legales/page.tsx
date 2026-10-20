import type { Metadata } from 'next';
import { PageIntro, PageStamp } from '@/components/page-intro';
export const metadata: Metadata = {
  title: 'Mentions et confidentialité',
  description: 'Éditeur, hébergement et fonctionnement des données du site officiel Hikari.',
  alternates: { canonical: '/mentions-legales' },
};
export default function LegalPage() {
  return (
    <div className="container">
      <PageIntro
        eyebrow="MENTIONS & CONFIDENTIALITÉ"
        title={
          <>
            Le site, les données.
            <br />
            <em>En toute transparence.</em>
          </>
        }
        description="Les informations sur l’éditeur, l’hébergement et le fonctionnement des données du site et de l’application."
      >
        <PageStamp icon="privacy_tip" label="SUR LE SITE HIKARI" value="Tes données.">
          Compte, stockage local et services tiers : les explications ci-dessous.
        </PageStamp>
      </PageIntro>
      <nav className="document-nav" aria-label="Sommaire des mentions">
        <a href="#editeur">Éditeur & contact</a>
        <a href="#donnees">Données du site</a>
        <a href="#contenus">Application & contenus</a>
      </nav>
      <div className="page-content article-width document-content">
        <section id="editeur" data-reveal>
          <h2>Édition et contact</h2>
          <p>
            Le site Hikari est édité à titre personnel par Pascal Fortunati, également directeur de
            la publication. Contact :{' '}
            <a href="mailto:contact@pascal-fortunati.fr">contact@pascal-fortunati.fr</a>. Les
            informations de l’éditeur sont également consultables dans les{' '}
            <a href="https://pascal-fortunati.fr/mentions-legales">
              mentions légales de son portfolio
            </a>
            .
          </p>
          <p>
            Hébergeur : REDHEBERG (SAS), 78 avenue des Champs-Élysées, 75008 Paris, France.
            Téléphone : +33 7 64 32 33 42. Site : <a href="https://redheberg.fr">redheberg.fr</a>.
            Le site est exploité via l’infrastructure Pushora de l’éditeur.
          </p>
        </section>
        <section id="donnees" data-reveal>
          <h2>Vos données sur ce site</h2>
          <p>
            Le site ne propose ni compte, ni formulaire, ni mesure d’audience intégrée. Le choix du
            thème clair ou sombre est enregistré dans le stockage local de votre navigateur sous la
            clé <code>hikari-theme</code>. Vous pouvez supprimer cette préférence depuis les données
            du site de votre navigateur.
          </p>
          <p>
            Les polices, icônes et images sont servies par le site. Les informations des versions
            sont récupérées côté serveur depuis l’API GitHub ; votre navigateur n’a pas besoin de
            contacter cette API pour afficher les versions.
          </p>
          <p>
            Les téléchargements et les liens externes vous redirigent vers GitHub ou vers les
            services concernés. Leur politique de confidentialité s’applique dès que vous les
            consultez. L’hébergement et le reverse proxy peuvent traiter des journaux techniques
            nécessaires à la sécurité et au fonctionnement, notamment l’adresse IP et la date de la
            requête. La configuration et la conservation de ces journaux relèvent de
            l’infrastructure de l’éditeur. Pour toute question ou demande relative à vos données,
            contactez l’éditeur à l’adresse ci-dessus.
          </p>
        </section>
        <section id="contenus" data-reveal>
          <h2>L’application et les contenus</h2>
          <p>
            Dans l’application Windows, vos favoris, votre historique et vos préférences sont
            conservés localement. Les fonctionnalités de catalogue, de métadonnées et de lecture
            utilisent des services tiers.
          </p>
          <p>
            Hikari n’héberge aucune vidéo. L’utilisateur doit disposer des droits nécessaires pour
            consulter les contenus. Les titres, images et œuvres restent la propriété de leurs
            ayants droit.
          </p>
        </section>
      </div>
    </div>
  );
}
