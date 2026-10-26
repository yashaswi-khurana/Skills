// Motion system for product sites (Anime.js v4).
// Provides: tokens, reduced-motion handling, reveal-on-scroll, split-text headline,
// hover springs, and a shared sceneState for Three.js.
//
// Usage:
//   import { initMotion, sceneState } from './animejs-motion-template.js';
//   const motion = initMotion(document.querySelector('main'));
//   ... on unmount: motion.destroy();
// Read `sceneState` inside the Three.js update loop (see three-scene-template.js).

import { animate, createTimeline, stagger, onScroll, splitText, createScope, createSpring } from 'animejs';

// ---- Tokens: keep in sync with design/direction.md --------------------------------
export const motion = {
  ease: { out: 'outExpo', inOut: 'inOutQuad', spring: () => createSpring({ stiffness: 220, damping: 18 }) },
  dur: { micro: 150, ui: 350, reveal: 700, hero: 1200 },
  stagger: 60,
};

// Shared state that Three.js reads each frame.
export const sceneState = { intro: 0, focus: 0 };

const prefersReduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function initMotion(root = document) {
  const reduced = prefersReduced();

  const scope = createScope({ root }).add(() => {
    // 1) Intro: headline + CTA + scene, skipped entirely under reduced motion.
    const headline = root.querySelector('[data-hero-title]');
    if (reduced) {
      sceneState.intro = 1;
    } else {
      const tl = createTimeline({ defaults: { ease: motion.ease.out, duration: motion.dur.hero } });
      tl.add(sceneState, { intro: [0, 1] }, 0);
      if (headline) {
        const { words } = splitText(headline, { words: true, accessible: true });
        tl.add(words, { translateY: ['110%', '0%'], opacity: [0, 1], duration: motion.dur.reveal, delay: stagger(40) }, 200);
      }
      tl.add('[data-hero-cta]', { translateY: [16, 0], opacity: [0, 1], duration: motion.dur.reveal }, '-=300');
    }

    // 2) Section reveals: content is visible by default; JS applies the start state.
    if (!reduced) {
      root.querySelectorAll('[data-reveal]').forEach((section) => {
        animate(section.children, {
          translateY: [24, 0],
          opacity: [0, 1],
          duration: motion.dur.reveal,
          ease: motion.ease.out,
          delay: stagger(motion.stagger),
          autoplay: onScroll({ target: section, enter: 'bottom-=10% top' }),
        });
      });
    }

    // 3) Hover/focus springs on interactive elements.
    if (!reduced) {
      root.querySelectorAll('[data-spring]').forEach((el) => {
        const to = (scale) => animate(el, { scale, duration: motion.dur.ui, ease: motion.ease.spring() });
        el.addEventListener('pointerenter', () => to(1.04));
        el.addEventListener('pointerleave', () => to(1));
        el.addEventListener('focus', () => to(1.04));
        el.addEventListener('blur', () => to(1));
      });
    }

    // 4) Feature hover drives the 3D scene via sceneState.
    root.querySelectorAll('[data-feature]').forEach((el) => {
      const set = (v) => animate(sceneState, { focus: v, duration: reduced ? 0 : 600, ease: 'outCubic' });
      el.addEventListener('pointerenter', () => set(1));
      el.addEventListener('pointerleave', () => set(0));
      el.addEventListener('focus', () => set(1));
      el.addEventListener('blur', () => set(0));
    });
  });

  return { destroy: () => scope.revert() }; // revert() cleans animations and inline styles
}