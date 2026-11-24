import { useState } from 'react';
import styles from './InquiryForm.module.css';

// მოკლე ფორმა კონკრეტულ ბინაზე მოთხოვნისთვის
function InquiryForm({ apartmentId }) {
  const [form, setForm] = useState({ name: '', phone: '' });
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !/^[0-9+\s-]{9,}$/.test(form.phone.trim())) {
      setError('შეიყვანე სახელი და სწორი ტელეფონის ნომერი');
      return;
    }
    // აქ მომავალში ჩაჯდება Firebase/Supabase ან email სერვისი
    console.log('მოთხოვნა ბინაზე', apartmentId, form);
    setSent(true);
  };

  if (sent) {
    return <p className={styles.success}>გმადლობთ! ბინა №{apartmentId}-ზე მენეჯერი მალე დაგიკავშირდებათ.</p>;
  }

  return (
    <form className={`${styles.form} no-print`} onSubmit={handleSubmit} noValidate>
      <p className={styles.title}>ბინა №{apartmentId} — მოთხოვნა</p>
      <input name="name" placeholder="სახელი / გვარი" value={form.name} onChange={handleChange} aria-label="სახელი" />
      <input name="phone" type="tel" placeholder="ტელეფონი" value={form.phone} onChange={handleChange} aria-label="ტელეფონი" />
      {error && <em>{error}</em>}
      <button type="submit" className="btn btn--primary">გაგზავნა</button>
    </form>
  );
}

export default InquiryForm;
