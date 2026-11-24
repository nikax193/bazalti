import { useCallback, useEffect, useState } from 'react';
import { Link } from '../../router/Router';
import { heroSlides } from '../../data/homeData';
import ImageBox from '../ImageBox/ImageBox';
import styles from './Hero.module.css';

const AUTOPLAY_MS = 6000;

function Arrow({ direction }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      {direction === 'left' ? <path d="M19 12H5M12 19l-7-7 7-7" /> : <path d="M5 12h14M12 5l7 7-7 7" />}
    </svg>
  );
}

function Hero() {
  const [active, setActive] = useState(0);
  // დანარჩენი სლაიდების სურათები იტვირთება მხოლოდ მას შემდეგ, რაც პირველი ჩაიტვირთა —
  // ასე პირველი ეკრანი (LCP) ყველაზე სწრაფად ჩნდება
  const [restReady, setRestReady] = useState(false);
  const total = heroSlides.length;

  // სარეზერვო: თუ პირველი სურათი ვერ ჩაიტვირთა, დანარჩენები მაინც დაიწყოს
  useEffect(() => {
    if (restReady) return undefined;
    const timer = setTimeout(() => setRestReady(true), 2500);
    return () => clearTimeout(timer);
  }, [restReady]);

  const srcFor = (slide) => (restReady || slide === heroSlides[0] ? slide.image : undefined);

  const next = useCallback(() => setActive((i) => (i + 1) % total), [total]);
  const prev = () => setActive((i) => (i - 1 + total) % total);

  // ავტომატური გადართვა; ყოველ ცვლილებაზე ტაიმერი თავიდან იწყება
  useEffect(() => {
    const timer = setTimeout(next, AUTOPLAY_MS);
    return () => clearTimeout(timer);
  }, [active, next]);

  // მარჯვნივ ჩანს შემდეგი ორი სლაიდი
  const upcoming = [1, 2].map((offset) => heroSlides[(active + offset) % total]);

  return (
    <section id="home" className={styles.hero}>
      <div className={styles.frame}>
        {heroSlides.map((slide, index) => (
          <ImageBox
            key={slide.id}
            src={srcFor(slide)}
            alt={slide.title}
            gradient={slide.gradient}
            priority={index === 0}
            onLoad={index === 0 ? () => setRestReady(true) : undefined}
            className={`${styles.slide} ${index === active ? styles.slideActive : ''}`}
          />
        ))}
        <div className={styles.overlay} />

        <div className={styles.content} key={heroSlides[active].id}>
          <h1 className={styles.title}>{heroSlides[active].title}</h1>
          <p className={styles.text}>{heroSlides[active].text}</p>
          <div className={styles.buttons}>
            <Link to="/apartments" className="btn btn--accent">ბინების ნახვა</Link>
            <a href="#contact" className="btn btn--outline-light">ფასის მიღება</a>
          </div>
        </div>

        <div className={styles.cards}>
          {upcoming.map((slide) => (
            <button
              key={slide.id}
              className={styles.card}
              onClick={() => setActive(heroSlides.indexOf(slide))}
            >
              <ImageBox src={srcFor(slide)} alt={slide.cardLabel} gradient={slide.gradient} className={styles.cardImage} />
              <span className={styles.cardLabel}>{slide.cardLabel}</span>
            </button>
          ))}
        </div>

        <div className={styles.controls}>
          <div className={styles.dots}>
            {heroSlides.map((slide, index) => (
              <span key={slide.id} className={`${styles.dot} ${index === active ? styles.dotActive : ''}`} />
            ))}
          </div>
          <button className={styles.arrow} onClick={prev} aria-label="წინა სლაიდი">
            <Arrow direction="left" />
          </button>
          <button className={styles.arrow} onClick={next} aria-label="შემდეგი სლაიდი">
            <Arrow direction="right" />
          </button>
        </div>
      </div>
    </section>
  );
}

export default Hero;
