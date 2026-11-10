'use client';

import React from 'react';
import Link from 'next/link';
import { Users, UserPlus, ChevronRight, Search, Mail, Phone } from 'lucide-react';

export default function StudentsPage() {
  const students = [
    { name: 'Aarav Sharma', id: 'STD-10021', classNum: 'Class 10', board: 'CBSE', attendance: '96%', parent: 'Rajesh Sharma' },
    { name: 'Diya Mukherjee', id: 'STD-10022', classNum: 'Class 10', board: 'ICSE', attendance: '92%', parent: 'Ananya Mukherjee' },
    { name: 'Rohan Sen', id: 'STD-10023', classNum: 'Class 9', board: 'WBCHSE', attendance: '88%', parent: 'Subhash Sen' },
    { name: 'Ishita Roy', id: 'STD-10024', classNum: 'Class 12', board: 'CBSE', attendance: '99%', parent: 'Dr. P. K. Roy' },
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
            <span className="text-orange-600 font-bold">Students</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight">
            Student Management
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Total 12,480 active students enrolled across boards.
          </p>
        </div>

        <button
          type="button"
          suppressHydrationWarning
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl neu-orange-button text-white font-bold text-sm shadow-md"
        >
          <UserPlus className="w-4 h-4 stroke-[3]" />
          <span>Add New Student</span>
        </button>
      </div>

      <div className="p-6 rounded-2xl neu-card overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[11px]">
              <th className="py-3 px-3">Roll ID</th>
              <th className="py-3 px-3">Student Name</th>
              <th className="py-3 px-3">Class & Board</th>
              <th className="py-3 px-3">Parent Name</th>
              <th className="py-3 px-3">Attendance</th>
              <th className="py-3 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
            {students.map((st) => (
              <tr key={st.id} className="hover:bg-slate-50 transition-colors">
                <td className="py-3 px-3 font-bold text-orange-600">{st.id}</td>
                <td className="py-3 px-3 font-bold text-slate-800">{st.name}</td>
                <td className="py-3 px-3 text-slate-600">{st.classNum} ({st.board})</td>
                <td className="py-3 px-3 text-slate-600">{st.parent}</td>
                <td className="py-3 px-3 font-semibold text-emerald-600">{st.attendance}</td>
                <td className="py-3 px-3 text-right">
                  <button className="text-orange-600 font-bold hover:underline">
                    View Profile
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

