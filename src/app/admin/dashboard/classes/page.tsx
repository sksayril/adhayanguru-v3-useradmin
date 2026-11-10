'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  GraduationCap,
  Plus,
  ChevronRight,
  BookOpen,
  Users,
  Search,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Pencil,
  Trash2,
  X,
  Loader2,
  Sliders,
  Layers,
} from 'lucide-react';

interface AcademicClassItem {
  _id: string;
  grade: string;
  code: string;
  order: number;
  boards: string;
  subjectsCount: number;
  studentsCount: number;
  section?: string;
  description?: string;
  status: 'Active' | 'Inactive';
  createdAt?: string;
}

interface ClassStats {
  totalClasses: number;
  totalSubjects: number;
  totalStudents: number;
  activeCount: number;
}

export default function ClassesPage() {
  const [classesList, setClassesList] = useState<AcademicClassItem[]>([]);
  const [stats, setStats] = useState<ClassStats>({
    totalClasses: 0,
    totalSubjects: 0,
    totalStudents: 0,
    activeCount: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSection, setSelectedSection] = useState<'All' | 'Primary' | 'Middle School' | 'Secondary' | 'Higher Secondary'>('All');

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<AcademicClassItem | null>(null);
  const [deletingClass, setDeletingClass] = useState<AcademicClassItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State (for both Create & Edit)
  const [formData, setFormData] = useState({
    grade: '',
    code: '',
    boards: 'CBSE, ICSE, WBCHSE',
    subjectsCount: 5,
    studentsCount: 500,
    section: 'Primary',
    description: '',
    status: 'Active' as 'Active' | 'Inactive',
  });

  // Fetch classes from MongoDB Atlas API
  const fetchClasses = async () => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const res = await fetch('/api/admin/classes', { cache: 'no-store' });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to fetch academic classes from MongoDB.');
      }

      setClassesList(data.classes || []);
      if (data.stats) {
        setStats(data.stats);
      }
    } catch (err: any) {
      console.error('Error loading classes:', err);
      setErrorMessage(err.message || 'Could not connect to MongoDB database.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  // Filtered list based on search and section
  const filteredClasses = classesList.filter((item) => {
    const matchesSearch =
      item.grade.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.boards.toLowerCase().includes(searchQuery.toLowerCase());

    if (selectedSection === 'All') return matchesSearch;
    return matchesSearch && item.section === selectedSection;
  });

  // Open Create Modal
  const openCreateModal = () => {
    const nextNum = classesList.length + 1;
    setFormData({
      grade: `Class ${nextNum}`,
      code: `STD-${nextNum}`,
      boards: 'CBSE, ICSE, WBCHSE',
      subjectsCount: 6,
      studentsCount: 500,
      section: nextNum <= 5 ? 'Primary' : nextNum <= 8 ? 'Middle School' : nextNum <= 10 ? 'Secondary' : 'Higher Secondary',
      description: '',
      status: 'Active',
    });
    setIsCreateModalOpen(true);
  };

  // Open Edit Modal
  const openEditModal = (cls: AcademicClassItem) => {
    setEditingClass(cls);
    setFormData({
      grade: cls.grade,
      code: cls.code,
      boards: cls.boards,
      subjectsCount: cls.subjectsCount,
      studentsCount: cls.studentsCount,
      section: cls.section || 'General',
      description: cls.description || '',
      status: cls.status,
    });
  };

  // Handle Create (Insert in MongoDB)
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.grade.trim() || !formData.code.trim()) {
      alert('Please provide Grade Name and Standard Code.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/admin/classes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Could not insert class into MongoDB.');
      }

      setSuccessMessage(`Academic standard "${data.academicClass.grade}" created in MongoDB!`);
      setTimeout(() => setSuccessMessage(''), 4000);
      setIsCreateModalOpen(false);
      await fetchClasses();
    } catch (err: any) {
      alert(err.message || 'Create class failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Update (Edit in MongoDB)
  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingClass) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/admin/classes/${editingClass._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Could not update class in MongoDB.');
      }

      setSuccessMessage(`Academic standard "${formData.grade}" updated successfully in MongoDB!`);
      setTimeout(() => setSuccessMessage(''), 4000);
      setEditingClass(null);
      await fetchClasses();
    } catch (err: any) {
      alert(err.message || 'Update class failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Delete (Remove from MongoDB)
  const handleDeleteSubmit = async () => {
    if (!deletingClass) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/admin/classes/${deletingClass._id}`, {
        method: 'DELETE',
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Could not delete class from MongoDB.');
      }

      setSuccessMessage(`Class "${deletingClass.grade}" deleted from MongoDB.`);
      setTimeout(() => setSuccessMessage(''), 4000);
      setDeletingClass(null);
      await fetchClasses();
    } catch (err: any) {
      alert(err.message || 'Delete operation failed.');
    } finally {
      setIsSubmitting(false);
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
            onClick={fetchClasses}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white text-rose-700 hover:bg-rose-100/70 border border-rose-300 text-xs font-bold transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry Connection</span>
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-1">
            <Link href="/admin/dashboard" className="hover:text-orange-500 transition-colors">
              Dashboard
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-orange-600 font-bold">Classes</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight">
            Academic Classes
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Configure standards from Class 1 to Class 12 across boards.
          </p>
        </div>

        {/* Top Actions */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={fetchClasses}
            disabled={isLoading}
            title="Reload from MongoDB"
            suppressHydrationWarning
            className="flex items-center justify-center w-10 h-10 rounded-2xl bg-white neu-button text-slate-600 hover:text-orange-600 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-orange-500' : ''}`} />
          </button>

          <button
            type="button"
            onClick={openCreateModal}
            suppressHydrationWarning
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl neu-orange-button text-white font-bold text-sm shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Add New Class</span>
          </button>
        </div>
      </div>

      {/* Live MongoDB Summary Stats Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl neu-card flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-amber-50 text-amber-600 shrink-0">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <div className="text-lg font-black text-slate-800">
              {isLoading ? '...' : stats.totalClasses}
            </div>
            <div className="text-[11px] text-slate-400 font-medium">Standards Configured</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl neu-card flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-purple-50 text-purple-600 shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="text-lg font-black text-slate-800">
              {isLoading ? '...' : stats.activeCount}
            </div>
            <div className="text-[11px] text-slate-400 font-medium">Active Classes</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl neu-card flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="text-lg font-black text-slate-800">
              {isLoading ? '...' : stats.totalSubjects.toLocaleString()}
            </div>
            <div className="text-[11px] text-slate-400 font-medium">Total Subjects</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl neu-card flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-orange-50 text-orange-600 shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="text-lg font-black text-slate-800">
              {isLoading ? '...' : stats.totalStudents.toLocaleString()}
            </div>
            <div className="text-[11px] text-slate-400 font-medium">Total Enrolled</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl neu-card flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Section Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#EFF2F8] neu-inset w-full md:w-auto overflow-x-auto">
          {(['All', 'Primary', 'Middle School', 'Secondary', 'Higher Secondary'] as const).map((sec) => (
            <button
              key={sec}
              type="button"
              onClick={() => setSelectedSection(sec)}
              suppressHydrationWarning
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                selectedSection === sec
                  ? 'bg-white text-orange-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {sec}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by class or code..."
            suppressHydrationWarning
            className="w-full pl-9 pr-4 py-2 bg-[#EFF2F8] neu-inset text-xs font-medium text-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400/40"
          />
        </div>
      </div>

      {/* Grid of Classes (Matching Screenshot) */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="p-5 rounded-2xl neu-card animate-pulse space-y-3">
              <div className="flex justify-between items-center">
                <div className="w-9 h-9 bg-slate-200 rounded-xl" />
                <div className="w-14 h-5 bg-slate-200 rounded-md" />
              </div>
              <div className="w-24 h-5 bg-slate-200 rounded" />
              <div className="w-36 h-3.5 bg-slate-200 rounded" />
              <div className="pt-2 border-t border-slate-100 flex justify-between">
                <div className="w-16 h-3 bg-slate-200 rounded" />
                <div className="w-16 h-3 bg-slate-200 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredClasses.length === 0 ? (
        <div className="p-12 text-center rounded-2xl neu-card space-y-3">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600">
            <GraduationCap className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-800 text-base">No Academic Classes Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            {searchQuery
              ? `No classes match "${searchQuery}".`
              : 'No classes in this section. Click below to add a class to MongoDB.'}
          </p>
          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl neu-orange-button text-white text-xs font-bold shadow-md"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span>Add Class</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredClasses.map((item) => (
            <div
              key={item._id}
              className="p-5 rounded-2xl neu-card neu-card-hover space-y-3 relative group transition-all"
            >
              {/* Card Top: Amber Cap Icon + STD Code + Action Buttons */}
              <div className="flex items-center justify-between">
                <span className="p-2.5 rounded-xl bg-amber-50 text-amber-600 shadow-xs">
                  <GraduationCap className="w-5 h-5" />
                </span>

                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md border border-orange-200/50">
                    {item.code}
                  </span>

                  {/* Edit / Delete Action Buttons (visible on hover or focus) */}
                  <div className="flex items-center opacity-70 group-hover:opacity-100 transition-opacity ml-1">
                    <button
                      type="button"
                      onClick={() => openEditModal(item)}
                      title="Edit Class (Update MongoDB)"
                      className="p-1 rounded-lg text-slate-400 hover:text-orange-600 hover:bg-orange-50 transition-colors"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeletingClass(item)}
                      title="Delete Class (Remove from MongoDB)"
                      className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Class Name & Boards */}
              <div>
                <h3 className="text-base font-bold text-slate-800 group-hover:text-orange-600 transition-colors">
                  {item.grade}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                  Boards: {item.boards}
                </p>
              </div>

              {/* Footer: Subjects & Students */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600 font-semibold">
                <span className="flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                  <span>{item.subjectsCount} Subjects</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  <span>{item.studentsCount.toLocaleString()} Students</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CREATE CLASS MODAL (INSERT) */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg p-6 bg-white rounded-3xl neu-card shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-orange-50 text-orange-600">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-base">Add New Academic Class</h3>
                  <p className="text-xs text-slate-400">Inserts standard record directly into MongoDB</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs font-medium">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-600 font-bold">Class Grade *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Class 13 / LKG"
                    value={formData.grade}
                    onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#EFF2F8] neu-inset rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-400/50"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-600 font-bold">Code Badge *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. STD-13"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    className="w-full px-3.5 py-2.5 bg-[#EFF2F8] neu-inset rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-400/50 uppercase"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-600 font-bold">Section Category</label>
                  <select
                    value={formData.section}
                    onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#EFF2F8] neu-inset rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-400/50"
                  >
                    <option value="Primary">Primary (1 - 5)</option>
                    <option value="Middle School">Middle School (6 - 8)</option>
                    <option value="Secondary">Secondary (9 - 10)</option>
                    <option value="Higher Secondary">Higher Secondary (11 - 12)</option>
                    <option value="Foundational">Foundational / Kindergarten</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-slate-600 font-bold">Affiliated Boards</label>
                  <input
                    type="text"
                    placeholder="CBSE, ICSE, WBCHSE"
                    value={formData.boards}
                    onChange={(e) => setFormData({ ...formData, boards: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#EFF2F8] neu-inset rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-400/50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-600 font-bold">Subjects Count</label>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={formData.subjectsCount}
                    onChange={(e) => setFormData({ ...formData, subjectsCount: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 bg-[#EFF2F8] neu-inset rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-400/50"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-600 font-bold">Enrolled Students</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.studentsCount}
                    onChange={(e) => setFormData({ ...formData, studentsCount: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 bg-[#EFF2F8] neu-inset rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-400/50"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-600 font-bold">Description (Optional)</label>
                <textarea
                  rows={2}
                  placeholder="Academic guidelines, syllabus summary..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
                    className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500"
                  />
                  <span className="text-slate-700 font-bold">Set as Active Standard</span>
                </label>
              </div>

              {/* Form Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-xl text-slate-500 hover:text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl neu-orange-button text-white font-bold shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving to MongoDB...</span>
                    </>
                  ) : (
                    <span>Insert Class</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT CLASS MODAL (UPDATE) */}
      {editingClass && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg p-6 bg-white rounded-3xl neu-card shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-orange-50 text-orange-600">
                  <Pencil className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-base">Edit Academic Standard</h3>
                  <p className="text-xs text-slate-400">Updates record directly in MongoDB Atlas</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingClass(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleUpdateSubmit} className="space-y-4 text-xs font-medium">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-600 font-bold">Class Grade *</label>
                  <input
                    type="text"
                    required
                    value={formData.grade}
                    onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#EFF2F8] neu-inset rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-400/50"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-600 font-bold">Code Badge *</label>
                  <input
                    type="text"
                    required
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    className="w-full px-3.5 py-2.5 bg-[#EFF2F8] neu-inset rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-400/50 uppercase"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-600 font-bold">Section Category</label>
                  <select
                    value={formData.section}
                    onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#EFF2F8] neu-inset rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-400/50"
                  >
                    <option value="Primary">Primary (1 - 5)</option>
                    <option value="Middle School">Middle School (6 - 8)</option>
                    <option value="Secondary">Secondary (9 - 10)</option>
                    <option value="Higher Secondary">Higher Secondary (11 - 12)</option>
                    <option value="Foundational">Foundational / Kindergarten</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-slate-600 font-bold">Affiliated Boards</label>
                  <input
                    type="text"
                    value={formData.boards}
                    onChange={(e) => setFormData({ ...formData, boards: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#EFF2F8] neu-inset rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-400/50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-600 font-bold">Subjects Count</label>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={formData.subjectsCount}
                    onChange={(e) => setFormData({ ...formData, subjectsCount: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 bg-[#EFF2F8] neu-inset rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-400/50"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-600 font-bold">Enrolled Students</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.studentsCount}
                    onChange={(e) => setFormData({ ...formData, studentsCount: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 bg-[#EFF2F8] neu-inset rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-400/50"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-600 font-bold">Description</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
                    className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500"
                  />
                  <span className="text-slate-700 font-bold">Active Standard</span>
                </label>
              </div>

              {/* Form Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingClass(null)}
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-xl text-slate-500 hover:text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl neu-orange-button text-white font-bold shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Updating in MongoDB...</span>
                    </>
                  ) : (
                    <span>Save Changes</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deletingClass && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md p-6 bg-white rounded-3xl neu-card shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-rose-50 text-rose-600">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-base">Delete Academic Class?</h3>
                <p className="text-xs text-slate-400">Permanently removes record from MongoDB</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to permanently delete{' '}
              <strong className="text-slate-900">{deletingClass.grade}</strong> (
              <span className="text-orange-600 font-bold">{deletingClass.code}</span>)? All
              associated configuration for this standard will be removed from your database.
            </p>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setDeletingClass(null)}
                disabled={isSubmitting}
                className="px-4 py-2 rounded-xl text-slate-500 hover:text-slate-700 font-semibold text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteSubmit}
                disabled={isSubmitting}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md transition-all disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Deleting from DB...</span>
                  </>
                ) : (
                  <span>Yes, Delete Class</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
