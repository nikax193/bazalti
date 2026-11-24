import { useEffect, useRef, useState } from 'react';
import styles from './ImageBox.module.css';

// რამდენით ადრე დაიწყოს ჩატვირთვა, სანამ სურათი ეკრანზე გამოჩნდება
const ROOT_MARGIN = '300px 0px';

/*
  ImageBox — სურათი lazy load-ით და გრადიენტის fallback-ით.
  - სანამ ბლოკი ეკრანთან ახლოს არ მოვა, <img> საერთოდ არ იქმნება (IntersectionObserver).
  - ჩატვირთვის შემდეგ სურათი რბილად ჩნდება (fade-in), მანამდე ჩანს გრადიენტი.
  - priority — პირველი ეკრანის სურათებისთვის (Hero): იტვირთება მაშინვე, მაღალი პრიორიტეტით.
  - ფაილი თუ ვერ ჩაიტვირთა — რჩება გრადიენტი.
*/
function ImageBox({ src, alt = '', gradient, className = '', priority = false, onLoad, children }) {
  const boxRef = useRef(null);
  const [inView, setInView] = useState(priority);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  // ახალი src → თავიდან ვიწყებთ
  useEffect(() => {
    setLoaded(false);
    setFailed(false);
  }, [src]);

  useEffect(() => {
    if (inView || !src) return undefined;
    const node = boxRef.current;
    if (!node || typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return undefined;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: ROOT_MARGIN },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [inView, src]);

  const handleLoad = (e) => {
    setLoaded(true);
    onLoad?.(e);
  };

  // ქეშიდან უკვე ჩატვირთული სურათი onLoad-ს შეიძლება ვერ მოასწროს
  const imgRef = (img) => {
    if (img && img.complete && img.naturalWidth > 0 && !loaded) setLoaded(true);
  };

  return (
    <div ref={boxRef} className={`${styles.box} ${className}`} style={{ background: gradient }}>
      {src && inView && !failed && (
        <img
          ref={imgRef}
          className={`${styles.img} ${loaded ? styles.loaded : ''}`}
          src={src}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          // React 18 ჯერ არ იცნობს fetchPriority-ს camelCase-ით
          {...(priority ? { fetchpriority: 'high' } : {})}
          onLoad={handleLoad}
          onError={() => setFailed(true)}
        />
      )}
      {children}
    </div>
  );
}

export default ImageBox;
