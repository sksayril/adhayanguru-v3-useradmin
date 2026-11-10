'use client';

import React from 'react';
import Link from 'next/link';
import { BookOpen, ChevronRight, ArrowRight, Calculator, Atom, FlaskConical, Sprout, Book } from 'lucide-react';

export default function UserSubjectsPage() {
  const subjects = [
    { title: 'Mathematics', chapters: '8 / 10 Chapters', progress: 80, color: 'text-purple-600', bg: 'bg-purple-100', icon: Calculator },
    { title: 'Physical Science (Physics)', chapters: '6 / 8 Chapters', progress: 75, color: 'text-sky-600', bg: 'bg-sky-100', icon: Atom },
    { title: 'Chemistry', chapters: '5 / 8 Chapters', progress: 62, color: 'text-rose-600', bg: 'bg-rose-100', icon: FlaskConical },
    { title: 'Life Science (Biology)', chapters: '7 / 9 Chapters', progress: 78, color: 'text-emerald-600', bg: 'bg-emerald-100', icon: Sprout },
    { title: 'English Language & Lit', chapters: '6 / 7 Chapters', progress: 86, color: 'text-amber-600', bg: 'bg-amber-100', icon: Book },
  ];

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-1">
          <Link href="/user/dashboard" className="hover:text-purple-600 transition-colors">
            Dashboard
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-purple-600 font-bold">Subjects</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Enrolled Subjects
        </h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Choose a subject to practice questions, watch video solutions, and take mock tests.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {subjects.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.title} className="p-6 rounded-2xl neu-card neu-card-hover flex flex-col justify-between space-y-4">
              <div className="flex items-center justify-between">
                <div className={`w-11 h-11 rounded-xl ${s.bg} ${s.color} flex items-center justify-center`}>
                  <Icon className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-full">
                  {s.progress}% Finished
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-800">{s.title}</h3>
                <p className="text-xs text-slate-400 mt-0.5">{s.chapters} Completed</p>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-600 rounded-full" style={{ width: `${s.progress}%` }} />
                </div>
                <Link
                  href="/user/dashboard/chapters"
                  className="mt-2 flex items-center justify-between text-xs font-bold text-purple-600 hover:text-purple-700 pt-1"
                >
                  <span>Open Chapters & Notes</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

