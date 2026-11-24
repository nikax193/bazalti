import { Link } from '../../router/Router';
import { statusLabel, typeLabel } from '../../data/apartments';
import styles from './ApartmentsTable.module.css';

// "სიით" ხედი — კომპაქტური ცხრილი
function ApartmentsTable({ apartments, favorites, onToggleFavorite }) {
  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>ბინა</th>
            <th>ბლოკი</th>
            <th>სართული</th>
            <th>ტიპი</th>
            <th>ფართი</th>
            <th>აივანი</th>
            <th>ფასი</th>
            <th>სტატუსი</th>
            <th aria-label="რჩეული" />
          </tr>
        </thead>
        <tbody>
          {apartments.map((apt) => {
            const fav = favorites.includes(apt.id);
            return (
              <tr key={apt.id}>
                <td className={styles.id}><Link to={`/apartments/${apt.id}`}>№{apt.id}</Link></td>
                <td>{apt.block}</td>
                <td>{apt.floor}</td>
                <td>{typeLabel[apt.bedrooms]}</td>
                <td>{apt.area} მ²</td>
                <td>{apt.balconyArea} მ²</td>
                <td className={styles.price}>${apt.price.toLocaleString('en-US')}</td>
                <td>
                  <span className={`${styles.status} ${styles[apt.status]}`}>{statusLabel[apt.status]}</span>
                </td>
                <td>
                  <button
                    className={`${styles.star} ${fav ? styles.starActive : ''}`}
                    onClick={() => onToggleFavorite(apt.id)}
                    aria-label="რჩეული"
                    aria-pressed={fav}
                  >
                    {fav ? '★' : '☆'}
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default ApartmentsTable;
