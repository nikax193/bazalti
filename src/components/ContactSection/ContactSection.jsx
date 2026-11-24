import { useState } from 'react';
import { company } from '../../data/homeData';
import styles from './ContactSection.module.css';

const icons = {
  phone: <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z" />,
  mail: <><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 6-10 7L2 6" /></>,
  pin: <><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z" /><circle cx="12" cy="10" r="3" /></>,
};

function Icon({ name }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      {icons[name]}
    </svg>
  );
}

const emptyForm = { name: '', phone: '', email: '', message: '' };

function validate(form) {
  const errors = {};
  if (!form.name.trim()) errors.name = 'შეიყვანე სახელი';
  if (!/^[0-9+\s-]{9,}$/.test(form.phone.trim())) errors.phone = 'შეიყვანე სწორი ნომერი';
  if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) errors.email = 'ელ. ფოსტა არასწორია';
  return errors;
}

function ContactSection() {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    // აქ მომავალში ჩაჯდება Firebase/Supabase ან email სერვისი
    console.log('ფორმა გაიგზავნა:', form);
    setSent(true);
    setForm(emptyForm);
  };

  const { lat, lng } = company.mapCoords;
  const mapSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.02}%2C${lat - 0.012}%2C${lng + 0.02}%2C${lat + 0.012}&layer=mapnik&marker=${lat}%2C${lng}`;

  const infoCards = [
    { icon: 'phone', label: 'ტელეფონი', value: company.phone, href: `tel:${company.phone}` },
    { icon: 'mail', label: 'ელ. ფოსტა', value: company.email, href: `mailto:${company.email}` },
    { icon: 'pin', label: 'მისამართი', value: company.address },
  ];

  return (
    <section id="contact" className={styles.section}>
      <div className={styles.card}>
        <h2 className={styles.heading}>დაგვიტოვეთ საკონტაქტო</h2>

        <div className={styles.info}>
          {infoCards.map((item) => {
            const Tag = item.href ? 'a' : 'div';
            return (
              <Tag key={item.label} href={item.href} className={styles.infoItem}>
                <span className={styles.icon}><Icon name={item.icon} /></span>
                <span>
                  <small>{item.label}</small>
                  <strong>{item.value}</strong>
                </span>
              </Tag>
            );
          })}
        </div>

        <div className={styles.body}>
          <form className={styles.form} onSubmit={handleSubmit} noValidate>
            <h3 className={styles.formTitle}>დეტალებისთვის დაგვიკავშირდით</h3>

            {sent && (
              <p className={styles.success}>
                გმადლობთ! გაყიდვების მენეჯერი მალე დაგიკავშირდებათ.
              </p>
            )}

            <label className={styles.field}>
              <span className="visually-hidden">სახელი / გვარი</span>
              <input name="name" placeholder="სახელი / გვარი" value={form.name} onChange={handleChange} className={errors.name ? styles.invalid : ''} />
              {errors.name && <em>{errors.name}</em>}
            </label>

            <div className={styles.row}>
              <label className={styles.field}>
                <span className="visually-hidden">ტელეფონი</span>
                <div className={`${styles.phone} ${errors.phone ? styles.invalid : ''}`}>
                  <span className={styles.prefix}>🇬🇪 +995</span>
                  <input name="phone" type="tel" placeholder="ტელეფონი" value={form.phone} onChange={handleChange} />
                </div>
                {errors.phone && <em>{errors.phone}</em>}
              </label>

              <label className={styles.field}>
                <span className="visually-hidden">ელ. ფოსტა</span>
                <input name="email" type="email" placeholder="ელ. ფოსტა" value={form.email} onChange={handleChange} className={errors.email ? styles.invalid : ''} />
                {errors.email && <em>{errors.email}</em>}
              </label>
            </div>

            <label className={styles.field}>
              <span className="visually-hidden">შეტყობინება</span>
              <textarea name="message" rows="4" placeholder="შეტყობინება (არასავალდებულო)" value={form.message} onChange={handleChange} />
            </label>

            <button type="submit" className={`btn btn--accent ${styles.submit}`}>გაგზავნა</button>
          </form>

          <div className={styles.map}>
            <iframe title="ოფისის მდებარეობა" src={mapSrc} loading="lazy" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default ContactSection;
