# Awwwards research protocol

Awwwards Nominees are sites currently in the running for awards; they show where professional web design is *now*. This phase exists so the design direction comes from observing real, recent work, not from Claude's averaged memory of "good websites".

## Sources to open
1. Nominees listing: https://www.awwwards.com/websites/nominees/ (pages 1-5 via `?page=N`)
2. Three.js sites: https://www.awwwards.com/websites/three-js/
3. WebGL sites: https://www.awwwards.com/websites/webgl/
4. 3D sites: https://www.awwwards.com/websites/3d/
5. Category listing nearest to the product, e.g. /websites/technology/, /websites/business-corporate/, /websites/e-commerce/, /websites/startups/, /websites/luxury/, /websites/portfolio/
6. Anime.js sites: https://www.awwwards.com/websites/anime-js/ (compare how winners choreograph text, SVG, and UI motion)
7. Technique tags when relevant: /websites/scrolling/, /websites/microinteractions/, /websites/typography/, /websites/transitions/, /websites/interaction-design/, /websites/storytelling/

Use the browser tool to open the live nominee sites (each listing card links to an Awwwards detail page, which links to the real site). Use a fetch tool for the listing pages. The listing changes constantly, so always load it fresh and never rely on a remembered list.

## How to choose which sites to study
Pick **at least 8**, in three groups:
- **3 category peers:** same industry or user type as the product.
- **3 emotional peers:** same feeling you want (calm precision, playful, luxurious, technical, raw).
- **2 technique peers:** exceptional Three.js, Anime.js, or scroll work, even if the subject is unrelated.

Record the URL, the date visited, and why it was chosen. If a site fails to load or has no 3D, replace it.

## Extraction checklist (per site, 6-10 lines)
Look at the site on desktop and mobile width, scroll slowly, then hover and click everything.

- **Concept:** what is the one visual idea, and what product truth does it express?
- **First 5 seconds:** what is on screen, what moves, what is the entry action?
- **Type:** display vs text pairing, scale contrast, treatment (tracking, case, weight shifts).
- **Colour:** palette size, how the accent is used, light/dark strategy.
- **Layout:** grid behaviour, asymmetry, use of whitespace, how sections are paced.
- **Motion:** easing feel, what is staggered, scroll-linked vs time-based, transitions between pages. Note how text, SVG and UI elements are choreographed (split text, line drawing, morphs, springs).
- **3D / WebGL:** what object or scene, camera behaviour, interaction (pointer, scroll), material approach (shader, matcap, PBR, post-processing), how it degrades on mobile.
- **Interaction details:** cursor, hover states, menu, loading sequence.
- **Usability:** what is hard (contrast, hidden nav, slow load)? Note anti-lessons too.
- **Steal the principle, not the pixels:** one transferable technique in your own words.

## Output: `design/inspiration.md`
```
## <Site name> - <url> - visited <date>
Why chosen: ...
Concept: ...
Techniques worth adapting: ...
What not to copy / problems: ...
```
End with **Synthesis**: 5-7 patterns that recur across the sites, then **How this product's direction differs** (the part that keeps the result original).

## Rules
- Never reproduce another site's layout, copy, imagery, brand assets, or shader/JS source. Learn the technique, rebuild it for this product.
- Record what you actually saw. Do not describe sites you did not open.
- Prefer sites from the last few months of nominations; style dates quickly.
- A small studio's experimental site and a corporate site can teach different things; mix both.

## Seed examples (snapshot, verify live before use)
Seen on the Nominees listing when this skill was written. They are starting points only; the live list is the source of truth.
Palace Skateboards, Patmos, Mosaic (Flabbergast), Daddy Yankee, Gianluca Boccia, ZEGGO, MDS Collective, Kigo Studio, HOLMCHROME, Dopamine Studio, Huxley Saga (Studio Freight, a studio known for Lenis smooth scroll and WebGL craft), Roof Studio, Les Intranquilles.