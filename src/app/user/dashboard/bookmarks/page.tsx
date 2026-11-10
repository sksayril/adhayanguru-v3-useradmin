'use client';

import React from 'react';
import Link from 'next/link';
import { Bookmark, ChevronRight, FileText, ArrowRight } from 'lucide-react';

export default function UserBookmarksPage() {
  const bookmarks = [
    { title: 'Important Trigonometric Identities Cheat Sheet', subject: 'Mathematics', savedOn: '3 days ago' },
    { title: 'Ohm\'s Law & Kirchhoff\'s Voltage Law Notes', subject: 'Physical Science', savedOn: '5 days ago' },
    { title: 'Chemical Equations: Balancing Trick & Redox Rules', subject: 'Chemistry', savedOn: '1 week ago' },
  ];

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-1">
          <Link href="/user/dashboard" className="hover:text-purple-600 transition-colors">
            Dashboard
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-purple-600 font-bold">Bookmarks</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Saved Questions & Revision Notes
        </h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Access your starred formulas, difficult questions, and exam tips.
        </p>
      </div>

      <div className="space-y-3">
        {bookmarks.map((b, idx) => (
          <div key={idx} className="p-4 rounded-2xl neu-card neu-card-hover flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800">{b.title}</h4>
                <p className="text-[11px] text-slate-400">{b.subject} • Saved {b.savedOn}</p>
              </div>
            </div>
            <button
              type="button"
              suppressHydrationWarning
              className="text-xs font-bold text-purple-600 hover:text-purple-700 hover:underline"
            >
              Open Note →
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

