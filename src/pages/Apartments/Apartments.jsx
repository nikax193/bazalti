import { useMemo } from 'react';
import { allApartments } from '../../data/apartments';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';
import ApartmentFilters from '../../components/ApartmentFilters/ApartmentFilters';
import ApartmentCard from '../../components/ApartmentCard/ApartmentCard';
import ApartmentsTable from '../../components/ApartmentsTable/ApartmentsTable';
import Pagination from '../../components/Pagination/Pagination';
import { useFavorites } from '../../hooks/useFavorites';
import { useApartmentFilters, applyFilters, applySort } from './useApartmentFilters';
import styles from './Apartments.module.css';

const PER_PAGE = 9;
const views = [
  { value: 'visual', label: 'ვიზუალით' },
  { value: 'grid', label: 'ფილტრით' },
  { value: 'list', label: 'სიით' },
];

function Apartments() {
  const { filters, sort, view, page, setFilter, setSort, setView, setPage, reset, activeCount } =
    useApartmentFilters();
  const { favorites, toggleFavorite } = useFavorites();

  const results = useMemo(() => applySort(applyFilters(allApartments, filters), sort), [filters, sort]);

  const totalPages = Math.max(1, Math.ceil(results.length / PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = view === 'list' ? results : results.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

  const changePage = (p) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={styles.page}>
      <div className={styles.sheet}>
        <Breadcrumbs items={[{ label: 'მთავარი', to: '/' }, { label: 'ბინები' }]} />

        <div className={styles.head}>
          <div>
            <h1 className={styles.title}>ბინების ძებნა</h1>
            <p className={styles.count}>
              ნაპოვნია <strong>{results.length}</strong> ბინა {allApartments.length}-დან
            </p>
          </div>

          <div className={styles.views} role="tablist">
            {views.map((v) => (
              <button
                key={v.value}
                role="tab"
                aria-selected={view === v.value}
                className={`${styles.view} ${view === v.value ? styles.viewActive : ''}`}
                onClick={() => setView(v.value)}
              >
                {v.label}
              </button>
            ))}
          </div>
        </div>

        {view === 'visual' ? (
          <div className={styles.placeholder}>
            <h2>ვიზუალური შერჩევა</h2>
            <p>აქ იქნება კორპუსის ფასადი, სადაც სართულზე დაწკაპებით გამოჩნდება მისი ბინები. ეს ხედი შემდეგ ეტაპზე დაემატება.</p>
            <button className="btn btn--primary" onClick={() => setView('grid')}>ფილტრით ძებნა</button>
          </div>
        ) : (
          <>
            <ApartmentFilters
              filters={filters}
              onChange={setFilter}
              sort={sort}
              onSort={setSort}
              onReset={reset}
              activeCount={activeCount}
            />

            {results.length === 0 ? (
              <div className={styles.empty}>
                <p>ამ ფილტრებით ბინა ვერ მოიძებნა.</p>
                <button className="btn btn--outline-dark" onClick={reset}>ფილტრების გასუფთავება</button>
              </div>
            ) : view === 'list' ? (
              <ApartmentsTable apartments={pageItems} favorites={favorites} onToggleFavorite={toggleFavorite} />
            ) : (
              <>
                <div className={styles.grid}>
                  {pageItems.map((apt) => (
                    <ApartmentCard
                      key={apt.id}
                      apartment={apt}
                      isFavorite={favorites.includes(apt.id)}
                      onToggleFavorite={toggleFavorite}
                    />
                  ))}
                </div>
                <Pagination page={currentPage} totalPages={totalPages} onChange={changePage} />
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Apartments;
