'use client';

import React from 'react';
import Link from 'next/link';
import { FileQuestion, Plus, CloudUpload, ChevronRight } from 'lucide-react';
import RecentQuestionsTable from '@/components/admin/RecentQuestionsTable';

export default function QuestionsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-1">
            <Link href="/admin/dashboard" className="hover:text-orange-500 transition-colors">
              Dashboard
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-orange-600 font-bold">Questions</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight">
            Question Bank
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            48,560 curated MCQs, descriptive, and theoretical questions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/dashboard/questions/bulk"
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white neu-button text-slate-700 font-bold text-xs"
          >
            <CloudUpload className="w-4 h-4 text-sky-500" />
            <span>Bulk Upload</span>
          </Link>

          <Link
            href="/admin/dashboard/questions/add"
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl neu-orange-button text-white font-bold text-sm shadow-md"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Add Single Question</span>
          </Link>
        </div>
      </div>

      <RecentQuestionsTable />
    </div>
  );
}

