import { defineConfig } from 'vite';

// base relative : le build fonctionne à la racine d'un domaine comme dans un sous-dossier.
export default defineConfig({
  base: './',
  build: { target: 'es2020', assetsInlineLimit: 0, chunkSizeWarningLimit: 700 },
});
