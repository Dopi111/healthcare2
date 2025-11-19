import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const Lab_Results_Management = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterResultStatus, setFilterResultStatus] = useState('');

  const [formData, setFormData] = useState({
    patient_name: '',
    patient_phone: '',
    test_type: '',
    test_category: '',
    test_date: new Date().toISOString().split('T')[0],
    sample_type: '',
    result_summary: '',
    result_status: 'normal',
    reference_range: '',
    unit: '',
    doctor_name: '',
    technician_name: '',
    status: 'completed',
    notes: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(`${API_URL}/lab-results`);
      const data = res.data?.data || res.data || [];
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/lab-results`, formData);
      alert('Thêm kết quả xét nghiệm thành công!');
      setShowAddModal(false);
      setFormData({
        patient_name: '',
        patient_phone: '',
        test_type: '',
        test_category: '',
        test_date: new Date().toISOString().split('T')[0],
        sample_type: '',
        result_summary: '',
        result_status: 'normal',
        reference_range: '',
        unit: '',
        doctor_name: '',
        technician_name: '',
        status: 'completed',
        notes: ''
      });
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || 'Thêm thất bại!');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa kết quả này?')) return;
    try {
      await axios.delete(`${API_URL}/lab-results/${id}`);
      alert('Xóa thành công!');
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || 'Xóa thất bại!');
    }
  };

  const handleVerify = async (id) => {
    try {
      await axios.put(`${API_URL}/lab-results/${id}/verify`, {
        verified_by: 1 // TODO: Get from current user session
      });
      alert('Xác nhận kết quả thành công!');
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || 'Xác nhận thất bại!');
    }
  };

  const statuses = useMemo(() => Array.from(new Set(items.map(i => i.status).filter(Boolean))), [items]);
  const resultStatuses = useMemo(() => Array.from(new Set(items.map(i => i.result_status).filter(Boolean))), [items]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items.filter((it) => {
      if (filterStatus && it.status !== filterStatus) return false;
      if (filterResultStatus && it.result_status !== filterResultStatus) return false;
      if (!q) return true;
      const name = `${it.patient_name || ''}`.toLowerCase();
      const phone = `${it.patient_phone || ''}`.toLowerCase();
      const testType = `${it.test_type || ''}`.toLowerCase();
      return name.includes(q) || phone.includes(q) || testType.includes(q);
    });
  }, [items, search, filterStatus, filterResultStatus]);

  const getResultStatusBadge = (status) => {
    const statusMap = {
      normal: { label: 'Bình thường', color: 'bg-green-100 text-green-800' },
      abnormal: { label: 'Bất thường', color: 'bg-yellow-100 text-yellow-800' },
      critical: { label: 'Nguy hiểm', color: 'bg-red-100 text-red-800' },
      pending: { label: 'Chờ kết quả', color: 'bg-gray-100 text-gray-800' }
    };
    const info = statusMap[status] || statusMap.pending;
    return <span className={`px-2 py-1 rounded text-xs font-semibold ${info.color}`}>{info.label}</span>;
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      pending: { label: 'Chờ xử lý', color: 'bg-yellow-100 text-yellow-800' },
      in_progress: { label: 'Đang xử lý', color: 'bg-blue-100 text-blue-800' },
      completed: { label: 'Hoàn thành', color: 'bg-green-100 text-green-800' },
      verified: { label: 'Đã xác nhận', color: 'bg-purple-100 text-purple-800' }
    };
    const info = statusMap[status] || statusMap.pending;
    return <span className={`px-2 py-1 rounded text-xs font-semibold ${info.color}`}>{info.label}</span>;
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Quản lý Kết quả Xét nghiệm</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-gradient-to-r from-green-600 to-green-700 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all"
        >
          + Thêm kết quả
        </button>
      </div>

      <div className="flex gap-3 mb-4 items-center flex-wrap">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Tìm theo tên bệnh nhân, SĐT, loại xét nghiệm..."
          className="border rounded px-3 py-2 w-80"
        />

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border rounded px-2 py-2"
        >
          <option value="">Tất cả trạng thái xử lý</option>
          {statuses.map(s => <option key={s} value={s}>{s}</option>)}
        </select>

        <select
          value={filterResultStatus}
          onChange={(e) => setFilterResultStatus(e.target.value)}
          className="border rounded px-2 py-2"
        >
          <option value="">Tất cả kết quả</option>
          {resultStatuses.map(s => <option key={s} value={s}>{s}</option>)}
        </select>

        <div className="ml-auto text-sm text-gray-600">Tổng: {filtered.length}</div>
      </div>

      <div className="bg-white rounded shadow overflow-auto">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="text-left bg-gradient-to-r from-purple-50 to-blue-50 text-gray-700">
              <th className="px-4 py-3 font-semibold">Ngày XN</th>
              <th className="px-4 py-3 font-semibold">Bệnh nhân</th>
              <th className="px-4 py-3 font-semibold">SĐT</th>
              <th className="px-4 py-3 font-semibold">Loại XN</th>
              <th className="px-4 py-3 font-semibold">Mẫu</th>
              <th className="px-4 py-3 font-semibold">Kết quả</th>
              <th className="px-4 py-3 font-semibold">Trạng thái</th>
              <th className="px-4 py-3 font-semibold">Bác sĩ</th>
              <th className="px-4 py-3 font-semibold">KTV</th>
              <th className="px-4 py-3 font-semibold">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={10} className="p-6 text-center">Đang tải...</td>
              </tr>
            )}
            {!loading && filtered.length === 0 && (
              <tr>
                <td colSpan={10} className="p-6 text-center text-gray-500">Không có kết quả xét nghiệm</td>
              </tr>
            )}
            {!loading && filtered.map((row) => (
              <tr key={row.lab_result_id} className="border-t hover:bg-purple-50 transition-colors">
                <td className="px-4 py-3">{row.test_date?.split('T')[0] || '-'}</td>
                <td className="px-4 py-3 font-medium">{row.patient_name || '-'}</td>
                <td className="px-4 py-3">{row.patient_phone || '-'}</td>
                <td className="px-4 py-3">{row.test_type || '-'}</td>
                <td className="px-4 py-3">{row.sample_type || '-'}</td>
                <td className="px-4 py-3">{getResultStatusBadge(row.result_status)}</td>
                <td className="px-4 py-3">{getStatusBadge(row.status)}</td>
                <td className="px-4 py-3">{row.doctor_name || '-'}</td>
                <td className="px-4 py-3">{row.technician_name || '-'}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    {row.status !== 'verified' && (
                      <button
                        onClick={() => handleVerify(row.lab_result_id)}
                        className="px-2 py-1 bg-purple-600 text-white rounded text-sm hover:bg-purple-700"
                      >
                        Xác nhận
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(row.lab_result_id)}
                      className="px-2 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
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

      {error && <p className="mt-3 text-red-600">{error}</p>}

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">Thêm Kết quả Xét nghiệm</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Tên bệnh nhân *</label>
                  <input
                    type="text"
                    name="patient_name"
                    value={formData.patient_name}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Số điện thoại</label>
                  <input
                    type="tel"
                    name="patient_phone"
                    value={formData.patient_phone}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Loại xét nghiệm *</label>
                  <input
                    type="text"
                    name="test_type"
                    value={formData.test_type}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Danh mục</label>
                  <input
                    type="text"
                    name="test_category"
                    value={formData.test_category}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Ngày xét nghiệm *</label>
                  <input
                    type="date"
                    name="test_date"
                    value={formData.test_date}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Loại mẫu</label>
                  <input
                    type="text"
                    name="sample_type"
                    value={formData.sample_type}
                    onChange={handleChange}
                    placeholder="Máu, nước tiểu, ..."
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Kết quả</label>
                  <select
                    name="result_status"
                    value={formData.result_status}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                  >
                    <option value="normal">Bình thường</option>
                    <option value="abnormal">Bất thường</option>
                    <option value="critical">Nguy hiểm</option>
                    <option value="pending">Chờ kết quả</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Trạng thái</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                  >
                    <option value="pending">Chờ xử lý</option>
                    <option value="in_progress">Đang xử lý</option>
                    <option value="completed">Hoàn thành</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Bác sĩ</label>
                  <input
                    type="text"
                    name="doctor_name"
                    value={formData.doctor_name}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Kỹ thuật viên</label>
                  <input
                    type="text"
                    name="technician_name"
                    value={formData.technician_name}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Tóm tắt kết quả</label>
                <textarea
                  name="result_summary"
                  value={formData.result_summary}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                  rows="3"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Ghi chú</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                  rows="2"
                />
              </div>
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Thêm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Lab_Results_Management;
