/* ==========================================================================
   NaijaGo — pass states, gate views, offline mode, waitlist.
   ========================================================================== */
(function (NG) {
  'use strict';
  var esc = NG.esc, money = NG.money;
  NG.views = NG.views || {};

  function booking(ref) {
    if (NG.state.booking && NG.state.booking.ref === ref) return NG.state.booking;
    var r = NG.REFERENCE_BOOKING, e = NG.byId(r.experience);
    return {
      ref: r.ref, experience: r.experience, qty: r.qty, tierName: 'General entry',
      face: r.face, fee: r.fee, total: r.total, points: r.points,
      railName: 'Bank transfer', title: e.title, when: e.when, venue: e.venue
    };
  }

  /* ---- Pass ------------------------------------------------------------- */
  NG.views.pass = function (ref) {
    var b = booking(ref);
    var e = NG.byId(b.experience);
    var st = NG.state.passState;
    var status = {
      valid:   'Valid · ready to scan',
      pending: 'Payment confirming · not yet valid',
      used:    'Scanned in at 19:42',
      void:    'Void · transferred to Kene I.'
    }[st];

    var stamp = (st === 'used') ? '<span class="pass-stamp">Scanned</span>'
              : (st === 'void') ? '<span class="pass-stamp">Void</span>' : '';

    return '<div class="page"><div class="wrap">' +
      (!NG.state.online ? '<div class="offline-bar" style="max-width:420px;margin:0 auto 14px">No connection · showing your cached pass</div>' : '') +

      '<div class="pass" data-state="' + st + '">' +
        '<div class="pass-head">' +
          '<span class="tag tag-gold">' + NG.vibeIcon(e.vibe) + esc(e.vibeName) + '</span>' +
          '<h2>' + esc(e.title) + '</h2>' +
          '<p class="meta">' + esc(e.when) + ' · ' + esc(e.venue) + '</p>' +
        '</div>' +
        '<div class="pass-code">' +
          NG.qrSVG(b.ref + st, 190) + stamp +
          '<p class="pass-ref">' + esc(b.ref) + '</p>' +
        '</div>' +
        '<dl class="pass-foot">' +
          '<div><dt>Admits</dt><dd>' + b.qty + ' · ' + esc(b.tierName) + '</dd></div>' +
          '<div><dt>Doors</dt><dd>' + esc(e.startsAt) + '</dd></div>' +
          '<div><dt>Last entry</dt><dd>' + esc(e.lastEntry) + '</dd></div>' +
          '<div><dt>Paid</dt><dd>' + money(b.total) + '</dd></div>' +
        '</dl>' +
        '<p class="pass-status">' + esc(status) + '</p>' +
      '</div>' +

      '<p class="meta" style="max-width:420px;margin:14px auto 0;text-align:center">' +
        'The code above is a drawing, not a scannable code. The gate screens in this prototype read the reference.</p>' +

      '<div class="pass-actions">' +
        '<div class="grid-2">' +
          '<button class="btn" type="button" data-go="#/gate/ok/' + esc(b.ref) + '">Scan me in</button>' +
          '<button class="btn" type="button" data-go="#/gate/no/' + esc(b.ref) + '">Scan again (rejected)</button>' +
        '</div>' +
        '<button class="btn btn-quiet btn-block" type="button" data-offline>' + (NG.state.online ? 'Simulate: lose signal' : 'Simulate: signal returns') + '</button>' +
        '<div class="grid-2">' +
          '<a class="btn btn-quiet" href="#/transfer/' + esc(b.ref) + '">Transfer this pass</a>' +
          '<a class="btn btn-quiet" href="#/reschedule/' + esc(b.ref) + '">Change the date</a>' +
        '</div>' +
        '<div class="row" style="justify-content:center;gap:8px;flex-wrap:wrap">' +
          ['valid', 'pending', 'used', 'void'].map(function (s) {
            return '<button class="chip" type="button" data-passstate="' + s + '" aria-pressed="' + (st === s) + '">' + s + '</button>';
          }).join('') +
        '</div>' +
        '<p class="meta" style="text-align:center">Pass states, for review.</p>' +
      '</div>' +
    '</div></div>';
  };

  /* ---- Gate ------------------------------------------------------------- */
  NG.views.gate = function (result, ref) {
    var b = booking(ref);
    var ok = result === 'ok';
    return '<div class="page"><div class="wrap">' +
      '<div class="gate ' + (ok ? 'gate-ok' : 'gate-no') + '">' +
        '<span class="gate-brand-icon" aria-hidden="true">' + NG.icon(ok ? 'safety' : 'nearby') + '</span>' +
        '<h2>' + (ok ? 'Let them in' : 'Do not admit') + '</h2>' +
        '<p>' + (ok
          ? esc(b.qty + ' × ' + b.tierName + ' · ' + NG.byId(b.experience).title)
          : 'This pass has already been scanned. One scan, then it stops working.') + '</p>' +
        '<p class="gate-ref">' + esc(b.ref) + '</p>' +
      '</div>' +
      '<div class="pass-actions" style="max-width:520px">' +
        '<a class="btn btn-block" href="#/pass/' + esc(b.ref) + '">Back to the pass</a>' +
        '<a class="btn btn-quiet btn-block" href="#/partner/scanner">Open the door scanner</a>' +
      '</div>' +
      '<p class="meta" style="max-width:520px;margin:16px auto 0;text-align:center">' +
        'This is the gate staff’s view, not the guest’s. It resolves in under a second and works from a cached list when the venue has no signal.</p>' +
    '</div></div>';
  };

  /* ---- Waitlist --------------------------------------------------------- */
  NG.views.waitlist = function (id) {
    var e = NG.byId(id);
    if (!e) return NG.views.notfound();
    var claim = NG.state.waitlistClaim;

    if (claim === 'offered') {
      return '<div class="page"><div class="wrap" style="max-width:560px">' +
        '<div class="claim">' +
          '<p class="eyebrow" style="color:var(--warn-ink)">A place opened at 14:38 today</p>' +
          '<p class="claim-clock" id="claim-clock">1:58:22</p>' +
          '<p style="margin:10px 0 0;font-weight:650">left to claim it</p>' +
        '</div>' +
        '<div class="card card-pad" style="margin-top:16px">' +
          '<h2 style="font-size:22px;margin-bottom:8px">' + esc(e.title) + '</h2>' +
          '<p class="meta" style="margin-bottom:16px">' + esc(e.when) + '</p>' +
          '<p>You are first in the queue. Claim within two hours or the place goes to the next person and you return to the back.</p>' +
        '</div>' +
        '<div class="stack" style="margin-top:18px">' +
          '<button class="btn btn-primary btn-lg btn-block" type="button" data-claim="take">Claim it</button>' +
          '<button class="btn btn-quiet btn-block" type="button" data-claim="lapse">Simulate: let the window lapse</button>' +
        '</div>' +
      '</div></div>';
    }

    if (claim === 'lapsed') {
      return '<div class="page"><div class="wrap" style="max-width:560px">' +
        '<div class="notice notice-warn" style="padding:28px">' +
          '<h4 style="font-size:24px;margin-bottom:10px">The window closed</h4>' +
          '<p>Two hours passed, so the place went to the next person. You are back on the waitlist — at the back this time, not the front.</p>' +
        '</div>' +
        '<div class="queue" style="margin-top:18px">' +
          '<p class="queue-pos">' + (e.waitlist + 1) + '</p>' +
          '<p class="queue-of">in the queue for ' + esc(e.title) + '</p>' +
        '</div>' +
        '<a class="btn btn-block" href="#/experience/' + e.id + '" style="margin-top:18px">Back to the experience</a>' +
      '</div></div>';
    }

    var joined = claim === 'joined';
    return '<div class="page"><div class="wrap" style="max-width:560px">' +
      '<div class="page-head"><span class="crumb"><a href="#/experience/' + e.id + '">' + esc(e.title) + '</a> · Waitlist</span>' +
      '<h1 style="font-size:34px">' + (joined ? 'You are on the list' : 'Join the waitlist') + '</h1></div>' +
      '<div class="queue">' +
        '<p class="queue-pos">' + (joined ? e.waitlist + 1 : e.waitlist) + '</p>' +
        '<p class="queue-of">' + (joined ? 'your place in the queue' : 'people already waiting') + '</p>' +
      '</div>' +
      '<div class="card card-pad" style="margin-top:16px">' +
        '<h3 style="font-size:17px;margin-bottom:8px">How this works</h3>' +
        '<p style="color:var(--n-700);margin:0">When someone releases a place we offer it to the person at the front. They get two hours to claim it. If they do not, it moves to the next person and they go to the back of the queue.</p>' +
      '</div>' +
      '<div class="stack" style="margin-top:18px">' +
        (joined
          ? '<button class="btn btn-primary btn-lg btn-block" type="button" data-claim="offer">Simulate: a place opens for you</button>' +
            '<button class="btn btn-quiet btn-block" type="button" data-claim="leave">Leave the waitlist</button>'
          : '<button class="btn btn-primary btn-lg btn-block" type="button" data-claim="join">Join the waitlist</button>') +
      '</div>' +
    '</div></div>';
  };

  /* ---- Transfer --------------------------------------------------------- */
  NG.views.transfer = function (ref) {
    var b = booking(ref), e = NG.byId(b.experience);
    return '<div class="page"><div class="wrap" style="max-width:520px">' +
      '<div class="page-head"><span class="crumb"><a href="#/pass/' + esc(ref) + '">Pass ' + esc(ref) + '</a> · Transfer</span>' +
      '<h1 style="font-size:34px">Transfer this pass</h1>' +
      '<p>The pass moves to them and stops working for you. One of you can be admitted, not both.</p></div>' +
      '<form id="transfer-form">' +
        '<label class="field"><span>Send to</span><input type="text" name="to" placeholder="Phone number or email" required></label>' +
        '<label class="field"><span>Their name</span><input type="text" name="name" placeholder="So the gate knows who to expect" required></label>' +
        '<div class="notice notice-warn" style="margin:18px 0"><h4>This cannot be undone from here</h4>' +
        '<p>Once they accept, only they can transfer it back.</p></div>' +
        '<button class="btn btn-primary btn-lg btn-block" type="submit">Transfer ' + b.qty + ' × ' + esc(b.tierName) + '</button>' +
      '</form>' +
      '<p class="meta" style="margin-top:16px">' + esc(e.title) + ' · ' + esc(e.when) + '</p>' +
    '</div></div>';
  };

  /* ---- Reschedule ------------------------------------------------------- */
  NG.views.reschedule = function (ref) {
    var b = booking(ref), e = NG.byId(b.experience);
    return '<div class="page"><div class="wrap" style="max-width:560px">' +
      '<div class="page-head"><span class="crumb"><a href="#/pass/' + esc(ref) + '">Pass ' + esc(ref) + '</a> · Change date</span>' +
      '<h1 style="font-size:34px">Move to another date</h1>' +
      '<p>' + esc(e.title) + ' runs again on the dates below. Moving keeps your tier and your price.</p></div>' +
      ['Sat 12 September', 'Sat 19 September', 'Sat 26 September'].map(function (d, i) {
        return '<label class="tier" data-selected="' + (i === 0) + '"><input type="radio" name="date"' + (i === 0 ? ' checked' : '') + '>' +
          '<span><strong>' + d + '</strong><span class="meta">Same tier · same price</span></span>' +
          '<span class="price">' + money(0) + '</span></label>';
      }).join('') +
      '<div class="notice" style="margin:20px 0"><h4>No fee to move</h4>' +
      '<p>Changing the date does not change what you paid. Refunds are a separate route.</p></div>' +
      '<button class="btn btn-primary btn-lg btn-block" type="button" data-reschedule>Move my pass</button>' +
    '</div></div>';
  };
})(window.NG = window.NG || {});
