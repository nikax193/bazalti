import { Suspense, useEffect, useRef, useState } from 'react';
import { useLocation } from '../../router/Router';
import styles from './LazySection.module.css';

const ROOT_MARGIN = '400px 0px';

/*
  LazySection — სექცია რენდერდება მხოლოდ მაშინ, როცა ეკრანს უახლოვდება.
  children უნდა იყოს React.lazy() კომპონენტი, ასე მისი კოდიც ცალკე ფაილად (chunk) იტვირთება.
  - anchor: სექციის id (მაგ. "contact"). თუ მისამართში #hash არის, სექციები მაშინვე იხატება,
    რათა ScrollManager-მა საჭირო ადგილას ჩამოასქროლოს.
  - minHeight: placeholder-ის სიმაღლე, რომ გვერდი ჩატვირთვისას არ "ახტეს".
*/
function LazySection({ anchor, minHeight = 600, children }) {
  const ref = useRef(null);
  const { hash } = useLocation();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (hash) setVisible(true);
  }, [hash]);

  useEffect(() => {
    if (visible) return undefined;
    const node = ref.current;
    if (!node || typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return undefined;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: ROOT_MARGIN },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [visible]);

  const placeholder = (
    <div
      ref={ref}
      id={visible ? undefined : anchor}
      className={styles.placeholder}
      style={{ minHeight }}
      data-lazy-pending=""
      aria-hidden="true"
    />
  );

  if (!visible) return placeholder;
  return <Suspense fallback={placeholder}>{children}</Suspense>;
}

export default LazySection;
