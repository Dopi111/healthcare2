import { useState, useEffect } from 'react';
import styles from './Body.module.css';

// Import hình ảnh banner
import banner1 from '../../../assets/images/banner-1.jpg';
// Uncomment các dòng sau khi bạn đã thêm các hình ảnh tương ứng
// import banner2 from '../../assets/images/banner-2.jpg';
// import banner3 from '../../assets/images/banner-3.jpg';
// import banner4 from '../../assets/images/banner-4.jpg';

const Body = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Danh sách các slide banner
  const bannerSlides = [
    {
      title: "Chăm sóc sức khỏe của bạn là sứ mệnh của chúng tôi",
      subtitle: "Đặt lịch khám trực tuyến nhanh chóng - Theo dõi thông tin sức khỏe mọi lúc",
      image: banner1,
      background: "linear-gradient(135deg, rgba(227, 255, 248, 0.8) 0%, rgba(184, 243, 230, 0.8) 100%)"
    },
    {
      title: "Đội ngũ bác sĩ chuyên môn cao",
      subtitle: "Với hơn 10 năm kinh nghiệm trong lĩnh vực y tế",
      image: null, // Thay bằng banner2 khi đã thêm hình
      background: "linear-gradient(135deg, rgba(255, 243, 227, 0.8) 0%, rgba(255, 228, 184, 0.8) 100%)"
    },
    {
      title: "Trang thiết bị hiện đại",
      subtitle: "Công nghệ y tế tiên tiến phục vụ chẩn đoán và điều trị",
      image: null, // Thay bằng banner3 khi đã thêm hình
      background: "linear-gradient(135deg, rgba(227, 243, 255, 0.8) 0%, rgba(184, 220, 255, 0.8) 100%)"
    },
    {
      title: "Dịch vụ chăm sóc tận tâm",
      subtitle: "Chúng tôi luôn đồng hành cùng sức khỏe của bạn",
      image: null, // Thay bằng banner4 khi đã thêm hình
      background: "linear-gradient(135deg, rgba(255, 227, 243, 0.8) 0%, rgba(255, 184, 220, 0.8) 100%)"
    }
  ];

  // Auto slide
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bannerSlides.length);
    }, 5000); // Chuyển slide mỗi 5 giây

    return () => clearInterval(timer);
  }, [bannerSlides.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % bannerSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + bannerSlides.length) % bannerSlides.length);
  };

  return (
    <div className={styles.wrapper}>

      {/* ✅ Banner chính với Carousel */}
      <section className={styles.bannerSection}>
        <div className={styles.carouselContainer}>
          {/* Slides */}
          {bannerSlides.map((slide, index) => (
            <div
              key={index}
              className={`${styles.carouselSlide} ${index === currentSlide ? styles.activeSlide : ''}`}
              style={{
                background: slide.image 
                  ? `${slide.background}, url(${slide.image}) center/cover no-repeat`
                  : slide.background,
                backgroundBlendMode: slide.image ? 'overlay' : 'normal'
              }}
            >
              <div className={styles.bannerContent}>
                <h2 className={styles.bannerTitle}>{slide.title}</h2>
                <p className={styles.bannerSubtitle}>{slide.subtitle}</p>
                <div className={styles.bannerButtons}>
                  <a href="/dat-lich-hen">
                    <button className={styles.bannerButton}>
                      Đặt lịch ngay
                    </button>
                  </a>
                  <a href="/dich-vu">
                    <button className={styles.bannerButtonSecondary}>
                      Khám phá các dịch vụ
                    </button>
                  </a>
                </div>
              </div>
            </div>
          ))}

          {/* Navigation Arrows */}
          <button className={styles.carouselPrev} onClick={prevSlide}>
            ❮
          </button>
          <button className={styles.carouselNext} onClick={nextSlide}>
            ❯
          </button>

          {/* Dots Indicator */}
          <div className={styles.carouselDots}>
            {bannerSlides.map((_, index) => (
              <button
                key={index}
                className={`${styles.dot} ${index === currentSlide ? styles.activeDot : ''}`}
                onClick={() => goToSlide(index)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ✅ Giới thiệu ngắn */}
      <section className={styles.introSection}>
        <h3 className={styles.introTitle}>Healthy System - Phòng khám tư nhân hiện đại</h3>
        <p className={styles.introText}>
          Chúng tôi cung cấp các dịch vụ khám chữa bệnh với đội ngũ bác sĩ chuyên môn cao, trang thiết bị hiện đại,
          hệ thống đặt lịch trực tuyến tiện lợi và theo dõi hồ sơ bệnh án mọi lúc mọi nơi.
        </p>
      </section>

      {/* ✅ Danh sách dịch vụ/chuyên khoa */}
      {/* ✅ Danh sách chuyên khoa nổi bật */}
<section className={styles.servicesSection}>
  <h3 className={styles.sectionTitle}>Chuyên khoa nổi bật</h3>
  <div className={styles.servicesGrid}>
    {[
      { name: "Nội khoa", slug: "noi-khoa" },
      { name: "Tai Mũi Họng", slug: "tai-mui-hong" },
      { name: "Xét nghiệm - Sinh hóa", slug: "xet-nghiem-sinh-hoa" },
      { name: "Chẩn đoán hình ảnh", slug: "chan-doan-hinh-anh" }
    ].map((service, index) => (
      <a 
        key={index} 
        href={`/${service.slug}`} 
        className={styles.serviceCard}
      >
        <h4 className={styles.serviceTitle}>{service.name}</h4>
        <p className={styles.serviceLink}>Xem chi tiết dịch vụ →</p>
      </a>
    ))}
  </div>
</section>


      {/* ✅ Danh sách chi nhánh / cơ sở */}
      <section className={styles.branchesSection}>
        <h3 className={styles.sectionTitleWithColor}>Hệ thống chi nhánh</h3>
        <div className={styles.branchesGrid}>
          {[
            { name: "Cơ sở Quận 1", address: "123 Nguyễn Huệ, Quận 1, TP.HCM", hotline: "0901 234 567" },
            { name: "Cơ sở Quận 7", address: "456 Lê Văn Lương, Quận 7, TP.HCM", hotline: "0902 345 678" },
            { name: "Cơ sở Hà Nội", address: "789 Trần Duy Hưng, Cầu Giấy, Hà Nội", hotline: "0903 456 789" }
          ].map((branch, index) => (
            <div key={index} className={styles.branchCard}>
              <h4 className={styles.branchName}>{branch.name}</h4>
              <p className={styles.branchAddress}>{branch.address}</p>
              <p className={styles.branchHotline}>📞 Hotline: {branch.hotline}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ✅ Đội ngũ bác sĩ */}
      <section className={styles.doctorsSection}>
        <h3 className={styles.sectionTitleWithColor}>Đội ngũ bác sĩ chuyên môn cao</h3>
        <div className={styles.doctorsGrid}>
          {[
            { name: "BS. Nguyễn Văn A", specialty: "Nội khoa", exp: "10 năm kinh nghiệm" },
            { name: "BS. Trần Thị B", specialty: "Tai Mũi Họng", exp: "8 năm kinh nghiệm" },
            { name: "BS. Lê Hoàng C", specialty: "Chẩn đoán hình ảnh", exp: "12 năm kinh nghiệm" },
            { name: "BS. Phạm Thu D", specialty: "Xét nghiệm - Sinh hóa", exp: "9 năm kinh nghiệm" }
          ].map((doctor, index) => (
            <div key={index} className={styles.doctorCard}>
              <h4 className={styles.doctorName}>{doctor.name}</h4>
              <p className={styles.doctorSpecialty}>🔹 {doctor.specialty}</p>
              <p className={styles.doctorExp}>🎓 {doctor.exp}</p>
              <button className={styles.doctorButton}>Xem hồ sơ →</button>
            </div>
          ))}
        </div>
      </section>

      {/* ✅ Trang thiết bị hiện đại */}
<section className={styles.equipmentSection}>
  <h3 className={styles.sectionTitleWithColor}>Trang thiết bị chẩn đoán & điều trị hiện đại</h3>
  <div className={styles.equipmentGrid}>
    {[
      { name: "Máy siêu âm 5D Doppler", desc: "Chẩn đoán hình ảnh độ chính xác cao", slug: "may-sieu-am-5d" },
      { name: "Máy xét nghiệm sinh hóa tự động", desc: "Cho kết quả nhanh và chính xác", slug: "may-xet-nghiem-sinh-hoa" },
      { name: "Máy nội soi Tai Mũi Họng", desc: "Hình ảnh sắc nét, ít xâm lấn", slug: "may-noi-soi-tai-mui-hong" },
      { name: "Hệ thống X-Quang kỹ thuật số", desc: "Giảm liều tia X, an toàn cho bệnh nhân", slug: "he-thong-xquang-ky-thuat-so" }
    ].map((tool, index) => (
      <a
        key={index}
        href={`/${tool.slug}`}
        className={styles.equipmentCard}
      >
        <h4 className={styles.equipmentName}>{tool.name}</h4>
        <p className={styles.equipmentDesc}>{tool.desc}</p>
        <p className={styles.equipmentLink}>Xem chi tiết →</p>
      </a>
    ))}
  </div>
</section>

      {/* ✅ Khám phá các dịch vụ */}
<section className={styles.discoverSection}>
  <h3 className={styles.sectionTitleWithColor}>Khám phá các dịch vụ của chúng tôi</h3>
  <p className={styles.discoverSubtitle}>
    Chúng tôi cung cấp đa dạng các dịch vụ y tế chất lượng cao với đội ngũ chuyên môn và trang thiết bị hiện đại
  </p>
  <div className={styles.discoverGrid}>
    {[
      { 
        icon: "🏥", 
        title: "Khám tổng quát", 
        desc: "Khám sức khỏe toàn diện với bác sĩ giàu kinh nghiệm",
        link: "/kham-suc-khoe-tong-quat"
      },
      { 
        icon: "🔬", 
        title: "Xét nghiệm", 
        desc: "Xét nghiệm máu, nước tiểu với thiết bị hiện đại",
        link: "/xet-nghiem-tai-nha"
      },
      { 
        icon: "🏃", 
        title: "Phục hồi chức năng", 
        desc: "Vật lý trị liệu, phục hồi sau chấn thương và bệnh lý",
        link: "/phuc-hoi-chuc-nang"
      },
      { 
        icon: "🥗", 
        title: "Tư vấn dinh dưỡng", 
        desc: "Chế độ ăn uống khoa học phù hợp với tình trạng sức khỏe",
        link: "/tu-van-dinh-duong"
      }
    ].map((service, index) => (
      <a 
        key={index} 
        href={service.link} 
        className={styles.discoverCard}
      >
        <div className={styles.discoverIcon}>{service.icon}</div>
        <h4 className={styles.discoverTitle}>{service.title}</h4>
        <p className={styles.discoverDesc}>{service.desc}</p>
      </a>
    ))}
  </div>

  <div className={styles.discoverButtonContainer}>
    <a href="/dich-vu">
      <button className={styles.discoverButton}>
        Xem tất cả dịch vụ →
      </button>
    </a>
  </div>
</section>

    </div>
  );
};

export default Body;
