import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';

const Inputs = (props) => (
  <input
    {...props}
    className={`border-[1px] border-gray-300 rounded-md font-normal px-2 py-1 focus:border-[#e6b800] focus:ring-[#e6b800] transition
      ${props.disabled
        ? "bg-gray-100 text-gray-500 cursor-not-allowed border-gray-300"
        : "border-[1px] border-gray-300 rounded-md font-normal px-2 py-1 focus:border-[#e6b800] focus:ring-[#e6b800] transition"
      } ${props.className}`}
  />
);

const Register_U = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    full_name: "",
    date_of_birth: "",
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

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Mật khẩu nhập lại không khớp!");
      return;
    }

    console.log("Dữ liệu gửi đi:", formData);
    // TODO: Gọi API POST để lưu vào bảng auth_users và information_user
    alert("Đăng ký thành công! Vui lòng đăng nhập để tiếp tục.");

    // ✅ Sau khi đăng ký thành công, quay về trang đăng nhập
    navigate('/User/Login');
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <form onSubmit={handleSubmit} className="mb-8">
        {/* THÔNG TIN CÁ NHÂN */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Thông tin cá nhân</h2>
          <div className="w-full flex gap-4 mb-4">
            <div className="w-2/3">
              <h6>Họ và Tên</h6>
              <Inputs
                className="w-full"
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="w-1/3">
              <h6>Ngày sinh</h6>
              <Inputs
                className="w-full"
                type="date"
                name="date_of_birth"
                value={formData.date_of_birth}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="w-full flex gap-4 mb-4">
            <div className="w-1/2">
              <h6>Số điện thoại</h6>
              <Inputs
                className="w-full"
                type="number"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                required
              />
            </div>
            <div className="w-1/2">
              <h6>Email</h6>
              <Inputs
                className="w-full"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="w-full flex gap-4 mb-4">
            <div className="w-1/2">
              <h6>CMND / CCCD</h6>
              <Inputs
                className="w-full"
                type="text"
                name="card_id"
                value={formData.card_id}
                onChange={handleChange}
              />
            </div>
            <div className="w-1/2">
              <h6>Địa chỉ hiện tại</h6>
              <Inputs
                className="w-full"
                type="text"
                name="current_address"
                value={formData.current_address}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="w-full flex gap-4 mb-4">
            <div className="w-1/2">
              <h6>Địa chỉ thường trú</h6>
              <Inputs
                className="w-full"
                type="text"
                name="permanent_address"
                value={formData.permanent_address}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="w-full flex gap-4">
            <div className="w-1/2">
              <h6>Mật khẩu</h6>
              <Inputs
                className="w-full"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <div className="w-1/2">
              <h6>Nhập lại mật khẩu</h6>
              <Inputs
                className="w-full"
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </div>

        {/* NÚT ĐĂNG KÝ */}
        <div>
          <button
            type="submit"
            className="bg-[#e6b800] text-white cursor-pointer float-end px-4 py-2 rounded-md mt-8 hover:bg-[#ccac00] transition"
          >
            Đăng ký tài khoản
          </button>
        </div>
      </form>
    </div>
  );
};

export default Register_U;
