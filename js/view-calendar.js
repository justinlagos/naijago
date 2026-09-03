/* ==========================================================================
   NaijaGo — unified experience calendar.
   ========================================================================== */
(function (NG) {
  'use strict';
  var esc = NG.esc;
  NG.views = NG.views || {};

  var MONTHS = [
    { id: '2026-08', name: 'August 2026', days: 31, offset: 5 },
    { id: '2026-09', name: 'September 2026', days: 30, offset: 1 },
    { id: '2026-10', name: 'October 2026', days: 31, offset: 3 }
  ];

  function currentMonth() {
    return MONTHS.filter(function (m) { return m.id === NG.state.calendarMonth; })[0] || MONTHS[1];
  }

  function monthButton(month, label) {
    return month ? '<button type="button" data-calendar-month="' + month.id + '" aria-label="' + label + ' ' + month.name + '">' + (label === 'Previous' ? '←' : '→') + '</button>' : '<span></span>';
  }

  NG.views.calendar = function () {
    var month = currentMonth();
    var idx = MONTHS.indexOf(month);
    var selected = NG.state.calendarDay;
    var cells = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(function (d) { return '<div class="calendar-weekday">' + d + '</div>'; }).join('');
    for (var blank = 0; blank < month.offset; blank++) cells += '<div class="calendar-cell is-empty" aria-hidden="true"></div>';
    for (var d = 1; d <= month.days; d++) {
      var iso = month.id + '-' + String(d).padStart(2, '0');
      var events = NG.EXPERIENCES.filter(function (e) { return e.dateISO === iso; });
      var isSelected = selected === iso;
      cells += '<button class="calendar-cell' + (events.length ? ' has-events' : '') + '" type="button" data-calendar-day="' + iso + '" aria-pressed="' + isSelected + '" aria-label="' + d + ' ' + month.name + ', ' + events.length + ' experiences">' +
        '<span class="calendar-number">' + d + '</span>' +
        (events.length ? '<span class="calendar-markers" aria-hidden="true">' + events.map(function (e) { return '<i class="' + e.vibe + '"></i>'; }).join('') + '</span><span class="calendar-event-name">' + esc(events[0].title) + '</span>' : '') +
      '</button>';
    }

    var selectedEvents = NG.EXPERIENCES.filter(function (e) { return e.dateISO === selected; });
    var selectedLabel = new Date(selected + 'T12:00:00').toLocaleDateString('en-NG', { weekday: 'long', day: 'numeric', month: 'long' });
    var results = selectedEvents.length
      ? '<div class="calendar-results">' + selectedEvents.map(NG.experienceCard).join('') + '</div>'
      : '<div class="calendar-empty"><span>' + NG.icon('calendar') + '</span><div><h3>No listed experience on this day</h3><p>Choose a marked date, or browse the full month without losing your place.</p></div><a class="btn" href="#/explore">Browse all</a></div>';

    return '<section class="calendar-hero on-ink"><div class="wrap">' +
      '<span class="eyebrow">One calendar · every way to go out</span><h1>See the month.<br><em>Shape your Lagos.</em></h1>' +
      '<p>Concerts, culture, food, festivals and small discoveries—together, so your plans make sense before you book.</p>' +
      '<div class="calendar-hero-stats"><span><strong>8</strong> prototype listings</span><span><strong>3</strong> months</span><span><strong>1</strong> clear plan</span></div>' +
    '</div></section>' +
    '<div class="page calendar-page"><div class="wrap">' +
      '<div class="calendar-layout">' +
        '<aside class="calendar-filters"><span class="eyebrow">Shape your guide</span><h2>What kind of day?</h2>' +
          '<label class="field"><span>Vibe</span><select><option>Everything</option>' + NG.VIBES.map(function (v) { return '<option>' + esc(v.name) + '</option>'; }).join('') + '</select></label>' +
          '<label class="field"><span>Area</span><select><option>All Lagos</option>' + NG.AREAS.map(function (a) { return '<option>' + esc(a.name) + '</option>'; }).join('') + '</select></label>' +
          '<label class="field"><span>Listing type</span><select><option>Events + experiences</option><option>Free entry</option><option>Ticketed</option></select></label>' +
          '<p class="calendar-filter-note">Marked days have something live. Select one to see the useful details below.</p>' +
        '</aside>' +
        '<section class="calendar-board" aria-label="Experience calendar">' +
          '<header class="calendar-toolbar">' + monthButton(MONTHS[idx - 1], 'Previous') + '<div><span>Browse by date</span><h2>' + esc(month.name) + '</h2></div>' + monthButton(MONTHS[idx + 1], 'Next') + '</header>' +
          '<div class="calendar-grid">' + cells + '</div>' +
          '<div class="calendar-legend"><span><i class="night"></i> Nightlife</span><span><i class="food"></i> Food</span><span><i class="culture"></i> Culture</span><span><i class="outdoors"></i> Outdoors</span></div>' +
        '</section>' +
      '</div>' +
      NG.adSlot('calendar') +
      '<section class="calendar-day-panel"><div class="section-head"><div><span class="eyebrow">Selected date</span><h2>' + esc(selectedLabel) + '</h2><p>' + (selectedEvents.length ? selectedEvents.length + ' experience' + (selectedEvents.length === 1 ? '' : 's') + ' ready to explore.' : 'Keep the day open or look nearby.') + '</p></div><a class="head-link" href="#/explore">See every experience →</a></div>' + results + '</section>' +
    '</div></div>';
  };
})(window.NG = window.NG || {});
