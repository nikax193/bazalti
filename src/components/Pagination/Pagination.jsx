import styles from './Pagination.module.css';

function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav className={styles.pagination} aria-label="გვერდები">
      <button className={styles.arrow} onClick={() => onChange(page - 1)} disabled={page === 1} aria-label="წინა გვერდი">
        ←
      </button>
      {pages.map((p) => (
        <button
          key={p}
          className={`${styles.page} ${p === page ? styles.active : ''}`}
          onClick={() => onChange(p)}
          aria-current={p === page ? 'page' : undefined}
        >
          {p}
        </button>
      ))}
      <button className={styles.arrow} onClick={() => onChange(page + 1)} disabled={page === totalPages} aria-label="შემდეგი გვერდი">
        →
      </button>
    </nav>
  );
}

export default Pagination;
