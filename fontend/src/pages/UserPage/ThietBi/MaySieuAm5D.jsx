import Header from '../Home/Header';
import Footer from '../Home/Footer';
import styles from './MaySieuAm5D.module.css';

const MaySieuAm5D = () => {
  return (
    <div className={styles.wrapper}>
      <Header />

      {/* Nội dung chính */}
      <div className={styles.mainContent}>
        {/* Banner giới thiệu */}
        <section className={styles.bannerSection}>
          <h2 className={styles.bannerTitle}>Máy Siêu Âm 5D Doppler</h2>
          <p className={styles.bannerSubtitle}>
            Công nghệ chẩn đoán hình ảnh tiên tiến – độ chính xác cao, an toàn cho mẹ và bé
          </p>
        </section>

        {/* Giới thiệu thiết bị */}
        <section className={styles.introSection}>
          <h3 className={styles.sectionTitle}>Giới thiệu thiết bị</h3>
          <p className={styles.introText}>
            Máy siêu âm 5D Doppler là thiết bị hiện đại hàng đầu, cho phép quan sát chi tiết các cơ quan nội tạng và
            hệ tuần hoàn trong cơ thể. Với công nghệ 5D, hình ảnh được tái tạo sống động, hỗ trợ bác sĩ trong việc phát
            hiện sớm các bất thường, đặc biệt trong lĩnh vực sản khoa và tim mạch.
          </p>
        </section>

        {/* Tính năng nổi bật */}
        <section className={styles.featureSection}>
          <h3 className={styles.sectionTitle}>Tính năng nổi bật</h3>
          <ul className={styles.featureList}>
            <li>📡 Hình ảnh 5D độ phân giải cao, mô phỏng không gian thực.</li>
            <li>🩸 Chế độ Doppler màu giúp đánh giá lưu lượng máu chính xác.</li>
            <li>⚙️ Tích hợp phần mềm phân tích tự động các chỉ số sinh lý.</li>
            <li>💡 Màn hình cảm ứng thông minh, dễ thao tác và điều chỉnh.</li>
          </ul>
        </section>

        {/* Lợi ích cho bệnh nhân */}
        <section className={styles.benefitSection}>
          <h3 className={styles.sectionTitle}>Lợi ích cho bệnh nhân</h3>
          <div className={styles.benefitGrid}>
            <div className={styles.benefitCard}>
              <h4 className={styles.benefitTitle}>Kết quả chính xác</h4>
              <p className={styles.benefitText}>
                Hình ảnh rõ nét giúp bác sĩ chẩn đoán sớm và điều trị hiệu quả hơn.
              </p>
            </div>
            <div className={styles.benefitCard}>
              <h4 className={styles.benefitTitle}>An toàn & Không xâm lấn</h4>
              <p className={styles.benefitText}>
                Quy trình siêu âm nhẹ nhàng, không gây đau và không sử dụng tia X.
              </p>
            </div>
            <div className={styles.benefitCard}>
              <h4 className={styles.benefitTitle}>Trải nghiệm thoải mái</h4>
              <p className={styles.benefitText}>
                Thiết bị hiện đại với không gian khám sạch sẽ, tiện nghi và chuyên nghiệp.
              </p>
            </div>
          </div>
        </section>

        {/* Liên hệ */}
        <section className={styles.contactSection}>
          <div className={styles.contactContainer}>
            <h3 className={styles.contactTitle}>Đặt lịch sử dụng dịch vụ siêu âm 5D</h3>
            <p className={styles.contactText}>
              Hãy liên hệ với chúng tôi để được tư vấn chi tiết và đặt lịch khám nhanh chóng.
            </p>
            <a href="/dat-lich-hen"><button className={styles.contactButton}>Liên hệ ngay</button></a>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default MaySieuAm5D;
