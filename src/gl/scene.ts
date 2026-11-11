/**
 * Scène WebGL persistante, affichée derrière toutes les pages.
 *  - un fond fluide tramé (bruit déformé + trame de Bayer), calculé dans un shader ;
 *  - un nuage de particules qui change de forme à chaque page, s'écarte au passage
 *    du curseur et tourne quand on le fait glisser.
 * Chargée en différé par main.ts : le site reste utilisable sans elle.
 */
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Color,
  Mesh,
  NormalBlending,
  PerspectiveCamera,
  PlaneGeometry,
  Points,
  Ray,
  Scene,
  ShaderMaterial,
  Vector2,
  Vector3,
  WebGLRenderer,
  Matrix4,
} from 'three';
import { buildShape, type ShapeId } from './shapes';

export interface Look {
  shape: ShapeId;
  bg: string;
  ink: string;
  accent: string;
  accent2: string;
  /** Inclinaison de base du nuage, en radians. */
  tilt: number;
  /** true quand le fond est clair : les particules ne s'additionnent plus. */
  light?: boolean;
}

const FLUID_FRAG = /* glsl */ `
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform vec3 uBg;
uniform vec3 uAccent;
uniform vec3 uAccent2;
uniform float uIntensity;
uniform vec2 uMouse;
uniform float uPx;
uniform float uSide;

float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
}
float fbm(vec2 p){
  float a = 0.5, s = 0.0;
  for (int i = 0; i < 4; i++) { s += a * noise(p); p = p * 2.03 + vec2(1.7, 9.2); a *= 0.5; }
  return s;
}
float bayer2(vec2 a){ a = floor(a); return fract(a.x / 2.0 + a.y * a.y * 0.75); }
float bayer4(vec2 a){ return bayer2(0.5 * a) * 0.25 + bayer2(a); }

void main(){
  vec2 cell = floor(gl_FragCoord.xy / uPx);
  vec2 uv = (cell * uPx) / uRes;
  vec2 p = (uv - 0.5) * vec2(uRes.x / uRes.y, 1.0) * 1.5;
  float t = uTime * 0.045;
  vec2 m = (uMouse - 0.5) * 0.5;

  vec2 q = vec2(fbm(p + vec2(0.0, t) + m), fbm(p + vec2(5.2, 1.3) - t));
  vec2 r = vec2(fbm(p + 3.0 * q + vec2(1.7, 9.2) + t * 0.7), fbm(p + 3.0 * q + vec2(8.3, 2.8) - t * 0.5));
  float v = fbm(p + 3.2 * r);
  float band = smoothstep(0.44, 0.8, v + 0.2 * sin(9.0 * v + r.x * 4.0));

  float side = smoothstep(0.3, 1.0, uv.x);
  float top = exp(-pow((uv.y - 0.74) / 0.2, 2.0));
  float mask = mix(top, side, uSide);
  float lum = band * uIntensity * (0.1 + 0.9 * mask);

  float d = bayer4(cell);
  float ql = clamp(floor(lum * 3.0 + d) / 3.0, 0.0, 1.0);
  vec3 col = mix(uBg, uAccent, ql * 0.85);
  float hi = clamp(floor(max(lum - 0.8, 0.0) * 4.0 + d * 0.9), 0.0, 1.0);
  col = mix(col, uAccent2, hi);
  col += (hash(gl_FragCoord.xy + fract(uTime) * 91.0) - 0.5) * 0.035;
  gl_FragColor = vec4(col, 1.0);
}`;

const POINTS_VERT = /* glsl */ `
attribute vec3 aTarget;
attribute float aRand;
uniform float uMorph;
uniform float uTime;
uniform float uSize;
uniform vec3 uRayO;
uniform vec3 uRayD;
uniform float uPush;
varying float vRand;
varying float vFade;

void main(){
  float m = smoothstep(0.0, 1.0, clamp(uMorph * 1.35 - aRand * 0.35, 0.0, 1.0));
  vec3 p = mix(position, aTarget, m);
  float burst = sin(m * 3.14159);
  p += burst * 0.55 * vec3(sin(aRand * 91.0 + uTime), cos(aRand * 57.0 - uTime), sin(aRand * 33.0 + uTime * 0.7));
  p += 0.012 * vec3(sin(uTime * 0.9 + aRand * 40.0), cos(uTime * 0.7 + aRand * 70.0), sin(uTime * 0.5 + aRand * 20.0));

  // Répulsion : distance du point au rayon qui part du curseur.
  vec3 w = p - uRayO;
  vec3 c = uRayO + uRayD * dot(w, uRayD);
  vec3 dv = p - c;
  float f = uPush * smoothstep(0.85, 0.0, length(dv));
  p += normalize(dv + vec3(1e-4)) * f * 0.5 + f * 0.22 * vec3(sin(aRand * 200.0), cos(aRand * 130.0), sin(aRand * 77.0));

  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = max(1.0, uSize * (0.55 + aRand * 0.9) / -mv.z);
  vRand = aRand;
  vFade = smoothstep(10.0, 3.0, -mv.z);
}`;

const POINTS_FRAG = /* glsl */ `
precision highp float;
uniform vec3 uInk;
uniform vec3 uAccent;
uniform float uAlpha;
varying float vRand;
varying float vFade;
void main(){
  vec3 col = mix(uInk, uAccent, step(0.84, vRand));
  gl_FragColor = vec4(col, uAlpha * vFade * (0.55 + 0.45 * vRand));
}`;

export class SignalScene {
  private renderer: WebGLRenderer;
  private scene = new Scene();
  private camera = new PerspectiveCamera(35, 1, 0.1, 50);
  private fluid: ShaderMaterial;
  private dots: ShaderMaterial;
  private points: Points;
  private geo = new BufferGeometry();
  private count: number;
  private reduced: boolean;
  private mobile: boolean;

  private morph = 1;
  private pointer = new Vector2(0, 0);
  private pointerUv = new Vector2(0.5, 0.5);
  private push = 0;
  private pushTarget = 0;
  private drag = { x: 0, y: 0, vx: 0, vy: 0 };
  private spin = 0;
  private tilt = 0;
  private scroll = 0;
  private time = 0;
  private last = 0;
  private raf = 0;
  private running = false;
  private ray = new Ray();
  private inv = new Matrix4();
  private intensity = 1;

  constructor(canvas: HTMLCanvasElement, look: Look, opts: { reduced: boolean }) {
    this.reduced = opts.reduced;
    this.mobile = Math.min(window.innerWidth, window.innerHeight) < 700;
    this.count = this.mobile ? 6500 : 15000;

    this.renderer = new WebGLRenderer({ canvas, antialias: false, alpha: false, powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, this.mobile ? 1.5 : 1.75));
    this.camera.position.set(0, 0, 6.2);

    this.fluid = new ShaderMaterial({
      depthTest: false,
      depthWrite: false,
      uniforms: {
        uRes: { value: new Vector2(1, 1) },
        uTime: { value: 0 },
        uBg: { value: new Color(look.bg) },
        uAccent: { value: new Color(look.accent) },
        uAccent2: { value: new Color(look.accent2) },
        uIntensity: { value: 1 },
        uMouse: { value: this.pointerUv },
        uPx: { value: 3 },
        uSide: { value: 1 },
      },
      vertexShader: 'void main(){ gl_Position = vec4(position.xy, 0.0, 1.0); }',
      fragmentShader: FLUID_FRAG,
    });
    const quad = new Mesh(new PlaneGeometry(2, 2), this.fluid);
    quad.frustumCulled = false;
    quad.renderOrder = -1;
    this.scene.add(quad);

    const rand = new Float32Array(this.count);
    for (let i = 0; i < this.count; i++) rand[i] = Math.random();
    this.geo.setAttribute('position', new BufferAttribute(buildShape('noise', this.count), 3));
    this.geo.setAttribute('aTarget', new BufferAttribute(buildShape(look.shape, this.count), 3));
    this.geo.setAttribute('aRand', new BufferAttribute(rand, 1));

    this.dots = new ShaderMaterial({
      transparent: true,
      depthTest: false,
      depthWrite: false,
      blending: look.light ? NormalBlending : AdditiveBlending,
      uniforms: {
        uMorph: { value: 0 },
        uTime: { value: 0 },
        uSize: { value: 10 },
        uRayO: { value: new Vector3(0, 0, 99) },
        uRayD: { value: new Vector3(0, 0, -1) },
        uPush: { value: 0 },
        uInk: { value: new Color(look.ink) },
        uAccent: { value: new Color(look.accent2) },
        uAlpha: { value: 0.9 },
      },
      vertexShader: POINTS_VERT,
      fragmentShader: POINTS_FRAG,
    });
    this.points = new Points(this.geo, this.dots);
    this.points.frustumCulled = false;
    this.scene.add(this.points);

    this.tilt = look.tilt;
    this.morph = this.reduced ? 1 : 0;
    this.resize();
    window.addEventListener('resize', this.resize, { passive: true });
    document.addEventListener('visibilitychange', this.onVisibility);
    this.start();
  }

  /** Change de forme et de palette. Appelé à chaque changement de page. */
  setLook(look: Look): void {
    const pos = this.geo.getAttribute('position') as BufferAttribute;
    const tgt = this.geo.getAttribute('aTarget') as BufferAttribute;
    const a = pos.array as Float32Array;
    const b = tgt.array as Float32Array;
    // On fige l'état courant comme point de départ, pour un enchaînement sans saut.
    const m = this.morph;
    for (let i = 0; i < a.length; i++) a[i] = a[i] + (b[i] - a[i]) * m;
    b.set(buildShape(look.shape, this.count));
    pos.needsUpdate = true;
    tgt.needsUpdate = true;
    this.morph = this.reduced ? 1 : 0;

    (this.fluid.uniforms.uBg.value as Color).set(look.bg);
    (this.fluid.uniforms.uAccent.value as Color).set(look.accent);
    (this.fluid.uniforms.uAccent2.value as Color).set(look.accent2);
    (this.dots.uniforms.uInk.value as Color).set(look.ink);
    (this.dots.uniforms.uAccent.value as Color).set(look.accent2);
    this.dots.blending = look.light ? NormalBlending : AdditiveBlending;
    this.dots.needsUpdate = true;
    this.tilt = look.tilt;
    if (this.reduced) this.renderOnce();
  }

  setPointer(clientX: number, clientY: number): void {
    this.pointer.set((clientX / window.innerWidth) * 2 - 1, -(clientY / window.innerHeight) * 2 + 1);
    this.pointerUv.set(clientX / window.innerWidth, 1 - clientY / window.innerHeight);
    this.pushTarget = 1;
    if (this.reduced) this.renderOnce();
  }

  releasePointer(): void {
    this.pushTarget = 0;
  }

  /** Rotation manuelle : dx, dy en pixels. */
  dragBy(dx: number, dy: number): void {
    this.drag.vx = dx * 0.006;
    this.drag.vy = dy * 0.004;
    this.drag.x += this.drag.vx;
    this.drag.y = Math.max(-0.9, Math.min(0.9, this.drag.y + this.drag.vy));
    if (this.reduced) this.renderOnce();
  }

  setScroll(y: number): void {
    this.scroll = y;
    if (this.reduced) this.renderOnce();
  }

  private resize = (): void => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    this.mobile = Math.min(w, h) < 700;
    this.renderer.setSize(w, h, false);
    const pr = this.renderer.getPixelRatio();
    (this.fluid.uniforms.uRes.value as Vector2).set(w * pr, h * pr);
    this.fluid.uniforms.uPx.value = Math.max(2, Math.round(3 * pr));
    this.fluid.uniforms.uSide.value = w > 900 ? 1 : 0;
    this.dots.uniforms.uSize.value = (w > 900 ? 21 : 15) * pr;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    if (this.reduced) this.renderOnce();
  };

  private onVisibility = (): void => {
    if (document.hidden) this.stop();
    else this.start();
  };

  private start(): void {
    if (this.reduced) {
      this.renderOnce();
      return;
    }
    if (this.running) return;
    this.running = true;
    this.last = performance.now();
    this.raf = requestAnimationFrame(this.frame);
  }

  private stop(): void {
    this.running = false;
    cancelAnimationFrame(this.raf);
  }

  private frame = (now: number): void => {
    if (!this.running) return;
    const dt = Math.min(0.05, (now - this.last) / 1000);
    this.last = now;
    this.time += dt;
    this.morph = Math.min(1, this.morph + dt / 1.9);
    this.push += (this.pushTarget - this.push) * Math.min(1, dt * 5);
    // Inertie de la rotation manuelle.
    this.drag.vx *= 0.94;
    this.drag.x += this.drag.vx * 0.5;
    this.spin += dt * 0.11;
    this.draw();
    this.raf = requestAnimationFrame(this.frame);
  };

  private renderOnce(): void {
    this.push = this.pushTarget;
    this.draw();
  }

  private draw(): void {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const wide = w > 900;
    const depth = Math.min(1, this.scroll / (h * 0.9));

    // Le nuage se place à droite du texte sur grand écran, au-dessus sur mobile.
    const p = this.points;
    const scale = wide ? 1 : Math.max(0.52, Math.min(0.8, w / 620));
    p.scale.setScalar(scale);
    p.position.x = wide ? Math.min(2.1, 1.05 * this.camera.aspect) : 0;
    p.position.y = (wide ? 0.1 : 0.95) + depth * (wide ? 0.5 : 1.1);
    p.rotation.y = this.spin + this.drag.x + this.scroll * 0.0012 + this.pointer.x * 0.12;
    p.rotation.x = this.tilt + this.drag.y - this.pointer.y * 0.08;
    p.updateMatrixWorld();

    // Rayon du curseur ramené dans le repère du nuage.
    this.ray.origin.setFromMatrixPosition(this.camera.matrixWorld);
    this.ray.direction.set(this.pointer.x, this.pointer.y, 0.5).unproject(this.camera).sub(this.ray.origin).normalize();
    this.inv.copy(p.matrixWorld).invert();
    this.ray.applyMatrix4(this.inv);
    this.ray.direction.normalize();
    (this.dots.uniforms.uRayO.value as Vector3).copy(this.ray.origin);
    (this.dots.uniforms.uRayD.value as Vector3).copy(this.ray.direction);

    this.dots.uniforms.uPush.value = this.push;
    this.dots.uniforms.uMorph.value = this.morph;
    this.dots.uniforms.uTime.value = this.time;
    this.dots.uniforms.uAlpha.value = (wide ? 0.9 : 0.8) * (1 - depth * 0.62);
    this.intensity += ((1 - depth * 0.8) - this.intensity) * 0.12;
    this.fluid.uniforms.uIntensity.value = this.reduced ? 1 - depth * 0.8 : this.intensity;
    this.fluid.uniforms.uTime.value = this.time;
    this.renderer.render(this.scene, this.camera);
  }
}

export function webglAvailable(): boolean {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
}
