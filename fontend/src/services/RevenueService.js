// RevenueService - Doanh thu khám chữa bệnh

const STORAGE_KEY = 'healthcare_revenue';

const defaultRevenue = [
    {
        id: '1',
        date: '2024-11-01',
        category: 'Khám bệnh',
        patientCount: 45,
        revenue: 22500000,
        month: '2024-11'
    },
    {
        id: '2',
        date: '2024-11-01',
        category: 'Xét nghiệm',
        patientCount: 30,
        revenue: 15000000,
        month: '2024-11'
    },
    {
        id: '3',
        date: '2024-11-01',
        category: 'Nội trú',
        patientCount: 10,
        revenue: 35000000,
        month: '2024-11'
    },
    {
        id: '4',
        date: '2024-11-01',
        category: 'Phẫu thuật',
        patientCount: 5,
        revenue: 50000000,
        month: '2024-11'
    },
    {
        id: '5',
        date: '2024-10-01',
        category: 'Khám bệnh',
        patientCount: 42,
        revenue: 21000000,
        month: '2024-10'
    },
    {
        id: '6',
        date: '2024-10-01',
        category: 'Xét nghiệm',
        patientCount: 28,
        revenue: 14000000,
        month: '2024-10'
    },
    {
        id: '7',
        date: '2024-10-01',
        category: 'Nội trú',
        patientCount: 8,
        revenue: 28000000,
        month: '2024-10'
    },
    {
        id: '8',
        date: '2024-10-01',
        category: 'Phẫu thuật',
        patientCount: 6,
        revenue: 60000000,
        month: '2024-10'
    }
];

class RevenueService {
    static initializeRevenue() {
        const existing = localStorage.getItem(STORAGE_KEY);
        if (!existing) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultRevenue));
            return defaultRevenue;
        }
        return JSON.parse(existing);
    }

    static getAllRevenue() {
        const revenue = localStorage.getItem(STORAGE_KEY);
        if (!revenue) {
            return this.initializeRevenue();
        }
        return JSON.parse(revenue);
    }

    static getRevenueByMonth(month) {
        const revenue = this.getAllRevenue();
        return revenue.filter(r => r.month === month);
    }

    static getStatistics() {
        const revenue = this.getAllRevenue();
        const totalRevenue = revenue.reduce((sum, r) => sum + r.revenue, 0);
        const totalPatients = revenue.reduce((sum, r) => sum + r.patientCount, 0);

        const categoryStats = {};
        revenue.forEach(r => {
            if (!categoryStats[r.category]) {
                categoryStats[r.category] = { revenue: 0, patients: 0 };
            }
            categoryStats[r.category].revenue += r.revenue;
            categoryStats[r.category].patients += r.patientCount;
        });

        return {
            totalRevenue,
            totalPatients,
            categoryStats,
            avgRevenuePerPatient: totalPatients > 0 ? totalRevenue / totalPatients : 0
        };
    }

    static getMonthlyComparison(months = 6) {
        const revenue = this.getAllRevenue();
        const monthlyData = {};

        revenue.forEach(r => {
            if (!monthlyData[r.month]) {
                monthlyData[r.month] = { revenue: 0, patients: 0 };
            }
            monthlyData[r.month].revenue += r.revenue;
            monthlyData[r.month].patients += r.patientCount;
        });

        return Object.entries(monthlyData)
            .sort((a, b) => a[0].localeCompare(b[0]))
            .slice(-months)
            .map(([month, data]) => ({
                month,
                revenue: data.revenue,
                patients: data.patients
            }));
    }

    static resetToDefault() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultRevenue));
        return defaultRevenue;
    }

    static exportRevenue() {
        const revenue = this.getAllRevenue();
        const dataStr = JSON.stringify(revenue, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);

        const link = document.createElement('a');
        link.href = url;
        link.download = `revenue_${new Date().toISOString()}.json`;
        link.click();

        URL.revokeObjectURL(url);
    }
}

export default RevenueService;
