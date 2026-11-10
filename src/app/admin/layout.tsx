'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from '@/components/admin/Sidebar';
import TopNavbar from '@/components/admin/TopNavbar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  // If on admin auth pages (login or signup), render children standalone without dashboard shell
  const isAuthPage = pathname === '/admin/login' || pathname === '/admin/signup';

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[#F4F6FB] flex flex-col">
      {/* Fixed Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area (offset by sidebar width on desktop) */}
      <div className="flex-1 flex flex-col lg:pl-64 transition-all duration-300">
        {/* Top Header Navbar */}
        <TopNavbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        {/* Page Content Viewport */}
        <main className="flex-1 p-4 md:p-8 max-w-[1600px] w-full mx-auto space-y-6">
          {children}
        </main>
      </div>
    </div>
  );
}
