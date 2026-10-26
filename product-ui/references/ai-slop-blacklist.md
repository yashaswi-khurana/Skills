# AI-slop UI blacklist

"AI slop" is the statistically average output: it looks fine at a glance and says nothing about the product. It signals that nobody made a decision. Before shipping, scan the build against this list. A single hit is a prompt to redesign that element with a product-specific choice, not to shuffle it.

## Layout and composition
- The default hero: centred headline, subhead, two buttons, a floating mockup beneath. Break the template with an asymmetric grid, scale contrast, or let the 3D scene carry the composition.
- Three or four identical feature cards with an icon, a title, and two lines of text in a row. Replace with a sequence that shows the feature in use, or vary the scale and format by importance.
- Every section the same height and padding with the same centred heading. Vary rhythm deliberately.
- "Bento grid" used only because it is trendy, with no hierarchy among the tiles.
- Logo strip, testimonial carousel, pricing trio, and FAQ accordion in the standard order with invented content.

## Colour and surface
- Purple-to-blue or indigo-to-pink gradient on a white or near-black background; blurry gradient orbs behind the hero.
- Glassmorphism applied to everything: translucent cards with a thin white border over a gradient.
- Neon glow on dark mode as the only personality.
- Generic soft shadows on every card plus a 12-16px radius on every element.
- Colour chosen without relation to the brand or domain.

## Typography
- The default stack as the entire typographic idea: Inter, Roboto, Arial, system-ui, or Space Grotesk used alone with no pairing or scale decisions.
- Gradient-filled headline text as decoration.
- Every heading at the same weight; no deliberate contrast of size, width, or style.
- Emoji used as icons or bullet points.

## Content
- Vague claims: "Supercharge your workflow", "Unlock the power of", "Seamless", "Next-generation", "Revolutionise", "All-in-one platform".
- Invented statistics ("10x faster", "99.9% satisfaction"), fake logos, fake testimonials, lorem ipsum, stock avatars.
- Rule-of-three adjectives in every headline.
- Placeholder names such as Acme, John Doe, or Jane Smith.

## Motion and 3D
- Everything fades up on scroll with the same 0.6s ease and no stagger logic.
- Per-character animation on whole paragraphs; typewriter effects as the only idea.
- Anime.js v3 syntax or GSAP and Anime.js fighting over the same element.
- Random floating spheres, torus knots, wireframe globes, or particle fields unrelated to the product.
- Default `MeshStandardMaterial` grey objects under default lights.
- A spinning model that ignores scroll and pointer.
- Loops that never stop, scroll-jacking that fights the user, a 5-second preloader.
- Heavy 3D with no fallback, no lazy loading, no reduced-motion handling.

## Process tells
- Components with inline styles and magic numbers instead of tokens.
- A different button style on each section.
- "Looks premium" asserted with no reasoning in `direction.md`.

## Positive replacements
- Anchor the visual to a product truth (see Phase 4 of SKILL.md).
- Commit to a strong choice: scale contrast, a distinctive display face, a limited palette with one sharp accent, real photography or rendered product objects, custom shader materials, considered easing.
- Write copy from the Product Knowledge Brief in the product's own voice.