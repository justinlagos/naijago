# NaijaGo — Product Specification

Version 1.0 · 2 September 2026
The behavioural source of truth for the prototype. Where this document and the
code disagree, this document is wrong and should be corrected.

---

## 1. What this prototype is

A complete frontend of NaijaGo: every screen, every state, every flow, wired
and clickable, with **no backend, no database, and no persistence of any kind**.
State lives in one in-memory object (`NG.state`) and resets on reload. There is
no `localStorage`, no cookie, and no network call other than the webfont.

It exists so a dev team can see exactly what to build before writing any
server code, and so design decisions can be reviewed against real interaction
rather than flat comps.

---

## 2. Fixture canon

Every public-facing figure below is taken from the live production site.
Figures marked **derived** are ones production does not expose; they are
internally consistent with the published ones and with each other.

### 2.1 Published

- **1,204** experiences · **338** verified hosts · **98.4%** first-try scans
- **184** experiences live in Lagos, which is exactly the sum of the six vibe
  counts: Nightlife 48 · Food & drink 39 · Festivals 22 · Culture 31 ·
  Outdoors 28 · Stay & wellness 16
- Seasons: **Detty December** (flagship, 1 Dec – 4 Jan, Lagos/Abuja/PH,
  96 experiences from ₦35,000) · **Heritage Season** (28 cultural experiences)
  · **New Yam Season** (32 experiences, August–October, South East)
- Hosts: **Eko Wave Collective** (★4.8) · **Naija Food Trails** (★4.9) ·
  **Terra Culture House** (★4.7)
- The eight experiences, their dates, prices, ratings and "going" counts are
  reproduced verbatim in `js/data.js`.

Reference date is **Wednesday 2 September 2026**. Every weekday label in the
data has been checked against the real 2026 calendar: Sat 5 Sep, Sat 12 Sep,
Sun 27 Sep, Sat 3 Oct, Sat 24 Oct and Mon 21 Dec are all correct.

### 2.2 Two fees, never conflated

This is the single most important rule in the product.

- The **buyer** pays a **5% service fee on top of** face value.
- The **host** pays **8% commission out of** face value and keeps **92%**.

They are different numbers doing different jobs. No screen, no tooltip and no
piece of copy may combine them into a single "platform fee" figure.

Worked example, used consistently across the prototype:

| | |
|---|---|
| 2 × General entry @ ₦15,000 | ₦30,000 |
| Service fee (5%) | ₦1,500 |
| **Buyer pays** | **₦31,500** |
| Points earned (1% of total paid) | 315, pending until scanned in |

And on the host side, for the same listing at full sale:

| | |
|---|---|
| Gross (214 sold) | ₦3,660,000 |
| Commission (8%) | −₦292,800 |
| **Host payout** | **₦3,367,200** |

Every payout row in the partner console is exactly 92% of its gross. If one is
not, it has a refund against it, and that refund is itemised separately.

### 2.3 Derived

- **Hold**: 10 minutes, amber warning at 3 minutes remaining.
- **Waitlist claim window**: 2 hours. A lapsed offer goes to the next person
  and the holder returns to the **back** of the queue, not the front.
- **Payouts**: released 48 hours after the gate closes. A Saturday event
  settles on the following Monday.
- **Points**: 1% of total paid, pending until the pass is scanned in.
- Reference booking `NG-8842-LOS`: 2 × General entry to the Beach Rave, paid by
  **bank transfer** on 28 August. That rail is the same on every screen the
  booking appears on.
- Host console: 208 General + 15 Cabana = 223 capacity, 214 sold, 9 left. The
  six weekly bars total 214, which is the sold figure.

---

## 3. Route map

| Route | Screen |
|---|---|
| `#/` | Homepage — nine sections |
| `#/explore` · `?vibe=` | Faceted browse: vibe, area, price; sort; applied-filter chips; empty state |
| `#/seasons` | Season index |
| `#/season/:id` · `?view=list\|calendar\|map` | Season guide, three views |
| `#/guides` · `#/guide/:id` | Guide index and article shell |
| `#/hosts` · `#/host/:id` | Vendor index and host profile |
| `#/experience/:id` | Detail: tiers, quantity, live totals, timeline, facts, host |
| `#/login` | Auth wall — preserves and replays intent |
| `#/checkout` | Hold timer, three rails, live order summary |
| `#/failed/declined\|timeout\|underpaid\|expired` | Four payment failure states |
| `#/confirmed` | Confirmation |
| `#/pass/:ref` | Pass — valid, pending, used, void; offline mode |
| `#/gate/ok\|no/:ref` | Gate staff view |
| `#/waitlist/:id` | Queue, join, two-hour claim, lapse |
| `#/transfer/:ref` · `#/reschedule/:ref` | Pass transfer and date change |
| `#/account` + `/bookings` `/passes` `/saved` `/plans` `/notifications` `/reviews` `/settings` | Account area |
| `#/plan` | Weekend plan with clash detection |
| `#/partner` + `/listings` `/listing` `/payouts` `/refunds` `/scanner` | Partner console |
| `#/help` | Help centre |
| anything else | Not-found |

---

## 4. Data model

```ts
type Vibe = 'night' | 'food' | 'festival' | 'culture' | 'outdoors' | 'stay';

interface Tier  { id: string; name: string; price: number; left: number; note: string }

interface Experience {
  id: string; title: string; blurb: string; long: string;
  vibe: Vibe; vibeName: string;
  when: string;              // display string, e.g. "SAT 5 SEP · LEKKI · 4.2 KM"
  dateISO: string; startsAt: string; lastEntry: string;
  area: string; city: string; venue: string;
  rating: number; going: number; price: number; badge: string; left: number;
  host: string; img: string;
  tiers: Tier[];
  timeline: [time: string, what: string][];
  facts:    [label: string, value: string][];
  waitlist: number;
}

interface Host {
  id: string; initials: string; name: string; meta: string;
  rating: number; verified: boolean; blurb: string;
  since: number; events: number; guests: string; responseHrs: number; img: string;
}

interface Booking {
  ref: string; experience: string; qty: number; tierName: string;
  face: number; fee: number; total: number; points: number; railName: string;
}

type PassState = 'valid' | 'pending' | 'used' | 'void';
```

Constants: `FEE 0.05` · `COMMISSION 0.08` · `POINTS 0.01` ·
`HOLD_SECS 600` · `WARN_SECS 180` · `CLAIM_MINS 120` · `PAYOUT_HRS 48`.

---

## 5. Flows

### 5.1 Save, with intent preserved
Tap the heart while signed out → the auth wall opens, says *"We kept your
place"*, and records `{kind:'save', id, back}`. Signing in performs the save
**and returns to the exact screen you left**. The same mechanism carries a
half-built checkout through the wall.

### 5.2 Book
Detail → choose tier (sold-out tiers are disabled, not hidden) → quantity,
capped at that tier's remaining count → totals recompute live → checkout.

### 5.3 Hold
Checkout starts a 10-minute hold. The clock, the bar and the note update every
second. At 3 minutes the strip turns amber and the note changes to *"Under
three minutes. After that the seats go back on sale."* At zero the user is sent
to `#/failed/expired`, which says nothing was charged and offers a restart.

Releasing a hold **raises** availability. If two seats are released from a
listing showing seven left, it shows nine. This was inverted in an early draft
and is the kind of error that survives review because it reads fluently.

### 5.4 Pay
Three rails. Card, bank transfer (a one-time account that stops accepting money
when the hold expires), and USSD.

**No card number, CVV, expiry or bank credential is collected anywhere in this
prototype, and none should be collected by a client-side form in production
either.** The card panel says so explicitly. Three buttons walk the failure
states without a backend.

### 5.5 Failure states

| State | What it says |
|---|---|
| Declined | Nothing taken, seats still held, try another rail. |
| Timeout | *We do not know yet whether the money left your account.* **Do not pay twice.** If it did leave, it lands within ten minutes and the pass issues automatically. |
| Underpaid | Less than the total arrived. Nothing kept; the balance is going back. |
| Expired | Ten minutes passed, seats back on sale, nothing charged. |

The timeout copy is the one that matters. An honest "we do not know yet" is
better than a confident wrong answer, and it prevents the double payment that
a vaguer message causes.

### 5.6 Pass
Four states with distinct treatments: **valid** (gold status bar), **pending**
(amber, payment still confirming), **used** (teal, stamped "Scanned"), **void**
(red, stamped "Void", after a transfer).

The pass is cached: an offline toggle shows the cached-pass bar and the pass
keeps working. The code is a deterministic **drawing**, not a scannable code,
and the screen says so — the gate views read the reference.

### 5.7 Gate
Two outcomes, sized for someone glancing at a phone in a crowd: full-bleed
teal *"Let them in"* or red *"Do not admit — this pass has already been
scanned. One scan, then it stops working."*

That phrasing is deliberate. An earlier draft claimed "tickets that cannot be
photographed twice", which is an absolute the product cannot enforce and which
its own scanner screen contradicted.

### 5.8 Waitlist
Join → position shown → a place opens → a two-hour countdown → claim (which
drops you into checkout) or lapse (which sends you to the **back** of the
queue and says so).

### 5.9 Plans
Two Saturday items 60 minutes apart in Ilashe and Ikoyi are flagged as a clash,
with the reason in plain words: *"That is a boat and a bridge in sixty minutes.
Pick one."*

---

## 6. State matrix

| Surface | States built |
|---|---|
| Experience card | default · saved · badge (N left / free entry / tonight / selling fast) · hover |
| Tier | selectable · selected · sold out (disabled) |
| Hold | running · warning (≤3 min) · expired |
| Payment | idle · rail selected · declined · timeout · underpaid · expired · confirmed |
| Pass | valid · pending · used · void · offline |
| Gate | admit · reject |
| Waitlist | not joined · joined · offered (counting) · lapsed |
| Explore | results · filtered · impossible combination (empty) |
| Saved list | populated · empty |
| Listing (host) | draft · in review · live |
| Payout | pending · paid |
| Refund | refunded · processing · declined |
| Toggle | on (ink) · off |

---

## 7. Vocabulary

Settled during review; used consistently everywhere.

**Hosts**, not vendors, partners or organisers — except the header nav link and
the section eyebrow, which say "Vendors" because production does.
**Experiences**, not events. **Passes**, not tickets. **Private planning**, not
custom requests.

---

## 8. Honesty constraints

Several claims were cut or narrowed during review because the product could not
actually deliver them. They are listed here so they do not creep back in.

- No claim that a pass "cannot be photographed twice". The enforceable claim is
  *one scan, then it stops working*.
- No "automatically" on the CAC verification step — a human reviews it.
- No invented byte weights ("Light mode · 14 KB").
- No refund ETA faster than the rail allows. Cards are 5–10 working days
  because the card scheme says so, not because we are slow.
- Anything that depends on a backend the prototype does not have is annotated
  as such rather than presented as working.

---

## 9. Build order for the dev team

1. Tokens, type scale and the six shared components (`base.css`, `site.css`).
2. Chrome: ticker, header, footer, dock, dialogs, toast.
3. Homepage — it exercises most of the component set.
4. Explore + faceting, then experience detail.
5. Auth wall with intent replay. Get this right before checkout; every later
   flow depends on it.
6. Checkout, hold timer, rails, and all four failure states together. The
   failure states are not a follow-up ticket.
7. Pass, offline caching, gate.
8. Account area, then waitlist and plans.
9. Partner console last — it has the fewest users and the most arithmetic.
