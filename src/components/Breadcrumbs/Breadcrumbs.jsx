import { Link } from '../../router/Router';
import styles from './Breadcrumbs.module.css';

// items: [{ label, to }] — ბოლო ელემენტი მიმდინარე გვერდია (ბმულის გარეშე)
function Breadcrumbs({ items }) {
  return (
    <nav className={styles.crumbs} aria-label="ნავიგაცია">
      {items.map((item, i) => {
        const isLast = i === items.length - 1;
        return (
          <span key={item.label} className={styles.item}>
            {isLast || !item.to ? (
              <span aria-current="page">{item.label}</span>
            ) : (
              <Link to={item.to}>{item.label}</Link>
            )}
            {!isLast && <span className={styles.sep}>›</span>}
          </span>
        );
      })}
    </nav>
  );
}

export default Breadcrumbs;
