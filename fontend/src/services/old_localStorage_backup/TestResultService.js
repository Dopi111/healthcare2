// TestResultService - Quản lý phiếu xét nghiệm

const STORAGE_KEY = 'healthcare_test_results';

// Dữ liệu mẫu
const defaultTestResults = [
    {
        id: '1',
        testId: 'PXN001',
        patientId: 'BN001',
        patientName: 'Nguyễn Văn An',
        testType: 'Xét nghiệm máu tổng quát',
        doctorOrder: 'Bác sĩ Nguyễn Văn A',
        orderDate: '2024-11-10',
        sampleDate: '2024-11-10',
        resultDate: '2024-11-11',
        status: 'Hoàn thành',
        priority: 'Bình thường',
        results: {
            'Hồng cầu': '4.8 triệu/µL',
            'Bạch cầu': '7.2 nghìn/µL',
            'Tiểu cầu': '250 nghìn/µL',
            'Hemoglobin': '14.5 g/dL'
        },
        notes: 'Các chỉ số trong giới hạn bình thường',
        createdAt: new Date().toISOString()
    },
    {
        id: '2',
        testId: 'PXN002',
        patientId: 'BN002',
        patientName: 'Trần Thị Bình',
        testType: 'Xét nghiệm đường huyết',
        doctorOrder: 'Bác sĩ Nguyễn Văn A',
        orderDate: '2024-11-12',
        sampleDate: '2024-11-12',
        resultDate: '2024-11-12',
        status: 'Hoàn thành',
        priority: 'Cấp tốc',
        results: {
            'Glucose lúc đói': '126 mg/dL',
            'HbA1c': '7.2%'
        },
        notes: 'Glucose cao, cần theo dõi',
        createdAt: new Date().toISOString()
    },
    {
        id: '3',
        testId: 'PXN003',
        patientId: 'BN003',
        patientName: 'Lê Văn Cường',
        testType: 'Xét nghiệm gan',
        doctorOrder: 'Bác sĩ Nguyễn Văn A',
        orderDate: '2024-11-14',
        sampleDate: '2024-11-14',
        resultDate: null,
        status: 'Đang xử lý',
        priority: 'Bình thường',
        results: {},
        notes: 'Chờ kết quả',
        createdAt: new Date().toISOString()
    }
];

class TestResultService {
    static initializeTestResults() {
        const existing = localStorage.getItem(STORAGE_KEY);
        if (!existing) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultTestResults));
            return defaultTestResults;
        }
        return JSON.parse(existing);
    }

    static getAllTestResults() {
        const tests = localStorage.getItem(STORAGE_KEY);
        if (!tests) {
            return this.initializeTestResults();
        }
        return JSON.parse(tests);
    }

    static getTestResultById(id) {
        const tests = this.getAllTestResults();
        return tests.find(t => t.id === id);
    }

    static getTestResultByTestId(testId) {
        const tests = this.getAllTestResults();
        return tests.find(t => t.testId === testId);
    }

    static addTestResult(testData) {
        const tests = this.getAllTestResults();

        // Kiểm tra trùng testId
        if (tests.some(t => t.testId === testData.testId)) {
            throw new Error('Mã phiếu xét nghiệm đã tồn tại!');
        }

        // Tạo ID mới
        const maxId = tests.length > 0
            ? Math.max(...tests.map(t => parseInt(t.id) || 0))
            : 0;

        const newTest = {
            ...testData,
            id: (maxId + 1).toString(),
            results: testData.results || {},
            createdAt: new Date().toISOString()
        };

        tests.push(newTest);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tests));
        return newTest;
    }

    static updateTestResult(id, testData) {
        const tests = this.getAllTestResults();
        const index = tests.findIndex(t => t.id === id);

        if (index === -1) {
            throw new Error('Không tìm thấy phiếu xét nghiệm!');
        }

        // Kiểm tra trùng testId (trừ chính nó)
        if (testData.testId &&
            tests.some(t => t.id !== id && t.testId === testData.testId)) {
            throw new Error('Mã phiếu xét nghiệm đã tồn tại!');
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

    static deleteTestResult(id) {
        const tests = this.getAllTestResults();
        const filtered = tests.filter(t => t.id !== id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    }

    static searchTestResults(query) {
        const tests = this.getAllTestResults();
        const q = query.toLowerCase();
        return tests.filter(t =>
            t.testId.toLowerCase().includes(q) ||
            t.patientId.toLowerCase().includes(q) ||
            t.patientName.toLowerCase().includes(q) ||
            t.testType.toLowerCase().includes(q)
        );
    }

    static getTestResultsByPatient(patientId) {
        const tests = this.getAllTestResults();
        return tests.filter(t => t.patientId === patientId);
    }

    static getTestResultsByStatus(status) {
        const tests = this.getAllTestResults();
        return tests.filter(t => t.status === status);
    }

    static getTestResultsByDoctor(doctorName) {
        const tests = this.getAllTestResults();
        return tests.filter(t => t.doctorOrder === doctorName);
    }

    static resetToDefault() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultTestResults));
        return defaultTestResults;
    }

    static exportTestResults() {
        const tests = this.getAllTestResults();
        const dataStr = JSON.stringify(tests, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);

        const link = document.createElement('a');
        link.href = url;
        link.download = `test_results_${new Date().toISOString()}.json`;
        link.click();

        URL.revokeObjectURL(url);
    }
}

export default TestResultService;
