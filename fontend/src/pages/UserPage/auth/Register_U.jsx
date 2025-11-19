import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const Inputs = (props) => (
  <input
    {...props}
    className={`border-[1px] border-gray-300 rounded-md font-normal px-2 py-1 focus:border-purple-500 focus:ring-purple-500 transition
      ${props.disabled
        ? "bg-gray-100 text-gray-500 cursor-not-allowed border-gray-300"
        : "border-[1px] border-gray-300 rounded-md font-normal px-2 py-1 focus:border-purple-500 focus:ring-purple-500 transition"
      } ${props.className}`}
  />
);

const Register_U = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [formData, setFormData] = useState({
    full_name: "",
    date_of_birth: "",
    gender: "Nam",
    phone_number: "",
    card_id: "",
    email: "",
    permanent_address: "",
    current_address: "",
    password: "",
    confirmPassword: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: '', type: '' });

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setMessage({ text: "Mật khẩu nhập lại không khớp!", type: 'error' });
      return;
    }

    if (formData.password.length < 6) {
      setMessage({ text: "Mật khẩu phải có ít nhất 6 ký tự!", type: 'error' });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/user-auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone_number: formData.phone_number,
          password: formData.password,
          full_name: formData.full_name,
          card_id: formData.card_id,
          date_of_birth: formData.date_of_birth,
          gender: formData.gender,
          email: formData.email,
          permanent_address: formData.permanent_address,
          current_address: formData.current_address
        })
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ text: "Đăng ký thành công! Đang chuyển đến trang đăng nhập...", type: 'success' });

        // Redirect to login after 2 seconds
        setTimeout(() => {
          navigate('/User/Login');
        }, 2000);
      } else {
        setMessage({ text: data.message || "Đăng ký thất bại!", type: 'error' });
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Registration error:', error);
      setMessage({ text: "Lỗi kết nối đến server. Vui lòng thử lại!", type: 'error' });
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-2xl border border-gray-200 p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Đăng ký tài khoản</h1>
          <p className="text-sm text-gray-600 mt-2">Vui lòng điền đầy đủ thông tin để tạo tài khoản</p>
        </div>

        {/* Message */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-lg text-center font-medium ${
            message.type === 'success'
              ? 'bg-green-100 text-green-700 border border-green-300'
              : 'bg-red-100 text-red-700 border border-red-300'
          }`}>
            {message.text}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Thông tin cá nhân */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Thông tin cá nhân</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Họ và tên <span className="text-red-500">*</span>
                </label>
                <Inputs
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  placeholder="Nguyễn Văn A"
                  required
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ngày sinh <span className="text-red-500">*</span>
                </label>
                <Inputs
                  type="date"
                  name="date_of_birth"
                  value={formData.date_of_birth}
                  onChange={handleChange}
                  required
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Giới tính <span className="text-red-500">*</span>
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                  className="w-full border-[1px] border-gray-300 rounded-md font-normal px-2 py-1 focus:border-purple-500 focus:ring-purple-500 transition"
                >
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                  <option value="Khác">Khác</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Số điện thoại <span className="text-red-500">*</span>
                </label>
                <Inputs
                  type="tel"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleChange}
                  placeholder="0987654321"
                  pattern="[0-9]{10}"
                  maxLength={10}
                  required
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Số CCCD/CMND <span className="text-red-500">*</span>
                </label>
                <Inputs
                  type="text"
                  name="card_id"
                  value={formData.card_id}
                  onChange={handleChange}
                  placeholder="123456789012"
                  pattern="[0-9]{12}"
                  maxLength={12}
                  required
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <Inputs
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="example@email.com"
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* Địa chỉ */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Địa chỉ</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Địa chỉ thường trú
                </label>
                <Inputs
                  type="text"
                  name="permanent_address"
                  value={formData.permanent_address}
                  onChange={handleChange}
                  placeholder="123 Đường ABC, Quận X, TP.HCM"
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Địa chỉ hiện tại
                </label>
                <Inputs
                  type="text"
                  name="current_address"
                  value={formData.current_address}
                  onChange={handleChange}
                  placeholder="456 Đường XYZ, Quận Y, TP.HCM"
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* Mật khẩu */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Mật khẩu</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mật khẩu <span className="text-red-500">*</span>
                </label>
                <Inputs
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Tối thiểu 6 ký tự"
                  minLength={6}
                  required
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nhập lại mật khẩu <span className="text-red-500">*</span>
                </label>
                <Inputs
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Nhập lại mật khẩu"
                  minLength={6}
                  required
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold py-3 px-4 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              {isLoading ? 'Đang đăng ký...' : 'Đăng ký'}
            </button>

            <button
              type="button"
              onClick={() => navigate('/User/Login')}
              className="flex-1 bg-white text-gray-700 font-semibold py-3 px-4 rounded-lg border-2 border-gray-300 hover:bg-gray-50 transition-all duration-300"
            >
              Quay lại đăng nhập
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register_U;
