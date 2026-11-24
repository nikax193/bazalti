import { useState } from 'react';
import { statusLabel } from '../../data/apartments';
import InquiryForm from '../InquiryForm/InquiryForm';
import styles from './ApartmentInfo.module.css';

const icons = {
  living: <path d="M4 11V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v3M2 13a2 2 0 0 1 4 0v2h12v-2a2 2 0 0 1 4 0v5H2zM5 18v2M19 18v2" />,
  bed: <path d="M2 18V6M2 14h20v4M22 18v-6a2 2 0 0 0-2-2H10v4M6 12a2 2 0 1 0 0-.01" />,
  bath: <path d="M4 12h16v3a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4zM6 12V5a2 2 0 0 1 4 0M6 19l-1 2M18 19l1 2" />,
  hall: <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3" />,
  balcony: <path d="M7 3h10v9H7zM3 12h18M4 12v8M8 12v8M12 12v8M16 12v8M20 12v8M3 20h18" />,
};

function RoomIcon({ type }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      {icons[type]}
    </svg>
  );
}

// მარცხენა ბარათი: სართული, ბლოკი, ფართი, ოთახების ცხრილი, ფასი და დაკავშირება
function ApartmentInfo({ apartment, rooms }) {
  const [formOpen, setFormOpen] = useState(false);
  const { floor, block, area, balconyArea, price, status } = apartment;
  const pricePerSqm = Math.round(price / area);

  return (
    <aside className={styles.aside}>
      <div className={styles.card}>
        <div className={styles.stats}>
          <div>
            <strong>{floor}</strong>
            <span>სართული</span>
          </div>
          <div>
            <strong>{block}</strong>
            <span>ბლოკი</span>
          </div>
          <div>
            <strong>
              {area} მ<sup>2</sup>
            </strong>
            <span>საერთო ფართი</span>
          </div>
        </div>

        <ul className={styles.rooms}>
          {rooms.map((room) => (
            <li key={room.key}>
              <RoomIcon type={room.type} />
              <span className={styles.roomName}>{room.name}</span>
              <span className={styles.roomArea}>
                {room.area} მ<sup>2</sup>
              </span>
            </li>
          ))}
          <li>
            <RoomIcon type="balcony" />
            <span className={styles.roomName}>აივანი</span>
            <span className={styles.roomArea}>
              {balconyArea} მ<sup>2</sup>
            </span>
          </li>
        </ul>

        <div className={styles.price}>
          <div>
            <span className={`${styles.status} ${styles[status]}`}>{statusLabel[status]}</span>
            <small>${pricePerSqm.toLocaleString('en-US')} / მ²</small>
          </div>
          <strong>${price.toLocaleString('en-US')}</strong>
        </div>
      </div>

      {status !== 'sold' && (
        <button
          className={`btn btn--accent no-print ${styles.cta}`}
          onClick={() => setFormOpen(!formOpen)}
          aria-expanded={formOpen}
        >
          {formOpen ? 'დახურვა' : 'დაგვიკავშირდით'}
        </button>
      )}

      {formOpen && <InquiryForm apartmentId={apartment.id} />}
    </aside>
  );
}

export default ApartmentInfo;
