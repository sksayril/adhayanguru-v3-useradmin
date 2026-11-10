'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import UserSidebar from '@/components/user/UserSidebar';
import UserTopNavbar from '@/components/user/UserTopNavbar';

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  // If on user auth pages (login or signup), render children standalone
  const isAuthPage = pathname === '/user/login' || pathname === '/user/signup';

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[#F4F6FB] flex flex-col">
      {/* Student Fixed Sidebar */}
      <UserSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:pl-64 transition-all duration-300">
        {/* Student Top Header Navbar */}
        <UserTopNavbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        {/* Page Content Viewport */}
        <main className="flex-1 p-4 md:p-8 max-w-[1600px] w-full mx-auto space-y-6">
          {children}
        </main>
      </div>
    </div>
  );
}

