'use client';

import React from 'react';
import Link from 'next/link';
import {
  Zap,
  PlusCircle,
  CloudUpload,
  BookOpen,
  UserPlus,
  Link2,
  ChevronRight,
} from 'lucide-react';

interface QuickActionsProps {
  onAddQuestionClick?: () => void;
}

export default function QuickActions({ onAddQuestionClick }: QuickActionsProps) {
  const actions = [
    {
      title: 'Add Question',
      subtitle: 'Upload single question',
      icon: PlusCircle,
      href: '/admin/dashboard/questions/add',
      color: '#EA580C',
      bgColor: '#FFF7ED',
      borderColor: 'hover:border-orange-200',
    },
    {
      title: 'Bulk Upload',
      subtitle: 'Upload multiple questions',
      icon: CloudUpload,
      href: '/admin/dashboard/questions/bulk',
      color: '#0284C7',
      bgColor: '#F0F9FF',
      borderColor: 'hover:border-sky-200',
    },
    {
      title: 'Add Chapter',
      subtitle: 'Create new chapter',
      icon: BookOpen,
      href: '/admin/dashboard/chapters',
      color: '#7C3AED',
      bgColor: '#F5F3FF',
      borderColor: 'hover:border-purple-200',
    },
    {
      title: 'Add Student',
      subtitle: 'Create student account',
      icon: UserPlus,
      href: '/admin/dashboard/students',
      color: '#059669',
      bgColor: '#ECFDF5',
      borderColor: 'hover:border-emerald-200',
    },
    {
      title: 'Link Parent',
      subtitle: 'Connect parent with student',
      icon: Link2,
      href: '/admin/dashboard/parents',
      color: '#DB2777',
      bgColor: '#FDF2F8',
      borderColor: 'hover:border-pink-200',
    },
  ];

  return (
    <div className="p-6 rounded-2xl neu-card flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center gap-2.5 mb-4">
        <div className="p-2 rounded-xl bg-orange-50 text-orange-600">
          <Zap className="w-5 h-5 fill-orange-500 text-orange-500" />
        </div>
        <h3 className="font-bold text-slate-800 text-base">Quick Actions</h3>
      </div>

      {/* Action items list */}
      <div className="space-y-2.5">
        {actions.map((act) => {
          const Icon = act.icon;
          return (
            <Link
              key={act.title}
              href={act.href}
              className={`flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-100 hover:shadow-md transition-all group ${act.borderColor}`}
            >
              <div className="flex items-center gap-3">
                <div
                  className="flex items-center justify-center w-9 h-9 rounded-xl shadow-xs"
                  style={{ backgroundColor: act.bgColor }}
                >
                  <Icon className="w-4 h-4" style={{ color: act.color }} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800 group-hover:text-orange-600 transition-colors">
                    {act.title}
                  </h4>
                  <p className="text-[11px] text-slate-400">{act.subtitle}</p>
                </div>
              </div>

              <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-orange-500 group-hover:translate-x-0.5 transition-all" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}

