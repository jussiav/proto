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
      vaihteisto: 'Automaatti', sijainti: 'Helsinki', deliveryRange: '50',
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
    /* Documents from the "Seller file upload" initiative. Real, openable files
       rather than stubs — every surface links to them in a new tab, and a
       placeholder would make that link look broken. Small on purpose: the bytes
       live in localStorage alongside the photo data URLs.
       Seeded in every state that has a car, so the surfaces that list files can
       be demoed without walking the photos step. */
    files: [
      { name: 'huoltokirja.pdf', size: 444, type: 'application/pdf',
        data: 'data:application/pdf;base64,JVBERi0xLjQKMSAwIG9iajw8L1R5cGUvQ2F0YWxvZy9QYWdlcyAyIDAgUj4+ZW5kb2JqCjIgMCBvYmo8PC9UeXBlL1BhZ2VzL0tpZHNbMyAwIFJdL0NvdW50IDE+PmVuZG9iagozIDAgb2JqPDwvVHlwZS9QYWdlL1BhcmVudCAyIDAgUi9NZWRpYUJveFswIDAgMzAwIDEyMF0vUmVzb3VyY2VzPDwvRm9udDw8L0YxIDQgMCBSPj4+Pi9Db250ZW50cyA1IDAgUj4+ZW5kb2JqCjQgMCBvYmo8PC9UeXBlL0ZvbnQvU3VidHlwZS9UeXBlMS9CYXNlRm9udC9IZWx2ZXRpY2E+PmVuZG9iago1IDAgb2JqPDwvTGVuZ3RoIDkwPj5zdHJlYW0KQlQgL0YxIDEyIFRmIDI0IDcyIFRkIChIdW9sdG9raXJqYSAtIEF1dG9WZXggcHJvdG90eXBlIHNhbXBsZSkgVGogMCAtMjAgVGQgKE5vdCBhIHJlYWwgZG9jdW1lbnQuKSBUaiBFVAplbmRzdHJlYW0KZW5kb2JqCnRyYWlsZXI8PC9Sb290IDEgMCBSPj4=' },
      { name: 'vahinkotarkastus.docx', size: 945,
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        data: 'data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,UEsDBBQAAAAIAFhLGF31KchK6wAAAK0BAAATAAAAW0NvbnRlbnRfVHlwZXNdLnhtbH2QzU7DMBCEX8XyFcUOHBBCSXrg5wgcygOs7E1i1X/yuqV9ezZt6QFVPdqz38xoutU+eLHDQi7FXt6rVgqMJlkXp15+r9+bJymoQrTgU8ReHpDkaujWh4wkmI3Uy7nW/Kw1mRkDkEoZIytjKgEqP8ukM5gNTKgf2vZRmxQrxtrUxUMO3SuOsPVVvO35+9SDcSleTndLVC8hZ+8MVJb1ouqrXEFPN8BdtP/aNedmisnjDc0u09054ZOHKc6i+IJSPyCwnf5JxWqbzDZwhLpd9EpeGkdn8MIvbrkkg0S8ePDqogRw8a+HPs49/AJQSwMEFAAAAAgAWEsYXZv9N+qtAAAAKQEAAAsAAABfcmVscy8ucmVsc43POw7CMAwG4KtE3mlaBoRQ0y4IqSsqB7ASN61oHkrCo7cnAwNFDIy2f3+W6/ZpZnanECdnBVRFCYysdGqyWsClP232wGJCq3B2lgQsFKFt6jPNmPJKHCcfWTZsFDCm5A+cRzmSwVg4TzZPBhcMplwGzT3KK2ri27Lc8fBpwNpknRIQOlUB6xdP/9huGCZJRydvhmz6ceIrkWUMmpKAhwuKq3e7yCzwpuarF5sXUEsDBBQAAAAIAFhLGF1/7saRwQAAAAoBAAARAAAAd29yZC9kb2N1bWVudC54bWxFj8FOwzAMhl/Fyn1N4TChqu3EhSOnwd00Zq2WxFHsruvbkwwhLp9l/fJnuz/dg4cbZVk4DuapaQ1QnNgt8TKYj/Pb4cWAKEaHniMNZicxp7HfOsfTGigqFEGUbhvMrJo6a2WaKaA0nCiW7JtzQC1tvtiNs0uZJxIp/uDtc9sebcAlmqr8YrfXmipyhY6vq/In3aGMKeueCARD8gQHuOG8xCsr5iuKrtLAOysgZEIPf+c1va2ayvxgevB3lf1/Y/wBUEsBAhQDFAAAAAgAWEsYXfUpyErrAAAArQEAABMAAAAAAAAAAAAAAIABAAAAAFtDb250ZW50X1R5cGVzXS54bWxQSwECFAMUAAAACABYSxhdm/036q0AAAApAQAACwAAAAAAAAAAAAAAgAEcAQAAX3JlbHMvLnJlbHNQSwECFAMUAAAACABYSxhdf+7GkcEAAAAKAQAAEQAAAAAAAAAAAAAAgAHyAQAAd29yZC9kb2N1bWVudC54bWxQSwUGAAAAAAMAAwC5AAAA4gIAAAAA' }
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

  window.PROTO_MOCK = {
    states: LABELS,
    detect: detect,
    /* What "Seed car" and "Reset data" on the bar map to. Keeping them as named
       states rather than a separate mechanism is what stops the bar's scenario
       selection and the actual store from disagreeing. */
    SEED_STATE: 'draft-complete',
    CLEAR_STATE: 'empty',
    seed: function (name) {
      var b = BUILDERS[name];
      if (!b) return false;
      b();
      return true;
    },
    /* Seed = every funnel field filled, submitted, email not yet verified. This
       is deliberately a NAMED state ('draft-complete') rather than a loose
       car-details merge: a merge left the store and the bar's scenario menu
       disagreeing, which produced combinations the front page could not
       sensibly continue from. */
    car: function () { BUILDERS['draft-complete'](); },
    clear: function () { BUILDERS['empty'](); }
  };

  /* Auto-seed: a page opts in with data-proto-mock on <html> or <body>, and the
     bar drives it through the normal ?scenario= param. Only fires for names we
     know, so a page can mix mock states with its own scenarios. */
  var optIn = document.documentElement.hasAttribute('data-proto-mock');
  if (optIn) {
    var asked = new URLSearchParams(window.location.search).get('scenario');
    if (asked && BUILDERS[asked]) window.PROTO_MOCK.seed(asked);
  }
}());
