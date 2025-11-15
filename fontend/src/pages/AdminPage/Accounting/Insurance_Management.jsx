import React, { useEffect, useState } from 'react';
import { DataTable, Badge } from '../../../components/admin';
import InsuranceService from '../../../services/InsuranceService';

const Insurance_Management = () => {
  const [insurance, setInsurance] = useState([]);
  const [stats, setStats] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    loadInsurance();
  }, []);

  const loadInsurance = () => {
    try {
      const data = InsuranceService.getAllInsurance();
      setInsurance(data);
      setStats(InsuranceService.getStatistics());
    } catch (error) {
      showMessage('error', 'Không thể tải danh sách bảo hiểm!');
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const columns = [
    {
      key: 'claimId',
      label: 'Mã hồ sơ',
      sortable: true,
      className: 'font-medium text-[var(--color-admin-text-light-primary)]'
    },
    {
      key: 'patientName',
      label: 'Bệnh nhân',
      sortable: true
    },
    {
      key: 'insuranceCard',
      label: 'Số thẻ'
    },
    {
      key: 'insuranceType',
      label: 'Loại BH',
      render: (value) => <Badge variant="info">{value}</Badge>
    },
    {
      key: 'totalAmount',
      label: 'Tổng chi phí',
      render: (value) => <span className="font-bold">{formatCurrency(value)}</span>
    },
    {
      key: 'insuranceCovered',
      label: 'BH chi trả',
      render: (value) => <span className="text-green-600 font-bold">{formatCurrency(value)}</span>
    },
    {
      key: 'patientPay',
      label: 'BN trả',
      render: (value) => <span className="text-orange-600 font-bold">{formatCurrency(value)}</span>
    },
    {
      key: 'status',
      label: 'Trạng thái',
      render: (value) => {
        const variants = {
          'Đã duyệt': 'success',
          'Chờ duyệt': 'warning',
          'Từ chối': 'danger'
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
            Quản lý Thanh toán Bảo hiểm
          </h2>
          <p className="text-sm text-[var(--color-admin-text-light-secondary)] mt-1">
            Quản lý hồ sơ thanh toán BHYT & BHTN
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
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-lg text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Tổng hồ sơ</p>
                <p className="text-2xl font-bold mt-1">{stats.total}</p>
              </div>
              <span className="material-symbols-outlined text-4xl opacity-80">description</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-lg text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Đã duyệt</p>
                <p className="text-2xl font-bold mt-1">{stats.approved}</p>
              </div>
              <span className="material-symbols-outlined text-4xl opacity-80">check_circle</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-6 rounded-lg text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Chờ duyệt</p>
                <p className="text-2xl font-bold mt-1">{stats.pending}</p>
              </div>
              <span className="material-symbols-outlined text-4xl opacity-80">pending</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-500 to-red-600 p-6 rounded-lg text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Từ chối</p>
                <p className="text-2xl font-bold mt-1">{stats.rejected}</p>
              </div>
              <span className="material-symbols-outlined text-4xl opacity-80">cancel</span>
            </div>
          </div>
        </div>
      )}

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-lg border border-[var(--color-admin-border-light)]">
            <p className="text-sm text-[var(--color-admin-text-light-secondary)]">Tổng chi phí</p>
            <p className="text-2xl font-bold text-[var(--color-admin-text-light-primary)] mt-2">
              {formatCurrency(stats.totalAmount)}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg border border-[var(--color-admin-border-light)]">
            <p className="text-sm text-[var(--color-admin-text-light-secondary)]">BH chi trả</p>
            <p className="text-2xl font-bold text-green-600 mt-2">
              {formatCurrency(stats.insuranceCovered)}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg border border-[var(--color-admin-border-light)]">
            <p className="text-sm text-[var(--color-admin-text-light-secondary)]">Bệnh nhân trả</p>
            <p className="text-2xl font-bold text-orange-600 mt-2">
              {formatCurrency(stats.patientPay)}
            </p>
          </div>
        </div>
      )}

      <DataTable
        columns={columns}
        data={insurance}
        itemsPerPage={10}
      />
    </div>
  );
};

export default Insurance_Management;
