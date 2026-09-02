/* ==========================================================================
   NaijaGo — homepage. Reconstructed from the production page: same nine
   sections in the same order, same copy, same numbers.
   ========================================================================== */
(function (NG) {
  'use strict';
  var esc = NG.esc, img = NG.img, money = NG.money;

  NG.views = NG.views || {};

  function opts(list, current) {
    return list.map(function (o) {
      return '<option' + (o === current ? ' selected' : '') + '>' + esc(o) + '</option>';
    }).join('');
  }

  NG.views.home = function () {
    var S = NG.STATS;

    /* ---- Hero ---------------------------------------------------------- */
    var hero = '' +
    '<section class="hero" id="top">' +
      '<div class="hero-media" style="background-image:url(' + img('lagos-water.jpg') + ')" role="presentation"></div>' +
      '<div class="wrap">' +
        '<p class="hero-eyebrow"><span class="pulse" aria-hidden="true"></span>' + esc(S.experiences) + ' experiences live this season</p>' +
        '<h1>Nigeria is happening.<br><em>Go experience it.</em></h1>' +
        '<p class="hero-sub">Real parties, food trails, festivals, concerts and cultural moments — verified, bookable and properly planned.</p>' +

        '<form class="finder" id="finder">' +
          '<div class="finder-field"><label for="f-city">' + NG.icon('location') + 'City</label>' +
            '<select id="f-city" name="city">' + opts(NG.CITIES, NG.state.city) + '</select></div>' +
          '<div class="finder-field"><label for="f-when">' + NG.icon('calendar') + 'When</label>' +
            '<select id="f-when" name="when">' + opts(NG.WHENS, NG.state.when) + '</select></div>' +
          '<div class="finder-field"><label for="f-vibe">' + NG.icon('nightlife') + 'Experience</label>' +
            '<select id="f-vibe" name="vibe">' +
              opts(['Any vibe'].concat(NG.VIBES.map(function (v) { return v.name; })), NG.state.vibe) +
            '</select></div>' +
          '<button class="finder-submit" type="submit">Find my experience <span aria-hidden="true">→</span></button>' +
        '</form>' +

        '<div class="hero-stats">' +
          '<div><strong>' + esc(S.experiences) + '</strong>Experiences</div>' +
          '<div><strong>' + esc(S.hosts) + '</strong>Verified hosts</div>' +
          '<div><strong>' + esc(S.scans) + '</strong>First-try scans</div>' +
        '</div>' +
      '</div>' +
      '<aside class="floating-plan">' +
        '<p class="eyebrow">Your people are going</p>' +
        '<div class="circle-avatars" aria-hidden="true"><span>AO</span><span>KI</span><span>+9</span></div>' +
        '<p>12 people in your circle saved experiences in Lagos this weekend.</p>' +
      '</aside>' +
    '</section>';

    /* ---- 01 Seasons ---------------------------------------------------- */
    var seasons = '' +
    '<section class="section" id="seasons">' +
      '<div class="wrap">' +
        '<div class="section-head"><div>' +
          '<span class="eyebrow"><span class="eyebrow-num">01</span></span>' +
          '<h2>Choose your season</h2>' +
          '<p>Big Nigerian moments, organised so you can arrive with a plan and leave with stories.</p>' +
        '</div><a class="head-link" href="#/seasons">View all seasons →</a></div>' +
        '<div class="season-grid">' + NG.SEASONS.map(NG.seasonCard).join('') + '</div>' +
      '</div>' +
    '</section>';

    /* ---- 02 This weekend ----------------------------------------------- */
    var chips = ['All', 'Tonight', 'Weekend', 'Free entry', 'Outdoors'].map(function (c, i) {
      return '<button class="chip" type="button" data-homefilter="' + esc(c.toLowerCase()) + '" aria-pressed="' + (i === 0) + '">' + esc(c) + '</button>';
    }).join('');

    var weekend = '' +
    '<section class="section-tight" id="experiences">' +
      '<div class="wrap">' +
        '<div class="section-head"><div>' +
          '<span class="eyebrow"><span class="eyebrow-num">02</span></span>' +
          '<h2>This weekend</h2>' +
          '<p>Start with what is actually happening, then narrow it down.</p>' +
        '</div><a class="head-link" href="#/explore">' + NG.LAGOS_TOTAL + ' in Lagos →</a></div>' +
        '<div class="filter-bar">' +
          '<div class="chips" role="group" aria-label="Filter this weekend">' + chips + '</div>' +
          '<p class="showing" id="showing-count">Showing 8 picks</p>' +
        '</div>' +
        '<div class="experience-grid" id="home-grid">' + NG.EXPERIENCES.map(NG.experienceCard).join('') + '</div>' +
        '<div class="load-more"><a class="btn" href="#/explore">Load more experiences</a></div>' +
      '</div>' +
    '</section>';

    /* ---- 03 Follow the vibe -------------------------------------------- */
    var vibes = '' +
    '<section class="section vibe-section on-ink" id="discover">' +
      '<div class="wrap">' +
        '<div class="section-head"><div>' +
          '<span class="eyebrow"><span class="eyebrow-num">03</span></span>' +
          '<h2>Follow the vibe</h2>' +
          '<p style="color:rgba(255,255,255,.82)">Choose the feeling first. We will handle the logistics.</p>' +
        '</div></div>' +
        '<div class="vibe-grid">' +
          NG.VIBES.map(function (v) {
            return '<button class="vibe" type="button" data-go="#/explore?vibe=' + v.id + '">' +
              '<span class="vibe-brand-icon" aria-hidden="true">' + NG.icon(v.icon) + '</span>' +
              '<h3>' + esc(v.name) + '</h3>' +
              '<span class="data">' + v.count + ' live</span>' +
            '</button>';
          }).join('') +
        '</div>' +
      '</div>' +
    '</section>';

    /* ---- Go with confidence -------------------------------------------- */
    var trust = '' +
    '<section class="section">' +
      '<div class="wrap"><div class="trust-grid">' +
        '<div class="trust-lead">' +
          '<h2>Go with confidence.</h2>' +
          '<p>NaijaGo is built for the realities of going out in Nigeria: clear pricing, verified hosts, useful timing and a pass that works when the network does not.</p>' +
        '</div>' +
        '<div class="trust-cell">' +
          '<span class="trust-brand-icon" aria-hidden="true">' + NG.icon('ticket') + '</span>' +
          '<span class="eyebrow">Trust is a product feature</span>' +
          '<p class="trust-number">' + esc(S.scans) + '</p>' +
          '<h3>' + esc(S.scansLabel) + '</h3>' +
          '<p>Your pass is cached on your phone, so a crowded venue and poor signal do not become your problem.</p>' +
        '</div>' +
        '<div class="trust-cell">' +
          '<span class="trust-brand-icon" aria-hidden="true">' + NG.icon('safety') + '</span>' +
          '<span class="eyebrow">Trust is a product feature</span>' +
          '<p class="trust-number">' + esc(S.feesFigure) + '</p>' +
          '<h3>' + esc(S.feesLabel) + '</h3>' +
          '<p>The total you see before checkout is the total you pay. Refund rules are written in plain language.</p>' +
        '</div>' +
      '</div></div>' +
    '</section>';

    /* ---- 04 Guides ------------------------------------------------------ */
    var guides = '' +
    '<section class="section-tight" id="guides">' +
      '<div class="wrap">' +
        '<div class="section-head"><div>' +
          '<span class="eyebrow"><span class="eyebrow-num">04</span></span>' +
          '<h2>Read the city properly</h2>' +
          '<p>Useful local knowledge, without the generic travel-blog language.</p>' +
        '</div><a class="head-link" href="#/guides">All guides →</a></div>' +
        '<div class="guide-grid">' + NG.GUIDES.map(NG.guideCard).join('') + '</div>' +
      '</div>' +
    '</section>';

    /* ---- Field kit ------------------------------------------------------ */
    var kit = '' +
    '<section class="section field-kit">' +
      '<div class="wrap"><div class="field-kit-grid">' +
        '<div class="kit-copy">' +
          '<span class="eyebrow">The NaijaGo field kit</span>' +
          '<h2>Plan less.<br>Walk in ready.</h2>' +
          '<p>The useful details stay with you after you leave the app: a city guide shaped by locals and an entry pass designed for a quick, confident arrival.</p>' +
          '<ul class="kit-list">' +
            '<li><b aria-hidden="true">' + NG.icon('guide') + '</b><span>Local recommendations, arranged by mood</span></li>' +
            '<li><b aria-hidden="true">' + NG.icon('location') + '</b><span>Clear arrival notes and neighbourhood context</span></li>' +
            '<li><b aria-hidden="true">' + NG.icon('ticket') + '</b><span>Fast entry even when the network is busy</span></li>' +
          '</ul>' +
          '<a class="kit-link" href="#/guide/three-moods">Preview the Lagos guide →</a>' +
        '</div>' +
        '<div class="kit-gallery">' +
          '<figure class="kit-tile" style="background-image:url(' + img('beach-rave.jpg') + ')"><figcaption>Your pass · ready at the gate</figcaption></figure>' +
          '<figure class="kit-tile" style="background-image:url(' + img('lagos-water.jpg') + ')"><figcaption>Lagos · read it properly</figcaption></figure>' +
        '</div>' +
      '</div></div>' +
    '</section>';

    /* ---- Hosts ---------------------------------------------------------- */
    var hostIds = ['eko-wave', 'food-trails', 'terra'];
    var hosts = '' +
    '<section class="section" id="hosts">' +
      '<div class="wrap"><div class="host-strip">' +
        '<div class="host-lead">' +
          '<span class="eyebrow">Verified vendors</span>' +
          '<h2>Hosted by people who know what they are doing.</h2>' +
          '<p>Every listed host passes identity, payout and experience-quality checks.</p>' +
        '</div>' +
        hostIds.map(function (id) { return NG.hostCard(NG.HOSTS[id]); }).join('') +
      '</div></div>' +
    '</section>';

    /* ---- CTA ------------------------------------------------------------ */
    var cta = '' +
    '<section class="cta">' +
      '<div class="wrap">' +
        '<h2>Your next story is already happening.</h2>' +
        '<p>Tell us your city, dates and kind of vibe. We will turn it into a weekend worth leaving the house for.</p>' +
        '<a class="btn btn-lg" href="#/plan">Plan my weekend <span aria-hidden="true">→</span></a>' +
      '</div>' +
    '</section>';

    return hero + seasons + weekend + vibes + trust + guides + kit + hosts + cta;
  };
})(window.NG = window.NG || {});
