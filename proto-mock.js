/**
 * Proto mock data — seeds localStorage as if a seller had been through the funnel.
 *
 * Two problems this solves:
 *
 *  1. The front page hero renders from funnel state (empty / in progress /
 *     under review / auction ongoing / ended / completed), so those states were
 *     unreachable from the proto bar — there was no scenario param to set, only
 *     a store to have filled in by hand.
 *
 *  2. Any page that reads car details from the store — offers, decision,
 *     success — showed blanks unless you had actually walked the funnel. That
 *     makes the proto tedious to demo or review.
 *
 * The shapes below were captured from a real funnel walk, not invented, so they
 * match what the pages actually read.
 *
 * Loaded in <head> so seeding happens BEFORE page scripts read the store.
 *
 *   window.PROTO_MOCK.seed('in-review')   // write a named state
 *   window.PROTO_MOCK.car()               // = seed('draft-complete')
 *   window.PROTO_MOCK.clear()             // = seed('empty')
 *   window.PROTO_MOCK.detect()            // which named state the store matches
 *   window.PROTO_MOCK.states              // { name: label } for the bar
 *
 * The bar's Seed car / Reset data are just these two named states, so the
 * scenario menu and the store can never disagree.
 *
 * Selecting a mock scenario OVERWRITES funnel progress. That is the point — the
 * scenario *is* the state — but it means you lose a half-finished walkthrough.
 */
(function () {
  var FUNNEL_KEY   = 'autovex_funnel';
  var OFFERS_KEY   = 'autovex_offers';
  var DECISION_KEY = 'autovex_decision';

  /* One canonical car, shared by every state. Photos are the SAME assets
     photos.html's own "Photos filled" scenario uses (see _loadFilledScenario)
     — reusing that set rather than a single repeated placeholder means Seed car
     and Photos filled show the same car, and nothing new had to be shot. Plain
     asset paths render fine as a plain <img src>, so there is no need to fetch
     and inline them as data URLs the way that scenario does for the LIVE
     photos.html upload flow (fillSlot/isPdf/isHeicDataUrl only special-case
     strings starting "data:", so a plain path just falls through to a normal
     image). */
  var SCENARIO_PHOTOS = {
    ulkopuoli:   ['assets/scenario-ulkopuoli-2.jpg', 'assets/scenario-ulkopuoli-1.jpg', 'assets/scenario-ulkopuoli-3.jpg', 'assets/scenario-ulkopuoli-4.jpg', 'assets/scenario-ulkopuoli-5.jpg'],
    sisatilat:   ['assets/scenario-sisatilat-1.jpg', 'assets/scenario-sisatilat-2.jpg', 'assets/scenario-sisatilat-3.jpg', 'assets/scenario-sisatilat-4.jpg'],
    huoltokirja: ['assets/scenario-huoltokirja-1.jpg', 'assets/scenario-huoltokirja-2.jpg', 'assets/scenario-huoltokirja-3.jpg', 'assets/scenario-huoltokirja-4.jpg', 'assets/scenario-huoltokirja-5.jpg'],
    renkaat:     ['assets/scenario-renkaat-1.jpg']
  };
  var CAR = {
    hero: { plate: 'LRX-345', km: '148 000' },
    details: {
      merkki: 'Volkswagen', malli: 'Amarok', mallitarkennus: '2.0 TDI Highline',
      vuosimalli: '2019', polttoaine: 'Diesel', vetotapa: 'Etuveto',
      vaihteisto: 'Automaatti', sijainti: '00100', deliveryRange: '50',
      kesarenkaat: 'Hyvät', kesavanteet: 'Vanteilla',
      talvirenkaat: 'Hyvät', talvivanteet: 'Vanteilla',
      avaimet: '2 tai enemmän', varustelu: '', yrityskaytto: false
    },
    /* radioGroups stores the option's LABEL TEXT (see saveServices in
       services.html), so these must be the exact labels or the step reads as
       unfilled. Order: huoltohistoria, huoltokirjan tyyppi, viimeisin huolto,
       tuulilasin kunto, lasivakuutus.
       bookType 'paper' is deliberate: isComplete only demands `tiedot` when the
       book is digital or both, so paper keeps the state valid without it.
       korjaukset must be a non-empty trimmed string — simulated user input, not
       product copy. */
    services: {
      radioGroups: [
        'Täydellinen merkkiliikkeen historia',
        'Paperinen huoltokirja',
        'Viimeisen 6 kuukauden aikana',
        'Ehjä',
        'Kyllä'
      ],
      bookType: 'paper',
      tiedot: null,
      korjaukset: 'Pieniä kiviskemiä konepellissä. Huollot tehty merkkiliikkeessä.',
      lastServiceDetail: { km: 132000, month: '5', year: '2025' }
    },
    photos: SCENARIO_PHOTOS,
    /* Documents from the "Seller file upload" initiative — two PDFs, since the
       team settled on PDF only. Real, openable files rather than stubs: every
       surface links to them in a new tab, and a placeholder would make that link
       look broken. Small on purpose — the bytes live in localStorage alongside
       the photo data URLs.
       Seeded in every state that has a car, so the surfaces that list files can
       be demoed without walking the photos step. */
    files: [
      { name: 'huoltokirja.pdf', size: 444, type: 'application/pdf',
        data: 'data:application/pdf;base64,JVBERi0xLjQKMSAwIG9iajw8L1R5cGUvQ2F0YWxvZy9QYWdlcyAyIDAgUj4+ZW5kb2JqCjIgMCBvYmo8PC9UeXBlL1BhZ2VzL0tpZHNbMyAwIFJdL0NvdW50IDE+PmVuZG9iagozIDAgb2JqPDwvVHlwZS9QYWdlL1BhcmVudCAyIDAgUi9NZWRpYUJveFswIDAgMzAwIDEyMF0vUmVzb3VyY2VzPDwvRm9udDw8L0YxIDQgMCBSPj4+Pi9Db250ZW50cyA1IDAgUj4+ZW5kb2JqCjQgMCBvYmo8PC9UeXBlL0ZvbnQvU3VidHlwZS9UeXBlMS9CYXNlRm9udC9IZWx2ZXRpY2E+PmVuZG9iago1IDAgb2JqPDwvTGVuZ3RoIDkwPj5zdHJlYW0KQlQgL0YxIDEyIFRmIDI0IDcyIFRkIChIdW9sdG9raXJqYSAtIEF1dG9WZXggcHJvdG90eXBlIHNhbXBsZSkgVGogMCAtMjAgVGQgKE5vdCBhIHJlYWwgZG9jdW1lbnQuKSBUaiBFVAplbmRzdHJlYW0KZW5kb2JqCnRyYWlsZXI8PC9Sb290IDEgMCBSPj4=' },
      { name: 'vahinkotarkastus.pdf', size: 449, type: 'application/pdf',
        data: 'data:application/pdf;base64,JVBERi0xLjQKMSAwIG9iajw8L1R5cGUvQ2F0YWxvZy9QYWdlcyAyIDAgUj4+ZW5kb2JqCjIgMCBvYmo8PC9UeXBlL1BhZ2VzL0tpZHNbMyAwIFJdL0NvdW50IDE+PmVuZG9iagozIDAgb2JqPDwvVHlwZS9QYWdlL1BhcmVudCAyIDAgUi9NZWRpYUJveFswIDAgMzAwIDEyMF0vUmVzb3VyY2VzPDwvRm9udDw8L0YxIDQgMCBSPj4+Pi9Db250ZW50cyA1IDAgUj4+ZW5kb2JqCjQgMCBvYmo8PC9UeXBlL0ZvbnQvU3VidHlwZS9UeXBlMS9CYXNlRm9udC9IZWx2ZXRpY2E+PmVuZG9iago1IDAgb2JqPDwvTGVuZ3RoIDEwOD4+c3RyZWFtCkJUIC9GMSAxMiBUZiAyNCA3MiBUZCAoVmFoaW5rb3Rhcmthc3R1cyAtIEF1dG9WZXggcHJvdG90eXBlIHNhbXBsZSkgVGogMCAtMjAgVGQgKE5vdCBhIHJlYWwgZG9jdW1lbnQuKSBUaiBFVAplbmRzdHJlYW0KZW5kb2JqCnRyYWlsZXI8PC9Sb290IDEgMCBSPj4=' }
    ],
    contact: {
      kokoNimi: 'Matti Meikäläinen',
      sahkoposti: 'matti.meikalainen@example.fi',
      puhelin: '+358401234567',
      kayttoehdot: true,      // isComplete('contact') requires it
      markkinointi: false
    }
  };

  function clone(o) { return JSON.parse(JSON.stringify(o)); }
  function write(key, val) {
    try {
      if (val === null) localStorage.removeItem(key);
      else localStorage.setItem(key, JSON.stringify(val));
    } catch (e) {}
  }

  /* Each state is the minimum the pages actually branch on. Comments name the
     branch in index.html's showProgressState() that it exercises. */
  var BUILDERS = {
    'empty': function () {                      // default hero, no progress card
      write(FUNNEL_KEY, null); write(OFFERS_KEY, null); write(DECISION_KEY, null);
    },
    'draft-incomplete': function () {           // "launchingCar", continue mid-funnel
      var s = clone(CAR);
      /* Mid-funnel, before the photos step — so no photos and no documents yet. */
      delete s.photos; delete s.contact; delete s.files;
      s.detailsLeft = true;
      write(FUNNEL_KEY, s); write(OFFERS_KEY, null); write(DECISION_KEY, null);
    },
    'draft-complete': function () {             // "launchingCar", continue to success
      /* Every step must read as COMPLETE, not merely started, so the stepper
         shows all ticks and each page validates on Continue. The flags below are
         what isStarted()/isComplete() check beyond the field data itself. */
      var s = clone(CAR);
      s.detailsLeft = true;
      s.photosVisited = true;
      s.priceVisited = true;
      s.successVisited = true;
      /* Written explicitly rather than left to default. The price step writes
         this on submit, and a seeded draft is past that step — so the two seed
         states differ by exactly the thing the seller's outcome turns on, and
         success.html does not have to infer it. 148 000 km is inside the review
         band, so this car IS review-called. */
      s.reviewable = true;
      write(FUNNEL_KEY, s); write(OFFERS_KEY, null); write(DECISION_KEY, null);
    },
    'in-review': function () {                  // "underReview" -> success.html
      var s = clone(CAR);
      s.detailsLeft = true; s.photosVisited = true; s.priceVisited = true;
      s.successVisited = true; s.loggedIn = true;
      write(FUNNEL_KEY, s); write(OFFERS_KEY, null); write(DECISION_KEY, null);
    },
    'auction-ongoing': function () {            // "auctionOngoing" -> offers.html
      var s = clone(CAR);
      s.detailsLeft = true; s.photosVisited = true; s.priceVisited = true;
      s.successVisited = true; s.loggedIn = true; s.offersVisited = true;
      write(FUNNEL_KEY, s);
      write(OFFERS_KEY, { scenario: 'auction-live' }); write(DECISION_KEY, null);
    },
    'auction-ended': function () {              // "auctionEnded" -> offers.html
      var s = clone(CAR);
      s.detailsLeft = true; s.photosVisited = true; s.priceVisited = true;
      s.successVisited = true; s.loggedIn = true; s.offersVisited = true;
      write(FUNNEL_KEY, s);
      write(OFFERS_KEY, { scenario: 'new-offers' }); write(DECISION_KEY, null);
    },
    'deal-completed': function () {             // "dealCompleted" -> offers.html
      var s = clone(CAR);
      s.detailsLeft = true; s.photosVisited = true; s.priceVisited = true;
      s.successVisited = true; s.loggedIn = true; s.offersVisited = true;
      write(FUNNEL_KEY, s);
      write(OFFERS_KEY, { scenario: 'accepted' }); write(DECISION_KEY, null);
    }
  };

  var LABELS = {
    'empty':            'Empty — first-time visitor',
    'draft-incomplete': 'Draft — incomplete, mid-funnel',
    'draft-complete':   'Draft — submitted, email not verified',
    'in-review':        'In review — email verified',
    'auction-ongoing':  'Auction ongoing',
    'auction-ended':    'Auction ended, offers in',
    'deal-completed':   'Deal completed'
  };

  /* Which named state does the CURRENT store correspond to? The front page has
     no ?scenario= param of its own — its state IS the store — so the bar needs
     this to show the right selection after a seed or reset. Checked most
     specific first. */
  function detect() {
    var f = {}, off = {};
    try { f   = JSON.parse(localStorage.getItem(FUNNEL_KEY) || '{}'); } catch (e) {}
    try { off = JSON.parse(localStorage.getItem(OFFERS_KEY) || '{}') || {}; } catch (e) {}
    if (!f || !f.hero) return 'empty';
    if (f.offersVisited) {
      if (off.scenario === 'accepted' || off.scenario === 'all-rejected') return 'deal-completed';
      if (off.scenario === 'auction-live' || off.scenario === 'live-no-bids') return 'auction-ongoing';
      return 'auction-ended';
    }
    if (f.loggedIn) return 'in-review';
    if (f.contact && f.contact.sahkoposti) return 'draft-complete';
    return 'draft-incomplete';
  }

  /* One definition of the auction's own numbers, because two pages render them
     and prod reads both from the same tender request.

     `reactionSeconds` is prod's `app.reaction_time_for_offers` (config default
     86400). Prod derives every seller-facing deadline from it - the card timer,
     the modal footer and the final offer, which resets the window rather than
     shortening it (FinalOffer.php). The proto used to run the decision page on
     a 2 h window while the offers page seeded 24 h ones, so the same seller saw
     two different clocks for one offer.

     The ended-auction counts are shared for the same reason: the offers page's
     live tally and the decision page's result block are one request in prod. */
  window.PROTO_AUCTION = {
    reactionSeconds: 86400,
    endedBids:       138,
    endedBidders:    25
  };

  /* ── Seed car exceptions ────────────────────────────────────────────────
     The seeded car is a submitted draft that can enter the auction. These are
     the few things a tester needs to vary on it, in funnel order. Each one is a
     row in the bar's Seed car popover AND a URL param, applied at load in test
     mode too, so a shared link reproduces the state.

     Review is a forced OUTCOME, not a mileage: which cars are review-called
     will depend on more than mileage, and the proto only needs to know the
     result. It lives under its own key rather than in the funnel store so a
     forced outcome survives a participant starting a new draft; the seeded
     store's `reviewable` is kept in step so the pages after the funnel agree.

     An entry with `initiative` is an answer that only exists inside an arm;
     the registry in proto-mode.js says which (`answers`), and choosing a value
     switches that arm on. */
  var REVIEW_KEY = 'autovex_proto_review';     // 'review' | 'no-review'
  var NO_REVIEW_PRICE = '12000';

  function readFunnel() {
    try { return JSON.parse(localStorage.getItem(FUNNEL_KEY) || '{}') || {}; } catch (e) { return {}; }
  }
  function forcedReview() {
    try { return localStorage.getItem(REVIEW_KEY); } catch (e) { return null; }
  }
  function photosComplete(s) {
    var ph = s.photos || {};
    var total = Object.keys(ph).reduce(function (n, k) { return n + (ph[k] ? ph[k].length : 0); }, 0);
    return total >= 5 && !!(ph.ulkopuoli && ph.ulkopuoli.length) && !!(ph.sisatilat && ph.sisatilat.length);
  }

  var EXCEPTIONS = [
    { key: 'review', param: 'review', label: 'Review',
      options: [ { id: '', label: '— from the car' }, { id: 'yes', label: 'Review' }, { id: 'no', label: 'No review' } ],
      get: function () {
        var f = forcedReview();
        return f === 'review' ? 'yes' : f === 'no-review' ? 'no' : '';
      },
      set: function (s, v) {
        try {
          if (v) localStorage.setItem(REVIEW_KEY, v === 'yes' ? 'review' : 'no-review');
          else localStorage.removeItem(REVIEW_KEY);
        } catch (e) {}
        if (!s.hero || !v) return;
        s.reviewable = v === 'yes';
        /* The price question follows the outcome: an unreviewed ad needs an
           asking price, a reviewed one keeps only the optional estimate. */
        if (v === 'no') {
          s.priceExpectation = s.priceExpectation || NO_REVIEW_PRICE;
          s.askingPrice = s.priceExpectation;
        } else {
          delete s.askingPrice;
        }
      } },
    { key: 'photos', param: 'photos', label: 'Photos', needsCar: true,
      options: [ { id: 'complete', label: 'Complete' }, { id: 'missing', label: 'Missing — publish refused' } ],
      get: function (s) { return photosComplete(s) ? 'complete' : 'missing'; },
      set: function (s, v) {
        s.photosVisited = true;
        /* Missing = two exterior photos, below the five-photo minimum, which is
           what lands the seller on the publish step's refusal. */
        s.photos = v === 'missing' ? { ulkopuoli: SCENARIO_PHOTOS.ulkopuoli.slice(0, 2) } : clone(SCENARIO_PHOTOS);
      } },
    { key: 'price', param: 'price', type: 'number', needsCar: true,
      label: function (s) { return s.reviewable === false ? 'Asking price €' : 'Price estimate € (optional)'; },
      get: function (s) { return String(s.priceExpectation || '').replace(/\D/g, ''); },
      set: function (s, v) {
        v = String(v || '').replace(/\D/g, '');
        if (!v && s.reviewable === false) v = NO_REVIEW_PRICE;   // required without review
        if (v) {
          s.priceExpectation = v;
          if (s.reviewable === false) s.askingPrice = v; else delete s.askingPrice;
        } else {
          delete s.priceExpectation; delete s.askingPrice;
        }
      } },
    { key: 'exclusive', param: 'exclusive', label: 'AutoVex exclusive', initiative: 'autovex-exclusive', needsCar: true,
      seedDefault: 'yes',
      options: [ { id: '', label: '— (variant off)' }, { id: 'yes', label: 'Yes' }, { id: 'no', label: 'No' } ],
      get: function (s) {
        var v = (s.contact || {}).autovexVisibility;
        return v === 'exclusive' ? 'yes' : v === 'standard' ? 'no' : '';
      },
      set: function (s, v) {
        s.contact = s.contact || {};
        if (v) s.contact.autovexVisibility = v === 'yes' ? 'exclusive' : 'standard';
        else delete s.contact.autovexVisibility;
      } },
    { key: 'loggedin', param: 'loggedin', label: 'Logged in', needsCar: true,
      options: [ { id: 'no', label: 'No — email not verified' }, { id: 'yes', label: 'Yes — email verified' } ],
      get: function (s) { return s.loggedIn ? 'yes' : 'no'; },
      set: function (s, v) { if (v === 'yes') s.loggedIn = true; else delete s.loggedIn; } }
  ];

  function findException(key) {
    for (var i = 0; i < EXCEPTIONS.length; i++) if (EXCEPTIONS[i].key === key) return EXCEPTIONS[i];
    return null;
  }

  /* The arm that asks an initiative-bound answer, from proto-mode.js's registry. */
  function answerArm(ex) {
    var reg = ex.initiative && window.protoInitiative && window.protoInitiative(ex.initiative);
    var ans = reg && (reg.answers || []).filter(function (a) { return a.param === ex.param; })[0];
    return ans ? ans.arm : null;
  }

  /* After seeding: an answer whose arm is already on gets its default, so a
     tester who picked the arm first does not have to answer as well; and a
     forced review outcome is applied to the fresh store. */
  function applySeedDefaults() {
    var s = readFunnel();
    EXCEPTIONS.forEach(function (ex) {
      if (ex.key === 'review') { var r = ex.get(s); if (r) ex.set(s, r); return; }
      if (!ex.seedDefault || !ex.initiative || !window.protoVariant) return;
      var arm = answerArm(ex);
      if (arm && window.protoVariantStored && window.protoVariantStored(ex.initiative) === arm) ex.set(s, ex.seedDefault);
    });
    write(FUNNEL_KEY, s);
  }

  window.PROTO_MOCK = {
    states: LABELS,
    detect: detect,
    /* What "Seed car" and "Reset data" on the bar map to. Keeping them as named
       states rather than a separate mechanism is what stops the bar's scenario
       selection and the actual store from disagreeing. */
    SEED_STATE: 'draft-complete',
    EXCEPTIONS: EXCEPTIONS,
    readFunnel: readFunnel,
    forcedReview: forcedReview,
    answerArm: answerArm,
    /* Set one exception from the bar. Seeds the car first when there is none,
       so any row works straight after Reset. */
    setException: function (key, value) {
      var ex = findException(key);
      if (!ex) return false;
      var s = readFunnel();
      if (!s.hero) { BUILDERS['draft-complete'](); applySeedDefaults(); s = readFunnel(); }
      ex.set(s, value);
      write(FUNNEL_KEY, s);
      return true;
    },
    CLEAR_STATE: 'empty',
    seed: function (name) {
      var b = BUILDERS[name];
      if (!b) return false;
      b();
      if (name === 'draft-complete') applySeedDefaults();
      return true;
    },
    /* Seed = every funnel field filled, submitted, email not yet verified. This
       is deliberately a NAMED state ('draft-complete') rather than a loose
       car-details merge: a merge left the store and the bar's scenario menu
       disagreeing, which produced combinations the front page could not
       sensibly continue from. */
    car: function () { BUILDERS['draft-complete'](); applySeedDefaults(); },
    clear: function () {
      BUILDERS['empty']();
      try { localStorage.removeItem(REVIEW_KEY); } catch (e) {}
    }
  };

  /* Auto-seed: a page opts in with data-proto-mock on <html> or <body>, and the
     bar drives it through the normal ?scenario= param. Only fires for names we
     know, so a page can mix mock states with its own scenarios. */
  var optIn = document.documentElement.hasAttribute('data-proto-mock');
  if (optIn) {
    var asked = new URLSearchParams(window.location.search).get('scenario');
    if (asked && BUILDERS[asked]) window.PROTO_MOCK.seed(asked);
  }

  /* "Seller edits before review": ?booked=1 / ?booked=0 pins whether an advisor
     has booked the ad for its review call (store.reviewBooked), so a link
     reproduces the exact state. Applied after the auto-seed, which rewrites the
     store. The Review section of the bar's Events popover writes the same param back into
     the address. */
  var bookedParam = new URLSearchParams(window.location.search).get('booked');
  if (bookedParam === '1' || bookedParam === '0') {
    var fs = {};
    try { fs = JSON.parse(localStorage.getItem(FUNNEL_KEY) || '{}') || {}; } catch (e) {}
    if (bookedParam === '1') fs.reviewBooked = true; else delete fs.reviewBooked;
    write(FUNNEL_KEY, fs);
  }

  /* Seed car exceptions from the URL — after the auto-seed and ?booked=, so a
     link always wins over what the store held. Runs in test mode too: that is
     how a moderator's link forces an outcome. An answer row's arm is switched on
     by proto-mode.js, which loads first. A row that needs a car is skipped when
     there is none (a participant who has not started yet). */
  var urlParams = new URLSearchParams(window.location.search);
  var es = null;
  EXCEPTIONS.forEach(function (ex) {
    if (!urlParams.has(ex.param)) return;
    var v = urlParams.get(ex.param);
    if (ex.options && !ex.options.some(function (o) { return o.id === v; })) return;
    es = es || readFunnel();
    if (ex.needsCar && !es.hero) return;
    ex.set(es, v);
  });
  if (es && es.hero) write(FUNNEL_KEY, es);   // no car: leave an empty prototype empty
}());
