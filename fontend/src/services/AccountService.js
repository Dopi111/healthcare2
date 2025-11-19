// AccountService - Quản lý tài khoản nhân viên qua API PostgreSQL
import api from './api.js';

class AccountService {
    // Lấy tất cả accounts
    static async getAllAccounts() {
        try {
            const response = await api.get('/account');
            return response.data.data || [];
        } catch (error) {
            console.error('Error fetching accounts:', error);
            throw error;
        }
    }

    // Lấy account theo employeeId
    static async getAccountByEmployeeId(employeeId) {
        try {
            const accounts = await this.getAllAccounts();
            return accounts.find(acc => acc.employee_id === employeeId);
        } catch (error) {
            console.error('Error fetching account by employeeId:', error);
            throw error;
        }
    }

    // Lấy account theo ID
    static async getAccountById(id) {
        try {
            const response = await api.get(`/account/${id}`);
            return response.data.data;
        } catch (error) {
            console.error('Error fetching account by ID:', error);
            throw error;
        }
    }

    // Thêm account mới
    static async addAccount(accountData) {
        try {
            const response = await api.post('/account', accountData);
            return response.data.data;
        } catch (error) {
            const message = error.response?.data?.message || 'Không thể tạo tài khoản!';
            throw new Error(message);
        }
    }

    // Cập nhật account
    static async updateAccount(id, accountData) {
        try {
            const response = await api.put(`/account/${id}`, accountData);
            return response.data.data;
        } catch (error) {
            const message = error.response?.data?.message || 'Không thể cập nhật tài khoản!';
            throw new Error(message);
        }
    }

    // Xóa account
    static async deleteAccount(id) {
        try {
            const response = await api.delete(`/account/${id}`);
            return response.data;
        } catch (error) {
            const message = error.response?.data?.message || 'Không thể xóa tài khoản!';
            throw new Error(message);
        }
    }

    // Xác thực đăng nhập
    static async authenticate(employeeId, password) {
        try {
            const response = await api.post('/account/login', {
                employeeId,
                password
            });

            if (response.data.success) {
                return {
                    success: true,
                    account: response.data.account
                };
            } else {
                return {
                    success: false,
                    message: response.data.message || 'Đăng nhập thất bại!'
                };
            }
        } catch (error) {
            const message = error.response?.data?.message || 'Mã nhân viên hoặc mật khẩu không đúng!';
            return {
                success: false,
                message: message
            };
        }
    }

    // Khởi tạo accounts (backward compatibility - không làm gì vì data đã có trong DB)
    static initializeAccounts() {
        // Không cần làm gì - data đã có trong PostgreSQL
        return [];
    }

    // Export accounts (để backup)
    static async exportAccounts() {
        try {
            const accounts = await this.getAllAccounts();
            const dataStr = JSON.stringify(accounts, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(dataBlob);

            const link = document.createElement('a');
            link.href = url;
            link.download = `healthcare_accounts_${new Date().toISOString()}.json`;
            link.click();

            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error exporting accounts:', error);
            throw error;
        }
    }

    // Import accounts (tạo nhiều accounts từ file JSON)
    static async importAccounts(accountsData) {
        try {
            if (!Array.isArray(accountsData)) {
                throw new Error('Dữ liệu không hợp lệ!');
            }

            const results = [];
            for (const accountData of accountsData) {
                try {
                    const result = await this.addAccount(accountData);
                    results.push({ success: true, data: result });
                } catch (error) {
                    results.push({ success: false, error: error.message, data: accountData });
                }
            }
            return results;
        } catch (error) {
            console.error('Error importing accounts:', error);
            throw error;
        }
    }
}

export default AccountService;
