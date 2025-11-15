import React, { useEffect, useState } from 'react';
import { Badge } from '../../../components/admin';
import RevenueService from '../../../services/RevenueService';

const Medical_Revenue = () => {
  const [stats, setStats] = useState(null);
  const [showChart, setShowChart] = useState(true);

  useEffect(() => {
    setStats(RevenueService.getStatistics());
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const categoryData = stats ? Object.entries(stats.categoryStats).map(([category, data]) => ({
    category,
    revenue: data.revenue,
    patients: data.patients,
    percentage: ((data.revenue / stats.totalRevenue) * 100).toFixed(1)
  })).sort((a, b) => b.revenue - a.revenue) : [];

  const maxRevenue = categoryData.length > 0 ? Math.max(...categoryData.map(d => d.revenue)) : 1;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[var(--color-admin-text-light-primary)]">
            Doanh thu Khám & Chữa bệnh
          </h2>
          <p className="text-sm text-[var(--color-admin-text-light-secondary)] mt-1">
            Báo cáo doanh thu theo dịch vụ y tế
          </p>
        </div>
        <button
          onClick={() => setShowChart(!showChart)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-[var(--color-admin-border-light)] text-[var(--color-admin-text-light-primary)] rounded-lg hover:bg-gray-50"
        >
          <span className="material-symbols-outlined text-xl">{showChart ? 'table_chart' : 'bar_chart'}</span>
          {showChart ? 'Xem bảng' : 'Xem biểu đồ'}
        </button>
      </div>

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-lg text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Tổng doanh thu</p>
                <p className="text-2xl font-bold mt-1">{formatCurrency(stats.totalRevenue)}</p>
              </div>
              <span className="material-symbols-outlined text-4xl opacity-80">payments</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-lg text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Tổng bệnh nhân</p>
                <p className="text-2xl font-bold mt-1">{stats.totalPatients}</p>
              </div>
              <span className="material-symbols-outlined text-4xl opacity-80">group</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-lg text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">TB/Bệnh nhân</p>
                <p className="text-2xl font-bold mt-1">{formatCurrency(stats.avgRevenuePerPatient)}</p>
              </div>
              <span className="material-symbols-outlined text-4xl opacity-80">person</span>
            </div>
          </div>
        </div>
      )}

      {showChart && stats && (
        <div className="bg-white p-6 rounded-lg border border-[var(--color-admin-border-light)]">
          <h3 className="text-lg font-bold text-[var(--color-admin-text-light-primary)] mb-6">
            Doanh thu theo dịch vụ
          </h3>
          <div className="flex items-end justify-around h-80 border-l-2 border-b-2 border-gray-300 p-6 gap-4">
            {categoryData.map((item, index) => (
              <div key={index} className="flex flex-col items-center gap-2 flex-1">
                <div className="w-full flex items-end justify-center" style={{ height: '250px' }}>
                  <div
                    className="bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg transition-all duration-500 w-full max-w-[80px] flex flex-col items-center justify-end pb-3 px-2"
                    style={{ height: `${(item.revenue / maxRevenue) * 100}%` }}
                  >
                    <span className="text-white text-xs font-bold text-center">{item.patients} BN</span>
                  </div>
                </div>
                <p className="text-xs font-medium text-center">{item.category}</p>
                <p className="text-sm font-bold text-green-600">{formatCurrency(item.revenue)}</p>
                <Badge variant="info">{item.percentage}%</Badge>
              </div>
            ))}
          </div>
        </div>
      )}

      {!showChart && (
        <div className="bg-white p-6 rounded-lg border border-[var(--color-admin-border-light)]">
          <h3 className="text-lg font-bold text-[var(--color-admin-text-light-primary)] mb-4">
            Bảng doanh thu chi tiết
          </h3>
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dịch vụ</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Bệnh nhân</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Doanh thu</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Tỷ lệ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {categoryData.map((item, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap font-medium">{item.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">{item.patients}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right font-bold text-green-600">
                    {formatCurrency(item.revenue)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <Badge variant="info">{item.percentage}%</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Medical_Revenue;
