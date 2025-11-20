import React, { useEffect, useState } from 'react';
import { DataTable, Badge } from '../../../components/admin';

const Appointment_List = () => {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [stats, setStats] = useState({
    total: 0,
    confirmed: 0,
    scheduled: 0,
    completed: 0
  });
  const [formData, setFormData] = useState({
    full_name: '',
    phone_number: '',
    appointment_date: new Date().toISOString().split('T')[0],
    appointment_time: '09:00',
    doctor_name: '',
    specialty: 'Khoa Nội',
    notes: ''
  });

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      const response = await fetch('/api/appointments');
      const result = await response.json();
      const data = result.data || [];
      setAppointments(data);
      setFilteredAppointments(data);
      calculateStats(data);
    } catch (error) {
      console.error('Error loading appointments:', error);
      setAppointments([]);
      setFilteredAppointments([]);
      showMessage('error', 'Không thể tải danh sách lịch hẹn!');
    }
  };

  const calculateStats = (data) => {
    const stats = {
      total: data.length,
      confirmed: data.filter(a => a.status === 'confirmed').length,
      scheduled: data.filter(a => a.status === 'pending').length,
      completed: data.filter(a => a.status === 'completed').length
    };
    setStats(stats);
  };

  useEffect(() => {
    let filtered = [...(appointments || [])];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(a =>
        (a.full_name || '').toLowerCase().includes(query) ||
        (a.phone_number || '').toLowerCase().includes(query) ||
        (a.doctor_name || '').toLowerCase().includes(query)
      );
    }

    if (filterStatus) {
      filtered = filtered.filter(a => a.status === filterStatus);
    }

    if (filterDateFrom) {
      filtered = filtered.filter(a => a.appointment_date >= filterDateFrom);
    }

    if (filterDateTo) {
      filtered = filtered.filter(a => a.appointment_date <= filterDateTo);
    }

    setFilteredAppointments(filtered);
  }, [searchQuery, filterStatus, filterDateFrom, filterDateTo, appointments]);

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  };

  const handleAdd = () => {
    setEditingAppointment(null);
    setFormData({
      full_name: '',
      phone_number: '',
      appointment_date: new Date().toISOString().split('T')[0],
      appointment_time: '09:00',
      doctor_name: '',
      specialty: 'Khoa Nội',
      notes: ''
    });
    setIsModalOpen(true);
  };

  const handleEdit = (appointment) => {
    setEditingAppointment(appointment);
    setFormData({
      full_name: appointment.full_name || '',
      phone_number: appointment.phone_number || '',
      appointment_date: appointment.appointment_date || '',
      appointment_time: appointment.appointment_time || '',
      doctor_name: appointment.doctor_name || '',
      specialty: appointment.specialty || 'Khoa Nội',
      notes: appointment.notes || ''
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (appointment) => {
    if (!window.confirm(`Bạn có chắc muốn xóa lịch hẹn của "${appointment.full_name}"?`)) {
      return;
    }
    try {
      const response = await fetch(`/api/appointments/${appointment.id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        await loadAppointments();
        showMessage('success', 'Xóa lịch hẹn thành công!');
      } else {
        throw new Error('Failed to delete appointment');
      }
    } catch (error) {
      console.error('Error deleting appointment:', error);
      showMessage('error', 'Không thể xóa lịch hẹn!');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.full_name || !formData.phone_number || !formData.appointment_date || !formData.appointment_time) {
      showMessage('error', 'Vui lòng điền đầy đủ thông tin bắt buộc!');
      return;
    }

    // Validate phone number (10 digits)
    if (!/^\d{10}$/.test(formData.phone_number)) {
      showMessage('error', 'Số điện thoại phải có 10 chữ số!');
      return;
    }

    try {
      if (editingAppointment) {
        const response = await fetch(`/api/appointments/${editingAppointment.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        if (response.ok) {
          showMessage('success', 'Cập nhật lịch hẹn thành công!');
        } else {
          throw new Error('Failed to update appointment');
        }
      } else {
        const response = await fetch('/api/appointments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        if (response.ok) {
          showMessage('success', 'Thêm lịch hẹn mới thành công!');
        } else {
          throw new Error('Failed to create appointment');
        }
      }
      setIsModalOpen(false);
      await loadAppointments();
    } catch (error) {
      console.error('Error submitting appointment:', error);
      showMessage('error', 'Không thể lưu lịch hẹn!');
    }
  };

  const handleStatusUpdate = async (appointment, newStatus) => {
    try {
      const response = await fetch(`/api/appointments/${appointment.id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (response.ok) {
        await loadAppointments();
        showMessage('success', 'Cập nhật trạng thái thành công!');
      } else {
        throw new Error('Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      showMessage('error', 'Không thể cập nhật trạng thái!');
    }
  };

  const isToday = (dateString) => {
    const today = new Date().toISOString().split('T')[0];
    return dateString === today;
  };

  const getTimeRemaining = (dateString, timeString) => {
    const appointmentDateTime = new Date(`${dateString}T${timeString}`);
    const now = new Date();
    const diff = appointmentDateTime - now;

    if (diff < 0) return 'Đã qua';

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (hours < 24) {
      return `${hours}h ${minutes}m`;
    }

    const days = Math.floor(hours / 24);
    return `${days} ngày`;
  };

  const exportAppointments = () => {
    try {
      const dataStr = JSON.stringify(filteredAppointments, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);

      const link = document.createElement('a');
      link.href = url;
      link.download = `appointments_${new Date().toISOString()}.json`;
      link.click();

      URL.revokeObjectURL(url);
      showMessage('success', 'Xuất file thành công!');
    } catch (error) {
      console.error('Error exporting appointments:', error);
      showMessage('error', 'Không thể xuất file!');
    }
  };

  const columns = [
    {
      key: 'full_name',
      label: 'Tên BN',
      sortable: true,
      className: 'font-medium text-[var(--color-admin-text-light-primary)]'
    },
    {
      key: 'phone_number',
      label: 'SĐT',
      render: (value, row) => (
        <a href={`tel:${value}`} className="text-blue-600 hover:underline">
          {value}
        </a>
      )
    },
    {
      key: 'appointment_date',
      label: 'Ngày hẹn',
      sortable: true,
      render: (value, row) => (
        <span className={isToday(value) ? 'font-bold text-green-600' : ''}>
          {value}
        </span>
      )
    },
    {
      key: 'appointment_time',
      label: 'Giờ hẹn',
      render: (value, row) => (
        <div>
          <div>{value}</div>
          {row.status === 'pending' && (
            <div className="text-xs text-gray-500">
              {getTimeRemaining(row.appointment_date, value)}
            </div>
          )}
        </div>
      )
    },
    {
      key: 'doctor_name',
      label: 'Bác sĩ',
      render: (value) => value || 'Chưa chỉ định'
    },
    {
      key: 'specialty',
      label: 'Khoa',
      sortable: true
    },
    {
      key: 'status',
      label: 'Trạng thái',
      render: (value) => {
        const variants = {
          'pending': 'info',
          'confirmed': 'success',
          'completed': 'default',
          'cancelled': 'danger'
        };
        const labels = {
          'pending': 'Đã đặt',
          'confirmed': 'Đã xác nhận',
          'completed': 'Hoàn thành',
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
            Danh sách Lịch hẹn
          </h2>
          <p className="text-sm text-[var(--color-admin-text-light-secondary)] mt-1">
            Quản lý lịch hẹn khám bệnh của bệnh nhân
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={exportAppointments}
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
            Thêm lịch hẹn
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
              <p className="text-sm opacity-90">Tổng lịch hẹn</p>
              <p className="text-2xl font-bold mt-1">{stats.total}</p>
            </div>
            <span className="material-symbols-outlined text-4xl opacity-80">calendar_month</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-lg text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Đã xác nhận</p>
              <p className="text-2xl font-bold mt-1">{stats.confirmed}</p>
            </div>
            <span className="material-symbols-outlined text-4xl opacity-80">check_circle</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 p-6 rounded-lg text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Đang chờ</p>
              <p className="text-2xl font-bold mt-1">{stats.scheduled}</p>
            </div>
            <span className="material-symbols-outlined text-4xl opacity-80">schedule</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-lg text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Đã hoàn thành</p>
              <p className="text-2xl font-bold mt-1">{stats.completed}</p>
            </div>
            <span className="material-symbols-outlined text-4xl opacity-80">task_alt</span>
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
              placeholder="Tìm kiếm theo tên BN, SĐT, bác sĩ..."
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
          <option value="pending">Đã đặt</option>
          <option value="confirmed">Đã xác nhận</option>
          <option value="completed">Hoàn thành</option>
          <option value="cancelled">Đã hủy</option>
        </select>

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
          Tổng: <strong>{filteredAppointments.length}</strong> lịch hẹn
        </div>
      </div>

      <DataTable
        columns={columns}
        data={filteredAppointments}
        itemsPerPage={10}
        actions={(appointment) => (
          <div className="flex gap-2">
            {appointment.status === 'pending' && (
              <button
                onClick={() => handleStatusUpdate(appointment, 'confirmed')}
                className="p-2 text-green-600 hover:bg-green-100 rounded"
                title="Xác nhận"
              >
                <span className="material-symbols-outlined text-xl">check_circle</span>
              </button>
            )}
            {(appointment.status === 'pending' || appointment.status === 'confirmed') && (
              <button
                onClick={() => handleStatusUpdate(appointment, 'completed')}
                className="p-2 text-blue-600 hover:bg-blue-100 rounded"
                title="Hoàn thành"
              >
                <span className="material-symbols-outlined text-xl">task_alt</span>
              </button>
            )}
            <button
              onClick={() => handleEdit(appointment)}
              className="p-2 text-[var(--color-admin-primary)] hover:bg-[var(--color-admin-primary)]/10 rounded"
              title="Sửa"
            >
              <span className="material-symbols-outlined text-xl">edit</span>
            </button>
            <button
              onClick={() => handleDelete(appointment)}
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
                  {editingAppointment ? 'Cập nhật lịch hẹn' : 'Thêm lịch hẹn mới'}
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
                    Tên bệnh nhân <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    required
                    placeholder="Nguyễn Văn A"
                    className="w-full px-4 py-2 border border-[var(--color-admin-border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-admin-primary)]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--color-admin-text-light-primary)] mb-2">
                    Số điện thoại <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={formData.phone_number}
                    onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                    required
                    pattern="\d{10}"
                    placeholder="0123456789"
                    className="w-full px-4 py-2 border border-[var(--color-admin-border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-admin-primary)]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--color-admin-text-light-primary)] mb-2">
                    Ngày hẹn <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.appointment_date}
                    onChange={(e) => setFormData({ ...formData, appointment_date: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-[var(--color-admin-border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-admin-primary)]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--color-admin-text-light-primary)] mb-2">
                    Giờ hẹn <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="time"
                    value={formData.appointment_time}
                    onChange={(e) => setFormData({ ...formData, appointment_time: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-[var(--color-admin-border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-admin-primary)]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--color-admin-text-light-primary)] mb-2">
                    Bác sĩ
                  </label>
                  <input
                    type="text"
                    value={formData.doctor_name}
                    onChange={(e) => setFormData({ ...formData, doctor_name: e.target.value })}
                    placeholder="BS. Nguyễn Văn B"
                    className="w-full px-4 py-2 border border-[var(--color-admin-border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-admin-primary)]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--color-admin-text-light-primary)] mb-2">
                    Khoa <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.specialty}
                    onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                    className="w-full px-4 py-2 border border-[var(--color-admin-border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-admin-primary)]"
                  >
                    <option value="Khoa Nội">Khoa Nội</option>
                    <option value="Khoa Ngoại">Khoa Ngoại</option>
                    <option value="Khoa Nhi">Khoa Nhi</option>
                    <option value="Khoa Sản">Khoa Sản</option>
                    <option value="Khoa Mắt">Khoa Mắt</option>
                    <option value="Khoa Tai Mũi Họng">Khoa Tai Mũi Họng</option>
                    <option value="Khoa Da Liễu">Khoa Da Liễu</option>
                    <option value="Khoa Tim Mạch">Khoa Tim Mạch</option>
                    <option value="Khoa Thần Kinh">Khoa Thần Kinh</option>
                    <option value="Khoa Xét Nghiệm">Khoa Xét Nghiệm</option>
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
                  placeholder="Ghi chú về lịch hẹn..."
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
                  {editingAppointment ? 'Cập nhật' : 'Thêm mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Appointment_List;
