import Header from '../../Home/Header';
import Footer from '../../Home/Footer';
import styles from './TuVanDinhDuong.module.css';

const TuVanDinhDuong = () => {
  return (
    <div className={styles.wrapper}>
      <Header />

      {/* Nội dung chính */}
      <div className={styles.mainContent}>
        {/* Banner */}
        <section className={styles.bannerSection}>
          <h2 className={styles.bannerTitle}>Dịch vụ Tư vấn dinh dưỡng</h2>
          <p className={styles.bannerSubtitle}>
            Dinh dưỡng hợp lý – Nền tảng của sức khỏe bền vững
          </p>
        </section>

        {/* Giới thiệu */}
        <section className={styles.introSection}>
          <h3 className={styles.sectionTitle}>Giới thiệu dịch vụ</h3>
          <p className={styles.introText}>
            Dịch vụ <strong>Tư vấn dinh dưỡng</strong> giúp bạn hiểu rõ hơn về chế độ ăn uống phù hợp với thể trạng, 
            độ tuổi, tình trạng sức khỏe và mục tiêu cá nhân như giảm cân, tăng cơ, hoặc kiểm soát bệnh lý. 
            Với đội ngũ chuyên gia dinh dưỡng giàu kinh nghiệm, chúng tôi mang đến giải pháp ăn uống khoa học, 
            giúp bạn đạt được sức khỏe tối ưu và duy trì lối sống lành mạnh.
          </p>
        </section>

        {/* Dịch vụ nổi bật */}
        <section className={styles.serviceSection}>
          <h3 className={styles.sectionTitle}>Các dịch vụ tư vấn dinh dưỡng nổi bật</h3>
          <div className={styles.serviceGrid}>
            {[
              {icon: "🥗", name: "Tư vấn chế độ ăn lành mạnh", desc: "Hướng dẫn thực đơn cân đối, đủ nhóm dưỡng chất cần thiết."},
              {icon: "⚖️", name: "Tư vấn giảm cân khoa học", desc: "Giảm cân hiệu quả mà vẫn đảm bảo sức khỏe và năng lượng."},
              {icon: "💪", name: "Tư vấn tăng cơ – giữ dáng", desc: "Phù hợp với người tập luyện thể thao, cải thiện thể hình."},
              {icon: "🩸", name: "Dinh dưỡng cho người bệnh mãn tính", desc: "Điều chỉnh khẩu phần cho người tiểu đường, tim mạch, thận, gan..."},
              {icon: "🤰", name: "Dinh dưỡng cho mẹ bầu và trẻ nhỏ", desc: "Hỗ trợ phát triển toàn diện cho mẹ và bé."},
              {icon: "👴", name: "Dinh dưỡng cho người cao tuổi", desc: "Tăng cường sức đề kháng, duy trì thể trạng khỏe mạnh."}
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
          <h3 className={styles.sectionTitle}>Lợi ích khi sử dụng dịch vụ</h3>
          <ul className={styles.benefitList}>
            <li>🍎 Xây dựng chế độ ăn uống khoa học, phù hợp từng cá nhân.</li>
            <li>💬 Được tư vấn trực tiếp bởi chuyên gia dinh dưỡng uy tín.</li>
            <li>🏠 Có thể nhận tư vấn tại phòng khám hoặc qua hình thức trực tuyến.</li>
            <li>📈 Cải thiện sức khỏe tổng thể, hỗ trợ điều trị bệnh hiệu quả.</li>
            <li>🧠 Hình thành thói quen ăn uống lành mạnh, lâu dài.</li>
          </ul>
        </section>

        {/* Cam kết */}
        <section className={styles.commitSection}>
          <div className={styles.commitContainer}>
            <h3 className={styles.commitTitle}>Cam kết của chúng tôi</h3>
            <p className={styles.commitText}>
              Chúng tôi cam kết mang đến cho bạn những lời khuyên dinh dưỡng cá nhân hóa, 
              khoa học và dễ áp dụng. Mục tiêu của chúng tôi là giúp bạn đạt được sức khỏe 
              bền vững, vóc dáng cân đối và tinh thần tràn đầy năng lượng mỗi ngày.
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

export default TuVanDinhDuong;
