import { useEffect, useState } from 'react';
import { Link, NavLink } from '../../router/Router';
import { company, navLinks } from '../../data/homeData';
import styles from './Header.module.css';

function PhoneIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z" />
    </svg>
  );
}

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [lang, setLang] = useState('GEO');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.inner}>
        <Link to="/" className={styles.logo}>
          {company.name}
        </Link>

        <nav className={`${styles.nav} ${menuOpen ? styles.navOpen : ''}`}>
          {navLinks.map((link) =>
            link.type === 'route' ? (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`}
                onClick={closeMenu}
              >
                {link.label}
              </NavLink>
            ) : (
              <Link key={link.to} to={link.to} className={styles.link} onClick={closeMenu}>
                {link.label}
              </Link>
            )
          )}
          <a href={`tel:${company.phone}`} className={`btn btn--primary ${styles.mobileCta}`}>
            <PhoneIcon /> დაგვიკავშირდით
          </a>
        </nav>

        <div className={styles.actions}>
          <a href={`tel:${company.phone}`} className={`btn btn--primary ${styles.cta}`}>
            <PhoneIcon /> დაგვიკავშირდით
          </a>
          <button
            className={styles.lang}
            onClick={() => setLang(lang === 'GEO' ? 'ENG' : 'GEO')}
            aria-label="ენის შეცვლა"
          >
            {lang === 'GEO' ? 'ENG' : 'GEO'}
          </button>
          <button
            className={`${styles.burger} ${menuOpen ? styles.burgerOpen : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="მენიუ"
            aria-expanded={menuOpen}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
