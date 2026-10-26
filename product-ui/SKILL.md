---
name: product-ui
description: Redesigns and improves a product's user interface so it looks like an Awwwards-calibre site, grounded in real product knowledge, built on 10 core UI principles, and always animated with Three.js (3D) and Anime.js (UI motion). Use whenever the user wants to improve, redesign, polish, or "make more professional" a website, landing page, dashboard, product page, or app UI AND product context is available (a product brief, README, docs, feature list, pricing, copy, existing codebase, or the user describing the product). Trigger on phrases like "improve the UI", "redesign the site", "make it look premium", "make it animated", "Awwwards style", "3D website", "Three.js hero", "anime.js", "animated UI", or "my UI looks generic / AI-made". Do NOT use for backend work, non-UI code, or when there is no product context and the user will not provide any.
---

# Product UI × Awwwards × Three.js

This skill improves an existing or planned product interface. It does three things that must all be true of the output:

1. **Product-grounded.** Every headline, section, and 3D object exists because of something true about the product.
2. **Principled.** The UI satisfies the 10 UI principles in `references/ui-principles.md`.
3. **Crafted, not generated.** It avoids the "AI slop" look (`references/ai-slop-blacklist.md`), takes direction from real Awwwards nominees (`references/awwwards-research.md`), and uses two motion libraries with clear roles: **Three.js** for the WebGL scene and depth (`references/threejs-patterns.md`), **Anime.js v4** for text, SVG, and interface choreography (`references/animejs-patterns.md`).

Why the gate on product knowledge: a beautiful interface that says nothing true about the product is decoration. Awwwards-level work is memorable because the visual idea *is* the product idea. Without product knowledge, Claude can only produce the generic look this skill exists to avoid.

## Workflow

Follow the phases in order. Do not start designing before Phase 1 and 2 are written down.

### Phase 1: Build the Product Knowledge Brief (gate)

Gather facts from every source available, in this order: files in the workspace (README, docs, `package.json`, copy, CMS content, existing components, pricing, changelog), anything the user pasted or linked, then the user's answers.

Write `design/product-brief.md` using `references/product-brief-template.md`. It must contain: what the product is, who uses it, the 3 core jobs-to-be-done, the primary conversion action, real features with their real names, proof (numbers, logos, quotes, only if they exist), tone of voice, brand constraints, and the technical stack.

If the brief cannot be filled with real facts, ask the user for the missing pieces (batch them into one message, max 5 questions) and stop until answered. Never invent features, statistics, customer logos, testimonials, or pricing. Mark unknowns as `UNKNOWN` and design around them with honest placeholders.

### Phase 2: Audit the current UI

If a UI already exists, run it (dev server, or read the code) and audit it against the 10 principles. Produce `design/audit.md`: a table of principle, finding, severity, fix. Capture screenshots with the browser tool when available. If nothing exists yet, skip to Phase 3 and treat the principles as the spec.

### Phase 3: Awwwards research (mandatory, do not skip)

Follow `references/awwwards-research.md`. In short: open the Awwwards Nominees listing (and the Three.js and WebGL tag listings), visit at least 8 individual sites that are close to this product's category or emotional tone, and analyze each one using the extraction checklist. Write `design/inspiration.md`.

You extract *principles and techniques*, never layouts, copy, assets, or code. If the result reads like a clone of one site, redo it.

### Phase 4: Design direction

Write `design/direction.md` (one page) before touching code:

- **Concept:** one sentence linking the product's core truth to a visual metaphor (e.g. a data-routing product → light travelling along paths; a materials company → a surface that responds to touch).
- **3D idea:** what the Three.js scene is, what product concept it expresses, and how it responds to scroll and pointer. It must not be generic floating shapes.
- **Type system:** one display face with character plus one text face; scale and line-height rules. Avoid the default stack called out in the blacklist.
- **Colour:** a palette derived from the brand or product domain, with contrast ratios checked.
- **Motion language:** 2-3 easings, 3-4 durations, one stagger rhythm, and what moves and why. Shared by Anime.js (DOM/SVG/text) and Three.js (scene) so the page feels like one system.
- **Page narrative:** the sequence of sections as a story with a single conversion action.

### Phase 5: Build

- Respect the user's stack. Add `three` via the package manager when a bundler exists; otherwise use an import map pinned to an exact version. Use `assets/three-scene-template.js` as the starting point for scene lifecycle (lazy mount, resize, reduced motion, dispose).
- Install `animejs` (v4, pinned) alongside `three`. Use `assets/animejs-motion-template.js` for tokens, reveals, split-text headlines, hover springs, and the shared `sceneState`.
- Scroll: Anime.js `onScroll` drives DOM animation; Lenis is optional for smooth scrolling. Keep one scroll system (do not run GSAP ScrollTrigger on the same elements unless the project already depends on it). Drive Three.js camera and uniforms from a shared, eased scroll value.
- Link the two libraries: animate a plain `sceneState` object with Anime.js and read it in the Three.js update loop, so one timeline can choreograph headline, UI, and 3D together.
- Write Anime.js **v4** syntax only (`animate`, `createTimeline`, `ease`), never v3 (`anime({ targets, easing })`).
- Build real components with design tokens (CSS variables), not one-off values.
- Content comes from the Product Knowledge Brief, word for word where it exists.

### Phase 6: Verify before declaring done

Run the checklist at the bottom of this file. Check at 375px, 768px, and 1440px widths, with reduced motion on and off, and with WebGL disabled. Report what passed and what was knowingly traded off.

## Three.js and Anime.js are always included, but never gratuitous

Every project gets at least one Three.js scene, because the user wants depth and motion as a signature. Make it earn its place:

- It expresses the product idea (Phase 4), not a random particle field or spinning torus knot.
- It loads after first paint and never blocks the headline or the primary action. The page is fully usable and still looks designed if the canvas fails.
- It has a static fallback (poster image or CSS gradient scene) for `prefers-reduced-motion` and for no-WebGL.
- Anime.js animates the interface around it: headline and text reveals, staggered sections, SVG diagrams of how the product works, springy controls. Content is visible by default; JS applies the start state, so nothing is hidden if scripts fail. Intros are skippable and under ~2.5s, and never gate the primary action.
- Dashboards and dense tools: keep the scene to the entry/landing, empty states, loading, and onboarding moments. Do not put 3D behind data tables people work in all day; use Three.js for those moments only, and say so in `direction.md`.

## Definition of done checklist

- [ ] Every claim, feature name, and number traces to the Product Knowledge Brief
- [ ] Each of the 10 principles has a concrete implementation noted in `design/audit.md` or `direction.md`
- [ ] Nothing from the AI-slop blacklist appears
- [ ] `design/inspiration.md` lists 8+ real nominee sites with extracted techniques
- [ ] Three.js scene present, tied to the product idea, lazy-loaded, with fallbacks and `dispose()` on unmount
- [ ] Anime.js v4 used for UI motion with shared tokens, scoped via `createScope` and `revert()` on unmount, reduced-motion path tested
- [ ] DOM and 3D linked through `sceneState` (at least one interaction where UI drives the scene or vice versa)
- [ ] WCAG AA contrast, visible focus states, full keyboard navigation, semantic landmarks
- [ ] Reduced-motion mode removes parallax and loops but keeps the layout intact
- [ ] Mobile: scene simplified (lower DPR cap, fewer instances) and touch targets at least 44px
- [ ] Lighthouse performance sanity: LCP is text or image, not the canvas; no layout shift from the canvas mounting
- [ ] Loading, empty, error, and success states designed, not defaulted

## What this skill refuses to do

- Fabricate product facts to make the design look fuller
- Copy another site's layout, text, imagery, or shader code
- Ship a Three.js scene that harms accessibility or makes the page unusable on mid-range phones
- Mix animation libraries on the same element, or write Anime.js v3 syntax