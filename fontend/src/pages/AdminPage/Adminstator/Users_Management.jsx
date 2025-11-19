import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const Users_Management = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [search, setSearch] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(`${API_URL}/employee/list-employee`);
      const data = res.data?.data || res.data || [];
      // Filter only users (not employees)
      const users = Array.isArray(data) ? data.filter(r => (r.role_user || r.role || '').toLowerCase() === 'users') : [];
      setItems(users);
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to load');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa người dùng này?')) return;
    try {
      await axios.delete(`${API_URL}/employee/delete-user/${id}`);
      alert('Xóa người dùng thành công!');
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || 'Xóa thất bại!');
    }
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items.filter((it) => {
      if (!q) return true;
      const full = `${it.full_name || it.fullName || ''}`.toLowerCase();
      const phone = `${it.phone_number || it.phone || ''}`.toLowerCase();
      const card = `${it.card_id || it.cardId || it.cccd || ''}`.toLowerCase();
      const email = `${it.email || ''}`.toLowerCase();
      return full.includes(q) || phone.includes(q) || card.includes(q) || email.includes(q);
    });
  }, [items, search]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Quản lý Tài khoản Người dùng</h2>

      <div className="flex gap-3 mb-4 items-center">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Tìm theo họ tên, SĐT, CCCD, email..."
          className="border rounded px-3 py-2 w-96"
        />

        <div className="ml-auto text-sm text-gray-600">Tổng: {filtered.length} người dùng</div>
      </div>

      <div className="bg-white rounded shadow overflow-auto">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="text-left bg-gradient-to-r from-purple-50 to-blue-50 text-gray-700">
              <th className="px-4 py-3 font-semibold">Họ và tên</th>
              <th className="px-4 py-3 font-semibold">SĐT</th>
              <th className="px-4 py-3 font-semibold">Email</th>
              <th className="px-4 py-3 font-semibold">CCCD</th>
              <th className="px-4 py-3 font-semibold">Giới tính</th>
              <th className="px-4 py-3 font-semibold">Ngày sinh</th>
              <th className="px-4 py-3 font-semibold">Ngày đăng ký</th>
              <th className="px-4 py-3 font-semibold">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={8} className="p-6 text-center">
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                    <span className="ml-3">Đang tải...</span>
                  </div>
                </td>
              </tr>
            )}
            {!loading && filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="p-6 text-center text-gray-500">Không có người dùng</td>
              </tr>
            )}
            {!loading && filtered.map((row, idx) => (
              <tr key={idx} className="border-t hover:bg-purple-50 transition-colors">
                <td className="px-4 py-3 font-medium">{row.full_name || row.fullName || '-'}</td>
                <td className="px-4 py-3">{row.phone_number || row.phone || '-'}</td>
                <td className="px-4 py-3">{row.email || '-'}</td>
                <td className="px-4 py-3">{row.card_id || row.cardId || row.cccd || '-'}</td>
                <td className="px-4 py-3">{row.gender || '-'}</td>
                <td className="px-4 py-3">{row.date_of_birth?.split('T')[0] || '-'}</td>
                <td className="px-4 py-3">{row.created_at?.split('T')[0] || '-'}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors">
                      Chi tiết
                    </button>
                    <button
                      onClick={() => handleDelete(row.infor_users_id || row.id)}
                      className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition-colors"
                    >
                      Xóa
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {error && (
        <div className="mt-3 p-3 bg-red-100 border border-red-300 text-red-700 rounded">
          {error}
        </div>
      )}
    </div>
  );
};

export default Users_Management;
