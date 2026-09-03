/* ==========================================================================
   NaijaGo — self-serve advertising prototype: inventory → creative → owner
   review → payment → live campaign.
   ========================================================================== */
(function (NG) {
  'use strict';
  var esc = NG.esc, money = NG.money;
  NG.views = NG.views || {};

  var FORMATS = [
    { id: 'leaderboard', name: 'Editorial leaderboard', size: '970 × 250 / 320 × 100', place: 'Homepage between discovery chapters', price: 650000 },
    { id: 'native', name: 'Native discovery card', size: '1200 × 900 · 4:3', place: 'Explore results after three organic cards', price: 450000 },
    { id: 'calendar', name: 'Calendar sponsor', size: '728 × 90 / 320 × 100', place: 'Below the monthly planning grid', price: 380000 },
    { id: 'guide', name: 'Guide story placement', size: '1080 × 1350 · 4:5', place: 'Inside relevant editorial guides', price: 520000 }
  ];

  function steps(active) {
    return '<ol class="ad-steps">' + ['Creative', 'Owner review', 'Payment', 'Live'].map(function (s, i) {
      return '<li data-state="' + (i < active ? 'done' : i === active ? 'current' : 'next') + '"><b>' + (i + 1) + '</b><span>' + s + '</span></li>';
    }).join('') + '</ol>';
  }

  function formatById(id) { return FORMATS.filter(function (f) { return f.id === id; })[0] || FORMATS[1]; }

  NG.views.advertise = function () {
    return '<section class="ad-sales-hero on-ink"><div class="wrap"><span class="eyebrow">NaijaGo for brands</span><h1>Earn attention by<br><em>adding to the plan.</em></h1><p>Paid placements built around useful moments, not interruptions. Every ad is labelled, reviewed and measured.</p><div class="row"><a class="btn btn-primary btn-lg" href="#/advertise/create">Start a campaign</a><a class="btn btn-lg" href="#/advertise/campaigns">Campaign dashboard</a></div></div></section>' +
      '<div class="page"><div class="wrap"><div class="section-head"><div><span class="eyebrow">Inventory</span><h2>Four placements. One standard.</h2><p>Responsive formats made to fit the product while protecting the trust of the experience around them.</p></div></div>' +
      '<div class="ad-format-grid">' + FORMATS.map(function (f) { return '<article class="ad-format-card"><div class="ad-format-demo ' + f.id + '"><span>Sponsored</span></div><div><span class="eyebrow">' + esc(f.size) + '</span><h3>' + esc(f.name) + '</h3><p>' + esc(f.place) + '</p><strong>From ' + money(f.price) + '</strong></div></article>'; }).join('') + '</div>' +
      '<div class="ad-principles"><div><span>01</span><h3>Context first</h3><p>Campaigns are matched to the page, date and city—not dropped everywhere.</p></div><div><span>02</span><h3>Human reviewed</h3><p>Platform owners approve creative, destination and claims before money is taken.</p></div><div><span>03</span><h3>Clear reporting</h3><p>Impressions, clicks, spend and status stay visible in one campaign record.</p></div></div>' +
      '</div></div>';
  };

  NG.views.advertiseCreate = function () {
    var c = NG.state.adCampaign;
    return '<div class="page"><div class="wrap ad-flow-wrap">' + steps(0) + '<div class="page-head"><span class="crumb"><a href="#/advertise">Advertise</a> · New campaign</span><h1>Build the placement</h1><p>Upload once, preview immediately and send the complete campaign to the NaijaGo review team.</p></div>' +
      '<div class="ad-builder"><form class="card card-pad" id="ad-campaign-form">' +
        '<label class="field"><span>Campaign name</span><input name="name" required value="' + esc(c.name) + '"></label>' +
        '<label class="field"><span>Placement</span><select name="format">' + FORMATS.map(function (f) { return '<option value="' + f.id + '"' + (f.id === c.format ? ' selected' : '') + '>' + esc(f.name) + ' · ' + esc(f.size) + '</option>'; }).join('') + '</select></label>' +
        '<label class="field"><span>Creative headline</span><input name="title" required value="' + esc(c.title) + '" maxlength="52"><small class="field-hint">Keep it useful and under 52 characters.</small></label>' +
        '<label class="field"><span>Destination URL</span><input name="destination" required type="url" value="' + esc(c.destination) + '"></label>' +
        '<div class="grid-2"><label class="field"><span>Starts</span><input name="start" type="date" value="' + c.start + '" required></label><label class="field"><span>Ends</span><input name="end" type="date" value="' + c.end + '" required></label></div>' +
        '<label class="field"><span>Total budget (₦)</span><input name="budget" type="number" min="150000" step="10000" value="' + c.budget + '" required><small class="field-hint">Minimum campaign budget: ₦150,000.</small></label>' +
        '<label class="upload-zone" for="ad-creative-input"><span>' + NG.icon('guide') + '</span><strong>Upload campaign artwork</strong><small>JPG or PNG · up to 10 MB · use the dimensions shown for your placement</small><input class="sr" id="ad-creative-input" type="file" accept=".jpg,.jpeg,.png,image/jpeg,image/png"><em id="ad-creative-status">No file selected</em></label>' +
        '<button class="btn btn-primary btn-lg btn-block" type="submit">Send for owner review →</button>' +
      '</form><aside class="ad-live-preview"><span class="eyebrow">Placement preview</span><div id="ad-creative-preview" class="ad-preview-art"' + (c.creativeUrl ? ' style="background-image:url(&quot;' + c.creativeUrl + '&quot;)"' : '') + '><span>Sponsored</span><strong>' + esc(c.title) + '</strong></div><p><b>Review checks:</b> correct dimensions, truthful claims, legible safe area, suitable destination and brand fit.</p></aside></div></div></div>';
  };

  NG.views.advertiseReview = function () {
    var c = NG.state.adCampaign, approved = c.status === 'approved' || c.status === 'live';
    return '<div class="page"><div class="wrap ad-flow-wrap">' + steps(1) + '<div class="page-head"><span class="crumb">Campaign review</span><h1>' + (approved ? 'Approved to run' : 'With the platform owners') + '</h1><p>' + (approved ? 'Creative and destination passed review. Payment unlocks the booked inventory.' : 'A human checks the audience fit, creative, claims and landing page before payment.') + '</p></div>' +
      '<div class="checkout-grid"><div class="card card-pad"><h2 class="icon-heading">' + NG.icon(approved ? 'safety' : 'guide') + (approved ? 'Review complete' : 'Owner review queue') + '</h2><ul class="timeline" style="margin-top:24px"><li><time>Now</time><strong>Campaign submitted</strong><p class="meta">Creative, URL and dates locked for review.</p></li><li><time>Within 1 working day</time><strong>Platform policy review</strong><p class="meta">Claims, artwork, relevance and destination checked by an owner.</p></li><li><time>After approval</time><strong>Payment requested</strong><p class="meta">No payment is collected before approval.</p></li></ul>' + (approved ? '<a class="btn btn-primary btn-lg" href="#/advertise/payment">Continue to payment →</a>' : '<button class="btn btn-ink" type="button" data-ad-approve>Prototype: owner approves</button>') + '</div>' +
      '<aside class="card card-pad"><span class="eyebrow">Campaign summary</span><h3>' + esc(c.name) + '</h3><p>' + esc(formatById(c.format).name) + '</p><div class="summary-line"><span>Dates</span><strong>' + esc(c.start) + ' → ' + esc(c.end) + '</strong></div><div class="summary-line"><span>Budget</span><strong>' + money(c.budget) + '</strong></div><div class="summary-line"><span>Status</span><span class="tag ' + (approved ? 'tag-ok' : 'tag-warn') + '">' + (approved ? 'Approved' : 'In review') + '</span></div></aside></div></div></div>';
  };

  NG.views.advertisePayment = function () {
    var c = NG.state.adCampaign;
    if (c.status !== 'approved' && c.status !== 'live') { NG.go('#/advertise/review'); return ''; }
    return '<div class="page"><div class="wrap ad-flow-wrap">' + steps(2) + '<div class="page-head"><span class="crumb">Campaign payment</span><h1>Secure the inventory</h1><p>The campaign is approved. Complete the simulated transaction to schedule it.</p></div><div class="checkout-grid"><div class="card card-pad"><h2 style="font-size:24px;margin-bottom:18px">Payment method</h2><button class="rail" type="button" data-selected="true"><span>●</span><span><strong>Nigerian card</strong><small class="meta">Visa · Mastercard · Verve</small></span><span class="rail-logo">Secure</span></button><button class="rail" type="button"><span>○</span><span><strong>Bank transfer</strong><small class="meta">Reserved for 30 minutes</small></span><span class="rail-logo">NIP</span></button><button class="btn btn-primary btn-lg btn-block" type="button" data-ad-pay style="margin-top:22px">Pay ' + money(c.budget) + ' →</button></div><aside class="card card-pad"><span class="eyebrow">Transaction</span><div class="summary-line"><span>Campaign budget</span><strong>' + money(c.budget) + '</strong></div><div class="summary-line"><span>Platform tax</span><strong>Included</strong></div><div class="summary-line grand"><span>Total</span><strong>' + money(c.budget) + '</strong></div><p class="meta" style="margin-top:16px">Prototype only. No money is collected.</p></aside></div></div></div>';
  };

  NG.views.advertiseConfirmed = function () {
    var c = NG.state.adCampaign;
    return '<div class="page"><div class="wrap ad-flow-wrap">' + steps(3) + '<div class="confirmation"><span class="confirmation-mark">' + NG.icon('safety') + '</span><span class="eyebrow">Campaign NG-AD-1048</span><h1>Booked. Reviewed. Ready.</h1><p>' + esc(c.name) + ' is scheduled for ' + esc(c.start) + ' to ' + esc(c.end) + '. Reporting begins when the first impression is served.</p><div class="row"><a class="btn btn-primary btn-lg" href="#/advertise/campaigns">Open campaign dashboard</a><a class="btn btn-lg" href="#/">See live placements</a></div></div></div></div>';
  };

  NG.views.advertiseCampaigns = function () {
    var c = NG.state.adCampaign;
    return '<div class="page"><div class="wrap"><div class="page-head"><span class="crumb"><a href="#/advertise">Advertise</a> · Dashboard</span><h1>Campaigns</h1><p>Budget, delivery and approval status in one calm view.</p></div><dl class="kpi-grid"><div class="kpi"><dt>Impressions</dt><dd>48.2k</dd><span class="delta up">On pace</span></div><div class="kpi"><dt>Clicks</dt><dd>1,736</dd><span class="delta">3.6% CTR</span></div><div class="kpi"><dt>Spend</dt><dd style="font-size:24px">' + money(Math.round(c.budget * .64)) + '</dd><span class="delta">64% delivered</span></div><div class="kpi"><dt>Status</dt><dd style="font-size:24px">' + (c.status === 'live' ? 'Live' : 'Draft') + '</dd><span class="delta up">Policy approved</span></div></dl><table class="data"><thead><tr><th>Campaign</th><th>Placement</th><th>Dates</th><th class="num">Budget</th><th>Status</th></tr></thead><tbody><tr><td><strong>' + esc(c.name) + '</strong></td><td>' + esc(formatById(c.format).name) + '</td><td>' + esc(c.start) + ' → ' + esc(c.end) + '</td><td class="num">' + money(c.budget) + '</td><td><span class="tag ' + (c.status === 'live' ? 'tag-ok' : 'tag-quiet') + '">' + (c.status === 'live' ? 'Live' : esc(c.status)) + '</span></td></tr></tbody></table><a class="btn btn-primary" href="#/advertise/create" style="margin-top:20px">Create another campaign</a></div></div>';
  };
})(window.NG = window.NG || {});
