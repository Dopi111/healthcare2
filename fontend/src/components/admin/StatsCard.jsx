import React from 'react';

const StatsCard = ({ title, value, trend, trendType = 'success' }) => {
  const trendColorClass = {
    success: 'text-[var(--color-admin-success)]',
    warning: 'text-[var(--color-admin-warning)]',
    danger: 'text-[var(--color-admin-danger)]',
  }[trendType];

  return (
    <div className="flex flex-col gap-2 rounded-xl bg-[var(--color-admin-card-light)] p-6 border border-[var(--color-admin-border-light)] hover:shadow-lg transition-shadow">
      <p className="text-base font-medium text-[var(--color-admin-text-light-secondary)]">{title}</p>
      <p className="text-3xl font-bold tracking-tight text-[var(--color-admin-text-light-primary)]">{value}</p>
      {trend && (
        <p className={`text-sm font-medium ${trendColorClass}`}>{trend}</p>
      )}
    </div>
  );
};

export default StatsCard;
