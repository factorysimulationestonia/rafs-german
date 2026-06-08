import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const sectionClass = 'px-5 py-20 sm:px-8 lg:px-[10vw] lg:py-36';
const darkSurfaceClass =
  'bg-[radial-gradient(circle_at_1px_1px,rgba(226,171,25,0.16)_1px,transparent_0),linear-gradient(135deg,#000_0%,#111_46%,#262626_100%)] bg-[length:34px_34px,auto]';
const h2Class = 'mb-10 text-[clamp(2.7rem,6vw,5.6rem)] leading-none font-normal';
const h3Class = 'mb-5 text-[clamp(1.35rem,2vw,2rem)] leading-tight font-bold';
const liClass = 'mb-4 text-[clamp(1rem,1.45vw,1.28rem)] leading-snug';
const basePath = import.meta.env.BASE_URL.endsWith('/') ? import.meta.env.BASE_URL : `${import.meta.env.BASE_URL}/`;
const basePathPrefix = basePath === '/' ? '' : basePath.replace(/\/$/, '');
const buildCommit = import.meta.env.VITE_COMMIT_SHA || '5ba3d0d';
const lastUpdated = import.meta.env.VITE_LAST_UPDATED || '2026-05-06';
const assetPath = (path) => `${basePath}${path.replace(/^\//, '')}`;
const iconMask = {
  WebkitMask: `url(${assetPath('/check.svg')}) center / contain no-repeat`,
  mask: `url(${assetPath('/check.svg')}) center / contain no-repeat`
};

const content = {
  et: {
    languageLabel: 'Switch to English',
    flagSrc: '/en-flag.svg',
    heroHeadline: 'Kontseptsioonist kindla investeerimisotsuseni',
    heroHeadlineMobile: <>Kontseptsioonist kindla investeerimis-<br />otsuseni</>,
    nav: ['Teenused', 'Projektid', 'Meist', 'Uudised', 'Wheel.me'],
    heroSubline: {
      start: <>Aitame tootmisettevõtetel enne investeeringut hinnata, kas planeeritud lahendus töötab päriselt nii nagu vaja.<br />Nii saad </>,
      risk: 'vähendada riske',
      afterRisk: ', ',
      mistakes: 'vältida kulukaid vigu',
      afterMistakes: ' ning ',
      savings: 'hoida kokku aega ja raha',
      end: '.'
    },
    heroButton: 'Räägime projektist',
    heroSecondary: 'Vaata teenuseid',
    contactButton: 'Võta ühendust',
    search: {
      label: 'Otsi',
      placeholder: 'Otsi...',
      breadcrumb: 'Otsing',
      resultsTitle: 'Otsingu tulemused',
      loading: 'Otsime tulemusi...',
      noResults: 'Kahjuks ei leitud sinu otsingule vastavaid tulemusi. Proovi uuesti teise märksõnaga.',
      blogLink: 'Loe teisi uudiseid',
      latestTitle: 'Vaata meie viimaseid uudiseid',
      readMore: 'Loe edasi',
      contactTitle: 'Ei leidnud vastust?',
      contactText: 'Saada oma küsimus meile otse ja vaatame koos, kuidas saame aidata.'
    },
    projectsTitle: 'Projektid',
    projectIntro:
      'Näited projektidest, kus simulatsioonid ja digitaalsed mudelid aitasid teha kindlamaid tootmisotsuseid enne kulukaid füüsilisi muudatusi.',
    projectCardLabels: {
      solution: 'Lahendus',
      results: 'Tulemused'
    },
    projects: [
      {
        title: 'Plastitööstus',
        image: '/project-plastic.png',
        problem: 'Uute testimisseadmete mõju tootmisele oli vaja hinnata enne investeeringut, et vältida pudelikohti, seisakuid ja hilisemaid ümberkorraldusi.',
        solution: 'Modelleeriti pistikupesade koostamine, testimine ja pakendamine ning simuleeriti erinevaid tootmisstsenaariume enne seadmete hankimist.',
        results: [
          'Valideeritud tootmisvõimekus enne seadmete saabumist',
          'Tuvastatud kriitilised pudelikohad ja tsükliaja piirangud',
          'Tugev alus seadmetarnijate hinnapäringuteks',
          'Kiirem projektikäivitus ja tootmise planeerimine',
          'Välditud kulukad muudatused pärast juurutust'
        ]
      },
      {
        title: 'Rasketööstus',
        image: '/project-heavy.png',
        problem: '18 000 m² tootmishoone ümberplaneerimine nõudis täpset ülevaadet olemasolevast keskkonnast ja kindlust, et uued seadmete paigutused toimivad enne füüsilist paigaldust.',
        solution: 'Kogu tehas laserskaneeriti, loodi täpne DWG alus ning simuleeriti erinevaid layouti ja logistika stsenaariume.',
        results: [
          'Täpne digitaalne alus kogu projekteerimiseks',
          'Valideeritud seadmete paigutused enne investeeringuid',
          'Kiirem ja kindlam tehase ümberplaneerimine',
          'Välditud logistilised konfliktid ja ruumiprobleemid',
          'Tugev tehniline ülevaade kogu tootmiskeskkonnast'
        ]
      },
      {
        title: 'Toiduainetööstus',
        image: '/project-food.png',
        imageOverlay: '/project-food2.png',
        problem: 'Tootmisprotsessis tekkisid ooteajad, ebaühtlane voog ja pudelikohad, mis piirasid läbilaskevõimet ja põhjustasid ebastabiilset tootmisrütmi.',
        solution: 'Modelleeriti kogu tootmisprotsess, analüüsiti kriitilisi etappe ning testiti erinevaid automatiseerimise ja protsessi tasakaalustamise stsenaariume.',
        results: [
          'Stabiilne materjalivoog kogu protsessi ulatuses',
          'Ühtlane tootmisrütm ja kontrollitud tsükliajad',
          'Defineeritud puhvrite mahud kriitiliste protsesside jaoks',
          'Automatiseeritud tööetapid tootmise efektiivistamiseks',
          'Virtuaalne keskkond kiireks stsenaariumite testimiseks'
        ]
      },
      {
        title: 'Laologistika',
        image: '/project-logistics.png',
        problem: 'Materjalide liikumine ja siselogistika põhjustasid tarbetut transporti, ooteaegu ja ebaühtlast koormust tootmisprotsessis.',
        solution: 'Simuleeriti AGV/AMR liikumisteekondi, operaatorite töövoogu ja materjalide liikumist eesmärgiga saavutada stabiilne siselogistika ilma füüsiliste katsetusteta.',
        results: [
          'Optimeeritud AGV/AMR liikumisteekonnad',
          'Stabiilne ja sujuv materjalivoog kogu liini ulatuses',
          'Tasakaalustatud operaatorite ja laotöötajate töökoormus',
          'Vähenenud tarbetu liikumine ja ooteajad',
          'Valideeritud logistika enne füüsilisi muudatusi'
        ]
      },
      {
        title: 'Puidutööstus',
        image: '/project-pellet.png',
        imageOverlays: ['/project-pellet2.png', '/project-pellet3.png'],
        problem: 'Tehasel puudus ajakohane digitaalne ülevaade tootmiskeskkonnast, mis muutis tulevaste arendus- ja investeerimisprojektide planeerimise aeglaseks ja riskantseks.',
        solution: 'Kogu pelletitehas laserskaneeriti ning modelleeriti detailseks digitaalseks mudeliks tootmise visualiseerimiseks, planeerimiseks ja andmete integreerimiseks.',
        results: [
          'Täpne punktipilv, mudelid ning joonised kogu tehasekeskkonnast',
          'Tugev alus tulevaste investeeringute planeerimiseks',
          'Visuaalne ülevaade keerukatest tootmisprotsessidest',
          'Valmidus tootmisandmete integreerimiseks',
          'Digitaalne platvorm edasiseks optimeerimiseks'
        ]
      }
    ],
    servicesTitle: 'Teenused',
    servicesIntro:
      'Valideerime tootmisotsused enne füüsilisi muudatusi, et planeeringud, investeeringud ja juurutused liiguksid kindlama aluse pealt.',
    servicesHero: {
      image: '/analysis1.png',
      imageAlt: 'AutoCAD joonise ja 3D paigutuse võrdlus tõstuki manööverdusanalüüsiga'
    },
    servicesQuestions: [
      'Kuidas vältida kulukaid vigu planeerimisel?',
      'Kuidas suurendada liini tootlikkust?',
      'Kuidas vähendada seisakuid?',
      'Kuidas põhjendada investeeringut firmasiseselt?'
    ],
    serviceCardLabels: {
      validation: 'Mida valideerime',
      outcome: 'Tulemus'
    },
    serviceCta: 'Räägime projektist',
    services: [
      {
        title: 'Uue tehase või tootmisliini planeerimine',
        problem: 'Vale otsus investeerides võib põhjustada kulukaid ümberkorraldusi ja pudelikaelu pärast käivitust.',
        solutionLead: 'Loome tootmisest 3D simulatsiooni, et testida seadmete paigutust, materjalivooge, operaatorite liikumist ja tootmismahte.',
        solutionPoints: [
          'Seadmete paigutus, materjalivood ja operaatorite liikumine',
          'Tootmismahud ja tsükliajad',
          'Tõstukite ja AGV-de liikumisteed, pöörderaadiused ja vajalikud ohutusalad',
        ],
        impact: [
          'Aitab saavutada kohe suurema tootlikkuse',
          'Vähendab tootmisseisakute riski pärast ümberkorraldusi',
          'Väldib ruumipuudusest tingitud hilisemaid ümbertegemisi',
        ],
        ctaPrompt: 'Planeerid uut liini või tehase laiendust?'
      },
      {
        title: 'Olemasoleva tehase või tootmisliini tootlikkuse suurendamine',
        problem: 'Tootmine ei saavuta planeeritud läbilaset, tekivad kulukad seisakud ja olemasolevast ressursist ei saada maksimumi kätte.',
        solutionLead: 'Leiame simulatsiooni abil päris piirangud ning testime parendusi enne tootmise ümberkorraldamist.',
        solutionPoints: [
          'Pudelikaelad ja tööjaamade koormus',
          'Vahetuste mõju läbilaskele',
          'Logistika kitsaskohad',
          'Tootmisvoo, tööjaamade ja logistika optimeerimine'
        ],
        impact: [
          'Suurem läbilase olemasoleva ressursiga',
          'Lühemad tsükliajad ja vähem seisakuid',
          'Selge ülevaade tootmise tegelikest piirangutest'
        ],
        ctaPrompt: 'Tahad leida tootmise tegelikud piirangud?'
      },
      {
        title: 'Robotite ja automatiseerimise valideerimine enne juurutust',
        problem: 'Valesti juurutatud automaatikalahendused põhjustavad tootmisseisakuid ja kulukaid ümbertegemisi.',
        solutionLead: 'Testime virtuaalselt robotite ulatust, taktiaegu, järjestust ja koostööd ülejäänud tootmisega.',
        solutionPoints: [
          'Robotite tööulatus ja ligipääs',
          'Taktiajad ja tsüklite järjestus',
          'Koostöö operaatorite, seadmete ja logistika vahel',
          'Sobivate automaatikalahenduste valideerimine'
        ],
        impact: [
          'Testimine ilma tootmist seiskamata',
          'Väiksem risk kulukateks muudatusteks pärast juurutust',
          'Põhjalik sisend süsteemiintegraatoritele',
          'Kiirem kasutuselevõtt',
        ],
        ctaPrompt: 'Plaanid uut automaatikalahendust?'
      },
      {
        title: 'Tehase digitaliseerimine',
        problem: 'Muudatuste tegemine tehases on riskantne ja aeglane, kui puuduvad täpsed joonised ja tehniline ülevaade.',
        solutionLead: 'Loome laserskaneerimise abil olemasolevast tehasest täpse 3D mudeli edasiseks planeerimiseks ja projekteerimiseks.',
        solutionPoints: [
          'Olemasoleva tehase täpne jäädvustamine',
          'Punktipilv, 3D mudel ja DWG planeerimisalus',
          'Tehniline ülevaade projekteerijatele ja integraatoritele'
        ],
        impact: [
          'Kiirem projektide planeerimine',
          'Vähem mõõtmis- ja paigaldusvigu',
          'Parem koostöö projekteerijate ja integraatoritega',
          'Väiksem risk ümbertegemisteks tootmises'
        ],
        ctaPrompt: 'Vajad täpset ülevaadet oma tehasest?'
      },
      {
        title: 'Virtuaalne käikuvõtmine',
        problem: 'Süsteemi käikuvõtmine on automatiseerimisel üks viimaseid projektietappe, kuid kõige sagedamini tekivad just siis viivitused ning ümbertegemisvajadus, mis tulenevad juhtloogika vigadest ja ootamatutest olukordadest protsessis.',
        solutionLead: 'Virtuaalse käikuvõtmise käigus ühendame päris PLC ning robotiprogrammid süsteemi virtuaalse mudeliga, et testida terve süsteemi tööd enne füüsilist käivitust.',
        solutionPoints: [
          'Digitaalne mudel koos juhtkoodi ja arenduskeskkonnaga',
          'PLC signaalide, andurite ja täiturite reaalajas valideerimine',
          'Masinakoodi ja protsessijärjestuste varane testimine'
        ],
        impact: [
          'Lühendab käikuvõtmise etappi, kus muudatused on kõige kulukamad',
          'Vähendab vigase juhtprogrammi kasutuselevõtu riski',
          'Parandab tarkvara kvaliteeti enne tootmiskeskkonda jõudmist'
        ],
        ctaPrompt: 'Valideeri oma süsteem enne käivitust',
        visual: {
          type: 'virtualCommissioning',
          simulationVideo: '/vc12.webm',
          logicVideo: '/vc11.webm',
          simulationLabel: 'Visual Components',
          simulationIcon: '/vcfavicon.png',
          logicLabel: 'Siemens PLC Simulation',
          logicIcon: '/siemensfavicon.png',
          inputSignal: 'di_sensor',
          outputSignal: 'do_motor'
        }
      }
    ],
    contactTitle: 'Teeme koostööd!',
    contactText: 'Alates varajasest kontseptsioonist kuni valideeritud tehase planeeringuni.',
    form: { name: 'Nimi', email: 'E-mail', description: 'Projekti kirjeldus', send: 'Saada' },
    aboutTitle: 'Meist',
    teamTitle: 'Meeskond',
    team: [
      { name: 'Steven', role: 'Tegevjuht', credentials: 'Mehaanikainsener (BSc)', image: '/team/steven.jpg', linkedin: 'https://www.linkedin.com/in/steven-strandberg/' },
      { name: 'Hans', role: 'Simulatsiooniinsener', credentials: 'Tööstustehnika ja juhtimine (MSc)', image: '/team/hans.jpg', linkedin: 'https://www.linkedin.com/in/hjerikson/'  },
      { name: 'Markus', role: 'Projektiinsener', credentials: 'Robootika ja automaatikainsener (MSc)' }
    ],
    partnersTitle: 'Partnerid ja võrgustik',
    reseller: 'Ametlik edasimüüja ja integratsioonipartner',
    wheelmeText: 'Wheel.me on maailma esimene autonoomne ratas, mis muudab iga objekti mobiilseks robotiks',
    wheelmePrompt: 'Uuri, kuidas wheel.me lahendus sobitub sinu ettevõtte vajadustega',
    wheelmeButton: 'Võta ühendust',
    wheelmeLearnMore: 'Uuri lähemalt',
    wheelmePage: {
      title: 'Wheel.me autonoomne siselogistika',
      breadcrumb: 'Wheel.me',
      resellerText: 'Factory Simulation on ametlik Wheel.me edasimüüja ja integratsioonipartner Eestis.',
      intro:
        'Wheel.me autonoomne mobiilsete robotite lahendus võimaldab muuta olemasolevad kärud, riiulid, tööpingid ja muud siselogistika seadmed nutikateks iseliikuvateks robotiteks.',
      paragraphs: [
        'Süsteem aitab automatiseerida materjalide transporti tootmises ja laos ilma keerukate konveierite või spetsiaalsete AMR-kärude vajaduseta.',
        'Wheel.me robotid liiguvad autonoomselt eelnevalt kaardistatud keskkonnas, väldivad takistusi ning võimaldavad luua paindliku ja skaleeritava siselogistika lahenduse. Süsteem sobib tootmisettevõtetele, kes soovivad vähendada manuaalset transporti, optimeerida töövooge ja parandada materjalivoo stabiilsust.',
        'Koos simulatsioonide ja tootmisanalüüsiga aitab Wheel.me valideerida autonoomse siselogistika mõju enne investeeringu tegemist.'
      ],
      benefitsTitle: 'Lahendus võimaldab',
      benefits: [
        'Automatiseerida olemasolevad kärud ja platvormid',
        'Vähendada käsitsi transpordile kuluvat aega',
        'Suurendada tootmisvoo stabiilsust ja läbilaskevõimet',
        'Kiiresti ümber seadistada logistilisi protsesse',
        'Testida ja laiendada lahendust etapiviisiliselt'
      ],
      ctaTitle: 'Uuri, kuidas Wheel.me sinu tootmisse sobib',
      ctaText: 'Räägime läbi materjalivoo, kitsaskohad ja sobiva pilootprojekti ulatuse.',
      ctaButton: 'Räägi spetsialistiga',
      authorizedReseller: 'Ametlik edasimüüja',
      images: {
        hero: '/wheelme/wheelme_0792.jpg',
        detail: '/wheelme/_dsc3066.jpg',
        concept: '/wheelme/wheelme1.png',
        power: '/wheelme/power station close by.jpg'
      }
    },
    contacts: 'Kontakt',
    blogTitle: 'Uudised',
    breadcrumbHome: 'Avaleht',
    breadcrumbBlog: 'Uudised',
    blogIntro:
      'Lühikesed lood simulatsioonidest, tootmise planeerimisest, partnerlustest ja projektidest, kus oleme kaasatud olnud.',
    blogPosts: [
      {
        title: 'Baltic CNC tehnoloogiahariduse konverents 2026',
        category: 'Konverents',
        date: '28.05',
        sortDate: '2026-05-28',
        image: '/blog/20260528.webp',
        lead:
          'Osalesime Baltic CNC Technical Educators Conference 2026 konverentsil, mis toimus Tallinna Tehnikakõrgkooli Advanced Machining tehnoloogiakeskuses.',
        body: [
          'Päeva jooksul toimusid ettekanded tuleviku hariduse ja tööstuse teemadel, grupiarutelud, töötoad ning praktilised demoesitlused.',
          'Programmis käsitleti mitmeid tootmise ja tehnoloogia arenguga seotud teemasid:'
        ],
        items: [
          'CAM-programmeerimine tehisintellekti abil – Venten OÜ',
          'Tehaste digitaliseerimine ja simulatsioon – Factory Simulation OÜ',
          'Vibratsiooni summutavad tööriistad CNC-pinkides – Sandvik ja Alas-Kuul AS',
          'Mõõtetulemuste andmete digitaliseerimine – Mitutoyo ja Venten OÜ'
        ],
        afterItems: [
          'Meie teemaks olid tehaste digitaliseerimise erinevad võimalused, kuid sügavamalt keskendusime tootmisprotsesside projekteerimisele läbi simulatsioonide.',
          'Tõime praktilisi näiteid sellest, kuidas simulatsioon aitab tootmisotsuseid paremini hinnata — näiteks kuidas juba tõstuki liikumiskiirus võib mõjutada tootlikkust, materjalivoogu ja kogu tootmisprotsessi toimimist. Lisaks jagasime päriselulisi näiteid sellest, kuidas digitaalse mudeli abil saab võrrelda erinevaid lahendusi enne füüsiliste muudatuste tegemist tootmises.'
        ]
      },
      {
        title: 'Eesti Masinatööstusliidu Kesk-Eesti ettevõtete ühiskülastus',
        category: 'Ettevõttekülastus',
        date: '21.05–22.05',
        sortDate: '2026-05-22',
        image: '/blog/20260522.webp',
        body: [
          'Eesti Masinatööstuse Liit korraldas oma liikmetele Kesk-Eesti tehaste külastuse, mille käigus saime lähedalt tutvuda erinevate tootmisprotsesside, tootearenduse ja tehaste igapäevase opereerimisega.',
          'Kokku külastasime nelja ettevõtet ning saime väga hea ülevaate piirkonna tööstusettevõtete tegemistest, väljakutsetest ja arengusuundadest:'
        ],
        items: ['TB Works OÜ', 'PMT OÜ', 'Nuia PMT OÜ', 'Cleveron AS'],
        afterItems: [
          'Sellised külastused annavad hea võimaluse näha, kuidas erinevad tootmisettevõtted oma protsesse arendavad ning milliseid lahendusi kasutatakse efektiivsuse tõstmiseks.'
        ]
      },
      {
        title: 'Tööstus 5.0 konverents 2026',
        category: 'Konverents',
        date: '14.05',
        sortDate: '2026-05-14',
        image: '/blog/20260514.webp',
        lead: 'Sel aastal osalesime Industry 5.0 konverentsil oma stendiga.',
        body: [
          'Konverentsi keskmes olid Eesti tööstuse tulevik ja konkurentsivõime – teemadena käisid läbi tööstusinnovatsioon, kestlikkus, rakendusuuringud, automatiseerimine, robootika, digitaliseerimine, küberturvalisus ja uute tehnoloogiate praktiline kasutamine tootmisettevõtetes.',
          'Meie jaoks jõudsid paljud arutelud ühe väga praktilise küsimuseni: kuidas digitaliseerida ja parandada tootmisprotsessi ennast — mitte ainult tarkvara kaudu, vaid simulatsioonide, andmepõhise planeerimise ja erinevate stsenaariumite kiire testimise abil enne päriselus muudatuste tegemist.',
          'Loomulikult tõime kaasa ka wheel.me roboti, millega näitasime lihtsat ja praktilist paindliku automatiseerimise näidet — autonoomset prügirobotit, mis liikus messialal ringi.'
        ]
      },
      {
        title: 'Tööstusrobotite programmeerimise ja masinnägemise koolitus',
        category: 'Koolitus',
        date: '19.02 · 26.02 · 05.03 · 12.04',
        sortDate: '2026-04-12',
        image: '/blog/news1.jpg',
        excerpt:
          'Läbisime praktilise koolitusprogrammi teemadel tööstusrobotite programmeerimine (offline & online) ning masinnägemise lahenduste rakendamine tootmises. Koolitus keskendus robotite programmeerimisele ja vision-süsteemide kasutamisele automatiseeritud tootmisprotsessides.'
      },
      {
        title: 'Smart Industry konverents 2026',
        category: 'Konverents',
        date: '19.03',
        sortDate: '2026-03-19',
        image: '/blog/news2.png',
        excerpt:
          'Osalesime Smart Industry konverentsil, kus arutati tööstuse digitaliseerimise, automatiseerimise ja tulevikulahenduste teemadel. Üritusel kuulutati välja ka „Aasta Tehas 2026“.'
      },
      {
        title: 'wheel.me tehasekülastus ja koolitus Norras',
        category: 'Partnerlus',
        date: '06.04 – 07.04',
        sortDate: '2026-04-07',
        image: '/blog/news3.jpeg',
        excerpt:
          'Külastasime wheel.me tootmisüksust Norras ning osalesime tehnilisel koolitusel autonoomsete mobiilsete robotlahenduste teemal. Tutvusime süsteemide praktiliste kasutusvõimaluste, seadistamise ja erinevate tööstuslike rakendustega.'
      },
      {
        title: 'Soome–Eesti masinatööstuse seminar',
        category: 'Seminar',
        date: '22.04',
        sortDate: '2026-04-22',
        image: '/blog/news4.jpeg',
        excerpt:
          'Osalesime Soome ja Eesti lehtmetallipäevade raames toimunud masinatööstuse seminaril ja võrgustumisüritusel. Päeva jooksul arutati koostöövõimalusi, tööstuse arengusuundi ning jagati praktilisi kogemusi tootmisvaldkonnast.'
      },
      {
        title: 'Eesti Masinatööstuse Liidu 90. aastapäeva üritus',
        category: 'Võrgustik',
        date: '06.05',
        sortDate: '2026-05-06',
        image: '/blog/news5.jpg',
        excerpt:
          'Osalesime Eesti Masinatööstuse Liidu 90. aastapäeva üritusel, kus kohtusid EML-i liikmed, partnerid ning valdkonna esindajad. Üritus keskendus sektori arengule ja koostööle.'
      }
    ]
  },
  en: {
    languageLabel: 'Vaheta eesti keelele',
    flagSrc: '/ee-flag.svg',
    heroHeadline: 'From concept to a confident investment decision',
    heroHeadlineMobile: 'From concept to a confident investment decision',
    nav: ['Services', 'Projects', 'About', 'News & Blog', 'Wheel.me'],
    heroSubline: {
      start: <>We help manufacturing companies evaluate before investing whether the planned solution will actually work the way it needs to.<br />This helps you </>,
      risk: 'reduce risks',
      afterRisk: ', ',
      mistakes: 'avoid costly mistakes',
      afterMistakes: ' and ',
      savings: 'save time and money',
      end: '.'
    },
    heroButton: 'Discuss your project',
    heroSecondary: 'View services',
    contactButton: 'Contact us',
    search: {
      label: 'Search',
      placeholder: 'Search for...',
      breadcrumb: 'Search',
      resultsTitle: 'Search results',
      loading: 'Searching results...',
      noResults: 'We are sorry, but nothing was found for your search terms. Please try again with different terms.',
      blogLink: 'Read  more news',
      latestTitle: 'Check out our latest news',
      readMore: 'Read more',
      contactTitle: "Didn't find the answer?",
      contactText: 'Send your question directly to us and we will look at how we can help.'
    },
    projectsTitle: 'Projects',
    projectIntro:
      'Examples of projects where simulations and digital models helped make more confident production decisions before expensive physical changes.',
    projectCardLabels: {
      solution: 'Solution',
      results: 'Outcomes'
    },
    projects: [
      {
        title: 'Plastics production',
        image: '/project-plastic.png',
        problem: 'The impact of new testing equipment on production had to be assessed before investment to avoid bottlenecks, downtime and later layout changes.',
        solution: 'Socket assembly, testing and packaging were modeled, and different production scenarios were simulated before equipment procurement.',
        results: [
          'Validated production capacity before equipment arrival',
          'Identified critical bottlenecks and cycle-time constraints',
          'Strong basis for RFQs to equipment suppliers',
          'Faster project startup and production planning',
          'Avoided costly changes after implementation'
        ]
      },
      {
        title: 'Heavy industry',
        image: '/project-heavy.png',
        problem: 'Replanning an 18,000 m² production facility required an accurate view of the existing environment and confidence that new equipment layouts would work before physical installation.',
        solution: 'The full factory was laser scanned, an accurate DWG base was created, and different layout and logistics scenarios were simulated.',
        results: [
          'Accurate digital basis for all engineering work',
          'Validated equipment layouts before investment',
          'Faster and more confident factory replanning',
          'Avoided logistics conflicts and space problems',
          'Strong technical overview of the full production environment'
        ]
      },
      {
        title: 'Food industry',
        image: '/project-food.png',
        imageOverlay: '/project-food2.png',
        problem: 'Waiting times, uneven flow and bottlenecks in the production process limited throughput and created an unstable production rhythm.',
        solution: 'The full production process was modeled, critical steps were analyzed, and different automation and process-balancing scenarios were tested.',
        results: [
          'Stable material flow across the full process',
          'Consistent production rhythm and controlled cycle times',
          'Defined buffer sizes for critical process steps',
          'Automated work steps to improve production efficiency',
          'Virtual environment for fast scenario testing'
        ]
      },
      {
        title: 'Warehouse logistics',
        image: '/project-logistics.png',
        problem: 'Material movement and internal logistics caused unnecessary transport, waiting times and uneven workload in the production process.',
        solution: 'AGV/AMR routes, operator workflows and material movement were simulated to achieve stable internal logistics without physical trial runs.',
        results: [
          'Optimized AGV/AMR movement paths',
          'Stable and smooth material flow across the full line',
          'Balanced workload for operators and warehouse workers',
          'Reduced unnecessary movement and waiting times',
          'Validated logistics before physical changes'
        ]
      },
      {
        title: 'Pellet factory',
        image: '/project-pellet.png',
        imageOverlays: ['/project-pellet2.png', '/project-pellet3.png'],
        problem: 'The factory lacked an up-to-date digital overview of the production environment, making future development and investment planning slow and risky.',
        solution: 'The entire pellet factory was laser scanned and modeled into a detailed digital model for production visualization, planning and data integration.',
        results: [
          'Accurate point cloud, models and drawings of the full factory environment',
          'Strong basis for planning future investments',
          'Visual overview of complex production processes',
          'Readiness for production data integration',
          'Digital platform for further optimization'
        ]
      }
    ],
    servicesTitle: 'Services',
    servicesIntro:
      'We validate production decisions before physical changes are made, giving layouts, investments and implementations a stronger basis.',
    servicesHero: {
      image: '/analysis1.png',
      imageAlt: 'AutoCAD drawing and 3D layout comparison with forklift maneuverability analysis'
    },
    servicesQuestions: [
      'How can I avoid costly planning mistakes?',
      'How can I increase line productivity?',
      'How can I reduce downtime?',
      'How can I justify an investment internally?'
    ],
    serviceCardLabels: {
      validation: 'What we validate',
      outcome: 'Outcome'
    },
    serviceCta: 'Discuss this project',
    services: [
      {
        title: 'Planning a new factory or production line',
        problem: 'A wrong investment decision can create costly rework and bottlenecks after startup.',
        solutionLead: 'We create a 3D simulation of production to test equipment layout, material flows, operator movement and production volumes.',
        solutionPoints: [
          'Equipment layout, material flows and operator movement',
          'Production volumes and cycle times',
          'Forklift and AGV movement paths, turning radii and required safety areas'
        ],
        impact: [
          'Helps achieve higher productivity from the start',
          'Reduces the risk of production downtime after layout changes',
          'Avoids later rework caused by lack of space'
        ],
        ctaPrompt: 'Planning a new line or factory expansion?'
      },
      {
        title: 'Increasing productivity in an existing factory or line',
        problem: 'Production does not reach the planned throughput, downtime becomes expensive and existing resources are not fully used.',
        solutionLead: 'We use simulation to find the real constraints and test improvements before changing production.',
        solutionPoints: [
          'Bottlenecks and workstation load',
          'Shift impact on throughput',
          'Logistics constraints',
          'Production-flow, workstation and logistics optimization'
        ],
        impact: [
          'More throughput from existing resources',
          'Shorter cycle times and less downtime',
          'Clear view of the actual production limits'
        ],
        ctaPrompt: 'Want to find the real production constraints?'
      },
      {
        title: 'Validating robots and automation before rollout',
        problem: 'Poorly implemented automation can cause production stoppages and expensive rework.',
        solutionLead: 'We virtually test robot reach, takt times, sequences and interaction with the rest of production.',
        solutionPoints: [
          'Robot reach and access',
          'Takt times and cycle sequencing',
          'Interaction with operators, equipment and logistics',
          'Validation of suitable automation concepts'
        ],
        impact: [
          'Testing without stopping production',
          'Lower risk of expensive changes after rollout',
          'Detailed input for system integrators',
          'Faster commissioning'
        ],
        ctaPrompt: 'Planning a new automation solution?'
      },
      {
        title: 'Factory digitalization',
        problem: 'Factory changes are slower and riskier when accurate drawings and technical overview are missing.',
        solutionLead: 'Using laser scanning, we create an accurate 3D model of the existing factory for future planning and engineering.',
        solutionPoints: [
          'Accurate capture of the existing facility',
          'Point cloud, 3D model and DWG planning base',
          'Technical overview for designers and integrators'
        ],
        impact: [
          'Faster project planning',
          'Fewer measurement and installation errors',
          'Better collaboration with designers and integrators',
          'Lower risk of production rework'
        ],
        ctaPrompt: 'Need an accurate overview of your factory?'
      },
      {
        title: 'Virtual commissioning',
        problem: 'System commissioning is one of the final stages in automation projects, yet this is where delays and rework most often appear due to control logic errors and unexpected process situations.',
        solutionLead: 'During virtual commissioning, we connect the real PLC and robot programs to the system’s virtual model, so the operation of the entire system can be tested before physical startup.',
        solutionPoints: [
          'Digital model connected to controller code and development environment',
          'Real-time validation of PLC signals, sensors and actuators',
          'Early testing of machine code and process sequences'
        ],
        impact: [
          'Shortens the commissioning stage, where changes are most expensive',
          'Reduces the risk of deploying control software with errors',
          'Improves software quality before it reaches production'
        ],
        ctaPrompt: 'Validate your system before startup',
        visual: {
          type: 'virtualCommissioning',
          simulationVideo: '/vc12.webm',
          logicVideo: '/vc11.webm',
          simulationLabel: 'Visual Components',
          simulationIcon: '/vcfavicon.png',
          logicLabel: 'Siemens PLC Simulation',
          logicIcon: '/siemensfavicon.png',
          inputSignal: 'di_sensor',
          outputSignal: 'do_motor'
        }
      }
    ],
    contactTitle: 'Let’s work together!',
    contactText: 'From early-stage concept to validated factory plan.',
    form: { name: 'Name', email: 'E-mail', description: 'Project description', send: 'Send' },
    aboutTitle: 'About',
    teamTitle: 'Team',
    team: [
      { name: 'Steven', role: 'CEO', credentials: 'Mechanical engineer (BSc)', image: '/team/steven.jpg', linkedin: 'https://www.linkedin.com/in/steven-strandberg/' },
      { name: 'Hans', role: 'Simulation engineer', credentials: 'Industrial engineering and management (MSc)', image: '/team/hans.jpg' },
      { name: 'Markus', role: 'Project engineer', credentials: 'Robotics and automation engineer (MSc)' }
    ],
    partnersTitle: 'Partners and network',
    reseller: 'Official reseller and integration partner',
    wheelmeText: 'Wheel.me is the world’s first autonomous wheel, which transforms any object into a mobile robot',
    wheelmePrompt: 'Find out how wheel.me’s solution fits into your business needs',
    wheelmeButton: 'Contact us',
    wheelmeLearnMore: 'Learn more',
    wheelmePage: {
      title: 'Wheel.me autonomous internal logistics',
      breadcrumb: 'Wheel.me',
      resellerText: 'Factory Simulation is the official Wheel.me reseller and integration partner in Estonia.',
      intro:
        'Wheel.me’s autonomous mobile robot solution makes it possible to turn existing carts, racks, workbenches and other internal logistics equipment into smart self-driving robots.',
      paragraphs: [
        'The system helps automate material transport in production and warehouses without complex conveyors or dedicated AMR carts.',
        'Wheel.me robots move autonomously in a pre-mapped environment, avoid obstacles and make it possible to create a flexible and scalable internal logistics solution. The system is designed for manufacturing companies that want to reduce manual transport, optimize workflows and improve material-flow stability.',
        'Combined with simulation and production analysis, Wheel.me helps validate the impact of autonomous internal logistics before making an investment.'
      ],
      benefitsTitle: 'The solution helps you',
      benefits: [
        'Automate existing carts and platforms',
        'Reduce time spent on manual transport',
        'Increase production-flow stability and throughput',
        'Quickly reconfigure logistics processes',
        'Test and scale the solution step by step'
      ],
      ctaTitle: 'Find out whether Wheel.me fits your production',
      ctaText: 'Let’s review your material flow, bottlenecks and the right scope for a pilot project.',
      ctaButton: 'Talk to a specialist',
      authorizedReseller: 'Authorized reseller',
      images: {
        hero: '/wheelme/wheelme_0792.jpg',
        detail: '/wheelme/_dsc3066.jpg',
        concept: '/wheelme/wheelme1.png',
        power: '/wheelme/power station close by.jpg'
      }
    },
    contacts: 'Contacts',
    blogTitle: 'News',
    breadcrumbHome: 'Home',
    breadcrumbBlog: 'News',
    blogIntro:
      'Short updates on simulations, production planning, partnerships and use cases where we have been involved.',
    blogPosts: [
      {
        title: 'Baltic CNC Technical Educators Conference 2026',
        category: 'Conference',
        date: '28.05',
        sortDate: '2026-05-28',
        image: '/blog/20260528.webp',
        lead:
          'We participated in the Baltic CNC Technical Educators Conference 2026, held at the Advanced Machining Technology Centre of Tallinn University of Applied Sciences.',
        body: [
          'The day included presentations, group discussions, workshops, and practical demonstrations on the future of education and industry.',
          'The programme covered several topics related to manufacturing and technology development:'
        ],
        items: [
          'CAM programming with the help of artificial intelligence – Venten OÜ',
          'Factory digitalisation and simulation – Factory Simulation OÜ',
          'Vibration-damping tools in CNC machines – Sandvik and Alas-Kuul AS',
          'Digitalisation of measurement result data – Mitutoyo and Venten OÜ'
        ],
        afterItems: [
          'Our topic focused on different aspects of factory digitalisation, with a deeper focus on production process design through simulation.',
          'We shared practical examples of how simulation can support better production decisions — for example, how even forklift travel speed can affect productivity, material flow, and the overall performance of a production process. We also presented real-life examples of how a digital model can be used to compare different solutions before making physical changes in the factory.'
        ]
      },
      {
        title: 'Joint company visit to Central Estonian enterprises',
        category: 'Company visit',
        date: '21.05–22.05',
        sortDate: '2026-05-22',
        image: '/blog/20260522.webp',
        lead:
          'Joint company visit to Central Estonian enterprises organised by the Estonian Machinery Industry Association.',
        body: [
          'The Estonian Machinery Industry Association organised a factory visit for its members in Central Estonia, where we had the opportunity to take a closer look at different production processes, product development activities and daily factory operations.',
          'In total, we visited four companies and gained a very good overview of the region’s industrial companies, their activities, challenges and development directions:'
        ],
        items: ['TB Works OÜ', 'PMT OÜ', 'Nuia PMT OÜ', 'Cleveron AS'],
        afterItems: [
          'Such visits provide a valuable opportunity to see how different manufacturing companies develop their processes and what solutions are used to improve efficiency.'
        ]
      },
      {
        title: 'Industry 5.0 Conference 2026',
        category: 'Conference',
        date: '14.05',
        sortDate: '2026-05-14',
        image: '/blog/20260514.webp',
        lead: 'This year, we participated in the Industry 5.0 conference with our own stand.',
        body: [
          'The conference focused on the future competitiveness of Estonian industry, with key topics including industrial innovation, sustainability, applied research, automation, robotics, digitalisation, cybersecurity and practical technology adoption in manufacturing.',
          'For us, many discussions came back to one practical question: how can manufacturers digitalise and improve the production process itself — not only through software, but through simulations, data-driven planning and faster testing of different scenarios before making real-world changes?',
          'Of course, we also brought out our wheel.me robot to showcase a simple and practical example of flexible automation — an autonomous garbage robot moving through the exhibition area.'
        ]
      },
      {
        title: 'Industrial robot programming and machine vision training',
        category: 'Training',
        date: '19.02 · 26.02 · 05.03 · 12.04',
        sortDate: '2026-04-12',
        image: '/blog/news1.jpg',
        excerpt:
          'We completed a practical training program covering industrial robot programming (offline and online) and the application of machine vision solutions in production. The training focused on robot programming and the use of vision systems in automated production processes.'
      },
      {
        title: 'Smart Industry Conference 2026',
        category: 'Conference',
        date: '19.03',
        sortDate: '2026-03-19',
        image: '/blog/news2.png',
        excerpt:
          'We attended the Smart Industry conference, where industrial digitalization, automation and future solutions were discussed. The event also included the announcement of “Factory of the Year 2026”.'
      },
      {
        title: 'wheel.me factory visit and training in Norway',
        category: 'Partnership',
        date: '06.04 – 07.04',
        sortDate: '2026-04-07',
        image: '/blog/news3.jpeg',
        excerpt:
          'We visited wheel.me’s production facility in Norway and took part in technical training on autonomous mobile robot solutions. The visit covered practical use cases, configuration and different industrial applications.'
      },
      {
        title: 'Finnish–Estonian machinery industry seminar',
        category: 'Seminar',
        date: '22.04',
        sortDate: '2026-04-22',
        image: '/blog/news4.jpeg',
        excerpt:
          'We participated in a machinery industry seminar and networking event held as part of the Finnish and Estonian Sheet Metal Days. The day focused on cooperation opportunities, industry development trends and practical production experience.'
      },
      {
        title: '90th anniversary event of the Federation of Estonian Engineering Industry',
        category: 'Network',
        date: '06.05',
        sortDate: '2026-05-06',
        image: '/blog/news5.jpg',
        excerpt:
          'We attended the 90th anniversary event of the Federation of Estonian Engineering Industry, bringing together EML members, partners and industry representatives. The event focused on sector development and cooperation.'
      }
    ]
  }
};

const anchors = ['services', 'projects', 'about', 'blog', 'wheelme'];
const languages = ['et', 'en'];
const languagePreferenceKey = 'factorySimulationLanguage';

const getPathWithoutBase = () => {
  const { pathname } = window.location;

  if (!basePathPrefix) {
    return pathname;
  }

  if (pathname === basePathPrefix) {
    return '/';
  }

  return pathname.startsWith(`${basePathPrefix}/`) ? pathname.slice(basePathPrefix.length) : pathname;
};

const getLanguageFromPath = () => {
  const language = getPathWithoutBase().split('/').filter(Boolean)[0];

  if (languages.includes(language)) {
    return language;
  }

  const storedLanguage = window.localStorage?.getItem(languagePreferenceKey);

  if (languages.includes(storedLanguage)) {
    return storedLanguage;
  }

  return navigator.language?.toLowerCase().startsWith('et') ? 'et' : 'en';
};

const getRouteFromPath = () => {
  const page = getPathWithoutBase().split('/').filter(Boolean)[1];
  return ['blog', 'wheelme'].includes(page) ? page : 'home';
};

const getSearchQuery = () => new URLSearchParams(window.location.search).get('q')?.trim() || '';

const getPagePath = (language, page = 'home', hash = '') => {
  const pagePath = page === 'blog' || page === 'wheelme' ? `${page}/` : '';
  return `${basePath}${language}/${pagePath}${hash || ''}`;
};

const getSearchPath = (language, query) => `${getPagePath(language)}?q=${encodeURIComponent(query.trim())}`;

const getLanguagePath = (language, hash = window.location.hash) => getPagePath(language, 'home', hash);
const partners = [
  { name: 'EML', logo: '/logo-partner-eml.png' },
  { name: 'AI & Robotics Estonia', logo: '/logo-partner-aire.jpg', bare: true, large: true },
  { name: 'TalTech', logo: '/logo-partner-taltech.png', bare: true },
  { name: 'Flowit', logo: '/logo-partner-flowit.png' },
  { name: 'CADRäk', logo: '/logo-partner-cadrak.svg', href: 'https://www.cadrak.com/en' }
];

function IconList({ items, itemClassName = liClass, iconClassName = 'bg-fs-accent' }) {
  return (
    <ul className="m-0 grid list-none gap-3.5 p-0">
      {items.map((item) => (
        <li className={`grid grid-cols-[1.35rem_1fr] gap-3 ${itemClassName}`} key={item}>
          <span className={`mt-0.5 size-5 ${iconClassName}`} style={iconMask} aria-hidden="true" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function ProjectCase({ project, labels, index, onOpenImage }) {
  const imageFirst = index % 2 === 0;

  return (
    <article className="grid gap-8 border-t border-fs-line/70 bg-fs-panel/58 p-6 sm:p-8 lg:grid-cols-[minmax(320px,0.78fr)_minmax(0,1fr)] lg:gap-12 lg:p-10">
      <div className={imageFirst ? '' : 'lg:order-2'}>
        <ProjectImage project={project} onOpenImage={onOpenImage} />
      </div>
      <div className="grid content-start gap-8">
        <div>
          <p className="mb-5 text-base font-bold text-fs-accent">0{index + 1}</p>
          <h3 className="m-0 max-w-3xl text-[clamp(1.65rem,2.3vw,2.55rem)] leading-tight font-bold text-white">{project.title}</h3>
        </div>

        <div className="grid gap-7">
          <p className="m-0 text-[clamp(1.02rem,1.25vw,1.16rem)] leading-relaxed text-white/82">{project.problem}</p>
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-fs-accent">{labels.solution}</p>
            <p className="m-0 text-[clamp(1.02rem,1.25vw,1.16rem)] leading-relaxed text-white/82">{project.solution}</p>
          </div>
        </div>

        <div className="border border-fs-result/55 bg-black/24 p-6">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-fs-result">{labels.results}</p>
          <IconList items={project.results} itemClassName="mb-0 text-base leading-relaxed text-white/84" iconClassName="bg-fs-result" />
        </div>
      </div>
    </article>
  );
}

function ServiceCase({ service, labels, cta, index, id, refCallback, onContactClick }) {
  const validationPoints = service.solutionPoints.slice(0, 3);
  const outcomePoints = service.impact.slice(0, 3);
  const hasVisual = service.visual?.type === 'virtualCommissioning';
  const stepLabelClass = 'mb-3 text-xs font-bold uppercase tracking-[0.18em] text-fs-accent';
  const bodyClass = 'text-[clamp(1.02rem,1.25vw,1.16rem)] leading-relaxed text-white/82';

  return (
    <article id={id} ref={refCallback} className="scroll-mt-28 border-t border-fs-line/65 bg-fs-panel/78 p-6 sm:p-9 lg:p-12">
      <div className={hasVisual ? 'grid gap-10 xl:grid-cols-[minmax(0,0.95fr)_minmax(320px,0.72fr)] xl:items-start' : 'grid gap-8'}>
        <div className="grid gap-8">
          <div>
            <p className="mb-5 text-base font-bold text-fs-accent">0{index + 1}</p>
            <h3 className="m-0 max-w-3xl text-[clamp(1.7rem,2.3vw,2.55rem)] leading-tight font-bold text-white">{service.title}</h3>
          </div>

          <div className="max-w-3xl">
            <p className={`m-0 ${bodyClass}`}>{service.problem}</p>
          </div>

          <div className="max-w-3xl">
            <p className={stepLabelClass}>{labels.validation}</p>
            <p className={`mb-6 ${bodyClass}`}>{service.solutionLead}</p>
            <IconList items={validationPoints} itemClassName="mb-0 text-base leading-relaxed text-white/74" />
          </div>

          <div className="w-full border border-fs-result/55 bg-black/24 p-6 lg:p-7">
            <div className="max-w-3xl">
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-fs-result">{labels.outcome}</p>
              <IconList items={outcomePoints} itemClassName="mb-0 text-base leading-relaxed text-white/84" iconClassName="bg-fs-result" />
            </div>
            <div className="mt-7 flex flex-wrap items-center justify-between gap-4 border-t border-fs-result/30 pt-5">
              <p className="m-0 text-base leading-snug text-white/72">{service.ctaPrompt}</p>
              <a className="inline-flex min-h-11 w-fit items-center justify-center border border-fs-result/85 px-4 py-2.5 font-bold text-white no-underline transition hover:bg-fs-result hover:text-black" href="#contact" onClick={onContactClick}>
                {cta}
              </a>
            </div>
          </div>
        </div>

        {hasVisual && <VirtualCommissioningVisual visual={service.visual} />}
      </div>
    </article>
  );
}

function VirtualCommissioningVisual({ visual }) {
  return (
    <div className="vc-visual mx-auto grid w-full max-w-xl select-none gap-4">
      <VcProgramWindow title={visual.simulationLabel} icon={visual.simulationIcon}>
        <video className="block aspect-[4/3] w-full bg-black object-contain object-center" src={assetPath(visual.simulationVideo)} autoPlay muted loop playsInline draggable="false" />
      </VcProgramWindow>

      <div className="relative h-24 sm:h-28" aria-hidden="true">
        <div className="vc-signal vc-signal-up left-[24%]">
          <span className="vc-signal-label -left-3 sm:-left-8">{visual.outputSignal}</span>
        </div>
        <div className="vc-signal vc-signal-down right-[28%]">
          <span className="vc-signal-label -right-3 sm:-right-8">{visual.inputSignal}</span>
        </div>
      </div>

      <VcProgramWindow title={visual.logicLabel} icon={visual.logicIcon}>
        <video className="block aspect-[4/3] w-full bg-black object-contain object-center" src={assetPath(visual.logicVideo)} autoPlay muted loop playsInline draggable="false" />
      </VcProgramWindow>
    </div>
  );
}

function VcProgramWindow({ title, icon, children }) {
  return (
    <div className="overflow-hidden rounded-md border border-white/14 bg-[#17191d] shadow-2xl shadow-black/35 ring-1 ring-white/8">
      <div className="flex h-8 items-center justify-between border-b border-white/10 bg-[#202329]/95 px-2.5 text-[0.72rem] font-semibold leading-none text-white/76 backdrop-blur">
        <div className="flex min-w-0 items-center gap-1.5">
          {icon ? (
            <img className="size-4 shrink-0 rounded-[3px]" src={assetPath(icon)} alt="" aria-hidden="true" draggable="false" />
          ) : (
            <span className="grid size-4 shrink-0 place-items-center rounded-[3px] bg-[linear-gradient(135deg,#e2ab19_0%,#ffd861_100%)] shadow-sm" aria-hidden="true">
              <span className="block size-1.5 rounded-[1px] bg-black/68" />
            </span>
          )}
          <span className="truncate">{title}</span>
        </div>
        <div className="flex h-full shrink-0 items-center text-white/52" aria-hidden="true">
          <span className="grid h-full w-8 place-items-center text-[0.72rem] transition">−</span>
          <span className="grid h-full w-8 place-items-center text-[0.56rem] transition">□</span>
          <span className="grid h-full w-8 place-items-center text-[0.72rem] transition">×</span>
        </div>
      </div>
      <div className="bg-black">
        {children}
      </div>
    </div>
  );
}

function ServicesSection({ t, onContactClick }) {
  const [activeService, setActiveService] = useState(0);
  const serviceRefs = useRef([]);
  const serviceIds = useMemo(() => t.services.map((_, index) => `service-${index + 1}`), [t.services]);

  useEffect(() => {
    serviceRefs.current = serviceRefs.current.slice(0, t.services.length);
  }, [t.services.length]);

  useEffect(() => {
    const serviceNodes = serviceRefs.current.filter(Boolean);

    if (!serviceNodes.length || typeof IntersectionObserver === 'undefined') {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort((first, second) => second.intersectionRatio - first.intersectionRatio);

        if (visibleEntries[0]) {
          const nextIndex = serviceNodes.indexOf(visibleEntries[0].target);
          if (nextIndex >= 0) {
            setActiveService(nextIndex);
          }
        }
      },
      { rootMargin: '-34% 0px -46% 0px', threshold: [0.1, 0.35, 0.6] }
    );

    serviceNodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [t.services]);

  const handleServiceNavClick = (event, index) => {
    event.preventDefault();
    setActiveService(index);
    serviceRefs.current[index]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section className="pt-24 pb-20 lg:pt-32 lg:pb-36" id="services">
      <div className="mb-10 overflow-hidden border-t-4 border-fs-accent bg-fs-panel">
        <div className="relative aspect-[16/9] min-h-[640px] lg:aspect-[16/8.5] lg:min-h-[720px]">
          <img className="absolute inset-0 h-full w-full object-cover object-center" src={assetPath(t.servicesHero.image)} alt={t.servicesHero.imageAlt} />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.08)_0%,rgba(0,0,0,0.24)_42%,rgba(0,0,0,0.82)_78%,#000_100%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.78)_0%,rgba(0,0,0,0.42)_42%,rgba(0,0,0,0.1)_100%)]" />
          <div className="relative z-10 grid h-full content-end gap-8 px-5 py-10 sm:px-8 lg:px-[10vw] lg:py-12">
            <div>
              <h2 className={`${h2Class} mb-6`}>{t.servicesTitle}</h2>
              <p className="max-w-2xl text-[clamp(1.08rem,1.6vw,1.35rem)] leading-relaxed text-white/82">{t.servicesIntro}</p>
              <div className="mt-8 max-w-2xl">
                <div className="grid gap-3">
                  {t.servicesQuestions.map((question, index) => (
                    <div className="flex max-w-full items-start gap-4" key={question}>
                      <span className="mt-0.5 text-base font-bold text-fs-accent">{index + 1}</span>
                      <p className="m-0 text-[clamp(1.05rem,1.45vw,1.25rem)] leading-snug text-white/90">{question}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-10 px-5 sm:px-8 lg:grid-cols-[minmax(12rem,0.32fr)_minmax(0,1fr)] lg:items-start lg:gap-12 lg:px-[10vw] xl:grid-cols-[minmax(15rem,0.3fr)_minmax(0,1fr)]">
        <aside className="lg:sticky lg:top-28 lg:self-start" aria-label={t.servicesTitle}>
          <nav className="border-l border-white/12 pl-4 lg:pl-5">
            <ol className="m-0 grid list-none gap-1 p-0">
              {t.services.map((service, index) => {
                const isActive = activeService === index;

                return (
                  <li key={service.title}>
                    <a
                      className={`group grid grid-cols-[2.25rem_1fr] items-start gap-3 py-3 text-sm leading-snug no-underline transition ${
                        isActive ? 'text-white' : 'text-white/42 hover:text-white/70'
                      }`}
                      href={`#${serviceIds[index]}`}
                      aria-current={isActive ? 'true' : undefined}
                      onClick={(event) => handleServiceNavClick(event, index)}
                    >
                      <span className={`pt-0.5 font-bold transition ${isActive ? 'text-fs-accent' : 'text-white/28 group-hover:text-white/45'}`}>0{index + 1}</span>
                      <span className={isActive ? 'font-bold' : ''}>{service.title}</span>
                    </a>
                  </li>
                );
              })}
            </ol>
          </nav>
        </aside>

        <div className="grid gap-10 lg:gap-14">
          {t.services.map((service, index) => (
            <ServiceCase
              service={service}
              labels={t.serviceCardLabels}
              cta={t.serviceCta}
              index={index}
              id={serviceIds[index]}
              refCallback={(node) => {
                serviceRefs.current[index] = node;
              }}
              onContactClick={onContactClick}
              key={service.title}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function PersonIcon() {
  return (
    <svg className="size-6" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 12.2a3.6 3.6 0 1 0 0-7.2 3.6 3.6 0 0 0 0 7.2Z" fill="currentColor" />
      <path d="M5.2 20c.8-3.5 3.1-5.3 6.8-5.3s6 1.8 6.8 5.3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function LinkedinIcon() {
  return (
    <svg className="size-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M6.9 8.8H3.5v11h3.4v-11ZM5.2 7.3c1.1 0 1.8-.7 1.8-1.7S6.3 4 5.2 4s-1.8.7-1.8 1.7.7 1.6 1.8 1.6ZM20.5 13.5c0-3.3-1.8-4.9-4.1-4.9-1.9 0-2.8 1-3.2 1.8V8.8H9.8v11h3.4v-6.1c0-1.6.3-3.1 2.2-3.1 1.8 0 1.8 1.7 1.8 3.2v6h3.4v-6.3Z" />
    </svg>
  );
}

function ProjectImage({ project, onOpenImage }) {
  const overlays = project.imageOverlays || (project.imageOverlay ? [project.imageOverlay] : []);

  return (
    <div className="relative w-full">
      <button className="block w-full cursor-zoom-in border-0 bg-transparent p-0" type="button" onClick={() => onOpenImage(project.image)}>
        <img className="aspect-[4/5] max-h-[34rem] w-full object-cover sm:max-h-[42rem] lg:min-h-[620px] lg:max-h-none xl:aspect-[3/4] xl:min-h-[720px]" src={assetPath(project.image)} alt="" />
        <span className="absolute right-2 bottom-2 grid size-8 place-items-center text-black drop-shadow-[0_1px_2px_rgba(255,255,255,0.65)]" aria-hidden="true">
          <svg className="size-4.5" viewBox="0 0 24 24" fill="none">
            <path d="m20 20-4.2-4.2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <circle cx="10.8" cy="10.8" r="5.8" stroke="currentColor" strokeWidth="2" />
          </svg>
        </span>
      </button>
      {overlays.map((image, overlayIndex) => (
        <button
          className={`absolute w-2/3 cursor-zoom-in border-0 bg-transparent p-0 shadow-2xl sm:w-3/4 ${
            overlayIndex === 0 ? '-top-3 -right-2 sm:-top-6 sm:-right-5 lg:-top-8 lg:-right-8' : '-right-2 -bottom-3 sm:-right-5 sm:-bottom-6 lg:-right-8 lg:-bottom-8'
          }`}
          type="button"
          onClick={() => onOpenImage(image)}
          key={image}
        >
          <img className="w-full object-cover" src={assetPath(image)} alt="" />
        </button>
      ))}
    </div>
  );
}

function ImageLightbox({ image, onClose }) {
  useEffect(() => {
    if (!image) {
      return undefined;
    }

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [image, onClose]);

  if (!image) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/90 p-4" role="dialog" aria-modal="true" onClick={onClose}>
      <button className="absolute top-3 right-6 grid size-11 place-items-center border border-white/40 bg-black/60 text-3xl leading-none text-white" type="button" aria-label="Close image" onClick={onClose}>
        ×
      </button>
      <img className="max-h-[92vh] max-w-[92vw] object-contain" src={assetPath(image)} alt="" onClick={(event) => event.stopPropagation()} />
    </div>
  );
}

function SearchIcon({ className = 'size-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="m20 20-4.2-4.2" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="10.8" cy="10.8" r="5.8" stroke="currentColor" strokeWidth="2.4" />
    </svg>
  );
}

function HeaderSearch({ label, placeholder, initialValue = '', onSearch, onOpenChange, alwaysOpen = false, keepOpenWithValue = false }) {
  const [open, setOpen] = useState(alwaysOpen || (keepOpenWithValue && Boolean(initialValue)));
  const [value, setValue] = useState(initialValue);
  const inputRef = useRef(null);
  const formRef = useRef(null);

  useEffect(() => {
    setValue(initialValue);
    setOpen(alwaysOpen || (keepOpenWithValue && Boolean(initialValue)));
  }, [alwaysOpen, initialValue, keepOpenWithValue]);

  useEffect(() => {
    onOpenChange?.(open);
  }, [onOpenChange, open]);

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
    }
  }, [open]);

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const closeSearch = () => {
      if (!alwaysOpen) {
        setOpen(false);
      }
    };

    const onPointerDown = (event) => {
      if (!formRef.current?.contains(event.target)) {
        closeSearch();
      }
    };

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        closeSearch();
      }
    };

    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [alwaysOpen, open]);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!open && !alwaysOpen) {
      setOpen(true);
      return;
    }

    onSearch(value);
    if (!alwaysOpen) {
      setOpen(false);
    }
  };

  return (
    <form
      ref={formRef}
      className={`flex min-h-11 items-center overflow-hidden border border-fs-accent/70 transition-[max-width,border-color] duration-200 ease-out lg:min-h-10 ${
        alwaysOpen ? 'w-full max-w-full' : open ? 'w-full max-w-full lg:max-w-[min(42rem,58vw)]' : 'w-10 max-w-10'
      }`}
      role="search"
      onSubmit={handleSubmit}
    >
      {(open || alwaysOpen) && (
        <input
          ref={inputRef}
          className="min-w-0 flex-1 border-0 bg-transparent px-3 py-2 text-sm normal-case text-white outline-none placeholder:text-white/45"
          type="search"
          name="q"
          value={value}
          placeholder={placeholder}
          aria-label={label}
          onChange={(event) => setValue(event.target.value)}
        />
      )}
      <button className="grid size-10 shrink-0 place-items-center text-fs-accent transition hover:bg-fs-accent hover:text-black" type="submit" aria-label={label} title={label}>
        <SearchIcon />
      </button>
    </form>
  );
}

function SearchPage({ t, language, query, onContactSubmit }) {
  const [loading, setLoading] = useState(true);
  const latestPosts = useMemo(() => [...t.blogPosts].sort((first, second) => second.sortDate.localeCompare(first.sortDate)).slice(0, 2), [t.blogPosts]);

  useEffect(() => {
    setLoading(true);
    const delay = 1000 + Math.floor(Math.random() * 1000);
    const timer = window.setTimeout(() => setLoading(false), delay);

    return () => window.clearTimeout(timer);
  }, [query]);

  return (
    <section className={`${sectionClass} min-h-[calc(100vh-5rem)]`}>
      <nav className="mb-5 flex items-center gap-2 text-sm font-bold text-white/45" aria-label="Breadcrumb">
        <a className="text-white/55 no-underline transition hover:text-fs-accent" href={getPagePath(language)}>
          {t.breadcrumbHome}
        </a>
        <span className="text-fs-accent" aria-hidden="true">
          /
        </span>
        <span className="text-fs-accent">{t.search.breadcrumb}</span>
      </nav>
      <h1 className="mb-8 min-w-0 text-[clamp(2rem,4.6vw,4.2rem)] leading-none font-normal">
        {t.search.resultsTitle}:{' '}
        <span className="inline-block max-w-full overflow-hidden text-ellipsis whitespace-nowrap align-bottom">{query}</span>
      </h1>
      {loading ? (
        <div className="flex min-h-36 items-center gap-4 border-y border-fs-line py-8">
          <span className="size-8 animate-spin rounded-full border-3 border-fs-accent/25 border-t-fs-accent" aria-hidden="true" />
          <p className="m-0 text-[clamp(1.15rem,1.8vw,1.55rem)] leading-snug text-white">{t.search.loading}</p>
        </div>
      ) : (
        <>
          <div className="flex min-h-64 items-center border-y border-fs-line py-12 sm:py-16">
            <p className="m-0 max-w-5xl text-[clamp(1.15rem,1.8vw,1.55rem)] leading-snug text-white">{t.search.noResults}</p>
          </div>
          <section className="mt-16">
            <h2 className="mb-5 text-[clamp(1.45rem,2.4vw,2.4rem)] leading-tight font-bold">{t.search.latestTitle}</h2>
            <div className="grid gap-4 md:grid-cols-3">
                {latestPosts.map((post) => (
                  <article className="grid overflow-hidden bg-white text-black md:grid-rows-[11rem_1fr]" key={post.title}>
                    <img className="h-44 w-full object-cover md:h-full" src={assetPath(post.image)} alt="" />
                    <div className="flex min-h-52 flex-col justify-between p-5">
                      <div>
                        <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-fs-accent">{post.category} · {post.date}</p>
                        <h3 className="mb-3 text-lg leading-tight font-bold text-fs-panel">{post.title}</h3>
                        <p className="line-clamp-3 text-sm leading-snug text-fs-panel/72">{post.excerpt}</p>
                      </div>
                      <a className="mt-5 w-fit font-bold text-fs-panel no-underline transition hover:text-fs-accent" href={getPagePath(language, 'blog')}>
                        {t.search.readMore}
                      </a>
                    </div>
                  </article>
                ))}
              <a className="flex min-h-72 flex-col justify-between border-t-4 border-fs-accent bg-fs-panel p-6 text-white no-underline transition hover:bg-fs-accent hover:text-black" href={getPagePath(language, 'blog')}>
                <span className="text-sm font-bold uppercase tracking-[0.16em] opacity-70">{t.blogTitle}</span>
                <span className="text-[clamp(1.45rem,2.4vw,2.2rem)] leading-tight font-bold">{t.search.blogLink}</span>
              </a>
            </div>
          </section>
          <section className="mt-16 border-t border-fs-line pt-10">
            <div className="grid gap-8 lg:grid-cols-[minmax(260px,0.8fr)_minmax(320px,560px)] lg:gap-[8vw]">
              <div>
                <h2 className="mb-3 text-[clamp(1.8rem,3.2vw,3.6rem)] leading-tight font-normal">{t.search.contactTitle}</h2>
                <p className="text-[clamp(1.1rem,1.7vw,1.45rem)] leading-snug text-white/74">{t.search.contactText}</p>
              </div>
              <form className="grid gap-4" onSubmit={onContactSubmit}>
                <label className="grid gap-2 text-sm font-bold text-white/82">
                  {t.form.name}
                  <input className="w-full border-0 bg-white px-3.5 py-3 font-sans font-normal text-black" name="name" autoComplete="name" required />
                </label>
                <label className="grid gap-2 text-sm font-bold text-white/82">
                  {t.form.email}
                  <input className="w-full border-0 bg-white px-3.5 py-3 font-sans font-normal text-black" type="email" name="email" autoComplete="email" required />
                </label>
                <label className="grid gap-2 text-sm font-bold text-white/82">
                  {t.form.description}
                  <textarea className="w-full border-0 bg-white px-3.5 py-3 font-sans font-normal text-black" name="description" rows="5" required />
                </label>
                <button className="min-h-12 w-28 cursor-pointer border-0 bg-fs-accent font-bold text-black transition hover:bg-white" type="submit">{t.form.send}</button>
              </form>
            </div>
          </section>
        </>
      )}
    </section>
  );
}

function BlogPage({ t, language }) {
  return (
    <section className={`${sectionClass} min-h-[calc(100vh-5rem)]`}>
      <div className="mb-14 max-w-4xl">
        <nav className="mb-5 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.14em] text-white/45" aria-label="Breadcrumb">
          <a className="text-white/55 no-underline transition hover:text-fs-accent" href={getPagePath(language, 'home')}>
            {t.breadcrumbHome}
          </a>
          <span className="text-fs-accent" aria-hidden="true">
            /
          </span>
          <span className="text-fs-accent">{t.breadcrumbBlog}</span>
        </nav>
        <h1 className={h2Class}>{t.blogTitle}</h1>
        <p className="max-w-3xl text-[clamp(1.05rem,1.7vw,1.35rem)] leading-relaxed text-white/72">{t.blogIntro}</p>
      </div>

      <div className="grid gap-8 xl:grid-cols-2">
        {[...t.blogPosts].sort((first, second) => second.sortDate.localeCompare(first.sortDate)).map((post, index) => (
          <article
            className="grid overflow-hidden bg-white text-black shadow-2xl shadow-black/25 md:grid-cols-[0.95fr_minmax(0,1.05fr)]"
            key={post.title}
          >
            <div className="flex min-h-80 flex-col justify-between p-7 sm:p-9">
              <div>
                <div className="mb-6 grid gap-1 text-xs font-bold uppercase tracking-[0.18em]">
                  <p className="m-0 text-fs-accent">{post.category}</p>
                  <p className="m-0 text-fs-panel/45">{post.date}</p>
                </div>
                <h2 className="mb-6 text-[clamp(1.25rem,2vw,1.85rem)] leading-tight font-bold text-fs-panel">{post.title}</h2>
                <div className="grid gap-4 text-base leading-relaxed text-fs-panel/78">
                  {post.lead && <p className="m-0 font-bold text-fs-panel">{post.lead}</p>}
                  {(post.body || [post.excerpt]).map((paragraph) => (
                    <p className="m-0" key={paragraph}>{paragraph}</p>
                  ))}
                  {post.items && (
                    <ul className="m-0 grid gap-2 pl-5">
                      {post.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  )}
                  {post.afterItems?.map((paragraph) => (
                    <p className="m-0" key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </div>
              <p className="mt-10 text-sm font-bold text-fs-panel/45">0{index + 1}</p>
            </div>
            <img className="block h-full min-h-72 w-full object-cover" src={assetPath(post.image)} alt="" />
          </article>
        ))}
      </div>
    </section>
  );
}

function InstagramIcon() {
  return (
    <svg className="size-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="4" y="4" width="16" height="16" rx="4" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="12" r="3.5" stroke="currentColor" strokeWidth="2" />
      <circle cx="16.8" cy="7.2" r="1" fill="currentColor" />
    </svg>
  );
}

function TiktokIcon() {
  return (
    <svg className="size-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M15.8 3c.4 2.6 1.8 4.2 4.2 4.5v3.3a7.7 7.7 0 0 1-4.2-1.3v5.9c0 3.2-2.2 5.6-5.5 5.6A5.3 5.3 0 0 1 5 15.7c0-3.4 2.8-5.8 6.2-5.3v3.4c-1.4-.4-2.8.4-2.8 1.9a1.9 1.9 0 0 0 2 1.9c1.2 0 2.1-.8 2.1-2.3V3h3.3Z" />
    </svg>
  );
}

const socialLinks = [
  { name: 'LinkedIn', href: 'https://www.linkedin.com/company/factory-simulation/', Icon: LinkedinIcon },
  { name: 'Instagram', href: 'https://www.instagram.com/factorysimulation', Icon: InstagramIcon },
  { name: 'TikTok', href: 'https://www.tiktok.com/@factorysimulation', Icon: TiktokIcon }
];

function ZoomImage({ src, className = '', imageClassName = '', onOpenImage }) {
  return (
    <button className={`relative block cursor-zoom-in border-0 bg-transparent p-0 ${className}`} type="button" onClick={() => onOpenImage(src)}>
      <img className={imageClassName} src={assetPath(src)} alt="" />
      <span className="absolute right-2 bottom-2 grid size-8 place-items-center text-black drop-shadow-[0_1px_2px_rgba(255,255,255,0.65)]" aria-hidden="true">
        <svg className="size-4.5" viewBox="0 0 24 24" fill="none">
          <path d="m20 20-4.2-4.2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <circle cx="10.8" cy="10.8" r="5.8" stroke="currentColor" strokeWidth="2" />
        </svg>
      </span>
    </button>
  );
}

function WheelmePage({ t, language, onContactClick, onOpenImage }) {
  return (
    <>
      <section className={`${sectionClass} pb-12 lg:pb-20`}>
        <nav className="mb-5 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.14em] text-white/45" aria-label="Breadcrumb">
          <a className="text-white/55 no-underline transition hover:text-fs-accent" href={getPagePath(language, 'home')}>
            {t.breadcrumbHome}
          </a>
          <span className="text-fs-accent" aria-hidden="true">
            /
          </span>
          <span className="text-fs-accent">{t.wheelmePage.breadcrumb}</span>
        </nav>

        <div className="grid items-start gap-10 xl:grid-cols-[minmax(0,1fr)_minmax(340px,42vw)] xl:gap-[6vw]">
          <div className="min-w-0">
            <h1 className="mb-7 text-[clamp(2.8rem,5.4vw,5.8rem)] leading-none font-normal">{t.wheelmePage.title}</h1>
            <p className="mb-8 text-[clamp(1.15rem,1.75vw,1.55rem)] leading-relaxed text-white/78">{t.wheelmePage.intro}</p>
            <p className="mb-6 max-w-2xl text-[clamp(1.15rem,1.75vw,1.55rem)] leading-relaxed text-white/78">{t.wheelmePage.resellerText}</p>
            <div className="flex flex-wrap items-center gap-4">
              <a className="inline-flex min-h-12 items-center justify-center border border-fs-accent bg-fs-accent px-5 py-3 font-bold text-black no-underline transition hover:bg-white" href={getPagePath(language, 'home', '#contact')} onClick={onContactClick}>
                {t.wheelmePage.ctaButton}
              </a>
              <div className="inline-flex min-h-12 items-center gap-3 border border-white/18 bg-black/50 px-4 py-2">
                <img className="h-5 w-auto" src={assetPath('/wheelme/wheel.me_logo_white.png')} alt="wheel.me" />
                <span className="text-xs font-bold uppercase tracking-[0.14em] text-white/68">{t.wheelmePage.authorizedReseller}</span>
              </div>
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-xl xl:max-w-none">
            <img className="aspect-[4/5] max-h-[72vh] w-full object-cover shadow-2xl shadow-black/35 xl:aspect-[5/6]" src={assetPath(t.wheelmePage.images.hero)} alt="" />
          </div>
        </div>
      </section>

      <section className="px-5 pb-20 sm:px-8 lg:px-[10vw] lg:pb-32">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(320px,0.72fr)] lg:gap-[7vw]">
          <div className="grid gap-6 text-[clamp(1.05rem,1.45vw,1.28rem)] leading-relaxed text-white/78">
            {t.wheelmePage.paragraphs.map((paragraph) => (
              <p className="m-0" key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <div className="border-t-4 border-fs-accent bg-fs-panel p-7">
            <h2 className="mb-6 text-[clamp(1.5rem,2.3vw,2.25rem)] leading-tight font-bold">{t.wheelmePage.benefitsTitle}</h2>
            <IconList items={t.wheelmePage.benefits} itemClassName="mb-1 text-base leading-snug text-white/82" />
          </div>
        </div>

        <div className="mt-14 grid max-w-5xl gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[t.wheelmePage.images.detail, t.wheelmePage.images.concept, t.wheelmePage.images.power].map((image) => (
            <ZoomImage
              className="w-full"
              imageClassName={`aspect-[4/3] max-h-72 w-full object-cover ${image === t.wheelmePage.images.concept ? 'object-bottom' : ''}`}
              src={image}
              onOpenImage={onOpenImage}
              key={image}
            />
          ))}
        </div>
      </section>

      <section className="bg-fs-accent px-5 py-16 text-black sm:px-8 lg:px-[10vw] lg:py-24">
        <div className="flex flex-col items-start gap-8 lg:grid-cols-[1fr_auto]">
          <div>
            <h2 className="mb-4 text-[clamp(2.2rem,4vw,4.5rem)] leading-none font-normal max-w-4xl">{t.wheelmePage.ctaTitle}</h2>
            <p className="max-w-3xl text-[clamp(1.1rem,1.6vw,1.45rem)] leading-snug">{t.wheelmePage.ctaText}</p>
          </div>
          <div className="flex flex-wrap items-center gap-4 lg:justify-end">
            <a className="inline-flex min-h-14 items-center justify-center bg-black px-6 py-3 font-bold text-white no-underline" href={getPagePath(language, 'home', '#contact')} onClick={onContactClick}>
              {t.wheelmePage.ctaButton}
            </a>
            <div className="inline-flex min-h-14 items-center gap-3 border border-black/35 px-4 py-2">
              <img className="h-7 w-auto invert" src={assetPath('/wheelme/wheel.me_logo_white.png')} alt="wheel.me" />
              <span className="text-xs font-bold uppercase tracking-[0.14em] text-black/70">{t.wheelmePage.authorizedReseller}</span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function App() {
  const [language, setLanguage] = useState(getLanguageFromPath);
  const [route, setRoute] = useState(getRouteFromPath);
  const [searchQuery, setSearchQuery] = useState(getSearchQuery);
  const [menuOpen, setMenuOpen] = useState(false);
  const [desktopSearchOpen, setDesktopSearchOpen] = useState(Boolean(getSearchQuery()));
  const [lightboxImage, setLightboxImage] = useState(null);
  const contactNameRef = useRef(null);
  const t = content[language];
  const nextLanguage = language === 'et' ? 'en' : 'et';
  const navItems = useMemo(
    () =>
      t.nav.map((label, index) => {
        const anchor = anchors[index];
        return {
          label,
          anchor,
          href: anchor === 'blog' || anchor === 'wheelme' ? getPagePath(language, anchor) : getPagePath(language, 'home', `#${anchor}`)
        };
      }),
    [language, t]
  );

  useEffect(() => {
    if (!languages.includes(getPathWithoutBase().split('/').filter(Boolean)[0])) {
      window.history.replaceState(null, '', `${getLanguagePath(language, '')}${window.location.search}${window.location.hash}`);
    }

    const onPopState = () => {
      setLanguage(getLanguageFromPath());
      setRoute(getRouteFromPath());
      setSearchQuery(getSearchQuery());
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
    document.title =
      searchQuery
        ? language === 'et'
          ? `Otsingu tulemused: ${searchQuery} | Factory Simulation`
          : `Search results: ${searchQuery} | Factory Simulation`
        : route === 'wheelme'
        ? language === 'et'
          ? 'Wheel.me autonoomne siselogistika | Factory Simulation'
          : 'Wheel.me autonomous internal logistics | Factory Simulation'
        : route === 'blog'
        ? language === 'et'
          ? 'Uudised & blogi | Factory Simulation'
          : 'News & Blog | Factory Simulation'
        : language === 'et'
          ? 'Factory Simulation | Tootmise simulatsioonid ja tehase planeerimine'
          : 'Factory Simulation | Digital Twin Solutions';

    const description = document.querySelector('meta[name="description"]');
    if (description) {
      description.setAttribute(
        'content',
        searchQuery
          ? language === 'et'
            ? `Otsingu tulemused märksõnale ${searchQuery}.`
            : `Search results for ${searchQuery}.`
          : route === 'wheelme'
          ? language === 'et'
            ? 'Wheel.me autonoomne mobiilsete robotite lahendus tootmise ja lao siselogistika automatiseerimiseks.'
            : 'Wheel.me autonomous mobile robot solution for automating internal logistics in production and warehouses.'
          : route === 'blog'
          ? language === 'et'
            ? 'Factory Simulationi uudised, blogipostitused ja lood tootmise simulatsioonidest.'
            : 'Factory Simulation news, blog posts and stories about production simulation.'
          : language === 'et'
            ? 'Tootmise simuleerimine, tehase paigutuse planeerimine ja digitaalsed mudelid Eesti tööstusettevõtetele.'
            : 'Factory Simulation creates a dynamic view of production with simulations and digital models.'
      );
    }

    const origin = window.location.origin;
    const headLinks = [
      ['canonical', language, `${origin}${getPagePath(language, route)}`],
      ['alternate', 'et', `${origin}${getPagePath('et', route)}`],
      ['alternate', 'en', `${origin}${getPagePath('en', route)}`]
    ];

    document.querySelectorAll('link[data-language-link="true"]').forEach((link) => link.remove());
    headLinks.forEach(([rel, hrefLang, href]) => {
      const link = document.createElement('link');
      link.rel = rel;
      if (rel === 'alternate') {
        link.setAttribute('hreflang', hrefLang);
      }
      link.href = href;
      link.dataset.languageLink = 'true';
      document.head.appendChild(link);
    });
  }, [language, route, searchQuery]);

  const switchLanguage = () => {
    window.localStorage?.setItem(languagePreferenceKey, nextLanguage);
    setLanguage(nextLanguage);
    setMenuOpen(false);
    window.history.pushState(null, '', searchQuery ? getSearchPath(nextLanguage, searchQuery) : getPagePath(nextLanguage, route, route === 'home' ? window.location.hash : ''));
  };

  const focusContactForm = () => {
    window.setTimeout(() => contactNameRef.current?.focus({ preventScroll: true }), 450);
  };

  const navigateToHomeSection = (event, sectionId) => {
    event.preventDefault();
    setMenuOpen(false);
    setRoute('home');
    setSearchQuery('');
    window.history.pushState(null, '', getPagePath(language, 'home', `#${sectionId}`));
    window.setTimeout(() => {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
      if (sectionId === 'contact') {
        focusContactForm();
      }
    }, 0);
  };

  const navigateToContact = (event) => navigateToHomeSection(event, 'contact');

  useEffect(() => {
    const focusIfContactHash = () => {
      if (!searchQuery && route === 'home' && window.location.hash === '#contact') {
        focusContactForm();
      }
    };

    focusIfContactHash();
    window.addEventListener('hashchange', focusIfContactHash);
    return () => window.removeEventListener('hashchange', focusIfContactHash);
  }, [route, searchQuery]);

  const handleSearch = (value) => {
    const query = value.trim();

    if (!query) {
      return;
    }

    window.location.href = getSearchPath(language, query);
  };

  const handleContactSubmit = (event) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const name = formData.get('name');
    const email = formData.get('email');
    const description = formData.get('description');
    const subject = language === 'et' ? 'Uus projektipäring' : 'New project inquiry';
    const body = [
      `${t.form.name}: ${name}`,
      `${t.form.email}: ${email}`,
      '',
      `${t.form.description}:`,
      description
    ].join('\n');

    window.location.href = `mailto:info@factorysimulation.eu?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <div className={`min-h-screen ${darkSurfaceClass} text-white`}>
      <header className="sticky top-0 z-20 flex min-h-16 items-center justify-between gap-8 border-b-3 border-fs-accent bg-black/92 px-6 py-3 backdrop-blur lg:min-h-20 lg:px-[7vw]">
        <a className="inline-flex items-center gap-3 no-underline" href={getLanguagePath(language, '')} aria-label="Factory Simulation home">
          <img className="block h-auto w-26 lg:w-32" src={assetPath('/logo.svg')} alt="" aria-hidden="true" />
          <span className="text-lg leading-none font-bold italic tracking-normal text-white sm:text-xl lg:text-2xl">
            Factory Simulation
          </span>
        </a>
        <button
          className="grid size-11 place-items-center border border-white/30 p-2 lg:hidden"
          type="button"
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span className="block h-0.5 w-6 bg-white" />
          <span className="block h-0.5 w-6 bg-white" />
          <span className="block h-0.5 w-6 bg-white" />
        </button>
        <nav
          className={`absolute top-full right-0 left-0 flex-col border-b border-fs-line bg-black px-6 py-5 text-sm uppercase lg:static lg:flex lg:flex-row lg:items-center lg:gap-7 lg:border-0 lg:bg-transparent lg:p-0 ${
            menuOpen ? 'flex' : 'hidden'
          } lg:flex`}
          aria-label="Main navigation"
        >
          <div className={`contents ${desktopSearchOpen ? 'lg:hidden' : ''}`}>
            {navItems.map((item) => (
              <a
                className="flex min-h-10 items-center py-3 no-underline transition hover:text-fs-accent lg:py-0"
                key={item.href}
                href={item.href}
                onClick={(event) => {
                  if (item.anchor === 'blog' || item.anchor === 'wheelme') {
                    setMenuOpen(false);
                    return;
                  }

                  navigateToHomeSection(event, item.anchor);
                }}
              >
                {item.label}
              </a>
            ))}
            <button
              className="flex min-h-10 w-fit items-center py-3 transition hover:scale-110 lg:py-0"
              type="button"
              onClick={switchLanguage}
              aria-label={t.languageLabel}
              title={t.languageLabel}
            >
              <img className="h-5 w-7 object-cover" src={assetPath(t.flagSrc)} alt="" aria-hidden="true" />
            </button>
            <a
              className="mt-3 inline-flex min-h-11 w-fit items-center justify-center border border-fs-accent bg-fs-accent px-4 py-2 font-bold text-black no-underline transition hover:bg-white lg:mt-0"
              href={getPagePath(language, 'home', '#contact')}
              onClick={navigateToContact}
            >
              {t.contactButton}
            </a>
          </div>
          <div className="mt-3 w-full lg:hidden">
            <HeaderSearch label={t.search.label} placeholder={t.search.placeholder} initialValue={searchQuery} onSearch={handleSearch} alwaysOpen />
          </div>
          <div className="hidden lg:block">
            <HeaderSearch label={t.search.label} placeholder={t.search.placeholder} initialValue={searchQuery} onSearch={handleSearch} onOpenChange={setDesktopSearchOpen} />
          </div>
        </nav>
      </header>

      <main id="top">
        {searchQuery ? (
          <SearchPage t={t} language={language} query={searchQuery} onContactSubmit={handleContactSubmit} />
        ) : route === 'wheelme' ? (
          <WheelmePage t={t} language={language} onContactClick={navigateToContact} onOpenImage={setLightboxImage} />
        ) : route === 'blog' ? (
          <BlogPage t={t} language={language} />
        ) : (
          <>
        <section className="relative grid min-h-[680px] items-end overflow-hidden bg-black px-5 pt-20 pb-16 sm:px-8 lg:aspect-video lg:min-h-0 lg:items-center lg:px-[10vw] lg:py-20">
          <video className="absolute inset-0 h-full w-full object-cover object-right" poster={assetPath('/hero-simulation.svg')} autoPlay muted loop playsInline>
            <source src={assetPath('/hero-video.webm')} type="video/webm" />
          </video>
          <div className="absolute inset-0 bg-[linear-gradient(0deg,#000_0%,rgba(0,0,0,0.9)_18%,rgba(0,0,0,0.5)_42%,rgba(0,0,0,0.06)_72%)] lg:bg-[linear-gradient(90deg,#000_0%,rgba(0,0,0,0.88)_28%,rgba(0,0,0,0.48)_58%,rgba(0,0,0,0.12)_100%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(0,0,0,0.24)_0%,transparent_38%,transparent_72%,rgba(0,0,0,0.28)_100%)]" />
          <div className="relative z-10 w-[84vw] max-w-[26rem] sm:max-w-2xl lg:w-1/2 lg:max-w-4xl">
            <h1 className="mb-5 text-left text-[clamp(1.75rem,9.4vw,3rem)] leading-[1.02] font-semibold lg:text-[clamp(2.3rem,4.8vw,5.4rem)]">
              <span className="lg:hidden">{t.heroHeadlineMobile}</span>
              <span className="hidden lg:inline">{t.heroHeadline}</span>
            </h1>
            <p className="mb-8 max-w-2xl text-left text-[clamp(1.05rem,1.55vw,1.45rem)] leading-snug text-white/82">
              {t.heroSubline.start}
              <span className="text-fs-accent">{t.heroSubline.risk}</span>
              {t.heroSubline.afterRisk}
              <span className="text-fs-accent">{t.heroSubline.mistakes}</span>
              {t.heroSubline.afterMistakes}
              <span className="text-fs-accent">{t.heroSubline.savings}</span>
              {t.heroSubline.end}
            </p>
            <div className="flex flex-wrap gap-3.5">
              <a className="inline-flex min-h-12 items-center justify-center border border-fs-accent bg-fs-accent px-5 py-3 font-bold text-black no-underline" href="#contact" onClick={navigateToContact}>
                {t.heroButton}
              </a>
              <a className="inline-flex min-h-12 items-center justify-center border border-fs-accent px-5 py-3 font-bold text-white no-underline" href="#services">
                {t.heroSecondary}
              </a>
            </div>
          </div>
        </section>

        <ServicesSection t={t} onContactClick={navigateToContact} />

        <section className={sectionClass} id="projects">
          <div className="mb-14 max-w-4xl">
            <h2 className={h2Class}>{t.projectsTitle}</h2>
            <p className="max-w-3xl text-[clamp(1.05rem,1.7vw,1.35rem)] leading-relaxed text-white/70">{t.projectIntro}</p>
          </div>
          <div className="grid gap-10 lg:gap-14">
            {t.projects.map((project, index) => (
              <ProjectCase project={project} labels={t.projectCardLabels} index={index} onOpenImage={setLightboxImage} key={project.title} />
            ))}
          </div>
        </section>

        <section className={`${sectionClass} relative min-h-[76vh] overflow-hidden`} id="about">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[linear-gradient(180deg,rgba(0,0,0,0.62)_0%,rgba(0,0,0,0.22)_48%,transparent_100%)]" aria-hidden="true" />
          <div className="relative z-10">
          <h2 className={h2Class}>{t.aboutTitle}</h2>
          <div className="max-w-7xl">
            <h3 className={h3Class}>{t.teamTitle}</h3>
            <div className="grid max-w-5xl gap-8 md:grid-cols-3 md:justify-between">
              {t.team.map((person) => (
                <article className="group md:max-w-64" key={person.name}>
                  <div className="mb-5 aspect-[4/5] max-w-48 overflow-hidden border border-fs-accent/35 bg-fs-panel sm:max-w-56 md:max-w-none">
                    {person.image ? (
                      <img className="h-full w-full object-cover grayscale transition duration-300 group-hover:grayscale-0" src={assetPath(person.image)} alt={person.name} />
                    ) : (
                      <div className="grid h-full place-items-center bg-fs-accent/10 text-fs-accent">
                        <PersonIcon />
                      </div>
                    )}
                  </div>
                  <div className="flex items-start justify-between gap-4 border-t border-fs-line pt-4">
                    <div>
                      <h4 className="mb-1 text-2xl font-semibold leading-tight text-white">{person.name}</h4>
                      <p className="mb-2 text-base font-medium leading-snug text-fs-accent">{person.role}</p>
                      <p className="m-0 text-sm leading-snug text-white/72">{person.credentials}</p>
                    </div>
                    {person.linkedin && (
                      <a
                        className="grid size-8 shrink-0 place-items-center border border-fs-accent/55 text-fs-accent transition hover:border-white/70 hover:text-white"
                        href={person.linkedin}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`${person.name} LinkedIn`}
                      >
                        <LinkedinIcon />
                      </a>
                    )}
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-20 border-t border-fs-line pt-14 lg:mt-28 lg:pt-18">
              <h3 className={h3Class}>{t.partnersTitle}</h3>
              <div className="my-7 grid grid-cols-2 items-center gap-4.5 lg:grid-cols-5" aria-label={t.partnersTitle}>
                {partners.map((partner) => (
                  <div className={`flex min-h-32 items-center justify-center p-2 ${partner.bare ? 'bg-transparent' : 'bg-white'}`} key={partner.name}>
                    {partner.href ? (
                      <a className="flex h-full w-full items-center justify-center" href={partner.href} target="_blank" rel="noreferrer" aria-label={partner.name}>
                        <img className={`${partner.large ? 'max-h-32' : 'max-h-28'} w-full object-contain`} src={assetPath(partner.logo)} alt={partner.name} />
                      </a>
                    ) : (
                    <img className={`${partner.large ? 'max-h-32' : 'max-h-28'} w-full object-contain`} src={assetPath(partner.logo)} alt={partner.name} />
                    )}
                  </div>
                ))}
              </div>
              <h3 className={h3Class}>{t.reseller}</h3>
              <div className="grid gap-5 sm:grid-cols-[12rem_1fr] sm:items-start lg:max-w-4xl">
                <a className="flex h-48 items-center justify-center border border-white/18 bg-black/50 p-4" href={getPagePath(language, 'wheelme')} aria-label="wheel.me">
                  <img className="max-h-30 w-full object-contain" src={assetPath('/wheelme/wheel.me_logo_white.png')} alt="wheel.me" />
                </a>
                <div>
                  <p className="mb-3 text-[clamp(1rem,1.45vw,1.25rem)] leading-snug text-white/92">
                    <span className="text-fs-accent">Wheel.me</span>{t.wheelmeText.replace('Wheel.me', '')}
                  </p>
                  <p className="mb-5 text-base leading-snug text-white/70">{t.wheelmePrompt}</p>
                  <a className="inline-flex min-h-12 items-center justify-center border border-fs-accent px-5 py-3 font-bold text-white no-underline transition hover:bg-fs-accent hover:text-black" href={getPagePath(language, 'wheelme')}>
                    {t.wheelmeLearnMore}
                  </a>
                </div>
              </div>
            </div>
          </div>
          </div>
        </section>

        <section className="bg-fs-accent px-5 py-20 text-black sm:px-8 lg:px-[10vw] lg:py-34" id="contact">
          <div className="grid items-start gap-10 lg:grid-cols-[minmax(260px,0.8fr)_minmax(320px,560px)] lg:gap-[8vw]">
            <div>
              <h2 className={h2Class}>{t.contactTitle}</h2>
              <p className="text-[clamp(1.5rem,3vw,2.4rem)] leading-tight">{t.contactText}</p>
            </div>
            <form className="grid gap-4.5" onSubmit={handleContactSubmit}>
              <label className="grid gap-2">
                {t.form.name}
                <input ref={contactNameRef} className="w-full border-0 bg-white/72 px-3.5 py-3 font-sans text-black" name="name" autoComplete="name" required />
              </label>
              <label className="grid gap-2">
                {t.form.email}
                <input className="w-full border-0 bg-white/72 px-3.5 py-3 font-sans text-black" type="email" name="email" autoComplete="email" required />
              </label>
              <label className="grid gap-2">
                {t.form.description}
                <textarea className="w-full border-0 bg-white/72 px-3.5 py-3 font-sans text-black" name="description" rows="6" required />
              </label>
              <button className="min-h-14 w-32 cursor-pointer border-0 bg-black text-fs-accent" type="submit">{t.form.send}</button>
            </form>
          </div>
        </section>
          </>
        )}
      </main>

      <footer className={`grid items-center gap-8 border-t border-fs-line px-6 py-10 lg:grid-cols-[180px_1fr_auto] lg:px-[7vw] ${darkSurfaceClass}`}>
        <img className="w-40" src={assetPath('/logo.svg')} alt="Factory Simulation" />
        <div>
          <h2 className="mb-2.5 text-xl font-bold">{t.contacts}</h2>
          <a className="mb-1.5 block text-white" href="mailto:info@factorysimulation.eu">info@factorysimulation.eu</a>
          <div className="mt-4 flex gap-2" aria-label="Social media">
            {socialLinks.map(({ name, href, Icon }) => (
              <a
                className="grid size-8 place-items-center border border-fs-accent/55 text-fs-accent transition hover:border-white/70 hover:text-white"
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={name}
                key={name}
              >
                <Icon />
              </a>
            ))}
          </div>
        </div>
        <div>
          <p className="m-0 text-white/70">Factory Simulation & Digital Twin solutions</p>
          <p className="mt-2 mb-0 text-xs text-white/45">Last updated {lastUpdated} · {buildCommit}</p>
        </div>
      </footer>
      <ImageLightbox image={lightboxImage} onClose={() => setLightboxImage(null)} />
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);
