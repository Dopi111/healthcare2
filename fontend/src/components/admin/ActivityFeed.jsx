import React from 'react';

const ActivityFeed = ({ title = "Hoạt động gần đây", activities = [] }) => {
  const getActivityIcon = (type) => {
    const icons = {
      signup: 'person_add',
      order: 'shopping_cart',
      warning: 'inventory',
      cancel: 'cancel',
      success: 'check_circle',
      info: 'info',
      medical: 'medical_services',
      appointment: 'event',
      payment: 'payments',
      default: 'circle'
    };
    return icons[type] || icons.default;
  };

  const getActivityColor = (type) => {
    const colors = {
      signup: 'bg-[var(--color-admin-primary)]/10 text-[var(--color-admin-primary)]',
      order: 'bg-[var(--color-admin-success)]/10 text-[var(--color-admin-success)]',
      success: 'bg-[var(--color-admin-success)]/10 text-[var(--color-admin-success)]',
      warning: 'bg-[var(--color-admin-warning)]/10 text-[var(--color-admin-warning)]',
      cancel: 'bg-[var(--color-admin-danger)]/10 text-[var(--color-admin-danger)]',
      danger: 'bg-[var(--color-admin-danger)]/10 text-[var(--color-admin-danger)]',
      info: 'bg-blue-100 text-blue-600',
      medical: 'bg-teal-100 text-teal-600',
      appointment: 'bg-purple-100 text-purple-600',
      payment: 'bg-green-100 text-green-600',
      default: 'bg-gray-100 text-gray-600'
    };
    return colors[type] || colors.default;
  };

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-[var(--color-admin-border-light)] bg-[var(--color-admin-card-light)] p-6">
      <h3 className="text-lg font-semibold text-[var(--color-admin-text-light-primary)]">{title}</h3>

      {activities.length === 0 ? (
        <div className="text-center py-8 text-[var(--color-admin-text-light-secondary)]">
          Chưa có hoạt động nào
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {activities.map((activity, idx) => (
            <div key={idx} className="flex items-start gap-4">
              <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${getActivityColor(activity.type)}`}>
                <span className="material-symbols-outlined">{getActivityIcon(activity.type)}</span>
              </div>
              <div className="flex flex-col flex-1 min-w-0">
                <p className="text-sm text-[var(--color-admin-text-light-primary)]">
                  {activity.message}
                </p>
                <p className="text-xs text-[var(--color-admin-text-light-secondary)] mt-1">
                  {activity.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ActivityFeed;
