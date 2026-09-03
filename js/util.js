/* ==========================================================================
   NaijaGo — helpers and in-memory state.
   No persistence anywhere: no localStorage, no cookies, no network.
   Reloading the page resets the prototype to its opening state by design.
   ========================================================================== */
(function (NG) {
  'use strict';

  NG.state = {
    signedIn: false,
    user: { name: 'Adaeze Okafor', initials: 'AO', email: 'adaeze@example.com', points: 1240 },
    saved: {},                 // experienceId -> true
    intent: null,              // where the auth wall should return you
    city: 'Lagos',
    when: 'This weekend',
    vibe: 'Any vibe',
    filters: { vibes: [], areas: [], bands: [] },
    sort: 'soon',
    cart: null,                // { id, tier, qty }
    hold: null,                // { endsAt, timer }
    rail: 'card',
    booking: null,             // the completed booking
    passState: 'valid',
    online: true,
    waitlistClaim: null,
    menuOpen: false,
    scans: [],
    filtersOpen: false,
    calendarMonth: '2026-09',
    calendarDay: '2026-09-05',
    listingStatus: 'draft',
    listingFlyerUrl: '',
    adCampaign: {
      status: 'draft',
      format: 'native',
      name: 'September Lagos launch',
      title: 'Make the weekend yours',
      destination: 'https://example.com',
      start: '2026-09-12',
      end: '2026-09-26',
      budget: 450000,
      creativeUrl: ''
    }
  };

  /* ---- DOM ------------------------------------------------------------- */
  NG.$  = function (sel, root) { return (root || document).querySelector(sel); };
  NG.$$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  NG.esc = function (s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  };

  NG.img = function (name) { return 'assets/img/' + name; };

  NG.clock = function (secs) {
    var m = Math.floor(Math.max(0, secs) / 60), s = Math.max(0, secs) % 60;
    return String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
  };

  /* ---- Toast ----------------------------------------------------------- */
  var toastTimer = null;
  NG.toast = function (label, message) {
    var el = NG.$('#toast');
    if (!el) return;
    el.querySelector('strong').textContent = label;
    el.querySelector('span').textContent = message;
    el.dataset.open = 'true';
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.dataset.open = 'false'; }, 3600);
  };

  /* ---- Dialogs --------------------------------------------------------- */
  var lastFocus = null;
  NG.openDialog = function (id) {
    var el = document.getElementById(id);
    if (!el) return;
    lastFocus = document.activeElement;
    el.dataset.open = 'true';
    document.body.style.overflow = 'hidden';
    var f = el.querySelector('input,select,button:not(.dialog-x)');
    if (f) f.focus();
  };
  NG.closeDialog = function (id) {
    var el = id ? document.getElementById(id) : NG.$('.scrim[data-open="true"]');
    if (!el) return;
    el.dataset.open = 'false';
    document.body.style.overflow = '';
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  };

  /* ---- Deterministic QR-style code -------------------------------------
     A drawing, not a scannable code. The gate screens in this prototype
     read the booking reference, never the pixels. ------------------------ */
  NG.qrSVG = function (seed, size) {
    size = size || 190;
    var n = 25, cell = size / n, h = 0, i, x, y;
    for (i = 0; i < String(seed).length; i++) h = ((h << 5) - h + String(seed).charCodeAt(i)) | 0;
    function rnd() { h ^= h << 13; h ^= h >>> 17; h ^= h << 5; return (h >>> 0) / 4294967296; }
    var rects = [];
    function finder(ox, oy) {
      rects.push('<rect x="' + (ox * cell) + '" y="' + (oy * cell) + '" width="' + (7 * cell) + '" height="' + (7 * cell) + '" fill="#0A0A09"/>');
      rects.push('<rect x="' + ((ox + 1) * cell) + '" y="' + ((oy + 1) * cell) + '" width="' + (5 * cell) + '" height="' + (5 * cell) + '" fill="#fff"/>');
      rects.push('<rect x="' + ((ox + 2) * cell) + '" y="' + ((oy + 2) * cell) + '" width="' + (3 * cell) + '" height="' + (3 * cell) + '" fill="#0A0A09"/>');
    }
    for (y = 0; y < n; y++) {
      for (x = 0; x < n; x++) {
        var inFinder = (x < 8 && y < 8) || (x > n - 9 && y < 8) || (x < 8 && y > n - 9);
        if (inFinder) continue;
        if (rnd() > 0.53) rects.push('<rect x="' + (x * cell) + '" y="' + (y * cell) + '" width="' + cell + '" height="' + cell + '" fill="#0A0A09"/>');
      }
    }
    finder(0, 0); finder(n - 7, 0); finder(0, n - 7);
    return '<svg width="' + size + '" height="' + size + '" viewBox="0 0 ' + size + ' ' + size + '" role="img" aria-label="Entry code for ' + NG.esc(seed) + '">' +
           '<rect width="' + size + '" height="' + size + '" fill="#fff"/>' + rects.join('') + '</svg>';
  };

  /* ---- Cart maths ------------------------------------------------------ */
  NG.cartTotals = function () {
    var c = NG.state.cart;
    if (!c) return null;
    var e = NG.byId(c.id);
    if (!e) return null;
    var tier = null, i;
    for (i = 0; i < e.tiers.length; i++) if (e.tiers[i].id === c.tier) tier = e.tiers[i];
    if (!tier) tier = e.tiers[0];
    var face = tier.price * c.qty;
    var fee  = Math.round(face * NG.FEE);
    return {
      experience: e, tier: tier, qty: c.qty,
      face: face, fee: fee, total: face + fee,
      points: Math.round((face + fee) * NG.POINTS)
    };
  };

  /* ---- Save, with the auth wall preserving intent ---------------------- */
  NG.toggleSave = function (id) {
    if (!NG.state.signedIn) {
      NG.state.intent = { kind: 'save', id: id, back: location.hash || '#/' };
      NG.go('#/login');
      return false;
    }
    if (NG.state.saved[id]) {
      delete NG.state.saved[id];
      NG.toast('Removed', 'Taken off your saved list.');
    } else {
      NG.state.saved[id] = true;
      NG.toast('Done', 'Saved to your list');
    }
    return true;
  };

  NG.savedCount = function () { return Object.keys(NG.state.saved).length; };
  NG.unreadCount = function () {
    return NG.NOTIFICATIONS.filter(function (n) { return n.unread; }).length;
  };
})(window.NG = window.NG || {});
