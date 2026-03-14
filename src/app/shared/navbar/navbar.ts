import { Component, signal, AfterViewInit, OnDestroy } from '@angular/core';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-navbar',
  imports: [NgIf],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar implements AfterViewInit, OnDestroy {
  readonly mobileOpen = signal(false);
  readonly activeSection = signal<string>('hero');
  private observer?: IntersectionObserver;

  ngAfterViewInit(): void {
    if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
      this.observer = new IntersectionObserver(
        (entries) => {
          // Find the most intersecting section
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const id = entry.target.id;
              if (id) {
                this.activeSection.set(id);
              }
            }
          });
        },
        { rootMargin: '-30% 0px -70% 0px' }
      );

      document.querySelectorAll('section[id]').forEach((section) => {
        this.observer?.observe(section);
      });
    }
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }

  scrollToSection(sectionId: string): void {
    this.mobileOpen.set(false);
    this.activeSection.set(sectionId);
    const el = document.getElementById(sectionId);
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  toggleMobile(): void {
    this.mobileOpen.update((open) => !open);
  }
}
