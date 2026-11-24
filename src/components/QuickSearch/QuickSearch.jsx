import { useMemo, useState } from 'react';
import { useNavigate } from '../../router/Router';
import { allApartments, apartmentTypes, floors, statusList } from '../../data/apartments';
import styles from './QuickSearch.module.css';

const initialFilters = { floor: '', bedrooms: '', minArea: '', maxArea: '', status: 'free' };

// ფილტრები გადადის /apartments გვერდზე URL-ის პარამეტრებით
function QuickSearch() {
  const [filters, setFilters] = useState(initialFilters);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const count = useMemo(
    () =>
      allApartments.filter((apt) => {
        if (filters.floor && apt.floor !== Number(filters.floor)) return false;
        if (filters.bedrooms !== '' && apt.bedrooms !== Number(filters.bedrooms)) return false;
        if (filters.minArea && apt.area < Number(filters.minArea)) return false;
        if (filters.maxArea && apt.area > Number(filters.maxArea)) return false;
        if (filters.status && apt.status !== filters.status) return false;
        return true;
      }).length,
    [filters]
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== '') params.set(key, value);
    });
    navigate(`/apartments?${params.toString()}`);
  };

  return (
    <section id="search" className={styles.section}>
      <div className="container">
        <form className={styles.panel} onSubmit={handleSubmit}>
          <div className={styles.heading}>
            <h2 className={styles.title}>იპოვე შენი ბინა</h2>
            <p className={styles.subtitle}>გაფილტრე სართულის, საძინებლების, ფართისა და სტატუსის მიხედვით</p>
          </div>

          <div className={styles.fields}>
            <label className={styles.field}>
              <span>სართული</span>
              <select name="floor" value={filters.floor} onChange={handleChange}>
                <option value="">ყველა</option>
                {floors.map((f) => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </label>

            <label className={styles.field}>
              <span>ტიპი</span>
              <select name="bedrooms" value={filters.bedrooms} onChange={handleChange}>
                <option value="">ყველა</option>
                {apartmentTypes.map((t) => (
                  <option key={t.bedrooms} value={t.bedrooms}>{t.label}</option>
                ))}
              </select>
            </label>

            <div className={styles.field}>
              <span>ფართი (მ²)</span>
              <div className={styles.range}>
                <input type="number" name="minArea" placeholder="დან" min="0" value={filters.minArea} onChange={handleChange} aria-label="მინიმალური ფართი" />
                <input type="number" name="maxArea" placeholder="მდე" min="0" value={filters.maxArea} onChange={handleChange} aria-label="მაქსიმალური ფართი" />
              </div>
            </div>

            <label className={styles.field}>
              <span>სტატუსი</span>
              <select name="status" value={filters.status} onChange={handleChange}>
                <option value="">ყველა</option>
                {statusList.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </label>

            <button type="submit" className={`btn btn--primary ${styles.submit}`}>
              ნახვა ({count})
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

export default QuickSearch;
