'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Layers,
  GraduationCap,
  BookOpen,
  BookText,
  FileQuestion,
  Users,
  UserCheck,
  BarChart3,
  UserCog,
  Settings,
  ChevronDown,
  ChevronRight,
  Crown,
  ArrowRight,
  PlusCircle,
  FolderOpen,
  UploadCloud,
  Sparkles,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const [questionsOpen, setQuestionsOpen] = useState(true);

  const navItems = [
    {
      name: 'Dashboard',
      href: '/admin/dashboard',
      icon: LayoutDashboard,
      active: pathname === '/admin/dashboard' || pathname === '/admin',
    },
    {
      name: 'Boards',
      href: '/admin/dashboard/boards',
      icon: Layers,
      active: pathname.startsWith('/admin/dashboard/boards') || pathname === '/admin/boards',
    },
    {
      name: 'Classes',
      href: '/admin/dashboard/classes',
      icon: GraduationCap,
      active: pathname.startsWith('/admin/dashboard/classes'),
    },
    {
      name: 'Subjects',
      href: '/admin/dashboard/subjects',
      icon: BookOpen,
      active: pathname.startsWith('/admin/dashboard/subjects'),
    },
    {
      name: 'Chapters',
      href: '/admin/dashboard/chapters',
      icon: BookText,
      active: pathname.startsWith('/admin/dashboard/chapters'),
    },
  ];

  const questionSubItems = [
    { name: 'Add Question', href: '/admin/dashboard/questions/add', icon: PlusCircle },
    { name: 'Question Bank', href: '/admin/dashboard/questions', icon: FolderOpen },
    { name: 'Bulk Upload', href: '/admin/dashboard/questions/bulk', icon: UploadCloud },
  ];

  const secondaryNavItems = [
    {
      name: 'Students',
      href: '/admin/dashboard/students',
      icon: Users,
      active: pathname.startsWith('/admin/dashboard/students'),
    },
    {
      name: 'Parents',
      href: '/admin/dashboard/parents',
      icon: UserCheck,
      active: pathname.startsWith('/admin/dashboard/parents'),
    },
    {
      name: 'Reports',
      href: '/admin/dashboard/reports',
      icon: BarChart3,
      active: pathname.startsWith('/admin/dashboard/reports'),
    },
    {
      name: 'Users & Roles',
      href: '/admin/dashboard/users-roles',
      icon: UserCog,
      active: pathname.startsWith('/admin/dashboard/users-roles'),
    },
    {
      name: 'Settings',
      href: '/admin/dashboard/settings',
      icon: Settings,
      active: pathname.startsWith('/admin/dashboard/settings'),
    },
  ];

  const isQuestionsActive = pathname.startsWith('/admin/dashboard/questions');

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
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col w-64 bg-[#0B132B] text-slate-300 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } border-r border-slate-800/80 shadow-2xl overflow-hidden`}
      >
        {/* Ambient bottom wave illustration */}
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-72 opacity-25 overflow-hidden">
          <svg viewBox="0 0 400 400" className="w-full h-full object-cover">
            <defs>
              <linearGradient id="sidebarWave" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FF6B00" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#FF8800" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#0B132B" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              d="M0,220 C100,160 180,300 300,200 C360,150 400,240 400,240 L400,400 L0,400 Z"
              fill="url(#sidebarWave)"
            />
            <path
              d="M0,280 C120,240 220,330 320,270 C380,240 400,300 400,300 L400,400 L0,400 Z"
              fill="#FF6B00"
              fillOpacity="0.15"
            />
          </svg>
        </div>

        {/* Brand Logo & Name */}
        <div className="relative z-10 flex items-center gap-3 px-6 py-5 border-b border-slate-800/60">
          <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-400 p-0.5 shadow-lg shadow-orange-500/30">
            <div className="flex items-center justify-center w-full h-full bg-[#0B132B] rounded-[10px]">
              <GraduationCap className="w-6 h-6 text-orange-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold tracking-tight text-white text-[17px]">
                Dekh Education
              </span>
            </div>
            <span className="text-[11px] font-medium tracking-wide text-orange-400/90 uppercase">
              Admin Panel
            </span>
          </div>
        </div>

        {/* Navigation items list */}
        <div className="relative z-10 flex-1 px-4 py-4 space-y-6 overflow-y-auto">
          <div>
            <div className="px-3 mb-2 text-[11px] font-bold tracking-wider text-slate-400 uppercase">
              Main Menu
            </div>
            <nav className="space-y-1.5">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={onClose}
                    className={`flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                      item.active
                        ? 'bg-gradient-to-r from-[#FF5E00] to-[#FF8A00] text-white shadow-[0_8px_20px_rgba(255,94,0,0.38)]'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${item.active ? 'text-white' : 'text-slate-400'}`} />
                    <span>{item.name}</span>
                  </Link>
                );
              })}

              {/* Questions dropdown */}
              <div>
                <button
                  type="button"
                  onClick={() => setQuestionsOpen(!questionsOpen)}
                  suppressHydrationWarning
                  className={`flex items-center justify-between w-full px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isQuestionsActive
                      ? 'text-orange-400 bg-slate-800/70'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <FileQuestion className="w-5 h-5 text-slate-400" />
                    <span>Questions</span>
                  </div>
                  {questionsOpen ? (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  )}
                </button>

                {questionsOpen && (
                  <div className="pl-6 pr-2 mt-1 space-y-1">
                    {questionSubItems.map((sub) => {
                      const SubIcon = sub.icon;
                      const isSubActive = pathname === sub.href;
                      return (
                        <Link
                          key={sub.name}
                          href={sub.href}
                          onClick={onClose}
                          className={`flex items-center gap-3 px-3 py-2 text-xs font-medium rounded-lg transition-all ${
                            isSubActive
                              ? 'text-orange-400 bg-orange-500/10'
                              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
                          }`}
                        >
                          <SubIcon className="w-4 h-4" />
                          <span>{sub.name}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>

              {secondaryNavItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={onClose}
                    className={`flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                      item.active
                        ? 'bg-gradient-to-r from-[#FF5E00] to-[#FF8A00] text-white shadow-[0_8px_20px_rgba(255,94,0,0.38)]'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${item.active ? 'text-white' : 'text-slate-400'}`} />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Pro Plan Bottom Card */}
        <div className="relative z-10 p-4 border-t border-slate-800/60 bg-[#0B132B]/80 backdrop-blur-md">
          <div className="p-3.5 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-amber-500/25 shadow-xl relative overflow-hidden group">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 text-slate-950 shadow-md shadow-orange-500/30">
                <Crown className="w-4 h-4 fill-slate-950" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Pro Plan</h4>
                <p className="text-[11px] text-slate-400">Valid till: 31 Dec 2026</p>
              </div>
            </div>
            <Link
              href="/admin/dashboard/settings"
              className="mt-2.5 flex items-center justify-center gap-2 w-full py-2 px-3 rounded-xl bg-gradient-to-r from-[#FF5E00] to-[#FF8A00] text-white text-xs font-semibold shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <span>Manage Plan</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}

