// LaboratoryService - Quản lý kết quả xét nghiệm tại phòng lab

const STORAGE_KEY = 'healthcare_laboratory_tests';

// Dữ liệu mẫu
const defaultTests = [
    {
        id: '1',
        testId: 'LAB001',
        patientId: 'BN001',
        patientName: 'Nguyễn Văn A',
        testType: 'Xét nghiệm máu tổng quát',
        sampleId: 'MAU001',
        sampleType: 'Máu tĩnh mạch',
        receivedDate: '2024-11-14',
        receivedTime: '08:30',
        technician: 'KTV Trần Văn E',
        status: 'Hoàn thành',
        priority: 'Bình thường',
        results: {
            'WBC (Bạch cầu)': { value: '7.2', unit: 'x10³/µL', range: '4.0-11.0', normal: true },
            'RBC (Hồng cầu)': { value: '4.8', unit: 'x10⁶/µL', range: '4.5-5.5', normal: true },
            'HGB (Hemoglobin)': { value: '14.5', unit: 'g/dL', range: '13.5-17.5', normal: true },
            'PLT (Tiểu cầu)': { value: '250', unit: 'x10³/µL', range: '150-400', normal: true }
        },
        completedDate: '2024-11-14',
        completedTime: '10:30',
        verifiedBy: 'BS Kiểm định Phạm Thị F',
        notes: 'Tất cả chỉ số trong giới hạn bình thường',
        createdAt: new Date().toISOString()
    },
    {
        id: '2',
        testId: 'LAB002',
        patientId: 'BN002',
        patientName: 'Trần Thị B',
        testType: 'Xét nghiệm sinh hóa',
        sampleId: 'MAU002',
        sampleType: 'Máu tĩnh mạch',
        receivedDate: '2024-11-14',
        receivedTime: '09:15',
        technician: 'KTV Lê Thị G',
        status: 'Đang xét nghiệm',
        priority: 'Cấp tốc',
        results: {
            'Glucose': { value: '126', unit: 'mg/dL', range: '70-100', normal: false },
            'Creatinine': { value: '1.1', unit: 'mg/dL', range: '0.7-1.3', normal: true },
            'ALT': { value: '28', unit: 'U/L', range: '0-40', normal: true },
            'AST': { value: '32', unit: 'U/L', range: '0-40', normal: true }
        },
        completedDate: '',
        completedTime: '',
        verifiedBy: '',
        notes: 'Đang tiến hành xét nghiệm',
        createdAt: new Date().toISOString()
    },
    {
        id: '3',
        testId: 'LAB003',
        patientId: 'BN003',
        patientName: 'Lê Văn C',
        testType: 'Xét nghiệm nước tiểu',
        sampleId: 'MAU003',
        sampleType: 'Nước tiểu',
        receivedDate: '2024-11-15',
        receivedTime: '07:45',
        technician: 'KTV Nguyễn Văn H',
        status: 'Chờ xử lý',
        priority: 'Bình thường',
        results: {},
        completedDate: '',
        completedTime: '',
        verifiedBy: '',
        notes: 'Mẫu đã nhận, chờ xử lý',
        createdAt: new Date().toISOString()
    },
    {
        id: '4',
        testId: 'LAB004',
        patientId: 'BN004',
        patientName: 'Phạm Thị D',
        testType: 'Xét nghiệm vi sinh',
        sampleId: 'MAU004',
        sampleType: 'Đờm',
        receivedDate: '2024-11-15',
        receivedTime: '08:00',
        technician: 'KTV Hoàng Văn I',
        status: 'Đang xét nghiệm',
        priority: 'Cấp tốc',
        results: {
            'Vi khuẩn': { value: 'Dương tính', unit: '', range: 'Âm tính', normal: false },
            'Nấm': { value: 'Âm tính', unit: '', range: 'Âm tính', normal: true }
        },
        completedDate: '',
        completedTime: '',
        verifiedBy: '',
        notes: 'Đang nuôi cấy vi khuẩn',
        createdAt: new Date().toISOString()
    },
    {
        id: '5',
        testId: 'LAB005',
        patientId: 'BN001',
        patientName: 'Nguyễn Văn A',
        testType: 'Xét nghiệm đông máu',
        sampleId: 'MAU005',
        sampleType: 'Máu tĩnh mạch',
        receivedDate: '2024-11-15',
        receivedTime: '09:30',
        technician: 'KTV Trần Văn E',
        status: 'Hoàn thành',
        priority: 'Bình thường',
        results: {
            'PT (Prothrombin Time)': { value: '12.5', unit: 'giây', range: '11-13.5', normal: true },
            'INR': { value: '1.0', unit: '', range: '0.8-1.2', normal: true },
            'APTT': { value: '32', unit: 'giây', range: '25-35', normal: true }
        },
        completedDate: '2024-11-15',
        completedTime: '11:00',
        verifiedBy: 'BS Kiểm định Phạm Thị F',
        notes: 'Chức năng đông máu bình thường',
        createdAt: new Date().toISOString()
    }
];

class LaboratoryService {
    static initializeTests() {
        const existing = localStorage.getItem(STORAGE_KEY);
        if (!existing) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultTests));
            return defaultTests;
        }
        return JSON.parse(existing);
    }

    static getAllTests() {
        const tests = localStorage.getItem(STORAGE_KEY);
        if (!tests) {
            return this.initializeTests();
        }
        return JSON.parse(tests);
    }

    static getTestById(id) {
        const tests = this.getAllTests();
        return tests.find(t => t.id === id);
    }

    static getTestByTestId(testId) {
        const tests = this.getAllTests();
        return tests.find(t => t.testId === testId);
    }

    static addTest(testData) {
        const tests = this.getAllTests();

        // Kiểm tra trùng testId
        if (tests.some(t => t.testId === testData.testId)) {
            throw new Error('Mã xét nghiệm đã tồn tại!');
        }

        // Kiểm tra trùng sampleId
        if (testData.sampleId && tests.some(t => t.sampleId === testData.sampleId)) {
            throw new Error('Mã mẫu bệnh phẩm đã tồn tại!');
        }

        // Tạo ID mới
        const maxId = tests.length > 0
            ? Math.max(...tests.map(t => parseInt(t.id) || 0))
            : 0;

        const newTest = {
            ...testData,
            id: (maxId + 1).toString(),
            createdAt: new Date().toISOString()
        };

        tests.push(newTest);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tests));
        return newTest;
    }

    static updateTest(id, testData) {
        const tests = this.getAllTests();
        const index = tests.findIndex(t => t.id === id);

        if (index === -1) {
            throw new Error('Không tìm thấy xét nghiệm!');
        }

        // Kiểm tra trùng testId (trừ chính nó)
        if (testData.testId &&
            tests.some(t => t.id !== id && t.testId === testData.testId)) {
            throw new Error('Mã xét nghiệm đã tồn tại!');
        }

        // Kiểm tra trùng sampleId (trừ chính nó)
        if (testData.sampleId &&
            tests.some(t => t.id !== id && t.sampleId === testData.sampleId)) {
            throw new Error('Mã mẫu bệnh phẩm đã tồn tại!');
        }

        tests[index] = {
            ...tests[index],
            ...testData,
            id: id,
            updatedAt: new Date().toISOString()
        };

        localStorage.setItem(STORAGE_KEY, JSON.stringify(tests));
        return tests[index];
    }

    static deleteTest(id) {
        const tests = this.getAllTests();
        const filtered = tests.filter(t => t.id !== id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    }

    static searchTests(query) {
        const tests = this.getAllTests();
        const q = query.toLowerCase();
        return tests.filter(t =>
            t.testId.toLowerCase().includes(q) ||
            t.patientId.toLowerCase().includes(q) ||
            t.patientName.toLowerCase().includes(q) ||
            t.testType.toLowerCase().includes(q) ||
            t.sampleId.toLowerCase().includes(q)
        );
    }

    static getTestsByStatus(status) {
        const tests = this.getAllTests();
        return tests.filter(t => t.status === status);
    }

    static getTestsByPatient(patientId) {
        const tests = this.getAllTests();
        return tests.filter(t => t.patientId === patientId);
    }

    static getTestsByDateRange(startDate, endDate) {
        const tests = this.getAllTests();
        return tests.filter(t => {
            const testDate = new Date(t.receivedDate);
            const start = new Date(startDate);
            const end = new Date(endDate);
            return testDate >= start && testDate <= end;
        });
    }

    static getTestsByTechnician(technician) {
        const tests = this.getAllTests();
        return tests.filter(t => t.technician === technician);
    }

    static getPendingTests() {
        return this.getTestsByStatus('Chờ xử lý');
    }

    static getInProgressTests() {
        return this.getTestsByStatus('Đang xét nghiệm');
    }

    static getCompletedTests() {
        return this.getTestsByStatus('Hoàn thành');
    }

    static updateTestStatus(id, status, additionalData = {}) {
        const test = this.getTestById(id);
        if (!test) {
            throw new Error('Không tìm thấy xét nghiệm!');
        }

        const updateData = {
            status,
            ...additionalData
        };

        // Nếu chuyển sang hoàn thành, cập nhật thời gian
        if (status === 'Hoàn thành' && !additionalData.completedDate) {
            const now = new Date();
            updateData.completedDate = now.toISOString().split('T')[0];
            updateData.completedTime = now.toTimeString().slice(0, 5);
        }

        return this.updateTest(id, updateData);
    }

    static getStatistics() {
        const tests = this.getAllTests();
        return {
            total: tests.length,
            pending: tests.filter(t => t.status === 'Chờ xử lý').length,
            inProgress: tests.filter(t => t.status === 'Đang xét nghiệm').length,
            completed: tests.filter(t => t.status === 'Hoàn thành').length,
            urgent: tests.filter(t => t.priority === 'Cấp tốc').length
        };
    }

    static resetToDefault() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultTests));
        return defaultTests;
    }

    static exportTests() {
        const tests = this.getAllTests();
        const dataStr = JSON.stringify(tests, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);

        const link = document.createElement('a');
        link.href = url;
        link.download = `laboratory_tests_${new Date().toISOString()}.json`;
        link.click();

        URL.revokeObjectURL(url);
    }
}

export default LaboratoryService;
