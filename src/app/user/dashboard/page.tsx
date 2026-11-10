'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  GraduationCap,
  BookOpen,
  FileText,
  Target,
  BarChart2,
  Calendar,
  Flame,
  Trophy,
  CheckCircle2,
  Check,
  Clock,
  PlayCircle,
  ArrowRight,
  TrendingUp,
  Calculator,
  Atom,
  FlaskConical,
  Sprout,
  Book,
} from 'lucide-react';

export default function UserDashboardPage() {
  // Study plan state
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: 'Mathematics – Trigonometry (Practice)',
      sub: '20 Questions',
      done: true,
    },
    {
      id: 2,
      title: 'Physics – Electricity (Revise Notes)',
      sub: '30 mins',
      done: false,
    },
    {
      id: 3,
      title: 'Chemistry – Acids & Bases (Practice)',
      sub: '15 Questions',
      done: false,
    },
  ]);

  const toggleTask = (id: number) => {
    setTasks(
      tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  };

  const days = [
    { name: 'Fri', done: true },
    { name: 'Sat', done: true },
    { name: 'Sun', done: true },
    { name: 'Mon', done: true },
    { name: 'Tue', done: true },
    { name: 'Wed', done: true },
    { name: 'Thu', done: false },
  ];

  return (
    <div className="space-y-6">
      {/* 1. Hero / Welcome Banner */}
      <div className="relative flex flex-col md:flex-row md:items-center justify-between pb-4 pt-1">
        <div className="z-10 max-w-xl">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight flex items-center gap-2">
            <span>Good Afternoon,</span>
            <span className="text-[#7C3AED]">Sayril!</span>
            <span className="inline-block animate-bounce">👋</span>
          </h1>
          <p className="mt-1 text-sm sm:text-base text-slate-500 font-medium">
            Keep learning, keep growing. You&apos;re doing great!
          </p>
        </div>

        {/* Right 3D Student Illustration with Purple Glow */}
        <div className="hidden lg:flex items-center relative -mr-4 pointer-events-none select-none">
          <div className="absolute w-56 h-36 bg-gradient-to-r from-purple-200/50 via-indigo-100/40 to-transparent rounded-full blur-2xl -z-10" />

          {/* Stylized Student Illustration SVG */}
          <svg
            className="w-48 h-28 drop-shadow-md"
            viewBox="0 0 240 140"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Base shadow */}
            <ellipse cx="120" cy="128" rx="95" ry="9" fill="#CBD5E1" fillOpacity="0.4" />

            {/* Stack of books on desk */}
            <rect x="25" y="100" width="46" height="10" rx="3" fill="#8B5CF6" />
            <rect x="28" y="90" width="42" height="10" rx="3" fill="#6366F1" />
            <rect x="31" y="80" width="36" height="10" rx="3" fill="#A855F7" />

            {/* Potted Plant */}
            <path d="M205,95 L225,95 L220,120 L210,120 Z" fill="#10B981" />
            <ellipse cx="215" cy="88" rx="8" ry="12" fill="#34D399" />
            <ellipse cx="205" cy="84" rx="7" ry="10" fill="#059669" transform="rotate(-20 205 84)" />
            <ellipse cx="225" cy="84" rx="7" ry="10" fill="#10B981" transform="rotate(20 225 84)" />

            {/* Student Body */}
            {/* Torso in violet hoodie */}
            <path d="M125,75 C115,75 105,85 102,110 L168,110 C165,85 155,75 145,75 Z" fill="#6D28D9" />
            {/* Hood & Neck */}
            <path d="M127,72 Q135,82 143,72 Z" fill="#5B21B6" />
            {/* Head */}
            <circle cx="135" cy="52" r="16" fill="#FDE68A" />
            {/* Hair */}
            <path d="M120,48 Q135,28 152,44 Q142,40 135,42 Q128,40 120,48 Z" fill="#1E293B" />
            {/* Face smile */}
            <circle cx="130" cy="50" r="1.5" fill="#1E293B" />
            <circle cx="138" cy="50" r="1.5" fill="#1E293B" />
            <path d="M131,56 Q134,60 137,56" stroke="#1E293B" strokeWidth="1.2" strokeLinecap="round" fill="none" />

            {/* Laptop */}
            <polygon points="75,108 120,108 115,86 85,86" fill="#334155" />
            <polygon points="87,88 113,88 110,106 82,106" fill="#64748B" />
            <rect x="70" y="108" width="55" height="4" rx="2" fill="#1E293B" />
          </svg>
        </div>
      </div>

      {/* 2. Top Stats Cards Grid (4 Cards) */}
      <section aria-label="Quick Summary">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {/* Card 1: Class */}
          <div className="p-5 rounded-2xl neu-card neu-card-hover flex items-center gap-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-purple-50 text-purple-600 shadow-xs shrink-0">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-semibold text-slate-400 block">Class</span>
              <div className="text-xl font-black text-slate-800 leading-tight">Class 10</div>
              <span className="text-xs font-bold text-purple-600">WBBSE</span>
            </div>
          </div>

          {/* Card 2: Subjects */}
          <div className="p-5 rounded-2xl neu-card neu-card-hover flex items-center gap-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 shadow-xs shrink-0">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-semibold text-slate-400 block">Subjects</span>
              <div className="text-xl font-black text-slate-800 leading-tight">5</div>
              <span className="text-xs font-medium text-slate-400">Enrolled Subjects</span>
            </div>
          </div>

          {/* Card 3: Practices */}
          <div className="p-5 rounded-2xl neu-card neu-card-hover flex items-center gap-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-amber-50 text-amber-600 shadow-xs shrink-0">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-semibold text-slate-400 block">Practices</span>
              <div className="text-xl font-black text-slate-800 leading-tight">128</div>
              <span className="text-xs font-medium text-slate-400">Questions Attempted</span>
            </div>
          </div>

          {/* Card 4: Accuracy */}
          <div className="p-5 rounded-2xl neu-card neu-card-hover flex items-center gap-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-sky-50 text-sky-600 shadow-xs shrink-0">
              <Target className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-semibold text-slate-400 block">Accuracy</span>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black text-slate-800 leading-tight">82%</span>
                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600">
                  <TrendingUp className="w-3 h-3" />
                  +6%
                </span>
              </div>
              <span className="text-xs font-medium text-slate-400">Correct Answers</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Middle Row: Overall Progress + Today's Study Plan + Study Streak */}
      <section
        aria-label="Progress and Daily Targets"
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-12 gap-5 items-stretch"
      >
        {/* Card 1: Overall Progress (4 columns) */}
        <div className="xl:col-span-4 p-6 rounded-2xl neu-card flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-purple-600" />
              <h3 className="font-bold text-slate-800 text-base">Overall Progress</h3>
            </div>
            <Link
              href="/user/dashboard/performance"
              className="text-xs font-bold text-purple-600 hover:text-purple-700 flex items-center gap-1 group"
            >
              <span>View Details</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {/* Progress Ring & Legend */}
          <div className="flex items-center justify-between gap-4 my-auto">
            {/* SVG Gauge */}
            <div className="relative flex items-center justify-center shrink-0">
              <svg width="124" height="124" className="transform -rotate-90 select-none">
                <circle
                  cx="62"
                  cy="62"
                  r="50"
                  fill="transparent"
                  stroke="#EFF2F8"
                  strokeWidth="14"
                />
                <circle
                  cx="62"
                  cy="62"
                  r="50"
                  fill="transparent"
                  stroke="#8B5CF6"
                  strokeWidth="14"
                  strokeDasharray={`${2 * Math.PI * 50}`}
                  strokeDashoffset={`${2 * Math.PI * 50 * (1 - 0.78)}`}
                  strokeLinecap="round"
                  className="transition-all duration-700"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                <span className="text-xl font-black text-slate-800">78%</span>
                <span className="text-[10px] font-semibold text-slate-400">Completed</span>
              </div>
            </div>

            {/* Metrics List */}
            <div className="space-y-2 text-xs font-semibold flex-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-slate-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-600" />
                  <span>Chapters Completed</span>
                </div>
                <span className="font-bold text-slate-800">28 / 36</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-slate-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
                  <span>Practice Questions</span>
                </div>
                <span className="font-bold text-slate-800">128 / 160</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-slate-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span>Tests Taken</span>
                </div>
                <span className="font-bold text-slate-800">6 / 10</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Today's Study Plan (5 columns) */}
        <div className="xl:col-span-5 p-6 rounded-2xl neu-card flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-purple-600" />
              <h3 className="font-bold text-slate-800 text-base">Today&apos;s Study Plan</h3>
            </div>
            <Link
              href="/user/dashboard/study-plan"
              className="text-xs font-bold text-purple-600 hover:text-purple-700 flex items-center gap-1 group"
            >
              <span>View Plan</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {/* Interactive Checkbox Items */}
          <div className="space-y-2.5 my-auto">
            {tasks.map((task) => (
              <div
                key={task.id}
                onClick={() => toggleTask(task.id)}
                className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                  task.done
                    ? 'bg-purple-50/40 border-purple-200/60'
                    : 'bg-white border-slate-100 hover:border-slate-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors ${
                      task.done ? 'bg-purple-600 text-white' : 'border-2 border-slate-300 bg-white'
                    }`}
                  >
                    {task.done && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                  <div>
                    <h4
                      className={`text-xs font-bold ${
                        task.done ? 'text-slate-700 line-through' : 'text-slate-800'
                      }`}
                    >
                      {task.title}
                    </h4>
                    <span className="text-[11px] text-slate-400 font-medium">{task.sub}</span>
                  </div>
                </div>

                {task.done && <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />}
              </div>
            ))}
          </div>
        </div>

        {/* Card 3: Study Streak (3 columns) */}
        <div className="xl:col-span-3 p-6 rounded-2xl neu-card flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-500 fill-orange-500" />
              <h3 className="font-bold text-slate-800 text-base">Study Streak</h3>
            </div>
          </div>

          <div className="flex items-center justify-between my-1">
            <div>
              <div className="text-3xl font-black text-slate-900 tracking-tight">12 Days</div>
              <p className="text-xs font-semibold text-slate-500 mt-0.5">
                You&apos;re on a great streak!
              </p>
            </div>
            {/* Trophy Icon */}
            <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200/60 flex items-center justify-center text-amber-500 shadow-xs">
              <Trophy className="w-7 h-7 fill-amber-400 text-amber-500" />
            </div>
          </div>

          {/* Weekday Tracker */}
          <div className="pt-3 border-t border-slate-100">
            <div className="flex items-center justify-between text-center">
              {days.map((d) => (
                <div key={d.name} className="flex flex-col items-center gap-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">{d.name}</span>
                  {d.done ? (
                    <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-dashed border-slate-300" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. Bottom Row: My Subjects + Recent Activity + Upcoming Tests */}
      <section
        aria-label="Subjects and Test Schedule"
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-12 gap-5 items-stretch"
      >
        {/* Card 1: My Subjects (5 columns) */}
        <div className="xl:col-span-5 p-6 rounded-2xl neu-card flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-purple-600" />
              <h3 className="font-bold text-slate-800 text-base">My Subjects</h3>
            </div>
            <Link
              href="/user/dashboard/subjects"
              className="text-xs font-bold text-purple-600 hover:text-purple-700 flex items-center gap-1 group"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {/* Subjects Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 my-auto">
            {/* Mathematics */}
            <div className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-100 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center">
                <Calculator className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800">Mathematics</h4>
                <p className="text-[10px] text-slate-400">8 / 10 Chapters</p>
              </div>
              <div className="space-y-1">
                <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-600 rounded-full" style={{ width: '80%' }} />
                </div>
                <div className="text-right text-[10px] font-bold text-slate-600">80%</div>
              </div>
            </div>

            {/* Physics */}
            <div className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-100 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-600 flex items-center justify-center">
                <Atom className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800">Physics</h4>
                <p className="text-[10px] text-slate-400">6 / 8 Chapters</p>
              </div>
              <div className="space-y-1">
                <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-sky-500 rounded-full" style={{ width: '75%' }} />
                </div>
                <div className="text-right text-[10px] font-bold text-slate-600">75%</div>
              </div>
            </div>

            {/* Chemistry */}
            <div className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-100 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center">
                <FlaskConical className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800">Chemistry</h4>
                <p className="text-[10px] text-slate-400">5 / 8 Chapters</p>
              </div>
              <div className="space-y-1">
                <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-rose-500 rounded-full" style={{ width: '62%' }} />
                </div>
                <div className="text-right text-[10px] font-bold text-slate-600">62%</div>
              </div>
            </div>

            {/* Biology */}
            <div className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-100 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <Sprout className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800">Biology</h4>
                <p className="text-[10px] text-slate-400">7 / 9 Chapters</p>
              </div>
              <div className="space-y-1">
                <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '78%' }} />
                </div>
                <div className="text-right text-[10px] font-bold text-slate-600">78%</div>
              </div>
            </div>

            {/* English */}
            <div className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-100 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center">
                <Book className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800">English</h4>
                <p className="text-[10px] text-slate-400">6 / 7 Chapters</p>
              </div>
              <div className="space-y-1">
                <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: '86%' }} />
                </div>
                <div className="text-right text-[10px] font-bold text-slate-600">86%</div>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Recent Activity (4 columns) */}
        <div className="xl:col-span-4 p-6 rounded-2xl neu-card flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-purple-600" />
              <h3 className="font-bold text-slate-800 text-base">Recent Activity</h3>
            </div>
            <Link
              href="/user/dashboard/practice"
              className="text-xs font-bold text-purple-600 hover:text-purple-700 flex items-center gap-1 group"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="space-y-3 my-auto">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="font-bold text-slate-800">Practice: Trigonometry</h5>
                  <p className="text-[11px] text-slate-400">Mathematics • 20 Questions</p>
                </div>
              </div>
              <span className="text-[11px] font-semibold text-slate-400">Today, 10:24 AM</span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="font-bold text-slate-800">Test: Electricity</h5>
                  <p className="text-[11px] text-slate-400">Physics • 30 Questions</p>
                </div>
              </div>
              <span className="text-[11px] font-semibold text-slate-400">Yesterday, 06:40 PM</span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="font-bold text-slate-800">Read Notes: Acids & Bases</h5>
                  <p className="text-[11px] text-slate-400">Chemistry</p>
                </div>
              </div>
              <span className="text-[11px] font-semibold text-slate-400">Yesterday, 05:10 PM</span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
                  <PlayCircle className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="font-bold text-slate-800">Watched: Trigonometry Basics</h5>
                  <p className="text-[11px] text-slate-400">Mathematics • 12 mins</p>
                </div>
              </div>
              <span className="text-[11px] font-semibold text-slate-400">Yesterday, 03:22 PM</span>
            </div>
          </div>
        </div>

        {/* Card 3: Upcoming Tests (3 columns) */}
        <div className="xl:col-span-3 p-6 rounded-2xl neu-card flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-purple-600" />
              <h3 className="font-bold text-slate-800 text-base">Upcoming Tests</h3>
            </div>
            <Link
              href="/user/dashboard/tests"
              className="text-xs font-bold text-purple-600 hover:text-purple-700 flex items-center gap-1 group"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="space-y-3.5 my-auto">
            {/* Test 1 */}
            <div className="flex items-start gap-3 p-2.5 rounded-xl bg-purple-50/50 border border-purple-100/60">
              <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center shrink-0 mt-0.5">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <h5 className="text-xs font-bold text-slate-800">Mathematics – Chapter Test</h5>
                <p className="text-[11px] font-medium text-slate-400 mt-0.5">
                  12 Nov, 2026 • 10:00 AM
                </p>
              </div>
            </div>

            {/* Test 2 */}
            <div className="flex items-start gap-3 p-2.5 rounded-xl bg-sky-50/50 border border-sky-100/60">
              <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-600 flex items-center justify-center shrink-0 mt-0.5">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <h5 className="text-xs font-bold text-slate-800">Physics – Chapter Test</h5>
                <p className="text-[11px] font-medium text-slate-400 mt-0.5">
                  14 Nov, 2026 • 10:00 AM
                </p>
              </div>
            </div>

            {/* Test 3 */}
            <div className="flex items-start gap-3 p-2.5 rounded-xl bg-rose-50/50 border border-rose-100/60">
              <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 mt-0.5">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <h5 className="text-xs font-bold text-slate-800">Chemistry – Unit Test</h5>
                <p className="text-[11px] font-medium text-slate-400 mt-0.5">
                  18 Nov, 2026 • 10:00 AM
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

