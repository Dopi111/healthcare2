import Header from '../Home/Header';
import Footer from '../Home/Footer';
import styles from './DichVu.module.css';

const DichVu = () => {
  return (
    <div className={styles.wrapper}>
      <Header />
      
      {/* Content chính của trang Dịch Vụ */}
      <div className={styles.mainContent}>
        {/* Banner */}
        <section className={styles.bannerSection}>
          <h2 className={styles.bannerTitle}>Dịch Vụ Y Tế</h2>
          <p className={styles.bannerSubtitle}>Các dịch vụ y tế toàn diện, hiện đại và chuyên nghiệp</p>
        </section>

        {/* Danh sách dịch vụ chính */}
<section className={styles.servicesSection}>
  <h3 className={styles.sectionTitle}>Dịch vụ chính</h3>
  <div className={styles.servicesGrid}>
    {[
      { 
        name: "Khám bệnh trực tuyến", 
        desc: "Tư vấn sức khỏe từ xa qua video call với bác sĩ chuyên khoa",
        icon: "💻",
        price: "Từ 200.000đ",
        slug: "kham-benh-truc-tuyen"
      },
      { 
        name: "Khám sức khỏe tổng quát", 
        desc: "Gói khám toàn diện với đầy đủ các xét nghiệm cơ bản",
        icon: "🏥",
        price: "Từ 1.500.000đ",
        slug: "kham-suc-khoe-tong-quat"
      },
      { 
        name: "Xét nghiệm tận nơi", 
        desc: "Lấy mẫu xét nghiệm tại nhà, kết quả nhanh chóng",
        icon: "🔬",
        price: "Từ 500.000đ",
        slug: "xet-nghiem-tai-nha"
      },
      { 
        name: "Tư vấn dinh dưỡng", 
        desc: "Chế độ ăn uống khoa học phù hợp với tình trạng sức khỏe",
        icon: "🥗",
        price: "Từ 300.000đ",
        slug: "tu-van-dinh-duong"
      },
      { 
        name: "Phục hồi chức năng", 
        desc: "Vật lý trị liệu, phục hồi sau chấn thương và bệnh lý",
        icon: "🏃",
        price: "Từ 400.000đ",
        slug: "phuc-hoi-chuc-nang"
      },
      { 
        name: "Chăm sóc tại nhà", 
        desc: "Y tá, bác sĩ đến tận nhà chăm sóc người bệnh",
        icon: "🏠",
        price: "Từ 800.000đ",
        slug: "cham-soc-tai-nha"
      }
    ].map((service, index) => (
      <div key={index} className={styles.serviceCard}>
        <div className={styles.serviceIcon}>{service.icon}</div>
        <h4 className={styles.serviceTitle}>{service.name}</h4>
        <p className={styles.serviceDesc}>{service.desc}</p>
        <p className={styles.servicePrice}>{service.price}</p>

        <div className={styles.buttonGroup}>
          <a href={`/${service.slug}`}>
            <button className={styles.detailButton}>
              Xem chi tiết
            </button>
          </a>
          <a href="/dat-lich-hen">
            <button className={styles.serviceButton}>
              Đặt lịch ngay
            </button>
          </a>
        </div>
      </div>
    ))}
  </div>
</section>


        {/* Gói khám sức khỏe */}
        <section className={styles.packageSection}>
          <h3 className={styles.sectionTitle}>Gói khám sức khỏe</h3>
          <div className={styles.servicesGrid}>
            {[
              {
                name: "Gói Cơ Bản",
                price: "1.500.000đ",
                features: [
                  "Khám lâm sàng tổng quát",
                  "Xét nghiệm máu cơ bản",
                  "Đo huyết áp, nhịp tim",
                  "X-quang phổi",
                  "Siêu âm bụng tổng quát"
                ]
              },
              {
                name: "Gói Nâng Cao",
                price: "3.500.000đ",
                features: [
                  "Tất cả dịch vụ gói cơ bản",
                  "Xét nghiệm sinh hóa mở rộng",
                  "Điện tim đồ",
                  "Siêu âm tim",
                  "Nội soi dạ dày",
                  "Tư vấn dinh dưỡng"
                ],
                popular: true
              },
              {
                name: "Gói Cao Cấp",
                price: "6.500.000đ",
                features: [
                  "Tất cả dịch vụ gói nâng cao",
                  "CT Scanner",
                  "MRI não",
                  "Xét nghiệm ung thư",
                  "Gen di truyền",
                  "Tư vấn bác sĩ chuyên khoa"
                ]
              }
            ].map((pkg, index) => (
              <div key={index} className={pkg.popular ? styles.packageCardPopular : styles.packageCard}>
                {pkg.popular && (
                  <div className={styles.popularBadge}>
                    Phổ biến nhất
                  </div>
                )}
                <h4 className={styles.packageName}>{pkg.name}</h4>
                <p className={styles.packagePrice}>{pkg.price}</p>
                <ul className={styles.featureList}>
                  {pkg.features.map((feature, idx) => (
                    <li key={idx} className={styles.featureItem}>
                      <span className={styles.featureCheckmark}>✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <a href="/dat-lich-hen">
                  <button className={pkg.popular ? styles.packageButtonPopular : styles.packageButton}>
                    Chọn gói này
                  </button>
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* Quy trình đặt lịch */}
        <section className={styles.processSection}>
          <h3 className={styles.sectionTitleCenter}>Quy trình đặt lịch đơn giản</h3>
          <div className={styles.processGrid}>
            {[
              { step: "1", title: "Chọn dịch vụ", desc: "Lựa chọn dịch vụ phù hợp với nhu cầu" },
              { step: "2", title: "Đặt lịch", desc: "Chọn ngày giờ và bác sĩ mong muốn" },
              { step: "3", title: "Xác nhận", desc: "Nhận thông báo xác nhận qua email/SMS" },
              { step: "4", title: "Khám bệnh", desc: "Đến cơ sở y tế hoặc khám online" }
            ].map((item, index) => (
              <div key={index} className={styles.processStep}>
                <div className={styles.stepCircle}>
                  {item.step}
                </div>
                <h4 className={styles.stepTitle}>{item.title}</h4>
                <p className={styles.stepDesc}>{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Call to action */}
        <section className={styles.ctaSection}>
          <h3 className={styles.ctaTitle}>Sẵn sàng chăm sóc sức khỏe của bạn?</h3>
          <p className={styles.ctaSubtitle}>Đặt lịch ngay hôm nay để nhận ưu đãi đặc biệt</p>
          <a href="/dat-lich-hen">
            <button className={styles.ctaButton}>
              Đặt lịch ngay
            </button>
          </a>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default DichVu;

