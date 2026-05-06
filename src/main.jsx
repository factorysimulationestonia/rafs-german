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
    heroHeadline: 'Kontseptsioonist kindlama investeerimisotsuseni',
    nav: ['Projektid', 'Teenused', 'Kontakt', 'Meist'],
    heroPrefix: 'Simulatsioonide',
    heroRest:
      'abil loome tootmisest dünaamilise ülevaate, mis aitab vähendada riske, optimeerida protsesse ja teha teadlikumaid otsuseid.',
    heroButton: 'Räägime projektist',
    heroSecondary: 'Vaata teenuseid',
    projectsTitle: 'Projektid',
    projectIntro:
      'Valik näiteid, kus simulatsioonid ja digitaalsed kaksikud on aidanud tootmist enne füüsilisi muudatusi valideerida.',
    projects: [
      {
        title: 'Plastitööstus',
        image: '/project-plastic.svg',
        points: [
          'Koosteliini simulatsioon - pistikupesade kokkupanek, testimine ja pakendamine modelleeritud.',
          'Uue testeri integreerimine - mõju tootmisele hinnatud enne investeeringut.',
          'Tsükliaja analüüs - simuleeritud mitmeid tootmisstsenaariume.',
          'Parem sisend hinnapäringuks - tugevam alus seadmetarnijate pakkumisteks.'
        ]
      },
      {
        title: 'Rasketööstus',
        image: '/project-heavy.svg',
        points: [
          '3D laserskaneerimine - 18 000 m2 tootmishoone jäädvustati digitaalselt.',
          'Punktipilvest DWG alusplaan - täpne mõõdistuspõhine joonis projekteerimiseks.',
          'Paigutuse planeerimine - mudeli põhjal koostatud tootmisalad, põhiplaanid ja lõiked.',
          'Tehase simulatsioon - seadmete paigutused ja logistika stsenaariumid testiti virtuaalselt.'
        ]
      },
      {
        title: 'Toiduainetööstus',
        image: '/project-food.svg',
        points: [
          '95% robotite kasutus - optimeeritud tööjärjekord tõstis seadmete kasutust.',
          '35-lt 38 ühikuni - läbilase kasvas ilma uute seadmeteta.',
          '40-lt 120 pakini - pudelikaela eemaldamine kolmekordistas pakendamise võimekust.',
          '+20% operaatori tootlikkus - parem töökoormuse jaotus vähendas ooteaega.'
        ]
      }
    ],
    servicesTitle: 'Teenused',
    services: [
      {
        title: 'Tehase ja tootmisvoo simulatsioon',
        main: true,
        points: [
          'Digitaalne kaksik tootmise tegelikust loogikast',
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
      { name: 'Steven', role: 'Tegevjuht', credentials: 'Mehaanikainsener (BSc)' },
      { name: 'Hans', role: 'Simulatsiooniinsener', credentials: 'Tööstustehnika ja juhtimine (MSc)' },
      { name: 'Markus', role: 'Projektijuht', credentials: 'Robootika ja automaatikainsener (MSc)' }
    ],
    partnersTitle: 'Partnerid ja võrgustik',
    reseller: 'Ametlik edasimüüja ja integratsioonipartner',
    contacts: 'Kontakt'
  },
  en: {
    languageLabel: 'Vaheta eesti keelele',
    flagSrc: '/ee-flag.svg',
    heroHeadline: 'From concept to a more confident investment decision',
    nav: ['Projects', 'Services', 'Contact', 'About'],
    heroPrefix: 'With simulations',
    heroRest:
      'we create a dynamic view of production that helps reduce risk, optimize processes and make more informed decisions.',
    heroButton: 'Discuss a project',
    heroSecondary: 'View services',
    projectsTitle: 'Projects',
    projectIntro:
      'Selected examples where simulations and digital twins helped validate production plans before physical changes.',
    projects: [
      {
        title: 'Elevator parts assembly',
        image: '/project-plastic.svg',
        points: [
          'Earlier project start - planning began long before equipment arrival.',
          'Unified stakeholder view - one accurate 3D model for engineers and management.',
          'Faster ramp-up - reusable layouts sped up concept validation.',
          'Lower implementation risk - virtual testing prevented costly design errors.'
        ]
      },
      {
        title: 'Robot cell automation',
        image: '/project-heavy.svg',
        points: [
          'Up to 50% faster robot programming - programs built and tested virtually.',
          'Higher program quality and safety - reachability and collisions validated before deployment.',
          'Scalable automation platform - supports adding new robot cells and AMR solutions.',
          'Lower production disruption - concepts tested without stopping operations.'
        ]
      },
      {
        title: 'Protein bar manufacturing process',
        image: '/project-food.svg',
        points: [
          '95% robot utilization - optimized task sequencing boosted equipment use.',
          '35 to 38 units throughput - output increased without new machinery.',
          '40 to 120 packs - packaging performance tripled after bottleneck removal.',
          '+20% operator productivity - better workload balance reduced idle time.'
        ]
      }
    ],
    servicesTitle: 'Services',
    services: [
      {
        title: 'Factory and production flow simulation',
        main: true,
        points: ['Digital twin of real production logic', 'Throughput, queue and cycle-time analysis', 'Confident decisions before physical changes']
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
      { name: 'Steven', role: 'CEO', credentials: 'Mechanical engineer (BSc)' },
      { name: 'Hans', role: 'Simulation engineer', credentials: 'Industrial engineering and management (MSc)' },
      { name: 'Markus', role: 'Project manager', credentials: 'Robotics and automation engineer (MSc)' }
    ],
    partnersTitle: 'Partners and network',
    reseller: 'Official reseller and integration partner',
    contacts: 'Contacts'
  }
};

const anchors = ['projects', 'services', 'contact', 'about'];
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

const getLanguagePath = (language, hash = window.location.hash) => `${basePath}${language}/${hash || ''}`;
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

function PersonIcon() {
  return (
    <svg className="size-6" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 12.2a3.6 3.6 0 1 0 0-7.2 3.6 3.6 0 0 0 0 7.2Z" fill="currentColor" />
      <path d="M5.2 20c.8-3.5 3.1-5.3 6.8-5.3s6 1.8 6.8 5.3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function App() {
  const [language, setLanguage] = useState(getLanguageFromPath);
  const [menuOpen, setMenuOpen] = useState(false);
  const t = content[language];
  const nextLanguage = language === 'et' ? 'en' : 'et';
  const navItems = useMemo(() => t.nav.map((label, index) => ({ label, href: getLanguagePath(language, `#${anchors[index]}`) })), [language, t]);

  useEffect(() => {
    if (!languages.includes(getPathWithoutBase().split('/').filter(Boolean)[0])) {
      window.history.replaceState(null, '', getLanguagePath(language, ''));
    }

    const onPopState = () => setLanguage(getLanguageFromPath());
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
    document.title = language === 'et' ? 'Factory Simulation | Tootmise simulatsioonid' : 'Factory Simulation | Digital Twin Solutions';

    const description = document.querySelector('meta[name="description"]');
    if (description) {
      description.setAttribute(
        'content',
        language === 'et'
          ? 'Factory Simulation loob tootmisest dünaamilise ülevaate simulatsioonide ja digitaalsete kaksikute abil.'
          : 'Factory Simulation creates a dynamic view of production with simulations and digital twins.'
      );
    }

    const origin = window.location.origin;
    const headLinks = [
      ['canonical', language, `${origin}${getLanguagePath(language, '')}`],
      ['alternate', 'et', `${origin}${getLanguagePath('et', '')}`],
      ['alternate', 'en', `${origin}${getLanguagePath('en', '')}`]
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
  }, [language]);

  const switchLanguage = () => {
    setLanguage(nextLanguage);
    setMenuOpen(false);
    window.history.pushState(null, '', getLanguagePath(nextLanguage));
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
          <img className="block h-auto w-26 lg:w-32" src={assetPath('/logo.png')} alt="" aria-hidden="true" />
          <span className="text-lg leading-none font-bold tracking-normal text-white sm:text-xl lg:text-2xl">
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
            <a className="flex min-h-10 items-center py-3 no-underline transition hover:text-fs-accent lg:py-0" key={item.href} href={item.href} onClick={() => setMenuOpen(false)}>
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
        </nav>
      </header>

      <main id="top">
        <section className="relative grid min-h-[560px] items-center overflow-hidden bg-black px-5 py-20 sm:px-8 lg:aspect-video lg:min-h-0 lg:px-[10vw]">
          <video className="absolute inset-0 h-full w-full object-contain object-center" poster={assetPath('/hero-simulation.svg')} autoPlay muted loop playsInline>
            <source src={assetPath('/hero-video.webm')} type="video/webm" />
          </video>
          <div className="absolute inset-0 bg-[linear-gradient(90deg,#000_0%,rgba(0,0,0,0.88)_28%,rgba(0,0,0,0.48)_58%,rgba(0,0,0,0.12)_100%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(0,0,0,0.32)_0%,transparent_24%,transparent_76%,rgba(0,0,0,0.26)_100%)]" />
          <div className="relative z-10 max-w-4xl pt-10 lg:w-1/2">
            <h1 className="mb-5 text-left text-[clamp(2.3rem,4.8vw,5.4rem)] leading-[1.02] font-semibold">
              {t.heroHeadline}
            </h1>
            <p className="mb-8 max-w-2xl text-left text-[clamp(1.05rem,1.55vw,1.45rem)] leading-snug text-white/82">
              <span className="text-fs-accent">{t.heroPrefix}</span> {t.heroRest}
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
              <article className="grid items-start gap-8 border-b border-fs-line pb-16 lg:grid-cols-[minmax(360px,0.85fr)_minmax(320px,1fr)] lg:gap-[7vw]" key={project.title}>
                <div className="grid gap-7 lg:grid-cols-[minmax(290px,0.58fr)_1fr]">
                  <div>
                    <p className="mb-3 font-bold text-fs-accent">0{index + 1}</p>
                    <h3 className={h3Class}>{project.title}</h3>
                  </div>
                  <IconList items={project.points} />
                </div>
                <img className="aspect-[1/0.78] w-full object-cover" src={assetPath(project.image)} alt="" />
              </article>
            ))}
          </div>
        </section>

        <section className={sectionClass} id="services">
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

        <section className={`${sectionClass} min-h-[76vh] ${darkSurfaceClass}`} id="about">
          <h2 className={h2Class}>{t.aboutTitle}</h2>
          <div className="grid max-w-6xl gap-12 lg:grid-cols-[minmax(280px,0.72fr)_1fr] lg:gap-[8vw]">
            <div>
              <h3 className={h3Class}>{t.teamTitle}</h3>
              <div className="grid gap-4">
                {t.team.map((person) => (
                  <article className="grid grid-cols-[4.25rem_1fr] items-center gap-5" key={person.name}>
                    <div className="grid size-17 place-items-center rounded-full border border-fs-accent/60 bg-fs-accent/12 text-fs-accent">
                      <PersonIcon />
                    </div>
                    <div>
                      <h4 className="mb-1 text-xl font-semibold leading-tight text-white">{person.name}</h4>
                      <p className="mb-1 text-base font-medium leading-snug text-fs-accent">{person.role}</p>
                      <p className="m-0 text-sm leading-snug text-white/72">{person.credentials}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
            <div>
              <h3 className={h3Class}>{t.partnersTitle}</h3>
              <div className="my-7 grid grid-cols-2 items-center gap-4.5 lg:grid-cols-4" aria-label={t.partnersTitle}>
                {partners.map((partner) => (
                  <div className={`flex min-h-32 items-center justify-center p-2 ${partner.bare ? 'bg-transparent' : 'bg-white'}`} key={partner.name}>
                    <img className={`${partner.large ? 'max-h-32' : 'max-h-28'} w-full object-contain`} src={assetPath(partner.logo)} alt={partner.name} />
                  </div>
                ))}
              </div>
              <h3 className={h3Class}>{t.reseller}</h3>
              <p className="text-[clamp(1rem,1.45vw,1.25rem)] leading-snug text-white/92">
                AMR lahendus, mis muudab objekti mobiilseks robotiks - <a className="underline" href="https://wheel.me/" target="_blank" rel="noreferrer">wheel.me</a>
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className={`grid items-center gap-8 border-t border-fs-line px-6 py-10 lg:grid-cols-[180px_1fr_auto] lg:px-[7vw] ${darkSurfaceClass}`}>
        <img className="w-40" src={assetPath('/logo.png')} alt="Factory Simulation" />
        <div>
          <h2 className="mb-2.5 text-xl font-bold">{t.contacts}</h2>
          <a className="mb-1.5 block text-white" href="mailto:info@factorysimulation.eu">info@factorysimulation.eu</a>
          <p className="m-0 text-xs text-white/45">Last updated {lastUpdated} · {buildCommit}</p>
        </div>
        <p className="m-0 text-white/70">Factory Simulation & Digital Twin solutions</p>
      </footer>
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);
