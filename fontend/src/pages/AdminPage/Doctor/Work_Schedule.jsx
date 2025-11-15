import React, { useEffect, useState } from 'react';
import { DataTable, Badge } from '../../../components/admin';
import WorkScheduleService from '../../../services/WorkScheduleService';

const Work_Schedule = () => {
  const [schedules, setSchedules] = useState([]);
  const [filteredSchedules, setFilteredSchedules] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterShift, setFilterShift] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [formData, setFormData] = useState({
    scheduleId: '',
    employeeId: '',
    employeeName: '',
    department: '',
    date: new Date().toISOString().split('T')[0],
    shift: 'Ca sáng',
    startTime: '07:00',
    endTime: '12:00',
    status: 'Chưa xác nhận',
    notes: ''
  });

  useEffect(() => {
    loadSchedules();
  }, []);

  const loadSchedules = () => {
    try {
      const data = WorkScheduleService.getAllSchedules();
      setSchedules(data);
      setFilteredSchedules(data);
    } catch (error) {
      showMessage('error', 'Không thể tải danh sách lịch làm việc!');
    }
  };

  useEffect(() => {
    let filtered = [...schedules];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(s =>
        s.scheduleId.toLowerCase().includes(query) ||
        s.employeeId.toLowerCase().includes(query) ||
        s.employeeName.toLowerCase().includes(query) ||
        s.department.toLowerCase().includes(query)
      );
    }

    if (filterStatus) {
      filtered = filtered.filter(s => s.status === filterStatus);
    }

    if (filterShift) {
      filtered = filtered.filter(s => s.shift === filterShift);
    }

    setFilteredSchedules(filtered);
  }, [searchQuery, filterStatus, filterShift, schedules]);

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  };

  const handleAdd = () => {
    setEditingSchedule(null);
    setFormData({
      scheduleId: '',
      employeeId: '',
      employeeName: '',
      department: '',
      date: new Date().toISOString().split('T')[0],
      shift: 'Ca sáng',
      startTime: '07:00',
      endTime: '12:00',
      status: 'Chưa xác nhận',
      notes: ''
    });
    setIsModalOpen(true);
  };

  const handleEdit = (schedule) => {
    setEditingSchedule(schedule);
    setFormData(schedule);
    setIsModalOpen(true);
  };

  const handleDelete = (schedule) => {
    if (!window.confirm(`Bạn có chắc muốn xóa lịch làm việc "${schedule.scheduleId}"?`)) {
      return;
    }
    try {
      WorkScheduleService.deleteSchedule(schedule.id);
      loadSchedules();
      showMessage('success', 'Xóa lịch làm việc thành công!');
    } catch (error) {
      showMessage('error', error.message);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.scheduleId || !formData.employeeId || !formData.employeeName || !formData.date) {
      showMessage('error', 'Vui lòng điền đầy đủ thông tin bắt buộc!');
      return;
    }

    try {
      if (editingSchedule) {
        WorkScheduleService.updateSchedule(editingSchedule.id, formData);
        showMessage('success', 'Cập nhật lịch làm việc thành công!');
      } else {
        WorkScheduleService.addSchedule(formData);
        showMessage('success', 'Thêm lịch làm việc mới thành công!');
      }
      setIsModalOpen(false);
      loadSchedules();
    } catch (error) {
      showMessage('error', error.message);
    }
  };

  const handleShiftChange = (shift) => {
    let startTime, endTime;
    switch (shift) {
      case 'Ca sáng':
        startTime = '07:00';
        endTime = '12:00';
        break;
      case 'Ca chiều':
        startTime = '13:00';
        endTime = '18:00';
        break;
      case 'Ca tối':
        startTime = '18:00';
        endTime = '00:00';
        break;
      default:
        startTime = '07:00';
        endTime = '12:00';
    }
    setFormData({ ...formData, shift, startTime, endTime });
  };

  const columns = [
    {
      key: 'scheduleId',
      label: 'Mã lịch',
      sortable: true,
      className: 'font-medium text-[var(--color-admin-text-light-primary)]'
    },
    {
      key: 'employeeName',
      label: 'Nhân viên',
      sortable: true
    },
    {
      key: 'department',
      label: 'Khoa',
      sortable: true
    },
    {
      key: 'date',
      label: 'Ngày',
      sortable: true
    },
    {
      key: 'shift',
      label: 'Ca làm',
      render: (value) => {
        const variants = {
          'Ca sáng': 'info',
          'Ca chiều': 'warning',
          'Ca tối': 'primary'
        };
        return <Badge variant={variants[value] || 'default'}>{value}</Badge>;
      }
    },
    {
      key: 'time',
      label: 'Giờ làm',
      render: (value, row) => `${row.startTime} - ${row.endTime}`
    },
    {
      key: 'status',
      label: 'Trạng thái',
      render: (value) => {
        const variants = {
          'Đã xác nhận': 'success',
          'Chưa xác nhận': 'warning',
          'Đã hủy': 'danger'
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
            Quản lý Lịch làm việc
          </h2>
          <p className="text-sm text-[var(--color-admin-text-light-secondary)] mt-1">
            Quản lý lịch làm việc của bác sĩ và nhân viên
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => WorkScheduleService.exportSchedules()}
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
            Thêm lịch
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
              placeholder="Tìm kiếm theo mã lịch, mã NV, tên, khoa..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-[var(--color-admin-border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-admin-primary)]"
            />
          </label>
        </div>

        <select
          value={filterShift}
          onChange={(e) => setFilterShift(e.target.value)}
          className="px-4 py-2 border border-[var(--color-admin-border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-admin-primary)]"
        >
          <option value="">Tất cả ca</option>
          <option value="Ca sáng">Ca sáng</option>
          <option value="Ca chiều">Ca chiều</option>
          <option value="Ca tối">Ca tối</option>
        </select>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border border-[var(--color-admin-border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-admin-primary)]"
        >
          <option value="">Tất cả trạng thái</option>
          <option value="Đã xác nhận">Đã xác nhận</option>
          <option value="Chưa xác nhận">Chưa xác nhận</option>
          <option value="Đã hủy">Đã hủy</option>
        </select>

        <div className="text-sm text-[var(--color-admin-text-light-secondary)]">
          Tổng: <strong>{filteredSchedules.length}</strong> lịch
        </div>
      </div>

      <DataTable
        columns={columns}
        data={filteredSchedules}
        itemsPerPage={10}
        actions={(schedule) => (
          <div className="flex gap-2">
            <button
              onClick={() => handleEdit(schedule)}
              className="p-2 text-[var(--color-admin-primary)] hover:bg-[var(--color-admin-primary)]/10 rounded"
              title="Sửa"
            >
              <span className="material-symbols-outlined text-xl">edit</span>
            </button>
            <button
              onClick={() => handleDelete(schedule)}
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
                  {editingSchedule ? 'Cập nhật lịch làm việc' : 'Thêm lịch làm việc mới'}
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
                    Mã lịch làm việc <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.scheduleId}
                    onChange={(e) => setFormData({ ...formData, scheduleId: e.target.value })}
                    disabled={!!editingSchedule}
                    required
                    placeholder="LLV001"
                    className="w-full px-4 py-2 border border-[var(--color-admin-border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-admin-primary)] disabled:bg-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--color-admin-text-light-primary)] mb-2">
                    Mã nhân viên <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.employeeId}
                    onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                    required
                    placeholder="NV001"
                    className="w-full px-4 py-2 border border-[var(--color-admin-border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-admin-primary)]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--color-admin-text-light-primary)] mb-2">
                    Tên nhân viên <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.employeeName}
                    onChange={(e) => setFormData({ ...formData, employeeName: e.target.value })}
                    required
                    placeholder="Bác sĩ Nguyễn Văn A"
                    className="w-full px-4 py-2 border border-[var(--color-admin-border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-admin-primary)]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--color-admin-text-light-primary)] mb-2">
                    Khoa/Phòng ban
                  </label>
                  <input
                    type="text"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    placeholder="Khoa Nội"
                    className="w-full px-4 py-2 border border-[var(--color-admin-border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-admin-primary)]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--color-admin-text-light-primary)] mb-2">
                    Ngày làm việc <span className="text-red-500">*</span>
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
                    Ca làm việc
                  </label>
                  <select
                    value={formData.shift}
                    onChange={(e) => handleShiftChange(e.target.value)}
                    className="w-full px-4 py-2 border border-[var(--color-admin-border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-admin-primary)]"
                  >
                    <option value="Ca sáng">Ca sáng</option>
                    <option value="Ca chiều">Ca chiều</option>
                    <option value="Ca tối">Ca tối</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--color-admin-text-light-primary)] mb-2">
                    Giờ bắt đầu
                  </label>
                  <input
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    className="w-full px-4 py-2 border border-[var(--color-admin-border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-admin-primary)]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--color-admin-text-light-primary)] mb-2">
                    Giờ kết thúc
                  </label>
                  <input
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    className="w-full px-4 py-2 border border-[var(--color-admin-border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-admin-primary)]"
                  />
                </div>
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
                  <option value="Chưa xác nhận">Chưa xác nhận</option>
                  <option value="Đã xác nhận">Đã xác nhận</option>
                  <option value="Đã hủy">Đã hủy</option>
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
                  placeholder="Trực phòng khám tổng quát..."
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
                  {editingSchedule ? 'Cập nhật' : 'Thêm mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Work_Schedule;
