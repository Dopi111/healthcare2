import React, { useEffect, useState } from 'react';
import { DataTable, Badge } from '../../../components/admin';
import FundService from '../../../services/FundService';

const Fund_Management = () => {
  const [funds, setFunds] = useState([]);
  const [filteredFunds, setFilteredFunds] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFund, setEditingFund] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [stats, setStats] = useState(null);
  const [showCharts, setShowCharts] = useState(true);
  const [formData, setFormData] = useState({
    transactionId: '',
    date: new Date().toISOString().split('T')[0],
    type: 'Thu',
    category: 'Khám bệnh',
    amount: 0,
    description: '',
    createdBy: ''
  });

  useEffect(() => {
    loadFunds();
  }, []);

  const loadFunds = async () => {
    try {
      const data = await FundService.getAllFunds();
      setFunds(data || []);
      setFilteredFunds(data || []);
      const statistics = await FundService.getStatistics();
      setStats(statistics);
    } catch (error) {
      console.error('Error loading funds:', error);
      setFunds([]);
      setFilteredFunds([]);
      showMessage('error', 'Không thể tải danh sách quỹ!');
    }
  };

  useEffect(() => {
    let filtered = [...(funds || [])];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(f =>
        f.transactionId.toLowerCase().includes(query) ||
        f.category.toLowerCase().includes(query) ||
        f.description.toLowerCase().includes(query)
      );
    }

    if (filterType) {
      filtered = filtered.filter(f => f.type === filterType);
    }

    setFilteredFunds(filtered);
  }, [searchQuery, filterType, funds]);

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  };

  const handleAdd = () => {
    setEditingFund(null);
    setFormData({
      transactionId: '',
      date: new Date().toISOString().split('T')[0],
      type: 'Thu',
      category: 'Khám bệnh',
      amount: 0,
      description: '',
      createdBy: ''
    });
    setIsModalOpen(true);
  };

  const handleEdit = (fund) => {
    setEditingFund(fund);
    setFormData(fund);
    setIsModalOpen(true);
  };

  const handleDelete = async (fund) => {
    if (!window.confirm(`Bạn có chắc muốn xóa giao dịch "${fund.transactionId}"?`)) {
      return;
    }
    try {
      await FundService.deleteFund(fund.id);
      await loadFunds();
      showMessage('success', 'Xóa giao dịch thành công!');
    } catch (error) {
      console.error('Error deleting fund:', error);
      showMessage('error', error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.transactionId || !formData.amount || formData.amount <= 0) {
      showMessage('error', 'Vui lòng điền đầy đủ thông tin!');
      return;
    }

    try {
      if (editingFund) {
        await FundService.updateFund(editingFund.id, formData);
        showMessage('success', 'Cập nhật giao dịch thành công!');
      } else {
        await FundService.addFund(formData);
        showMessage('success', 'Thêm giao dịch mới thành công!');
      }
      setIsModalOpen(false);
      await loadFunds();
    } catch (error) {
      console.error('Error submitting fund:', error);
      showMessage('error', error.message);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const columns = [
    {
      key: 'transactionId',
      label: 'Mã GD',
      sortable: true,
      className: 'font-medium text-[var(--color-admin-text-light-primary)]'
    },
    {
      key: 'date',
      label: 'Ngày',
      sortable: true
    },
    {
      key: 'type',
      label: 'Loại',
      render: (value) => {
        const variants = {
          'Thu': 'success',
          'Chi': 'danger'
        };
        return <Badge variant={variants[value]}>{value}</Badge>;
      }
    },
    {
      key: 'category',
      label: 'Danh mục',
      sortable: true
    },
    {
      key: 'amount',
      label: 'Số tiền',
      render: (value, row) => (
        <span className={row.type === 'Thu' ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>
          {row.type === 'Thu' ? '+' : '-'}{formatCurrency(value)}
        </span>
      )
    },
    {
      key: 'description',
      label: 'Mô tả'
    }
  ];

  // Prepare chart data
  const getCategoryChartData = () => {
    if (!stats || !stats.categoryStats) return [];
    return Object.entries(stats.categoryStats || {}).map(([category, data]) => ({
      category,
      total: (data?.income || 0) + (data?.expense || 0),
      percentage: (((data?.income || 0) + (data?.expense || 0)) / ((stats.totalIncome || 0) + (stats.totalExpense || 0) || 1) * 100).toFixed(1)
    })).sort((a, b) => b.total - a.total);
  };

  const categoryData = getCategoryChartData();
  const maxCategoryValue = categoryData.length > 0 ? Math.max(...categoryData.map(d => d.total)) : 1;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[var(--color-admin-text-light-primary)]">
            Quản lý Quỹ
          </h2>
          <p className="text-sm text-[var(--color-admin-text-light-secondary)] mt-1">
            Theo dõi thu chi và quỹ tài chính
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
            onClick={() => FundService.exportFunds()}
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
            Thêm giao dịch
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-lg text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Số dư</p>
                <p className="text-2xl font-bold mt-1">{formatCurrency(stats.balance)}</p>
              </div>
              <span className="material-symbols-outlined text-4xl opacity-80">account_balance</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-lg text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Tổng thu</p>
                <p className="text-2xl font-bold mt-1">{formatCurrency(stats.totalIncome)}</p>
              </div>
              <span className="material-symbols-outlined text-4xl opacity-80">trending_up</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-500 to-red-600 p-6 rounded-lg text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Tổng chi</p>
                <p className="text-2xl font-bold mt-1">{formatCurrency(stats.totalExpense)}</p>
              </div>
              <span className="material-symbols-outlined text-4xl opacity-80">trending_down</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-lg text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Giao dịch</p>
                <p className="text-2xl font-bold mt-1">{stats.transactionCount}</p>
              </div>
              <span className="material-symbols-outlined text-4xl opacity-80">receipt_long</span>
            </div>
          </div>
        </div>
      )}

      {/* Charts Section */}
      {showCharts && stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Category Distribution Chart */}
          <div className="bg-white p-6 rounded-lg border border-[var(--color-admin-border-light)]">
            <h3 className="text-lg font-bold text-[var(--color-admin-text-light-primary)] mb-4">
              Phân bố theo danh mục
            </h3>
            <div className="space-y-3">
              {categoryData.map((item, index) => (
                <div key={index}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium">{item.category}</span>
                    <span className="text-[var(--color-admin-text-light-secondary)]">
                      {formatCurrency(item.total)} ({item.percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${(item.total / maxCategoryValue) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Income vs Expense Comparison */}
          <div className="bg-white p-6 rounded-lg border border-[var(--color-admin-border-light)]">
            <h3 className="text-lg font-bold text-[var(--color-admin-text-light-primary)] mb-4">
              So sánh thu chi
            </h3>
            <div className="flex items-end justify-around h-64 border-l-2 border-b-2 border-gray-300 p-4">
              <div className="flex flex-col items-center gap-2 flex-1">
                <div className="w-full flex items-end justify-center" style={{ height: '200px' }}>
                  <div
                    className="bg-gradient-to-t from-green-500 to-green-400 rounded-t-lg transition-all duration-500 w-20 flex items-end justify-center pb-2"
                    style={{
                      height: `${(stats.totalIncome / Math.max(stats.totalIncome, stats.totalExpense)) * 100}%`
                    }}
                  >
                    <span className="text-white text-xs font-bold writing-mode-vertical-rl transform rotate-180">
                      Thu
                    </span>
                  </div>
                </div>
                <p className="text-sm font-medium text-green-600">{formatCurrency(stats.totalIncome)}</p>
              </div>

              <div className="flex flex-col items-center gap-2 flex-1">
                <div className="w-full flex items-end justify-center" style={{ height: '200px' }}>
                  <div
                    className="bg-gradient-to-t from-red-500 to-red-400 rounded-t-lg transition-all duration-500 w-20 flex items-end justify-center pb-2"
                    style={{
                      height: `${(stats.totalExpense / Math.max(stats.totalIncome, stats.totalExpense)) * 100}%`
                    }}
                  >
                    <span className="text-white text-xs font-bold writing-mode-vertical-rl transform rotate-180">
                      Chi
                    </span>
                  </div>
                </div>
                <p className="text-sm font-medium text-red-600">{formatCurrency(stats.totalExpense)}</p>
              </div>

              <div className="flex flex-col items-center gap-2 flex-1">
                <div className="w-full flex items-end justify-center" style={{ height: '200px' }}>
                  <div
                    className={`bg-gradient-to-t ${stats.balance >= 0 ? 'from-blue-500 to-blue-400' : 'from-orange-500 to-orange-400'} rounded-t-lg transition-all duration-500 w-20 flex items-end justify-center pb-2`}
                    style={{
                      height: `${(Math.abs(stats.balance) / Math.max(stats.totalIncome, stats.totalExpense)) * 100}%`
                    }}
                  >
                    <span className="text-white text-xs font-bold writing-mode-vertical-rl transform rotate-180">
                      Lãi
                    </span>
                  </div>
                </div>
                <p className={`text-sm font-medium ${stats.balance >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
                  {formatCurrency(stats.balance)}
                </p>
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
              placeholder="Tìm kiếm theo mã GD, danh mục, mô tả..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-[var(--color-admin-border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-admin-primary)]"
            />
          </label>
        </div>

        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-4 py-2 border border-[var(--color-admin-border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-admin-primary)]"
        >
          <option value="">Tất cả loại</option>
          <option value="Thu">Thu</option>
          <option value="Chi">Chi</option>
        </select>

        <div className="text-sm text-[var(--color-admin-text-light-secondary)]">
          Tổng: <strong>{filteredFunds.length}</strong> giao dịch
        </div>
      </div>

      <DataTable
        columns={columns}
        data={filteredFunds}
        itemsPerPage={10}
        actions={(fund) => (
          <div className="flex gap-2">
            <button
              onClick={() => handleEdit(fund)}
              className="p-2 text-[var(--color-admin-primary)] hover:bg-[var(--color-admin-primary)]/10 rounded"
              title="Sửa"
            >
              <span className="material-symbols-outlined text-xl">edit</span>
            </button>
            <button
              onClick={() => handleDelete(fund)}
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
                  {editingFund ? 'Cập nhật giao dịch' : 'Thêm giao dịch mới'}
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
                    Mã giao dịch <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.transactionId}
                    onChange={(e) => setFormData({ ...formData, transactionId: e.target.value })}
                    disabled={!!editingFund}
                    required
                    placeholder="TXN001"
                    className="w-full px-4 py-2 border border-[var(--color-admin-border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-admin-primary)] disabled:bg-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--color-admin-text-light-primary)] mb-2">
                    Ngày giao dịch <span className="text-red-500">*</span>
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
                    Loại giao dịch <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-4 py-2 border border-[var(--color-admin-border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-admin-primary)]"
                  >
                    <option value="Thu">Thu</option>
                    <option value="Chi">Chi</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--color-admin-text-light-primary)] mb-2">
                    Danh mục <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2 border border-[var(--color-admin-border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-admin-primary)]"
                  >
                    <option value="Khám bệnh">Khám bệnh</option>
                    <option value="Xét nghiệm">Xét nghiệm</option>
                    <option value="Phẫu thuật">Phẫu thuật</option>
                    <option value="Nội trú">Nội trú</option>
                    <option value="Thuốc men">Thuốc men</option>
                    <option value="Lương">Lương</option>
                    <option value="Thiết bị">Thiết bị</option>
                    <option value="Điện nước">Điện nước</option>
                    <option value="Bảo trì">Bảo trì</option>
                    <option value="Khác">Khác</option>
                  </select>
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
                  Người tạo
                </label>
                <input
                  type="text"
                  value={formData.createdBy}
                  onChange={(e) => setFormData({ ...formData, createdBy: e.target.value })}
                  placeholder="Kế toán Nguyễn Văn A"
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
                  placeholder="Mô tả giao dịch..."
                />
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
                  {editingFund ? 'Cập nhật' : 'Thêm mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Fund_Management;
