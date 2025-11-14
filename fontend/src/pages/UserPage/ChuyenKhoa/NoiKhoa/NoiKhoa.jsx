import Header from '../../Home/Header';
import Footer from '../../Home/Footer';
import styles from './NoiKhoa.module.css';

const NoiKhoa = () => {
  return (
    <div className={styles.wrapper}>
      <Header />

      {/* Nội dung chính */}
      <div className={styles.mainContent}>
        {/* Banner */}
        <section className={styles.bannerSection}>
          <h2 className={styles.bannerTitle}>Chuyên Khoa Nội</h2>
          <p className={styles.bannerSubtitle}>
            Chăm sóc và điều trị toàn diện các bệnh lý nội khoa
          </p>
        </section>

        {/* Giới thiệu */}
        <section className={styles.introSection}>
          <h3 className={styles.sectionTitle}>Giới thiệu chuyên khoa</h3>
          <p className={styles.introText}>
            Chuyên khoa Nội tập trung khám, chẩn đoán và điều trị các bệnh lý về tim mạch, hô hấp,
            tiêu hóa, nội tiết, thận – tiết niệu, cơ xương khớp và các bệnh lý mãn tính khác. 
            Với đội ngũ bác sĩ có chuyên môn cao cùng thiết bị y tế hiện đại, 
            chúng tôi cam kết mang lại dịch vụ y tế chất lượng và an toàn nhất cho bệnh nhân.
          </p>
        </section>

        {/* Đội ngũ bác sĩ */}
        <section className={styles.doctorSection}>
          <h3 className={styles.sectionTitle}>Đội ngũ bác sĩ chuyên khoa Nội</h3>
          <div className={styles.doctorGrid}>
            {[
              {icon: "👨‍⚕️", name: "BS. Nguyễn Văn A", specialty: "Nội khoa", desc: "10 năm kinh nghiệm" }
            ].map((doctor, i) => (
              <div key={i} className={styles.doctorCard}>
                <div className={styles.doctorIcon}>👨‍⚕️</div>
                <h4 className={styles.doctorName}>{doctor.name}</h4>
                <p className={styles.doctorTitle}>{doctor.title}</p>
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

export default NoiKhoa;
