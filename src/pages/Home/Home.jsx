import { lazy, useEffect } from 'react';
import Hero from '../../components/Hero/Hero';
import QuickSearch from '../../components/QuickSearch/QuickSearch';
import AboutPreview from '../../components/AboutPreview/AboutPreview';
import LazySection from '../../components/LazySection/LazySection';
import styles from './Home.module.css';

// პირველი ეკრანის ქვემოთ მყოფი სექციები — ცალკე chunk-ებად, lazy load-ით
const loaders = {
  offers: () => import('../../components/SpecialOffers/SpecialOffers'),
  projects: () => import('../../components/ProjectsSlider/ProjectsSlider'),
  gallery: () => import('../../components/Gallery/Gallery'),
  contact: () => import('../../components/ContactSection/ContactSection'),
};

const SpecialOffers = lazy(loaders.offers);
const ProjectsSlider = lazy(loaders.projects);
const Gallery = lazy(loaders.gallery);
const ContactSection = lazy(loaders.contact);

// როცა ბრაუზერი თავისუფალია, კოდს წინასწარ ვტვირთავთ — სქროლისას სექცია მაშინვე ჩანს
function usePrefetchWhenIdle() {
  useEffect(() => {
    const prefetch = () => Object.values(loaders).forEach((load) => load().catch(() => {}));
    if ('requestIdleCallback' in window) {
      const id = window.requestIdleCallback(prefetch, { timeout: 4000 });
      return () => window.cancelIdleCallback(id);
    }
    const timer = setTimeout(prefetch, 2500);
    return () => clearTimeout(timer);
  }, []);
}

// Header და Footer ახლა MainLayout-შია
function Home() {
  usePrefetchWhenIdle();

  return (
    <div className={styles.page}>
      <Hero />
      <QuickSearch />
      <AboutPreview />
      <LazySection minHeight={480}>
        <SpecialOffers />
      </LazySection>
      <LazySection anchor="projects" minHeight={760}>
        <ProjectsSlider />
      </LazySection>
      <LazySection anchor="gallery" minHeight={780}>
        <Gallery />
      </LazySection>
      <LazySection anchor="contact" minHeight={720}>
        <ContactSection />
      </LazySection>
    </div>
  );
}

export default Home;
