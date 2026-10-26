# Anime.js (v4) patterns for product sites

Read this when writing UI motion. Anime.js handles the **DOM, SVG, text, and UI choreography**; Three.js handles the **WebGL scene**. Together they give one coherent motion language. The two meet at a small shared state object (see "Bridging to Three.js").

Anime.js v4 is modular and tree-shakeable. It changed a lot from v3: `ease` replaces `easing`, `animate()` replaces the `anime()` call, `createTimeline()` replaces `anime.timeline()`. Do not write v3 code. If unsure about a signature, check https://animejs.com/documentation before using it.

```js
// npm install animejs   (pin an exact version)
import { animate, createTimeline, stagger, onScroll, splitText, svg, createScope, createSpring, createDraggable } from 'animejs';
```
No bundler: use an ES module import from a CDN with a pinned version, or the UMD build (`const { animate } = anime;`).

## Division of labour (avoids two libraries fighting)
| Job | Tool |
|---|---|
| WebGL scene, camera, shaders | Three.js |
| Text reveals, headline choreography | Anime.js `splitText` + `animate` |
| Section reveals, staggered grids/lists | Anime.js `stagger` |
| SVG line drawing, morphing, motion paths | Anime.js `svg.*` |
| Page-load / intro sequences | Anime.js `createTimeline` |
| Scroll-linked DOM animation | Anime.js `onScroll` |
| Draggable, springy UI | Anime.js `createDraggable` + `createSpring` |
| Smooth scrolling | Lenis (optional) |
| Scroll-linked 3D | A shared `scroll` value (see below), eased inside the Three loop |

Use **one** scroll system. Default is Anime.js `onScroll`. Only use GSAP ScrollTrigger if the project already depends on it; never run both on the same elements.

## Motion language (define once, reuse everywhere)
Define tokens in `direction.md` and mirror them in code (`assets/animejs-motion-template.js` has a starting set):
- 2-3 easings maximum (e.g. one "out" for entrances, one "inOut" for transitions, one spring for interactive things).
- 3-4 durations (micro ~150ms, UI ~350ms, reveal ~700ms, hero ~1200ms).
- One stagger rhythm (e.g. 40-80ms between siblings).
- Rules for what moves: only things that explain hierarchy or give feedback. If nothing is lost when the animation is removed, remove it.

## Patterns

### Staggered reveal
```js
animate('[data-reveal] > *', {
  translateY: [24, 0],
  opacity: [0, 1],
  duration: 700,
  ease: 'outExpo',
  delay: stagger(60),
});
```

### Split-text headline
```js
const { chars } = splitText('h1', { chars: true, accessible: true }); // keep accessible: true so screen readers read the original text
animate(chars, { translateY: ['110%', '0%'], duration: 900, ease: 'outExpo', delay: stagger(18) });
```
Wrap each char/word in an `overflow: hidden` mask (via the split params) for the "rising from a line" effect. Split by **words** for long headlines; per-char animation on long text is noisy.

### Intro timeline
```js
const tl = createTimeline({ defaults: { ease: 'outExpo', duration: 900 } });
tl.add('.nav', { opacity: [0, 1] })
  .add('h1 .char', { translateY: ['110%', '0%'], delay: stagger(18) }, '-=500')
  .add('.cta', { opacity: [0, 1], translateY: [16, 0] }, '-=400');
```
The intro must be skippable and under ~2.5s; the primary action is never gated behind it.

### Scroll-linked DOM animation
```js
animate('.step-visual', {
  scale: [0.9, 1],
  opacity: [0, 1],
  ease: 'linear',
  autoplay: onScroll({ target: '.step', enter: 'bottom top', leave: 'top bottom', sync: true }),
});
```
`sync: true` ties progress directly to scroll; use `sync: 0.1`-style smoothing if the API version supports it and you want eased scrubbing. Confirm option names in the docs for the pinned version.

### SVG line drawing and morphing
```js
animate(svg.createDrawable('.route'), { draw: ['0 0', '0 1'], duration: 1600, ease: 'inOutQuad' });
animate('.shape-a', { d: svg.morphTo('.shape-b'), duration: 900, ease: 'inOutQuad' });
```
Good for diagrams that explain how the product works. Use real product flows, not abstract squiggles.

### Interactive feedback (hover / press)
Use springs for tactile controls:
```js
btn.addEventListener('pointerenter', () => animate(btn, { scale: 1.04, duration: 400, ease: createSpring({ stiffness: 220, damping: 18 }) }));
btn.addEventListener('pointerleave', () => animate(btn, { scale: 1, duration: 400, ease: createSpring({ stiffness: 220, damping: 18 }) }));
```
Add `focus-visible` equivalents so keyboard users get the same feedback.

### Lifecycle (React, Vue, SPAs)
Always scope and revert, otherwise styles and animations leak between routes:
```js
useEffect(() => {
  const scope = createScope({ root: rootRef.current }).add(() => { /* animate(...) calls */ });
  return () => scope.revert();
}, []);
```

## Bridging to Three.js
Animate a plain object with Anime.js and read it inside the Three.js update loop. This keeps one source of truth and lets a single timeline choreograph DOM and WebGL together.
```js
export const sceneState = { intro: 0, focus: 0, hue: 0 };

createTimeline()
  .add(sceneState, { intro: [0, 1], duration: 1600, ease: 'outExpo' })
  .add('h1 .char', { translateY: ['110%', '0%'], delay: stagger(18) }, '-=1000');

// inside Three update(state, dt):
material.uniforms.uIntro.value = sceneState.intro;
camera.position.z = 8 - sceneState.intro * 2;
```
Hover a feature card -> `animate(sceneState, { focus: 1, duration: 600, ease: 'outCubic' })` -> the 3D object highlights the matching part. This is the strongest way to make DOM and 3D feel like one designed system.

## Performance and accessibility
- Animate `transform` and `opacity`; avoid animating layout properties (`width`, `top`, `margin`).
- Do not `will-change` everything; apply it only just before heavy animations.
- `prefers-reduced-motion: reduce`: skip intro timelines, parallax, and loops; show the end state immediately (`animate(..., { duration: 0 })` or set final styles). Keep small feedback transitions under 150ms.
- Never hide content behind an animation that may not run: set the *visible* state as the CSS default and apply the hidden start state from JS (`translateY: [24, 0]` already does this) so content is readable if JS fails.
- Pause off-screen loops. Revert scopes on route change.
- Animated text must remain selectable and screen-reader readable (`accessible: true` in `splitText`).
- Provide a visible control to pause continuous motion if any loop exceeds 5 seconds.

## Anti-patterns
- Every element fades up with the same duration and no stagger logic.
- Anime.js and GSAP both animating the same element.
- v3 syntax (`anime({ targets: ..., easing: ... })`) in a v4 project.
- Per-character animation on paragraphs.
- Animation that delays the first meaningful paint or the primary action.