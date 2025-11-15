import React, { useEffect, useState } from 'react';
import { DataTable, Badge } from '../../../components/admin';
import ExpenseService from '../../../services/ExpenseService';

const Operating_Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [stats, setStats] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    loadExpenses();
  }, []);

  const loadExpenses = () => {
    try {
      const data = ExpenseService.getAllExpenses();
      setExpenses(data);
      setStats(ExpenseService.getStatistics());
    } catch (error) {
      showMessage('error', 'Không thể tải danh sách chi phí!');
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const categoryData = stats ? Object.entries(stats.categoryStats).map(([category, amount]) => ({
    category,
    amount,
    percentage: ((amount / stats.totalExpense) * 100).toFixed(1)
  })).sort((a, b) => b.amount - a.amount) : [];

  const maxAmount = categoryData.length > 0 ? Math.max(...categoryData.map(d => d.amount)) : 1;

  const columns = [
    {
      key: 'expenseId',
      label: 'Mã CP',
      sortable: true,
      className: 'font-medium text-[var(--color-admin-text-light-primary)]'
    },
    {
      key: 'date',
      label: 'Ngày',
      sortable: true
    },
    {
      key: 'category',
      label: 'Loại',
      sortable: true
    },
    {
      key: 'department',
      label: 'Phòng ban'
    },
    {
      key: 'amount',
      label: 'Số tiền',
      render: (value) => <span className="text-red-600 font-bold">{formatCurrency(value)}</span>
    },
    {
      key: 'status',
      label: 'Trạng thái',
      render: (value) => {
        const variants = {
          'Đã chi': 'success',
          'Chờ duyệt': 'warning'
        };
        return <Badge variant={variants[value] || 'default'}>{value}</Badge>;
      }
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[var(--color-admin-text-light-primary)]">
            Chi phí Hoạt động
          </h2>
          <p className="text-sm text-[var(--color-admin-text-light-secondary)] mt-1">
            Quản lý chi phí vận hành bệnh viện
          </p>
        </div>
      </div>

      {message.text && (
        <div className={`p-4 rounded-lg ${
          message.type === 'success'
            ? 'bg-[var(--color-admin-success)]/10 text-[var(--color-admin-success)]'
            : 'bg-[var(--color-admin-danger)]/10 text-[var(--color-admin-danger)]'
        }`}>
          {message.text}
        </div>
      )}

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-red-500 to-red-600 p-6 rounded-lg text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Tổng chi phí</p>
                <p className="text-2xl font-bold mt-1">{formatCurrency(stats.totalExpense)}</p>
              </div>
              <span className="material-symbols-outlined text-4xl opacity-80">payments</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-lg text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Đã chi</p>
                <p className="text-2xl font-bold mt-1">{formatCurrency(stats.paidAmount)}</p>
              </div>
              <span className="material-symbols-outlined text-4xl opacity-80">check_circle</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-6 rounded-lg text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Chờ duyệt</p>
                <p className="text-2xl font-bold mt-1">{formatCurrency(stats.pendingAmount)}</p>
              </div>
              <span className="material-symbols-outlined text-4xl opacity-80">pending</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-lg text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Số khoản</p>
                <p className="text-2xl font-bold mt-1">{stats.totalCount}</p>
              </div>
              <span className="material-symbols-outlined text-4xl opacity-80">receipt_long</span>
            </div>
          </div>
        </div>
      )}

      {stats && (
        <div className="bg-white p-6 rounded-lg border border-[var(--color-admin-border-light)]">
          <h3 className="text-lg font-bold text-[var(--color-admin-text-light-primary)] mb-4">
            Phân bố chi phí theo loại
          </h3>
          <div className="space-y-3">
            {categoryData.map((item, index) => (
              <div key={index}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium">{item.category}</span>
                  <span className="text-[var(--color-admin-text-light-secondary)]">
                    {formatCurrency(item.amount)} ({item.percentage}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-red-500 to-orange-500 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${(item.amount / maxAmount) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <DataTable
        columns={columns}
        data={expenses}
        itemsPerPage={10}
      />
    </div>
  );
};

export default Operating_Expenses;
