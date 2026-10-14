export type Category = 'sports' | 'fashion' | 'event' | 'portraits';

export interface PhotoItem {
  id: string;
  title: string;
  category: Category;
  categoryLabel: string;
  image: string;
  location: string;
  camera: string;
  lens: string;
  aperture: string;
  shutter: string;
  iso: string;
  story: string;
}

export const CONTACT = {
  whatsapp: '35699000000',
  instagram: 'auroralys',
  facebook: 'auroralys',
};

export type Channel = 'whatsapp' | 'instagram' | 'facebook';

export interface InquiryForm {
  name: string;
  type: string;
  when: string;
  message: string;
}

export const PHOTOS: PhotoItem[] = [
  {
    id: 'fashion-valletta-01',
    title: 'Grand Harbour Sovereign',
    category: 'fashion',
    categoryLabel: 'Fashion',
    image: 'images/fashion_valletta.jpg',
    location: 'Upper Barrakka, Valletta',
    camera: 'Hasselblad H6D-100c',
    lens: 'HC 50mm f/3.5 II',
    aperture: 'f/4.0',
    shutter: '1/800s',
    iso: 'ISO 100',
    story:
      'Emerald and crimson silk catching the Mediterranean wind as dusk settles over the Grand Harbour.',
  },
  {
    id: 'sports-kick-01',
    title: "Thunderstrike at Ta' Qali",
    category: 'sports',
    categoryLabel: 'Sports',
    image: 'images/malta_football_kick.jpg',
    location: "Ta' Qali National Stadium",
    camera: 'Canon EOS R5 Mark II',
    lens: 'RF 400mm f/2.8L IS USM',
    aperture: 'f/2.8',
    shutter: '1/4000s',
    iso: 'ISO 2500',
    story:
      "Malta's number 8 unleashes a volley under the floodlights as turf and spray hang in the night air.",
  },
  {
    id: 'event-wedding-01',
    title: 'The Grand Staircase',
    category: 'event',
    categoryLabel: 'Events',
    image: 'images/event_wedding_01.jpg',
    location: 'Corinthia Palace Hotel, Malta',
    camera: 'Leica SL2',
    lens: 'Summicron-SL 35mm f/2',
    aperture: 'f/2.8',
    shutter: '1/250s',
    iso: 'ISO 800',
    story:
      'An intimate moment between a newlywed couple on the grand marble staircase, captured in timeless black and white.',
  },
  {
    id: 'portraits-golden-01',
    title: 'Golden Hour Solitude',
    category: 'portraits',
    categoryLabel: 'Portraits',
    image: 'images/personal_portrait.jpg',
    location: 'Mdina Outskirts',
    camera: 'Fujifilm GFX 100 II',
    lens: 'GF 110mm f/2 R LM WR',
    aperture: 'f/2.0',
    shutter: '1/2000s',
    iso: 'ISO 200',
    story:
      'Natural light shaping an honest expression, with catchlights and warmth in the evening breeze.',
  },
  {
    id: 'sports-save-02',
    title: 'The Fingertip Save',
    category: 'sports',
    categoryLabel: 'Sports',
    image: 'images/malta_football_save.jpg',
    location: "Ta' Qali National Stadium",
    camera: 'Sony Alpha 1',
    lens: 'FE 600mm f/4 GM OSS',
    aperture: 'f/4.0',
    shutter: '1/5000s',
    iso: 'ISO 3200',
    story:
      'A horizontal dive in the 89th minute — the keeper tips the ball away through illuminated mist.',
  },
  {
    id: 'fashion-runway-02',
    title: 'Aurora Metallique',
    category: 'fashion',
    categoryLabel: 'Fashion',
    image: 'images/fashion_runway.jpg',
    location: 'Valletta Design Week',
    camera: 'Leica SL2',
    lens: 'Vario-Elmarit-SL 24-90mm',
    aperture: 'f/2.8',
    shutter: '1/1250s',
    iso: 'ISO 1600',
    story:
      'Sculpted metallic silhouettes walking a reflective catwalk bathed in aurora-green light.',
  },
  {
    id: 'event-gala-02',
    title: 'Black Tie Gala',
    category: 'event',
    categoryLabel: 'Events',
    image: 'images/event_gala_02.jpg',
    location: 'Phoenicia Hotel Grand Ballroom, Malta',
    camera: 'Canon EOS R5',
    lens: 'RF 35mm f/1.8',
    aperture: 'f/2.0',
    shutter: '1/125s',
    iso: 'ISO 3200',
    story:
      'A sea of black ties and crystal chandeliers — the energy of a prestigious charity gala captured in one frame.',
  },
  {
    id: 'portraits-couple-01',
    title: 'Dingli Horizons',
    category: 'portraits',
    categoryLabel: 'Portraits',
    image: 'images/personal_couple.jpg',
    location: 'Dingli Cliffs',
    camera: 'Canon EOS R5',
    lens: 'RF 50mm f/1.2L USM',
    aperture: 'f/1.4',
    shutter: '1/3200s',
    iso: 'ISO 100',
    story:
      "Unscripted warmth on Malta's highest coastline as the horizon melts into gold.",
  },
  {
    id: 'sports-nature-01',
    title: 'Dingli Sunset Solitude',
    category: 'sports',
    categoryLabel: 'Sports',
    image: 'images/nature_dingli_cliffs.jpg',
    location: 'Dingli Cliffs, Western Malta',
    camera: 'Sony Alpha 7R V',
    lens: 'FE 16-35mm f/2.8 GM II',
    aperture: 'f/8.0',
    shutter: '1/60s',
    iso: 'ISO 100',
    story:
      'Golden hour raking across ancient Mediterranean limestone cliffs dropping 250 meters into the azure sea.',
  },
  {
    id: 'event-gozo-01',
    title: 'Gozo Azure Sanctuary',
    category: 'event',
    categoryLabel: 'Events',
    image: 'images/nature_gozo_arch.jpg',
    location: 'Dwejra Coastal Reserve, Gozo',
    camera: 'Hasselblad X2D 100C',
    lens: 'XCD 21mm f/4',
    aperture: 'f/11',
    shutter: '1/125s',
    iso: 'ISO 64',
    story:
      'Crystal emerald-azure lagoon waters swirling beneath monumental sea arches — the backdrop for an outdoor ceremony.',
  },
  {
    id: 'fashion-nature-02',
    title: 'Mediterranean Couture',
    category: 'fashion',
    categoryLabel: 'Fashion',
    image: 'images/nature_gozo_arch.jpg',
    location: 'Azure Window, Gozo',
    camera: 'Hasselblad H6D-100c',
    lens: 'HC 100mm f/2.2',
    aperture: 'f/3.2',
    shutter: '1/500s',
    iso: 'ISO 64',
    story:
      'Flowing couture against the raw limestone arch — where Mediterranean nature meets haute fashion.',
  },
  {
    id: 'portraits-cliffs-02',
    title: 'Cliffside Stories',
    category: 'portraits',
    categoryLabel: 'Portraits',
    image: 'images/nature_dingli_cliffs.jpg',
    location: 'Dingli Cliffs',
    camera: 'Sony Alpha 7R V',
    lens: 'FE 85mm f/1.4 GM',
    aperture: 'f/1.6',
    shutter: '1/800s',
    iso: 'ISO 100',
    story:
      'The windswept cliffs frame a portrait of quiet resilience — nature and character in harmony.',
  },
];
