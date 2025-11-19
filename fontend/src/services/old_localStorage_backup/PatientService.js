// PatientService - Quản lý bệnh nhân

const STORAGE_KEY = 'healthcare_patients';

// Dữ liệu mẫu
const defaultPatients = [
    {
        id: '1',
        patientId: 'BN001',
        fullName: 'Nguyễn Văn An',
        dateOfBirth: '1990-05-15',
        gender: 'Nam',
        phone: '0912345678',
        address: '123 Nguyễn Huệ, Q1, TP.HCM',
        idCard: '079090001234',
        doctorInCharge: 'Bác sĩ Nguyễn Văn A',
        visitDate: '2024-11-10',
        diagnosis: 'Viêm họng cấp',
        status: 'Đang điều trị',
        medicalHistory: 'Không có bệnh nền',
        allergies: 'Không',
        createdAt: new Date().toISOString()
    },
    {
        id: '2',
        patientId: 'BN002',
        fullName: 'Trần Thị Bình',
        dateOfBirth: '1985-08-20',
        gender: 'Nữ',
        phone: '0987654321',
        address: '456 Lê Lợi, Q3, TP.HCM',
        idCard: '079085002345',
        doctorInCharge: 'Bác sĩ Nguyễn Văn A',
        visitDate: '2024-11-12',
        diagnosis: 'Cao huyết áp',
        status: 'Tái khám',
        medicalHistory: 'Đái tháo đường type 2',
        allergies: 'Penicillin',
        createdAt: new Date().toISOString()
    },
    {
        id: '3',
        patientId: 'BN003',
        fullName: 'Lê Văn Cường',
        dateOfBirth: '1995-03-10',
        gender: 'Nam',
        phone: '0901234567',
        address: '789 Hai Bà Trưng, Q1, TP.HCM',
        idCard: '079095003456',
        doctorInCharge: 'Bác sĩ Nguyễn Văn A',
        visitDate: '2024-11-14',
        diagnosis: 'Viêm dạ dày',
        status: 'Hoàn thành',
        medicalHistory: 'Không',
        allergies: 'Không',
        createdAt: new Date().toISOString()
    }
];

class PatientService {
    static initializePatients() {
        const existing = localStorage.getItem(STORAGE_KEY);
        if (!existing) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultPatients));
            return defaultPatients;
        }
        return JSON.parse(existing);
    }

    static getAllPatients() {
        const patients = localStorage.getItem(STORAGE_KEY);
        if (!patients) {
            return this.initializePatients();
        }
        return JSON.parse(patients);
    }

    static getPatientById(id) {
        const patients = this.getAllPatients();
        return patients.find(p => p.id === id);
    }

    static getPatientByPatientId(patientId) {
        const patients = this.getAllPatients();
        return patients.find(p => p.patientId === patientId);
    }

    static addPatient(patientData) {
        const patients = this.getAllPatients();

        // Kiểm tra trùng patientId
        if (patients.some(p => p.patientId === patientData.patientId)) {
            throw new Error('Mã bệnh nhân đã tồn tại!');
        }

        // Tạo ID mới
        const maxId = patients.length > 0
            ? Math.max(...patients.map(p => parseInt(p.id) || 0))
            : 0;

        const newPatient = {
            ...patientData,
            id: (maxId + 1).toString(),
            createdAt: new Date().toISOString()
        };

        patients.push(newPatient);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(patients));
        return newPatient;
    }

    static updatePatient(id, patientData) {
        const patients = this.getAllPatients();
        const index = patients.findIndex(p => p.id === id);

        if (index === -1) {
            throw new Error('Không tìm thấy bệnh nhân!');
        }

        // Kiểm tra trùng patientId (trừ chính nó)
        if (patientData.patientId &&
            patients.some(p => p.id !== id && p.patientId === patientData.patientId)) {
            throw new Error('Mã bệnh nhân đã tồn tại!');
        }

        patients[index] = {
            ...patients[index],
            ...patientData,
            id: id,
            updatedAt: new Date().toISOString()
        };

        localStorage.setItem(STORAGE_KEY, JSON.stringify(patients));
        return patients[index];
    }

    static deletePatient(id) {
        const patients = this.getAllPatients();
        const filtered = patients.filter(p => p.id !== id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    }

    static searchPatients(query) {
        const patients = this.getAllPatients();
        const q = query.toLowerCase();
        return patients.filter(p =>
            p.patientId.toLowerCase().includes(q) ||
            p.fullName.toLowerCase().includes(q) ||
            p.phone.toLowerCase().includes(q) ||
            p.diagnosis?.toLowerCase().includes(q)
        );
    }

    static getPatientsByDoctor(doctorName) {
        const patients = this.getAllPatients();
        return patients.filter(p => p.doctorInCharge === doctorName);
    }

    static getPatientsByStatus(status) {
        const patients = this.getAllPatients();
        return patients.filter(p => p.status === status);
    }

    static resetToDefault() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultPatients));
        return defaultPatients;
    }

    static exportPatients() {
        const patients = this.getAllPatients();
        const dataStr = JSON.stringify(patients, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);

        const link = document.createElement('a');
        link.href = url;
        link.download = `patients_${new Date().toISOString()}.json`;
        link.click();

        URL.revokeObjectURL(url);
    }
}

export default PatientService;
