import { useEffect, useRef, useState } from 'react';
import styles from './FilterDropdown.module.css';

function Chevron() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

// ღილაკი + ჩამოსაშლელი პანელი. გარეთ დაწკაპებით ან Esc-ით იხურება.
function FilterDropdown({ label, count = 0, icon, children, align = 'left' }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div className={styles.wrapper} ref={ref}>
      <button
        type="button"
        className={`${styles.trigger} ${count > 0 ? styles.hasValue : ''} ${open ? styles.open : ''}`}
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        {icon}
        <span>{label}</span>
        {count > 0 && <span className={styles.count}>{count}</span>}
        {!icon && <Chevron />}
      </button>

      {open && <div className={`${styles.panel} ${align === 'right' ? styles.right : ''}`}>{children}</div>}
    </div>
  );
}

export default FilterDropdown;
