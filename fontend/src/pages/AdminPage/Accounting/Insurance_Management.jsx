import React, { useEffect, useState } from 'react';
import { DataTable, Badge } from '../../../components/admin';
import InsuranceService from '../../../services/InsuranceService';

const Insurance_Management = () => {
  const [insurances, setInsurances] = useState([]);
  const [filteredInsurances, setFilteredInsurances] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingInsurance, setEditingInsurance] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [stats, setStats] = useState(null);
  const [showCharts, setShowCharts] = useState(true);
  const [formData, setFormData] = useState({
    claim_code: '',
    patient_code: '',
    patient_name: '',
    insurance_card: '',
    insurance_type: '',
    visit_date: new Date().toISOString().split('T')[0],
    total_amount: 0,
    insurance_covered: 0,
    patient_pay: 0,
    status: 'Chờ duyệt',
    notes: ''
  });

  useEffect(() => {
    loadInsurances();
  }, []);

  const loadInsurances = async () => {
    try {
      const data = await InsuranceService.getAllInsurances();
      setInsurances(data || []);
      setFilteredInsurances(data || []);
      const statistics = await InsuranceService.getStatistics();
      setStats(statistics);
    } catch (error) {
      console.error('Error loading insurances:', error);
      setInsurances([]);
      setFilteredInsurances([]);
      showMessage('error', 'Không thể tải danh sách bảo hiểm!');
    }
  };

  useEffect(() => {
    let filtered = [...(insurances || [])];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(i =>
        i.claim_code?.toLowerCase().includes(query) ||
        i.patient_code?.toLowerCase().includes(query) ||
        i.patient_name?.toLowerCase().includes(query) ||
        i.insurance_card?.toLowerCase().includes(query)
      );
    }

    if (filterStatus) {
      filtered = filtered.filter(i => i.status === filterStatus);
    }

    setFilteredInsurances(filtered);
  }, [searchQuery, filterStatus, insurances]);

  useEffect(() => {
    // Auto-calculate patient_pay when total_amount or insurance_covered changes
    const total = parseFloat(formData.total_amount) || 0;
    const covered = parseFloat(formData.insurance_covered) || 0;
    const patientPay = Math.max(0, total - covered);
    if (formData.patient_pay !== patientPay) {
      setFormData(prev => ({ ...prev, patient_pay: patientPay }));
    }
  }, [formData.total_amount, formData.insurance_covered]);

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  };

  const handleAdd = () => {
    setEditingInsurance(null);
    const autoCode = `CLM${Date.now().toString().slice(-8)}`;
    setFormData({
      claim_code: autoCode,
      patient_code: '',
      patient_name: '',
      insurance_card: '',
      insurance_type: '',
      visit_date: new Date().toISOString().split('T')[0],
      total_amount: 0,
      insurance_covered: 0,
      patient_pay: 0,
      status: 'Chờ duyệt',
      notes: ''
    });
    setIsModalOpen(true);
  };

  const handleEdit = (insurance) => {
    setEditingInsurance(insurance);
    setFormData(insurance);
    setIsModalOpen(true);
  };

  const handleDelete = async (insurance) => {
    if (!window.confirm(`Bạn có chắc muốn xóa yêu cầu "${insurance.claim_code}"?`)) {
      return;
    }
    try {
      await InsuranceService.deleteInsurance(insurance.id);
      await loadInsurances();
      showMessage('success', 'Xóa yêu cầu thành công!');
    } catch (error) {
      console.error('Error deleting insurance:', error);
      showMessage('error', error.message || 'Lỗi khi xóa yêu cầu!');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.claim_code || !formData.patient_code || !formData.total_amount || formData.total_amount <= 0) {
      showMessage('error', 'Vui lòng điền đầy đủ thông tin!');
      return;
    }

    try {
      if (editingInsurance) {
        await InsuranceService.updateInsurance(editingInsurance.id, formData);
        showMessage('success', 'Cập nhật yêu cầu thành công!');
      } else {
        await InsuranceService.addInsurance(formData);
        showMessage('success', 'Thêm yêu cầu mới thành công!');
      }
      setIsModalOpen(false);
      await loadInsurances();
    } catch (error) {
      console.error('Error submitting insurance:', error);
      showMessage('error', error.message || 'Có lỗi xảy ra!');
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const columns = [
    {
      key: 'claim_code',
      label: 'Mã yêu cầu',
      sortable: true,
      className: 'font-medium text-[var(--color-admin-text-light-primary)]'
    },
    {
      key: 'patient_code',
      label: 'Mã BN',
      sortable: true
    },
    {
      key: 'patient_name',
      label: 'Tên BN',
      sortable: true
    },
    {
      key: 'insurance_card',
      label: 'Số thẻ BH'
    },
    {
      key: 'insurance_type',
      label: 'Loại BH',
      sortable: true
    },
    {
      key: 'visit_date',
      label: 'Ngày khám',
      sortable: true
    },
    {
      key: 'total_amount',
      label: 'Tổng tiền',
      sortable: true,
      render: (value) => (
        <span className="font-bold text-blue-600">
          {formatCurrency(value || 0)}
        </span>
      )
    },
    {
      key: 'insurance_covered',
      label: 'BH chi trả',
      sortable: true,
      render: (value) => (
        <span className="font-bold text-green-600">
          {formatCurrency(value || 0)}
        </span>
      )
    },
    {
      key: 'patient_pay',
      label: 'BN trả',
      sortable: true,
      render: (value) => (
        <span className="font-bold text-orange-600">
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
          'Đã duyệt': 'success',
          'Từ chối': 'danger'
        };
        return <Badge variant={variants[value] || 'default'}>{value}</Badge>;
      }
    }
  ];

  // Prepare chart data
  const getInsuranceTypeChartData = () => {
    if (!insurances || insurances.length === 0) return [];
    const typeMap = {};
    insurances.forEach(i => {
      const type = i.insurance_type || 'Khác';
      if (!typeMap[type]) {
        typeMap[type] = { covered: 0, count: 0 };
      }
      typeMap[type].covered += parseFloat(i.insurance_covered || 0);
      typeMap[type].count += 1;
    });
    return Object.entries(typeMap)
      .map(([type, data]) => ({
        type,
        covered: data.covered,
        count: data.count,
        percentage: stats ? ((data.covered / stats.totalInsuranceCovered) * 100).toFixed(1) : 0
      }))
      .sort((a, b) => b.covered - a.covered);
  };

  const typeData = getInsuranceTypeChartData();
  const maxTypeValue = typeData.length > 0 ? Math.max(...typeData.map(d => d.covered)) : 1;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[var(--color-admin-text-light-primary)]">
            Quản lý Thanh toán Bảo hiểm
          </h2>
          <p className="text-sm text-[var(--color-admin-text-light-secondary)] mt-1">
            Theo dõi và quản lý thanh toán bảo hiểm
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
            onClick={() => InsuranceService.exportInsurances && InsuranceService.exportInsurances()}
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
            Thêm yêu cầu
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
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-lg text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Tổng số yêu cầu</p>
                <p className="text-2xl font-bold mt-1">{stats.totalClaims || 0}</p>
              </div>
              <span className="material-symbols-outlined text-4xl opacity-80">description</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-lg text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Tổng tiền BH chi trả</p>
                <p className="text-2xl font-bold mt-1">{formatCurrency(stats.totalInsuranceCovered || 0)}</p>
              </div>
              <span className="material-symbols-outlined text-4xl opacity-80">health_and_safety</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-6 rounded-lg text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Tổng tiền BN trả</p>
                <p className="text-2xl font-bold mt-1">{formatCurrency(stats.totalPatientPay || 0)}</p>
              </div>
              <span className="material-symbols-outlined text-4xl opacity-80">account_balance_wallet</span>
            </div>
          </div>
        </div>
      )}

      {/* Charts Section */}
      {showCharts && typeData.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Insurance Type Distribution Chart */}
          <div className="bg-white p-6 rounded-lg border border-[var(--color-admin-border-light)]">
            <h3 className="text-lg font-bold text-[var(--color-admin-text-light-primary)] mb-4">
              Chi trả theo loại bảo hiểm
            </h3>
            <div className="space-y-3">
              {typeData.map((item, index) => (
                <div key={index}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium">{item.type} ({item.count} yêu cầu)</span>
                    <span className="text-[var(--color-admin-text-light-secondary)]">
                      {formatCurrency(item.covered)} ({item.percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${(item.covered / maxTypeValue) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Comparison */}
          <div className="bg-white p-6 rounded-lg border border-[var(--color-admin-border-light)]">
            <h3 className="text-lg font-bold text-[var(--color-admin-text-light-primary)] mb-4">
              So sánh thanh toán
            </h3>
            <div className="flex items-end justify-around h-64 border-l-2 border-b-2 border-gray-300 p-4">
              <div className="flex flex-col items-center gap-2 flex-1">
                <div className="w-full flex items-end justify-center" style={{ height: '200px' }}>
                  <div
                    className="bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg transition-all duration-500 w-20 flex items-end justify-center pb-2"
                    style={{
                      height: `${stats?.totalInsuranceCovered > 0 ? (stats.totalInsuranceCovered / Math.max(stats.totalInsuranceCovered, stats.totalPatientPay)) * 100 : 0}%`
                    }}
                  >
                    <span className="text-white text-xs font-bold writing-mode-vertical-rl transform rotate-180">
                      Tổng
                    </span>
                  </div>
                </div>
                <p className="text-sm font-medium text-blue-600">{formatCurrency((stats?.totalInsuranceCovered || 0) + (stats?.totalPatientPay || 0))}</p>
              </div>

              <div className="flex flex-col items-center gap-2 flex-1">
                <div className="w-full flex items-end justify-center" style={{ height: '200px' }}>
                  <div
                    className="bg-gradient-to-t from-green-500 to-green-400 rounded-t-lg transition-all duration-500 w-20 flex items-end justify-center pb-2"
                    style={{
                      height: `${stats?.totalInsuranceCovered > 0 ? (stats.totalInsuranceCovered / Math.max(stats.totalInsuranceCovered, stats.totalPatientPay)) * 100 : 0}%`
                    }}
                  >
                    <span className="text-white text-xs font-bold writing-mode-vertical-rl transform rotate-180">
                      BH
                    </span>
                  </div>
                </div>
                <p className="text-sm font-medium text-green-600">{formatCurrency(stats?.totalInsuranceCovered || 0)}</p>
              </div>

              <div className="flex flex-col items-center gap-2 flex-1">
                <div className="w-full flex items-end justify-center" style={{ height: '200px' }}>
                  <div
                    className="bg-gradient-to-t from-orange-500 to-orange-400 rounded-t-lg transition-all duration-500 w-20 flex items-end justify-center pb-2"
                    style={{
                      height: `${stats?.totalPatientPay > 0 ? (stats.totalPatientPay / Math.max(stats.totalInsuranceCovered, stats.totalPatientPay)) * 100 : 0}%`
                    }}
                  >
                    <span className="text-white text-xs font-bold writing-mode-vertical-rl transform rotate-180">
                      BN
                    </span>
                  </div>
                </div>
                <p className="text-sm font-medium text-orange-600">{formatCurrency(stats?.totalPatientPay || 0)}</p>
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
              placeholder="Tìm kiếm theo mã yêu cầu, mã BN, tên BN..."
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
          <option value="Đã duyệt">Đã duyệt</option>
          <option value="Từ chối">Từ chối</option>
        </select>

        <div className="text-sm text-[var(--color-admin-text-light-secondary)]">
          Tổng: <strong>{filteredInsurances.length}</strong> yêu cầu
        </div>
      </div>

      <DataTable
        columns={columns}
        data={filteredInsurances}
        itemsPerPage={10}
        actions={(insurance) => (
          <div className="flex gap-2">
            <button
              onClick={() => handleEdit(insurance)}
              className="p-2 text-[var(--color-admin-primary)] hover:bg-[var(--color-admin-primary)]/10 rounded"
              title="Sửa"
            >
              <span className="material-symbols-outlined text-xl">edit</span>
            </button>
            <button
              onClick={() => handleDelete(insurance)}
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
          <div className="bg-white rounded-xl shadow-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto m-4">
            <div className="sticky top-0 bg-white border-b border-[var(--color-admin-border-light)] p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-[var(--color-admin-text-light-primary)]">
                  {editingInsurance ? 'Cập nhật yêu cầu bảo hiểm' : 'Thêm yêu cầu bảo hiểm mới'}
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
                    Mã yêu cầu <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.claim_code}
                    onChange={(e) => setFormData({ ...formData, claim_code: e.target.value })}
                    disabled={!!editingInsurance}
                    required
                    placeholder="CLM001"
                    className="w-full px-4 py-2 border border-[var(--color-admin-border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-admin-primary)] disabled:bg-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--color-admin-text-light-primary)] mb-2">
                    Mã bệnh nhân <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.patient_code}
                    onChange={(e) => setFormData({ ...formData, patient_code: e.target.value })}
                    required
                    placeholder="BN001"
                    className="w-full px-4 py-2 border border-[var(--color-admin-border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-admin-primary)]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--color-admin-text-light-primary)] mb-2">
                    Tên bệnh nhân <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.patient_name}
                    onChange={(e) => setFormData({ ...formData, patient_name: e.target.value })}
                    required
                    placeholder="Nguyễn Văn A"
                    className="w-full px-4 py-2 border border-[var(--color-admin-border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-admin-primary)]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--color-admin-text-light-primary)] mb-2">
                    Số thẻ bảo hiểm <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.insurance_card}
                    onChange={(e) => setFormData({ ...formData, insurance_card: e.target.value })}
                    required
                    placeholder="DN123456789012"
                    className="w-full px-4 py-2 border border-[var(--color-admin-border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-admin-primary)]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--color-admin-text-light-primary)] mb-2">
                    Loại bảo hiểm <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.insurance_type}
                    onChange={(e) => setFormData({ ...formData, insurance_type: e.target.value })}
                    required
                    placeholder="BHYT, BHTN..."
                    className="w-full px-4 py-2 border border-[var(--color-admin-border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-admin-primary)]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--color-admin-text-light-primary)] mb-2">
                    Ngày khám <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.visit_date}
                    onChange={(e) => setFormData({ ...formData, visit_date: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-[var(--color-admin-border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-admin-primary)]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--color-admin-text-light-primary)] mb-2">
                    Tổng tiền <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.total_amount}
                    onChange={(e) => setFormData({ ...formData, total_amount: parseFloat(e.target.value) || 0 })}
                    required
                    min="0"
                    step="1000"
                    className="w-full px-4 py-2 border border-[var(--color-admin-border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-admin-primary)]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--color-admin-text-light-primary)] mb-2">
                    BH chi trả <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.insurance_covered}
                    onChange={(e) => setFormData({ ...formData, insurance_covered: parseFloat(e.target.value) || 0 })}
                    required
                    min="0"
                    step="1000"
                    className="w-full px-4 py-2 border border-[var(--color-admin-border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-admin-primary)]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--color-admin-text-light-primary)] mb-2">
                    BN trả (tự động)
                  </label>
                  <input
                    type="number"
                    value={formData.patient_pay}
                    disabled
                    className="w-full px-4 py-2 border border-[var(--color-admin-border-light)] rounded-lg bg-gray-100 text-[var(--color-admin-text-light-secondary)]"
                  />
                </div>
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
                  <option value="Đã duyệt">Đã duyệt</option>
                  <option value="Từ chối">Từ chối</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--color-admin-text-light-primary)] mb-2">
                  Ghi chú
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows="3"
                  className="w-full px-4 py-2 border border-[var(--color-admin-border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-admin-primary)]"
                  placeholder="Ghi chú về yêu cầu bảo hiểm..."
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
                  {editingInsurance ? 'Cập nhật' : 'Thêm mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Insurance_Management;
