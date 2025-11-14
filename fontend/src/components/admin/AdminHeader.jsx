import React, { useState } from 'react';

const AdminHeader = ({ context, onMenuClick }) => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between whitespace-nowrap border-b border-[var(--color-admin-border-light)] bg-[var(--color-admin-foreground-light)] px-4 sm:px-6 lg:px-8">
      <div className="flex items-center gap-4">
        <button
          className="lg:hidden hover:bg-gray-100 p-2 rounded-lg"
          onClick={onMenuClick}
        >
          <span className="material-symbols-outlined text-2xl">menu</span>
        </button>
        <h2 className="text-base sm:text-lg font-bold tracking-[-0.015em] text-[var(--color-admin-text-light-primary)] truncate max-w-[150px] sm:max-w-none">
          {context || 'Dashboard'}
        </h2>
      </div>

      <div className="flex flex-1 items-center justify-end gap-4">
        {/* Search Bar */}
        <label className="relative hidden sm:block">
          <span className="material-symbols-outlined pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-admin-text-light-secondary)]">
            search
          </span>
          <input
            className="form-input h-10 w-full min-w-[200px] max-w-xs rounded-lg border-none bg-[var(--color-admin-bg-light)] py-2 pl-10 pr-4 text-sm text-[var(--color-admin-text-light-primary)] placeholder:text-[var(--color-admin-text-light-secondary)]"
            placeholder="Tìm kiếm..."
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </label>

        {/* User Actions */}
        <div className="flex items-center gap-2">
          {/* Notifications */}
          <button className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-[var(--color-admin-bg-light)] text-[var(--color-admin-text-light-secondary)] hover:bg-gray-200">
            <span className="material-symbols-outlined text-2xl">notifications</span>
          </button>

          {/* User Avatar */}
          <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold">
            <span className="material-symbols-outlined">person</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
