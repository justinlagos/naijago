/* ==========================================================================
   NaijaGo — account area: overview, bookings, passes, saved, plans,
   notifications, reviews, settings.
   ========================================================================== */
(function (NG) {
  'use strict';
  var esc = NG.esc, img = NG.img, money = NG.money;
  NG.views = NG.views || {};

  var TABS = [
    ['#/account', 'Overview', null, 'trending'],
    ['#/account/bookings', 'Bookings', null, 'calendar'],
    ['#/account/passes', 'Passes', null, 'ticket'],
    ['#/account/saved', 'Saved', 'saved', 'saved'],
    ['#/account/plans', 'Plans', null, 'map'],
    ['#/account/notifications', 'Notifications', 'unread', 'nearby'],
    ['#/account/reviews', 'Reviews', null, 'friends'],
    ['#/account/settings', 'Settings', null, 'safety']
  ];

  function shell(route, inner) {
    var side = '<nav class="side-nav" aria-label="Account">' + TABS.map(function (t) {
      var n = t[2] === 'saved' ? NG.savedCount() : t[2] === 'unread' ? NG.unreadCount() : 0;
      return '<a href="' + t[0] + '"' + (route === t[0] ? ' aria-current="page"' : '') + '>' +
        '<span class="side-label">' + NG.icon(t[3]) + esc(t[1]) + '</span>' + (n ? '<span class="pill num">' + n + '</span>' : '') + '</a>';
    }).join('') + '</nav>';
    return '<div class="page"><div class="wrap"><div class="account-grid">' + side + '<div>' + inner + '</div></div></div></div>';
  }

  function guard() {
    if (!NG.state.signedIn) {
      NG.state.intent = { kind: 'account', back: location.hash };
      NG.go('#/login');
      return true;
    }
    return false;
  }

  /* ---- Overview --------------------------------------------------------- */
  NG.views.account = function () {
    if (guard()) return '';
    var u = NG.state.user;
    var b = NG.REFERENCE_BOOKING, e = NG.byId(b.experience);
    var next = 1500, pct = Math.min(100, Math.round(u.points / next * 100));

    return shell('#/account',
      '<div class="page-head"><h1 style="font-size:38px">' + esc(u.name.split(' ')[0]) + '</h1>' +
      '<p>' + esc(u.email) + ' · member since 2024</p></div>' +

      '<div class="grid-3" style="margin-bottom:26px">' +
        '<div class="card card-pad"><span class="metric-icon">' + NG.icon('trending') + '</span><p class="eyebrow">Points</p><p class="trust-number" style="font-size:38px">' + u.points.toLocaleString('en-NG') + '</p>' +
          '<div class="progress" style="margin-top:10px"><i style="width:' + pct + '%"></i></div>' +
          '<p class="meta" style="margin-top:8px">' + (next - u.points) + ' to your next reward</p></div>' +
        '<div class="card card-pad"><span class="metric-icon">' + NG.icon('calendar') + '</span><p class="eyebrow">Upcoming</p><p class="trust-number" style="font-size:38px">1</p>' +
          '<p class="meta" style="margin-top:8px">' + esc(e.when) + '</p></div>' +
        '<div class="card card-pad"><span class="metric-icon">' + NG.icon('saved') + '</span><p class="eyebrow">Saved</p><p class="trust-number" style="font-size:38px">' + NG.savedCount() + '</p>' +
          '<p class="meta" style="margin-top:8px">' + (NG.savedCount() ? 'Ready when you are' : 'Nothing saved yet') + '</p></div>' +
      '</div>' +

      '<h2 style="font-size:24px;margin-bottom:14px">Next up</h2>' +
      bookingRow(b, e) +

      '<h2 style="font-size:24px;margin:34px 0 14px">Recent activity</h2>' +
      '<ul class="timeline">' +
        '<li><time>Today 14:38</time><p>A cabana opened for you on the Beach Rave waitlist. Two hours to claim.</p></li>' +
        '<li><time>Mon 31 Aug</time><p>Bank transfer of ' + money(b.total) + ' confirmed for ' + esc(b.ref) + '. ' + b.points + ' points pending.</p></li>' +
        '<li><time>Fri 28 Aug</time><p>Booked ' + b.qty + ' × General entry to ' + esc(e.title) + '.</p></li>' +
      '</ul>'
    );
  };

  function bookingRow(b, e) {
    return '<div class="booking-row">' +
      '<div class="booking-thumb" style="background-image:url(' + img(e.img) + ')" role="presentation"></div>' +
      '<div><h3>' + esc(e.title) + '</h3>' +
        '<p class="meta">' + esc(e.when) + ' · ' + b.qty + ' × General entry · ' + esc(b.ref) + '</p></div>' +
      '<div class="stack" style="text-align:right">' +
        '<span class="price num">' + money(b.total) + '</span>' +
        '<a class="btn btn-quiet" href="#/pass/' + esc(b.ref) + '">Open pass</a>' +
      '</div>' +
    '</div>';
  }

  /* ---- Bookings --------------------------------------------------------- */
  NG.views.bookings = function () {
    if (guard()) return '';
    var b = NG.REFERENCE_BOOKING, e = NG.byId(b.experience);
    return shell('#/account/bookings',
      '<div class="page-head"><h1 style="font-size:38px">Bookings</h1><p>Everything you have paid for, upcoming first.</p></div>' +
      '<div class="tabs" role="tablist">' +
        '<button class="tab" role="tab" aria-selected="true">Upcoming</button>' +
        '<button class="tab" role="tab" aria-selected="false">Past</button>' +
        '<button class="tab" role="tab" aria-selected="false">Cancelled</button>' +
      '</div>' +
      bookingRow(b, e) +
      '<div class="card card-pad" style="margin-top:20px">' +
        '<h3 style="font-size:17px;margin-bottom:12px">What you paid</h3>' +
        '<div class="summary-line"><span>' + b.qty + ' × General entry</span><span class="num">' + money(b.face) + '</span></div>' +
        '<div class="summary-line"><span>Service fee (5%)</span><span class="num">' + money(b.fee) + '</span></div>' +
        '<div class="summary-line" style="border-top:1px solid var(--n-200);margin-top:8px;padding-top:12px;font-weight:750"><span>Total</span><span class="num">' + money(b.total) + '</span></div>' +
        '<p class="field-hint">Paid by bank transfer on ' + esc(b.paidAt) + '.</p>' +
      '</div>'
    );
  };

  /* ---- Passes ----------------------------------------------------------- */
  NG.views.passes = function () {
    if (guard()) return '';
    var b = NG.REFERENCE_BOOKING, e = NG.byId(b.experience);
    return shell('#/account/passes',
      '<div class="page-head"><h1 style="font-size:38px">Passes</h1>' +
      '<p>Cached on this device. They scan whether or not you have signal.</p></div>' +
      bookingRow(b, e) +
      '<div class="notice notice-ok" style="margin-top:18px"><h4>Cached and ready</h4>' +
      '<p>Your pass was downloaded when it was issued. Losing signal at the venue does not affect it.</p></div>'
    );
  };

  /* ---- Saved ------------------------------------------------------------ */
  NG.views.saved = function () {
    if (guard()) return '';
    var ids = Object.keys(NG.state.saved);
    var body = ids.length
      ? '<div class="explore-results">' + ids.map(function (i) { return NG.experienceCard(NG.byId(i)); }).join('') + '</div>'
      : '<div class="empty"><h3>Nothing saved yet</h3>' +
        '<p>The heart on any experience card puts it here. Saving does not hold a seat — it just keeps the option in one place.</p>' +
        '<p style="margin-top:18px"><a class="btn" href="#/explore">Find something</a></p></div>';
    return shell('#/account/saved',
      '<div class="page-head"><h1 style="font-size:38px">Saved</h1>' +
      '<p>' + (ids.length ? ids.length + ' saved. Saving does not hold a seat.' : 'Nothing here yet.') + '</p></div>' + body);
  };

  /* ---- Plans ------------------------------------------------------------ */
  NG.views.plans = function () {
    if (guard()) return '';
    var p = NG.PLAN;
    return shell('#/account/plans',
      '<div class="page-head"><h1 style="font-size:38px">' + esc(p.name) + '</h1>' +
      '<p>' + esc(p.city) + ' · ' + p.days.reduce(function (a, d) { return a + d.items.length; }, 0) + ' things booked or saved</p></div>' +
      '<div class="notice notice-stop" style="margin-bottom:20px"><h4>Two of these clash</h4>' +
      '<p>' + esc(p.clashNote) + '</p></div>' +
      p.days.map(function (d) {
        return '<div class="plan-day"><h3>' + esc(d.date) + '</h3>' +
          d.items.map(function (it) {
            return '<div class="plan-item' + (it.clash ? ' clash' : '') + '">' +
              '<time>' + esc(it.time) + '</time>' +
              '<div><a href="#/experience/' + it.id + '"><strong>' + esc(it.title) + '</strong></a>' +
                '<span class="meta" style="display:block">' + esc(it.place) + '</span></div>' +
              (it.clash ? '<span class="tag tag-stop">Clash</span>' : '<span class="tag tag-quiet">OK</span>') +
            '</div>';
          }).join('') + '</div>';
      }).join('') +
      '<a class="btn" href="#/explore" style="margin-top:8px">Add something else</a>'
    );
  };

  /* ---- Notifications ---------------------------------------------------- */
  NG.views.notifications = function () {
    if (guard()) return '';
    return shell('#/account/notifications',
      '<div class="page-head"><h1 style="font-size:38px">Notifications</h1>' +
      '<p>' + NG.unreadCount() + ' unread. Newest first.</p></div>' +
      NG.NOTIFICATIONS.map(function (n) {
        return '<div class="notif" data-unread="' + n.unread + '">' +
          '<span class="notif-dot" aria-hidden="true"></span>' +
          '<div><h3 style="font-size:16px;margin-bottom:5px"><a href="' + n.to + '">' + esc(n.title) + '</a></h3>' +
            '<p style="font-size:14px;color:var(--n-700);margin:0">' + esc(n.body) + '</p></div>' +
          '<span class="meta" style="white-space:nowrap">' + esc(n.at) + '</span>' +
        '</div>';
      }).join('') +
      '<button class="btn btn-quiet" type="button" data-readall style="margin-top:18px">Mark everything read</button>'
    );
  };

  /* ---- Reviews ---------------------------------------------------------- */
  NG.views.reviews = function () {
    if (guard()) return '';
    var e = NG.byId('suya-jazz');
    return shell('#/account/reviews',
      '<div class="page-head"><h1 style="font-size:38px">Reviews</h1>' +
      '<p>You can review an experience for 14 days after you attend it.</p></div>' +
      '<div class="card card-pad">' +
        '<p class="eyebrow">Waiting on you</p>' +
        '<h3 style="font-size:20px;margin-bottom:6px">' + esc(e.title) + '</h3>' +
        '<p class="meta" style="margin-bottom:18px">You went on Wednesday 26 August · 6 days left to review</p>' +
        '<div class="stars" role="group" aria-label="Rating">' +
          [1, 2, 3, 4, 5].map(function (i) {
            return '<button type="button" data-star="' + i + '" data-on="false" aria-label="' + i + ' star' + (i > 1 ? 's' : '') + '">★</button>';
          }).join('') +
        '</div>' +
        '<label class="field" style="margin-top:16px"><span>What should the next person know?</span>' +
          '<textarea placeholder="The useful detail, not the adjectives."></textarea></label>' +
        '<button class="btn btn-primary" type="button" data-review>Post review</button>' +
      '</div>' +
      '<h2 style="font-size:22px;margin:30px 0 14px">Already posted</h2>' +
      '<div class="card card-pad">' +
        '<p style="font-weight:650;margin-bottom:4px">★★★★★ Lagos Street Food Safari</p>' +
        '<p class="meta" style="margin-bottom:10px">Posted 14 August</p>' +
        '<p style="color:var(--n-700);margin:0">Stop four is the one. Go hungry and skip lunch — this is lunch.</p>' +
      '</div>'
    );
  };

  /* ---- Settings --------------------------------------------------------- */
  NG.views.settings = function () {
    if (guard()) return '';
    var u = NG.state.user;
    function toggle(label, hint, on) {
      return '<div class="row-between" style="padding:16px 0;border-bottom:1px solid var(--n-200)">' +
        '<div><strong style="display:block;font-size:15px">' + esc(label) + '</strong>' +
          '<span class="meta">' + esc(hint) + '</span></div>' +
        '<button class="btn ' + (on ? 'btn-ink' : 'btn-quiet') + '" type="button" data-toggle aria-pressed="' + on + '">' +
          (on ? 'On' : 'Off') + '</button></div>';
    }
    return shell('#/account/settings',
      '<div class="page-head"><h1 style="font-size:38px">Settings</h1></div>' +
      '<div class="card card-pad" style="margin-bottom:20px">' +
        '<label class="field"><span>Name</span><input type="text" value="' + esc(u.name) + '"></label>' +
        '<label class="field"><span>Email</span><input type="email" value="' + esc(u.email) + '" autocomplete="email"></label>' +
        '<label class="field"><span>Phone</span><input type="tel" placeholder="+234" autocomplete="tel"></label>' +
        '<button class="btn btn-primary" type="button" data-save-settings>Save changes</button>' +
      '</div>' +
      '<div class="card card-pad">' +
        '<h3 style="font-size:17px;margin-bottom:6px">Notifications</h3>' +
        toggle('Waitlist offers', 'The only one that is time-critical. Two hours to claim.', true) +
        toggle('Booking reminders', 'The morning of, and an hour before doors.', true) +
        toggle('New in your city', 'A weekly digest, not a daily one.', false) +
        toggle('Host replies', 'When a host answers your question.', true) +
      '</div>' +
      '<div class="card card-pad" style="margin-top:20px">' +
        '<h3 style="font-size:17px;margin-bottom:10px">Your data</h3>' +
        '<p style="color:var(--n-700);font-size:14px">NDPR-minded: you can export everything we hold or close the account and have it removed.</p>' +
        '<div class="row" style="margin-top:14px"><button class="btn btn-quiet" type="button">Export my data</button>' +
        '<button class="btn btn-danger" type="button">Close my account</button></div>' +
      '</div>' +
      '<button class="btn btn-quiet btn-block" type="button" data-signout style="margin-top:20px">Sign out</button>'
    );
  };
})(window.NG = window.NG || {});
