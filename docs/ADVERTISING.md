# NaijaGo: advertising

Version 2.0 · 4 September 2026
Reconciled against the deployed build at `naijago.netlify.app` (v1.4.1).
The deployed site is the source of truth. Where this document and the code
disagree, this document is wrong.

---

## 1. What ships today

Two things, and they are separate.

**The placements.** Four formats, rendered by `NG.adSlot(format, variant)` in
`js/components.js`, plus `NG.nativeAdCard()` for the in-feed unit. Styles live
in `css/app.css` (37 selectors) and `css/home.css` (19). There is no
`css/ads.css` and no `js/ads.js`.

**The advertiser product.** `#/advertise`, in `js/view-advertise.js`. A
complete self-serve funnel: pick inventory, upload creative, wait for owner
review, pay, go live, then read reporting. This is the revenue product. The
placements are just where it lands.

---

## 2. The rate card

Held in `FORMATS` at the top of `js/view-advertise.js`.

| id | Name | Size | Placement | Rate |
|---|---|---|---|---|
| `leaderboard` | Editorial leaderboard | 970 × 250 / 320 × 100 | Homepage, between discovery chapters | ₦650,000 |
| `native` | Native discovery card | 1200 × 900 · 4:3 | Explore results, after three organic cards | ₦450,000 |
| `guide` | Guide story placement | 1080 × 1350 · 4:5 | Inside relevant editorial guides | ₦520,000 |
| `calendar` | Calendar sponsor | 728 × 90 / 320 × 100 | Below the monthly planning grid | ₦380,000 |

Four placements, one standard, which is the promise the page makes. Keep it to
four. The value of the inventory is that a buyer can understand all of it in
one screen.

---

## 3. Where each one renders

| Slot | Called from |
|---|---|
| `leaderboard` | `js/view-home.js` |
| `guide` | `js/view-discover.js` |
| `calendar` | `js/view-calendar.js` |
| `nativeAdCard()` | in-feed, explore results |

That is the complete set of call sites. Nothing renders on checkout, the
failure screens, the pass, the gate, the account area or the partner console.

---

## 4. Disclosure

Every unit is labelled, and the label carries the size:

```
<aside class="ad-slot ad-{format}" aria-label="Advertisement">
  <div class="ad-art">…</div>
  <div class="ad-copy">
    <span class="ad-label">Sponsored · 970 × 250 · mobile 320 × 100</span>
    <strong>{title}</strong><p>{copy}</p>
  </div>
  <a class="ad-cta" href="#/advertise">{cta} →</a>
</aside>
```

The native card is disclosed twice: a `Sponsored` category chip on the media,
and `Paid placement · 1200 × 900` where the date line would sit.

Keep this. An unlabelled native unit is deceptive advertising under ARCON's
code, and it undercuts the "fees shown upfront" promise the rest of the
product is sold on.

---

## 5. The funnel

Four steps, rendered by `steps(active)` in `js/view-advertise.js`:

**Creative → Owner review → Payment → Live**

Fields captured: campaign name, placement, creative headline, destination URL,
start date, end date, total budget in naira. Payment summarises campaign
budget, platform tax and total. Reporting lists campaigns with sponsored
placement, dates, budget and status.

The three principles the page states, and they should survive contact with
sales: **context first, human reviewed, clear reporting.**

---

## 6. The gap worth closing

There is no coded exclusion of advertising from the paid path. `NG.AD_FREE`
and `NG.AD_CAP` do not exist in the deployed build. Today the exclusion holds
by placement, because nothing calls `adSlot` from the booking or fulfilment
views. That is a convention, not a guarantee, and the first person who adds a
unit to the confirmation screen will not know they broke it.

Add the guard before the ad server goes in:

```js
NG.AD_FREE = [/^#\/checkout/, /^#\/failed/, /^#\/gate/, /^#\/login/, /^#\/partner/];
```

and have `adSlot` return an empty string on those routes. Enforce it server
side too when decisioning moves off the client. The client check is a second
line of defence, not the only one.

---

## 7. Still to decide

- Close controls on a unit, and for how long a dismissal lasts.
- Frequency capping across sessions. Needs a user-level store.
- Whether a paid native card can enter organic ranking. It must not. It sits
  at a fixed position, after three organic cards, and it is labelled.
- Category exclusions. Alcohol and betting are live categories in this market
  with real regulatory constraints.
- Whether "platform tax" on the payment step is VAT, and at what rate. The
  field exists; the number behind it does not.
- The demo creatives are invented. No real brand appears anywhere, which is
  deliberate. Replace at integration.
