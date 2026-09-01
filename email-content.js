/**
 * Transactional email content — transcribed from the production dump.
 *
 * Scope, as agreed: Finnish, C2B, seller-facing. Sweden, B2B and every
 * dealer-facing email are out (different team owns those).
 *
 * ── Two kinds of email, and only one of them can be rendered ────────────────
 *
 * **Blade-templated** (`rendered: true`): body, subject, sender and trigger all
 * live in the codebase, so the copy here is verbatim from
 * `resources/views/mail/...` plus `resources/lang/fi/email.php`. Each entry
 * records `template` and `langKeys` so re-checking against a newer dump is a
 * mechanical diff rather than a re-read.
 *
 * **Klaviyo-triggered** (`rendered: false`): the codebase holds only the event
 * name and payload — the copy and design live in Klaviyo, owned by Marketing.
 * They are listed so the journey has no invisible gaps, and deliberately not
 * rendered, because anything drawn here would be invented.
 *
 * ── Fidelity ───────────────────────────────────────────────────────────────
 *
 * Blade cannot be executed here: `<x-mail::message>`, `<x-mail::button>` and the
 * `{{ $tenderRequest->… }}` interpolations are resolved by hand. The COPY is
 * exact; the surrounding chrome is an approximation of
 * `resources/views/vendor/mail/html` + `themes/autovex.css` until a rendered
 * export replaces it. `emails.html` says so on the page.
 *
 * Interpolated values are rendered as placeholders — `[first name]`, `[make]`,
 * `[offer count]` — each carrying its source expression, so nothing dynamic can
 * be mistaken for copy.
 *
 * ── Two template shapes ────────────────────────────────────────────────────
 *
 * `shape: 'markdown'` — the notification calls `->markdown('mail.transactional…')`
 * with a full blade template. Chrome is header, body, footer. Nothing else.
 * The exception is the verification email, which renders through `mail.layout`
 * rather than `mail::message`: that layout adds a subcopy from the action label
 * and url, and its footer uses `email.footer`, which ends "Kaikki oikeudet
 * pidätetään." where `mail::footer` prints only "© <year> AutoVex". Both are
 * flagged per entry (`subcopy`, `footer`) rather than assumed from the shape.
 *
 * `shape: 'mailmessage'` — the notification builds the mail from
 * `->greeting()/->line()/->action()`. Laravel then adds three things the
 * markdown shape never gets: the greeting as the `<h1>`, the shared
 * `email.regards` salutation, and a `email.subcopy` block repeating the button's
 * URL as plain text. Captured .eml files from 2024 are what exposed this — the
 * blade templates alone do not show it.
 *
 * ── Initiative arms ────────────────────────────────────────────────────────
 *
 * An email (or one of its `states`) may carry `v1` — `{ subject, body }` — the
 * revised copy a live initiative proposes, exactly as `faq-content.js` items do.
 * `emails.html` reads the arm through `protoVariant` and renders the override
 * when it is on, so control always shows what production sends today. An
 * `initiative` field links the email to the spec page that owns the change, and
 * carries the reason it is a candidate even before copy exists.
 *
 * ── Conditionals ───────────────────────────────────────────────────────────
 *
 * None of the eleven Finnish templates contains `@if` — every branch is in the
 * notification class. Two shapes follow from that:
 *   • Different template per state → separate entries (the four auction-ended
 *     emails), each carrying the `condition` that selects it.
 *   • Same template, different strings per state → one entry with `states`
 *     (email verification's new vs returning seller).
 */
(function () {

  /* Every interpolated value is shown as a PLACEHOLDER, not a fixture value —
     a rendered "Matti" reads as part of the copy, which is exactly the confusion
     to avoid when reviewing what an email actually says. Body placeholders carry
     their source expression in `data-src`; the page lists them per email.

     No Finnish template interpolates a date, so there is no date logic to show
     here. The only time arithmetic lives in the notification classes and appears
     in each entry's `timing` (e.g. auction_ends_at + 4 h). */
  var RECIPIENT = '[seller email]';

  /* config/country/finland.php → 'email_for_sellers'. Sender name is config('app.name'). */
  var FROM = { name: 'Autovex', address: 'tiimi@autovex.fi' };

  /* resources/lang/fi/email.php — shared by every MailMessage-built email. */
  var SHARED = {
    regards: '<b>Parhain terveisin,</b><br>AutoVex-tiimi',
    subcopy: 'Jos sinulla on ongelmia ":action" napin kanssa, kopioi alla oleva URL ja liitä se selaimeesi.'
  };

  /* `route` is the prod route the button actually points at. Recorded because
     change 7 of Enhanced negotiations is exactly a route swap, and without it a
     proto target of `decision.html` would read as prod behaviour — every FI
     seller email in the dump goes to route('user.offers'), the LIST. */
  function btn(label, target, route) {
    return { label: label, target: target, route: route || null };
  }

  /* ── Blade-templated, seller-facing, Finnish ───────────────────────────────
     Order follows the seller's journey, which is also how the list is grouped. */
  var EMAILS = [
    {
      id: 'email-verification',
      tags: ['type:tender-request-draft-created', 'market:c2b', 'role:seller'],
      initiative: {
        slug: 'review-no-review',
        spec: 'design-specs/review-no-review.html',
        why: 'Step 1 of the new-seller list promises the review to every seller: "Kun olet vahvistanut sähköpostiosoitteesi ja tiimimme on tarkastanut ilmoituksesi, se julkaistaan". This is the first email a seller receives, and the same unconditional promise the funnel just removed.'
      },
      rendered: true,
      group: 'Draft created',
      state: 'Draft created, email not yet verified',
      trigger: 'App\\Mail\\TenderRequestDraftCreated — sent when the draft is created with an email address',
      timing: 'Immediately',
      template: 'resources/views/mail/tender-form/email-verification.blade.php',
      langKeys: ['email.email_verification.*'],
      shape: 'markdown',
      layout: 'mail.layout',
      centred: true,
      ctaBold: true,
      subcopy: true,
      footer: 'rights',
      note: 'The one template with a real conditional: every string has a new-seller and a returning-seller form, chosen by whether the draft already has a named seller. It also carries its own inline styles rather than the theme\'s — h1 20px and every paragraph centred — and ends with the shared help block.',
      states: [
        {
          id: 'new-seller',
          label: 'New seller',
          condition: '$draft->seller?->name is empty',
          subject: 'Vahvista sähköpostiosoitteesi ja jatka auton myyntiä',
          body:
            '<h1>Hei ja tervetuloa AutoVexille!</h1>' +
            '<p>Kiva, että haluat myydä autosi kauttamme!</p>' +
            '<p>Vahvistathan sähköpostiosoitteesi alla olevasta painikkeesta. Vahvistaminen on tärkeää, jotta pystymme pitämään sinut ajan tasalla auton myyntiprosessin kulusta.</p>' +
            '{{BUTTON}}' +
            '<p class="em-center em-lead"><b>Mitä seuraavaksi?</b></p>' +
            '<ol>' +
            '<li>Kun olet vahvistanut sähköpostiosoitteesi ja tiimimme on tarkastanut ilmoituksesi, se julkaistaan ja autoliikkeet alkavat kilpailla autostasi.</li>' +
            '<li>Autoliikkeet tekevät tarjouksia autostasi noin 36 tunnin ajan. Viikonloput ja arkipyhät pidentävät aikaa, jotta kaikki kiinnostuneet autoliikkeet ehtivät tekemään tarjouksen ja saat parhaan mahdollisen hinnan.</li>' +
            '<li>Tarjouskilpailun päätyttyä näet parhaan tarjouksen. Saatat nähdä myös vaihtoehtoisen tarjouksen, mikäli toivot auton noutoa kotoasi.</li>' +
            '<li>Hyväksyttyäsi tarjouksen yhdistämme sinut autoliikkeen kanssa. Voit turvallisin mielin tehdä kaupat luotettavan ostajan kanssa.</li>' +
            '</ol>' +
            '<p class="em-center">Auton myynti ei voisi olla tämän helpompaa!</p>' +
            '<div class="em-help"><p class="em-help-title"><b>Tarvitsetko neuvoja?</b></p><p>Olemme apunasi osoitteessa tiimi@autovex.fi (ark. 10-16)</p></div>',
          cta: btn('Vahvista sähköposti tästä', 'success.html?emailVerified=1', '$verificationUrl')
        },
        {
          id: 'existing-seller',
          label: 'Returning seller',
          condition: '$draft->seller?->name is set',
          subject: 'Jatka autosi myyntiä',
          body:
            '<h1>Hei ja tervetuloa takaisin AutoVexille!</h1>' +
            '<p>Kiva, että haluat myydä autosi kauttamme!</p>' +
            '<p>Tarjouspyyntösi luonnos on tallennettu. Pääset viimeistelemään tarjouspyynnön alla olevasta painikkeesta.</p>' +
            '{{BUTTON}}' +
            '<p class="em-center em-lead"><b>Mitä seuraavaksi?</b></p>' +
            '<p>Kun olet viimeistellyt tarjouspyyntösi, julkaisemme sen ja autoliikkeet alkavat kilpailla autostasi.</p>' +
            '<p class="em-center">Sinä voit rentoutua ja odotella parasta tarjousta!</p>' +
            '<p class="em-center">Auton myynti ei voisi olla tämän helpompaa!</p>' +
            '<div class="em-help"><p class="em-help-title"><b>Tarvitsetko neuvoja?</b></p><p>Olemme apunasi osoitteessa tiimi@autovex.fi (ark. 10-16)</p></div>',
          cta: btn('Vahvista sähköposti tästä', 'success.html?emailVerified=1', '$verificationUrl')
        }
      ]
    },

    {
      id: 'new-question',
      rendered: true,
      shape: 'mailmessage',
      group: 'Auction running',
      state: 'A dealership has asked the seller for more information',
      trigger: 'TenderQuestionApiController → $tenderRequest->user->notify(new NewQuestion(...))',
      timing: 'Immediately when the dealership asks',
      template: 'built from MailMessage — no blade template of its own',
      langKeys: ['email.new_question.subject', 'email.new_question.greeting', 'email.new_question.intro', 'email.new_question.action', 'email.regards', 'email.subcopy'],
      note: 'Built with ->greeting()/->line()/->action(), so Laravel adds the salutation and the fallback-URL subcopy. Found from a 2024 .eml capture; it has no blade template, which is why reading resources/views/mail alone missed it.',
      subject: 'AutoVex – Autostasi on esitetty kysymys',
      body:
        '<h1>Terve <var data-src="$notifiable-&gt;name">[name]</var></h1>' +
        '<p>Autostasi kiinnostunut autoliike on pyytänyt sinulta lisätietoja.</p>' +
        '{{BUTTON}}',
      cta: btn('Vastaa kysymykseen', 'offers.html', "route('user.offers')")
    },

    {
      id: 'draft-add-images',
      tags: ['type:draft-add-images', 'market:c2b', 'role:seller'],
      initiative: {
        slug: 'review-no-review',
        spec: 'design-specs/review-no-review.html',
        why: 'Assumes the review call already happened ("asiantuntijamme kanssa käymäsi puhelun mukaisesti"). True while only advisors send it; false the moment image chasing is automated for a non-reviewed car.'
      },
      rendered: true,
      group: 'Review',
      state: 'Draft rejected for missing images (only reachable for a reviewed car)',
      trigger: 'App\\Notifications\\Transactional\\DraftNeedMoreImages — dispatched by hand from the Filament review page',
      timing: 'When the advisor sends it, during or after the review call',
      template: 'resources/views/mail/transactional/finland/draft-add-images.blade.php',
      langKeys: ['email.transactional.draft_add_images.subject'],
      note: 'Advisor-triggered, so it exists only for cars that get reviewed at all. It also assumes the seller has already had the call ("asiantuntijamme kanssa käymäsi puhelun mukaisesti").',
      subject: '[first name], lisää vielä puuttuvat kuvat',
      body:
        '<h1>Hei <var data-src="$draft-&gt;user?-&gt;firstName() ?? $draft-&gt;firstName()">[first name]</var>, tarjouspyyntösi kaipaa vielä lisäkuvia!</h1>' +
        '<p>Melkein valmista! Lataa puuttuvat kuvat asiantuntijamme kanssa käymäsi puhelun mukaisesti. Tämän jälkeen kaikki on kunnossa myyntiä varten.</p>' +
        '<p>Klikkaa alla olevaa painiketta lisätäksesi kuvat. Myydään autosi yhdessä!</p>' +
        '{{BUTTON}}',
      cta: btn('Lisää kuvat', 'photos.html', '$draft->imageUploadLink()')
    },

    {
      id: 'ad-published',
      tags: ['type:ad-published', 'market:c2b', 'role:seller'],
      rendered: true,
      group: 'Ad published',
      state: 'Draft published — the auction can begin',
      trigger: 'TenderRequestDraftPublished event → SendConfirmationToSeller listener',
      timing: 'Immediately on publish',
      template: 'resources/views/mail/transactional/finland/ad-published.blade.php',
      langKeys: ['email.transactional.ad_published.subject'],
      subject: '[first name], tarjouspyyntösi on julkaistu!',
      body:
        '<h1>Hei <var data-src="$tenderRequest-&gt;user-&gt;firstName()">[first name]</var>, tarjouspyyntösi on nyt julkaistu!</h1>' +
        '<p>Mahtavaa, että valitsit meidät autosi <var data-src="$tenderRequest-&gt;make-&gt;name">[make]</var> <var data-src="$tenderRequest-&gt;model-&gt;name">[model]</var> myyntikanavaksi!</p>' +
        '<p>Nyt voit ottaa rennosti ja odottaa tarjouksia. Tarjouskilpailu on käynnissä 1,5 työpäivää ensimmäisen tarjouksen saatuasi.</p>' +
        '<p>Pidämme sinut ajan tasalla sähköpostitse koko prosessin ajan. Toivomme, että autosi myynti on helppoa ja nopeaa!</p>' +
        '{{BUTTON}}',
      cta: btn('Profiiliin', 'offers.html', "route('user.offers')")
    },

    {
      id: 'auction-ended-no-offers',
      tags: ['type:auction-ended-no-offers', 'market:c2b', 'role:seller'],
      initiative: {
        slug: 'review-no-review',
        spec: 'design-specs/review-no-review.html',
        why: 'States the review segment to the seller — ">200tkm tai ikää on yli 10 vuotta" — which is the same band the review filters use, presented as the reason dealerships were not interested.'
      },
      rendered: true,
      group: 'Auction ended',
      state: 'Auction ended, no offers',
      condition: 'offers.count() === 0',
      trigger: 'AuctionEnded event → Transactional\\AuctionEnded (C2B branch)',
      timing: 'When the auction ends',
      template: 'resources/views/mail/transactional/finland/auction-ended-no-offers.blade.php',
      langKeys: ['email.transactional.auction_ended_no_offers.subject'],
      note: 'The only auction-ended email with no CTA — it asks the seller to reply to the message instead. Its explanation of why no offers came names the >200k km / >10-year segment.',
      subject: 'Tarjouskilpailu on ohi autostasi [reg. no]',
      body:
        '<h1>Terve <var data-src="$tenderRequest-&gt;user-&gt;firstName()">[first name]</var>!</h1>' +
        '<p>Tarjouskilpailu on nyt ohi. Valitettavasti et saanut autostasi tarjouksia.</p>' +
        '<p>Ota meihin yhteyttä vastaamalla tähän viestiin, niin voimme yhdessä selvittää, miksi autoliikkeet eivät tällä kertaa kiinnostuneet autostasi. Voimme myös uusia tarjouspyyntösi mahdollisilla muutoksilla.</p>' +
        '<h2>Miksi tarjouksia ei tullut?</h2>' +
        '<p>Yleisimpiä syitä hiljaiseen tarjouskilpailuun:</p>' +
        '<h3>Tarjouspyyntö oli puutteellinen</h3>' +
        '<p>Jos auton varusteista tai huolto- ja vauriotiedoista kerrotaan suppeasti, eivät autoliikkeet kovin mielellään tee tarjouksia.</p>' +
        '<p>On tärkeää, että kuvat autosta on otettu huolellisesti ja kattavasti, jotta autoliike pystyy määrittelemään auton kunnon. Lisää kuvat myös huoltokirjasta ja renkaista.</p>' +
        '<h3>Auto on myynnissä myös muualla netissä</h3>' +
        '<p>Parhaan hinnan saaminen autosta on aina kilpailun tuotosta. Mikäli auto on samaan aikaan myynnissä myös toisella alustalla, jakautuvat ostajat moneen osoitteeseen ja lopputulos on todennäköisesti heikompi.</p>' +
        '<h3>Auton kilometrimäärä on yli 200tkm tai ikää on yli 10 vuotta</h3>' +
        '<p>Palvelussamme autoliikkeet ovat enimmäkseen kiinnostuneita vähemmän ajetuista ja uudemmista autoista.</p>',
      cta: null
    },

    {
      id: 'auction-ended-low-offers',
      tags: ['type:auction-ended-low-offers', 'market:c2b', 'role:seller'],
      initiative: {
        slug: null,
        spec: null,
        why: 'Selected by comparing the highest offer against asking_price, so removing the asking price changes which of the four auction-ended emails a seller receives. Belongs to the asking-price initiative, which has no spec page yet.'
      },
      rendered: true,
      group: 'Auction ended',
      state: 'Auction ended, best offer well below the asking price',
      condition: 'highestOffer < asking_price × 0.9',
      trigger: 'AuctionEnded event → Transactional\\AuctionEnded (C2B branch)',
      timing: 'When the auction ends',
      template: 'resources/views/mail/transactional/finland/auction-ended-low-offers.blade.php',
      langKeys: ['email.transactional.auction_ended_low_offers.subject'],
      note: 'Which of the four auction-ended emails a seller receives is computed from the asking price — the field the asking-price initiative wants to remove.',
      subject: 'Tarjouskilpailu on päättynyt. Katso saamasi tarjous!',
      body:
        '<h1>Terve <var data-src="$tenderRequest-&gt;user-&gt;firstName()">[first name]</var>!</h1>' +
        '<p>Tarjouskilpailu on nyt päättynyt. Sait autostasi <var data-src="$tenderRequest-&gt;offer_count">[offer count]</var> tarjousta <var data-src="$tenderRequest-&gt;offers-&gt;count()">[bidder count]</var> eri autoliikkeeltä. Huomioithan, että paras tarjous on voimassa vain 24 tuntia.</p>' +
        '<p>Mikäli olet tyytyväinen lopputulokseen, käythän hyväksymässä tarjouksen pian.</p>' +
        '{{BUTTON}}' +
        '<h2>Mitä tapahtuu seuraavaksi?</h2>' +
        '<p>Kun hyväksyt tarjouksen, autoliike on sinuun lähipäivinä yhteydessä puhelimitse. Yhdistämme sinut autoliikkeen ostajaan ja pääsette sopimaan käytännön asioista, kuten auton luovutuksen aikataulusta ja paikasta.</p>',
      cta: btn('Tutustu tarjoukseen tästä', 'offers.html', "route('user.offers')")
    },

    {
      id: 'auction-ended-good-offers',
      tags: ['type:auction-ended-good-offers', 'market:c2b', 'role:seller'],
      initiative: {
        slug: null,
        spec: null,
        why: 'Selected by comparing the highest offer against asking_price, so removing the asking price changes which of the four auction-ended emails a seller receives. Belongs to the asking-price initiative, which has no spec page yet.'
      },
      rendered: true,
      group: 'Auction ended',
      state: 'Auction ended, best offer just under the asking price',
      condition: 'asking_price × 0.9 ≤ highestOffer < asking_price',
      trigger: 'AuctionEnded event → Transactional\\AuctionEnded (C2B branch)',
      timing: 'When the auction ends',
      template: 'resources/views/mail/transactional/finland/auction-ended-good-offers.blade.php',
      langKeys: ['email.transactional.auction_ended_good_offers.subject'],
      note: 'Body is byte-identical to auction-ended-great-offers; only the subject differs. Two templates, one text.',
      subject: 'Tarjouskilpailu päättyi, katso tarjoukset autostasi [reg. no]!',
      body:
        '<h1>Moikka <var data-src="$tenderRequest-&gt;user-&gt;firstName()">[first name]</var>!</h1>' +
        '<p>Tarjouskilpailu on nyt päättynyt ja sait autostasi mahtavan tarjouksen!</p>' +
        '<p>Yhteensä sait <var data-src="$tenderRequest-&gt;offer_count">[offer count]</var> tarjousta <var data-src="$tenderRequest-&gt;offers-&gt;count()">[bidder count]</var> autoliikkeeltä.</p>' +
        '<p>Tarjoukset ovat voimassa 24 tuntia.</p>' +
        '<p>Näet kaikki tarjoukset profiilissasi. Siirry alla olevasta painikkeesta tarkastelemaan tarjouksia.</p>' +
        '{{BUTTON}}' +
        '<h2>Mitä seuraavaksi tapahtuu?</h2>' +
        '<p>Kun hyväksyt parhaan tarjouksen, autoliike on sinuun pian yhteydessä puhelimitse.</p>' +
        '<p>Pääsette sopimaan käytännön asioista, kuten aikataulusta, luovutuspaikasta, maksusta sekä mahdollisesta loppuvelan lunastamisesta.</p>',
      cta: btn('Katso tarjoukset', 'offers.html', "route('user.offers')")
    },

    {
      id: 'auction-ended-great-offers',
      tags: ['type:auction-ended-great-offers', 'market:c2b', 'role:seller'],
      initiative: {
        slug: null,
        spec: null,
        why: 'Selected by comparing the highest offer against asking_price, so removing the asking price changes which of the four auction-ended emails a seller receives. Belongs to the asking-price initiative, which has no spec page yet.'
      },
      rendered: true,
      group: 'Auction ended',
      state: 'Auction ended, best offer at or above the asking price',
      condition: 'highestOffer ≥ asking_price',
      trigger: 'AuctionEnded event → Transactional\\AuctionEnded (C2B branch)',
      timing: 'When the auction ends',
      template: 'resources/views/mail/transactional/finland/auction-ended-great-offers.blade.php',
      langKeys: ['email.transactional.auction_ended_great_offers.subject'],
      note: 'Same body as auction-ended-good-offers.',
      subject: '[first name], tarjouskilpailusi on päättynyt! Siirry hyväksymään tarjous',
      body:
        '<h1>Moikka <var data-src="$tenderRequest-&gt;user-&gt;firstName()">[first name]</var>!</h1>' +
        '<p>Tarjouskilpailu on nyt päättynyt ja sait autostasi mahtavan tarjouksen!</p>' +
        '<p>Yhteensä sait <var data-src="$tenderRequest-&gt;offer_count">[offer count]</var> tarjousta <var data-src="$tenderRequest-&gt;offers-&gt;count()">[bidder count]</var> autoliikkeeltä.</p>' +
        '<p>Tarjoukset ovat voimassa 24 tuntia.</p>' +
        '<p>Näet kaikki tarjoukset profiilissasi. Siirry alla olevasta painikkeesta tarkastelemaan tarjouksia.</p>' +
        '{{BUTTON}}' +
        '<h2>Mitä seuraavaksi tapahtuu?</h2>' +
        '<p>Kun hyväksyt parhaan tarjouksen, autoliike on sinuun pian yhteydessä puhelimitse.</p>' +
        '<p>Pääsette sopimaan käytännön asioista, kuten aikataulusta, luovutuspaikasta, maksusta sekä mahdollisesta loppuvelan lunastamisesta.</p>',
      cta: btn('Katso tarjoukset', 'offers.html', "route('user.offers')")
    },

    {
      id: 'delayed-negotiation-email',
      rendered: true,
      group: 'Decision',
      state: 'Auction ended with offers, seller has not answered and has started no negotiation',
      condition: 'offers exist · no negotiations · status not accepted/completed/… · seller is in the VWO treatment group (DELAYED_NEGOTIATION_CTA)',
      trigger: 'AuctionEnded event → SendDelayedNegotiationEmail listener',
      timing: '4 hours after auction_ends_at (queued with a delay)',
      template: 'resources/views/mail/transactional/delayed-negotiation-email.blade.php',
      langKeys: ['email.transactional.delayed_negotiation_email.subject'],
      note: 'Behind an A/B experiment, so only part of the audience receives it at all.',
      subject: 'Tee vastatarjous ja hoida autokaupat loppuun',
      body:
        '<h1>Terve <var data-src="$tenderRequest-&gt;user-&gt;firstName()">[first name]</var>!</h1>' +
        '<p>Autosi tarjouskilpailun päättymisestä on kulunut muutama tunti, ja autoliike odottaa vastaustasi.</p>' +
        '<p>Jos olet tyytyväinen lopputulokseen, käythän hyväksymässä tarjouksen pian. Tarjous on voimassa 24 tuntia päättymishetkestä.</p>' +
        '<p>Mikäli hinta vielä mietityttää, voit tehdä autoliikkeelle vastatarjouksen. Alkuperäinen tarjous pysyy silti voimassa.</p>' +
        '{{BUTTON}}',
      cta: btn('Tutustu tarjoukseen tästä', 'offers.html', "route('user.offers')")
    },

    {
      id: 'negotiation-dealer-replied-round-1',
      initiative: {
        slug: 'enhanced-negotiations',
        spec: 'design-specs/enhanced-negotiations.html',
        why: 'The button lands on the offers LIST, from where the seller has to find the car and work out that the dealer\'s reply is behind a secondary button. The initiative lands it on the decision page for that car instead.'
      },
      rendered: true,
      group: 'Counter-offer',
      state: 'Dealer answered the seller\'s first counter-offer',
      condition: 'negotiation messages count === 2',
      trigger: 'DealerNegotiationMessageStored event → NotifySellerAboutDealerNegotiationResponse',
      timing: 'Immediately when the dealer replies',
      template: 'resources/views/mail/transactional/finland/negotiation-dealer-replied-round-1.blade.php',
      langKeys: ['email.transactional.negotiation_dealer_replied_round_1.subject'],
      subject: 'Uusi tarjous autoliikkeeltä',
      body:
        '<h1>Terve <var data-src="$tenderRequest-&gt;user-&gt;firstName()">[first name]</var>!</h1>' +
        '<p>Hyviä uutisia! Autoliike on vastannut vastatarjoukseesi.</p>' +
        '<p>Voit nyt hyväksyä autoliikkeen tarjouksen tai tehdä uuden vastatarjouksen profiilissasi.</p>' +
        '<p>Tarjous on voimassa 24 tuntia.</p>' +
        '{{BUTTON}}',
      cta: btn('Katso tarjous', 'offers.html', "route('user.offers')"),
      v1: {
        cta: btn('Katso tarjous', 'decision.html?scenario=dealer-replied', "route('user.offers.decision', $tenderRequest)")
      }
    },

    {
      id: 'negotiation-dealer-replied-round-2',
      initiative: {
        slug: 'enhanced-negotiations',
        spec: 'design-specs/enhanced-negotiations.html',
        why: 'The button lands on the offers LIST, from where the seller has to find the car and work out that the dealer\'s reply is behind a secondary button. The initiative lands it on the decision page for that car instead.'
      },
      rendered: true,
      group: 'Counter-offer',
      state: 'Dealer answered the second counter-offer — no more counters allowed',
      condition: 'negotiation messages count === 4',
      trigger: 'DealerNegotiationMessageStored event → NotifySellerAboutDealerNegotiationResponse',
      timing: 'Immediately when the dealer replies',
      template: 'resources/views/mail/transactional/finland/negotiation-dealer-replied-round-2.blade.php',
      langKeys: ['email.transactional.negotiation_dealer_replied_round_2.subject'],
      subject: 'Uusi tarjous autoliikkeeltä',
      body:
        '<h1>Terve <var data-src="$tenderRequest-&gt;user-&gt;firstName()">[first name]</var>!</h1>' +
        '<p>Hyviä uutisia! Autoliike on vastannut vastatarjoukseesi.</p>' +
        '<p>Sinulla on 24 tuntia aikaa hyväksyä tarjous. Vastatarjouksia ei voi tehdä enempää.</p>' +
        '{{BUTTON}}' +
        '<p>Toivottavasti pääsette kauppoihin!</p>',
      cta: btn('Katso tarjous', 'offers.html', "route('user.offers')"),
      v1: {
        cta: btn('Katso tarjous', 'decision.html?scenario=dealer-replied', "route('user.offers.decision', $tenderRequest)")
      }
    },

    {
      id: 'final-offer-sent',
      rendered: true,
      group: 'Counter-offer',
      state: 'Dealer raised its offer as a final offer',
      trigger: 'FinalOfferInitiated event → NotifySellerAboutFinalOffer listener',
      timing: 'Immediately',
      template: 'resources/views/mail/transactional/finland/final-offer-sent.blade.php',
      langKeys: ['email.transactional.final_offer_sent.subject'],
      note: 'Lands on the offers list like every other seller email, but it is NOT part of change 7: a final offer is a raise on the highest offer (FinalOffer updates tender_offers directly), not a negotiation message, so there is no thread for the link to open.',
      subject: 'Mahtavia uutisia!',
      body:
        '<h1>Moikka <var data-src="$tenderRequest-&gt;user-&gt;firstName()">[first name]</var>!</h1>' +
        '<p>Mahtavia uutisia! Korkein tarjoaja on edelleen kiinnostunut tekemään kaupat autostasi ja korotettu tarjous löytyy nyt profiilistasi.</p>' +
        '<p>Tarjous on voimassa vain 24 tuntia. Siirry profiiliin katsomaan korotettu tarjous.</p>' +
        '{{BUTTON}}',
      cta: btn('Katso tarjous', 'offers.html', "route('user.offers')")
    },

    {
      id: 'negotiation-closed',
      initiative: {
        slug: 'enhanced-negotiations',
        spec: 'design-specs/enhanced-negotiations.html',
        why: 'The button lands on the offers LIST, from where the seller has to find the car and work out that the dealer\'s reply is behind a secondary button. The initiative lands it on the decision page for that car instead.'
      },
      rendered: true,
      group: 'Counter-offer',
      state: 'Negotiation closed, an offer is waiting for the seller',
      trigger: 'NegotiationClosed event → NotifySellerAboutNegotiationClosed listener',
      timing: 'Immediately',
      template: 'resources/views/mail/transactional/negotiation-closed-email.blade.php',
      langKeys: ['email.transactional.negotiation_closed.subject'],
      note: 'The same listener also fires a Klaviyo notification (CloseNegotiation), so the seller may receive two messages about one event.',
      subject: 'Neuvottelu on päättynyt',
      body:
        '<h1>Terve <var data-src="$tenderRequest-&gt;user-&gt;firstName()">[first name]</var>!</h1>' +
        '<p>Neuvottelu on päättynyt.</p>' +
        '<p>Tarjous odottaa hyväksyntääsi.</p>' +
        '{{BUTTON}}',
      cta: btn('Katso tarjous', 'offers.html', "route('user.offers')"),
      v1: {
        cta: btn('Katso tarjous', 'decision.html?scenario=negotiation-stopped', "route('user.offers.decision', $tenderRequest)")
      }
    },

    {
      id: 'personal-info-request',
      rendered: true,
      group: 'After the sale',
      state: 'Deal completed, DAC7 details not yet submitted',
      trigger: 'App\\Mail\\PersonalInformationRequired',
      timing: 'Sent up to three times, or until the details are filled in',
      template: 'resources/views/mail/legalities/personal-info-request.blade.php',
      langKeys: ['legalities.personal_info.request_notification.*'],
      note: 'Its own standalone HTML template, not the shared mail layout.',
      subject: 'Muistutus tietojen täydentämisestä',
      body:
        '<h1>Moi <var data-src="$tenderRequest-&gt;user-&gt;firstName()">[first name]</var>, ja onnea autokaupoista!</h1>' +
        '<p>Huomasimme, ettet ole vielä toimittanut meille tietojasi lakisääteiseen DAC7-raportointiin liittyen. AutoVex on lain mukaan vastuussa ilmoittamaan tietoja asiakkaidensa myynneistä veroviranomaisille.</p>' +
        '<p>Tietojen täyttäminen lomakkeelle on helppoa ja turvallista. Tietojasi käsitellään AutoVexin tietosuojakäytännön mukaisesti.</p>' +
        '<p>Lisätietoja DAC7-raportoinnista saat <a href="https://www.vero.fi/syventavat-vero-ohjeet/ohje-hakusivu/209369/raportoivan-alustaoperaattorin-tiedonantovelvollisuus-dac7/">Suomen Verohallinnon</a> verkkosivuilta.</p>' +
        '{{BUTTON}}' +
        '<p class="em-small">Velvoitteesta johtuen, tämä sähköposti lähetetään sinulle kolme kertaa tai kunnes tiedot on täytetty.</p>' +
        '<p class="em-small">Olemme apunasi osoitteessa tiimi@autovex.fi (arkisin 10-16)</p>',
      cta: btn('Täytä tietosi tästä', 'dac7.html', "route('user.personal-information')")
    },

    {
      id: 'user-inactivity-warning',
      rendered: true,
      group: 'After the sale',
      state: 'Account unused for a long time, deletion pending',
      trigger: 'App\\Mail\\UserInactivityWarning, dispatched by the SendUserInactivityWarningEmail command',
      timing: 'Scheduled command; the seller has 30 days to log in',
      template: 'resources/views/mail/reminders/user_inactivity_warning.blade.php',
      langKeys: ['email.user_inactivity_warning.*'],
      subject: 'Profiilisi poistetaan pian – kirjaudu säilyttääksesi tietosi',
      body:
        '<h1>Moi <var data-src="$tenderRequest-&gt;user-&gt;firstName()">[first name]</var>!</h1>' +
        '<p>AutoVex-profiilisi on ollut pitkään käyttämättä. Poistamme profiilin ja siihen liittyvät tiedot pian, ellet kirjaudu sisään.</p>' +
        '<p>Kirjaudu sisään seuraavan 30 päivän aikana, niin säilytät tiedot aiemmista ilmoituksistasi ja vastaanotat meiltä viestintää myös jatkossa.</p>' +
        '{{BUTTON}}',
      cta: btn('Kirjaudu profiiliisi', 'offers.html', "route('user.offers')")
    }
  ];

  /* ── Klaviyo-triggered — listed, never rendered ────────────────────────────
     The codebase holds the event name and the payload; the copy lives in
     Klaviyo. Seller-facing events only. */
  var KLAVIYO = [
    { event: 'negotiation_new',                cls: 'NewNegotiationSeller',              state: 'Seller sent a counter-offer' },
    { event: 'negotiation_asking_price_final',  cls: 'NegotiationAskingPriceFinalSeller', state: 'Seller gave a final asking price' },
    { event: 'offer_accepted',                 cls: 'OfferAcceptedSeller',               state: 'Seller accepted an offer' },
    { event: 'offer_rejected',                 cls: 'OfferRejectedSeller',               state: 'Seller rejected an offer' },
    { event: 'offers_auto_rejected',           cls: 'OffersAutoRejected',                state: 'Offers expired without an answer' },
    { event: 'final_offer_initiated',          cls: 'FinalOfferInitiated',               state: 'Dealer started a final offer' },
    { event: 'final_offer_rejected',           cls: 'FinalOfferRejectedSeller',          state: 'Final offer rejected' },
    { event: 'delivery_date_set',              cls: 'DeliveryDateSetSeller',             state: 'Handover date agreed' },
    { event: 'deal_completed_verification',    cls: 'DealCompletedVerificationSms',      state: 'Deal completed (SMS)' },
    { event: 'failed_sale',                    cls: 'FailedSale',                        state: 'Sale fell through' },
    { event: 'request_expired',                cls: 'RequestExpired',                    state: 'Request expired' },
    { event: '(no EVENT_NAME constant)',       cls: 'CloseNegotiation',                  state: 'Negotiation closed — fires alongside the blade email above' },
    { event: '(no EVENT_NAME constant)',       cls: 'NegotiationCallSeller',             state: 'Advisor should call the seller about a negotiation' },
    { event: '(no EVENT_NAME constant)',       cls: 'NegotiationKeepOffer',              state: 'Seller keeps the current offer' },
    { event: '(no EVENT_NAME constant)',       cls: 'NegotiationKeepOfferFinal',         state: 'Seller keeps the final offer' },
    { event: '(no EVENT_NAME constant)',       cls: 'RequestStatus',                     state: 'Request status changed' },
    { event: '(no EVENT_NAME constant)',       cls: 'TenderRequestSuccessfulNotification', state: 'Request created successfully' },
    { event: '(no EVENT_NAME constant)',       cls: 'DeletedTenderRequest',              state: 'Request deleted' },
    { event: '(no EVENT_NAME constant)',       cls: 'LoginInfoNotification',             state: 'Login details' }
  ];

  window.EMAIL_CONTENT = {
    recipient: RECIPIENT,
    shared: SHARED,
    from: FROM,
    emails: EMAILS,
    klaviyo: KLAVIYO,
    /* Where the copy came from, shown on the page so nobody mistakes the shell
       for a rendered export. */
    source: {
      dump: 'Prod-codebase/autovex-2026-08-26-1ee95731e59f',
      lang: 'resources/lang/fi/email.php',
      views: 'resources/views/mail/',
      preview: 'app/Filament/Pages/TransactionalEmails.php'
    }
  };
}());
