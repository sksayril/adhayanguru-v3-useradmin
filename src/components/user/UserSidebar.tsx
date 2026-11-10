'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Layers,
  BookOpen,
  LayoutGrid,
  PenTool,
  FileCheck,
  BarChart3,
  Calendar,
  Bookmark,
  Headphones,
  Settings,
  Crown,
  ArrowRight,
  GraduationCap,
} from 'lucide-react';

interface UserSidebarProps {
  isOpen: boolean;
  onClose?: () => void;
}

export default function UserSidebar({ isOpen, onClose }: UserSidebarProps) {
  const pathname = usePathname();

  const primaryNavItems = [
    {
      name: 'Dashboard',
      href: '/user/dashboard',
      icon: LayoutDashboard,
      active: pathname === '/user/dashboard' || pathname === '/user',
    },
    {
      name: 'My Classes',
      href: '/user/dashboard/classes',
      icon: Layers,
      active: pathname.startsWith('/user/dashboard/classes'),
    },
    {
      name: 'Subjects',
      href: '/user/dashboard/subjects',
      icon: BookOpen,
      active: pathname.startsWith('/user/dashboard/subjects'),
    },
    {
      name: 'Chapters',
      href: '/user/dashboard/chapters',
      icon: LayoutGrid,
      active: pathname.startsWith('/user/dashboard/chapters'),
    },
    {
      name: 'Practice',
      href: '/user/dashboard/practice',
      icon: PenTool,
      active: pathname.startsWith('/user/dashboard/practice'),
    },
    {
      name: 'Tests',
      href: '/user/dashboard/tests',
      icon: FileCheck,
      active: pathname.startsWith('/user/dashboard/tests'),
    },
    {
      name: 'My Performance',
      href: '/user/dashboard/performance',
      icon: BarChart3,
      active: pathname.startsWith('/user/dashboard/performance'),
    },
    {
      name: 'Study Plan',
      href: '/user/dashboard/study-plan',
      icon: Calendar,
      active: pathname.startsWith('/user/dashboard/study-plan'),
    },
    {
      name: 'Bookmarks',
      href: '/user/dashboard/bookmarks',
      icon: Bookmark,
      active: pathname.startsWith('/user/dashboard/bookmarks'),
    },
  ];

  const secondaryNavItems = [
    {
      name: 'Help & Support',
      href: '/user/dashboard/help',
      icon: Headphones,
      active: pathname.startsWith('/user/dashboard/help'),
    },
    {
      name: 'Settings',
      href: '/user/dashboard/settings',
      icon: Settings,
      active: pathname.startsWith('/user/dashboard/settings'),
    },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col w-64 bg-[#120E32] text-slate-300 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } border-r border-purple-900/40 shadow-2xl overflow-hidden`}
      >
        {/* Ambient bottom wave illustration */}
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-64 opacity-30 overflow-hidden">
          <svg viewBox="0 0 400 400" className="w-full h-full object-cover">
            <defs>
              <linearGradient id="userSidebarWave" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#7C3AED" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#120E32" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              d="M0,230 C90,170 170,290 280,210 C350,160 400,240 400,240 L400,400 L0,400 Z"
              fill="url(#userSidebarWave)"
            />
          </svg>
        </div>

        {/* Brand Logo & Name */}
        <div className="relative z-10 flex items-center gap-3 px-6 py-5 border-b border-purple-900/30">
          <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-400 p-0.5 shadow-lg shadow-orange-500/30">
            <div className="flex items-center justify-center w-full h-full bg-[#120E32] rounded-[10px]">
              <GraduationCap className="w-6 h-6 text-orange-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold tracking-tight text-white text-[16px]">
                Dekh Education
              </span>
            </div>
            <span className="text-[11px] font-semibold tracking-wide text-purple-300/80">
              Student Portal
            </span>
          </div>
        </div>

        {/* Navigation list */}
        <div className="relative z-10 flex-1 px-4 py-4 space-y-4 overflow-y-auto">
          <nav className="space-y-1">
            {primaryNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    item.active
                      ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-[0_6px_18px_rgba(139,92,246,0.45)]'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${item.active ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Secondary Nav separator */}
          <div className="pt-2 border-t border-purple-900/30 space-y-1">
            {secondaryNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center gap-3.5 px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                    item.active
                      ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-5 h-5 text-slate-400" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Bottom "Go Premium" card */}
        <div className="relative z-10 p-4 border-t border-purple-900/30 bg-[#120E32]/90 backdrop-blur-md">
          <div className="p-3.5 rounded-2xl bg-gradient-to-b from-purple-950/70 to-slate-950/90 border border-purple-500/30 shadow-xl relative overflow-hidden group">
            <div className="flex items-center gap-2.5 mb-1.5">
              <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 text-slate-950 shadow-md shadow-orange-500/30">
                <Crown className="w-4 h-4 fill-slate-950" />
              </div>
              <h4 className="text-sm font-bold text-white">Go Premium</h4>
            </div>
            <p className="text-[11px] text-purple-200/80 leading-relaxed">
              Unlock full tests, explanations and more features.
            </p>
            <button
              type="button"
              suppressHydrationWarning
              onClick={() => alert('Premium plan checkout opened!')}
              className="mt-3 flex items-center justify-center gap-2 w-full py-2 px-3 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white text-xs font-semibold shadow-lg shadow-purple-500/30 transition-all cursor-pointer"
            >
              <span>Upgrade Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

