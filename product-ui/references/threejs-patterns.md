# Three.js patterns for product sites

Read this when writing the scene. Pair with `assets/three-scene-template.js`.

## Choosing the idea (from the Product Knowledge Brief)
Translate a product truth into a physical behaviour. Examples of the *method* (do not reuse these literally):
- Product moves or routes things -> flowing lines or light along curves, speed tied to scroll.
- Product organises or clusters -> instanced points that cohere into a structure as you scroll.
- Product is a physical object -> the real model (glTF, compressed), lit well, rotated by scroll, with callouts tied to real features.
- Product is about clarity or focus -> a noisy field that resolves into form as the user reaches the key section.
- Product is about trust or security -> dense lattice or glass surface that reacts to the pointer.
If no product truth maps to a 3D idea, use a restrained material study (a single well-lit custom-shader surface) rather than decoration.

## Tooling choices
- Vanilla Three.js is the default; works in any stack.
- React projects: `@react-three/fiber` + `@react-three/drei` are acceptable and speed up lifecycle and loaders.
- Scroll: Anime.js `onScroll` (or Lenis plus a scroll handler) produces a 0-1 progress value that drives camera and uniforms via `scene.setScroll(p)`. Do not drive animation from `window.scrollY` ad hoc. See `references/animejs-patterns.md` for the shared `sceneState` bridge and the division of labour between the two libraries.
- Post-processing (bloom, chromatic aberration, grain): use sparingly, one or two passes, disabled on mobile.
- Pin the Three.js version; APIs change between releases.

## Look and feel (away from the default grey-material look)
- Use a custom `ShaderMaterial` / `onBeforeCompile` for at least one signature surface (noise displacement, fresnel rim, gradient mapping, scroll-reactive distortion).
- Lighting is a design choice: HDRI environment via `RGBELoader`/`EXRLoader` for physical materials, or matcap for stylised ones.
- Colour from the brand palette. Set `renderer.outputColorSpace = THREE.SRGBColorSpace` and use tone mapping (`ACESFilmicToneMapping`) so colours do not look washed out.
- Subtle grain or noise overlay adds tactility.

## Interaction model
- Pointer: lerp a normalised pointer vector toward the target every frame (factor 0.05-0.1) and use it for camera parallax, light position, or shader uniform. Never snap.
- Scroll: map section progress to camera path, object transform, or shader uniform. Ease the mapped value.
- Hover on 3D hotspots: use a `Raycaster` only when the pointer moves, throttled; always provide an HTML equivalent for keyboard users.

## Performance budget
- Cap pixel ratio: `Math.min(devicePixelRatio, 2)` desktop, 1.5 mobile.
- Use `InstancedMesh` or `Points` for many objects; never hundreds of separate meshes.
- Compress assets: glTF with Draco or Meshopt, textures as KTX2/WebP, keep the first-load 3D payload ideally under 1.5 MB.
- Lazy-load: mount the scene after first paint via dynamic `import()`; start rendering only when the canvas intersects the viewport (`IntersectionObserver`); stop on `visibilitychange` hidden.
- Reuse geometries and materials. Call `dispose()` on geometries, materials, textures, render targets, and the renderer when unmounting (very important in SPAs).
- Avoid reading back from the GPU or allocating inside the render loop.
- Target 60 fps on a mid-range phone; if frame time degrades, lower pixel ratio automatically (simple adaptive quality).

## Fallbacks and accessibility
- `prefers-reduced-motion: reduce`: render one still frame, no loop, no scroll-linked camera.
- No WebGL / context lost: show a poster (pre-rendered still of the scene) or a CSS gradient composition. Handle `webglcontextlost` and `webglcontextrestored`.
- Canvas is `aria-hidden="true"`, `pointer-events: none` unless it is interactive, positioned behind content with `position: fixed` or `sticky`, with text contrast verified at the worst frame.
- Reserve the canvas box in CSS to prevent layout shift.

## Anti-patterns
- Full-screen canvas that blocks text selection and links with no fallback.
- Scene that starts loading 8 MB of assets before text is visible.
- Orbit controls on a marketing hero that let users get lost.
- Particle field because "it looks techy".