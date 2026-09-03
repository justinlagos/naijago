/* ==========================================================================
   NaijaGo — partner console: dashboard, listings, listing editor, payouts,
   refunds, door scanner.
   ========================================================================== */
(function (NG) {
  'use strict';
  var esc = NG.esc, money = NG.money, img = NG.img;
  NG.views = NG.views || {};

  var PTABS = [
    ['#/partner', 'Dashboard', 'trending'],
    ['#/partner/listings', 'Listings', 'calendar'],
    ['#/partner/payouts', 'Payouts', 'ticket'],
    ['#/partner/refunds', 'Refunds', 'guide'],
    ['#/partner/scanner', 'Door scanner', 'nearby']
  ];

  function shell(route, inner) {
    var side = '<nav class="side-nav" aria-label="Partner console">' + PTABS.map(function (t) {
      return '<a href="' + t[0] + '"' + (route === t[0] ? ' aria-current="page"' : '') + '><span class="side-label">' + NG.icon(t[2]) + esc(t[1]) + '</span></a>';
    }).join('') + '</nav>';
    return '<div class="page"><div class="wrap"><div class="account-grid">' + side + '<div>' + inner + '</div></div></div></div>';
  }

  /* ---- Dashboard -------------------------------------------------------- */
  NG.views.partner = function () {
    var c = NG.HOST_CONSOLE, h = NG.HOSTS[c.host];
    var max = Math.max.apply(null, c.weeks.map(function (w) { return w.sold; }));
    var pct = Math.round(c.sold / c.capacity * 100);

    return shell('#/partner',
      '<div class="page-head"><span class="crumb">Partner console</span>' +
      '<h1 style="font-size:38px">' + esc(h.name) + '</h1>' +
      '<p>' + esc(h.meta) + ' · verified since ' + h.since + '</p></div>' +

      '<dl class="kpi-grid">' +
        '<div class="kpi"><span class="kpi-icon">' + NG.icon('trending') + '</span><dt>Sold</dt><dd>' + c.sold + '</dd><span class="delta up">' + pct + '% of ' + c.capacity + '</span></div>' +
        '<div class="kpi"><span class="kpi-icon">' + NG.icon('ticket') + '</span><dt>Left</dt><dd>' + c.left + '</dd><span class="delta">' + esc(c.listing) + '</span></div>' +
        '<div class="kpi"><span class="kpi-icon">' + NG.icon('food') + '</span><dt>Gross</dt><dd style="font-size:24px">' + money(c.gross) + '</dd><span class="delta">before commission</span></div>' +
        '<div class="kpi"><span class="kpi-icon">' + NG.icon('safety') + '</span><dt>Your payout</dt><dd style="font-size:24px">' + money(c.payout) + '</dd><span class="delta up">92% after 8% commission</span></div>' +
      '</dl>' +

      '<div class="card card-pad" style="margin-bottom:22px">' +
        '<h2 style="font-size:20px;margin-bottom:4px">Sales by week</h2>' +
        '<p class="meta" style="margin-bottom:8px">Six weeks since the listing went live. The bars total ' + c.sold + ', which is the sold figure above.</p>' +
        '<div class="bars">' +
          c.weeks.map(function (w) {
            return '<div class="col"><i style="height:' + Math.round(w.sold / max * 100) + '%"></i></div>';
          }).join('') +
        '</div><div class="bars-labels">' +
          c.weeks.map(function (w) { return '<span>' + esc(w.label) + ' · ' + w.sold + '</span>'; }).join('') +
        '</div>' +
      '</div>' +

      '<div class="notice"><h4>Where your money goes</h4>' +
      '<p>Guests pay a 5% service fee on top of face value. You pay 8% commission out of face value and keep 92%. ' +
      money(c.gross) + ' gross − ' + money(c.commission) + ' commission = ' + money(c.payout) + '.</p></div>'
    );
  };

  /* ---- Listings --------------------------------------------------------- */
  NG.views.partnerListings = function () {
    var c = NG.HOST_CONSOLE;
    var badge = { live: 'tag-ok', draft: 'tag-quiet', review: 'tag-warn' };
    var label = { live: 'Live', draft: 'Draft', review: 'In review' };

    return shell('#/partner/listings',
      '<div class="page-head"><h1 style="font-size:38px">Listings</h1>' +
      '<p>A listing goes draft → in review → live. It cannot sell while it is in either of the first two.</p></div>' +
      '<table class="data"><thead><tr>' +
        '<th>Experience</th><th>Date</th><th>Status</th><th class="num">Sold</th><th class="num">Gross</th>' +
      '</tr></thead><tbody>' +
        (NG.state.listingStatus !== 'draft' ? '<tr><td><a href="#/partner/listing">Your new experience</a></td><td>To be confirmed</td><td><span class="tag tag-warn">In review</span></td><td class="num">—</td><td class="num">—</td></tr>' : '') +
        c.listings.map(function (l) {
          return '<tr><td><a href="#/partner/listing">' + esc(l.name) + '</a></td>' +
            '<td>' + esc(l.date) + '</td>' +
            '<td><span class="tag ' + badge[l.status] + '">' + label[l.status] + '</span></td>' +
            '<td class="num">' + (l.status === 'live' ? l.sold + ' / ' + l.cap : '—') + '</td>' +
            '<td class="num">' + (l.gross ? money(l.gross) : '—') + '</td></tr>';
        }).join('') +
      '</tbody></table>' +
      '<a class="btn btn-primary" href="#/partner/listing" style="margin-top:20px">Create a listing</a>'
    );
  };

  /* ---- Listing editor --------------------------------------------------- */
  NG.views.partnerListing = function () {
    return shell('#/partner/listings',
      '<div class="page-head"><span class="crumb"><a href="#/partner/listings">Listings</a> · New</span>' +
      '<h1 style="font-size:34px">Create a listing</h1>' +
      '<p>Build the useful version once, then check exactly how it will appear before owner review.</p></div>' +
      '<div class="listing-builder"><form class="card card-pad" id="listing-form">' +
        '<div class="form-section-head"><span>01</span><div><h2>Event details</h2><p>Write for someone deciding whether to leave home.</p></div></div>' +
        '<label class="field"><span>Title</span><input id="listing-title" name="title" type="text" required placeholder="Lekki Moonlight Beach Rave"></label>' +
        '<div class="grid-2">' +
          '<label class="field"><span>Date</span><input id="listing-date" name="date" type="date" required></label>' +
          '<label class="field"><span>Doors</span><input name="time" type="time" required></label>' +
        '</div>' +
        '<label class="field"><span>Venue</span><input id="listing-venue" name="venue" type="text" required placeholder="Where guests actually arrive"></label>' +
        '<label class="field"><span>Vibe</span><select>' + NG.VIBES.map(function (v) { return '<option>' + esc(v.name) + '</option>'; }).join('') + '</select></label>' +
        '<label class="field"><span>What happens</span><textarea placeholder="The useful version. Timings, what to wear, how long the journey really takes."></textarea></label>' +
        '<div class="form-section-head"><span>02</span><div><h2>Event flyer</h2><p>Use one strong image with breathing room around important text.</p></div></div>' +
        '<label class="upload-zone" for="event-flyer-input"><span>' + NG.icon('guide') + '</span><strong>Drop a flyer here or choose a file</strong><small>JPG or PNG · 1600 × 1200 px recommended · 1200 × 900 px minimum · 4:3 · max 10 MB</small><input class="sr" id="event-flyer-input" type="file" accept=".jpg,.jpeg,.png,image/jpeg,image/png"><em id="flyer-status">Keep logos and dates inside the central safe area.</em></label>' +
        '<div class="form-section-head"><span>03</span><div><h2>Tickets</h2><p>The customer total and your payout remain visible before submission.</p></div></div>' +
        '<div class="grid-2">' +
          '<label class="field"><span>Tier name</span><input type="text" value="General entry"></label>' +
          '<label class="field"><span>Price (₦)</span><input type="number" value="15000" inputmode="numeric"></label>' +
        '</div>' +
        '<label class="field"><span>Capacity</span><input type="number" value="208" inputmode="numeric"></label>' +
        '<div class="notice notice-warn"><h4>What the guest will pay</h4>' +
        '<p>At ₦15,000 face value the guest pays ₦15,750 including the 5% service fee. You receive ₦13,800 per ticket after 8% commission.</p></div>' +
        '<div class="row listing-actions"><button class="btn btn-primary" type="submit">Submit for review</button>' +
        '<button class="btn btn-quiet" type="button" data-listing-draft>Save as draft</button></div>' +
      '</form><aside class="listing-preview-shell"><span class="eyebrow">Live guest preview</span><article class="listing-preview" id="listing-preview"><div class="listing-preview-art" id="listing-preview-art" style="background-image:url(' + (NG.state.listingFlyerUrl || img('beach-rave.jpg')) + ')"><span class="tag tag-gold">New listing</span></div><div class="listing-preview-copy"><p id="listing-preview-date">Choose a date</p><h3 id="listing-preview-title">Your event title</h3><span id="listing-preview-venue">Venue appears here</span><div><span>From ₦15,000</span><b>Preview →</b></div></div></article><p class="preview-note">This is the card guests see in Explore. The image crops responsively, so keep essential copy away from the outer 10%.</p></aside></div>'
    );
  };

  /* ---- Payouts ---------------------------------------------------------- */
  NG.views.partnerPayouts = function () {
    var c = NG.HOST_CONSOLE;
    var rows = [
      ['Lekki Moonlight Beach Rave', 'Sat 5 Sep', c.gross, c.commission, c.payout, 'Pending'],
      ['Suya & Jazz Night', 'Wed 26 Aug', 1116000, 89280, 1026720, 'Paid'],
      ['Tarkwa Bay Escape', 'Sat 25 Jul', 828000, 66240, 761760, 'Paid']
    ];
    return shell('#/partner/payouts',
      '<div class="page-head"><h1 style="font-size:38px">Payouts</h1>' +
      '<p>Released ' + NG.PAYOUT_HRS + ' hours after the gate closes, so refunds and no-shows settle first.</p></div>' +
      '<div class="notice notice-warn" style="margin-bottom:20px"><h4>' + money(c.payout) + ' due ' + esc(c.payoutDue) + '</h4>' +
      '<p>' + esc(c.payoutNote) + ' The Saturday event settles on the following Monday.</p></div>' +
      '<table class="data"><thead><tr>' +
        '<th>Experience</th><th>Date</th><th class="num">Gross</th><th class="num">Commission (8%)</th><th class="num">Payout</th><th>Status</th>' +
      '</tr></thead><tbody>' +
        rows.map(function (r) {
          return '<tr><td>' + esc(r[0]) + '</td><td>' + esc(r[1]) + '</td>' +
            '<td class="num">' + money(r[2]) + '</td><td class="num">−' + money(r[3]) + '</td>' +
            '<td class="num"><strong>' + money(r[4]) + '</strong></td>' +
            '<td><span class="tag ' + (r[5] === 'Paid' ? 'tag-ok' : 'tag-warn') + '">' + esc(r[5]) + '</span></td></tr>';
        }).join('') +
      '</tbody></table>' +
      '<p class="meta" style="margin-top:14px">Every payout row is exactly 92% of its gross. If a row is not, it has a refund against it and the refund is itemised separately.</p>'
    );
  };

  /* ---- Refunds ---------------------------------------------------------- */
  NG.views.partnerRefunds = function () {
    return shell('#/partner/refunds',
      '<div class="page-head"><h1 style="font-size:38px">Refunds</h1>' +
      '<p>Refunds come out of your payout, not out of the platform fee. The guest’s 5% service fee is returned by NaijaGo.</p></div>' +
      '<table class="data"><thead><tr><th>Reference</th><th>Experience</th><th class="num">Amount</th><th>Reason</th><th>Status</th></tr></thead><tbody>' +
        '<tr><td>NG-8791-LOS</td><td>Suya &amp; Jazz Night</td><td class="num">' + money(18000) + '</td><td>Guest cancelled inside the window</td><td><span class="tag tag-ok">Refunded</span></td></tr>' +
        '<tr><td>NG-8804-LOS</td><td>Tarkwa Bay Escape</td><td class="num">' + money(24000) + '</td><td>Boat cancelled — weather</td><td><span class="tag tag-warn">Processing</span></td></tr>' +
        '<tr><td>NG-8812-LOS</td><td>Suya &amp; Jazz Night</td><td class="num">' + money(18000) + '</td><td>Requested outside the window</td><td><span class="tag tag-stop">Declined</span></td></tr>' +
      '</tbody></table>' +
      '<div class="notice" style="margin-top:20px"><h4>How long a refund takes</h4>' +
      '<p>Card refunds return in 5–10 working days, set by the card scheme rather than by us. Bank transfers return within 2 working days. We do not quote a faster figure than the rail can deliver.</p></div>'
    );
  };

  /* ---- Door scanner ----------------------------------------------------- */
  NG.views.scanner = function () {
    var log = NG.state.scans.length ? NG.state.scans : [
      { ref: 'NG-8842-LOS', at: '19:42', ok: true },
      { ref: 'NG-8836-LOS', at: '19:41', ok: true },
      { ref: 'NG-8842-LOS', at: '19:44', ok: false }
    ];
    return shell('#/partner/scanner',
      '<div class="page-head"><h1 style="font-size:38px">Door scanner</h1>' +
      '<p>Works from a cached guest list. It does not need signal at the gate.</p></div>' +
      '<div class="scanner">' +
        '<div class="scanner-window"><span>Point at the guest’s pass</span></div>' +
        '<div class="grid-2">' +
          '<button class="btn btn-primary" type="button" data-go="#/gate/ok/NG-8842-LOS">Simulate: valid pass</button>' +
          '<button class="btn" type="button" data-go="#/gate/no/NG-8842-LOS">Simulate: already scanned</button>' +
        '</div>' +
        '<h3 style="font-size:15px;margin-top:24px;color:#fff">Recent scans</h3>' +
        '<ul class="scan-log">' + log.map(function (s) {
          return '<li><b>' + esc(s.ref) + '</b><span style="color:' + (s.ok ? 'var(--gold-on-ink)' : '#F0A99A') + '">' +
            esc(s.at) + ' · ' + (s.ok ? 'admitted' : 'rejected') + '</span></li>';
        }).join('') + '</ul>' +
      '</div>' +
      '<div class="notice" style="max-width:520px;margin:20px auto 0"><h4>One scan, then it stops working</h4>' +
      '<p>A pass admits once. A second attempt on the same reference is rejected at the door, which is what the third row above is.</p></div>'
    );
  };
})(window.NG = window.NG || {});
