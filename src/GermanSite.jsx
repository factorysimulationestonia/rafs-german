import React, { useEffect, useState } from 'react';

const benefits = [
  ['speed', 'Schneller', 'Direkte Kommunikation und kurze Wege.'],
  ['efficient', 'Effizient', 'Schlanke Struktur und klarer Projektumfang.'],
  ['digital', 'Digital vernetzt', 'Durchgängige Daten und transparente digitale Abläufe.'],
  ['smart', 'Smarter', 'Digitale Werkzeuge mit echter Engineering-Erfahrung.'],
  ['flexible', 'Flexibel', 'Wir passen uns Ihrem Projekt und Ihren Tools an.'],
  ['estonia', 'Aus Estland', 'Digital gedacht, verlässlich geliefert.']
];

const processSteps = [
  ['1', 'Ihre Angaben', 'Sie stellen Ihre Fragen, Daten und Projektanforderungen bereit.'],
  ['2', 'Wir analysieren', 'Wir prüfen Ihre Angaben und untersuchen Ihr Vorhaben anhand eines Simulationsmodells.'],
  ['3', 'Erste Ergebnisse', 'Innerhalb von 36 Stunden erhalten Sie die ersten dokumentierten Ergebnisse sowie eine 90-sekündige Videozusammenfassung.'],
  ['4', 'Vorläufige Entscheidung', 'Die ersten Ergebnisse bieten eine fundierte Grundlage für Ihre vorläufige Entscheidung.'],
  ['5', 'Investition vollständig validieren', 'In Phase 2 validieren wir Ihre Investition im Detail, beziehen zusätzliche Angaben ein und reduzieren Unsicherheiten, bevor Sie die endgültige Entscheidung treffen.']
];

function BrandLogo({ inverted = false }) {
  return (
    <span className={`de2-logo${inverted ? ' de2-logo--inverted' : ''}`} aria-label="Robotics and Factory Simulation">
      <span className="de2-logo__mark" aria-hidden="true"><i /><i /><i /></span>
      <span className="de2-logo__name">Robotics and<br />Factory Simulation</span>
    </span>
  );
}

function ArrowIcon() {
  return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14m-5-5 5 5-5 5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

function PhoneIcon() {
  return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7.2 3.8 9.6 8l-2.1 1.8c1.1 2.6 3.1 4.6 5.7 5.7l1.8-2.1 4.2 2.4c.4.2.6.7.5 1.1l-.5 2.7c-.1.5-.6.9-1.1.9C10 20.5 3.5 14 3.5 5.9c0-.5.4-1 .9-1.1l2.7-.5c.4-.1.9.1 1.1.5Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

function MailIcon() {
  return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="3.5" y="5" width="17" height="14" rx="1" stroke="currentColor" strokeWidth="1.8" /><path d="m4.5 7 7.5 6 7.5-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

function BenefitIcon({ type }) {
  if (type === 'digital') return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="5" y="3" width="14" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.6" /><path d="M12 13v4m-8 0h16M4 17v3m8-3v3m8-3v3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /><path d="m9 8 2 2 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>;
  if (type === 'speed') return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m13 2-9 12h8l-1 8 9-12h-8l1-8Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" /></svg>;
  if (type === 'efficient') return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><ellipse cx="12" cy="6" rx="6.5" ry="3" stroke="currentColor" strokeWidth="1.6" /><path d="M5.5 6v4c0 1.7 2.9 3 6.5 3s6.5-1.3 6.5-3V6m-13 4v4c0 1.7 2.9 3 6.5 3s6.5-1.3 6.5-3v-4m-13 4v4c0 1.7 2.9 3 6.5 3s6.5-1.3 6.5-3v-4" stroke="currentColor" strokeWidth="1.6" /></svg>;
  if (type === 'smart') return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M9.2 4.2A3.5 3.5 0 0 0 5.8 8a3.7 3.7 0 0 0-1.3 6.8A3.5 3.5 0 0 0 9 19.7M14.8 4.2A3.5 3.5 0 0 1 18.2 8a3.7 3.7 0 0 1 1.3 6.8 3.5 3.5 0 0 1-4.5 4.9M12 3v18M8 9.5c1.8 0 3 1.2 4 2.5m4-2.5c-1.8 0-3 1.2-4 2.5M8.5 16c1.4 0 2.5-.7 3.5-1.8m3.5 1.8c-1.4 0-2.5-.7-3.5-1.8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>;
  if (type === 'flexible') return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.6" /><path d="m15.8 8.2-2.2 5.4-5.4 2.2 2.2-5.4 5.4-2.2Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" /></svg>;
  return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z" stroke="currentColor" strokeWidth="1.6" /><circle cx="12" cy="10" r="2.3" stroke="currentColor" strokeWidth="1.6" /></svg>;
}

function BrandHeader({ homePath, sectionHref }) {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <header className="de2-header">
      <a className="de2-header__brand" href={homePath} aria-label="Robotics and Factory Simulation Startseite"><BrandLogo /></a>
      <nav className={menuOpen ? 'is-open' : ''} aria-label="Hauptnavigation">
        <a href={sectionHref('warum')} onClick={() => setMenuOpen(false)}>Warum wir</a>
        <a href={sectionHref('prozess')} onClick={() => setMenuOpen(false)}>Prozess</a>
        <a href={sectionHref('team')} onClick={() => setMenuOpen(false)}>Über uns</a>
        <a href={sectionHref('kontakt')} onClick={() => setMenuOpen(false)}>Kontakt</a>
        <a href={`${homePath}pricing/`} onClick={() => setMenuOpen(false)}>Preise</a>
        <a className="de2-nav-mobile-cta" href={sectionHref('kontakt')} onClick={() => setMenuOpen(false)}>Projekt besprechen <ArrowIcon /></a>
      </nav>
      <a className="de2-header__cta" href={sectionHref('kontakt')}>Projekt besprechen <ArrowIcon /></a>
      <button className="de2-menu" type="button" aria-label="Menü öffnen" aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}><span /><span /></button>
    </header>
  );
}

function BrandFooter({ contactPerson, homePath, impressumPath, legalNoticePath, privacyPath, faqPath, LinkedinIcon }) {
  const openPrivacySettings = () => window.dispatchEvent(new Event('factory-simulation:open-privacy-settings'));
  return (
    <footer className="de2-footer">
      <div className="de2-footer__main">
        <a href={homePath} aria-label="Robotics and Factory Simulation Startseite"><BrandLogo inverted /></a>
        <div className="de2-footer__pitch"><strong>Lassen Sie uns über Ihre Produktion sprechen.</strong><span>Eine klare Frage ist der beste Start für ein gutes Modell.</span></div>
        <a className="de2-button de2-button--light" href={`${homePath}#kontakt`}>Kontakt aufnehmen <ArrowIcon /></a>
      </div>
      <div className="de2-footer__meta">
        <span>Factory Simulation OÜ · Estland</span>
        {contactPerson && <a href={`mailto:${contactPerson.email}`}>{contactPerson.email}</a>}
        <nav aria-label="Fußzeilennavigation">
          <a href={faqPath}>FAQ</a><a href={privacyPath}>Datenschutz</a><a href={legalNoticePath}>Rechtliche Hinweise</a><a href={impressumPath}>Impressum</a>
          <button type="button" onClick={openPrivacySettings}>Privatsphäre-Einstellungen</button>
          {contactPerson?.linkedin && LinkedinIcon && <a className="de2-social" href={contactPerson.linkedin} target="_blank" rel="noreferrer" aria-label={`${contactPerson.name} LinkedIn`}><LinkedinIcon /></a>}
        </nav>
      </div>
    </footer>
  );
}

function LegalShell({ children, contactPerson, homePath, paths, kicker, title, lead, LinkedinIcon }) {
  useEffect(() => window.scrollTo(0, 0), []);
  const sectionHref = (id) => `${homePath}#${id}`;
  return (
    <div className="de2-site">
      <BrandHeader homePath={homePath} sectionHref={sectionHref} />
      <main className="de2-legal"><a className="de2-back" href={homePath}>← Zurück zur Startseite</a><p className="de2-eyebrow">{kicker}</p><h1>{title}</h1><p className="de2-legal__lead">{lead}</p>{children}</main>
      <BrandFooter contactPerson={contactPerson} homePath={homePath} {...paths} LinkedinIcon={LinkedinIcon} />
    </div>
  );
}

function PrivacyPage({ contactPerson, homePath, paths, privacy, LinkedinIcon }) {
  return (
    <LegalShell contactPerson={contactPerson} homePath={homePath} paths={paths} kicker="Rechtliches" title={privacy.title} lead={privacy.intro} LinkedinIcon={LinkedinIcon}>
      <p className="de2-legal__updated">{privacy.updated}</p>
      {privacy.sections.map((section) => <section key={section.title}><h2>{section.title}</h2>{section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</section>)}
    </LegalShell>
  );
}

function ImpressumPage({ contactPerson, homePath, paths, LinkedinIcon }) {
  return (
    <LegalShell contactPerson={contactPerson} homePath={homePath} paths={paths} kicker="Anbieterkennzeichnung" title="Impressum" lead="Angaben zum Anbieter dieser Website." LinkedinIcon={LinkedinIcon}>
      <section><h2>Anbieter</h2><p>Factory Simulation OÜ<br />Rechtsform: Osaühing (estnische Gesellschaft mit beschränkter Haftung)<br />Okka tee 2<br />Piira küla, Vinni vald<br />Lääne-Viru maakond 46607<br />Estland</p></section>
      <section><h2>Vertretungsberechtigte Person</h2><p>Vorstandsmitglied: Steven Strandberg</p></section>
      <section><h2>Registereintrag</h2><p>Estnisches Handelsregister (Äriregister)<br />Registernummer: 17384619</p></section>
      <section><h2>Umsatzsteuer-Identifikationsnummer</h2><p>EE102941711</p></section>
      <section><h2>Verantwortlich für den Inhalt</h2><p>Steven Strandberg, Anschrift wie oben.</p></section>
    </LegalShell>
  );
}

function LegalNoticePage({ contactPerson, homePath, paths, LinkedinIcon }) {
  return (
    <LegalShell contactPerson={contactPerson} homePath={homePath} paths={paths} kicker="Rechtliches" title="Rechtliche Hinweise" lead="Hinweise zur Nutzung und zu den Inhalten dieser Website." LinkedinIcon={LinkedinIcon}>
      <section><h2>Informationen auf dieser Website</h2><p>Die Inhalte dieser Website dienen der allgemeinen Information über unsere Leistungen. Sie stellen kein verbindliches Angebot und keine technische, rechtliche oder wirtschaftliche Beratung für einen konkreten Anwendungsfall dar. Verbindliche Leistungen, Ergebnisse und Termine ergeben sich ausschließlich aus einer individuellen Vereinbarung.</p></section>
      <section><h2>Inhalte und Aktualität</h2><p>Wir erstellen und pflegen die Inhalte mit angemessener Sorgfalt. Produktions-, Simulations- und Projektergebnisse hängen jedoch von den jeweiligen Eingangsdaten, Annahmen und Rahmenbedingungen ab. Bitte kontaktieren Sie uns, wenn Sie einen Fehler oder eine veraltete Angabe feststellen.</p></section>
      <section><h2>Urheber- und Nutzungsrechte</h2><p>Texte, Grafiken, Simulationen, Bilder, Videos und sonstige eigene Inhalte dieser Website dürfen nur im gesetzlich zulässigen Umfang oder mit vorheriger Zustimmung von Factory Simulation OÜ verwendet werden. Rechte Dritter bleiben unberührt und werden, soweit erkennbar, entsprechend gekennzeichnet.</p></section>
      <section><h2>Externe Links</h2><p>Diese Website enthält Links zu externen Angeboten. Für deren Inhalte und Datenschutzpraktiken sind die jeweiligen Anbieter verantwortlich. Wir prüfen externe Links bei ihrer Aufnahme, haben jedoch keinen fortlaufenden Einfluss auf spätere Änderungen fremder Inhalte.</p></section>
      <section><h2>Verfügbarkeit</h2><p>Wir bemühen uns um einen zuverlässigen Betrieb der Website, können eine jederzeitige unterbrechungs- oder fehlerfreie Verfügbarkeit jedoch nicht gewährleisten.</p></section>
    </LegalShell>
  );
}

function FaqPage({ contactPerson, homePath, paths, t, LinkedinIcon }) {
  return (
    <LegalShell contactPerson={contactPerson} homePath={homePath} paths={paths} kicker={t.faq.eyebrow} title={t.faq.title} lead={t.faq.intro.join(' ')} LinkedinIcon={LinkedinIcon}>
      <div className="de2-faq-list">{t.faq.items.map((item, index) => <section key={item.question}><span>{String(index + 1).padStart(2, '0')}</span><div><h2>{item.question}</h2>{item.answer.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}{item.points && <ul>{item.points.map((point) => <li key={point}>{point}</li>)}</ul>}</div></section>)}</div>
    </LegalShell>
  );
}

function PricingPage({ contactPerson, homePath, paths, LinkedinIcon }) {
  const steps = processSteps.map(([, title, description]) => [title, description]);
  return (
    <div className="de2-site">
      <BrandHeader homePath={homePath} sectionHref={(id) => `${homePath}#${id}`} />
      <main className="de2-pricing">
        <a className="de2-back" href={homePath}>← Zurück zur Startseite</a>
        <p className="de2-eyebrow">Preise & Zusammenarbeit</p>
        <h1>Ihre Angaben. Unsere Ingenieurarbeit.<br />Ein klares Ergebnis.</h1>
        <p className="de2-pricing__lead">Starten Sie mit Phase 1 zum Festpreis von 990 €. Entwickeln Sie das Ergebnis in Phase 2 weiter oder verbinden Sie beide Stufen mit einer Betreuungsvereinbarung für zukünftige Änderungen.</p>
        <section className="de2-pricing__workflow" aria-labelledby="pricing-workflow">
          <h2 id="pricing-workflow">Von Ihrer Frage zum Ergebnis</h2>
          <div className="de2-process__steps de2-pricing__steps">{steps.map(([title, description], index) => <article key={title}><span>{index + 1}</span><h3>{title}</h3><p>{description}</p></article>)}</div>
        </section>
        <section className="de2-pricing__packages" aria-label="Pakete und Preise">
          <article className="de2-pricing__package">
            <div><p className="de2-eyebrow">Phase 1</p><h2>Erste Ergebnisse</h2><p className="de2-pricing__price">990 € Festpreis</p></div>
            <div><p>Sie liefern die Angaben. Wir liefern das Ergebnis der ersten Phase in 36 Stunden.</p><ul><li>Direkter Austausch mit dem Ingenieurteam</li><li>Ergebnis der ersten Phase auf Basis Ihrer Angaben</li><li>90-Sekunden-Video mit den Ergebnissen</li><li>Ergebnisdokumentation</li></ul><a className="de2-button de2-button--dark" href={`${homePath}#kontakt`}>Phase 1 anfragen <ArrowIcon /></a></div>
          </article>
          <article className="de2-pricing__package">
            <div><p className="de2-eyebrow">Phase 2</p><h2>Weiterentwicklung</h2><p className="de2-pricing__price">Projektabhängig</p></div>
            <div><p>In Phase 2 entwickeln wir das Ergebnis aus Phase 1 weiter.</p><ul><li>Weiterentwicklung auf Basis von Phase 1</li><li>Rabatt nach Abschluss von Phase 1 möglich</li><li>Umfang und Preis nach Projektanforderungen</li></ul><a className="de2-button de2-button--dark" href={`${homePath}#kontakt`}>Phase 2 besprechen <ArrowIcon /></a></div>
          </article>
          <article className="de2-pricing__package">
            <div><p className="de2-eyebrow">Gesamtpaket</p><h2>Beide Phasen & Betreuung</h2><p className="de2-pricing__price">Individuelles Angebot</p></div>
            <div><p>Verbinden Sie beide Projektstufen mit einer Vereinbarung für zukünftige Änderungen Ihrer Eingangsdaten.</p><ul><li>Rabatt auf Phase 1 und Phase 2</li><li>Betreuungsvereinbarung mit festgelegten Leistungen und Reaktionszeiten für zukünftige Änderungen der Eingangsdaten</li><li>Leistungsumfang und Betreuungsbedingungen individuell vereinbart</li></ul><a className="de2-button de2-button--dark" href={`${homePath}#kontakt`}>Gesamtpaket besprechen <ArrowIcon /></a></div>
          </article>
        </section>
      </main>
      <BrandFooter contactPerson={contactPerson} homePath={homePath} {...paths} LinkedinIcon={LinkedinIcon} />
    </div>
  );
}

export default function GermanSite({ assetPath, basePath, contactEndpoint, contactPerson, isDedicatedSite = false, LinkedinIcon, onLeadConversion, privacyDetails, t }) {
  const [formStatus, setFormStatus] = useState('idle');
  const mainSiteOrigin = import.meta.env.VITE_MAIN_SITE_ORIGIN || '';
  const resolvedMainSiteOrigin = mainSiteOrigin || (isDedicatedSite ? '' : `${window.location.origin}${basePath.replace(/\/$/, '')}`);
  const germanOrigin = (import.meta.env.VITE_GERMAN_SITE_ORIGIN || import.meta.env.VITE_PUBLIC_ORIGIN || '').replace(/\/$/, '');
  const homePath = isDedicatedSite ? basePath : `${basePath}de/`;
  const pricingPath = `${homePath}pricing/`;
  const privacyPath = isDedicatedSite ? `${basePath}privacy/` : `${basePath}de/privacy/`;
  const faqPath = isDedicatedSite ? `${basePath}factory-simulation-faq/` : `${basePath}de/factory-simulation-faq/`;
  const impressumPath = isDedicatedSite ? `${basePath}impressum/` : `${basePath}de/impressum/`;
  const legalNoticePath = isDedicatedSite ? `${basePath}legal-notice/` : `${basePath}de/legal-notice/`;
  const paths = { privacyPath, faqPath, impressumPath, legalNoticePath };
  const pathParts = window.location.pathname.slice(basePath.length).split('/').filter(Boolean);
  const activeRoute = isDedicatedSite ? pathParts[0] : pathParts[1];
  const isPrivacy = activeRoute === 'privacy';
  const isPricing = activeRoute === 'pricing';
  const isFaq = activeRoute === 'factory-simulation-faq';
  const isImpressum = activeRoute === 'impressum';
  const isLegalNotice = activeRoute === 'legal-notice';
  const isLegalPage = isImpressum || isLegalNotice;

  useEffect(() => { if (activeRoute === 'wheelme') window.history.replaceState(null, '', homePath); }, [activeRoute, homePath]);

  useEffect(() => {
    document.documentElement.lang = 'de';
    document.body.classList.add('de-body', 'de2-body');
    const pageTitle = isPricing ? 'Preise | Robotics and Factory Simulation' : isImpressum ? 'Impressum | Factory Simulation' : isLegalNotice ? 'Rechtliche Hinweise | Factory Simulation' : isPrivacy ? 'Datenschutzerklärung | Factory Simulation' : isFaq ? t.faq.metaTitle : 'Smarte Produktionssimulation | Factory Simulation';
    const pageDescription = isPricing ? 'Informationen zu Leistungen, Preisen und Zusammenarbeit mit Robotics and Factory Simulation.' : isImpressum ? 'Impressum und Anbieterkennzeichnung von Factory Simulation OÜ.' : isLegalNotice ? 'Rechtliche Hinweise zur Website von Factory Simulation OÜ.' : isPrivacy ? 'Datenschutzerklärung von Factory Simulation OÜ.' : isFaq ? t.faq.metaDescription : 'Schnelle, flexible Produktionssimulation und virtuelle Validierung für Maschinenbauer, Integratoren und Produktionsunternehmen.';
    document.title = pageTitle;
    document.querySelector('meta[name="description"]')?.setAttribute('content', pageDescription);
    const currentOrigin = germanOrigin || window.location.origin;
    const canonicalPath = isPricing ? pricingPath : isImpressum ? impressumPath : isLegalNotice ? legalNoticePath : isPrivacy ? privacyPath : isFaq ? faqPath : homePath;
    const canonicalUrl = `${currentOrigin}${canonicalPath}`;
    [['meta[property="og:title"]', pageTitle], ['meta[property="og:description"]', pageDescription], ['meta[property="og:url"]', canonicalUrl], ['meta[name="twitter:title"]', pageTitle], ['meta[name="twitter:description"]', pageDescription]].forEach(([selector, value]) => document.querySelector(selector)?.setAttribute('content', value));
    document.querySelectorAll('link[data-language-link="true"]').forEach((link) => link.remove());
    const links = [['canonical', '', canonicalUrl], ['alternate', 'de', canonicalUrl]];
    if (!isPricing && !isPrivacy && !isLegalPage && resolvedMainSiteOrigin) {
      const origin = resolvedMainSiteOrigin.replace(/\/$/, '');
      links.push(['alternate', 'et', `${origin}/et/${isFaq ? 'factory-simulation-faq/' : ''}`], ['alternate', 'en', `${origin}/en/${isFaq ? 'factory-simulation-faq/' : ''}`], ['alternate', 'x-default', `${origin}/en/`]);
    }
    links.forEach(([rel, hrefLang, href]) => { const link = document.createElement('link'); link.rel = rel; if (hrefLang) link.setAttribute('hreflang', hrefLang); link.href = href; link.dataset.languageLink = 'true'; document.head.appendChild(link); });
    return () => { document.body.classList.remove('de-body', 'de2-body'); document.querySelectorAll('link[data-language-link="true"]').forEach((link) => link.remove()); };
  }, [isPricing, pricingPath, faqPath, germanOrigin, homePath, impressumPath, isFaq, isImpressum, isLegalNotice, isLegalPage, isPrivacy, legalNoticePath, privacyPath, resolvedMainSiteOrigin, t.faq.metaDescription, t.faq.metaTitle]);

  if (isPrivacy) return <PrivacyPage contactPerson={contactPerson} homePath={homePath} paths={paths} privacy={privacyDetails} LinkedinIcon={LinkedinIcon} />;
  if (isPricing) return <PricingPage contactPerson={contactPerson} homePath={homePath} paths={paths} LinkedinIcon={LinkedinIcon} />;
  if (isImpressum) return <ImpressumPage contactPerson={contactPerson} homePath={homePath} paths={paths} LinkedinIcon={LinkedinIcon} />;
  if (isLegalNotice) return <LegalNoticePage contactPerson={contactPerson} homePath={homePath} paths={paths} LinkedinIcon={LinkedinIcon} />;
  if (isFaq) return <FaqPage contactPerson={contactPerson} homePath={homePath} paths={paths} t={t} LinkedinIcon={LinkedinIcon} />;

  const sectionHref = (id) => `#${id}`;
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (formStatus === 'sending' || formStatus === 'success') return;
    const form = event.currentTarget;
    const formData = new FormData(form);
    const organization = String(formData.get('organization') || '').trim();
    const description = String(formData.get('description') || '').trim();
    const payload = { name: String(formData.get('name') || '').trim(), email: String(formData.get('email') || '').trim(), description: organization ? `Unternehmen: ${organization}\n\n${description}` : description, company: String(formData.get('company') || '').trim(), language: 'de', source: 'main' };
    if (!contactEndpoint) {
      const subject = encodeURIComponent('Neue Projektanfrage');
      const body = encodeURIComponent(`Name: ${payload.name}\nE-Mail: ${payload.email}\n\nProjekt:\n${payload.description}`);
      window.location.href = `mailto:info@factorysimulation.eu?subject=${subject}&body=${body}`;
      return;
    }
    setFormStatus('sending');
    try {
      const response = await fetch(contactEndpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (!response.ok) throw new Error(`Contact request failed with status ${response.status}`);
      form.reset(); setFormStatus('success'); onLeadConversion?.();
    } catch (error) { console.error('Contact form submission failed.', error); setFormStatus('error'); }
  };

  return (
    <div className="de2-site">
      <BrandHeader homePath={homePath} sectionHref={sectionHref} />
      <main>
        <section className="de2-hero">
          <div className="de2-hero__media-frame" aria-hidden="true"><img className="de2-hero__media" src={assetPath('/de-v2/steven-hero-v2.png')} alt="" fetchPriority="high" /></div>
          <div className="de2-hero__wash" aria-hidden="true" />
          <div className="de2-hero__content"><p className="de2-eyebrow">Services</p><h1>Smarte Simulationen.<br /><span>Schnellere Entscheidungen.</span></h1><p>Wir helfen Maschinenbauern, Automatisierungsintegratoren und Produktionsunternehmen, ihre Systeme schneller, intelligenter und effizienter zu simulieren, zu optimieren und virtuell zu validieren.</p><div className="de2-actions"><a className="de2-button de2-button--dark" href="#kontakt">Projekt besprechen <ArrowIcon /></a><a className="de2-text-link" href="#prozess">So arbeiten wir <ArrowIcon /></a></div></div>
        </section>

        <section className="de2-benefits" id="warum" aria-label="Warum Factory Simulation">{benefits.map(([icon, title, text]) => <article key={title}><BenefitIcon type={icon} /><h2>{title}</h2><p>{text}</p></article>)}</section>

        <section className="de2-team" aria-label="Über uns">
          <div className="de2-estonia">
            <figure className="de2-estonia__photo"><img src={assetPath('/de-v2/estonia-bog.jpeg')} alt="Moorlandschaft in Estland mit einer Wandergruppe" loading="lazy" decoding="async" /></figure>
            <div className="de2-estonia__copy"><p className="de2-eyebrow">Mehr als eine Dienstleistung</p><h2>Wir sind ein Team von Machern. Aus Estland.</h2><p>Kein großer Apparat mit Büros und Ebenen. Wir sind ein kleines, fokussiertes Team, das komplexe Produktionsfragen mit digitalen Werkzeugen löst. Wir arbeiten remote, handeln schnell und bleiben nah an den Menschen, mit denen wir arbeiten.</p></div>
            <blockquote>„Ich habe Robotics and Factory Simulation gegründet, um den Unternehmen, mit denen wir zusammenarbeiten, als Ingenieurpartner zur Seite zu stehen und dabei umfassende Erfahrung mit frischen Ideen und modernster Technologie zu verbinden.“<strong>Steven Strandberg</strong><span>Gründer & Maschinenbauingenieur</span></blockquote>
          </div>
        </section>

        <section className="de2-process" id="prozess">
          <div className="de2-process__intro"><p className="de2-eyebrow">So arbeiten wir</p><h2>Von Ihrer Herausforderung zur validierten Lösung. Schnell.</h2><p>Keine unnötigen Umwege, keine unklaren Übergaben und kein tagelanges Warten auf eine Antwort. Sie sprechen direkt mit dem Team, das Ihr Modell erstellt und die Ergebnisse bewertet.</p><div className="de2-process__steps">{processSteps.map(([number, title, text]) => <article key={number}><span>{number}</span><h3>{title}</h3><p>{text}</p></article>)}</div><a className="de2-text-link" href={pricingPath}>Unser Prozess <ArrowIcon /></a></div>
          <div className="de2-process__visual"><img src={assetPath('/de-v2/steven-laptop-v2.png')} alt="Steven Strandberg arbeitet mit einem Laptop in einer Produktionshalle" width="1109" height="1418" loading="lazy" decoding="async" /></div>
        </section>

        <section className="de2-team" id="team">
          <div className="de2-team__grid">{t.team.map((person) => <article key={person.name}>{person.image ? <img src={assetPath(person.image)} alt={person.name} loading="lazy" decoding="async" /> : <div className="de2-team__placeholder" aria-hidden="true">{person.name.split(' ').map((part) => part[0]).join('')}</div>}<h3>{person.name}</h3><p>{person.role}</p></article>)}</div>
        </section>

        <section className="de2-contact" id="kontakt">
          <div className="de2-contact__intro"><p className="de2-eyebrow">Projektstart</p><h2>Was möchten Sie sicher entscheiden?</h2><p>Beschreiben Sie kurz Ihre Produktionsfrage. Wir melden uns persönlich und klären, welche Daten und welcher Simulationsumfang wirklich sinnvoll sind.</p>{contactPerson && <address>{contactPerson.image && <img className="de2-contact__portrait" src={assetPath(contactPerson.image)} alt={contactPerson.name} width="768" height="512" loading="lazy" decoding="async" />}<span>Ihr Ansprechpartner für DACH</span><h3>{contactPerson.name}</h3><p>{contactPerson.role}</p><a href={contactPerson.phoneHref}><PhoneIcon />{contactPerson.phone}</a><a href={`mailto:${contactPerson.email}`}><MailIcon />{contactPerson.email}</a>{contactPerson.linkedin && LinkedinIcon && <a className="de2-contact__social" href={contactPerson.linkedin} target="_blank" rel="noreferrer" aria-label={`${contactPerson.name} LinkedIn`}><LinkedinIcon /></a>}</address>}</div>
          <form className="de2-form" onSubmit={handleSubmit}><div className="de2-form__row"><label>Name<input name="name" autoComplete="name" placeholder="Vor- und Nachname" required /></label><label>E-Mail<input name="email" type="email" autoComplete="email" placeholder="name@unternehmen.de" required /></label></div><label>Unternehmen<input name="organization" autoComplete="organization" placeholder="Unternehmensname" /></label><label>Ihre Produktionsfrage<textarea name="description" rows="6" minLength="5" placeholder="Welche Entscheidung möchten Sie mit Simulation absichern?" required /></label><input className="de2-honeypot" name="company" tabIndex="-1" autoComplete="off" aria-hidden="true" /><p className="de2-form__privacy">Mit dem Absenden stimmen Sie der Verarbeitung Ihrer Angaben zur Beantwortung der Anfrage zu. <a href={privacyPath}>Datenschutz</a></p><button className="de2-button de2-button--dark" type="submit" disabled={formStatus === 'sending' || formStatus === 'success'}>{formStatus === 'sending' ? 'Wird gesendet…' : formStatus === 'success' ? 'Anfrage gesendet' : 'Anfrage senden'} <ArrowIcon /></button>{formStatus === 'error' && <p className="de2-form__status" role="alert">Die Nachricht konnte nicht gesendet werden. Bitte schreiben Sie an info@factorysimulation.eu.</p>}</form>
        </section>
      </main>
      <BrandFooter contactPerson={contactPerson} homePath={homePath} {...paths} LinkedinIcon={LinkedinIcon} />
    </div>
  );
}
