import Header from '../../Home/Header';
import Footer from '../../Home/Footer';
import styles from './ChanDoanHinhAnh.module.css';

const ChanDoanHinhAnh = () => {
  return (
    <div className={styles.wrapper}>
      <Header />

      {/* Nội dung chính */}
      <div className={styles.mainContent}>
        {/* Banner */}
        <section className={styles.bannerSection}>
          <h2 className={styles.bannerTitle}>Chuyên Khoa Chẩn Đoán Hình Ảnh</h2>
          <p className={styles.bannerSubtitle}>
            Ứng dụng công nghệ hình ảnh tiên tiến trong phát hiện và chẩn đoán bệnh lý
          </p>
        </section>

        {/* Giới thiệu */}
        <section className={styles.introSection}>
          <h3 className={styles.sectionTitle}>Giới thiệu chuyên khoa</h3>
          <p className={styles.introText}>
            Chuyên khoa Chẩn đoán hình ảnh tại <b>Healthy System</b> cung cấp các dịch vụ chụp X-Quang, CT-Scan, MRI, siêu âm và nhiều kỹ thuật hình ảnh hiện đại khác. 
            <br /><br />
            Được trang bị hệ thống máy móc tiên tiến cùng đội ngũ bác sĩ chuyên môn cao, 
            chúng tôi đảm bảo mang đến hình ảnh rõ nét, chính xác, giúp hỗ trợ bác sĩ điều trị đưa ra quyết định nhanh chóng và hiệu quả nhất cho bệnh nhân.
          </p>
        </section>

        {/* Đội ngũ bác sĩ */}
        <section className={styles.doctorSection}>
          <h3 className={styles.sectionTitle}>Đội ngũ bác sĩ chuyên khoa Chẩn đoán hình ảnh</h3>
          <div className={styles.doctorGrid}>
            {[
              { icon: "👨‍⚕️", name: "BS. Lê Hoàng C", specialty: "Chẩn đoán hình ảnh", desc: "10 năm kinh nghiệm" }
            ].map((doctor, i) => (
              <div key={i} className={styles.doctorCard}>
                <div className={styles.doctorIcon}>{doctor.icon}</div>
                <h4 className={styles.doctorName}>{doctor.name}</h4>
                <p className={styles.doctorTitle}>{doctor.specialty}</p>
                <p className={styles.doctorDesc}>{doctor.desc}</p>
                <a href="/dat-lich-hen"><button className={styles.doctorButton}>Đặt lịch khám</button></a>
                              </div>
                            ))}
                          </div>
                        </section>
                
                        {/* Cam kết */}
                        <section className={styles.commitSection}>
                          <div className={styles.commitContainer}>
                            <h3 className={styles.commitTitle}>Cam kết của chúng tôi</h3>
                            <p className={styles.commitText}>
                              Chúng tôi luôn đặt sức khỏe và sự hài lòng của bệnh nhân lên hàng đầu. 
                              Với quy trình khám chữa bệnh chuyên nghiệp, nhanh chóng và chính xác, 
                              chuyên khoa cam kết mang đến sự chăm sóc tận tâm và hiệu quả.
                            </p>
                            <a href="/dat-lich-hen"><button className={styles.commitButton}>Liên hệ ngay</button></a>
                          </div>
                        </section>
      </div>

      <Footer />
    </div>
  );
};

export default ChanDoanHinhAnh;
