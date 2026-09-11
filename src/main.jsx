import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { version as appVersion } from '../package.json';
import GermanSite from './GermanSite';
import './styles.css';

const sectionClass = 'px-5 py-20 sm:px-8 lg:px-[10vw] lg:py-36';
const darkSurfaceClass =
  'bg-[radial-gradient(circle_at_1px_1px,rgba(226,171,25,0.16)_1px,transparent_0),linear-gradient(135deg,#000_0%,#111_46%,#262626_100%)] bg-[length:34px_34px,auto]';
const h2Class = 'mb-10 text-[clamp(2.7rem,6vw,5.6rem)] leading-none font-normal';
const h3Class = 'mb-5 text-[clamp(1.35rem,2vw,2rem)] leading-tight font-bold';
const liClass = 'mb-4 text-[clamp(1rem,1.45vw,1.28rem)] leading-snug';
const basePath = import.meta.env.BASE_URL.endsWith('/') ? import.meta.env.BASE_URL : `${import.meta.env.BASE_URL}/`;
const basePathPrefix = basePath === '/' ? '' : basePath.replace(/\/$/, '');
const siteVariant = import.meta.env.VITE_SITE_VARIANT || 'combined';
const buildCommit = import.meta.env.VITE_COMMIT_SHA || '5ba3d0d';
const lastUpdated = import.meta.env.VITE_LAST_UPDATED || '2026-05-06';
const contactEndpoint = import.meta.env.VITE_CONTACT_ENDPOINT || (import.meta.env.DEV ? '/api/contact.php' : '');
const analyticsTagId = 'G-JRKZJXK4DL';
const adsTagId = 'AW-18241161030';
const googleMeasurementEnabled = import.meta.env.VITE_GOOGLE_MEASUREMENT_ENABLED === 'true';
const leadConversionTarget = 'AW-18241161030/BFTiCOXzvr8cEMaOiPpD';
const consentStorageKey = 'factorySimulationConsent';
const privacySettingsEvent = 'factory-simulation:open-privacy-settings';
const consentVersion = 1;
const consentLifetimeMs = 365 * 24 * 60 * 60 * 1000;
const assetPath = (path) => `${basePath}${path.replace(/^\//, '')}`;
const assetSrcSet = (sources) => sources.map(({ src, width }) => `${assetPath(src)} ${width}w`).join(', ');
const readConsent = () => {
  try {
    const consent = JSON.parse(window.localStorage.getItem(consentStorageKey));
    if (
      consent?.version !== consentVersion ||
      typeof consent.savedAt !== 'number' ||
      Date.now() - consent.savedAt > consentLifetimeMs
    ) {
      window.localStorage.removeItem(consentStorageKey);
      return null;
    }
    return consent;
  } catch {
    return null;
  }
};
const saveConsent = ({ analytics, advertising }) => {
  const consent = {
    version: consentVersion,
    savedAt: Date.now(),
    analytics: Boolean(analytics),
    advertising: Boolean(advertising)
  };
  try {
    window.localStorage.setItem(consentStorageKey, JSON.stringify(consent));
  } catch {
    // The choice still applies for this page when browser storage is unavailable.
  }
  return consent;
};
const activateGoogleMeasurement = (consent) => {
  if (!googleMeasurementEnabled || (!consent?.analytics && !consent?.advertising) || document.querySelector('script[data-google-measurement]')) {
    return;
  }

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function gtag() {
    window.dataLayer.push(arguments);
  };
  window.gtag('consent', 'default', {
    analytics_storage: 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied'
  });
  window.gtag('consent', 'update', {
    analytics_storage: consent.analytics ? 'granted' : 'denied',
    ad_storage: consent.advertising ? 'granted' : 'denied',
    ad_user_data: consent.advertising ? 'granted' : 'denied',
    ad_personalization: 'denied'
  });
  window.gtag('js', new Date());

  if (consent.analytics) {
    window.gtag('config', analyticsTagId, {
      cookie_expires: 31536000,
      allow_google_signals: false,
      allow_ad_personalization_signals: false
    });
  }
  if (consent.advertising) {
    window.gtag('config', adsTagId, {
      allow_ad_personalization_signals: false
    });
  }

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${consent.analytics ? analyticsTagId : adsTagId}`;
  script.dataset.googleMeasurement = 'true';
  document.head.appendChild(script);
};
const clearGoogleMeasurementStorage = () => {
  try {
    Object.keys(window.localStorage)
      .filter((key) => key.startsWith('_gcl_'))
      .forEach((key) => window.localStorage.removeItem(key));
  } catch {
    // Ignore storage restrictions; denied consent still prevents future loading.
  }

  document.cookie.split(';').forEach((entry) => {
    const name = entry.split('=')[0].trim();
    if (!/^_(ga|gid|gat|gcl)/.test(name)) return;
    const expiry = 'expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax';
    document.cookie = `${name}=; ${expiry}`;
    document.cookie = `${name}=; ${expiry}; domain=${window.location.hostname}`;
    document.cookie = `${name}=; ${expiry}; domain=.${window.location.hostname}`;
  });
};
const requestPrivacySettings = () => window.dispatchEvent(new Event(privacySettingsEvent));

const storedConsent = readConsent();
if (storedConsent) {
  activateGoogleMeasurement(storedConsent);
}

const trackLeadConversion = () => {
  if (!googleMeasurementEnabled || !readConsent()?.advertising || typeof window === 'undefined' || typeof window.gtag !== 'function') {
    return;
  }

  window.gtag('event', 'conversion', {
    send_to: leadConversionTarget,
    value: 1.0,
    currency: 'EUR'
  });
};
const getContactFormErrors = (form) => {
  const name = String(form.elements.namedItem('name')?.value || '').trim();
  const emailField = form.elements.namedItem('email');
  const email = String(emailField?.value || '').trim();
  const description = String(form.elements.namedItem('description')?.value || '').trim();
  const errors = {};

  if (!name) errors.name = 'nameRequired';
  if (!email) errors.email = 'emailRequired';
  else if (emailField?.validity.typeMismatch) errors.email = 'emailInvalid';
  if (!description) errors.description = 'descriptionRequired';
  else if (description.length < 5) errors.description = 'descriptionShort';

  return errors;
};
const iconMask = {
  WebkitMask: `url(${assetPath('/check.svg')}) center / contain no-repeat`,
  mask: `url(${assetPath('/check.svg')}) center / contain no-repeat`
};

const content = {
  et: {
    languageLabel: 'Switch to English',
    flagSrc: '/en-flag.svg',
    languageSwitcherLabel: 'Keele valik',
    heroHeadline: 'Kontseptsioonist kindla investeerimisotsuseni',
    heroHeadlineMobile: <>Kontseptsioonist kindla investeerimis-<br />otsuseni</>,
    nav: ['Teenused', 'Meist', 'Uudised', 'Wheel.me'],
    headerTagline: <>Sinu Tootmise<br />insenertehniline partner</>,
    heroSubline: {
      start: <>Aitame integraatoritel ja tootmisettevõtetel automatiseerimist enne paigaldust ja käivitamist virtuaalselt valideerida – alates roboti liikumisest ja tsükliajast kuni tootmisvõimekuse, PLC-loogika ning seadmete koostööni.<br />Nii saad </>,
      risk: 'vähendada riske',
      afterRisk: ', ',
      mistakes: 'vältida kulukaid vigu',
      afterMistakes: ' ning ',
      savings: 'hoida kokku aega ja raha',
      end: '.'
    },
    heroButton: 'Saa tasuta konsultatsioon',
    heroSecondary: 'Vaata teenuseid',
    contactButton: 'Kontakteeru',
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
        image: '/project-plastic.webp',
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
        image: '/project-heavy.webp',
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
        image: '/project-food.webp',
        imageOverlay: '/project-food2.webp',
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
        image: '/project-logistics.webp',
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
        image: '/project-pellet.webp',
        imageOverlays: ['/project-pellet2.webp', '/project-pellet3.webp'],
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
      'Toetame automaatikaintegraatoreid, masinaehitajaid ja tootmisettevõtteid simulatsiooni, robotite võrguvälise programmeerimise ning virtuaalse kasutuselevõtuga –',
    servicesHero: {
      image: '/analysis1.webp',
      imageAlt: 'AutoCAD joonise ja 3D paigutuse võrdlus tõstuki manööverdusanalüüsiga'
    },
    servicesQuestions: [
      'Kas süsteem saavutab nõutud tsükliaja ja tootmisvõimsuse?',
      'Kuidas testida PLC- ja robotiloogikat enne füüsilist käivitamist?',
      'Kas robotiprogramme saab arendada ja testida virtuaalses keskkonnas?',
      'Kuidas valideerida uut tehast või tootmisliini enne investeeringu tegemist?'
    ],
    serviceCardLabels: {
      validation: 'Mida valideerime',
      outcome: 'Tulemus'
    },
    serviceCta: 'Räägime projektist',
    softwareTitle: 'Inseneritarkvara ja tööriistad',
    softwareIntro:
      'Kasutame erinevat inseneritarkvara, et tootmissüsteeme enne juurutamist planeerida, simuleerida, programmeerida ja valideerida.',
    softwareLabel: 'Meie tööriistad',
    softwareCapabilities: [
      {
        title: 'Visual Components',
        description: <>Modelleerime tootmisprotsesse ja -võimsust ja simuleerime tootmiskontseptsioone.<br />Teostame robotite offline-programmeerimist.</>,
        tools: ['Visual Components']
      },
      {
        title: 'AutoCAD',
        description:
          'Koostame täpsed 2D tootmispaigutused ja tehnilised joonised, mida kasutame simulatsiooni ja projekteerimise alusena.',
        tools: ['AutoCAD']
      },
      {
        title: 'AutoTURN',
        description:
          'Kontrollime tõstukite, veokite ja teiste sõidukite pöörderaadiusi, liikumisteid ja vajalikku manööverdusruumi.',
        tools: ['AutoTURN']
      },
      {
        title: 'ABB RobotStudio',
        description:
          'Programmeerime ja simuleerime ABB robotirakke ning kontrollime robotite tööulatust ja tsükliaegu.',
        tools: ['ABB RobotStudio']
      },
      {
        title: 'Siemens TIA Portal + PLCSIM',
        description:
          'Arendame PLC-programme ning testime juhtloogikat ja süsteemi käitumist virtuaalselt enne füüsilist käivitust.',
        tools: ['Siemens TIA Portal + PLCSIM']
      },
      {
        title: 'NVIDIA Omniverse',
        description:
          'Loome NVIDIA Omniverse ja Isaac Sim abil suuremahulisi realistlikke digitaalseid kaksikuid, tehasekeskkondi ja ühendatud tööstuslikke 3D-töövooge.',
        tools: ['NVIDIA Omniverse']
      },
      {
        title: 'Unreal Engine + Unity',
        description:
          'Loome interaktiivseid visualiseeringuid, virtuaalseid tehasekeskkondi ja reaalaja 3D-rakendusi.',
        tools: ['Unreal Engine', 'Unity']
      }
    ],
    services: [
      {
        title: 'Uue tehase või tootmisliini planeerimine',
        problem: 'Vale otsus investeerides võib põhjustada kulukaid ümberkorraldusi ja pudelikaelu pärast käivitust.',
        solutionLead: 'Loome tootmisest 3D simulatsiooni, et testida seadmete paigutust, materjalivooge, operaatorite liikumist ja tootmismahte.',
        solutionPoints: [
          'Seadmete paigutus, materjalivood ja operaatorite liikumine',
          'Tootmismahud ja tsükliajad',
          'AGV/AMR-de liikumisteed, pöörderaadiused ja vajalikud ohutusalad',
        ],
        impact: [
          'Aitab saavutada kohe suurema tootlikkuse',
          'Vähendab tootmisseisakute riski pärast ümberkorraldusi',
          'Väldib ruumipuudusest tingitud hilisemaid ümbertegemisi',
        ],
        ctaPrompt: 'Planeerid uut liini või tehase laiendust?',
        comparisonImages: [
          {
            src: '/services/planning.webp',
            alt: 'Uue tehase ja tootmisliini planeering simulatsioonimudelis'
          }
        ]
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
        ctaPrompt: 'Tahad leida tootmise tegelikud piirangud?',
        comparisonImages: [
          {
            src: '/project-food.webp',
            alt: 'Tootmisliini jõudlusnäitajad ja protsessimudel',
            focus: 'lower'
          }
        ],
        overlayImage: {
          src: '/project-food2.webp',
          alt: 'Tootmisliini tsükli- ja läbivusaja detailne analüüs'
        }
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
        ctaPrompt: 'Plaanid uut automaatikalahendust?',
        comparisonImages: [
          {
            src: '/services/comparison-1.webp',
            sources: [
              { src: '/services/comparison-1-760.webp', width: 760 },
              { src: '/services/comparison-1.webp', width: 1054 }
            ],
            alt: 'Manuaalne tootmisprotsess operaatoritega simulatsioonimudelis'
          },
          {
            src: '/services/comparison-2.webp',
            sources: [
              { src: '/services/comparison-2-760.webp', width: 760 },
              { src: '/services/comparison-2.webp', width: 1054 }
            ],
            alt: 'Automatiseeritud robotirakk turvapiirete ja konveieritega simulatsioonimudelis'
          }
        ]
      },
      {
        title: 'Robotite offline programmeerimine',
        problem: 'Robotite programmeerimine füüsilistel seadmetel võtab väärtuslikku tootmis- ja käivitusaega ning ootamatud ulatuse, kokkupõrgete ja järjestuse probleemid võivad käivitamisel viivitusi põhjustada.',
        validationLabel: 'Mida programmeerime',
        solutionLead: 'Robotite võrguvälise programmeerimise käigus loome ja testime robotiprogramme virtuaalses keskkonnas, lähtudes planeeritud robotirakust, tööriistadest ja protsessinõuetest, enne kui programm kantakse füüsilisse robotisse.',
        solutionPoints: [
          'Robotiprogrammid virtuaalse robotiraku põhjal',
          'Tööriistade, trajektooride ja protsessijärjestuste testimine',
          'Programmi ettevalmistus füüsilisse robotisse ülekandmiseks'
        ],
        impact: [
          'Vähendab programmeerimisaega tootmispõrandal',
          'Lühendab paigaldust ja käivitamist',
          'Annab testitud robotiprogrammi, mis on valmis lõplikuks kohapealseks kalibreerimiseks'
        ],
        ctaPrompt: 'Soovid vähendada kohapealset robotiprogrammeerimise aega?',
        comparisonImages: [
          {
            src: '/services/olp-1.webp',
            alt: 'Robotite võrguvälise programmeerimise rakumudel virtuaalses keskkonnas',
            imageClassName: '-scale-x-100 bg-[#d8d8d6] object-cover object-[68%_16%]'
          }
        ],
        overlayImage: {
          src: '/services/olp-2.webp',
          alt: 'Robotiprogrammi võrguvälise programmeerimise vaade',
          className: 'top-0 right-0 h-[160%] w-[36%] sm:w-[35%] lg:w-[34%]',
          imageClassName: 'h-full w-full object-cover object-top'
        }
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
        comparisonImages: [
          {
            src: '/services/vc.webp',
            alt: 'Virtuaalse käikuvõtmise süsteemimudel ja juhtloogika valideerimine',
            imageClassName: 'scale-100 bg-[#d6d9dc] object-contain object-top'
          }
        ]
      }
    ],
    clientLogosTitle: 'Kliendid',
    clientLogosIntro: 'Ettevõtted, kellega oleme koostööd teinud',
    contactTitle: 'Teeme koostööd!',
    contactText: 'Alustame lühikese kõnega, et mõista sinu projekti, riske ja järgmisi samme.',
    contactFormTitle: 'Tasuta konsultatsioon',
    contactFormText: 'Saada meile sõnum ja lepime kokku kõne, et arutada projekti ning leida parim simulatsiooni- või valideerimislahendus.',
    form: {
      name: 'Nimi',
      email: 'Email',
      description: 'Projekti kirjeldus',
      placeholders: {
        name: 'Sinu nimi',
        email: 'Sinu email',
        description: 'Kirjelda oma projekti mõne sõnaga'
      },
      send: 'Saada',
      sending: 'Saadan…',
      success: 'Aitäh! Vastame varsti!',
      error: 'Sõnumi saatmine ebaõnnestus. Palun proovi uuesti või kirjuta meile otse.',
      directEmail: 'Kirjuta otse emailile',
      privacyNotice: {
        before: 'Vormi saatmisel töötleme teie esitatud andmeid ainult päringule vastamiseks (lisateave: ',
        link: 'privaatsuspoliitika',
        after: ').'
      },
      validation: {
        nameRequired: 'Palun sisesta nimi.',
        emailRequired: 'Palun sisesta emaili aadress.',
        emailInvalid: 'Palun sisesta korrektne emaili aadress.',
        descriptionRequired: 'Palun kirjelda projekti.',
        descriptionShort: 'Palun lisa vähemalt 5 tähemärki.'
      }
    },
    aboutTitle: 'Meist',
    teamTitle: 'Meeskond',
    team: [
      { name: 'Steven', role: 'Tegevjuht', credentials: 'Mehaanikainsener (BSc)', image: '/team/steven.webp', linkedin: 'https://www.linkedin.com/in/steven-strandberg/' },
      { name: 'Hans', role: 'Simulatsiooniinsener', credentials: 'Tööstustehnika ja juhtimine (MSc)', image: '/team/hans.webp', linkedin: 'https://www.linkedin.com/in/hjerikson/'  },
      { name: 'Markus', role: 'Projektiinsener', credentials: 'Robootika ja automaatikainsener (MSc)', image: '/team/markus.webp' }
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
        hero: '/wheelme/wheelme_0792.webp',
        heroMobile: '/wheelme/wheelme_0792-mobile.webp',
        detail: '/wheelme/_dsc3066.webp',
        concept: '/wheelme/wheelme1.webp',
        power: '/wheelme/power-station-close-by.webp'
      }
    },
    contacts: 'Kontakt',
    privacy: {
      title: 'Privaatsuspoliitika',
      breadcrumb: 'Privaatsuspoliitika',
      updated: 'Viimati uuendatud: 07.07.2026',
      intro:
        'See privaatsuspoliitika selgitab, kuidas Factory Simulation OÜ töötleb veebilehe kontaktvormide kaudu saadetud andmeid.',
      sections: [
        {
          title: 'Vastutav töötleja',
          paragraphs: [
            'Vastutav töötleja: Factory Simulation OÜ.',
            'Registrikood: 17384619.',
            'Aadress: Okka tee 2, 46607, Piira, Eesti.',
            'email: info@factorysimulation.eu.'
          ]
        },
        {
          title: 'Milliseid andmeid töötleme',
          paragraphs: [
            'Kontaktvormi kaudu töötleme teie nime, emaili aadressi, sõnumi sisu, vormi allikat ning tehnilisi andmeid, mis on vajalikud vormi turvaliseks edastamiseks ja rämpsposti vähendamiseks.'
          ]
        },
        {
          title: 'Miks ja mis õiguslikul alusel andmeid töötleme',
          paragraphs: [
            'Töötleme andmeid selleks, et vastata teie päringule, arutada võimalikku projekti ja võtta teie soovil ühendust. Õiguslik alus on lepingu sõlmimisele eelnevate meetmete võtmine teie taotlusel või meie õigustatud huvi vastata äripäringutele.'
          ]
        },
        {
          title: 'Kellele andmeid edastatakse',
          paragraphs: [
            'Andmeid näevad ainult Factory Simulationi inimesed, kes vastavad päringutele. Tehniliselt liiguvad andmed läbi meie veebimajutuse ja emaili teenusepakkuja Zone.ee.'
          ]
        },
        {
          title: 'Kui kaua andmeid säilitame',
          paragraphs: [
            'Säilitame päringuid nii kaua, kui on mõistlik päringule vastamiseks, võimaliku koostöö ettevalmistamiseks ja tavapärase ärisuhtluse ajaloo hoidmiseks. Kui päringust ei teki koostööd, kustutame või arhiveerime selle mõistliku aja jooksul, välja arvatud juhul, kui seadus nõuab pikemat säilitamist.'
          ]
        },
        {
          title: 'Turundus ja uudiskirjad',
          paragraphs: [
            'Kontaktvormi andmeid ei kasutata uudiskirja saatmiseks ega eraldi turundusnimekirja lisamiseks ilma eraldi vabatahtliku nõusolekuta.'
          ]
        },
        {
          title: 'Teie õigused',
          paragraphs: [
            'Teil on õigus küsida ligipääsu oma andmetele, paluda andmeid parandada või kustutada, piirata töötlemist ning esitada vastuväiteid. Samuti on teil õigus esitada kaebus Andmekaitse Inspektsioonile.'
          ]
        }
      ]
    },
    faq: {
      metaTitle: 'Tootmise simulatsiooni KKK | Factory Simulation teenused',
      metaDescription:
        'Loe, kuidas tootmise simulatsioon aitab testida tootmisvoogu, võimsust, layoute, automatiseerimiskontseptsioone ja investeerimisstsenaariume enne füüsilisi muudatusi.',
      breadcrumb: 'Tootmise simulatsiooni KKK',
      eyebrow: 'Factory Simulation FAQ',
      title: 'Tootmise simulatsiooni KKK',
      intro: [
        'Simulatsioon aitab tootmisettevõtetel testida tootmise layoute, materjalivooge, automatiseerimiskontseptsioone ja võimsusstsenaariume enne füüsiliste muudatuste või investeerimisotsuste tegemist.',
        'Allpool on vastused levinud küsimustele selle kohta, kuidas simulatsioon töötab, kui täpne see on ja millal see loob kõige rohkem väärtust.'
      ],
      teaser: {
        eyebrow: 'Korduma kippuvad küsimused',
        title: 'Paremad tootmisotsused algavad õigetest küsimustest',
        intro:
          'Lühikesed vastused simulatsiooni täpsuse, kasutusjuhtude, automatiseerimise ja investeerimisotsuste kohta.',
        link: 'Vaata kõiki küsimusi ja vastuseid'
      },
      cta: {
        title: 'Tahad hinnata oma tootmisideed enne investeeringut?',
        text: 'Räägime läbi protsessi, andmed ja otsuse, mida simulatsioon peaks toetama.',
        button: 'Räägime projektist'
      },
      items: [
        {
          question: 'Mis on simulatsioon tootmises?',
          answer: [
            'Tootmise simulatsioon tähendab tootmisprotsessi, liini, tööala või tehaseosa digitaalse mudeli loomist.',
            'Mudelit kasutatakse selleks, et testida, kuidas materjalid, inimesed, masinad, puhvrid ja transpordisüsteemid koos töötavad enne päris muudatuste tegemist. Eesmärk on mõista tootmisvoogu, võimsust, pudelikaelu ja investeerimisriske enne aja ja raha sidumist.'
          ]
        },
        {
          question: 'Kuidas simulatsioon töötab?',
          answer: [
            'Tootmissimulatsioon algab tavaliselt protsessi kaardistamisest, layouti infost ja sisendandmetest.',
            'Tüüpilised sisendandmed on tsükliajad, tootevalik, operaatorite ülesanded, masinate võimsus, transporditeekonnad, vahetuste graafikud, puhvrid ja ümberseadistused. Nende põhjal ehitatakse digitaalne mudel, kus saab erinevaid tootmisstsenaariume testida ja võrrelda.',
            'Tulemus ei ole ainult visuaalne mudel. See on otsustustugi, mis aitab mõista, mis juhtub siis, kui muutub layout, ressursside hulk, protsessiloogika või automatiseerimiskontseptsioon.'
          ]
        },
        {
          question: 'Kui täpsed simulatsioonid on?',
          answer: [
            'Simulatsioonid on otsustustoe mudelid, mitte reaalsuse üks-ühele koopiad.',
            'Täpsus sõltub sisendandmete kvaliteedist. Sarnaselt tehisintellektiga on väljund nii hea kui andmed ja eeldused, millele see tugineb. Kui tsükliajad, protsessiloogika, tootevalik, operaatorite ülesanded, puhvrid ja materjalivood on realistlikud, saab simulatsioon anda väärtuslikku infot stsenaariumite võrdlemiseks ja otsuste toetamiseks.',
            'Enamasti tuleb peamine väärtus sellest, et saab mõista tootmissüsteemi eri osade omavahelist mõju, tuvastada pudelikaelu ja testida, kas planeeritud muudatus parandab tõenäoliselt kogu voogu enne selle elluviimist.',
            'Näiteks aitab simulatsioon võrrelda, kas tootmisliin töötab paremini teistsuguse layouti, puhvri suuruse, operaatorite jaotuse, transpordiloogika või automatiseerimiskontseptsiooniga.'
          ]
        },
        {
          question: 'Kas müüte simulatsioonitarkvara või pakute simulatsiooniteenuseid?',
          answer: [
            'Pakume inseneri- ja simulatsiooniteenuseid, mitte oma simulatsioonitarkvara.',
            'Meie töö hõlmab tootmisprobleemi mõistmist, sisendandmete kogumist, simulatsioonimudeli ehitamist, stsenaariumite testimist, tulemuste tõlgendamist ja nende muutmist praktilisteks insenertehnilisteks soovitusteks.',
            'Simulatsioonitarkvara on tööriist. Väärtus tekib sellest, kuidas mudel ehitatakse, milliseid stsenaariume testitakse ja kuidas tulemusi kasutatakse layouti, automatiseerimise, võimsuse või investeerimisotsuste toetamiseks.'
          ]
        },
        {
          question: 'Millal peaks tootmise simulatsiooni kasutama?',
          answer: [
            'Tootmise simulatsioon on kasulik enne suuri layouti muudatusi, automatiseerimisinvesteeringuid, võimsuse kasvatamist, tehase kolimist, uute toodete juurutamist või tootevaliku muutumist.',
            'See on eriti väärtuslik siis, kui otsus on kallis, raskesti tagasi pööratav või sisaldab mitut ebakindlat muutujat. Simulatsioon aitab ideed testida enne füüsiliste muudatuste tegemist või tarnijapakkumiste küsimist.',
            'Tüüpilised kasutusjuhud on:'
          ],
          points: [
            'uue tootmisliini planeerimine',
            'tehase layouti muudatused',
            'pudelikaelte analüüs',
            'robotite ja automatiseerimiskontseptsioonide valideerimine',
            'siselogistika ja materjalivoo analüüs',
            'operaatorite ja masinate kasutuse analüüs',
            'võimsuse ja läbilaske uuringud'
          ]
        },
        {
          question: 'Kuidas aitab simulatsioon pudelikaelu vähendada?',
          answer: [
            'Simulatsioon aitab näidata, kus tootmisvoos tekivad järjekorrad, ooteajad, ülekoormatud operaatorid, alakasutatud masinad, transpordiviivitused või puhvrite probleemid.',
            'Erinevaid stsenaariume testides saab võrrelda layouti muudatusi, puhvrite suurusi, mehitust, automatiseerimisvalikuid ja protsessijärjestusi enne füüsiliste muudatuste tegemist.',
            'Selle asemel, et pudelikaela asukohta oletada, annab simulatsioon visuaalse ja andmepõhise viisi testida, kuidas kogu süsteem muudatustele reageerib.'
          ]
        },
        {
          question: 'Kas simulatsioon saab toetada automatiseerimisinvesteeringu otsust?',
          answer: [
            'Jah. Simulatsioon aitab testida, kas planeeritud automatiseerimiskontseptsioonil on piisav võimsus, kuhu võivad tekkida uued pudelikaelad, mitu robotit või operaatorit võib vaja minna ja kas oodatav läbilaske paranemine on realistlik.',
            'See aitab vähendada investeerimisriski enne lõplike tarnijapakkumiste küsimist, seadmete ostmist või tootmise layouti muutmist.',
            'Simulatsioon on eriti kasulik siis, kui võrreldakse käsitsi tehtavat, poolautomaatset ja automaatset stsenaariumi kõrvuti.'
          ]
        },
        {
          question: 'Kas saate töötada kaugelt rahvusvaheliste klientidega?',
          answer: [
            'Jah. Saame toetada tootmisettevõtteid kaugelt sõltumata sellest, kus tootmiskoht asub.',
            'Esimene samm on tavaliselt veebikohtumine, et mõista tootmisprobleemi, planeeritud investeeringut või automatiseerimisideed. Seejärel saab klient jagada olemasolevat sisendit, näiteks layouti jooniseid, protsessivideoid, fotosid, tsükliaegu, tootevalikut, operaatorite ülesandeid ja tootmisandmeid.',
            'Selle info põhjal saame ehitada esmase simulatsioonimudeli, võrrelda stsenaariume ja tulemused koos veebis üle vaadata. See aitab kliendil mõista pudelikaelu, võimsuse piire ja parendusvõimalusi enne füüsiliste muudatuste, tarnijapakkumiste või seadmeinvesteeringute tegemist.',
            'Kui vaja on rohkem detailsust, võib järgmine samm sisaldada täiendavat andmekogumist, täpsemaid protsessimõõtmisi või koostööd kliendi inseneri-, tootmis- või automaatikatiimiga.',
            'Teeme koostööd ka Euroopa inseneri- ja automaatikapartneritega, sealhulgas Itaalias ja Šveitsis. Kui projekt vajab kohalikku teadmist, juurutustuge või täiendavat tehnilist kompetentsi, saame sõltuvalt projekti mahust kaasata usaldusväärseid partnereid.'
          ]
        },
        {
          question: 'Kas saad simulatsiooni selgitada päriselulise näitega?',
          answer: [
            'Kui meeskond ostab parima ründaja, kas see teeb meeskonna automaatselt parimaks? Mitte tingimata. Ründaja võib olla väga hea, aga tulemus sõltub endiselt sellest, kuidas keskväli võimalusi loob, kuidas kaitse surve all hakkama saab, kuidas meeskond koos liigub ja kas kogu süsteem töötab.',
            'Sama loogika kehtib tootmises.',
            'Ühe kalli masina, roboti või automaatikasüsteemi ostmine ei paranda automaatselt kogu tootmisvoogu. Kui järgmine protsess on liiga aeglane, materjalivarustus ebastabiilne või operaatorid ootavad etappide vahel, võib uus masin lihtsalt pudelikaela mujale liigutada.',
            'Simulatsioon aitab enne investeeringut vaadata tervikut. See näitab, kuidas masinad, inimesed, puhvrid, transport ja protsessietapid koos töötavad, et ettevõte saaks aru, kas planeeritud muudatus parandab kogu tootmisahelat, mitte ainult üht eraldiseisvat operatsiooni.'
          ]
        },
        {
          question: 'Mis on Automation 2.0?',
          answer: [
            'Automation 2.0 tähendab liikumist üksikutelt automatiseerimisprojektidelt ühendatuma, simulatsioonipõhise ja elutsüklit arvestava tööstusautomaatika lähenemise poole.',
            'Praktikas tähendab see, et automaatikat ei projekteerita ja testita ainult juurutuse ajal. Seda valideeritakse varem simulatsioonide, digitaalsete mudelite, robotikontseptsioonide, tsükliaja analüüsi, virtuaalse käikuvõtmise ja tootmisvoo testimise abil.',
            'Eesmärk on vähendada hilises faasis tehtavaid muudatusi, vältida kulukaid vigu ja teha automaatikaotsuseid kindlamalt enne süsteemide töölepanekut.'
          ]
        },
        {
          question: 'Mis on digitaalne kaksik?',
          answer: [
            'Digitaalne kaksik on reaalse tootmisprotsessi, liini, masina, tehaseala või isegi terve tehase digitaalne kujutis.',
            'Tootmises saab digitaalset kaksikut kasutada tootmisandmete visualiseerimiseks, jõudluse jälgimiseks, materjalivoo mõistmiseks ja parendusideede testimiseks digitaalses keskkonnas. Sõltuvalt detailsuse tasemest võib see sisaldada layouti infot, masinaid, operaatoreid, tsükliaegu, transporditeekondi, puhvreid, sensoriandmeid, OEE andmeid või ERP/MES infot.',
            'Lihtne simulatsioonimudel ehitatakse tavaliselt stsenaariumite testimiseks ja otsuste toetamiseks. Digitaalne kaksik võib minna sammu kaugemale, ühendades mudeli päris tootmisandmetega ning kasutades seda andmete visualiseerimiseks, jälgimiseks, analüüsiks ja pidevaks parendamiseks.',
            'Peamine väärtus on see, et juhid, insenerid ja tootmistiimid näevad tootmissüsteemis toimuvat selgemalt - mitte ainult tabelite kaudu, vaid visuaalse ja andmepõhise mudeli abil.'
          ]
        }
      ]
    },
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
        image: '/blog/news1.webp',
        excerpt:
          'Läbisime praktilise koolitusprogrammi teemadel tööstusrobotite programmeerimine (offline & online) ning masinnägemise lahenduste rakendamine tootmises. Koolitus keskendus robotite programmeerimisele ja vision-süsteemide kasutamisele automatiseeritud tootmisprotsessides.'
      },
      {
        title: 'Smart Industry konverents 2026',
        category: 'Konverents',
        date: '19.03',
        sortDate: '2026-03-19',
        image: '/blog/news2.webp',
        excerpt:
          'Osalesime Smart Industry konverentsil, kus arutati tööstuse digitaliseerimise, automatiseerimise ja tulevikulahenduste teemadel. Üritusel kuulutati välja ka „Aasta Tehas 2026“.'
      },
      {
        title: 'wheel.me tehasekülastus ja koolitus Norras',
        category: 'Partnerlus',
        date: '06.04 – 07.04',
        sortDate: '2026-04-07',
        image: '/blog/news3.webp',
        excerpt:
          'Külastasime wheel.me tootmisüksust Norras ning osalesime tehnilisel koolitusel autonoomsete mobiilsete robotlahenduste teemal. Tutvusime süsteemide praktiliste kasutusvõimaluste, seadistamise ja erinevate tööstuslike rakendustega.'
      },
      {
        title: 'Soome–Eesti masinatööstuse seminar',
        category: 'Seminar',
        date: '22.04',
        sortDate: '2026-04-22',
        image: '/blog/news4.webp',
        excerpt:
          'Osalesime Soome ja Eesti lehtmetallipäevade raames toimunud masinatööstuse seminaril ja võrgustumisüritusel. Päeva jooksul arutati koostöövõimalusi, tööstuse arengusuundi ning jagati praktilisi kogemusi tootmisvaldkonnast.'
      },
      {
        title: 'Eesti Masinatööstuse Liidu 90. aastapäeva üritus',
        category: 'Võrgustik',
        date: '06.05',
        sortDate: '2026-05-06',
        image: '/blog/news5.webp',
        excerpt:
          'Osalesime Eesti Masinatööstuse Liidu 90. aastapäeva üritusel, kus kohtusid EML-i liikmed, partnerid ning valdkonna esindajad. Üritus keskendus sektori arengule ja koostööle.'
      }
    ]
  },
  en: {
    languageLabel: 'Vaheta eesti keelele',
    flagSrc: '/ee-flag.svg',
    languageSwitcherLabel: 'Choose language',
    heroHeadline: 'From concept to a confident investment decision',
    heroHeadlineMobile: 'From concept to a confident investment decision',
    nav: ['Services', 'About', 'News & Blog', 'Wheel.me'],
    headerTagline: <>Engineering partner<br />for your production</>,
    heroSubline: {
      start: <>We help automation integrators and manufacturers validate automation before assembly and commissioning - from robot motion and cycle times to production capacity or mix, PLC logic and equipment interaction.<br />This helps you </>,
      risk: 'reduce risks',
      afterRisk: ', ',
      mistakes: 'avoid costly mistakes',
      afterMistakes: ' and ',
      savings: 'save time and money',
      end: '.'
    },
    heroButton: 'Get a free consultation',
    heroSecondary: 'View services',
    contactButton: 'Discuss your project',
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
        image: '/project-plastic.webp',
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
        image: '/project-heavy.webp',
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
        image: '/project-food.webp',
        imageOverlay: '/project-food2.webp',
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
        image: '/project-logistics.webp',
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
        image: '/project-pellet.webp',
        imageOverlays: ['/project-pellet2.webp', '/project-pellet3.webp'],
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
      'We support automation integrators, machine builders and manufacturers with simulation, offline robot programming and virtual commissioning—from early concept validation to physical implementation.',
    servicesHero: {
      image: '/analysis1.webp',
      imageAlt: 'AutoCAD drawing and 3D layout comparison with forklift maneuverability analysis'
    },
    servicesQuestions: [
      'Will the system achieve the required cycle time and production capacity?',
      'How can I test PLC and robot logic before physical commissioning?',
      'Can robot programs be developed and tested offline?',
      'How can I validate a new factory or production line before investment?'
    ],
    serviceCardLabels: {
      validation: 'What we validate',
      outcome: 'Outcome'
    },
    serviceCta: 'Discuss your project',
    softwareTitle: 'Engineering software and tools',
    softwareIntro:
      'We combine specialized engineering tools to plan, simulate, program and validate production systems before implementation.',
    softwareLabel: 'Our engineering toolkit',
    softwareCapabilities: [
      {
        title: 'Visual Components',
        description:
          'We model production flows, capacity and robot cells, and create offline robot programs—including programs for welding robots.',
        tools: ['Visual Components']
      },
      {
        title: 'AutoCAD',
        description:
          'We create accurate 2D production layouts and technical drawings as a reliable basis for simulation and engineering.',
        tools: ['AutoCAD']
      },
      {
        title: 'AutoTURN',
        description:
          'We validate swept paths, turning radii and maneuvering space for forklifts, trucks and other vehicles.',
        tools: ['AutoTURN']
      },
      {
        title: 'ABB RobotStudio',
        description:
          'We program and simulate ABB robot cells, validating robot reach and cycle times.',
        tools: ['ABB RobotStudio']
      },
      {
        title: 'Siemens TIA Portal + PLCSIM',
        description:
          'We develop PLC programs and virtually test control logic and system behavior before physical startup.',
        tools: ['Siemens TIA Portal + PLCSIM']
      },
      {
        title: 'NVIDIA Omniverse',
        description:
          'We build large-scale, realistic digital twins, factory environments and connected industrial 3D workflows with NVIDIA Omniverse and Isaac Sim.',
        tools: ['NVIDIA Omniverse']
      },
      {
        title: 'Unreal Engine + Unity',
        description:
          'We create interactive visualizations, virtual factory environments and real-time 3D applications.',
        tools: ['Unreal Engine', 'Unity']
      }
    ],
    services: [
      {
        title: 'Planning a new factory or production line',
        problem: 'A wrong investment decision can create costly rework and bottlenecks after startup.',
        solutionLead: 'We create a 3D simulation of production to test equipment layout, material flows, operator movement and production volumes.',
        solutionPoints: [
          'Equipment layout, material flows and operator movement',
          'Production volumes and cycle times',
          'AGV/AMR movement paths, turning radii and required safety areas'
        ],
        impact: [
          'Helps achieve higher productivity from the start',
          'Reduces the risk of production downtime after layout changes',
          'Avoids later rework caused by lack of space'
        ],
        ctaPrompt: 'Planning a new line or factory expansion?',
        comparisonImages: [
          {
            src: '/services/planning.webp',
            alt: 'New factory and production-line layout in a simulation model'
          }
        ]
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
        ctaPrompt: 'Want to find the real production constraints?',
        comparisonImages: [
          {
            src: '/project-food.webp',
            alt: 'Production-line performance metrics and process model',
            focus: 'lower'
          }
        ],
        overlayImage: {
          src: '/project-food2.webp',
          alt: 'Detailed production-line cycle-time and lead-time analysis'
        }
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
        ctaPrompt: 'Planning a new automation solution?',
        comparisonImages: [
          {
            src: '/services/comparison-1.webp',
            sources: [
              { src: '/services/comparison-1-760.webp', width: 760 },
              { src: '/services/comparison-1.webp', width: 1054 }
            ],
            alt: 'Manual production process with operators in a simulation model'
          },
          {
            src: '/services/comparison-2.webp',
            sources: [
              { src: '/services/comparison-2-760.webp', width: 760 },
              { src: '/services/comparison-2.webp', width: 1054 }
            ],
            alt: 'Automated robot cell with safety fencing and conveyors in a simulation model'
          }
        ]
      },
      {
        title: 'Offline robot programming',
        problem: 'Robot programming on physical equipment takes valuable production and commissioning time, while unexpected reachability, collision and sequencing issues can cause delays during startup.',
        validationLabel: 'What we program',
        solutionLead: 'During offline robot programming, we create and test robot programs in a virtual environment based on the planned robot cell, tooling and process requirements before transferring them to the physical robot.',
        solutionPoints: [
          'Robot programs based on the planned robot cell',
          'Tooling, paths and process sequences tested virtually',
          'Program preparation before transfer to the physical robot'
        ],
        impact: [
          'Reduces programming time on the factory floor',
          'Shortens installation and commissioning',
          'Provides a tested robot program ready for final on-site calibration'
        ],
        ctaPrompt: 'Ready to reduce on-site robot programming time?',
        comparisonImages: [
          {
            src: '/services/olp-1.webp',
            alt: 'Offline robot programming cell model in a virtual environment',
            imageClassName: '-scale-x-100 bg-[#d8d8d6] object-cover object-[68%_16%]'
          }
        ],
        overlayImage: {
          src: '/services/olp-2.webp',
          alt: 'Offline robot programming program view',
          className: 'top-0 right-0 h-[160%] w-[36%] sm:w-[35%] lg:w-[34%]',
          imageClassName: 'h-full w-full object-cover object-top'
        }
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
        comparisonImages: [
          {
            src: '/services/vc.webp',
            alt: 'Virtual commissioning system model and control-logic validation',
            imageClassName: 'scale-100 bg-[#d6d9dc] object-contain object-top'
          }
        ]
      }
    ],
    clientLogosTitle: 'Clients',
    clientLogosIntro: 'Companies we have worked with',
    contactTitle: 'Let’s work together!',
    contactText: 'Start with a short call to clarify your project, risks and next decisions.',
    contactFormTitle: 'Get a free consultation',
    contactFormText: 'Send us a message and we will jump on a call to discuss your project and the right simulation or validation path.',
    form: {
      name: 'Name',
      email: 'Email',
      description: 'Project description',
      placeholders: {
        name: 'Your name',
        email: 'Your email',
        description: 'Describe your project in a few words'
      },
      send: 'Send',
      sending: 'Sending…',
      success: 'Thank you! We’ll reply soon!',
      error: 'The message could not be sent. Please try again or email us directly.',
      directEmail: 'Email us directly',
      privacyNotice: {
        before: 'When you send this form, we process the information you provide only to respond to your inquiry (',
        link: 'Privacy Policy',
        after: ').'
      },
      validation: {
        nameRequired: 'Please enter your name.',
        emailRequired: 'Please enter your email address.',
        emailInvalid: 'Please enter a valid email address.',
        descriptionRequired: 'Please describe your project.',
        descriptionShort: 'Please enter at least 5 characters.'
      }
    },
    aboutTitle: 'About',
    teamTitle: 'Team',
    team: [
      { name: 'Steven', role: 'CEO', credentials: 'Mechanical engineer (BSc)', image: '/team/steven.webp', linkedin: 'https://www.linkedin.com/in/steven-strandberg/' },
      { name: 'Hans', role: 'Simulation engineer', credentials: 'Industrial engineering and management (MSc)', image: '/team/hans.webp' },
      { name: 'Markus', role: 'Project engineer', credentials: 'Robotics and automation engineer (MSc)', image: '/team/markus.webp' }
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
        hero: '/wheelme/wheelme_0792.webp',
        heroMobile: '/wheelme/wheelme_0792-mobile.webp',
        detail: '/wheelme/_dsc3066.webp',
        concept: '/wheelme/wheelme1.webp',
        power: '/wheelme/power-station-close-by.webp'
      }
    },
    contacts: 'Contacts',
    privacy: {
      title: 'Privacy Policy',
      breadcrumb: 'Privacy Policy',
      updated: 'Last updated: 07.07.2026',
      intro:
        'This Privacy Policy explains how Factory Simulation OÜ processes information sent through the website contact forms.',
      sections: [
        {
          title: 'Controller',
          paragraphs: [
            'Controller: Factory Simulation OÜ.',
            'Registry code: 17384619,.',
            'Address: Okka tee 2, 46607, Piira, Estonia.',
            'Email: info@factorysimulation.eu.'
          ]
        },
        {
          title: 'What information we process',
          paragraphs: [
            'Through the contact form, we process your name, email address, message content, form source and technical information needed to deliver the form securely and reduce spam.'
          ]
        },
        {
          title: 'Purpose and legal basis',
          paragraphs: [
            'We process the information to respond to your inquiry, discuss a possible project and contact you at your request. The legal basis is taking steps before entering into a contract at your request or our legitimate interest in responding to business inquiries.'
          ]
        },
        {
          title: 'Who receives the information',
          paragraphs: [
            'The information is seen only by Factory Simulation people who respond to inquiries. Technically, the information passes through our website hosting and email service provider, Zone.ee.'
          ]
        },
        {
          title: 'How long we keep the information',
          paragraphs: [
            'We keep inquiries for as long as reasonably needed to respond, prepare possible cooperation and maintain normal business communication history. If an inquiry does not lead to cooperation, we delete or archive it within a reasonable time unless the law requires longer retention.'
          ]
        },
        {
          title: 'Marketing and newsletters',
          paragraphs: [
            'Contact form information is not used to send newsletters or add you to a separate marketing list without separate voluntary consent.'
          ]
        },
        {
          title: 'Your rights',
          paragraphs: [
            'You have the right to request access to your data, ask for correction or deletion, restrict processing and object to processing. You also have the right to lodge a complaint with the Estonian Data Protection Inspectorate.'
          ]
        }
      ]
    },
    faq: {
      metaTitle: 'Factory Simulation FAQ | Factory Simulation Services',
      metaDescription:
        'Learn how manufacturing simulation helps test production flow, capacity, layouts, automation concepts and investment scenarios before making physical changes.',
      breadcrumb: 'Factory Simulation FAQ',
      eyebrow: 'Factory Simulation FAQ',
      title: 'Manufacturing Simulation FAQ',
      intro: [
        'Simulation helps manufacturing companies test production layouts, material flows, automation concepts and capacity scenarios before making physical changes or investment decisions.',
        'Below are answers to common questions about how simulation works, how accurate it is and when it creates the most value.'
      ],
      teaser: {
        eyebrow: 'Frequently asked questions',
        title: 'Better production decisions start with better questions',
        intro:
          'Short answers about simulation accuracy, use cases, automation decisions and when manufacturing simulation creates value.',
        link: 'Explore the full FAQ'
      },
      cta: {
        title: 'Want to test a production idea before investing?',
        text: 'Let us review the process, input data and decision the simulation should support.',
        button: 'Discuss your project'
      },
      items: [
        {
          question: 'What is simulation in manufacturing?',
          answer: [
            'Simulation in manufacturing means building a digital model of a production process, line, cell or factory area.',
            'The model is used to test how materials, people, machines, buffers and transport systems work together before changes are made in real life. The goal is to understand production flow, capacity, bottlenecks and investment risks before committing time and money.'
          ]
        },
        {
          question: 'How does simulation work?',
          answer: [
            'A production simulation usually starts with process mapping, layout information and input data.',
            'Typical input data includes cycle times, product mix, operator tasks, machine capacity, transport routes, shift patterns, buffers and changeovers. These inputs are used to build a digital model where different production scenarios can be tested and compared.',
            'The output is not only a visual model. It is a decision-support tool that helps understand what happens when the layout, resources, process logic or automation concept changes.'
          ]
        },
        {
          question: 'How accurate are simulations?',
          answer: [
            'Simulations are decision-support models, not exact one-to-one copies of reality.',
            'Accuracy depends on the quality of input data - similar to artificial intelligence, the output is only as good as the data and assumptions behind it. If cycle times, process logic, product mix, operator tasks, buffers and material flows are realistic, the simulation can provide valuable insight for comparing scenarios and supporting decisions.',
            'In most cases, the main value comes from understanding how different parts of the production system interact, identifying bottlenecks and testing whether a planned change is likely to improve the whole flow before it is implemented.',
            'For example, a simulation can help compare whether a production line performs better with a different layout, buffer size, operator allocation, transport logic or automation concept.'
          ]
        },
        {
          question: 'Do you sell simulation software or provide simulation services?',
          answer: [
            'We provide engineering and simulation services, not our own simulation software.',
            'Our work includes understanding the production problem, collecting input data, building the simulation model, testing scenarios, interpreting the results and turning the findings into practical engineering recommendations.',
            'Simulation software is the tool. The value comes from how the model is built, what scenarios are tested and how the results are used to support layout, automation, capacity or investment decisions.'
          ]
        },
        {
          question: 'When should you use manufacturing simulation?',
          answer: [
            'Manufacturing simulation is useful before major layout changes, automation investments, capacity increases, factory relocations, new product introductions or changes in product mix.',
            'It is especially valuable when the decision is expensive, difficult to reverse or includes several uncertain variables. Simulation helps test the idea before physical changes are made or supplier offers are requested.',
            'Typical use cases include:'
          ],
          points: [
            'new production line planning',
            'factory layout changes',
            'bottleneck analysis',
            'robot and automation concept validation',
            'internal logistics and material flow analysis',
            'operator and machine utilisation analysis',
            'capacity and throughput studies'
          ]
        },
        {
          question: 'How can simulation help reduce bottlenecks?',
          answer: [
            'Simulation helps show where queues, waiting times, overloaded operators, underused machines, transport delays or buffer problems appear in the production flow.',
            'By testing different scenarios, it becomes possible to compare layout changes, buffer sizes, staffing levels, automation options and process sequences before making physical changes.',
            'Instead of guessing where the bottleneck might be, simulation gives a visual and data-based way to test how the whole system reacts to changes.'
          ]
        },
        {
          question: 'Can simulation support automation investment decisions?',
          answer: [
            'Yes. Simulation can help test whether a planned automation concept has enough capacity, where it may create new bottlenecks, how many robots or operators may be needed and whether the expected throughput improvement is realistic.',
            'This helps reduce investment risk before requesting final supplier offers, buying equipment or changing the production layout.',
            'Simulation is especially useful when comparing manual, semi-automated and automated scenarios side by side.'
          ]
        },
        {
          question: 'Can you work remotely with international customers?',
          answer: [
            'Yes. We can support manufacturing companies remotely, regardless of where the production site is located.',
            'The first step is usually an online discussion to understand the production challenge, planned investment or automation idea. After that, the customer can share available input such as layout drawings, process videos, photos, cycle times, product mix, operator tasks and production data.',
            'Based on this information, we can build an initial simulation model, compare scenarios and review the results together online. This helps the customer understand bottlenecks, capacity limits and improvement options before committing to physical changes, supplier offers or equipment investments.',
            'If more detail is needed, the next step can include additional data collection, more precise process measurements or cooperation with the customer’s engineering, production or automation team.',
            'We also cooperate with engineering and automation partners in Europe, including Italy and Switzerland. When a project requires local know-how, implementation support or additional technical expertise, we can involve trusted partners depending on the project scope and customer needs.'
          ]
        },
        {
          question: 'Can you explain simulation with a real-life example?',
          answer: [
            'If a team buys the best striker, does that automatically make it the best team? Not necessarily. The striker may be excellent, but the result still depends on how the midfield creates chances, how the defence handles pressure, how the team moves together and whether the whole system works.',
            'The same logic applies in manufacturing.',
            'Buying one expensive machine, robot or automation system does not automatically improve the whole production flow. If the next process is too slow, if material supply is unstable or if operators are waiting between steps, the new machine may simply move the bottleneck somewhere else.',
            'Simulation helps look at the full system before investment. It shows how machines, people, buffers, transport and process steps work together, so the company can understand whether the planned change improves the whole production chain - not just one isolated operation.'
          ]
        },
        {
          question: 'What is Automation 2.0?',
          answer: [
            'Automation 2.0 means moving from isolated automation projects towards a more connected, simulation-driven and lifecycle-based approach to industrial automation.',
            'In practice, this means automation is not only designed and tested during implementation. It is already validated earlier through simulation, digital models, robot concepts, cycle time analysis, virtual commissioning and production flow testing.',
            'The goal is to reduce late-stage changes, avoid costly mistakes and make automation decisions with more confidence before systems go live.'
          ]
        },
        {
          question: 'What is a digital twin?',
          answer: [
            'A digital twin is a digital representation of a real production process, line, machine, factory area or even an entire factory.',
            'In manufacturing, a digital twin can be used to visualize production data, monitor performance, understand material flow and test different improvement ideas in a digital environment. Depending on the level of detail, it can include layout information, machines, operators, cycle times, transport routes, buffers, sensor data, OEE data or ERP/MES information.',
            'A simple simulation model is usually built to test scenarios and support decisions. A digital twin can go one step further by connecting the model with real production data and using it for data visualization, monitoring, analysis and continuous improvement.',
            'The main value is that managers, engineers and production teams can see what is happening in the production system more clearly - not only through spreadsheets, but through a visual and data-based model.'
          ]
        }
      ]
    },
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
        image: '/blog/news1.webp',
        excerpt:
          'We completed a practical training program covering industrial robot programming (offline and online) and the application of machine vision solutions in production. The training focused on robot programming and the use of vision systems in automated production processes.'
      },
      {
        title: 'Smart Industry Conference 2026',
        category: 'Conference',
        date: '19.03',
        sortDate: '2026-03-19',
        image: '/blog/news2.webp',
        excerpt:
          'We attended the Smart Industry conference, where industrial digitalization, automation and future solutions were discussed. The event also included the announcement of “Factory of the Year 2026”.'
      },
      {
        title: 'wheel.me factory visit and training in Norway',
        category: 'Partnership',
        date: '06.04 – 07.04',
        sortDate: '2026-04-07',
        image: '/blog/news3.webp',
        excerpt:
          'We visited wheel.me’s production facility in Norway and took part in technical training on autonomous mobile robot solutions. The visit covered practical use cases, configuration and different industrial applications.'
      },
      {
        title: 'Finnish–Estonian machinery industry seminar',
        category: 'Seminar',
        date: '22.04',
        sortDate: '2026-04-22',
        image: '/blog/news4.webp',
        excerpt:
          'We participated in a machinery industry seminar and networking event held as part of the Finnish and Estonian Sheet Metal Days. The day focused on cooperation opportunities, industry development trends and practical production experience.'
      },
      {
        title: '90th anniversary event of the Federation of Estonian Engineering Industry',
        category: 'Network',
        date: '06.05',
        sortDate: '2026-05-06',
        image: '/blog/news5.webp',
        excerpt:
          'We attended the 90th anniversary event of the Federation of Estonian Engineering Industry, bringing together EML members, partners and industry representatives. The event focused on sector development and cooperation.'
      }
    ]
  }
};

content.de = {
  ...content.en,
  languageLabel: 'Sprache wechseln',
  flagSrc: '/de-flag.svg',
  languageSwitcherLabel: 'Sprache auswählen',
  heroHeadline: 'Vom Konzept zur sicheren Investitionsentscheidung',
  heroHeadlineMobile: <>Vom Konzept zur sicheren<br />Investitionsentscheidung</>,
  nav: ['Leistungen', 'Über uns', 'News & Blog', 'Wheel.me'],
  headerTagline: <>Engineering-Partner<br />für Ihre Produktion</>,
  heroSubline: {
    start: <>Wir helfen Automatisierungsintegratoren und Produktionsunternehmen, Automatisierung vor Montage und Inbetriebnahme virtuell zu validieren - von Roboterbewegung und Zykluszeiten bis zu Produktionskapazität, PLC-Logik und Zusammenspiel der Anlagen.<br />So können Sie </>,
    risk: 'Risiken reduzieren',
    afterRisk: ', ',
    mistakes: 'kostspielige Fehler vermeiden',
    afterMistakes: ' und ',
    savings: 'Zeit und Geld sparen',
    end: '.'
  },
  heroButton: 'Kostenlose Beratung anfragen',
  heroSecondary: 'Leistungen ansehen',
  contactButton: 'Kostenlose Beratung',
  search: {
    label: 'Suchen',
    placeholder: 'Suchen nach...',
    breadcrumb: 'Suche',
    resultsTitle: 'Suchergebnisse',
    loading: 'Suchergebnisse werden geladen...',
    noResults: 'Leider wurden keine passenden Ergebnisse gefunden. Bitte versuchen Sie es mit anderen Suchbegriffen.',
    blogLink: 'Weitere News lesen',
    latestTitle: 'Unsere neuesten News',
    readMore: 'Weiterlesen',
    contactTitle: 'Keine Antwort gefunden?',
    contactText: 'Senden Sie uns Ihre Frage direkt, und wir prüfen gemeinsam, wie wir helfen können.'
  },
  projectsTitle: 'Projekte',
  projectIntro:
    'Beispiele für Projekte, bei denen Simulationen und digitale Modelle geholfen haben, sicherere Produktionsentscheidungen vor teuren physischen Änderungen zu treffen.',
  projectCardLabels: {
    solution: 'Lösung',
    results: 'Ergebnisse'
  },
  projects: [
    {
      ...content.en.projects[0],
      title: 'Kunststoffproduktion',
      problem: 'Der Einfluss neuer Prüfanlagen auf die Produktion musste vor der Investition bewertet werden, um Engpässe, Stillstände und spätere Layoutänderungen zu vermeiden.',
      solution: 'Die Montage, Prüfung und Verpackung von Steckdosen wurde modelliert, und verschiedene Produktionsszenarien wurden vor der Beschaffung der Anlagen simuliert.',
      results: [
        'Validierte Produktionskapazität vor Ankunft der Anlagen',
        'Kritische Engpässe und Zykluszeitgrenzen identifiziert',
        'Solide Grundlage für Ausschreibungen an Anlagenlieferanten',
        'Schnellerer Projektstart und bessere Produktionsplanung',
        'Kostspielige Änderungen nach der Umsetzung vermieden'
      ]
    },
    {
      ...content.en.projects[1],
      title: 'Schwerindustrie',
      problem: 'Die Neuplanung einer 18.000 m² großen Produktionshalle erforderte einen genauen Überblick über die bestehende Umgebung und die Sicherheit, dass neue Anlagenlayouts vor der physischen Installation funktionieren.',
      solution: 'Die gesamte Fabrik wurde per Laserscan erfasst, eine genaue DWG-Grundlage erstellt und verschiedene Layout- und Logistikszenarien simuliert.',
      results: [
        'Genaue digitale Grundlage für die gesamte Engineering-Arbeit',
        'Validierte Anlagenlayouts vor der Investition',
        'Schnellere und sicherere Neuplanung der Fabrik',
        'Logistikkonflikte und Platzprobleme vermieden',
        'Solider technischer Überblick über die gesamte Produktionsumgebung'
      ]
    },
    {
      ...content.en.projects[2],
      title: 'Lebensmittelindustrie',
      problem: 'Wartezeiten, ungleichmäßiger Fluss und Engpässe im Produktionsprozess begrenzten den Durchsatz und führten zu einem instabilen Produktionsrhythmus.',
      solution: 'Der gesamte Produktionsprozess wurde modelliert, kritische Schritte wurden analysiert und verschiedene Automatisierungs- und Prozessausgleichsszenarien getestet.',
      results: [
        'Stabiler Materialfluss über den gesamten Prozess',
        'Gleichmäßiger Produktionsrhythmus und kontrollierte Zykluszeiten',
        'Definierte Puffergrößen für kritische Prozessschritte',
        'Automatisierte Arbeitsschritte zur Steigerung der Produktionseffizienz',
        'Virtuelle Umgebung für schnelles Testen von Szenarien'
      ]
    },
    {
      ...content.en.projects[3],
      title: 'Lagerlogistik',
      problem: 'Materialbewegungen und interne Logistik verursachten unnötige Transporte, Wartezeiten und ungleichmäßige Auslastung im Produktionsprozess.',
      solution: 'AGV/AMR-Routen, Arbeitsabläufe der Bediener und Materialbewegungen wurden simuliert, um eine stabile interne Logistik ohne physische Testläufe zu erreichen.',
      results: [
        'Optimierte AGV/AMR-Fahrwege',
        'Stabiler und reibungsloser Materialfluss über die gesamte Linie',
        'Ausgeglichene Auslastung von Bedienern und Lagermitarbeitern',
        'Weniger unnötige Bewegung und Wartezeiten',
        'Validierte Logistik vor physischen Änderungen'
      ]
    },
    {
      ...content.en.projects[4],
      title: 'Pelletwerk',
      problem: 'Der Fabrik fehlte ein aktueller digitaler Überblick über die Produktionsumgebung, wodurch künftige Entwicklungs- und Investitionsplanung langsam und riskant wurde.',
      solution: 'Das gesamte Pelletwerk wurde per Laserscan erfasst und zu einem detaillierten digitalen Modell für Produktionsvisualisierung, Planung und Datenintegration modelliert.',
      results: [
        'Genaue Punktwolke, Modelle und Zeichnungen der gesamten Fabrikumgebung',
        'Solide Grundlage für die Planung künftiger Investitionen',
        'Visueller Überblick über komplexe Produktionsprozesse',
        'Bereitschaft zur Integration von Produktionsdaten',
        'Digitale Plattform für weitere Optimierung'
      ]
    }
  ],
  servicesTitle: 'Leistungen',
  servicesIntro:
    'Wir unterstützen Automatisierungsintegratoren, Maschinenbauer und Produktionsunternehmen mit Simulation, Offline-Roboterprogrammierung und virtueller Inbetriebnahme - von der frühen Konzeptvalidierung bis zur physischen Umsetzung.',
  servicesHero: {
    ...content.en.servicesHero,
    imageAlt: 'Vergleich von AutoCAD-Zeichnung und 3D-Layout mit Analyse der Stapler-Manövrierfähigkeit'
  },
  servicesQuestions: [
    'Erreicht das System die geforderte Zykluszeit und Produktionskapazität?',
    'Wie kann ich PLC- und Roboterlogik vor der physischen Inbetriebnahme testen?',
    'Können Roboterprogramme offline entwickelt und getestet werden?',
    'Wie kann ich eine neue Fabrik oder Produktionslinie vor der Investition validieren?'
  ],
  serviceCardLabels: {
    validation: 'Was wir validieren',
    outcome: 'Ergebnis'
  },
  serviceCta: 'Projekt besprechen',
  softwareTitle: 'Engineering-Software und Tools',
  softwareIntro:
    'Wir kombinieren spezialisierte Engineering-Tools, um Produktionssysteme vor der Umsetzung zu planen, zu simulieren, zu programmieren und zu validieren.',
  softwareLabel: 'Unser Engineering-Toolkit',
  softwareCapabilities: [
    {
      ...content.en.softwareCapabilities[0],
      description:
        'Wir modellieren Produktionsflüsse, Kapazitäten und Roboterzellen und erstellen Offline-Roboterprogramme - einschließlich Programme für Schweißroboter.'
    },
    {
      ...content.en.softwareCapabilities[1],
      description:
        'Wir erstellen genaue 2D-Produktionslayouts und technische Zeichnungen als verlässliche Grundlage für Simulation und Engineering.'
    },
    {
      ...content.en.softwareCapabilities[2],
      description:
        'Wir validieren Schleppkurven, Wenderadien und Manövrierflächen für Stapler, Lkw und andere Fahrzeuge.'
    },
    {
      ...content.en.softwareCapabilities[3],
      description:
        'Wir programmieren und simulieren ABB-Roboterzellen und validieren Reichweite und Zykluszeiten der Roboter.'
    },
    {
      ...content.en.softwareCapabilities[4],
      description:
        'Wir entwickeln PLC-Programme und testen Steuerungslogik sowie Systemverhalten virtuell vor dem physischen Start.'
    },
    {
      ...content.en.softwareCapabilities[5],
      description:
        'Wir bauen großskalige, realistische digitale Zwillinge, Fabrikumgebungen und vernetzte industrielle 3D-Workflows mit NVIDIA Omniverse und Isaac Sim.'
    },
    {
      ...content.en.softwareCapabilities[6],
      description:
        'Wir erstellen interaktive Visualisierungen, virtuelle Fabrikumgebungen und Echtzeit-3D-Anwendungen.'
    }
  ],
  services: [
    {
      ...content.en.services[0],
      title: 'Planung einer neuen Fabrik oder Produktionslinie',
      problem: 'Eine falsche Investitionsentscheidung kann nach dem Start teure Nacharbeit und Engpässe verursachen.',
      solutionLead: 'Wir erstellen eine 3D-Simulation der Produktion, um Anlagenlayout, Materialflüsse, Bedienerbewegungen und Produktionsvolumen zu testen.',
      solutionPoints: [
        'Anlagenlayout, Materialflüsse und Bedienerbewegungen',
        'Produktionsvolumen und Zykluszeiten',
        'AGV/AMR-Fahrwege, Wenderadien und erforderliche Sicherheitsbereiche'
      ],
      impact: [
        'Hilft, von Anfang an höhere Produktivität zu erreichen',
        'Reduziert das Risiko von Produktionsstillständen nach Layoutänderungen',
        'Vermeidet spätere Nacharbeit durch Platzmangel'
      ],
      ctaPrompt: 'Planen Sie eine neue Linie oder Fabrikerweiterung?',
      comparisonImages: content.en.services[0].comparisonImages.map((image) => ({
        ...image,
        alt: 'Layout einer neuen Fabrik und Produktionslinie in einem Simulationsmodell'
      }))
    },
    {
      ...content.en.services[1],
      title: 'Produktivität in einer bestehenden Fabrik oder Linie steigern',
      problem: 'Die Produktion erreicht den geplanten Durchsatz nicht, Stillstände werden teuer und vorhandene Ressourcen werden nicht vollständig genutzt.',
      solutionLead: 'Wir nutzen Simulation, um die tatsächlichen Einschränkungen zu finden und Verbesserungen zu testen, bevor die Produktion verändert wird.',
      solutionPoints: [
        'Engpässe und Auslastung von Arbeitsstationen',
        'Einfluss von Schichten auf den Durchsatz',
        'Logistische Einschränkungen',
        'Optimierung von Produktionsfluss, Arbeitsstationen und Logistik'
      ],
      impact: [
        'Mehr Durchsatz aus vorhandenen Ressourcen',
        'Kürzere Zykluszeiten und weniger Stillstände',
        'Klarer Blick auf die tatsächlichen Produktionsgrenzen'
      ],
      ctaPrompt: 'Möchten Sie die tatsächlichen Produktionsgrenzen finden?',
      comparisonImages: content.en.services[1].comparisonImages.map((image) => ({
        ...image,
        alt: 'Leistungskennzahlen einer Produktionslinie und Prozessmodell'
      })),
      overlayImage: {
        ...content.en.services[1].overlayImage,
        alt: 'Detaillierte Analyse von Zykluszeit und Durchlaufzeit einer Produktionslinie'
      }
    },
    {
      ...content.en.services[2],
      title: 'Roboter und Automatisierung vor dem Rollout validieren',
      problem: 'Schlecht umgesetzte Automatisierung kann Produktionsstillstände und teure Nacharbeit verursachen.',
      solutionLead: 'Wir testen virtuell Roboterreichweite, Taktzeiten, Sequenzen und die Interaktion mit der restlichen Produktion.',
      solutionPoints: [
        'Roboterreichweite und Zugänglichkeit',
        'Taktzeiten und Zyklusabfolgen',
        'Interaktion mit Bedienern, Anlagen und Logistik',
        'Validierung geeigneter Automatisierungskonzepte'
      ],
      impact: [
        'Testen ohne Produktionsstillstand',
        'Geringeres Risiko teurer Änderungen nach dem Rollout',
        'Detaillierter Input für Systemintegratoren',
        'Schnellere Inbetriebnahme'
      ],
      ctaPrompt: 'Planen Sie eine neue Automatisierungslösung?',
      comparisonImages: content.en.services[2].comparisonImages.map((image, index) => ({
        ...image,
        alt: [
          'Manueller Produktionsprozess mit Bedienern in einem Simulationsmodell',
          'Automatisierte Roboterzelle mit Sicherheitszaun und Förderern in einem Simulationsmodell'
        ][index]
      }))
    },
    {
      ...content.en.services[3],
      title: 'Offline-Roboterprogrammierung',
      problem: 'Roboterprogrammierung an physischen Anlagen kostet wertvolle Produktions- und Inbetriebnahmezeit, während unerwartete Probleme mit Erreichbarkeit, Kollisionen und Sequenzen beim Start Verzögerungen verursachen können.',
      validationLabel: 'Was wir programmieren',
      solutionLead: 'Bei der Offline-Roboterprogrammierung erstellen und testen wir Roboterprogramme in einer virtuellen Umgebung auf Basis der geplanten Roboterzelle, Werkzeuge und Prozessanforderungen, bevor sie auf den physischen Roboter übertragen werden.',
      solutionPoints: [
        'Roboterprogramme auf Basis der geplanten Roboterzelle',
        'Werkzeuge, Bahnen und Prozesssequenzen virtuell getestet',
        'Programmvorbereitung vor der Übertragung auf den physischen Roboter'
      ],
      impact: [
        'Reduziert Programmierzeit auf dem Shopfloor',
        'Verkürzt Installation und Inbetriebnahme',
        'Liefert ein getestetes Roboterprogramm, bereit für die finale Kalibrierung vor Ort'
      ],
      ctaPrompt: 'Möchten Sie die Roboterprogrammierung vor Ort reduzieren?',
      comparisonImages: content.en.services[3].comparisonImages.map((image) => ({
        ...image,
        alt: 'Zellmodell für Offline-Roboterprogrammierung in einer virtuellen Umgebung'
      })),
      overlayImage: {
        ...content.en.services[3].overlayImage,
        alt: 'Programmierungsansicht für Offline-Roboterprogrammierung'
      }
    },
    {
      ...content.en.services[4],
      title: 'Virtuelle Inbetriebnahme',
      problem: 'Die Systeminbetriebnahme ist eine der letzten Phasen in Automatisierungsprojekten. Genau dort entstehen jedoch häufig Verzögerungen und Nacharbeit durch Fehler in der Steuerungslogik und unerwartete Prozesssituationen.',
      solutionLead: 'Bei der virtuellen Inbetriebnahme verbinden wir reale PLC- und Roboterprogramme mit dem virtuellen Modell des Systems, damit der Betrieb des gesamten Systems vor dem physischen Start getestet werden kann.',
      solutionPoints: [
        'Digitales Modell verbunden mit Steuerungscode und Entwicklungsumgebung',
        'Echtzeitvalidierung von PLC-Signalen, Sensoren und Aktoren',
        'Frühes Testen von Maschinencode und Prozesssequenzen'
      ],
      impact: [
        'Verkürzt die Inbetriebnahmephase, in der Änderungen am teuersten sind',
        'Reduziert das Risiko, fehlerhafte Steuerungssoftware einzusetzen',
        'Verbessert die Softwarequalität, bevor sie die Produktion erreicht'
      ],
      ctaPrompt: 'Validieren Sie Ihr System vor dem Start',
      comparisonImages: content.en.services[4].comparisonImages.map((image) => ({
        ...image,
        alt: 'Systemmodell für virtuelle Inbetriebnahme und Validierung der Steuerungslogik'
      }))
    }
  ],
  clientLogosTitle: 'Kunden',
  clientLogosIntro: 'Unternehmen, mit denen wir gearbeitet haben',
  contactTitle: 'Lassen Sie uns zusammenarbeiten!',
  contactText: 'Starten wir mit einem kurzen Gespräch, um Ihr Projekt, die Risiken und die nächsten Entscheidungen zu klären.',
  contactFormTitle: 'Kostenlose Beratung anfragen',
  contactFormText: 'Senden Sie uns eine Nachricht, und wir vereinbaren ein Gespräch, um Ihr Projekt und den passenden Simulations- oder Validierungsansatz zu besprechen.',
  form: {
    name: 'Name',
    email: 'E-Mail',
    description: 'Projektbeschreibung',
    placeholders: {
      name: 'Ihr Name',
      email: 'Ihre E-Mail',
      description: 'Beschreiben Sie Ihr Projekt in wenigen Worten'
    },
    send: 'Senden',
    sending: 'Wird gesendet...',
    success: 'Vielen Dank! Wir melden uns bald!',
    error: 'Die Nachricht konnte nicht gesendet werden. Bitte versuchen Sie es erneut oder schreiben Sie uns direkt.',
    directEmail: 'Direkt per E-Mail schreiben',
    privacyNotice: {
      before: 'Wenn Sie dieses Formular absenden, verarbeiten wir Ihre Angaben nur zur Beantwortung Ihrer Anfrage (',
      link: 'Datenschutzerklärung',
      after: ').'
    },
    validation: {
      nameRequired: 'Bitte geben Sie Ihren Namen ein.',
      emailRequired: 'Bitte geben Sie Ihre E-Mail-Adresse ein.',
      emailInvalid: 'Bitte geben Sie eine gültige E-Mail-Adresse ein.',
      descriptionRequired: 'Bitte beschreiben Sie Ihr Projekt.',
      descriptionShort: 'Bitte geben Sie mindestens 5 Zeichen ein.'
    }
  },
  aboutTitle: 'Über uns',
  teamTitle: 'Team',
  team: [
    { ...content.en.team[0], role: 'CEO', credentials: 'Maschinenbauingenieur (BSc)' },
    { ...content.en.team[1], role: 'Simulationsingenieur', credentials: 'Wirtschaftsingenieurwesen und Management (MSc)' },
    { ...content.en.team[2], role: 'Projektingenieur', credentials: 'Robotik- und Automatisierungsingenieur (MSc)' }
  ],
  partnersTitle: 'Partner und Netzwerk',
  reseller: 'Offizieller Vertriebspartner und Integrationspartner',
  wheelmeText: 'Wheel.me ist das weltweit erste autonome Rad, das jedes Objekt in einen mobilen Roboter verwandelt',
  wheelmePrompt: 'Finden Sie heraus, wie die Wheel.me-Lösung zu Ihren Geschäftsanforderungen passt',
  wheelmeButton: 'Kontakt aufnehmen',
  wheelmeLearnMore: 'Mehr erfahren',
  wheelmePage: {
    ...content.en.wheelmePage,
    title: 'Autonome interne Logistik mit Wheel.me',
    breadcrumb: 'Wheel.me',
    resellerText: 'Factory Simulation ist offizieller Wheel.me-Vertriebspartner und Integrationspartner in Estland.',
    intro:
      'Die autonome mobile Roboterlösung von Wheel.me ermöglicht es, vorhandene Wagen, Regale, Werkbänke und andere interne Logistikausrüstung in intelligente selbstfahrende Roboter zu verwandeln.',
    paragraphs: [
      'Das System hilft, Materialtransporte in Produktion und Lager zu automatisieren, ohne komplexe Fördertechnik oder spezielle AMR-Wagen.',
      'Wheel.me-Roboter bewegen sich autonom in einer zuvor kartierten Umgebung, vermeiden Hindernisse und ermöglichen eine flexible und skalierbare interne Logistiklösung. Das System ist für Produktionsunternehmen konzipiert, die manuelle Transporte reduzieren, Arbeitsabläufe optimieren und die Stabilität des Materialflusses verbessern möchten.',
      'In Kombination mit Simulation und Produktionsanalyse hilft Wheel.me, die Auswirkungen autonomer interner Logistik vor einer Investition zu validieren.'
    ],
    benefitsTitle: 'Die Lösung hilft Ihnen',
    benefits: [
      'Vorhandene Wagen und Plattformen automatisieren',
      'Zeit für manuelle Transporte reduzieren',
      'Stabilität und Durchsatz des Produktionsflusses erhöhen',
      'Logistikprozesse schnell umkonfigurieren',
      'Die Lösung Schritt für Schritt testen und skalieren'
    ],
    ctaTitle: 'Finden Sie heraus, ob Wheel.me zu Ihrer Produktion passt',
    ctaText: 'Lassen Sie uns Ihren Materialfluss, Engpässe und den passenden Umfang für ein Pilotprojekt prüfen.',
    ctaButton: 'Mit einem Spezialisten sprechen',
    authorizedReseller: 'Autorisierter Vertriebspartner'
  },
  contacts: 'Kontakt',
  privacy: {
    title: 'Datenschutzerklärung',
    breadcrumb: 'Datenschutzerklärung',
    updated: 'Zuletzt aktualisiert: 07.07.2026',
    intro:
      'Diese Datenschutzerklärung erklärt, wie Factory Simulation OÜ Informationen verarbeitet, die über die Kontaktformulare der Website gesendet werden.',
    sections: [
      {
        title: 'Verantwortlicher',
        paragraphs: [
          'Verantwortlicher: Factory Simulation OÜ.',
          'Registernummer: 17384619,.',
          'Adresse: Okka tee 2, 46607, Piira, Estland.',
          'E-Mail: info@factorysimulation.eu.'
        ]
      },
      {
        title: 'Welche Informationen wir verarbeiten',
        paragraphs: [
          'Über das Kontaktformular verarbeiten wir Ihren Namen, Ihre E-Mail-Adresse, den Nachrichteninhalt, die Formularquelle und technische Informationen, die erforderlich sind, um das Formular sicher zu übermitteln und Spam zu reduzieren.'
        ]
      },
      {
        title: 'Zweck und Rechtsgrundlage',
        paragraphs: [
          'Wir verarbeiten die Informationen, um Ihre Anfrage zu beantworten, ein mögliches Projekt zu besprechen und Sie auf Ihren Wunsch zu kontaktieren. Rechtsgrundlage ist die Durchführung vorvertraglicher Maßnahmen auf Ihre Anfrage hin oder unser berechtigtes Interesse an der Beantwortung geschäftlicher Anfragen.'
        ]
      },
      {
        title: 'Wer die Informationen erhält',
        paragraphs: [
          'Die Informationen werden nur von Personen bei Factory Simulation gesehen, die Anfragen beantworten. Technisch laufen die Informationen über unseren Website-Hosting- und E-Mail-Dienstleister Zone.ee.'
        ]
      },
      {
        title: 'Wie lange wir die Informationen aufbewahren',
        paragraphs: [
          'Wir bewahren Anfragen so lange auf, wie es vernünftigerweise erforderlich ist, um zu antworten, eine mögliche Zusammenarbeit vorzubereiten und die normale Geschäftskommunikation zu dokumentieren. Wenn eine Anfrage nicht zu einer Zusammenarbeit führt, löschen oder archivieren wir sie innerhalb angemessener Zeit, sofern keine längere gesetzliche Aufbewahrung erforderlich ist.'
        ]
      },
      {
        title: 'Marketing und Newsletter',
        paragraphs: [
          'Informationen aus dem Kontaktformular werden nicht verwendet, um Newsletter zu versenden oder Sie ohne separate freiwillige Einwilligung in eine gesonderte Marketingliste aufzunehmen.'
        ]
      },
      {
        title: 'Ihre Rechte',
        paragraphs: [
          'Sie haben das Recht, Auskunft über Ihre Daten zu verlangen, Berichtigung oder Löschung zu verlangen, die Verarbeitung einzuschränken und der Verarbeitung zu widersprechen. Außerdem haben Sie das Recht, eine Beschwerde bei der estnischen Datenschutzaufsichtsbehörde einzureichen.'
        ]
      }
    ]
  },
  faq: {
    metaTitle: 'Factory Simulation FAQ | Factory Simulation Leistungen',
    metaDescription:
      'Erfahren Sie, wie Fertigungssimulation hilft, Produktionsfluss, Kapazität, Layouts, Automatisierungskonzepte und Investitionsszenarien vor physischen Änderungen zu testen.',
    breadcrumb: 'Factory Simulation FAQ',
    eyebrow: 'Factory Simulation FAQ',
    title: 'FAQ zur Fertigungssimulation',
    intro: [
      'Simulation hilft Produktionsunternehmen, Produktionslayouts, Materialflüsse, Automatisierungskonzepte und Kapazitätsszenarien zu testen, bevor physische Änderungen oder Investitionsentscheidungen getroffen werden.',
      'Unten finden Sie Antworten auf häufige Fragen dazu, wie Simulation funktioniert, wie genau sie ist und wann sie den größten Wert schafft.'
    ],
    teaser: {
      eyebrow: 'Häufig gestellte Fragen',
      title: 'Bessere Produktionsentscheidungen beginnen mit besseren Fragen',
      intro:
        'Kurze Antworten zu Simulationsgenauigkeit, Anwendungsfällen, Automatisierungsentscheidungen und dazu, wann Fertigungssimulation Wert schafft.',
      link: 'Zur vollständigen FAQ'
    },
    cta: {
      title: 'Möchten Sie eine Produktionsidee vor der Investition testen?',
      text: 'Lassen Sie uns den Prozess, die Eingangsdaten und die Entscheidung prüfen, die die Simulation unterstützen soll.',
      button: 'Projekt besprechen'
    },
    items: [
      {
        question: 'Was ist Simulation in der Fertigung?',
        answer: [
          'Simulation in der Fertigung bedeutet, ein digitales Modell eines Produktionsprozesses, einer Linie, Zelle oder eines Fabrikbereichs zu erstellen.',
          'Das Modell wird genutzt, um zu testen, wie Materialien, Menschen, Maschinen, Puffer und Transportsysteme zusammenarbeiten, bevor Änderungen in der realen Produktion umgesetzt werden. Ziel ist es, Produktionsfluss, Kapazität, Engpässe und Investitionsrisiken zu verstehen, bevor Zeit und Geld gebunden werden.'
        ]
      },
      {
        question: 'Wie funktioniert Simulation?',
        answer: [
          'Eine Produktionssimulation beginnt üblicherweise mit Prozessaufnahme, Layoutinformationen und Eingangsdaten.',
          'Typische Eingangsdaten sind Zykluszeiten, Produktmix, Bedieneraufgaben, Maschinenkapazität, Transportrouten, Schichtmodelle, Puffer und Umrüstungen. Diese Eingaben werden genutzt, um ein digitales Modell zu erstellen, in dem verschiedene Produktionsszenarien getestet und verglichen werden können.',
          'Das Ergebnis ist nicht nur ein visuelles Modell. Es ist ein Werkzeug zur Entscheidungsunterstützung, das hilft zu verstehen, was passiert, wenn sich Layout, Ressourcen, Prozesslogik oder Automatisierungskonzept ändern.'
        ]
      },
      {
        question: 'Wie genau sind Simulationen?',
        answer: [
          'Simulationen sind Modelle zur Entscheidungsunterstützung, keine exakten Eins-zu-eins-Kopien der Realität.',
          'Die Genauigkeit hängt von der Qualität der Eingangsdaten ab - ähnlich wie bei künstlicher Intelligenz ist das Ergebnis nur so gut wie die Daten und Annahmen dahinter. Wenn Zykluszeiten, Prozesslogik, Produktmix, Bedieneraufgaben, Puffer und Materialflüsse realistisch sind, kann die Simulation wertvolle Erkenntnisse für den Vergleich von Szenarien und die Unterstützung von Entscheidungen liefern.',
          'In den meisten Fällen entsteht der Hauptwert daraus, zu verstehen, wie verschiedene Teile des Produktionssystems zusammenwirken, Engpässe zu identifizieren und zu testen, ob eine geplante Änderung wahrscheinlich den gesamten Fluss verbessert, bevor sie umgesetzt wird.',
          'Eine Simulation kann beispielsweise helfen zu vergleichen, ob eine Produktionslinie mit einem anderen Layout, einer anderen Puffergröße, Bedienerzuordnung, Transportlogik oder einem anderen Automatisierungskonzept besser funktioniert.'
        ]
      },
      {
        question: 'Verkaufen Sie Simulationssoftware oder bieten Sie Simulationsleistungen an?',
        answer: [
          'Wir bieten Engineering- und Simulationsleistungen an, nicht unsere eigene Simulationssoftware.',
          'Unsere Arbeit umfasst das Verstehen des Produktionsproblems, das Sammeln von Eingangsdaten, den Aufbau des Simulationsmodells, das Testen von Szenarien, die Interpretation der Ergebnisse und die Ableitung praktischer Engineering-Empfehlungen.',
          'Simulationssoftware ist das Werkzeug. Der Wert entsteht dadurch, wie das Modell aufgebaut wird, welche Szenarien getestet werden und wie die Ergebnisse zur Unterstützung von Layout-, Automatisierungs-, Kapazitäts- oder Investitionsentscheidungen genutzt werden.'
        ]
      },
      {
        question: 'Wann sollte man Fertigungssimulation einsetzen?',
        answer: [
          'Fertigungssimulation ist nützlich vor größeren Layoutänderungen, Automatisierungsinvestitionen, Kapazitätserhöhungen, Fabrikumzügen, der Einführung neuer Produkte oder Änderungen im Produktmix.',
          'Sie ist besonders wertvoll, wenn die Entscheidung teuer, schwer rückgängig zu machen ist oder mehrere unsichere Variablen enthält. Simulation hilft, die Idee zu testen, bevor physische Änderungen umgesetzt oder Lieferantenangebote angefragt werden.',
          'Typische Anwendungsfälle sind:'
        ],
        points: [
          'Planung neuer Produktionslinien',
          'Änderungen am Fabriklayout',
          'Engpassanalyse',
          'Validierung von Roboter- und Automatisierungskonzepten',
          'Analyse interner Logistik und Materialflüsse',
          'Analyse der Auslastung von Bedienern und Maschinen',
          'Kapazitäts- und Durchsatzstudien'
        ]
      },
      {
        question: 'Wie kann Simulation helfen, Engpässe zu reduzieren?',
        answer: [
          'Simulation zeigt, wo Warteschlangen, Wartezeiten, überlastete Bediener, unterausgelastete Maschinen, Transportverzögerungen oder Pufferprobleme im Produktionsfluss entstehen.',
          'Durch das Testen verschiedener Szenarien lassen sich Layoutänderungen, Puffergrößen, Personalbesetzung, Automatisierungsoptionen und Prozesssequenzen vergleichen, bevor physische Änderungen vorgenommen werden.',
          'Statt zu raten, wo der Engpass liegen könnte, bietet Simulation eine visuelle und datenbasierte Möglichkeit zu testen, wie das gesamte System auf Änderungen reagiert.'
        ]
      },
      {
        question: 'Kann Simulation Automatisierungsinvestitionen unterstützen?',
        answer: [
          'Ja. Simulation kann helfen zu testen, ob ein geplantes Automatisierungskonzept genügend Kapazität hat, wo neue Engpässe entstehen können, wie viele Roboter oder Bediener benötigt werden und ob die erwartete Durchsatzsteigerung realistisch ist.',
          'Das reduziert das Investitionsrisiko, bevor finale Lieferantenangebote angefragt, Anlagen gekauft oder Produktionslayouts geändert werden.',
          'Simulation ist besonders nützlich, wenn manuelle, teilautomatisierte und automatisierte Szenarien nebeneinander verglichen werden.'
        ]
      },
      {
        question: 'Können Sie remote mit internationalen Kunden arbeiten?',
        answer: [
          'Ja. Wir können Produktionsunternehmen remote unterstützen, unabhängig davon, wo sich der Produktionsstandort befindet.',
          'Der erste Schritt ist meist ein Online-Gespräch, um die Produktionsherausforderung, geplante Investition oder Automatisierungsidee zu verstehen. Danach kann der Kunde verfügbare Eingaben teilen, zum Beispiel Layoutzeichnungen, Prozessvideos, Fotos, Zykluszeiten, Produktmix, Bedieneraufgaben und Produktionsdaten.',
          'Auf Basis dieser Informationen können wir ein erstes Simulationsmodell aufbauen, Szenarien vergleichen und die Ergebnisse gemeinsam online besprechen. So versteht der Kunde Engpässe, Kapazitätsgrenzen und Verbesserungsoptionen, bevor er sich auf physische Änderungen, Lieferantenangebote oder Anlageninvestitionen festlegt.',
          'Wenn mehr Detailtiefe erforderlich ist, kann der nächste Schritt zusätzliche Datenerfassung, genauere Prozessmessungen oder Zusammenarbeit mit dem Engineering-, Produktions- oder Automatisierungsteam des Kunden umfassen.',
          'Wir arbeiten außerdem mit Engineering- und Automatisierungspartnern in Europa zusammen, einschließlich Italien und der Schweiz. Wenn ein Projekt lokales Know-how, Unterstützung bei der Umsetzung oder zusätzliche technische Expertise benötigt, können wir je nach Projektumfang und Kundenbedarf vertrauenswürdige Partner einbeziehen.'
        ]
      },
      {
        question: 'Können Sie Simulation mit einem Praxisbeispiel erklären?',
        answer: [
          'Wenn ein Team den besten Stürmer kauft, wird es dadurch automatisch zum besten Team? Nicht unbedingt. Der Stürmer kann hervorragend sein, aber das Ergebnis hängt weiterhin davon ab, wie das Mittelfeld Chancen erzeugt, wie die Abwehr mit Druck umgeht, wie sich das Team gemeinsam bewegt und ob das gesamte System funktioniert.',
          'Die gleiche Logik gilt in der Fertigung.',
          'Der Kauf einer teuren Maschine, eines Roboters oder eines Automatisierungssystems verbessert nicht automatisch den gesamten Produktionsfluss. Wenn der nächste Prozess zu langsam ist, die Materialversorgung instabil ist oder Bediener zwischen Schritten warten, kann die neue Maschine den Engpass einfach an eine andere Stelle verschieben.',
          'Simulation hilft, vor der Investition auf das Gesamtsystem zu schauen. Sie zeigt, wie Maschinen, Menschen, Puffer, Transport und Prozessschritte zusammenarbeiten, damit das Unternehmen versteht, ob die geplante Änderung die gesamte Produktionskette verbessert - und nicht nur einen isolierten Arbeitsschritt.'
        ]
      },
      {
        question: 'Was ist Automation 2.0?',
        answer: [
          'Automation 2.0 bedeutet den Schritt von isolierten Automatisierungsprojekten hin zu einem stärker vernetzten, simulationsgetriebenen und lebenszyklusorientierten Ansatz für industrielle Automatisierung.',
          'In der Praxis bedeutet das, dass Automatisierung nicht erst während der Umsetzung entworfen und getestet wird. Sie wird bereits früher durch Simulation, digitale Modelle, Roboterkonzepte, Zykluszeitanalyse, virtuelle Inbetriebnahme und Tests des Produktionsflusses validiert.',
          'Ziel ist es, späte Änderungen zu reduzieren, kostspielige Fehler zu vermeiden und Automatisierungsentscheidungen mit größerer Sicherheit zu treffen, bevor Systeme live gehen.'
        ]
      },
      {
        question: 'Was ist ein digitaler Zwilling?',
        answer: [
          'Ein digitaler Zwilling ist eine digitale Darstellung eines realen Produktionsprozesses, einer Linie, Maschine, eines Fabrikbereichs oder sogar einer ganzen Fabrik.',
          'In der Fertigung kann ein digitaler Zwilling genutzt werden, um Produktionsdaten zu visualisieren, Leistung zu überwachen, Materialfluss zu verstehen und verschiedene Verbesserungsideen in einer digitalen Umgebung zu testen. Je nach Detailgrad kann er Layoutinformationen, Maschinen, Bediener, Zykluszeiten, Transportrouten, Puffer, Sensordaten, OEE-Daten oder ERP/MES-Informationen enthalten.',
          'Ein einfaches Simulationsmodell wird üblicherweise erstellt, um Szenarien zu testen und Entscheidungen zu unterstützen. Ein digitaler Zwilling kann einen Schritt weiter gehen, indem er das Modell mit realen Produktionsdaten verbindet und für Datenvisualisierung, Monitoring, Analyse und kontinuierliche Verbesserung genutzt wird.',
          'Der Hauptwert liegt darin, dass Manager, Ingenieure und Produktionsteams klarer sehen, was im Produktionssystem passiert - nicht nur über Tabellen, sondern über ein visuelles und datenbasiertes Modell.'
        ]
      }
    ]
  },
  blogTitle: 'News',
  breadcrumbHome: 'Startseite',
  breadcrumbBlog: 'News',
  blogIntro:
    'Kurze Updates zu Simulationen, Produktionsplanung, Partnerschaften und Anwendungsfällen, an denen wir beteiligt waren.',
  blogPosts: [
    {
      ...content.en.blogPosts[0],
      title: 'Baltic CNC Technical Educators Conference 2026',
      category: 'Konferenz',
      lead:
        'Wir nahmen an der Baltic CNC Technical Educators Conference 2026 teil, die im Advanced Machining Technology Centre der Tallinn University of Applied Sciences stattfand.',
      body: [
        'Der Tag umfasste Vorträge, Gruppendiskussionen, Workshops und praktische Demonstrationen zur Zukunft von Bildung und Industrie.',
        'Das Programm behandelte mehrere Themen rund um Fertigung und Technologieentwicklung:'
      ],
      items: [
        'CAM-Programmierung mit Unterstützung künstlicher Intelligenz - Venten OÜ',
        'Fabrikdigitalisierung und Simulation - Factory Simulation OÜ',
        'Schwingungsdämpfende Werkzeuge in CNC-Maschinen - Sandvik und Alas-Kuul AS',
        'Digitalisierung von Messdaten - Mitutoyo und Venten OÜ'
      ],
      afterItems: [
        'Unser Thema konzentrierte sich auf verschiedene Aspekte der Fabrikdigitalisierung, mit einem tieferen Schwerpunkt auf Produktionsprozessdesign durch Simulation.',
        'Wir zeigten praktische Beispiele dafür, wie Simulation bessere Produktionsentscheidungen unterstützt - zum Beispiel, wie bereits die Fahrgeschwindigkeit eines Staplers Produktivität, Materialfluss und die Gesamtleistung eines Produktionsprozesses beeinflussen kann. Außerdem präsentierten wir Praxisbeispiele dafür, wie ein digitales Modell genutzt werden kann, um verschiedene Lösungen zu vergleichen, bevor physische Änderungen in der Fabrik vorgenommen werden.'
      ]
    },
    {
      ...content.en.blogPosts[1],
      title: 'Gemeinsamer Unternehmensbesuch bei Betrieben in Zentralestland',
      category: 'Unternehmensbesuch',
      lead:
        'Gemeinsamer Unternehmensbesuch bei Betrieben in Zentralestland, organisiert vom estnischen Maschinenbauverband.',
      body: [
        'Der estnische Maschinenbauverband organisierte für seine Mitglieder einen Fabrikbesuch in Zentralestland, bei dem wir verschiedene Produktionsprozesse, Produktentwicklungsaktivitäten und den täglichen Fabrikbetrieb näher kennenlernen konnten.',
        'Insgesamt besuchten wir vier Unternehmen und erhielten einen sehr guten Überblick über die Industrieunternehmen der Region, ihre Aktivitäten, Herausforderungen und Entwicklungsrichtungen:'
      ],
      afterItems: [
        'Solche Besuche bieten eine wertvolle Möglichkeit zu sehen, wie unterschiedliche Produktionsunternehmen ihre Prozesse entwickeln und welche Lösungen zur Effizienzsteigerung eingesetzt werden.'
      ]
    },
    {
      ...content.en.blogPosts[2],
      title: 'Industry 5.0 Conference 2026',
      category: 'Konferenz',
      lead: 'In diesem Jahr nahmen wir mit einem eigenen Stand an der Industry 5.0 Conference teil.',
      body: [
        'Die Konferenz konzentrierte sich auf die künftige Wettbewerbsfähigkeit der estnischen Industrie. Zu den Kernthemen gehörten industrielle Innovation, Nachhaltigkeit, angewandte Forschung, Automatisierung, Robotik, Digitalisierung, Cybersicherheit und die praktische Einführung von Technologien in der Fertigung.',
        'Für uns führten viele Gespräche zu einer praktischen Frage zurück: Wie können Hersteller den Produktionsprozess selbst digitalisieren und verbessern - nicht nur durch Software, sondern durch Simulationen, datenbasierte Planung und schnelleres Testen verschiedener Szenarien vor Änderungen in der realen Welt?',
        'Natürlich brachten wir auch unseren wheel.me-Roboter mit, um ein einfaches und praktisches Beispiel flexibler Automatisierung zu zeigen - einen autonomen Abfallroboter, der sich durch den Ausstellungsbereich bewegte.'
      ]
    },
    {
      ...content.en.blogPosts[3],
      title: 'Schulung zu Industrieroboterprogrammierung und maschinellem Sehen',
      category: 'Schulung',
      excerpt:
        'Wir absolvierten ein praxisnahes Schulungsprogramm zu Industrieroboterprogrammierung (offline und online) und zur Anwendung von Machine-Vision-Lösungen in der Produktion. Die Schulung konzentrierte sich auf Roboterprogrammierung und den Einsatz von Vision-Systemen in automatisierten Produktionsprozessen.'
    },
    {
      ...content.en.blogPosts[4],
      title: 'Smart Industry Conference 2026',
      category: 'Konferenz',
      excerpt:
        'Wir nahmen an der Smart Industry Conference teil, bei der industrielle Digitalisierung, Automatisierung und Zukunftslösungen diskutiert wurden. Die Veranstaltung umfasste auch die Bekanntgabe der "Factory of the Year 2026".'
    },
    {
      ...content.en.blogPosts[5],
      title: 'wheel.me-Fabrikbesuch und Schulung in Norwegen',
      category: 'Partnerschaft',
      excerpt:
        'Wir besuchten die Produktionsstätte von wheel.me in Norwegen und nahmen an einer technischen Schulung zu autonomen mobilen Roboterlösungen teil. Der Besuch behandelte praktische Anwendungsfälle, Konfiguration und verschiedene industrielle Anwendungen.'
    },
    {
      ...content.en.blogPosts[6],
      title: 'Finnisch-estnisches Seminar der Maschinenbauindustrie',
      category: 'Seminar',
      excerpt:
        'Wir nahmen an einem Seminar und Networking-Event der Maschinenbauindustrie teil, das im Rahmen der finnischen und estnischen Blechbearbeitungstage stattfand. Der Tag konzentrierte sich auf Kooperationsmöglichkeiten, Branchentrends und praktische Produktionserfahrung.'
    },
    {
      ...content.en.blogPosts[7],
      title: 'Veranstaltung zum 90. Jubiläum des estnischen Maschinenbauverbands',
      category: 'Netzwerk',
      excerpt:
        'Wir nahmen an der Veranstaltung zum 90. Jubiläum des estnischen Maschinenbauverbands teil, bei der EML-Mitglieder, Partner und Branchenvertreter zusammenkamen. Die Veranstaltung konzentrierte sich auf Branchenentwicklung und Zusammenarbeit.'
    }
  ]
};

const consentContent = {
  et: {
    title: 'Privaatsusvalikud',
    summary: 'Kasutame Google Analyticsit ja Google Adsi mõõtmist ainult teie nõusolekul. Keeldumine ei mõjuta veebilehe ega kontaktvormi kasutamist.',
    acceptAll: 'Nõustu kõigiga',
    reject: 'Keeldu mittevajalikest',
    settings: 'Seaded',
    settingsTitle: 'Privaatsusseaded',
    necessaryTitle: 'Vajalikud',
    necessaryText: 'Keele- ja privaatsusvaliku meeldejätmiseks. Alati aktiivne.',
    analyticsTitle: 'Analüütika',
    analyticsText: 'Google Analytics aitab meil mõista veebilehe kasutamist ja toimivust.',
    advertisingTitle: 'Reklaamide mõõtmine',
    advertisingText: 'Google Ads aitab mõõta, kas reklaam tõi kontaktvormi saatmiseni. Isikupärastatud reklaame ei lubata.',
    save: 'Salvesta valikud',
    cancel: 'Tagasi',
    privacy: 'Privaatsuspoliitika',
    reopen: 'Privaatsusseaded'
  },
  en: {
    title: 'Privacy choices',
    summary: 'We use Google Analytics and Google Ads measurement only with your consent. Refusing does not affect the website or contact form.',
    acceptAll: 'Accept all',
    reject: 'Reject non-essential',
    settings: 'Settings',
    settingsTitle: 'Privacy settings',
    necessaryTitle: 'Necessary',
    necessaryText: 'Remembers language and privacy choices. Always active.',
    analyticsTitle: 'Analytics',
    analyticsText: 'Google Analytics helps us understand website use and performance.',
    advertisingTitle: 'Advertising measurement',
    advertisingText: 'Google Ads measures whether an advertisement led to a contact-form submission. Personalized advertising remains disabled.',
    save: 'Save choices',
    cancel: 'Back',
    privacy: 'Privacy Policy',
    reopen: 'Privacy settings'
  },
  de: {
    title: 'Datenschutzauswahl',
    summary: 'Wir verwenden Google Analytics und die Google-Ads-Messung nur mit Ihrer Einwilligung. Eine Ablehnung beeinträchtigt weder die Website noch das Kontaktformular.',
    acceptAll: 'Alle akzeptieren',
    reject: 'Nicht notwendige ablehnen',
    settings: 'Einstellungen',
    settingsTitle: 'Datenschutzeinstellungen',
    necessaryTitle: 'Notwendig',
    necessaryText: 'Speichert Sprach- und Datenschutzauswahl. Immer aktiv.',
    analyticsTitle: 'Analyse',
    analyticsText: 'Google Analytics hilft uns, Nutzung und Leistung der Website zu verstehen.',
    advertisingTitle: 'Werbemessung',
    advertisingText: 'Google Ads misst, ob eine Anzeige zum Absenden eines Kontaktformulars geführt hat. Personalisierte Werbung bleibt deaktiviert.',
    save: 'Auswahl speichern',
    cancel: 'Zurück',
    privacy: 'Datenschutzerklärung',
    reopen: 'Datenschutzeinstellungen'
  }
};

const privacySupplement = {
  et: {
    updated: 'Viimati uuendatud: 11.09.2026',
    intro: 'See privaatsuspoliitika selgitab, kuidas Factory Simulation OÜ töötleb kontaktvormide kaudu saadetud andmeid ning kasutab teie nõusolekul veebianalüütikat ja reklaamide tulemuslikkuse mõõtmist.',
    sections: [
      {
        title: 'Vajalik veebisalvestus',
        paragraphs: [
          'Veebileht salvestab brauseri kohalikku salvestusruumi keele-eelistuse ja privaatsusvaliku. Need andmed on vajalikud kasutaja soovitud funktsioonide pakkumiseks ja valiku meeldejätmiseks; õiguslik alus on meie õigustatud huvi pakkuda toimivat ja valikuid austavat veebilehte. Privaatsusvalik aegub 12 kuu pärast. Google’i mõõtmisteenuseid ei laadita, kui te pole neile nõusolekut andnud.'
        ]
      },
      {
        title: 'Kontaktvormi turvalisus ja säilitamine',
        paragraphs: [
          'Kontaktvorm kasutab rämpspostivälja, päritolukontrolli ja päringusageduse piirangut. Kuritarvituste vältimiseks salvestab rakendus IP-aadressi ning saatmiskatsed ajutisse piirangufaili kuni üheks tunniks. Selle turvatöötluse õiguslik alus on meie õigustatud huvi kaitsta veebilehte ja kontaktkanalit. Kontaktvormi sisu edastatakse e-postiga Factory Simulationile Zone’i infrastruktuuri kaudu.',
          'Päringud, millest ei teki lepingulist või muud ärisuhet, kustutatakse või anonüümitakse hiljemalt 24 kuu jooksul pärast viimast sisulist suhtlust. Koostöö tekkimisel võidakse asjaomaseid andmeid säilitada lepingu täitmiseks ning raamatupidamis- või muude seadusest tulenevate kohustuste tähtaja jooksul.'
        ]
      },
      {
        title: 'Google Analytics',
        paragraphs: [
          'Teie nõusolekul kasutame Google Analytics 4 teenust (mõõtmise ID G-JRKZJXK4DL), et koostada koondstatistikat veebilehe kasutamise ja toimivuse kohta. Töödeldavad andmed võivad hõlmata vaadatud URL-e ja lehe pealkirju, viitavat lehte, brauseri ja seadme andmeid, ligikaudset asukohta IP-aadressi põhjal, kasutussündmusi ning küpsistega seotud veebitunnuseid.',
          'Õiguslik alus on teie nõusolek isikuandmete kaitse üldmääruse artikli 6 lõike 1 punkti a alusel. Google Analyticsi küpsised _ga ja _ga_<mõõtmise ID> võivad kehtida kuni 12 kuud; sündmuse- ja kasutajataseme andmeid säilitatakse Analyticsi kontol kuni 14 kuud.'
        ]
      },
      {
        title: 'Google Adsi konversioonide mõõtmine',
        paragraphs: [
          'Eraldi nõusolekul kasutame Google Adsi mõõtmist (ID AW-18241161030), et hinnata reklaamikampaaniate tulemuslikkust. Pärast kontaktvormi edukat saatmist võib Google Ads saada konversioonisündmuse ning seostada selle varasema reklaamiklikiga. Selleks võidakse töödelda reklaamikliki tunnuseid, veebitunnuseid, seadme- ja brauseriandmeid ning konversiooni aega.',
          'Õiguslik alus on teie nõusolek. Isikupärastatud reklaamide signaalid on veebilehel välja lülitatud. _gcl_ algusega reklaamimõõtmise küpsised võivad kehtida kuni 90 päeva.'
        ]
      },
      {
        title: 'Teenusepakkujad ja rahvusvaheline andmeedastus',
        paragraphs: [
          'Google Analyticsi ja Google Adsi teenuseid osutab Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Iirimaa. Google võib töödelda andmeid väljaspool Euroopa Majanduspiirkonda, sealhulgas Ameerika Ühendriikides. Google märgib, et kasutab vajaduse korral Euroopa Komisjoni heakskiidetud kaitsemeetmeid, sealhulgas EL-USA andmekaitseraamistikku ja lepingu tüüptingimusi.',
          'Kontaktvormi majutus- ja e-posti teenusepakkuja on Zone Media OÜ (Zone.ee). Google’i privaatsusteave: https://policies.google.com/privacy; küpsisteave: https://policies.google.com/technologies/cookies; andmeedastuse raamistikud: https://policies.google.com/privacy/frameworks.'
        ]
      },
      {
        title: 'Teie analüütika- ja reklaamivalikud',
        paragraphs: [
          'Analüütika ja reklaamide mõõtmine on vaikimisi välja lülitatud. Saate nendega eraldi nõustuda, neist keelduda või oma valikut hiljem lehe nupu „Privaatsusseaded” kaudu muuta. Nõusoleku tagasivõtmine ei mõjuta enne tagasivõtmist toimunud töötlemise seaduslikkust ega takista veebilehe või kontaktvormi kasutamist.'
        ]
      }
    ]
  },
  en: {
    updated: 'Last updated: 11.09.2026',
    intro: 'This Privacy Policy explains how Factory Simulation OÜ processes information submitted through contact forms and, with your consent, uses website analytics and advertising-performance measurement.',
    sections: [
      {
        title: 'Necessary website storage',
        paragraphs: [
          'The website stores your language preference and privacy choice in browser local storage. This is necessary to provide requested functionality and remember your choice; the legal basis is our legitimate interest in providing a functional website that respects visitor choices. The privacy choice expires after 12 months. Google measurement services are not loaded unless you consent to them.'
        ]
      },
      {
        title: 'Contact-form security and retention',
        paragraphs: [
          'The contact form uses a honeypot field, origin validation and submission-rate controls. To prevent abuse, the application stores the IP address and submission timestamps in a temporary rate-limit file for no more than one hour. The legal basis for this security processing is our legitimate interest in protecting the website and contact channel. Contact-form contents are delivered to Factory Simulation by email through Zone infrastructure.',
          'Inquiries that do not lead to a contractual or other business relationship are deleted or anonymized no later than 24 months after the last substantive communication. If cooperation begins, relevant information may be retained for performance of the contract and for the duration of accounting or other statutory obligations.'
        ]
      },
      {
        title: 'Google Analytics',
        paragraphs: [
          'With your consent, we use Google Analytics 4 (measurement ID G-JRKZJXK4DL) to produce aggregate statistics about website use and performance. Data may include viewed URLs and page titles, referring page, browser and device information, approximate location derived from the IP address, usage events and cookie-linked online identifiers.',
          'The legal basis is your consent under Article 6(1)(a) GDPR. Google Analytics cookies _ga and _ga_<measurement ID> may remain for up to 12 months; event- and user-level data is retained in the Analytics property for up to 14 months.'
        ]
      },
      {
        title: 'Google Ads conversion measurement',
        paragraphs: [
          'With separate consent, we use Google Ads measurement (ID AW-18241161030) to assess advertising-campaign performance. After a contact form is successfully submitted, Google Ads may receive a conversion event and associate it with an earlier advertisement click. This may involve ad-click identifiers, online identifiers, device and browser information and the conversion time.',
          'The legal basis is your consent. Personalized-advertising signals are disabled on this website. Advertising-measurement cookies beginning with _gcl_ may remain for up to 90 days.'
        ]
      },
      {
        title: 'Service providers and international transfers',
        paragraphs: [
          'Google Analytics and Google Ads are provided by Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Ireland. Google may process information outside the European Economic Area, including in the United States. Google states that it uses European Commission-approved safeguards where required, including the EU-US Data Privacy Framework and Standard Contractual Clauses.',
          'Our contact-form hosting and email provider is Zone Media OÜ (Zone.ee). Google privacy information: https://policies.google.com/privacy; cookie information: https://policies.google.com/technologies/cookies; transfer frameworks: https://policies.google.com/privacy/frameworks.'
        ]
      },
      {
        title: 'Your analytics and advertising choices',
        paragraphs: [
          'Analytics and advertising measurement are off by default. You can consent to them separately, reject them, or change your selection later through the “Privacy settings” button. Withdrawing consent does not affect processing that was lawful before withdrawal and does not prevent use of the website or contact form.'
        ]
      }
    ]
  },
  de: {
    updated: 'Zuletzt aktualisiert: 11.09.2026',
    intro: 'Diese Datenschutzerklärung erläutert, wie Factory Simulation OÜ über Kontaktformulare übermittelte Angaben verarbeitet und mit Ihrer Einwilligung Webanalyse sowie die Messung der Werbeleistung einsetzt.',
    sections: [
      {
        title: 'Notwendige Website-Speicherung',
        paragraphs: [
          'Die Website speichert Ihre Sprachpräferenz und Datenschutzauswahl im lokalen Speicher des Browsers. Dies ist erforderlich, um angeforderte Funktionen bereitzustellen und Ihre Auswahl zu speichern; Rechtsgrundlage ist unser berechtigtes Interesse an einer funktionsfähigen Website, die Ihre Auswahl respektiert. Die Datenschutzauswahl läuft nach 12 Monaten ab. Google-Messdienste werden nur geladen, wenn Sie eingewilligt haben.'
        ]
      },
      {
        title: 'Sicherheit und Aufbewahrung des Kontaktformulars',
        paragraphs: [
          'Das Kontaktformular verwendet ein Honeypot-Feld, eine Herkunftsprüfung und Begrenzungen der Übermittlungshäufigkeit. Zur Missbrauchsabwehr speichert die Anwendung die IP-Adresse und Zeitpunkte der Sendeversuche höchstens eine Stunde lang in einer temporären Datei. Rechtsgrundlage dieser Sicherheitsverarbeitung ist unser berechtigtes Interesse am Schutz der Website und des Kontaktkanals. Die Formularinhalte werden über die Infrastruktur von Zone per E-Mail an Factory Simulation übermittelt.',
          'Anfragen, die nicht zu einem Vertrags- oder sonstigen Geschäftsverhältnis führen, werden spätestens 24 Monate nach der letzten inhaltlichen Kommunikation gelöscht oder anonymisiert. Kommt eine Zusammenarbeit zustande, können relevante Angaben zur Vertragserfüllung sowie für die Dauer gesetzlicher Aufbewahrungsfristen gespeichert werden.'
        ]
      },
      {
        title: 'Google Analytics',
        paragraphs: [
          'Mit Ihrer Einwilligung verwenden wir Google Analytics 4 (Mess-ID G-JRKZJXK4DL), um zusammengefasste Statistiken über Nutzung und Leistung der Website zu erstellen. Verarbeitet werden können aufgerufene URLs und Seitentitel, verweisende Seiten, Browser- und Geräteinformationen, ein aus der IP-Adresse abgeleiteter ungefährer Standort, Nutzungsereignisse sowie mit Cookies verknüpfte Online-Kennungen.',
          'Rechtsgrundlage ist Ihre Einwilligung nach Artikel 6 Absatz 1 Buchstabe a DSGVO. Die Google-Analytics-Cookies _ga und _ga_<Mess-ID> können bis zu 12 Monate bestehen; Ereignis- und Nutzerdaten werden in der Analytics-Property bis zu 14 Monate gespeichert.'
        ]
      },
      {
        title: 'Google-Ads-Conversion-Messung',
        paragraphs: [
          'Mit separater Einwilligung verwenden wir die Google-Ads-Messung (ID AW-18241161030), um die Leistung von Werbekampagnen zu bewerten. Nach erfolgreichem Absenden eines Kontaktformulars kann Google Ads ein Conversion-Ereignis erhalten und einem früheren Anzeigenklick zuordnen. Dabei können Anzeigenklick-Kennungen, Online-Kennungen, Geräte- und Browserinformationen sowie der Zeitpunkt der Conversion verarbeitet werden.',
          'Rechtsgrundlage ist Ihre Einwilligung. Signale für personalisierte Werbung sind auf dieser Website deaktiviert. Cookies zur Werbemessung, deren Name mit _gcl_ beginnt, können bis zu 90 Tage bestehen.'
        ]
      },
      {
        title: 'Dienstleister und internationale Übermittlungen',
        paragraphs: [
          'Google Analytics und Google Ads werden von Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irland, bereitgestellt. Google kann Informationen außerhalb des Europäischen Wirtschaftsraums, auch in den USA, verarbeiten. Google erklärt, erforderlichenfalls von der Europäischen Kommission anerkannte Garantien zu verwenden, darunter das EU-US Data Privacy Framework und Standardvertragsklauseln.',
          'Unser Anbieter für Hosting und E-Mail-Versand des Kontaktformulars ist Zone Media OÜ (Zone.ee). Google-Datenschutzinformationen: https://policies.google.com/privacy; Cookie-Informationen: https://policies.google.com/technologies/cookies; Übermittlungsrahmen: https://policies.google.com/privacy/frameworks.'
        ]
      },
      {
        title: 'Ihre Analyse- und Werbeauswahl',
        paragraphs: [
          'Analyse und Werbemessung sind standardmäßig deaktiviert. Sie können separat einwilligen, ablehnen oder Ihre Auswahl später über die Schaltfläche „Datenschutzeinstellungen” ändern. Der Widerruf berührt nicht die Rechtmäßigkeit der bis zum Widerruf erfolgten Verarbeitung und verhindert weder die Nutzung der Website noch des Kontaktformulars.'
        ]
      }
    ]
  }
};

const anchors = ['services', 'about', 'blog', 'wheelme'];
const pageRoutes = ['blog', 'wheelme', 'privacy', 'factory-simulation-faq', 'brand'];
const languages = ['et', 'en'];
const languageOptions = [
  { code: 'et', label: 'Eesti', flagSrc: '/ee-flag.svg' },
  { code: 'en', label: 'English', flagSrc: '/en-flag.svg' }
];
const languagePreferenceKey = 'factorySimulationLanguage';
const localizedValue = (values, language) => values[language] || values.en;

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
  if (siteVariant === 'de') {
    return 'de';
  }

  const language = getPathWithoutBase().split('/').filter(Boolean)[0];

  if (languages.includes(language)) {
    return language;
  }

  const storedLanguage = window.localStorage?.getItem(languagePreferenceKey);

  if (languages.includes(storedLanguage)) {
    return storedLanguage;
  }

  return 'en';
};

const getRouteFromPath = () => {
  const parts = getPathWithoutBase().split('/').filter(Boolean);
  const page = languages.includes(parts[0]) ? parts[1] : parts[0];
  return pageRoutes.includes(page) ? page : 'home';
};

const getSearchQuery = () => new URLSearchParams(window.location.search).get('q')?.trim() || '';

const getPagePath = (language, page = 'home', hash = '') => {
  if (page === 'brand') {
    return `${basePath}brand/${hash || ''}`;
  }

  const pagePath = pageRoutes.includes(page) ? `${page}/` : '';
  const languagePath = siteVariant === 'de' && language === 'de' ? '' : `${language}/`;
  return `${basePath}${languagePath}${pagePath}${hash || ''}`;
};

const getSearchPath = (language, query) => `${getPagePath(language)}?q=${encodeURIComponent(query.trim())}`;

const getLanguagePath = (language, hash = window.location.hash) => getPagePath(language, 'home', hash);

function ConsentManager({ initialLanguage }) {
  const [language, setLanguage] = useState(initialLanguage);
  const [decision, setDecision] = useState(readConsent);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [analytics, setAnalytics] = useState(Boolean(decision?.analytics));
  const [advertising, setAdvertising] = useState(Boolean(decision?.advertising));
  const copy = consentContent[language] || consentContent.en;
  const privacyPath = getPagePath(language, 'privacy');

  useEffect(() => {
    const observer = new MutationObserver(() => {
      const nextLanguage = document.documentElement.lang;
      if (consentContent[nextLanguage]) setLanguage(nextLanguage);
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleSettingsRequest = () => {
      const currentDecision = readConsent();
      setAnalytics(Boolean(currentDecision?.analytics));
      setAdvertising(Boolean(currentDecision?.advertising));
      setSettingsOpen(true);
    };
    window.addEventListener(privacySettingsEvent, handleSettingsRequest);
    return () => window.removeEventListener(privacySettingsEvent, handleSettingsRequest);
  }, []);

  const applyChoice = (choice) => {
    if (!choice.analytics || !choice.advertising) {
      clearGoogleMeasurementStorage();
    }
    const nextDecision = saveConsent(choice);
    const changedExistingChoice = decision && (
      decision.analytics !== nextDecision.analytics ||
      decision.advertising !== nextDecision.advertising
    );

    if (changedExistingChoice) {
      clearGoogleMeasurementStorage();
      window.location.reload();
      return;
    }

    setDecision(nextDecision);
    setAnalytics(nextDecision.analytics);
    setAdvertising(nextDecision.advertising);
    setSettingsOpen(false);
    activateGoogleMeasurement(nextDecision);
  };

  const openSettings = () => {
    setAnalytics(Boolean(decision?.analytics));
    setAdvertising(Boolean(decision?.advertising));
    setSettingsOpen(true);
  };

  return (
    <>
      {!decision && !settingsOpen && (
        <aside className="fixed inset-x-3 bottom-3 z-[100] mx-auto max-h-[calc(100vh-1.5rem)] max-w-5xl overflow-y-auto rounded-md border border-white/18 bg-[#202320] p-5 text-white shadow-2xl sm:p-6" aria-labelledby="privacy-choice-title">
          <div className="grid min-w-0 gap-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
            <div className="min-w-0">
              <h2 className="mb-2 text-xl font-bold" id="privacy-choice-title">{copy.title}</h2>
              <p className="m-0 max-w-3xl text-sm leading-relaxed text-white/76">{copy.summary}</p>
              <a className="mt-3 inline-block text-sm font-semibold text-fs-accent" href={privacyPath}>{copy.privacy}</a>
            </div>
            <div className="flex flex-wrap gap-2">
              <button className="min-h-11 border border-white/35 px-4 py-2 text-sm font-bold text-white transition hover:border-white" type="button" onClick={() => applyChoice({ analytics: false, advertising: false })}>{copy.reject}</button>
              <button className="min-h-11 border border-white/35 px-4 py-2 text-sm font-bold text-white transition hover:border-white" type="button" onClick={openSettings}>{copy.settings}</button>
              <button className="min-h-11 border border-fs-accent bg-fs-accent px-4 py-2 text-sm font-bold text-black transition hover:border-white hover:bg-white" type="button" onClick={() => applyChoice({ analytics: true, advertising: true })}>{copy.acceptAll}</button>
            </div>
          </div>
        </aside>
      )}

      {settingsOpen && (
        <div className="fixed inset-0 z-[110] grid place-items-center overflow-y-auto bg-black/72 p-3 sm:p-6" role="presentation">
          <section className="my-auto w-full max-w-xl rounded-md border border-white/18 bg-[#202320] p-5 text-white shadow-2xl sm:p-7" role="dialog" aria-modal="true" aria-labelledby="privacy-settings-title">
            <h2 className="mb-5 text-2xl font-bold" id="privacy-settings-title">{copy.settingsTitle}</h2>
            <div className="divide-y divide-white/14 border-y border-white/14">
              <label className="flex min-w-0 items-start gap-4 py-4">
                <input className="mt-1 size-5 shrink-0 accent-[#e2ab19]" type="checkbox" checked disabled />
                <span className="min-w-0"><strong className="block">{copy.necessaryTitle}</strong><span className="mt-1 block text-sm leading-relaxed text-white/65">{copy.necessaryText}</span></span>
              </label>
              <label className="flex min-w-0 cursor-pointer items-start gap-4 py-4">
                <input className="mt-1 size-5 shrink-0 accent-[#e2ab19]" type="checkbox" checked={analytics} onChange={(event) => setAnalytics(event.target.checked)} />
                <span className="min-w-0"><strong className="block">{copy.analyticsTitle}</strong><span className="mt-1 block text-sm leading-relaxed text-white/65">{copy.analyticsText}</span></span>
              </label>
              <label className="flex min-w-0 cursor-pointer items-start gap-4 py-4">
                <input className="mt-1 size-5 shrink-0 accent-[#e2ab19]" type="checkbox" checked={advertising} onChange={(event) => setAdvertising(event.target.checked)} />
                <span className="min-w-0"><strong className="block">{copy.advertisingTitle}</strong><span className="mt-1 block text-sm leading-relaxed text-white/65">{copy.advertisingText}</span></span>
              </label>
            </div>
            <a className="mt-4 inline-block text-sm font-semibold text-fs-accent" href={privacyPath}>{copy.privacy}</a>
            <div className="mt-6 flex flex-wrap justify-end gap-2">
              <button className="min-h-11 border border-white/35 px-4 py-2 text-sm font-bold text-white transition hover:border-white" type="button" onClick={() => setSettingsOpen(false)}>{copy.cancel}</button>
              <button className="min-h-11 border border-fs-accent bg-fs-accent px-4 py-2 text-sm font-bold text-black transition hover:border-white hover:bg-white" type="button" onClick={() => applyChoice({ analytics, advertising })}>{copy.save}</button>
            </div>
          </section>
        </div>
      )}
    </>
  );
}

const softwareBrands = {
  'Visual Components': [{ src: '/software/visual-components.webp', className: 'max-h-14 max-w-16' }],
  AutoCAD: [{ src: '/software/autocad.svg', className: 'max-h-14 max-w-16' }],
  AutoTURN: [{ src: '/software/autoturn.svg', className: 'max-h-13 max-w-36' }],
  'ABB RobotStudio': [{ src: '/software/abb-robotstudio.svg', className: 'max-h-14 max-w-20' }],
  'Siemens TIA Portal + PLCSIM': [{ src: '/software/siemens-tia-portal.svg', className: 'max-h-14 max-w-32' }],
  'NVIDIA Omniverse': [{ src: '/software/nvidia-omniverse.svg', className: 'max-h-14 max-w-20' }],
  'Unreal Engine': [{ src: '/software/unreal-engine.svg', className: 'max-h-14 max-w-16' }],
  Unity: [{ src: '/software/unity.svg', className: 'max-h-14 max-w-16' }]
};
const partners = [
  { name: 'EML', logo: '/logo-partner-eml.webp', bare: true, imageClassName: 'brightness-0 invert' },
  { name: 'AI & Robotics Estonia', logo: '/logo-partner-aire-transparent.webp', bare: true, large: true },
  { name: 'TalTech', logo: '/logo-partner-taltech.webp', bare: true },
  { name: 'Flowit', logo: '/logo-partner-flowit.webp', bare: true },
  { name: 'CADRäk', logo: '/logo-partner-cadrak.svg', href: 'https://www.cadrak.com/en', bare: true }
];
const clientLogos = [
  { name: 'Kohila Vineer', logo: '/kliendid/kohila-vineer_transparent_carousel.webp' },
  { name: 'M ja P Nurst', logo: '/kliendid/m-ja-p-nurst_transparent_carousel.webp' },
  { name: 'Mainor Ülemiste', logo: '/kliendid/mainor-ulemiste_transparent_carousel.webp' },
  { name: 'Smitech', logo: '/kliendid/smitech_transparent_carousel.webp' },
  { name: 'Warmeston', logo: '/kliendid/warmeston_transparent_carousel.webp' },
  { name: 'Plastotec', logo: '/kliendid/plastotec_transparent_carousel.webp' },
  { name: 'Ecopress Waste System OÜ', logo: '/kliendid/ecopress-waste-system-ou_transparent_carousel.webp' },
  { name: 'Upgreat OÜ', logo: '/kliendid/upgreat-ou_transparent_carousel.webp' },
  { name: 'Sark Robotics OÜ', logo: '/kliendid/sark-robotics-ou_transparent_carousel.webp' }
];

function ClientLogoCarousel({ title, intro }) {
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isGliding, setIsGliding] = useState(false);
  const dragStartRef = useRef({ x: 0, offset: 0 });
  const dragMoveRef = useRef({ x: 0, time: 0, velocity: 0 });
  const glideFrameRef = useRef(null);
  const trackRef = useRef(null);
  const logoItems = useMemo(() => [...clientLogos, ...clientLogos, ...clientLogos], []);

  const wrapDragOffset = (offset) => {
    const cycleWidth = trackRef.current ? trackRef.current.scrollWidth / 3 : 0;

    if (!cycleWidth) {
      return offset;
    }

    const wrappedOffset = ((offset % cycleWidth) + cycleWidth) % cycleWidth;
    return wrappedOffset === 0 ? 0 : wrappedOffset - cycleWidth;
  };

  useEffect(
    () => () => {
      if (glideFrameRef.current) {
        window.cancelAnimationFrame(glideFrameRef.current);
      }
    },
    []
  );

  const handlePointerDown = (event) => {
    if (glideFrameRef.current) {
      window.cancelAnimationFrame(glideFrameRef.current);
    }

    setIsGliding(false);
    setIsDragging(true);
    dragStartRef.current = { x: event.clientX, offset: wrapDragOffset(dragOffset) };
    dragMoveRef.current = { x: event.clientX, time: performance.now(), velocity: 0 };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event) => {
    if (!isDragging) {
      return;
    }

    const now = performance.now();
    const elapsed = Math.max(now - dragMoveRef.current.time, 1);
    const velocity = (event.clientX - dragMoveRef.current.x) / elapsed;

    dragMoveRef.current = { x: event.clientX, time: now, velocity };
    setDragOffset(wrapDragOffset(dragStartRef.current.offset + event.clientX - dragStartRef.current.x));
  };

  const handlePointerUp = (event) => {
    setIsDragging(false);

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    let velocity = dragMoveRef.current.velocity;

    if (Math.abs(velocity) < 0.08) {
      return;
    }

    setIsGliding(true);

    let previousTime = performance.now();
    const glide = (currentTime) => {
      const elapsed = Math.min(currentTime - previousTime, 32);
      previousTime = currentTime;
      setDragOffset((currentOffset) => wrapDragOffset(currentOffset + velocity * elapsed));
      velocity *= Math.pow(0.82, elapsed / 16.67);

      if (Math.abs(velocity) < 0.04) {
        setIsGliding(false);
        return;
      }

      glideFrameRef.current = window.requestAnimationFrame(glide);
    };

    glideFrameRef.current = window.requestAnimationFrame(glide);
  };

  return (
    <section className={`overflow-hidden border-y border-fs-line/55 px-0 py-14 text-white ${darkSurfaceClass} lg:py-20`} aria-labelledby="client-logos-title">
      <div className="mb-8 px-5 sm:px-8 lg:px-[10vw]">
        <h2 className={`${h2Class} mb-4`} id="client-logos-title">
          {title}
        </h2>
        <p className="m-0 max-w-3xl text-[clamp(1.05rem,1.7vw,1.35rem)] leading-relaxed text-white/70">{intro}</p>
      </div>
      <div className="relative before:pointer-events-none before:absolute before:inset-y-0 before:left-0 before:z-10 before:w-16 before:bg-[linear-gradient(90deg,#050505,rgba(5,5,5,0))] after:pointer-events-none after:absolute after:inset-y-0 after:right-0 after:z-10 after:w-16 after:bg-[linear-gradient(270deg,#050505,rgba(5,5,5,0))] sm:before:w-28 sm:after:w-28">
        <div
          ref={trackRef}
          className={`logo-carousel-track flex w-max touch-pan-y select-none gap-5 px-5 ${isDragging || isGliding ? 'logo-carousel-track--dragging cursor-grabbing' : 'cursor-grab'}`}
          style={{ '--logo-drag-offset': `${dragOffset}px` }}
          aria-label={title}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          {logoItems.map((client, index) => {
            const isAccessibleCopy = index >= clientLogos.length && index < clientLogos.length * 2;

            return (
              <div
                className="grid size-56 shrink-0 place-items-center border border-fs-accent/35 bg-black/38 px-4 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)] transition hover:border-fs-accent sm:size-72 sm:px-5"
                key={`${client.name}-${index}`}
                aria-hidden={isAccessibleCopy ? undefined : 'true'}
              >
                <img className="max-h-28 w-[108%] max-w-none object-contain sm:max-h-36 sm:w-[112%]" src={assetPath(client.logo)} alt={client.name} loading="lazy" decoding="async" draggable="false" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function IconList({ items, itemClassName = liClass, iconClassName = 'bg-fs-accent' }) {
  return (
    <ul className="m-0 grid min-w-0 list-none gap-3.5 p-0">
      {items.map((item) => (
        <li className={`grid min-w-0 grid-cols-[1.35rem_minmax(0,1fr)] gap-3 ${itemClassName}`} key={item}>
          <span className={`mt-0.5 size-5 ${iconClassName}`} style={iconMask} aria-hidden="true" />
          <span className="min-w-0 whitespace-normal break-words [overflow-wrap:anywhere]">{item}</span>
        </li>
      ))}
    </ul>
  );
}

function ServiceCase({ service, labels, cta, index, id, refCallback, onContactClick }) {
  const validationPoints = service.solutionPoints.slice(0, 3);
  const outcomePoints = service.impact.slice(0, 3);
  const hasComparison = service.comparisonImages?.length > 0;
  const hasComparisonPair = service.comparisonImages?.length > 1;
  const stepLabelClass = 'mb-3 text-xs font-bold uppercase tracking-[0.18em] text-fs-accent';
  const bodyClass = 'text-[clamp(1.02rem,1.25vw,1.16rem)] leading-relaxed text-white/82';
  const mainContent = (
    <div className="grid min-w-0 gap-8">
      {!hasComparison && (
        <div>
          <p className="mb-5 text-base font-bold text-fs-accent">0{index + 1}</p>
          <h3 className="m-0 min-w-0 max-w-3xl break-words [overflow-wrap:anywhere] text-[clamp(1.7rem,2.3vw,2.55rem)] leading-tight font-bold text-white">{service.title}</h3>
        </div>
      )}

      <div className="min-w-0 max-w-3xl">
        <p className={`m-0 ${bodyClass}`}>{service.problem}</p>
      </div>

      <div className="min-w-0 max-w-3xl">
        <p className={stepLabelClass}>{service.validationLabel || labels.validation}</p>
        <p className={`mb-6 ${bodyClass}`}>{service.solutionLead}</p>
        <IconList items={validationPoints} itemClassName="mb-0 text-base leading-relaxed text-white/74" />
      </div>
    </div>
  );
  const outcomeBox = (
    <div className="w-full border border-fs-result/55 bg-black/24 p-6 lg:p-7">
      <div className="max-w-5xl">
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
  );

  return (
    <article
      id={id}
      ref={refCallback}
      className={`w-full min-w-0 max-w-full scroll-mt-28 overflow-hidden border-t border-fs-line/65 p-6 sm:p-9 lg:p-12 ${
        hasComparison ? 'bg-fs-panel' : 'bg-fs-panel/78'
      }`}
    >
      {hasComparison && (
        <div className="relative -mx-6 -mt-6 mb-10 overflow-hidden sm:-mx-9 sm:-mt-9 lg:-mx-12 lg:-mt-12 lg:mb-12">
          <div className={`grid ${hasComparisonPair ? 'sm:grid-cols-2' : ''}`}>
            {service.comparisonImages.map((image, imageIndex) => (
              <figure
                className={`relative m-0 min-w-0 overflow-hidden bg-black ${
                  hasComparisonPair ? 'h-80 sm:h-auto sm:aspect-[5/4]' : 'h-80 sm:h-auto sm:aspect-[5/2]'
                } ${hasComparisonPair && imageIndex === 0 ? 'hidden sm:block' : ''}`}
                key={image.src}
              >
                <img
                  className={`block h-full w-full object-cover ${
                    image.imageClassName ||
                    (image.focus === 'lower'
                      ? 'scale-100 object-[center_88%]'
                      : hasComparisonPair
                        ? '-translate-y-[12%] scale-[1.28] object-center'
                        : 'scale-[1.08] object-center')
                  }`}
                  src={assetPath(image.src)}
                  srcSet={image.sources ? assetSrcSet(image.sources) : undefined}
                  sizes={hasComparisonPair ? '(min-width: 640px) 50vw, 100vw' : '100vw'}
                  alt={image.alt}
                  loading="lazy"
                  decoding="async"
                />
                <div
                  className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(38,38,38,0.04)_0%,transparent_58%,rgba(38,38,38,0.16)_76%,rgba(38,38,38,0.82)_94%,rgba(38,38,38,1)_100%)]"
                  aria-hidden="true"
                />
              </figure>
            ))}
          </div>
          {service.overlayImage && (
            <div className={`absolute z-[5] overflow-hidden border border-white/22 bg-black/55 shadow-[0_16px_40px_rgba(0,0,0,0.38)] ${
              service.overlayImage.className || 'top-2 right-2 w-[36%] sm:top-3 sm:right-3 sm:w-[32%] lg:top-4 lg:right-4 lg:w-[31%]'
            }`}>
              <img
                className={`block ${service.overlayImage.imageClassName || 'h-auto w-full'}`}
                src={assetPath(service.overlayImage.src)}
                alt={service.overlayImage.alt}
                loading="lazy"
                decoding="async"
              />
            </div>
          )}
          <div
            className="pointer-events-none absolute inset-0 z-10 bg-[linear-gradient(90deg,rgba(38,38,38,0.58)_0%,rgba(38,38,38,0.14)_62%,transparent_100%)]"
            aria-hidden="true"
          />
          <div className="absolute inset-x-0 bottom-0 z-20 px-6 pb-8 sm:px-9 sm:pb-9 lg:px-12 lg:pb-10">
            <p className="mb-4 text-base font-bold text-fs-accent">0{index + 1}</p>
            <h3 className="m-0 min-w-0 max-w-3xl break-words [overflow-wrap:anywhere] text-[clamp(1.7rem,2.3vw,2.55rem)] leading-tight font-bold text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.75)]">{service.title}</h3>
          </div>
        </div>
      )}
      <div className="grid gap-8">
        {mainContent}
        {outcomeBox}
      </div>
    </article>
  );
}

function ServicesSection({ t, onContactClick }) {
  const [activeService, setActiveService] = useState(0);
  const serviceRefs = useRef([]);
  const orderedServices = useMemo(
    () => [t.services[2], t.services[1], t.services[4], t.services[3], t.services[0]],
    [t.services]
  );
  const serviceIds = useMemo(() => orderedServices.map((_, index) => `service-${index + 1}`), [orderedServices]);

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
    <section className="min-w-0 overflow-x-clip pb-20 lg:pb-36" id="services">
      <div className="mb-5 overflow-hidden border-t-4 border-fs-accent bg-black sm:mb-7 lg:mb-10">
        <div className="relative min-h-[520px] lg:min-h-[560px] xl:min-h-[600px]">
          <div className="relative z-10 grid h-full w-full min-w-0 max-w-full content-end gap-8 overflow-hidden px-5 pt-16 pb-8 sm:px-8 sm:pt-18 sm:pb-9 lg:px-[10vw] lg:py-12">
            <div className="w-[calc(100vw-2.5rem)] min-w-0 max-w-full sm:w-auto">
              <h2 className={`${h2Class} mb-6`}>{t.servicesTitle}</h2>
              <p className="w-full min-w-0 max-w-2xl whitespace-normal break-words [overflow-wrap:anywhere] text-[clamp(1.08rem,1.6vw,1.35rem)] leading-relaxed text-white/82">{t.servicesIntro}</p>
              <div className="mt-8 w-full min-w-0 max-w-2xl">
                <div className="grid min-w-0 gap-3">
                  {t.servicesQuestions.map((question, index) => (
                    <div className="flex w-full min-w-0 max-w-full items-start gap-4" key={question}>
                      <span className="mt-0.5 shrink-0 text-base font-bold text-fs-accent">{index + 1}</span>
                      <p className="m-0 min-w-0 flex-1 whitespace-normal break-words [overflow-wrap:anywhere] text-[clamp(1.05rem,1.45vw,1.25rem)] leading-snug text-white/90">{question}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid w-full min-w-0 max-w-full gap-10 px-5 sm:px-8 lg:grid-cols-[minmax(12rem,0.32fr)_minmax(0,1fr)] lg:items-start lg:gap-12 lg:px-[10vw] xl:grid-cols-[minmax(15rem,0.3fr)_minmax(0,1fr)]">
        <aside className="min-w-0 lg:sticky lg:top-28 lg:self-start" aria-label={t.servicesTitle}>
          <nav className="min-w-0 border-l border-white/12 pl-4 lg:pl-5">
            <ol className="m-0 grid min-w-0 list-none gap-1 p-0">
              {orderedServices.map((service, index) => {
                const isActive = activeService === index;

                return (
                  <li className="min-w-0" key={service.title}>
                    <a
                      className={`group grid w-full min-w-0 grid-cols-[2.25rem_minmax(0,1fr)] items-start gap-3 py-3 text-sm leading-snug no-underline transition ${
                        isActive ? 'text-white' : 'text-white/42 hover:text-white/70'
                      }`}
                      href={`#${serviceIds[index]}`}
                      aria-current={isActive ? 'true' : undefined}
                      onClick={(event) => handleServiceNavClick(event, index)}
                    >
                      <span className={`pt-0.5 font-bold transition ${isActive ? 'text-fs-accent' : 'text-white/28 group-hover:text-white/45'}`}>0{index + 1}</span>
                      <span className={`min-w-0 whitespace-normal break-words [overflow-wrap:anywhere] ${isActive ? 'font-bold' : ''}`}>{service.title}</span>
                    </a>
                  </li>
                );
              })}
            </ol>
          </nav>
        </aside>

        <div className="grid min-w-0 gap-10 lg:gap-14">
          {orderedServices.map((service, index) => (
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

function FaqTeaserSection({ t, language }) {
  return (
    <section className="border-y border-white/10 bg-[linear-gradient(145deg,#090909_0%,#151515_58%,#080808_100%)] px-5 py-18 sm:px-8 lg:px-[10vw] lg:py-28">
      <div className="min-w-0 max-w-4xl">
        <p className="mb-4 text-sm font-bold tracking-[0.16em] text-fs-accent uppercase">{t.faq.teaser.eyebrow}</p>
        <h2 className="mb-7 text-[clamp(2.25rem,4.6vw,4.8rem)] leading-none font-normal">{t.faq.teaser.title}</h2>
        <a
          className="mt-8 inline-flex min-h-12 items-center justify-center border border-fs-accent bg-fs-accent px-5 py-3 font-bold text-black no-underline transition hover:bg-white"
          href={getPagePath(language, 'factory-simulation-faq')}
        >
          {t.faq.teaser.link}
        </a>
      </div>
    </section>
  );
}

function SoftwareSection({ t }) {
  return (
    <section className={`${sectionClass} relative overflow-hidden border-y border-white/10 bg-[linear-gradient(145deg,#111_0%,#080808_52%,#101010_100%)]`} id="software">
      <div className="pointer-events-none absolute top-0 right-[8%] h-72 w-72 rounded-full bg-fs-accent/5 blur-3xl" aria-hidden="true" />
      <div className="relative">
        <div className="mb-14 max-w-4xl lg:mb-20">
          <p className="mb-4 text-sm font-bold tracking-[0.16em] text-fs-accent uppercase">{t.softwareLabel}</p>
          <h2 className={`${h2Class} mb-7`}>{t.softwareTitle}</h2>
          <p className="m-0 max-w-3xl text-[clamp(1.05rem,1.7vw,1.35rem)] leading-relaxed text-white/72">{t.softwareIntro}</p>
        </div>

        <div className="grid min-w-0 gap-x-12 gap-y-10 lg:grid-cols-2 lg:gap-y-14">
          {t.softwareCapabilities.map((capability) => (
            <article className="grid min-w-0 grid-cols-[4.5rem_minmax(0,1fr)] gap-5 border-t border-white/16 pt-7 sm:grid-cols-[7rem_minmax(0,1fr)] sm:gap-7" key={capability.title}>
              <div className="flex min-h-16 min-w-0 flex-wrap content-start items-center justify-center gap-3" aria-hidden="true">
                {capability.tools.flatMap((tool) => softwareBrands[tool]).map((logo) => (
                  <img
                    className={`h-auto w-auto object-contain ${logo.className}`}
                    src={assetPath(logo.src)}
                    alt=""
                    loading="lazy"
                    key={logo.src}
                  />
                ))}
              </div>
              <div className="min-w-0">
                <h3 className="mb-3 break-words text-[clamp(1.4rem,2vw,1.9rem)] leading-tight font-semibold text-white">{capability.title}</h3>
                <p className="m-0 max-w-xl text-base leading-relaxed text-white/66">{capability.description}</p>
              </div>
            </article>
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
      className={`flex h-8 items-center overflow-hidden border border-fs-accent/70 transition-[max-width,border-color] duration-200 ease-out ${
        alwaysOpen ? 'w-full max-w-full' : open ? 'w-full max-w-full lg:max-w-[min(42rem,58vw)]' : 'w-8 max-w-8'
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
      <button className="grid size-8 shrink-0 place-items-center text-fs-accent transition hover:bg-fs-accent hover:text-black" type="submit" aria-label={label} title={label}>
        <SearchIcon />
      </button>
    </form>
  );
}

function SearchPage({ t, language, query, onContactSubmit, onContactInput, contactStatus, contactErrors }) {
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
                    <img className="h-44 w-full object-cover md:h-full" src={assetPath(post.image)} alt="" loading="lazy" decoding="async" />
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
              <form className="relative grid gap-4" onSubmit={onContactSubmit} onInput={onContactInput} noValidate>
                <label className="absolute -left-[9999px]" aria-hidden="true">
                  Company
                  <input name="company" tabIndex="-1" autoComplete="off" />
                </label>
                <input type="hidden" name="source" value="search" />
                <label className="grid gap-2 text-sm font-bold text-white/82">
                  {t.form.name}
                  <input
                    className="w-full border-0 bg-white px-3.5 py-3 font-sans font-normal text-black"
                    name="name"
                    placeholder={t.form.placeholders.name}
                    autoComplete="name"
                    aria-invalid={Boolean(contactErrors?.name)}
                    aria-describedby={contactErrors?.name ? 'search-contact-name-error' : undefined}
                    required
                  />
                  {contactErrors?.name && <span className="text-sm font-normal text-red-300" id="search-contact-name-error">{t.form.validation[contactErrors.name]}</span>}
                </label>
                <label className="grid gap-2 text-sm font-bold text-white/82">
                  {t.form.email}
                  <input
                    className="w-full border-0 bg-white px-3.5 py-3 font-sans font-normal text-black"
                    type="email"
                    name="email"
                    placeholder={t.form.placeholders.email}
                    autoComplete="email"
                    aria-invalid={Boolean(contactErrors?.email)}
                    aria-describedby={contactErrors?.email ? 'search-contact-email-error' : undefined}
                    required
                  />
                  {contactErrors?.email && <span className="text-sm font-normal text-red-300" id="search-contact-email-error">{t.form.validation[contactErrors.email]}</span>}
                </label>
                <label className="grid gap-2 text-sm font-bold text-white/82">
                  {t.form.description}
                  <textarea
                    className="w-full border-0 bg-white px-3.5 py-3 font-sans font-normal text-black"
                    name="description"
                    placeholder={t.form.placeholders.description}
                    rows="5"
                    minLength="5"
                    aria-invalid={Boolean(contactErrors?.description)}
                    aria-describedby={contactErrors?.description ? 'search-contact-description-error' : undefined}
                    required
                  />
                  {contactErrors?.description && <span className="text-sm font-normal text-red-300" id="search-contact-description-error">{t.form.validation[contactErrors.description]}</span>}
                </label>
                <PrivacyNotice
                  t={t}
                  language={language}
                  className="text-sm leading-snug text-white/62"
                  linkClassName="text-white underline transition hover:text-fs-accent"
                />
                <button
                  className={`inline-flex min-h-12 items-center justify-center gap-2 border-0 px-4 font-bold transition ${
                    contactStatus === 'success'
                      ? 'cursor-default bg-emerald-500 text-black'
                      : contactStatus === 'sending'
                        ? 'cursor-wait bg-fs-accent text-black'
                        : 'cursor-pointer bg-fs-accent text-black hover:bg-white disabled:cursor-not-allowed disabled:opacity-45'
                  }`}
                  type="submit"
                  disabled={contactStatus === 'sending' || contactStatus === 'success'}
                  aria-live="polite"
                >
                  {contactStatus === 'sending' && (
                    <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" aria-hidden="true" />
                  )}
                  {contactStatus === 'success' ? t.form.success : contactStatus === 'sending' ? t.form.sending : t.form.send}
                </button>
                {contactStatus === 'error' && (
                  <p className="m-0 text-sm text-red-300" role="alert">
                    {t.form.error}{' '}
                    <a className="font-bold text-white underline" href="mailto:info@factorysimulation.eu">{t.form.directEmail}</a>
                  </p>
                )}
              </form>
            </div>
          </section>
        </>
      )}
    </section>
  );
}

const brandColors = [
  { name: 'Factory Black', value: '#000000', text: '#ffffff', role: 'Primary background' },
  { name: 'Graphite', value: '#111111', text: '#ffffff', role: 'Secondary surface' },
  { name: 'Industrial Panel', value: '#262626', text: '#ffffff', role: 'Panels and framed media' },
  { name: 'Simulation Gold', value: '#e2ab19', text: '#000000', role: 'Primary brand accent' },
  { name: 'Logo Gold', value: '#dca41c', text: '#000000', role: 'Logo artwork' },
  { name: 'Consultation Green', value: '#8fd6a3', text: '#000000', role: 'Consultation and action states' },
  { name: 'Result Purple', value: '#8f83d8', text: '#ffffff', role: 'Validated results and highlights' }
];

const brandVoiceUse = [
  'Clear claims tied to validation, risk reduction, cycle time, throughput, layout, automation, and commissioning.',
  'Concrete outcomes: fewer costly changes, faster project launch, better investment decisions, verified capacity.',
  'Calm confidence with short, structured copy that is easy to scan.'
];

const brandVoiceAvoid = [
  'Decorative or lifestyle-heavy language.',
  'Overpromising exact savings without project evidence.',
  'Making simulation sound like a visual gimmick instead of an engineering decision tool.'
];

function BrandPage({ language }) {
  return (
    <div className="bg-black text-white">
      <section className="relative grid min-h-[72vh] content-center gap-9 overflow-hidden border-b-3 border-fs-accent px-5 py-18 sm:px-8 lg:px-[10vw] lg:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(226,171,25,0.16)_1px,transparent_0),linear-gradient(135deg,#000_0%,#111_46%,#262626_100%)] bg-[length:34px_34px,auto]" aria-hidden="true" />
        <div className="relative z-10">
          <nav className="mb-10 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.14em] text-white/45" aria-label="Breadcrumb">
            <a className="text-white/55 no-underline transition hover:text-fs-accent" href={getPagePath(language, 'home')}>
              {content[language].breadcrumbHome}
            </a>
            <span className="text-fs-accent" aria-hidden="true">
              /
            </span>
            <span className="text-fs-accent">Brand</span>
          </nav>
          <img className="mb-10 block h-auto w-[min(20rem,70vw)]" src={assetPath('/logo.svg')} alt="Factory Simulation" decoding="async" />
          <div className="max-w-5xl">
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.18em] text-fs-accent">Brand Identity</p>
            <h1 className="mb-7 text-[clamp(2.75rem,7vw,5.75rem)] leading-none font-semibold">From concept to a confident investment decision</h1>
            <p className="max-w-4xl text-[clamp(1.15rem,2vw,1.65rem)] leading-snug text-white/76">
              A dark, technical, industrial identity for production simulation, digital twins, factory planning, automation validation, and virtual commissioning.
            </p>
          </div>
          <div className="mt-9 flex flex-wrap gap-3.5">
            <a className="inline-flex min-h-12 items-center justify-center border border-fs-accent bg-fs-accent px-5 py-3 font-bold text-black no-underline transition hover:bg-white" href={assetPath('/logo.svg')}>
              Download logo
            </a>
            <a className="inline-flex min-h-12 items-center justify-center border border-fs-accent px-5 py-3 font-bold text-white no-underline transition hover:bg-fs-accent hover:text-black" href={assetPath('/social-preview.png')}>
              Social preview
            </a>
          </div>
        </div>
      </section>

      <section className={sectionClass}>
        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(320px,1.1fr)] lg:gap-[7vw]">
          <div>
            <h2 className={h2Class}>Brand Core</h2>
            <div className="grid gap-5 text-[clamp(1.05rem,1.6vw,1.32rem)] leading-relaxed text-white/76">
              <p className="m-0"><span className="font-bold text-white">Company name:</span> Factory Simulation</p>
              <p className="m-0"><span className="font-bold text-white">Legal name:</span> Factory Simulation OÜ</p>
              <p className="m-0"><span className="font-bold text-white">Primary descriptor:</span> Digital twin solutions for production, factory planning, simulation, automation validation, and virtual commissioning.</p>
              <p className="m-0"><span className="font-bold text-white">Short positioning:</span> Factory Simulation helps manufacturers and integrators validate production decisions virtually before expensive physical changes.</p>
            </div>
          </div>
          <div className="border-t-4 border-fs-accent bg-white p-7 text-black sm:p-9">
            <h3 className="mb-5 text-[clamp(1.8rem,3vw,3.2rem)] leading-none font-normal text-fs-panel">Brand Promise</h3>
            <p className="mb-5 text-[clamp(1.35rem,2.2vw,2.1rem)] leading-tight font-semibold">From concept to a confident investment decision.</p>
            <p className="m-0 text-lg leading-relaxed text-fs-panel/74">
              Factory Simulation reduces implementation risk by testing layouts, material flows, robot cells, PLC logic, throughput, and production concepts before installation or commissioning.
            </p>
          </div>
        </div>
      </section>

      <section className={`${sectionClass} border-y border-fs-line bg-black/50`}>
        <h2 className={h2Class}>Logo</h2>
        <div className="grid gap-8 lg:grid-cols-[minmax(280px,0.85fr)_minmax(0,1fr)] lg:items-start">
          <div className="grid min-h-72 place-items-center border border-white/16 bg-fs-panel p-8">
            <img className="w-full max-w-sm" src={assetPath('/logo.svg')} alt="Factory Simulation" loading="lazy" decoding="async" />
          </div>
          <div className="grid gap-5 text-lg leading-relaxed text-white/76">
            <p className="m-0">Use the SVG logo wherever possible. Place it on black or very dark industrial backgrounds.</p>
            <p className="m-0">Keep clear space around the mark equal to at least the height of the gold FS block inside the logo.</p>
            <p className="m-0">Do not recolor, stretch, rotate, add shadows, place on white tiles, or use over busy imagery without a dark overlay.</p>
            <div className="grid gap-2 border-t border-white/14 pt-5 text-base text-white/62">
              <p className="m-0">Digital header: 112 px wide or larger.</p>
              <p className="m-0">Footer or small placement: 96 px wide or larger.</p>
              <p className="m-0">Favicon or app icon: use the existing favicon asset.</p>
            </div>
          </div>
        </div>
      </section>

      <section className={sectionClass}>
        <h2 className={h2Class}>Color System</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {brandColors.map((color) => (
            <article
              className="grid min-h-40 content-end border border-white/16 p-4"
              key={color.name}
              style={{ backgroundColor: color.value, color: color.text }}
            >
              <h3 className="mb-1 text-xl leading-tight font-bold">{color.name}</h3>
              <p className="m-0 text-sm font-bold uppercase tracking-[0.14em] opacity-70">{color.value}</p>
              <p className="mt-3 mb-0 text-sm leading-snug opacity-74">{color.role}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={`${sectionClass} border-y border-fs-line bg-fs-panel/48`}>
        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(320px,1.2fr)] lg:gap-[7vw]">
          <div>
            <h2 className={h2Class}>Typography</h2>
            <p className="max-w-2xl text-[clamp(1.05rem,1.6vw,1.32rem)] leading-relaxed text-white/72">
              Space Grotesk gives the brand its practical engineering confidence. Use it for headlines, body copy, navigation, labels, and interface text.
            </p>
          </div>
          <div className="grid gap-7">
            <p className="m-0 text-[clamp(2.5rem,5.8vw,4.8rem)] leading-none font-semibold">Space Grotesk</p>
            <p className="m-0 text-[clamp(1.25rem,2vw,1.75rem)] leading-snug text-white/78">Headlines are direct and compact. Body copy stays readable, technical, and grounded in production decisions.</p>
            <p className="m-0 text-sm font-bold uppercase tracking-[0.16em] text-fs-accent">Navigation and labels use modest uppercase tracking</p>
          </div>
        </div>
      </section>

      <section className={sectionClass}>
        <h2 className={h2Class}>Voice</h2>
        <div className="grid gap-6 lg:grid-cols-2">
          <article className="border-t-4 border-fs-accent bg-white p-7 text-black sm:p-8">
            <h3 className="mb-5 text-2xl font-bold text-fs-panel">Use</h3>
            <ul className="m-0 grid gap-3 pl-5 text-base leading-relaxed text-fs-panel/76">
              {brandVoiceUse.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
          <article className="border border-white/16 bg-fs-panel p-7 sm:p-8">
            <h3 className="mb-5 text-2xl font-bold">Avoid</h3>
            <ul className="m-0 grid gap-3 pl-5 text-base leading-relaxed text-white/74">
              {brandVoiceAvoid.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        </div>
      </section>

      <section className={`${sectionClass} border-t border-fs-line`}>
        <h2 className={h2Class}>Messaging</h2>
        <div className="grid gap-6 lg:grid-cols-2">
          <article className="border border-white/16 bg-fs-panel p-7 sm:p-8">
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.16em] text-fs-accent">English</p>
            <h3 className="mb-4 text-[clamp(1.7rem,3vw,3rem)] leading-tight font-semibold">From concept to a confident investment decision</h3>
            <p className="mb-6 text-base leading-relaxed text-white/72">We help integrators and manufacturing companies validate automation virtually before installation and commissioning, from robot motion and cycle time to production capacity, PLC logic, and equipment cooperation.</p>
            <p className="m-0 text-sm font-bold uppercase tracking-[0.16em] text-white/52">Your production engineering partner</p>
          </article>
          <article className="border border-white/16 bg-fs-panel p-7 sm:p-8">
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.16em] text-fs-accent">Estonian</p>
            <h3 className="mb-4 text-[clamp(1.7rem,3vw,3rem)] leading-tight font-semibold">Kontseptsioonist kindla investeerimisotsuseni</h3>
            <p className="mb-6 text-base leading-relaxed text-white/72">Aitame integraatoritel ja tootmisettevõtetel automatiseerimist enne paigaldust ja käivitamist virtuaalselt valideerida, alates roboti liikumisest ja tsükliajast kuni tootmisvõimekuse, PLC-loogika ning seadmete koostööni.</p>
            <p className="m-0 text-sm font-bold uppercase tracking-[0.16em] text-white/52">Sinu tootmise insenertehniline partner</p>
          </article>
        </div>
      </section>
    </div>
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
            className="grid bg-white p-7 text-black shadow-2xl shadow-black/25 sm:p-9"
            key={post.title}
          >
            <div className="grid">
              <div>
                <div className="-mx-7 -mt-7 mb-8 overflow-hidden bg-fs-panel/8 sm:-mx-9 sm:-mt-9">
                  <img className="block aspect-[16/8.5] w-full object-cover object-center" src={assetPath(post.image)} alt="" loading={index === 0 ? 'eager' : 'lazy'} decoding="async" />
                </div>

                <div className="mb-6 grid gap-1 text-xs font-bold uppercase tracking-[0.18em]">
                  <p className="m-0 text-fs-accent">{post.category}</p>
                  <p className="m-0 text-fs-panel/45">{post.date}</p>
                </div>
                <h2 className="mb-6 text-[clamp(1.35rem,2vw,1.9rem)] leading-tight font-bold text-fs-panel">{post.title}</h2>

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
          </article>
        ))}
      </div>
    </section>
  );
}

function FaqAnswerContent({ item }) {
  return (
    <div className="grid gap-4 text-base leading-relaxed text-white/74">
      {item.answer.map((paragraph) => (
        <p className="m-0" key={paragraph}>{paragraph}</p>
      ))}
      {item.points && (
        <ul className="m-0 grid gap-2 pl-5">
          {item.points.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

function FactorySimulationFaqPage({ t, language, onContactClick }) {
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
          <span className="text-fs-accent">{t.faq.breadcrumb}</span>
        </nav>
        <h1 className={h2Class}>{t.faq.title}</h1>
        <div className="grid max-w-3xl gap-4 text-[clamp(1.05rem,1.7vw,1.35rem)] leading-relaxed text-white/72">
          {t.faq.intro.map((paragraph) => (
            <p className="m-0" key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </div>

      <div className="grid max-w-5xl gap-8">
        {t.faq.items.map((item, index) => (
          <article className="grid min-w-0 gap-5 border-t border-white/16 pt-7 sm:grid-cols-[4rem_minmax(0,1fr)] sm:gap-7" id={`faq-${index + 1}`} key={item.question}>
            <span className="text-sm font-bold text-fs-accent sm:pt-2">0{index + 1}</span>
            <div className="min-w-0">
              <h2 className="mb-4 break-words text-[clamp(1.4rem,2.5vw,2.35rem)] leading-tight font-semibold text-white">{item.question}</h2>
              <FaqAnswerContent item={item} />
            </div>
          </article>
        ))}
      </div>

      <div className="mt-16 border-t-4 border-fs-accent bg-white p-7 text-black sm:p-9 lg:mt-24 lg:grid lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:gap-10">
        <div>
          <h2 className="mb-4 max-w-4xl text-[clamp(1.9rem,3.8vw,4rem)] leading-none font-normal">{t.faq.cta.title}</h2>
          <p className="m-0 max-w-3xl text-[clamp(1.05rem,1.55vw,1.28rem)] leading-relaxed text-fs-panel/76">{t.faq.cta.text}</p>
        </div>
        <a
          className="mt-7 inline-flex min-h-12 items-center justify-center border border-fs-panel bg-fs-panel px-5 py-3 font-bold text-white no-underline transition hover:border-fs-accent hover:bg-fs-accent hover:text-black lg:mt-0"
          href={getPagePath(language, 'home', '#contact')}
          onClick={onContactClick}
        >
          {t.faq.cta.button}
        </a>
      </div>
    </section>
  );
}

function PrivacyPolicyPage({ t, language }) {
  const supplement = privacySupplement[language] || privacySupplement.en;
  const sections = [...t.privacy.sections, ...supplement.sections];

  return (
    <section className={`${sectionClass} min-h-[calc(100vh-5rem)]`}>
      <div className="mb-12 max-w-3xl">
        <nav className="mb-5 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.14em] text-white/45" aria-label="Breadcrumb">
          <a className="text-white/55 no-underline transition hover:text-fs-accent" href={getPagePath(language, 'home')}>
            {t.breadcrumbHome}
          </a>
          <span className="text-fs-accent" aria-hidden="true">
            /
          </span>
          <span className="text-fs-accent">{t.privacy.breadcrumb}</span>
        </nav>
        <h1 className={h2Class}>{t.privacy.title}</h1>
        <p className="mb-4 text-lg leading-relaxed text-white/76">{supplement.intro}</p>
        <p className="m-0 text-sm text-white/55">{supplement.updated}</p>
      </div>

      <div className="grid max-w-3xl gap-9 text-white/76">
        {sections.map((section) => (
          <section key={section.title}>
            <h2 className="mb-3 text-xl leading-tight font-bold text-white">{section.title}</h2>
            <div className="grid gap-3 text-base leading-relaxed">
              {section.paragraphs.map((paragraph) => (
                <p className="m-0" key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </section>
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
      <img className={imageClassName} src={assetPath(src)} alt="" loading="lazy" decoding="async" />
      <span className="absolute right-2 bottom-2 grid size-8 place-items-center text-black drop-shadow-[0_1px_2px_rgba(255,255,255,0.65)]" aria-hidden="true">
        <svg className="size-4.5" viewBox="0 0 24 24" fill="none">
          <path d="m20 20-4.2-4.2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <circle cx="10.8" cy="10.8" r="5.8" stroke="currentColor" strokeWidth="2" />
        </svg>
      </span>
    </button>
  );
}

function PrivacyNotice({ t, language, className = 'text-sm leading-snug text-black/70', linkClassName = 'font-semibold text-black underline' }) {
  return (
    <p className={`m-0 ${className}`}>
      {t.form.privacyNotice.before}
      <a className={linkClassName} href={getPagePath(language, 'privacy')}>
        {t.form.privacyNotice.link}
      </a>
      {t.form.privacyNotice.after}
    </p>
  );
}

function ContactForm({ t, language, onSubmit, onInput, status, errors, nameRef, idPrefix, source, className = '', title, intro }) {
  const errorId = (field) => `${idPrefix}-${field}-error`;

  return (
    <form className={`relative grid min-w-0 gap-4.5 ${className}`} onSubmit={onSubmit} onInput={onInput} noValidate>
      {(title || intro) && (
        <div className="mb-1">
          {title && <h3 className="mb-2 text-[clamp(1.35rem,1.9vw,1.85rem)] leading-tight font-bold">{title}</h3>}
          {intro && <p className="m-0 text-[clamp(0.98rem,1.15vw,1.08rem)] leading-relaxed">{intro}</p>}
        </div>
      )}
      <label className="absolute -left-[9999px]" aria-hidden="true">
        Company
        <input name="company" tabIndex="-1" autoComplete="off" />
      </label>
      <input type="hidden" name="source" value={source} />
      <label className="grid gap-2">
        {t.form.name}
        <input
          ref={nameRef}
          className="w-full border-0 bg-white/72 px-3.5 py-3 font-sans text-black"
          name="name"
          placeholder={t.form.placeholders.name}
          autoComplete="name"
          aria-invalid={Boolean(errors?.name)}
          aria-describedby={errors?.name ? errorId('name') : undefined}
          required
        />
        {errors?.name && <span className="text-sm text-red-950" id={errorId('name')}>{t.form.validation[errors.name]}</span>}
      </label>
      <label className="grid gap-2">
        {t.form.email}
        <input
          className="w-full border-0 bg-white/72 px-3.5 py-3 font-sans text-black"
          type="email"
          name="email"
          placeholder={t.form.placeholders.email}
          autoComplete="email"
          aria-invalid={Boolean(errors?.email)}
          aria-describedby={errors?.email ? errorId('email') : undefined}
          required
        />
        {errors?.email && <span className="text-sm text-red-950" id={errorId('email')}>{t.form.validation[errors.email]}</span>}
      </label>
      <label className="grid gap-2">
        {t.form.description}
        <textarea
          className="w-full border-0 bg-white/72 px-3.5 py-3 font-sans text-black"
          name="description"
          placeholder={t.form.placeholders.description}
          rows="6"
          minLength="5"
          aria-invalid={Boolean(errors?.description)}
          aria-describedby={errors?.description ? errorId('description') : undefined}
          required
        />
        {errors?.description && <span className="text-sm text-red-950" id={errorId('description')}>{t.form.validation[errors.description]}</span>}
      </label>
      <PrivacyNotice t={t} language={language} />
      <button
        className={`inline-flex min-h-14 items-center justify-center gap-2 border-0 px-5 font-bold transition ${
          status === 'success'
            ? 'cursor-default bg-emerald-600 text-white'
            : status === 'sending'
              ? 'cursor-wait bg-black text-fs-accent'
              : 'cursor-pointer bg-black text-fs-accent disabled:cursor-not-allowed disabled:opacity-45'
        }`}
        type="submit"
        disabled={status === 'sending' || status === 'success'}
        aria-live="polite"
      >
        {status === 'sending' && (
          <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" aria-hidden="true" />
        )}
        {status === 'success' ? t.form.success : status === 'sending' ? t.form.sending : t.form.send}
      </button>
      {status === 'error' && (
        <p className="m-0 text-sm text-red-950" role="alert">
          {t.form.error}{' '}
          <a className="font-bold text-black underline" href="mailto:info@factorysimulation.eu">{t.form.directEmail}</a>
        </p>
      )}
    </form>
  );
}

function WheelmePage({
  t,
  language,
  onContactClick,
  onOpenImage,
  onContactSubmit,
  onContactInput,
  contactStatus,
  contactErrors
}) {
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
                <img className="h-5 w-auto" src={assetPath('/wheelme/wheel.me_logo_white.webp')} alt="wheel.me" decoding="async" />
                <span className="text-xs font-bold uppercase tracking-[0.14em] text-white/68">{t.wheelmePage.authorizedReseller}</span>
              </div>
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-xl xl:max-w-none">
            <img
              className="aspect-[4/5] max-h-[72vh] w-full object-cover shadow-2xl shadow-black/35 xl:aspect-[5/6]"
              src={assetPath(t.wheelmePage.images.hero)}
              srcSet={assetSrcSet([
                { src: t.wheelmePage.images.heroMobile, width: 820 },
                { src: t.wheelmePage.images.hero, width: 1400 }
              ])}
              sizes="(min-width: 1280px) 42vw, min(100vw, 36rem)"
              alt=""
              decoding="async"
            />
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
        <div className="grid items-start gap-10 lg:grid-cols-[minmax(260px,0.8fr)_minmax(320px,560px)] lg:gap-[8vw]">
          <div className="min-w-0">
            <h2 className="mb-4 text-[clamp(2.2rem,4vw,4.5rem)] leading-none font-normal max-w-4xl">{t.wheelmePage.ctaTitle}</h2>
            <p className="max-w-3xl text-[clamp(1.1rem,1.6vw,1.45rem)] leading-snug">{t.wheelmePage.ctaText}</p>
          </div>
          <ContactForm
            t={t}
            language={language}
            onSubmit={onContactSubmit}
            onInput={onContactInput}
            status={contactStatus}
            errors={contactErrors}
            idPrefix="wheelme-contact"
            source="wheelme"
          />
        </div>
      </section>
    </>
  );
}

function GermanFaqContent({ t }) {
  const navigateToGermanContact = (event) => {
    event.preventDefault();
    window.location.href = getPagePath('de', 'home', '#kontakt');
  };

  return (
    <div className={`${darkSurfaceClass} text-white`}>
      <FactorySimulationFaqPage t={t} language="de" onContactClick={navigateToGermanContact} />
    </div>
  );
}

function OriginalFooter({ t, language }) {
  return (
    <footer className={`grid items-center gap-8 border-t border-fs-line px-6 py-10 text-white lg:grid-cols-[180px_1fr_auto] lg:px-[7vw] ${darkSurfaceClass}`}>
      <img className="w-40" src={assetPath('/logo.svg')} alt="Factory Simulation" />
      <div>
        <h2 className="mb-2.5 text-xl font-bold">{t.contacts}</h2>
        <a className="mb-1.5 block text-white" href="mailto:info@factorysimulation.eu">info@factorysimulation.eu</a>
        <a className="mb-1.5 block text-sm text-white/60 no-underline transition hover:text-fs-accent" href={getPagePath(language, 'factory-simulation-faq')}>{t.faq.breadcrumb}</a>
        <a className="mb-1.5 block text-sm text-white/60 no-underline transition hover:text-fs-accent" href={getPagePath(language, 'privacy')}>{t.privacy.title}</a>
        <button className="block border-0 bg-transparent p-0 text-left text-sm text-white/60 transition hover:text-fs-accent" type="button" onClick={requestPrivacySettings}>
          {(consentContent[language] || consentContent.en).reopen}
        </button>
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
        <p className="m-0 text-white/70">Factory Simulation</p>
        <p className="mt-2 mb-0 text-xs text-white/45">Last updated {lastUpdated} · {buildCommit} · v{appVersion}</p>
      </div>
    </footer>
  );
}

function GermanOriginalSections({ t }) {
  const navigateToGermanContact = (event) => {
    event.preventDefault();
    document.getElementById('kontakt')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className={`${darkSurfaceClass} text-white`}>
      <ServicesSection t={t} onContactClick={navigateToGermanContact} />

      <SoftwareSection t={t} />

      <ClientLogoCarousel title={t.clientLogosTitle} intro={t.clientLogosIntro} />

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
                      <img className="h-full w-full object-cover grayscale transition duration-300 group-hover:grayscale-0" src={assetPath(person.image)} alt={person.name} loading="lazy" decoding="async" />
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
                        <img className={`${partner.large ? 'max-h-32' : 'max-h-28'} w-full object-contain ${partner.imageClassName || ''}`} src={assetPath(partner.logo)} alt={partner.name} loading="lazy" decoding="async" />
                      </a>
                    ) : (
                      <img className={`${partner.large ? 'max-h-32' : 'max-h-28'} w-full object-contain ${partner.imageClassName || ''}`} src={assetPath(partner.logo)} alt={partner.name} loading="lazy" decoding="async" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function App() {
  const [language, setLanguage] = useState(getLanguageFromPath);
  const [route, setRoute] = useState(getRouteFromPath);
  const [searchQuery, setSearchQuery] = useState(getSearchQuery);
  const [menuOpen, setMenuOpen] = useState(false);
  const [desktopSearchOpen, setDesktopSearchOpen] = useState(Boolean(getSearchQuery()));
  const [lightboxImage, setLightboxImage] = useState(null);
  const [contactStatus, setContactStatus] = useState('idle');
  const [contactErrors, setContactErrors] = useState(null);
  const contactNameRef = useRef(null);
  const t = content[language];
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
    setContactErrors(null);
  }, [route, searchQuery]);

  useEffect(() => {
    if (route !== 'brand' && !languages.includes(getPathWithoutBase().split('/').filter(Boolean)[0])) {
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
        ? localizedValue(
            {
              et: `Otsingu tulemused: ${searchQuery} | Factory Simulation`,
              en: `Search results: ${searchQuery} | Factory Simulation`,
              de: `Suchergebnisse: ${searchQuery} | Factory Simulation`
            },
            language
          )
        : route === 'privacy'
        ? localizedValue(
            {
              et: 'Privaatsuspoliitika | Factory Simulation',
              en: 'Privacy Policy | Factory Simulation',
              de: 'Datenschutzerklärung | Factory Simulation'
            },
            language
          )
        : route === 'wheelme'
        ? localizedValue(
            {
              et: 'Wheel.me autonoomne siselogistika | Factory Simulation',
              en: 'Wheel.me autonomous internal logistics | Factory Simulation',
              de: 'Autonome interne Logistik mit Wheel.me | Factory Simulation'
            },
            language
          )
        : route === 'blog'
        ? localizedValue(
            {
              et: 'Uudised & blogi | Factory Simulation',
              en: 'News & Blog | Factory Simulation',
              de: 'News & Blog | Factory Simulation'
            },
            language
          )
        : route === 'factory-simulation-faq'
        ? t.faq.metaTitle
        : route === 'brand'
        ? 'Brand Identity | Factory Simulation'
        : localizedValue(
            {
              et: 'Factory Simulation | Tootmise simulatsioonid ja tehase planeerimine',
              en: 'Factory Simulation | Digital Twin Solutions',
              de: 'Factory Simulation | Digitale Zwillinge und Produktionssimulation'
            },
            language
          );

    const description = document.querySelector('meta[name="description"]');
    if (description) {
      description.setAttribute(
        'content',
        searchQuery
          ? localizedValue(
              {
                et: `Otsingu tulemused märksõnale ${searchQuery}.`,
                en: `Search results for ${searchQuery}.`,
                de: `Suchergebnisse für ${searchQuery}.`
              },
              language
            )
          : route === 'privacy'
          ? localizedValue(
              {
                et: 'Factory Simulationi privaatsuspoliitika ja kontaktvormi andmete töötlemise põhimõtted.',
                en: 'Factory Simulation Privacy Policy and contact form data processing principles.',
                de: 'Datenschutzerklärung von Factory Simulation und Grundsätze zur Verarbeitung von Kontaktformulardaten.'
              },
              language
            )
          : route === 'wheelme'
          ? localizedValue(
              {
                et: 'Wheel.me autonoomne mobiilsete robotite lahendus tootmise ja lao siselogistika automatiseerimiseks.',
                en: 'Wheel.me autonomous mobile robot solution for automating internal logistics in production and warehouses.',
                de: 'Autonome mobile Roboterlösung von Wheel.me zur Automatisierung interner Logistik in Produktion und Lager.'
              },
              language
            )
          : route === 'blog'
          ? localizedValue(
              {
                et: 'Factory Simulationi uudised, blogipostitused ja lood tootmise simulatsioonidest.',
                en: 'Factory Simulation news, blog posts and stories about production simulation.',
                de: 'Factory Simulation News, Blogbeiträge und Geschichten über Produktionssimulation.'
              },
              language
            )
          : route === 'factory-simulation-faq'
          ? t.faq.metaDescription
          : route === 'brand'
          ? 'Factory Simulation brand identity, logo usage, colors, typography, messaging, and visual guidance.'
          : localizedValue(
              {
                et: 'Tootmise simuleerimine, tehase paigutuse planeerimine ja digitaalsed mudelid tööstusettevõtetele.',
                en: 'Factory Simulation creates a dynamic view of production with simulations and digital models.',
                de: 'Factory Simulation schafft mit Simulationen und digitalen Modellen einen dynamischen Blick auf die Produktion.'
              },
              language
            )
      );
    }

    const origin = window.location.origin;
    const headLinks =
      route === 'brand'
        ? [['canonical', language, `${origin}${getPagePath(language, route)}`]]
        : [
            ['canonical', language, `${origin}${getPagePath(language, route)}`],
            ...languages.map((languageCode) => ['alternate', languageCode, `${origin}${getPagePath(languageCode, route)}`])
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

  const switchLanguage = (nextLanguage) => {
    if (nextLanguage === language) {
      return;
    }

    window.localStorage?.setItem(languagePreferenceKey, nextLanguage);
    setMenuOpen(false);
    const destinationRoute = route;
    const destinationPath = searchQuery
      ? getSearchPath(nextLanguage, searchQuery)
      : getPagePath(nextLanguage, destinationRoute, destinationRoute === 'home' && route === 'home' ? window.location.hash : '');

    setLanguage(nextLanguage);
    window.history.pushState(null, '', destinationPath);
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

  const handleContactSubmit = async (event) => {
    event.preventDefault();

    const form = event.currentTarget;
    if (contactStatus === 'sending' || contactStatus === 'success') {
      return;
    }

    const validationErrors = getContactFormErrors(form);
    setContactErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      form.elements.namedItem(Object.keys(validationErrors)[0])?.focus();
      return;
    }

    const formData = new FormData(form);
    const name = String(formData.get('name') || '').trim();
    const email = String(formData.get('email') || '').trim();
    const description = String(formData.get('description') || '').trim();
    const company = String(formData.get('company') || '').trim();
    const source = String(formData.get('source') || 'main').trim();
    const subject = localizedValue(
      {
        et: 'Uus projektipäring',
        en: 'New project inquiry',
        de: 'Neue Projektanfrage'
      },
      language
    );
    const body = [
      `${t.form.name}: ${name}`,
      `${t.form.email}: ${email}`,
      '',
      `${t.form.description}:`,
      description
    ].join('\n');

    if (!contactEndpoint) {
      window.location.href = `mailto:info@factorysimulation.eu?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      return;
    }

    setContactStatus('sending');

    try {
      const [request] = await Promise.all([
        fetch(contactEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, description, language, company, source })
        })
          .then((response) => ({ response }))
          .catch((error) => ({ error })),
        new Promise((resolve) => window.setTimeout(resolve, 2000))
      ]);

      if (request.error) {
        throw request.error;
      }

      if (!request.response.ok) {
        throw new Error(`Contact request failed with status ${request.response.status}`);
      }

      form.reset();
      setContactErrors(null);
      setContactStatus('success');
      trackLeadConversion();
    } catch (error) {
      console.error('Contact form submission failed.', error);
      setContactStatus('error');
    }
  };

  const handleContactInput = (event) => {
    if (contactErrors !== null) {
      setContactErrors(getContactFormErrors(event.currentTarget));
    }
    if (contactStatus === 'error') {
      setContactStatus('idle');
    }
  };

  return (
    <div className={`min-h-screen ${darkSurfaceClass} text-white`}>
      <header className="sticky top-0 z-40 flex min-h-16 min-w-0 items-center justify-between gap-3 border-b-3 border-fs-accent bg-black/92 px-5 py-3 backdrop-blur sm:gap-5 sm:px-6 lg:min-h-20 lg:gap-4 lg:px-[5vw] min-[1320px]:gap-8 min-[1320px]:px-[7vw]">
        <a className="inline-flex min-w-0 items-end gap-2.5 no-underline min-[1320px]:gap-3" href={getLanguagePath(language, '')} aria-label="Factory Simulation home">
          <img className="block h-auto w-22 shrink-0 sm:w-26 lg:w-28 min-[1320px]:w-32" src={assetPath('/logo.svg')} alt="" aria-hidden="true" />
          <span className="min-w-0 max-w-32 break-words pb-0.5 text-[0.65rem] leading-tight font-bold uppercase tracking-[0.08em] text-white sm:max-w-none sm:text-sm sm:tracking-[0.1em] lg:text-[0.78rem] min-[1320px]:text-base">
            {t.headerTagline}
          </span>
        </a>
        <button
          className="grid size-11 shrink-0 place-items-center border border-white/30 p-2 min-[1180px]:hidden"
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
          className={`absolute top-full right-0 left-0 flex-col border-b border-fs-line bg-black px-6 py-5 text-sm uppercase min-[1180px]:static min-[1180px]:flex min-[1180px]:flex-row min-[1180px]:items-center min-[1180px]:gap-4 min-[1180px]:border-0 min-[1180px]:bg-transparent min-[1180px]:p-0 min-[1320px]:gap-7 ${
            menuOpen ? 'flex' : 'hidden'
          } min-[1180px]:flex`}
          aria-label="Main navigation"
        >
          <div className={`contents ${desktopSearchOpen ? 'min-[1180px]:hidden' : ''}`}>
            {navItems.map((item) => (
              <a
                className="flex min-h-10 items-center py-3 no-underline transition hover:text-fs-accent min-[1180px]:py-0"
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
            <a
              className="cta-consultation mt-3 inline-flex h-8 w-fit items-center justify-center whitespace-nowrap px-4 font-bold no-underline min-[1180px]:mt-0"
              href={getPagePath(language, 'home', '#contact')}
              onClick={navigateToContact}
            >
              {t.contactButton}
            </a>
          </div>
          <div className="mt-3 w-full min-[1180px]:hidden">
            <HeaderSearch label={t.search.label} placeholder={t.search.placeholder} initialValue={searchQuery} onSearch={handleSearch} alwaysOpen />
          </div>
          <div className="hidden min-[1180px]:block">
            <HeaderSearch label={t.search.label} placeholder={t.search.placeholder} initialValue={searchQuery} onSearch={handleSearch} onOpenChange={setDesktopSearchOpen} />
          </div>
          <div className="flex min-h-10 w-fit items-center gap-1 py-3 min-[1180px]:py-0" aria-label={t.languageSwitcherLabel || 'Language'} role="group">
            {languageOptions.map((option) => {
              const isCurrentLanguage = option.code === language;

              return (
                <button
                  className={`grid size-8 shrink-0 place-items-center border transition hover:border-fs-accent hover:bg-fs-accent/10 ${
                    isCurrentLanguage ? 'border-fs-accent bg-fs-accent/14' : 'border-white/22'
                  }`}
                  type="button"
                  onClick={() => switchLanguage(option.code)}
                  aria-label={`Switch to ${option.label}`}
                  aria-pressed={isCurrentLanguage}
                  title={option.label}
                  key={option.code}
                >
                  <img className="h-4 w-6 object-cover" src={assetPath(option.flagSrc)} alt="" aria-hidden="true" />
                </button>
              );
            })}
          </div>
        </nav>
      </header>

      <main id="top">
        {searchQuery ? (
          <SearchPage
            t={t}
            language={language}
            query={searchQuery}
            onContactSubmit={handleContactSubmit}
            onContactInput={handleContactInput}
            contactStatus={contactStatus}
            contactErrors={contactErrors}
          />
        ) : route === 'privacy' ? (
          <PrivacyPolicyPage t={t} language={language} />
        ) : route === 'wheelme' ? (
          <WheelmePage
            t={t}
            language={language}
            onContactClick={navigateToContact}
            onOpenImage={setLightboxImage}
            onContactSubmit={handleContactSubmit}
            onContactInput={handleContactInput}
            contactStatus={contactStatus}
            contactErrors={contactErrors}
          />
        ) : route === 'blog' ? (
          <BlogPage t={t} language={language} />
        ) : route === 'factory-simulation-faq' ? (
          <FactorySimulationFaqPage t={t} language={language} onContactClick={navigateToContact} />
        ) : route === 'brand' ? (
          <BrandPage language={language} />
        ) : (
          <>
        <section className="relative grid min-h-[680px] items-end overflow-hidden bg-black px-5 pt-20 pb-16 sm:px-8 lg:aspect-video lg:min-h-0 lg:items-center lg:px-[10vw] lg:py-20">
          <video className="absolute inset-0 h-full w-full object-cover object-right" poster={assetPath('/hero-simulation.svg')} autoPlay muted loop playsInline preload="metadata" aria-hidden="true">
            <source media="(max-width: 767px)" src={assetPath('/hero-mobile.webm')} type="video/webm" />
            <source src={assetPath('/hero-desktop.webm')} type="video/webm" />
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

        <FaqTeaserSection t={t} language={language} />

        <SoftwareSection t={t} />

        <ClientLogoCarousel title={t.clientLogosTitle} intro={t.clientLogosIntro} />

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
                      <img className="h-full w-full object-cover grayscale transition duration-300 group-hover:grayscale-0" src={assetPath(person.image)} alt={person.name} loading="lazy" decoding="async" />
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
                        <img className={`${partner.large ? 'max-h-32' : 'max-h-28'} w-full object-contain ${partner.imageClassName || ''}`} src={assetPath(partner.logo)} alt={partner.name} loading="lazy" decoding="async" />
                      </a>
                    ) : (
                    <img className={`${partner.large ? 'max-h-32' : 'max-h-28'} w-full object-contain ${partner.imageClassName || ''}`} src={assetPath(partner.logo)} alt={partner.name} loading="lazy" decoding="async" />
                    )}
                  </div>
                ))}
              </div>
              <h3 className={h3Class}>{t.reseller}</h3>
              <div className="grid gap-5 sm:grid-cols-[12rem_1fr] sm:items-start lg:max-w-4xl">
                <a className="flex h-48 items-center justify-center border border-white/18 bg-black/50 p-4" href={getPagePath(language, 'wheelme')} aria-label="wheel.me">
                  <img className="max-h-30 w-full object-contain" src={assetPath('/wheelme/wheel.me_logo_white.webp')} alt="wheel.me" loading="lazy" decoding="async" />
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
            <ContactForm
              t={t}
              language={language}
              onSubmit={handleContactSubmit}
              onInput={handleContactInput}
              status={contactStatus}
              errors={contactErrors}
              nameRef={contactNameRef}
              idPrefix="contact"
              source="main"
              title={t.contactFormTitle}
              intro={t.contactFormText}
              className="border border-black/18 bg-black/[0.045] p-5 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.12)] sm:p-6 lg:p-7"
            />
          </div>
        </section>
          </>
        )}
      </main>

      <OriginalFooter t={t} language={language} />
      <ImageLightbox image={lightboxImage} onClose={() => setLightboxImage(null)} />
    </div>
  );
}

const isDedicatedGermanSite = siteVariant === 'de';
const isGermanPath = !isDedicatedGermanSite && getPathWithoutBase().split('/').filter(Boolean)[0] === 'de';
const renderGermanSite = isDedicatedGermanSite || isGermanPath;
const germanPrivacyDetails = {
  title: content.de.privacy.title,
  intro: privacySupplement.de.intro,
  updated: privacySupplement.de.updated,
  sections: [...content.de.privacy.sections, ...privacySupplement.de.sections]
};

createRoot(document.getElementById('root')).render(
  <>
    {renderGermanSite ? (
      <GermanSite
        assetPath={assetPath}
        basePath={basePath}
        contactEndpoint={contactEndpoint}
        isDedicatedSite={isDedicatedGermanSite}
        footer={<OriginalFooter t={content.de} language="de" />}
        faqContent={<GermanFaqContent t={content.de} />}
        privacyDetails={germanPrivacyDetails}
        onLeadConversion={trackLeadConversion}
        t={content.de}
      >
        <GermanOriginalSections t={content.de} />
      </GermanSite>
    ) : (
      <App />
    )}
    <ConsentManager initialLanguage={renderGermanSite ? 'de' : getLanguageFromPath()} />
  </>
);
