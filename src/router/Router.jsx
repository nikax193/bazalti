import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

// პატარა როუტერი სუფთა React-ით — გარე ბიბლიოთეკის გარეშე.
// მუშაობს ბრაუზერის History API-ით: pushState ცვლის მისამართს გვერდის გადატვირთვის გარეშე,
// popstate კი იჭერს Back/Forward ღილაკებს.

const RouterContext = createContext(null);

// საიტი შეიძლება ქვესაქაღალდეში იყოს გაშვებული (package.json → "homepage": "https://site.ge/bazalti").
// ასეთ დროს BASE = "/bazalti": მისამართს ვაშორებთ კითხვისას და ვუმატებთ ნავიგაციისას.
const BASE = (() => {
  const url = process.env.PUBLIC_URL || '';
  if (!url || url.startsWith('.')) return '';
  try {
    return new URL(url, window.location.origin).pathname.replace(/\/$/, '');
  } catch {
    return '';
  }
})();

export function withBase(to) {
  return BASE && typeof to === 'string' && to.startsWith('/') ? `${BASE}${to}` : to;
}

function readLocation() {
  const { search, hash } = window.location;
  let { pathname } = window.location;
  if (BASE && (pathname === BASE || pathname.startsWith(`${BASE}/`))) {
    pathname = pathname.slice(BASE.length) || '/';
  }
  // ზოგი ჰოსტინგი მისამართს /index.html-ით ხსნის
  if (pathname.endsWith('/index.html')) pathname = pathname.slice(0, -'index.html'.length);
  return { pathname, search, hash };
}

export function Router({ children }) {
  const [location, setLocation] = useState(readLocation);

  useEffect(() => {
    const onPopState = () => setLocation(readLocation());
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const navigate = useCallback((to, { replace = false } = {}) => {
    const url = new URL(withBase(to), window.location.href);
    const path = url.pathname + url.search + url.hash;
    if (replace) {
      window.history.replaceState(null, '', path);
    } else {
      window.history.pushState(null, '', path);
    }
    setLocation(readLocation());
  }, []);

  const value = useMemo(() => ({ location, navigate }), [location, navigate]);

  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>;
}

export function useLocation() {
  return useContext(RouterContext).location;
}

export function useNavigate() {
  return useContext(RouterContext).navigate;
}

// URL-ის ?პარამეტრების წაკითხვა და შეცვლა
export function useSearchParams() {
  const { location, navigate } = useContext(RouterContext);
  const params = useMemo(() => new URLSearchParams(location.search), [location.search]);

  const setParams = (next, options) => {
    const query = next.toString();
    navigate(`${location.pathname}${query ? `?${query}` : ''}`, options);
  };

  return [params, setParams];
}

// <a>, რომელიც გვერდს არ გადატვირთავს
export function Link({ to, onClick, children, ...rest }) {
  const navigate = useNavigate();

  const handleClick = (e) => {
    onClick?.(e);
    // Ctrl/Cmd+click — ახალ ტაბში გახსნა ჩვეულებრივად იმუშაოს
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    navigate(to);
  };

  return (
    <a href={withBase(to)} onClick={handleClick} {...rest}>
      {children}
    </a>
  );
}

// Link, რომელიც იცის, აქტიურია თუ არა (მენიუში მონიშვნისთვის)
export function NavLink({ to, end = false, className, ...rest }) {
  const { pathname } = useLocation();
  const isActive = end ? pathname === to : pathname.startsWith(to);
  const classes = typeof className === 'function' ? className({ isActive }) : className;

  return <Link to={to} className={classes} aria-current={isActive ? 'page' : undefined} {...rest} />;
}
