'use client';

import React, { useState, useEffect } from 'react';
import {
  Menu,
  Search,
  Bell,
  HelpCircle,
  ChevronDown,
  User,
  ShieldCheck,
  LogOut,
  Sliders,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface TopNavbarProps {
  onToggleSidebar: () => void;
}

export default function TopNavbar({ onToggleSidebar }: TopNavbarProps) {
  const router = useRouter();
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [adminUser, setAdminUser] = useState({
    name: 'SK Sayril Amed',
    email: 'sayril@dekheducation.com',
    role: 'Super Admin',
  });

  useEffect(() => {
    // Read from localStorage if available
    try {
      const stored = localStorage.getItem('admin_user');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.name) {
          setAdminUser({
            name: parsed.name,
            email: parsed.email || 'admin@dekheducation.com',
            role: parsed.role || 'Super Admin',
          });
        }
      }
    } catch (e) {
      // fallback
    }

    // Also verify session with backend
    fetch('/api/admin/me')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.success && data.admin) {
          setAdminUser({
            name: data.admin.name,
            email: data.admin.email,
            role: data.admin.role,
          });
        }
      })
      .catch(() => {});
  }, []);

  const handleSignOut = async () => {
    setProfileOpen(false);
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
    } catch (e) {}
    if (typeof window !== 'undefined') {
      localStorage.removeItem('admin_user');
    }
    router.push('/admin/login');
  };

  const initials = adminUser.name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'SA';

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-20 px-4 md:px-8 bg-[#F4F6FB]/90 backdrop-blur-md border-b border-white/60">
      {/* Left: Hamburger + Search Input */}
      <div className="flex items-center gap-3 md:gap-5 flex-1 max-w-2xl">
        <button
          type="button"
          onClick={onToggleSidebar}
          aria-label="Toggle navigation menu"
          suppressHydrationWarning
          className="flex items-center justify-center w-11 h-11 rounded-2xl bg-[#FFFFFF] neu-button text-slate-700 hover:text-orange-500 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Neumorphic Search Bar */}
        <div className="relative flex items-center flex-1">
          <div className="absolute left-4 pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Search students, questions, chapters, subjects..."
            suppressHydrationWarning
            className="w-full pl-11 pr-24 py-2.5 bg-[#EFF2F8] neu-inset text-slate-700 placeholder-slate-400 text-sm rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-400/50 transition-all border border-transparent"
          />
          <div className="absolute right-3.5 flex items-center gap-1 px-2 py-1 rounded-md bg-white/80 shadow-sm border border-slate-200/80 text-[11px] font-semibold text-slate-500 pointer-events-none">
            <span>Ctrl + K</span>
          </div>
        </div>
      </div>

      {/* Right Controls: Notifications, Help, User Profile */}
      <div className="flex items-center gap-3 md:gap-5 ml-4">
        {/* Notification Bell */}
        <button
          type="button"
          suppressHydrationWarning
          className="relative flex items-center justify-center w-11 h-11 rounded-2xl bg-[#FFFFFF] neu-button text-slate-700 hover:text-orange-500 transition-colors"
          title="Notifications"
        >
          <Bell className="w-5 h-5" />
          {/* Red unread dot */}
          <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-white animate-pulse" />
        </button>

        {/* Help button */}
        <button
          type="button"
          suppressHydrationWarning
          className="hidden sm:flex items-center justify-center w-11 h-11 rounded-2xl bg-[#FFFFFF] neu-button text-slate-700 hover:text-orange-500 transition-colors"
          title="Help & Support"
        >
          <HelpCircle className="w-5 h-5" />
        </button>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setProfileOpen(!profileOpen)}
            suppressHydrationWarning
            className="flex items-center gap-3 p-1.5 pr-2.5 rounded-2xl bg-white neu-button transition-all group"
          >
            {/* User Avatar */}
            <div className="relative w-10 h-10 rounded-xl overflow-hidden ring-2 ring-orange-500/30 bg-gradient-to-tr from-slate-800 to-slate-900 flex items-center justify-center text-white font-bold text-sm shadow-sm">
              <span className="bg-gradient-to-tr from-amber-400 to-orange-500 bg-clip-text text-transparent">
                {initials}
              </span>
            </div>

            <div className="hidden md:flex flex-col text-left">
              <span className="text-sm font-bold text-slate-800 group-hover:text-orange-600 transition-colors">
                {adminUser.name}
              </span>
              <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-orange-500 inline" />
                {adminUser.role}
              </span>
            </div>

            <ChevronDown className="w-4 h-4 text-slate-400 hidden md:block group-hover:translate-y-0.5 transition-transform" />
          </button>

          {/* Profile Dropdown Popover */}
          {profileOpen && (
            <div className="absolute right-0 mt-3 w-56 rounded-2xl bg-white neu-card p-2 text-sm z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-3 py-2.5 border-b border-slate-100">
                <p className="font-semibold text-slate-800">{adminUser.name}</p>
                <p className="text-xs text-slate-400 truncate">{adminUser.email}</p>
              </div>
              <div className="py-1">
                <Link
                  href="/admin/dashboard/users-roles"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-slate-600 hover:text-orange-500 hover:bg-orange-50/60 rounded-xl transition-colors"
                >
                  <User className="w-4 h-4" />
                  <span>My Profile</span>
                </Link>
                <Link
                  href="/admin/dashboard/settings"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-slate-600 hover:text-orange-500 hover:bg-orange-50/60 rounded-xl transition-colors"
                >
                  <Sliders className="w-4 h-4" />
                  <span>Account Settings</span>
                </Link>
              </div>
              <div className="pt-1 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleSignOut}
                  suppressHydrationWarning
                  className="flex items-center gap-2.5 w-full px-3 py-2 text-rose-500 hover:bg-rose-50/70 rounded-xl transition-colors text-left cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
