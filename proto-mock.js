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
 *   window.PROTO_MOCK.car()               // just the car, keep everything else
 *   window.PROTO_MOCK.clear()             // back to a first-time visitor
 *   window.PROTO_MOCK.states             // { name: label } for the bar
 *
 * Selecting a mock scenario OVERWRITES funnel progress. That is the point — the
 * scenario *is* the state — but it means you lose a half-finished walkthrough.
 */
(function () {
  var FUNNEL_KEY   = 'autovex_funnel';
  var OFFERS_KEY   = 'autovex_offers';
  var DECISION_KEY = 'autovex_decision';

  /* One canonical car, shared by every state. Photo paths are assets that exist
     in the repo, so cards render a real image rather than the placeholder. */
  var PHOTO = 'assets/about-car.jpg';
  var CAR = {
    hero: { plate: 'LRX-345', km: '148 000' },
    details: {
      merkki: 'Volkswagen', malli: 'Amarok', mallitarkennus: '2.0 TDI Highline',
      vuosimalli: '2019', polttoaine: 'Diesel', vetotapa: 'Etuveto',
      vaihteisto: 'Automaatti', sijainti: 'Helsinki', deliveryRange: '50',
      kesarenkaat: 'Hyvät', kesavanteet: 'Vanteilla',
      talvirenkaat: 'Hyvät', talvivanteet: 'Vanteilla',
      avaimet: 'Kaksi', varustelu: '', yrityskaytto: false
    },
    services: {
      tiedot: 'available', bookType: 'Sähköinen',
      radioGroups: ['Kyllä', 'Ei', 'Ei', 'Ei', 'Kyllä'],
      lastServiceDetail: { km: 132000, month: '5', year: '2025' },
      korjaukset: ''
    },
    photos: {
      ulkopuoli: [PHOTO, PHOTO, PHOTO],
      sisatilat: [PHOTO, PHOTO]
    },
    contact: {
      kokoNimi: 'Matti Meikäläinen',
      sahkoposti: 'matti.meikalainen@example.fi',
      puhelin: '+358401234567'
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
      delete s.photos; delete s.contact;
      s.detailsLeft = true;
      write(FUNNEL_KEY, s); write(OFFERS_KEY, null); write(DECISION_KEY, null);
    },
    'draft-complete': function () {             // "launchingCar", continue to success
      var s = clone(CAR);
      s.detailsLeft = true; s.priceVisited = true; s.successVisited = true;
      write(FUNNEL_KEY, s); write(OFFERS_KEY, null); write(DECISION_KEY, null);
    },
    'in-review': function () {                  // "underReview" -> success.html
      var s = clone(CAR);
      s.detailsLeft = true; s.priceVisited = true; s.successVisited = true;
      s.emailVerified = true;
      write(FUNNEL_KEY, s); write(OFFERS_KEY, null); write(DECISION_KEY, null);
    },
    'auction-ongoing': function () {            // "auctionOngoing" -> offers.html
      var s = clone(CAR);
      s.detailsLeft = true; s.priceVisited = true; s.successVisited = true;
      s.emailVerified = true; s.offersVisited = true;
      write(FUNNEL_KEY, s);
      write(OFFERS_KEY, { scenario: 'auction-live' }); write(DECISION_KEY, null);
    },
    'auction-ended': function () {              // "auctionEnded" -> offers.html
      var s = clone(CAR);
      s.detailsLeft = true; s.priceVisited = true; s.successVisited = true;
      s.emailVerified = true; s.offersVisited = true;
      write(FUNNEL_KEY, s);
      write(OFFERS_KEY, { scenario: 'new-offers' }); write(DECISION_KEY, null);
    },
    'deal-completed': function () {             // "dealCompleted" -> offers.html
      var s = clone(CAR);
      s.detailsLeft = true; s.priceVisited = true; s.successVisited = true;
      s.emailVerified = true; s.offersVisited = true;
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

  window.PROTO_MOCK = {
    states: LABELS,
    seed: function (name) {
      var b = BUILDERS[name];
      if (!b) return false;
      b();
      return true;
    },
    /* Car details only — leaves funnel progress and scenario state alone. Used
       by the bar's "Seed demo car" action on pages that read car details but
       have their own scenario axis (offers, decision, success). */
    car: function () {
      var cur = {};
      try { cur = JSON.parse(localStorage.getItem(FUNNEL_KEY) || '{}'); } catch (e) {}
      var s = clone(CAR);
      Object.keys(s).forEach(function (k) { cur[k] = s[k]; });
      write(FUNNEL_KEY, cur);
    },
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
