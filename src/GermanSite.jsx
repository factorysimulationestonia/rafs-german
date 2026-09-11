import React, { useEffect, useState } from 'react';

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

export default function GermanSite({ assetPath, basePath, contactEndpoint, isDedicatedSite = false, children, footer, faqContent, onLeadConversion, privacyDetails, t }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [formStatus, setFormStatus] = useState('idle');
  const mainSiteOrigin = import.meta.env.VITE_MAIN_SITE_ORIGIN || '';
  const resolvedMainSiteOrigin = mainSiteOrigin || (isDedicatedSite ? '' : `${window.location.origin}${basePath.replace(/\/$/, '')}`);
  const germanOrigin = (import.meta.env.VITE_GERMAN_SITE_ORIGIN || import.meta.env.VITE_PUBLIC_ORIGIN || '').replace(/\/$/, '');
  const homePath = isDedicatedSite ? basePath : `${basePath}de/`;
  const privacyPath = isDedicatedSite ? `${basePath}privacy/` : `${basePath}de/privacy/`;
  const pathParts = window.location.pathname.slice(basePath.length).split('/').filter(Boolean);
  const activeRoute = isDedicatedSite ? pathParts[0] : pathParts[1];
  const isPrivacy = activeRoute === 'privacy';
  const isFaq = activeRoute === 'factory-simulation-faq';
  const isRemovedWheelmeRoute = activeRoute === 'wheelme';

  useEffect(() => {
    if (isRemovedWheelmeRoute) {
      window.history.replaceState(null, '', homePath);
    }
  }, [homePath, isRemovedWheelmeRoute]);

  useEffect(() => {
    document.documentElement.lang = 'de';
    document.body.classList.add('de-body');
    document.title = isPrivacy
      ? 'Datenschutzerklärung | Factory Simulation'
      : isFaq
        ? 'Factory Simulation FAQ | Factory Simulation Leistungen'
        : 'Produktionssimulation und digitale Fabrikplanung | Factory Simulation';

    const description = document.querySelector('meta[name="description"]');
    description?.setAttribute(
      'content',
      isPrivacy
        ? 'Datenschutzerklärung von Factory Simulation OÜ.'
        : isFaq
          ? 'Antworten zu Produktionssimulation, Kapazitätsanalyse, Layoutplanung und digitalen Zwillingen.'
        : 'Produktionssimulation, Fabrikplanung und virtuelle Inbetriebnahme für belastbare Investitionsentscheidungen in der Industrie.'
    );

    const currentOrigin = germanOrigin || window.location.origin;
    const canonicalPath = isPrivacy ? privacyPath : isFaq ? (isDedicatedSite ? `${basePath}factory-simulation-faq/` : `${basePath}de/factory-simulation-faq/`) : homePath;
    const canonicalUrl = `${currentOrigin}${canonicalPath}`;
    const pageTitle = isPrivacy
      ? 'Datenschutzerklärung | Factory Simulation'
      : isFaq
        ? 'Factory Simulation FAQ | Factory Simulation Leistungen'
        : 'Produktionssimulation und digitale Fabrikplanung | Factory Simulation';
    const pageDescription = isPrivacy
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

    if (!isPrivacy && resolvedMainSiteOrigin) {
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
  }, [basePath, germanOrigin, homePath, isDedicatedSite, isFaq, isPrivacy, privacyPath, resolvedMainSiteOrigin]);

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
      <header className="de-header">
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
          <div className="de-hero__facts" aria-label="Projektvorteile">
            <p><strong>Vor der Investition</strong><span>Varianten objektiv vergleichen</span></p>
            <p><strong>Vor der Montage</strong><span>Abläufe und Kapazität validieren</span></p>
            <p><strong>Vor dem Anlauf</strong><span>Fehler und Verzögerungen reduzieren</span></p>
          </div>
        </section>

        {children}

        <section className="de-contact" id="kontakt">
          <div className="de-contact__intro">
            <p className="de-kicker">Erster Schritt</p>
            <h2>Bringen Sie die offene Produktionsfrage mit.</h2>
            <p>In einem kurzen Gespräch klären wir, welche Entscheidung ansteht, welche Daten vorhanden sind und ob eine Simulation den nächsten Schritt verbessern kann.</p>
            <a href="mailto:info@factorysimulation.eu">info@factorysimulation.eu</a>
          </div>
          <form className="de-form" onSubmit={handleSubmit}>
            <div className="de-form__row">
              <label>Name<input name="name" autoComplete="name" required /></label>
              <label>E-Mail<input name="email" type="email" autoComplete="email" required /></label>
            </div>
            <label>Unternehmen<input name="organization" autoComplete="organization" /></label>
            <label>Worum geht es?<textarea name="description" rows="5" minLength="5" required /></label>
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
