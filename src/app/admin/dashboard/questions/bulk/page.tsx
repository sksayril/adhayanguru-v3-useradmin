'use client';

import React from 'react';
import Link from 'next/link';
import { CloudUpload, FileSpreadsheet, ArrowLeft, Download } from 'lucide-react';

export default function BulkUploadPage() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Link
        href="/admin/dashboard/questions"
        className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-orange-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Questions</span>
      </Link>

      <div className="p-6 md:p-8 rounded-3xl neu-card space-y-6">
        <div>
          <h2 className="text-xl font-extrabold text-slate-800">Bulk Upload Questions</h2>
          <p className="text-xs text-slate-400 mt-1">
            Upload questions in batch via CSV or Excel template.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileSpreadsheet className="w-6 h-6 text-orange-600" />
            <div>
              <p className="text-xs font-bold text-orange-950">Download Standard CSV Template</p>
              <p className="text-[11px] text-orange-700">Pre-formatted columns for question, options, answer key, and taxonomy</p>
            </div>
          </div>
          <button
            type="button"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white text-orange-600 font-bold text-xs shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download</span>
          </button>
        </div>

        <div className="p-10 rounded-3xl border-2 border-dashed border-slate-300 text-center space-y-3 bg-[#EFF2F8]/50">
          <CloudUpload className="w-10 h-10 mx-auto text-orange-500 animate-pulse" />
          <div>
            <p className="text-sm font-bold text-slate-700">Choose a file or drag & drop here</p>
            <p className="text-xs text-slate-400">CSV, XLSX or JSON up to 25MB</p>
          </div>
          <button
            type="button"
            className="px-5 py-2 rounded-xl neu-orange-button text-white text-xs font-bold"
          >
            Browse Local File
          </button>
        </div>
      </div>
    </div>
  );
}

