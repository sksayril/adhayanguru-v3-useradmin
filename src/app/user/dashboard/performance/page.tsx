'use client';

import React from 'react';
import Link from 'next/link';
import { BarChart3, ChevronRight, TrendingUp, Target, Award, Flame } from 'lucide-react';

export default function UserPerformancePage() {
  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-1">
          <Link href="/user/dashboard" className="hover:text-purple-600 transition-colors">
            Dashboard
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-purple-600 font-bold">My Performance</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Performance Analytics
        </h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Subject-wise strength breakdown and exam readiness score.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="p-6 rounded-2xl neu-card space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400">
            <span>Overall Accuracy</span>
            <Target className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-3xl font-black text-slate-900">82%</div>
          <p className="text-xs text-emerald-600 font-bold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> +6% from last week
          </p>
        </div>

        <div className="p-6 rounded-2xl neu-card space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400">
            <span>Total Questions Solved</span>
            <Award className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-3xl font-black text-slate-900">128 Qs</div>
          <p className="text-xs text-slate-400 font-medium">Out of 160 weekly target</p>
        </div>

        <div className="p-6 rounded-2xl neu-card space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400">
            <span>Current Study Streak</span>
            <Flame className="w-4 h-4 text-orange-500" />
          </div>
          <div className="text-3xl font-black text-slate-900">12 Days</div>
          <p className="text-xs text-purple-600 font-bold">Top 5% in Class 10</p>
        </div>
      </div>
    </div>
  );
}

