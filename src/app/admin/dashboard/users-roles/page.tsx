'use client';

import React from 'react';
import Link from 'next/link';
import { UserCog, Plus, ShieldCheck, ChevronRight } from 'lucide-react';

export default function UsersRolesPage() {
  const users = [
    { name: 'SK Sayril Amed', email: 'sayril@dekheducation.com', role: 'Super Admin', status: 'Active' },
    { name: 'Dr. Debabrata Roy', email: 'debabrata@dekheducation.com', role: 'Academic Director', status: 'Active' },
    { name: 'Priyanka Sen', email: 'priyanka@dekheducation.com', role: 'Senior Content Reviewer', status: 'Active' },
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
            <span className="text-orange-600 font-bold">Users & Roles</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight">
            Team & Role Permissions
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Manage administrative privileges, teachers, and editor access.
          </p>
        </div>

        <button
          type="button"
          suppressHydrationWarning
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl neu-orange-button text-white font-bold text-sm shadow-md"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Invite Admin</span>
        </button>
      </div>

      <div className="p-6 rounded-2xl neu-card overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[11px]">
              <th className="py-3 px-3">Administrator</th>
              <th className="py-3 px-3">Assigned Role</th>
              <th className="py-3 px-3">Status</th>
              <th className="py-3 px-3 text-right">Access Controls</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
            {users.map((u, i) => (
              <tr key={i} className="hover:bg-slate-50 transition-colors">
                <td className="py-3 px-3 font-bold text-slate-800">
                  <div>{u.name}</div>
                  <div className="text-[11px] text-slate-400 font-normal">{u.email}</div>
                </td>
                <td className="py-3 px-3">
                  <span className="inline-flex items-center gap-1 font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md">
                    <ShieldCheck className="w-3 h-3" />
                    {u.role}
                  </span>
                </td>
                <td className="py-3 px-3">
                  <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 font-bold text-[11px]">
                    {u.status}
                  </span>
                </td>
                <td className="py-3 px-3 text-right">
                  <button className="text-orange-600 font-bold hover:underline">
                    Edit Permissions
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

