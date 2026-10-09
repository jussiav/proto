/* English for `decision.html`, for ideating with the team — see `proto-i18n.js`.
 *
 * WHAT THIS IS AND IS NOT. It is a reading aid, the same category as the English
 * glosses on the spec pages: it exists so the team can read the decision page in
 * English instead of pasting it into a translator. **It is not product copy and
 * none of it is approved.** Production's own English comes from Laravel and
 * vue-i18n, and for several of these strings prod has no English at all —
 * `tender.rejection_reason_for_seller.*` has no `en` entry in any dump.
 *
 * WHAT IS NOT IN HERE, because it already translates:
 *  - the FAQ — `faq-content.js` carries both languages and the page re-renders
 *    it on `av:langchange`;
 *  - the nav and the footer — `site-nav.js` and `layout.js` use `data-i18n`.
 *
 * A STRING WITH NO ENTRY STAYS FINNISH, which is the right failure: a page in
 * two languages reads as unfinished, where one Finnish line among English reads
 * as a gap to fill. Add the entry rather than working around it.
 *
 * Strings carrying a figure live in `patterns` — the amount, the countdown and
 * the bid counts are rendered, so an exact key could never match them.
 */
window.DECISION_I18N = {
  patterns: [
    { re: /^(\d+) autoliikettä perehtyi autoosi ja kilpaili siitä\. Kilpailu nosti hinnan ([\d\s\u00a0]+) euroon\. Pidämme sitä hyvänä markkinahintana ja suosittelemme hyväksymään tarjouksen\.$/,
      en: '$1 dealerships studied your car and competed over it. The competition raised the price to €$2. We consider it a good market price and recommend accepting the offer.' },
    { re: /^(\d+)\+ kauppaa AutoVexissä$/,            en: '$1+ deals on AutoVex' },
    { re: /^(\d+) pv sitten$/,                        en: '$1 d ago' },
    { re: /^Toimita liikkeeseen \((\d+) km\)$/,       en: 'Deliver to the dealership ($1 km)' },
    { re: /^Pyyntihintasi oli (.+)$/,                 en: 'Your asking price was $1' },
    { re: /^Lähetä vastatarjous \((\d+) jäljellä\)$/, en: 'Send counter offer ($1 left)' },
    { re: /^Vastatarjouksia jäljellä (\d+)$/,         en: 'Counter offers left: $1' }
  ],

  strings: {
    /* Sections */
    'Tarjouskilpailun tulos':             'Auction result',
    'Tarjouskilpailun tiedot':            'Auction details',
    'Tarjous vai pyyntihinta?':            'An offer or an asking price?',
    'Nettiauton hinta vs. tarjouksesi':    'A Nettiauto price vs. your offer',
    'Mietitkö vielä?':                    'Still weighing it up?',
    'Tarvitsetko apua?':                  'Need help?',
    'Usein kysytyt kysymykset':           'Frequently asked questions',
    'Muuta kysyttävää?':                  'Anything else?',

    /* The auction result */
    'Suosittelemme hyväksymään':           'We recommend accepting',
    'Paras hinta autostasi on nyt selvillä!': 'The best price for your car is now known!',
    'Autoliikkeitä':                       'Dealerships',
    'Korotuksia':                          'Raises',
    'Tarjouksia yhteensä':                 'Offers in total',
    'Tarjoajat':                           'Bidders',
    'Tarjousta':                           'Offers',
    'Autoliikettä':                        'Dealerships',
    'Odotettu hinta':                      'Expected price',

    /* The resale chain. The lead FORKED on 2026-09-28 — v1 opens on the claim,
       v2 still opens on the correction — so both keys have to exist or the arm
       that is not listed silently renders Finnish. */
    'Muistathan kun vertaat hintoja, että AutoVex-tarjoukset ja Nettiauton hinnat tarkoittavat eri asioita. Autoliikkeen pyyntihinta ei kerro, mitä auton edelliselle omistajalle on maksettu.':
      'When you compare prices, remember that AutoVex offers and Nettiauto prices mean different things. A dealership’s asking price does not tell you what the car’s previous owner was paid.',
    'Autoliikkeen pyyntihinta ei kerro, mitä auton edelliselle omistajalle on maksettu tai välttämättä mihin hintaan auto myydään.':
      'A dealership’s asking price does not tell you what the car’s previous owner was paid, nor necessarily what the car will sell for.',
    /* The warm-up screen — prod's copy plus v3's own */
    'Hyvä tarjouskilpailu takana!':        'A good auction behind you!',
    'Autosi kävi läpi koko tarjouskilpailun ja tavoitti satojen autoliikkeiden verkoston.':
      'Your car went through the whole auction and reached a network of hundreds of dealerships.',
    'Pidä mielessä, kun vertaat hintoja':    'Keep this in mind when you compare prices',
    'Nettiauton hinnat eivät vertaudu tarjoukseesi. Tarjouksesi on summa, jonka saat autostasi nyt.':
      'Nettiauto prices are not comparable to your offer. Your offer is the amount you get for your car now.',
    'Ymmärrän, jatka':                     'Understood, continue',
    /* v4's warm-up keeps every word of prod's card and adds only this line,
       so its keys are prod's plus one. */
    'Muistathan, että Nettiauton hintaa ei kannata verrata saamaasi tarjoukseen. Pyyntihinta ei ole sama asia kuin saamasi tarjous.':
      'Remember that a Nettiauto price is not worth comparing to the offer you received. An asking price is not the same thing as the offer you received.',
    'Tarjouskilpailu on päättynyt':         'The auction has ended',
    'Katso tulokset':                      'See the results',

    /* v3 — the Nettiauto bar */
    'Jos vertaat hintoja, muista, että Nettiauton hinnat ja saamasi AutoVex-tarjous tarkoittavat eri asioita. Nettiauton hinta ei kerro, mitä liike maksaa autostasi.':
      'If you are comparing prices, remember that Nettiauto prices and the AutoVex offer you received mean different things. A Nettiauto price does not tell you what a dealership pays for your car.',
    'Nettiauton hinta:':                   'A Nettiauto price:',

    /* v4 — the side-by-side comparison. Its lead is a THIRD fork of the same
       sentence pair, so it needs its own key: the dictionary is keyed on
       rendered text, and replacing one arm's key silently drops another arm's
       translation with nothing erroring. The amount is not keyed — it is
       `fmtCurrency`'s Finnish formatting in both languages, as every other
       amount on this page is. */
    'Jos vertaat hintoja, muista, että Nettiauton hinnat ja saamasi AutoVex-tarjous tarkoittavat eri asioita. Tarjouksesi on kilpailutettu hinta, jonka autoliike on valmis maksamaan autostasi nyt. Nettiauton hinta on pyyntihinta, joka sisältää kaikki auton kulut ja katteen.':
      'If you are comparing prices, remember that Nettiauto prices and the AutoVex offer you received mean different things. Your offer is a competitively bid price that a dealership is willing to pay for your car now. A Nettiauto price is an asking price that includes every cost the car carries, plus the margin.',
    'AutoVex-tarjouksesi:':                'Your AutoVex offer:',
    'Kulut ja kate':                       'Costs and margin',
    '*Jälleenmyyntiin sisältyvät autosta riippuen kulut, vastuu, riski, kate ja tinkimisvara.':
      '*Depending on the car, resale involves costs, liability, risk, margin and haggling room.',

    'Sisäänosto':                          'Purchase price',
    'Saamasi tarjous':                     'The offer you received',
    'Sinulle maksettava summa':            'The amount paid to you',
    'Tarjouksesi':                         'Your offer',
    'Jälleenmyynti':                       'Resale',
    'Kulut, vastuu, riski ja kate':        'Costs, liability, risk and margin',
    /* v3 dropped `vastuu`; v1 and v2 keep it, so both keys have to exist. */
    'Kulut, riski ja kate':                'Costs, risk and margin',
    'Autoliikkeen pyyntihinta':            'The dealership’s asking price',
    '*Jälleenmyyntiin liittyy autosta riippuen valmistelua, kuluja ja myyjän vastuuta.':
      '*Reselling involves preparation, costs and seller liability, depending on the car.',

    /* The triage */
    'Kerro mikä mietityttää, niin vastaamme siihen.': 'Tell us what is on your mind and we will answer it.',
    'Hinta tuntuu matalalta':               'The price feels low',
    'Näin Nettiautossa korkeampia hintoja': 'I saw higher prices on Nettiauto',
    'Minulla on toinen tarjous':            'I have another offer',
    'En tiedä kannattaako myydä nyt':       'I am not sure whether to sell now',
    'Korkein tarjous on onnistuneen tarjouskilpailun tulos. Autoliikkeet perehtyivät autoosi ja korottivat tarjouksiaan, joten hinta on se, mitä autostasi ollaan nyt valmiita maksamaan.':
      'The highest offer is the result of a successful auction. Dealerships studied your car and raised their offers, so the price is what buyers are willing to pay for it right now.',
    'Jos et ole täysin tyytyväinen saamaasi tarjoukseen, voit tehdä vastatarjouksen korkeimmalle tarjoajalle. Nykyinen tarjous pysyy voimassa neuvottelun ajan.':
      'If you are not entirely happy with the offer you received, you can make a counter offer to the highest bidder. The current offer stays valid for as long as the negotiation runs.',
    'Olet jo tehnyt vastatarjouksen. Näet neuvottelun tilanteen tarjouksen kohdalta.':
      'You have already made a counter offer. You can see where the negotiation stands on the offer itself.',
    'Vertaa tarjouksia samoilla ehdoilla. Onko toinen tarjous sidottu uuden auton ostoon, kuka hoitaa paperityöt ja vastuun, ja milloin rahat ovat tilillä.':
      'Compare the offers on the same terms. Is the other offer tied to buying another car, who handles the paperwork and the liability, and when does the money reach your account.',
    'Jos toinen tarjous on näillä ehdoilla parempi, suosittelemme neuvottelemaan korkeimman AutoVex-tarjouksen tehneen liikkeen kanssa samoista ehdoista.':
      'If the other offer is better on those terms, we recommend negotiating the same terms with the dealership that made the highest AutoVex offer.',
    'Tarjous on voimassa vain rajoitetun ajan.': 'The offer is valid for a limited time only.',
    'Voit julkaista ilmoituksen myöhemmin uudelleen, mutta tarjoukset muodostuvat silloisen markkinatilanteen mukaan. Autoliikkeet myös tarjoavat harvemmin autosta, jonka ne ovat jo nähneet aiemmassa tarjouskilpailussa.':
      'You can publish the listing again later, but the offers will reflect the market at that time. Dealerships are also less likely to bid on a car they have already seen in an earlier auction.',

    /* The offer cards */
    'Korkein tarjous':                     'Highest offer',
    'Toiseksi korkein':                    'Second highest',
    'Hyväksy korkein tarjous':             'Accept the highest offer',
    'Hyväksy alhaisempi tarjous':          'Accept the lower offer',
    'Tee vastatarjous':                    'Make a counter offer',
    'Vastatarjous':                        'Counter offer',
    'Vastatarjous lähetetty':              'Counter offer sent',
    'Näytä vastaus':                       'Show the reply',
    'Nouto pihasta':                       'Collected from your home',
    'Umpeutuu:':                           'Expires in:',
    'Paras tarjous:':                      'Best offer:',
    'Luotettavuus:':                       'Reliability:',
    'Vaivattomuus:':                       'Convenience:',
    'Odotetaan liikkeen vastausta':        'Waiting for the dealership to reply',
    'Liikkeeltä on tullut vastaus':        'The dealership has replied',
    'Hylätty':                             'Rejected',
    'Umpeutunut':                          'Expired',

    /* Hero and warm-up */
    'Nyt on aikasi toimia!':               'Now is your time to act!',
    'Tarjouskilpailu on päättynyt':        'The auction has ended',
    'Katso tulokset':                      'See the results',
    'Neuvottelu päättyi':                  'The negotiation has ended',

    /* The negotiation modal */
    'Tee vielä vastatarjous autoliikkeelle?': 'Make one more counter offer to the dealership?',
    'Korkein tarjoaja haluaa ostaa autosi, älä jätä peliä vielä kesken. Nyt sinun kannattaa kertoa autoliikkeelle summa, jolla olisit valmis myymään autosi.':
      'The highest bidder wants to buy your car, so do not leave it here. Now is the time to tell the dealership the amount you would be willing to sell for.',
    'Autostasi ei valitettavasti syntynyt tarjouskilpailua. Nyt sinun kannattaa kertoa autoliikkeelle summa, jolla olisit valmis myymään autosi.':
      'Unfortunately no auction developed for your car. Now is the time to tell the dealership the amount you would be willing to sell for.',
    'Autoliike voi hyväksyä vastatarjouksesi, jolloin kaupat syntyvät. Se voi myös nostaa tai pitäytyä tarjouksessaan.':
      'The dealership can accept your counter offer, which closes the sale. It can also raise its offer or stand by it.',
    'Voit hyväksyä tarjouksen myös neuvottelujen aikana.': 'You can accept the offer during the negotiation too.',
    'Tee uusi vastatarjous': 'Make a new counter offer',
    'Hyvä! Nyt odotellaan autoliikkeen vastausta.': 'Good! Now we wait for the dealership\'s reply.',
    'Useimmiten saat sen saman päivän aikana (arkisin kello 10–16 välillä).': 'You usually get it the same day (weekdays between 10 and 16).',
    'Useimmiten saat vastauksen saman päivän aikana (arkisin kello 10–16 välillä).': 'You usually get a reply the same day (weekdays between 10 and 16).',
    'Jos sinulla on kysyttävää, ota meihin yhteyttä osoitteessa tiimi@autovex.fi': 'If you have questions, contact us at tiimi@autovex.fi',
    'Nyt odotellaan taas autoliikkeen vastausta. Tämän jälkeen voit hyväksyä tai hylätä autoliikkeen tarjouksen, vastatarjouksia ei tehdä enempää. Toivottavasti pääsette kauppoihin!': 'Now we wait for the dealership\'s reply again. After that you can accept or reject the dealership\'s offer; no more counter offers are made. We hope you reach a deal!',
    'Eikö autoliike ole ollut yhteydessä?': 'Hasn\'t the dealership been in touch?',
    'Oletko varma että haluat hylätä tarjouksen?': 'Are you sure you want to reject the offer?',
    'Suosittelemme tekemään vastatarjouksen autoliikkeelle jos haluat autollesi noudon, paremman hinnan tai muuta lisätietoa.': 'We recommend making a counter offer to the dealership if you want pickup for your car, a better price or more information.',
    'Suosittelemme tekemään vastatarjouksen autoliikkeelle jos haluat autollesi noudon, paremman hinnan tai muuta lisätietoa. Asiakaspalvelumme auttaa myös mielellään tarvittaessa.': 'We recommend making a counter offer to the dealership if you want pickup for your car, a better price or more information. Our customer service is also happy to help if needed.',
    'Hyväksy tarjous': 'Accept offer',
    'Liikkeet vastaavat arkisin klo 10–16.': 'Dealerships reply on weekdays between 10 and 16.',
    'Liikkeet vastaavat arkisin klo 10–16 (viim. 24 h kuluessa). Voit hyväksyä nykyisen tarjouksen myös neuvottelun aikana.': 'Dealerships reply on weekdays between 10 and 16 (within 24 h at the latest). You can also accept the current offer while the negotiation is running.',
    'Autoliike vastasi':                   'The dealership replied',
    'Avaa neuvottelu ja katso liikkeen tarjous. Voit hyväksyä sen tai tehdä vielä yhden vastatarjouksen.': 'Open the negotiation and see their offer. You can accept it or make one more counter offer.',
    'Avaa neuvottelu ja katso liikkeen tarjous. Vastatarjouksia ei tehdä enempää, joten voit hyväksyä tarjouksen tai hylätä sen.': 'Open the negotiation and see their offer. No further counter offers can be made, so you can accept or reject it.',
    'Hyväksyttyäsi tarjouksen, autoliike ottaa sinuun yhteyttä.': 'Once you accept the offer, the dealership will contact you.',
    'Voit hyväksyä tarjouksen':            'You can accept the offer',
    'Viesti':                              'Message',
    '(Älä lisää yhteystietojasi)':         '(Do not add your contact details)',
    'Lähetä':                              'Send',
    'Pakollinen tieto':                    'Required',
    'Sulje':                               'Close',
    'Hylkää tarjous':                      'Reject the offer',
    'Hylkää tarjouskilpailu':              'Reject the auction',
    'Hyväksy tarjous, niin autoliike ottaa sinuun yhteyttä.': 'Accept the offer and the dealership will contact you.',
    'Autoliike ottaa sinuun yhteyttä kaupan viimeistelyä varten.': 'The dealership will contact you to finalise the sale.',

    /* The reject survey */
    'Olet hylkäämässä tarjouksen autostasi.': 'You are about to reject the offer for your car.',
    'Hylättyäsi tuloksen et voi enää hyväksyä sitä myöhemmin.': 'Once you reject the result you cannot accept it later.',
    'Ennen kuin vahvistat hylkäyksen, vastaisitko alla olevaan kysymykseen:':
      'Before you confirm, would you answer the question below:',
    'Miksi haluat hylätä tämän tarjouksen?': 'Why do you want to reject this offer?',
    'En halua myydä tarjotulla hinnalla.':   'I do not want to sell at the price offered.',
    'Olen epävarma siitä, onko tarjous tarpeeksi hyvä.': 'I am unsure whether the offer is good enough.',
    'Sain paremman tarjouksen muualta.':     'I got a better offer elsewhere.',
    'Olen jo myynyt autoni.':                'I have already sold my car.',
    'En voi myydä autoani juuri nyt.':       'I cannot sell my car right now.',
    'En ollut myymässä autoani.':            'I was not selling my car.',
    'Muu syy':                               'Other reason',
    'Kiitos kun käytit palveluamme!':        'Thank you for using our service!',

    /* The page's own footer — decision.html inlines it rather than using
       layout.js, so these three carry no `data-i18n` key and only this
       dictionary reaches them. */
    'Käyttöehdot':                           'Terms of service',
    'Tietosuojakäytäntö':                    'Privacy policy',
    'Evästekäytäntö':                        'Cookie policy',
    'Kieli':                                 'Language',

    /* The support banner */
    'Asiantuntijamme auttavat mielellään! Soita numeroon': 'Our experts are happy to help. Call',
    'Vieraile tukisivulla':                  'Visit the support page',
    '(arkisin klo 10–16)':                   '(weekdays 10–16)'
  }
};

if (window.protoI18n) window.protoI18n.register(window.DECISION_I18N);
