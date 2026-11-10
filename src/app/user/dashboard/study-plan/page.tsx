'use client';

import React from 'react';
import Link from 'next/link';
import { Calendar, ChevronRight, CheckCircle2, Clock } from 'lucide-react';

export default function UserStudyPlanPage() {
  const schedule = [
    { day: 'Today (Tuesday)', tasks: ['Mathematics – Trigonometry Practice (20 Qs) [Done]', 'Physics – Electricity Revision Notes (30 mins)', 'Chemistry – Acids & Bases Practice (15 Qs)'] },
    { day: 'Tomorrow (Wednesday)', tasks: ['Biology – Cell Division Notes & Diagram Practice', 'Mathematics – Solve Previous Year 2024 Paper', 'English – Grammar & Composition Practice'] },
    { day: 'Thursday', tasks: ['Full Revision Session – Physical Science', 'Mathematics Mock Test 1 (30 Qs)'] },
  ];

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-1">
          <Link href="/user/dashboard" className="hover:text-purple-600 transition-colors">
            Dashboard
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-purple-600 font-bold">Study Plan</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Personalized Study Timetable
        </h1>
        <p className="text-sm text-slate-500 mt-0.5">
          AI-generated revision schedule tailored to your weak areas.
        </p>
      </div>

      <div className="space-y-4">
        {schedule.map((s, idx) => (
          <div key={idx} className="p-6 rounded-2xl neu-card space-y-3">
            <h3 className="text-sm font-extrabold text-purple-700 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{s.day}</span>
            </h3>
            <ul className="space-y-2 text-xs font-semibold text-slate-700">
              {s.tasks.map((task, tIdx) => (
                <li key={tIdx} className="flex items-center gap-2.5 p-2 rounded-lg bg-slate-50">
                  <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
                  <span>{task}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

