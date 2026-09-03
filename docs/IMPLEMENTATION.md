# NaijaGo — implementation notes

For the team turning this prototype into a real build.

---

## 1. What this prototype is not

It is deliberately framework-free vanilla JavaScript with a hash router. That
is not a recommendation for production — it is so the prototype opens in any
browser with no build step and no install, and so the design is legible without
reading a component library.

**Take the CSS and the behaviour. Replace the JavaScript.** The stylesheets are
production-shaped: tokens, then primitives, then components, then a responsive
layer loaded last. They port to any stack unchanged.

---

## 2. Suggested stack

Nothing here demands a particular framework. What it does demand:

- **Server-rendered discovery.** The homepage, explore, experience detail,
  season guides and host profiles are the SEO surface and the first paint on a
  slow Lagos connection. Render them on the server.
- **Client state for the booking flow only.** Hold timer, cart, checkout, pass.
- **A service worker for the pass.** This is not optional. "98.4% first-try
  scans" is a published promise and it depends on the pass being cached before
  the user reaches the venue. Cache it at issue time, not at open time.

Start implementation from [ARCHITECTURE.md](ARCHITECTURE.md). It is the single
route-and-service map for discovery, booking, accounts, partner operations and
advertising.

### Advertising transaction boundary

An advertiser uploads creative first. Store the original privately, validate
MIME, file size and pixel dimensions on the server, then generate placement
crops. Platform-owner approval must precede payment. A signed payment webhook
creates the ledger entry and moves the campaign from `approved` to `scheduled`;
the browser confirmation page must not do that. Serving, clicks, budget pacing
and invoices share one immutable campaign id and audit trail.

---

## 3. What has to be real on the server

The prototype fakes these. None of them can be client-side.

| Concern | Why it must be server-side |
|---|---|
| **Seat holds** | The 10-minute hold is inventory. It needs a row with a TTL, and the release has to be atomic — two people clicking the last two seats at once must not both succeed. |
| **Price and fee calculation** | Never trust a total that arrived from a browser. Recompute face + 5% server-side and compare before charging. |
| **Payment** | Card entry goes in the processor's hosted field. Your own form never touches a PAN. Verify the webhook signature; do not trust a redirect. |
| **Idempotency** | Every payment attempt carries an idempotency key. The timeout state exists precisely because the answer is unknown — a retry must not become a second charge. |
| **Pass issuance and scanning** | The pass signature is minted server-side. The scan is a server write that flips the pass to used. A pass admits once. |
| **Waitlist ordering and the claim window** | A queue with a two-hour TTL per offer. When it lapses, the offer moves to the next person and the holder goes to the back. |
| **Payouts** | Held 48 hours after the gate closes. Commission is calculated on gross, and refunds are itemised against the payout rather than folded into it. |
| **Host verification** | Identity, payout and quality checks. A human reviews them. |

---

## 4. Offline pass — the part most likely to go wrong

The promise is that the pass scans in a crowded venue with no signal.

- Cache the pass payload and its rendering assets at **issue** time.
- The gate app holds a cached guest list for its own door, downloaded before
  doors open. It must resolve a scan locally and reconcile later.
- Reconciliation has to handle the case where the same pass was scanned at two
  doors while both were offline. Decide the tie-break rule now, not after the
  first festival.
- The pass code should encode a signed reference, not a bare booking id, so a
  screenshot of someone else's pass fails a signature check rather than merely
  a duplicate check.

---

## 5. Money, precisely

```
buyer_total   = face + round(face * 0.05)
host_payout   = face - round(face * 0.08)
points        = round(buyer_total * 0.01)     // pending until scanned in
```

Store amounts in **kobo as integers**. Never floats. Round once, at the point
of charge, and store the rounded figure — do not recompute a displayed total
from a stored face value at render time, or the receipt and the charge will
eventually disagree by ₦1.

The 5% and the 8% are separate ledger entries. Do not create a single
"platform fee" column; you will lose the ability to answer a host's question
about their own statement.

---

## 6. Accessibility, carried forward

These are load-bearing, not polish.

- **Focus** is `2px solid var(--gold-500)` at `outline-offset: 3px` on every
  interactive element, on every surface. Do not remove outlines.
- **Touch targets** get a 44px floor under `(pointer: coarse)`. In this
  codebase that block is the last thing in `responsive.css` so it wins the
  cascade. In yours, make sure nothing — especially an inline height — competes
  with it.
- **Meta text** uses `--n-600`, never `--n-500`. See DESIGN-SYSTEM.md §8.
- **Dialogs** trap focus, close on Escape, and return focus to the trigger.
- **The toast** is `role="status"` `aria-live="polite"`. Never put anything in
  it that the user must act on.
- **`prefers-reduced-motion`** stops the ticker and the pulse. Both are
  decorative and both are motion a vestibular-sensitive user should not have to
  sit through.
- Run the contrast audit in CI. `js/audit.js` is 90 lines and returns an array;
  fail the build when it is non-empty.

---

## 7. Copy rules

The wording in this prototype was reviewed line by line. Some of it is load
bearing and should not be rewritten without a reason:

- The **timeout** message says we do not know whether the money left. It
  prevents double payment. Do not make it more confident.
- The gate says **"one scan, then it stops working"**, not "cannot be
  photographed twice". The second is an absolute the product cannot enforce.
- Refund ETAs quote the rail's real speed, not an aspiration.
- The clash message names the actual obstacle: *"That is a boat and a bridge in
  sixty minutes."* Specific beats polite.

---

## 8. Content and images

The twelve photographs in `assets/img/` are AI-generated stand-ins for layout
and review. **None of them may ship.** See IMAGES.md.

The eight experiences, three seasons and three hosts in `data.js` are the real
ones from the live site. The guide bodies are not — those come from the CMS.

---

## 9. Testing

`test/e2e.mjs` is a working harness, not a formality. It serves the folder,
drives a real browser, and asserts on rendered output. Port the assertions
that matter:

- the money arithmetic on every screen it appears
- the auth wall replaying intent
- the waitlist lapse going to the back of the queue
- zero contrast failures
- no horizontal overflow at four widths
- no interactive element under 44px on mobile

The arithmetic assertions in particular have already caught real errors —
an inverted inventory count, a payout that was not divisible by 0.92, and a
chart whose bars did not sum to the figure printed above them.
