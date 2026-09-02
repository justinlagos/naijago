/* ==========================================================================
   NaijaGo — reusable render fragments
   ========================================================================== */
(function (NG) {
  'use strict';
  var esc = NG.esc, money = NG.money, img = NG.img;

  /* ---- Brand icon system ----------------------------------------------
     Geometric black-and-gold icons reconstructed from the approved icon
     sheet. Content icons use currentColor for the primary shape and the
     brand gold token for the accent, so the same SVG works on light and
     dark surfaces without maintaining duplicate assets. ---------------- */
  var BRAND_ICON_PATHS = {
    location: '<path d="M4 4h16v12h-9l-5 5v-5H4z"/><rect class="icon-accent" x="10" y="8" width="4" height="4"/>',
    calendar: '<path fill-rule="evenodd" d="M5 5h2V2h3v3h4V2h3v3h2a2 2 0 0 1 2 2v14H3V7a2 2 0 0 1 2-2Zm2 5v7h10v-7H7Z"/><rect class="icon-accent" x="10" y="12" width="4" height="3"/>',
    ticket: '<path fill-rule="evenodd" d="M3 6h18v4a2 2 0 0 0 0 4v4H3v-4a2 2 0 0 0 0-4V6Zm9 3h2v6h-2V9Z"/><rect class="icon-accent" x="16" y="9" width="2" height="6"/>',
    nightlife: '<path d="M3 4h18l-8 9v5h5v2H6v-2h5v-5L3 4Z"/><rect class="icon-accent" x="14" y="6" width="3" height="3"/>',
    food: '<path d="M5 4h3v8h2V4h3v8h-1v8H6v-8H5V4Z"/><rect class="icon-accent" x="16" y="4" width="4" height="16"/>',
    music: '<path d="M11 3v12.2a4 4 0 1 1-2-3.46V3h2Zm0 0 8 3.5v4L11 7V3Z"/><rect class="icon-accent" x="4" y="14" width="5" height="5"/>',
    beach: '<path class="icon-accent" d="M5 10a7 7 0 0 1 14 0H5Z"/><path d="M3 13h18v3H3zM6 19h12v3H6z"/>',
    culture: '<path fill-rule="evenodd" d="M4 20V10a8 8 0 0 1 16 0v10h-6v-9a2 2 0 0 0-4 0v9H4Z"/>',
    stay: '<path d="M4 4h3v11h14v5H4V4Zm5 5h5v5H9V9Zm6 2h6v3h-6v-3Z"/><rect class="icon-accent" x="8" y="6" width="5" height="3"/>',
    friends: '<rect x="4" y="5" width="5" height="5"/><rect class="icon-accent" x="13" y="5" width="5" height="5"/><path d="M2 14h20v5H2z"/>',
    map: '<path d="m3 5 6-3v17l-6 3V5Zm12 0 6-3v17l-6 3V5Z"/><path class="icon-accent" d="m9 2 6 3v17l-6-3V2Z"/>',
    saved: '<path d="M6 3h12v19l-6-6-6 6V3Z"/>',
    trending: '<rect x="3" y="14" width="4" height="7"/><rect x="10" y="9" width="4" height="12"/><rect class="icon-accent" x="17" y="4" width="4" height="17"/>',
    safety: '<path d="M4 4h16v11l-8 7-8-7V4Z"/><rect class="icon-accent" x="10" y="8" width="4" height="4"/>',
    shuttle: '<path fill-rule="evenodd" d="M3 5h18v12h-3v3h-4v-3H9v3H5v-3H3V5Zm4 3v5h4V8H7Zm6 0v5h4V8h-4Z"/>',
    nearby: '<path fill-rule="evenodd" d="M3 3h18v18H3V3Zm5 5v8h8V8H8Z"/><rect class="icon-accent" x="10" y="10" width="4" height="4"/>',
    guide: '<path fill-rule="evenodd" d="M4 5h16v14H4V5Zm4 4v3h8V9H8Z"/><rect class="icon-accent" x="8" y="14" width="7" height="2"/>',
    waypoint: '<path d="M5 3h3v18H5V3Zm3 2h12v8H8V5Z"/><path class="icon-accent" d="M8 5h12v8H8z"/>'
  };

  NG.icon = function (name, className) {
    var body = BRAND_ICON_PATHS[name] || BRAND_ICON_PATHS.waypoint;
    return '<svg class="brand-icon' + (className ? ' ' + className : '') + '" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' + body + '</svg>';
  };

  NG.vibeIcon = function (vibe) {
    var item = (NG.VIBES || []).filter(function (v) { return v.id === vibe; })[0];
    return NG.icon(item && item.icon ? item.icon : 'waypoint');
  };

  NG.icons = {
    heart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M12 20.5 3.9 12.6a5 5 0 0 1 7-7.1l1.1 1 1.1-1a5 5 0 1 1 7 7.1z"/></svg>',
    heartFull: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 20.5 3.9 12.6a5 5 0 0 1 7-7.1l1.1 1 1.1-1a5 5 0 1 1 7 7.1z"/></svg>',
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.6-3.6"/></svg>',
    menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M3 6h18M3 12h18M3 18h18"/></svg>',
    grid: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>',
    ticket: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M3 8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2a2 2 0 0 0 0-4z"/><path d="M14 6v12" stroke-dasharray="2 3"/></svg>',
    home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M3 11 12 3l9 8"/><path d="M5 10v10h14V10"/></svg>',
    location: NG.icon('location'),
    calendar: NG.icon('calendar'),
    ticketBrand: NG.icon('ticket'),
    nightlife: NG.icon('nightlife'),
    food: NG.icon('food'),
    music: NG.icon('music'),
    beach: NG.icon('beach'),
    culture: NG.icon('culture'),
    stay: NG.icon('stay'),
    friends: NG.icon('friends'),
    map: NG.icon('map'),
    saved: NG.icon('saved'),
    trending: NG.icon('trending'),
    safety: NG.icon('safety'),
    shuttle: NG.icon('shuttle'),
    nearby: NG.icon('nearby'),
    guide: NG.icon('guide'),
    waypoint: NG.icon('waypoint')
  };

  /* ---- Experience card ------------------------------------------------- */
  NG.experienceCard = function (e) {
    var saved = !!NG.state.saved[e.id];
    return '' +
    '<article class="experience-card">' +
      '<div class="card-media" style="background-image:url(' + img(e.img) + ')">' +
        '<span class="category ' + e.vibe + '">' + NG.vibeIcon(e.vibe) + esc(e.vibeName) + '</span>' +
        (e.badge ? '<span class="card-badge">' + esc(e.badge) + '</span>' : '') +
        '<button class="save-button" type="button" data-save="' + e.id + '" aria-pressed="' + saved + '" ' +
          'aria-label="' + (saved ? 'Remove ' : 'Save ') + esc(e.title) + '">' +
          (saved ? NG.icons.heartFull : NG.icons.heart) +
        '</button>' +
      '</div>' +
      '<div class="card-body">' +
        '<p class="card-when">' + esc(e.when) + '</p>' +
        '<h3><a class="card-link" href="#/experience/' + e.id + '">' + esc(e.title) + '</a></h3>' +
        '<p>' + esc(e.blurb) + '</p>' +
      '</div>' +
      '<div class="card-foot">' +
        '<span class="rating">★ <b>' + e.rating.toFixed(1) + '</b> · ' + e.going.toLocaleString('en-NG') + ' going</span>' +
        '<span class="price">' + money(e.price) + '</span>' +
      '</div>' +
    '</article>';
  };

  /* ---- Season card ----------------------------------------------------- */
  NG.seasonCard = function (s) {
    return '' +
    '<a class="season-card" href="#/season/' + s.id + '" data-over-image>' +
      '<span class="season-bg" style="background-image:url(' + img(s.img) + ')" aria-hidden="true"></span>' +
      '<span class="tag season-tag">' + esc(s.tag) + '</span>' +
      '<div>' +
        '<p class="season-meta">' + esc(s.meta) + '</p>' +
        '<h3>' + esc(s.name) + '</h3>' +
        '<div class="season-foot"><span>' + esc(s.foot) + '</span><span aria-hidden="true">→</span></div>' +
      '</div>' +
    '</a>';
  };

  /* ---- Host card ------------------------------------------------------- */
  NG.hostCard = function (h) {
    return '' +
    '<a class="host-card" href="#/host/' + h.id + '">' +
      '<span class="host-avatar" aria-hidden="true">' + esc(h.initials) + '</span>' +
      '<span class="host-brand-icon" aria-hidden="true">' + NG.icon('safety') + '</span>' +
      '<h3>' + esc(h.name) + '</h3>' +
      '<p class="host-meta">' + esc(h.meta) + '</p>' +
      '<p>' + esc(h.blurb) + '</p>' +
      '<span class="verified">✓ Verified · ★ ' + h.rating.toFixed(1) + '</span>' +
    '</a>';
  };

  /* ---- Guide card ------------------------------------------------------ */
  NG.guideCard = function (g) {
    var f = g.featured;
    return '' +
    '<a class="guide-card' + (f ? ' featured' : '') + '" href="#/guide/' + g.id + '"' + (f ? ' data-over-image' : '') + '>' +
      (f ? '<span class="guide-bg" style="background-image:url(' + img(g.img) + ')" aria-hidden="true"></span>' : '') +
      '<span class="guide-brand-icon" aria-hidden="true">' + NG.icon('guide') + '</span>' +
      '<p class="guide-kicker">' + esc(g.kicker) + '</p>' +
      '<h3>' + esc(g.title) + '</h3>' +
      '<p>' + esc(g.blurb) + '</p>' +
      '<p class="guide-meta">' + esc(g.meta) + '</p>' +
    '</a>';
  };

  /* ---- Header / chrome refresh ----------------------------------------- */
  NG.renderChrome = function () {
    var s = NG.state;
    var acct = NG.$('#account-btn');
    if (acct) {
      acct.textContent = s.signedIn ? s.user.initials : '';
      acct.innerHTML = s.signedIn
        ? esc(s.user.initials)
        : NG.icon('friends');
      acct.setAttribute('aria-label', s.signedIn ? 'Your account, ' + s.user.name : 'Sign in');
    }
    NG.$$('#city-label').forEach(function (el) { el.textContent = s.city; });
    var fullRoute = location.hash || '#/';
    var route = fullRoute.split('?')[0];
    var navKey = fullRoute.indexOf('#/explore?mode=events') === 0 ? 'events'
      : route === '#/explore' ? 'discover' : '';
    NG.$$('.nav-links a, .mobile-dock button').forEach(function (a) {
      var t = a.getAttribute('href') || a.dataset.go;
      var matchesNav = a.dataset.nav ? a.dataset.nav === navKey : t && t === route;
      if (matchesNav) a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    });
  };

  /* ---- Section head ---------------------------------------------------- */
  NG.head = function (num, title, sub, link, linkTo) {
    return '<div class="section-head"><div>' +
      (num ? '<span class="eyebrow"><span class="eyebrow-num">' + num + '</span></span>' : '') +
      '<h2>' + esc(title) + '</h2>' +
      (sub ? '<p>' + esc(sub) + '</p>' : '') +
    '</div>' +
    (link ? '<a class="head-link" href="' + linkTo + '">' + esc(link) + '</a>' : '') +
    '</div>';
  };
})(window.NG = window.NG || {});
