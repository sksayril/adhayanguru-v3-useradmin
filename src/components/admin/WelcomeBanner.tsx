'use client';

import React, { useState } from 'react';
import { Calendar, ChevronDown, Sparkles } from 'lucide-react';

export default function WelcomeBanner() {
  const [selectedRange, setSelectedRange] = useState('Last 30 Days');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const ranges = ['Today', 'Last 7 Days', 'Last 30 Days', 'This Quarter', 'This Year'];

  return (
    <div className="relative flex flex-col md:flex-row md:items-center justify-between pb-6 pt-2">
      {/* Welcome text */}
      <div className="z-10 max-w-xl">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight flex items-center gap-2">
          <span>Welcome Back,</span>
          <span className="text-[#FF6500]">Sayril!</span>
          <span className="inline-block animate-bounce">👋</span>
        </h1>
        <p className="mt-1 text-sm sm:text-base text-slate-500 font-medium">
          Here&apos;s what&apos;s happening in your education platform today.
        </p>
      </div>

      {/* Right side: 3D Illustration & Date Filter */}
      <div className="flex items-center gap-6 mt-4 md:mt-0 z-10">
        {/* Stylized Education 3D illustration badge */}
        <div className="hidden lg:flex items-center relative -mr-4 pointer-events-none select-none">
          {/* Subtle peach ambient glow behind */}
          <div className="absolute w-48 h-32 bg-gradient-to-r from-orange-200/40 via-amber-200/30 to-transparent rounded-full blur-2xl -z-10" />

          {/* Cute stylized illustration SVG */}
          <svg
            className="w-40 h-24 drop-shadow-lg"
            viewBox="0 0 200 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Table / Base Shadow */}
            <ellipse cx="100" cy="108" rx="85" ry="8" fill="#CBD5E1" fillOpacity="0.4" />

            {/* Blue Pencil Holder */}
            <rect x="18" y="55" width="28" height="42" rx="6" fill="#3B82F6" />
            <rect x="22" y="52" width="20" height="4" rx="2" fill="#2563EB" />
            {/* Pencils */}
            <rect x="23" y="32" width="5" height="26" rx="2.5" fill="#F97316" transform="rotate(-10 23 32)" />
            <polygon points="21,30 26,20 28,31" fill="#FEF08A" />
            <polygon points="23,20 26,20 25,16" fill="#1E293B" />

            <rect x="33" y="28" width="5" height="30" rx="2.5" fill="#10B981" transform="rotate(12 33 28)" />
            <polygon points="36,26 43,18 43,28" fill="#FEF08A" />
            <polygon points="41,18 43,18 42,14" fill="#1E293B" />

            {/* Stack of Books */}
            {/* Bottom Book (Orange) */}
            <g>
              <rect x="48" y="82" width="102" height="18" rx="4" fill="#FF7828" />
              <rect x="52" y="85" width="94" height="12" rx="2" fill="#FFFFFF" />
              <line x1="60" y1="89" x2="138" y2="89" stroke="#E2E8F0" strokeWidth="2" strokeLinecap="round" />
              <line x1="60" y1="93" x2="120" y2="93" stroke="#E2E8F0" strokeWidth="2" strokeLinecap="round" />
            </g>

            {/* Middle Book (Yellow/Amber) */}
            <g>
              <rect x="56" y="66" width="88" height="16" rx="4" fill="#F59E0B" />
              <rect x="60" y="69" width="80" height="10" rx="2" fill="#FFFFFF" />
              <line x1="66" y1="73" x2="132" y2="73" stroke="#CBD5E1" strokeWidth="1.5" strokeLinecap="round" />
            </g>

            {/* Top Book (Cyan/Sky) */}
            <g>
              <rect x="65" y="52" width="72" height="14" rx="3.5" fill="#0EA5E9" />
              <rect x="68" y="54" width="66" height="10" rx="2" fill="#F8FAFC" />
            </g>

            {/* Graduation Mortarboard Cap */}
            <g transform="translate(68, 12)">
              {/* Cap Diamond */}
              <polygon points="36,6 72,20 36,34 0,20" fill="#1E293B" />
              <polygon points="36,9 66,20 36,31 6,20" fill="#334155" />
              {/* Skull Cap Base */}
              <path d="M18,26 Q36,40 54,26 L54,34 Q36,48 18,34 Z" fill="#0F172A" />
              {/* Button & Tassel */}
              <circle cx="36" cy="20" r="3" fill="#F59E0B" />
              <path d="M36,20 Q50,26 56,38" stroke="#F59E0B" strokeWidth="2" fill="none" />
              <rect x="54" y="38" width="4" height="8" rx="2" fill="#D97706" />
            </g>
          </svg>
        </div>

        {/* Date Filter Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            suppressHydrationWarning
            className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-white neu-button text-sm font-semibold text-slate-700 hover:text-orange-600 transition-colors"
          >
            <Calendar className="w-4 h-4 text-orange-500" />
            <span>{selectedRange}</span>
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-44 rounded-2xl bg-white neu-card p-1.5 shadow-xl z-30 animate-in fade-in zoom-in-95 duration-150">
              {ranges.map((range) => (
                <button
                  key={range}
                  type="button"
                  suppressHydrationWarning
                  onClick={() => {
                    setSelectedRange(range);
                    setDropdownOpen(false);
                  }}
                  className={`flex items-center justify-between w-full px-3 py-2 rounded-xl text-xs font-medium text-left transition-colors ${
                    selectedRange === range
                      ? 'bg-orange-50 text-orange-600 font-bold'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span>{range}</span>
                  {selectedRange === range && <Sparkles className="w-3.5 h-3.5 text-orange-500" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
