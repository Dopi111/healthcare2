import React, { useState } from 'react';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import MobileSidebar from './MobileSidebar';

const AdminLayout = ({ context, setContext, getNavClasses, children }) => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(prev => !prev);
  };

  const closeMobileSidebar = () => {
    setIsMobileSidebarOpen(false);
  };

  return (
    <div className="relative flex min-h-screen w-full bg-[var(--color-admin-bg-light)]">
      {/* Desktop Sidebar */}
      <AdminSidebar context={context} setContext={setContext} getNavClasses={getNavClasses} />

      {/* Mobile Sidebar */}
      <MobileSidebar
        isOpen={isMobileSidebarOpen}
        onClose={closeMobileSidebar}
        context={context}
        setContext={setContext}
        getNavClasses={getNavClasses}
      />

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <AdminHeader context={context} onMenuClick={toggleMobileSidebar} />

        {/* Main Section */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
