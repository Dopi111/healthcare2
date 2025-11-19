import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const Employees_Management = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add', 'edit', 'view'
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const [search, setSearch] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [filterPosition, setFilterPosition] = useState('');

  const [formData, setFormData] = useState({
    full_name: '',
    employee_id: '',
    phone_number: '',
    card_id: '',
    email: '',
    date_of_birth: '',
    gender: 'Nam',
    position: '',
    department: '',
    specialty: '',
    permanent_address: '',
    current_address: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(`${API_URL}/employee/list-employee`);
      const data = res.data?.data || res.data || [];
      const employees = Array.isArray(data) ? data.filter(r => (r.role_user || r.role || '').toLowerCase() !== 'users') : [];
      setItems(employees);
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to load');
    } finally {
      setLoading(false);
    }
  };

  const departments = useMemo(() => Array.from(new Set(items.map(i => i.department).filter(Boolean))), [items]);
  const positions = useMemo(() => Array.from(new Set(items.map(i => i.position).filter(Boolean))), [items]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items.filter((it) => {
      if (filterDepartment && it.department !== filterDepartment) return false;
      if (filterPosition && it.position !== filterPosition) return false;
      if (!q) return true;
      const full = `${it.full_name || it.fullName || ''}`.toLowerCase();
      const card = `${it.card_id || it.cardId || it.cccd || ''}`.toLowerCase();
      const spec = `${it.specialty || it.Specialty || ''}`.toLowerCase();
      return full.includes(q) || card.includes(q) || spec.includes(q);
    });
  }, [items, search, filterDepartment, filterPosition]);

  const handleAdd = () => {
    setModalMode('add');
    setSelectedEmployee(null);
    setFormData({
      full_name: '',
      employee_id: '',
      phone_number: '',
      card_id: '',
      email: '',
      date_of_birth: '',
      gender: 'Nam',
      position: '',
      department: '',
      specialty: '',
      permanent_address: '',
      current_address: ''
    });
    setShowModal(true);
  };

  const handleEdit = (employee) => {
    setModalMode('edit');
    setSelectedEmployee(employee);
    setFormData({
      full_name: employee.full_name || employee.fullName || '',
      employee_id: employee.employee_id || employee.employeeId || '',
      phone_number: employee.phone_number || employee.phone || '',
      card_id: employee.card_id || employee.cardId || employee.cccd || '',
      email: employee.email || '',
      date_of_birth: employee.date_of_birth?.split('T')[0] || '',
      gender: employee.gender || 'Nam',
      position: employee.position || '',
      department: employee.department || '',
      specialty: employee.specialty || employee.Specialty || '',
      permanent_address: employee.permanent_address || '',
      current_address: employee.current_address || ''
    });
    setShowModal(true);
  };

  const handleView = (employee) => {
    setModalMode('view');
    setSelectedEmployee(employee);
    setFormData({
      full_name: employee.full_name || employee.fullName || '',
      employee_id: employee.employee_id || employee.employeeId || '',
      phone_number: employee.phone_number || employee.phone || '',
      card_id: employee.card_id || employee.cardId || employee.cccd || '',
      email: employee.email || '',
      date_of_birth: employee.date_of_birth?.split('T')[0] || '',
      gender: employee.gender || 'Nam',
      position: employee.position || '',
      department: employee.department || '',
      specialty: employee.specialty || employee.Specialty || '',
      permanent_address: employee.permanent_address || '',
      current_address: employee.current_address || ''
    });
    setShowModal(true);
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
      if (modalMode === 'add') {
        await axios.post(`${API_URL}/employee/create`, formData);
        alert('Thêm nhân viên thành công!');
      } else if (modalMode === 'edit') {
        await axios.put(`${API_URL}/employee/update-full/${formData.employee_id}`, formData);
        alert('Cập nhật nhân viên thành công!');
      }
      setShowModal(false);
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || 'Thao tác thất bại!');
    }
  };

  const handleDelete = async (employee) => {
    if (!window.confirm(`Bạn có chắc muốn xóa nhân viên ${employee.full_name || employee.fullName}?`)) return;
    try {
      const employeeId = employee.employee_id || employee.employeeId;
      await axios.delete(`${API_URL}/employee/delete/${employeeId}`);
      alert('Xóa nhân viên thành công!');
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || 'Xóa thất bại!');
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Quản lý Nhân viên</h2>
        <button
          onClick={handleAdd}
          className="bg-gradient-to-r from-green-600 to-green-700 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all"
        >
          + Thêm nhân viên
        </button>
      </div>

      <div className="flex gap-3 mb-4 items-center flex-wrap">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Tìm theo họ tên, CCCD, chuyên khoa..."
          className="border rounded px-3 py-2 w-80"
        />

        <select
          value={filterDepartment}
          onChange={(e) => setFilterDepartment(e.target.value)}
          className="border rounded px-2 py-2"
        >
          <option value="">Tất cả phòng ban</option>
          {departments.map(d => <option key={d} value={d}>{d}</option>)}
        </select>

        <select
          value={filterPosition}
          onChange={(e) => setFilterPosition(e.target.value)}
          className="border rounded px-2 py-2"
        >
          <option value="">Tất cả chức vụ</option>
          {positions.map(p => <option key={p} value={p}>{p}</option>)}
        </select>

        <div className="ml-auto text-sm text-gray-600">Tổng: {filtered.length}</div>
      </div>

      <div className="bg-white rounded shadow overflow-auto">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="text-left bg-gradient-to-r from-purple-50 to-blue-50 text-gray-700">
              <th className="px-4 py-3 font-semibold">Họ và tên</th>
              <th className="px-4 py-3 font-semibold">Mã NV</th>
              <th className="px-4 py-3 font-semibold">SĐT</th>
              <th className="px-4 py-3 font-semibold">CCCD</th>
              <th className="px-4 py-3 font-semibold">Chức vụ</th>
              <th className="px-4 py-3 font-semibold">Chuyên khoa</th>
              <th className="px-4 py-3 font-semibold">Phòng ban</th>
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
                <td colSpan={8} className="p-6 text-center text-gray-500">Không có nhân viên</td>
              </tr>
            )}
            {!loading && filtered.map((row, idx) => (
              <tr key={idx} className="border-t hover:bg-purple-50 transition-colors">
                <td className="px-4 py-3 font-medium">{row.full_name || row.fullName || '-'}</td>
                <td className="px-4 py-3">{row.employee_id || row.employeeId || '-'}</td>
                <td className="px-4 py-3">{row.phone_number || row.phone || '-'}</td>
                <td className="px-4 py-3">{row.card_id || row.cardId || row.cccd || '-'}</td>
                <td className="px-4 py-3">{row.position || '-'}</td>
                <td className="px-4 py-3">{row.specialty || row.Specialty || '-'}</td>
                <td className="px-4 py-3">{row.department || '-'}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleView(row)}
                      className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
                    >
                      Chi tiết
                    </button>
                    <button
                      onClick={() => handleEdit(row)}
                      className="px-3 py-1 bg-yellow-500 text-white rounded text-sm hover:bg-yellow-600 transition-colors"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => handleDelete(row)}
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">
              {modalMode === 'add' && 'Thêm Nhân viên'}
              {modalMode === 'edit' && 'Sửa Nhân viên'}
              {modalMode === 'view' && 'Chi tiết Nhân viên'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Họ và tên *</label>
                  <input
                    type="text"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                    disabled={modalMode === 'view'}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Mã nhân viên *</label>
                  <input
                    type="text"
                    name="employee_id"
                    value={formData.employee_id}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                    disabled={modalMode === 'view' || modalMode === 'edit'}
                    pattern="[0-9]{10}"
                    maxLength={10}
                    placeholder="10 chữ số"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Số điện thoại *</label>
                  <input
                    type="tel"
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                    disabled={modalMode === 'view'}
                    pattern="[0-9]{10}"
                    maxLength={10}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">CCCD *</label>
                  <input
                    type="text"
                    name="card_id"
                    value={formData.card_id}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                    disabled={modalMode === 'view'}
                    pattern="[0-9]{12}"
                    maxLength={12}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                    disabled={modalMode === 'view'}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Ngày sinh</label>
                  <input
                    type="date"
                    name="date_of_birth"
                    value={formData.date_of_birth}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                    disabled={modalMode === 'view'}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Giới tính</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                    disabled={modalMode === 'view'}
                  >
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                    <option value="Khác">Khác</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Chức vụ</label>
                  <input
                    type="text"
                    name="position"
                    value={formData.position}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                    disabled={modalMode === 'view'}
                    placeholder="Bác sĩ, Y tá, KTV..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Phòng ban</label>
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                    disabled={modalMode === 'view'}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Chuyên khoa</label>
                  <input
                    type="text"
                    name="specialty"
                    value={formData.specialty}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                    disabled={modalMode === 'view'}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Địa chỉ thường trú</label>
                <input
                  type="text"
                  name="permanent_address"
                  value={formData.permanent_address}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                  disabled={modalMode === 'view'}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Địa chỉ hiện tại</label>
                <input
                  type="text"
                  name="current_address"
                  value={formData.current_address}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                  disabled={modalMode === 'view'}
                />
              </div>

              <div className="flex gap-2 justify-end pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                  {modalMode === 'view' ? 'Đóng' : 'Hủy'}
                </button>
                {modalMode !== 'view' && (
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    {modalMode === 'add' ? 'Thêm' : 'Lưu'}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Employees_Management;
