import { Link } from '../../router/Router';
import { statusLabel, typeLabel } from '../../data/apartments';
import styles from './FloorSchema.module.css';

// "სართული" ხედი: ბლოკის სართულის სქემა — ამ სართულის ბინები, მიმდინარე მონიშნულია.
function FloorSchema({ apartment, floorApartments }) {
  return (
    <div className={styles.wrapper}>
      <p className={styles.caption}>
        ბლოკი {apartment.block} · {apartment.floor} სართული
      </p>

      <div className={styles.floor}>
        {floorApartments.map((apt, index) => (
          <div key={apt.id} className={styles.slot}>
            {index === 1 && (
              <div className={styles.core}>
                <span>კიბე</span>
                <span>ლიფტი</span>
              </div>
            )}
            <Link
              to={`/apartments/${apt.id}`}
              className={`${styles.unit} ${styles[apt.status]} ${apt.id === apartment.id ? styles.current : ''}`}
              style={{ flexGrow: apt.area }}
            >
              <strong>№{apt.id}</strong>
              <span>{typeLabel[apt.bedrooms]}</span>
              <span>{apt.area} მ²</span>
              <em>{statusLabel[apt.status]}</em>
            </Link>
          </div>
        ))}
      </div>

      <ul className={styles.legend}>
        <li><i className={styles.free} /> თავისუფალი</li>
        <li><i className={styles.reserved} /> დაჯავშნილი</li>
        <li><i className={styles.sold} /> გაყიდული</li>
      </ul>
    </div>
  );
}

export default FloorSchema;
