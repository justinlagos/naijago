# NaijaGo: the unified calendar

Version 2.0 · 4 September 2026
Reconciled against the deployed build at `naijago.netlify.app` (v1.4.1).
Source: `js/view-calendar.js`.

---

## 1. What it is

One calendar for the whole platform, at `#/calendar`. It replaced the
three-view season switcher, because two places to look up a date is one too
many. A season is now an editorial framing that points at this page; dates
live here and nowhere else.

The page states its own job in the header: **one calendar, every way to go
out.** Then: **see the month, shape your Lagos.**

---

## 2. Structure

Three parts.

**Filter rail, "Shape your guide".** Three controls:

| Control | Options |
|---|---|
| What kind of day? | Everything, then the vibes |
| City | All Lagos |
| Listing type | Events + experiences · Free entry · Ticketed |

Listing type is derived at render time from price and category. There is no
`listing` field on the data model, and there is no separate class of
guide-only listing in the deployed build.

**Month panel, "Browse by date".** A month grid with navigation across three
months: August, September and October 2026, held in `MONTHS` at the top of
the view. Days carry a count; days with nothing show that they have nothing.

**Selected date.** The chosen day expanded below the grid, with a row per
listing. The empty state reads "No listed experience on this day", and the
page offers "Browse all" and "See every experience →" as the way out.

---

## 3. Sponsorship

The calendar carries one advertising unit, `NG.adSlot('calendar')`, below the
planning grid. 728 × 90 desktop, 320 × 100 mobile, ₦380,000 on the rate card.
It is the only unit on the page. See `ADVERTISING.md`.

Planning intent is the reason this slot prices where it does. Someone reading
a month grid has not chosen a night yet, which is exactly when a hotel or an
airline wants to reach them.

---

## 4. Behaviour worth preserving

- **Filters repaint the grid, not just the list.** Narrowing to one vibe
  changes which days are marked. That is the entire reason to have a calendar
  rather than a list, and it is the thing most likely to get lost in a
  refactor.
- **The range is bounded.** Three months, and the navigation stops at each
  end rather than paging into empty years.
- **An empty day is a legible state**, not a broken one.

---

## 5. Extensions worth making

- **Deep-link a specific day.** State is held in the view, so a selected date
  cannot be shared or bookmarked today. Small change, real gain.
- **More months.** Detty December runs 1 December to 4 January and is the
  flagship season. The calendar currently stops at October.
- **More cities.** The city filter offers Lagos only, while the platform
  publishes Lagos, Abuja and Port Harcourt on the ticker and in the finder.
- **Guide-only listings.** The calendar shows what NaijaGo sells. Nigerian
  seasons contain events NaijaGo does not sell, and a calendar that omits
  Calabar Carnival or Eyo is less useful than one that carries them and links
  out to the organiser. This was prototyped separately and is not in the
  deployed build. It is a product decision, not an engineering one.
