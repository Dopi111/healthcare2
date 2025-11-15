import React, { useEffect, useState } from 'react';
import { DataTable, Badge } from '../../../components/admin';
import LaboratoryService from '../../../services/LaboratoryService';

const Test_Result_Form = () => {
  const [tests, setTests] = useState([]);
  const [filteredTests, setFilteredTests] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTest, setSelectedTest] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [resultFields, setResultFields] = useState([]);

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
        t.testType.toLowerCase().includes(query)
      );
    }

    setFilteredTests(filtered);
  }, [searchQuery, tests]);

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  };

  const handleEnterResults = (test) => {
    setSelectedTest(test);
    // Convert existing results to array format
    const fields = Object.entries(test.results || {}).map(([key, value]) => ({
      testName: key,
      value: value.value || '',
      unit: value.unit || '',
      range: value.range || '',
      normal: value.normal !== false
    }));
    setResultFields(fields.length > 0 ? fields : [{ testName: '', value: '', unit: '', range: '', normal: true }]);
    setIsModalOpen(true);
  };

  const addResultField = () => {
    setResultFields([...resultFields, { testName: '', value: '', unit: '', range: '', normal: true }]);
  };

  const removeResultField = (index) => {
    const newFields = resultFields.filter((_, i) => i !== index);
    setResultFields(newFields.length > 0 ? newFields : [{ testName: '', value: '', unit: '', range: '', normal: true }]);
  };

  const updateResultField = (index, field, value) => {
    const newFields = [...resultFields];
    newFields[index][field] = value;
    setResultFields(newFields);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Convert result fields to object format
    const results = {};
    resultFields.forEach(field => {
      if (field.testName && field.value) {
        results[field.testName] = {
          value: field.value,
          unit: field.unit,
          range: field.range,
          normal: field.normal
        };
      }
    });

    const updateData = {
      results,
      status: selectedTest.verifiedBy ? 'Hoàn thành' : 'Đang xét nghiệm',
      completedDate: selectedTest.completedDate || new Date().toISOString().split('T')[0],
      completedTime: selectedTest.completedTime || new Date().toTimeString().slice(0, 5)
    };

    try {
      LaboratoryService.updateTest(selectedTest.id, updateData);
      loadTests();
      setIsModalOpen(false);
      showMessage('success', 'Cập nhật kết quả xét nghiệm thành công!');
    } catch (error) {
      showMessage('error', error.message);
    }
  };

  const handleVerify = () => {
    const verifiedBy = prompt('Nhập tên bác sĩ kiểm định:');
    if (verifiedBy) {
      try {
        LaboratoryService.updateTest(selectedTest.id, {
          verifiedBy,
          status: 'Hoàn thành',
          completedDate: new Date().toISOString().split('T')[0],
          completedTime: new Date().toTimeString().slice(0, 5)
        });
        loadTests();
        setIsModalOpen(false);
        showMessage('success', 'Đã xác nhận kết quả xét nghiệm!');
      } catch (error) {
        showMessage('error', error.message);
      }
    }
  };

  const columns = [
    {
      key: 'testId',
      label: 'Mã XN',
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
      label: 'Loại XN',
      sortable: true
    },
    {
      key: 'technician',
      label: 'Kỹ thuật viên'
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
    },
    {
      key: 'verifiedBy',
      label: 'Kiểm định',
      render: (value) => value ? (
        <Badge variant="success">{value}</Badge>
      ) : (
        <Badge variant="warning">Chưa xác nhận</Badge>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[var(--color-admin-text-light-primary)]">
            Kết quả Xét nghiệm
          </h2>
          <p className="text-sm text-[var(--color-admin-text-light-secondary)] mt-1">
            Nhập và quản lý kết quả xét nghiệm
          </p>
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
              placeholder="Tìm kiếm theo mã XN, tên BN, loại XN..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-[var(--color-admin-border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-admin-primary)]"
            />
          </label>
        </div>

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
            <button
              onClick={() => handleEnterResults(test)}
              className="p-2 text-[var(--color-admin-primary)] hover:bg-[var(--color-admin-primary)]/10 rounded"
              title="Nhập kết quả"
            >
              <span className="material-symbols-outlined text-xl">edit_note</span>
            </button>
          </div>
        )}
      />

      {isModalOpen && selectedTest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="bg-white border-b border-[var(--color-admin-border-light)] p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-[var(--color-admin-text-light-primary)]">
                    Kết quả xét nghiệm
                  </h3>
                  <p className="text-sm text-[var(--color-admin-text-light-secondary)] mt-1">
                    {selectedTest.testId} - {selectedTest.patientName} - {selectedTest.testType}
                  </p>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
              {/* Test Info */}
              <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm text-[var(--color-admin-text-light-secondary)]">Mã mẫu</p>
                  <p className="font-medium">{selectedTest.sampleId}</p>
                </div>
                <div>
                  <p className="text-sm text-[var(--color-admin-text-light-secondary)]">Loại mẫu</p>
                  <p className="font-medium">{selectedTest.sampleType}</p>
                </div>
                <div>
                  <p className="text-sm text-[var(--color-admin-text-light-secondary)]">Ngày nhận</p>
                  <p className="font-medium">{selectedTest.receivedDate} {selectedTest.receivedTime}</p>
                </div>
              </div>

              {/* Result Fields */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-medium text-[var(--color-admin-text-light-primary)]">
                    Kết quả xét nghiệm
                  </label>
                  <button
                    type="button"
                    onClick={addResultField}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-[var(--color-admin-primary)] hover:bg-[var(--color-admin-primary)]/10 rounded-lg"
                  >
                    <span className="material-symbols-outlined text-lg">add</span>
                    Thêm chỉ số
                  </button>
                </div>

                <div className="space-y-2">
                  {/* Header */}
                  <div className="grid grid-cols-12 gap-2 text-xs font-medium text-[var(--color-admin-text-light-secondary)] px-2">
                    <div className="col-span-3">Tên chỉ số</div>
                    <div className="col-span-2">Giá trị</div>
                    <div className="col-span-2">Đơn vị</div>
                    <div className="col-span-3">Khoảng tham chiếu</div>
                    <div className="col-span-1">Bình thường</div>
                    <div className="col-span-1"></div>
                  </div>

                  {/* Data Rows */}
                  {resultFields.map((field, index) => (
                    <div key={index} className="grid grid-cols-12 gap-2 items-center">
                      <div className="col-span-3">
                        <input
                          type="text"
                          placeholder="WBC (Bạch cầu)"
                          value={field.testName}
                          onChange={(e) => updateResultField(index, 'testName', e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-[var(--color-admin-border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-admin-primary)]"
                        />
                      </div>
                      <div className="col-span-2">
                        <input
                          type="text"
                          placeholder="7.2"
                          value={field.value}
                          onChange={(e) => updateResultField(index, 'value', e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-[var(--color-admin-border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-admin-primary)]"
                        />
                      </div>
                      <div className="col-span-2">
                        <input
                          type="text"
                          placeholder="x10³/µL"
                          value={field.unit}
                          onChange={(e) => updateResultField(index, 'unit', e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-[var(--color-admin-border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-admin-primary)]"
                        />
                      </div>
                      <div className="col-span-3">
                        <input
                          type="text"
                          placeholder="4.0-11.0"
                          value={field.range}
                          onChange={(e) => updateResultField(index, 'range', e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-[var(--color-admin-border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-admin-primary)]"
                        />
                      </div>
                      <div className="col-span-1 flex justify-center">
                        <input
                          type="checkbox"
                          checked={field.normal}
                          onChange={(e) => updateResultField(index, 'normal', e.target.checked)}
                          className="w-4 h-4 text-[var(--color-admin-primary)] border-gray-300 rounded focus:ring-[var(--color-admin-primary)]"
                        />
                      </div>
                      <div className="col-span-1">
                        <button
                          type="button"
                          onClick={() => removeResultField(index)}
                          className="p-1.5 text-[var(--color-admin-danger)] hover:bg-[var(--color-admin-danger)]/10 rounded"
                          title="Xóa"
                        >
                          <span className="material-symbols-outlined text-lg">delete</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-[var(--color-admin-text-light-primary)] mb-2">
                  Nhận xét
                </label>
                <textarea
                  value={selectedTest.notes || ''}
                  onChange={(e) => setSelectedTest({ ...selectedTest, notes: e.target.value })}
                  rows="3"
                  className="w-full px-4 py-2 border border-[var(--color-admin-border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-admin-primary)]"
                  placeholder="Nhận xét về kết quả xét nghiệm..."
                />
              </div>

              {/* Verification Status */}
              {selectedTest.verifiedBy && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2 text-green-800">
                    <span className="material-symbols-outlined">verified</span>
                    <span className="font-medium">Đã xác nhận bởi: {selectedTest.verifiedBy}</span>
                  </div>
                  <p className="text-sm text-green-600 mt-1">
                    Ngày: {selectedTest.completedDate} {selectedTest.completedTime}
                  </p>
                </div>
              )}

              <div className="flex gap-3 pt-4 border-t">
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
                  Lưu kết quả
                </button>
                {!selectedTest.verifiedBy && (
                  <button
                    type="button"
                    onClick={handleVerify}
                    className="flex-1 px-4 py-2 bg-[var(--color-admin-success)] text-white rounded-lg hover:opacity-90"
                  >
                    Xác nhận kết quả
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

export default Test_Result_Form;
