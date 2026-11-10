'use client';

import React from 'react';
import Link from 'next/link';
import { Layers, ChevronRight, BookOpen, Clock, ArrowRight } from 'lucide-react';

export default function UserClassesPage() {
  const classes = [
    { title: 'Mathematics: Class 10 (Secondary)', board: 'WBBSE / Madhyamik', teacher: 'Dr. Debabrata Roy', schedule: 'Mon, Wed, Fri • 4:00 PM', progress: 80 },
    { title: 'Physical Science: Electricity & Optics', board: 'WBBSE / Madhyamik', teacher: 'Prof. Subhash Sen', schedule: 'Tue, Thu • 5:30 PM', progress: 75 },
    { title: 'Life Science & Environment', board: 'WBBSE / Madhyamik', teacher: 'Dr. Priyanka Mukherjee', schedule: 'Sat • 10:00 AM', progress: 78 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-1">
          <Link href="/user/dashboard" className="hover:text-purple-600 transition-colors">
            Dashboard
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-purple-600 font-bold">My Classes</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          My Enrolled Classes
        </h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Live masterclasses, timetable, and revision batches for Class 10.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {classes.map((c) => (
          <div key={c.title} className="p-5 rounded-2xl neu-card neu-card-hover flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-600 border border-purple-100">
                {c.board}
              </span>
              <h3 className="text-base font-bold text-slate-800 leading-snug">{c.title}</h3>
              <p className="text-xs text-slate-400 font-medium">Mentor: {c.teacher}</p>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium pt-1">
                <Clock className="w-3.5 h-3.5 text-purple-500" />
                <span>{c.schedule}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 space-y-2">
              <div className="flex justify-between text-xs font-bold text-slate-600">
                <span>Course Completion</span>
                <span className="text-purple-600">{c.progress}%</span>
              </div>
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-purple-600 rounded-full" style={{ width: `${c.progress}%` }} />
              </div>
              <button
                type="button"
                suppressHydrationWarning
                className="w-full mt-2 py-2 rounded-xl bg-purple-50 hover:bg-purple-600 hover:text-white text-purple-700 font-bold text-xs transition-colors"
              >
                Join Live Classroom
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

