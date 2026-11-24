import { useLocation } from './router/Router';
import MainLayout from './layouts/MainLayout/MainLayout';
import Home from './pages/Home/Home';
import Apartments from './pages/Apartments/Apartments';
import ApartmentDetail from './pages/ApartmentDetail/ApartmentDetail';

// მისამართი → გვერდი
function getPage(pathname) {
  if (pathname === '/apartments') return <Apartments />;

  // /apartments/A-101 → ბინის დეტალური გვერდი
  const match = pathname.match(/^\/apartments\/([^/]+)\/?$/);
  if (match) {
    const id = decodeURIComponent(match[1]);
    return <ApartmentDetail key={id} id={id} />;
  }

  return <Home />;
}

function App() {
  const { pathname } = useLocation();
  return <MainLayout>{getPage(pathname)}</MainLayout>;
}

export default App;
