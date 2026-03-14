import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { gsap } from 'gsap';

type Vec2 = { x: number; y: number };

@Component({
  selector: 'app-hero',
  imports: [],
  templateUrl: './hero.html',
  styleUrl: './hero.scss',
})
export class Hero implements AfterViewInit, OnDestroy {
  @ViewChild('heroRoot', { static: true }) private heroRootRef?: ElementRef<HTMLElement>;
  @ViewChild('heroVisual', { static: true }) private heroVisualRef?: ElementRef<HTMLElement>;

  private rafId?: number;
  private cleanupFns: Array<() => void> = [];

  ngAfterViewInit(): void {
    this.initFloatingIcons();
  }

  ngOnDestroy(): void {
    if (this.rafId != null) cancelAnimationFrame(this.rafId);
    this.cleanupFns.forEach((fn) => fn());
    this.cleanupFns = [];

    gsap.killTweensOf('.hero__floating-icon');
    gsap.killTweensOf('.hero__content > *');
    gsap.killTweensOf('.hero__visual');
  }

  scrollTo(sectionId: string): void {
    const el = document.getElementById(sectionId);
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  private initFloatingIcons(): void {
    const root = this.heroRootRef?.nativeElement;
    const visual = this.heroVisualRef?.nativeElement;
    if (!root || !visual) return;

    const icons = Array.from(root.querySelectorAll<HTMLElement>('.hero__floating-icon'));
    if (icons.length === 0) return;

    // Initial intro (use CSS custom properties or immediate set to avoid GSAP x/y conflicts with physics)
    icons.forEach((icon, index) => {
      gsap.fromTo(
        icon,
        { opacity: 0, scale: 0.85 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.75,
          delay: 0.25 + index * 0.12,
          ease: 'power3.out',
        }
      );
    });

    const heroContent = document.querySelector<HTMLElement>('.hero__content');
    if (heroContent) {
      gsap.fromTo(
        heroContent.children,
        {
          y: 18,
          opacity: 0,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.08,
          ease: 'power2.out',
        }
      );
    }

    // Reactive "antigravity" motion: float + mouse repulsion + gentle orbit drift
    const mouse: Vec2 = { x: 0, y: 0 };
    const target: Vec2 = { x: 0, y: 0 };
    const visualTarget: Vec2 = { x: 0, y: 0 };

    const iconState = icons.map((el, i) => ({
      el,
      base: { x: 0, y: 0 },
      pos: { x: 0, y: 0 },
      vel: { x: 0, y: 0 },
      driftPhase: Math.random() * Math.PI * 2,
      driftSpeed: 0.002 + Math.random() * 0.002,
      mass: 1 + i * 0.12,
    }));

    let isMouseIn = false;

    const onMove = (event: PointerEvent) => {
      isMouseIn = true;
      const rect = visual.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width;
      const py = (event.clientY - rect.top) / rect.height;
      mouse.x = (px - 0.5) * 2; // -1..1
      mouse.y = (py - 0.5) * 2;

      target.x = mouse.x;
      target.y = mouse.y;
    };
    visual.addEventListener('pointermove', onMove);
    visual.addEventListener('pointerleave', () => {
      isMouseIn = false;
      target.x = 0;
      target.y = 0;
    });
    this.cleanupFns.push(() => visual.removeEventListener('pointermove', onMove));

    const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

    const tick = (t: number) => {
      // Ease mouse for smoothness
      visualTarget.x += (target.x - visualTarget.x) * 0.06;
      visualTarget.y += (target.y - visualTarget.y) * 0.06;

      // Subtle panel parallax + tilt
      const tiltX = clamp(-visualTarget.y * 7, -8, 8);
      const tiltY = clamp(visualTarget.x * 9, -10, 10);
      gsap.to(visual, {
        rotationX: tiltX,
        rotationY: tiltY,
        x: visualTarget.x * 10,
        y: visualTarget.y * 8,
        transformPerspective: 900,
        transformOrigin: 'center',
        duration: 0.25,
        ease: 'power2.out',
      });

      // Physics for icons
      const repelStrength = 60; // Less push force
      const damping = 0.88; // slightly less damping = more fluid base drift
      const baseSpring = 0.015;

      // mouse point in visual space (in px relative to center)
      const rect = visual.getBoundingClientRect();
      const mx = rect.width * 0.5 + visualTarget.x * rect.width * 0.35;
      const my = rect.height * 0.5 + visualTarget.y * rect.height * 0.35;

      iconState.forEach((s, idx) => {
        // base float (orbit drift)
        const phase = s.driftPhase + t * s.driftSpeed;
        const floatX = Math.cos(phase + idx) * (8 + idx * 2);
        const floatY = Math.sin(phase * 1.15 + idx) * (12 + idx * 2.5);

        const elRect = s.el.getBoundingClientRect();
        const ex = (elRect.left - rect.left) + elRect.width / 2;
        const ey = (elRect.top - rect.top) + elRect.height / 2;

        let ax = 0;
        let ay = 0;

        // Repel from mouse only if mouse is in
        if (isMouseIn) {
          const dx = ex - mx;
          const dy = ey - my;
          const dist = Math.max(40, Math.sqrt(dx * dx + dy * dy)); // Slightly larger minimum distance so it doesn't snap if right on top
          const force = (repelStrength / (dist * dist)) * 400; // Drastically reduced force multiplier

          // repel direction
          ax = (dx / dist) * force;
          ay = (dy / dist) * force;
        }

        // Target position to spring towards
        let tx = floatX;
        let ty = floatY;

        // Use a lazy interpolation for the spring to make it organic
        // Base spring is weak so they float around softly
        let targetSpring = baseSpring;

        if (!isMouseIn) {
          // When resting, they form a wider, lazy orbit ring around the center
          tx = Math.cos(phase * 0.8) * (18 + idx * 4);
          ty = Math.sin(phase * 0.9) * (20 + idx * 4);
          // Barely stronger spring so the pull is extremely gentle over time
          targetSpring = 0.022;
        }

        // We smoothly interpolate the active spring towards the target spring
        // This avoids sudden "snaps" in force
        s.vel.x += (targetSpring - baseSpring) * 0.001;

        s.vel.x = (s.vel.x + ax - s.pos.x * targetSpring + (tx - s.pos.x) * 0.0015) * damping;
        s.vel.y = (s.vel.y + ay - s.pos.y * targetSpring + (ty - s.pos.y) * 0.0015) * damping;

        s.pos.x += s.vel.x / s.mass;
        s.pos.y += s.vel.y / s.mass;

        s.el.style.transform = `translate3d(${s.pos.x}px, ${s.pos.y}px, 0)`;
      });

      this.rafId = requestAnimationFrame(tick);
    };

    this.rafId = requestAnimationFrame(tick);

    // Scroll-based depth: move visual slightly as you scroll past hero
    const onScroll = () => {
      const heroRect = root.getBoundingClientRect();
      const progress = clamp(1 - heroRect.top / Math.max(1, heroRect.height), 0, 1);
      gsap.to(visual, {
        filter: `drop-shadow(0 30px 70px rgba(15, 23, 42, ${0.55 + progress * 0.35}))`,
        duration: 0.35,
        ease: 'power2.out',
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    this.cleanupFns.push(() => window.removeEventListener('scroll', onScroll));
  }
}

