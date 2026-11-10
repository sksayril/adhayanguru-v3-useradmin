'use client';

import React from 'react';
import Link from 'next/link';
import { Settings, Crown, ChevronRight, Shield, Bell, Database } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-1">
          <Link href="/admin/dashboard" className="hover:text-orange-500 transition-colors">
            Dashboard
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-orange-600 font-bold">Settings</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight">
          System & Account Settings
        </h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Manage system configurations, subscription plans, and security preferences.
        </p>
      </div>

      {/* Pro Plan Card */}
      <div className="p-6 rounded-3xl neu-card bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 text-white relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-orange-500 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-orange-500/30">
              <Crown className="w-6 h-6 fill-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">Dekh Education Pro Plan</h3>
                <span className="px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 text-xs font-bold border border-orange-500/30">
                  Active
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                License valid through: <span className="text-white font-semibold">31 Dec 2026</span>
              </p>
            </div>
          </div>

          <button
            type="button"
            suppressHydrationWarning
            className="px-5 py-2.5 rounded-xl neu-orange-button text-white text-xs font-bold shrink-0"
          >
            Renew / Upgrade Plan
          </button>
        </div>
      </div>

      {/* Settings Options */}
      <div className="p-6 rounded-3xl neu-card space-y-5">
        <h3 className="text-base font-bold text-slate-800">General Platform Settings</h3>

        <div className="space-y-4 text-xs font-medium text-slate-700">
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#EFF2F8] neu-inset">
            <div>
              <p className="font-bold text-slate-800">Automatic Question Moderation</p>
              <p className="text-slate-400 text-[11px]">Run automated grammar and syllabus check before questions go live.</p>
            </div>
            <input type="checkbox" defaultChecked suppressHydrationWarning className="w-4 h-4 text-orange-600 rounded" />
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#EFF2F8] neu-inset">
            <div>
              <p className="font-bold text-slate-800">Email Notifications to Parents</p>
              <p className="text-slate-400 text-[11px]">Send weekly progress summaries and attendance digests to parents.</p>
            </div>
            <input type="checkbox" defaultChecked suppressHydrationWarning className="w-4 h-4 text-orange-600 rounded" />
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#EFF2F8] neu-inset">
            <div>
              <p className="font-bold text-slate-800">Two-Factor Authentication (2FA)</p>
              <p className="text-slate-400 text-[11px]">Enforce OTP login for all administrative user accounts.</p>
            </div>
            <input type="checkbox" defaultChecked suppressHydrationWarning className="w-4 h-4 text-orange-600 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}

