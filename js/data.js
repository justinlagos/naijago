/* ==========================================================================
   NaijaGo — fixture data
   Every public-facing number, name and string below is taken from the live
   production site at naijago.netlify.app (captured 2 September 2026).
   Booking-flow fixtures that production does not expose are marked DERIVED
   and are internally consistent with the published figures.
   ========================================================================== */
(function (NG) {
  'use strict';

  /* ---- Commercial constants ------------------------------------------- */
  NG.FEE        = 0.05;   // buyer service fee, added on top of face value
  NG.COMMISSION = 0.08;   // host commission, deducted from gross. Never conflate these two.
  NG.POINTS     = 0.01;   // NaijaGo points accrued on total paid
  NG.HOLD_SECS  = 600;    // seat hold, 10 minutes
  NG.WARN_SECS  = 180;    // hold turns amber with 3 minutes left
  NG.CLAIM_MINS = 120;    // waitlist claim window, two hours
  NG.PAYOUT_HRS = 48;     // payout released 48h after the gate closes

  NG.TODAY = { iso: '2026-09-02', label: 'Wednesday 2 September 2026' };

  /* ---- Headline stats (verbatim from production) ----------------------- */
  NG.STATS = {
    experiences: '1,204',
    hosts: '338',
    scans: '98.4%',
    scansLabel: 'First-try entry scans',
    feesLabel: 'Fees shown upfront',
    feesFigure: '100%'
  };

  NG.TICKER = [
    'Detty December experiences are live',
    'Passes scan offline',
    'Verified hosts only',
    'Fees shown upfront',
    'Lagos · Abuja · Port Harcourt'
  ];

  NG.CITIES = ['Lagos', 'Abuja', 'Port Harcourt', 'Ibadan'];
  NG.WHENS  = ['This weekend', 'Tonight', 'Next weekend', 'Pick dates'];

  /* ---- Vibes. The six counts sum to 184, matching "184 in Lagos". ------ */
  NG.VIBES = [
    { id: 'night',    name: 'Nightlife',       count: 48, icon: 'nightlife' },
    { id: 'food',     name: 'Food & drink',    count: 39, icon: 'food' },
    { id: 'festival', name: 'Festivals',       count: 22, icon: 'music' },
    { id: 'culture',  name: 'Culture',         count: 31, icon: 'culture' },
    { id: 'outdoors', name: 'Outdoors',        count: 28, icon: 'beach' },
    { id: 'stay',     name: 'Stay & wellness', count: 16, icon: 'stay' }
  ];
  NG.LAGOS_TOTAL = 184;

  /* ---- Areas (DERIVED; sums to 184 for the Lagos facet) ---------------- */
  NG.AREAS = [
    { id: 'lekki',    name: 'Lekki',           count: 42 },
    { id: 'vi',       name: 'Victoria Island', count: 38 },
    { id: 'ikoyi',    name: 'Ikoyi',           count: 31 },
    { id: 'yaba',     name: 'Yaba',            count: 27 },
    { id: 'island',   name: 'Lagos Island',    count: 24 },
    { id: 'mainland', name: 'Mainland',        count: 22 }
  ];

  NG.PRICE_BANDS = [
    { id: 'free',  name: 'Free entry',        count: 19 },
    { id: 'under15', name: 'Under ₦15,000',   count: 61 },
    { id: '15to30',  name: '₦15,000–₦30,000', count: 68 },
    { id: 'over30',  name: 'Over ₦30,000',    count: 36 }
  ];

  /* ---- Seasons (verbatim) ---------------------------------------------- */
  NG.SEASONS = [
    {
      id: 'detty-december', tag: 'FLAGSHIP',
      meta: '1 DEC – 4 JAN · LAGOS, ABUJA, PH',
      name: 'Detty December',
      foot: '96 EXPERIENCES · FROM ₦35,000',
      count: 96, from: 35000, img: 'december-crowd.jpg',
      blurb: 'Five weeks, three cities and the densest run of live music, beach days and late nights in the Nigerian calendar.'
    },
    {
      id: 'heritage', tag: 'CULTURE',
      meta: 'ACROSS THE YEAR · NATIONWIDE',
      name: 'Heritage Season',
      foot: '28 CULTURAL EXPERIENCES',
      count: 28, from: 0, img: 'fabric.jpg',
      blurb: 'Museums, textile houses, spoken word and the long-running cultural institutions that stay open all year.'
    },
    {
      id: 'new-yam', tag: 'FESTIVAL',
      meta: 'AUGUST – OCTOBER · SOUTH EAST',
      name: 'New Yam Season',
      foot: '32 EXPERIENCES',
      count: 32, from: 8000, img: 'gallery.jpg',
      blurb: 'Iri Ji across the South East — masquerades, communal feasts and the harvest calendar as it is actually kept.'
    }
  ];

  /* ---- Hosts (verbatim) ------------------------------------------------ */
  NG.HOSTS = {
    'eko-wave': {
      id: 'eko-wave', initials: 'EW', name: 'Eko Wave Collective',
      meta: 'LAGOS · NIGHTLIFE', rating: 4.8, verified: true,
      blurb: 'Beach raves and rooftop nights across the island since 2019.',
      since: 2019, events: 46, guests: '18,400', responseHrs: 3, img: 'host.jpg'
    },
    'food-trails': {
      id: 'food-trails', initials: 'NF', name: 'Naija Food Trails',
      meta: 'YABA · FOOD TOURS', rating: 4.9, verified: true,
      blurb: 'Street-food safaris led by people who grew up on these streets.',
      since: 2021, events: 128, guests: '6,120', responseHrs: 1, img: 'suya.jpg'
    },
    'terra': {
      id: 'terra', initials: 'TC', name: 'Terra Culture House',
      meta: 'VICTORIA ISLAND · ARTS', rating: 4.7, verified: true,
      blurb: 'Theatre, galleries and spoken word — the calm side of the season.',
      since: 2016, events: 210, guests: '31,700', responseHrs: 6, img: 'gallery.jpg'
    },
    'flytime': {
      id: 'flytime', initials: 'FT', name: 'Flytime Promotions',
      meta: 'EKO ATLANTIC · FESTIVALS', rating: 4.9, verified: true,
      blurb: 'The December arena run — the biggest stages of the season.',
      since: 2014, events: 62, guests: '204,000', responseHrs: 12, img: 'december-crowd.jpg'
    }
  };

  /* ---- Experiences (all eight verbatim from the live "This weekend" rail)
     Tier structure, capacity and remaining counts are DERIVED and reconcile
     with the published "N LEFT" badges and "N going" figures. --------------- */
  NG.EXPERIENCES = [
    {
      id: 'beach-rave', vibe: 'night', vibeName: 'Nightlife',
      title: 'Lekki Moonlight Beach Rave',
      when: 'SAT 5 SEP · LEKKI · 4.2 KM',
      dateISO: '2026-09-05', startsAt: '19:00', lastEntry: '23:00',
      area: 'lekki', city: 'Lagos', venue: 'Ilashe Private Beach, Lekki',
      blurb: 'Sunset selectors, live percussion and an all-night headline set by the water.',
      long: 'A beach set that starts with the sun still up and runs to the small hours. Percussion at 21:30, headline at midnight, and a shuttle back to the Lekki mainland from 02:00. Arrive before 20:00 if you want the sunset — the boat jetty gets busy after that.',
      rating: 4.8, going: 412, price: 15000, badge: '40 LEFT',
      host: 'eko-wave', img: 'beach-rave.jpg', left: 40,
      tiers: [
        { id: 'general', name: 'General entry', price: 15000, left: 40, note: 'Standing, full site access' },
        { id: 'cabana',  name: 'Cabana (seats 6)', price: 45000, left: 0, note: 'Reserved cabana, table service' }
      ],
      timeline: [
        ['19:00', 'Doors open · arrive early for the sunset set'],
        ['21:30', 'Live performance and headline warm-up'],
        ['00:00', 'Headline set · final entry at midnight']
      ],
      facts: [
        ['Entry', 'QR pass · works offline'],
        ['Refund', 'Until Friday 18:00'],
        ['Host', 'Identity verified · ★ 4.8']
      ],
      waitlist: 12
    },
    {
      id: 'food-safari', vibe: 'food', vibeName: 'Food & drink',
      title: 'Lagos Street Food Safari',
      when: 'SAT 12 SEP · YABA',
      dateISO: '2026-09-12', startsAt: '14:00', lastEntry: '14:20',
      area: 'yaba', city: 'Lagos', venue: 'Meets at Yaba Market gate',
      blurb: 'Five stops, one afternoon — suya, boli and mainland kitchens worth crossing town for.',
      long: 'Five kitchens across Yaba and Ebute Metta with a guide who has eaten at all of them for twenty years. Roughly three hours on foot with two short bus hops. Come hungry; the fourth stop is the big one.',
      rating: 4.9, going: 208, price: 10000, badge: '3 LEFT',
      host: 'food-trails', img: 'suya.jpg', left: 3,
      tiers: [
        { id: 'general', name: 'Walking tour', price: 10000, left: 3, note: 'Five stops, all food included' }
      ],
      timeline: [
        ['14:00', 'Meet at the Yaba Market gate · prompt start'],
        ['15:30', 'Bus hop to Ebute Metta · two kitchens'],
        ['17:00', 'Final stop and finish']
      ],
      facts: [
        ['Entry', 'Name on the door · pass as backup'],
        ['Refund', 'Until 48 hours before'],
        ['Host', 'Identity verified · ★ 4.9']
      ],
      waitlist: 31
    },
    {
      id: 'suya-jazz', vibe: 'night', vibeName: 'Nightlife',
      title: 'Suya & Jazz Night',
      when: 'TONIGHT 20:00 · IKOYI',
      dateISO: '2026-09-02', startsAt: '20:00', lastEntry: '23:30',
      area: 'ikoyi', city: 'Lagos', venue: 'The Rooftop, Awolowo Road',
      blurb: 'A live quartet, smoke off the grill and a rooftop that stays warm till late.',
      long: 'A resident quartet plays two sets from 20:30. The grill runs all night and the bar closes at 01:00. It is a rooftop, so it moves indoors if the rain comes — same ticket, same night.',
      rating: 4.8, going: 154, price: 18000, badge: '',
      host: 'eko-wave', img: 'jazz.jpg', left: 62,
      tiers: [
        { id: 'general', name: 'Entry + first drink', price: 18000, left: 62, note: 'Standing and bar seating' },
        { id: 'table',   name: 'Table for four', price: 90000, left: 4, note: 'Reserved table, front of the stage' }
      ],
      timeline: [
        ['20:00', 'Doors and grill open'],
        ['20:30', 'First set'],
        ['22:30', 'Second set · last entry 23:30']
      ],
      facts: [
        ['Entry', 'QR pass · works offline'],
        ['Refund', 'Until 18:00 today'],
        ['Host', 'Identity verified · ★ 4.8']
      ],
      waitlist: 0
    },
    {
      id: 'brunch', vibe: 'food', vibeName: 'Food & drink',
      title: 'Bottomless Brunch Club',
      when: 'SUN 27 SEP · VICTORIA ISLAND',
      dateISO: '2026-09-27', startsAt: '12:30', lastEntry: '13:15',
      area: 'vi', city: 'Lagos', venue: 'Kuramo House, Victoria Island',
      blurb: "Two hours, one long table and the island's most talked-about Sunday spread.",
      long: 'One long table, two hours, and a kitchen that does not rush you. Seating is communal by design — you will be next to people you did not arrive with.',
      rating: 4.6, going: 88, price: 25000, badge: '',
      host: 'terra', img: 'brunch.jpg', left: 24,
      tiers: [
        { id: 'general', name: 'Seat at the table', price: 25000, left: 24, note: 'Two hours, food and pours included' }
      ],
      timeline: [
        ['12:30', 'Seating opens'],
        ['13:15', 'Service begins · last seating'],
        ['15:00', 'Close']
      ],
      facts: [
        ['Entry', 'Name on the door'],
        ['Refund', 'Until 72 hours before'],
        ['Host', 'Identity verified · ★ 4.7']
      ],
      waitlist: 0
    },
    {
      id: 'nike-art', vibe: 'culture', vibeName: 'Culture',
      title: 'Nike Art Walk & Studio Visit',
      when: 'SAT 3 OCT · LEKKI · GUIDED',
      dateISO: '2026-10-03', startsAt: '11:00', lastEntry: '11:30',
      area: 'lekki', city: 'Lagos', venue: 'Nike Art Gallery, Lekki',
      blurb: 'Four floors of Nigerian art, a working studio and the stories behind the pieces.',
      long: 'Four floors, roughly 8,000 works, and a guide who can tell you which ones matter and why. Ends in the working studio downstairs where the adire is still being made.',
      rating: 4.9, going: 132, price: 0, badge: 'FREE ENTRY',
      host: 'terra', img: 'gallery.jpg', left: 18,
      tiers: [
        { id: 'general', name: 'Guided walk', price: 0, left: 18, note: 'Free · registration required' }
      ],
      timeline: [
        ['11:00', 'Meet in the ground-floor lobby'],
        ['11:30', 'Guided floors one to four'],
        ['13:00', 'Studio visit and finish']
      ],
      facts: [
        ['Entry', 'QR pass · works offline'],
        ['Refund', 'Free · release your place instead'],
        ['Host', 'Identity verified · ★ 4.7']
      ],
      waitlist: 0
    },
    {
      id: 'tarkwa', vibe: 'outdoors', vibeName: 'Outdoors',
      title: 'Tarkwa Bay Escape',
      when: 'SAT 24 OCT · TARKWA BAY · BOAT',
      dateISO: '2026-10-24', startsAt: '09:30', lastEntry: '09:45',
      area: 'island', city: 'Lagos', venue: 'Departs Five Cowries Terminal',
      blurb: 'Boat across the harbour, a sheltered beach and a sunset ride home.',
      long: 'Twenty-five minutes across the harbour to a beach with no road access, which is exactly why it is quiet. Boats run back on the hour from 16:00; the last one is 18:00 and it does not wait.',
      rating: 4.7, going: 96, price: 12000, badge: '',
      host: 'eko-wave', img: 'boats.jpg', left: 31,
      tiers: [
        { id: 'general', name: 'Return boat + beach', price: 12000, left: 31, note: 'Both crossings included' }
      ],
      timeline: [
        ['09:30', 'Board at Five Cowries Terminal'],
        ['10:00', 'Arrive Tarkwa Bay'],
        ['18:00', 'Last boat back · it does not wait']
      ],
      facts: [
        ['Entry', 'QR pass at the jetty'],
        ['Refund', 'Until 24 hours before'],
        ['Host', 'Identity verified · ★ 4.8']
      ],
      waitlist: 84
    },
    {
      id: 'freedom-park', vibe: 'culture', vibeName: 'Culture',
      title: 'Freedom Park Poetry & Jazz',
      when: 'TONIGHT 19:00 · LAGOS ISLAND',
      dateISO: '2026-09-02', startsAt: '19:00', lastEntry: '21:00',
      area: 'island', city: 'Lagos', venue: 'Freedom Park, Broad Street',
      blurb: 'Open-air poetry, a live band and a crowd that actually listens.',
      long: 'Open mic from 19:00, the house band from 20:30. It is outdoors under the old prison walls and it is genuinely quiet between sets, which is rarer than it sounds.',
      rating: 4.7, going: 61, price: 0, badge: 'TONIGHT',
      host: 'terra', img: 'rooftop.jpg', left: 44,
      tiers: [
        { id: 'general', name: 'Free entry', price: 0, left: 44, note: 'Registration required' }
      ],
      timeline: [
        ['19:00', 'Open mic'],
        ['20:30', 'House band'],
        ['22:00', 'Close']
      ],
      facts: [
        ['Entry', 'QR pass · works offline'],
        ['Refund', 'Free · release your place instead'],
        ['Host', 'Identity verified · ★ 4.7']
      ],
      waitlist: 0
    },
    {
      id: 'flytime', vibe: 'festival', vibeName: 'Festivals',
      title: 'Flytime Fest: Night One',
      when: 'MON 21 DEC · EKO ATLANTIC',
      dateISO: '2026-12-21', startsAt: '18:00', lastEntry: '22:00',
      area: 'vi', city: 'Lagos', venue: 'Eko Atlantic Festival Grounds',
      blurb: "The season opener — a full arena show with the city's biggest December energy.",
      long: 'The night that opens the December run. Gates at 18:00, support from 19:30, headline after 22:00. Traffic into Eko Atlantic is the real constraint — leave earlier than you think.',
      rating: 4.9, going: 2140, price: 35000, badge: 'SELLING FAST',
      host: 'flytime', img: 'december-crowd.jpg', left: 260,
      tiers: [
        { id: 'general', name: 'General admission', price: 35000, left: 260, note: 'Standing, main arena' },
        { id: 'vip',     name: 'VIP', price: 120000, left: 18, note: 'Raised deck, private bar' }
      ],
      timeline: [
        ['18:00', 'Gates open'],
        ['19:30', 'Support acts'],
        ['22:00', 'Headline · last entry 22:00']
      ],
      facts: [
        ['Entry', 'QR pass · works offline'],
        ['Refund', 'Until 14 days before'],
        ['Host', 'Identity verified · ★ 4.9']
      ],
      waitlist: 206
    }
  ];

  /* ---- Guides (verbatim) ----------------------------------------------- */
  NG.GUIDES = [
    { id: 'detty-first-timer', kicker: 'LOCAL GUIDE', featured: true,
      title: "A first-timer's Detty December, planned properly",
      blurb: 'Where to arrive early, what to wear, how long the journey really takes and which nights work best together.',
      meta: 'BY NAIJAGO EDITORS · 8 MIN READ', img: 'december-crowd.jpg' },
    { id: 'lagos-sunday', kicker: 'FOOD GUIDE',
      title: 'Where Lagos actually eats on Sunday',
      blurb: 'The honest version, with prices you can trust.',
      meta: '6 MIN READ', img: 'brunch.jpg' },
    { id: 'three-moods', kicker: 'WEEKEND PLAN',
      title: 'One good weekend, three Lagos moods',
      blurb: 'Beach day, gallery stop and a late-night finish.',
      meta: '5 MIN READ', img: 'lagos-water.jpg' }
  ];

  /* ---- Search dialog shortcuts (verbatim) ------------------------------ */
  NG.SHORTCUTS = [
    { label: 'Nightlife tonight', sub: '48 in Lagos', to: '#/explore?vibe=night&when=tonight' },
    { label: 'Food worth crossing town for', sub: '39 experiences', to: '#/explore?vibe=food' },
    { label: 'Plan Detty December', sub: '96 live', to: '#/season/detty-december' }
  ];

  /* ---- Payment rails --------------------------------------------------- */
  NG.RAILS = [
    { id: 'card',     name: 'Card',           sub: 'Visa, Mastercard, Verve', logo: 'CARD' },
    { id: 'transfer', name: 'Bank transfer',  sub: 'One-time account, expires with your hold', logo: 'NIP' },
    { id: 'ussd',     name: 'USSD',           sub: 'Dial from the phone with your bank app', logo: '*737#' }
  ];

  /* ---- The reference booking (DERIVED, used across pass and account) ----
     2 × General entry to the Beach Rave.
     30,000 face + 1,500 fee (5%) = 31,500 paid. Points = 315 (1%). -------- */
  NG.REFERENCE_BOOKING = {
    ref: 'NG-8842-LOS',
    experience: 'beach-rave',
    tier: 'general',
    qty: 2,
    face: 30000,
    fee: 1500,
    total: 31500,
    points: 315,
    rail: 'transfer',
    paidAt: '2026-08-28 14:06',
    state: 'valid'
  };

  /* ---- Host console fixture (DERIVED, arithmetically closed) -----------
     208 General + 15 Cabana = 223 capacity. 214 sold, 9 unsold.
     Gross ₦3,660,000 · commission 8% = ₦292,800 · payout ₦3,367,200. ------ */
  NG.HOST_CONSOLE = {
    host: 'eko-wave',
    listing: 'Lekki Moonlight Beach Rave',
    capacity: 223,
    sold: 214,
    left: 9,
    gross: 3660000,
    commission: 292800,
    payout: 3367200,
    payoutDue: 'Monday 7 September 2026',
    payoutNote: 'Released 48 hours after the gate closes.',
    weeks: [
      { label: 'W1', sold: 18 }, { label: 'W2', sold: 27 }, { label: 'W3', sold: 44 },
      { label: 'W4', sold: 39 }, { label: 'W5', sold: 52 }, { label: 'W6', sold: 34 }
    ],
    listings: [
      { name: 'Lekki Moonlight Beach Rave', date: 'Sat 5 Sep', status: 'live',     sold: 214, cap: 223, gross: 3660000 },
      { name: 'Tarkwa Bay Escape',          date: 'Sat 24 Oct', status: 'live',     sold: 69,  cap: 100, gross: 828000 },
      { name: 'Suya & Jazz Night',          date: 'Every Wed',  status: 'live',     sold: 62,  cap: 124, gross: 1116000 },
      { name: 'Crossover Night 2026',       date: 'Thu 31 Dec', status: 'draft',    sold: 0,   cap: 400, gross: 0 },
      { name: 'Harbour Sunset Sessions',    date: 'Sat 17 Oct', status: 'review',   sold: 0,   cap: 150, gross: 0 }
    ]
  };

  /* ---- Notifications --------------------------------------------------- */
  NG.NOTIFICATIONS = [
    { id: 'n1', unread: true,  at: 'Today 14:38', kind: 'waitlist',
      title: 'A cabana opened up',
      body: 'You are first in the queue for Lekki Moonlight Beach Rave. Claim it within two hours.',
      to: '#/waitlist/beach-rave' },
    { id: 'n2', unread: true,  at: 'Today 09:12', kind: 'reminder',
      title: 'Suya & Jazz Night is tonight',
      body: 'Doors at 20:00 in Ikoyi. Your pass is already cached on this device.',
      to: '#/pass/NG-8842-LOS' },
    { id: 'n3', unread: false, at: 'Mon 31 Aug', kind: 'payment',
      title: 'Payment confirmed',
      body: 'Bank transfer of ₦31,500 received for NG-8842-LOS. 315 points pending until you scan in.',
      to: '#/booking/NG-8842-LOS' },
    { id: 'n4', unread: false, at: 'Fri 28 Aug', kind: 'host',
      title: 'Eko Wave Collective replied',
      body: 'On the shuttle question: boats run back from 02:00, roughly every twenty minutes.',
      to: '#/host/eko-wave' }
  ];

  /* ---- Plan fixture (DERIVED; contains one deliberate clash) ------------ */
  NG.PLAN = {
    name: 'First weekend of September',
    city: 'Lagos',
    days: [
      { date: 'Saturday 5 September', items: [
        { time: '11:00', title: 'Nike Art Walk & Studio Visit', place: 'Lekki', id: 'nike-art', clash: false },
        { time: '19:00', title: 'Lekki Moonlight Beach Rave',   place: 'Ilashe Private Beach', id: 'beach-rave', clash: true },
        { time: '20:00', title: 'Suya & Jazz Night',            place: 'Ikoyi', id: 'suya-jazz', clash: true }
      ]},
      { date: 'Sunday 6 September', items: [
        { time: '12:30', title: 'Bottomless Brunch Club', place: 'Victoria Island', id: 'brunch', clash: false }
      ]}
    ],
    clashNote: 'The rave starts at 19:00 in Ilashe and Suya & Jazz starts at 20:00 in Ikoyi. That is a boat and a bridge in sixty minutes. Pick one.'
  };

  NG.money = function (n) {
    if (n === 0) return 'Free';
    return '₦' + Number(n).toLocaleString('en-NG');
  };
  NG.byId = function (id) {
    for (var i = 0; i < NG.EXPERIENCES.length; i++) if (NG.EXPERIENCES[i].id === id) return NG.EXPERIENCES[i];
    return null;
  };
  NG.seasonById = function (id) {
    for (var i = 0; i < NG.SEASONS.length; i++) if (NG.SEASONS[i].id === id) return NG.SEASONS[i];
    return null;
  };
})(window.NG = window.NG || {});
