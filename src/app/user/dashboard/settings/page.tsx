'use client';

import React from 'react';
import Link from 'next/link';
import { Settings, ChevronRight, User, Bell, Shield, Crown } from 'lucide-react';

export default function UserSettingsPage() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-1">
          <Link href="/user/dashboard" className="hover:text-purple-600 transition-colors">
            Dashboard
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-purple-600 font-bold">Settings</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Student Profile & Preferences
        </h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Manage your enrolled board, standard, notifications, and security.
        </p>
      </div>

      {/* Subscription Card */}
      <div className="p-6 rounded-3xl neu-card bg-gradient-to-r from-purple-950 via-slate-900 to-slate-950 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-orange-500 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-orange-500/30">
            <Crown className="w-6 h-6 fill-slate-950" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Dekh Education Free Student Plan</h3>
            <p className="text-xs text-purple-200/80">Enrolled in Class 10 (WBBSE Madhyamik Standard)</p>
          </div>
        </div>
        <button
          type="button"
          suppressHydrationWarning
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white font-bold text-xs shadow-md shrink-0 cursor-pointer"
        >
          Upgrade to Premium
        </button>
      </div>

      <div className="p-6 rounded-3xl neu-card space-y-4">
        <h3 className="text-sm font-bold text-slate-800">Study Notifications</h3>
        <div className="space-y-3 text-xs font-semibold text-slate-700">
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
            <span>Daily Practice Reminders (4:00 PM)</span>
            <input type="checkbox" defaultChecked suppressHydrationWarning className="w-4 h-4 text-purple-600 rounded" />
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
            <span>Weekly Parent Performance Digest</span>
            <input type="checkbox" defaultChecked suppressHydrationWarning className="w-4 h-4 text-purple-600 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}

