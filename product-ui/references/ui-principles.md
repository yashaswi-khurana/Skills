# The 10 UI principles, as build rules

Source: "10 Principles in UI Design" (Mynavi TechTus Vietnam, Medium). Each principle below keeps the article's intent and adds the concrete check Claude applies when auditing and building. On an Awwwards-style site the risk is that spectacle overrides these; the principles are the guardrails that keep the spectacle usable.

## 1. Simplicity
Minimise complexity and cognitive load; one clear task per view.
- One primary action per viewport. One idea per section.
- Cap navigation at ~6 items. Remove any element whose removal would not hurt the user's task.
- 3D rule: the scene supports the message. If the canvas competes with the headline for attention, reduce it.

## 2. Consistency
Same elements behave and look the same everywhere.
- Define design tokens first (colour, type scale, spacing scale, radius, shadow, easing, duration). No raw values in components.
- One motion language: the same easing and duration family for all hover, reveal, and transition effects, defined once as tokens and shared by Anime.js and Three.js.
- Same interaction = same component. Buttons, links, and cards each have a single canonical form.

## 3. Visual hierarchy
Arrange elements to show importance and guide attention.
- Squint test: blurred, the eye lands on headline, then primary action, then proof.
- Use size, weight, contrast, and space, not colour alone. Display-to-body ratio at least 3:1 on the hero.
- 3D rule: the scene sits behind or beside the text, never over the primary action. Camera motion should lead the eye toward the call to action.

## 4. Feedback and responsiveness
Every action gets an immediate, visible response.
- Hover, focus, active, loading, success, and error states for every interactive element.
- Respond within 100 ms; anything slower shows progress. A branded preloader is fine only when real assets are loading, and it must show true progress.
- Pointer-reactive 3D (tilt, light follow, ripple) counts as feedback when it signals interactivity. Use it on interactive things, not everywhere.
- Anime.js springs on buttons, cards, and toggles give tactile feedback; mirror every hover effect on `:focus-visible`.

## 5. Accessibility
Usable by people with disabilities.
- Text contrast 4.5:1 (3:1 for large text). Check text over canvas and over gradients at the worst frame.
- Full keyboard path with visible focus rings; skip link; semantic landmarks and heading order.
- `prefers-reduced-motion`: stop loops, disable parallax and scroll-jacking, render a single still frame, and skip Anime.js intro timelines (show the end state).
- Split-text animation keeps `accessible: true` so screen readers get the original text.
- The `<canvas>` is decorative: `aria-hidden="true"`; any information it conveys must also exist as text. Never hide meaning in WebGL only.
- Respect user text-size settings; no fixed `px` for body type.

## 6. Clarity
Concise language, logical organisation, readable type.
- Headlines say what the product does in plain words; cleverness goes in the visuals, not in making the offer ambiguous.
- Body copy 60-75 characters per line, line-height 1.5-1.7.
- Labels over icons-only. If an icon is unfamiliar, add a text label.
- Section order follows the user's questions: what is it, why me, how does it work, proof, price, act.

## 7. User control
Users can navigate, customise, undo, and opt out.
- Never hijack scroll in a way that removes control. Smooth scroll is fine; trapping the user is not.
- Provide a visible way to pause or skip animation, mute sound, and skip intros (Anime.js timelines support `.complete()` to jump to the end). Sound is off by default.
- Allow back-navigation and preserve state. Provide undo for destructive actions.
- Offer a "reduce motion" toggle in addition to honouring the OS setting.

## 8. Error prevention and recovery
Prevent mistakes; when they happen, explain and help.
- Inline validation on blur, specific messages ("Enter an email like name@company.com"), preserve input on error.
- Confirm destructive actions; disable submit only with an explanation, not silently.
- Designed 404, offline, and WebGL-failed states. If WebGL fails, the page still looks intentional.

## 9. Aesthetics and visual appeal
A cohesive look aligned with the brand that evokes the right emotion.
- Choose one distinctive visual idea and execute it fully: type, colour, imagery, and 3D all serve it.
- Whitespace is a material. Dense is allowed where the product is dense; it must still be ordered on a grid.
- Details: custom cursor states, considered image treatment, tuned easing, real texture. Avoid default shadows and default gradients.
- Use `references/ai-slop-blacklist.md` as the negative filter.

## 10. Scalability and adaptability
Works across screen sizes, resolutions, orientations, and growth.
- Mobile-first layout; fluid type with `clamp()`; container queries where cards reflow.
- 3D adapts: cap devicePixelRatio (2 desktop, 1.5 mobile), reduce instance counts and shader cost on small or low-power devices, pause when off-screen.
- Components are data-driven so new features and pages slot into the system without redesign.
- Test portrait and landscape, 375px to 1920px+, and a throttled CPU.