'use client';

import React from 'react';
import { Target, FileText, BookOpen, Layers } from 'lucide-react';
import { platformProgressData } from '@/lib/mockData';

export default function PlatformProgress() {
  const getIcon = (label: string) => {
    switch (label) {
      case 'Questions':
        return <FileText className="w-4 h-4 text-orange-500" />;
      case 'Subjects':
        return <BookOpen className="w-4 h-4 text-sky-500" />;
      case 'Chapters':
        return <Layers className="w-4 h-4 text-purple-500" />;
      default:
        return <Target className="w-4 h-4 text-orange-500" />;
    }
  };

  return (
    <div className="p-6 rounded-2xl neu-card flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center gap-2.5 mb-4">
        <div className="p-2 rounded-xl bg-orange-50 text-orange-600">
          <Target className="w-5 h-5" />
        </div>
        <h3 className="font-bold text-slate-800 text-base">Platform Progress</h3>
      </div>

      {/* Progress Bars List */}
      <div className="space-y-4 my-auto">
        {platformProgressData.map((item) => (
          <div key={item.label} className="space-y-1.5">
            {/* Top row: Icon, label, current/total, percentage */}
            <div className="flex items-center justify-between text-xs font-semibold">
              <div className="flex items-center gap-2">
                <span className="p-1 rounded-md bg-slate-50 border border-slate-100">
                  {getIcon(item.label)}
                </span>
                <span className="text-slate-700 font-bold">{item.label}</span>
                <span className="text-[11px] font-medium text-slate-400">
                  {item.current.toLocaleString()} / {item.total.toLocaleString()}
                </span>
              </div>
              <span className="font-extrabold text-slate-800 text-sm">
                {item.percentage}%
              </span>
            </div>

            {/* Sunken Neumorphic Progress Track */}
            <div className="h-3 w-full bg-[#EBF0F7] neu-inset rounded-full overflow-hidden p-0.5">
              <div
                className="h-full rounded-full transition-all duration-700 ease-out"
                style={{
                  width: `${item.percentage}%`,
                  backgroundColor: item.barColor,
                  boxShadow: `0 0 10px ${item.glowColor}`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

