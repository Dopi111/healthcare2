// WorkScheduleService - Quản lý lịch làm việc

const STORAGE_KEY = 'healthcare_work_schedules';

// Dữ liệu mẫu
const defaultSchedules = [
    {
        id: '1',
        scheduleId: 'LLV001',
        employeeId: 'NV001',
        employeeName: 'Bác sĩ Nguyễn Văn A',
        department: 'Khoa Nội',
        date: '2024-11-15',
        shift: 'Ca sáng',
        startTime: '07:00',
        endTime: '12:00',
        status: 'Đã xác nhận',
        notes: 'Trực phòng khám tổng quát',
        createdAt: new Date().toISOString()
    },
    {
        id: '2',
        scheduleId: 'LLV002',
        employeeId: 'NV001',
        employeeName: 'Bác sĩ Nguyễn Văn A',
        department: 'Khoa Nội',
        date: '2024-11-16',
        shift: 'Ca chiều',
        startTime: '13:00',
        endTime: '18:00',
        status: 'Đã xác nhận',
        notes: 'Khám bệnh theo lịch hẹn',
        createdAt: new Date().toISOString()
    },
    {
        id: '3',
        scheduleId: 'LLV003',
        employeeId: 'NV002',
        employeeName: 'Y tá Trần Thị B',
        department: 'Khoa Hồi sức',
        date: '2024-11-15',
        shift: 'Ca tối',
        startTime: '18:00',
        endTime: '00:00',
        status: 'Đã xác nhận',
        notes: 'Trực ban đêm',
        createdAt: new Date().toISOString()
    },
    {
        id: '4',
        scheduleId: 'LLV004',
        employeeId: 'NV003',
        employeeName: 'Bác sĩ Lê Văn C',
        department: 'Khoa Ngoại',
        date: '2024-11-17',
        shift: 'Ca sáng',
        startTime: '07:00',
        endTime: '12:00',
        status: 'Chưa xác nhận',
        notes: 'Phẫu thuật nhỏ',
        createdAt: new Date().toISOString()
    },
    {
        id: '5',
        scheduleId: 'LLV005',
        employeeId: 'NV004',
        employeeName: 'Dược sĩ Phạm Thị D',
        department: 'Khoa Dược',
        date: '2024-11-18',
        shift: 'Ca sáng',
        startTime: '08:00',
        endTime: '12:00',
        status: 'Đã hủy',
        notes: 'Nghỉ phép đột xuất',
        createdAt: new Date().toISOString()
    }
];

class WorkScheduleService {
    static initializeSchedules() {
        const existing = localStorage.getItem(STORAGE_KEY);
        if (!existing) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultSchedules));
            return defaultSchedules;
        }
        return JSON.parse(existing);
    }

    static getAllSchedules() {
        const schedules = localStorage.getItem(STORAGE_KEY);
        if (!schedules) {
            return this.initializeSchedules();
        }
        return JSON.parse(schedules);
    }

    static getScheduleById(id) {
        const schedules = this.getAllSchedules();
        return schedules.find(s => s.id === id);
    }

    static getScheduleByScheduleId(scheduleId) {
        const schedules = this.getAllSchedules();
        return schedules.find(s => s.scheduleId === scheduleId);
    }

    static addSchedule(scheduleData) {
        const schedules = this.getAllSchedules();

        // Kiểm tra trùng scheduleId
        if (schedules.some(s => s.scheduleId === scheduleData.scheduleId)) {
            throw new Error('Mã lịch làm việc đã tồn tại!');
        }

        // Kiểm tra trùng lịch (cùng nhân viên, ngày và ca)
        const duplicate = schedules.find(s =>
            s.employeeId === scheduleData.employeeId &&
            s.date === scheduleData.date &&
            s.shift === scheduleData.shift &&
            s.status !== 'Đã hủy'
        );

        if (duplicate) {
            throw new Error('Nhân viên đã có lịch làm việc vào ca này!');
        }

        // Tạo ID mới
        const maxId = schedules.length > 0
            ? Math.max(...schedules.map(s => parseInt(s.id) || 0))
            : 0;

        const newSchedule = {
            ...scheduleData,
            id: (maxId + 1).toString(),
            createdAt: new Date().toISOString()
        };

        schedules.push(newSchedule);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(schedules));
        return newSchedule;
    }

    static updateSchedule(id, scheduleData) {
        const schedules = this.getAllSchedules();
        const index = schedules.findIndex(s => s.id === id);

        if (index === -1) {
            throw new Error('Không tìm thấy lịch làm việc!');
        }

        // Kiểm tra trùng scheduleId (trừ chính nó)
        if (scheduleData.scheduleId &&
            schedules.some(s => s.id !== id && s.scheduleId === scheduleData.scheduleId)) {
            throw new Error('Mã lịch làm việc đã tồn tại!');
        }

        // Kiểm tra trùng lịch (trừ chính nó)
        if (scheduleData.employeeId && scheduleData.date && scheduleData.shift) {
            const duplicate = schedules.find(s =>
                s.id !== id &&
                s.employeeId === scheduleData.employeeId &&
                s.date === scheduleData.date &&
                s.shift === scheduleData.shift &&
                s.status !== 'Đã hủy'
            );

            if (duplicate) {
                throw new Error('Nhân viên đã có lịch làm việc vào ca này!');
            }
        }

        schedules[index] = {
            ...schedules[index],
            ...scheduleData,
            id: id,
            updatedAt: new Date().toISOString()
        };

        localStorage.setItem(STORAGE_KEY, JSON.stringify(schedules));
        return schedules[index];
    }

    static deleteSchedule(id) {
        const schedules = this.getAllSchedules();
        const filtered = schedules.filter(s => s.id !== id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    }

    static searchSchedules(query) {
        const schedules = this.getAllSchedules();
        const q = query.toLowerCase();
        return schedules.filter(s =>
            s.scheduleId.toLowerCase().includes(q) ||
            s.employeeId.toLowerCase().includes(q) ||
            s.employeeName.toLowerCase().includes(q) ||
            s.department.toLowerCase().includes(q)
        );
    }

    static getSchedulesByEmployee(employeeId) {
        const schedules = this.getAllSchedules();
        return schedules.filter(s => s.employeeId === employeeId);
    }

    static getSchedulesByDepartment(department) {
        const schedules = this.getAllSchedules();
        return schedules.filter(s => s.department === department);
    }

    static getSchedulesByDate(date) {
        const schedules = this.getAllSchedules();
        return schedules.filter(s => s.date === date);
    }

    static getSchedulesByDateRange(startDate, endDate) {
        const schedules = this.getAllSchedules();
        return schedules.filter(s => {
            const scheduleDate = new Date(s.date);
            const start = new Date(startDate);
            const end = new Date(endDate);
            return scheduleDate >= start && scheduleDate <= end;
        });
    }

    static getSchedulesByStatus(status) {
        const schedules = this.getAllSchedules();
        return schedules.filter(s => s.status === status);
    }

    static getSchedulesByShift(shift) {
        const schedules = this.getAllSchedules();
        return schedules.filter(s => s.shift === shift);
    }

    static resetToDefault() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultSchedules));
        return defaultSchedules;
    }

    static exportSchedules() {
        const schedules = this.getAllSchedules();
        const dataStr = JSON.stringify(schedules, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);

        const link = document.createElement('a');
        link.href = url;
        link.download = `work_schedules_${new Date().toISOString()}.json`;
        link.click();

        URL.revokeObjectURL(url);
    }
}

export default WorkScheduleService;
