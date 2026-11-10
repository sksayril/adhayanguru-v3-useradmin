'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Menu,
  Search,
  Bell,
  ChevronDown,
  User,
  Shield,
  LogOut,
  Sliders,
  Bookmark,
} from 'lucide-react';

interface UserTopNavbarProps {
  onToggleSidebar: () => void;
}

interface StudentData {
  name: string;
  studentId?: string;
  classLevel?: string;
  board?: string;
  email?: string;
}

export default function UserTopNavbar({ onToggleSidebar }: UserTopNavbarProps) {
  const router = useRouter();
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [student, setStudent] = useState<StudentData>({
    name: 'Sayril Amed',
    classLevel: 'Class 10',
    board: 'WBBSE',
  });

  useEffect(() => {
    // 1. Try localStorage
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('student_user');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed && parsed.name) {
            setStudent(parsed);
          }
        } catch {
          // ignore
        }
      }
    }

    // 2. Refresh from /api/user/me
    fetch('/api/user/me')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.success && data?.student) {
          setStudent(data.student);
          if (typeof window !== 'undefined') {
            localStorage.setItem('student_user', JSON.stringify(data.student));
          }
        }
      })
      .catch(() => {});
  }, []);

  const handleSignOut = async () => {
    setProfileOpen(false);
    try {
      await fetch('/api/user/logout', { method: 'POST' });
    } catch {
      // ignore
    }
    if (typeof window !== 'undefined') {
      localStorage.removeItem('student_user');
    }
    router.push('/user/login');
  };

  const initials = student.name
    ? student.name
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'SA';

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-20 px-4 md:px-8 bg-[#F4F6FB]/90 backdrop-blur-md border-b border-white/60">
      {/* Left: Hamburger + Search Input */}
      <div className="flex items-center gap-3 md:gap-5 flex-1 max-w-2xl">
        <button
          type="button"
          onClick={onToggleSidebar}
          aria-label="Toggle navigation menu"
          suppressHydrationWarning
          className="flex items-center justify-center w-11 h-11 rounded-2xl bg-[#FFFFFF] neu-button text-slate-700 hover:text-purple-600 transition-colors lg:hidden"
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
            placeholder="Search subjects, chapters, questions..."
            suppressHydrationWarning
            className="w-full pl-11 pr-24 py-2.5 bg-[#EFF2F8] neu-inset text-slate-700 placeholder-slate-400 text-sm rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-400/50 transition-all border border-transparent"
          />
          <div className="absolute right-3.5 flex items-center gap-1 px-2 py-1 rounded-md bg-white/80 shadow-sm border border-slate-200/80 text-[11px] font-semibold text-slate-500 pointer-events-none">
            <span>Ctrl + K</span>
          </div>
        </div>
      </div>

      {/* Right Controls: Notifications, Student Profile */}
      <div className="flex items-center gap-3 md:gap-5 ml-4">
        {/* Notification Bell */}
        <button
          type="button"
          suppressHydrationWarning
          className="relative flex items-center justify-center w-11 h-11 rounded-2xl bg-[#FFFFFF] neu-button text-slate-700 hover:text-purple-600 transition-colors"
          title="Notifications"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-white animate-pulse" />
        </button>

        {/* Student Profile Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setProfileOpen(!profileOpen)}
            suppressHydrationWarning
            className="flex items-center gap-3 p-1.5 pr-3 rounded-2xl bg-white neu-button transition-all group"
          >
            {/* Student Avatar */}
            <div className="relative w-10 h-10 rounded-xl overflow-hidden ring-2 ring-purple-500/30 bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
              <span className="bg-gradient-to-tr from-amber-300 to-white bg-clip-text text-transparent">
                {initials}
              </span>
            </div>

            <div className="hidden md:flex flex-col text-left">
              <span className="text-sm font-bold text-slate-800 group-hover:text-purple-600 transition-colors">
                {student.name}
              </span>
              <span className="text-[11px] font-medium text-slate-500">
                {student.classLevel || 'Class 10'} • {student.board || 'WBBSE'}
              </span>
            </div>

            <ChevronDown className="w-4 h-4 text-slate-400 hidden md:block group-hover:translate-y-0.5 transition-transform" />
          </button>

          {/* Profile Dropdown Popover */}
          {profileOpen && (
            <div className="absolute right-0 mt-3 w-60 rounded-2xl bg-white neu-card p-2 text-sm z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-3 py-2.5 border-b border-slate-100">
                <p className="font-bold text-slate-800">{student.name}</p>
                <p className="text-xs text-slate-400">
                  {student.classLevel || 'Class 10'} ({student.board || 'Secondary Board'})
                </p>
                {student.studentId && (
                  <p className="text-[10px] font-mono font-bold text-purple-600 mt-0.5">
                    ID: {student.studentId}
                  </p>
                )}
              </div>
              <div className="py-1">
                <Link
                  href="/user/dashboard/bookmarks"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-slate-600 hover:text-purple-600 hover:bg-purple-50/60 rounded-xl transition-colors"
                >
                  <Bookmark className="w-4 h-4" />
                  <span>My Bookmarks</span>
                </Link>
                <Link
                  href="/user/dashboard/settings"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-slate-600 hover:text-purple-600 hover:bg-purple-50/60 rounded-xl transition-colors"
                >
                  <Sliders className="w-4 h-4" />
                  <span>Student Settings</span>
                </Link>
                <Link
                  href="/admin/login"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-orange-600 hover:bg-orange-50/60 rounded-xl transition-colors font-semibold"
                >
                  <Shield className="w-4 h-4" />
                  <span>Go to Admin Portal</span>
                </Link>
              </div>
              <div className="pt-1 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="flex items-center gap-2.5 w-full px-3 py-2 text-rose-500 hover:bg-rose-50/70 rounded-xl transition-colors text-left"
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

