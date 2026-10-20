# Site officiel Hikari

Le site est développé à la racine de `hikari-releases`, séparément de l’application Windows privée. Le README public et ses captures restent conservés. Aucune dépendance au code privé n’est nécessaire pour compiler ou déployer le site.

## Développement

Node.js 24 et npm sont nécessaires.

```powershell
npm ci
npm run dev
```

Ouvrir `http://localhost:43123`. Le port est déjà défini dans le script `dev` : aucun argument supplémentaire n’est nécessaire, ce qui évite le problème de transmission de `--` observé avec npm 12 sous PowerShell. Ce port évite les plages réservées présentes sur la machine Windows de développement. Aucun service de base de données n’est requis.

```powershell
npm run typecheck
npm test
npm run build
npm run test:e2e
npm audit --omit=dev
```

Les tests navigateur utilisent Chrome installé en local. En CI, Playwright utilise Chromium, installé par le workflow. Les tests démarrent leur serveur de production sur `127.0.0.1:43124` avec des releases simulées, dans `artifacts/e2e-cache` ignoré par Git. Ces données ne sont jamais embarquées dans l’image ni envoyées à GitHub. `E2E_BASE_URL` permet de vérifier un serveur déjà lancé. Le test de téléchargement vérifie un lien ; il ne lance pas d’exécutable.

## Architecture

- Next.js 16.4.2 App Router, React 19, TypeScript strict et runtime Node standalone.
- Tailwind CSS 4.3.3 et FlyonUI 2.4.1. Composants officiels : navbar, buttons, cards, badges, tabs, accordion, collapse, modal, alerts, skeleton et pagination.
- Les plugins JS FlyonUI sont importés depuis leurs modules `.mjs` dans le navigateur. `autoInit()` initialise leurs collections ; les instances sont détruites à la navigation. Ne pas importer les bundles UMD `.js` comme des classes ES.
- Server Components pour les pages et les releases. Client Components limités aux thèmes, à la galerie, à l’initialisation des interactions FlyonUI et aux mouvements de présentation.
- Fraunces, Manrope et Material Icons sont servis localement ; aucun CDN de polices, aucune télémétrie applicative.
- Les routes qui affichent les versions sont dynamiques : pas de deuxième cache HTML susceptible de retarder la synchronisation. `cache()` de React déduplique les appels au sein du rendu ; `ReleaseCache` mutualise les appels entre visiteurs.

## Releases : fonctionnement exact

`src/lib/release-cache.ts` interroge deux endpoints fixes de GitHub : `/releases/latest` et `/releases?per_page=100&page=1`. Les pages suivantes de l’historique sont suivies si nécessaire (limite de sécurité : 20 pages). Les drafts et prereleases sont exclus.

Une consultation après cinq minutes attend une revalidation unique. Les consultations simultanées partagent cette même promesse. Aucun rebuild ni redéploiement n’est nécessaire. Sans visite, aucun appel inutile n’est effectué ; la visite suivante déclenche la mise à jour. Les pages déjà ouvertes restent affichées jusqu’à leur prochaine navigation ou actualisation.

Les réponses sont validées avec Zod. Le tag, l’URL de release et les assets sont vérifiés. Seul un asset non vide nommé exactement `Hikari.exe`, sous le chemin officiel du même tag, active le téléchargement direct. Sans asset valide, le site l’explique et renvoie à GitHub. SHA-256 provient du champ `digest` officiel lorsqu’il existe ; le fichier `SHA256SUMS.txt` est proposé lorsqu’il est publié.

Les requêtes ont un timeout de huit secondes, une limite de taille, des ETags et aucun suivi automatique des redirections d’API. Le jeton facultatif reste exclusivement côté serveur. L’historique et la dernière version forment un instantané cohérent, écrit par remplacement atomique dans `RELEASE_CACHE_DIR/releases-v1.json`.

En cas de panne ou réponse invalide, le dernier instantané est conservé et un avertissement apparaît. Une relance est tentée au plus tôt après une minute ; les réponses 403/429 respectent le délai de quota communiqué par GitHub, dans la limite d’une heure. À froid et hors ligne, le site n’invente aucune version. Un échec d’écriture du cache est journalisé ; le cache mémoire continue de fonctionner, mais la persistance nécessite de rétablir les permissions du volume.

Pour plusieurs instances actives durablement, un cache coordonné serait nécessaire. Le déploiement Pushora conserve une instance active et une candidate pendant la bascule blue/green ; chaque processus garde sa promesse et son cache mémoire. Le volume contient seulement les données publiques validées, sans secret ni exécutable.

## Ressources et contenu

Les sept captures officielles sont conservées dans `docs/screenshots`. Leurs versions WebP optimisées se trouvent dans `public/screenshots`. La galerie présente l’application et ses fonctions, sans commentaire sur la provenance du dépôt ni sur le processus de création du site.

`npm run assets` reconstruit les WebP et l’image Open Graph depuis les ressources déjà présentes. L’import initial du logo a utilisé les seuls fichiers autorisés de `E:\Dev\Hikari`, en lecture seule. L’option de maintenance `--import-brand` est réservée à une mise à jour explicite des logos. Les builds ordinaires n’accèdent jamais à ce chemin.

Les deux blocs `flyonui/theme` de `globals.css` reprennent les couleurs exactes de l’application, depuis `frontend/src/styles/app.css`. Les couleurs du texte et des fonds passent par des tokens sémantiques. Quelques contrastes de composants de présentation en thème clair sont adaptés sans changer la palette. Le thème est choisi par script avant l’affichage, puis enregistré dans `localStorage`.

La présentation est définie dans `experience.css` ; les styles des pages fonctionnelles sont séparés dans `pages.css`. La navbar FlyonUI a un fond transparent : le header porte seul le fond continu sur toute la largeur.

Les vagues sont des surfaces SVG pleines, uniquement dans le haut de l’accueil et le véritable footer. Aucun tracé fin ni boucle décorative n’est utilisé. Le footer n’a pas de bordure supérieure. Le fond de l’accueil utilise un dégradé CSS continu bleu/abricot : les anciens éléments `hero-atmosphere`, formes rondes et textures ont été supprimés. La parallaxe porte sur les fenêtres de l’application. `requestAnimationFrame` calcule des déplacements bornés et les applique via Web Animations, sans modifier les attributs HTML contrôlés par React : cela évite les conflits d’hydratation pendant les navigations et le rechargement à chaud. Les apparitions utilisent une translation additive, sans réduction d’opacité du texte qui dégraderait temporairement les contrastes. Aucun moteur d’animation externe ni image générée n’est nécessaire. Les animations et la parallaxe respectent `prefers-reduced-motion`.

La CSP autorise `unsafe-eval` uniquement en développement, pour les diagnostics de React ; cette autorisation est absente du build de production. `npm run test:dev`, avec le serveur de développement démarré, contrôle les huit pages en clair et en sombre et échoue sur les erreurs ou avertissements de console. Les outils de capture chargent les images par défilement normal et ne modifient jamais les attributs contrôlés par React.

Les textes présentent directement les fonctions de l’application et utilisent un tutoiement naturel. Les affirmations produit sont étayées par le README du projet et les notes 1.0.0 à 1.1.4, consultés en lecture seule dans le checkout Windows autorisé. La restauration est publiée depuis 1.1.3 ; mangas, planning et image dans l’image depuis 1.1.0. Le planning possède sa propre section ; ses heures de diffusion sont distinguées de la disponibilité chez les sources. Hikari IA détaille les deux moteurs, le mode Automatique, la préparation initiale, les finitions, la comparaison et les statistiques. Aucun code expérimental n’est intégré. Aucun visuel IA ni faux comparatif avant/après n’est utilisé.

Le Markdown des versions n’exécute pas de HTML. Les images distantes y sont neutralisées et les protocoles des liens filtrés. Les contenus promotionnels utilisent le nom Hikari IA ; les attributions des moteurs tiers sont réservées à la page Crédits.

La page dédiée `/hikari-ia` approfondit les moteurs, les règles de sélection, le pipeline GPU, la préparation, les réglages et le diagnostic. Elle est liée depuis la navigation, le bloc IA de l’accueil, l’installation et le footer, et figure dans le sitemap.

Les pages secondaires utilisent `PageIntro` et `inner-pages.css` : en-têtes à deux colonnes avec dégradé continu, chronologie des versions, capture mise en avant, numérotation des guides et sommaires. Les notes publiques des versions restent les données GitHub, sans réécriture ni faux contenu promotionnel.

La modal FlyonUI de la galerie utilise `overlay-open:opacity-100`. La classe `modal` reste transparente par défaut : tester uniquement son ouverture ou sa présence dans la mise en page ne suffit pas. Le test vérifie aussi l’opacité de la fenêtre, le chargement et les dimensions de l’image agrandie. Les sept captures ont été ouvertes dans les deux thèmes sur ordinateur et mobile (28 ouvertures).

## Maintenance

- Mettre à jour les dépendances dans une branche et conserver `package-lock.json` ; exécuter les contrôles avant livraison.
- Actualiser captures et descriptions quand l’interface évolue. Vérifier les fonctionnalités dans une release publique avant de les annoncer.
- Conserver `/app/data` dans le stockage Pushora. En cas de cache corrompu, l’application repart automatiquement sur GitHub ; ne supprimer que le fichier de cache propre à Hikari, jamais le volume d’une autre application.
- Consulter stdout/stderr dans Pushora pour `releases.refresh_failed` ou `releases.cache_write_failed`.
- Le healthcheck `/api/health` contrôle le serveur indépendamment de GitHub. Une panne GitHub ne doit pas déclencher un redémarrage en boucle.

Déploiement : voir [DEPLOIEMENT-HIKARI.md](DEPLOIEMENT-HIKARI.md).
