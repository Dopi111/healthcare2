import Header from '../Home/Header';
import Footer from '../Home/Footer';
import styles from './HeThongXQuangKyThuatSo.module.css';

const HeThongXQuangKyThuatSo = () => {
  return (
    <div className={styles.wrapper}>
      <Header />

      <div className={styles.mainContent}>
        {/* Banner */}
        <section className={styles.bannerSection}>
          <h2 className={styles.bannerTitle}>Hệ Thống X-Quang Kỹ Thuật Số</h2>
          <p className={styles.bannerSubtitle}>
            Hình ảnh rõ nét – Chẩn đoán nhanh chóng – Giảm liều tia X tối ưu
          </p>
        </section>

        {/* Giới thiệu thiết bị */}
        <section className={styles.introSection}>
          <h3 className={styles.sectionTitle}>Giới thiệu thiết bị</h3>
          <p className={styles.introText}>
            Hệ thống X-Quang kỹ thuật số (Digital Radiography – DR) là công nghệ chẩn đoán hình ảnh hiện đại
            giúp thu nhận và xử lý hình ảnh X-Quang trực tiếp trên máy tính mà không cần phim. 
            Với khả năng tái tạo hình ảnh chi tiết và độ phân giải cao, thiết bị hỗ trợ bác sĩ trong việc
            phát hiện sớm các bệnh lý về xương, phổi, tim mạch và nhiều cơ quan khác.
          </p>
        </section>

        {/* Tính năng nổi bật */}
        <section className={styles.featureSection}>
          <h3 className={styles.sectionTitle}>Tính năng nổi bật</h3>
          <ul className={styles.featureList}>
            <li>⚡ Công nghệ kỹ thuật số hiện đại cho hình ảnh sắc nét, độ tương phản cao.</li>
            <li>📊 Thời gian chụp nhanh, kết quả hiển thị tức thì trên màn hình.</li>
            <li>🩻 Giảm liều tia X tối đa, đảm bảo an toàn cho bệnh nhân.</li>
            <li>💾 Lưu trữ, tra cứu và chia sẻ hình ảnh dễ dàng qua hệ thống PACS.</li>
          </ul>
        </section>

        {/* Lợi ích cho bệnh nhân */}
        <section className={styles.benefitSection}>
          <h3 className={styles.sectionTitle}>Lợi ích cho bệnh nhân</h3>
          <div className={styles.benefitGrid}>
            <div className={styles.benefitCard}>
              <h4 className={styles.benefitTitle}>Chẩn đoán nhanh chóng</h4>
              <p className={styles.benefitText}>
                Hình ảnh được xử lý và hiển thị ngay sau khi chụp, rút ngắn thời gian chờ đợi.
              </p>
            </div>
            <div className={styles.benefitCard}>
              <h4 className={styles.benefitTitle}>Độ chính xác cao</h4>
              <p className={styles.benefitText}>
                Hệ thống cho hình ảnh chi tiết giúp phát hiện sớm tổn thương, hỗ trợ điều trị hiệu quả.
              </p>
            </div>
            <div className={styles.benefitCard}>
              <h4 className={styles.benefitTitle}>An toàn tối đa</h4>
              <p className={styles.benefitText}>
                Công nghệ giảm liều tia X bảo vệ bệnh nhân, đặc biệt an toàn cho trẻ em và người cao tuổi.
              </p>
            </div>
          </div>
        </section>

        {/* Liên hệ */}
        <section className={styles.contactSection}>
          <div className={styles.contactContainer}>
            <h3 className={styles.contactTitle}>Đặt lịch chụp X-Quang</h3>
            <p className={styles.contactText}>
              Liên hệ ngay với chúng tôi để được tư vấn và đặt lịch chụp X-Quang kỹ thuật số nhanh chóng, chính xác và an toàn.
            </p>
            <a href="/dat-lich-hen"><button className={styles.contactButton}>Liên hệ ngay</button></a>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default HeThongXQuangKyThuatSo;
