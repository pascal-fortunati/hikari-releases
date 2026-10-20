# Déploiement Hikari dans Pushora

Le site est une application Next.js standalone, construite en CI et déployée par Pushora. Le dépôt conserve séparément les releases de l’application Windows ; le workflow du site ne construit ni ne remplace `Hikari.exe`.

## Configuration

| Paramètre          | Valeur                                                          |
| ------------------ | --------------------------------------------------------------- |
| Application        | Hikari (`hikari`)                                               |
| Dépôt / branche    | `pascal-fortunati/hikari-releases` / `main`                     |
| Workflow           | `.github/workflows/deploy.yml`                                  |
| Image              | `ghcr.io/pascal-fortunati/hikari-releases:sha-<commit complet>` |
| Port interne       | `3000`                                                          |
| Profil             | `strict`, utilisateur `10001:10001`                             |
| Ressources         | 256 Mio, 500 milliCPU, 256 PID                                  |
| Santé              | `/api/health`, délai de démarrage de 90 secondes                |
| Dossier persistant | `/app/data`                                                     |
| Variable serveur   | `RELEASE_CACHE_DIR=/app/data`                                   |
| Domaine            | `hikari.pascal-fortunati.fr`, HTTPS                             |
| Base de données    | Aucune                                                          |

`deploy/pushora-app.json` fournit les paramètres de l’application. Les identifiants réels du dépôt lié, le stockage et le domaine sont configurés dans Pushora et ne sont pas stockés dans ce fichier. Aucun secret n’est nécessaire au build.

Les captures et logos sont préparés en WebP et servis directement (`images.unoptimized`). Ne pas activer leur conversion à la volée : plusieurs conversions simultanées dépassent la limite de 256 Mio et provoquent des arrêts du serveur, puis des réponses 502 sur les pages et les scripts. Après déploiement, vérifier aussi les images dans un navigateur et l’absence de redémarrages du conteneur.

## Mise en ligne

1. Publier le commit sur `main`. Le workflow lance TypeScript, les tests, la compilation, l’audit des dépendances et les tests navigateur avant de publier l’image sur GHCR.
2. Dans Pushora, lier le dépôt GitHub et suivre le workflow existant `deploy.yml`. Éviter de générer un second workflow.
3. Enregistrer l’application avec les paramètres ci-dessus, conserver `/app/data` et définir sa variable serveur. Les préversions de pull requests peuvent rester désactivées.
4. Déployer le tag `sha-<commit>` correspondant à un workflow réussi. L’image doit être accessible au mécanisme de pull du serveur.
5. Associer le domaine à Hikari. Pushora gère le proxy vers `app-hikari:3000` et le certificat HTTPS via son intégration Nginx Proxy Manager.
6. Vérifier la santé, les pages, les images, le lien officiel de téléchargement et les ressources du conteneur depuis le domaine public.

Le jeton `GITHUB_TOKEN` de la CI est éphémère et réservé à la publication GHCR. Un éventuel jeton de lecture de l’API des releases se configure comme secret serveur dans Pushora ; il n’est jamais une variable publique Next.js.

## Mises à jour et retour arrière

Un nouveau commit sur la branche suivie construit une nouvelle image. Le mode webhook de Pushora permet de déclencher son déploiement après réussite du workflow. Les nouvelles releases de l’application Windows apparaissent, elles, par revalidation GitHub sans reconstruire le site.

Pour revenir en arrière, utiliser le déploiement précédent dans Pushora. Le cache persistant reste attaché à l’application. Ne pas modifier les réseaux, domaines ou volumes des autres applications.

## Vérification locale Docker

```powershell
docker compose -p hikari-site-qa up -d --build
```

Ouvrir `http://localhost:43125`. Le Compose est réservé aux essais locaux ; la production est gérée par Pushora.

```powershell
docker compose -p hikari-site-qa logs hikari
docker compose -p hikari-site-qa stop
```
