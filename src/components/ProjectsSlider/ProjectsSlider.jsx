import { useRef, useState } from 'react';
import { projects } from '../../data/homeData';
import ImageBox from '../ImageBox/ImageBox';
import SectionTitle from '../SectionTitle/SectionTitle';
import styles from './ProjectsSlider.module.css';

const tabs = [
  { value: 'ongoing', label: 'მიმდინარე' },
  { value: 'completed', label: 'დასრულებული' },
];

function ProjectsSlider() {
  const [activeTab, setActiveTab] = useState('ongoing');
  const trackRef = useRef(null);

  const visible = projects.filter((p) => p.status === activeTab);

  const scroll = (direction) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.firstElementChild;
    const step = card ? card.offsetWidth + 16 : 400;
    track.scrollBy({ left: direction * step, behavior: 'smooth' });
  };

  const changeTab = (value) => {
    setActiveTab(value);
    trackRef.current?.scrollTo({ left: 0 });
  };

  const controls = (
    <>
      <div className={styles.tabs}>
        {tabs.map((tab) => (
          <button
            key={tab.value}
            className={`${styles.tab} ${activeTab === tab.value ? styles.tabActive : ''}`}
            onClick={() => changeTab(tab.value)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <button className={styles.arrow} onClick={() => scroll(-1)} aria-label="წინა">←</button>
      <button className={styles.arrow} onClick={() => scroll(1)} aria-label="შემდეგი">→</button>
    </>
  );

  return (
    <section id="projects" className={styles.section}>
      <div className={styles.inner}>
        <SectionTitle title="პროექტები" light action={controls} />

        <div className={styles.track} ref={trackRef}>
          {visible.map((project) => (
            <article key={project.id} className={styles.card}>
              <ImageBox src={project.image} alt={project.title} gradient={project.gradient} className={styles.image}>
                <div className={styles.shade} />
                <div className={styles.info}>
                  <span className={styles.deadline}>{project.deadline}</span>
                  <h3 className={styles.title}>{project.title}</h3>
                  <p className={styles.location}>{project.location}</p>
                </div>
              </ImageBox>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ProjectsSlider;
