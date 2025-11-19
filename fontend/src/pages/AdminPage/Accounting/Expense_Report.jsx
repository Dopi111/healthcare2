import React, { useEffect, useState } from 'react';
import { DataTable, Badge } from '../../../components/admin';
import ExpenseService from '../../../services/ExpenseService';

const Expense_Report = () => {
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [stats, setStats] = useState(null);
  const [showCharts, setShowCharts] = useState(true);
  const [formData, setFormData] = useState({
    expense_code: '',
    date: new Date().toISOString().split('T')[0],
    category: '',
    department: '',
    amount: 0,
    description: '',
    approved_by: '',
    status: 'Chờ duyệt'
  });

  useEffect(() => {
    loadExpenses();
  }, []);

  const loadExpenses = async () => {
    try {
      const data = await ExpenseService.getAllExpenses();
      setExpenses(data || []);
      setFilteredExpenses(data || []);
      const statistics = await ExpenseService.getStatistics();
      setStats(statistics);
    } catch (error) {
      console.error('Error loading expenses:', error);
      setExpenses([]);
      setFilteredExpenses([]);
      showMessage('error', 'Không thể tải danh sách chi phí!');
    }
  };

  useEffect(() => {
    let filtered = [...(expenses || [])];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(e =>
        e.expense_code?.toLowerCase().includes(query) ||
        e.category?.toLowerCase().includes(query) ||
        e.department?.toLowerCase().includes(query) ||
        e.description?.toLowerCase().includes(query)
      );
    }

    if (filterStatus) {
      filtered = filtered.filter(e => e.status === filterStatus);
    }

    setFilteredExpenses(filtered);
  }, [searchQuery, filterStatus, expenses]);

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  };

  const handleAdd = () => {
    setEditingExpense(null);
    const autoCode = `EXP${Date.now().toString().slice(-8)}`;
    setFormData({
      expense_code: autoCode,
      date: new Date().toISOString().split('T')[0],
      category: '',
      department: '',
      amount: 0,
      description: '',
      approved_by: '',
      status: 'Chờ duyệt'
    });
    setIsModalOpen(true);
  };

  const handleEdit = (expense) => {
    setEditingExpense(expense);
    setFormData(expense);
    setIsModalOpen(true);
  };

  const handleDelete = async (expense) => {
    if (!window.confirm(`Bạn có chắc muốn xóa chi phí "${expense.expense_code}"?`)) {
      return;
    }
    try {
      await ExpenseService.deleteExpense(expense.id);
      await loadExpenses();
      showMessage('success', 'Xóa chi phí thành công!');
    } catch (error) {
      console.error('Error deleting expense:', error);
      showMessage('error', error.message || 'Lỗi khi xóa chi phí!');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.expense_code || !formData.amount || formData.amount <= 0) {
      showMessage('error', 'Vui lòng điền đầy đủ thông tin!');
      return;
    }

    try {
      if (editingExpense) {
        await ExpenseService.updateExpense(editingExpense.id, formData);
        showMessage('success', 'Cập nhật chi phí thành công!');
      } else {
        await ExpenseService.addExpense(formData);
        showMessage('success', 'Thêm chi phí mới thành công!');
      }
      setIsModalOpen(false);
      await loadExpenses();
    } catch (error) {
      console.error('Error submitting expense:', error);
      showMessage('error', error.message || 'Có lỗi xảy ra!');
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const columns = [
    {
      key: 'expense_code',
      label: 'Mã chi phí',
      sortable: true,
      className: 'font-medium text-[var(--color-admin-text-light-primary)]'
    },
    {
      key: 'date',
      label: 'Ngày',
      sortable: true
    },
    {
      key: 'category',
      label: 'Danh mục',
      sortable: true
    },
    {
      key: 'department',
      label: 'Phòng ban',
      sortable: true
    },
    {
      key: 'amount',
      label: 'Số tiền',
      sortable: true,
      render: (value) => (
        <span className="text-red-600 font-bold">
          {formatCurrency(value || 0)}
        </span>
      )
    },
    {
      key: 'status',
      label: 'Trạng thái',
      render: (value) => {
        const variants = {
          'Chờ duyệt': 'warning',
          'Đã chi': 'success',
          'Từ chối': 'danger'
        };
        return <Badge variant={variants[value] || 'default'}>{value}</Badge>;
      }
    },
    {
      key: 'approved_by',
      label: 'Người duyệt'
    }
  ];

  // Prepare chart data
  const getDepartmentChartData = () => {
    if (!expenses || expenses.length === 0) return [];
    const deptMap = {};
    expenses.forEach(e => {
      const dept = e.department || 'Khác';
      if (!deptMap[dept]) {
        deptMap[dept] = 0;
      }
      deptMap[dept] += parseFloat(e.amount || 0);
    });
    return Object.entries(deptMap)
      .map(([department, total]) => ({
        department,
        total,
        percentage: stats ? ((total / stats.totalExpense) * 100).toFixed(1) : 0
      }))
      .sort((a, b) => b.total - a.total);
  };

  const departmentData = getDepartmentChartData();
  const maxDeptValue = departmentData.length > 0 ? Math.max(...departmentData.map(d => d.total)) : 1;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[var(--color-admin-text-light-primary)]">
            Quản lý Chi phí Hoạt động
          </h2>
          <p className="text-sm text-[var(--color-admin-text-light-secondary)] mt-1">
            Theo dõi và quản lý chi phí hoạt động
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowCharts(!showCharts)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-[var(--color-admin-border-light)] text-[var(--color-admin-text-light-primary)] rounded-lg hover:bg-gray-50"
          >
            <span className="material-symbols-outlined text-xl">
              {showCharts ? 'table_chart' : 'bar_chart'}
            </span>
            {showCharts ? 'Ẩn biểu đồ' : 'Hiện biểu đồ'}
          </button>
          <button
            onClick={() => ExpenseService.exportExpenses && ExpenseService.exportExpenses()}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-[var(--color-admin-border-light)] text-[var(--color-admin-text-light-primary)] rounded-lg hover:bg-gray-50"
          >
            <span className="material-symbols-outlined text-xl">download</span>
            Xuất file
          </button>
          <button
            onClick={handleAdd}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-admin-primary)] text-white rounded-lg hover:opacity-90"
          >
            <span className="material-symbols-outlined text-xl">add</span>
            Thêm chi phí
          </button>
        </div>
      </div>

      {message.text && (
        <div className={`p-4 rounded-lg ${
          message.type === 'success'
            ? 'bg-[var(--color-admin-success)]/10 text-[var(--color-admin-success)]'
            : 'bg-[var(--color-admin-danger)]/10 text-[var(--color-admin-danger)]'
        }`}>
          {message.text}
        </div>
      )}

      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-red-500 to-red-600 p-6 rounded-lg text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Tổng chi phí</p>
                <p className="text-2xl font-bold mt-1">{formatCurrency(stats.totalExpense || 0)}</p>
              </div>
              <span className="material-symbols-outlined text-4xl opacity-80">payments</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-lg text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Đã chi</p>
                <p className="text-2xl font-bold mt-1">{formatCurrency(stats.paidExpense || 0)}</p>
              </div>
              <span className="material-symbols-outlined text-4xl opacity-80">check_circle</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-6 rounded-lg text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Chờ duyệt</p>
                <p className="text-2xl font-bold mt-1">{formatCurrency(stats.pendingExpense || 0)}</p>
              </div>
              <span className="material-symbols-outlined text-4xl opacity-80">pending</span>
            </div>
          </div>
        </div>
      )}

      {/* Charts Section */}
      {showCharts && departmentData.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Department Distribution Chart */}
          <div className="bg-white p-6 rounded-lg border border-[var(--color-admin-border-light)]">
            <h3 className="text-lg font-bold text-[var(--color-admin-text-light-primary)] mb-4">
              Chi phí theo phòng ban
            </h3>
            <div className="space-y-3">
              {departmentData.map((item, index) => (
                <div key={index}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium">{item.department}</span>
                    <span className="text-[var(--color-admin-text-light-secondary)]">
                      {formatCurrency(item.total)} ({item.percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-red-500 to-orange-500 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${(item.total / maxDeptValue) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Status Comparison */}
          <div className="bg-white p-6 rounded-lg border border-[var(--color-admin-border-light)]">
            <h3 className="text-lg font-bold text-[var(--color-admin-text-light-primary)] mb-4">
              Trạng thái chi phí
            </h3>
            <div className="flex items-end justify-around h-64 border-l-2 border-b-2 border-gray-300 p-4">
              <div className="flex flex-col items-center gap-2 flex-1">
                <div className="w-full flex items-end justify-center" style={{ height: '200px' }}>
                  <div
                    className="bg-gradient-to-t from-red-500 to-red-400 rounded-t-lg transition-all duration-500 w-20 flex items-end justify-center pb-2"
                    style={{
                      height: `${stats?.totalExpense > 0 ? (stats.totalExpense / Math.max(stats.totalExpense, stats.paidExpense, stats.pendingExpense)) * 100 : 0}%`
                    }}
                  >
                    <span className="text-white text-xs font-bold writing-mode-vertical-rl transform rotate-180">
                      Tổng
                    </span>
                  </div>
                </div>
                <p className="text-sm font-medium text-red-600">{formatCurrency(stats?.totalExpense || 0)}</p>
              </div>

              <div className="flex flex-col items-center gap-2 flex-1">
                <div className="w-full flex items-end justify-center" style={{ height: '200px' }}>
                  <div
                    className="bg-gradient-to-t from-green-500 to-green-400 rounded-t-lg transition-all duration-500 w-20 flex items-end justify-center pb-2"
                    style={{
                      height: `${stats?.paidExpense > 0 ? (stats.paidExpense / Math.max(stats.totalExpense, stats.paidExpense, stats.pendingExpense)) * 100 : 0}%`
                    }}
                  >
                    <span className="text-white text-xs font-bold writing-mode-vertical-rl transform rotate-180">
                      Đã chi
                    </span>
                  </div>
                </div>
                <p className="text-sm font-medium text-green-600">{formatCurrency(stats?.paidExpense || 0)}</p>
              </div>

              <div className="flex flex-col items-center gap-2 flex-1">
                <div className="w-full flex items-end justify-center" style={{ height: '200px' }}>
                  <div
                    className="bg-gradient-to-t from-orange-500 to-orange-400 rounded-t-lg transition-all duration-500 w-20 flex items-end justify-center pb-2"
                    style={{
                      height: `${stats?.pendingExpense > 0 ? (stats.pendingExpense / Math.max(stats.totalExpense, stats.paidExpense, stats.pendingExpense)) * 100 : 0}%`
                    }}
                  >
                    <span className="text-white text-xs font-bold writing-mode-vertical-rl transform rotate-180">
                      Chờ
                    </span>
                  </div>
                </div>
                <p className="text-sm font-medium text-orange-600">{formatCurrency(stats?.pendingExpense || 0)}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-4 items-center bg-white p-4 rounded-lg border border-[var(--color-admin-border-light)]">
        <div className="flex-1 min-w-[200px]">
          <label className="relative block">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-admin-text-light-secondary)]">
              search
            </span>
            <input
              type="text"
              placeholder="Tìm kiếm theo mã, danh mục, phòng ban..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-[var(--color-admin-border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-admin-primary)]"
            />
          </label>
        </div>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border border-[var(--color-admin-border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-admin-primary)]"
        >
          <option value="">Tất cả trạng thái</option>
          <option value="Chờ duyệt">Chờ duyệt</option>
          <option value="Đã chi">Đã chi</option>
          <option value="Từ chối">Từ chối</option>
        </select>

        <div className="text-sm text-[var(--color-admin-text-light-secondary)]">
          Tổng: <strong>{filteredExpenses.length}</strong> chi phí
        </div>
      </div>

      <DataTable
        columns={columns}
        data={filteredExpenses}
        itemsPerPage={10}
        actions={(expense) => (
          <div className="flex gap-2">
            <button
              onClick={() => handleEdit(expense)}
              className="p-2 text-[var(--color-admin-primary)] hover:bg-[var(--color-admin-primary)]/10 rounded"
              title="Sửa"
            >
              <span className="material-symbols-outlined text-xl">edit</span>
            </button>
            <button
              onClick={() => handleDelete(expense)}
              className="p-2 text-[var(--color-admin-danger)] hover:bg-[var(--color-admin-danger)]/10 rounded"
              title="Xóa"
            >
              <span className="material-symbols-outlined text-xl">delete</span>
            </button>
          </div>
        )}
      />

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4">
            <div className="sticky top-0 bg-white border-b border-[var(--color-admin-border-light)] p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-[var(--color-admin-text-light-primary)]">
                  {editingExpense ? 'Cập nhật chi phí' : 'Thêm chi phí mới'}
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
                    Mã chi phí <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.expense_code}
                    onChange={(e) => setFormData({ ...formData, expense_code: e.target.value })}
                    disabled={!!editingExpense}
                    required
                    placeholder="EXP001"
                    className="w-full px-4 py-2 border border-[var(--color-admin-border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-admin-primary)] disabled:bg-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--color-admin-text-light-primary)] mb-2">
                    Ngày <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-[var(--color-admin-border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-admin-primary)]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--color-admin-text-light-primary)] mb-2">
                    Danh mục <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    required
                    placeholder="Lương, Thiết bị, Vật tư..."
                    className="w-full px-4 py-2 border border-[var(--color-admin-border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-admin-primary)]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--color-admin-text-light-primary)] mb-2">
                    Phòng ban <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    required
                    placeholder="Khoa Nội, Khoa Ngoại..."
                    className="w-full px-4 py-2 border border-[var(--color-admin-border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-admin-primary)]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--color-admin-text-light-primary)] mb-2">
                  Số tiền <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                  required
                  min="0"
                  step="1000"
                  className="w-full px-4 py-2 border border-[var(--color-admin-border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-admin-primary)]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--color-admin-text-light-primary)] mb-2">
                  Mô tả
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows="3"
                  className="w-full px-4 py-2 border border-[var(--color-admin-border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-admin-primary)]"
                  placeholder="Mô tả chi phí..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--color-admin-text-light-primary)] mb-2">
                    Người duyệt
                  </label>
                  <input
                    type="text"
                    value={formData.approved_by}
                    onChange={(e) => setFormData({ ...formData, approved_by: e.target.value })}
                    placeholder="Giám đốc, Phó giám đốc..."
                    className="w-full px-4 py-2 border border-[var(--color-admin-border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-admin-primary)]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--color-admin-text-light-primary)] mb-2">
                    Trạng thái <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-4 py-2 border border-[var(--color-admin-border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-admin-primary)]"
                  >
                    <option value="Chờ duyệt">Chờ duyệt</option>
                    <option value="Đã chi">Đã chi</option>
                    <option value="Từ chối">Từ chối</option>
                  </select>
                </div>
              </div>

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
                  {editingExpense ? 'Cập nhật' : 'Thêm mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Expense_Report;
