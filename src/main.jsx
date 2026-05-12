import React, { useEffect, useMemo, useState } from 'react';
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
    nav: ['Projektid', 'Teenused', 'Meist', 'Uudised', 'Wheel.me'],
    heroSubline: {
      start: 'Simulatsioonide abil loome tootmisest dünaamilise ülevaate, mis aitab ',
      benefits: 'vähendada riske, optimeerida protsesse',
      middle: ' ja teha ',
      decisions: 'teadlikke otsuseid'
    },
    heroButton: 'Räägime projektist',
    heroSecondary: 'Vaata teenuseid',
    contactButton: 'Võta ühendust',
    projectsTitle: 'Projektid',
    projectIntro:
      'Valik näiteid, kus simulatsioonid on aidanud tootmist enne füüsilisi muudatusi valideerida.',
    projects: [
      {
        title: 'Plastitööstus',
        image: '/project-plastic.png',
        points: [
          'Koosteliini simulatsioon - pistikupesade kokkupanek, testimine ja pakendamine modelleeritud.',
          'Uue testeri integreerimine - mõju tootmisele hinnatud enne investeeringut.',
          'Tsükliaja analüüs - simuleeritud mitmeid tootmisstsenaariume.',
          'Parem sisend hinnapäringuks – tugev alus seadmetarnijate pakkumisteks.'
        ]
      },
      {
        title: 'Rasketööstus',
        image: '/project-heavy.png',
        points: [
          '3D laserskaneerimine – kogu 18 000 m² tootmishoone jäädvustati digitaalselt.',
          'Punktipilvest DWG alusplaan – olemasoleva hoone täpne mõõdistuspõhine joonis, kasutatav projekteerimises',
          'Paigutuse planeerimine – mudeli põhjal koostatud tootmisalad, põhiplaanid ja lõiked.',
          'Tehase simulatsioon – erinevad seadmete paigutused ja logistika stsenaariumid testiti virtuaalselt.',
          'Väiksem ümberpaigutuse risk – kiirem planeerimine ja paremad otsused enne füüsilist paigaldust.'
        ]
      },
      {
        title: 'Toiduainetööstus',
        image: '/project-food.png',
        imageOverlay: '/project-food2.png',
        points: [
          'Pidev materjalivoog – tootmisprotsess modelleeriti nii, et vähendada ooteaegu ja suurendada läbilaskevõimet.',
          'Automatiseerimine – manuaalsed etapid asendati, et vähendada tööjõu vajadust ja tõsta efektiivsust.',
          'Pudelikohad – analüüsi käigus tuvastati kriitilised etapid ja määrati vajalikud puhvrite mahud.',
          'Protsessi tasakaalustamine – vähendati varieeruvust ja saavutati ühtlasem tsükliaeg.',
          'Virtuaalne testimine – loodi mudel, kus saab kiiresti muuta parameetreid ja läbi proovida erinevaid stsenaariume.'
        ]
      },
      {
        title: 'Laologistika',
        image: '/project-logistics.png',
        points: [
          'Läbilaskevõime kasv – tootmismaht suureneb, kuna voog on stabiilsem ja katkestusi on vähem, mitte lihtsalt kiirem transport.',
          'AGV/AMR liikumisteekond väheneb – transport muutub otsesemaks ja efektiivsemaks, väheneb tarbetu liikumine ja edasi-tagasi käimine.',
          'Operaatorite hõive kasv – vähem ootamist protsesside vahel, rohkem väärtust loovat tööd.',
          'Laotöötaja hõive kasv – töö jaotub ühtlasemalt, vähem seisakuid ja käsitsi liikumist.',
          'Tasakaalustatum protsess – vähem katkestusi ja ootamist, sujuvam materjalivoog kogu liini ulatuses.'
        ]
      },
      {
        title: 'Puidutööstus',
        image: '/project-pellet.png',
        imageOverlays: ['/project-pellet2.png', '/project-pellet3.png'],
        points: [
          '3D laserskaneerimine – kogu pelletitehas jäädvustatud täpse digitaalse mudelina.',
          'Punktipilvest 3D mudeliks – tootmisruumide täpne ruumiline esitus.',
          'Visuaalne ülevaade tootmisest – keerukad protsessid muudetud 3D-s lihtsalt mõistetavaks.',
          'Digitaalse kaksiku alus – platvorm edasiseks optimeerimiseks ja targemateks tootmisotsusteks.',
          'Tootmisandmete integreerimise alus – katla, kuivatuse ja liinikiiruste andmed on ühendatavad 3D mudeliga.'
        ]
      }
    ],
    servicesTitle: 'Teenused',
    services: [
      {
        title: 'Tehase ja tootmisvoo simulatsioon',
        main: true,
        points: [
          'Digitaalne mudel tootmise tegelikust loogikast',
          'Läbilaske, järjekordade ja tsükliaegade analüüs',
          'Otsused enne füüsilist ümberkorraldust'
        ]
      },
      {
        title: 'Tehase paigutuse planeerimine',
        points: ['Seadmete ja tööalade 3D planeerimine', 'Materjalivoogude ja logistika kontroll', 'Paigutuste võrdlus enne investeeringut']
      },
      {
        title: 'Pudelikaelte analüüs',
        points: ['Kriitiliste piirangute leidmine', 'Tundlikkusanalüüs mahtude ja vahetuste lõikes', 'Praktilised parendusettepanekud']
      },
      {
        title: 'Robot- ja automaatikalahenduste valideerimine',
        points: ['Robotite ulatuse, taktide ja järjekordade kontroll', 'Virtuaalne testimine enne tootmise seiskamist', 'Parem lähteülesanne integraatoritele']
      },
      {
        title: '3D laserskaneerimine ja mudeldamine',
        points: ['Olemasoleva keskkonna täpne jäädvustamine', 'Punktipilve ja DWG aluste ettevalmistus', 'Mõõdistuspõhine planeerimisalus']
      },
      {
        title: 'Investeeringu stsenaariumid',
        points: ['Mis-juhtub-kui analüüs enne ostuotsust', 'Seadmete, inimeste ja graafikute võrdlus', 'Selgem sisend RFQ-deks ja juhtimisotsusteks']
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
    nav: ['Projects', 'Services', 'About', 'News & Blog', 'Wheel.me'],
    heroSubline: {
      start: 'With simulations we create a dynamic view of production that helps ',
      benefits: 'reduce risk, optimize processes',
      middle: ' and make ',
      decisions: 'informed decisions'
    },
    heroButton: 'Discuss your project',
    heroSecondary: 'View services',
    contactButton: 'Contact us',
    projectsTitle: 'Projects',
    projectIntro:
      'Selected examples where simulations helped validate production plans before physical changes.',
    projects: [
      {
        title: 'Plastics production',
        image: '/project-plastic.png',
        points: [
          'Earlier project start - planning began long before equipment arrival.',
          'Unified stakeholder view - one accurate 3D model for engineers and management.',
          'Faster ramp-up - reusable layouts sped up concept validation.',
          'Lower implementation risk - virtual testing prevented costly design errors.'
        ]
      },
      {
        title: 'Heavy industry',
        image: '/project-heavy.png',
        points: [
          'Up to 50% faster robot programming - programs built and tested virtually.',
          'Higher program quality and safety - reachability and collisions validated before deployment.',
          'Scalable automation platform - supports adding new robot cells and AMR solutions.',
          'Lower production disruption - concepts tested without stopping operations.'
        ]
      },
      {
        title: 'Food industry',
        image: '/project-food.png',
        imageOverlay: '/project-food2.png',
        points: [
          'Continuous material flow – the production process was modeled to reduce waiting times and increase throughput.',
          'Automation – manual steps were replaced to reduce labor needs and improve efficiency.',
          'Bottlenecks – critical process steps were identified and the required buffer sizes were defined.',
          'Process balancing – variation was reduced and a more consistent cycle time was achieved.',
          'Virtual testing – a model was created where parameters can be changed quickly and different scenarios can be tested.'
        ]
      },
      {
        title: 'Warehouse logistics',
        image: '/project-logistics.png',
        points: [
          'Throughput increase – production volume rises because the flow is more stable and interruptions are reduced, not simply because transport is faster.',
          'Shorter AGV/AMR travel paths – transport becomes more direct and efficient, reducing unnecessary movement and back-and-forth travel.',
          'Higher operator utilization – less waiting between process steps and more value-adding work.',
          'Higher warehouse worker utilization – work is distributed more evenly, with fewer stoppages and less manual movement.',
          'More balanced process – fewer interruptions and waiting periods, creating a smoother material flow across the full line.'
        ]
      },
      {
        title: 'Pellet factory',
        image: '/project-pellet.png',
        imageOverlays: ['/project-pellet2.png', '/project-pellet3.png'],
        points: [
          '3D laser scanning – the entire pellet factory was captured as an accurate digital model.',
          'Point cloud to 3D model – an accurate spatial representation of the production areas.',
          'Visual production overview – complex processes were made easy to understand in 3D.',
          'Digital twin foundation – a platform for further optimization and smarter production decisions.',
          'Production data integration foundation – boiler, drying and line-speed data can be connected to the 3D model.'
        ]
      }
    ],
    servicesTitle: 'Services',
    services: [
      {
        title: 'Factory and production flow simulation',
        main: true,
        points: ['Digital model of real production logic', 'Throughput, queue and cycle-time analysis', 'Confident decisions before physical changes']
      },
      {
        title: 'Factory layout planning',
        points: ['3D planning for equipment and work areas', 'Material flow and logistics checks', 'Layout comparison before investment']
      },
      {
        title: 'Bottleneck analysis',
        points: ['Find the real production constraints', 'Sensitivity checks across volumes and shifts', 'Practical improvement recommendations']
      },
      {
        title: 'Robot and automation validation',
        points: ['Reach, cycle and sequence validation', 'Virtual testing before downtime', 'Clearer specifications for integrators']
      },
      {
        title: '3D laser scanning and modeling',
        points: ['Accurate capture of existing facilities', 'Point-cloud and DWG base preparation', 'Measurement-based planning data']
      },
      {
        title: 'Investment scenario testing',
        points: ['What-if analysis before purchasing', 'Compare equipment, people and schedules', 'Clearer RFQ and management inputs']
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

const anchors = ['projects', 'services', 'about', 'blog', 'wheelme'];
const languages = ['et', 'en'];

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
  return languages.includes(language) ? language : 'et';
};

const getRouteFromPath = () => {
  const page = getPathWithoutBase().split('/').filter(Boolean)[1];
  return ['blog', 'wheelme'].includes(page) ? page : 'home';
};

const getPagePath = (language, page = 'home', hash = '') => {
  const pagePath = page === 'blog' || page === 'wheelme' ? `${page}/` : '';
  return `${basePath}${language}/${pagePath}${hash || ''}`;
};

const getLanguagePath = (language, hash = window.location.hash) => getPagePath(language, 'home', hash);
const partners = [
  { name: 'EML', logo: '/logo-partner-eml.png' },
  { name: 'AI & Robotics Estonia', logo: '/logo-partner-aire.jpg', bare: true, large: true },
  { name: 'TalTech', logo: '/logo-partner-taltech.png', bare: true },
  { name: 'Flowit', logo: '/logo-partner-flowit.png' }
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

function ProjectPointList({ items }) {
  return (
    <ul className="m-0 grid list-none gap-4 p-0">
      {items.map((item) => {
        const [lead, ...rest] = item.split(/\s+[–-]\s+/);
        const detail = rest.join(' – ');

        return (
          <li className="grid grid-cols-[1.35rem_1fr] gap-3 text-[clamp(1rem,1.35vw,1.18rem)] leading-snug" key={item}>
            <span className="mt-0.5 size-5 bg-fs-accent" style={iconMask} aria-hidden="true" />
            <span>
              <span className="mb-1 block font-bold text-fs-accent">{lead}</span>
              {detail && <span className="block text-white/88">{detail}</span>}
            </span>
          </li>
        );
      })}
    </ul>
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
        <img className="aspect-[4/5] max-h-60 w-full object-cover sm:max-h-72 md:max-h-96 lg:max-h-none xl:aspect-[3/4]" src={assetPath(project.image)} alt="" />
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
                <p className="text-base leading-relaxed text-fs-panel/78">{post.excerpt}</p>
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
  const [menuOpen, setMenuOpen] = useState(false);
  const [lightboxImage, setLightboxImage] = useState(null);
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
      window.history.replaceState(null, '', getLanguagePath(language, ''));
    }

    const onPopState = () => {
      setLanguage(getLanguageFromPath());
      setRoute(getRouteFromPath());
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
    document.title =
      route === 'wheelme'
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
        route === 'wheelme'
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
  }, [language, route]);

  const switchLanguage = () => {
    setLanguage(nextLanguage);
    setMenuOpen(false);
    window.history.pushState(null, '', getPagePath(nextLanguage, route, route === 'home' ? window.location.hash : ''));
  };

  const navigateToHomeSection = (event, sectionId) => {
    event.preventDefault();
    setMenuOpen(false);
    setRoute('home');
    window.history.pushState(null, '', getPagePath(language, 'home', `#${sectionId}`));
    window.setTimeout(() => {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    }, 0);
  };

  const navigateToContact = (event) => navigateToHomeSection(event, 'contact');

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
          className={`absolute top-20 right-0 left-0 flex-col border-b border-fs-line bg-black px-6 py-5 text-sm uppercase lg:static lg:flex lg:flex-row lg:items-center lg:gap-10 lg:border-0 lg:bg-transparent lg:p-0 ${
            menuOpen ? 'flex' : 'hidden'
          }`}
          aria-label="Main navigation"
        >
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
        </nav>
      </header>

      <main id="top">
        {route === 'wheelme' ? (
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
              <span className="text-fs-accent">{t.heroSubline.benefits}</span>
              {t.heroSubline.middle}
              <span className="text-fs-accent">{t.heroSubline.decisions}</span>.
            </p>
            <div className="flex flex-wrap gap-3.5">
              <a className="inline-flex min-h-12 items-center justify-center border border-fs-accent bg-fs-accent px-5 py-3 font-bold text-black no-underline" href="#contact">
                {t.heroButton}
              </a>
              <a className="inline-flex min-h-12 items-center justify-center border border-fs-accent px-5 py-3 font-bold text-white no-underline" href="#services">
                {t.heroSecondary}
              </a>
            </div>
          </div>
        </section>

        <section className={sectionClass} id="projects">
          <div className="mb-14 max-w-4xl">
            <h2 className={h2Class}>{t.projectsTitle}</h2>
            <p className="max-w-3xl text-[clamp(1.05rem,1.7vw,1.35rem)] leading-relaxed text-white/70">{t.projectIntro}</p>
          </div>
          <div className="grid gap-18">
            {t.projects.map((project, index) => (
              <article className="grid items-start gap-8 border-b border-fs-line pb-16 lg:grid-cols-[minmax(440px,1fr)_minmax(260px,0.58fr)] lg:gap-[5vw] xl:grid-cols-[minmax(560px,1fr)_minmax(300px,0.58fr)]" key={project.title}>
                <div className="grid gap-7 lg:grid-cols-[minmax(190px,0.38fr)_minmax(260px,1fr)] xl:grid-cols-[minmax(230px,0.42fr)_minmax(320px,1fr)]">
                  <div>
                    <p className="mb-3 font-bold text-fs-accent">0{index + 1}</p>
                    <h3 className={h3Class}>{project.title}</h3>
                  </div>
                  <ProjectPointList items={project.points} />
                </div>
                <ProjectImage project={project} onOpenImage={setLightboxImage} />
              </article>
            ))}
          </div>
        </section>

        <section className="px-5 pt-10 pb-20 sm:px-8 lg:px-[10vw] lg:pt-8 lg:pb-36" id="services">
          <div className="mb-14 max-w-4xl">
            <h2 className={h2Class}>{t.servicesTitle}</h2>
          </div>
          <div className="grid gap-4.5 md:grid-cols-2 xl:grid-cols-3">
            {t.services.map((service) => (
              <article className={`min-h-68 border-t-4 p-7 ${service.main ? 'border-fs-accent bg-fs-accent text-black' : 'border-fs-accent/55 bg-fs-panel text-white'}`} key={service.title}>
                <h3 className="mb-5 text-[clamp(1.2rem,1.8vw,1.75rem)] leading-tight font-bold">{service.title}</h3>
                <IconList
                  items={service.points}
                  itemClassName={`mb-1 text-base leading-snug ${service.main ? 'text-black/90' : 'text-white/82'}`}
                  iconClassName={service.main ? 'bg-black' : 'bg-fs-accent'}
                />
              </article>
            ))}
          </div>
        </section>

        <section className={`${sectionClass} min-h-[76vh] ${darkSurfaceClass}`} id="about">
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
              <div className="my-7 grid grid-cols-2 items-center gap-4.5 lg:grid-cols-4" aria-label={t.partnersTitle}>
                {partners.map((partner) => (
                  <div className={`flex min-h-32 items-center justify-center p-2 ${partner.bare ? 'bg-transparent' : 'bg-white'}`} key={partner.name}>
                    <img className={`${partner.large ? 'max-h-32' : 'max-h-28'} w-full object-contain`} src={assetPath(partner.logo)} alt={partner.name} />
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
                <input className="w-full border-0 bg-white/72 px-3.5 py-3 font-sans text-black" name="name" autoComplete="name" required />
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
