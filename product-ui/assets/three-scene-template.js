// Reusable Three.js scene lifecycle for product sites.
// Handles: lazy mount, resize, pointer easing, scroll progress, visibility pause,
// reduced motion, WebGL failure, adaptive quality, and full disposal.
//
// Usage:
//   import { mountScene } from './three-scene-template.js';
//   const scene = await mountScene(canvas, { build, update });
//   scene.setScroll(progress01);   // call from your ScrollTrigger / Lenis handler
//   scene.destroy();               // call on unmount / route change

import * as THREE from 'three';

export async function mountScene(canvas, { build, update, maxDpr = 2, mobileDpr = 1.5 } = {}) {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile = window.matchMedia('(max-width: 768px)').matches;

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: !isMobile,
      alpha: true,
      powerPreference: 'high-performance',
    });
  } catch (err) {
    document.documentElement.classList.add('no-webgl'); // CSS shows the static fallback
    return { setScroll() {}, destroy() {} };
  }

  const dprCap = isMobile ? mobileDpr : maxDpr;
  let dpr = Math.min(window.devicePixelRatio || 1, dprCap);
  renderer.setPixelRatio(dpr);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
  camera.position.set(0, 0, 6);

  const clock = new THREE.Clock();
  const pointer = { x: 0, y: 0, tx: 0, ty: 0 }; // eased + target
  const state = { THREE, scene, camera, renderer, pointer, scroll: 0, time: 0, isMobile, reduceMotion };

  // `build` creates meshes/lights/materials and may return { objects } for custom disposal.
  const built = (await build?.(state)) || {};

  function resize() {
    const { clientWidth: w, clientHeight: h } = canvas;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);
  resize();

  function onPointerMove(e) {
    pointer.tx = (e.clientX / window.innerWidth) * 2 - 1;
    pointer.ty = -((e.clientY / window.innerHeight) * 2 - 1);
  }
  if (!reduceMotion) window.addEventListener('pointermove', onPointerMove, { passive: true });

  let running = false;
  let raf = 0;
  let visible = true;
  let slowFrames = 0;
  let scrollTarget = 0;

  function frame() {
    raf = requestAnimationFrame(frame);
    const dt = Math.min(clock.getDelta(), 0.05);
    state.time += dt;

    // ease inputs; never snap
    pointer.x += (pointer.tx - pointer.x) * 0.08;
    pointer.y += (pointer.ty - pointer.y) * 0.08;
    state.scroll += (scrollTarget - state.scroll) * 0.08;

    update?.(state, dt);
    renderer.render(scene, camera);

    // adaptive quality: if frames are slow for a while, lower the pixel ratio
    if (dt > 1 / 40) slowFrames++; else slowFrames = Math.max(0, slowFrames - 1);
    if (slowFrames > 45 && dpr > 1) {
      dpr = Math.max(1, dpr - 0.25);
      renderer.setPixelRatio(dpr);
      resize();
      slowFrames = 0;
    }
  }

  function start() { if (!running && visible && !reduceMotion) { running = true; clock.start(); frame(); } }
  function stop() { running = false; cancelAnimationFrame(raf); }

  // Reduced motion: render a single still frame, no loop.
  if (reduceMotion) {
    update?.(state, 0);
    renderer.render(scene, camera);
  }

  // Run only while on screen and tab visible.
  const io = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    visible ? start() : stop();
  }, { threshold: 0.01 });
  io.observe(canvas);

  const onVis = () => (document.hidden ? stop() : visible && start());
  document.addEventListener('visibilitychange', onVis);

  const onLost = (e) => { e.preventDefault(); stop(); document.documentElement.classList.add('no-webgl'); };
  const onRestored = () => { document.documentElement.classList.remove('no-webgl'); resize(); start(); };
  canvas.addEventListener('webglcontextlost', onLost);
  canvas.addEventListener('webglcontextrestored', onRestored);

  function destroy() {
    stop();
    io.disconnect();
    ro.disconnect();
    window.removeEventListener('pointermove', onPointerMove);
    document.removeEventListener('visibilitychange', onVis);
    canvas.removeEventListener('webglcontextlost', onLost);
    canvas.removeEventListener('webglcontextrestored', onRestored);
    scene.traverse((obj) => {
      if (obj.geometry) obj.geometry.dispose();
      const mats = Array.isArray(obj.material) ? obj.material : obj.material ? [obj.material] : [];
      mats.forEach((m) => {
        Object.values(m).forEach((v) => v && v.isTexture && v.dispose());
        m.dispose();
      });
    });
    built.dispose?.();
    renderer.dispose();
  }

  return { setScroll: (p) => { scrollTarget = p; }, destroy, state };
}

/* Example `build` / `update` (replace with the product-specific idea from direction.md):
 *
 * const build = ({ THREE, scene }) => {
 *   const material = new THREE.ShaderMaterial({ uniforms: { uTime: { value: 0 }, uScroll: { value: 0 } }, vertexShader, fragmentShader });
 *   const mesh = new THREE.Mesh(new THREE.IcosahedronGeometry(1.4, 64), material);
 *   scene.add(mesh);
 *   return { material, mesh };
 * };
 * const update = (s, dt) => {
 *   s.camera.position.x = s.pointer.x * 0.4;
 *   s.camera.position.y = s.pointer.y * 0.25;
 *   s.camera.lookAt(0, 0, 0);
 * };
 */