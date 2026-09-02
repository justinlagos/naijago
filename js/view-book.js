/* ==========================================================================
   NaijaGo — booking: experience detail, auth wall, checkout, payment rails,
   failure states, confirmation.
   ========================================================================== */
(function (NG) {
  'use strict';
  var esc = NG.esc, img = NG.img, money = NG.money;
  NG.views = NG.views || {};

  /* ---- Experience detail ----------------------------------------------- */
  NG.views.experience = function (id) {
    var e = NG.byId(id);
    if (!e) return NG.views.notfound();
    var h = NG.HOSTS[e.host];
    var saved = !!NG.state.saved[e.id];

    if (!NG.state.cart || NG.state.cart.id !== e.id) {
      var first = null;
      for (var i = 0; i < e.tiers.length; i++) if (e.tiers[i].left > 0) { first = e.tiers[i]; break; }
      NG.state.cart = { id: e.id, tier: (first || e.tiers[0]).id, qty: 1 };
    }
    var t = NG.cartTotals();
    var soldOut = e.tiers.every(function (x) { return x.left === 0; });

    var tiers = e.tiers.map(function (tr) {
      var out = tr.left === 0;
      return '<label class="tier" data-selected="' + (NG.state.cart.tier === tr.id) + '" data-soldout="' + out + '">' +
        '<input type="radio" name="tier" value="' + tr.id + '"' + (NG.state.cart.tier === tr.id ? ' checked' : '') + (out ? ' disabled' : '') + '>' +
        '<span><strong>' + esc(tr.name) + '</strong><span class="meta">' + esc(tr.note) + ' · ' +
          (out ? 'Sold out' : tr.left + ' left') + '</span></span>' +
        '<span class="price">' + money(tr.price) + '</span>' +
      '</label>';
    }).join('');

    var box = soldOut
      ? '<div class="booking-box">' +
          '<span class="tag tag-stop">Sold out</span>' +
          '<h2 style="font-size:22px;margin:14px 0 10px">Every tier has gone</h2>' +
          '<p class="meta" style="margin-bottom:18px">' + e.waitlist + ' people are on the waitlist. When a place opens, the person at the front gets two hours to claim it.</p>' +
          '<a class="btn btn-ink btn-block btn-lg" href="#/waitlist/' + e.id + '">Join the waitlist</a>' +
        '</div>'
      : '<div class="booking-box">' +
          '<p class="eyebrow">Choose a tier</p>' + tiers +
          '<div style="margin-top:20px"><p class="eyebrow">How many</p>' +
            '<div class="qty">' +
              '<button type="button" data-qty="-1" aria-label="One fewer">−</button>' +
              '<output id="qty-out" class="num" aria-live="polite">' + NG.state.cart.qty + '</output>' +
              '<button type="button" data-qty="1" aria-label="One more">+</button>' +
            '</div></div>' +
          '<div class="totals">' +
            '<div class="row-between"><span>' + t.qty + ' × ' + esc(t.tier.name) + '</span><span class="num">' + money(t.face) + '</span></div>' +
            '<div class="row-between"><span>Service fee (5%)</span><span class="num">' + money(t.fee) + '</span></div>' +
            '<div class="row-between grand"><span>Total</span><span class="num">' + money(t.total) + '</span></div>' +
          '</div>' +
          '<a class="btn btn-primary btn-block btn-lg" href="#/checkout" style="margin-top:18px">Get tickets <span aria-hidden="true">→</span></a>' +
          '<p class="field-hint" style="text-align:center">Seats are held for ten minutes once you start.</p>' +
        '</div>';

    return '' +
    '<section class="detail-hero" data-over-image style="background-image:url(' + img(e.img) + ')"><div class="wrap">' +
      '<span class="tag ' + (e.badge ? 'tag-gold' : 'tag-ink') + '">' + NG.vibeIcon(e.vibe) + esc(e.badge || e.vibeName) + '</span>' +
      '<h1>' + esc(e.title) + '</h1>' +
      '<p class="detail-meta">' + esc(e.when) + ' · ' + esc(e.venue) + '</p>' +
    '</div></section>' +

    '<div class="wrap"><div class="detail-grid">' +
      '<div class="detail-body">' +
        '<div class="row" style="margin-bottom:22px">' +
          '<button class="btn btn-quiet" type="button" data-save="' + e.id + '" aria-pressed="' + saved + '">' +
            (saved ? NG.icons.heartFull : NG.icons.heart) + (saved ? 'Saved' : 'Save') + '</button>' +
          '<span class="rating">★ <b>' + e.rating.toFixed(1) + '</b> · ' + e.going.toLocaleString('en-NG') + ' going</span>' +
        '</div>' +
        '<p style="font-size:18px">' + esc(e.long) + '</p>' +

        '<dl class="stat-strip">' +
          '<div><span class="stat-icon">' + NG.icon('calendar') + '</span><dt>Starts</dt><dd>' + esc(e.startsAt) + '</dd></div>' +
          '<div><span class="stat-icon">' + NG.icon('nearby') + '</span><dt>Last entry</dt><dd>' + esc(e.lastEntry) + '</dd></div>' +
          '<div><span class="stat-icon">' + NG.icon('ticket') + '</span><dt>From</dt><dd>' + money(e.price) + '</dd></div>' +
          '<div><span class="stat-icon">' + NG.icon('trending') + '</span><dt>Left</dt><dd>' + e.left + '</dd></div>' +
        '</dl>' +

        '<section><h2 class="icon-heading">' + NG.icon('calendar') + 'Plan the night</h2>' +
          e.timeline.map(function (r) {
            return '<div class="timeline-row"><time>' + esc(r[0]) + '</time><p>' + esc(r[1]) + '</p></div>';
          }).join('') +
        '</section>' +

        '<section><h2 class="icon-heading">' + NG.icon('nearby') + 'Good to know</h2><dl class="grid-3">' +
          e.facts.map(function (f) {
            return '<div class="fact"><dt>' + esc(f[0]) + '</dt><dd>' + esc(f[1]) + '</dd></div>';
          }).join('') +
        '</dl></section>' +

        '<section><h2 class="icon-heading">' + NG.icon('safety') + 'Your host</h2>' +
          '<a class="host-card" href="#/host/' + h.id + '" style="max-width:420px">' +
            '<span class="host-avatar" aria-hidden="true">' + esc(h.initials) + '</span>' +
            '<span class="host-brand-icon" aria-hidden="true">' + NG.icon('safety') + '</span>' +
            '<h3>' + esc(h.name) + '</h3><p class="host-meta">' + esc(h.meta) + '</p>' +
            '<p>' + esc(h.blurb) + '</p><span class="verified">✓ Verified · ★ ' + h.rating.toFixed(1) + '</span>' +
          '</a>' +
        '</section>' +

        '<section><h2 class="icon-heading">' + NG.icon('ticket') + 'Where the money goes</h2>' +
          '<p>You pay face value plus a 5% service fee. Separately, the host pays 8% commission and keeps 92%. Those two percentages are different numbers doing different jobs and are never combined.</p>' +
        '</section>' +
      '</div>' +
      box +
    '</div></div>';
  };

  /* ---- Auth wall ------------------------------------------------------- */
  NG.views.login = function () {
    var intent = NG.state.intent;
    var why = intent
      ? (intent.kind === 'save' ? 'Sign in to save ' + esc((NG.byId(intent.id) || {}).title || 'this experience') + '. You will come straight back to it.'
        : intent.kind === 'checkout' ? 'Sign in to hold your seats. Your selection is kept exactly as it is.'
        : 'Sign in to continue where you left off.')
      : 'Sign in to save experiences, keep your passes and plan a weekend.';

    return '<div class="page"><div class="wrap" style="max-width:440px">' +
      '<div class="page-head"><h1 style="font-size:38px">Sign in</h1><p>' + why + '</p></div>' +
      (intent ? '<div class="notice notice-ok" style="margin-bottom:22px"><h4>We kept your place</h4>' +
        '<p>Nothing you chose has been lost. Signing in returns you to it.</p></div>' : '') +
      '<form id="login-form">' +
        '<label class="field"><span>Email or phone</span>' +
          '<input type="text" name="who" value="adaeze@example.com" autocomplete="username" required></label>' +
        '<label class="field"><span>One-time code</span>' +
          '<input type="text" name="code" inputmode="numeric" placeholder="6 digits" autocomplete="one-time-code"></label>' +
        '<p class="field-hint">This is a design prototype. No code is sent and nothing is verified — press continue.</p>' +
        '<button class="btn btn-primary btn-block btn-lg" type="submit" style="margin-top:12px">Continue</button>' +
      '</form>' +
      '<p class="meta" style="margin-top:20px;text-align:center">New here? The same form creates your account.</p>' +
    '</div></div>';
  };

  /* ---- Checkout -------------------------------------------------------- */
  NG.views.checkout = function () {
    if (!NG.state.cart) { NG.go('#/explore'); return ''; }
    if (!NG.state.signedIn) {
      NG.state.intent = { kind: 'checkout', back: '#/checkout' };
      NG.go('#/login');
      return '';
    }
    var t = NG.cartTotals();
    if (!t) return NG.views.notfound();
    NG.startHold();

    var rails = NG.RAILS.map(function (r) {
      return '<button class="rail" type="button" data-rail="' + r.id + '" data-selected="' + (NG.state.rail === r.id) + '">' +
        '<input type="radio" name="rail" tabindex="-1"' + (NG.state.rail === r.id ? ' checked' : '') + ' aria-hidden="true">' +
        '<span><strong>' + esc(r.name) + '</strong><span class="meta">' + esc(r.sub) + '</span></span>' +
        '<span class="rail-logo">' + NG.icon(r.id === 'card' ? 'ticket' : r.id === 'transfer' ? 'trending' : 'nearby') + '<span>' + esc(r.logo) + '</span></span>' +
      '</button>';
    }).join('');

    var detail = '';
    if (NG.state.rail === 'transfer') {
      detail = '<div class="transfer-detail"><p class="eyebrow">Transfer these exact details</p><dl>' +
        '<dt>Bank</dt><dd>Providus</dd>' +
        '<dt>Account</dt><dd>91' + String(t.total).slice(0, 2) + '4477' + t.qty + '2</dd>' +
        '<dt>Name</dt><dd>NAIJAGO / ' + esc(NG.state.user.name.toUpperCase()) + '</dd>' +
        '<dt>Amount</dt><dd>' + money(t.total) + '</dd>' +
        '</dl><p class="field-hint">This account is generated for this booking and stops accepting money when your hold expires. Transfer the exact amount.</p>' +
        '<button class="copy-btn" type="button" data-copy style="margin-top:12px">Copy account number</button></div>';
    } else if (NG.state.rail === 'ussd') {
      detail = '<div class="transfer-detail"><p class="eyebrow">Dial from your registered phone</p><dl>' +
        '<dt>Code</dt><dd>*737*000*' + t.total + '#</dd>' +
        '<dt>Amount</dt><dd>' + money(t.total) + '</dd>' +
        '</dl><p class="field-hint">Dial from the phone number on your bank account. Confirmation reaches us within about a minute.</p></div>';
    } else {
      detail = '<div class="transfer-detail"><p class="eyebrow">Card details</p>' +
        '<p class="field-hint" style="margin:0">Card entry is deliberately not built in this prototype. Nothing here collects a real card number. Use the buttons below to walk any of the outcomes.</p></div>';
    }

    return '<div class="page"><div class="wrap">' +
      '<div class="page-head"><span class="crumb"><a href="#/experience/' + t.experience.id + '">' + esc(t.experience.title) + '</a> · Checkout</span>' +
      '<h1 style="font-size:40px">Checkout</h1></div>' +

      '<ol class="steps">' +
        '<li data-state="done">✓ Choose</li>' +
        '<li data-state="current">2 Pay</li>' +
        '<li data-state="todo">3 Pass</li>' +
      '</ol>' +

      '<div class="hold" id="hold" data-warn="false">' +
        '<span class="hold-clock" id="hold-clock">10:00</span>' +
        '<span class="hold-bar"><i id="hold-bar" style="width:100%"></i></span>' +
        '<span class="hold-note" id="hold-note">Your seats are held while this runs.</span>' +
      '</div>' +

      '<div class="checkout-grid">' +
        '<div>' +
          '<h2 style="font-size:22px;margin-bottom:14px">How do you want to pay?</h2>' +
          '<div class="rails">' + rails + '</div>' + detail +
          '<div class="stack" style="margin-top:26px">' +
            '<button class="btn btn-primary btn-block btn-lg" type="button" data-pay="ok">Pay ' + money(t.total) + '</button>' +
            '<div class="grid-2">' +
              '<button class="btn btn-quiet" type="button" data-pay="declined">Simulate: declined</button>' +
              '<button class="btn btn-quiet" type="button" data-pay="timeout">Simulate: bank timeout</button>' +
            '</div>' +
            '<button class="btn btn-quiet btn-block" type="button" data-pay="underpaid">Simulate: wrong amount transferred</button>' +
          '</div>' +
          '<p class="field-hint" style="margin-top:14px">Those three buttons exist so the dev team can see every failure screen without a backend.</p>' +
        '</div>' +

        '<aside class="booking-box">' +
          '<p class="eyebrow">Your order</p>' +
          '<h3 style="font-size:19px;margin-bottom:6px">' + esc(t.experience.title) + '</h3>' +
          '<p class="meta" style="margin-bottom:16px">' + esc(t.experience.when) + '</p>' +
          '<div class="summary-line"><span>' + t.qty + ' × ' + esc(t.tier.name) + '</span><span class="num">' + money(t.face) + '</span></div>' +
          '<div class="summary-line"><span>Service fee (5%)</span><span class="num">' + money(t.fee) + '</span></div>' +
          '<div class="summary-line grand" style="border-top:1px solid var(--n-200);margin-top:8px;padding-top:12px;font-size:19px;font-weight:750">' +
            '<span>Total</span><span class="num">' + money(t.total) + '</span></div>' +
          '<p class="field-hint">You earn ' + t.points + ' points on this booking. They stay pending until you scan in.</p>' +
        '</aside>' +
      '</div>' +
    '</div></div>';
  };

  /* ---- Payment failures ------------------------------------------------- */
  NG.views.failed = function (kind) {
    var t = NG.cartTotals();
    var copy = {
      declined: ['Your bank declined the payment',
        'Nothing has been taken. Your seats are still held for the rest of the timer. Try another rail, or the same card again — declines this early are usually a daily limit.',
        'stop'],
      timeout: ['The bank did not answer in time',
        'We do not know yet whether the money left your account. Do not pay twice. If it did leave, it lands within ten minutes and your pass is issued automatically; if it did not, nothing was taken.',
        'warn'],
      underpaid: ['The transfer was short',
        'We received less than the total. Nothing has been kept — the balance is on its way back to the account it came from. Transfer the exact amount to complete the booking.',
        'warn'],
      expired: ['Your hold ran out',
        'Ten minutes passed, so the seats went back on sale. Nothing was charged. If they are still available you can pick them up again from the start.',
        'stop']
    }[kind] || copy_default();
    function copy_default() { return ['Something went wrong', 'Nothing was charged.', 'stop']; }

    return '<div class="page"><div class="wrap" style="max-width:640px">' +
      '<div class="notice notice-' + copy[2] + '" style="padding:30px">' +
        '<h4 style="font-size:26px;margin-bottom:12px">' + esc(copy[0]) + '</h4>' +
        '<p style="font-size:15px">' + esc(copy[1]) + '</p>' +
      '</div>' +
      (t ? '<div class="card card-pad" style="margin-top:20px">' +
        '<div class="row-between"><span>' + esc(t.experience.title) + '</span><span class="num price">' + money(t.total) + '</span></div>' +
      '</div>' : '') +
      '<div class="stack" style="margin-top:22px">' +
        (kind === 'expired'
          ? '<a class="btn btn-primary btn-lg btn-block" href="#/experience/' + (t ? t.experience.id : 'beach-rave') + '">Start again</a>'
          : '<a class="btn btn-primary btn-lg btn-block" href="#/checkout">Back to payment</a>') +
        '<a class="btn btn-block" href="#/help">Read the refund and payment rules</a>' +
      '</div>' +
    '</div></div>';
  };

  /* ---- Confirmation ---------------------------------------------------- */
  NG.views.confirmed = function () {
    var b = NG.state.booking;
    if (!b) return NG.views.notfound();
    var e = NG.byId(b.experience);
    return '<div class="page"><div class="wrap" style="max-width:640px">' +
      '<ol class="steps"><li data-state="done">✓ Choose</li><li data-state="done">✓ Pay</li><li data-state="current">3 Pass</li></ol>' +
      '<div class="notice notice-ok" style="padding:30px;margin-bottom:22px">' +
        '<h4 style="font-size:30px;margin-bottom:10px">You are going.</h4>' +
        '<p style="font-size:15px">Your pass is cached on this device. It scans at the gate whether or not you have signal.</p>' +
      '</div>' +
      '<div class="card card-pad">' +
        '<h2 style="font-size:22px;margin-bottom:6px">' + esc(e.title) + '</h2>' +
        '<p class="meta" style="margin-bottom:18px">' + esc(e.when) + ' · ' + esc(e.venue) + '</p>' +
        '<div class="summary-line"><span>Reference</span><span class="num" style="font-weight:700">' + esc(b.ref) + '</span></div>' +
        '<div class="summary-line"><span>' + b.qty + ' × ' + esc(b.tierName) + '</span><span class="num">' + money(b.face) + '</span></div>' +
        '<div class="summary-line"><span>Service fee (5%)</span><span class="num">' + money(b.fee) + '</span></div>' +
        '<div class="summary-line"><span>Paid by</span><span>' + esc(b.railName) + '</span></div>' +
        '<div class="summary-line" style="border-top:1px solid var(--n-200);margin-top:8px;padding-top:12px;font-size:19px;font-weight:750">' +
          '<span>Total paid</span><span class="num">' + money(b.total) + '</span></div>' +
        '<p class="field-hint">' + b.points + ' points pending. They land when you scan in.</p>' +
      '</div>' +
      '<div class="stack" style="margin-top:22px">' +
        '<a class="btn btn-primary btn-lg btn-block" href="#/pass/' + esc(b.ref) + '">Open my pass</a>' +
        '<a class="btn btn-block" href="#/plan">Add it to my weekend plan</a>' +
      '</div>' +
    '</div></div>';
  };
})(window.NG = window.NG || {});
