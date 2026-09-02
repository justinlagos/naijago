# UI audit — version 1.1

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

## Deliberate prototype constraints

- State remains in memory and resets on reload.
- Card entry is represented by a safe simulation; no real payment details are
  collected.
- The displayed QR is deterministic artwork, not a scannable credential.
