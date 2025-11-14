import Header from '../../Home/Header';
import Footer from '../../Home/Footer';
import styles from './PhucHoiChucNang.module.css';

const PhucHoiChucNang = () => {
  return (
    <div className={styles.wrapper}>
      <Header />

      {/* Nội dung chính */}
      <div className={styles.mainContent}>
        {/* Banner */}
        <section className={styles.bannerSection}>
          <h2 className={styles.bannerTitle}>Dịch vụ Phục hồi chức năng</h2>
          <p className={styles.bannerSubtitle}>
            Khôi phục vận động, nâng cao chất lượng cuộc sống – Vì sức khỏe bền vững
          </p>
        </section>

        {/* Giới thiệu */}
        <section className={styles.introSection}>
          <h3 className={styles.sectionTitle}>Giới thiệu dịch vụ</h3>
          <p className={styles.introText}>
            Dịch vụ <strong>Phục hồi chức năng</strong> giúp người bệnh cải thiện khả năng vận động, 
            giảm đau và lấy lại sự tự tin trong sinh hoạt hàng ngày. 
            Chúng tôi cung cấp chương trình điều trị chuyên sâu dành cho bệnh nhân sau tai biến, 
            chấn thương, phẫu thuật hoặc mắc các bệnh lý cơ – xương – khớp. 
            Đội ngũ kỹ thuật viên và bác sĩ chuyên khoa sẽ đồng hành cùng bạn trong suốt quá trình phục hồi.
          </p>
        </section>

        {/* Dịch vụ nổi bật */}
        <section className={styles.serviceSection}>
          <h3 className={styles.sectionTitle}>Các liệu trình phục hồi nổi bật</h3>
          <div className={styles.serviceGrid}>
            {[
              {icon: "🦵", name: "Phục hồi sau tai biến", desc: "Hỗ trợ tập luyện vận động, phục hồi khả năng nói, đi lại."},
              {icon: "🦴", name: "Phục hồi sau gãy xương", desc: "Giúp phục hồi khớp, cơ và thăng bằng sau chấn thương."},
              {icon: "🏃", name: "Phục hồi vận động thể thao", desc: "Tăng cường sức mạnh cơ, giảm đau cơ – khớp sau chấn thương thể thao."},
              {icon: "🧘", name: "Vật lý trị liệu trị đau lưng – cổ – vai gáy", desc: "Ứng dụng sóng siêu âm, điện trị liệu, laser trị liệu."},
              {icon: "👣", name: "Phục hồi dáng đi", desc: "Hỗ trợ người bệnh lấy lại khả năng thăng bằng và dáng đi chuẩn."},
              {icon: "🪑", name: "Tập trị liệu tại nhà", desc: "Kỹ thuật viên đến tận nơi hướng dẫn và hỗ trợ tập luyện an toàn."}
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
            <li>💪 Tăng cường khả năng vận động và linh hoạt của cơ thể.</li>
            <li>🩻 Giảm đau, hạn chế biến chứng sau phẫu thuật hoặc tai biến.</li>
            <li>🏠 Có thể điều trị và tập luyện ngay tại nhà với chuyên viên hướng dẫn.</li>
            <li>👨‍⚕️ Được theo dõi trực tiếp bởi bác sĩ chuyên khoa phục hồi chức năng.</li>
            <li>❤️ Nâng cao sức khỏe tinh thần và chất lượng cuộc sống.</li>
          </ul>
        </section>

        {/* Cam kết */}
        <section className={styles.commitSection}>
          <div className={styles.commitContainer}>
            <h3 className={styles.commitTitle}>Cam kết của chúng tôi</h3>
            <p className={styles.commitText}>
              Chúng tôi cam kết mang đến chương trình phục hồi toàn diện, cá nhân hóa cho từng người bệnh, 
              giúp bạn nhanh chóng lấy lại khả năng vận động, tự tin hòa nhập cuộc sống và đạt được sức khỏe tối ưu.
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

export default PhucHoiChucNang;
