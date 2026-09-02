# Images

## What is in `assets/img/`

Twenty-two photographs and product mockups are included in the prototype.
The original twelve are:

`beach-rave` `boats` `brunch` `december-crowd` `fabric` `gallery` `host`
`jazz` `lagos-water` `rooftop` `suya` `tarkwa`

The ten supplied campaign assets added in version 1.3 are:

`field-guide-book` `hero-skyline-night` `hero-brunch` `hero-waterfront`
`hero-nightlife` `story-heritage` `story-new-yam` `story-gallery`
`story-food-market` `story-lagoon`

They exist so the layout can be reviewed with real photographic weight rather
than grey boxes. They are the right subjects, aspect ratios and tonal range for
the slots they fill.

## Production rights

These images are approved for the current prototype and visual direction. The
production team must still record their final usage rights and must not present
them as documentary photographs of a specific paid host or venue unless that
relationship is genuine.

Before a commercial launch, every experience-specific image must either be
cleared for production or replaced with:

- **Host-supplied photography** of the actual venue and experience, which is
  also the right answer commercially — a host's own photographs convert better
  than stock and the platform already has a verification relationship in which
  to collect them; or
- **Licensed stock**, with the licence recorded; or
- **Commissioned photography**.

## Asset routing

Every local image reference goes through `NG.img()` in `js/util.js`, so a CDN
or licensed library can replace the source without touching the view templates.
The Lagos field-guide mockup can remain wherever its brand artwork has final
approval.

## Requirements for replacements

| Slot | Ratio | Notes |
|---|---|---|
| Hero | portrait source in a wide right-hand crop | Manual four-image gallery behind a left-to-right scrim; keep faces near centre. |
| Season card | portrait, ~3:4 | Bottom third is covered by a `rgba(10,10,9,.9)` gradient carrying the title. |
| Experience card | 4:3 | A corner tag sits top-left and a badge bottom-left. Keep both corners quiet. |
| Guide featured | ~4:5 | Same bottom scrim as the season card. |
| Field-kit book | portrait source in a 4:3 crop | Keep the book cover legible; the lower scrim carries a short caption. |
| Story rail | portrait, ~4:5 | Bottom scrim carries the experience label and title. |
| Detail hero | wide | Title and meta sit bottom-left over a heavy scrim. |

Every image that carries text has a gradient overlay reaching
`rgba(10,10,9,.9)` at the text end. That scrim is what makes the white type
legible, and it is why the contrast audit skips these containers — they are
verified against the scrim spec instead of the formula. If you change an
image's tone, do not weaken the scrim to compensate.

Ship AVIF or WebP with a JPEG fallback, and give every one an `alt` that
describes the experience rather than the composition.
