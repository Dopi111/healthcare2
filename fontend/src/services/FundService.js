// FundService - Quản lý quỹ tài chính

const STORAGE_KEY = 'healthcare_funds';

// Dữ liệu mẫu
const defaultFunds = [
    {
        id: '1',
        transactionId: 'TXN001',
        date: '2024-11-01',
        type: 'Thu',
        category: 'Khám bệnh',
        amount: 15000000,
        description: 'Thu phí khám bệnh tháng 11',
        createdBy: 'Kế toán Nguyễn Văn A',
        createdAt: new Date('2024-11-01').toISOString()
    },
    {
        id: '2',
        transactionId: 'TXN002',
        date: '2024-11-02',
        type: 'Thu',
        category: 'Xét nghiệm',
        amount: 8500000,
        description: 'Thu phí xét nghiệm',
        createdBy: 'Kế toán Nguyễn Văn A',
        createdAt: new Date('2024-11-02').toISOString()
    },
    {
        id: '3',
        transactionId: 'TXN003',
        date: '2024-11-03',
        type: 'Chi',
        category: 'Thuốc men',
        amount: 12000000,
        description: 'Mua thuốc và vật tư y tế',
        createdBy: 'Kế toán Trần Thị B',
        createdAt: new Date('2024-11-03').toISOString()
    },
    {
        id: '4',
        transactionId: 'TXN004',
        date: '2024-11-05',
        type: 'Chi',
        category: 'Lương',
        amount: 50000000,
        description: 'Lương tháng 11',
        createdBy: 'Kế toán Trần Thị B',
        createdAt: new Date('2024-11-05').toISOString()
    },
    {
        id: '5',
        transactionId: 'TXN005',
        date: '2024-11-07',
        type: 'Thu',
        category: 'Phẫu thuật',
        amount: 25000000,
        description: 'Thu phí phẫu thuật',
        createdBy: 'Kế toán Nguyễn Văn A',
        createdAt: new Date('2024-11-07').toISOString()
    },
    {
        id: '6',
        transactionId: 'TXN006',
        date: '2024-11-08',
        type: 'Chi',
        category: 'Thiết bị',
        amount: 30000000,
        description: 'Mua thiết bị y tế mới',
        createdBy: 'Kế toán Trần Thị B',
        createdAt: new Date('2024-11-08').toISOString()
    },
    {
        id: '7',
        transactionId: 'TXN007',
        date: '2024-11-10',
        type: 'Thu',
        category: 'Nội trú',
        amount: 18000000,
        description: 'Thu viện phí nội trú',
        createdBy: 'Kế toán Nguyễn Văn A',
        createdAt: new Date('2024-11-10').toISOString()
    },
    {
        id: '8',
        transactionId: 'TXN008',
        date: '2024-11-12',
        type: 'Chi',
        category: 'Điện nước',
        amount: 5000000,
        description: 'Tiền điện nước tháng 11',
        createdBy: 'Kế toán Trần Thị B',
        createdAt: new Date('2024-11-12').toISOString()
    },
    {
        id: '9',
        transactionId: 'TXN009',
        date: '2024-11-13',
        type: 'Thu',
        category: 'Khám bệnh',
        amount: 12000000,
        description: 'Thu phí khám bệnh',
        createdBy: 'Kế toán Nguyễn Văn A',
        createdAt: new Date('2024-11-13').toISOString()
    },
    {
        id: '10',
        transactionId: 'TXN010',
        date: '2024-11-14',
        type: 'Chi',
        category: 'Bảo trì',
        amount: 8000000,
        description: 'Bảo trì thiết bị y tế',
        createdBy: 'Kế toán Trần Thị B',
        createdAt: new Date('2024-11-14').toISOString()
    }
];

class FundService {
    static initializeFunds() {
        const existing = localStorage.getItem(STORAGE_KEY);
        if (!existing) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultFunds));
            return defaultFunds;
        }
        return JSON.parse(existing);
    }

    static getAllFunds() {
        const funds = localStorage.getItem(STORAGE_KEY);
        if (!funds) {
            return this.initializeFunds();
        }
        return JSON.parse(funds);
    }

    static getFundById(id) {
        const funds = this.getAllFunds();
        return funds.find(f => f.id === id);
    }

    static addFund(fundData) {
        const funds = this.getAllFunds();

        // Kiểm tra trùng transactionId
        if (funds.some(f => f.transactionId === fundData.transactionId)) {
            throw new Error('Mã giao dịch đã tồn tại!');
        }

        const maxId = funds.length > 0
            ? Math.max(...funds.map(f => parseInt(f.id) || 0))
            : 0;

        const newFund = {
            ...fundData,
            id: (maxId + 1).toString(),
            createdAt: new Date().toISOString()
        };

        funds.push(newFund);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(funds));
        return newFund;
    }

    static updateFund(id, fundData) {
        const funds = this.getAllFunds();
        const index = funds.findIndex(f => f.id === id);

        if (index === -1) {
            throw new Error('Không tìm thấy giao dịch!');
        }

        // Kiểm tra trùng transactionId (trừ chính nó)
        if (fundData.transactionId &&
            funds.some(f => f.id !== id && f.transactionId === fundData.transactionId)) {
            throw new Error('Mã giao dịch đã tồn tại!');
        }

        funds[index] = {
            ...funds[index],
            ...fundData,
            id: id,
            updatedAt: new Date().toISOString()
        };

        localStorage.setItem(STORAGE_KEY, JSON.stringify(funds));
        return funds[index];
    }

    static deleteFund(id) {
        const funds = this.getAllFunds();
        const filtered = funds.filter(f => f.id !== id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    }

    static searchFunds(query) {
        const funds = this.getAllFunds();
        const q = query.toLowerCase();
        return funds.filter(f =>
            f.transactionId.toLowerCase().includes(q) ||
            f.category.toLowerCase().includes(q) ||
            f.description.toLowerCase().includes(q)
        );
    }

    static getFundsByType(type) {
        const funds = this.getAllFunds();
        return funds.filter(f => f.type === type);
    }

    static getFundsByCategory(category) {
        const funds = this.getAllFunds();
        return funds.filter(f => f.category === category);
    }

    static getFundsByDateRange(startDate, endDate) {
        const funds = this.getAllFunds();
        return funds.filter(f => {
            const fundDate = new Date(f.date);
            const start = new Date(startDate);
            const end = new Date(endDate);
            return fundDate >= start && fundDate <= end;
        });
    }

    static getStatistics() {
        const funds = this.getAllFunds();
        const income = funds.filter(f => f.type === 'Thu').reduce((sum, f) => sum + f.amount, 0);
        const expense = funds.filter(f => f.type === 'Chi').reduce((sum, f) => sum + f.amount, 0);
        const balance = income - expense;

        // Thống kê theo danh mục
        const categoryStats = {};
        funds.forEach(f => {
            if (!categoryStats[f.category]) {
                categoryStats[f.category] = { income: 0, expense: 0 };
            }
            if (f.type === 'Thu') {
                categoryStats[f.category].income += f.amount;
            } else {
                categoryStats[f.category].expense += f.amount;
            }
        });

        return {
            totalIncome: income,
            totalExpense: expense,
            balance,
            transactionCount: funds.length,
            categoryStats
        };
    }

    static getMonthlyTrend(months = 6) {
        const funds = this.getAllFunds();
        const monthlyData = {};

        funds.forEach(f => {
            const month = f.date.substring(0, 7); // YYYY-MM
            if (!monthlyData[month]) {
                monthlyData[month] = { income: 0, expense: 0 };
            }
            if (f.type === 'Thu') {
                monthlyData[month].income += f.amount;
            } else {
                monthlyData[month].expense += f.amount;
            }
        });

        return Object.entries(monthlyData)
            .sort((a, b) => a[0].localeCompare(b[0]))
            .slice(-months)
            .map(([month, data]) => ({
                month,
                income: data.income,
                expense: data.expense,
                net: data.income - data.expense
            }));
    }

    static resetToDefault() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultFunds));
        return defaultFunds;
    }

    static exportFunds() {
        const funds = this.getAllFunds();
        const dataStr = JSON.stringify(funds, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);

        const link = document.createElement('a');
        link.href = url;
        link.download = `funds_${new Date().toISOString()}.json`;
        link.click();

        URL.revokeObjectURL(url);
    }
}

export default FundService;
