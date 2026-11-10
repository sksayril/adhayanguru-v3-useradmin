'use client';

import React from 'react';
import Link from 'next/link';
import { BarChart3, Download, ChevronRight, TrendingUp } from 'lucide-react';
import UserGrowthChart from '@/components/admin/UserGrowthChart';
import SubjectDistributionChart from '@/components/admin/SubjectDistributionChart';

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-1">
            <Link href="/admin/dashboard" className="hover:text-orange-500 transition-colors">
              Dashboard
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-orange-600 font-bold">Reports</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight">
            Analytics & Reports
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Real-time enrollment trends, exam completion metrics, and subject performance.
          </p>
        </div>

        <button
          type="button"
          suppressHydrationWarning
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl neu-button text-slate-700 font-bold text-xs"
        >
          <Download className="w-4 h-4 text-orange-500" />
          <span>Export Analytics PDF</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <UserGrowthChart />
        <SubjectDistributionChart />
      </div>
    </div>
  );
}

