/* ==========================================================================
   NaijaGo — router, hold timer, delegated events.
   ========================================================================== */
(function (NG) {
  'use strict';
  var esc = NG.esc, money = NG.money;

  NG.go = function (hash) {
    if (location.hash === hash) NG.render();
    else location.hash = hash;
  };

  /* ---- Route table ------------------------------------------------------ */
  var ROUTES = [
    [/^#?\/?$/,                            function () { return NG.views.home(); }],
    [/^#\/explore/,                        function () { return NG.views.explore(); }],
    [/^#\/seasons$/,                       function () { return NG.views.seasons(); }],
    [/^#\/season\/([\w-]+)/,               function (m) { return NG.views.season(m[1]); }],
    [/^#\/guides$/,                        function () { return NG.views.guides(); }],
    [/^#\/guide\/([\w-]+)/,                function (m) { return NG.views.guide(m[1]); }],
    [/^#\/hosts$/,                         function () { return NG.views.hosts(); }],
    [/^#\/host\/([\w-]+)/,                 function (m) { return NG.views.host(m[1]); }],
    [/^#\/experience\/([\w-]+)/,           function (m) { return NG.views.experience(m[1]); }],
    [/^#\/login/,                          function () { return NG.views.login(); }],
    [/^#\/checkout/,                       function () { return NG.views.checkout(); }],
    [/^#\/failed\/(\w+)/,                  function (m) { return NG.views.failed(m[1]); }],
    [/^#\/confirmed/,                      function () { return NG.views.confirmed(); }],
    [/^#\/pass\/([\w-]+)/,                 function (m) { return NG.views.pass(m[1]); }],
    [/^#\/gate\/(ok|no)\/([\w-]+)/,        function (m) { return NG.views.gate(m[1], m[2]); }],
    [/^#\/waitlist\/([\w-]+)/,             function (m) { return NG.views.waitlist(m[1]); }],
    [/^#\/transfer\/([\w-]+)/,             function (m) { return NG.views.transfer(m[1]); }],
    [/^#\/reschedule\/([\w-]+)/,           function (m) { return NG.views.reschedule(m[1]); }],
    [/^#\/account\/bookings/,              function () { return NG.views.bookings(); }],
    [/^#\/account\/passes/,                function () { return NG.views.passes(); }],
    [/^#\/account\/saved/,                 function () { return NG.views.saved(); }],
    [/^#\/account\/plans/,                 function () { return NG.views.plans(); }],
    [/^#\/account\/notifications/,         function () { return NG.views.notifications(); }],
    [/^#\/account\/reviews/,               function () { return NG.views.reviews(); }],
    [/^#\/account\/settings/,              function () { return NG.views.settings(); }],
    [/^#\/account/,                        function () { return NG.views.account(); }],
    [/^#\/plan$/,                          function () { return NG.views.plans(); }],
    [/^#\/partner\/listings/,              function () { return NG.views.partnerListings(); }],
    [/^#\/partner\/listing/,               function () { return NG.views.partnerListing(); }],
    [/^#\/partner\/payouts/,               function () { return NG.views.partnerPayouts(); }],
    [/^#\/partner\/refunds/,               function () { return NG.views.partnerRefunds(); }],
    [/^#\/partner\/scanner/,               function () { return NG.views.scanner(); }],
    [/^#\/partner/,                        function () { return NG.views.partner(); }],
    [/^#\/help/,                           function () { return NG.views.help(); }]
  ];

  NG.render = function () {
    var h = location.hash || '#/';
    var path = h.split('?')[0];
    var out = null;
    for (var i = 0; i < ROUTES.length; i++) {
      var m = path.match(ROUTES[i][0]) || h.match(ROUTES[i][0]);
      if (m) { out = ROUTES[i][1](m); break; }
    }
    if (out === '') return;                      // a view redirected
    var main = NG.$('#main');
    main.innerHTML = out === null ? NG.views.notfound() : out;
    if (path.indexOf('/checkout') < 0) NG.stopHold();
    NG.renderChrome();
    NG.$('#mobile-menu').dataset.open = 'false';
    NG.$('#menu-btn').setAttribute('aria-expanded', 'false');
    window.scrollTo(0, 0);
    if (NG.auditOn) NG.audit();
  };

  /* ---- Hold timer ------------------------------------------------------- */
  NG.startHold = function () {
    if (NG.state.hold && NG.state.hold.timer) return;
    var endsAt = Date.now() + NG.HOLD_SECS * 1000;
    NG.state.hold = { endsAt: endsAt, timer: setInterval(tick, 1000) };
    setTimeout(tick, 0);
    function tick() {
      var el = NG.$('#hold');
      if (!el) return;
      var left = Math.round((NG.state.hold.endsAt - Date.now()) / 1000);
      if (left <= 0) {
        NG.stopHold();
        NG.go('#/failed/expired');
        return;
      }
      NG.$('#hold-clock').textContent = NG.clock(left);
      NG.$('#hold-bar').style.width = (left / NG.HOLD_SECS * 100) + '%';
      var warn = left <= NG.WARN_SECS;
      el.dataset.warn = String(warn);
      NG.$('#hold-note').textContent = warn
        ? 'Under three minutes. After that the seats go back on sale.'
        : 'Your seats are held while this runs.';
    }
  };
  NG.stopHold = function () {
    if (NG.state.hold && NG.state.hold.timer) clearInterval(NG.state.hold.timer);
    NG.state.hold = null;
  };

  /* ---- Claim countdown -------------------------------------------------- */
  var claimTimer = null;
  function startClaim() {
    clearInterval(claimTimer);
    var endsAt = Date.now() + NG.CLAIM_MINS * 60 * 1000 - 98 * 1000;
    claimTimer = setInterval(function () {
      var el = NG.$('#claim-clock');
      if (!el) { clearInterval(claimTimer); return; }
      var s = Math.max(0, Math.round((endsAt - Date.now()) / 1000));
      var hh = Math.floor(s / 3600), mm = Math.floor((s % 3600) / 60), ss = s % 60;
      el.textContent = hh + ':' + String(mm).padStart(2, '0') + ':' + String(ss).padStart(2, '0');
      if (s === 0) { clearInterval(claimTimer); NG.state.waitlistClaim = 'lapsed'; NG.render(); }
    }, 1000);
  }

  /* ---- Ticker + shortcuts ----------------------------------------------- */
  function buildChrome() {
    var items = NG.TICKER.map(function (t) { return '<span class="announcement-item">' + esc(t) + '</span>'; }).join('');
    NG.$('#ticker').innerHTML = items + items;       // duplicated for a seamless loop
    NG.$('#search-btn').innerHTML = NG.icons.search;
    NG.$('#menu-btn').innerHTML = NG.icons.menu;
    var locationSymbol = NG.$('.location-symbol');
    if (locationSymbol) locationSymbol.innerHTML = NG.icon('location');
    NG.$('#shortcuts').innerHTML = NG.SHORTCUTS.map(function (s) {
      var shortcutIcon = s.to.indexOf('vibe=night') >= 0 ? 'nightlife'
        : s.to.indexOf('vibe=food') >= 0 ? 'food' : 'calendar';
      return '<button class="shortcut" type="button" data-go="' + s.to + '" data-close>' +
        NG.icon(shortcutIcon) + '<span class="shortcut-copy"><strong>' + esc(s.label) + '</strong><span>' + esc(s.sub) + '</span></span></button>';
    }).join('');
    var dock = NG.$$('.mobile-dock button');
    [NG.icons.waypoint, NG.icons.nearby, NG.icons.calendar, NG.icons.ticketBrand].forEach(function (ic, i) {
      if (dock[i]) dock[i].insertAdjacentHTML('afterbegin', ic);
    });
  }

  /* ---- Delegated clicks -------------------------------------------------- */
  document.addEventListener('click', function (ev) {
    var t = ev.target;

    var closer = t.closest('[data-close], .scrim');
    if (closer && (closer.hasAttribute('data-close') || (t.classList && t.classList.contains('scrim')))) {
      NG.closeDialog();
      if (!t.closest('[data-go]')) return;
    }

    var opener = t.closest('[data-open-dialog]');
    if (opener) { ev.preventDefault(); NG.openDialog(opener.dataset.openDialog); return; }

    var goer = t.closest('[data-go]');
    if (goer) { ev.preventDefault(); NG.closeDialog(); NG.go(goer.dataset.go); return; }

    if (t.closest('#menu-btn')) {
      var mm = NG.$('#mobile-menu');
      var open = mm.dataset.open !== 'true';
      mm.dataset.open = String(open);
      NG.$('#menu-btn').setAttribute('aria-expanded', String(open));
      return;
    }

    var sv = t.closest('[data-save]');
    if (sv) { ev.preventDefault(); if (NG.toggleSave(sv.dataset.save)) NG.render(); return; }

    var hf = t.closest('[data-homefilter]');
    if (hf) {
      NG.$$('[data-homefilter]').forEach(function (b) { b.setAttribute('aria-pressed', String(b === hf)); });
      var key = hf.dataset.homefilter;
      var list = NG.EXPERIENCES.filter(function (e) {
        if (key === 'all') return true;
        if (key === 'tonight') return e.dateISO === NG.TODAY.iso;
        if (key === 'weekend') return e.dateISO === '2026-09-05' || e.dateISO === '2026-09-06';
        if (key === 'free entry') return e.price === 0;
        if (key === 'outdoors') return e.vibe === 'outdoors';
        return true;
      });
      NG.$('#home-grid').innerHTML = list.length
        ? list.map(NG.experienceCard).join('')
        : '<div class="empty" style="grid-column:1/-1"><h3>Nothing under that filter</h3><p>Try “All”.</p></div>';
      NG.$('#showing-count').textContent = 'Showing ' + list.length + ' pick' + (list.length === 1 ? '' : 's');
      return;
    }

    var off = t.closest('[data-facet-off]');
    if (off) {
      var k = off.dataset.facetOff;
      NG.state.filters[k] = NG.state.filters[k].filter(function (x) { return x !== off.value; });
      NG.render(); return;
    }
    if (t.closest('[data-clear-filters]')) {
      NG.state.filters = { vibes: [], areas: [], bands: [] };
      if (location.hash.indexOf('?') > 0) { location.hash = '#/explore'; return; }
      NG.render(); return;
    }

    var q = t.closest('[data-qty]');
    if (q) {
      var c = NG.state.cart;
      var e2 = NG.byId(c.id);
      var tier = e2.tiers.filter(function (x) { return x.id === c.tier; })[0] || e2.tiers[0];
      c.qty = Math.max(1, Math.min(tier.left || 1, c.qty + Number(q.dataset.qty)));
      NG.render(); return;
    }

    var rl = t.closest('[data-rail]');
    if (rl) { NG.state.rail = rl.dataset.rail; NG.render(); return; }

    if (t.closest('[data-copy]')) { NG.toast('Copied', 'Account number on your clipboard.'); return; }

    var pay = t.closest('[data-pay]');
    if (pay) {
      var how = pay.dataset.pay;
      if (how !== 'ok') { NG.stopHold(); NG.go('#/failed/' + how); return; }
      var tt = NG.cartTotals();
      NG.stopHold();
      NG.state.booking = {
        ref: 'NG-9107-LOS',
        experience: tt.experience.id, qty: tt.qty, tierName: tt.tier.name,
        face: tt.face, fee: tt.fee, total: tt.total, points: tt.points,
        railName: (NG.RAILS.filter(function (r) { return r.id === NG.state.rail; })[0] || {}).name || 'Card'
      };
      NG.state.passState = 'valid';
      NG.go('#/confirmed'); return;
    }

    var ps = t.closest('[data-passstate]');
    if (ps) { NG.state.passState = ps.dataset.passstate; NG.render(); return; }

    if (t.closest('[data-offline]')) {
      NG.state.online = !NG.state.online;
      NG.toast(NG.state.online ? 'Back online' : 'Offline', NG.state.online ? 'Signal restored.' : 'Your pass still works.');
      NG.render(); return;
    }

    var cl = t.closest('[data-claim]');
    if (cl) {
      var a = cl.dataset.claim;
      if (a === 'join')  { NG.state.waitlistClaim = 'joined'; NG.toast('Done', 'You are on the waitlist.'); }
      if (a === 'leave') { NG.state.waitlistClaim = null; NG.toast('Removed', 'You have left the waitlist.'); }
      if (a === 'offer') { NG.state.waitlistClaim = 'offered'; }
      if (a === 'lapse') { NG.state.waitlistClaim = 'lapsed'; }
      if (a === 'take')  {
        NG.state.waitlistClaim = null;
        var id = location.hash.split('/')[2];
        NG.state.cart = { id: id, tier: NG.byId(id).tiers[0].id, qty: 1 };
        NG.go('#/checkout'); return;
      }
      NG.render();
      if (NG.state.waitlistClaim === 'offered') startClaim();
      return;
    }

    var st = t.closest('[data-star]');
    if (st) {
      var n = Number(st.dataset.star);
      NG.$$('[data-star]').forEach(function (b) { b.dataset.on = String(Number(b.dataset.star) <= n); });
      return;
    }
    if (t.closest('[data-review]')) { NG.toast('Posted', 'Your review is live on the experience page.'); return; }
    if (t.closest('[data-readall]')) { NG.NOTIFICATIONS.forEach(function (n2) { n2.unread = false; }); NG.render(); return; }
    if (t.closest('[data-save-settings]')) { NG.toast('Saved', 'Your details are up to date.'); return; }
    if (t.closest('[data-listing-submit]')) { NG.toast('Submitted', 'A human reviews this within one working day.'); return; }
    if (t.closest('[data-reschedule]')) { NG.toast('Moved', 'Your pass now shows the new date.'); NG.go('#/pass/NG-8842-LOS'); return; }

    var tg = t.closest('[data-toggle]');
    if (tg) {
      var on = tg.getAttribute('aria-pressed') !== 'true';
      tg.setAttribute('aria-pressed', String(on));
      tg.textContent = on ? 'On' : 'Off';
      tg.className = 'btn ' + (on ? 'btn-ink' : 'btn-quiet');
      return;
    }

    if (t.closest('[data-signout]')) {
      NG.state.signedIn = false; NG.state.saved = {}; NG.state.booking = null;
      NG.toast('Signed out', 'Your saved list is cleared in this prototype.');
      NG.go('#/'); return;
    }

    var sw = t.closest('[data-season-view]');
    if (sw) {
      var base = location.hash.split('?')[0];
      location.hash = base + '?view=' + sw.dataset.seasonView;
      return;
    }
  });

  /* ---- Change / submit --------------------------------------------------- */
  document.addEventListener('change', function (ev) {
    var t = ev.target;
    if (t.matches('[data-facet]')) {
      var k = t.dataset.facet, arr = NG.state.filters[k];
      if (t.checked) { if (arr.indexOf(t.value) < 0) arr.push(t.value); }
      else NG.state.filters[k] = arr.filter(function (x) { return x !== t.value; });
      NG.render(); return;
    }
    if (t.id === 'sort-select') { NG.state.sort = t.value; NG.render(); return; }
    if (t.name === 'tier') { NG.state.cart.tier = t.value; NG.state.cart.qty = 1; NG.render(); return; }
  });

  document.addEventListener('submit', function (ev) {
    var f = ev.target;
    ev.preventDefault();

    if (f.id === 'finder' || f.id === 'quick-search') {
      var d = new FormData(f);
      if (d.get('city')) NG.state.city = d.get('city');
      if (d.get('when')) NG.state.when = d.get('when');
      var vibe = d.get('vibe');
      if (vibe && vibe !== 'Any vibe') {
        var v = NG.VIBES.filter(function (x) { return x.name === vibe; })[0];
        NG.state.filters.vibes = v ? [v.id] : [];
      }
      NG.closeDialog();
      NG.go('#/explore');
      return;
    }

    if (f.id === 'login-form') {
      NG.state.signedIn = true;
      var intent = NG.state.intent;
      NG.state.intent = null;
      NG.toast('Signed in', 'Welcome back, ' + NG.state.user.name.split(' ')[0] + '.');
      if (intent && intent.kind === 'save') {
        NG.state.saved[intent.id] = true;
        NG.go(intent.back || '#/');
      } else if (intent && intent.kind === 'checkout') {
        NG.go('#/checkout');
      } else if (intent && intent.back) {
        NG.go(intent.back);
      } else {
        NG.go('#/account');
      }
      return;
    }

    if (f.id === 'transfer-form') {
      NG.state.passState = 'void';
      NG.toast('Transferred', 'The pass has moved. Yours no longer admits.');
      NG.go('#/pass/NG-8842-LOS');
      return;
    }
  });

  document.addEventListener('keydown', function (ev) {
    if (ev.key === 'Escape') NG.closeDialog();
    if (ev.key === '/' && !/input|textarea|select/i.test(document.activeElement.tagName)) {
      ev.preventDefault(); NG.openDialog('search-dialog');
    }
  });

  window.addEventListener('hashchange', NG.render);
  buildChrome();
  NG.render();
})(window.NG = window.NG || {});
