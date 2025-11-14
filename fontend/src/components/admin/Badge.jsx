import React from 'react';

const Badge = ({ children, variant = 'default', size = 'md' }) => {
  const variants = {
    success: 'bg-[var(--color-admin-success)]/10 text-[var(--color-admin-success)]',
    warning: 'bg-[var(--color-admin-warning)]/10 text-[var(--color-admin-warning)]',
    danger: 'bg-[var(--color-admin-danger)]/10 text-[var(--color-admin-danger)]',
    primary: 'bg-[var(--color-admin-primary)]/10 text-[var(--color-admin-primary)]',
    info: 'bg-blue-100 text-blue-600',
    default: 'bg-gray-100 text-gray-600'
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-xs',
    lg: 'px-3 py-1 text-sm'
  };

  return (
    <span className={`inline-flex rounded-full font-medium ${variants[variant]} ${sizes[size]}`}>
      {children}
    </span>
  );
};

export default Badge;
