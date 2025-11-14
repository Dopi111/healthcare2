import Header from '../../Home/Header';
import Footer from '../../Home/Footer';
import styles from './KhamTongQuat.module.css';

const KhamTongQuat = () => {
  return (
    <div className={styles.wrapper}>
      <Header />

      {/* Nội dung chính */}
      <div className={styles.mainContent}>
        {/* Banner */}
        <section className={styles.bannerSection}>
          <h2 className={styles.bannerTitle}>Dịch vụ Khám tổng quát</h2>
          <p className={styles.bannerSubtitle}>
            Tầm soát sức khỏe toàn diện – Phát hiện sớm, phòng ngừa hiệu quả
          </p>
        </section>

        {/* Giới thiệu */}
        <section className={styles.introSection}>
          <h3 className={styles.sectionTitle}>Giới thiệu dịch vụ</h3>
          <p className={styles.introText}>
            <strong>Khám tổng quát</strong> là bước đầu tiên và quan trọng giúp đánh giá toàn diện tình trạng sức khỏe của bạn.
            Dịch vụ được thiết kế dành cho mọi đối tượng, giúp phát hiện sớm các bệnh lý tiềm ẩn, 
            từ đó đưa ra hướng điều trị và chăm sóc kịp thời. Với hệ thống trang thiết bị hiện đại và đội ngũ bác sĩ giàu kinh nghiệm,
            chúng tôi cam kết mang đến kết quả chính xác, nhanh chóng và đáng tin cậy.
          </p>
        </section>

        {/* Dịch vụ nổi bật */}
        <section className={styles.serviceSection}>
          <h3 className={styles.sectionTitle}>Các gói khám tổng quát nổi bật</h3>
          <div className={styles.serviceGrid}>
            {[
              {icon: "🧍", name: "Khám tổng quát cơ bản", desc: "Kiểm tra sức khỏe chung, xét nghiệm máu và nước tiểu cơ bản."},
              {icon: "💖", name: "Khám tim mạch tổng quát", desc: "Đánh giá chức năng tim mạch, điện tâm đồ, siêu âm tim."},
              {icon: "🧠", name: "Khám thần kinh tổng quát", desc: "Phát hiện sớm các rối loạn thần kinh, đau đầu, mất ngủ, stress."},
              {icon: "🩺", name: "Khám tổng quát định kỳ", desc: "Theo dõi sức khỏe hàng năm để phát hiện và phòng ngừa sớm bệnh lý."},
              {icon: "🧬", name: "Gói khám chuyên sâu", desc: "Tầm soát ung thư, bệnh gan, thận, nội tiết và chuyển hóa."},
              {icon: "👨‍👩‍👧", name: "Gói khám gia đình", desc: "Chăm sóc sức khỏe tổng thể cho cả gia đình, tiết kiệm và tiện lợi."}
            ].map((item, i) => (
              <div key={i} className={styles.serviceCard}>
                <div className={styles.serviceIcon}>{item.icon}</div>
                <h4 className={styles.serviceName}>{item.name}</h4>
                <p className={styles.serviceDesc}>{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Lợi ích */}
        <section className={styles.benefitSection}>
          <h3 className={styles.sectionTitle}>Lợi ích khi khám tổng quát</h3>
          <ul className={styles.benefitList}>
            <li>🩻 Phát hiện sớm bệnh lý tiềm ẩn, ngay cả khi chưa có triệu chứng.</li>
            <li>📊 Theo dõi sức khỏe định kỳ, kiểm soát chỉ số cơ thể hiệu quả.</li>
            <li>💬 Nhận tư vấn chi tiết từ bác sĩ chuyên khoa.</li>
            <li>🕒 Tiết kiệm thời gian, quy trình nhanh gọn và khoa học.</li>
            <li>🔒 Bảo mật tuyệt đối thông tin sức khỏe cá nhân.</li>
          </ul>
        </section>

        {/* Cam kết */}
        <section className={styles.commitSection}>
          <div className={styles.commitContainer}>
            <h3 className={styles.commitTitle}>Cam kết của chúng tôi</h3>
            <p className={styles.commitText}>
              Chúng tôi cam kết mang đến dịch vụ khám tổng quát chuyên nghiệp, 
              tận tâm và chính xác nhất – giúp bạn chủ động trong việc chăm sóc và bảo vệ sức khỏe của bản thân 
              cũng như những người thân yêu.
            </p>
            <a href="/dat-lich-hen">
              <button className={styles.commitButton}>Đặt lịch ngay</button>
            </a>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default KhamTongQuat;
