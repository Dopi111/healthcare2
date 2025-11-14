import Header from '../../Home/Header';
import Footer from '../../Home/Footer';
import styles from './XetNghiemTaiNha.module.css';

const XetNghiemTaiNha = () => {
  return (
    <div className={styles.wrapper}>
      <Header />

      <div className={styles.mainContent}>
        {/* Banner */}
        <section className={styles.bannerSection}>
          <h2 className={styles.bannerTitle}>Dịch vụ Xét nghiệm tại nhà</h2>
          <p className={styles.bannerSubtitle}>
            Tiện lợi – An toàn – Chính xác ngay tại nhà của bạn
          </p>
        </section>

        {/* Giới thiệu */}
        <section className={styles.introSection}>
          <h3 className={styles.sectionTitle}>Giới thiệu dịch vụ</h3>
          <p className={styles.introText}>
            <strong>Dịch vụ Xét nghiệm tại nhà</strong> mang đến cho khách hàng trải nghiệm chăm sóc sức khỏe 
            tiện lợi và an toàn nhất. Chỉ cần một cuộc hẹn, đội ngũ chuyên viên y tế sẽ đến tận nơi lấy mẫu xét nghiệm 
            và gửi kết quả nhanh chóng qua hệ thống trực tuyến. Dịch vụ giúp tiết kiệm thời gian, tránh chờ đợi 
            và hạn chế tiếp xúc nơi đông người.
          </p>
        </section>

        {/* Các loại xét nghiệm */}
        <section className={styles.serviceSection}>
          <h3 className={styles.sectionTitle}>Các xét nghiệm phổ biến</h3>
          <div className={styles.serviceGrid}>
            {[
              { icon: "🩸", name: "Xét nghiệm máu tổng quát", desc: "Đánh giá tình trạng sức khỏe chung, phát hiện sớm các bất thường." },
              { icon: "🧫", name: "Xét nghiệm nước tiểu", desc: "Phát hiện bệnh lý về thận, đường tiết niệu, tiểu đường..." },
              { icon: "🧬", name: "Xét nghiệm sinh hóa", desc: "Đo các chỉ số về gan, thận, mỡ máu, đường huyết..." },
              { icon: "🧍", name: "Xét nghiệm nội tiết", desc: "Theo dõi hormone, hỗ trợ điều trị bệnh lý nội tiết." },
              { icon: "🧑‍🤝‍🧑", name: "Xét nghiệm bệnh truyền nhiễm", desc: "HIV, viêm gan, giang mai, cúm và các bệnh khác." },
              { icon: "🧒", name: "Xét nghiệm cho trẻ em & người cao tuổi", desc: "An toàn, nhẹ nhàng, phù hợp từng độ tuổi." }
            ].map((item, i) => (
              <div key={i} className={styles.serviceCard}>
                <div className={styles.serviceIcon}>{item.icon}</div>
                <h4 className={styles.serviceName}>{item.name}</h4>
                <p className={styles.serviceDesc}>{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Quy trình thực hiện */}
        <section className={styles.processSection}>
          <h3 className={styles.sectionTitle}>Quy trình thực hiện xét nghiệm tại nhà</h3>
          <ol className={styles.processList}>
            <li>📞 <strong>Đặt lịch hẹn:</strong> Gọi điện hoặc đăng ký trực tuyến để chọn thời gian phù hợp.</li>
            <li>🚗 <strong>Nhân viên đến tận nơi:</strong> Kỹ thuật viên y tế đến lấy mẫu xét nghiệm tại nhà.</li>
            <li>🧪 <strong>Phân tích mẫu:</strong> Mẫu được xử lý tại phòng xét nghiệm đạt chuẩn quốc tế.</li>
            <li>📲 <strong>Nhận kết quả:</strong> Kết quả được gửi qua SMS, email hoặc ứng dụng nhanh chóng, bảo mật.</li>
          </ol>
        </section>

        {/* Lợi ích */}
        <section className={styles.benefitSection}>
          <h3 className={styles.sectionTitle}>Lợi ích khi sử dụng dịch vụ</h3>
          <ul className={styles.benefitList}>
            <li>🕒 Tiết kiệm thời gian, không cần chờ đợi tại bệnh viện.</li>
            <li>🏠 Thực hiện tại nhà, an toàn và riêng tư tuyệt đối.</li>
            <li>🩺 Đội ngũ kỹ thuật viên chuyên nghiệp, tận tâm.</li>
            <li>📈 Kết quả nhanh chóng, chính xác và dễ theo dõi.</li>
            <li>💬 Có bác sĩ tư vấn sau khi nhận kết quả.</li>
          </ul>
        </section>

        {/* Cam kết */}
        <section className={styles.commitSection}>
          <div className={styles.commitContainer}>
            <h3 className={styles.commitTitle}>Cam kết chất lượng</h3>
            <p className={styles.commitText}>
              Chúng tôi cam kết mang đến dịch vụ xét nghiệm tại nhà nhanh chóng, chính xác, 
              an toàn và đảm bảo tiêu chuẩn y khoa cao nhất. Mọi mẫu xét nghiệm đều được 
              xử lý bởi hệ thống phòng lab hiện đại, kết quả được bảo mật tuyệt đối.
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

export default XetNghiemTaiNha;
