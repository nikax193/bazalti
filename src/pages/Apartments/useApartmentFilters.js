import { useMemo } from 'react';
import { useSearchParams } from '../../router/Router';

const LIST_KEYS = ['block', 'floor', 'bedrooms', 'status'];
const VALUE_KEYS = ['minArea', 'maxArea', 'minPrice', 'maxPrice'];

// ფილტრები ინახება URL-ში (?floor=3,4&bedrooms=1) —
// ბმულის გაზიარება ან განახლება ფილტრებს არ კარგავს.
export function useApartmentFilters() {
  const [params, setParams] = useSearchParams();

  const filters = useMemo(() => {
    const result = {};
    LIST_KEYS.forEach((key) => {
      result[key] = (params.get(key) ?? '').split(',').filter((v) => v !== '');
    });
    VALUE_KEYS.forEach((key) => {
      result[key] = params.get(key) ?? '';
    });
    return result;
  }, [params]);

  const sort = params.get('sort') ?? 'default';
  const view = params.get('view') ?? 'grid';
  const page = Number(params.get('page') ?? 1);

  const update = (changes, { resetPage = true } = {}) => {
    const next = new URLSearchParams(params);
    Object.entries(changes).forEach(([key, value]) => {
      const str = Array.isArray(value) ? value.join(',') : String(value ?? '');
      if (str === '' || (key === 'sort' && str === 'default') || (key === 'view' && str === 'grid')) {
        next.delete(key);
      } else {
        next.set(key, str);
      }
    });
    if (resetPage) next.delete('page');
    setParams(next, { replace: true });
  };

  const setFilter = (key, value) => update({ [key]: value });
  const setSort = (value) => update({ sort: value });
  const setView = (value) => update({ view: value }, { resetPage: false });
  const setPage = (value) => update({ page: value === 1 ? '' : value }, { resetPage: false });

  const reset = () => {
    const next = new URLSearchParams();
    if (view !== 'grid') next.set('view', view);
    setParams(next, { replace: true });
  };

  const activeCount =
    LIST_KEYS.reduce((n, key) => n + filters[key].length, 0) +
    VALUE_KEYS.filter((key) => filters[key] !== '').length;

  return { filters, sort, view, page, setFilter, setSort, setView, setPage, reset, activeCount };
}

export function applyFilters(list, f) {
  return list.filter((apt) => {
    if (f.block.length && !f.block.includes(apt.block)) return false;
    if (f.floor.length && !f.floor.includes(String(apt.floor))) return false;
    if (f.bedrooms.length && !f.bedrooms.includes(String(apt.bedrooms))) return false;
    if (f.status.length && !f.status.includes(apt.status)) return false;
    if (f.minArea && apt.area < Number(f.minArea)) return false;
    if (f.maxArea && apt.area > Number(f.maxArea)) return false;
    if (f.minPrice && apt.price < Number(f.minPrice)) return false;
    if (f.maxPrice && apt.price > Number(f.maxPrice)) return false;
    return true;
  });
}

export function applySort(list, sort) {
  const sorted = [...list];
  const [field, dir] = sort.split('-');
  if (!dir) return sorted;
  sorted.sort((a, b) => (dir === 'asc' ? a[field] - b[field] : b[field] - a[field]));
  return sorted;
}
