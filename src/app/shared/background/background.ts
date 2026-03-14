import {
  AfterViewInit,
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'app-background',
  imports: [],
  templateUrl: './background.html',
  styleUrl: './background.scss',
})
export class Background implements AfterViewInit, OnDestroy {
  @ViewChild('bgCanvas', { static: true }) private canvasRef?: ElementRef<HTMLCanvasElement>;

  private scene?: THREE.Scene;
  private camera?: THREE.PerspectiveCamera;
  private renderer?: THREE.WebGLRenderer;
  private particleSystem?: THREE.Points;
  private animationFrameId?: number;
  private cleanupFns: Array<() => void> = [];

  constructor(private zone: NgZone) { }

  ngAfterViewInit(): void {
    this.initThreeBackground();
  }

  ngOnDestroy(): void {
    if (this.animationFrameId != null) cancelAnimationFrame(this.animationFrameId);
    this.cleanupFns.forEach((fn) => fn());
    this.cleanupFns = [];

    this.renderer?.dispose();
    this.particleSystem?.geometry.dispose();
    if (Array.isArray(this.particleSystem?.material)) {
      this.particleSystem?.material.forEach((m) => m.dispose());
    } else {
      this.particleSystem?.material.dispose();
    }
  }

  private initThreeBackground(): void {
    const canvas = this.canvasRef?.nativeElement;
    if (!canvas) return;

    const mouse = { x: 0, y: 0 };

    const onMouseMove = (event: MouseEvent) => {
      mouse.x = event.clientX / window.innerWidth - 0.5;
      mouse.y = event.clientY / window.innerHeight - 0.5;
    };
    window.addEventListener('mousemove', onMouseMove);
    this.cleanupFns.push(() => window.removeEventListener('mousemove', onMouseMove));

    const setSize = () => {
      if (!this.renderer || !this.camera) return;
      const w = window.innerWidth;
      const h = window.innerHeight;
      this.renderer.setSize(w, h);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
    };

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 100);
    this.camera.position.z = 7;

    this.renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
    });
    setSize();

    window.addEventListener('resize', setSize);
    this.cleanupFns.push(() => window.removeEventListener('resize', setSize));

    const particlesCount = 900;
    const positions = new Float32Array(particlesCount * 3);
    const speeds: number[] = [];

    for (let i = 0; i < particlesCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 18; // x
      positions[i * 3 + 1] = (Math.random() - 0.5) * 16; // y
      positions[i * 3 + 2] = -Math.random() * 8; // z
      speeds.push(0.0015 + Math.random() * 0.0025);
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      size: 0.12,
      color: new THREE.Color('#38bdf8'),
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    this.particleSystem = new THREE.Points(geometry, material);
    this.scene.add(this.particleSystem);

    const animate = () => {
      if (!this.scene || !this.camera || !this.renderer || !this.particleSystem) return;

      const positionsAttr = this.particleSystem.geometry.getAttribute('position') as THREE.BufferAttribute;

      const mouseX = mouse.x * 20;
      const mouseY = -mouse.y * 20;

      for (let i = 0; i < particlesCount; i++) {
        let y = positionsAttr.getY(i);
        const x = positionsAttr.getX(i);

        y += speeds[i];

        const dx = x - mouseX;
        const dy = y - mouseY;
        const dist = Math.max(2, Math.sqrt(dx * dx + dy * dy));

        const repulsion = Math.exp(-dist * 0.25) * 0.1;
        y += repulsion;

        if (y > 8) y = -8;
        positionsAttr.setY(i, y);
      }
      positionsAttr.needsUpdate = true;

      this.camera.position.x += (mouse.x * 2.5 - this.camera.position.x) * 0.05;
      this.camera.position.y += (-mouse.y * 2.0 - this.camera.position.y) * 0.05;
      this.camera.lookAt(this.scene.position);

      this.renderer.render(this.scene, this.camera);
      this.animationFrameId = requestAnimationFrame(animate);
    };

    this.zone.runOutsideAngular(() => animate());
  }
}
