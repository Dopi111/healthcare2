import Header from '../Home/Header';
import Footer from '../Home/Footer';
import styles from './ChuyenKhoa.module.css';

const ChuyenKhoa = () => {
  return (
    <div className={styles.wrapper}>
      <Header />
      
      {/* Content chính của trang Chuyên Khoa */}
      <div className={styles.mainContent}>
        {/* Banner */}
        <section className={styles.bannerSection}>
          <h2 className={styles.bannerTitle}>Chuyên Khoa</h2>
          <p className={styles.bannerSubtitle}>Đội ngũ chuyên khoa giàu kinh nghiệm và chuyên môn cao</p>
        </section>

        {/* Danh sách chuyên khoa */}
        <section className={styles.specialtiesSection}>
          <h3 className={styles.sectionTitle}>Các chuyên khoa của chúng tôi</h3>
          <div className={styles.specialtiesGrid}>
            {[
              { 
                name: "Nội khoa", 
                desc: "Chuyên điều trị các bệnh lý nội khoa như tim mạch, tiêu hóa, hô hấp",
                icon: "🫀"
              },
              { 
                name: "Tai Mũi Họng", 
                desc: "Khám và điều trị các bệnh về tai, mũi, họng với thiết bị hiện đại",
                icon: "👂"
              },
              { 
                name: "Nhi Khoa", 
                desc: "Chăm sóc sức khỏe toàn diện cho trẻ em từ sơ sinh đến 16 tuổi",
                icon: "👶"
              },
              { 
                name: "Da Liễu", 
                desc: "Điều trị các bệnh về da, tóc, móng với công nghệ tiên tiến",
                icon: "🧴"
              },
              { 
                name: "Tim Mạch", 
                desc: "Chuyên sâu về các bệnh lý tim mạch và mạch máu",
                icon: "❤️"
              },
              { 
                name: "Thần Kinh", 
                desc: "Chẩn đoán và điều trị các bệnh lý về hệ thần kinh",
                icon: "🧠"
              },
              { 
                name: "Xét nghiệm - Sinh hóa", 
                desc: "Phòng xét nghiệm hiện đại, kết quả nhanh chóng và chính xác",
                icon: "🔬"
              },
              { 
                name: "Chẩn đoán hình ảnh", 
                desc: "Trang thiết bị chẩn đoán hình ảnh tiên tiến: X-quang, siêu âm, CT",
                icon: "📷"
              },
              { 
                name: "Phục hồi chức năng", 
                desc: "Hỗ trợ phục hồi chức năng sau chấn thương và bệnh lý",
                icon: "🏥"
              }
            ].map((specialty, index) => (
              <div key={index} className={styles.specialtyCard}>
                <div className={styles.specialtyIcon}>{specialty.icon}</div>
                <h4 className={styles.specialtyTitle}>{specialty.name}</h4>
                <p className={styles.specialtyDesc}>{specialty.desc}</p>
                <button className={styles.specialtyButton}>
                  Xem chi tiết →
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Thông tin thêm */}
        <section className={styles.commitmentSection}>
          <div className={styles.commitmentContainer}>
            <h3 className={styles.commitmentTitle}>Cam kết chất lượng</h3>
            <p className={styles.commitmentText}>
              Với đội ngũ bác sĩ giàu kinh nghiệm, trang thiết bị hiện đại và quy trình khám chữa bệnh chuyên nghiệp, 
              chúng tôi cam kết mang đến dịch vụ y tế chất lượng cao nhất cho bệnh nhân.
            </p>
            <button className={styles.commitmentButton}>
              Đặt lịch khám ngay
            </button>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default ChuyenKhoa;

