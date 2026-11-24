import FilterDropdown from '../FilterDropdown/FilterDropdown';
import { apartmentTypes, areaBounds, blocks, floors, statusList } from '../../data/apartments';
import styles from './ApartmentFilters.module.css';

export const sortOptions = [
  { value: 'default', label: 'სორტირება' },
  { value: 'area-asc', label: 'ფართი: ზრდადობით' },
  { value: 'area-desc', label: 'ფართი: კლებადობით' },
  { value: 'price-asc', label: 'ფასი: ზრდადობით' },
  { value: 'price-desc', label: 'ფასი: კლებადობით' },
  { value: 'floor-asc', label: 'სართული: ქვემოდან' },
];

// რამდენიმე მნიშვნელობის არჩევა (ჩიპები)
function OptionGroup({ options, selected, onChange, columns = 3 }) {
  const toggle = (value) => {
    onChange(selected.includes(value) ? selected.filter((v) => v !== value) : [...selected, value]);
  };

  return (
    <div className={styles.options} style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          className={`${styles.option} ${selected.includes(opt.value) ? styles.optionActive : ''}`}
          onClick={() => toggle(opt.value)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

function RangeInputs({ min, max, onMin, onMax, placeholderMin, placeholderMax, unit }) {
  return (
    <div className={styles.range}>
      <label>
        <span>დან</span>
        <input type="number" min="0" value={min} placeholder={placeholderMin} onChange={(e) => onMin(e.target.value)} />
      </label>
      <label>
        <span>მდე</span>
        <input type="number" min="0" value={max} placeholder={placeholderMax} onChange={(e) => onMax(e.target.value)} />
      </label>
      {unit && <em>{unit}</em>}
    </div>
  );
}

function FilterIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M20 18h0" />
      <circle cx="16" cy="6" r="2" />
      <circle cx="10" cy="12" r="2" />
      <circle cx="18" cy="18" r="2" />
    </svg>
  );
}

function ApartmentFilters({ filters, onChange, sort, onSort, onReset, activeCount }) {
  const areaCount = (filters.minArea ? 1 : 0) + (filters.maxArea ? 1 : 0);
  const moreCount = filters.status.length + (filters.minPrice ? 1 : 0) + (filters.maxPrice ? 1 : 0);

  return (
    <div className={styles.bar}>
      <div className={styles.filters}>
        <FilterDropdown label="ბლოკი" count={filters.block.length}>
          <OptionGroup
            options={blocks.map((b) => ({ value: b, label: `ბლოკი ${b}` }))}
            selected={filters.block}
            onChange={(v) => onChange('block', v)}
            columns={1}
          />
        </FilterDropdown>

        <FilterDropdown label="სართული" count={filters.floor.length}>
          <OptionGroup
            options={floors.map((f) => ({ value: String(f), label: f }))}
            selected={filters.floor}
            onChange={(v) => onChange('floor', v)}
          />
        </FilterDropdown>

        <FilterDropdown label="ფართი" count={areaCount}>
          <RangeInputs
            min={filters.minArea}
            max={filters.maxArea}
            onMin={(v) => onChange('minArea', v)}
            onMax={(v) => onChange('maxArea', v)}
            placeholderMin={areaBounds.min}
            placeholderMax={areaBounds.max}
            unit="მ²"
          />
        </FilterDropdown>

        <FilterDropdown label="საძინებლები" count={filters.bedrooms.length}>
          <OptionGroup
            options={apartmentTypes.map((t) => ({ value: String(t.bedrooms), label: t.label }))}
            selected={filters.bedrooms}
            onChange={(v) => onChange('bedrooms', v)}
            columns={1}
          />
        </FilterDropdown>

        <FilterDropdown label="მეტი ფილტრი" count={moreCount} icon={<FilterIcon />}>
          <div className={styles.more}>
            <p className={styles.groupTitle}>სტატუსი</p>
            <OptionGroup
              options={statusList}
              selected={filters.status}
              onChange={(v) => onChange('status', v)}
              columns={1}
            />
            <p className={styles.groupTitle}>ფასი ($)</p>
            <RangeInputs
              min={filters.minPrice}
              max={filters.maxPrice}
              onMin={(v) => onChange('minPrice', v)}
              onMax={(v) => onChange('maxPrice', v)}
              placeholderMin="50 000"
              placeholderMax="500 000"
            />
          </div>
        </FilterDropdown>

        {activeCount > 0 && (
          <button type="button" className={styles.reset} onClick={onReset}>
            გასუფთავება ×
          </button>
        )}
      </div>

      <label className={styles.sort}>
        <span className="visually-hidden">სორტირება</span>
        <select value={sort} onChange={(e) => onSort(e.target.value)}>
          {sortOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </label>
    </div>
  );
}

export default ApartmentFilters;
