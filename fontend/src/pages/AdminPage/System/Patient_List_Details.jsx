import React, { useEffect, useState } from 'react';
import { DataTable, Badge } from '../../../components/admin';
import PatientService from '../../../services/PatientService';

const Patient_List_Details = () => {
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterDoctor, setFilterDoctor] = useState('');
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);
  const [viewingPatient, setViewingPatient] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    recovered: 0,
    followUp: 0
  });
  const [formData, setFormData] = useState({
    patient_code: '',
    infor_users_id: null,
    doctor_in_charge: '',
    visit_date: new Date().toISOString().split('T')[0],
    diagnosis: '',
    treatment: '',
    prescription: '',
    medical_history: '',
    allergies: '',
    follow_up_date: '',
    status: 'active',
    notes: ''
  });

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    try {
      const data = await PatientService.getAllPatients();
      setPatients(data || []);
      setFilteredPatients(data || []);
      calculateStats(data || []);
    } catch (error) {
      console.error('Error loading patients:', error);
      setPatients([]);
      setFilteredPatients([]);
      showMessage('error', 'Không thể tải danh sách bệnh nhân!');
    }
  };

  const calculateStats = (data) => {
    const stats = {
      total: data.length,
      active: data.filter(p => p.status === 'active').length,
      recovered: data.filter(p => p.status === 'recovered').length,
      followUp: data.filter(p => p.status === 'follow-up').length
    };
    setStats(stats);
  };

  useEffect(() => {
    let filtered = [...(patients || [])];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p =>
        (p.patient_code || '').toLowerCase().includes(query) ||
        (p.diagnosis || '').toLowerCase().includes(query) ||
        (p.doctor_in_charge || '').toLowerCase().includes(query)
      );
    }

    if (filterStatus) {
      filtered = filtered.filter(p => p.status === filterStatus);
    }

    if (filterDoctor) {
      filtered = filtered.filter(p =>
        (p.doctor_in_charge || '').toLowerCase().includes(filterDoctor.toLowerCase())
      );
    }

    if (filterDateFrom) {
      filtered = filtered.filter(p => p.visit_date >= filterDateFrom);
    }

    if (filterDateTo) {
      filtered = filtered.filter(p => p.visit_date <= filterDateTo);
    }

    setFilteredPatients(filtered);
  }, [searchQuery, filterStatus, filterDoctor, filterDateFrom, filterDateTo, patients]);

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  };

  const generatePatientCode = () => {
    return `BN${Date.now()}`;
  };

  const handleAdd = () => {
    setEditingPatient(null);
    setFormData({
      patient_code: generatePatientCode(),
      infor_users_id: null,
      doctor_in_charge: '',
      visit_date: new Date().toISOString().split('T')[0],
      diagnosis: '',
      treatment: '',
      prescription: '',
      medical_history: '',
      allergies: '',
      follow_up_date: '',
      status: 'active',
      notes: ''
    });
    setIsModalOpen(true);
  };

  const handleEdit = (patient) => {
    setEditingPatient(patient);
    setFormData({
      patient_code: patient.patient_code || '',
      infor_users_id: patient.infor_users_id || null,
      doctor_in_charge: patient.doctor_in_charge || '',
      visit_date: patient.visit_date || '',
      diagnosis: patient.diagnosis || '',
      treatment: patient.treatment || '',
      prescription: patient.prescription || '',
      medical_history: patient.medical_history || '',
      allergies: patient.allergies || '',
      follow_up_date: patient.follow_up_date || '',
      status: patient.status || 'active',
      notes: patient.notes || ''
    });
    setIsModalOpen(true);
  };

  const handleView = (patient) => {
    setViewingPatient(patient);
    setIsViewModalOpen(true);
  };

  const handleDelete = async (patient) => {
    if (!window.confirm(`Bạn có chắc muốn xóa hồ sơ bệnh nhân "${patient.patient_code}"?`)) {
      return;
    }
    try {
      await PatientService.deletePatient(patient.id);
      await loadPatients();
      showMessage('success', 'Xóa hồ sơ bệnh nhân thành công!');
    } catch (error) {
      console.error('Error deleting patient:', error);
      showMessage('error', 'Không thể xóa hồ sơ bệnh nhân!');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.patient_code || !formData.diagnosis) {
      showMessage('error', 'Vui lòng điền đầy đủ thông tin bắt buộc!');
      return;
    }

    try {
      if (editingPatient) {
        await PatientService.updatePatient(editingPatient.id, formData);
        showMessage('success', 'Cập nhật hồ sơ bệnh nhân thành công!');
      } else {
        await PatientService.addPatient(formData);
        showMessage('success', 'Thêm hồ sơ bệnh nhân mới thành công!');
      }
      setIsModalOpen(false);
      await loadPatients();
    } catch (error) {
      console.error('Error submitting patient:', error);
      showMessage('error', 'Không thể lưu hồ sơ bệnh nhân!');
    }
  };

  const handleExport = async () => {
    try {
      await PatientService.exportPatients();
      showMessage('success', 'Xuất file thành công!');
    } catch (error) {
      console.error('Error exporting patients:', error);
      showMessage('error', 'Không thể xuất file!');
    }
  };

  const printPrescription = (patient) => {
    if (!patient.prescription) {
      showMessage('error', 'Không có đơn thuốc để in!');
      return;
    }

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Đơn thuốc - ${patient.patient_code}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { text-align: center; color: #1e40af; }
            .info { margin: 20px 0; }
            .info p { margin: 5px 0; }
            .prescription { border: 1px solid #ccc; padding: 15px; margin: 20px 0; }
            .footer { margin-top: 40px; text-align: right; }
          </style>
        </head>
        <body>
          <h1>ĐON THUỐC</h1>
          <div class="info">
            <p><strong>Mã bệnh nhân:</strong> ${patient.patient_code}</p>
            <p><strong>Ngày khám:</strong> ${patient.visit_date}</p>
            <p><strong>Bác sĩ điều trị:</strong> ${patient.doctor_in_charge || 'N/A'}</p>
            <p><strong>Chẩn đoán:</strong> ${patient.diagnosis}</p>
          </div>
          <div class="prescription">
            <h3>Đơn thuốc:</h3>
            <pre>${patient.prescription}</pre>
          </div>
          <div class="footer">
            <p>Bác sĩ điều trị</p>
            <p>(Ký tên)</p>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const columns = [
    {
      key: 'patient_code',
      label: 'Mã BN',
      sortable: true,
      className: 'font-medium text-[var(--color-admin-text-light-primary)]'
    },
    {
      key: 'visit_date',
      label: 'Ngày khám',
      sortable: true
    },
    {
      key: 'diagnosis',
      label: 'Chẩn đoán',
      render: (value) => (
        <div className="max-w-xs truncate" title={value}>
          {value}
        </div>
      )
    },
    {
      key: 'treatment',
      label: 'Điều trị',
      render: (value) => (
        <div className="max-w-xs truncate" title={value}>
          {value || 'Chưa có'}
        </div>
      )
    },
    {
      key: 'doctor_in_charge',
      label: 'Bác sĩ phụ trách',
      render: (value) => value || 'Chưa chỉ định'
    },
    {
      key: 'status',
      label: 'Trạng thái',
      render: (value) => {
        const variants = {
          'active': 'warning',
          'recovered': 'success',
          'follow-up': 'info',
          'critical': 'danger'
        };
        const labels = {
          'active': 'Đang điều trị',
          'recovered': 'Đã khỏi',
          'follow-up': 'Cần tái khám',
          'critical': 'Nguy kịch'
        };
        return <Badge variant={variants[value] || 'default'}>{labels[value] || value}</Badge>;
      }
    },
    {
      key: 'follow_up_date',
      label: 'Ngày tái khám',
      render: (value) => value || '-'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[var(--color-admin-text-light-primary)]">
            Danh sách Bệnh nhân
          </h2>
          <p className="text-sm text-[var(--color-admin-text-light-secondary)] mt-1">
            Quản lý thông tin chi tiết bệnh nhân và hồ sơ y tế
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
            onClick={handleAdd}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-admin-primary)] text-white rounded-lg hover:opacity-90"
          >
            <span className="material-symbols-outlined text-xl">add</span>
            Thêm bệnh nhân
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-lg text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Tổng bệnh nhân</p>
              <p className="text-2xl font-bold mt-1">{stats.total}</p>
            </div>
            <span className="material-symbols-outlined text-4xl opacity-80">group</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-6 rounded-lg text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Đang điều trị</p>
              <p className="text-2xl font-bold mt-1">{stats.active}</p>
            </div>
            <span className="material-symbols-outlined text-4xl opacity-80">medical_services</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-lg text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Đã khỏi</p>
              <p className="text-2xl font-bold mt-1">{stats.recovered}</p>
            </div>
            <span className="material-symbols-outlined text-4xl opacity-80">health_and_safety</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-lg text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Cần tái khám</p>
              <p className="text-2xl font-bold mt-1">{stats.followUp}</p>
            </div>
            <span className="material-symbols-outlined text-4xl opacity-80">event_repeat</span>
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
              placeholder="Tìm kiếm theo mã BN, chẩn đoán, bác sĩ..."
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
          <option value="active">Đang điều trị</option>
          <option value="recovered">Đã khỏi</option>
          <option value="follow-up">Cần tái khám</option>
          <option value="critical">Nguy kịch</option>
        </select>

        <input
          type="text"
          placeholder="Lọc theo bác sĩ"
          value={filterDoctor}
          onChange={(e) => setFilterDoctor(e.target.value)}
          className="px-4 py-2 border border-[var(--color-admin-border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-admin-primary)]"
        />

        <input
          type="date"
          value={filterDateFrom}
          onChange={(e) => setFilterDateFrom(e.target.value)}
          placeholder="Từ ngày"
          className="px-4 py-2 border border-[var(--color-admin-border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-admin-primary)]"
        />

        <input
          type="date"
          value={filterDateTo}
          onChange={(e) => setFilterDateTo(e.target.value)}
          placeholder="Đến ngày"
          className="px-4 py-2 border border-[var(--color-admin-border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-admin-primary)]"
        />

        <div className="text-sm text-[var(--color-admin-text-light-secondary)]">
          Tổng: <strong>{filteredPatients.length}</strong> bệnh nhân
        </div>
      </div>

      <DataTable
        columns={columns}
        data={filteredPatients}
        itemsPerPage={10}
        actions={(patient) => (
          <div className="flex gap-2">
            <button
              onClick={() => handleView(patient)}
              className="p-2 text-blue-600 hover:bg-blue-100 rounded"
              title="Xem chi tiết"
            >
              <span className="material-symbols-outlined text-xl">visibility</span>
            </button>
            <button
              onClick={() => printPrescription(patient)}
              className="p-2 text-purple-600 hover:bg-purple-100 rounded"
              title="In đơn thuốc"
            >
              <span className="material-symbols-outlined text-xl">print</span>
            </button>
            <button
              onClick={() => handleEdit(patient)}
              className="p-2 text-[var(--color-admin-primary)] hover:bg-[var(--color-admin-primary)]/10 rounded"
              title="Sửa"
            >
              <span className="material-symbols-outlined text-xl">edit</span>
            </button>
            <button
              onClick={() => handleDelete(patient)}
              className="p-2 text-[var(--color-admin-danger)] hover:bg-[var(--color-admin-danger)]/10 rounded"
              title="Xóa"
            >
              <span className="material-symbols-outlined text-xl">delete</span>
            </button>
          </div>
        )}
      />

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto m-4">
            <div className="sticky top-0 bg-white border-b border-[var(--color-admin-border-light)] p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-[var(--color-admin-text-light-primary)]">
                  {editingPatient ? 'Cập nhật hồ sơ bệnh nhân' : 'Thêm bệnh nhân mới'}
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
                    Mã bệnh nhân <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.patient_code}
                    onChange={(e) => setFormData({ ...formData, patient_code: e.target.value })}
                    disabled={!!editingPatient}
                    required
                    placeholder="BN123456789"
                    className="w-full px-4 py-2 border border-[var(--color-admin-border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-admin-primary)] disabled:bg-gray-100"
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--color-admin-text-light-primary)] mb-2">
                    Bác sĩ phụ trách
                  </label>
                  <input
                    type="text"
                    value={formData.doctor_in_charge}
                    onChange={(e) => setFormData({ ...formData, doctor_in_charge: e.target.value })}
                    placeholder="BS. Nguyễn Văn A"
                    className="w-full px-4 py-2 border border-[var(--color-admin-border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-admin-primary)]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--color-admin-text-light-primary)] mb-2">
                    Trạng thái
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-4 py-2 border border-[var(--color-admin-border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-admin-primary)]"
                  >
                    <option value="active">Đang điều trị</option>
                    <option value="recovered">Đã khỏi</option>
                    <option value="follow-up">Cần tái khám</option>
                    <option value="critical">Nguy kịch</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--color-admin-text-light-primary)] mb-2">
                  Chẩn đoán <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.diagnosis}
                  onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
                  required
                  rows="2"
                  className="w-full px-4 py-2 border border-[var(--color-admin-border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-admin-primary)]"
                  placeholder="Chẩn đoán bệnh..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--color-admin-text-light-primary)] mb-2">
                  Phương pháp điều trị
                </label>
                <textarea
                  value={formData.treatment}
                  onChange={(e) => setFormData({ ...formData, treatment: e.target.value })}
                  rows="2"
                  className="w-full px-4 py-2 border border-[var(--color-admin-border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-admin-primary)]"
                  placeholder="Phương pháp điều trị..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--color-admin-text-light-primary)] mb-2">
                  Đơn thuốc
                </label>
                <textarea
                  value={formData.prescription}
                  onChange={(e) => setFormData({ ...formData, prescription: e.target.value })}
                  rows="3"
                  className="w-full px-4 py-2 border border-[var(--color-admin-border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-admin-primary)]"
                  placeholder="Danh sách thuốc và liều lượng..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--color-admin-text-light-primary)] mb-2">
                    Tiền sử bệnh
                  </label>
                  <textarea
                    value={formData.medical_history}
                    onChange={(e) => setFormData({ ...formData, medical_history: e.target.value })}
                    rows="2"
                    className="w-full px-4 py-2 border border-[var(--color-admin-border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-admin-primary)]"
                    placeholder="Tiền sử bệnh..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--color-admin-text-light-primary)] mb-2">
                    Dị ứng
                  </label>
                  <input
                    type="text"
                    value={formData.allergies}
                    onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                    placeholder="Các loại dị ứng (nếu có)"
                    className="w-full px-4 py-2 border border-[var(--color-admin-border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-admin-primary)]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--color-admin-text-light-primary)] mb-2">
                    Ngày tái khám
                  </label>
                  <input
                    type="date"
                    value={formData.follow_up_date}
                    onChange={(e) => setFormData({ ...formData, follow_up_date: e.target.value })}
                    className="w-full px-4 py-2 border border-[var(--color-admin-border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-admin-primary)]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--color-admin-text-light-primary)] mb-2">
                    Ghi chú
                  </label>
                  <input
                    type="text"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Ghi chú thêm..."
                    className="w-full px-4 py-2 border border-[var(--color-admin-border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-admin-primary)]"
                  />
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
                  {editingPatient ? 'Cập nhật' : 'Thêm mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Modal */}
      {isViewModalOpen && viewingPatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto m-4">
            <div className="sticky top-0 bg-white border-b border-[var(--color-admin-border-light)] p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-[var(--color-admin-text-light-primary)]">
                  Hồ sơ bệnh án - {viewingPatient.patient_code}
                </h3>
                <button
                  onClick={() => setIsViewModalOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Mã bệnh nhân</p>
                  <p className="font-medium">{viewingPatient.patient_code}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Ngày khám</p>
                  <p className="font-medium">{viewingPatient.visit_date}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Bác sĩ phụ trách</p>
                  <p className="font-medium">{viewingPatient.doctor_in_charge || 'Chưa chỉ định'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Trạng thái</p>
                  <div className="mt-1">
                    {(() => {
                      const variants = { 'active': 'warning', 'recovered': 'success', 'follow-up': 'info', 'critical': 'danger' };
                      const labels = { 'active': 'Đang điều trị', 'recovered': 'Đã khỏi', 'follow-up': 'Cần tái khám', 'critical': 'Nguy kịch' };
                      return <Badge variant={variants[viewingPatient.status] || 'default'}>{labels[viewingPatient.status] || viewingPatient.status}</Badge>;
                    })()}
                  </div>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500">Chẩn đoán</p>
                <p className="font-medium mt-1">{viewingPatient.diagnosis}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Phương pháp điều trị</p>
                <p className="mt-1">{viewingPatient.treatment || 'Chưa có'}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Đơn thuốc</p>
                <pre className="mt-1 p-3 bg-gray-50 rounded border border-gray-200 whitespace-pre-wrap">
                  {viewingPatient.prescription || 'Chưa có đơn thuốc'}
                </pre>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Tiền sử bệnh</p>
                  <p className="mt-1">{viewingPatient.medical_history || 'Không có'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Dị ứng</p>
                  <p className="mt-1 text-red-600">{viewingPatient.allergies || 'Không có'}</p>
                </div>
              </div>

              {viewingPatient.follow_up_date && (
                <div>
                  <p className="text-sm text-gray-500">Ngày tái khám</p>
                  <p className="font-medium text-blue-600">{viewingPatient.follow_up_date}</p>
                </div>
              )}

              {viewingPatient.notes && (
                <div>
                  <p className="text-sm text-gray-500">Ghi chú</p>
                  <p className="mt-1">{viewingPatient.notes}</p>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => printPrescription(viewingPatient)}
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:opacity-90"
                >
                  In đơn thuốc
                </button>
                <button
                  onClick={() => setIsViewModalOpen(false)}
                  className="flex-1 px-4 py-2 border border-[var(--color-admin-border-light)] text-[var(--color-admin-text-light-primary)] rounded-lg hover:bg-gray-50"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Patient_List_Details;
