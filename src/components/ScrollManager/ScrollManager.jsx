import { useEffect } from 'react';
import { useLocation } from '../../router/Router';

const MAX_WAIT_MS = 3000;
const POLL_MS = 60;

// გვერდის შეცვლისას ასქროლავს თავში, ხოლო /#section ბმულზე — შესაბამის სექციამდე.
// lazy სექციებს ველოდებით (data-lazy-pending), რომ სქროლი სწორ ადგილას გაჩერდეს.
function ScrollManager() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0 });
      return undefined;
    }

    const id = decodeURIComponent(hash.slice(1));
    const started = Date.now();
    let timer;

    const tryScroll = () => {
      const target = document.getElementById(id);
      const pending = document.querySelector('[data-lazy-pending]');
      const timedOut = Date.now() - started > MAX_WAIT_MS;
      if (target && (!pending || timedOut)) {
        target.scrollIntoView({ behavior: 'smooth' });
        return;
      }
      if (!timedOut) timer = setTimeout(tryScroll, POLL_MS);
    };

    timer = setTimeout(tryScroll, 50);
    return () => clearTimeout(timer);
  }, [pathname, hash]);

  return null;
}

export default ScrollManager;
