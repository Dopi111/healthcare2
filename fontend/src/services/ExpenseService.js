// ExpenseService - Chi phí hoạt động

const STORAGE_KEY = 'healthcare_expenses';

const defaultExpenses = [
    {
        id: '1',
        expenseId: 'CP001',
        date: '2024-11-01',
        category: 'Lương',
        department: 'Toàn bộ',
        amount: 50000000,
        description: 'Lương tháng 11',
        approvedBy: 'Giám đốc Nguyễn Văn A',
        status: 'Đã chi',
        createdAt: new Date('2024-11-01').toISOString()
    },
    {
        id: '2',
        expenseId: 'CP002',
        date: '2024-11-03',
        category: 'Thuốc men',
        department: 'Dược',
        amount: 12000000,
        description: 'Mua thuốc và vật tư y tế',
        approvedBy: 'Trưởng khoa Dược',
        status: 'Đã chi',
        createdAt: new Date('2024-11-03').toISOString()
    },
    {
        id: '3',
        expenseId: 'CP003',
        date: '2024-11-05',
        category: 'Thiết bị',
        department: 'Kỹ thuật',
        amount: 30000000,
        description: 'Mua máy xét nghiệm mới',
        approvedBy: 'Giám đốc Nguyễn Văn A',
        status: 'Đã chi',
        createdAt: new Date('2024-11-05').toISOString()
    },
    {
        id: '4',
        expenseId: 'CP004',
        date: '2024-11-07',
        category: 'Điện nước',
        department: 'Hành chính',
        amount: 5000000,
        description: 'Tiền điện nước tháng 11',
        approvedBy: 'Trưởng phòng HC',
        status: 'Đã chi',
        createdAt: new Date('2024-11-07').toISOString()
    },
    {
        id: '5',
        expenseId: 'CP005',
        date: '2024-11-10',
        category: 'Bảo trì',
        department: 'Kỹ thuật',
        amount: 8000000,
        description: 'Bảo trì thiết bị y tế',
        approvedBy: 'Trưởng khoa Kỹ thuật',
        status: 'Chờ duyệt',
        createdAt: new Date('2024-11-10').toISOString()
    },
    {
        id: '6',
        expenseId: 'CP006',
        date: '2024-11-12',
        category: 'Vệ sinh',
        department: 'Hành chính',
        amount: 3000000,
        description: 'Dịch vụ vệ sinh tháng 11',
        approvedBy: 'Trưởng phòng HC',
        status: 'Đã chi',
        createdAt: new Date('2024-11-12').toISOString()
    }
];

class ExpenseService {
    static initializeExpenses() {
        const existing = localStorage.getItem(STORAGE_KEY);
        if (!existing) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultExpenses));
            return defaultExpenses;
        }
        return JSON.parse(existing);
    }

    static getAllExpenses() {
        const expenses = localStorage.getItem(STORAGE_KEY);
        if (!expenses) {
            return this.initializeExpenses();
        }
        return JSON.parse(expenses);
    }

    static getExpenseById(id) {
        const expenses = this.getAllExpenses();
        return expenses.find(e => e.id === id);
    }

    static addExpense(expenseData) {
        const expenses = this.getAllExpenses();

        if (expenses.some(e => e.expenseId === expenseData.expenseId)) {
            throw new Error('Mã chi phí đã tồn tại!');
        }

        const maxId = expenses.length > 0
            ? Math.max(...expenses.map(e => parseInt(e.id) || 0))
            : 0;

        const newExpense = {
            ...expenseData,
            id: (maxId + 1).toString(),
            createdAt: new Date().toISOString()
        };

        expenses.push(newExpense);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
        return newExpense;
    }

    static updateExpense(id, expenseData) {
        const expenses = this.getAllExpenses();
        const index = expenses.findIndex(e => e.id === id);

        if (index === -1) {
            throw new Error('Không tìm thấy chi phí!');
        }

        expenses[index] = {
            ...expenses[index],
            ...expenseData,
            id: id,
            updatedAt: new Date().toISOString()
        };

        localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
        return expenses[index];
    }

    static deleteExpense(id) {
        const expenses = this.getAllExpenses();
        const filtered = expenses.filter(e => e.id !== id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    }

    static getStatistics() {
        const expenses = this.getAllExpenses();
        const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);

        const categoryStats = {};
        expenses.forEach(e => {
            if (!categoryStats[e.category]) {
                categoryStats[e.category] = 0;
            }
            categoryStats[e.category] += e.amount;
        });

        const paid = expenses.filter(e => e.status === 'Đã chi');
        const pending = expenses.filter(e => e.status === 'Chờ duyệt');

        return {
            totalExpense,
            paidAmount: paid.reduce((sum, e) => sum + e.amount, 0),
            pendingAmount: pending.reduce((sum, e) => sum + e.amount, 0),
            categoryStats,
            totalCount: expenses.length,
            paidCount: paid.length,
            pendingCount: pending.length
        };
    }

    static resetToDefault() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultExpenses));
        return defaultExpenses;
    }

    static exportExpenses() {
        const expenses = this.getAllExpenses();
        const dataStr = JSON.stringify(expenses, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);

        const link = document.createElement('a');
        link.href = url;
        link.download = `expenses_${new Date().toISOString()}.json`;
        link.click();

        URL.revokeObjectURL(url);
    }
}

export default ExpenseService;
