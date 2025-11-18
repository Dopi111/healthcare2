import { useState, useEffect } from 'react';
import axios from 'axios';

// Button Component
const ButtonPrimary = ({ children, onClick }) => (
  <button
    className="bg-[#45C3D2] text-sm text-white px-4 py-2 rounded hover:bg-[#3ba9b7] cursor-pointer transition"
    onClick={onClick}
  >
    {children}
  </button>
);

const DS_BN_v2 = ({ setContext }) => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');

  // Fetch danh sách bệnh nhân
  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await axios.get('http://localhost:5001/api/patients');

      if (response.data.ok) {
        setPatients(response.data.data);
      }
    } catch (err) {
      console.error('Lỗi khi lấy danh sách bệnh nhân:', err);
      setError('❌ Không thể tải danh sách bệnh nhân. Vui lòng kiểm tra kết nối server.');
    } finally {
      setLoading(false);
    }
  };

  // Tìm kiếm bệnh nhân
  const handleSearch = async () => {
    if (!searchKeyword.trim()) {
      fetchPatients();
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5001/api/patients/search/${searchKeyword}`);

      if (response.data.ok) {
        setPatients(response.data.data);
      }
    } catch (err) {
      console.error('Lỗi khi tìm kiếm:', err);
      setError('❌ Có lỗi khi tìm kiếm');
    } finally {
      setLoading(false);
    }
  };

  // Xóa bệnh nhân
  const handleDelete = async (id, name) => {
    if (!confirm(`Bạn có chắc muốn xóa bệnh nhân "${name}"?`)) {
      return;
    }

    try {
      const response = await axios.delete(`http://localhost:5001/api/patients/${id}`);

      if (response.data.ok) {
        alert('✅ Xóa bệnh nhân thành công!');
        fetchPatients(); // Reload danh sách
      }
    } catch (err) {
      console.error('Lỗi khi xóa:', err);
      alert('❌ Có lỗi khi xóa bệnh nhân');
    }
  };

  // Format ngày sinh
  const formatDate = (dateString) => {
    if (!dateString) return 'Chưa có';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  return (
    <div className="px-2">
      {/* Breadcrumb */}
      <div className="text-[10px] text-gray-900 bg-white mb-2 mt-1 px-4 py-2 rounded-md">
        Danh sách bệnh nhân
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-4 bg-white p-4 rounded-md shadow">
        <h2 className="text-lg font-semibold">Danh sách bệnh nhân ({patients.length})</h2>
        <ButtonPrimary onClick={() => setContext('Thêm BN mới')}>
          + Thêm bệnh nhân mới
        </ButtonPrimary>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-md shadow mb-4">
        <div className="flex gap-x-2">
          <input
            type="text"
            placeholder="Tìm kiếm theo tên, số điện thoại, hoặc CCCD..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:border-[#45C3D2] focus:ring-1 focus:ring-[#45C3D2]"
          />
          <button
            onClick={handleSearch}
            className="bg-[#45C3D2] text-white px-6 py-2 rounded hover:bg-[#3ba9b7] transition"
          >
            Tìm kiếm
          </button>
          <button
            onClick={fetchPatients}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition"
          >
            Làm mới
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 text-red-800 p-4 rounded-md mb-4">
          {error}
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-md shadow overflow-hidden">
        {loading ? (
          <div className="text-center py-8 text-gray-500">
            <p>Đang tải dữ liệu...</p>
          </div>
        ) : patients.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>Không có bệnh nhân nào trong hệ thống</p>
            <button
              onClick={() => setContext('Thêm BN mới')}
              className="mt-4 text-[#45C3D2] hover:underline"
            >
              Thêm bệnh nhân mới
            </button>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">STT</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Họ và Tên</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Số điện thoại</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">CCCD</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Ngày sinh</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Giới tính</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Địa chỉ</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((patient, index) => (
                <tr key={patient.infor_users_id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm">{index + 1}</td>
                  <td className="px-4 py-3 text-sm font-medium">{patient.full_name}</td>
                  <td className="px-4 py-3 text-sm">{patient.phone_number}</td>
                  <td className="px-4 py-3 text-sm">{patient.card_id}</td>
                  <td className="px-4 py-3 text-sm">{formatDate(patient.date_of_birth)}</td>
                  <td className="px-4 py-3 text-sm">{patient.gender || 'Chưa có'}</td>
                  <td className="px-4 py-3 text-sm">{patient.permanent_address || 'Chưa có'}</td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => handleDelete(patient.infor_users_id, patient.full_name)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Stats */}
      {patients.length > 0 && (
        <div className="mt-4 bg-white p-4 rounded-md shadow">
          <p className="text-sm text-gray-600">
            Tổng số bệnh nhân: <span className="font-semibold text-gray-800">{patients.length}</span>
          </p>
        </div>
      )}
    </div>
  );
};

export default DS_BN_v2;
