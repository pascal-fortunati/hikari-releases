export const SITE_URL = 'https://hikari.pascal-fortunati.fr';
export const screenshots = [
  {
    id: 'home-dark',
    title: 'Accueil et reprise de lecture',
    category: 'Bibliothèque',
    theme: 'Sombre',
    alt: 'Accueil Hikari sombre avec sélection du jour et reprise de lecture',
    description: 'Retrouve tes épisodes en cours, tes favoris et les sélections du catalogue.',
  },
  {
    id: 'catalog-dark',
    title: 'Catalogue des animés',
    category: 'Bibliothèque',
    theme: 'Sombre',
    alt: 'Catalogue Hikari avec affiches des séries et filtres',
    description: 'Un catalogue organisé, des saisons réunies, une recherche immédiate.',
  },
  {
    id: 'detail-dark',
    title: 'Fiche d’une série',
    category: 'Bibliothèque',
    theme: 'Sombre',
    alt: 'Fiche détaillée d’une série avec ses saisons dans Hikari',
    description: 'Saisons, films et épisodes spéciaux au même endroit.',
  },
  {
    id: 'episodes-dark',
    title: 'Liste des épisodes',
    category: 'Bibliothèque',
    theme: 'Sombre',
    alt: 'Liste des épisodes avec titres, résumés et vignettes dans Hikari',
    description: 'Retrouvez les épisodes et leur résumé avant de lancer la lecture.',
  },
  {
    id: 'player',
    title: 'Lecteur vidéo natif',
    category: 'Lecteur',
    theme: 'Sombre',
    alt: 'Lecteur vidéo natif Hikari et ses commandes en surimpression',
    description: 'Lecture intégrée à Hikari, commandes en surimpression et réglages de l’image.',
  },
  {
    id: 'home-light',
    title: 'Interface claire',
    category: 'Interface',
    theme: 'Clair',
    alt: 'Accueil de Hikari dans son thème clair officiel',
    description: 'Le catalogue et la reprise de lecture dans le thème clair officiel.',
  },
  {
    id: 'settings-light',
    title: 'Paramètres de l’application',
    category: 'Interface',
    theme: 'Clair',
    alt: 'Paramètres Hikari en thème clair',
    description: 'Bibliothèque, lecteur et préférences de Hikari.',
  },
] as const;
export const faqs = [
  [
    'Sur quelles versions de Windows fonctionne Hikari ?',
    'Windows 10 ou Windows 11 en 64 bits, avec une connexion Internet. Tu peux utiliser le catalogue et le lecteur standard sans carte NVIDIA RTX.',
  ],
  [
    'Faut-il créer un compte ?',
    'Non. Lance l’application et utilise le catalogue directement. Tes favoris, ta progression et tes préférences sont enregistrés sur ton ordinateur. Les contenus disponibles dépendent des services sources.',
  ],
  [
    'Comment installer Hikari ?',
    'Télécharge Hikari.exe depuis la release officielle GitHub, place-le dans un dossier puis lance-le. Le catalogue et les images se préparent en arrière-plan. Installe le lecteur vidéo depuis les paramètres lors de ta première lecture.',
  ],
  [
    'Comment fonctionnent les mises à jour ?',
    'Hikari cherche les nouvelles versions et les télécharge en arrière-plan. La barre latérale te signale quand une mise à jour est prête : un clic pour l’installer et redémarrer. Tu peux aussi vérifier dans Paramètres → À propos. Les fichiers téléchargés sont vérifiés par SHA-256.',
  ],
  [
    'Mes données personnelles restent-elles en local ?',
    'Tes favoris, ton historique et tes réglages restent sur ton ordinateur. Hikari contacte les services sources pour le catalogue, les métadonnées, les images et la lecture : une connexion Internet reste nécessaire.',
  ],
  [
    'Faut-il une carte NVIDIA pour regarder un animé ?',
    'Non, le lecteur standard fonctionne sans NVIDIA RTX. Cette carte est nécessaire uniquement pour les moteurs Hikari IA, que tu peux activer ou désactiver pendant la lecture.',
  ],
  [
    'Comment activer Hikari IA ?',
    'Sur une machine NVIDIA RTX, installe les composants Hikari IA depuis les paramètres du lecteur. Le moteur Hikari ajoute environ 5 Mo, téléchargés automatiquement en arrière-plan. Automatique est activé par défaut sur une nouvelle installation ; tu peux choisir parmi six profils et mémoriser un choix par série. Le moteur se prépare une fois par facteur et format vidéo, puis sert aux différentes définitions. La vidéo continue sans IA pendant la préparation.',
  ],
  [
    'Puis-je choisir un rendu différent pour chaque animé ?',
    'Oui. Le profil Hikari IA choisi pendant la lecture est mémorisé pour toute la série. Les autres animés suivent ton profil par défaut. Automatique, Remasterisé, Restauré, Fidèle, Naturel et Personnalisé sont disponibles ; ce dernier permet de régler la netteté, la vivacité, la noirceur et l’épaisseur des traits en direct.',
  ],
  [
    'À quoi sert Mouvement fluide ?',
    'Le lecteur cale la vidéo sur la fréquence de ton écran et adoucit le passage entre les images, pour limiter les saccades des panoramiques à 24 ou 25 images/s. Ce réglage est activé par défaut dans les paramètres vidéo et peut être désactivé. Il ne génère pas d’images par IA et fonctionne indépendamment du profil Hikari IA.',
  ],
  [
    'Pourquoi certains contenus sont-ils indisponibles ?',
    'La disponibilité dépend des sources tierces et des langues proposées. Certains chapitres sont d’abord réservés aux abonnés du service source : Hikari les indique grisés avec leur date d’accès gratuit. Utilisez uniquement des contenus auxquels vous êtes autorisé à accéder.',
  ],
  [
    'Pourquoi Windows affiche-t-il une alerte de sécurité ?',
    'L’exécutable n’est pas encore signé numériquement. Vérifiez que le fichier vient bien de la release officielle GitHub et comparez son empreinte SHA-256. En cas de doute, interrompez l’installation. Une empreinte confirme l’intégrité du fichier, pas sa sûreté à elle seule.',
  ],
  [
    'Le planning indique-t-il quand mon épisode sera disponible ?',
    'Le planning affiche les horaires de diffusion au Japon, convertis à ton heure locale, du lundi au dimanche. La disponibilité dans Hikari peut arriver ensuite selon les sources. Tu peux filtrer les séries du catalogue, repérer tes favoris et ouvrir leur fiche directement.',
  ],
  [
    'Quels modes de lecture sont proposés pour les mangas ?',
    'Lecture japonaise de droite à gauche, française de gauche à droite, double page sur grand écran ou défilement vertical pour les webtoons. Le mode Automatique choisit selon la forme des pages. Hikari garde ton choix pour chaque manga, ainsi que le chapitre et la page où tu t’es arrêté.',
  ],
] as const;
export function dateLabel(value: string | null) {
  return value
    ? new Intl.DateTimeFormat('fr-FR', { dateStyle: 'long', timeZone: 'Europe/Paris' }).format(
        new Date(value)
      )
    : 'Date indisponible';
}
export function sizeLabel(bytes: number) {
  return `${new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 1 }).format(bytes / 1024 / 1024)} Mio`;
}
