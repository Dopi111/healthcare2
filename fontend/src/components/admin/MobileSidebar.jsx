import React, { useEffect } from 'react';

const MobileSidebar = ({ isOpen, onClose, context, setContext, getNavClasses }) => {
  // Đóng sidebar khi nhấn ESC
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when sidebar is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Các menu items
  const menuItems = [
    {
      title: 'Quản trị',
      icon: 'settings',
      items: [
        { label: 'Quản lý tài khoản', context: 'Quản lý tài khoản', icon: 'group' },
        { label: 'Quản lý nhân viên', context: 'Quản lý nhân viên', icon: 'badge' },
      ]
    },
    {
      title: 'Tiếp Tân',
      icon: 'person_add',
      items: [
        { label: 'Thêm BN mới', context: 'Thêm BN mới', icon: 'person_add' },
        { label: 'Danh sách BN', context: 'Danh sách BN', icon: 'list' },
      ]
    },
    {
      title: 'Bác Sĩ',
      icon: 'medical_services',
      items: [
        { label: 'Quản lý BN cá nhân', context: 'Quản lý BN cá nhân', icon: 'person' },
        { label: 'Quản lý phiếu', context: 'Quản lý phiếu', icon: 'description' },
        { label: 'Quản lý kết quả xét nghiệm', context: 'Quản lý kết quả xét nghiệm', icon: 'science' },
        { label: 'Quản lý lịch làm việc', context: 'Quản lý lịch làm việc', icon: 'calendar_month' },
      ]
    },
    {
      title: 'Bác Sĩ Xét Nghiệm',
      icon: 'biotech',
      items: [
        { label: 'Nhận phiếu xét nghiệm', context: 'Nhận phiếu xét nghiệm', icon: 'assignment' },
        { label: 'Kết quả xét nghiệm', context: 'Kết quả xét nghiệm', icon: 'lab_profile' },
      ]
    },
    {
      title: 'Kế Toán',
      icon: 'account_balance',
      items: [
        { label: 'Quản lý Quỹ', context: 'Quản lý Quỹ', icon: 'savings' },
        { label: 'Quản lý Lương', context: 'Quản lý Lương', icon: 'payments' },
        { label: 'DT Khám & Chữa Bệnh', context: 'DT Khám & Chữa Bệnh', icon: 'bar_chart' },
        { label: 'QL TT Bảo Hiểm', context: 'QL TT Bảo Hiểm', icon: 'health_and_safety' },
        { label: 'Chi Phí HĐ', context: 'Chi Phí HĐ', icon: 'receipt_long' },
      ]
    },
    {
      title: 'Hệ Thống',
      icon: 'settings_applications',
      items: [
        { label: 'Danh sách lịch hẹn BN', context: 'Danh sách lịch hẹn BN', icon: 'event_note' },
        { label: 'Danh sách chi tiết BN', context: 'Danh sách chi tiết BN', icon: 'folder_shared' },
      ]
    },
  ];

  const handleMenuClick = (menuContext) => {
    setContext(menuContext);
    onClose();
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-40 bg-black/50 lg:hidden"
        onClick={onClose}
      />

      {/* Sidebar */}
      <aside className="fixed top-0 left-0 z-50 h-screen w-64 flex-col justify-between border-r border-[var(--color-admin-border-light)] bg-[var(--color-admin-foreground-light)] flex lg:hidden overflow-y-auto">
        <div className="flex flex-col gap-4 p-4">
          {/* Header with close button */}
          <div className="flex items-center justify-between px-3 py-2">
            <div className="flex items-center gap-3">
              <div className="size-8 text-[var(--color-admin-primary)]">
                <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                  <path d="M44 4H30.6666V17.3334H17.3334V30.6666H4V44H44V4Z" fill="currentColor"></path>
                </svg>
              </div>
              <h1 className="text-[var(--color-admin-text-light-primary)] text-xl font-bold">HealthCare</h1>
            </div>
            <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
              <span className="material-symbols-outlined text-2xl">close</span>
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex flex-col gap-2 mt-4">
            {/* Profile */}
            <a
              className={`flex items-center gap-3 rounded-lg px-3 py-2 ${
                context === 'Thông tin cá nhân'
                  ? 'bg-[var(--color-admin-primary)]/10 text-[var(--color-admin-primary)]'
                  : 'text-[var(--color-admin-text-light-secondary)] hover:bg-gray-100'
              }`}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleMenuClick('Thông tin cá nhân');
              }}
            >
              <span className="material-symbols-outlined text-2xl">account_circle</span>
              <p className="text-sm font-semibold">Thông tin cá nhân</p>
            </a>

            {/* Menu Items */}
            {menuItems.map((section, idx) => (
              <div key={idx} className="flex flex-col gap-1 mt-2">
                <div className="text-xs font-medium text-[var(--color-admin-text-light-secondary)] uppercase px-3 py-1">
                  {section.title}
                </div>
                {section.items.map((item, itemIdx) => (
                  <a
                    key={itemIdx}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 ${
                      context === item.context
                        ? 'bg-[var(--color-admin-primary)]/10 text-[var(--color-admin-primary)]'
                        : 'text-[var(--color-admin-text-light-secondary)] hover:bg-gray-100'
                    }`}
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handleMenuClick(item.context);
                    }}
                  >
                    <span className="material-symbols-outlined text-xl">{item.icon}</span>
                    <p className="text-xs font-medium truncate">{item.label}</p>
                  </a>
                ))}
              </div>
            ))}
          </nav>
        </div>

        {/* Bottom section */}
        <div className="flex flex-col gap-1 p-4 border-t border-[var(--color-admin-border-light)]">
          <a
            className={`flex items-center gap-3 rounded-lg px-3 py-2 ${
              context === 'Thêm thông tin nhân viên'
                ? 'bg-[var(--color-admin-primary)]/10 text-[var(--color-admin-primary)]'
                : 'text-[var(--color-admin-text-light-secondary)] hover:bg-gray-100'
            }`}
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handleMenuClick('Thêm thông tin nhân viên');
            }}
          >
            <span className="material-symbols-outlined text-2xl">add_circle</span>
            <p className="text-sm font-medium">Thêm thông tin</p>
          </a>
          <a
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-[var(--color-admin-text-light-secondary)] hover:bg-gray-100"
            href="#"
            onClick={(e) => {
              e.preventDefault();
              localStorage.removeItem('token');
              localStorage.removeItem('employeeId');
              window.location.href = '/Admin/auth/Login';
            }}
          >
            <span className="material-symbols-outlined text-2xl">logout</span>
            <p className="text-sm font-medium">Đăng xuất</p>
          </a>
        </div>
      </aside>
    </>
  );
};

export default MobileSidebar;
