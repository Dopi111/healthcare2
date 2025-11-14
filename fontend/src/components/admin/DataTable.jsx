import React, { useState } from 'react';

const DataTable = ({
  title,
  columns = [],
  data = [],
  itemsPerPage = 10,
  actions = null
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  // Sorting logic
  const sortedData = React.useMemo(() => {
    if (!sortConfig.key) return data;

    return [...data].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];

      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, sortConfig]);

  // Pagination logic
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = sortedData.slice(startIndex, endIndex);

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handlePrevious = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  return (
    <div className="flex flex-col rounded-xl border border-[var(--color-admin-border-light)] bg-[var(--color-admin-card-light)]">
      {/* Header */}
      {title && (
        <div className="p-6">
          <h3 className="text-lg font-semibold text-[var(--color-admin-text-light-primary)]">{title}</h3>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-[var(--color-admin-border-light)] text-sm">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-[var(--color-admin-text-light-secondary)] ${
                    col.sortable ? 'cursor-pointer hover:bg-gray-100' : ''
                  }`}
                  onClick={() => col.sortable && handleSort(col.key)}
                  scope="col"
                >
                  <div className="flex items-center gap-2">
                    {col.label}
                    {col.sortable && sortConfig.key === col.key && (
                      <span className="material-symbols-outlined text-sm">
                        {sortConfig.direction === 'asc' ? 'arrow_upward' : 'arrow_downward'}
                      </span>
                    )}
                  </div>
                </th>
              ))}
              {actions && (
                <th className="relative px-6 py-3" scope="col">
                  <span className="sr-only">Actions</span>
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-admin-border-light)] bg-white">
            {currentData.length === 0 ? (
              <tr>
                <td
                  className="px-6 py-12 text-center text-[var(--color-admin-text-light-secondary)]"
                  colSpan={columns.length + (actions ? 1 : 0)}
                >
                  Không có dữ liệu
                </td>
              </tr>
            ) : (
              currentData.map((row, rowIdx) => (
                <tr key={rowIdx} className="hover:bg-gray-50">
                  {columns.map((col, colIdx) => (
                    <td
                      key={colIdx}
                      className={`whitespace-nowrap px-6 py-4 ${
                        col.className || 'text-[var(--color-admin-text-light-secondary)]'
                      }`}
                    >
                      {col.render ? col.render(row[col.key], row) : row[col.key]}
                    </td>
                  ))}
                  {actions && (
                    <td className="whitespace-nowrap px-6 py-4 text-right">
                      {actions(row)}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between p-4 border-t border-[var(--color-admin-border-light)]">
          <p className="text-sm text-[var(--color-admin-text-light-secondary)]">
            Hiển thị {startIndex + 1} đến {Math.min(endIndex, sortedData.length)} trong tổng {sortedData.length} kết quả
          </p>
          <div className="flex items-center gap-2">
            <button
              className="inline-flex h-9 items-center justify-center rounded-md border border-[var(--color-admin-border-light)] bg-transparent px-4 text-sm font-medium text-[var(--color-admin-text-light-secondary)] hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={currentPage === 1}
              onClick={handlePrevious}
            >
              Trước
            </button>
            <span className="text-sm text-[var(--color-admin-text-light-secondary)]">
              Trang {currentPage} / {totalPages}
            </span>
            <button
              className="inline-flex h-9 items-center justify-center rounded-md border border-[var(--color-admin-border-light)] bg-transparent px-4 text-sm font-medium text-[var(--color-admin-text-light-secondary)] hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={currentPage === totalPages}
              onClick={handleNext}
            >
              Sau
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;
