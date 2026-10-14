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
import { ActivatedRoute, Router } from '@angular/router';
import {
  Category,
  CONTACT,
  Channel,
  InquiryForm,
  PhotoItem,
  PHOTOS,
} from '../models/photo.model';

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

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  // ---------- Scroll state ----------
  readonly scrollY = signal(0);
  readonly isScrolled = computed(() => this.scrollY() > 60);

  // ---------- Nav states ----------
  readonly mobileNavOpen = signal(false);
  readonly galleryDropdownOpen = signal(false);

  // ---------- Hero slider ----------
  readonly heroSlides = [
    { image: 'images/malta_football_kick.jpg', label: 'Sports' },
    { image: 'images/fashion_valletta.jpg', label: 'Fashion' },
    { image: 'images/event_wedding_01.jpg', label: 'Events' },
    { image: 'images/personal_portrait.jpg', label: 'Portraits' },
  ];
  readonly heroIndex = signal(0);
  private heroTimer: ReturnType<typeof setInterval> | null = null;

  // ---------- Photos Data ----------
  readonly photos: PhotoItem[] = PHOTOS;

  readonly filters: { key: 'all' | Category; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'fashion', label: 'Fashion' },
    { key: 'sports', label: 'Sports' },
    { key: 'event', label: 'Events' },
    { key: 'portraits', label: 'Portraits' },
  ];

  readonly selectedPhoto = signal<PhotoItem | null>(null);

  /** 4 Curated picks on the Home screen for Selected Works: 1 Fashion, 1 Sports, 1 Events, 1 Portraits */
  readonly selectedPicks = computed<PhotoItem[]>(() => {
    const fashion =
      this.photos.find((p) => p.id === 'fashion-valletta-01') ||
      this.photos.find((p) => p.category === 'fashion')!;
    const sports =
      this.photos.find((p) => p.id === 'sports-kick-01') ||
      this.photos.find((p) => p.category === 'sports')!;
    const events =
      this.photos.find((p) => p.id === 'event-wedding-01') ||
      this.photos.find((p) => p.category === 'event')!;
    const portraits =
      this.photos.find((p) => p.id === 'portraits-golden-01') ||
      this.photos.find((p) => p.category === 'portraits')!;
    return [fashion, sports, events, portraits];
  });

  countFor(key: 'all' | Category): number {
    return key === 'all'
      ? this.photos.length
      : this.photos.filter((p) => p.category === key).length;
  }

  // ---------- Photo Lab: Aperture & Picture Adjustment ----------
  readonly controls: Control[] = [
    { key: 'brightness', label: 'Brightness', min: 40, max: 180, step: 1, unit: '%', group: 'Light' },
    { key: 'contrast', label: 'Contrast', min: 40, max: 200, step: 1, unit: '%', group: 'Light' },
    { key: 'fade', label: 'Fade', min: 0, max: 60, step: 1, unit: '%', group: 'Light' },
    { key: 'saturation', label: 'Saturation', min: 0, max: 250, step: 1, unit: '%', group: 'Colour' },
    { key: 'warmth', label: 'Warmth', min: -100, max: 100, step: 1, unit: '', group: 'Colour' },
    { key: 'hue', label: 'Hue shift', min: -180, max: 180, step: 1, unit: '°', group: 'Colour' },
    { key: 'mono', label: 'Black & White', min: 0, max: 100, step: 1, unit: '%', group: 'Mood' },
    { key: 'vignette', label: 'Vignette', min: 0, max: 100, step: 1, unit: '%', group: 'Mood' },
  ];
  readonly groups: Control['group'][] = ['Light', 'Colour', 'Mood'];

  readonly presets: Preset[] = [
    { name: 'Original', values: {} },
    {
      name: 'Cinematic',
      values: { contrast: 128, saturation: 110, warmth: 35, vignette: 55, brightness: 96, aperture: 2.0 },
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

  readonly labPhotoIndex = signal(0);
  readonly activePreset = signal('Original');
  readonly adjust = signal<Record<AdjustKey, number>>({ ...DEFAULTS });
  readonly focusX = signal(50);
  readonly focusY = signal(45);

  readonly labPhoto = computed(() => this.photos[this.labPhotoIndex()] || this.photos[0]);

  controlsFor(group: Control['group']): Control[] {
    return this.controls.filter((c) => c.group === group);
  }

  readonly aperture = computed(() => this.adjust().aperture);
  readonly blurPx = computed(() => Math.max(0, (16 - this.aperture()) * 0.9));
  readonly sharpRadius = computed(() => 8 + this.aperture() * 3.2);

  /** Colour filter applied to the preview image */
  readonly colourFilter = computed(() => {
    const a = this.adjust();
    return (
      `filter: brightness(${a.brightness}%) contrast(${a.contrast}%) ` +
      `saturate(${a.saturation}%) hue-rotate(${a.hue}deg) grayscale(${a.mono}%);`
    );
  });

  /** Blurred layer revealed outside the focus area to simulate shallow depth of field */
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

  /** Hexagonal iris icon that opens and closes with the f-stop */
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

  openInLab(photo: PhotoItem): void {
    const idx = this.photos.findIndex((p) => p.id === photo.id);
    if (idx !== -1) {
      this.labPhotoIndex.set(idx);
    }
    this.closePhoto();
    this.scrollTo('lab');
  }

  // ---------- Inquiry ----------
  readonly shootTypes = [
    'Fashion shoot',
    'Sports coverage',
    'Event photography',
    'Portrait session',
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
      if (this.isBrowser) navigator.clipboard?.writeText(text).catch(() => undefined);
      url =
        channel === 'instagram'
          ? `https://ig.me/m/${CONTACT.instagram}`
          : `https://m.me/${CONTACT.facebook}`;
      const name = channel === 'instagram' ? 'Instagram' : 'Facebook Messenger';
      this.sendNotice.set(`Message copied! Opening ${name} — just paste it into the chat and send.`);
    }

    this.formError.set('');
    if (this.isBrowser) window.open(url, '_blank', 'noopener');
  }

  constructor() {
    this.route.queryParams.subscribe((params) => {
      const photoId = params['labPhoto'];
      if (photoId) {
        const idx = this.photos.findIndex((p) => p.id === photoId);
        if (idx !== -1) {
          this.labPhotoIndex.set(idx);
        }
      }
    });

    afterNextRender(() => {
      this.startHeroTimer();
      this.observeReveals();
      const fragment = this.route.snapshot.fragment;
      if (fragment && this.isBrowser) {
        setTimeout(() => {
          document.getElementById(fragment)?.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      }
    });
  }

  @HostListener('window:scroll')
  onScroll(): void {
    if (this.isBrowser) this.scrollY.set(window.scrollY);
  }

  @HostListener('window:keydown.escape')
  onEscape(): void {
    this.closePhoto();
    this.mobileNavOpen.set(false);
    this.galleryDropdownOpen.set(false);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.nav-dropdown-wrap')) {
      this.galleryDropdownOpen.set(false);
    }
  }

  private startHeroTimer(): void {
    this.heroTimer = setInterval(() => {
      this.heroIndex.update((i) => (i + 1) % this.heroSlides.length);
    }, 5000);
  }

  setHeroSlide(i: number): void {
    this.heroIndex.set(i);
    if (this.heroTimer) {
      clearInterval(this.heroTimer);
      this.startHeroTimer();
    }
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
      { threshold: 0.12 },
    );
    targets.forEach((el) => io.observe(el));
  }

  // ---------- Navigation & Actions ----------
  toggleGalleryDropdown(event?: Event): void {
    if (event) event.stopPropagation();
    this.galleryDropdownOpen.update((open) => !open);
  }

  navigateToCategory(cat: 'all' | Category): void {
    this.galleryDropdownOpen.set(false);
    this.mobileNavOpen.set(false);
    if (cat === 'all') {
      this.router.navigate(['/gallery']);
    } else {
      this.router.navigate(['/gallery'], { queryParams: { category: cat } });
    }
  }

  openPhoto(photo: PhotoItem): void {
    this.selectedPhoto.set(photo);
    if (this.isBrowser) document.body.style.overflow = 'hidden';
  }

  closePhoto(): void {
    this.selectedPhoto.set(null);
    if (this.isBrowser) document.body.style.overflow = '';
  }

  scrollTo(id: string): void {
    if (!this.isBrowser) return;
    this.mobileNavOpen.set(false);
    this.galleryDropdownOpen.set(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }
}
