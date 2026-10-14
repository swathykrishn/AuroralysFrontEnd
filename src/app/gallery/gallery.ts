import {
  Component,
  HostListener,
  PLATFORM_ID,
  afterNextRender,
  computed,
  inject,
  signal,
} from '@angular/core';
import { isPlatformBrowser, TitleCasePipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  Category,
  CONTACT,
  Channel,
  PhotoItem,
  PHOTOS,
} from '../models/photo.model';

@Component({
  selector: 'app-gallery',
  imports: [RouterLink, TitleCasePipe],
  templateUrl: './gallery.html',
  styleUrl: './gallery.css',
})
export class Gallery {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly scrollY = signal(0);
  readonly isScrolled = computed(() => this.scrollY() > 60);

  readonly mobileNavOpen = signal(false);
  readonly galleryDropdownOpen = signal(false);

  readonly photos: PhotoItem[] = PHOTOS;

  readonly filters: { key: 'all' | Category; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'fashion', label: 'Fashion' },
    { key: 'sports', label: 'Sports' },
    { key: 'event', label: 'Events' },
    { key: 'portraits', label: 'Portraits' },
  ];

  readonly activeCategory = signal<'all' | Category>('all');
  readonly selectedPhoto = signal<PhotoItem | null>(null);

  readonly filteredPhotos = computed(() => {
    const cat = this.activeCategory();
    return cat === 'all' ? this.photos : this.photos.filter((p) => p.category === cat);
  });

  readonly contact = CONTACT;

  countFor(key: 'all' | Category): number {
    return key === 'all'
      ? this.photos.length
      : this.photos.filter((p) => p.category === key).length;
  }

  constructor() {
    this.route.queryParams.subscribe((params) => {
      const cat = params['category'];
      if (cat && ['sports', 'fashion', 'event', 'portraits'].includes(cat)) {
        this.activeCategory.set(cat as Category);
      } else {
        this.activeCategory.set('all');
      }
    });

    afterNextRender(() => {
      this.observeReveals();
      if (this.isBrowser) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
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
      { threshold: 0.1 },
    );
    targets.forEach((el) => io.observe(el));
  }

  toggleGalleryDropdown(event?: Event): void {
    if (event) event.stopPropagation();
    this.galleryDropdownOpen.update((open) => !open);
  }

  setCategory(cat: 'all' | Category): void {
    this.activeCategory.set(cat);
    this.galleryDropdownOpen.set(false);
    this.mobileNavOpen.set(false);
    // Update URL query params without reloading
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: cat === 'all' ? {} : { category: cat },
      queryParamsHandling: '',
    });
  }

  openPhoto(photo: PhotoItem): void {
    this.selectedPhoto.set(photo);
    if (this.isBrowser) document.body.style.overflow = 'hidden';
  }

  closePhoto(): void {
    this.selectedPhoto.set(null);
    if (this.isBrowser) document.body.style.overflow = '';
  }

  editInLab(photo: PhotoItem): void {
    this.closePhoto();
    this.router.navigate(['/'], {
      queryParams: { labPhoto: photo.id },
      fragment: 'lab',
    });
  }

  goToSection(sectionId: string): void {
    this.mobileNavOpen.set(false);
    this.router.navigate(['/'], { fragment: sectionId }).then(() => {
      setTimeout(() => {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    });
  }
}
