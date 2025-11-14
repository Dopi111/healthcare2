import Header from '../Home/Header';
import Footer from '../Home/Footer';
import styles from './MayNoiSoiTaiMuiHong.module.css';

const MayNoiSoiTaiMuiHong = () => {
  return (
    <div className={styles.wrapper}>
      <Header />

      <div className={styles.mainContent}>
        {/* Banner */}
        <section className={styles.bannerSection}>
          <h2 className={styles.bannerTitle}>Máy Nội Soi Tai Mũi Họng</h2>
          <p className={styles.bannerSubtitle}>
            Hình ảnh sắc nét – chẩn đoán chính xác – hỗ trợ điều trị hiệu quả
          </p>
        </section>

        {/* Giới thiệu */}
        <section className={styles.introSection}>
          <h3 className={styles.sectionTitle}>Giới thiệu thiết bị</h3>
          <p className={styles.introText}>
            Máy nội soi Tai Mũi Họng là thiết bị quan trọng trong chẩn đoán và điều trị các bệnh lý vùng tai, mũi, họng.
            Thiết bị cho phép quan sát hình ảnh chi tiết niêm mạc và cấu trúc bên trong, giúp bác sĩ phát hiện sớm các
            tổn thương, polyp, viêm xoang hoặc khối u nhỏ. Công nghệ hình ảnh độ phân giải cao giúp quá trình thăm khám
            trở nên nhẹ nhàng, chính xác và an toàn cho người bệnh.
          </p>
        </section>

        {/* Tính năng nổi bật */}
        <section className={styles.featureSection}>
          <h3 className={styles.sectionTitle}>Tính năng nổi bật</h3>
          <ul className={styles.featureList}>
            <li>📸 Hình ảnh sắc nét độ phân giải Full HD, hỗ trợ quan sát chi tiết nhất.</li>
            <li>🔦 Đèn LED lạnh siêu sáng, an toàn và không gây bỏng niêm mạc.</li>
            <li>🎥 Có thể ghi hình, chụp ảnh, lưu trữ hồ sơ bệnh nhân điện tử.</li>
            <li>🩺 Dễ dàng thao tác, giảm khó chịu cho bệnh nhân trong quá trình khám.</li>
          </ul>
        </section>

        {/* Lợi ích cho bệnh nhân */}
        <section className={styles.benefitSection}>
          <h3 className={styles.sectionTitle}>Lợi ích cho bệnh nhân</h3>
          <div className={styles.benefitGrid}>
            <div className={styles.benefitCard}>
              <h4 className={styles.benefitTitle}>Chẩn đoán chính xác</h4>
              <p className={styles.benefitText}>
                Cung cấp hình ảnh chi tiết giúp phát hiện bệnh sớm và điều trị kịp thời.
              </p>
            </div>
            <div className={styles.benefitCard}>
              <h4 className={styles.benefitTitle}>Không xâm lấn</h4>
              <p className={styles.benefitText}>
                Quá trình nội soi nhẹ nhàng, an toàn, không gây tổn thương niêm mạc.
              </p>
            </div>
            <div className={styles.benefitCard}>
              <h4 className={styles.benefitTitle}>Hỗ trợ điều trị hiệu quả</h4>
              <p className={styles.benefitText}>
                Giúp bác sĩ theo dõi trực quan tiến trình điều trị và kết quả phục hồi.
              </p>
            </div>
          </div>
        </section>

        {/* Liên hệ */}
        <section className={styles.contactSection}>
          <div className={styles.contactContainer}>
            <h3 className={styles.contactTitle}>Đặt lịch nội soi Tai Mũi Họng</h3>
            <p className={styles.contactText}>
              Liên hệ ngay để được tư vấn và đặt lịch khám với đội ngũ bác sĩ chuyên khoa Tai Mũi Họng giàu kinh nghiệm.
            </p>
            <a href="/dat-lich-hen"><button className={styles.contactButton}>Liên hệ ngay</button></a>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default MayNoiSoiTaiMuiHong;
