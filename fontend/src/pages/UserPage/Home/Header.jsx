import styles from './Header.module.css';
import Profile_U from '../auth/Profile_U.jsx';

const Header = () => {
    
  return (
    <div className={styles.header}>

      {/* Logo + Menu */}
      <div className={styles.leftSection}>
        <a href="/" className={styles.logo}>
          HealthCare
        </a>
        <nav className={styles.nav}>
          <a href="/" className={styles.navLink}>
            Trang chủ
          </a>
          <a href="/dat-lich-hen" className={styles.navLink}>
            Đặt lịch hẹn
          </a>
          <a href="/chuyen-khoa" className={styles.navLink}>
            Chuyên Khoa
          </a>
          <a href="/chuyen-gia" className={styles.navLink}>
            Chuyên Gia
          </a>
          <a href="/dich-vu" className={styles.navLink}>
            Dịch vụ
          </a>
          <a href="/Profile_u" className={styles.navLink}>
    Thông tin cá nhân
  </a>
        </nav>
      </div>

      {/* ✅ Phần bên phải: Login hoặc Hotline */}
      <div className={styles.rightSection}>
        <a href="User/Login" className={styles.navLink}>
        <button className={styles.loginButton}>
          Đăng nhập
        </button>
        </a>
      </div>

    </div>
  );
};

export default Header;
