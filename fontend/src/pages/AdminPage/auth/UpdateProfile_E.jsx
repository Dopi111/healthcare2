import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UpdateProfile_E = () => {
  const [profile, setProfile] = useState({});
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const employeeId = localStorage.getItem('employeeId');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`http://localhost:5001/api/employee/${employeeId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data.ok) setProfile(res.data.data);
      } catch (err) {
        console.error('Fetch profile error:', err);
        setMessage('❌ Không thể tải thông tin nhân viên.');
      }
    };
    fetchProfile();
  }, [employeeId, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const res = await axios.put(
        `http://localhost:5001/api/employee/update/${employeeId}`,
        profile,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.status === 200) {
        setMessage('✅ Cập nhật thành công!');
        setTimeout(() => navigate('/Admin/profile'), 1000);
      } else {
        setMessage('❌ Cập nhật thất bại!');
      }
    } catch (err) {
      console.error('Update profile error:', err);
      setMessage(err.response?.data?.error || '❌ Lỗi khi cập nhật API.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-basic p-4">
      <form onSubmit={handleUpdate} className="w-full max-w-lg border border-border-base rounded-md p-6 bg-white">
        <h2 className="text-center mb-4">Chỉnh sửa thông tin</h2>

        <div className="grid grid-cols-1 gap-4">
          <div>
            <label htmlFor="full_name">Họ và tên</label>
            <input id="full_name" name="full_name" value={profile.full_name || ''} onChange={handleChange} />
          </div>

          <div>
            <label htmlFor="phone_number">Số điện thoại *</label>
            <input id="phone_number" name="phone_number" value={profile.phone_number || ''} onChange={handleChange} required />
          </div>

          <div>
            <label htmlFor="card_id">CCCD *</label>
            <input id="card_id" name="card_id" value={profile.card_id || ''} onChange={handleChange} required />
          </div>

          <div>
            <label htmlFor="date_of_birth">Ngày sinh</label>
            <input id="date_of_birth" name="date_of_birth" type="date" value={profile.date_of_birth || ''} onChange={handleChange} />
          </div>

          <div>
            <label htmlFor="permanent_address">Địa chỉ thường trú</label>
            <input id="permanent_address" name="permanent_address" value={profile.permanent_address || ''} onChange={handleChange} />
          </div>

          <div>
            <label htmlFor="current_address">Địa chỉ hiện tại</label>
            <input id="current_address" name="current_address" value={profile.current_address || ''} onChange={handleChange} />
          </div>

          <div>
            <label htmlFor="position">Chức vụ</label>
            <input id="position" name="position" value={profile.position || ''} onChange={handleChange} />
          </div>

          <div>
            <label htmlFor="department">Phòng ban</label>
            <input id="department" name="department" value={profile.department || ''} onChange={handleChange} />
          </div>

          <div>
            <label htmlFor="salary">Lương cơ bản</label>
            <input id="salary" name="salary" type="number" value={profile.salary || ''} onChange={handleChange} />
          </div>

          <div>
            <label htmlFor="started_date">Ngày bắt đầu</label>
            <input id="started_date" name="started_date" type="date" value={profile.started_date || ''} onChange={handleChange} />
          </div>
        </div>

        <div className="mt-6 flex gap-2 justify-end">
          <button type="button" className="bg-gray-200 text-black" onClick={() => navigate(-1)}>Quay lại</button>
          <button type="submit" className="bg-primary">Lưu thay đổi</button>
        </div>

        {message && <p className="mt-3 text-center text-red-600">{message}</p>}
      </form>
    </div>
  );
};

export default UpdateProfile_E;
