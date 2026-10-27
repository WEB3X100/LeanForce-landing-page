import { useEffect, useState, type ReactNode } from 'react';
import { useLocation } from 'wouter';
import { ArrowUpRight, Menu } from 'lucide-react';

const pages: Record<string, { title: string; description: string }> = {
  '/': {
    title: 'LeanForce | Scale operations without scaling the busywork',
    description: 'LeanForce maps a workflow, connects the tools you already use, and puts AI workers on repetitive steps. Your team keeps the decisions.',
  },
  '/engagements': {
    title: 'Focused Workflow | LeanForce',
    description: 'Start with one workflow. Assessment and Map, Sprint Build, and Managed Run are scoped separately. The fee is confirmed after assessment.',
  },
  '/privacy': {
    title: 'Privacy | LeanForce',
    description: 'How LeanForce uses the name, company, workflow, and contact details you send with an inquiry.',
  },
};

function setMeta(name: string, content: string) {
  const node = document.querySelector(`meta[name="${name}"]`);
  if (node) node.setAttribute('content', content);
}

export function SiteFrame({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showAssess, setShowAssess] = useState(false);
  const home = location === '/';

  useEffect(() => {
    const page = pages[location] ?? {
      title: 'Page not found | LeanForce',
      description: 'This LeanForce page is not available.',
    };
    document.title = page.title;
    setMeta('description', page.description);
  }, [location]);

  useEffect(() => {
    setMenuOpen(false);
    const id = window.location.hash.replace('#', '');
    if (!id) {
      window.scrollTo(0, 0);
      return;
    }
    const node = document.getElementById(id);
    if (node) node.scrollIntoView();
  }, [location]);

  useEffect(() => {
    if (!home) return;
    const hero = document.querySelector('.hero');
    const contact = document.querySelector('#contact');
    if (!hero || !contact) return;
    let pastHero = false;
    let inContact = false;
    const sync = () => setShowAssess(pastHero && !inContact);
    const heroObs = new IntersectionObserver(([entry]) => {
      pastHero = !entry.isIntersecting;
      sync();
    });
    const contactObs = new IntersectionObserver(([entry]) => {
      inContact = entry.isIntersecting;
      sync();
    }, { threshold: 0.15 });
    heroObs.observe(hero);
    contactObs.observe(contact);
    return () => {
      heroObs.disconnect();
      contactObs.disconnect();
    };
  }, [home]);

  const section = (id: string) => (home ? `#${id}` : `/#${id}`);
  const close = () => setMenuOpen(false);

  return (
    <div className="site-shell">
      <a className="skip-link" href="#top">Skip to content</a>
      <header className="topbar">
        <a className="brand" href={home ? '#top' : '/'} aria-label="LeanForce home"><img src="/brand/leanforce-logo.png" alt="LeanForce" /></a>
        <button className="mobile-menu" type="button" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={menuOpen}><Menu size={21} /></button>
        <nav className={menuOpen ? 'nav-links nav-open' : 'nav-links'} aria-label="Main navigation">
          <a href={section('workflows')} onClick={close}>Workflows</a>
          <a href={section('how-it-works')} onClick={close}>How it works</a>
          <a href="/engagements" onClick={close} aria-current={location === '/engagements' ? 'page' : undefined}>Engagements</a>
          <a href={section('faq')} onClick={close}>FAQ</a>
          <a className="nav-cta" href={section('contact')} onClick={close}>Talk through a workflow <ArrowUpRight size={15} /></a>
        </nav>
      </header>
      <main id="top">{children}</main>
      <footer className="footer">
        <div className="footer-main">
          <a className="footer-brand" href={home ? '#top' : '/'}><img src="/brand/leanforce-logo-white.png" alt="LeanForce" /></a>
          <nav className="footer-nav" aria-label="Footer">
            <a href={section('workflows')}>Workflows</a>
            <a href={section('how-it-works')}>How it works</a>
            <a href="/engagements">Engagements</a>
            <a href={section('faq')}>FAQ</a>
            <a href="/privacy" aria-current={location === '/privacy' ? 'page' : undefined}>Privacy</a>
          </nav>
          <a className="footer-cta" href={section('contact')}>Talk through a workflow <ArrowUpRight size={16} /></a>
        </div>
        <div className="footer-bottom"><span>© 2026 LeanForce</span></div>
      </footer>
      <a className="sticky-assess" href={section('contact')} hidden={!home || !showAssess || menuOpen}>Talk through a workflow</a>
    </div>
  );
}
