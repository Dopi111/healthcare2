import Header from '../../Home/Header';
import Footer from '../../Home/Footer';
import styles from './XetNghiemSinhHoa.module.css';

const XetNghiemSinhHoa = () => {
  return (
    <div className={styles.wrapper}>
      <Header />

      {/* Nội dung chính */}
      <div className={styles.mainContent}>
        {/* Banner */}
        <section className={styles.bannerSection}>
          <h2 className={styles.bannerTitle}>Chuyên Khoa Xét Nghiệm - Sinh Hóa</h2>
          <p className={styles.bannerSubtitle}>
            Đảm bảo kết quả chính xác, nhanh chóng và đáng tin cậy cho mọi xét nghiệm
          </p>
        </section>

        {/* Giới thiệu */}
        <section className={styles.introSection}>
          <h3 className={styles.sectionTitle}>Giới thiệu chuyên khoa</h3>
          <p className={styles.introText}>
            Chuyên khoa Xét nghiệm - Sinh hóa được trang bị hệ thống thiết bị hiện đại, 
            giúp thực hiện các xét nghiệm huyết học, sinh hóa, miễn dịch và vi sinh. 
            Đội ngũ kỹ thuật viên và bác sĩ có trình độ cao cam kết mang đến kết quả 
            nhanh chóng, chính xác, hỗ trợ hiệu quả cho quá trình chẩn đoán và điều trị.
          </p>
        </section>

        {/* Đội ngũ bác sĩ */}
        <section className={styles.doctorSection}>
          <h3 className={styles.sectionTitle}>Đội ngũ bác sĩ chuyên khoa Xét nghiệm - Sinh hóa</h3>
          <div className={styles.doctorGrid}>
            {[
              { icon: "👩‍⚕️", name: "BS. Phạm Thu D", title: "Bác sĩ chuyên khoa Xét nghiệm", desc: "10 năm kinh nghiệm trong lĩnh vực sinh hóa – huyết học" }
            ].map((doctor, i) => (
              <div key={i} className={styles.doctorCard}>
                <div className={styles.doctorIcon}>{doctor.icon}</div>
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

export default XetNghiemSinhHoa;
