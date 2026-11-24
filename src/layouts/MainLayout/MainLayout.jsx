import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import ScrollManager from '../../components/ScrollManager/ScrollManager';
import styles from './MainLayout.module.css';

// Header და Footer ყველა გვერდზე ერთია; შუაში იცვლება გვერდი (children)
function MainLayout({ children }) {
  return (
    <div className={styles.layout}>
      <ScrollManager />
      <Header />
      <main className={styles.main}>{children}</main>
      <Footer />
    </div>
  );
}

export default MainLayout;
