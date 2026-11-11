// Télécharge les pochettes officielles dans src/assets/covers/ pour ne plus dépendre
// des CDN des plateformes. À lancer une fois avant la mise en production :
//   npm run fetch:covers
import { writeFile, mkdir } from 'node:fs/promises';

const covers = {
  'big-d-le-droit-des-larmes.jpg': 'https://i.scdn.co/image/ab67616d0000b2730fa794a3f728a508484481d3',
  'issho-on-svoit-pas-grandir.jpg': 'https://i.scdn.co/image/ab67616d0000b273363f19ef80e70d2aa4c5e669',
  'rap-diggers.jpg': 'https://i.scdn.co/image/ab67706f000000026664edf389ab21b200793166',
  'le-flow.jpg': 'https://i.scdn.co/image/ab67706f000000024adddacdde042444d2f703b1',
  'fines-plumes.jpg': 'https://cdn-images.dzcdn.net/images/playlist/dce9c334859b6bbf8b37a881a3ac394f/500x500.jpg',
  'les-nouveautes-du-vendredi.jpg': 'https://cdn-images.dzcdn.net/images/playlist/e708ff1cf3e1eed63c3f19314a2b74bf/500x500.jpg',
  'actu-rap.jpg': 'https://cdn-images.dzcdn.net/images/playlist/1a27f386a3294e10cc6cd2c0ce8a4340/500x500.jpg',
};

await mkdir('src/assets/covers', { recursive: true });
for (const [file, url] of Object.entries(covers)) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    await writeFile(`src/assets/covers/${file}`, Buffer.from(await res.arrayBuffer()));
    console.log('ok  ', file);
  } catch (err) {
    console.warn('skip', file, String(err));
  }
}
