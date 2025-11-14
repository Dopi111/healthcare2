import React from 'react';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';

const AdminLayout = ({ context, setContext, getNavClasses, children }) => {
  return (
    <div className="relative flex min-h-screen w-full bg-[var(--color-admin-bg-light)]">
      {/* Sidebar */}
      <AdminSidebar context={context} setContext={setContext} getNavClasses={getNavClasses} />

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <AdminHeader context={context} />

        {/* Main Section */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
