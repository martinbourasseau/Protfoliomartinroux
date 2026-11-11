# Portfolio de Martin Roux

Site bilingue (français, anglais) en sept pages, avec une scène 3D interactive.
Vite, TypeScript et Three.js. Aucun framework d'interface.

## Commandes

```bash
npm install
npm run dev            # développement
npm run build          # vérification TypeScript + build de production dans dist/
npm run preview        # sert dist/ en local
npm run fetch:covers   # télécharge les pochettes officielles dans src/assets/covers/
```

Lancez `npm run fetch:covers` puis `npm run build` avant la mise en ligne : le site
sert alors ses propres copies des pochettes. Sans ces fichiers, il demande les visuels
aux plateformes et, à défaut, affiche un visuel typographique.

## Organisation

| Chemin | Rôle |
| --- | --- |
| `src/data.ts` | Tout le contenu factuel : projets, playlists, roster, événements, parcours |
| `src/i18n.ts` | Dictionnaire français et anglais, typé (une clé manquante bloque le build) |
| `src/routes.ts` | Liste des pages, forme et palette de la scène 3D pour chacune |
| `src/pages/` | Une page par fichier |
| `src/gl/` | Scène WebGL : fond fluide tramé et nuage de particules |
| `src/fx/` | Inclinaison 3D des pochettes, titre à largeur variable |
| `src/styles/main.css` | Système graphique |

## Ajouter du contenu

- Un projet, une playlist, un événement : ajouter un objet dans le tableau correspondant de `src/data.ts`.
- Un événement non vérifié reste invisible tant que `published` vaut `false` (cas du MaMA).
- Le rôle de Martin sur un projet (`role`) ne s'affiche que s'il est renseigné.

## Avant la mise en production

- Remplacer `og:image` par une adresse absolue dans `index.html`.
- La navigation repose sur des ancres (`#about`, `#projects`…). Pour un référencement
  distinct par page et par langue, prévoir des adresses réelles (`/fr/projets`, `/en/projects`)
  avec pré-rendu : `parseRoute` et `go` dans `src/main.ts` sont les seuls points à adapter.
- Le formulaire prépare un e-mail dans la messagerie du visiteur. Pour un envoi direct,
  brancher un service d'envoi (Formspree, Resend, fonction serverless) dans `src/pages/contact.ts`.
