import { useState, useEffect } from 'react';
import Header from '../Home/Header';
import Footer from '../Home/Footer';
import styles from './DatLichHen.module.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const DatLichHen = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    date: '',
    time: '',
    specialty: '',
    doctor: '',
    notes: ''
  });

  useEffect(() => {
    // Check if user is logged in and auto-fill data
    const userToken = localStorage.getItem('userToken');
    const userId = localStorage.getItem('userId');

    if (userToken && userId) {
      setIsLoggedIn(true);
      setFormData(prev => ({
        ...prev,
        fullName: localStorage.getItem('userName') || '',
        phone: localStorage.getItem('userPhone') || '',
        email: localStorage.getItem('userEmail') || ''
      }));
    }
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (message.text) setMessage({ text: '', type: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: '', type: '' });
    setIsSubmitting(true);

    try {
      const userId = localStorage.getItem('userId');

      const appointmentData = {
        infor_users_id: userId || null,
        full_name: formData.fullName,
        phone_number: formData.phone,
        email: formData.email,
        specialty: formData.specialty,
        doctor_name: formData.doctor || null,
        appointment_date: formData.date,
        appointment_time: formData.time,
        notes: formData.notes
      };

      const response = await fetch(`${API_URL}/appointments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(appointmentData)
      });

      const data = await response.json();

      if (data.success) {
        setMessage({
          text: 'Đặt lịch hẹn thành công! Chúng tôi sẽ liên hệ với bạn sớm nhất.',
          type: 'success'
        });

        // Reset form appropriately
        if (!isLoggedIn) {
          setFormData({
            fullName: '',
            phone: '',
            email: '',
            date: '',
            time: '',
            specialty: '',
            doctor: '',
            notes: ''
          });
        } else {
          setFormData(prev => ({
            ...prev,
            date: '',
            time: '',
            specialty: '',
            doctor: '',
            notes: ''
          }));
        }

        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setMessage({
          text: data.message || 'Đặt lịch hẹn thất bại!',
          type: 'error'
        });
      }
    } catch (error) {
      console.error('Appointment error:', error);
      setMessage({
        text: 'Lỗi kết nối đến server. Vui lòng thử lại!',
        type: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const specialties = [
    "Nội khoa",
    "Tai Mũi Họng",
    "Nhi Khoa",
    "Da Liễu",
    "Tim Mạch",
    "Thần Kinh",
    "Xét nghiệm - Sinh hóa",
    "Chẩn đoán hình ảnh",
    "Phục hồi chức năng"
  ];

  const timeSlots = [
    "08:00 - 08:30",
    "08:30 - 09:00",
    "09:00 - 09:30",
    "09:30 - 10:00",
    "10:00 - 10:30",
    "10:30 - 11:00",
    "13:30 - 14:00",
    "14:00 - 14:30",
    "14:30 - 15:00",
    "15:00 - 15:30",
    "15:30 - 16:00",
    "16:00 - 16:30"
  ];

  return (
    <div className={styles.wrapper}>
      <Header />
      
      <div className={styles.mainContent}>
        {/* Banner */}
        <section className={styles.bannerSection}>
          <h2 className={styles.bannerTitle}>Đặt Lịch Hẹn</h2>
          <p className={styles.bannerSubtitle}>Đặt lịch khám nhanh chóng, tiện lợi và an toàn</p>
          {isLoggedIn && (
            <p className="text-white text-sm mt-2">
              👋 Xin chào, {formData.fullName}! Thông tin của bạn đã được điền tự động.
            </p>
          )}
        </section>

        {/* Message Alert */}
        {message.text && (
          <div className={`mx-auto max-w-4xl mt-6 p-4 rounded-lg text-center font-medium ${
            message.type === 'success'
              ? 'bg-green-100 text-green-700 border-2 border-green-300'
              : 'bg-red-100 text-red-700 border-2 border-red-300'
          }`}>
            {message.text}
          </div>
        )}

        {/* Form đặt lịch */}
        <section className={styles.formSection}>
          <div className={styles.formContainer}>
            <h3 className={styles.formTitle}>Thông tin đặt lịch</h3>
            
            <form onSubmit={handleSubmit} className={styles.form}>
              {/* Thông tin cá nhân */}
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Họ và tên <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className={styles.input}
                  placeholder="Nhập họ và tên"
                  required
                />
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    Số điện thoại <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={styles.input}
                    placeholder="Nhập số điện thoại"
                    pattern="[0-9]{10}"
                    maxLength={10}
                    disabled={isLoggedIn}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={styles.input}
                    placeholder="Nhập email"
                    disabled={isLoggedIn}
                  />
                </div>
              </div>

              {/* Thông tin khám */}
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    Chuyên khoa <span className={styles.required}>*</span>
                  </label>
                  <select
                    name="specialty"
                    value={formData.specialty}
                    onChange={handleChange}
                    className={styles.select}
                    required
                  >
                    <option value="">Chọn chuyên khoa</option>
                    {specialties.map((specialty, index) => (
                      <option key={index} value={specialty}>
                        {specialty}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    Bác sĩ
                  </label>
                  <input
                    type="text"
                    name="doctor"
                    value={formData.doctor}
                    onChange={handleChange}
                    className={styles.input}
                    placeholder="Ghi tên bác sĩ bạn muốn khám vào đây"
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    Ngày khám <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className={styles.input}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    Giờ khám <span className={styles.required}>*</span>
                  </label>
                  <select
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    className={styles.select}
                    required
                  >
                    <option value="">Chọn giờ khám</option>
                    {timeSlots.map((slot, index) => (
                      <option key={index} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Ghi chú
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  className={styles.textarea}
                  placeholder="Mô tả triệu chứng hoặc yêu cầu đặc biệt"
                  rows="4"
                />
              </div>

              <button
                type="submit"
                className={styles.submitButton}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Đang xử lý...
                  </>
                ) : (
                  'Xác nhận đặt lịch'
                )}
              </button>
            </form>
          </div>

          {/* Thông tin hướng dẫn */}
          <div className={styles.infoBox}>
            <h4 className={styles.infoTitle}>📋 Hướng dẫn đặt lịch</h4>
            <ul className={styles.infoList}>
              <li>Điền đầy đủ thông tin vào form bên trái</li>
              <li>Chọn ngày và giờ khám phù hợp</li>
              <li>Bấm "Xác nhận đặt lịch" để hoàn tất</li>
              <li>Chúng tôi sẽ gọi điện xác nhận trong vòng 30 phút</li>
            </ul>

            <div className={styles.contactInfo}>
              <h4 className={styles.infoTitle}>📞 Liên hệ hỗ trợ</h4>
              <p className={styles.contactText}>
                <strong>Hotline:</strong> 0123 456 789
              </p>
              <p className={styles.contactText}>
                <strong>Email:</strong> support@healthcare.vn
              </p>
              <p className={styles.contactText}>
                <strong>Giờ làm việc:</strong> 8:00 - 17:00 (Thứ 2 - Thứ 7)
              </p>
            </div>
          </div>
        </section>

        {/* Lợi ích */}
        <section className={styles.benefitsSection}>
          <h3 className={styles.sectionTitle}>Lợi ích khi đặt lịch trực tuyến</h3>
          <div className={styles.benefitsGrid}>
            <div className={styles.benefitCard}>
              <div className={styles.benefitIcon}>⏱️</div>
              <h4 className={styles.benefitTitle}>Tiết kiệm thời gian</h4>
              <p className={styles.benefitDesc}>
                Không cần đến trực tiếp, đặt lịch mọi lúc mọi nơi
              </p>
            </div>
            <div className={styles.benefitCard}>
              <div className={styles.benefitIcon}>✅</div>
              <h4 className={styles.benefitTitle}>Xác nhận nhanh</h4>
              <p className={styles.benefitDesc}>
                Nhận phản hồi xác nhận trong vòng 30 phút
              </p>
            </div>
            <div className={styles.benefitCard}>
              <div className={styles.benefitIcon}>📅</div>
              <h4 className={styles.benefitTitle}>Quản lý dễ dàng</h4>
              <p className={styles.benefitDesc}>
                Theo dõi và quản lý lịch hẹn của bạn
              </p>
            </div>
            <div className={styles.benefitCard}>
              <div className={styles.benefitIcon}>🔔</div>
              <h4 className={styles.benefitTitle}>Nhắc lịch tự động</h4>
              <p className={styles.benefitDesc}>
                Nhận thông báo nhắc nhở trước giờ khám
              </p>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default DatLichHen;

