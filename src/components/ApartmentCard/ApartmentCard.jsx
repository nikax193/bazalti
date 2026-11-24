import { Link } from '../../router/Router';
import FloorPlan from '../FloorPlan/FloorPlan';
import { statusLabel, typeLabel } from '../../data/apartments';
import styles from './ApartmentCard.module.css';

function SofaIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M4 11V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v3" />
      <path d="M2 13a2 2 0 0 1 4 0v2h12v-2a2 2 0 0 1 4 0v5H2z" />
      <path d="M5 18v2M19 18v2" />
    </svg>
  );
}

function BalconyIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M7 3h10v9H7z" />
      <path d="M3 12h18M4 12v8M8 12v8M12 12v8M16 12v8M20 12v8M3 20h18" />
    </svg>
  );
}

function StarIcon({ filled }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1 6.2L12 17.3 6.5 20.2l1-6.2L3 9.6l6.2-.9z" />
    </svg>
  );
}

function ApartmentCard({ apartment, isFavorite, onToggleFavorite }) {
  const { id, block, floor, bedrooms, area, livingArea, balconyArea, price, status, mirrored } = apartment;

  return (
    <article className={`${styles.card} ${status === 'sold' ? styles.sold : ''}`}>
      {/* მთელ ბარათზე დაწკაპება ხსნის ბინის გვერდს */}
      <Link to={`/apartments/${id}`} className={styles.cardLink} aria-label={`ბინა №${id}`} />
      <div className={styles.top}>
        <span className={`${styles.status} ${styles[status]}`}>{statusLabel[status]}</span>
        <button
          className={`${styles.star} ${isFavorite ? styles.starActive : ''}`}
          onClick={() => onToggleFavorite(id)}
          aria-label={isFavorite ? 'რჩეულებიდან წაშლა' : 'რჩეულებში დამატება'}
          aria-pressed={isFavorite}
        >
          <StarIcon filled={isFavorite} />
        </button>
      </div>

      <div className={styles.plan}>
        <FloorPlan bedrooms={bedrooms} livingArea={livingArea} balconyArea={balconyArea} mirrored={mirrored} />
      </div>

      <p className={styles.area}>
        {area} მ<sup>2</sup>
      </p>
      <p className={styles.type}>{typeLabel[bedrooms]}</p>

      <div className={styles.meta}>
        <span title="საცხოვრებელი ფართი">
          <SofaIcon />
          <span>{livingArea} მ<sup>2</sup></span>
        </span>
        <span title="აივანი">
          <BalconyIcon />
          <span>{balconyArea} მ<sup>2</sup></span>
        </span>
      </div>

      <div className={styles.footer}>
        <span>ბლოკი {block} · {floor} სართ. · №{id}</span>
        <strong>${price.toLocaleString('en-US')}</strong>
      </div>
    </article>
  );
}

export default ApartmentCard;
