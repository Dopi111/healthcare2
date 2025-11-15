import React, { useEffect, useState } from 'react';
import { DataTable, Badge } from '../../../components/admin';
import LaboratoryService from '../../../services/LaboratoryService';

const Laboratory_Test_Report = () => {
  const [tests, setTests] = useState([]);
  const [filteredTests, setFilteredTests] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTest, setEditingTest] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [formData, setFormData] = useState({
    testId: '',
    patientId: '',
    patientName: '',
    testType: '',
    sampleId: '',
    sampleType: 'Máu tĩnh mạch',
    receivedDate: new Date().toISOString().split('T')[0],
    receivedTime: new Date().toTimeString().slice(0, 5),
    technician: '',
    status: 'Chờ xử lý',
    priority: 'Bình thường',
    notes: ''
  });

  useEffect(() => {
    loadTests();
  }, []);

  const loadTests = () => {
    try {
      const data = LaboratoryService.getAllTests();
      setTests(data);
      setFilteredTests(data);
    } catch (error) {
      showMessage('error', 'Không thể tải danh sách xét nghiệm!');
    }
  };

  useEffect(() => {
    let filtered = [...tests];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(t =>
        t.testId.toLowerCase().includes(query) ||
        t.patientId.toLowerCase().includes(query) ||
        t.patientName.toLowerCase().includes(query) ||
        t.sampleId.toLowerCase().includes(query) ||
        t.testType.toLowerCase().includes(query)
      );
    }

    if (filterStatus) {
      filtered = filtered.filter(t => t.status === filterStatus);
    }

    setFilteredTests(filtered);
  }, [searchQuery, filterStatus, tests]);

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  };

  const handleAdd = () => {
    setEditingTest(null);
    setFormData({
      testId: '',
      patientId: '',
      patientName: '',
      testType: '',
      sampleId: '',
      sampleType: 'Máu tĩnh mạch',
      receivedDate: new Date().toISOString().split('T')[0],
      receivedTime: new Date().toTimeString().slice(0, 5),
      technician: '',
      status: 'Chờ xử lý',
      priority: 'Bình thường',
      notes: '',
      results: {}
    });
    setIsModalOpen(true);
  };

  const handleEdit = (test) => {
    setEditingTest(test);
    setFormData(test);
    setIsModalOpen(true);
  };

  const handleDelete = (test) => {
    if (!window.confirm(`Bạn có chắc muốn xóa phiếu xét nghiệm "${test.testId}"?`)) {
      return;
    }
    try {
      LaboratoryService.deleteTest(test.id);
      loadTests();
      showMessage('success', 'Xóa phiếu xét nghiệm thành công!');
    } catch (error) {
      showMessage('error', error.message);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.testId || !formData.patientId || !formData.patientName || !formData.testType || !formData.sampleId) {
      showMessage('error', 'Vui lòng điền đầy đủ thông tin bắt buộc!');
      return;
    }

    try {
      if (editingTest) {
        LaboratoryService.updateTest(editingTest.id, formData);
        showMessage('success', 'Cập nhật phiếu xét nghiệm thành công!');
      } else {
        LaboratoryService.addTest(formData);
        showMessage('success', 'Nhận phiếu xét nghiệm mới thành công!');
      }
      setIsModalOpen(false);
      loadTests();
    } catch (error) {
      showMessage('error', error.message);
    }
  };

  const handleUpdateStatus = (test, newStatus) => {
    try {
      LaboratoryService.updateTestStatus(test.id, newStatus);
      loadTests();
      showMessage('success', `Đã chuyển trạng thái sang: ${newStatus}`);
    } catch (error) {
      showMessage('error', error.message);
    }
  };

  const stats = LaboratoryService.getStatistics();

  const columns = [
    {
      key: 'testId',
      label: 'Mã XN',
      sortable: true,
      className: 'font-medium text-[var(--color-admin-text-light-primary)]'
    },
    {
      key: 'sampleId',
      label: 'Mã mẫu',
      sortable: true
    },
    {
      key: 'patientName',
      label: 'Bệnh nhân',
      sortable: true
    },
    {
      key: 'testType',
      label: 'Loại XN',
      sortable: true
    },
    {
      key: 'sampleType',
      label: 'Loại mẫu'
    },
    {
      key: 'receivedDate',
      label: 'Ngày nhận',
      sortable: true,
      render: (value, row) => `${value} ${row.receivedTime}`
    },
    {
      key: 'priority',
      label: 'Ưu tiên',
      render: (value) => {
        const variants = {
          'Cấp tốc': 'danger',
          'Bình thường': 'info'
        };
        return <Badge variant={variants[value] || 'default'}>{value}</Badge>;
      }
    },
    {
      key: 'status',
      label: 'Trạng thái',
      render: (value) => {
        const variants = {
          'Chờ xử lý': 'warning',
          'Đang xét nghiệm': 'info',
          'Hoàn thành': 'success'
        };
        return <Badge variant={variants[value] || 'default'}>{value}</Badge>;
      }
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[var(--color-admin-text-light-primary)]">
            Nhận Phiếu Xét Nghiệm
          </h2>
          <p className="text-sm text-[var(--color-admin-text-light-secondary)] mt-1">
            Quản lý tiếp nhận và xử lý mẫu bệnh phẩm
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => LaboratoryService.exportTests()}
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
            Nhận phiếu mới
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
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-lg border border-[var(--color-admin-border-light)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[var(--color-admin-text-light-secondary)]">Tổng số</p>
              <p className="text-2xl font-bold text-[var(--color-admin-text-light-primary)] mt-1">{stats.total}</p>
            </div>
            <span className="material-symbols-outlined text-3xl text-blue-500">science</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-[var(--color-admin-border-light)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[var(--color-admin-text-light-secondary)]">Chờ xử lý</p>
              <p className="text-2xl font-bold text-[var(--color-admin-warning)] mt-1">{stats.pending}</p>
            </div>
            <span className="material-symbols-outlined text-3xl text-[var(--color-admin-warning)]">pending</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-[var(--color-admin-border-light)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[var(--color-admin-text-light-secondary)]">Đang XN</p>
              <p className="text-2xl font-bold text-blue-500 mt-1">{stats.inProgress}</p>
            </div>
            <span className="material-symbols-outlined text-3xl text-blue-500">biotech</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-[var(--color-admin-border-light)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[var(--color-admin-text-light-secondary)]">Hoàn thành</p>
              <p className="text-2xl font-bold text-[var(--color-admin-success)] mt-1">{stats.completed}</p>
            </div>
            <span className="material-symbols-outlined text-3xl text-[var(--color-admin-success)]">check_circle</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-[var(--color-admin-border-light)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[var(--color-admin-text-light-secondary)]">Cấp tốc</p>
              <p className="text-2xl font-bold text-[var(--color-admin-danger)] mt-1">{stats.urgent}</p>
            </div>
            <span className="material-symbols-outlined text-3xl text-[var(--color-admin-danger)]">priority_high</span>
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
              placeholder="Tìm kiếm theo mã XN, mã mẫu, tên BN..."
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
          <option value="Chờ xử lý">Chờ xử lý</option>
          <option value="Đang xét nghiệm">Đang xét nghiệm</option>
          <option value="Hoàn thành">Hoàn thành</option>
        </select>

        <div className="text-sm text-[var(--color-admin-text-light-secondary)]">
          Tổng: <strong>{filteredTests.length}</strong> phiếu
        </div>
      </div>

      <DataTable
        columns={columns}
        data={filteredTests}
        itemsPerPage={10}
        actions={(test) => (
          <div className="flex gap-2">
            {test.status === 'Chờ xử lý' && (
              <button
                onClick={() => handleUpdateStatus(test, 'Đang xét nghiệm')}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                title="Bắt đầu xét nghiệm"
              >
                <span className="material-symbols-outlined text-xl">play_arrow</span>
              </button>
            )}
            {test.status === 'Đang xét nghiệm' && (
              <button
                onClick={() => handleUpdateStatus(test, 'Hoàn thành')}
                className="p-2 text-[var(--color-admin-success)] hover:bg-green-50 rounded"
                title="Hoàn thành"
              >
                <span className="material-symbols-outlined text-xl">check_circle</span>
              </button>
            )}
            <button
              onClick={() => handleEdit(test)}
              className="p-2 text-[var(--color-admin-primary)] hover:bg-[var(--color-admin-primary)]/10 rounded"
              title="Sửa"
            >
              <span className="material-symbols-outlined text-xl">edit</span>
            </button>
            <button
              onClick={() => handleDelete(test)}
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
                  {editingTest ? 'Cập nhật phiếu xét nghiệm' : 'Nhận phiếu xét nghiệm mới'}
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
                    Mã xét nghiệm <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.testId}
                    onChange={(e) => setFormData({ ...formData, testId: e.target.value })}
                    disabled={!!editingTest}
                    required
                    placeholder="LAB001"
                    className="w-full px-4 py-2 border border-[var(--color-admin-border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-admin-primary)] disabled:bg-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--color-admin-text-light-primary)] mb-2">
                    Mã mẫu bệnh phẩm <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.sampleId}
                    onChange={(e) => setFormData({ ...formData, sampleId: e.target.value })}
                    required
                    placeholder="MAU001"
                    className="w-full px-4 py-2 border border-[var(--color-admin-border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-admin-primary)]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--color-admin-text-light-primary)] mb-2">
                    Mã bệnh nhân <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.patientId}
                    onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
                    required
                    placeholder="BN001"
                    className="w-full px-4 py-2 border border-[var(--color-admin-border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-admin-primary)]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--color-admin-text-light-primary)] mb-2">
                    Tên bệnh nhân <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.patientName}
                    onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-[var(--color-admin-border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-admin-primary)]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--color-admin-text-light-primary)] mb-2">
                    Loại xét nghiệm <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.testType}
                    onChange={(e) => setFormData({ ...formData, testType: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-[var(--color-admin-border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-admin-primary)]"
                  >
                    <option value="">-- Chọn loại xét nghiệm --</option>
                    <option value="Xét nghiệm máu tổng quát">Xét nghiệm máu tổng quát</option>
                    <option value="Xét nghiệm sinh hóa">Xét nghiệm sinh hóa</option>
                    <option value="Xét nghiệm nước tiểu">Xét nghiệm nước tiểu</option>
                    <option value="Xét nghiệm vi sinh">Xét nghiệm vi sinh</option>
                    <option value="Xét nghiệm đông máu">Xét nghiệm đông máu</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--color-admin-text-light-primary)] mb-2">
                    Loại mẫu bệnh phẩm
                  </label>
                  <select
                    value={formData.sampleType}
                    onChange={(e) => setFormData({ ...formData, sampleType: e.target.value })}
                    className="w-full px-4 py-2 border border-[var(--color-admin-border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-admin-primary)]"
                  >
                    <option value="Máu tĩnh mạch">Máu tĩnh mạch</option>
                    <option value="Máu mao mạch">Máu mao mạch</option>
                    <option value="Nước tiểu">Nước tiểu</option>
                    <option value="Phân">Phân</option>
                    <option value="Đờm">Đờm</option>
                    <option value="Dịch não tủy">Dịch não tủy</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--color-admin-text-light-primary)] mb-2">
                    Ngày nhận mẫu
                  </label>
                  <input
                    type="date"
                    value={formData.receivedDate}
                    onChange={(e) => setFormData({ ...formData, receivedDate: e.target.value })}
                    className="w-full px-4 py-2 border border-[var(--color-admin-border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-admin-primary)]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--color-admin-text-light-primary)] mb-2">
                    Giờ nhận mẫu
                  </label>
                  <input
                    type="time"
                    value={formData.receivedTime}
                    onChange={(e) => setFormData({ ...formData, receivedTime: e.target.value })}
                    className="w-full px-4 py-2 border border-[var(--color-admin-border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-admin-primary)]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--color-admin-text-light-primary)] mb-2">
                    Kỹ thuật viên phụ trách
                  </label>
                  <input
                    type="text"
                    value={formData.technician}
                    onChange={(e) => setFormData({ ...formData, technician: e.target.value })}
                    placeholder="KTV Nguyễn Văn A"
                    className="w-full px-4 py-2 border border-[var(--color-admin-border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-admin-primary)]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--color-admin-text-light-primary)] mb-2">
                    Độ ưu tiên
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full px-4 py-2 border border-[var(--color-admin-border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-admin-primary)]"
                  >
                    <option value="Bình thường">Bình thường</option>
                    <option value="Cấp tốc">Cấp tốc</option>
                  </select>
                </div>
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
                  placeholder="Ghi chú về mẫu bệnh phẩm..."
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
                  {editingTest ? 'Cập nhật' : 'Nhận phiếu'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Laboratory_Test_Report;
