import React, { useEffect, useState } from 'react';
import { DataTable, Badge } from '../../../components/admin';
import PatientService from '../../../services/PatientService';

const Individual_Patient_Management = () => {
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [formData, setFormData] = useState({
    patientId: '',
    fullName: '',
    dateOfBirth: '',
    gender: 'Nam',
    phone: '',
    address: '',
    idCard: '',
    doctorInCharge: '',
    visitDate: new Date().toISOString().split('T')[0],
    diagnosis: '',
    status: 'Đang điều trị',
    medicalHistory: '',
    allergies: ''
  });

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = () => {
    try {
      const data = PatientService.getAllPatients();
      setPatients(data);
      setFilteredPatients(data);
    } catch (error) {
      showMessage('error', 'Không thể tải danh sách bệnh nhân!');
    }
  };

  useEffect(() => {
    let filtered = [...patients];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p =>
        p.patientId.toLowerCase().includes(query) ||
        p.fullName.toLowerCase().includes(query) ||
        p.phone.toLowerCase().includes(query) ||
        p.diagnosis?.toLowerCase().includes(query)
      );
    }

    if (filterStatus) {
      filtered = filtered.filter(p => p.status === filterStatus);
    }

    setFilteredPatients(filtered);
  }, [searchQuery, filterStatus, patients]);

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  };

  const handleAdd = () => {
    setEditingPatient(null);
    setFormData({
      patientId: '',
      fullName: '',
      dateOfBirth: '',
      gender: 'Nam',
      phone: '',
      address: '',
      idCard: '',
      doctorInCharge: '',
      visitDate: new Date().toISOString().split('T')[0],
      diagnosis: '',
      status: 'Đang điều trị',
      medicalHistory: '',
      allergies: ''
    });
    setIsModalOpen(true);
  };

  const handleEdit = (patient) => {
    setEditingPatient(patient);
    setFormData(patient);
    setIsModalOpen(true);
  };

  const handleDelete = (patient) => {
    if (!window.confirm(`Bạn có chắc muốn xóa bệnh nhân "${patient.fullName}"?`)) {
      return;
    }
    try {
      PatientService.deletePatient(patient.id);
      loadPatients();
      showMessage('success', 'Xóa bệnh nhân thành công!');
    } catch (error) {
      showMessage('error', error.message);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.patientId || !formData.fullName || !formData.dateOfBirth) {
      showMessage('error', 'Vui lòng điền đầy đủ thông tin bắt buộc!');
      return;
    }

    try {
      if (editingPatient) {
        PatientService.updatePatient(editingPatient.id, formData);
        showMessage('success', 'Cập nhật thông tin bệnh nhân thành công!');
      } else {
        PatientService.addPatient(formData);
        showMessage('success', 'Thêm bệnh nhân mới thành công!');
      }
      setIsModalOpen(false);
      loadPatients();
    } catch (error) {
      showMessage('error', error.message);
    }
  };

  const columns = [
    {
      key: 'patientId',
      label: 'Mã BN',
      sortable: true,
      className: 'font-medium text-[var(--color-admin-text-light-primary)]'
    },
    {
      key: 'fullName',
      label: 'Họ tên',
      sortable: true
    },
    {
      key: 'dateOfBirth',
      label: 'Ngày sinh',
      sortable: true
    },
    {
      key: 'phone',
      label: 'Số điện thoại'
    },
    {
      key: 'visitDate',
      label: 'Ngày khám',
      sortable: true
    },
    {
      key: 'diagnosis',
      label: 'Chẩn đoán'
    },
    {
      key: 'status',
      label: 'Tình trạng',
      render: (value) => {
        const variants = {
          'Đang điều trị': 'warning',
          'Tái khám': 'info',
          'Hoàn thành': 'success',
          'Nhập viện': 'danger'
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
            Quản lý Bệnh nhân
          </h2>
          <p className="text-sm text-[var(--color-admin-text-light-secondary)] mt-1">
            Quản lý thông tin bệnh nhân của bác sĩ
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => PatientService.exportPatients()}
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

      <div className="flex flex-wrap gap-4 items-center bg-white p-4 rounded-lg border border-[var(--color-admin-border-light)]">
        <div className="flex-1 min-w-[200px]">
          <label className="relative block">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-admin-text-light-secondary)]">
              search
            </span>
            <input
              type="text"
              placeholder="Tìm kiếm theo mã BN, tên, SĐT, chẩn đoán..."
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
          <option value="">Tất cả tình trạng</option>
          <option value="Đang điều trị">Đang điều trị</option>
          <option value="Tái khám">Tái khám</option>
          <option value="Hoàn thành">Hoàn thành</option>
          <option value="Nhập viện">Nhập viện</option>
        </select>

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

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto m-4">
            <div className="sticky top-0 bg-white border-b border-[var(--color-admin-border-light)] p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-[var(--color-admin-text-light-primary)]">
                  {editingPatient ? 'Cập nhật thông tin bệnh nhân' : 'Thêm bệnh nhân mới'}
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
                    value={formData.patientId}
                    onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
                    disabled={!!editingPatient}
                    required
                    className="w-full px-4 py-2 border border-[var(--color-admin-border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-admin-primary)] disabled:bg-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--color-admin-text-light-primary)] mb-2">
                    Họ và tên <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-[var(--color-admin-border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-admin-primary)]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--color-admin-text-light-primary)] mb-2">
                    Ngày sinh <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-[var(--color-admin-border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-admin-primary)]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--color-admin-text-light-primary)] mb-2">
                    Giới tính
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full px-4 py-2 border border-[var(--color-admin-border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-admin-primary)]"
                  >
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                    <option value="Khác">Khác</option>
                  </select>
                </div>

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
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--color-admin-text-light-primary)] mb-2">
                  Địa chỉ
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-4 py-2 border border-[var(--color-admin-border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-admin-primary)]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--color-admin-text-light-primary)] mb-2">
                    CCCD/CMND
                  </label>
                  <input
                    type="text"
                    value={formData.idCard}
                    onChange={(e) => setFormData({ ...formData, idCard: e.target.value })}
                    className="w-full px-4 py-2 border border-[var(--color-admin-border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-admin-primary)]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--color-admin-text-light-primary)] mb-2">
                    Bác sĩ phụ trách
                  </label>
                  <input
                    type="text"
                    value={formData.doctorInCharge}
                    onChange={(e) => setFormData({ ...formData, doctorInCharge: e.target.value })}
                    className="w-full px-4 py-2 border border-[var(--color-admin-border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-admin-primary)]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--color-admin-text-light-primary)] mb-2">
                    Ngày khám
                  </label>
                  <input
                    type="date"
                    value={formData.visitDate}
                    onChange={(e) => setFormData({ ...formData, visitDate: e.target.value })}
                    className="w-full px-4 py-2 border border-[var(--color-admin-border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-admin-primary)]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--color-admin-text-light-primary)] mb-2">
                    Tình trạng
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-4 py-2 border border-[var(--color-admin-border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-admin-primary)]"
                  >
                    <option value="Đang điều trị">Đang điều trị</option>
                    <option value="Tái khám">Tái khám</option>
                    <option value="Hoàn thành">Hoàn thành</option>
                    <option value="Nhập viện">Nhập viện</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--color-admin-text-light-primary)] mb-2">
                  Chẩn đoán
                </label>
                <textarea
                  value={formData.diagnosis}
                  onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
                  rows="3"
                  className="w-full px-4 py-2 border border-[var(--color-admin-border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-admin-primary)]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--color-admin-text-light-primary)] mb-2">
                  Tiền sử bệnh
                </label>
                <textarea
                  value={formData.medicalHistory}
                  onChange={(e) => setFormData({ ...formData, medicalHistory: e.target.value })}
                  rows="2"
                  className="w-full px-4 py-2 border border-[var(--color-admin-border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-admin-primary)]"
                  placeholder="Ví dụ: Đái tháo đường, cao huyết áp..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--color-admin-text-light-primary)] mb-2">
                  Dị ứng thuốc
                </label>
                <input
                  type="text"
                  value={formData.allergies}
                  onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                  className="w-full px-4 py-2 border border-[var(--color-admin-border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-admin-primary)]"
                  placeholder="Ví dụ: Penicillin, Aspirin..."
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
                  {editingPatient ? 'Cập nhật' : 'Thêm mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Individual_Patient_Management;
