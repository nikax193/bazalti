import { useEffect, useState } from 'react';
import { galleryImages } from '../../data/homeData';
import ImageBox from '../ImageBox/ImageBox';
import SectionTitle from '../SectionTitle/SectionTitle';
import styles from './Gallery.module.css';

function Gallery() {
  const [openIndex, setOpenIndex] = useState(null);

  // Esc-ით დახურვა
  useEffect(() => {
    if (openIndex === null) return undefined;
    const onKey = (e) => e.key === 'Escape' && setOpenIndex(null);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [openIndex]);

  const current = openIndex !== null ? galleryImages[openIndex] : null;

  return (
    <section id="gallery" className={styles.section}>
      <div className="container">
        <SectionTitle
          title="გალერეა"
          action={<button className="btn btn--outline-dark" onClick={() => setOpenIndex(0)}>ყველას ნახვა</button>}
        />

        <div className={styles.grid}>
          {galleryImages.map((img, index) => (
            <button
              key={img.id}
              className={`${styles.item} ${styles[`item${index + 1}`]}`}
              onClick={() => setOpenIndex(index)}
              aria-label={`გახსნა: ${img.alt}`}
            >
              <ImageBox src={img.image} alt={img.alt} gradient={img.gradient} className={styles.image} />
            </button>
          ))}
        </div>
      </div>

      {current && (
        <div className={styles.lightbox} onClick={() => setOpenIndex(null)} role="dialog" aria-modal="true">
          <button className={styles.close} aria-label="დახურვა">×</button>
          <div className={styles.lightboxInner} onClick={(e) => e.stopPropagation()}>
            <ImageBox src={current.image} alt={current.alt} gradient={current.gradient} className={styles.lightboxImage} />
            <p className={styles.caption}>{current.alt}</p>
          </div>
        </div>
      )}
    </section>
  );
}

export default Gallery;
