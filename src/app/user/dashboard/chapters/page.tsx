'use client';

import React from 'react';
import Link from 'next/link';
import { LayoutGrid, ChevronRight, CheckCircle2, PlayCircle, FileText } from 'lucide-react';

export default function UserChaptersPage() {
  const chapters = [
    { title: 'Trigonometric Ratios & Standard Angles', subject: 'Mathematics', qs: 45, status: 'Mastered', progress: '100%' },
    { title: 'Quadratic Equations with One Variable', subject: 'Mathematics', qs: 38, status: 'In Progress', progress: '85%' },
    { title: 'Current Electricity & Ohm\'s Law', subject: 'Physical Science', qs: 40, status: 'In Progress', progress: '75%' },
    { title: 'Chemical Reactions & Stoichiometry', subject: 'Chemistry', qs: 32, status: 'In Progress', progress: '60%' },
    { title: 'Cell Division: Mitosis & Meiosis', subject: 'Life Science', qs: 30, status: 'Mastered', progress: '100%' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-1">
          <Link href="/user/dashboard" className="hover:text-purple-600 transition-colors">
            Dashboard
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-purple-600 font-bold">Chapters</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Class 10 Syllabus Chapters
        </h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Step-by-step topic breakdown, interactive quizzes, and revision notes.
        </p>
      </div>

      <div className="p-6 rounded-2xl neu-card overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[11px]">
              <th className="py-3 px-3">Chapter Name</th>
              <th className="py-3 px-3">Subject</th>
              <th className="py-3 px-3">Practice Qs</th>
              <th className="py-3 px-3">Mastery Status</th>
              <th className="py-3 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
            {chapters.map((ch, idx) => (
              <tr key={idx} className="hover:bg-slate-50 transition-colors">
                <td className="py-3.5 px-3 font-bold text-slate-800">{ch.title}</td>
                <td className="py-3.5 px-3 text-slate-500">{ch.subject}</td>
                <td className="py-3.5 px-3 font-semibold text-purple-600">{ch.qs} Questions</td>
                <td className="py-3.5 px-3">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                      ch.status === 'Mastered'
                        ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                        : 'bg-purple-50 text-purple-600 border border-purple-200'
                    }`}
                  >
                    {ch.status === 'Mastered' && <CheckCircle2 className="w-3 h-3" />}
                    {ch.status} ({ch.progress})
                  </span>
                </td>
                <td className="py-3.5 px-3 text-right">
                  <Link
                    href="/user/dashboard/practice"
                    className="font-bold text-purple-600 hover:text-purple-700 hover:underline"
                  >
                    Start Practice →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

