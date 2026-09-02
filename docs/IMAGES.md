# Images

## What is in `assets/img/`

Twelve photographs, roughly 720KB in total, generated with an AI image model
for this prototype:

`beach-rave` `boats` `brunch` `december-crowd` `fabric` `gallery` `host`
`jazz` `lagos-water` `rooftop` `suya` `tarkwa`

They exist so the layout can be reviewed with real photographic weight rather
than grey boxes. They are the right subjects, aspect ratios and tonal range for
the slots they fill.

## None of them may ship

They are generated images of Nigerian places and people that do not exist.
Publishing them as if they depict the actual venues, hosts and experiences on
the platform would misrepresent what a buyer is paying for.

Every one has to be replaced before launch with:

- **Host-supplied photography** of the actual venue and experience, which is
  also the right answer commercially — a host's own photographs convert better
  than stock and the platform already has a verification relationship in which
  to collect them; or
- **Licensed stock**, with the licence recorded; or
- **Commissioned photography**.

## The live site's own images

The production page carries 18 images served from `naijago.netlify.app`.
Those, not these, are the real ones. When you drop the site's asset folder into
`assets/img/` under the same filenames, the prototype picks them up with no
code change — every reference goes through `NG.img()` in `js/util.js`.

## Requirements for replacements

| Slot | Ratio | Notes |
|---|---|---|
| Hero | wide, ~16:9 | Sits behind a left-to-right scrim; keep the subject right of centre. |
| Season card | portrait, ~3:4 | Bottom third is covered by a `rgba(10,10,9,.9)` gradient carrying the title. |
| Experience card | 4:3 | A corner tag sits top-left and a badge bottom-left. Keep both corners quiet. |
| Guide featured | ~4:5 | Same bottom scrim as the season card. |
| Field-kit tile | ~1:1 | A full-width caption bar sits along the bottom edge. |
| Detail hero | wide | Title and meta sit bottom-left over a heavy scrim. |

Every image that carries text has a gradient overlay reaching
`rgba(10,10,9,.9)` at the text end. That scrim is what makes the white type
legible, and it is why the contrast audit skips these containers — they are
verified against the scrim spec instead of the formula. If you change an
image's tone, do not weaken the scrim to compensate.

Ship AVIF or WebP with a JPEG fallback, and give every one an `alt` that
describes the experience rather than the composition.
