/**
 * Contenu factuel du portfolio.
 * Règle : chaque entrée vient d'une source vérifiable (brief, CV, no-line.fr, pages
 * publiques des plateformes et des événements). Rien n'est extrapolé.
 * Pour ajouter un projet, une playlist ou un événement : ajouter un objet au tableau.
 */
import type { Lang } from './i18n';

export type L10n = Record<Lang, string>;

export const contact = {
  email: 'martin@wiseband.com',
  phoneDisplay: '+33 6 10 33 80 96',
  phoneHref: '+33610338096',
  linkedin: 'https://www.linkedin.com/in/martin-roux-b25697330/',
  noLine: 'https://www.no-line.fr',
};

/* ------------------------------------------------------------------ projets */

export interface Project {
  id: string;
  artist: string;
  title: string;
  format: L10n;
  tracks: number;
  /** Date ISO vérifiée sur la page Spotify de la sortie. */
  released: string;
  platform: 'Spotify';
  url: string;
  cover: { local: string; remote: string };
  description: L10n;
  /** Renseigné uniquement quand le rôle est documenté. */
  role?: L10n;
  origin?: L10n;
}

export const projects: Project[] = [
  {
    id: 'big-d',
    artist: 'Big D',
    title: 'Le droit des larmes',
    format: { fr: 'EP', en: 'EP' },
    tracks: 8,
    released: '2026-09-18',
    platform: 'Spotify',
    url: 'https://open.spotify.com/intl-fr/album/7M0jrhcFqz7Kwo1W55gcmL?si=9FzuV7LHRgqt7A7yGtubfQ',
    cover: {
      local: 'big-d-le-droit-des-larmes.jpg',
      remote: 'https://i.scdn.co/image/ab67616d0000b2730fa794a3f728a508484481d3',
    },
    description: {
      fr: 'Un EP de huit titres, sorti le 18 septembre 2026 et disponible sur Spotify.',
      en: 'An eight-track EP, released on 18 September 2026 and available on Spotify.',
    },
  },
  {
    id: 'issho',
    artist: 'Issho',
    title: 'ON S’VOIT PAS GRANDIR',
    format: { fr: 'EP', en: 'EP' },
    tracks: 6,
    released: '2026-04-03',
    platform: 'Spotify',
    url: 'https://open.spotify.com/intl-fr/album/1k6LEjm5YkfBKyJWXzrFYd?si=JPVoixSPQI-67YWgg8n8yA',
    cover: {
      local: 'issho-on-svoit-pas-grandir.jpg',
      remote: 'https://i.scdn.co/image/ab67616d0000b273363f19ef80e70d2aa4c5e669',
    },
    description: {
      fr: 'Un EP de six titres, sorti le 3 avril 2026. Issho est rappeur, ingénieur du son et auteur de ses propres visuels.',
      en: 'A six-track EP, released on 3 April 2026. Issho is a rapper, a sound engineer and the author of his own visuals.',
    },
    role: {
      fr: 'Développement de l’artiste et du projet avec No Line.',
      en: 'Artist and project development with No Line.',
    },
    origin: { fr: 'Angers et Paris', en: 'Angers and Paris' },
  },
];

/* ---------------------------------------------------------------- playlists */

export type Platform = 'apple' | 'spotify' | 'deezer';

export const platformNames: Record<Platform, string> = {
  apple: 'Apple Music',
  spotify: 'Spotify',
  deezer: 'Deezer',
};

export interface Playlist {
  id: string;
  name: string;
  platform: Platform;
  curator: string;
  url: string;
  /** Visuel officiel servi par la plateforme, quand son adresse est connue. */
  cover?: { local: string; remote: string };
  /** Taille de la tuile dans la mosaïque. */
  size: 'xl' | 'tall' | 'wide' | 'std';
}

export const playlists: Playlist[] = [
  {
    id: 'sorties-rap',
    name: 'Sorties Rap',
    platform: 'apple',
    curator: 'Apple Music',
    url: 'https://music.apple.com/fr/playlist/sorties-rap/pl.435c176872ef41648e70e65b149b21f8',
    size: 'xl',
  },
  {
    id: 'rap-diggers',
    name: 'Rap Diggers',
    platform: 'spotify',
    curator: 'Spotify',
    url: 'https://open.spotify.com/playlist/37i9dQZF1DX9PXZbuB8BjJ?si=pjWahfWJQsqBzPq8J-Uhig&utm_source=copy-link&pi=RUBP7OlpStOYO',
    cover: { local: 'rap-diggers.jpg', remote: 'https://i.scdn.co/image/ab67706f000000026664edf389ab21b200793166' },
    size: 'tall',
  },
  {
    id: 'fines-plumes',
    name: 'Fines Plumes',
    platform: 'deezer',
    curator: 'Deezer',
    url: 'https://www.deezer.com/fr/playlist/2677972784',
    cover: { local: 'fines-plumes.jpg', remote: 'https://cdn-images.dzcdn.net/images/playlist/dce9c334859b6bbf8b37a881a3ac394f/500x500.jpg' },
    size: 'std',
  },
  {
    id: 'new-music-daily',
    name: 'New Music Daily',
    platform: 'apple',
    curator: 'Apple Music',
    url: 'https://music.apple.com/fr/playlist/new-music-daily/pl.2b0e6e332fdf4b7a91164da3162127b5',
    size: 'wide',
  },
  {
    id: 'le-flow',
    name: 'Le Flow',
    platform: 'spotify',
    curator: 'Spotify',
    url: 'https://open.spotify.com/playlist/37i9dQZF1DWWGfAvkwMeip?si=T65Lw9c4Q1GXphSPg9kslw&utm_source=copy-link&pi=BdToYqgkSXynt',
    cover: { local: 'le-flow.jpg', remote: 'https://i.scdn.co/image/ab67706f000000024adddacdde042444d2f703b1' },
    size: 'std',
  },
  {
    id: 'nouveautes-vendredi',
    name: 'Les nouveautés du vendredi',
    platform: 'deezer',
    curator: 'Deezer',
    url: 'https://www.deezer.com/fr/playlist/1478649355',
    cover: { local: 'les-nouveautes-du-vendredi.jpg', remote: 'https://cdn-images.dzcdn.net/images/playlist/e708ff1cf3e1eed63c3f19314a2b74bf/500x500.jpg' },
    size: 'std',
  },
  {
    id: 'actu-rap',
    name: 'Actu Rap',
    platform: 'deezer',
    curator: 'Deezer',
    url: 'https://www.deezer.com/fr/playlist/1071669561',
    cover: { local: 'actu-rap.jpg', remote: 'https://cdn-images.dzcdn.net/images/playlist/1a27f386a3294e10cc6cd2c0ce8a4340/500x500.jpg' },
    size: 'std',
  },
];

/* ------------------------------------------------------------------ No Line */

export const roster: { name: string; tag: L10n; url: string }[] = [
  { name: 'Ennio', tag: { fr: 'Rap, Lyon', en: 'Rap, Lyon' }, url: 'https://www.no-line.fr/artiste-ennio.html' },
  { name: 'Issho', tag: { fr: 'Rap, Angers et Paris', en: 'Rap, Angers and Paris' }, url: 'https://www.no-line.fr/artiste-issho.html' },
  { name: 'S-tra', tag: { fr: 'Cloud rap, Angers', en: 'Cloud rap, Angers' }, url: 'https://www.no-line.fr/artiste-stra.html' },
  { name: 'Paul Duquesne', tag: { fr: 'Producteur, Nanterre et Paris', en: 'Producer, Nanterre and Paris' }, url: 'https://www.no-line.fr/artiste-paulduquesne.html' },
  { name: 'Glitsh', tag: { fr: 'Rap, punk et tekno', en: 'Rap, punk and tekno' }, url: 'https://www.no-line.fr/artiste-glitsh.html' },
];

/* --------------------------------------------------------------- événements */

/** organised = organisé par Martin · attended = participation · announced = annoncé au programme */
export type EventStatus = 'organised' | 'attended' | 'announced';

export interface EventItem {
  id: string;
  name: string;
  date: L10n;
  place?: L10n;
  status: EventStatus;
  role: L10n;
  details: L10n[];
  source: { label: L10n; url?: string };
  /** false = information non vérifiée, non affichée tant qu'elle n'est pas validée. */
  published: boolean;
}

export const events: EventItem[] = [
  {
    id: 'jirafe-2026',
    name: 'JIRAFE des Musiques Actuelles',
    date: { fr: 'Septembre 2026', en: 'September 2026' },
    place: { fr: 'FGO-Barbara, Paris 18e', en: 'FGO-Barbara, Paris 18th' },
    status: 'announced',
    role: {
      fr: 'Annoncé comme intervenant, en tant que responsable du label No Line.',
      en: 'Announced as a speaker, as head of the No Line label.',
    },
    details: [
      {
        fr: 'Pitch session Wiseband « Développer votre revenu et votre notoriété » : des artistes sélectionnés présentent leur musique et reçoivent des conseils.',
        en: 'Wiseband pitch session on growing revenue and reach: selected artists present their music and get advice.',
      },
      {
        fr: 'Convention organisée par le Réseau MAP.',
        en: 'Convention organised by Réseau MAP.',
      },
    ],
    source: {
      label: { fr: 'Programme officiel, Réseau MAP', en: 'Official programme, Réseau MAP' },
      url: 'https://www.reseau-map.fr/projets/jirafe/',
    },
    published: true,
  },
  {
    id: 'disquaire-day-2026',
    name: 'Disquaire Day',
    date: { fr: '18 avril 2026', en: '18 April 2026' },
    status: 'organised',
    role: {
      fr: 'Organisation complète de la présence de Wiseband sur l’événement.',
      en: 'Full organisation of Wiseband’s presence at the event.',
    },
    details: [
      { fr: 'Direction artistique du stand.', en: 'Art direction of the stand.' },
      { fr: 'Programmation d’un showcase de Nerlov.', en: 'Programming of a Nerlov showcase.' },
      {
        fr: 'Lancement de la boutique de Dombrance, venu dédicacer ses vinyles.',
        en: 'Launch of the shop of Dombrance, who came to sign his vinyl records.',
      },
    ],
    source: { label: { fr: 'CV de Martin Roux', en: 'Martin Roux’s résumé' } },
    published: true,
  },
  {
    // Cité dans le brief, mais aucune source publique ne documente une participation.
    id: 'mama-2026',
    name: 'MaMA Music & Convention',
    date: { fr: '14 au 16 octobre 2026', en: '14 to 16 October 2026' },
    place: { fr: 'Pigalle et Montmartre, Paris', en: 'Pigalle and Montmartre, Paris' },
    status: 'attended',
    role: { fr: 'À préciser.', en: 'To be confirmed.' },
    details: [],
    source: { label: { fr: 'À valider avec Martin', en: 'To be validated with Martin' } },
    published: false,
  },
];

/* ------------------------------------------------------------------ parcours */

export interface Step {
  title: L10n;
  date: L10n;
  text: L10n;
}

export const journey: Step[] = [
  {
    title: { fr: 'Développement d’un EP', en: 'Development of an EP' },
    date: { fr: 'Oct. 2023 à janv. 2024', en: 'Oct 2023 to Jan 2024' },
    text: {
      fr: 'Stratégie marketing, relations presse et press kit. Direction artistique d’un clip et de l’EP. Plus de 25 000 écoutes générées pour le projet.',
      en: 'Marketing strategy, press relations and press kit. Art direction of a music video and of the EP. More than 25,000 streams generated for the project.',
    },
  },
  {
    title: { fr: 'Développement de deux EP', en: 'Development of two EPs' },
    date: { fr: 'Janv. à fév. 2025', en: 'Jan to Feb 2025' },
    text: {
      fr: 'Dossier de presse, stratégie marketing, démarchage de médias et de concerts. Préparation et direction artistique d’un clip tourné en Islande.',
      en: 'Press kit, marketing strategy, outreach to media and venues. Preparation and art direction of a music video shot in Iceland.',
    },
  },
  {
    title: { fr: 'Wiseband, en alternance', en: 'Wiseband, work-study' },
    date: { fr: 'Août 2025 à août 2026', en: 'Aug 2025 to Aug 2026' },
    text: {
      fr: 'Pitch auprès des playlists éditoriales, dont Apple Music Sorties Rap. Nouvelle direction artistique de Global Trax, la marque techno de Wiseband. Mise à jour de playlists et contenus vidéo pour Instagram et TikTok.',
      en: 'Pitching to editorial playlists, including Apple Music Sorties Rap. New art direction for Global Trax, Wiseband’s techno brand. Playlist updates and video content for Instagram and TikTok.',
    },
  },
  {
    title: { fr: 'Création de No Line', en: 'Creation of No Line' },
    date: { fr: 'Décembre 2025', en: 'December 2025' },
    text: {
      fr: 'Veille et repérage de talents émergents. Lancement de la playlist « Dans le viseur » sur Spotify, Apple Music et Deezer. Développement d’artistes et de projets comme Issho, Tvrzan ou XVA univers.',
      en: 'Scouting of emerging talent. Launch of the “Dans le viseur” playlist on Spotify, Apple Music and Deezer. Development of artists and projects such as Issho, Tvrzan and XVA univers.',
    },
  },
  {
    title: { fr: 'Disquaire Day', en: 'Disquaire Day' },
    date: { fr: '18 avril 2026', en: '18 April 2026' },
    text: {
      fr: 'Organisation de la présence de Wiseband : stand, showcase et lancement de boutique.',
      en: 'Organisation of Wiseband’s presence: stand, showcase and shop launch.',
    },
  },
  {
    title: { fr: 'JIRAFE des Musiques Actuelles', en: 'JIRAFE des Musiques Actuelles' },
    date: { fr: 'Septembre 2026', en: 'September 2026' },
    text: {
      fr: 'Annoncé au programme de la pitch session Wiseband, comme responsable du label No Line.',
      en: 'Announced on the programme of the Wiseband pitch session, as head of the No Line label.',
    },
  },
];

export const skills: L10n[] = [
  { fr: 'Direction artistique', en: 'Art direction' },
  { fr: 'Pitch d’artistes', en: 'Artist pitching' },
  { fr: 'Culture rap', en: 'Rap culture' },
  { fr: 'Distribution digitale', en: 'Digital distribution' },
  { fr: 'Relation artiste', en: 'Artist relations' },
  { fr: 'Stratégie de communication', en: 'Communication strategy' },
  { fr: 'Réseaux sociaux', en: 'Social media' },
  { fr: 'Gestion d’équipe', en: 'Team coordination' },
];
