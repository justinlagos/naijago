# UI audit — version 1.3

Reviewed 2 September 2026 against the supplied Follow the vibe and brand-icon
references.

## Corrected

- Replaced the generic clipped-square vibe marker with the approved geometric
  nightlife, food, music, culture, beach and stay icons.
- Applied the same icon language to the finder, location control, category
  labels, trust facts, guides, hosts, search shortcuts, mobile dock, filters,
  experience facts, payment rails, passes, account navigation and partner
  console.
- Removed the duplicate accessible experience title caused by an invisible
  overlay link plus a second text node. The visible heading link now creates
  its card-sized hit area with a pseudo-element.
- Split Discover and Events into distinct route states so only one navigation
  item receives `aria-current="page"`.
- Added safe-area space below the mobile dock and moved toasts above it.
- Allowed the checkout hold message to wrap cleanly on narrow screens.
- Included all six experiences in the homepage finder.
- Replaced machine-specific paths in the Playwright and bundle scripts with
  project-relative paths and an optional `PLAYWRIGHT_CHROMIUM_PATH` override.
- Added a deterministic production build that excludes tests and documentation
  from Netlify's public output.

## Version 1.2 section refinement

- Rebuilt the homepage field-kit section around the source images' landscape
  proportions instead of forcing both photographs into narrow portrait crops.
- Introduced one clear lead image and a secondary layered pass card, with
  captions attached to their relevant image rather than floating as poster
  labels.
- Added dedicated tablet and mobile compositions. The overlap becomes a
  controlled stack on small screens, preserving content order and avoiding
  horizontal overflow.

## Version 1.3 experience refinement

- Replaced the abstract field-kit collage with the supplied physical Lagos
  City Guide and tightened the supporting copy into a compact product module.
- Added a four-image hero gallery with explicit previous, next and position
  controls. It is manual by design, supports touch swipe and keyboard arrows,
  and never moves content without the visitor asking it to.
- Rebuilt the closing CTA as a swipeable story rail using five supplied
  lifestyle images. The rail uses native overflow and scroll snap, retaining
  touch momentum and keyboard-safe controls.
- Added progressive, reduced-motion-aware section reveals to soften the page
  rhythm without delaying access to controls or hiding content when JavaScript
  support is unavailable.

## Deliberate prototype constraints

- State remains in memory and resets on reload.
- Card entry is represented by a safe simulation; no real payment details are
  collected.
- The displayed QR is deterministic artwork, not a scannable credential.
