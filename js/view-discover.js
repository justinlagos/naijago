/* ==========================================================================
   NaijaGo — discovery surfaces: explore, seasons, season guide, guides,
   hosts index, host profile, city page, help.
   ========================================================================== */
(function (NG) {
  'use strict';
  var esc = NG.esc, img = NG.img, money = NG.money;
  NG.views = NG.views || {};

  /* ---- Query helpers --------------------------------------------------- */
  NG.query = function () {
    var h = location.hash || '', i = h.indexOf('?');
    var out = {};
    if (i < 0) return out;
    h.slice(i + 1).split('&').forEach(function (p) {
      if (!p) return;
      var kv = p.split('=');
      out[decodeURIComponent(kv[0])] = decodeURIComponent(kv[1] || '');
    });
    return out;
  };

  function matches(e, f) {
    if (f.vibes.length && f.vibes.indexOf(e.vibe) < 0) return false;
    if (f.areas.length && f.areas.indexOf(e.area) < 0) return false;
    if (f.bands.length) {
      var band = e.price === 0 ? 'free' : e.price < 15000 ? 'under15' : e.price <= 30000 ? '15to30' : 'over30';
      if (f.bands.indexOf(band) < 0) return false;
    }
    return true;
  }

  function sorted(list, how) {
    var a = list.slice();
    if (how === 'price') a.sort(function (x, y) { return x.price - y.price; });
    else if (how === 'rating') a.sort(function (x, y) { return y.rating - x.rating || y.going - x.going; });
    else if (how === 'popular') a.sort(function (x, y) { return y.going - x.going; });
    else a.sort(function (x, y) { return x.dateISO < y.dateISO ? -1 : 1; });
    return a;
  }

  /* ---- Explore --------------------------------------------------------- */
  NG.views.explore = function () {
    var f = NG.state.filters;
    var q = NG.query();
    if (q.vibe && f.vibes.indexOf(q.vibe) < 0) f.vibes = [q.vibe];

    var results = sorted(NG.EXPERIENCES.filter(function (e) { return matches(e, f); }), NG.state.sort);
    var applied = []
      .concat(f.vibes.map(function (v) { return { k: 'vibes', id: v, label: (NG.VIBES.filter(function (x) { return x.id === v; })[0] || {}).name || v }; }))
      .concat(f.areas.map(function (a) { return { k: 'areas', id: a, label: (NG.AREAS.filter(function (x) { return x.id === a; })[0] || {}).name || a }; }))
      .concat(f.bands.map(function (b) { return { k: 'bands', id: b, label: (NG.PRICE_BANDS.filter(function (x) { return x.id === b; })[0] || {}).name || b }; }));

    function facet(title, key, list, icon) {
      return '<div class="facet"><h3>' + NG.icon(icon) + esc(title) + '</h3>' +
        list.map(function (o) {
          var on = f[key].indexOf(o.id) >= 0;
          return '<label><input type="checkbox" data-facet="' + key + '" value="' + o.id + '"' + (on ? ' checked' : '') + '>' +
            '<span>' + esc(o.name) + '</span><span class="count num">' + o.count + '</span></label>';
        }).join('') + '</div>';
    }

    var resultCards = results.map(function (e, i) { return NG.experienceCard(e) + (i === 2 ? NG.nativeAdCard() : ''); }).join('');
    var body = results.length
      ? '<div class="explore-results">' + resultCards + '</div>'
      : '<div class="empty"><h3>Nothing matches all of those</h3>' +
        '<p>Loosen one filter and the list comes back. The counts beside each option tell you which one is doing the damage.</p>' +
        '<p style="margin-top:18px"><button class="btn" type="button" data-clear-filters>Clear all filters</button></p></div>';

    return '' +
    '<div class="page"><div class="wrap">' +
      '<div class="page-head">' +
        '<span class="crumb"><a href="#/">NaijaGo</a> · Explore</span>' +
        '<h1>Experiences in ' + esc(NG.state.city) + '</h1>' +
        '<p>' + NG.LAGOS_TOTAL + ' experiences are live in Lagos right now. This prototype ships eight of them with full booking flows.</p>' +
      '</div>' +
      '<div class="mobile-explore-toolbar"><button class="btn btn-ink" type="button" data-filter-open>' + NG.icon('trending') + 'Filters' + (applied.length ? '<b>' + applied.length + '</b>' : '') + '</button><span>' + results.length + ' shown</span><label class="sort"><span class="sr">Sort results</span><select id="sort-select-mobile"><option>Sort</option><option value="soon">Soonest</option><option value="popular">Popular</option><option value="rating">Rating</option><option value="price">Price</option></select></label></div>' +
      '<div class="explore-grid">' +
        '<div class="filter-scrim" data-filter-close aria-hidden="true"></div><aside class="facets" id="explore-filters" aria-label="Filters" data-open="' + NG.state.filtersOpen + '">' +
          '<div class="facets-head"><div><span class="eyebrow">Refine the list</span><h2>Filters</h2></div><button type="button" data-filter-close aria-label="Close filters">×</button></div>' +
          facet('Vibe', 'vibes', NG.VIBES, 'trending') +
          facet('Area', 'areas', NG.AREAS, 'location') +
          facet('Price', 'bands', NG.PRICE_BANDS, 'ticket') +
          '<div class="facets-actions"><button class="btn btn-primary btn-block" type="button" data-filter-close>Show ' + results.length + ' result' + (results.length === 1 ? '' : 's') + '</button><button class="btn btn-quiet btn-block" type="button" data-clear-filters>Clear all</button></div>' +
        '</aside>' +
        '<div>' +
          '<div class="explore-bar">' +
            '<p class="count-label num">' + results.length + ' of ' + NG.EXPERIENCES.length + ' shown</p>' +
            '<label class="sort">Sort <select id="sort-select">' +
              ['soon:Soonest first', 'popular:Most going', 'rating:Highest rated', 'price:Lowest price'].map(function (o) {
                var kv = o.split(':');
                return '<option value="' + kv[0] + '"' + (NG.state.sort === kv[0] ? ' selected' : '') + '>' + kv[1] + '</option>';
              }).join('') + '</select></label>' +
          '</div>' +
          (applied.length ? '<div class="applied">' + applied.map(function (a) {
            return '<button class="chip" type="button" data-remove data-facet-off="' + a.k + '" value="' + a.id + '">' + esc(a.label) + ' <span aria-hidden="true">×</span></button>';
          }).join('') + '<button class="chip" type="button" data-clear-filters>Clear all</button></div>' : '') +
          body +
        '</div>' +
      '</div>' +
    '</div></div>';
  };

  /* ---- Seasons index --------------------------------------------------- */
  NG.views.seasons = function () {
    return '<div class="page"><div class="wrap">' +
      '<div class="page-head"><span class="crumb"><a href="#/">NaijaGo</a> · Seasons</span>' +
      '<h1>Seasons</h1><p>Big Nigerian moments, organised so you can arrive with a plan and leave with stories.</p></div>' +
      '<div class="season-grid">' + NG.SEASONS.map(NG.seasonCard).join('') + '</div>' +
    '</div></div>';
  };

  /* ---- Season guide: three views --------------------------------------- */
  NG.views.season = function (id) {
    var s = NG.seasonById(id);
    if (!s) return NG.views.notfound();
    var view = NG.query().view || 'list';
    var list = NG.EXPERIENCES.slice(0, 6);

    var switcher = '<div class="view-switch" role="group" aria-label="View">' +
      ['list:List:guide', 'calendar:Calendar:calendar', 'map:By area:map'].map(function (o) {
        var kv = o.split(':');
        return '<button type="button" data-season-view="' + kv[0] + '" aria-pressed="' + (view === kv[0]) + '">' + NG.icon(kv[2]) + '<span>' + kv[1] + '</span></button>';
      }).join('') + '</div>';

    var panel;
    if (view === 'calendar') {
      var cells = '';
      ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].forEach(function (d) { cells += '<div class="cal-h">' + d + '</div>'; });
      // September 2026 starts on a Tuesday.
      cells += '<div class="cal-d out"></div>';
      for (var d = 1; d <= 30; d++) {
        var evs = NG.EXPERIENCES.filter(function (e) { return e.dateISO === '2026-09-' + String(d).padStart(2, '0'); });
        cells += '<div class="cal-d"><b>' + d + '</b>' +
          evs.map(function (e) { return '<a class="cal-e" href="#/experience/' + e.id + '">' + esc(e.title) + '</a>'; }).join('') +
          '</div>';
      }
      panel = '<div class="cal">' + cells + '</div>' +
        '<p class="meta" style="margin-top:14px">September 2026. Detty December runs 1 December to 4 January; this month is shown so the calendar has content to display.</p>';
    } else if (view === 'map') {
      panel = '<div class="grid-3">' + NG.AREAS.map(function (a) {
        var evs = NG.EXPERIENCES.filter(function (e) { return e.area === a.id; });
        return '<div class="card card-pad"><h3 style="font-size:19px;margin-bottom:6px">' + esc(a.name) + '</h3>' +
          '<p class="meta" style="margin-bottom:14px">' + a.count + ' live in this area</p>' +
          (evs.length
            ? '<ul>' + evs.map(function (e) { return '<li style="padding:7px 0;border-top:1px solid var(--n-200)"><a href="#/experience/' + e.id + '">' + esc(e.title) + '</a></li>'; }).join('') + '</ul>'
            : '<p class="meta">Nothing from this prototype’s eight in this area.</p>') +
          '</div>';
      }).join('') + '</div>';
    } else {
      panel = '<div class="explore-results">' + list.map(NG.experienceCard).join('') + '</div>';
    }

    return '' +
    '<section class="season-hero"><div class="wrap">' +
      '<span class="eyebrow">' + esc(s.tag) + ' · ' + esc(s.meta) + '</span>' +
      '<h1>' + esc(s.name) + '</h1>' +
      '<p>' + esc(s.blurb) + '</p>' +
      '<p style="margin-top:22px;font-size:12px;letter-spacing:1.6px;text-transform:uppercase;color:var(--gold-on-ink)">' + esc(s.foot) + '</p>' +
    '</div></section>' +
    '<div class="page"><div class="wrap">' + switcher + panel + '</div></div>';
  };

  /* ---- Guides ---------------------------------------------------------- */
  NG.views.guides = function () {
    return '<div class="page"><div class="wrap">' +
      '<div class="page-head"><span class="crumb"><a href="#/">NaijaGo</a> · Guides</span>' +
      '<h1>Read the city properly</h1><p>Useful local knowledge, without the generic travel-blog language.</p></div>' +
      '<div class="guide-grid">' + NG.GUIDES.map(NG.guideCard).join('') + '</div>' +
    '</div></div>';
  };

  NG.views.guide = function (id) {
    var g = NG.GUIDES.filter(function (x) { return x.id === id; })[0];
    if (!g) return NG.views.notfound();
    return '<div class="page"><div class="wrap" style="max-width:760px">' +
      '<span class="crumb"><a href="#/guides">Guides</a> · ' + esc(g.kicker) + '</span>' +
      '<h1 style="font-size:clamp(32px,4vw,48px);letter-spacing:-2px;margin-bottom:14px">' + esc(g.title) + '</h1>' +
      '<p class="meta" style="margin-bottom:26px">' + esc(g.meta) + '</p>' +
      '<img src="' + img(g.img) + '" alt="" style="width:100%;margin-bottom:28px">' +
      '<p style="font-size:18px;color:var(--n-700)">' + esc(g.blurb) + '</p>' +
      '<p>This prototype carries the guide index, the card treatment and the reading layout. The editorial body is out of scope for the design layer — the dev team drops CMS content into this container.</p>' +
      '<div class="notice notice-ok" style="margin-top:26px"><h4>Prototype note</h4>' +
      '<p>Guide bodies come from the CMS. Everything around them — index, cards, header, meta line — is specified here.</p></div>' +
      '<div style="margin-top:30px">' + NG.adSlot('guide') + '</div>' +
    '</div></div>';
  };

  /* ---- Hosts ----------------------------------------------------------- */
  NG.views.hosts = function () {
    var ids = Object.keys(NG.HOSTS);
    return '<div class="page"><div class="wrap">' +
      '<div class="page-head"><span class="crumb"><a href="#/">NaijaGo</a> · Vendors</span>' +
      '<h1>Verified vendors</h1><p>Every listed host passes identity, payout and experience-quality checks. ' + NG.STATS.hosts + ' hosts are verified across the platform.</p></div>' +
      '<div class="grid-3">' + ids.map(function (i) { return NG.hostCard(NG.HOSTS[i]); }).join('') + '</div>' +
    '</div></div>';
  };

  NG.views.host = function (id) {
    var h = NG.HOSTS[id];
    if (!h) return NG.views.notfound();
    var evs = NG.EXPERIENCES.filter(function (e) { return e.host === id; });
    return '' +
    '<section class="detail-hero" data-over-image style="background-image:url(' + img(h.img) + ');min-height:320px"><div class="wrap">' +
      '<span class="eyebrow">' + esc(h.meta) + '</span>' +
      '<h1>' + esc(h.name) + '</h1>' +
      '<p class="detail-meta">Verified since ' + h.since + ' · ★ ' + h.rating.toFixed(1) + ' · ' + h.events + ' experiences run</p>' +
    '</div></section>' +
    '<div class="page"><div class="wrap">' +
      '<dl class="stat-strip">' +
        '<div><dt>Verified</dt><dd>Identity &amp; payout</dd></div>' +
        '<div><dt>Rating</dt><dd>★ ' + h.rating.toFixed(1) + '</dd></div>' +
        '<div><dt>Guests hosted</dt><dd>' + esc(h.guests) + '</dd></div>' +
        '<div><dt>Replies within</dt><dd>' + h.responseHrs + 'h</dd></div>' +
      '</dl>' +
      '<p style="max-width:60ch;color:var(--n-700);margin-bottom:34px">' + esc(h.blurb) + '</p>' +
      '<h2 style="font-size:26px;margin-bottom:18px">Live experiences</h2>' +
      (evs.length ? '<div class="explore-results">' + evs.map(NG.experienceCard).join('') + '</div>'
                  : '<div class="empty"><h3>Nothing live right now</h3><p>This host has no experiences on sale today.</p></div>') +
    '</div></div>';
  };

  /* ---- Help ------------------------------------------------------------ */
  NG.views.help = function () {
    var qa = [
      ['What exactly do I pay?', 'Face value plus a 5% service fee, shown before you confirm. Two General entries to the Beach Rave are ' + money(30000) + ' plus ' + money(1500) + ', so ' + money(31500) + '. Nothing is added after that.'],
      ['What does the host receive?', 'Hosts pay 8% commission and keep 92%. That is a separate number from your 5% fee — they are never combined into one figure.'],
      ['How long is my seat held?', 'Ten minutes from the moment you start checkout. The timer turns amber with three minutes left. If it runs out the seats go back on sale and you start again.'],
      ['Does my pass work without signal?', 'Yes. The pass is cached on your device once it is issued. 98.4% of entries scan first time.'],
      ['When are refunds paid?', 'Refund windows are set per experience and shown on the booking page before you pay. Refunds return by the rail you paid on.'],
      ['I am on a waitlist. What happens?', 'When a place opens you get two hours to claim it. If the window lapses the place goes to the next person and you return to the back of the queue.']
    ];
    return '<div class="page"><div class="wrap" style="max-width:760px">' +
      '<div class="page-head"><span class="crumb"><a href="#/">NaijaGo</a> · Help</span><h1>Help centre</h1>' +
      '<p>The questions that decide whether someone completes a booking.</p></div>' +
      qa.map(function (r) {
        return '<div class="card card-pad" style="margin-bottom:12px"><h3 style="font-size:18px;margin-bottom:8px">' + esc(r[0]) + '</h3>' +
          '<p style="color:var(--n-700);margin:0">' + esc(r[1]) + '</p></div>';
      }).join('') +
    '</div></div>';
  };

  NG.views.notfound = function () {
    return '<div class="page"><div class="wrap"><div class="empty">' +
      '<h3>That page is not in the prototype</h3>' +
      '<p>Every route that exists is reachable from the header, the footer or the account sidebar.</p>' +
      '<p style="margin-top:18px"><a class="btn" href="#/">Back to the homepage</a></p>' +
    '</div></div></div>';
  };
})(window.NG = window.NG || {});
