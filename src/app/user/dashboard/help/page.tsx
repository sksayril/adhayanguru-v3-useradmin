'use client';

import React from 'react';
import Link from 'next/link';
import { Headphones, ChevronRight, MessageSquare, PhoneCall, Mail } from 'lucide-react';

export default function UserHelpPage() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-1">
          <Link href="/user/dashboard" className="hover:text-purple-600 transition-colors">
            Dashboard
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-purple-600 font-bold">Help & Support</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Student Support Center
        </h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Reach out to academic mentors or technical assistance anytime.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="p-6 rounded-2xl neu-card text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center mx-auto">
            <MessageSquare className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-800 text-sm">Ask an Academic Doubt</h3>
          <p className="text-xs text-slate-400">Get answers from teachers within 20 mins.</p>
          <button
            type="button"
            suppressHydrationWarning
            className="w-full py-2 rounded-xl bg-purple-600 text-white font-bold text-xs"
          >
            Ask Doubt
          </button>
        </div>

        <div className="p-6 rounded-2xl neu-card text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <PhoneCall className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-800 text-sm">Helpline Support</h3>
          <p className="text-xs text-slate-400">Toll-free 9:00 AM - 8:00 PM everyday.</p>
          <button
            type="button"
            suppressHydrationWarning
            className="w-full py-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs"
          >
            +91 1800 123 4567
          </button>
        </div>

        <div className="p-6 rounded-2xl neu-card text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center mx-auto">
            <Mail className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-800 text-sm">Email Support</h3>
          <p className="text-xs text-slate-400">For account or test issues.</p>
          <button
            type="button"
            suppressHydrationWarning
            className="w-full py-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs"
          >
            support@dekheducation.com
          </button>
        </div>
      </div>
    </div>
  );
}

