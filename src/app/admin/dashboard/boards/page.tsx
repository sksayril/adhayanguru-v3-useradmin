'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Layers,
  Plus,
  Search,
  GraduationCap,
  BookOpen,
  Users,
  CheckCircle2,
  XCircle,
  ChevronRight,
  Trash2,
  X,
  LayoutGrid,
  List,
  Loader2,
  RefreshCw,
  Sparkles,
  AlertCircle,
  Globe2,
  Building2,
  MapPin,
} from 'lucide-react';

interface BoardData {
  _id: string;
  name: string;
  shortCode: string;
  category: 'National' | 'State' | 'International';
  stateOrRegion: string;
  curriculum: string;
  description: string;
  classesCount: number;
  subjectsCount: number;
  studentsCount: number;
  status: 'Active' | 'Inactive';
  iconBg?: string;
  createdAt?: string;
}

interface StatsData {
  totalBoards: number;
  activeClasses: number;
  mappedSubjects: number;
  enrolledStudents: number;
}

export default function BoardsPage() {
  const [boards, setBoards] = useState<BoardData[]>([]);
  const [stats, setStats] = useState<StatsData>({
    totalBoards: 0,
    activeClasses: 0,
    mappedSubjects: 0,
    enrolledStudents: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'All' | 'National' | 'State' | 'International'>('All');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [boardToDelete, setBoardToDelete] = useState<BoardData | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // New Board Form State
  const [formData, setFormData] = useState({
    name: '',
    shortCode: '',
    category: 'National' as 'National' | 'State' | 'International',
    stateOrRegion: '',
    curriculum: '',
    description: '',
    classesCount: 12,
    subjectsCount: 36,
    studentsCount: 1500,
    status: 'Active' as 'Active' | 'Inactive',
  });

  // Fetch Boards directly from MongoDB Atlas API
  const fetchBoards = async () => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const res = await fetch('/api/admin/boards', { cache: 'no-store' });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to retrieve boards from database.');
      }

      setBoards(data.boards || []);
      if (data.stats) {
        setStats(data.stats);
      }
    } catch (err: any) {
      console.error('Error fetching boards:', err);
      setErrorMessage(err.message || 'Could not connect to MongoDB database.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBoards();
  }, []);

  // Filter boards based on active tab and search query
  const filteredBoards = boards.filter((b) => {
    const matchesSearch =
      b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.shortCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.stateOrRegion.toLowerCase().includes(searchQuery.toLowerCase());

    if (activeTab === 'All') return matchesSearch;
    return matchesSearch && b.category === activeTab;
  });

  // Handle Create Board (MongoDB POST)
  const handleCreateBoard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.shortCode.trim()) {
      alert('Please provide both Board Name and Short Code.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const res = await fetch('/api/admin/boards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to create board in database.');
      }

      setSuccessMessage(`Board "${data.board.shortCode}" created successfully in MongoDB!`);
      setTimeout(() => setSuccessMessage(''), 4000);

      // Reset form & close modal
      setFormData({
        name: '',
        shortCode: '',
        category: 'National',
        stateOrRegion: '',
        curriculum: '',
        description: '',
        classesCount: 12,
        subjectsCount: 36,
        studentsCount: 1500,
        status: 'Active',
      });
      setIsModalOpen(false);

      // Refresh list from MongoDB
      await fetchBoards();
    } catch (err: any) {
      alert(err.message || 'Error creating board in database.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Delete Board (MongoDB DELETE)
  const confirmDeleteBoard = async () => {
    if (!boardToDelete) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/boards/${boardToDelete._id}`, {
        method: 'DELETE',
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Could not delete board from database.');
      }

      setSuccessMessage(`Board "${boardToDelete.shortCode}" deleted from MongoDB.`);
      setTimeout(() => setSuccessMessage(''), 4000);

      setBoardToDelete(null);
      await fetchBoards();
    } catch (err: any) {
      alert(err.message || 'Delete operation failed.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Success Notification Banner */}
      {successMessage && (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-sm font-semibold shadow-sm animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Error Banner with Retry */}
      {errorMessage && (
        <div className="flex items-center justify-between p-4 rounded-2xl bg-rose-50 border border-rose-200/80 text-rose-800 text-sm font-semibold shadow-sm">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button
            type="button"
            onClick={fetchBoards}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white text-rose-700 hover:bg-rose-100/70 border border-rose-300 text-xs font-bold transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry Connection</span>
          </button>
        </div>
      )}

      {/* Breadcrumb & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-1">
            <Link href="/admin/dashboard" className="hover:text-orange-500 transition-colors">
              Dashboard
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-orange-600 font-bold">Boards Management</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight">
            Educational Boards
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Manage curriculums, classes affiliation, and syllabus for all active boards.
          </p>
        </div>

        {/* Action Button: Add Board */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={fetchBoards}
            disabled={isLoading}
            title="Reload from MongoDB"
            suppressHydrationWarning
            className="flex items-center justify-center w-10 h-10 rounded-2xl bg-white neu-button text-slate-600 hover:text-orange-600 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-orange-500' : ''}`} />
          </button>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            suppressHydrationWarning
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl neu-orange-button text-white font-bold text-sm shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Add New Board</span>
          </button>
        </div>
      </div>

      {/* Summary Stat Cards (Live from MongoDB) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl neu-card flex items-center gap-3.5">
          <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-purple-50 text-purple-600 shadow-xs shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-black text-slate-800">
              {isLoading ? '...' : stats.totalBoards}
            </div>
            <div className="text-xs text-slate-400 font-medium">Total Boards</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl neu-card flex items-center gap-3.5">
          <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-amber-50 text-amber-600 shadow-xs shrink-0">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-black text-slate-800">
              {isLoading ? '...' : stats.activeClasses.toLocaleString()}
            </div>
            <div className="text-xs text-slate-400 font-medium">Active Classes</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl neu-card flex items-center gap-3.5">
          <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 shadow-xs shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-black text-slate-800">
              {isLoading ? '...' : stats.mappedSubjects.toLocaleString()}
            </div>
            <div className="text-xs text-slate-400 font-medium">Mapped Subjects</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl neu-card flex items-center gap-3.5">
          <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-orange-50 text-orange-600 shadow-xs shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-black text-slate-800">
              {isLoading ? '...' : stats.enrolledStudents.toLocaleString()}
            </div>
            <div className="text-xs text-slate-400 font-medium">Enrolled Students</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl neu-card flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#EFF2F8] neu-inset w-full md:w-auto overflow-x-auto">
          {(['All', 'National', 'State', 'International'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              suppressHydrationWarning
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === tab
                  ? 'bg-white text-orange-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search & View Mode Switcher */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-72">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by code or name..."
              suppressHydrationWarning
              className="w-full pl-9 pr-4 py-2 bg-[#EFF2F8] neu-inset text-xs font-medium text-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400/40"
            />
          </div>

          {/* Grid vs Table View Mode */}
          <div className="flex items-center p-1 rounded-xl bg-[#EFF2F8] neu-inset">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              suppressHydrationWarning
              className={`p-1.5 rounded-lg ${
                viewMode === 'grid' ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-400'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              suppressHydrationWarning
              className={`p-1.5 rounded-lg ${
                viewMode === 'table' ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-400'
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Boards Display (Grid or Table) */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="p-5 rounded-2xl neu-card animate-pulse space-y-4">
              <div className="flex justify-between items-center">
                <div className="h-6 w-16 bg-slate-200 rounded-lg" />
                <div className="h-5 w-14 bg-slate-200 rounded-full" />
              </div>
              <div className="h-5 w-3/4 bg-slate-200 rounded" />
              <div className="h-4 w-full bg-slate-200 rounded" />
              <div className="h-4 w-1/2 bg-slate-200 rounded" />
              <div className="pt-4 border-t border-slate-100 grid grid-cols-3 gap-2">
                <div className="h-10 bg-slate-200 rounded-lg" />
                <div className="h-10 bg-slate-200 rounded-lg" />
                <div className="h-10 bg-slate-200 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredBoards.length === 0 ? (
        <div className="p-12 text-center rounded-2xl neu-card space-y-3">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-orange-50 flex items-center justify-center text-orange-500">
            <Layers className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-800 text-base">No Educational Boards Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            {searchQuery
              ? `No boards match "${searchQuery}". Try a different keyword.`
              : 'No boards registered in this category yet. Click below to add one.'}
          </p>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl neu-orange-button text-white text-xs font-bold shadow-md"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span>Add First Board</span>
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredBoards.map((board) => (
            <div
              key={board._id}
              className="p-5 rounded-2xl neu-card neu-card-hover flex flex-col justify-between relative group transition-all"
            >
              {/* Card Header: Code Badge & Status */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-xl font-extrabold text-xs bg-orange-50 text-orange-600 border border-orange-200/60 shadow-xs">
                      {board.shortCode}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                      {board.category}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        board.status === 'Active'
                          ? 'bg-emerald-50 text-emerald-600 border border-emerald-200/60'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {board.status === 'Active' ? (
                        <CheckCircle2 className="w-3 h-3" />
                      ) : (
                        <XCircle className="w-3 h-3" />
                      )}
                      {board.status}
                    </span>
                    <button
                      type="button"
                      onClick={() => setBoardToDelete(board)}
                      suppressHydrationWarning
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors"
                      title="Delete Board from Database"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <h3 className="text-base font-bold text-slate-800 line-clamp-1 group-hover:text-orange-600 transition-colors">
                  {board.name}
                </h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {board.description || 'Educational curriculum and board standards.'}
                </p>
                <div className="mt-2.5 text-xs font-semibold text-slate-500 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  <span className="text-slate-400 font-normal">Region: </span>
                  <span className="text-slate-700">{board.stateOrRegion}</span>
                </div>
              </div>

              {/* Card Footer: Metrics & Manage Button */}
              <div className="mt-5 pt-4 border-t border-slate-100">
                <div className="grid grid-cols-3 gap-2 text-center mb-3">
                  <div className="p-1.5 rounded-lg bg-slate-50">
                    <div className="text-xs font-bold text-slate-800">{board.classesCount}</div>
                    <div className="text-[10px] text-slate-400">Classes</div>
                  </div>
                  <div className="p-1.5 rounded-lg bg-slate-50">
                    <div className="text-xs font-bold text-slate-800">{board.subjectsCount}</div>
                    <div className="text-[10px] text-slate-400">Subjects</div>
                  </div>
                  <div className="p-1.5 rounded-lg bg-slate-50">
                    <div className="text-xs font-bold text-slate-800">
                      {board.studentsCount.toLocaleString()}
                    </div>
                    <div className="text-[10px] text-slate-400">Students</div>
                  </div>
                </div>

                <Link
                  href={`/admin/dashboard/classes?board=${board.shortCode}`}
                  className="flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl bg-[#F0F3F9] hover:bg-orange-50 hover:text-orange-600 text-slate-700 font-bold text-xs transition-colors"
                >
                  <span>Explore Classes & Subjects</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="p-6 rounded-2xl neu-card overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-3">Board Code</th>
                <th className="py-3 px-3">Board Name</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3">Region</th>
                <th className="py-3 px-3">Classes</th>
                <th className="py-3 px-3">Subjects</th>
                <th className="py-3 px-3">Students</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBoards.map((b) => (
                <tr key={b._id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-3 font-extrabold text-orange-600">{b.shortCode}</td>
                  <td className="py-3 px-3 font-bold text-slate-800 max-w-xs">{b.name}</td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-semibold text-[10px]">
                      {b.category}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-600">{b.stateOrRegion}</td>
                  <td className="py-3 px-3 font-semibold text-slate-700">{b.classesCount}</td>
                  <td className="py-3 px-3 font-semibold text-slate-700">{b.subjectsCount}</td>
                  <td className="py-3 px-3 font-semibold text-slate-700">
                    {b.studentsCount.toLocaleString()}
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold ${
                        b.status === 'Active'
                          ? 'bg-emerald-50 text-emerald-600 border border-emerald-200/60'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {b.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <button
                      type="button"
                      onClick={() => setBoardToDelete(b)}
                      suppressHydrationWarning
                      className="p-1 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors"
                      title="Delete from MongoDB"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Board Neumorphic Modal (Creates Record Directly into MongoDB) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl p-6 bg-white rounded-3xl neu-card shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-orange-50 text-orange-600">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-base">Add New Educational Board</h3>
                  <p className="text-xs text-slate-400">
                    Stores directly into MongoDB Atlas database
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                suppressHydrationWarning
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleCreateBoard} className="space-y-4 text-xs font-medium">
              <div className="space-y-1">
                <label className="text-slate-600 font-bold">Board Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Central Board of Secondary Education"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  suppressHydrationWarning
                  className="w-full px-3.5 py-2.5 bg-[#EFF2F8] neu-inset rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-400/50"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-600 font-bold">Short Code / Acronym *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. CBSE / ICSE / WBBSE"
                    value={formData.shortCode}
                    onChange={(e) =>
                      setFormData({ ...formData, shortCode: e.target.value.toUpperCase() })
                    }
                    suppressHydrationWarning
                    className="w-full px-3.5 py-2.5 bg-[#EFF2F8] neu-inset rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-400/50 uppercase"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-600 font-bold">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        category: e.target.value as 'National' | 'State' | 'International',
                      })
                    }
                    suppressHydrationWarning
                    className="w-full px-3.5 py-2.5 bg-[#EFF2F8] neu-inset rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-400/50"
                  >
                    <option value="National">National (India)</option>
                    <option value="State">State Board</option>
                    <option value="International">International</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-600 font-bold">State / Region</label>
                  <input
                    type="text"
                    placeholder="e.g. West Bengal, National (India)"
                    value={formData.stateOrRegion}
                    onChange={(e) => setFormData({ ...formData, stateOrRegion: e.target.value })}
                    suppressHydrationWarning
                    className="w-full px-3.5 py-2.5 bg-[#EFF2F8] neu-inset rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-400/50"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-600 font-bold">Curriculum Framework</label>
                  <input
                    type="text"
                    placeholder="e.g. NCERT Guidelines 2026"
                    value={formData.curriculum}
                    onChange={(e) => setFormData({ ...formData, curriculum: e.target.value })}
                    suppressHydrationWarning
                    className="w-full px-3.5 py-2.5 bg-[#EFF2F8] neu-inset rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-400/50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-600 font-bold">Total Classes</label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={formData.classesCount}
                    onChange={(e) =>
                      setFormData({ ...formData, classesCount: Number(e.target.value) })
                    }
                    suppressHydrationWarning
                    className="w-full px-3.5 py-2.5 bg-[#EFF2F8] neu-inset rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-400/50"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-600 font-bold">Mapped Subjects</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.subjectsCount}
                    onChange={(e) =>
                      setFormData({ ...formData, subjectsCount: Number(e.target.value) })
                    }
                    suppressHydrationWarning
                    className="w-full px-3.5 py-2.5 bg-[#EFF2F8] neu-inset rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-400/50"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-600 font-bold">Enrolled Students</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.studentsCount}
                    onChange={(e) =>
                      setFormData({ ...formData, studentsCount: Number(e.target.value) })
                    }
                    suppressHydrationWarning
                    className="w-full px-3.5 py-2.5 bg-[#EFF2F8] neu-inset rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-400/50"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-600 font-bold">Description</label>
                <textarea
                  rows={2}
                  placeholder="Summary of board coverage, curriculum guidelines and academic scope..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  suppressHydrationWarning
                  className="w-full px-3.5 py-2.5 bg-[#EFF2F8] neu-inset rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-400/50"
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.status === 'Active'}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.checked ? 'Active' : 'Inactive' })
                    }
                    suppressHydrationWarning
                    className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500"
                  />
                  <span className="text-slate-700 font-bold">Set as Active Board</span>
                </label>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isSubmitting}
                  suppressHydrationWarning
                  className="px-4 py-2 rounded-xl text-slate-500 hover:text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  suppressHydrationWarning
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl neu-orange-button text-white font-bold shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving to MongoDB...</span>
                    </>
                  ) : (
                    <span>Create Board in Database</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {boardToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md p-6 bg-white rounded-3xl neu-card shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-rose-50 text-rose-600">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-base">Delete Educational Board?</h3>
                <p className="text-xs text-slate-400">This action will delete the board from MongoDB</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to permanently remove{' '}
              <strong className="text-slate-900">{boardToDelete.name}</strong> (
              <span className="text-orange-600 font-bold">{boardToDelete.shortCode}</span>)? This
              record will be deleted from your database.
            </p>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setBoardToDelete(null)}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl text-slate-500 hover:text-slate-700 font-semibold text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteBoard}
                disabled={isDeleting}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md transition-all disabled:opacity-50"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Deleting from DB...</span>
                  </>
                ) : (
                  <span>Yes, Delete Board</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
