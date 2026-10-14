import {
  Component,
  HostListener,
  PLATFORM_ID,
  afterNextRender,
  computed,
  inject,
  signal,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type Category = 'football' | 'fashion' | 'personal' | 'reels' | 'nature';

export interface PhotoItem {
  id: string;
  title: string;
  category: Category;
  categoryLabel: string;
  image: string;
  videoUrl?: string;
  duration?: string;
  location: string;
  camera: string;
  lens: string;
  aperture: string;
  shutter: string;
  iso: string;
  story: string;
}

export type AdjustKey =
  | 'aperture'
  | 'brightness'
  | 'contrast'
  | 'saturation'
  | 'warmth'
  | 'hue'
  | 'mono'
  | 'vignette'
  | 'fade';

export interface Control {
  key: AdjustKey;
  label: string;
  min: number;
  max: number;
  step: number;
  unit: string;
  group: 'Light' | 'Colour' | 'Mood';
}

export interface Preset {
  name: string;
  values: Partial<Record<AdjustKey, number>>;
}

const DEFAULTS: Record<AdjustKey, number> = {
  aperture: 2.8,
  brightness: 100,
  contrast: 100,
  saturation: 100,
  warmth: 0,
  hue: 0,
  mono: 0,
  vignette: 0,
  fade: 0,
};

/** Hue stops the page background travels through while scrolling. */
const BG_HUES = [235, 275, 195, 150, 330, 255];

/**
 * Where inquiries are sent. Replace these with your real accounts:
 *  - whatsapp: phone number in international format, digits only (e.g. 356 99 123 456 -> '35699123456')
 *  - instagram / facebook: the username / page name from your profile URL
 */
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

const SECTION_IDS = ['home', 'portfolio', 'lab', 'contact'];

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  // ---------- Scroll + pointer state ----------
  readonly scrollProgress = signal(0); // 0..1 across the whole page
  readonly mouseX = signal(0); // -1..1
  readonly mouseY = signal(0); // -1..1

  // ---------- Hero ----------
  /** Tilt for the hero camera, following the mouse. */
  readonly cameraTilt = computed(
    () =>
      `transform: perspective(1100px) rotateY(${(this.mouseX() * 12).toFixed(1)}deg) rotateX(${(-this.mouseY() * 9).toFixed(1)}deg);`,
  );

  readonly marqueeWords = [
    'Nature & Landscapes',
    'Malta Football',
    'Reels & Short Video',
    'Fashion Editorial',
    'Personal Portraits',
    'Golden Hour',
    'Stadium Lights',
    'Haute Couture',
  ];

  // ---------- Gallery ----------
  readonly photos: PhotoItem[] = [
    {
      id: 'reel-shutter-01',
      title: 'Macro Shutter Kinetics',
      category: 'reels',
      categoryLabel: 'Reel / Short Video',
      image: 'images/malta_football_kick.jpg',
      videoUrl: 'videos/photography_bg.webm',
      duration: '0:20',
      location: 'Optics Studio, Malta',
      camera: 'Phantom Flex4K / Canon R5',
      lens: 'RF 100mm f/2.8L Macro IS USM',
      aperture: 'f/2.8',
      shutter: '1/8000s',
      iso: 'ISO 800',
      story:
        'Mechanical ballet in extreme slow-motion: the dual shutter curtains and reflex mirror box cycling at 1/8000th of a second under studio lighting.',
    },
    {
      id: 'reel-matchday-02',
      title: 'Matchday Kinetic Volley Reel',
      category: 'reels',
      categoryLabel: 'Reel / Short Video',
      image: 'images/malta_football_save.jpg',
      videoUrl: 'videos/photography_bg.webm',
      duration: '0:35',
      location: "Ta' Qali National Stadium",
      camera: 'Sony FX3 Cinema Line',
      lens: 'FE 400mm f/2.8 GM OSS',
      aperture: 'f/2.8',
      shutter: '1/2000s',
      iso: 'ISO 1600',
      story:
        'High-octane short reel capturing the raw heartbeat of Malta football — explosive saves, pre-match adrenaline, and the roar under the floodlights.',
    },
    {
      id: 'malta-strike-01',
      title: "Thunderstrike at Ta' Qali",
      category: 'football',
      categoryLabel: 'Malta Football',
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
      id: 'fashion-valletta-01',
      title: 'Grand Harbour Sovereign',
      category: 'fashion',
      categoryLabel: 'Fashion Shoot',
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
      id: 'malta-save-02',
      title: 'The Fingertip Save',
      category: 'football',
      categoryLabel: 'Malta Football',
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
      categoryLabel: 'Fashion Shoot',
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
      id: 'personal-cliffs-01',
      title: 'Dingli Horizons',
      category: 'personal',
      categoryLabel: 'Personal Shoot',
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
      id: 'personal-portrait-02',
      title: 'Golden Hour Solitude',
      category: 'personal',
      categoryLabel: 'Personal Shoot',
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
      id: 'nature-dingli-01',
      title: 'Dingli Sunset Solitude',
      category: 'nature',
      categoryLabel: 'Nature & Landscapes',
      image: 'images/nature_dingli_cliffs.jpg',
      location: 'Dingli Cliffs, Western Malta',
      camera: 'Sony Alpha 7R V',
      lens: 'FE 16-35mm f/2.8 GM II',
      aperture: 'f/8.0',
      shutter: '1/60s',
      iso: 'ISO 100',
      story:
        'Golden hour raking across ancient Mediterranean limestone cliffs dropping 250 meters into the azure sea, capturing raw geological majesty.',
    },
    {
      id: 'nature-gozo-02',
      title: 'Gozo Azure Sanctuary',
      category: 'nature',
      categoryLabel: 'Nature & Landscapes',
      image: 'images/nature_gozo_arch.jpg',
      location: 'Dwejra Coastal Reserve, Gozo',
      camera: 'Hasselblad X2D 100C',
      lens: 'XCD 21mm f/4',
      aperture: 'f/11',
      shutter: '1/125s',
      iso: 'ISO 64',
      story:
        'Crystal emerald-azure lagoon waters swirling beneath monumental sea arches, bathed in radiant Mediterranean summer clarity.',
    },
  ];

  readonly filters: { key: 'all' | Category; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'personal', label: 'Personal Shoots' },
    { key: 'nature', label: 'Nature & Landscapes' },
    { key: 'reels', label: 'Reels / Short Video' },
    { key: 'football', label: 'Malta Football' },
    { key: 'fashion', label: 'Fashion Shoots' },
  ];

  readonly activeCategory = signal<'all' | Category>('all');
  readonly selectedPhoto = signal<PhotoItem | null>(null);
  readonly isFlashing = signal(false);

  readonly filteredPhotos = computed(() => {
    const cat = this.activeCategory();
    return cat === 'all' ? this.photos : this.photos.filter((p) => p.category === cat);
  });

  countFor(key: 'all' | Category): number {
    return key === 'all' ? this.photos.length : this.photos.filter((p) => p.category === key).length;
  }

  // ---------- Photo lab ----------
  readonly controls: Control[] = [
    { key: 'brightness', label: 'Brightness', min: 40, max: 180, step: 1, unit: '%', group: 'Light' },
    { key: 'contrast', label: 'Contrast', min: 40, max: 200, step: 1, unit: '%', group: 'Light' },
    { key: 'fade', label: 'Fade', min: 0, max: 60, step: 1, unit: '%', group: 'Light' },
    { key: 'saturation', label: 'Saturation', min: 0, max: 250, step: 1, unit: '%', group: 'Colour' },
    { key: 'warmth', label: 'Warmth', min: -100, max: 100, step: 1, unit: '', group: 'Colour' },
    { key: 'hue', label: 'Hue shift', min: -180, max: 180, step: 1, unit: '°', group: 'Colour' },
    { key: 'mono', label: 'Black & white', min: 0, max: 100, step: 1, unit: '%', group: 'Mood' },
    { key: 'vignette', label: 'Vignette', min: 0, max: 100, step: 1, unit: '%', group: 'Mood' },
  ];
  readonly groups: Control['group'][] = ['Light', 'Colour', 'Mood'];

  readonly presets: Preset[] = [
    { name: 'Original', values: {} },
    {
      name: 'Cinematic',
      values: { contrast: 128, saturation: 110, warmth: 35, vignette: 55, brightness: 96, aperture: 2 },
    },
    {
      name: 'Vintage',
      values: { contrast: 90, saturation: 80, warmth: 70, fade: 28, vignette: 35, hue: -8 },
    },
    {
      name: 'Noir',
      values: { mono: 100, contrast: 150, brightness: 92, vignette: 70, aperture: 1.8 },
    },
    {
      name: 'Vivid',
      values: { saturation: 185, contrast: 118, brightness: 106, aperture: 5.6 },
    },
    {
      name: 'Dreamy',
      values: { brightness: 112, contrast: 88, saturation: 120, fade: 22, warmth: 25, aperture: 1.2 },
    },
  ];

  readonly labPhotoIndex = signal(1);
  readonly activePreset = signal('Original');
  readonly adjust = signal<Record<AdjustKey, number>>({ ...DEFAULTS });
  readonly focusX = signal(50);
  readonly focusY = signal(45);

  readonly labPhoto = computed(() => this.photos[this.labPhotoIndex()]);

  controlsFor(group: Control['group']): Control[] {
    return this.controls.filter((c) => c.group === group);
  }

  readonly aperture = computed(() => this.adjust().aperture);
  readonly blurPx = computed(() => Math.max(0, (16 - this.aperture()) * 0.9));
  readonly sharpRadius = computed(() => 8 + this.aperture() * 3.2);

  /** Colour filter applied to the whole preview. */
  readonly colourFilter = computed(() => {
    const a = this.adjust();
    return (
      `filter: brightness(${a.brightness}%) contrast(${a.contrast}%) ` +
      `saturate(${a.saturation}%) hue-rotate(${a.hue}deg) grayscale(${a.mono}%);`
    );
  });

  /** Blurred layer revealed outside the focus area to simulate depth of field. */
  readonly blurLayerStyle = computed(() => {
    const r = this.sharpRadius();
    const mask = `radial-gradient(circle at ${this.focusX()}% ${this.focusY()}%, transparent ${r}%, #000 ${r + 26}%)`;
    return `filter: blur(${this.blurPx().toFixed(1)}px); transform: scale(1.06); mask-image: ${mask}; -webkit-mask-image: ${mask};`;
  });

  readonly warmthStyle = computed(() => {
    const w = this.adjust().warmth;
    const colour = w >= 0 ? 'rgb(255,140,40)' : 'rgb(50,130,255)';
    return `background: ${colour}; opacity: ${(Math.abs(w) / 100) * 0.55};`;
  });

  readonly vignetteStyle = computed(() => {
    const v = this.adjust().vignette / 100;
    return `background: radial-gradient(circle at 50% 50%, transparent ${70 - v * 40}%, rgba(0,0,0,${(
      v * 0.9
    ).toFixed(2)}) 100%);`;
  });

  readonly fadeStyle = computed(() => `opacity: ${(this.adjust().fade / 100) * 0.7};`);

  /** Hexagonal iris icon that opens and closes with the f-stop. */
  readonly irisPoints = computed(() => {
    const r = 8 + (16 - this.aperture()) * 1.8;
    return Array.from({ length: 6 }, (_, i) => {
      const ang = (Math.PI / 3) * i - Math.PI / 6;
      return `${(50 + Math.cos(ang) * r).toFixed(1)},${(50 + Math.sin(ang) * r).toFixed(1)}`;
    }).join(' ');
  });

  readonly depthLabel = computed(() => {
    const f = this.aperture();
    if (f <= 2) return 'Razor-thin focus';
    if (f <= 5.6) return 'Soft background';
    if (f <= 10) return 'Balanced depth';
    return 'Everything sharp';
  });

  valueOf(key: AdjustKey): number {
    return this.adjust()[key];
  }

  setValue(key: AdjustKey, raw: string | number): void {
    this.adjust.update((a) => ({ ...a, [key]: +raw }));
    this.activePreset.set('Custom');
  }

  applyPreset(p: Preset): void {
    this.adjust.set({ ...DEFAULTS, ...p.values });
    this.activePreset.set(p.name);
  }

  resetLab(): void {
    this.applyPreset(this.presets[0]);
    this.focusX.set(50);
    this.focusY.set(45);
  }

  setFocus(event: MouseEvent): void {
    const el = event.currentTarget as HTMLElement;
    const rect = el.getBoundingClientRect();
    this.focusX.set(Math.min(100, Math.max(0, ((event.clientX - rect.left) / rect.width) * 100)));
    this.focusY.set(Math.min(100, Math.max(0, ((event.clientY - rect.top) / rect.height) * 100)));
  }

  // ---------- Inquiry ----------
  readonly shootTypes = [
    'Nature & landscape commission',
    'Malta football coverage',
    'Fashion shoot',
    'Personal session',
    'Reels & short video production',
    'Something else',
  ];
  readonly form = signal<InquiryForm>({
    name: '',
    type: this.shootTypes[0],
    when: '',
    message: '',
  });
  readonly contact = CONTACT;
  readonly formError = signal('');
  readonly sendNotice = signal('');

  setField(key: keyof InquiryForm, value: string): void {
    this.form.update((f) => ({ ...f, [key]: value }));
    this.formError.set('');
  }

  /** Validates the inquiry, then opens the chosen app with the message ready to send. */
  send(channel: Channel): void {
    const f = this.form();
    if (!f.name.trim() || !f.message.trim()) {
      this.formError.set('Please fill in your name and a short message first.');
      this.sendNotice.set('');
      return;
    }

    const text =
      `Hi Auroralys! I'm ${f.name.trim()}.\n` +
      `Inquiry: ${f.type}\n` +
      (f.when.trim() ? `Date / place: ${f.when.trim()}\n` : '') +
      `\n${f.message.trim()}`;

    let url: string;
    if (channel === 'whatsapp') {
      url = `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(text)}`;
      this.sendNotice.set('Opening WhatsApp with your message ready to send…');
    } else {
      // Instagram and Facebook don't accept pre-filled text, so copy it for pasting.
      if (this.isBrowser) navigator.clipboard?.writeText(text).catch(() => undefined);
      url =
        channel === 'instagram'
          ? `https://ig.me/m/${CONTACT.instagram}`
          : `https://m.me/${CONTACT.facebook}`;
      const name = channel === 'instagram' ? 'Instagram' : 'Facebook Messenger';
      this.sendNotice.set(`Message copied! Opening ${name} — just paste it into the chat and send.`);
    }

    this.formError.set('');
    this.flash();
    if (this.isBrowser) window.open(url, '_blank', 'noopener');
  }

  // ---------- Scroll-driven background ----------
  private hueAt(p: number): number {
    const seg = Math.min(0.9999, Math.max(0, p)) * (BG_HUES.length - 1);
    const i = Math.floor(seg);
    const t = seg - i;
    return BG_HUES[i] + (BG_HUES[i + 1] - BG_HUES[i]) * t;
  }

  readonly bgHue = computed(() => this.hueAt(this.scrollProgress()));

  // ---------- Scroll-driven camera ----------
  /** The floating camera's lens ring turns with the page. */
  readonly lensSpin = computed(() => (this.scrollProgress() * 1440).toFixed(0));
  /** The iris opens and closes as you scroll, like adjusting the aperture. */
  readonly irisScale = computed(() =>
    (0.3 + 0.7 * (0.5 + 0.5 * Math.cos(this.scrollProgress() * 10 * Math.PI))).toFixed(3),
  );

  /** Cinematic shutter curtain that snaps shut/open whenever a new section comes into view. */
  readonly shutterPulse = signal(false);
  private currentSection = -1;

  private trackSection(): void {
    const mid = window.innerHeight * 0.5;
    let idx = 0;
    SECTION_IDS.forEach((id, i) => {
      const el = document.getElementById(id);
      if (el && el.getBoundingClientRect().top <= mid) idx = i;
    });
    if (idx !== this.currentSection) {
      if (this.currentSection !== -1 && !this.shutterPulse()) {
        this.shutterPulse.set(true);
        setTimeout(() => this.shutterPulse.set(false), 650);
      }
      this.currentSection = idx;
    }
  }

  constructor() {
    afterNextRender(() => {
      this.updateScroll();
      this.observeReveals();
    });
  }

  @HostListener('window:scroll')
  onScroll(): void {
    if (this.isBrowser) this.updateScroll();
  }

  @HostListener('window:mousemove', ['$event'])
  onMouseMove(e: MouseEvent): void {
    if (!this.isBrowser) return;
    this.mouseX.set((e.clientX / window.innerWidth) * 2 - 1);
    this.mouseY.set((e.clientY / window.innerHeight) * 2 - 1);
  }

  @HostListener('window:keydown.escape')
  onEscape(): void {
    this.closePhoto();
  }

  private updateScroll(): void {
    const doc = document.documentElement;
    const max = doc.scrollHeight - doc.clientHeight;
    this.scrollProgress.set(max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0);
    this.trackSection();
  }

  private observeReveals(): void {
    const targets = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window)) {
      targets.forEach((el) => el.classList.add('revealed'));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.15 },
    );
    targets.forEach((el) => io.observe(el));
  }

  // ---------- Actions ----------
  setCategory(cat: 'all' | Category): void {
    this.activeCategory.set(cat);
  }

  openPhoto(photo: PhotoItem): void {
    this.selectedPhoto.set(photo);
    this.flash();
  }

  closePhoto(): void {
    this.selectedPhoto.set(null);
  }

  openInLab(photo: PhotoItem): void {
    this.labPhotoIndex.set(this.photos.indexOf(photo));
    this.closePhoto();
    this.scrollTo('lab');
  }

  flash(): void {
    this.isFlashing.set(true);
    setTimeout(() => this.isFlashing.set(false), 350);
  }

  scrollTo(id: string): void {
    if (!this.isBrowser) return;
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }
}
