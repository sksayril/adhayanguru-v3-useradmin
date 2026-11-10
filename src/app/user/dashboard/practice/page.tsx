'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { PenTool, ChevronRight, CheckCircle2, XCircle, ArrowRight, Sparkles } from 'lucide-react';

export default function UserPracticePage() {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const question = {
    id: 1,
    subject: 'Mathematics',
    chapter: 'Trigonometry',
    text: 'If sin θ = 3/5 and θ is acute, find the value of (cos θ + tan θ).',
    options: ['4/5 + 3/4 = 31/20', '3/5 + 4/3 = 29/15', '4/5 + 4/3 = 32/15', '3/4 + 5/4 = 2'],
    correct: 0,
    explanation: 'Since sin θ = 3/5, the perpendicular = 3 and hypotenuse = 5. By Pythagoras theorem, base = 4. Therefore, cos θ = 4/5 and tan θ = 3/4. Sum = 4/5 + 3/4 = (16 + 15)/20 = 31/20.',
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-1">
          <Link href="/user/dashboard" className="hover:text-purple-600 transition-colors">
            Dashboard
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-purple-600 font-bold">Practice</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Daily Adaptive Practice
        </h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Curated practice questions with instant AI step-by-step explanations.
        </p>
      </div>

      <div className="p-6 sm:p-8 rounded-3xl neu-card space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-600 border border-purple-200">
            {question.subject} • {question.chapter}
          </span>
          <span className="text-xs font-bold text-slate-400">Question 1 of 20</span>
        </div>

        <div className="text-base font-bold text-slate-800 leading-relaxed">
          {question.text}
        </div>

        <div className="space-y-3">
          {question.options.map((opt, i) => (
            <button
              key={i}
              type="button"
              suppressHydrationWarning
              onClick={() => {
                if (!submitted) setSelectedOption(i);
              }}
              className={`w-full p-4 rounded-2xl text-left text-xs font-bold flex items-center justify-between border transition-all cursor-pointer ${
                submitted && i === question.correct
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                  : submitted && selectedOption === i && i !== question.correct
                  ? 'bg-rose-50 border-rose-300 text-rose-800'
                  : selectedOption === i
                  ? 'bg-purple-50 border-purple-400 text-purple-900 shadow-sm'
                  : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-xs font-bold">
                  {String.fromCharCode(65 + i)}
                </span>
                <span>{opt}</span>
              </div>
              {submitted && i === question.correct && (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              )}
            </button>
          ))}
        </div>

        {submitted ? (
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 animate-in fade-in">
            <div className="flex items-center gap-2 text-xs font-bold text-purple-700">
              <Sparkles className="w-4 h-4" />
              <span>Step-by-Step Solution:</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">{question.explanation}</p>
            <div className="pt-2 text-right">
              <button
                type="button"
                suppressHydrationWarning
                onClick={() => {
                  setSelectedOption(null);
                  setSubmitted(false);
                }}
                className="px-4 py-2 rounded-xl bg-purple-600 text-white font-bold text-xs"
              >
                Next Question →
              </button>
            </div>
          </div>
        ) : (
          <div className="flex justify-end pt-2">
            <button
              type="button"
              disabled={selectedOption === null}
              onClick={() => setSubmitted(true)}
              suppressHydrationWarning
              className="px-6 py-2.5 rounded-xl bg-purple-600 disabled:opacity-50 hover:bg-purple-500 text-white font-bold text-xs shadow-md transition-colors cursor-pointer"
            >
              Submit Answer
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

