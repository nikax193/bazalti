import styles from './SectionTitle.module.css';

function SectionTitle({ title, subtitle, light = false, action }) {
  return (
    <div className={styles.wrapper}>
      <div>
        <h2 className={`${styles.title} ${light ? styles.light : ''}`}>{title}</h2>
        {subtitle && (
          <p className={`${styles.subtitle} ${light ? styles.lightMuted : ''}`}>{subtitle}</p>
        )}
      </div>
      {action && <div className={styles.action}>{action}</div>}
    </div>
  );
}

export default SectionTitle;
