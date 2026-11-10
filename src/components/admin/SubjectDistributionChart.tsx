'use client';

import React from 'react';
import { PieChart } from 'lucide-react';
import { subjectDistributions } from '@/lib/mockData';

export default function SubjectDistributionChart() {
  const total = subjectDistributions.reduce((acc, curr) => acc + curr.percentage, 0);

  // SVG Donut calculation
  const size = 160;
  const strokeWidth = 26;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let accumulatedPercent = 0;

  return (
    <div className="p-6 rounded-2xl neu-card flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center gap-2.5 mb-4">
        <div className="p-2 rounded-xl bg-orange-50 text-orange-600">
          <PieChart className="w-5 h-5" />
        </div>
        <h3 className="font-bold text-slate-800 text-base">Subject Distribution</h3>
      </div>

      {/* Chart & Legend Row */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-5 my-auto">
        {/* SVG Donut */}
        <div className="relative flex items-center justify-center shrink-0">
          <svg width={size} height={size} className="transform -rotate-90 select-none">
            {subjectDistributions.map((item) => {
              const strokeDasharray = `${(item.percentage / total) * circumference} ${circumference}`;
              const strokeDashoffset = -((accumulatedPercent / total) * circumference);
              accumulatedPercent += item.percentage;

              return (
                <circle
                  key={item.subject}
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  fill="transparent"
                  stroke={item.color}
                  strokeWidth={strokeWidth}
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-500 hover:opacity-85"
                />
              );
            })}
          </svg>

          {/* Center Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
            <span className="text-xl font-black text-slate-800 leading-tight">
              48,560
            </span>
            <span className="text-[11px] font-semibold text-slate-400">
              Questions
            </span>
          </div>
        </div>

        {/* Legend List */}
        <div className="flex-1 w-full space-y-2">
          {subjectDistributions.map((item) => (
            <div
              key={item.subject}
              className="flex items-center justify-between text-xs font-medium text-slate-600"
            >
              <div className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-sm shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="truncate max-w-[95px]">{item.subject}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-bold text-slate-700">{item.percentage}%</span>
                <span className="text-slate-400 text-[11px] min-w-[42px] text-right">
                  {item.count.toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

