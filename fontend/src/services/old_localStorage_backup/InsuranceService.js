// InsuranceService - Quản lý thanh toán bảo hiểm

const STORAGE_KEY = 'healthcare_insurance';

const defaultInsurance = [
    {
        id: '1',
        claimId: 'BH001',
        patientId: 'BN001',
        patientName: 'Nguyễn Văn A',
        insuranceCard: 'DN1234567890',
        insuranceType: 'BHYT',
        visitDate: '2024-11-10',
        totalAmount: 5000000,
        insuranceCovered: 4000000,
        patientPay: 1000000,
        status: 'Đã duyệt',
        approvedBy: 'Kế toán Trần Thị B',
        approvedDate: '2024-11-11',
        notes: '',
        createdAt: new Date('2024-11-10').toISOString()
    },
    {
        id: '2',
        claimId: 'BH002',
        patientId: 'BN002',
        patientName: 'Trần Thị B',
        insuranceCard: 'DN9876543210',
        insuranceType: 'BHYT',
        visitDate: '2024-11-12',
        totalAmount: 3500000,
        insuranceCovered: 2800000,
        patientPay: 700000,
        status: 'Chờ duyệt',
        approvedBy: '',
        approvedDate: '',
        notes: '',
        createdAt: new Date('2024-11-12').toISOString()
    },
    {
        id: '3',
        claimId: 'BH003',
        patientId: 'BN003',
        patientName: 'Lê Văn C',
        insuranceCard: 'DN1122334455',
        insuranceType: 'BHTN',
        visitDate: '2024-11-13',
        totalAmount: 8000000,
        insuranceCovered: 6000000,
        patientPay: 2000000,
        status: 'Đã duyệt',
        approvedBy: 'Kế toán Nguyễn Văn C',
        approvedDate: '2024-11-14',
        notes: '',
        createdAt: new Date('2024-11-13').toISOString()
    },
    {
        id: '4',
        claimId: 'BH004',
        patientId: 'BN004',
        patientName: 'Phạm Thị D',
        insuranceCard: 'DN5566778899',
        insuranceType: 'BHYT',
        visitDate: '2024-11-14',
        totalAmount: 12000000,
        insuranceCovered: 9600000,
        patientPay: 2400000,
        status: 'Từ chối',
        approvedBy: 'Kế toán Trần Thị B',
        approvedDate: '2024-11-15',
        notes: 'Không đủ điều kiện',
        createdAt: new Date('2024-11-14').toISOString()
    }
];

class InsuranceService {
    static initializeInsurance() {
        const existing = localStorage.getItem(STORAGE_KEY);
        if (!existing) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultInsurance));
            return defaultInsurance;
        }
        return JSON.parse(existing);
    }

    static getAllInsurance() {
        const insurance = localStorage.getItem(STORAGE_KEY);
        if (!insurance) {
            return this.initializeInsurance();
        }
        return JSON.parse(insurance);
    }

    static getInsuranceById(id) {
        const insurance = this.getAllInsurance();
        return insurance.find(i => i.id === id);
    }

    static addInsurance(insuranceData) {
        const insurance = this.getAllInsurance();

        if (insurance.some(i => i.claimId === insuranceData.claimId)) {
            throw new Error('Mã hồ sơ đã tồn tại!');
        }

        const maxId = insurance.length > 0
            ? Math.max(...insurance.map(i => parseInt(i.id) || 0))
            : 0;

        const newInsurance = {
            ...insuranceData,
            id: (maxId + 1).toString(),
            createdAt: new Date().toISOString()
        };

        insurance.push(newInsurance);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(insurance));
        return newInsurance;
    }

    static updateInsurance(id, insuranceData) {
        const insurance = this.getAllInsurance();
        const index = insurance.findIndex(i => i.id === id);

        if (index === -1) {
            throw new Error('Không tìm thấy hồ sơ!');
        }

        insurance[index] = {
            ...insurance[index],
            ...insuranceData,
            id: id,
            updatedAt: new Date().toISOString()
        };

        localStorage.setItem(STORAGE_KEY, JSON.stringify(insurance));
        return insurance[index];
    }

    static deleteInsurance(id) {
        const insurance = this.getAllInsurance();
        const filtered = insurance.filter(i => i.id !== id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    }

    static getStatistics() {
        const insurance = this.getAllInsurance();
        const approved = insurance.filter(i => i.status === 'Đã duyệt');
        const pending = insurance.filter(i => i.status === 'Chờ duyệt');
        const rejected = insurance.filter(i => i.status === 'Từ chối');

        return {
            total: insurance.length,
            approved: approved.length,
            pending: pending.length,
            rejected: rejected.length,
            totalAmount: insurance.reduce((sum, i) => sum + i.totalAmount, 0),
            insuranceCovered: insurance.reduce((sum, i) => sum + i.insuranceCovered, 0),
            patientPay: insurance.reduce((sum, i) => sum + i.patientPay, 0)
        };
    }

    static resetToDefault() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultInsurance));
        return defaultInsurance;
    }

    static exportInsurance() {
        const insurance = this.getAllInsurance();
        const dataStr = JSON.stringify(insurance, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);

        const link = document.createElement('a');
        link.href = url;
        link.download = `insurance_${new Date().toISOString()}.json`;
        link.click();

        URL.revokeObjectURL(url);
    }
}

export default InsuranceService;
