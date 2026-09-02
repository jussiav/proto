/**
 * FAQ content — the production CMS text, one shared definition.
 *
 * Three sets, matching the three CMS entries:
 *   FAQ_CONTENT.front   → index.html            ("Usein kysyttyä")
 *   FAQ_CONTENT.offers  → offers.html + decision.html (one CMS entry, two pages)
 *   FAQ_CONTENT.support → help.html             (grouped, the /tuki page)
 *
 * Finnish is the CMS text verbatim, paragraph for paragraph. English is a
 * working translation — the CMS has no English, so it is a draft.
 *
 * Two deliberate deviations from the CMS source:
 *   • Inline "Lue lisää täältä" links point at blog and info pages this
 *     prototype does not have, so the sentence is kept and the link is not.
 *     The one exception is the support address, which is a real mailto.
 *   • Structure is expressed as HTML (<p>, <ul>, <ol>) rather than the CMS's
 *     rich-text nodes.
 *
 * `a` is an HTML string; every consumer renders it with innerHTML.
 */
(function () {
  var EMAIL = '<a href="mailto:tiimi@autovex.fi" class="text-av-blue underline hover:no-underline">tiimi@autovex.fi</a>';

  /* ── Front page ─────────────────────────────────────────────────────────── */
  var FRONT_FI = [
    { q: 'Miksi auton myynti AutoVexin kautta kannattaa?', a:
      '<p><b>Vaivattomuus ja nopeus:</b> AutoVexin kautta tavoitat autoliikkeet ympäri Suomen tekemällä vain yhden tarjouspyynnön. Tarjouskilpailun päätyttyä voit helposti valita mielestäsi parhaan tarjouksen profiilissasi.</p>' +
      '<p><b>Hinta:</b> Kilpailutamme autoliikkeet puolestasi, jolloin sinulla on mahdollisuus saada autostasi markkinoiden paras hinta. Autoliikkeet käyvät tarjouskilpailua toisiaan vastaan.</p>' +
      '<p><b>Luotettavuus:</b> Luotettava yritys ostaa autosi, ja kaupat sujuvat huolettomasti ja nopeasti. Autoliike hoitaa byrokratian puolestasi ja saat rahat tilillesi nopeasti.</p>' +
      '<p>Palvelu on sinulle täysin ilmainen! Et sitoudu myymään autoasi jos et ole tyytyväinen tarjouksiin.</p>' },

    { q: 'Onko AutoVex ilmainen palvelu?', a:
      '<p>Kyllä, palvelu on myyjälle täysin ilmainen eikä piilokuluja ole.</p>' +
      '<p>Liiketoimintamallimme perustuu autoliikkeiden maksamaan välityspalkkioon toteutuneista kaupoista. Toimimme autoliikkeille tehokkaana hankintakanavana ja yhteistyökumppanina, joka auttaa heitä löytämään laadukkaita käytettyjä autoja – ja samalla sinä saat kilpailutettua autosi helposti.</p>' },

    { q: 'Kuinka kauan auton myynnin kilpailutus kestää?', a:
      '<p>AutoVexissä voit myydä autosi jopa 24 tunnissa. Tarjouskilpailu on käynnissä 1,5 työpäivää ensimmäisen tarjouksen saatuasi. Pidämme sinut ajan tasalla sähköpostitse koko tarjouskilpailun ajan.</p>' },

    { q: 'Voinko myydä autoa samanaikaisesti muualla?', a:
      '<p>Emme suosittele myymään autoa samanaikaisesti muualla. Mitä useampi autoliike osallistuu tarjouskilpailuun, sitä korkeammalle hinta nousee. Jokainen palvelun ulkopuolelta tehty tarjous on pois kilpailusta ja sitä kautta parhaasta mahdollisesta lopputuloksesta! Palveluamme käyttävät sadat autoliikkeet ympäri Suomen, mukaan lukien kaikki alan tunnetuimmat toimijat.</p>' },

    { q: 'Olen vaihtamassa autoa, voinko käyttää AutoVexiä?', a:
      '<p>Ehdottomasti! Itse asiassa suosittelemme sitä. Usein teet paremmat kaupat myymällä ensin nykyisen autosi pois parhaaseen markkinahintaan ja ostamalla seuraavan auton niin sanotulla käteiskaupalla juuri haluamastasi liikkeestä, kun hyvityshintaa ei enää tarvitse miettiä.</p>' +
      '<p>Kun autoliikkeen ei tarvitse ottaa vaihtoautoa vastaan, saat usein paremman hinnan uudesta autosta tai selkeämmän alennuksen. Monelle tämä on taloudellisesti järkevin tapa tehdä autokaupat.</p>' +
      '<p>Lue aiheesta lisää blogistamme: Keskity välirahaan - se kannattaa.</p>' },

    { q: 'Haittaako auton loppuvelka auton myyntiä?', a:
      '<p>Ei haittaa. Auton voi myydä, vaikka siinä olisi rahoitusta jäljellä. Kaupan yhteydessä rahoitusyhtiön jäljellä oleva velka maksetaan pois ja mahdollinen erotus tilitetään sinulle. Mikäli velka ylittää auton arvon, liike veloittaa sinulta ylijäävän summan. Lue lisää rahoitetun auton myynnistä täältä.</p>' },

    { q: 'Hinta-arvio on mielestäni liian alhainen', a:
      '<p>Hinta-arvio perustuu samankaltaisten autojen toteutuneisiin myyntihintoihin ja ajantasaiseen markkinadataan. Se ei kuitenkaan huomioi kaikkia yksilöllisiä tekijöitä, kuten autosi kuntoa, varusteita tai poikkeuksellista kysyntää. Lue lisää hinta-arviosta.</p>' +
      '<p>Arvio on suuntaa-antava ja lopullinen markkinahinta määräytyy tarjouskilpailussa. Kannattaa siis kokeilla kilpailutusta, sillä toteutunut tarjous voi hyvinkin olla arviota korkeampi.</p>' +
      '<p>Auton arvoon vaikuttavat:</p>' +
      '<ul class="list-disc pl-5 space-y-1"><li>Auton ikä</li><li>Ajetut kilometrit</li><li>Huoltohistoria ja tehdyt korjaukset</li><li>Kysyntä automarkkinoilla</li><li>Auton kunto</li><li>Auton lisävarusteet, jotka kannattaa listata kattavasti</li></ul>' +
      '<p>Miten autoliike hinnoittelee autosi? Lue lisää tästä.</p>' },

    { q: 'Miten kilpailutus toimii?', a:
      '<p>Autoliikkeiden kilpailutus on kauttamme helppoa ja nopeaa. Kun olet julkaissut tarjouspyynnön, sadat autoliikkeet näkevät autosi tiedot. Autoliikkeet kilpailevat toisiaan vastaan, jolloin hinta nousee. Seuraamalla sähköpostiasi pysyt kilpailutuksesta ajan tasalla. Kun tarjouskilpailu päättyy, näet kaikki saamasi tarjoukset ja pääset hyväksymään parhaan tarjouksen.</p>' },

    { q: 'Autossani on vikoja, voinko silti myydä sen?', a:
      '<p>Kyllä voit. On kuitenkin erittäin tärkeää kertoa kaikki viat, kolhut ja muut puutteet sekä tehdyt korjaukset rehellisesti ilmoitusta täyttäessäsi. Lisää myös selkeät kuvat vaurioista sekä huoltokirjan merkinnöistä.</p>' +
      '<p>Huoltohistoria ja avoimuus auton kunnosta lisäävät autoliikkeiden luottamusta ja kiinnostusta. Kun tiedot ovat kunnossa alusta asti, ostaja pystyy tekemään tarjouksen varmemmin – ja pysymään sovitussa summassa kaupan loppuun saakka.</p>' }
  ];

  /* ── Offers + decision (one CMS entry, both pages) ───────────────────────── */
  var OFFERS_FI = [
    { q: 'Miksi en näe autoliikkeiden nimiä ja tarjousten summia?', a:
      '<p>Saamasi tarjoukset pääset näkemään heti tarjouskilpailun päätyttyä. Tarjouksen tehneen autoliikkeen tiedot näytetään, kun hyväksyt tarjouksen. Syy tähän on se, että jos autoliikkeiden tiedot paljastetaan, tarjouskilpailua ja vastatarjouksia ei välttämättä hoideta palvelumme sisällä.</p>' },

    { q: 'Haittaako auton loppuvelka auton myyntiä?', a:
      '<p>Ei haittaa! Autoliike maksaa loppuvelan kokonaisuudessaan rahoitusyhtiölle. Mikäli velka ylittää auton arvon, veloittaa liike ylijäävän summan auton myyjältä. Lue lisää rahoitetun auton myynnistä.</p>' },

    { q: 'Kuinka kauan auton myynnin kilpailutus kestää?', a:
      '<p>AutoVex on tehokas tapa myydä auto. Kun olet täyttänyt autosi tiedot ja ilmoituksesi on julkaistu, sadat autoliikkeet ympäri Suomen näkevät autosi heti ja voivat tehdä siitä tarjouksia.</p>' +
      '<p>Tarjouskilpailun kesto on tyypillisesti 36 tuntia. Saat sähköpostiisi tietoja kilpailutuksen etenemisestä ja näet lopuksi parhaan tarjouksen. Sinulla on 24 tuntia aikaa hyväksyä tarjous tai tehdä vastatarjous. Mikäli hyväksyt tarjouksen, olethan valmis luopumaan autostasi noin viikon kuluessa.</p>' },

    { q: 'Voinko myydä autoa samanaikaisesti muualla?', a:
      '<p>Voit, mutta emme suosittele sitä. Palvelumme idea perustuu siihen, että autoliikkeet kilpailevat keskenään autostasi. Mitä useampi liike osallistuu tarjouskilpailuun juuri AutoVexin kautta, sitä todennäköisemmin tarjottu summa nousee korkeammaksi. Auton myyminen muualla samaan aikaan vähentää kilpailua ja voi vaikuttaa negatiivisesti lopputulokseen.</p>' +
      '<p>AutoVexiä käyttävät sadat autoliikkeet ympäri Suomen – mukana ovat kaikki alan tunnetut toimijat. Yhdellä ilmoituksella tavoitat siis jo käytännössä koko markkinan ilman ylimääräistä vaivannäköä.</p>' },

    { q: 'Mikä on tarjouksen hyväksymisen ja vastatarjouksen ero?', a:
      '<p>Tarjouksen hyväksymällä näet, mikä autoliike on kyseessä ja kaupoista sovitaan suoraan liikkeen kanssa. Mikäli tarjotussa hinnassa olisi vielä parannettavaa, tee autoliikkeelle vastatarjous. Voit tehdä yhteensä kaksi vastatarjousta, minkä jälkeen hyväksyt tai hylkäät lopullisen hinnan.</p>' },

    { q: 'Mitä jos en ole tyytyväinen tarjouksiin?', a:
      '<p>Myyntivelvoitetta palvelun käytössä ei ole. Suosittelemme kuitenkin aina tekemään vastatarjouksen korkeimmalle tarjoajalle ennen tarjouksen hylkäämistä. Vastatarjouksen avulla päästään usein kauppoihin!</p>' },

    { q: 'Onko AutoVex ilmainen palvelu?', a:
      '<p>Kyllä, palvelu on myyjälle täysin ilmainen eikä piilokuluja ole.</p>' +
      '<p>Liiketoimintamallimme perustuu autoliikkeiden maksamaan välityspalkkioon toteutuneista kaupoista. Toimimme autoliikkeille tehokkaana hankintakanavana ja yhteistyökumppanina, joka auttaa heitä löytämään laadukkaita käytettyjä autoja – ja samalla sinä saat kilpailutettua autosi helposti.</p>' },

    { q: 'Miten toimin, kun autoliike ei ole reagoinut vastatarjoukseeni ja muut tarjoukset ovat vanhenemassa?', a:
      '<p>Vastatarjouksen tehtyäsi aika ei voi loppua kesken autoliikkeen vastausta odotellessa. Mikäli et kuitenkaan jostain syystä pääse korkeimman tarjoajan kanssa kauppoihin ja olisit valmis hyväksymään jonkin aiemmista tarjouksista, voit olla meihin yhteydessä kauppojen sopimiseksi. ' + EMAIL + '</p>' },

    { q: 'Mitä tapahtuu, kun hyväksyn tarjouksen?', a:
      '<p>Kun hyväksyt tarjouksen, autoliike on sinuun yhteydessä noin yhden arkipäivän kuluttua ja pääsette sopimaan auton luovutukseen liittyvistä käytännön asioista, kuten aikataulu, luovutuspaikka, ostosopimus, maksu sekä mahdollinen loppuvelan lunastaminen.</p>' },

    { q: 'Voiko autoliike perua kaupat?', a:
      '<p>Jos ilmenee, että autossa on isoja piileviä vikoja tai muuta vastaavaa mistä ei ole ilmoitettu ilmoituksessa, autoliike voi perua kaupat. Tämä kuitenkin tapahtuu erittäin harvoin (jos tiedossa olevia selkeitä virheitä autosta on jätetty kertomatta). Jos näin pääsee käymään, meidän tiimimme on sinuun sekä autoliikkeeseen yhteydessä ja auttaa sinua saamaan haluamasi kaupat tehtyä toisen autoliikkeen kanssa.</p>' },

    { q: 'Voiko tarjoukset hylätä?', a:
      '<p>Kyllä, tarjouskilpailun päätyttyä voit hylätä tarjoukset profiilissasi. Suosittelemme kuitenkin aina tekemään vastatarjouksen korkeimmalle tarjoajalle ennen tarjouksen hylkäämistä. Vastatarjouksen avulla päästään usein kauppoihin!</p>' },

    { q: 'Mitkä autoliikkeet käyttävät AutoVexiä?', a:
      '<p>Mukana ovat kaikki suurimmat autoliikeketjut sekä satoja keskisuuria ja paikallisia autoliikkeitä ympäri Suomen.</p>' +
      '<p>Kaikki palvelussa toimivat ostajat ovat luotettavia ja ammattimaisia toimijoita. Olemme Suomen ensimmäinen ja suurin autoliikkeiden kilpailutuspalvelu, ja kauttamme on tehty jo kymmeniä tuhansia onnistuneita autokauppoja.</p>' },

    { q: 'Mitä eroa on osto- ja vaihtotarjouksella?', a:
      '<p>Autoliikkeen antamaa vaihtotarjousta ja ostotarjousta ei voi verrata keskenään. Autokaupoilla ollessa tärkeintä on kiinnittää huomiota välirahaan. Lue enemmän tästä.</p>' },

    { q: 'Miksi auton myynti AutoVexin kautta kannattaa?', a:
      '<p><b>Vaivattomuus:</b> Voit myydä autosi vaikka kotisohvalta. Yhdellä myynti-ilmoituksella tavoitat kerralla sadat autoliikkeet ympäri Suomen. Sinä voit helposti hyväksyä parhaan tarjouksen ja kaupat toteutuvat suoraan autoliikkeen kanssa.</p>' +
      '<p><b>Paras tarjous:</b> Kaikki palvelussa mukana olevat autoliikkeet näkevät autosi tiedot ja käyvät tarjouskilpailua toisiaan vastaan. Näin varmistetaan, että saat autostasi markkinoiden parhaan tarjouksen. Korkein tarjous määräytyy autoliikkeiden kysynnän ja auton markkina-arvon mukaan, johon vaikuttavat ajetut kilometrit, auton kunto, lisävarusteet, huoltotiedot sekä renkaiden kunto.</p>' +
      '<p><b>Luotettavuus:</b> Palvelussa ovat mukana sadat tunnetut ja turvalliset autoliikkeet. Kauttamme on myyty autoliikkeille jo yli 80 000 autoa. Autoliike hoitaa paperityöt ja siirtää rahat tilillesi. AutoVexin omat asiantuntijat auttavat sinua koko prosessin ajan.</p>' +
      '<p>Palvelu on sinulle täysin ilmainen! Jos et ole tyytyväinen tarjouksiin, et sitoudu myymään autoasi.</p>' },

    { q: 'Miten saan autoliikkeet kiinnostumaan autostani?', a:
      '<p>Tärkeintä on laatia mahdollisimman kattava ja selkeä ilmoitus. Lisää autostasi kuvat sisältä ja ulkoa, kuvaa mahdolliset vauriot avoimesti ja liitä mukaan huoltohistoria. Erityisesti huoltokirjan merkinnät ja dokumentoidut huollot lisäävät autoliikkeiden luottamusta ja kiinnostusta. Mitä tarkemmat tiedot annat auton kunnosta, varusteista ja historiasta, sitä helpompi autoliikkeiden on tehdä tarjous – ja sitä todennäköisemmin kilpailu nostaa hintaa.</p>' }
  ];

  /* ── Support page (/tuki), grouped ──────────────────────────────────────── */
  var SUPPORT_FI = [
    { group: 'Yleiset kysymykset palvelusta', items: [
      { q: 'Miksi auton myynti AutoVexin kautta kannattaa?', a:
        '<p>Olemme suomalainen autonmyynnin kilpailutuspalvelu, jonka avulla kilpailutat autoliikkeiden tarjoukset helposti netissä.</p>' +
        '<p><b>Vaivattomuus:</b> Voit myydä autosi vaikka kotisohvalta. Yhdellä myynti-ilmoituksella tavoitat kerralla sadat autoliikkeet ympäri Suomen. Sinä voit helposti hyväksyä parhaan tarjouksen ja kaupat toteutuvat suoraan autoliikkeen kanssa.</p>' +
        '<p><b>Paras tarjous:</b> Kaikki palvelussa mukana olevat autoliikkeet näkevät autosi tiedot ja käyvät tarjouskilpailua toisiaan vastaan. Näin varmistetaan, että saat autostasi markkinoiden parhaan tarjouksen. Korkein tarjous määräytyy autoliikkeiden kysynnän ja auton markkina-arvon mukaan, johon vaikuttavat ajetut kilometrit, auton kunto, lisävarusteet, huoltotiedot sekä renkaiden kunto.</p>' +
        '<p><b>Luotettavuus:</b> Palvelussa ovat mukana sadat tunnetut ja turvalliset autoliikkeet. Kauttamme on myyty autoliikkeille jo yli 70 000 autoa. Autoliike hoitaa paperityöt ja siirtää rahat tilillesi. AutoVexin omat asiantuntijat auttavat sinua koko prosessin ajan.</p>' +
        '<p>Palvelu on sinulle täysin ilmainen! Jos et ole tyytyväinen tarjouksiin, et sitoudu myymään autoasi.</p>' },

      { q: 'Miten myyntiprosessi etenee?',
        a:
        '<p>Myyntiprosessi AutoVexillä on tehty sinulle mahdollisimman helpoksi ja vaivattomaksi. Näin se etenee vaiheittain:</p>' +
        '<ol class="list-decimal pl-5 space-y-2">' +
        '<li><b>Ilmoituksen luominen:</b> Kerrot autostasi ilmoituksen luontivaiheessa. Autosi perustiedot täytetään automaattisesti rekisterinumeron perusteella. Lisäät vain kuvat ja tiedot varusteista sekä huolloista.</li>' +
        '<li><b>Asiantuntijan yhteydenotto:</b> Asiantuntijamme ottaa sinuun yhteyttä puhelimitse (puhelu kestää noin 5 minuuttia). Varmistamme yhdessä, että ilmoituksen tiedot ovat kunnossa, ja ohjeistamme prosessin jatkosta.</li>' +
        '<li><b>Tarjouskilpailu:</b> Kun ilmoitus on tarkistettu, se julkaistaan autoliikkeiden tarjouskilpailuun, joka kestää tyypillisesti 36 tuntia. Pidämme sinut ajan tasalla sähköpostitse kilpailutuksen ajan.</li>' +
        '<li><b>Päätöksenteko:</b> Kilpailutuksen päätyttyä näet parhaan tarjouksen ja voit hyväksyä sen halutessasi. Palvelu ei velvoita myyntiin.</li>' +
        '<li><b>Kaupat:</b> Jos hyväksyt tarjouksen, ostava autoliike ottaa sinuun yhteyttä sopiakseen auton luovutuksesta, paperitöistä ja maksusta.</li>' +
        '</ol>',
        /* Review/No review v1 (4.1): the call is conditional, and publication no
           longer waits on a review. */
        v1:
        '<p>Myyntiprosessi AutoVexillä on tehty sinulle mahdollisimman helpoksi ja vaivattomaksi. Näin se etenee vaiheittain:</p>' +
        '<ol class="list-decimal pl-5 space-y-2">' +
        '<li><b>Ilmoituksen luominen:</b> Kerrot autostasi ilmoituksen luontivaiheessa. Autosi perustiedot täytetään automaattisesti rekisterinumeron perusteella. Lisäät vain kuvat ja tiedot varusteista sekä huolloista.</li>' +
        '<li><b>Asiantuntijan yhteydenotto:</b> Asiantuntijamme ottaa sinuun tarvittaessa yhteyttä puhelimitse (puhelu kestää noin 5 minuuttia). Varmistamme yhdessä, että ilmoituksen tiedot ovat kunnossa, ja ohjeistamme prosessin jatkosta.</li>' +
        '<li><b>Tarjouskilpailu:</b> Kun ilmoitus on valmis, se julkaistaan autoliikkeiden tarjouskilpailuun, joka kestää tyypillisesti 36 tuntia. Pidämme sinut ajan tasalla sähköpostitse kilpailutuksen ajan.</li>' +
        '<li><b>Päätöksenteko:</b> Kilpailutuksen päätyttyä näet parhaan tarjouksen ja voit hyväksyä sen halutessasi. Palvelu ei velvoita myyntiin.</li>' +
        '<li><b>Kaupat:</b> Jos hyväksyt tarjouksen, ostava autoliike ottaa sinuun yhteyttä sopiakseen auton luovutuksesta, paperitöistä ja maksusta.</li>' +
        '</ol>' },

      { q: 'Onko AutoVex ilmainen palvelu?', a:
        '<p>Kyllä, palvelu on myyjälle täysin ilmainen eikä piilokuluja ole.</p>' +
        '<p>Liiketoimintamallimme perustuu autoliikkeiden maksamaan välityspalkkioon toteutuneista kaupoista. Toimimme autoliikkeille tehokkaana hankintakanavana ja yhteistyökumppanina, joka auttaa heitä löytämään laadukkaita käytettyjä autoja – ja samalla sinä saat kilpailutettua autosi helposti.</p>' },

      { q: 'Sitoudunko myymään autoni?', a:
        '<p>Et sitoudu. Tarjouspyynnön jättäminen ei velvoita sinua myymään autoasi.</p>' +
        '<p>Kun kilpailutus päättyy, näet korkeimman tarjouksen ja päätät itse, hyväksytkö sen. Sinulla on 24 tuntia aikaa tehdä päätös – tämän jälkeen tarjous raukeaa automaattisesti.</p>' +
        '<p>Jos paras tarjous ei miellytä, sinun kannattaa tehdä vastatarjous korkeimmalle tarjoajalle: näin päästään usein kauppoihin.</p>' +
        '<p>Mikäli hyväksyt tarjouksen, olethan valmis luopumaan autostasi noin viikon kuluessa.</p>' },

      { q: 'Mitkä autoliikkeet ovat mukana palvelussa?', a:
        '<p>Mukana ovat kaikki suurimmat autoliikeketjut sekä satoja keskisuuria ja paikallisia autoliikkeitä ympäri Suomen.</p>' +
        '<p>Kaikki palvelussa toimivat ostajat ovat luotettavia ja ammattimaisia toimijoita. Olemme Suomen ensimmäinen ja suurin autoliikkeiden kilpailutuspalvelu, ja kauttamme on tehty jo kymmeniä tuhansia onnistuneita autokauppoja.</p>' },

      { q: 'Kuinka vanhoja autoja palvelussa voi myydä?', a:
        '<p>Palvelussamme voi myydä minkä tahansa alle 250 000 km ajetun auton. Tämän rajan yli ajetuille autoille ei lähtökohtaisesti ole palvelussamme kysyntää. Ikärajaa autoille ei ole, mutta tällä hetkellä autoliikkeiden suurin kiinnostus kohdistuu alle 10 vuotta vanhoihin ja alle 150tkm ajettuihin autoihin.</p>' },

      { q: 'Miten AutoVexiin saa yhteyden?',
        a:
        '<p>Asiakaspalvelumme auttaa sinua mielellään koko myyntiprosessin ajan! Haluamme varmistaa, että saat autostasi parhaan mahdollisen tarjouksen, joten käymme lomakkeelle täyttämäsi tiedot kanssasi lyhyesti läpi puhelimitse jo ennen myynti-ilmoituksen julkaisua. Lisäksi voit olla meihin yhteydessä sähköpostitse osoitteessa ' + EMAIL + '. Palvelemme arkisin klo 10-16.</p>',
        /* v1 (4.2) */
        v1:
        '<p>Asiakaspalvelumme auttaa sinua mielellään koko myyntiprosessin ajan! Haluamme varmistaa, että saat autostasi parhaan mahdollisen tarjouksen, joten käymme lomakkeelle täyttämäsi tiedot tarvittaessa kanssasi lyhyesti läpi puhelimitse jo ennen myynti-ilmoituksen julkaisua. Lisäksi voit olla meihin yhteydessä sähköpostitse osoitteessa ' + EMAIL + '. Palvelemme arkisin klo 10-16.</p>' }
    ]},

    { group: 'Ennen auton myyntiä', items: [
      { q: 'Miten tiedän autoni arvon?',
        a:
        '<p>Saat asiantuntijaltamme puhelimitse henkilökohtaisen konsultaation auton markkina-arvosta ennen kilpailutuksen käynnistymistä. Tarjoamme realistisen arvion siitä, millä tasolla autosi arvo tällä hetkellä suunnilleen liikkuu.</p>' +
        '<p>Haluatko ymmärtää tarkemmin, miten autoliikkeet hinnoittelevat autoja? Lue lisää täältä.</p>',
        /* v1 (4.3) */
        v1:
        '<p>Saat tarvittaessa asiantuntijaltamme puhelimitse henkilökohtaisen konsultaation auton markkina-arvosta ennen kilpailutuksen käynnistymistä. Tarjoamme realistisen arvion siitä, millä tasolla autosi arvo tällä hetkellä suunnilleen liikkuu.</p>' +
        '<p>Haluatko ymmärtää tarkemmin, miten autoliikkeet hinnoittelevat autoja? Lue lisää täältä.</p>' },

      { q: 'Autossani on vikoja, voinko silti myydä sen?', a:
        '<p>Kyllä voit. On kuitenkin erittäin tärkeää kertoa kaikki viat, kolhut ja muut puutteet sekä tehdyt korjaukset rehellisesti ilmoitusta täyttäessäsi. Lisää myös selkeät kuvat vaurioista sekä huoltokirjan merkinnöistä.</p>' +
        '<p>Huoltohistoria ja avoimuus auton kunnosta lisäävät autoliikkeiden luottamusta ja kiinnostusta. Kun tiedot ovat kunnossa alusta asti, ostaja pystyy tekemään tarjouksen varmemmin – ja pysymään sovitussa summassa kaupan loppuun saakka.</p>' },

      { q: 'Voinko myydä auton toisen puolesta?', a:
        '<p>Kyllä, voit hoitaa myyntiprosessin palvelussamme toisen puolesta ilman erillisiä valtuutuksia.</p>' +
        '<p>Huomioithan kuitenkin, että auton luovutuksen aikana ostava autoliike varmistaa, että myyjällä on oikeus tehdä kaupat. Tässä vaiheessa auton omistajan täytyy joko tehdä valtakirja tai olla itse paikalla.</p>' },

      { q: 'Voinko myydä autoa samanaikaisesti muualla?', a:
        '<p>Voit, mutta emme suosittele sitä. Palvelumme idea perustuu siihen, että autoliikkeet kilpailevat keskenään autostasi. Mitä useampi liike osallistuu tarjouskilpailuun juuri AutoVexin kautta, sitä todennäköisemmin tarjottu summa nousee korkeammaksi. Auton myyminen muualla samaan aikaan vähentää kilpailua ja voi vaikuttaa negatiivisesti lopputulokseen.</p>' +
        '<p>AutoVexiä käyttävät sadat autoliikkeet ympäri Suomen – mukana ovat kaikki alan tunnetut toimijat. Yhdellä ilmoituksella tavoitat siis jo käytännössä koko markkinan ilman ylimääräistä vaivannäköä.</p>' },

      { q: 'Olen vaihtamassa autoa, voinko käyttää AutoVexiä?', a:
        '<p>Ehdottomasti! Itse asiassa suosittelemme sitä. Usein teet paremmat kaupat myymällä ensin nykyisen autosi pois parhaaseen markkinahintaan ja ostamalla seuraavan auton niin sanotulla käteiskaupalla juuri haluamastasi liikkeestä, kun hyvityshintaa ei enää tarvitse miettiä.</p>' +
        '<p>Kun autoliikkeen ei tarvitse ottaa vaihtoautoa vastaan, saat usein paremman hinnan uudesta autosta tai selkeämmän alennuksen. Monelle tämä on taloudellisesti järkevin tapa tehdä autokaupat.</p>' +
        '<p>Lue aiheesta lisää blogistamme: Keskity välirahaan - se kannattaa.</p>' },

      { q: 'Haittaako auton loppuvelka auton myyntiä?', a:
        '<p>Ei haittaa. Auton voi myydä, vaikka siinä olisi rahoitusta jäljellä. Kaupan yhteydessä rahoitusyhtiön jäljellä oleva velka maksetaan pois ja mahdollinen erotus tilitetään sinulle. Mikäli velka ylittää auton arvon, liike veloittaa sinulta ylijäävän summan. Lue lisää rahoitetun auton myynnistä täältä.</p>' },

      { q: 'Voiko yritys myydä auton?', a:
        '<p>Ehdottomasti, kunhan yrityksen toimialana ei ole henkilöautojen ja kevyiden moottoriajoneuvojen vähittäiskauppa. Muistathan merkata auton ”ALV-vähennyskelpoiseksi”, mikäli kyseinen ehto täyttyy. Palvelun kautta tehdyt tarjoukset sisältävät aina arvonlisäveron.</p>' }
    ]},

    { group: 'Myynti-ilmoituksen tekeminen', items: [
      { q: 'Mitä tietoja tarvitsen autoni myyntiä varten?', a:
        '<p>Haemme autosi perustiedot automaattisesti rekisterinumeron perusteella. Sinun tarvitsee ilmoittaa ajokilometrit sekä antaa tiedot huoltohistoriasta, varusteista, mahdollisista vioista ja renkaiden kunnosta.</p>' +
        '<p>Tarvitset myös kuvia autostasi. Autoa ei tarvitse pestä ja puunata kuvia varten, tärkeintä on antaa autosta kattava kokonaiskuva. Ota kuvat auton ulkopuolelta ja sisäpuolelta joka suunnasta. Auton sisältä kannattaa kuvata erityisesti kojelauta, keskikonsoli sekä etu- ja takapenkit. Muista näyttää mahdolliset naarmut ja kolhut. Kuvaa myös renkaiden urasyvyys sekä huoltokirjan merkinnät tai muut huoltodokumentit. Täältä löydät kuvausohjeet ja käytännön esimerkit.</p>' +
        '<p>Huolellisesti täytetty ilmoitus ja selkeät kuvat lisäävät autoliikkeiden kiinnostusta ja parantavat tarjouksia. Pienellä valmistautumisella lomakkeen täyttäminen vie yleensä vain muutaman minuutin, ja keskeneräiseen ilmoitukseen voi palata myöhemmin.</p>' },

      { q: 'Millaiset kuvat otan autostani?', a:
        '<p>Ota selkeät kuvat autosta ulkoa ja sisältä. Kuvaa auto joka kulmasta niin, että etu- ja takapuskuri sekä molemmat sivut näkyvät kunnolla. Sisältä kannattaa kuvata esimerkiksi kojelauta, keskikonsoli sekä etu- ja takapenkit. Muista kuvata myös renkaat.</p>' +
        '<p>Kuvaa huoltokirjan merkinnät tai huoltotiedot selkeästi, ja ota lähikuvat mahdollisista vaurioista. Hyvät ja rehelliset kuvat lisäävät autoliikkeiden kiinnostusta ja parantavat tarjouksia. Autoa ei kuitenkaan tarvitse pestä ja puunata kuvia varten.</p>' +
        '<p>Katso esimerkkikuvat ja lue lisää blogistamme: Laadukkaiden myyntikuvien ottaminen autosta</p>' },

      { q: 'Voinko uusia aikaisemman ilmoituksen?', a:
        '<p>Kyllä, aiemman myynti-ilmoituksen uusiminen on mahdollista. Ole yhteydessä asiakaspalveluumme sähköpostitse osoitteeseen ' + EMAIL + ', niin tarkistamme tilanteesi ja autamme sinua käynnistämään kilpailutuksen.</p>' },

      { q: 'Lomakkeen täyttäminen ei onnistu', a:
        '<p>Jos kohtaat teknisiä haasteita, kokeile ensin seuraavia:</p>' +
        '<ol class="list-decimal pl-5 space-y-1"><li>Vaihda selainta – Google Chrome toimii yleensä parhaiten.</li><li>Kokeile yksityistä selaustilaa (incognito), sillä selaimen evästeet voivat joskus aiheuttaa ongelmia.</li></ol>' +
        '<p>Jos et pääse etenemään näillä ohjeilla, ota meihin yhteyttä osoitteessa ' + EMAIL + '. Autamme sinut eteenpäin.</p>' },

      { q: 'Kuvien tallentaminen tai lisääminen ei onnistu', a:
        '<p>Ilmoituksen julkaiseminen edellyttää vähintään viittä kuvaa, joten tarkistathan ensin, että olet yrittänyt lisätä tarvittavan määrän kuvia autostasi. Jos kuvien lataaminen ei onnistu tästä huolimatta, ota meihin yhteyttä osoitteessa ' + EMAIL + ', niin autamme sinut eteenpäin.</p>' },

      { q: 'Miten saan autoliikkeet kiinnostumaan autostani?', a:
        '<p>Tärkeintä on laatia mahdollisimman kattava ja selkeä ilmoitus. Lisää autostasi kuvat sisältä ja ulkoa, kuvaa mahdolliset vauriot avoimesti ja liitä mukaan huoltohistoria. Erityisesti huoltokirjan merkinnät ja dokumentoidut huollot lisäävät autoliikkeiden luottamusta ja kiinnostusta.</p>' +
        '<p>Mitä tarkemmat tiedot annat auton kunnosta, varusteista ja historiasta, sitä helpompi autoliikkeiden on tehdä tarjous – ja sitä todennäköisemmin kilpailu nostaa hintaa.</p>' +
        '<p>Myös realistisen pyyntihinnan asettaminen on tärkeää ja me tuemme sinua tässä. Saat asiantuntijaltamme puhelimitse henkilökohtaisen konsultaation auton markkina-arvosta ennen kilpailun käynnistymistä.</p>' +
        '<p>Haluatko ymmärtää tarkemmin, miten autoliikkeet hinnoittelevat autoja? Lue aiheesta täältä.</p>',
        /* v1 (4.4): the "me tuemme sinua tässä" sentence goes, and the
           consultation becomes conditional — same substance as 4.3. */
        v1:
        '<p>Tärkeintä on laatia mahdollisimman kattava ja selkeä ilmoitus. Lisää autostasi kuvat sisältä ja ulkoa, kuvaa mahdolliset vauriot avoimesti ja liitä mukaan huoltohistoria. Erityisesti huoltokirjan merkinnät ja dokumentoidut huollot lisäävät autoliikkeiden luottamusta ja kiinnostusta.</p>' +
        '<p>Mitä tarkemmat tiedot annat auton kunnosta, varusteista ja historiasta, sitä helpompi autoliikkeiden on tehdä tarjous – ja sitä todennäköisemmin kilpailu nostaa hintaa.</p>' +
        '<p>Saat tarvittaessa asiantuntijaltamme puhelimitse henkilökohtaisen konsultaation auton markkina-arvosta ennen kilpailun käynnistymistä.</p>' +
        '<p>Haluatko ymmärtää tarkemmin, miten autoliikkeet hinnoittelevat autoja? Lue aiheesta täältä.</p>' },

      { q: 'Miksi ilmoitukseni on tarkistuksessa?',
        a:
        '<p>Haluamme varmistaa, että saat autostasi parhaan mahdollisen hinnan. Siksi käymme ilmoituksen tiedot lyhyesti läpi ennen sen julkaisemista.</p>' +
        '<p>Asiantuntijamme soittaa sinulle ja varmistaa esimerkiksi ajokilometrit, varusteet, huoltohistorian, renkaiden kunnon sekä mahdolliset viat. Kun autosi tiedot ovat kattavat ja oikein, autoliikkeet tekevät tarjouksia mielellään.</p>' +
        '<p>Keskustelemme samalla myös hinta-arviosta ja realistisesta pyyntihinnasta autollesi. Lisäksi kerromme, miten prosessi etenee tästä eteenpäin.</p>' +
        '<p>Tietojen läpikäynti kestää yleensä noin 5 minuuttia, ja otamme yhteyttä normaalisti seuraavaan arkipäivään mennessä. Sesonkiaikoina, viikonloppujen tai arkipyhien jälkeen yhteydenotto voi kestää hieman pidempään.</p>',
        /* v1 (4.5): framing only — the rest of the answer stays accurate. */
        v1:
        '<p>Haluamme varmistaa, että saat autostasi parhaan mahdollisen hinnan. Siksi käymme tapauskohtaisesti ilmoituksen tiedot lyhyesti läpi ennen sen julkaisemista.</p>' +
        '<p>Asiantuntijamme soittaa sinulle ja varmistaa esimerkiksi ajokilometrit, varusteet, huoltohistorian, renkaiden kunnon sekä mahdolliset viat. Kun autosi tiedot ovat kattavat ja oikein, autoliikkeet tekevät tarjouksia mielellään.</p>' +
        '<p>Keskustelemme samalla myös hinta-arviosta ja realistisesta pyyntihinnasta autollesi. Lisäksi kerromme, miten prosessi etenee tästä eteenpäin.</p>' +
        '<p>Tietojen läpikäynti kestää yleensä noin 5 minuuttia, ja otamme yhteyttä normaalisti seuraavaan arkipäivään mennessä. Sesonkiaikoina, viikonloppujen tai arkipyhien jälkeen yhteydenotto voi kestää hieman pidempään.</p>' }
    ]},

    { group: 'Kilpailutus ja tarjoukset', items: [
      { q: 'Miten kilpailutus toimii?', a:
        '<p>Autoliikkeiden kilpailutus on kauttamme helppoa ja nopeaa. Kun julkaiset tarjouspyynnön, sadat luotettavat autoliikkeet ympäri Suomen näkevät autosi tiedot ja voivat tehdä siitä tarjouksia n. 36 tunnin ajan. Liikkeet kilpailevat keskenään, jotta korkein tarjous pääsee nousemaan parhaalle markkinatasolle.</p>' +
        '<p>Saat ilmoituksia sähköpostiisi kilpailutuksen etenemisestä. Kun kilpailutus päättyy, näet parhaan tarjouksen ja voit halutessasi hyväksyä sen tai tehdä vastatarjouksen.</p>' },

      { q: 'Kuinka kauan auton myynnin kilpailutus kestää?', a:
        '<p>AutoVex on tehokas tapa myydä auto. Kun olet täyttänyt autosi tiedot ja ilmoituksesi on julkaistu, sadat autoliikkeet ympäri Suomen näkevät autosi heti ja voivat tehdä siitä tarjouksia.</p>' +
        '<p>Tarjouskilpailun kesto on tyypillisesti 36 tuntia. Saat sähköpostiisi tietoja kilpailutuksen etenemisestä ja näet lopuksi parhaan tarjouksen. Sinulla on 24 tuntia aikaa hyväksyä tarjous tai tehdä vastatarjous.</p>' +
        '<p>Mikäli hyväksyt tarjouksen, olethan valmis luopumaan autostasi noin viikon kuluessa.</p>' },

      { q: 'Näenkö tarjoukset kilpailutuksen aikana?', a:
        '<p>Voit seurata kilpailutuksen aikana tehtyjen tarjousten ja tarjoajien määrää. Tarjouskilpailun päätyttyä näet parhaan tarjouksen. Mahdollisesti näet myös vaihtoehtoisen tarjouksen, mikäli toivot auton noutoa kotoasi.</p>' },

      { q: 'Miksi saamani tarjousten määrä on korkeampi kuin tarjoajien?', a:
        '<p>Palvelumme toimii huutokauppaperiaatteella, jossa autoliikkeet voivat korottaa tarjoustaan kilpailutuksen aikana. Siksi tarjousten määrä voi olla suurempi kuin tarjoajien määrä – sama autoliike voi tehdä useita korotuksia. Tarjouskilpailun päätyttyä näet korkeimman tarjouksen.</p>' },

      { q: 'Mitä jos en ole tyytyväinen korkeimpaan tarjoukseen?', a:
        '<p>Sinun ei tarvitse myydä autoasi, jos et ole tyytyväinen korkeimpaan tarjoukseen.</p>' +
        '<p>Suosittelemme kuitenkin tekemään vastatarjouksen korkeimmalle tarjoajalle ennen päätöstä. Tätä kautta päästään usein kauppoihin.</p>' },

      { q: 'Autoliike ei reagoi vastatarjoukseeni', a:
        '<p>Autoliikkeet reagoivat vastatarjouksiin yleensä noin yhden arkipäivän kuluessa.</p>' +
        '<p>Jos et ole saanut vastausta tässä ajassa tai tilanne mietityttää, voit olla meihin yhteydessä osoitteessa ' + EMAIL + '. Autamme mielellämme eteenpäin.</p>' },

      { q: 'Tarjous on päässyt vanhentumaan. Pitääkö minun kilpailuttaa uudestaan?', a:
        '<p>Jos korkein tarjous on ehtinyt umpeutua, ole yhteydessä asiakaspalveluumme osoitteessa ' + EMAIL + '.</p>' +
        '<p>Tarkistamme tilanteen ja voimme tarvittaessa olla yhteydessä tarjouksen tehneeseen autoliikkeeseen. Saamme mahdollisesti myös ilmoituksesi julkaistua uutta kilpailutusta varten.</p>' },

      { q: 'Mitä tapahtuu, kun hyväksyn tarjouksen?', a:
        '<p>Kun hyväksyt tarjouksen, autoliike on sinuun yhteydessä noin yhden arkipäivän kuluttua ja pääsette sopimaan auton luovutukseen liittyvistä käytännön asioista, kuten aikataulu, luovutuspaikka, ostosopimus, maksu sekä mahdollinen loppuvelan lunastaminen.</p>' }
    ]},

    { group: 'Kaupan toteutuminen', items: [
      { q: 'Minulla on rahoitusta jäljellä autostani, miten toimin?', a:
        '<p>Kaupan yhteydessä autoliike maksaa loppuvelan suoraan rahoitusyhtiölle. Jos velkaa on enemmän kuin hyväksytty tarjous, maksat erotuksen itse. Jos taas tarjous on suurempi kuin jäljellä oleva velka, saat ylimenevän osuuden tilillesi.</p>' +
        '<p>Lisätietoa löydät sivultamme: Rahoitetun auton myynti.</p>' },

      { q: 'Milloin autoliike on minuun yhteydessä?', a:
        '<p>Autoliike on sinuun yhteydessä yleensä arkipäivän kuluessa siitä, kun olet hyväksynyt tarjouksen. Yhteydenotto tapahtuu puhelimitse, ja silloin sovitaan käytännön asioista, kuten auton luovutuksen ajankohdasta ja paikasta.</p>' +
        '<p>Huomioithan, että viikonloppuisin ostajat eivät pääsääntöisesti ole töissä, joten yhteydenotto voi siirtyä seuraavalle arkipäivälle. Jos et ole saanut yhteydenottoa viimeistään muutaman arkipäivän sisällä, ole asiakaspalveluumme yhteydessä osoitteessa ' + EMAIL + ', niin tarkistamme tilanteen.</p>' },

      { q: 'Miten auton luovutus tapahtuu?', a:
        '<p>Kun olet hyväksynyt tarjouksen, autoliike ottaa sinuun yhteyttä ja voitte sopia yhdessä luovutuksen ajankohdasta ja paikasta.</p>' +
        '<p>Ilmoitusta tehdessäsi olet valinnut toimitusetäisyyden, mutta joissain tapauksissa autoliike voi myös noutaa auton suoraan kotipihaltasi. Mahdollinen nouto näkyy tarjouksen yhteydessä.</p>' +
        '<p>Luovutuksen yhteydessä autoliike hoitaa tarvittavat paperityöt ja siirtää rahat tilillesi.</p>' },

      { q: 'Miten saan maksun myymästäni autosta?', a:
        '<p>Kun olet hyväksynyt tarjouksen, ostava autoliike hoitaa kauppaan liittyvät maksu- ja paperiasiat. Saat maksun sovitusti tilillesi kun luovutus on tehty.</p>' +
        '<p>Kaikki palvelussamme toimivat autoliikkeet ovat ammattimaisia ja luotettavia toimijoita. Palvelun historian aikana maksut ovat sujuneet ongelmitta, joten voit edetä kaupantekoon turvallisin mielin.</p>' },

      { q: 'Voiko autoliike perua kaupat?', a:
        '<p>Autoliike voi perua kaupat, jos autossa ilmenee merkittäviä vikoja, joista ei ole kerrottu ilmoituksella.</p>' +
        '<p>Tämä on kuitenkin harvinaista ja liittyy yleensä tilanteisiin, joissa auton kuntoa koskevia olennaisia tietoja on jäänyt ilmoittamatta. Siksi rehellinen kuvaus autosta on tärkeä.</p>' +
        '<p>Jos kauppa jostain syystä peruuntuu, olemme tilanteessa apunasi ja autamme löytämään ratkaisun, tarvittaessa myös uuden ostajan.</p>' },

      { q: 'Miksi minulta kysytään henkilötietoja kaupan toteutumisen jälkeen?', a:
        '<p>Henkilötietoja voidaan pyytää kaupan jälkeen EU:n DAC7-verodirektiivin vuoksi. Direktiivi velvoittaa AutoVexin kaltaisia verkkoalustoja ilmoittamaan tietyt tiedot asiakkaidensa myynneistä veroviranomaisille.</p>' +
        '<p>Tiedot kerätään ainoastaan lakisääteisen velvoitteen täyttämiseksi ja käsitellään tietosuojan mukaisesti.</p>' +
        '<p>Lisätietoja löydät Verohallinnon sivuilta.</p>' },

      { q: 'Kenen tulee täyttää DAC7-lomake?', a:
        '<p>Lakisääteinen DAC7-lomake täytetään sen henkilön tiedoilla, joka on luonut myynti-ilmoituksen palveluumme. Tämä voi olla eri henkilö kuin auton varsinainen omistaja.</p>' +
        '<p>Palvelussamme myydään usein autoja esimerkiksi toisen henkilön, kuolinpesän tai yrityksen puolesta. Lomakkeen täyttäminen on lakisääteinen velvoite eikä se vaikuta verotukseesi millään tavalla.</p>' }
    ]}
  ];

  /* ── English — working translation of the CMS text, pending approval ─────── */
  var FRONT_EN = [
    { q: 'Why is it worth selling your car through AutoVex?', a:
      '<p><b>Ease and speed:</b> One request reaches dealerships all over Finland. When the bidding ends you pick the offer you like best in your profile.</p>' +
      '<p><b>Price:</b> We put the dealerships in competition for you, so you have the chance to get the best price on the market. They bid against each other.</p>' +
      '<p><b>Reliability:</b> A trustworthy company buys your car, and the sale goes through quickly and without worry. The dealership handles the paperwork and the money reaches your account fast.</p>' +
      '<p>The service is completely free for you! You are not committed to selling if you are not happy with the offers.</p>' },
    { q: 'Is AutoVex a free service?', a:
      '<p>Yes, the service is completely free for the seller and there are no hidden costs.</p>' +
      '<p>Our business model is based on a commission dealerships pay on completed sales. We act as an efficient sourcing channel and partner for them, helping them find quality used cars – and you get your car put up for competition easily.</p>' },
    { q: 'How long does the bidding take?', a:
      '<p>With AutoVex you can sell your car in as little as 24 hours. Bidding runs for 1.5 working days from the first offer. We keep you up to date by email throughout.</p>' },
    { q: 'Can I sell the car elsewhere at the same time?', a:
      '<p>We do not recommend selling the car elsewhere at the same time. The more dealerships take part in the bidding, the higher the price goes. Every offer made outside the service is one taken away from the competition, and from the best possible outcome. Hundreds of dealerships across Finland use our service, including all the best-known names in the field.</p>' },
    { q: 'I am trading in a car — can I use AutoVex?', a:
      '<p>Absolutely, and we recommend it. You often get a better deal by first selling your current car at the best market price and then buying the next one as a cash purchase from the dealership you want, with no trade-in value to negotiate.</p>' +
      '<p>When the dealership does not have to take a trade-in, you often get a better price on the new car or a clearer discount. For many people this is the most sensible way financially.</p>' +
      '<p>Read more on our blog: focus on the price difference — it pays off.</p>' },
    { q: 'Does an outstanding loan get in the way of selling?', a:
      '<p>No. You can sell the car even if there is financing left on it. At the sale the remaining debt is paid off to the finance company and any difference is settled to you. If the debt exceeds the value of the car, the dealership charges you the remainder. Read more about selling a financed car.</p>' },
    { q: 'I think the price estimate is too low', a:
      '<p>The estimate is based on realised sale prices of similar cars and up-to-date market data. It does not account for every individual factor, such as your car\'s condition, its equipment or exceptional demand. Read more about the price estimate.</p>' +
      '<p>The estimate is indicative and the final market price is set in the bidding. It is worth trying, since the offer you get may well be higher than the estimate.</p>' +
      '<p>What affects a car\'s value:</p>' +
      '<ul class="list-disc pl-5 space-y-1"><li>Age of the car</li><li>Kilometres driven</li><li>Service history and repairs carried out</li><li>Demand on the car market</li><li>Condition of the car</li><li>Optional equipment, which is worth listing in full</li></ul>' +
      '<p>How does a dealership price your car? Read more.</p>' },
    { q: 'How does the bidding work?', a:
      '<p>Putting dealerships in competition is quick and easy with us. Once you publish your request, hundreds of dealerships see your car\'s details. They bid against each other, which pushes the price up. Follow your email to stay up to date. When the bidding ends you see every offer you received and can accept the best one.</p>' },
    { q: 'My car has faults — can I still sell it?', a:
      '<p>Yes. It is very important to report all faults, dents and other shortcomings, as well as repairs carried out, honestly while filling in the listing. Add clear photos of the damage and of the service book entries.</p>' +
      '<p>Service history and openness about the car\'s condition increase dealerships\' trust and interest. When the details are right from the start, the buyer can make an offer with more confidence – and stick to the agreed sum through to the end.</p>' }
  ];

  var OFFERS_EN = [
    { q: 'Why can\'t I see the dealership names and offer amounts?', a:
      '<p>You get to see the offers as soon as the bidding ends. The details of the dealership behind an offer are shown when you accept it. The reason is that if dealership details were revealed, the bidding and counter-offers might not be handled inside our service.</p>' },
    { q: 'Does an outstanding loan get in the way of selling?', a:
      '<p>No! The dealership pays the remaining debt to the finance company in full. If the debt exceeds the value of the car, the dealership charges the seller the remainder. Read more about selling a financed car.</p>' },
    { q: 'How long does the bidding take?', a:
      '<p>AutoVex is an efficient way to sell a car. Once you have filled in your car\'s details and your listing is published, hundreds of dealerships across Finland see it immediately and can bid on it.</p>' +
      '<p>Bidding typically runs for 36 hours. You get updates by email and see the best offer at the end. You then have 24 hours to accept it or make a counter-offer. If you accept, please be ready to hand the car over within about a week.</p>' },
    { q: 'Can I sell the car elsewhere at the same time?', a:
      '<p>You can, but we do not recommend it. Our service works because dealerships compete with each other for your car. The more of them take part through AutoVex, the more likely the sum offered rises. Selling elsewhere at the same time reduces that competition and can affect the outcome negatively.</p>' +
      '<p>Hundreds of dealerships across Finland use AutoVex – all the well-known names are there. One listing reaches practically the whole market with no extra effort.</p>' },
    { q: 'What is the difference between accepting an offer and making a counter-offer?', a:
      '<p>By accepting an offer you see which dealership it is and agree the sale directly with them. If the price could still be improved, make the dealership a counter-offer. You can make two counter-offers in total, after which you accept or reject the final price.</p>' },
    { q: 'What if I am not happy with the offers?', a:
      '<p>There is no obligation to sell. We do recommend always making a counter-offer to the highest bidder before rejecting an offer — a counter-offer often gets the deal done.</p>' },
    { q: 'Is AutoVex a free service?', a:
      '<p>Yes, the service is completely free for the seller and there are no hidden costs.</p>' +
      '<p>Our business model is based on a commission dealerships pay on completed sales. We act as an efficient sourcing channel and partner for them, helping them find quality used cars – and you get your car put up for competition easily.</p>' },
    { q: 'What if a dealership has not responded to my counter-offer and other offers are expiring?', a:
      '<p>Once you have made a counter-offer, time cannot run out while you wait for the dealership\'s answer. If for some reason you do not reach a deal with the highest bidder and would accept one of the earlier offers, you can contact us to arrange it. ' + EMAIL + '</p>' },
    { q: 'What happens when I accept an offer?', a:
      '<p>When you accept an offer, the dealership contacts you within about one working day and you agree the practical details of handing the car over: timing, place, the purchase agreement, payment and redeeming any outstanding loan.</p>' },
    { q: 'Can a dealership cancel the sale?', a:
      '<p>If it turns out the car has major hidden faults, or something similar that was not declared in the listing, the dealership can cancel. This happens very rarely (where clear known faults were left out). If it does, our team contacts both you and the dealership and helps you complete the sale you wanted with another dealership.</p>' },
    { q: 'Can offers be rejected?', a:
      '<p>Yes, once the bidding ends you can reject the offers in your profile. We do recommend always making a counter-offer to the highest bidder first — a counter-offer often gets the deal done.</p>' },
    { q: 'Which dealerships use AutoVex?', a:
      '<p>All the largest dealership chains are there, along with hundreds of mid-sized and local dealerships across Finland.</p>' +
      '<p>Every buyer operating in the service is a reliable, professional business. We are Finland\'s first and largest dealership bidding service, and tens of thousands of successful car sales have been made through us.</p>' },
    { q: 'What is the difference between a purchase offer and a trade-in offer?', a:
      '<p>A dealership\'s trade-in offer and purchase offer cannot be compared with each other. What matters when buying a car is the price difference. Read more about it.</p>' },
    { q: 'Why is it worth selling your car through AutoVex?', a:
      '<p><b>Ease:</b> You can sell your car from the sofa. One listing reaches hundreds of dealerships across Finland at once. You accept the best offer and the sale happens directly with the dealership.</p>' +
      '<p><b>The best offer:</b> Every dealership in the service sees your car\'s details and bids against the others. That is how you get the best offer on the market. The highest offer follows dealership demand and the car\'s market value, which depends on kilometres driven, condition, optional equipment, service records and the state of the tyres.</p>' +
      '<p><b>Reliability:</b> Hundreds of well-known, safe dealerships take part. More than 80,000 cars have been sold to dealerships through us. The dealership handles the paperwork and transfers the money to your account. AutoVex\'s own experts help you throughout the process.</p>' +
      '<p>The service is completely free for you! If you are not happy with the offers, you are not committed to selling.</p>' },
    { q: 'How do I get dealerships interested in my car?', a:
      '<p>The most important thing is to write as complete and clear a listing as you can. Add photos of the inside and outside, photograph any damage openly, and include the service history. Service book entries and documented services in particular increase dealerships\' trust and interest. The more precise the details you give about condition, equipment and history, the easier it is for dealerships to make an offer – and the more likely competition pushes the price up.</p>' }
  ];

  var SUPPORT_EN = [
    { group: 'General questions about the service', items: [
      { q: 'Why is it worth selling your car through AutoVex?', a:
        '<p>We are a Finnish car-selling competition service that lets you put dealership offers in competition easily online.</p>' +
        '<p><b>Ease:</b> You can sell your car from the sofa. One listing reaches hundreds of dealerships across Finland at once. You accept the best offer and the sale happens directly with the dealership.</p>' +
        '<p><b>The best offer:</b> Every dealership in the service sees your car\'s details and bids against the others. That is how you get the best offer on the market. The highest offer follows dealership demand and the car\'s market value, which depends on kilometres driven, condition, optional equipment, service records and the state of the tyres.</p>' +
        '<p><b>Reliability:</b> Hundreds of well-known, safe dealerships take part. More than 70,000 cars have been sold to dealerships through us. The dealership handles the paperwork and transfers the money to your account. AutoVex\'s own experts help you throughout the process.</p>' +
        '<p>The service is completely free for you! If you are not happy with the offers, you are not committed to selling.</p>' },
      { q: 'How does the selling process work?', a:
        '<p>The selling process at AutoVex is made as easy and effortless for you as possible. Step by step:</p>' +
        '<ol class="list-decimal pl-5 space-y-2">' +
        '<li><b>Creating the listing:</b> You tell us about your car while creating the listing. The basic details are filled in automatically from the registration number. You only add photos and details of equipment and services.</li>' +
        '<li><b>The expert gets in touch:</b> Our expert calls you (the call takes about 5 minutes). Together we make sure the listing details are right, and we explain what happens next.</li>' +
        '<li><b>Bidding:</b> Once the listing has been checked, it is published for dealerships to bid on, typically for 36 hours. We keep you up to date by email.</li>' +
        '<li><b>Your decision:</b> When bidding ends you see the best offer and can accept it if you want. The service does not oblige you to sell.</li>' +
        '<li><b>The sale:</b> If you accept, the buying dealership contacts you to agree on handover, paperwork and payment.</li>' +
        '</ol>',
        v1:
        '<p>The selling process at AutoVex is made as easy and effortless for you as possible. Step by step:</p>' +
        '<ol class="list-decimal pl-5 space-y-2">' +
        '<li><b>Creating the listing:</b> You tell us about your car while creating the listing. The basic details are filled in automatically from the registration number. You only add photos and details of equipment and services.</li>' +
        '<li><b>The expert gets in touch:</b> Our expert calls you if necessary (the call takes about 5 minutes). Together we make sure the listing details are right, and we explain what happens next.</li>' +
        '<li><b>Bidding:</b> Once the listing is ready, it is published for dealerships to bid on, typically for 36 hours. We keep you up to date by email.</li>' +
        '<li><b>Your decision:</b> When bidding ends you see the best offer and can accept it if you want. The service does not oblige you to sell.</li>' +
        '<li><b>The sale:</b> If you accept, the buying dealership contacts you to agree on handover, paperwork and payment.</li>' +
        '</ol>' },
      { q: 'Is AutoVex a free service?', a:
        '<p>Yes, the service is completely free for the seller and there are no hidden costs.</p>' +
        '<p>Our business model is based on a commission dealerships pay on completed sales. We act as an efficient sourcing channel and partner for them, helping them find quality used cars – and you get your car put up for competition easily.</p>' },
      { q: 'Am I committing to selling my car?', a:
        '<p>No. Submitting a request does not oblige you to sell.</p>' +
        '<p>When bidding ends you see the highest offer and decide yourself whether to accept it. You have 24 hours to decide – after that the offer lapses automatically.</p>' +
        '<p>If the best offer does not appeal to you, it is worth making a counter-offer to the highest bidder: that often gets the deal done.</p>' +
        '<p>If you do accept, please be ready to hand the car over within about a week.</p>' },
      { q: 'Which dealerships take part in the service?', a:
        '<p>All the largest dealership chains are there, along with hundreds of mid-sized and local dealerships across Finland.</p>' +
        '<p>Every buyer operating in the service is a reliable, professional business. We are Finland\'s first and largest dealership bidding service, and tens of thousands of successful car sales have been made through us.</p>' },
      { q: 'How old a car can be sold in the service?', a:
        '<p>Any car driven under 250,000 km can be sold with us. For cars over that limit there is generally no demand in the service. There is no age limit, but at the moment dealership interest is greatest in cars under 10 years old and under 150,000 km.</p>' },
      { q: 'How can I get in touch with AutoVex?', a:
        '<p>Our customer service is glad to help you throughout the selling process. We want to make sure you get the best possible offer for your car, so we go through the details you filled in briefly with you by phone before the listing is published. You can also reach us by email at ' + EMAIL + '. We are available on weekdays 10-16.</p>',
        v1:
        '<p>Our customer service is glad to help you throughout the selling process. We want to make sure you get the best possible offer for your car, so if necessary we go through the details you filled in briefly with you by phone before the listing is published. You can also reach us by email at ' + EMAIL + '. We are available on weekdays 10-16.</p>' }
    ]},
    { group: 'Before selling', items: [
      { q: 'How do I know what my car is worth?', a:
        '<p>You get a personal consultation from our expert by phone about the car\'s market value before bidding starts. We give a realistic estimate of roughly where your car\'s value sits at the moment.</p>' +
        '<p>Want to understand how dealerships price cars? Read more.</p>',
        v1:
        '<p>If necessary you get a personal consultation from our expert by phone about the car\'s market value before bidding starts. We give a realistic estimate of roughly where your car\'s value sits at the moment.</p>' +
        '<p>Want to understand how dealerships price cars? Read more.</p>' },
      { q: 'My car has faults — can I still sell it?', a:
        '<p>Yes. It is very important to report all faults, dents and other shortcomings, as well as repairs carried out, honestly while filling in the listing. Add clear photos of the damage and of the service book entries.</p>' +
        '<p>Service history and openness about the car\'s condition increase dealerships\' trust and interest. When the details are right from the start, the buyer can make an offer with more confidence – and stick to the agreed sum through to the end.</p>' },
      { q: 'Can I sell a car on someone else\'s behalf?', a:
        '<p>Yes, you can handle the selling process on someone else\'s behalf without separate authorisation.</p>' +
        '<p>Note that at handover the buying dealership checks that the seller has the right to make the sale. At that point the owner must either provide a power of attorney or be present.</p>' },
      { q: 'Can I sell the car elsewhere at the same time?', a:
        '<p>You can, but we do not recommend it. Our service works because dealerships compete with each other for your car. The more of them take part through AutoVex, the more likely the sum offered rises. Selling elsewhere at the same time reduces that competition and can affect the outcome negatively.</p>' +
        '<p>Hundreds of dealerships across Finland use AutoVex – all the well-known names are there. One listing reaches practically the whole market with no extra effort.</p>' },
      { q: 'I am trading in a car — can I use AutoVex?', a:
        '<p>Absolutely, and we recommend it. You often get a better deal by first selling your current car at the best market price and then buying the next one as a cash purchase from the dealership you want, with no trade-in value to negotiate.</p>' +
        '<p>When the dealership does not have to take a trade-in, you often get a better price on the new car or a clearer discount. For many people this is the most sensible way financially.</p>' +
        '<p>Read more on our blog: focus on the price difference — it pays off.</p>' },
      { q: 'Does an outstanding loan get in the way of selling?', a:
        '<p>No. You can sell the car even if there is financing left on it. At the sale the remaining debt is paid off to the finance company and any difference is settled to you. If the debt exceeds the value of the car, the dealership charges you the remainder. Read more about selling a financed car.</p>' },
      { q: 'Can a company sell a car?', a:
        '<p>Absolutely, as long as the company\'s field of business is not the retail of cars and light motor vehicles. Remember to mark the car as "VAT deductible" if that applies. Offers made through the service always include VAT.</p>' }
    ]},
    { group: 'Creating the listing', items: [
      { q: 'What details do I need to sell my car?', a:
        '<p>We fetch your car\'s basic details automatically from the registration number. You need to report the kilometres driven and give details of the service history, equipment, any faults and the state of the tyres.</p>' +
        '<p>You also need photos. The car does not need washing or polishing for them; what matters is giving a complete picture. Photograph the outside and the inside from every direction. Inside, the dashboard, centre console and front and rear seats are worth capturing. Remember to show any scratches and dents. Photograph the tyre tread depth as well, and the service book entries or other service documents. Photography instructions and practical examples are here.</p>' +
        '<p>A carefully filled listing and clear photos increase dealership interest and improve the offers. With a little preparation the form usually takes only a few minutes, and you can come back to an unfinished listing later.</p>' },
      { q: 'What kind of photos should I take?', a:
        '<p>Take clear photos of the car outside and inside. Photograph it from every corner so the front and rear bumpers and both sides are properly visible. Inside, capture the dashboard, centre console and front and rear seats. Remember the tyres too.</p>' +
        '<p>Photograph the service book entries or service records clearly, and take close-ups of any damage. Good, honest photos increase dealership interest and improve the offers. The car does not need washing or polishing for them.</p>' +
        '<p>See example photos and read more on our blog: taking quality photos of a car for sale.</p>' },
      { q: 'Can I renew a previous listing?', a:
        '<p>Yes, renewing an earlier listing is possible. Contact our customer service by email at ' + EMAIL + ' and we will check your situation and help you start the bidding.</p>' },
      { q: 'The form will not let me continue', a:
        '<p>If you run into technical trouble, try these first:</p>' +
        '<ol class="list-decimal pl-5 space-y-1"><li>Switch browser – Google Chrome usually works best.</li><li>Try private browsing (incognito), since browser cookies can sometimes cause problems.</li></ol>' +
        '<p>If these do not get you moving, contact us at ' + EMAIL + '. We will help you onwards.</p>' },
      { q: 'Saving or adding photos does not work', a:
        '<p>Publishing a listing requires at least five photos, so please check first that you have tried to add that many. If uploading still fails, contact us at ' + EMAIL + ' and we will help you onwards.</p>' },
      { q: 'How do I get dealerships interested in my car?', a:
        '<p>The most important thing is to write as complete and clear a listing as you can. Add photos of the inside and outside, photograph any damage openly, and include the service history. Service book entries and documented services in particular increase dealerships\' trust and interest.</p>' +
        '<p>The more precise the details you give about condition, equipment and history, the easier it is for dealerships to make an offer – and the more likely competition pushes the price up.</p>' +
        '<p>Setting a realistic asking price matters too, and we support you in that. You get a personal consultation from our expert by phone about the car\'s market value before the competition starts.</p>' +
        '<p>Want to understand how dealerships price cars? Read more about it.</p>',
        v1:
        '<p>The most important thing is to write as complete and clear a listing as you can. Add photos of the inside and outside, photograph any damage openly, and include the service history. Service book entries and documented services in particular increase dealerships\' trust and interest.</p>' +
        '<p>The more precise the details you give about condition, equipment and history, the easier it is for dealerships to make an offer – and the more likely competition pushes the price up.</p>' +
        '<p>If necessary you get a personal consultation from our expert by phone about the car\'s market value before the competition starts.</p>' +
        '<p>Want to understand how dealerships price cars? Read more about it.</p>' },
      { q: 'Why is my listing under review?', a:
        '<p>We want to make sure you get the best possible price for your car. That is why we go through the listing details briefly before publishing it.</p>' +
        '<p>Our expert calls you and confirms things like the kilometres, equipment, service history, tyre condition and any faults. When your car\'s details are complete and correct, dealerships are glad to make offers.</p>' +
        '<p>At the same time we discuss the price estimate and a realistic asking price for your car. We also explain how the process continues from there.</p>' +
        '<p>Going through the details usually takes about 5 minutes, and we normally get in touch by the next working day. In peak season, or after weekends and public holidays, it can take a little longer.</p>',
        v1:
        '<p>We want to make sure you get the best possible price for your car. That is why we go through the listing details briefly, case by case, before publishing it.</p>' +
        '<p>Our expert calls you and confirms things like the kilometres, equipment, service history, tyre condition and any faults. When your car\'s details are complete and correct, dealerships are glad to make offers.</p>' +
        '<p>At the same time we discuss the price estimate and a realistic asking price for your car. We also explain how the process continues from there.</p>' +
        '<p>Going through the details usually takes about 5 minutes, and we normally get in touch by the next working day. In peak season, or after weekends and public holidays, it can take a little longer.</p>' }
    ]},
    { group: 'Bidding and offers', items: [
      { q: 'How does the bidding work?', a:
        '<p>Putting dealerships in competition is quick and easy with us. When you publish your request, hundreds of reliable dealerships across Finland see your car\'s details and can bid on it for about 36 hours. They compete with each other so the highest offer can rise to the best market level.</p>' +
        '<p>You get notifications by email as the bidding progresses. When it ends you see the best offer and can accept it or make a counter-offer.</p>' },
      { q: 'How long does the bidding take?', a:
        '<p>AutoVex is an efficient way to sell a car. Once you have filled in your car\'s details and your listing is published, hundreds of dealerships across Finland see it immediately and can bid on it.</p>' +
        '<p>Bidding typically runs for 36 hours. You get updates by email and see the best offer at the end. You then have 24 hours to accept it or make a counter-offer.</p>' +
        '<p>If you accept, please be ready to hand the car over within about a week.</p>' },
      { q: 'Do I see the offers while bidding is running?', a:
        '<p>You can follow the number of offers made and of bidders during the bidding. When it ends you see the best offer. You may also see an alternative offer if you would like the car collected from your home.</p>' },
      { q: 'Why is the number of offers higher than the number of bidders?', a:
        '<p>Our service works on an auction principle, where dealerships can raise their offer during the bidding. That is why the number of offers can be greater than the number of bidders – the same dealership can raise several times. When bidding ends you see the highest offer.</p>' },
      { q: 'What if I am not happy with the highest offer?', a:
        '<p>You do not have to sell your car if you are not happy with the highest offer.</p>' +
        '<p>We do recommend making a counter-offer to the highest bidder before deciding. That often gets the deal done.</p>' },
      { q: 'The dealership is not responding to my counter-offer', a:
        '<p>Dealerships usually respond to counter-offers within about one working day.</p>' +
        '<p>If you have not had an answer in that time, or the situation concerns you, you can contact us at ' + EMAIL + '. We are glad to help.</p>' },
      { q: 'An offer has expired. Do I have to run the bidding again?', a:
        '<p>If the highest offer has lapsed, contact our customer service at ' + EMAIL + '.</p>' +
        '<p>We will check the situation and can contact the dealership that made the offer if needed. We may also be able to republish your listing for a new round of bidding.</p>' },
      { q: 'What happens when I accept an offer?', a:
        '<p>When you accept an offer, the dealership contacts you within about one working day and you agree the practical details of handing the car over: timing, place, the purchase agreement, payment and redeeming any outstanding loan.</p>' }
    ]},
    { group: 'Completing the sale', items: [
      { q: 'I have financing left on my car — what do I do?', a:
        '<p>At the sale the dealership pays the remaining debt directly to the finance company. If there is more debt than the accepted offer, you pay the difference yourself. If the offer is larger than the remaining debt, you receive the surplus in your account.</p>' +
        '<p>More information is on our page: selling a financed car.</p>' },
      { q: 'When will the dealership contact me?', a:
        '<p>The dealership usually contacts you within a working day of your accepting the offer. It happens by phone, and you agree practical matters such as when and where the car changes hands.</p>' +
        '<p>Note that buyers are generally not at work at weekends, so contact may move to the next working day. If you have not heard within a few working days, contact our customer service at ' + EMAIL + ' and we will check.</p>' },
      { q: 'How does handing over the car work?', a:
        '<p>Once you have accepted an offer, the dealership contacts you and you agree together on the time and place of handover.</p>' +
        '<p>You chose a delivery distance when creating the listing, but in some cases the dealership can also collect the car from your driveway. Any collection is shown with the offer.</p>' +
        '<p>At handover the dealership takes care of the paperwork and transfers the money to your account.</p>' },
      { q: 'How do I get paid for the car I sold?', a:
        '<p>Once you have accepted an offer, the buying dealership handles the payment and paperwork. You receive the payment in your account as agreed once the handover is done.</p>' +
        '<p>Every dealership operating in our service is professional and reliable. Payments have gone through without problems throughout the service\'s history, so you can proceed with confidence.</p>' },
      { q: 'Can a dealership cancel the sale?', a:
        '<p>A dealership can cancel the sale if significant faults come to light that were not declared in the listing.</p>' +
        '<p>This is rare and usually relates to situations where essential information about the car\'s condition was left out. That is why an honest description matters.</p>' +
        '<p>If a sale falls through for some reason, we are there to help and will find a solution — a new buyer if necessary.</p>' },
      { q: 'Why am I asked for personal details after the sale?', a:
        '<p>Personal details may be requested after a sale because of the EU\'s DAC7 tax directive. It obliges online platforms like AutoVex to report certain information about their customers\' sales to the tax authorities.</p>' +
        '<p>The details are collected solely to meet that legal obligation and are handled in line with data protection.</p>' +
        '<p>More information is available on the Tax Administration\'s website.</p>' },
      { q: 'Who should fill in the DAC7 form?', a:
        '<p>The statutory DAC7 form is filled in with the details of the person who created the listing in our service. That can be someone other than the car\'s actual owner.</p>' +
        '<p>Cars are often sold in our service on behalf of another person, an estate or a company. Filling in the form is a legal obligation and does not affect your taxation in any way.</p>' }
    ]}
  ];

  window.FAQ_CONTENT = {
    EMAIL: EMAIL,
    front:  { fi: FRONT_FI,  en: FRONT_EN },
    offers: { fi: OFFERS_FI, en: OFFERS_EN },
    support: { fi: SUPPORT_FI, en: SUPPORT_EN }
  };
}());
