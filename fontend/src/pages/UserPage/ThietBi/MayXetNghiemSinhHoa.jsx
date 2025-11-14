import Header from '../Home/Header';
import Footer from '../Home/Footer';
import styles from './MayXetNghiemSinhHoa.module.css';

const MayXetNghiemSinhHoa = () => {
  return (
    <div className={styles.wrapper}>
      <Header />

      <div className={styles.mainContent}>
        {/* Banner */}
        <section className={styles.bannerSection}>
          <h2 className={styles.bannerTitle}>Máy Xét Nghiệm Sinh Hóa Tự Động</h2>
          <p className={styles.bannerSubtitle}>
            Hệ thống phân tích sinh hóa chính xác – nhanh chóng – tự động hóa hoàn toàn
          </p>
        </section>

        {/* Giới thiệu */}
        <section className={styles.introSection}>
          <h3 className={styles.sectionTitle}>Giới thiệu thiết bị</h3>
          <p className={styles.introText}>
            Máy xét nghiệm sinh hóa tự động là thiết bị tiên tiến trong lĩnh vực xét nghiệm y học,
            cho phép phân tích hàng loạt mẫu máu, nước tiểu và dịch sinh học khác chỉ trong thời gian ngắn.
            Với khả năng xử lý dữ liệu tự động, thiết bị này giúp giảm sai sót, nâng cao độ chính xác và tiết kiệm thời gian cho bác sĩ.
          </p>
        </section>

        {/* Tính năng nổi bật */}
        <section className={styles.featureSection}>
          <h3 className={styles.sectionTitle}>Tính năng nổi bật</h3>
          <ul className={styles.featureList}>
            <li>⚙️ Hoạt động hoàn toàn tự động, xử lý hàng trăm mẫu mỗi giờ.</li>
            <li>🧪 Kết quả xét nghiệm chính xác và ổn định nhờ công nghệ chuẩn hóa quốc tế.</li>
            <li>💾 Lưu trữ và truy xuất kết quả nhanh chóng qua hệ thống quản lý dữ liệu.</li>
            <li>🔒 Giảm thiểu rủi ro nhiễm chéo và sai sót do thao tác thủ công.</li>
          </ul>
        </section>

        {/* Lợi ích cho bệnh nhân */}
        <section className={styles.benefitSection}>
          <h3 className={styles.sectionTitle}>Lợi ích mang lại</h3>
          <div className={styles.benefitGrid}>
            <div className={styles.benefitCard}>
              <h4 className={styles.benefitTitle}>Tốc độ nhanh chóng</h4>
              <p className={styles.benefitText}>
                Quy trình xét nghiệm tự động giúp rút ngắn thời gian chờ đợi kết quả cho bệnh nhân.
              </p>
            </div>
            <div className={styles.benefitCard}>
              <h4 className={styles.benefitTitle}>Độ chính xác cao</h4>
              <p className={styles.benefitText}>
                Hệ thống kiểm soát chất lượng tự động giúp đảm bảo độ tin cậy tuyệt đối.
              </p>
            </div>
            <div className={styles.benefitCard}>
              <h4 className={styles.benefitTitle}>An toàn và tiết kiệm</h4>
              <p className={styles.benefitText}>
                Giảm thiểu sai sót và tiết kiệm chi phí cho cả bệnh viện và người bệnh.
              </p>
            </div>
          </div>
        </section>

        {/* Liên hệ */}
        <section className={styles.contactSection}>
          <div className={styles.contactContainer}>
            <h3 className={styles.contactTitle}>Liên hệ để được tư vấn xét nghiệm sinh hóa</h3>
            <p className={styles.contactText}>
              Đội ngũ kỹ thuật viên và bác sĩ của chúng tôi sẵn sàng hỗ trợ, đảm bảo quy trình nhanh chóng và an toàn nhất.
            </p>
            <a href="/dat-lich-hen"><button className={styles.contactButton}>Liên hệ ngay</button></a>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default MayXetNghiemSinhHoa;
