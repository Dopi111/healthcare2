import React, { useEffect, useState } from 'react';
import { DataTable, Badge } from '../../../components/admin';

const SalaryManagement = () => {
  const [salaries, setSalaries] = useState([]);
  const [filteredSalaries, setFilteredSalaries] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMonth, setFilterMonth] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSalary, setEditingSalary] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [stats, setStats] = useState({
    totalSalary: 0,
    paid: 0,
    pending: 0,
    employeeCount: 0
  });
  const [formData, setFormData] = useState({
    employee_id: '',
    employee_name: '',
    position: '',
    department: '',
    month: new Date().toISOString().slice(0, 7),
    base_salary: 0,
    coefficient: 1,
    bonus: 0,
    deduction: 0,
    total_salary: 0,
    notes: '',
    payment_date: '',
    status: 'pending'
  });

  useEffect(() => {
    loadSalaries();
  }, []);

  const loadSalaries = async () => {
    try {
      const response = await fetch('/api/employee/list-employee');
      const result = await response.json();
      const employees = result.data || [];

      // Transform employee data to salary format
      const salaryData = employees.map(emp => ({
        id: emp.employee_id,
        employee_id: emp.employee_id,
        employee_name: emp.full_name || 'N/A',
        position: emp.position || 'N/A',
        department: emp.department || 'N/A',
        base_salary: emp.salary || 0,
        coefficient: emp.coefficient || 1,
        total_salary: (emp.salary || 0) * (emp.coefficient || 1),
        month: new Date().toISOString().slice(0, 7),
        status: 'pending',
        payment_date: null,
        bonus: 0,
        deduction: 0,
        notes: ''
      }));

      setSalaries(salaryData);
      setFilteredSalaries(salaryData);
      calculateStats(salaryData);
    } catch (error) {
      console.error('Error loading salaries:', error);
      setSalaries([]);
      setFilteredSalaries([]);
      showMessage('error', 'Không thể tải danh sách lương!');
    }
  };

  const calculateStats = (data) => {
    const currentMonth = new Date().toISOString().slice(0, 7);
    const monthData = data.filter(s => s.month === currentMonth);

    const stats = {
      totalSalary: monthData.reduce((sum, s) => sum + (s.total_salary || 0), 0),
      paid: monthData.filter(s => s.status === 'paid').reduce((sum, s) => sum + (s.total_salary || 0), 0),
      pending: monthData.filter(s => s.status === 'pending').reduce((sum, s) => sum + (s.total_salary || 0), 0),
      employeeCount: data.length
    };
    setStats(stats);
  };

  useEffect(() => {
    let filtered = [...(salaries || [])];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(s =>
        (s.employee_id || '').toLowerCase().includes(query) ||
        (s.employee_name || '').toLowerCase().includes(query)
      );
    }

    if (filterMonth) {
      filtered = filtered.filter(s => s.month === filterMonth);
    }

    if (filterStatus) {
      filtered = filtered.filter(s => s.status === filterStatus);
    }

    if (filterDepartment) {
      filtered = filtered.filter(s =>
        (s.department || '').toLowerCase().includes(filterDepartment.toLowerCase())
      );
    }

    setFilteredSalaries(filtered);
  }, [searchQuery, filterMonth, filterStatus, filterDepartment, salaries]);

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  };

  const handleView = (salary) => {
    setEditingSalary(salary);
    setFormData({
      employee_id: salary.employee_id || '',
      employee_name: salary.employee_name || '',
      position: salary.position || '',
      department: salary.department || '',
      month: salary.month || new Date().toISOString().slice(0, 7),
      base_salary: salary.base_salary || 0,
      coefficient: salary.coefficient || 1,
      bonus: salary.bonus || 0,
      deduction: salary.deduction || 0,
      total_salary: calculateTotalSalary(
        salary.base_salary || 0,
        salary.coefficient || 1,
        salary.bonus || 0,
        salary.deduction || 0
      ),
      notes: salary.notes || '',
      payment_date: salary.payment_date || '',
      status: salary.status || 'pending'
    });
    setIsModalOpen(true);
  };

  const calculateTotalSalary = (base, coefficient, bonus, deduction) => {
    return (base * coefficient) + bonus - deduction;
  };

  const handleFormChange = (field, value) => {
    const newFormData = { ...formData, [field]: value };

    // Auto-calculate total_salary when relevant fields change
    if (['base_salary', 'coefficient', 'bonus', 'deduction'].includes(field)) {
      newFormData.total_salary = calculateTotalSalary(
        parseFloat(newFormData.base_salary) || 0,
        parseFloat(newFormData.coefficient) || 1,
        parseFloat(newFormData.bonus) || 0,
        parseFloat(newFormData.deduction) || 0
      );
    }

    setFormData(newFormData);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Since we're using read-only employee data, we just show a message
    showMessage('info', 'Chức năng cập nhật lương đang được phát triển. Hiện tại chỉ hiển thị thông tin từ hồ sơ nhân viên.');
    setIsModalOpen(false);
  };

  const handleMarkAsPaid = (salary) => {
    // This would normally update the database
    const updatedSalaries = salaries.map(s =>
      s.employee_id === salary.employee_id
        ? { ...s, status: 'paid', payment_date: new Date().toISOString().split('T')[0] }
        : s
    );
    setSalaries(updatedSalaries);
    setFilteredSalaries(updatedSalaries.filter(s => {
      let match = true;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        match = match && ((s.employee_id || '').toLowerCase().includes(query) ||
          (s.employee_name || '').toLowerCase().includes(query));
      }
      if (filterMonth) match = match && s.month === filterMonth;
      if (filterStatus) match = match && s.status === filterStatus;
      if (filterDepartment) match = match && (s.department || '').toLowerCase().includes(filterDepartment.toLowerCase());
      return match;
    }));
    calculateStats(updatedSalaries);
    showMessage('success', `Đã đánh dấu lương của ${salary.employee_name} là đã thanh toán!`);
  };

  const handleBulkPayment = () => {
    const pendingSalaries = filteredSalaries.filter(s => s.status === 'pending');
    if (pendingSalaries.length === 0) {
      showMessage('error', 'Không có lương nào cần thanh toán!');
      return;
    }

    if (!window.confirm(`Bạn có chắc muốn thanh toán cho ${pendingSalaries.length} nhân viên?`)) {
      return;
    }

    const updatedSalaries = salaries.map(s =>
      s.status === 'pending'
        ? { ...s, status: 'paid', payment_date: new Date().toISOString().split('T')[0] }
        : s
    );
    setSalaries(updatedSalaries);
    setFilteredSalaries(updatedSalaries);
    calculateStats(updatedSalaries);
    showMessage('success', `Đã thanh toán cho ${pendingSalaries.length} nhân viên!`);
  };

  const exportSalaries = () => {
    try {
      const dataStr = JSON.stringify(filteredSalaries, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);

      const link = document.createElement('a');
      link.href = url;
      link.download = `salaries_${new Date().toISOString()}.json`;
      link.click();

      URL.revokeObjectURL(url);
      showMessage('success', 'Xuất file thành công!');
    } catch (error) {
      console.error('Error exporting salaries:', error);
      showMessage('error', 'Không thể xuất file!');
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const columns = [
    {
      key: 'employee_id',
      label: 'Mã NV',
      sortable: true,
      className: 'font-medium text-[var(--color-admin-text-light-primary)]'
    },
    {
      key: 'employee_name',
      label: 'Tên NV',
      sortable: true
    },
    {
      key: 'position',
      label: 'Chức vụ'
    },
    {
      key: 'department',
      label: 'Phòng ban'
    },
    {
      key: 'base_salary',
      label: 'Lương CB',
      render: (value) => formatCurrency(value)
    },
    {
      key: 'coefficient',
      label: 'Hệ số',
      render: (value) => `x${value}`
    },
    {
      key: 'total_salary',
      label: 'Tổng lương',
      render: (value) => (
        <span className="font-bold text-green-600">{formatCurrency(value)}</span>
      )
    },
    {
      key: 'month',
      label: 'Tháng',
      render: (value) => value
    },
    {
      key: 'status',
      label: 'Trạng thái',
      render: (value) => {
        const variants = {
          'pending': 'warning',
          'paid': 'success',
          'cancelled': 'danger'
        };
        const labels = {
          'pending': 'Chờ thanh toán',
          'paid': 'Đã thanh toán',
          'cancelled': 'Đã hủy'
        };
        return <Badge variant={variants[value] || 'default'}>{labels[value] || value}</Badge>;
      }
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[var(--color-admin-text-light-primary)]">
            Quản lý Lương
          </h2>
          <p className="text-sm text-[var(--color-admin-text-light-secondary)] mt-1">
            Quản lý lương nhân viên và thanh toán
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleBulkPayment}
            className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:opacity-90"
          >
            <span className="material-symbols-outlined text-xl">payments</span>
            Thanh toán hàng loạt
          </button>
          <button
            onClick={exportSalaries}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-[var(--color-admin-border-light)] text-[var(--color-admin-text-light-primary)] rounded-lg hover:bg-gray-50"
          >
            <span className="material-symbols-outlined text-xl">download</span>
            Xuất file
          </button>
        </div>
      </div>

      {message.text && (
        <div className={`p-4 rounded-lg ${
          message.type === 'success'
            ? 'bg-[var(--color-admin-success)]/10 text-[var(--color-admin-success)]'
            : message.type === 'info'
            ? 'bg-blue-500/10 text-blue-600'
            : 'bg-[var(--color-admin-danger)]/10 text-[var(--color-admin-danger)]'
        }`}>
          {message.text}
        </div>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-lg text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Tổng lương tháng này</p>
              <p className="text-2xl font-bold mt-1">{formatCurrency(stats.totalSalary)}</p>
            </div>
            <span className="material-symbols-outlined text-4xl opacity-80">account_balance_wallet</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-lg text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Đã thanh toán</p>
              <p className="text-2xl font-bold mt-1">{formatCurrency(stats.paid)}</p>
            </div>
            <span className="material-symbols-outlined text-4xl opacity-80">check_circle</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-6 rounded-lg text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Chờ thanh toán</p>
              <p className="text-2xl font-bold mt-1">{formatCurrency(stats.pending)}</p>
            </div>
            <span className="material-symbols-outlined text-4xl opacity-80">schedule</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-lg text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Số nhân viên</p>
              <p className="text-2xl font-bold mt-1">{stats.employeeCount}</p>
            </div>
            <span className="material-symbols-outlined text-4xl opacity-80">group</span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 items-center bg-white p-4 rounded-lg border border-[var(--color-admin-border-light)]">
        <div className="flex-1 min-w-[200px]">
          <label className="relative block">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-admin-text-light-secondary)]">
              search
            </span>
            <input
              type="text"
              placeholder="Tìm kiếm theo mã NV, tên NV..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-[var(--color-admin-border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-admin-primary)]"
            />
          </label>
        </div>

        <input
          type="month"
          value={filterMonth}
          onChange={(e) => setFilterMonth(e.target.value)}
          className="px-4 py-2 border border-[var(--color-admin-border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-admin-primary)]"
        />

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border border-[var(--color-admin-border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-admin-primary)]"
        >
          <option value="">Tất cả trạng thái</option>
          <option value="pending">Chờ thanh toán</option>
          <option value="paid">Đã thanh toán</option>
          <option value="cancelled">Đã hủy</option>
        </select>

        <input
          type="text"
          placeholder="Lọc theo phòng ban"
          value={filterDepartment}
          onChange={(e) => setFilterDepartment(e.target.value)}
          className="px-4 py-2 border border-[var(--color-admin-border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-admin-primary)]"
        />

        <div className="text-sm text-[var(--color-admin-text-light-secondary)]">
          Tổng: <strong>{filteredSalaries.length}</strong> nhân viên
        </div>
      </div>

      <DataTable
        columns={columns}
        data={filteredSalaries}
        itemsPerPage={10}
        actions={(salary) => (
          <div className="flex gap-2">
            <button
              onClick={() => handleView(salary)}
              className="p-2 text-blue-600 hover:bg-blue-100 rounded"
              title="Xem chi tiết"
            >
              <span className="material-symbols-outlined text-xl">visibility</span>
            </button>
            {salary.status === 'pending' && (
              <button
                onClick={() => handleMarkAsPaid(salary)}
                className="p-2 text-green-600 hover:bg-green-100 rounded"
                title="Đánh dấu đã thanh toán"
              >
                <span className="material-symbols-outlined text-xl">payments</span>
              </button>
            )}
          </div>
        )}
      />

      {/* View/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto m-4">
            <div className="sticky top-0 bg-white border-b border-[var(--color-admin-border-light)] p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-[var(--color-admin-text-light-primary)]">
                  Chi tiết lương - {formData.employee_id}
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--color-admin-text-light-primary)] mb-2">
                    Mã nhân viên
                  </label>
                  <input
                    type="text"
                    value={formData.employee_id}
                    disabled
                    className="w-full px-4 py-2 border border-[var(--color-admin-border-light)] rounded-lg bg-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--color-admin-text-light-primary)] mb-2">
                    Tên nhân viên
                  </label>
                  <input
                    type="text"
                    value={formData.employee_name}
                    disabled
                    className="w-full px-4 py-2 border border-[var(--color-admin-border-light)] rounded-lg bg-gray-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--color-admin-text-light-primary)] mb-2">
                    Chức vụ
                  </label>
                  <input
                    type="text"
                    value={formData.position}
                    disabled
                    className="w-full px-4 py-2 border border-[var(--color-admin-border-light)] rounded-lg bg-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--color-admin-text-light-primary)] mb-2">
                    Phòng ban
                  </label>
                  <input
                    type="text"
                    value={formData.department}
                    disabled
                    className="w-full px-4 py-2 border border-[var(--color-admin-border-light)] rounded-lg bg-gray-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--color-admin-text-light-primary)] mb-2">
                    Tháng
                  </label>
                  <input
                    type="month"
                    value={formData.month}
                    onChange={(e) => handleFormChange('month', e.target.value)}
                    className="w-full px-4 py-2 border border-[var(--color-admin-border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-admin-primary)]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--color-admin-text-light-primary)] mb-2">
                    Trạng thái
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => handleFormChange('status', e.target.value)}
                    className="w-full px-4 py-2 border border-[var(--color-admin-border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-admin-primary)]"
                  >
                    <option value="pending">Chờ thanh toán</option>
                    <option value="paid">Đã thanh toán</option>
                    <option value="cancelled">Đã hủy</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--color-admin-text-light-primary)] mb-2">
                    Lương cơ bản
                  </label>
                  <input
                    type="number"
                    value={formData.base_salary}
                    onChange={(e) => handleFormChange('base_salary', parseFloat(e.target.value) || 0)}
                    disabled
                    className="w-full px-4 py-2 border border-[var(--color-admin-border-light)] rounded-lg bg-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--color-admin-text-light-primary)] mb-2">
                    Hệ số
                  </label>
                  <input
                    type="number"
                    value={formData.coefficient}
                    onChange={(e) => handleFormChange('coefficient', parseFloat(e.target.value) || 1)}
                    disabled
                    step="0.1"
                    className="w-full px-4 py-2 border border-[var(--color-admin-border-light)] rounded-lg bg-gray-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--color-admin-text-light-primary)] mb-2">
                    Thưởng
                  </label>
                  <input
                    type="number"
                    value={formData.bonus}
                    onChange={(e) => handleFormChange('bonus', parseFloat(e.target.value) || 0)}
                    min="0"
                    step="100000"
                    className="w-full px-4 py-2 border border-[var(--color-admin-border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-admin-primary)]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--color-admin-text-light-primary)] mb-2">
                    Khấu trừ
                  </label>
                  <input
                    type="number"
                    value={formData.deduction}
                    onChange={(e) => handleFormChange('deduction', parseFloat(e.target.value) || 0)}
                    min="0"
                    step="100000"
                    className="w-full px-4 py-2 border border-[var(--color-admin-border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-admin-primary)]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--color-admin-text-light-primary)] mb-2">
                  Tổng lương
                </label>
                <input
                  type="text"
                  value={formatCurrency(formData.total_salary)}
                  disabled
                  className="w-full px-4 py-2 border border-[var(--color-admin-border-light)] rounded-lg bg-green-50 font-bold text-green-600"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Công thức: (Lương cơ bản × Hệ số) + Thưởng - Khấu trừ
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--color-admin-text-light-primary)] mb-2">
                  Ngày thanh toán
                </label>
                <input
                  type="date"
                  value={formData.payment_date}
                  onChange={(e) => handleFormChange('payment_date', e.target.value)}
                  className="w-full px-4 py-2 border border-[var(--color-admin-border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-admin-primary)]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--color-admin-text-light-primary)] mb-2">
                  Ghi chú
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => handleFormChange('notes', e.target.value)}
                  rows="3"
                  className="w-full px-4 py-2 border border-[var(--color-admin-border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-admin-primary)]"
                  placeholder="Ghi chú về lương..."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2 border border-[var(--color-admin-border-light)] text-[var(--color-admin-text-light-primary)] rounded-lg hover:bg-gray-50"
                >
                  Đóng
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-[var(--color-admin-primary)] text-white rounded-lg hover:opacity-90"
                >
                  Lưu thông tin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalaryManagement;
