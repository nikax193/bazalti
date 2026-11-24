import { aboutImage, aboutStats, company } from '../../data/homeData';
import ImageBox from '../ImageBox/ImageBox';
import SectionTitle from '../SectionTitle/SectionTitle';
import styles from './AboutPreview.module.css';

function AboutPreview() {
  return (
    <section id="about" className={styles.section}>
      <div className="container">
        <div className={styles.grid}>
          <div>
            <SectionTitle title="ჩვენ შესახებ" />
            <p className={styles.lead}>
              {company.fullName} — ქართული სამშენებლო კომპანია, რომელიც 12 წელზე მეტია ქმნის
              კომფორტულ და ხარისხიან საცხოვრებელ სივრცეებს.
            </p>
            <p className={styles.text}>
              ვაშენებთ მხოლოდ სერტიფიცირებული მასალებით, ვიცავთ ჩაბარების ვადებს და ვთანამშრომლობთ
              წამყვან ბანკებთან, რათა ბინის შეძენა მარტივი და გამჭვირვალე იყოს.
            </p>
            <a href="#contact" className="btn btn--outline-dark">გაიგე მეტი</a>
          </div>

          <div className={styles.side}>
            <ImageBox
              src={aboutImage.image}
              alt={aboutImage.alt}
              gradient={aboutImage.gradient}
              className={styles.image}
            />
            <ul className={styles.stats}>
              {aboutStats.map((stat) => (
                <li key={stat.label} className={styles.stat}>
                  <span className={styles.value}>{stat.value}</span>
                  <span className={styles.label}>{stat.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AboutPreview;
