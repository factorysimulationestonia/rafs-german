import React, { useEffect, useState } from 'react';

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M7.2 3.8 9.6 8l-2.1 1.8c1.1 2.6 3.1 4.6 5.7 5.7l1.8-2.1 4.2 2.4c.4.2.6.7.5 1.1l-.5 2.7c-.1.5-.6.9-1.1.9C10 20.5 3.5 14 3.5 5.9c0-.5.4-1 .9-1.1l2.7-.5c.4-.1.9.1 1.1.5Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3.5" y="5" width="17" height="14" rx="1" stroke="currentColor" strokeWidth="1.8" />
      <path d="m4.5 7 7.5 6 7.5-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function GermanPrivacy({ assetPath, homePath, footer, privacy }) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="de-site">
      <header className="de-header de-header--solid">
        <a href={homePath} aria-label="Factory Simulation Startseite">
          <img src={assetPath('/logo.svg')} alt="Factory Simulation" />
        </a>
      </header>
      <main className="de-legal">
        <a className="de-back" href={homePath}>← Zurück zur Startseite</a>
        <p className="de-kicker">Rechtliches</p>
        <h1>{privacy.title}</h1>
        <p className="de-legal__lead">{privacy.intro}</p>
        <p className="de-legal__updated">{privacy.updated}</p>
        {privacy.sections.map((section) => (
          <section key={section.title}>
            <h2>{section.title}</h2>
            {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </section>
        ))}
      </main>
      {footer}
    </div>
  );
}

function GermanLegalDocument({ assetPath, children, homePath, kicker, lead, title, footer }) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="de-site">
      <header className="de-header de-header--solid">
        <a href={homePath} aria-label="Factory Simulation Startseite">
          <img src={assetPath('/logo.svg')} alt="Factory Simulation" />
        </a>
      </header>
      <main className="de-legal">
        <a className="de-back" href={homePath}>← Zurück zur Startseite</a>
        <p className="de-kicker">{kicker}</p>
        <h1>{title}</h1>
        <p className="de-legal__lead">{lead}</p>
        {children}
      </main>
      {footer}
    </div>
  );
}

function GermanImpressum({ assetPath, homePath, footer }) {
  return (
    <GermanLegalDocument
      assetPath={assetPath}
      homePath={homePath}
      kicker="Anbieterkennzeichnung"
      title="Impressum"
      lead="Angaben zum Anbieter dieser Website."
      footer={footer}
    >
      <section>
        <h2>Anbieter</h2>
        <p>
          Factory Simulation OÜ<br />
          Rechtsform: Osaühing (estnische Gesellschaft mit beschränkter Haftung)<br />
          Okka tee 2<br />
          Piira küla, Vinni vald<br />
          Lääne-Viru maakond 46607<br />
          Estland
        </p>
      </section>
      <section>
        <h2>Vertretungsberechtigte Person</h2>
        <p>Vorstandsmitglied: Steven Strandberg</p>
      </section>
      <section>
        <h2>Registereintrag</h2>
        <p>
          Estnisches Handelsregister (Äriregister)<br />
          Registernummer: 17384619
        </p>
      </section>
      <section>
        <h2>Umsatzsteuer-Identifikationsnummer</h2>
        <p>EE102941711</p>
      </section>
      <section>
        <h2>Verantwortlich für den Inhalt</h2>
        <p>Steven Strandberg, Anschrift wie oben.</p>
      </section>
    </GermanLegalDocument>
  );
}

function GermanLegalNotice({ assetPath, homePath, footer }) {
  return (
    <GermanLegalDocument
      assetPath={assetPath}
      homePath={homePath}
      kicker="Rechtliches"
      title="Rechtliche Hinweise"
      lead="Hinweise zur Nutzung und zu den Inhalten dieser Website."
      footer={footer}
    >
      <section>
        <h2>Informationen auf dieser Website</h2>
        <p>Die Inhalte dieser Website dienen der allgemeinen Information über unsere Leistungen. Sie stellen kein verbindliches Angebot und keine technische, rechtliche oder wirtschaftliche Beratung für einen konkreten Anwendungsfall dar. Verbindliche Leistungen, Ergebnisse und Termine ergeben sich ausschließlich aus einer individuellen Vereinbarung.</p>
      </section>
      <section>
        <h2>Inhalte und Aktualität</h2>
        <p>Wir erstellen und pflegen die Inhalte mit angemessener Sorgfalt. Produktions-, Simulations- und Projektergebnisse hängen jedoch von den jeweiligen Eingangsdaten, Annahmen und Rahmenbedingungen ab. Bitte kontaktieren Sie uns, wenn Sie einen Fehler oder eine veraltete Angabe feststellen.</p>
      </section>
      <section>
        <h2>Urheber- und Nutzungsrechte</h2>
        <p>Texte, Grafiken, Simulationen, Bilder, Videos und sonstige eigene Inhalte dieser Website dürfen nur im gesetzlich zulässigen Umfang oder mit vorheriger Zustimmung von Factory Simulation OÜ verwendet werden. Rechte Dritter bleiben unberührt und werden, soweit erkennbar, entsprechend gekennzeichnet.</p>
      </section>
      <section>
        <h2>Externe Links</h2>
        <p>Diese Website enthält Links zu externen Angeboten. Für deren Inhalte und Datenschutzpraktiken sind die jeweiligen Anbieter verantwortlich. Wir prüfen externe Links bei ihrer Aufnahme, haben jedoch keinen fortlaufenden Einfluss auf spätere Änderungen fremder Inhalte.</p>
      </section>
      <section>
        <h2>Verfügbarkeit</h2>
        <p>Wir bemühen uns um einen zuverlässigen Betrieb der Website, können eine jederzeitige unterbrechungs- oder fehlerfreie Verfügbarkeit jedoch nicht gewährleisten.</p>
      </section>
    </GermanLegalDocument>
  );
}

export default function GermanSite({ assetPath, basePath, contactEndpoint, contactPerson, isDedicatedSite = false, children, footer, faqContent, LinkedinIcon, onLeadConversion, privacyDetails, t }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [formStatus, setFormStatus] = useState('idle');
  const [headerFloating, setHeaderFloating] = useState(false);
  const mainSiteOrigin = import.meta.env.VITE_MAIN_SITE_ORIGIN || '';
  const resolvedMainSiteOrigin = mainSiteOrigin || (isDedicatedSite ? '' : `${window.location.origin}${basePath.replace(/\/$/, '')}`);
  const germanOrigin = (import.meta.env.VITE_GERMAN_SITE_ORIGIN || import.meta.env.VITE_PUBLIC_ORIGIN || '').replace(/\/$/, '');
  const homePath = isDedicatedSite ? basePath : `${basePath}de/`;
  const privacyPath = isDedicatedSite ? `${basePath}privacy/` : `${basePath}de/privacy/`;
  const pathParts = window.location.pathname.slice(basePath.length).split('/').filter(Boolean);
  const activeRoute = isDedicatedSite ? pathParts[0] : pathParts[1];
  const isPrivacy = activeRoute === 'privacy';
  const isFaq = activeRoute === 'factory-simulation-faq';
  const isImpressum = activeRoute === 'impressum';
  const isLegalNotice = activeRoute === 'legal-notice';
  const isLegalPage = isImpressum || isLegalNotice;
  const isRemovedWheelmeRoute = activeRoute === 'wheelme';

  useEffect(() => {
    if (isRemovedWheelmeRoute) {
      window.history.replaceState(null, '', homePath);
    }
  }, [homePath, isRemovedWheelmeRoute]);

  useEffect(() => {
    const handleScroll = () => {
      setHeaderFloating(window.scrollY > 80);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.documentElement.lang = 'de';
    document.body.classList.add('de-body');
    document.title = isImpressum
      ? 'Impressum | Factory Simulation'
      : isLegalNotice
        ? 'Rechtliche Hinweise | Factory Simulation'
      : isPrivacy
      ? 'Datenschutzerklärung | Factory Simulation'
      : isFaq
        ? 'Factory Simulation FAQ | Factory Simulation Leistungen'
        : 'Produktionssimulation und digitale Fabrikplanung | Factory Simulation';

    const description = document.querySelector('meta[name="description"]');
    description?.setAttribute(
      'content',
      isImpressum
        ? 'Impressum und Anbieterkennzeichnung von Factory Simulation OÜ.'
        : isLegalNotice
          ? 'Rechtliche Hinweise zur Website von Factory Simulation OÜ.'
      : isPrivacy
        ? 'Datenschutzerklärung von Factory Simulation OÜ.'
        : isFaq
          ? 'Antworten zu Produktionssimulation, Kapazitätsanalyse, Layoutplanung und digitalen Zwillingen.'
        : 'Produktionssimulation, Fabrikplanung und virtuelle Inbetriebnahme für belastbare Investitionsentscheidungen in der Industrie.'
    );

    const currentOrigin = germanOrigin || window.location.origin;
    const canonicalPath = isImpressum
      ? (isDedicatedSite ? `${basePath}impressum/` : `${basePath}de/impressum/`)
      : isLegalNotice
        ? (isDedicatedSite ? `${basePath}legal-notice/` : `${basePath}de/legal-notice/`)
        : isPrivacy
          ? privacyPath
          : isFaq
            ? (isDedicatedSite ? `${basePath}factory-simulation-faq/` : `${basePath}de/factory-simulation-faq/`)
            : homePath;
    const canonicalUrl = `${currentOrigin}${canonicalPath}`;
    const pageTitle = isImpressum
      ? 'Impressum | Factory Simulation'
      : isLegalNotice
        ? 'Rechtliche Hinweise | Factory Simulation'
      : isPrivacy
      ? 'Datenschutzerklärung | Factory Simulation'
      : isFaq
        ? 'Factory Simulation FAQ | Factory Simulation Leistungen'
        : 'Produktionssimulation und digitale Fabrikplanung | Factory Simulation';
    const pageDescription = isImpressum
      ? 'Impressum und Anbieterkennzeichnung von Factory Simulation OÜ.'
      : isLegalNotice
        ? 'Rechtliche Hinweise zur Website von Factory Simulation OÜ.'
      : isPrivacy
      ? 'Datenschutzerklärung von Factory Simulation OÜ.'
      : isFaq
        ? 'Antworten zu Produktionssimulation, Kapazitätsanalyse, Layoutplanung und digitalen Zwillingen.'
        : 'Produktionssimulation, Fabrikplanung und virtuelle Inbetriebnahme für belastbare Investitionsentscheidungen in der Industrie.';

    const metadata = [
      ['meta[property="og:title"]', 'content', pageTitle],
      ['meta[property="og:description"]', 'content', pageDescription],
      ['meta[property="og:url"]', 'content', canonicalUrl],
      ['meta[name="twitter:title"]', 'content', pageTitle],
      ['meta[name="twitter:description"]', 'content', pageDescription]
    ];
    metadata.forEach(([selector, attribute, value]) => document.querySelector(selector)?.setAttribute(attribute, value));

    document.querySelectorAll('link[data-language-link="true"]').forEach((link) => link.remove());

    const links = [
      ['canonical', '', canonicalUrl],
      ['alternate', 'de', canonicalUrl]
    ];

    if (!isPrivacy && !isLegalPage && resolvedMainSiteOrigin) {
      const normalizedMainOrigin = resolvedMainSiteOrigin.replace(/\/$/, '');
      const alternateRoute = isFaq ? 'factory-simulation-faq/' : '';
      links.push(['alternate', 'et', `${normalizedMainOrigin}/et/${alternateRoute}`]);
      links.push(['alternate', 'en', `${normalizedMainOrigin}/en/${alternateRoute}`]);
      links.push(['alternate', 'x-default', `${normalizedMainOrigin}/en/`]);
    }

    links.forEach(([rel, hrefLang, href]) => {
      const link = document.createElement('link');
      link.rel = rel;
      if (hrefLang) link.setAttribute('hreflang', hrefLang);
      link.href = href;
      link.dataset.languageLink = 'true';
      document.head.appendChild(link);
    });

    return () => document.body.classList.remove('de-body');
  }, [basePath, germanOrigin, homePath, isDedicatedSite, isFaq, isImpressum, isLegalNotice, isLegalPage, isPrivacy, privacyPath, resolvedMainSiteOrigin]);

  if (isFaq) {
    return (
      <div className="de-site">
        <header className="de-header de-header--solid">
          <a href={homePath} aria-label="Factory Simulation Startseite">
            <img src={assetPath('/logo.svg')} alt="Factory Simulation" />
          </a>
        </header>
        <main>{faqContent}</main>
        {footer}
      </div>
    );
  }

  if (isPrivacy) {
    return <GermanPrivacy assetPath={assetPath} homePath={homePath} footer={footer} privacy={privacyDetails} />;
  }

  if (isImpressum) {
    return <GermanImpressum assetPath={assetPath} homePath={homePath} footer={footer} />;
  }

  if (isLegalNotice) {
    return <GermanLegalNotice assetPath={assetPath} homePath={homePath} footer={footer} />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (formStatus === 'sending' || formStatus === 'success') return;

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = {
      name: String(formData.get('name') || '').trim(),
      email: String(formData.get('email') || '').trim(),
      description: String(formData.get('description') || '').trim(),
      company: String(formData.get('company') || '').trim(),
      language: 'de',
      source: 'main'
    };

    if (!contactEndpoint) {
      const subject = encodeURIComponent('Neue Projektanfrage');
      const body = encodeURIComponent(`Name: ${payload.name}\nE-Mail: ${payload.email}\n\nProjekt:\n${payload.description}`);
      window.location.href = `mailto:info@factorysimulation.eu?subject=${subject}&body=${body}`;
      return;
    }

    setFormStatus('sending');
    try {
      const response = await fetch(contactEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error(`Contact request failed with status ${response.status}`);
      form.reset();
      setFormStatus('success');
      onLeadConversion?.();
    } catch (error) {
      console.error('Contact form submission failed.', error);
      setFormStatus('error');
    }
  };

  return (
    <div className="de-site">
      <header className={`de-header${headerFloating ? ' de-header--floating' : ''}`}>
        <a className="de-brand" href={homePath} aria-label="Factory Simulation Startseite">
          <img src={assetPath('/logo.svg')} alt="Factory Simulation" />
          <span>{t.headerTagline}</span>
        </a>
        <button className="de-menu-button" type="button" aria-label="Menü öffnen" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>
          <span />
          <span />
        </button>
        <nav className={menuOpen ? 'is-open' : ''} aria-label="Hauptnavigation">
          <a href="#services" onClick={() => setMenuOpen(false)}>Leistungen</a>
          <a href="#software" onClick={() => setMenuOpen(false)}>Software</a>
          <a href="#about" onClick={() => setMenuOpen(false)}>Über uns</a>
          <a className="de-nav-cta" href="#kontakt" onClick={() => setMenuOpen(false)}>Projekt besprechen</a>
        </nav>
      </header>

      <main>
        <section className="de-hero">
          <video className="de-hero__image" poster={assetPath('/hero-simulation.svg')} autoPlay muted loop playsInline preload="metadata" aria-hidden="true">
            <source media="(max-width: 767px)" src={assetPath('/hero-mobile.webm')} type="video/webm" />
            <source src={assetPath('/hero-desktop.webm')} type="video/webm" />
          </video>
          <div className="de-hero__shade" />
          <div className="de-hero__content">
            <h1>{t.heroHeadline.replace('Investitionsentscheidung', 'Investitions\u00adentscheidung')}</h1>
            <p className="de-hero__lead">
              {t.heroSubline.start}
              <strong>{t.heroSubline.risk}</strong>
              {t.heroSubline.afterRisk}
              <strong>{t.heroSubline.mistakes}</strong>
              {t.heroSubline.afterMistakes}
              <strong>{t.heroSubline.savings}</strong>
              {t.heroSubline.end}
            </p>
            <div className="de-actions">
              <a className="de-button de-button--primary" href="#kontakt">{t.heroButton} <span aria-hidden="true">→</span></a>
              <a className="de-button de-button--quiet" href="#services">{t.heroSecondary}</a>
            </div>
          </div>
        </section>

        {children}

        <section className="de-contact" id="kontakt">
          <div className="de-contact__prompt">
            <h2>Bringen Sie die offene Produktionsfrage mit.</h2>
            <p>In einem kurzen Gespräch klären wir, welche Entscheidung ansteht, welche Daten vorhanden sind und ob eine Simulation den nächsten Schritt verbessern kann.</p>
          </div>
          {contactPerson && (
            <article className="de-contact-person" aria-label="Ihr Ansprechpartner für die DACH-Region">
              <div className="de-contact-person__portrait" role="img" aria-label="Platzhalter für das Portrait des Ansprechpartners">
                <span>Foto folgt</span>
              </div>
              <div className="de-contact-person__details">
                <p className="de-contact-person__label">Ihr direkter Kontakt</p>
                <h3>{contactPerson.name}</h3>
                <p className="de-contact-person__role">{contactPerson.role}</p>
                <a className="de-contact-person__link" href={contactPerson.phoneHref}><PhoneIcon /><span>{contactPerson.phone}</span></a>
                <a className="de-contact-person__link" href={`mailto:${contactPerson.email}`}><MailIcon /><span>{contactPerson.email}</span></a>
                {contactPerson.linkedin && LinkedinIcon && (
                  <a className="de-contact-person__linkedin" href={contactPerson.linkedin} target="_blank" rel="noreferrer" aria-label={`${contactPerson.name} LinkedIn`}>
                    <LinkedinIcon />
                  </a>
                )}
              </div>
            </article>
          )}
          <form className="de-form" onSubmit={handleSubmit}>
            <div className="de-form__row">
              <label>Name<input name="name" autoComplete="name" placeholder="Vor- und Nachname" required /></label>
              <label>E-Mail<input name="email" type="email" autoComplete="email" placeholder="name@unternehmen.de" required /></label>
            </div>
            <label>Unternehmen<input name="organization" autoComplete="organization" placeholder="Unternehmensname" /></label>
            <label>Worum geht es?<textarea name="description" rows="5" minLength="5" placeholder="Welche Produktionsentscheidung möchten Sie absichern?" required /></label>
            <input className="de-honeypot" name="company" tabIndex="-1" autoComplete="off" aria-hidden="true" />
            <p className="de-form__privacy">Mit dem Absenden stimmen Sie der Verarbeitung Ihrer Angaben zur Beantwortung der Anfrage zu. <a href={privacyPath}>Datenschutz</a></p>
            <button className="de-button de-button--dark" type="submit" disabled={formStatus === 'sending' || formStatus === 'success'}>
              {formStatus === 'sending' ? 'Wird gesendet…' : formStatus === 'success' ? 'Anfrage gesendet' : 'Anfrage senden'}
              <span aria-hidden="true">→</span>
            </button>
            {formStatus === 'error' && <p className="de-form__status" role="alert">Die Nachricht konnte nicht gesendet werden. Bitte schreiben Sie an info@factorysimulation.eu.</p>}
          </form>
        </section>
      </main>

      {footer}
    </div>
  );
}
