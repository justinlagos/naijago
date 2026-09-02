# NaijaGo — Design System

Version 1.1 · 2 September 2026
Reconstructed from the production build at `naijago.netlify.app`, with the
accessibility corrections listed in §8.

---

## 1. Colour

### 1.1 Brand gold

Production names these `--gold-*`. Do not rename them to `--brass-*`.

| Token | Value | Use |
|---|---|---|
| `--gold-100` | `#F5E6C8` | Pale decorative brand ground. |
| `--gold-200` | `#E9CE95` | Dividers on gold grounds. |
| `--gold-300` | `#D9A44A` | Primary-button hover fill. |
| `--gold-400` | `#CC9130` | Reserved. |
| `--gold-500` | `#BF8422` | **The brand.** Ticker ground, CTA band, primary fill, focus ring, nav underline, footer titles, hero `<em>`. |
| `--gold-600` | `#845914` | Gold **text** on light grounds. 5.57:1 parchment, 6.14:1 white, 4.76:1 sand. |
| `--gold-700` | `#6F4D13` | Reserved. |
| `--gold-on-ink` | `#E3BC6C` | Gold-toned data and eyebrows on ink. 11.01:1 on ink-900. |

**`--gold-500` never carries small text on a light ground.** It is 2.9:1 on
parchment. When you need gold words on parchment or white, use `--gold-600`.

### 1.2 Ink

| Token | Value | Use |
|---|---|---|
| `--ink-900` | `#0A0A09` | Body text, dark sections, hero, footer, dock, pass. |
| `--ink-800` | `#16150F` | Image placeholder ground. |
| `--ink-700` | `#2A2A23` | Section-head rules, dark-button hover. |
| `--ink-600` | `#3D3D33` | Reserved. |

### 1.3 Parchment and neutrals

| Token | Value | Use |
|---|---|---|
| `--white` | `#FFFFFF` | Cards, inputs, dialogs. |
| `--parchment` | `#F4F4EF` | Page ground. |
| `--sand` | `#E7E2D8` | Field-kit band. |
| `--sand-deep` | `#D7D0C4` | Field-kit gallery gutter. |
| `--n-100 … --n-400` | `#EDECE5` … `#A8A79B` | Borders, rules, skeletons. |
| `--n-500` | `#9A9A90` | **2.57:1. Placeholders and decorative fills only. Never text.** |
| `--n-600` | `#646459` | **All meta text.** 5.42:1 parchment, 5.98:1 white, 4.64:1 sand. |
| `--n-700` | `#55554D` | Secondary body copy. 6.82:1 parchment. |
| `--footer-text` | `#C7C6BB` | Footer body on ink. 11.53:1. |

### 1.4 Semantic

| Token | Value | Pair |
|---|---|---|
| `--ok-bg` / `--ok-ink` | `#E6F5EF` / `#12604C` | Verified, settled, refunded. 6.66:1. |
| `--warn-bg` / `--warn-ink` | `#FDF0DC` / `#8A5304` | Hold running out, processing, lapsed. 5.63:1. |
| `--stop-bg` / `--stop-ink` | `#FCEBE8` / `#A32A16` | Declined, void, clash, sold out. 6.27:1. |

### 1.5 Vibe chips

White text on all six, minimum 9.4:1.

`--vibe-night #2B2A4A` · `--vibe-food #7A2E1B` · `--vibe-festival #6B2148` ·
`--vibe-culture #1F4A45` · `--vibe-outdoors #2F4A22` · `--vibe-stay #3C3357`

---

## 2. The colour rules that are easy to break

These three rules account for almost every colour defect found during review.

**Gold has exactly two roles.**
1. Urgency and primary action on any surface — the CTA band, primary button
   fill, the focus ring, `card-badge`, `season-tag`, the ticker ground.
2. Brand accent **on ink surfaces only** — the hero `<em>`, the eyebrow on a
   dark band, the active nav underline, the avatar monogram, footer titles.

Anything else in gold is a bug. Specifically: not on a plain day count, not on
a descriptive subtitle, not on a progress bar, not on a "pick one" chip, and
not on a verification tick.

**Teal is verified truth and settled state only.** It marks a fact that is
already true: verified host, refund completed, payment received. It is never an
"on" colour. **A toggle in the on position uses ink,** not teal.

**Links are not gold.** `a` is ink with a 3px-offset underline that thickens
on hover.

---

## 3. Type

Archivo across the board, with `"Helvetica Neue", Helvetica, Arial, sans-serif`
as the fallback stack.

| Role | Size | Weight | Tracking |
|---|---|---|---|
| Hero h1 | `clamp(56px, 6.3vw, 92px)` / `.94` | 750 | `-4.8px` |
| CTA h2 | `clamp(48px, 6vw, 78px)` | 750 | `-4px` |
| Field-kit h2 | `clamp(42px, 4.6vw, 66px)` | 750 | `-3px` |
| Section h2 | `clamp(34px, 4vw, 52px)` | 750 | `-2px` |
| Season card h3 | 34px | 750 | `-1.2px` |
| Event dialog h2 | 45px | 750 | `-2px` |
| Card h3 | 21px | 750 | `-.6px` |
| Body | 15px / 1.6 | 400 | — |
| Eyebrow | 11px | 600 | `1.9px`, uppercase |
| Field label | 10px | 600 | `2px`, uppercase |
| Nav link | 12px | 600 | `1.3px`, uppercase |
| Ticker item | 11px | 600 | `1.7px`, uppercase |
| Price | 20px | 750 | tabular-nums |
| Trust number | 58px | 750 | `-2.6px`, tabular-nums |

**Nothing carrying text drops below 10px.** Every number — price, count,
rating, clock, reference, payout — uses `font-variant-numeric: tabular-nums`
so figures do not shift as they change.

---

## 4. Geometry and elevation

The brand is **square-cornered**: `--radius: 0`. The only round things in the
system are avatars, the hero pulse and notification dots.

- `--gutter` 40px → 28px (≤1240) → 20px (≤760)
- `--max` 1320px · `--nav-h` 82px (68px ≤760) · `--ann-h` 34px
- `--shadow` `0 24px 60px rgba(10,10,9,.13)`
- `--shadow-sm` `0 4px 16px rgba(10,10,9,.08)`
- `--shadow-lg` `0 40px 90px rgba(10,10,9,.28)`
- `.section` 100px vertical · `.section-tight` 76px · `.cta` 90px

---

## 5. Components

| Component | Anchor spec |
|---|---|
| `.announcement` | 34px, gold ground, ink text, 30s linear ticker, track duplicated for a seamless loop, paused on hover. |
| `.site-header` | Sticky, `rgba(244,244,239,.94)` + `blur(18px)`, 82px nav, 54px logo. |
| `.nav-links a::after` | Gold 2px underline animating `right: 100% → 0` over 280ms. |
| `.finder` | `1fr 1fr 1.1fr auto`, `min(980px,100%)`, white, `--shadow`, 60px gold submit. |
| `.season-card` | 430px min, image at `z-index:-2`, gradient scrim at `-1`, gold tag, 24px gold arrow. |
| `.experience-card` | 4:3 media, corner vibe tag, gold badge bottom-left, 46px save button top-right, top-bordered foot with rating and price. Hover `translateY(-5px)`. |
| `.brand-icon` | Inline 24×24 geometric SVG. Primary paths inherit `currentColor`; `.icon-accent` uses `--gold-500`. |
| `.vibe` | Bordered cell on ink, white-and-gold brand icon, count in `--gold-on-ink`. |
| `.trust-grid` | `1.1fr 1fr 1fr`; lead cell solid gold with ink text. |
| `.guide-grid` | `1.25fr 1fr`; featured card spans two rows over an image. |
| `.field-kit` | Sand band, `.88fr 1.12fr`, gallery moves to `order:-1` under 1100. |
| `.host-strip` | `1.15fr repeat(3,1fr)`, 48px ink/gold avatar, teal verified chip. |
| `.hold` | Clock + bar + note; `data-warn="true"` at 3 minutes turns the whole strip amber. |
| `.pass` | Ink card, dashed head rule, white code panel, state stamp, coloured status bar per state. |
| `.toast` | Fixed bottom-centre, ink, gold uppercase label, slides on `transform`. |

### 5.1 Brand icon mapping

The icon source of truth is `BRAND_ICON_PATHS` in `js/components.js`. Use
`NG.icon(name)` for a named concept and `NG.vibeIcon(vibeId)` when the icon is
driven by experience data. Do not paste duplicate SVG markup into views.

| Product meaning | Icon name |
|---|---|
| Place or city | `location`, `map`, `nearby`, `waypoint` |
| Date or schedule | `calendar` |
| Entry or payment | `ticket` |
| Nightlife, food, festival, culture, outdoors, stay | `nightlife`, `food`, `music`, `culture`, `beach`, `stay` |
| Social or personal | `friends`, `saved` |
| Performance and trust | `trending`, `safety`, `guide` |
| Transport | `shuttle` |

The approved visual reference is `docs/brand-icon-reference.png`.

---

## 6. States

Every interactive element defines five: **rest, hover, focus, pressed/active,
disabled.**

- Focus is always `2px solid var(--gold-500)` at `outline-offset: 3px`, on every
  surface. It is the one place gold appears on a light ground at small size,
  and it passes as a non-text indicator at 3:1.
- Disabled is `opacity: .5` with `cursor: not-allowed` and no transform.
- Pressed state on chips and toggles is `aria-pressed="true"` → ink fill.
- `prefers-reduced-motion: reduce` collapses every animation and transition to
  ~0ms, including the ticker and the hero pulse.

---

## 7. Responsive

Two breakpoints, matching production.

**1100px** — nav links and "List an event" hidden, menu button and mobile dock
shown, experience grid → 2 columns, vibe grid → 3, trust and guide grids → 1,
field kit → 1 column with the gallery first, sidebars unstick, dialogs stack.

**760px** — nav 68px, logo 45px, hero h1 49px / `-2.5px`, finder → 2 columns
with a full-width submit, and the season and experience grids become horizontal
scroll-snap carousels at 84vw / 82vw.

**440px** — hero h1 40px, section h2 32px, CTA h2 40px.

**Touch targets.** Under `(pointer: coarse), (max-width: 760px)` every
interactive element gets a 44px floor. This block is the **last** thing in
`responsive.css` on purpose — it must beat every earlier rule, and inline
heights must not compete with it. Checkboxes and radios stay 18px and are hit
through their 44px label.

---

## 8. Accessibility corrections against production

Production ships `--neutral-500 #9A9A90` carrying meta text at **2.57:1** — the
date lines, counts and captions under every card. That is the one defect worth
fixing on the live site this week regardless of what happens to the rest.

This system adds `--n-600 #646459` (5.42:1) and moves every piece of meta text
onto it. `--n-500` survives for placeholders and decorative fills only.

`--gold-600` was also darkened from the production gold so that gold words on
the sand field-kit band clear 4.5:1.

**Verification.** `js/audit.js` sweeps the live DOM and scores every text node
against its **composited** background — it walks the ancestor chain and blends
translucent layers rather than reading `rgba(255,255,255,.14)` on ink as pure
white. The full test run sweeps 32 routes and currently reports **zero
failures**. Press `A` on any screen, or load with `?audit`, to run it yourself.

Text sitting over photography cannot be scored by the formula. Those containers
carry `data-over-image` and the audit skips them; they are verified instead
against the scrim specification — every image that carries text has a
`linear-gradient` overlay reaching `rgba(10,10,9,.9)` at the text end.
