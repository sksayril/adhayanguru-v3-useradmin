'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { PlusCircle, ChevronRight, Upload, ArrowLeft } from 'lucide-react';

export default function AddQuestionPage() {
  const [questionType, setQuestionType] = useState('MCQ');

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <Link
          href="/admin/dashboard/questions"
          className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-orange-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Questions</span>
        </Link>
      </div>

      <div className="p-6 md:p-8 rounded-3xl neu-card space-y-6">
        <div>
          <h2 className="text-xl font-extrabold text-slate-800">Create New Question</h2>
          <p className="text-xs text-slate-400 mt-1">
            Specify standard, subject, chapter, and question options or descriptive answer.
          </p>
        </div>

        <form className="space-y-5 text-xs font-semibold text-slate-700">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label>Educational Board *</label>
              <select className="w-full px-3.5 py-2.5 bg-[#EFF2F8] neu-inset rounded-xl text-slate-700">
                <option>CBSE</option>
                <option>ICSE</option>
                <option>WBCHSE</option>
                <option>CAIE</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label>Class Standard *</label>
              <select className="w-full px-3.5 py-2.5 bg-[#EFF2F8] neu-inset rounded-xl text-slate-700">
                <option>Class 10</option>
                <option>Class 12</option>
                <option>Class 9</option>
                <option>Class 11</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label>Subject *</label>
              <select className="w-full px-3.5 py-2.5 bg-[#EFF2F8] neu-inset rounded-xl text-slate-700">
                <option>Mathematics</option>
                <option>Science</option>
                <option>English</option>
                <option>Social Science</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label>Question Type</label>
            <div className="flex items-center gap-3">
              {['MCQ', 'Descriptive', 'Theory', 'Short'].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setQuestionType(t)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    questionType === t
                      ? 'bg-orange-500 text-white shadow-md shadow-orange-500/25'
                      : 'bg-[#EFF2F8] neu-inset text-slate-600'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label>Question Content (LaTeX & Markdown supported) *</label>
            <textarea
              rows={4}
              placeholder="e.g. If sin θ = 3/5, calculate the value of cos θ and tan θ."
              className="w-full px-4 py-3 bg-[#EFF2F8] neu-inset rounded-2xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-400/50"
            />
          </div>

          {/* Option upload image */}
          <div className="p-4 rounded-2xl border-2 border-dashed border-slate-200 text-center space-y-1.5">
            <Upload className="w-5 h-5 mx-auto text-slate-400" />
            <p className="text-slate-500 font-medium">Drag & drop question diagram or image</p>
            <p className="text-[10px] text-slate-400">PNG, JPG up to 5MB</p>
          </div>

          <div className="flex justify-end gap-3 pt-3">
            <Link
              href="/admin/dashboard/questions"
              className="px-5 py-2.5 rounded-xl text-slate-500 hover:text-slate-700 font-bold"
            >
              Cancel
            </Link>
            <button
              type="button"
              className="px-6 py-2.5 rounded-xl neu-orange-button text-white font-bold shadow-md"
            >
              Save & Publish Question
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

