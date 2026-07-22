# Mise en ligne sur Vercel

## 1. Importer le dépôt

Dans Vercel, créer un nouveau projet puis importer le dépôt GitHub `romainmannino/thebedroom`.

Vercel doit détecter automatiquement :

- Framework : Next.js
- Commande de build : `npm run build`
- Commande d’installation : `npm install`
- Dossier de sortie : valeur par défaut Next.js

## 2. Ajouter les variables d’environnement

Dans **Project Settings > Environment Variables**, ajouter pour Production, Preview et Development :

- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SECRET_KEY`

Utiliser exactement les mêmes valeurs que dans le fichier local `.env.local`.

Ne jamais publier la valeur de `SUPABASE_SECRET_KEY` dans GitHub ou dans une page accessible au navigateur.

## 3. Déployer

Lancer le premier déploiement depuis Vercel. Après chaque futur `git push` sur `main`, Vercel redéploiera automatiquement l’application.

## 4. Vérifications après déploiement

Tester dans cet ordre :

1. La page publique `/` s’affiche.
2. Les huit vignettes sont visibles et ouvrent leur contenu.
3. Les images Supabase sont visibles.
4. La page `/admin/apparence` charge la configuration.
5. Modifier un petit texte, enregistrer, actualiser la page publique et vérifier la modification.
6. Importer une image depuis l’administration et vérifier qu’elle reste visible après actualisation.

## 5. Sécurité avant diffusion publique

L’administration n’est pas encore protégée par une authentification. Ne pas partager l’adresse `/admin` tant que cette protection n’est pas ajoutée.

La page publique peut être testée et partagée, mais toute personne connaissant l’URL de l’administration pourrait actuellement modifier le livret.
