'use client';

import React, { useState, useEffect } from 'react';
import WelcomeBanner from '@/components/admin/WelcomeBanner';
import StatCard from '@/components/admin/StatCard';
import UserGrowthChart from '@/components/admin/UserGrowthChart';
import SubjectDistributionChart from '@/components/admin/SubjectDistributionChart';
import QuickActions from '@/components/admin/QuickActions';
import RecentQuestionsTable from '@/components/admin/RecentQuestionsTable';
import PlatformProgress from '@/components/admin/PlatformProgress';
import { statsData as initialStats } from '@/lib/mockData';
import { StatItem } from '@/types';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<StatItem[]>(initialStats);

  useEffect(() => {
    // Fetch live board metrics from MongoDB
    fetch('/api/admin/boards')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.success && data?.stats) {
          setStats((prev) =>
            prev.map((item) => {
              if (item.id === 'boards') {
                return { ...item, value: String(data.stats.totalBoards) };
              }
              if (item.id === 'classes' && data.stats.activeClasses) {
                return { ...item, value: data.stats.activeClasses.toLocaleString() };
              }
              if (item.id === 'subjects' && data.stats.mappedSubjects) {
                return { ...item, value: data.stats.mappedSubjects.toLocaleString() };
              }
              if (item.id === 'students' && data.stats.enrolledStudents) {
                return { ...item, value: data.stats.enrolledStudents.toLocaleString() };
              }
              return item;
            })
          );
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="space-y-6">
      {/* 1. Welcome Banner */}
      <WelcomeBanner />

      {/* 2. Top 6 Stats Cards Grid (Live MongoDB sync) */}
      <section aria-label="Overview Stats">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-5">
          {stats.map((stat) => (
            <StatCard key={stat.id} stat={stat} />
          ))}
        </div>
      </section>

      {/* 3. Middle Row: User Growth + Subject Distribution + Quick Actions */}
      <section
        aria-label="Analytics and Actions"
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-12 gap-5 items-stretch"
      >
        {/* User Growth (5 columns on large screen) */}
        <div className="md:col-span-2 xl:col-span-5 flex flex-col">
          <UserGrowthChart />
        </div>

        {/* Subject Distribution (4 columns on large screen) */}
        <div className="xl:col-span-4 flex flex-col">
          <SubjectDistributionChart />
        </div>

        {/* Quick Actions (3 columns on large screen) */}
        <div className="xl:col-span-3 flex flex-col">
          <QuickActions />
        </div>
      </section>

      {/* 4. Bottom Row: Recent Questions + Platform Progress */}
      <section
        aria-label="Recent Activity and Progress"
        className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch"
      >
        {/* Recent Questions Table (8 columns) */}
        <div className="lg:col-span-8 flex flex-col">
          <RecentQuestionsTable />
        </div>

        {/* Platform Progress (4 columns) */}
        <div className="lg:col-span-4 flex flex-col">
          <PlatformProgress />
        </div>
      </section>
    </div>
  );
}
