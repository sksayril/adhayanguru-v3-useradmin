'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  FileText,
  ImageIcon,
  Pencil,
  Trash2,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { recentQuestions as initialQuestions } from '@/lib/mockData';
import { QuestionItem } from '@/types';

export default function RecentQuestionsTable() {
  const [questions, setQuestions] = useState<QuestionItem[]>(initialQuestions);

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this question?')) {
      setQuestions(questions.filter((q) => q.id !== id));
    }
  };

  return (
    <div className="p-6 rounded-2xl neu-card flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-orange-50 text-orange-600">
            <FileText className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-800 text-base">Recent Questions</h3>
        </div>

        <Link
          href="/admin/dashboard/questions"
          className="flex items-center gap-1.5 text-xs font-bold text-orange-600 hover:text-orange-700 transition-colors group"
        >
          <span>View All</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto -mx-6 px-6">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[11px]">
              <th className="py-2.5 px-3">#</th>
              <th className="py-2.5 px-3">Question (Preview)</th>
              <th className="py-2.5 px-3">Class</th>
              <th className="py-2.5 px-3">Subject</th>
              <th className="py-2.5 px-3">Chapter</th>
              <th className="py-2.5 px-3">Type</th>
              <th className="py-2.5 px-3">Status</th>
              <th className="py-2.5 px-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100/80">
            {questions.map((item) => (
              <tr
                key={item.id}
                className="hover:bg-slate-50/70 transition-colors group text-slate-700 font-medium"
              >
                {/* Index */}
                <td className="py-3 px-3 font-semibold text-slate-400">{item.id}</td>

                {/* Preview with image icon */}
                <td className="py-3 px-3 max-w-xs">
                  <div className="flex items-center gap-2.5">
                    {item.hasImage && (
                      <span className="p-1 rounded-md bg-amber-50 text-amber-600 border border-amber-200/60 shrink-0">
                        <ImageIcon className="w-3.5 h-3.5" />
                      </span>
                    )}
                    <span className="font-semibold text-slate-800 truncate" title={item.preview}>
                      {item.preview}
                    </span>
                  </div>
                </td>

                {/* Class */}
                <td className="py-3 px-3 text-slate-600">{item.classNum}</td>

                {/* Subject */}
                <td className="py-3 px-3 text-slate-600">{item.subject}</td>

                {/* Chapter */}
                <td className="py-3 px-3 text-slate-600">{item.chapter}</td>

                {/* Type */}
                <td className="py-3 px-3">
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[11px] font-semibold">
                    {item.type}
                  </span>
                </td>

                {/* Status Badge */}
                <td className="py-3 px-3">
                  {item.status === 'Published' ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200/60">
                      Published
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-600 border border-amber-200/60">
                      Draft
                    </span>
                  )}
                </td>

                {/* Action Buttons */}
                <td className="py-3 px-3">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      type="button"
                      aria-label="Edit question"
                      suppressHydrationWarning
                      className="p-1.5 rounded-lg text-amber-600 hover:bg-amber-50 transition-colors"
                      title="Edit Question"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(item.id)}
                      aria-label="Delete question"
                      suppressHydrationWarning
                      className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors"
                      title="Delete Question"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

