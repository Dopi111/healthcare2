import Header from '../../Home/Header';
import Footer from '../../Home/Footer';
import styles from './TaiMuiHong.module.css';

const TaiMuiHong = () => {
  return (
    <div className={styles.wrapper}>
      <Header />

      {/* Nội dung chính */}
      <div className={styles.mainContent}>
        {/* Banner */}
        <section className={styles.bannerSection}>
          <h2 className={styles.bannerTitle}>Chuyên Khoa Tai Mũi Họng</h2>
          <p className={styles.bannerSubtitle}>
            Chẩn đoán & điều trị các bệnh lý về tai, mũi, họng với công nghệ hiện đại và đội ngũ bác sĩ giàu kinh nghiệm
          </p>
        </section>

        {/* Giới thiệu */}
        <section className={styles.introSection}>
          <h3 className={styles.sectionTitle}>Giới thiệu chuyên khoa</h3>
          <p className={styles.introText}>
            Chuyên khoa Tai Mũi Họng tại <b>Healthy System</b> chuyên khám, chẩn đoán và điều trị các bệnh lý như viêm tai giữa, viêm mũi xoang, viêm họng, ù tai, điếc tạm thời, và rối loạn thính giác. 
            <br /><br />
            Với đội ngũ bác sĩ có chuyên môn cao và trang thiết bị nội soi, đo thính lực hiện đại, 
            chúng tôi mang lại dịch vụ y tế chất lượng, an toàn và hiệu quả cho bệnh nhân.
          </p>
        </section>

        {/* Đội ngũ bác sĩ */}
        <section className={styles.doctorSection}>
          <h3 className={styles.sectionTitle}>Đội ngũ bác sĩ chuyên khoa Tai Mũi Họng</h3>
          <div className={styles.doctorGrid}>
            {[
              { icon: "👩‍⚕️", name: "BS. Trần Thị B", specialty: "Tai Mũi Họng", desc: "8 năm kinh nghiệm" }
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

export default TaiMuiHong;
