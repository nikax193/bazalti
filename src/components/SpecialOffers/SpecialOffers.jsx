import { specialOffers } from '../../data/homeData';
import SectionTitle from '../SectionTitle/SectionTitle';
import styles from './SpecialOffers.module.css';

function SpecialOffers() {
  return (
    <section className={styles.section}>
      <div className="container">
        <SectionTitle
          title="სპეციალური შეთავაზებები"
          subtitle="მოქმედებს შეზღუდული დროით — დეტალებისთვის დაუკავშირდით გაყიდვების მენეჯერს"
        />
        <div className={styles.grid}>
          {specialOffers.map((offer) => (
            <article key={offer.id} className={styles.card}>
              <span className={styles.badge}>{offer.badge}</span>
              <h3 className={styles.title}>{offer.title}</h3>
              <p className={styles.text}>{offer.text}</p>
              <a href="#contact" className={styles.link}>
                დეტალურად →
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default SpecialOffers;
