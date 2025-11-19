// AccountService - Quản lý tài khoản trong localStorage

const STORAGE_KEY = 'healthcare_accounts';

// Tài khoản mặc định
const defaultAccounts = [
    {
        id: '1',
        employeeId: "admin",
        password: "admin123",
        name: "Admin",
        department: "Quản trị",
        position: "Quản trị viên",
        role: "administrator",
        phone: "0123456789",
        email: "admin@healthcare.com",
        status: "active",
        createdAt: new Date().toISOString()
    },
    {
        id: '2',
        employeeId: "doctor01",
        password: "doctor123",
        name: "Bác sĩ Nguyễn Văn A",
        department: "Bác sĩ chuyên khoa",
        position: "Bác sĩ",
        role: "doctor",
        phone: "0987654321",
        email: "doctor01@healthcare.com",
        status: "active",
        createdAt: new Date().toISOString()
    },
    {
        id: '3',
        employeeId: "nurse01",
        password: "nurse123",
        name: "Y tá Trần Thị B",
        department: "Điều dưỡng",
        position: "Y tá",
        role: "nurse",
        phone: "0912345678",
        email: "nurse01@healthcare.com",
        status: "active",
        createdAt: new Date().toISOString()
    },
    {
        id: '4',
        employeeId: "reception01",
        password: "reception123",
        name: "Lễ tân Lê Văn C",
        department: "Tiếp tân",
        position: "Lễ tân",
        role: "receptionist",
        phone: "0901234567",
        email: "reception01@healthcare.com",
        status: "active",
        createdAt: new Date().toISOString()
    },
    {
        id: '5',
        employeeId: "accountant01",
        password: "accountant123",
        name: "Kế toán Phạm Thị D",
        department: "Kế toán",
        position: "Kế toán trưởng",
        role: "accountant",
        phone: "0923456789",
        email: "accountant01@healthcare.com",
        status: "active",
        createdAt: new Date().toISOString()
    }
];

class AccountService {
    // Khởi tạo accounts mặc định nếu chưa có
    static initializeAccounts() {
        const existing = localStorage.getItem(STORAGE_KEY);
        if (!existing) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultAccounts));
            return defaultAccounts;
        }
        return JSON.parse(existing);
    }

    // Lấy tất cả accounts
    static getAllAccounts() {
        const accounts = localStorage.getItem(STORAGE_KEY);
        if (!accounts) {
            return this.initializeAccounts();
        }
        return JSON.parse(accounts);
    }

    // Lấy account theo employeeId
    static getAccountByEmployeeId(employeeId) {
        const accounts = this.getAllAccounts();
        return accounts.find(acc => acc.employeeId === employeeId);
    }

    // Lấy account theo ID
    static getAccountById(id) {
        const accounts = this.getAllAccounts();
        return accounts.find(acc => acc.id === id);
    }

    // Thêm account mới
    static addAccount(accountData) {
        const accounts = this.getAllAccounts();

        // Kiểm tra trùng employeeId
        if (accounts.some(acc => acc.employeeId === accountData.employeeId)) {
            throw new Error('Mã nhân viên đã tồn tại!');
        }

        // Kiểm tra trùng email
        if (accountData.email && accounts.some(acc => acc.email === accountData.email)) {
            throw new Error('Email đã được sử dụng!');
        }

        // Tạo ID mới
        const maxId = accounts.length > 0
            ? Math.max(...accounts.map(acc => parseInt(acc.id) || 0))
            : 0;

        const newAccount = {
            ...accountData,
            id: (maxId + 1).toString(),
            createdAt: new Date().toISOString(),
            status: accountData.status || 'active'
        };

        accounts.push(newAccount);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(accounts));
        return newAccount;
    }

    // Cập nhật account
    static updateAccount(id, accountData) {
        const accounts = this.getAllAccounts();
        const index = accounts.findIndex(acc => acc.id === id);

        if (index === -1) {
            throw new Error('Không tìm thấy tài khoản!');
        }

        // Kiểm tra trùng employeeId (trừ chính nó)
        if (accountData.employeeId &&
            accounts.some(acc => acc.id !== id && acc.employeeId === accountData.employeeId)) {
            throw new Error('Mã nhân viên đã tồn tại!');
        }

        // Kiểm tra trùng email (trừ chính nó)
        if (accountData.email &&
            accounts.some(acc => acc.id !== id && acc.email === accountData.email)) {
            throw new Error('Email đã được sử dụng!');
        }

        accounts[index] = {
            ...accounts[index],
            ...accountData,
            id: id, // Giữ nguyên ID
            updatedAt: new Date().toISOString()
        };

        localStorage.setItem(STORAGE_KEY, JSON.stringify(accounts));
        return accounts[index];
    }

    // Xóa account
    static deleteAccount(id) {
        const accounts = this.getAllAccounts();
        const account = accounts.find(acc => acc.id === id);

        if (!account) {
            throw new Error('Không tìm thấy tài khoản!');
        }

        // Không cho xóa admin mặc định
        if (account.employeeId === 'admin') {
            throw new Error('Không thể xóa tài khoản admin mặc định!');
        }

        const filtered = accounts.filter(acc => acc.id !== id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
        return account;
    }

    // Xác thực đăng nhập
    static authenticate(employeeId, password) {
        const accounts = this.getAllAccounts();
        const account = accounts.find(
            acc => acc.employeeId === employeeId && acc.password === password
        );

        if (!account) {
            return { success: false, message: 'Mã nhân viên hoặc mật khẩu không đúng!' };
        }

        if (account.status !== 'active') {
            return { success: false, message: 'Tài khoản đã bị khóa!' };
        }

        return {
            success: true,
            account: {
                ...account,
                password: undefined // Không trả về password
            }
        };
    }

    // Reset về tài khoản mặc định
    static resetToDefault() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultAccounts));
        return defaultAccounts;
    }

    // Export accounts (để backup)
    static exportAccounts() {
        const accounts = this.getAllAccounts();
        const dataStr = JSON.stringify(accounts, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);

        const link = document.createElement('a');
        link.href = url;
        link.download = `healthcare_accounts_${new Date().toISOString()}.json`;
        link.click();

        URL.revokeObjectURL(url);
    }

    // Import accounts
    static importAccounts(accountsData) {
        if (!Array.isArray(accountsData)) {
            throw new Error('Dữ liệu không hợp lệ!');
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(accountsData));
        return accountsData;
    }
}

export default AccountService;
