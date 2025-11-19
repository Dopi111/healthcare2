import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const Profile_U = () => {
  const navigate = useNavigate();
  const [section, setSection] = useState("Thông tin cá nhân");
  const [userData, setUserData] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    fetchUserProfile();
    fetchUserAppointments();
  }, []);

  const fetchUserProfile = async () => {
    const userId = localStorage.getItem('userId');

    if (!userId) {
      navigate('/User/Login');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/user-profile/${userId}`);
      const data = await response.json();

      if (data.success) {
        setUserData(data.data);
        setEditData(data.data.user);
      }
    } catch (error) {
      console.error('Fetch profile error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserAppointments = async () => {
    const userId = localStorage.getItem('userId');

    if (!userId) return;

    try {
      const response = await fetch(`${API_URL}/appointments/user/${userId}`);
      const data = await response.json();

      if (data.success) {
        setAppointments(data.data);
      }
    } catch (error) {
      console.error('Fetch appointments error:', error);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData(userData.user);
  };

  const handleChange = (e) => {
    setEditData({
      ...editData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = async () => {
    const userId = localStorage.getItem('userId');

    try {
      const response = await fetch(`${API_URL}/user-profile/${userId}/basic`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          full_name: editData.full_name,
          date_of_birth: editData.date_of_birth,
          gender: editData.gender,
          email: editData.email,
          permanent_address: editData.permanent_address,
          current_address: editData.current_address
        })
      });

      const data = await response.json();

      if (data.success) {
        alert('Cập nhật thông tin thành công!');
        setIsEditing(false);
        fetchUserProfile();
        // Update localStorage
        localStorage.setItem('userName', data.data.full_name);
        localStorage.setItem('userEmail', data.data.email || '');
      } else {
        alert('Cập nhật thất bại: ' + data.message);
      }
    } catch (error) {
      console.error('Update profile error:', error);
      alert('Lỗi kết nối đến server!');
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
    window.location.reload();
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      pending: { label: 'Chờ xác nhận', color: 'bg-yellow-100 text-yellow-800' },
      confirmed: { label: 'Đã xác nhận', color: 'bg-green-100 text-green-800' },
      cancelled: { label: 'Đã hủy', color: 'bg-red-100 text-red-800' },
      completed: { label: 'Đã hoàn thành', color: 'bg-blue-100 text-blue-800' }
    };

    const statusInfo = statusMap[status] || statusMap.pending;
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusInfo.color}`}>
        {statusInfo.label}
      </span>
    );
  };

  const SidebarItem = ({ label }) => (
    <div
      onClick={() => setSection(label)}
      className={`cursor-pointer px-4 py-3 text-sm rounded-lg mb-2 transition-all duration-200
        ${section === label
          ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold shadow-md"
          : "hover:bg-gray-100 text-gray-700 hover:shadow-sm"}
      `}
    >
      {label}
    </div>
  );

  const DetailRow = ({ label, value, name, editable = false }) => (
    <div className="flex justify-between items-center py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors">
      <p className="font-medium text-gray-600 w-1/3">{label}:</p>
      {isEditing && editable ? (
        <input
          type={name === 'date_of_birth' ? 'date' : 'text'}
          name={name}
          value={editData[name] || ''}
          onChange={handleChange}
          className="w-2/3 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />
      ) : (
        <p className="text-right font-semibold text-gray-800 w-2/3">{value || 'Chưa cập nhật'}</p>
      )}
    </div>
  );

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Đang tải dữ liệu...</p>
          </div>
        </div>
      );
    }

    if (!userData) {
      return (
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-600">Không tìm thấy thông tin người dùng</p>
        </div>
      );
    }

    const user = userData.user;

    switch (section) {
      case "Thông tin cá nhân":
        return (
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
                Thông tin Cá nhân
              </h2>
              {isEditing ? (
                <div className="space-x-2">
                  <button
                    onClick={handleSave}
                    className="bg-gradient-to-r from-green-600 to-green-700 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all"
                  >
                    Lưu
                  </button>
                  <button
                    onClick={handleCancel}
                    className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-all"
                  >
                    Hủy
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleEdit}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all"
                >
                  Chỉnh sửa
                </button>
              )}
            </div>
            <DetailRow label="Họ và tên" value={user.full_name} name="full_name" editable />
            <DetailRow label="Ngày sinh" value={user.date_of_birth?.split('T')[0]} name="date_of_birth" editable />
            <DetailRow label="Giới tính" value={user.gender} name="gender" editable />
            <DetailRow label="Số điện thoại" value={user.phone_number} />
            <DetailRow label="Email" value={user.email} name="email" editable />
            <DetailRow label="Số CCCD/CMND" value={user.card_id} />
            <DetailRow label="Địa chỉ thường trú" value={user.permanent_address} name="permanent_address" editable />
            <DetailRow label="Địa chỉ hiện tại" value={user.current_address} name="current_address" editable />
          </div>
        );

      case "Thông tin y tế":
        const medicalInfo = userData.medical_info || {};
        return (
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 mb-6">
              Thông tin Y tế
            </h2>
            <DetailRow label="Nhóm máu" value={medicalInfo.blood_type} />
            <DetailRow label="Chiều cao (cm)" value={medicalInfo.height} />
            <DetailRow label="Cân nặng (kg)" value={medicalInfo.weight} />
            <DetailRow label="Dị ứng" value={medicalInfo.allergies} />
            <DetailRow label="Bệnh mãn tính" value={medicalInfo.chronic_diseases} />
            <DetailRow label="Thuốc đang dùng" value={medicalInfo.medications} />
          </div>
        );

      case "Thông tin người thân":
        const relatives = userData.relatives || [];
        return (
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 mb-6">
              Thông tin Người thân
            </h2>
            {relatives.length > 0 ? (
              <div className="space-y-4">
                {relatives.map((r, i) => (
                  <div key={i} className="border-l-4 border-purple-500 bg-gray-50 p-4 rounded-r-lg hover:shadow-md transition-shadow">
                    <p className="font-bold text-gray-800 text-lg">{r.full_name}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      <span className="font-medium">Quan hệ:</span> {r.relation}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">SĐT:</span> {r.phone_number}
                    </p>
                    {r.email && (
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Email:</span> {r.email}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">Chưa có thông tin người thân</p>
            )}
          </div>
        );

      case "Lịch hẹn của tôi":
        return (
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 mb-6">
              Lịch hẹn của tôi
            </h2>
            {appointments.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-gradient-to-r from-purple-50 to-blue-50 text-gray-700">
                      <th className="border border-gray-200 p-3 text-left font-semibold">Ngày khám</th>
                      <th className="border border-gray-200 p-3 text-left font-semibold">Giờ khám</th>
                      <th className="border border-gray-200 p-3 text-left font-semibold">Chuyên khoa</th>
                      <th className="border border-gray-200 p-3 text-left font-semibold">Bác sĩ</th>
                      <th className="border border-gray-200 p-3 text-left font-semibold">Trạng thái</th>
                      <th className="border border-gray-200 p-3 text-left font-semibold">Ghi chú</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.map((apt, i) => (
                      <tr key={i} className="hover:bg-purple-50 transition-colors">
                        <td className="border border-gray-200 p-3">{apt.appointment_date?.split('T')[0]}</td>
                        <td className="border border-gray-200 p-3">{apt.appointment_time}</td>
                        <td className="border border-gray-200 p-3 font-medium">{apt.specialty}</td>
                        <td className="border border-gray-200 p-3">{apt.doctor_name || 'Chưa chỉ định'}</td>
                        <td className="border border-gray-200 p-3">{getStatusBadge(apt.status)}</td>
                        <td className="border border-gray-200 p-3 text-gray-600">{apt.notes || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">Chưa có lịch hẹn nào</p>
            )}
          </div>
        );

      case "Lịch sử khám":
        const history = userData.medical_history || [];
        return (
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 mb-6">
              Lịch sử Khám bệnh
            </h2>
            {history.length > 0 ? (
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-gradient-to-r from-purple-50 to-blue-50 text-gray-700">
                    <th className="border border-gray-200 p-3 text-left font-semibold">Ngày khám</th>
                    <th className="border border-gray-200 p-3 text-left font-semibold">Phòng khám</th>
                    <th className="border border-gray-200 p-3 text-left font-semibold">Bác sĩ</th>
                    <th className="border border-gray-200 p-3 text-left font-semibold">Chẩn đoán</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((m, i) => (
                    <tr key={i} className="hover:bg-purple-50 transition-colors">
                      <td className="border border-gray-200 p-3">{m.visit_date?.split('T')[0]}</td>
                      <td className="border border-gray-200 p-3">{m.clinic_name}</td>
                      <td className="border border-gray-200 p-3">{m.doctor_name}</td>
                      <td className="border border-gray-200 p-3">{m.diagnosis}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-gray-500 text-center py-8">Chưa có lịch sử khám bệnh</p>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Sidebar */}
      <aside className="w-[280px] bg-white h-full shadow-xl p-6 flex flex-col">
        <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 mb-8 text-center">
          Hồ sơ cá nhân
        </h1>

        <SidebarItem label="Thông tin cá nhân" />
        <SidebarItem label="Thông tin y tế" />
        <SidebarItem label="Thông tin người thân" />
        <SidebarItem label="Lịch hẹn của tôi" />
        <SidebarItem label="Lịch sử khám" />

        <div className="mt-auto space-y-3">
          <button
            onClick={() => navigate('/dat-lich-hen')}
            className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 rounded-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105 font-semibold"
          >
            Đặt lịch hẹn
          </button>
          <button
            onClick={handleLogout}
            className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-3 rounded-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105 font-semibold"
          >
            Đăng xuất
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">{renderContent()}</main>
    </div>
  );
};

export default Profile_U;
