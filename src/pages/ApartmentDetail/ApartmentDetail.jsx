import { lazy, Suspense, useEffect, useMemo, useState } from 'react';
import { Link } from '../../router/Router';
import { allApartments, typeLabel } from '../../data/apartments';
import { getRooms } from '../../data/planLayouts';
import { company, projects } from '../../data/homeData';
import { useFavorites } from '../../hooks/useFavorites';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';
import ApartmentInfo from '../../components/ApartmentInfo/ApartmentInfo';
import FloorPlan from '../../components/FloorPlan/FloorPlan';
import FloorSchema from '../../components/FloorSchema/FloorSchema';
import ApartmentCard from '../../components/ApartmentCard/ApartmentCard';
import styles from './ApartmentDetail.module.css';

// 3D ხედი ცალკე ფაილად იტვირთება — მხოლოდ მაშინ, როცა მომხმარებელი "3D"-ს აირჩევს
const load3D = () => import('../../components/Apartment3D/Apartment3D');
const Apartment3D = lazy(load3D);

const views = [
  { value: 'plan', label: '2D' },
  { value: '3d', label: '3D' },
  { value: 'floor', label: 'სართული' },
];

function DownloadIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M12 3v12M7 10l5 5 5-5M5 21h14" />
    </svg>
  );
}

function StarIcon({ filled }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1 6.2L12 17.3 6.5 20.2l1-6.2L3 9.6l6.2-.9z" />
    </svg>
  );
}

function ApartmentDetail({ id }) {
  const [view, setView] = useState('plan');
  const [moreOpen, setMoreOpen] = useState(false);
  const { favorites, toggleFavorite } = useFavorites();

  const apartment = allApartments.find((a) => a.id === id);

  // ტაბის სათაური — ამავე სახელით ინახება PDF ("ბაზალტი — ბინა №A-101")
  useEffect(() => {
    if (!apartment) return undefined;
    const previous = document.title;
    document.title = `${company.name} — ბინა №${apartment.id}`;
    return () => {
      document.title = previous;
    };
  }, [apartment]);

  // სიაში ჯერ საერთო ოთახი, მერე საძინებლები, სააბაზანოები, დერეფანი
  const rooms = useMemo(() => {
    if (!apartment) return [];
    const order = { living: 0, bed: 1, bath: 2, hall: 3 };
    return getRooms(apartment).sort((a, b) => order[a.type] - order[b.type]);
  }, [apartment]);

  const floorApartments = useMemo(
    () => (apartment ? allApartments.filter((a) => a.block === apartment.block && a.floor === apartment.floor) : []),
    [apartment]
  );

  // მსგავსი ბინები: იგივე ტიპი, ჯერ თავისუფლები, ფართით ყველაზე ახლოს
  const similar = useMemo(() => {
    if (!apartment) return [];
    return allApartments
      .filter((a) => a.id !== apartment.id && a.bedrooms === apartment.bedrooms && a.status !== 'sold')
      .sort((a, b) => Math.abs(a.area - apartment.area) - Math.abs(b.area - apartment.area))
      .slice(0, 3);
  }, [apartment]);

  if (!apartment) {
    return (
      <div className={styles.sheet}>
        <div className={styles.notFound}>
          <h1>ბინა №{id} ვერ მოიძებნა</h1>
          <Link to="/apartments" className="btn btn--primary">ყველა ბინა</Link>
        </div>
      </div>
    );
  }

  const isFavorite = favorites.includes(apartment.id);
  const project = projects.find((p) => p.id === apartment.projectId);

  const details = [
    { label: 'ტიპი', value: typeLabel[apartment.bedrooms] },
    { label: 'საცხოვრებელი ფართი', value: `${apartment.livingArea} მ²` },
    { label: 'ჭერის სიმაღლე', value: '3.2 მ' },
    { label: 'ფასი მ²-ზე', value: `$${Math.round(apartment.price / apartment.area).toLocaleString('en-US')}` },
    { label: 'მდგომარეობა', value: 'თეთრი კარკასი' },
    { label: 'ხედი', value: apartment.mirrored ? 'ეზოზე' : 'ქუჩაზე' },
    { label: 'პროექტი', value: project?.title ?? '—' },
    { label: 'ჩაბარება', value: project?.deadline ?? '2027 წლის IV კვარტალი' },
    { label: 'განვადება', value: 'შიდა, 0%-ით 24 თვემდე' },
  ];

  return (
    <div className={styles.sheet}>
      {/* ჩანს მხოლოდ PDF-ში / ბეჭდვისას */}
      <div className={styles.printHeader} aria-hidden="true">
        <div>
          <span className={styles.printBrand}>{company.name}</span>
          <span className={styles.printContacts}>
            {company.phone} · {company.email}
          </span>
        </div>
        <div className={styles.printApt}>
          <span>ბინა</span>
          <strong>№{apartment.id}</strong>
        </div>
      </div>

      <div className={styles.topbar}>
        <Breadcrumbs
          items={[
            { label: 'მთავარი', to: '/' },
            { label: 'ბინები', to: '/apartments' },
            ...(project ? [{ label: project.title, to: '/#projects' }] : []),
            { label: `ბინა №${apartment.id}` },
          ]}
        />

        <div className={`${styles.tools} no-print`}>
          <div className={styles.views} role="tablist">
            {views.map((v) => (
              <button
                key={v.value}
                role="tab"
                aria-selected={view === v.value}
                className={`${styles.view} ${view === v.value ? styles.viewActive : ''}`}
                onClick={() => setView(v.value)}
                onPointerEnter={v.value === '3d' ? () => load3D() : undefined}
              >
                {v.label}
              </button>
            ))}
          </div>
          {/* ბრაუზერის ბეჭდვის ფანჯარაში აირჩიე "Save as PDF" */}
          <button className={styles.pdf} onClick={() => window.print()}>
            <DownloadIcon /> PDF
          </button>
          <button
            className={`${styles.iconBtn} ${isFavorite ? styles.iconBtnActive : ''}`}
            onClick={() => toggleFavorite(apartment.id)}
            aria-label={isFavorite ? 'რჩეულებიდან წაშლა' : 'რჩეულებში დამატება'}
            aria-pressed={isFavorite}
          >
            <StarIcon filled={isFavorite} />
          </button>
        </div>
      </div>

      <h1 className={styles.title}>ბინა №{apartment.id}</h1>
      {project && (
        <p className={styles.project}>
          <span className={styles.projectLabel}>პროექტი:</span> {project.title} · {project.location}
        </p>
      )}

      <div className={styles.body}>
        <ApartmentInfo apartment={apartment} rooms={rooms} />

        <div className={styles.stage}>
          {view === '3d' && (
            <Suspense fallback={<div className={styles.loading3d}>3D მოდელი იტვირთება…</div>}>
              <Apartment3D
                key={apartment.id}
                bedrooms={apartment.bedrooms}
                livingArea={apartment.livingArea}
                balconyArea={apartment.balconyArea}
                mirrored={apartment.mirrored}
              />
            </Suspense>
          )}
          {view === 'plan' && (
            <div className={styles.plan} key={apartment.id}>
              <FloorPlan
                bedrooms={apartment.bedrooms}
                livingArea={apartment.livingArea}
                balconyArea={apartment.balconyArea}
                mirrored={apartment.mirrored}
                detailed
              />
            </div>
          )}
          {view === 'floor' && <FloorSchema apartment={apartment} floorApartments={floorApartments} />}
        </div>
      </div>

      <div className={styles.more}>
        <button className={`${styles.moreToggle} no-print`} onClick={() => setMoreOpen(!moreOpen)} aria-expanded={moreOpen}>
          გაიგე მეტი <span className={moreOpen ? styles.chevronUp : ''}>⌄</span>
        </button>
        {moreOpen && (
          <dl className={styles.details}>
            {details.map((d) => (
              <div key={d.label}>
                <dt>{d.label}</dt>
                <dd>{d.value}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>

      {similar.length > 0 && (
        <section className={`${styles.similar} no-print`}>
          <div className={styles.similarHead}>
            <h2>მსგავსი ბინები</h2>
            <Link to={`/apartments?bedrooms=${apartment.bedrooms}`} className="btn btn--outline-dark">
              ყველას ნახვა
            </Link>
          </div>
          <div className={styles.grid}>
            {similar.map((apt) => (
              <ApartmentCard
                key={apt.id}
                apartment={apt}
                isFavorite={favorites.includes(apt.id)}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default ApartmentDetail;
