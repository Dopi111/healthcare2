import Header from '../Home/Header';
import Footer from '../Home/Footer';
import styles from './ChuyenGia.module.css';

const ChuyenGia = () => {
  return (
    <div className={styles.wrapper}>
      <Header />
      
      {/* Content chính của trang Chuyên Gia */}
      <div className={styles.mainContent}>
        {/* Banner */}
        <section className={styles.bannerSection}>
          <h2 className={styles.bannerTitle}>Đội Ngũ Chuyên Gia</h2>
          <p className={styles.bannerSubtitle}>Bác sĩ chuyên môn cao, tận tâm với nghề nghiệp</p>
        </section>

        {/* Danh sách chuyên gia */}
        <section className={styles.doctorsSection}>
          <h3 className={styles.sectionTitle}>Đội ngũ bác sĩ của chúng tôi</h3>
          <div className={styles.doctorsGrid}>
            {[
              { 
                name: "BS. Nguyễn Văn An", 
                specialty: "Nội khoa - Tim Mạch", 
                exp: "15 năm kinh nghiệm",
                education: "Tiến sĩ Y khoa - ĐH Y Hà Nội",
                image: "👨‍⚕️"
              },
              { 
                name: "BS. Trần Thị Bích", 
                specialty: "Tai Mũi Họng", 
                exp: "12 năm kinh nghiệm",
                education: "Thạc sĩ Y khoa - ĐH Y Dược TP.HCM",
                image: "👩‍⚕️"
              },
              { 
                name: "BS. Lê Hoàng Cường", 
                specialty: "Chẩn đoán hình ảnh", 
                exp: "18 năm kinh nghiệm",
                education: "Tiến sĩ Y khoa - ĐH Y Tokyo",
                image: "👨‍⚕️"
              },
              { 
                name: "BS. Phạm Thu Dung", 
                specialty: "Xét nghiệm - Sinh hóa", 
                exp: "10 năm kinh nghiệm",
                education: "Thạc sĩ Y khoa - ĐH Y Hà Nội",
                image: "👩‍⚕️"
              },
              { 
                name: "BS. Võ Minh Khoa", 
                specialty: "Nhi Khoa", 
                exp: "14 năm kinh nghiệm",
                education: "Bác sĩ chuyên khoa II - ĐH Y Huế",
                image: "👨‍⚕️"
              },
              { 
                name: "BS. Đặng Hải Linh", 
                specialty: "Da Liễu", 
                exp: "11 năm kinh nghiệm",
                education: "Thạc sĩ Y khoa - ĐH Y Dược TP.HCM",
                image: "👩‍⚕️"
              },
              { 
                name: "BS. Ngô Thanh Minh", 
                specialty: "Thần Kinh", 
                exp: "16 năm kinh nghiệm",
                education: "Tiến sĩ Y khoa - ĐH Y Paris",
                image: "👨‍⚕️"
              },
              { 
                name: "BS. Hoàng Thị Nga", 
                specialty: "Phục hồi chức năng", 
                exp: "9 năm kinh nghiệm",
                education: "Thạc sĩ Y khoa - ĐH Y Hà Nội",
                image: "👩‍⚕️"
              }
            ].map((doctor, index) => (
              <div key={index} className={styles.doctorCard}>
                <div className={styles.doctorImage}>{doctor.image}</div>
                <h4 className={styles.doctorName}>{doctor.name}</h4>
                <p className={styles.doctorSpecialty}>🔹 {doctor.specialty}</p>
                <p className={styles.doctorEducation}>🎓 {doctor.education}</p>
                <p className={styles.doctorExp}>⏱️ {doctor.exp}</p>
                <button className={styles.doctorButton}>
                  Đặt lịch khám
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Tại sao chọn chúng tôi */}
        <section className={styles.whySection}>
          <h3 className={styles.sectionTitleCenter}>Tại sao chọn chúng tôi?</h3>
          <div className={styles.whyGrid}>
            {[
              {
                title: "Đội ngũ chuyên môn cao",
                desc: "Bác sĩ được đào tạo bài bản tại các trường đại học y khoa hàng đầu",
                icon: "🎓"
              },
              {
                title: "Kinh nghiệm dày dặn",
                desc: "Trung bình 10+ năm kinh nghiệm thực tế trong lĩnh vực chuyên môn",
                icon: "⭐"
              },
              {
                title: "Tận tâm với bệnh nhân",
                desc: "Luôn đặt sức khỏe và sự hài lòng của bệnh nhân lên hàng đầu",
                icon: "❤️"
              }
            ].map((item, index) => (
              <div key={index} className={styles.whyCard}>
                <div className={styles.whyIcon}>{item.icon}</div>
                <h4 className={styles.whyTitle}>{item.title}</h4>
                <p className={styles.whyDesc}>{item.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default ChuyenGia;

