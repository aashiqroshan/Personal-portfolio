import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-scroll-indicator',
  imports: [],
  templateUrl: './scroll-indicator.html',
  styleUrl: './scroll-indicator.scss',
})
export class ScrollIndicator {
  progress = 0;

  @HostListener('window:scroll')
  onScroll(): void {
    const scrollTop = window.scrollY || document.documentElement.scrollTop || 0;
    const docHeight =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;

    this.progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  }
}
