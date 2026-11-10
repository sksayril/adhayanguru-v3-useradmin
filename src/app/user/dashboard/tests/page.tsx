'use client';

import React from 'react';
import Link from 'next/link';
import { FileCheck, ChevronRight, Clock, Award, Play } from 'lucide-react';

export default function UserTestsPage() {
  const tests = [
    { title: 'Mathematics – Full Trigonometry Mock Test', qs: 30, duration: '45 mins', date: '12 Nov, 2026', status: 'Live Soon' },
    { title: 'Physical Science – Electricity & Optics Unit Test', qs: 25, duration: '40 mins', date: '14 Nov, 2026', status: 'Live Soon' },
    { title: 'Chemistry – Acids, Bases and Salts Chapter Test', qs: 20, duration: '30 mins', date: '18 Nov, 2026', status: 'Scheduled' },
    { title: 'Madhyamik 2025 Model Question Paper Review', qs: 50, duration: '90 mins', date: 'Available Now', status: 'Practice Test' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-1">
          <Link href="/user/dashboard" className="hover:text-purple-600 transition-colors">
            Dashboard
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-purple-600 font-bold">Tests</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Mock Tests & Assessments
        </h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Real exam simulation with timer, negative marking, and rank percentile.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {tests.map((t, idx) => (
          <div key={idx} className="p-6 rounded-2xl neu-card neu-card-hover flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-600 border border-purple-200">
                {t.status}
              </span>
              <h3 className="text-base font-bold text-slate-800">{t.title}</h3>
              <div className="flex items-center gap-4 text-xs text-slate-400 font-medium pt-1">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  {t.duration}
                </span>
                <span>•</span>
                <span>{t.qs} Questions</span>
                <span>•</span>
                <span>{t.date}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">Board Standard Format</span>
              <button
                type="button"
                suppressHydrationWarning
                onClick={() => alert(`Starting exam: ${t.title}`)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-sm transition-colors cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Start Mock Test</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

