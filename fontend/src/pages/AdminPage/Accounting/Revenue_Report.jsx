import React, { useEffect, useState } from 'react';
import { DataTable, Badge } from '../../../components/admin';
import RevenueService from '../../../services/RevenueService';

const Revenue_Report = () => {
  const [revenues, setRevenues] = useState([]);
  const [filteredRevenues, setFilteredRevenues] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMonth, setFilterMonth] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRevenue, setEditingRevenue] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [stats, setStats] = useState(null);
  const [showCharts, setShowCharts] = useState(true);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    category: '',
    patient_count: 0,
    revenue_amount: 0,
    month: new Date().toISOString().slice(0, 7)
  });

  useEffect(() => {
    loadRevenues();
  }, []);

  const loadRevenues = async () => {
    try {
      const data = await RevenueService.getAllRevenues();
      setRevenues(data || []);
      setFilteredRevenues(data || []);
      const statistics = await RevenueService.getStatistics();
      setStats(statistics);
    } catch (error) {
      console.error('Error loading revenues:', error);
      setRevenues([]);
      setFilteredRevenues([]);
      showMessage('error', 'Không thể tải danh sách doanh thu!');
    }
  };

  useEffect(() => {
    let filtered = [...(revenues || [])];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(r =>
        r.category?.toLowerCase().includes(query) ||
        r.month?.toLowerCase().includes(query)
      );
    }

    if (filterMonth) {
      filtered = filtered.filter(r => r.month === filterMonth);
    }

    setFilteredRevenues(filtered);
  }, [searchQuery, filterMonth, revenues]);

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  };

  const handleAdd = () => {
    setEditingRevenue(null);
    setFormData({
      date: new Date().toISOString().split('T')[0],
      category: '',
      patient_count: 0,
      revenue_amount: 0,
      month: new Date().toISOString().slice(0, 7)
    });
    setIsModalOpen(true);
  };

  const handleEdit = (revenue) => {
    setEditingRevenue(revenue);
    setFormData(revenue);
    setIsModalOpen(true);
  };

  const handleDelete = async (revenue) => {
    if (!window.confirm(`Bạn có chắc muốn xóa bản ghi doanh thu này?`)) {
      return;
    }
    try {
      await RevenueService.deleteRevenue(revenue.id);
      await loadRevenues();
      showMessage('success', 'Xóa bản ghi thành công!');
    } catch (error) {
      console.error('Error deleting revenue:', error);
      showMessage('error', error.message || 'Lỗi khi xóa bản ghi!');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.category || !formData.revenue_amount || formData.revenue_amount <= 0) {
      showMessage('error', 'Vui lòng điền đầy đủ thông tin!');
      return;
    }

    try {
      if (editingRevenue) {
        await RevenueService.updateRevenue(editingRevenue.id, formData);
        showMessage('success', 'Cập nhật doanh thu thành công!');
      } else {
        await RevenueService.addRevenue(formData);
        showMessage('success', 'Thêm doanh thu mới thành công!');
      }
      setIsModalOpen(false);
      await loadRevenues();
    } catch (error) {
      console.error('Error submitting revenue:', error);
      showMessage('error', error.message || 'Có lỗi xảy ra!');
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const columns = [
    {
      key: 'date',
      label: 'Ngày',
      sortable: true
    },
    {
      key: 'category',
      label: 'Danh mục',
      sortable: true,
      className: 'font-medium text-[var(--color-admin-text-light-primary)]'
    },
    {
      key: 'patient_count',
      label: 'Số BN',
      sortable: true,
      render: (value) => (
        <span className="font-medium text-blue-600">{value || 0}</span>
      )
    },
    {
      key: 'revenue_amount',
      label: 'Doanh thu',
      sortable: true,
      render: (value) => (
        <span className="text-green-600 font-bold">
          {formatCurrency(value || 0)}
        </span>
      )
    },
    {
      key: 'month',
      label: 'Tháng',
      sortable: true
    }
  ];

  // Prepare chart data
  const getCategoryChartData = () => {
    if (!revenues || revenues.length === 0) return [];
    const categoryMap = {};
    revenues.forEach(r => {
      const cat = r.category || 'Khác';
      if (!categoryMap[cat]) {
        categoryMap[cat] = 0;
      }
      categoryMap[cat] += parseFloat(r.revenue_amount || 0);
    });
    return Object.entries(categoryMap)
      .map(([category, total]) => ({
        category,
        total,
        percentage: stats ? ((total / stats.totalRevenue) * 100).toFixed(1) : 0
      }))
      .sort((a, b) => b.total - a.total);
  };

  const categoryData = getCategoryChartData();
  const maxCategoryValue = categoryData.length > 0 ? Math.max(...categoryData.map(d => d.total)) : 1;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[var(--color-admin-text-light-primary)]">
            Quản lý Doanh thu Khám & Chữa Bệnh
          </h2>
          <p className="text-sm text-[var(--color-admin-text-light-secondary)] mt-1">
            Theo dõi doanh thu từ khám và chữa bệnh
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
            onClick={() => RevenueService.exportRevenues && RevenueService.exportRevenues()}
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
            Thêm doanh thu
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
          <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-lg text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Tổng doanh thu</p>
                <p className="text-2xl font-bold mt-1">{formatCurrency(stats.totalRevenue || 0)}</p>
              </div>
              <span className="material-symbols-outlined text-4xl opacity-80">trending_up</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-lg text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Doanh thu trung bình</p>
                <p className="text-2xl font-bold mt-1">{formatCurrency(stats.averageRevenue || 0)}</p>
              </div>
              <span className="material-symbols-outlined text-4xl opacity-80">bar_chart</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-lg text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Số lượng bản ghi</p>
                <p className="text-2xl font-bold mt-1">{stats.recordCount || 0}</p>
              </div>
              <span className="material-symbols-outlined text-4xl opacity-80">receipt_long</span>
            </div>
          </div>
        </div>
      )}

      {/* Charts Section */}
      {showCharts && categoryData.length > 0 && (
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
                      className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${(item.total / maxCategoryValue) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Monthly Trend Visualization */}
          <div className="bg-white p-6 rounded-lg border border-[var(--color-admin-border-light)]">
            <h3 className="text-lg font-bold text-[var(--color-admin-text-light-primary)] mb-4">
              Thống kê doanh thu
            </h3>
            <div className="flex items-end justify-around h-64 border-l-2 border-b-2 border-gray-300 p-4">
              <div className="flex flex-col items-center gap-2 flex-1">
                <div className="w-full flex items-end justify-center" style={{ height: '200px' }}>
                  <div
                    className="bg-gradient-to-t from-green-500 to-green-400 rounded-t-lg transition-all duration-500 w-20 flex items-end justify-center pb-2"
                    style={{ height: '80%' }}
                  >
                    <span className="text-white text-xs font-bold writing-mode-vertical-rl transform rotate-180">
                      Tổng
                    </span>
                  </div>
                </div>
                <p className="text-sm font-medium text-green-600">{formatCurrency(stats?.totalRevenue || 0)}</p>
              </div>

              <div className="flex flex-col items-center gap-2 flex-1">
                <div className="w-full flex items-end justify-center" style={{ height: '200px' }}>
                  <div
                    className="bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg transition-all duration-500 w-20 flex items-end justify-center pb-2"
                    style={{ height: '50%' }}
                  >
                    <span className="text-white text-xs font-bold writing-mode-vertical-rl transform rotate-180">
                      TB
                    </span>
                  </div>
                </div>
                <p className="text-sm font-medium text-blue-600">{formatCurrency(stats?.averageRevenue || 0)}</p>
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
              placeholder="Tìm kiếm theo danh mục, tháng..."
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

        <div className="text-sm text-[var(--color-admin-text-light-secondary)]">
          Tổng: <strong>{filteredRevenues.length}</strong> bản ghi
        </div>
      </div>

      <DataTable
        columns={columns}
        data={filteredRevenues}
        itemsPerPage={10}
        actions={(revenue) => (
          <div className="flex gap-2">
            <button
              onClick={() => handleEdit(revenue)}
              className="p-2 text-[var(--color-admin-primary)] hover:bg-[var(--color-admin-primary)]/10 rounded"
              title="Sửa"
            >
              <span className="material-symbols-outlined text-xl">edit</span>
            </button>
            <button
              onClick={() => handleDelete(revenue)}
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
                  {editingRevenue ? 'Cập nhật doanh thu' : 'Thêm doanh thu mới'}
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

                <div>
                  <label className="block text-sm font-medium text-[var(--color-admin-text-light-primary)] mb-2">
                    Danh mục <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    required
                    placeholder="Khám ngoại trú, Nội trú..."
                    className="w-full px-4 py-2 border border-[var(--color-admin-border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-admin-primary)]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--color-admin-text-light-primary)] mb-2">
                    Số bệnh nhân <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.patient_count}
                    onChange={(e) => setFormData({ ...formData, patient_count: parseInt(e.target.value) || 0 })}
                    required
                    min="0"
                    className="w-full px-4 py-2 border border-[var(--color-admin-border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-admin-primary)]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--color-admin-text-light-primary)] mb-2">
                    Doanh thu <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.revenue_amount}
                    onChange={(e) => setFormData({ ...formData, revenue_amount: parseFloat(e.target.value) || 0 })}
                    required
                    min="0"
                    step="1000"
                    className="w-full px-4 py-2 border border-[var(--color-admin-border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-admin-primary)]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--color-admin-text-light-primary)] mb-2">
                  Tháng <span className="text-red-500">*</span>
                </label>
                <input
                  type="month"
                  value={formData.month}
                  onChange={(e) => setFormData({ ...formData, month: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-[var(--color-admin-border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-admin-primary)]"
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
                  {editingRevenue ? 'Cập nhật' : 'Thêm mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Revenue_Report;
