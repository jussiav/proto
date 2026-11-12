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
 * **Sent to Klaviyo** (the `KLAVIYO` list): the codebase holds only an event
 * name and its payload. Whether Klaviyo sends an email or an SMS for an event,
 * and its copy, is set up in Klaviyo by Marketing. They are listed so the
 * journey has no invisible gaps, and never rendered, because anything drawn
 * here would be invented.
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
 * ── Emails production does not send ────────────────────────────────────────
 *
 * An entry with `proposed` is an email a design initiative adds, which no dump
 * contains. Its copy comes from the initiative's spec, not the dump, and
 * `proposed` names the initiative, its arm, the spec section and how far it
 * has got. `emails.html` marks it "Not in production" in the list, on the
 * email and in Details, and always renders it: there is no production version
 * to compare it with.
 *
 * ── Conditionals ───────────────────────────────────────────────────────────
 *
 * No Finnish template branches: every branch is in the notification class (the
 * login-code template's two `@if`s guard values that are always passed). Two
 * shapes follow from that:
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
      rendered: true,
      group: 'Draft created',
      state: 'Draft created, email not yet verified',
      trigger: 'App\\Mail\\TenderRequestDraftCreated — sent when the draft is created with an email address (CreateDraft), when a contact-step save changes the address (UpdateDraft), when the seller changes it on the waiting screen (UpdateEmail) or asks for it again (ResendEmailVerificationLink), and from Filament\'s draft pages',
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
      ctaBold: true,
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
      rendered: true,
      group: 'Review',
      state: 'Draft rejected for missing images (only reachable for a reviewed car)',
      trigger: 'App\\Notifications\\Transactional\\DraftNeedMoreImages — dispatched by hand from the Filament review page',
      timing: 'When the advisor sends it, during or after the review call',
      template: 'resources/views/mail/transactional/finland/draft-add-images.blade.php',
      langKeys: ['email.transactional.draft_add_images.subject'],
      note: 'Advisor-triggered, so it exists only for cars that get reviewed at all. It also assumes the seller has already had the call ("asiantuntijamme kanssa käymäsi puhelun mukaisesti"). The only transactional email whose class sets no Mailgun tags.',
      subject: '[first name], lisää vielä puuttuvat kuvat',
      body:
        '<h1>Hei <var data-src="$draft-&gt;user?-&gt;firstName() ?? $draft-&gt;firstName()">[first name]</var>, tarjouspyyntösi kaipaa vielä lisäkuvia!</h1>' +
        '<p>Melkein valmista! Lataa puuttuvat kuvat asiantuntijamme kanssa käymäsi puhelun mukaisesti. Tämän jälkeen kaikki on kunnossa myyntiä varten.</p>' +
        '<p>Klikkaa alla olevaa painiketta lisätäksesi kuvat. Myydään autosi yhdessä!</p>' +
        '{{BUTTON}}',
      cta: btn('Lisää kuvat', 'photos.html?step=add-images', '$draft->imageUploadLink()')
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
      rendered: true,
      group: 'Auction ended',
      state: 'Auction ended, no offers',
      condition: 'offers.count() === 0',
      trigger: 'AuctionEnded event → NotifySellerAboutAuctionEnded → Transactional\\AuctionEnded (C2B branch)',
      timing: 'When the auction ends',
      template: 'resources/views/mail/transactional/finland/auction-ended-no-offers.blade.php',
      langKeys: ['email.transactional.auction_ended_no_offers.subject'],
      note: 'The only auction-ended email with no CTA — it asks the seller to reply to the message instead. Its explanation of why no offers came names the >200k km / >10-year segment; Review/No review looked at that sentence and decided to KEEP it, so this email is unchanged by the initiative.',
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
        slug: 'asking-price-removal',
        spec: 'design-specs/asking-price-removal.html',
        why: 'The choice between this email and its two siblings reads the asking price, which no screen after the price step shows the consumer seller any more. No copy change is proposed yet; the open question is findings EML-06.'
      },
      rendered: true,
      group: 'Auction ended',
      state: 'Auction ended, best offer well below the asking price',
      choice: { group: 'auction-ended-offers', order: 1, short: 'offer under 90 % of asking price', when: 'the highest offer is under 90 % of the asking price' },
      condition: 'highestOffer < asking_price × 0.9',
      trigger: 'AuctionEnded event → NotifySellerAboutAuctionEnded → Transactional\\AuctionEnded (C2B branch)',
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
        slug: 'asking-price-removal',
        spec: 'design-specs/asking-price-removal.html',
        why: 'The choice between this email and its two siblings reads the asking price, which no screen after the price step shows the consumer seller any more. No copy change is proposed yet; the open question is findings EML-06.'
      },
      rendered: true,
      group: 'Auction ended',
      state: 'Auction ended, best offer just under the asking price',
      choice: { group: 'auction-ended-offers', order: 2, short: 'offer at least 90 %, below asking price', when: 'the highest offer is at least 90 % of the asking price but below it' },
      condition: 'asking_price × 0.9 ≤ highestOffer < asking_price',
      trigger: 'AuctionEnded event → NotifySellerAboutAuctionEnded → Transactional\\AuctionEnded (C2B branch)',
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
        slug: 'asking-price-removal',
        spec: 'design-specs/asking-price-removal.html',
        why: 'The choice between this email and its two siblings reads the asking price, which no screen after the price step shows the consumer seller any more. No copy change is proposed yet; the open question is findings EML-06.'
      },
      rendered: true,
      group: 'Auction ended',
      state: 'Auction ended, best offer at or above the asking price',
      choice: { group: 'auction-ended-offers', order: 3, short: 'offer at or above asking price', when: 'the highest offer is at or above the asking price' },
      condition: 'highestOffer ≥ asking_price',
      trigger: 'AuctionEnded event → NotifySellerAboutAuctionEnded → Transactional\\AuctionEnded (C2B branch)',
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
      tags: ['type:delayed-negotiation-email', 'market:c2b', 'role:seller'],
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
      cta: btn('Tutustu tarjoukseen tästä', 'decision.html?scenario=seen-offers', "route('user.offers.decision', $tenderRequest)")
    },

    {
      id: 'negotiation-dealer-replied-round-1',
      tags: ['type:negotiation-dealer-replied-round-1', 'market:c2b', 'role:seller'],
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
      cta: btn('Katso tarjous', 'decision.html?scenario=dealer-replied', "route('user.offers.decision', $tenderRequest)")
    },

    {
      id: 'negotiation-dealer-replied-round-2',
      tags: ['type:negotiation-dealer-replied-round-2', 'market:c2b', 'role:seller'],
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
      cta: btn('Katso tarjous', 'decision.html?scenario=dealer-replied', "route('user.offers.decision', $tenderRequest)")
    },

    {
      id: 'final-offer-sent',
      tags: ['type:final-offer-sent', 'market:c2b', 'role:seller'],
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
      tags: ['type:negotiation-closed-email', 'type:negotiation-closed', 'market:c2b', 'role:seller'],
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
      cta: btn('Katso tarjous', 'decision.html?scenario=negotiation-stopped', "route('user.offers.decision', $tenderRequest)")
    },

    {
      id: 'personal-info-request',
      tags: ['type:personal-information-required', 'market:c2b', 'role:seller'],
      rendered: true,
      group: 'After the sale',
      state: 'Deal completed, DAC7 details not yet submitted',
      trigger: 'App\\Mail\\PersonalInformationRequired',
      timing: 'Sent up to three times, or until the details are filled in',
      template: 'resources/views/mail/legalities/personal-info-request.blade.php',
      langKeys: ['legalities.personal_info.request_notification.*'],
      ctaBold: true,
      subcopy: true,
      footer: 'rights',
      note: 'Its own standalone HTML template, not the shared mail layout. It writes in by hand what the layout would add: the sign-off, the help lines and the fallback-URL subcopy, and its footer is email.footer ("Kaikki oikeudet pidätetään."). The link is signed and valid for two weeks.',
      subject: 'Muistutus tietojen täydentämisestä',
      body:
        '<h1>Moi <var data-src="Arr::first(explode(\' \', $this-&gt;user-&gt;name))">[first name]</var>, ja onnea autokaupoista!</h1>' +
        '<p>Huomasimme, ettet ole vielä toimittanut meille tietojasi lakisääteiseen DAC7-raportointiin liittyen. AutoVex on lain mukaan vastuussa ilmoittamaan tietoja asiakkaidensa myynneistä veroviranomaisille.</p>' +
        '<p>Tietojen täyttäminen lomakkeelle on helppoa ja turvallista. Tietojasi käsitellään AutoVexin tietosuojakäytännön mukaisesti.</p>' +
        '<p>Lisätietoja DAC7-raportoinnista saat <a href="https://www.vero.fi/syventavat-vero-ohjeet/ohje-hakusivu/209369/raportoivan-alustaoperaattorin-tiedonantovelvollisuus-dac7/">Suomen Verohallinnon</a> verkkosivuilta.</p>' +
        '{{BUTTON}}' +
        '<p>Velvoitteesta johtuen, tämä sähköposti lähetetään sinulle kolme kertaa tai kunnes tiedot on täytetty.</p>' +
        '<p>' + SHARED.regards + '</p>' +
        '<div class="em-help"><p class="em-help-title"><b>Tarvitsetko neuvoja?</b></p><p>Olemme apunasi osoitteessa tiimi@autovex.fi (ark. 10-16)</p></div>',
      cta: btn('Täytä tietosi tästä', 'dac7.html', "URL::temporarySignedRoute('tender-requests.personal-information', now()->addWeeks(2), …)")
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
        '<h1>Moi <var data-src="$user-&gt;firstName()">[first name]</var>!</h1>' +
        '<p>AutoVex-profiilisi on ollut pitkään käyttämättä. Poistamme profiilin ja siihen liittyvät tiedot pian, ellet kirjaudu sisään.</p>' +
        '<p>Kirjaudu sisään seuraavan 30 päivän aikana, niin säilytät tiedot aiemmista ilmoituksistasi ja vastaanotat meiltä viestintää myös jatkossa.</p>' +
        '{{BUTTON}}',
      cta: btn('Kirjaudu profiiliisi', 'offers.html', "$user->loginAsQRRoute('offers'), a signed link that logs the seller in")
    },

    /* The login page's two emails. Any user gets them, not only sellers: the
       tags say market:unknown / role:unknown. Transcribed from the 2026-11-11
       dump. */
    {
      id: 'email-login-code',
      tags: ['type:email-login', 'market:unknown', 'role:unknown'],
      rendered: true,
      group: 'Login',
      state: 'Seller asked for a login code on the login page',
      trigger: 'App\\Mail\\EmailLoginCode, sent by User::sendLoginCode() from POST /email-login ("Lähetä kirjautumiskoodi" or "lähetä linkki uudelleen")',
      timing: 'Immediately. The code is valid for 15 minutes, a new one replaces the last, and at most 3 can be sent a minute',
      template: 'resources/views/mail/auth/email-login.blade.php',
      langKeys: ['email.email_login.subject', 'email.email_login.intro', 'auction.need_help', 'auction.weekdays', 'legalities.personal_info.request_notification.contact_details'],
      shape: 'markdown',
      ctaNone: 'none: the seller types the code into the login page. The class passes email.email_login.action ("Kirjaudu sisään") to the template, which never prints it',
      note: 'The code is the email\'s <h1>, written in #0B6DFF inline; the intro above it is an <h2>. Both @if guards in the template are always true, since the class always passes the intro and a code. Filament\'s transactional email preview shows it with the code 123456.',
      subject: 'AutoVex – kirjautumiskoodi',
      body:
        '<h2>Tervetuloa! Tässä kirjautumiskoodisi:</h2>' +
        '<h1 style="color:#0B6DFF"><var data-src="$attributes[\'code\'] (EmailLoginCode, 6 digits)">[login code]</var></h1>' +
        '<h3>Tarvitsetko neuvoja?</h3>' +
        '<p>Olemme apunasi osoitteessa tiimi@autovex.fi (ark. 10-16)</p>',
      cta: null
    },

    {
      id: 'reset-password',
      rendered: true,
      shape: 'mailmessage',
      group: 'Login',
      state: 'Seller asked for a new password on the login page',
      trigger: 'App\\Notifications\\ResetPassword, sent by User::sendPasswordResetNotification() from POST /forgot-password ("Unohditko salasanasi" → "Lähetä")',
      timing: 'Immediately. The link is valid for 60 minutes, and a new one can be sent after 60 seconds',
      template: 'built from MailMessage, rendered by resources/views/vendor/notifications/email.blade.php',
      langKeys: ['email.reset_password.*', 'email.hello', 'email.regards', 'email.subcopy'],
      ctaBold: true,
      note: 'No greeting is set, so the template prints email.hello ("Moikka!") as the <h1>. The link carries only the token, never the address; the reset page looks the account up from it. Not in Filament\'s transactional email preview.',
      subject: 'Salasanan vaihto',
      body:
        '<h1>Moikka!</h1>' +
        '<p>Hoidetaan sinulle uusi salasana!</p>' +
        '{{BUTTON}}' +
        '<p>Jos et pyytänyt salasanan uusimista, sinun ei tarvitse tehdä mitään.</p>',
      cta: btn('Valitse salasana', 'reset-password.html?newLink=1', "route('auth.password.reset', ['token' => $token])")
    },

    /* NOT IN PRODUCTION. The Klaviyo consent initiative's v1 adds it: the
       developers built it on a branch that is in no dump yet, and the copy is
       the design spec's, approved by UX on 2026-11-11. */
    {
      id: 'email-change-confirmation',
      rendered: true,
      proposed: {
        slug: 'klaviyo-consent',
        name: 'Klaviyo consent',
        arm: 'v1',
        spec: 'design-specs/klaviyo-consent.html#c3',
        status: 'Proposal sent to the team, ready to build if they agree. Copy approved by UX on 11 November 2026',
        builtAs: 'Not known: the developers\' branch is not in a dump. Shown with exactly the parts the spec lists (greeting, body, button, closing line). If it is built like the reset email, Laravel also adds the salutation and the fallback-URL subcopy'
      },
      group: 'Profile',
      recipient: '[new email address]',
      state: 'Seller saved a new email address on the profile page',
      trigger: 'Saving a new address with "Päivitä" on Profiilin muokkaus. In production today the address changes at once and no email is sent',
      timing: 'Immediately. The link is valid for [minutes] minutes (not decided yet); saving another address sends a new link that replaces it',
      template: 'not in the production dump',
      note: 'Goes to the new address only; a notice to the old address is an open question on the spec. The button opens the profile page in v1 and confirms the address waiting there. With nothing waiting, the link would be used or replaced, and that page is not designed yet.',
      subject: 'Vahvista uusi sähköpostiosoitteesi',
      body:
        '<h1>Hei!</h1>' +
        '<p>Pyysit vaihtamaan AutoVex-profiilisi sähköpostiosoitteeksi tämän osoitteen. Vahvista se alla olevasta painikkeesta. Linkki on voimassa <var data-src="link lifetime, set by the developers">[minutes]</var> minuuttia.</p>' +
        '{{BUTTON}}' +
        '<p>Jos et pyytänyt vaihtoa, sinun ei tarvitse tehdä mitään. Profiilisi sähköpostiosoite ei muutu.</p>',
      cta: btn('Vahvista sähköpostiosoite', 'profile.html?klaviyo-consent=v1&emailConfirm=1', 'the confirmation link (not in the dump)')
    }
  ];

  /* Emails of which only one is sent, chosen by a rule. Each member carries
     `choice: { group, order, short, when }`; the tool frames the members as one block
     in the list and names the rule on each of them. */
  var CHOICES = {
    'auction-ended-offers': {
      title: 'Only one of these three is sent',
      rule: 'Picked by comparing the highest offer with the seller\'s asking price',
      finding: 'EML-06'
    }
  };

  /* ── Events sent to Klaviyo — listed, never rendered ──────────────────────
     Every notification class in the 2026-11-11 dump that posts an event to
     Klaviyo's API (KlaviyoChannel, or the NotifiesViaKlaviyo trait). All go to
     the car's owner, LoginInfo to any user. They are sent in production only
     and never for a B2B seller, so preview environments and Mailpit never show
     them. The code holds the event name and its payload, nothing else: whether
     Klaviyo turns an event into an email or an SMS, and with what copy, is set
     up in Klaviyo by Marketing, and whether that flow is live is not in the
     code either. `sms` is a text message the class sends itself through Sinch,
     outside Klaviyo; `notSent` marks a class nothing in the dump sends. */
  var KLAVIYO = [
    { stage: 'Draft', event: 'NewTenderRequestDraft',                 cls: 'NewTenderRequestDraft',                 state: 'A draft was created with an email address, or the address was changed on the waiting screen' },
    { stage: 'Draft', event: 'TenderRequestDraftUpdated',             cls: 'TenderRequestDraftUpdated',             state: 'The seller saved a funnel step' },
    { stage: 'Draft', event: 'TenderRequestDraftEmailVerified',       cls: 'TenderRequestDraftEmailVerified',       state: 'The seller verified their email from the link' },
    { stage: 'Draft', event: 'TenderRequestDraftMarkedForReview',     cls: 'TenderRequestDraftMarkedForReview',     state: 'The draft went to review when it was published (also posted to Slack)' },
    { stage: 'Draft', event: 'TenderRequestDraftQueuedForPublishing', cls: 'TenderRequestDraftQueuedForPublishing', state: 'The draft waits for email verification before it publishes' },
    { stage: 'Draft', event: 'TenderRequestDraftRejected',            cls: 'TenderRequestDraftRejected',            state: 'An advisor rejected the draft in the review' },
    { stage: 'Draft', event: 'TenderRequestDraftAutoRejected',        cls: 'TenderRequestDraftAutoRejected',        state: 'A draft rejected automatically as unfit', notSent: true },
    { stage: 'Draft', event: 'DeletedTenderRequestDraft',             cls: 'DeletedTenderRequestDraft',             state: 'The seller deleted a draft' },

    { stage: 'Auction', event: 'TenderRequestNew',     cls: 'NewTenderRequest', state: 'The draft was published and the auction began' },
    { stage: 'Auction', event: 'OfferNew',             cls: 'NewOffer',         state: 'A dealership made an offer' },
    { stage: 'Auction', event: 'OfferUpdated',         cls: 'UpdatedOffer',     state: 'The highest offer rose during the auction' },
    { stage: 'Auction', event: 'TenderRequestStatus',  cls: 'RequestStatus',    state: 'Daily at 06:00, to a live auction with no offers yet' },
    { stage: 'Auction', event: 'TenderRequestExpired', cls: 'RequestExpired',   state: 'The request expired, leaving the active state', sms: 'if the seller has not seen the offers yet' },

    { stage: 'Decision', event: 'OfferAccepted',                      cls: 'OfferAcceptedSeller',      state: 'The seller accepted an offer', sms: 'when the accepted-offer SMS setting is on' },
    { stage: 'Decision', event: 'OfferRejected',                      cls: 'OfferRejectedSeller',      state: 'The seller rejected the offers', sms: 'when the highest offer is at least 80 % of the asking price, no offer is pending and the request is inactive' },
    { stage: 'Decision', event: 'OfferAutoRejected',                  cls: 'OffersAutoRejected',       state: 'Offers expired without an answer, on a request with no negotiation', sms: 'same rule as OfferRejected' },
    { stage: 'Decision', event: 'FinalOfferInitiatedByHighestBidder', cls: 'FinalOfferInitiated',      state: 'The highest bidder raised its offer as a final offer, alongside the "Mahtavia uutisia!" email', sms: 'always' },
    { stage: 'Decision', event: 'FinalOfferRejected',                 cls: 'FinalOfferRejectedSeller', state: 'The seller rejected the final offer', sms: 'same rule as OfferRejected' },

    { stage: 'Negotiation', event: 'NegotiationNew',              cls: 'NewNegotiationSeller',              state: 'The seller sent their first counter-offer' },
    { stage: 'Negotiation', event: 'NegotiationAskingPriceFinal', cls: 'NegotiationAskingPriceFinalSeller', state: 'The seller sent their second, last counter-offer' },
    { stage: 'Negotiation', event: 'NegotiationKeepOffer',        cls: 'NegotiationKeepOffer',              state: 'The dealership replied in the first round, raised or not, alongside the dealer-replied email' },
    { stage: 'Negotiation', event: 'NegotiationKeepOfferFinal',   cls: 'NegotiationKeepOfferFinal',         state: 'The dealership replied in the second round, alongside the dealer-replied email' },
    { stage: 'Negotiation', event: 'CloseNegotiation',            cls: 'CloseNegotiation',                  state: 'The dealership closed the negotiation, alongside the "Neuvottelu on päättynyt" email' },
    { stage: 'Negotiation', event: 'CallSeller',                  cls: 'NegotiationCallSeller',             state: 'A dealership chose to phone the seller, unless it has already replied in a negotiation' },

    { stage: 'After the sale', event: 'DeliveryDateSet',           cls: 'DeliveryDateSetSeller',               state: 'The handover date was agreed', sms: 'when the delivery-date SMS setting is on and the sale is neither completed nor failed' },
    { stage: 'After the sale', event: 'DealCompletedVerification', cls: 'DealCompletedVerificationSms',        state: 'Scheduled after the agreed handover date, to confirm the sale', sms: 'when the deal-completed SMS setting is on' },
    { stage: 'After the sale', event: 'TenderRequestSuccessful',   cls: 'TenderRequestSuccessfulNotification', state: 'The sale was completed' },
    { stage: 'After the sale', event: 'FailedSale',                cls: 'FailedSale',                          state: 'The sale fell through', sms: 'when the failed-sale SMS setting is on' },
    { stage: 'After the sale', event: 'DeletedRequest',            cls: 'DeletedTenderRequest',                state: 'The request was deleted' },

    { stage: 'Account', event: 'LoginInfo', cls: 'LoginInfoNotification', state: 'Any user logged in' }
  ];

  window.EMAIL_CONTENT = {
    recipient: RECIPIENT,
    shared: SHARED,
    from: FROM,
    emails: EMAILS,
    choices: CHOICES,
    klaviyo: KLAVIYO,
    /* Where the copy came from, shown on the page so nobody mistakes the shell
       for a rendered export. */
    source: {
      dump: 'prod/autovex-2026-11-11-dc54e9a95415',
      lang: 'resources/lang/fi/email.php',
      views: 'resources/views/mail/',
      preview: 'app/Filament/Pages/TransactionalEmails.php'
    }
  };
}());
