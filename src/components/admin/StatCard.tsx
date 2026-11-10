'use client';

import React from 'react';
import { StatItem } from '@/types';
import {
  Users,
  UserCheck,
  Layers,
  GraduationCap,
  BookOpen,
  FileQuestion,
  TrendingUp,
} from 'lucide-react';

interface StatCardProps {
  stat: StatItem;
}

export default function StatCard({ stat }: StatCardProps) {
  const getIcon = () => {
    switch (stat.iconName) {
      case 'students':
        return <Users className="w-5 h-5" style={{ color: stat.iconColor }} />;
      case 'parents':
        return <UserCheck className="w-5 h-5" style={{ color: stat.iconColor }} />;
      case 'boards':
        return <Layers className="w-5 h-5" style={{ color: stat.iconColor }} />;
      case 'classes':
        return <GraduationCap className="w-5 h-5" style={{ color: stat.iconColor }} />;
      case 'subjects':
        return <BookOpen className="w-5 h-5" style={{ color: stat.iconColor }} />;
      case 'questions':
        return <FileQuestion className="w-5 h-5" style={{ color: stat.iconColor }} />;
      default:
        return <Users className="w-5 h-5" style={{ color: stat.iconColor }} />;
    }
  };

  return (
    <div className="p-5 rounded-2xl neu-card neu-card-hover flex flex-col justify-between relative group">
      {/* Top Header: Icon & optional growth badge */}
      <div className="flex items-center justify-between mb-3">
        {/* Soft pastel neumorphic icon container */}
        <div
          className="flex items-center justify-center w-11 h-11 rounded-xl shadow-sm border border-black/5"
          style={{ backgroundColor: stat.bgColor }}
        >
          {getIcon()}
        </div>

        {stat.change && (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-600 border border-emerald-100/80">
            <TrendingUp className="w-3 h-3" />
            {stat.change}
          </span>
        )}
      </div>

      {/* Main Stat Value & Label */}
      <div>
        <div className="text-2xl font-black text-slate-800 tracking-tight">
          {stat.value}
        </div>
        <p className="text-xs font-medium text-slate-400 mt-0.5">
          {stat.title}
        </p>
      </div>
    </div>
  );
}

