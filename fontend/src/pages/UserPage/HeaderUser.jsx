import styles from '../UserPage/Home/Header.module.css';
import Profile_U from './auth/Profile_U';

const HeaderUser = () => {
    const user = {
    name: 'Trần Văn Nam', //tôi cần lấy tên user từ Profile_U ở đây
    role: 'Bệnh nhân'
  };
  return (
    <div className={styles.header}>

      {/* Logo + Menu */}
      <div className={styles.leftSection}>
        <a href="/" className={styles.logo}>
          HealthCare
        </a>
        <nav className={styles.nav}>
          <a href="/User/HomePage" className={styles.navLink}>
            Trang chủ
          </a>
          <a href="/User/HomePage/dat-lich-hen" className={styles.navLink}>
            Đặt lịch hẹn
          </a>
          <a href="/User/HomePage/chuyen-khoa" className={styles.navLink}>
            Chuyên Khoa
          </a>
          <a href="/User/HomePage/chuyen-gia" className={styles.navLink}>
            Chuyên Gia
          </a>
          <a href="/User/HomePage/dich-vu" className={styles.navLink}>
            Dịch vụ
          </a>
          <a href="/User/HomePage/Profile_u" className={styles.navLink}>
    Thông tin cá nhân
  </a>
        </nav>
      </div>

      {/* ✅ Phần bên phải: Login hoặc Hotline */}
      <div className={styles.rightSection}>
        <a>
            user: {user.name} ({user.role})
        </a>
      </div>

    </div>
  );
};

export default HeaderUser;
