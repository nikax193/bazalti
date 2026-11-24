import { Link } from '../../router/Router';
import { company, footerLinks } from '../../data/homeData';
import styles from './Footer.module.css';

const socials = [
  { label: 'Facebook', short: 'f', url: 'https://facebook.com' },
  { label: 'YouTube', short: '▶', url: 'https://youtube.com' },
  { label: 'Instagram', short: '◎', url: 'https://instagram.com' },
  { label: 'LinkedIn', short: 'in', url: 'https://linkedin.com' },
];

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <Link to="/" className={styles.logo}>{company.name}</Link>
          <p className={styles.copy}>© {year} {company.fullName}. ყველა უფლება დაცულია.</p>
        </div>

        <div className={styles.columns}>
          {footerLinks.map((column, i) => (
            <ul key={i} className={styles.list}>
              {column.map((link) => (
                <li key={link.label}>
                  <Link to={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          ))}

          <ul className={styles.list}>
            <li><a href={`mailto:${company.email}`}>{company.email}</a></li>
            <li><a href={`tel:${company.phone}`}>{company.phone}</a></li>
            <li>{company.address}</li>
            <li className={styles.socials}>
              {socials.map((s) => (
                <a key={s.label} href={s.url} target="_blank" rel="noreferrer" aria-label={s.label} className={styles.social}>{s.short}</a>
              ))}
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
