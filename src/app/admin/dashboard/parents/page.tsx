'use client';

import React from 'react';
import Link from 'next/link';
import { UserCheck, Link2, ChevronRight, Phone, Mail } from 'lucide-react';

export default function ParentsPage() {
  const parents = [
    { name: 'Rajesh Sharma', phone: '+91 98301 23456', email: 'rajesh.s@example.com', student: 'Aarav Sharma (Class 10)', status: 'Linked' },
    { name: 'Ananya Mukherjee', phone: '+91 98312 98765', email: 'ananya.m@example.com', student: 'Diya Mukherjee (Class 10)', status: 'Linked' },
    { name: 'Subhash Sen', phone: '+91 98305 67890', email: 'subhash.sen@example.com', student: 'Rohan Sen (Class 9)', status: 'Linked' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-1">
            <Link href="/admin/dashboard" className="hover:text-orange-500 transition-colors">
              Dashboard
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-orange-600 font-bold">Parents</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight">
            Parents Directory
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            9,260 registered parents linked with student accounts.
          </p>
        </div>

        <button
          type="button"
          suppressHydrationWarning
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl neu-orange-button text-white font-bold text-sm shadow-md"
        >
          <Link2 className="w-4 h-4" />
          <span>Link Parent Account</span>
        </button>
      </div>

      <div className="p-6 rounded-2xl neu-card overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[11px]">
              <th className="py-3 px-3">Parent Name</th>
              <th className="py-3 px-3">Contact</th>
              <th className="py-3 px-3">Linked Student</th>
              <th className="py-3 px-3">Status</th>
              <th className="py-3 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
            {parents.map((p, i) => (
              <tr key={i} className="hover:bg-slate-50 transition-colors">
                <td className="py-3 px-3 font-bold text-slate-800">{p.name}</td>
                <td className="py-3 px-3">
                  <div>{p.phone}</div>
                  <div className="text-[11px] text-slate-400">{p.email}</div>
                </td>
                <td className="py-3 px-3 font-semibold text-slate-700">{p.student}</td>
                <td className="py-3 px-3">
                  <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 font-bold text-[11px]">
                    {p.status}
                  </span>
                </td>
                <td className="py-3 px-3 text-right">
                  <button className="text-orange-600 font-bold hover:underline">
                    Manage
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

