import { useState } from 'react';
import axios from 'axios';

//BUTTON
const ButtonPrimary = ({ children, onClick, type = "button" }) => (
  <button
    type={type}
    className="bg-[#45C3D2] text-sm text-white px-4 py-2 rounded hover:bg-[#3ba9b7] cursor-pointer transition"
    onClick={onClick}
  >
    {children}
  </button>
);

// Text
const SubTittle = ({ children }) => (
  <h6 className="text-gray-500 text-sm mb-1">{children}</h6>
);

// Input
const Input = (props) => (
  <input
    {...props}
    className={`border-[1px] border-gray-300 rounded-md font-normal px-2 py-1 w-full focus:border-[#45C3D2] focus:ring-1 focus:ring-[#45C3D2] transition ${props.className}`}
  />
);

const Them_BN_v2 = ({ setContext }) => {
  const [formData, setFormData] = useState({
    phone_number: '',
    card_id: '',
    full_name: '',
    date_of_birth: '',
    gender: 'Nam',
    permanent_address: '',
    current_address: ''
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    // Validation
    if (!formData.phone_number || !formData.card_id || !formData.full_name) {
      setMessage({
        type: 'error',
        text: '❌ Vui lòng nhập đầy đủ: Số điện thoại, CCCD, Họ tên'
      });
      return;
    }

    if (!/^\d{10}$/.test(formData.phone_number)) {
      setMessage({
        type: 'error',
        text: '❌ Số điện thoại phải gồm đúng 10 chữ số'
      });
      return;
    }

    if (!/^\d{12}$/.test(formData.card_id)) {
      setMessage({
        type: 'error',
        text: '❌ Số CCCD phải gồm đúng 12 chữ số'
      });
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post('http://localhost:5001/api/patients', formData);

      if (response.data.ok) {
        setMessage({
          type: 'success',
          text: '✅ Thêm bệnh nhân thành công!'
        });

        // Reset form
        setFormData({
          phone_number: '',
          card_id: '',
          full_name: '',
          date_of_birth: '',
          gender: 'Nam',
          permanent_address: '',
          current_address: ''
        });

        // Redirect sau 2 giây
        setTimeout(() => {
          setContext('Danh sách BN');
        }, 2000);
      }
    } catch (error) {
      console.error('Lỗi khi thêm bệnh nhân:', error);
      setMessage({
        type: 'error',
        text: error.response?.data?.error || '❌ Có lỗi xảy ra khi thêm bệnh nhân'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-2">
      {/* Breadcrumb */}
      <div className="text-[10px] text-gray-900 bg-white mb-2 mt-1 px-4 py-2 rounded-md">
        Thêm bệnh nhân mới
      </div>

      {/* Title */}
      <div className="flex items-center justify-between mb-2 bg-white p-4 rounded-md shadow">
        <h2 className="text-lg font-semibold">Thêm bệnh nhân mới</h2>
        <ButtonPrimary onClick={() => setContext("Danh sách BN")}>
          Danh sách BN
        </ButtonPrimary>
      </div>

      {/* Message */}
      {message.text && (
        <div className={`mb-4 p-4 rounded-md ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {message.text}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="w-full bg-white rounded-md px-5 py-4 shadow mb-4">
        <h2 className="text-lg font-bold text-gray-800 mb-4 border-b-[1px] pb-2">Thông tin Cá nhân</h2>

        {/* Họ và Tên */}
        <div className="mb-4">
          <SubTittle>Họ và Tên (*)</SubTittle>
          <Input
            type="text"
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            placeholder="Nguyễn Văn A"
            required
          />
        </div>

        {/* Số điện thoại & CCCD */}
        <div className="mb-4 flex gap-x-4">
          <div className="w-1/2">
            <SubTittle>Số điện thoại (*)</SubTittle>
            <Input
              type="text"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              placeholder="0912345678"
              maxLength="10"
              required
            />
          </div>
          <div className="w-1/2">
            <SubTittle>Số CCCD (*)</SubTittle>
            <Input
              type="text"
              name="card_id"
              value={formData.card_id}
              onChange={handleChange}
              placeholder="123456789012"
              maxLength="12"
              required
            />
          </div>
        </div>

        {/* Ngày sinh & Giới tính */}
        <div className="mb-4 flex gap-x-4">
          <div className="w-1/2">
            <SubTittle>Ngày sinh</SubTittle>
            <Input
              type="date"
              name="date_of_birth"
              value={formData.date_of_birth}
              onChange={handleChange}
            />
          </div>
          <div className="w-1/2">
            <SubTittle>Giới tính</SubTittle>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="border-[1px] border-gray-300 rounded-md px-2 py-1 w-full focus:border-[#45C3D2] focus:ring-1 focus:ring-[#45C3D2]"
            >
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
              <option value="Khác">Khác</option>
            </select>
          </div>
        </div>

        {/* Địa chỉ thường trú */}
        <div className="mb-4">
          <SubTittle>Địa chỉ Thường Trú</SubTittle>
          <Input
            type="text"
            name="permanent_address"
            value={formData.permanent_address}
            onChange={handleChange}
            placeholder="Số nhà, đường, phường, quận, thành phố"
          />
        </div>

        {/* Địa chỉ hiện tại */}
        <div className="mb-4">
          <SubTittle>Địa chỉ Hiện Tại</SubTittle>
          <Input
            type="text"
            name="current_address"
            value={formData.current_address}
            onChange={handleChange}
            placeholder="Để trống nếu giống địa chỉ thường trú"
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-x-4 mt-6">
          <ButtonPrimary type="submit" disabled={loading}>
            {loading ? 'Đang lưu...' : 'Lưu thông tin'}
          </ButtonPrimary>
          <button
            type="button"
            onClick={() => setContext("Danh sách BN")}
            className="bg-gray-300 text-sm text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition"
          >
            Hủy
          </button>
        </div>
      </form>
    </div>
  );
};

export default Them_BN_v2;
