import React, { useEffect, useState } from 'react';
import { DataTable, Badge } from '../../../components/admin';
import TestResultService from '../../../services/TestResultService';

const Test_Result = () => {
  const [testResults, setTestResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
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
    doctorOrder: '',
    orderDate: new Date().toISOString().split('T')[0],
    sampleDate: new Date().toISOString().split('T')[0],
    resultDate: '',
    status: 'Đang xử lý',
    priority: 'Bình thường',
    results: {},
    notes: ''
  });
  const [resultFields, setResultFields] = useState([{ key: '', value: '' }]);

  useEffect(() => {
    loadTestResults();
  }, []);

  const loadTestResults = () => {
    try {
      const data = TestResultService.getAllTestResults();
      setTestResults(data);
      setFilteredResults(data);
    } catch (error) {
      showMessage('error', 'Không thể tải danh sách phiếu xét nghiệm!');
    }
  };

  useEffect(() => {
    let filtered = [...testResults];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(t =>
        t.testId.toLowerCase().includes(query) ||
        t.patientId.toLowerCase().includes(query) ||
        t.patientName.toLowerCase().includes(query) ||
        t.testType.toLowerCase().includes(query)
      );
    }

    if (filterStatus) {
      filtered = filtered.filter(t => t.status === filterStatus);
    }

    setFilteredResults(filtered);
  }, [searchQuery, filterStatus, testResults]);

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
      doctorOrder: '',
      orderDate: new Date().toISOString().split('T')[0],
      sampleDate: new Date().toISOString().split('T')[0],
      resultDate: '',
      status: 'Đang xử lý',
      priority: 'Bình thường',
      results: {},
      notes: ''
    });
    setResultFields([{ key: '', value: '' }]);
    setIsModalOpen(true);
  };

  const handleEdit = (test) => {
    setEditingTest(test);
    setFormData(test);
    // Convert results object to array for editing
    const fields = Object.entries(test.results || {}).map(([key, value]) => ({ key, value }));
    setResultFields(fields.length > 0 ? fields : [{ key: '', value: '' }]);
    setIsModalOpen(true);
  };

  const handleDelete = (test) => {
    if (!window.confirm(`Bạn có chắc muốn xóa phiếu xét nghiệm "${test.testId}"?`)) {
      return;
    }
    try {
      TestResultService.deleteTestResult(test.id);
      loadTestResults();
      showMessage('success', 'Xóa phiếu xét nghiệm thành công!');
    } catch (error) {
      showMessage('error', error.message);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.testId || !formData.patientId || !formData.patientName || !formData.testType) {
      showMessage('error', 'Vui lòng điền đầy đủ thông tin bắt buộc!');
      return;
    }

    // Convert result fields array to object
    const results = {};
    resultFields.forEach(field => {
      if (field.key && field.value) {
        results[field.key] = field.value;
      }
    });

    const dataToSubmit = {
      ...formData,
      results
    };

    try {
      if (editingTest) {
        TestResultService.updateTestResult(editingTest.id, dataToSubmit);
        showMessage('success', 'Cập nhật phiếu xét nghiệm thành công!');
      } else {
        TestResultService.addTestResult(dataToSubmit);
        showMessage('success', 'Thêm phiếu xét nghiệm mới thành công!');
      }
      setIsModalOpen(false);
      loadTestResults();
    } catch (error) {
      showMessage('error', error.message);
    }
  };

  const addResultField = () => {
    setResultFields([...resultFields, { key: '', value: '' }]);
  };

  const removeResultField = (index) => {
    const newFields = resultFields.filter((_, i) => i !== index);
    setResultFields(newFields.length > 0 ? newFields : [{ key: '', value: '' }]);
  };

  const updateResultField = (index, field, value) => {
    const newFields = [...resultFields];
    newFields[index][field] = value;
    setResultFields(newFields);
  };

  const columns = [
    {
      key: 'testId',
      label: 'Mã phiếu',
      sortable: true,
      className: 'font-medium text-[var(--color-admin-text-light-primary)]'
    },
    {
      key: 'patientName',
      label: 'Bệnh nhân',
      sortable: true
    },
    {
      key: 'testType',
      label: 'Loại xét nghiệm',
      sortable: true
    },
    {
      key: 'orderDate',
      label: 'Ngày chỉ định',
      sortable: true
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
          'Hoàn thành': 'success',
          'Đang xử lý': 'warning'
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
            Quản lý Phiếu xét nghiệm
          </h2>
          <p className="text-sm text-[var(--color-admin-text-light-secondary)] mt-1">
            Quản lý phiếu xét nghiệm và kết quả
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => TestResultService.exportTestResults()}
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
            Thêm phiếu XN
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

      <div className="flex flex-wrap gap-4 items-center bg-white p-4 rounded-lg border border-[var(--color-admin-border-light)]">
        <div className="flex-1 min-w-[200px]">
          <label className="relative block">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-admin-text-light-secondary)]">
              search
            </span>
            <input
              type="text"
              placeholder="Tìm kiếm theo mã phiếu, mã BN, tên BN, loại XN..."
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
          <option value="Hoàn thành">Hoàn thành</option>
          <option value="Đang xử lý">Đang xử lý</option>
        </select>

        <div className="text-sm text-[var(--color-admin-text-light-secondary)]">
          Tổng: <strong>{filteredResults.length}</strong> phiếu
        </div>
      </div>

      <DataTable
        columns={columns}
        data={filteredResults}
        itemsPerPage={10}
        actions={(test) => (
          <div className="flex gap-2">
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
          <div className="bg-white rounded-xl shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto m-4">
            <div className="sticky top-0 bg-white border-b border-[var(--color-admin-border-light)] p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-[var(--color-admin-text-light-primary)]">
                  {editingTest ? 'Cập nhật phiếu xét nghiệm' : 'Thêm phiếu xét nghiệm mới'}
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
                    Mã phiếu xét nghiệm <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.testId}
                    onChange={(e) => setFormData({ ...formData, testId: e.target.value })}
                    disabled={!!editingTest}
                    required
                    placeholder="PXN001"
                    className="w-full px-4 py-2 border border-[var(--color-admin-border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-admin-primary)] disabled:bg-gray-100"
                  />
                </div>

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
              </div>

              <div className="grid grid-cols-2 gap-4">
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

                <div>
                  <label className="block text-sm font-medium text-[var(--color-admin-text-light-primary)] mb-2">
                    Loại xét nghiệm <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.testType}
                    onChange={(e) => setFormData({ ...formData, testType: e.target.value })}
                    required
                    placeholder="Xét nghiệm máu tổng quát"
                    className="w-full px-4 py-2 border border-[var(--color-admin-border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-admin-primary)]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--color-admin-text-light-primary)] mb-2">
                  Bác sĩ chỉ định
                </label>
                <input
                  type="text"
                  value={formData.doctorOrder}
                  onChange={(e) => setFormData({ ...formData, doctorOrder: e.target.value })}
                  placeholder="Bác sĩ Nguyễn Văn A"
                  className="w-full px-4 py-2 border border-[var(--color-admin-border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-admin-primary)]"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--color-admin-text-light-primary)] mb-2">
                    Ngày chỉ định
                  </label>
                  <input
                    type="date"
                    value={formData.orderDate}
                    onChange={(e) => setFormData({ ...formData, orderDate: e.target.value })}
                    className="w-full px-4 py-2 border border-[var(--color-admin-border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-admin-primary)]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--color-admin-text-light-primary)] mb-2">
                    Ngày lấy mẫu
                  </label>
                  <input
                    type="date"
                    value={formData.sampleDate}
                    onChange={(e) => setFormData({ ...formData, sampleDate: e.target.value })}
                    className="w-full px-4 py-2 border border-[var(--color-admin-border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-admin-primary)]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--color-admin-text-light-primary)] mb-2">
                    Ngày có kết quả
                  </label>
                  <input
                    type="date"
                    value={formData.resultDate}
                    onChange={(e) => setFormData({ ...formData, resultDate: e.target.value })}
                    className="w-full px-4 py-2 border border-[var(--color-admin-border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-admin-primary)]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--color-admin-text-light-primary)] mb-2">
                    Trạng thái
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-4 py-2 border border-[var(--color-admin-border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-admin-primary)]"
                  >
                    <option value="Đang xử lý">Đang xử lý</option>
                    <option value="Hoàn thành">Hoàn thành</option>
                  </select>
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
                  Kết quả xét nghiệm
                </label>
                <div className="space-y-2">
                  {resultFields.map((field, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Tên chỉ số (vd: Hồng cầu)"
                        value={field.key}
                        onChange={(e) => updateResultField(index, 'key', e.target.value)}
                        className="flex-1 px-4 py-2 border border-[var(--color-admin-border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-admin-primary)]"
                      />
                      <input
                        type="text"
                        placeholder="Giá trị (vd: 4.8 triệu/µL)"
                        value={field.value}
                        onChange={(e) => updateResultField(index, 'value', e.target.value)}
                        className="flex-1 px-4 py-2 border border-[var(--color-admin-border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-admin-primary)]"
                      />
                      <button
                        type="button"
                        onClick={() => removeResultField(index)}
                        className="p-2 text-[var(--color-admin-danger)] hover:bg-[var(--color-admin-danger)]/10 rounded-lg"
                        title="Xóa"
                      >
                        <span className="material-symbols-outlined">delete</span>
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addResultField}
                    className="inline-flex items-center gap-1 px-3 py-2 text-sm text-[var(--color-admin-primary)] hover:bg-[var(--color-admin-primary)]/10 rounded-lg"
                  >
                    <span className="material-symbols-outlined text-lg">add</span>
                    Thêm chỉ số
                  </button>
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
                  placeholder="Các chỉ số trong giới hạn bình thường..."
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
                  {editingTest ? 'Cập nhật' : 'Thêm mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Test_Result;
