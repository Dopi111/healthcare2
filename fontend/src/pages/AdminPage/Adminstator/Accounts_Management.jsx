import React, { useEffect, useState } from 'react';
import { DataTable, Badge } from '../../../components/admin';
import AccountService from '../../../services/AccountService';

const Accounts_Management = () => {
  const [accounts, setAccounts] = useState([]);
  const [filteredAccounts, setFilteredAccounts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Form state
  const [formData, setFormData] = useState({
    employeeId: '',
    password: '',
    name: '',
    department: '',
    position: '',
    role: '',
    phone: '',
    email: '',
    status: 'active'
  });

  // Load accounts
  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = () => {
    try {
      const data = AccountService.getAllAccounts();
      setAccounts(data);
      setFilteredAccounts(data);
    } catch (error) {
      showMessage('error', 'Không thể tải danh sách tài khoản!');
    }
  };

  // Filter accounts
  useEffect(() => {
    let filtered = [...accounts];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(acc =>
        acc.name.toLowerCase().includes(query) ||
        acc.employeeId.toLowerCase().includes(query) ||
        acc.email?.toLowerCase().includes(query) ||
        acc.phone?.toLowerCase().includes(query)
      );
    }

    // Department filter
    if (filterDepartment) {
      filtered = filtered.filter(acc => acc.department === filterDepartment);
    }

    // Status filter
    if (filterStatus) {
      filtered = filtered.filter(acc => acc.status === filterStatus);
    }

    setFilteredAccounts(filtered);
  }, [searchQuery, filterDepartment, filterStatus, accounts]);

  // Get unique departments
  const departments = [...new Set(accounts.map(acc => acc.department))];

  // Show message
  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  };

  // Open modal for adding
  const handleAdd = () => {
    setEditingAccount(null);
    setFormData({
      employeeId: '',
      password: '',
      name: '',
      department: '',
      position: '',
      role: '',
      phone: '',
      email: '',
      status: 'active'
    });
    setIsModalOpen(true);
  };

  // Open modal for editing
  const handleEdit = (account) => {
    setEditingAccount(account);
    setFormData({
      employeeId: account.employeeId,
      password: account.password,
      name: account.name,
      department: account.department,
      position: account.position,
      role: account.role,
      phone: account.phone || '',
      email: account.email || '',
      status: account.status
    });
    setIsModalOpen(true);
  };

  // Delete account
  const handleDelete = (account) => {
    if (!window.confirm(`Bạn có chắc muốn xóa tài khoản "${account.name}"?`)) {
      return;
    }

    try {
      AccountService.deleteAccount(account.id);
      loadAccounts();
      showMessage('success', 'Xóa tài khoản thành công!');
    } catch (error) {
      showMessage('error', error.message);
    }
  };

  // Submit form
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    if (!formData.employeeId || !formData.password || !formData.name) {
      showMessage('error', 'Vui lòng điền đầy đủ thông tin bắt buộc!');
      return;
    }

    try {
      if (editingAccount) {
        // Update
        AccountService.updateAccount(editingAccount.id, formData);
        showMessage('success', 'Cập nhật tài khoản thành công!');
      } else {
        // Add
        AccountService.addAccount(formData);
        showMessage('success', 'Thêm tài khoản mới thành công!');
      }
      setIsModalOpen(false);
      loadAccounts();
    } catch (error) {
      showMessage('error', error.message);
    }
  };

  // Reset to default
  const handleResetDefault = () => {
    if (!window.confirm('Bạn có chắc muốn reset về tài khoản mặc định? Tất cả tài khoản hiện tại sẽ bị xóa!')) {
      return;
    }
    try {
      AccountService.resetToDefault();
      loadAccounts();
      showMessage('success', 'Đã reset về tài khoản mặc định!');
    } catch (error) {
      showMessage('error', 'Không thể reset!');
    }
  };

  // Export accounts
  const handleExport = () => {
    try {
      AccountService.exportAccounts();
      showMessage('success', 'Xuất dữ liệu thành công!');
    } catch (error) {
      showMessage('error', 'Không thể xuất dữ liệu!');
    }
  };

  // Table columns
  const columns = [
    {
      key: 'employeeId',
      label: 'Mã NV',
      sortable: true,
      className: 'font-medium text-[var(--color-admin-text-light-primary)]'
    },
    {
      key: 'name',
      label: 'Họ tên',
      sortable: true
    },
    {
      key: 'department',
      label: 'Phòng ban',
      sortable: true
    },
    {
      key: 'position',
      label: 'Vị trí',
      sortable: true
    },
    {
      key: 'phone',
      label: 'Số điện thoại'
    },
    {
      key: 'email',
      label: 'Email'
    },
    {
      key: 'status',
      label: 'Trạng thái',
      render: (value) => (
        <Badge variant={value === 'active' ? 'success' : 'danger'}>
          {value === 'active' ? 'Hoạt động' : 'Khóa'}
        </Badge>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[var(--color-admin-text-light-primary)]">
            Quản lý Tài khoản
          </h2>
          <p className="text-sm text-[var(--color-admin-text-light-secondary)] mt-1">
            Quản lý tài khoản nhân viên hệ thống
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleExport}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-[var(--color-admin-border-light)] text-[var(--color-admin-text-light-primary)] rounded-lg hover:bg-gray-50"
          >
            <span className="material-symbols-outlined text-xl">download</span>
            Xuất file
          </button>
          <button
            onClick={handleResetDefault}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-[var(--color-admin-border-light)] text-[var(--color-admin-text-light-primary)] rounded-lg hover:bg-gray-50"
          >
            <span className="material-symbols-outlined text-xl">refresh</span>
            Reset mặc định
          </button>
          <button
            onClick={handleAdd}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-admin-primary)] text-white rounded-lg hover:opacity-90"
          >
            <span className="material-symbols-outlined text-xl">add</span>
            Thêm tài khoản
          </button>
        </div>
      </div>

      {/* Message */}
      {message.text && (
        <div className={`p-4 rounded-lg ${
          message.type === 'success'
            ? 'bg-[var(--color-admin-success)]/10 text-[var(--color-admin-success)]'
            : 'bg-[var(--color-admin-danger)]/10 text-[var(--color-admin-danger)]'
        }`}>
          {message.text}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center bg-white p-4 rounded-lg border border-[var(--color-admin-border-light)]">
        <div className="flex-1 min-w-[200px]">
          <label className="relative block">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-admin-text-light-secondary)]">
              search
            </span>
            <input
              type="text"
              placeholder="Tìm kiếm theo tên, mã NV, email, SĐT..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-[var(--color-admin-border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-admin-primary)]"
            />
          </label>
        </div>

        <select
          value={filterDepartment}
          onChange={(e) => setFilterDepartment(e.target.value)}
          className="px-4 py-2 border border-[var(--color-admin-border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-admin-primary)]"
        >
          <option value="">Tất cả phòng ban</option>
          {departments.map(dept => (
            <option key={dept} value={dept}>{dept}</option>
          ))}
        </select>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border border-[var(--color-admin-border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-admin-primary)]"
        >
          <option value="">Tất cả trạng thái</option>
          <option value="active">Hoạt động</option>
          <option value="inactive">Khóa</option>
        </select>

        <div className="text-sm text-[var(--color-admin-text-light-secondary)]">
          Tổng: <strong>{filteredAccounts.length}</strong> tài khoản
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={filteredAccounts}
        itemsPerPage={10}
        actions={(account) => (
          <div className="flex gap-2">
            <button
              onClick={() => handleEdit(account)}
              className="p-2 text-[var(--color-admin-primary)] hover:bg-[var(--color-admin-primary)]/10 rounded"
              title="Sửa"
            >
              <span className="material-symbols-outlined text-xl">edit</span>
            </button>
            <button
              onClick={() => handleDelete(account)}
              className="p-2 text-[var(--color-admin-danger)] hover:bg-[var(--color-admin-danger)]/10 rounded"
              title="Xóa"
            >
              <span className="material-symbols-outlined text-xl">delete</span>
            </button>
          </div>
        )}
      />

      {/* Modal Add/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4">
            <div className="sticky top-0 bg-white border-b border-[var(--color-admin-border-light)] p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-[var(--color-admin-text-light-primary)]">
                  {editingAccount ? 'Sửa tài khoản' : 'Thêm tài khoản mới'}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Mã nhân viên */}
              <div>
                <label className="block text-sm font-medium text-[var(--color-admin-text-light-primary)] mb-2">
                  Mã nhân viên <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.employeeId}
                  onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                  disabled={!!editingAccount}
                  required
                  className="w-full px-4 py-2 border border-[var(--color-admin-border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-admin-primary)] disabled:bg-gray-100"
                />
              </div>

              {/* Mật khẩu */}
              <div>
                <label className="block text-sm font-medium text-[var(--color-admin-text-light-primary)] mb-2">
                  Mật khẩu <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-[var(--color-admin-border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-admin-primary)]"
                />
              </div>

              {/* Họ tên */}
              <div>
                <label className="block text-sm font-medium text-[var(--color-admin-text-light-primary)] mb-2">
                  Họ và tên <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-[var(--color-admin-border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-admin-primary)]"
                />
              </div>

              {/* Department & Position */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--color-admin-text-light-primary)] mb-2">
                    Phòng ban <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-[var(--color-admin-border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-admin-primary)]"
                  >
                    <option value="">Chọn phòng ban</option>
                    <option value="Quản trị">Quản trị</option>
                    <option value="Bác sĩ chuyên khoa">Bác sĩ chuyên khoa</option>
                    <option value="Điều dưỡng">Điều dưỡng</option>
                    <option value="Tiếp tân">Tiếp tân</option>
                    <option value="Kế toán">Kế toán</option>
                    <option value="Kỹ thuật">Kỹ thuật</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--color-admin-text-light-primary)] mb-2">
                    Vị trí <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-[var(--color-admin-border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-admin-primary)]"
                  />
                </div>
              </div>

              {/* Role */}
              <div>
                <label className="block text-sm font-medium text-[var(--color-admin-text-light-primary)] mb-2">
                  Vai trò <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-[var(--color-admin-border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-admin-primary)]"
                >
                  <option value="">Chọn vai trò</option>
                  <option value="administrator">Administrator</option>
                  <option value="doctor">Doctor</option>
                  <option value="nurse">Nurse</option>
                  <option value="receptionist">Receptionist</option>
                  <option value="accountant">Accountant</option>
                  <option value="technician">Technician</option>
                </select>
              </div>

              {/* Phone & Email */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--color-admin-text-light-primary)] mb-2">
                    Số điện thoại
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2 border border-[var(--color-admin-border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-admin-primary)]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--color-admin-text-light-primary)] mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2 border border-[var(--color-admin-border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-admin-primary)]"
                  />
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-[var(--color-admin-text-light-primary)] mb-2">
                  Trạng thái
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-4 py-2 border border-[var(--color-admin-border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-admin-primary)]"
                >
                  <option value="active">Hoạt động</option>
                  <option value="inactive">Khóa</option>
                </select>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2 border border-[var(--color-admin-border-light)] text-[var(--color-admin-text-light-primary)] rounded-lg hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-[var(--color-admin-primary)] text-white rounded-lg hover:opacity-90"
                >
                  {editingAccount ? 'Cập nhật' : 'Thêm mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Accounts_Management;
