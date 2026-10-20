import type { Metadata } from 'next';
import { Gallery } from '@/components/gallery';
import { PageIntro, PageStamp } from '@/components/page-intro';
import { screenshots } from '@/lib/content';
export const metadata: Metadata = {
  title: 'L’application en images',
  description:
    'Découvre l’interface de Hikari : catalogue d’animés, fiches des séries, lecteur vidéo natif et thèmes clair et sombre.',
  alternates: { canonical: '/captures' },
};
export default function CapturesPage() {
  return (
    <div className="container">
      <PageIntro
        eyebrow="DANS L’APPLICATION"
        title={
          <>
            Ouvre Hikari.
            <br />
            <em>Regarde de plus près.</em>
          </>
        }
        description="Un catalogue pour trouver ta prochaine série, des fiches pour tout retrouver et un lecteur pour profiter de tes épisodes. Découvre Hikari en clair et en sombre."
      >
        <PageStamp
          icon="photo_library"
          label="VUES DE L’APPLICATION"
          value={String(screenshots.length).padStart(2, '0')}
        >
          Catalogue, épisodes et lecteur.
        </PageStamp>
      </PageIntro>
      <div className="page-content">
        <Gallery />
      </div>
    </div>
  );
}
