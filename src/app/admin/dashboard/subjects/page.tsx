'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Plus,
  ChevronRight,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Pencil,
  Trash2,
  X,
  Loader2,
  Layers,
  GraduationCap,
  FileQuestion,
  Sparkles,
  Tag,
  Palette,
  ExternalLink,
} from 'lucide-react';

interface SubjectItem {
  _id: string;
  name: string;
  code: string;
  board: string;
  classLevel: string;
  section: string;
  chaptersCount: number;
  questionsCount: number;
  color: string;
  description?: string;
  status: 'Active' | 'Inactive';
  createdAt?: string;
}

interface SubjectStats {
  totalSubjects: number;
  totalChapters: number;
  totalQuestions: number;
  activeCount: number;
}

interface BoardOption {
  shortCode: string;
  name: string;
}

interface ClassOption {
  grade: string;
  code: string;
}

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState<SubjectItem[]>([]);
  const [stats, setStats] = useState<SubjectStats>({
    totalSubjects: 0,
    totalChapters: 0,
    totalQuestions: 0,
    activeCount: 0,
  });

  // Dynamic Options fetched from MongoDB
  const [availableBoards, setAvailableBoards] = useState<BoardOption[]>([]);
  const [availableClasses, setAvailableClasses] = useState<ClassOption[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBoard, setSelectedBoard] = useState('All');
  const [selectedClass, setSelectedClass] = useState('All');
  const [selectedSection, setSelectedSection] = useState('All');

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<SubjectItem | null>(null);
  const [deletingSubject, setDeletingSubject] = useState<SubjectItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State (for Create & Edit)
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    board: 'CBSE',
    classLevel: 'Class 10',
    section: 'Secondary',
    chaptersCount: 12,
    questionsCount: 1500,
    color: '#EA580C',
    description: '',
    status: 'Active' as 'Active' | 'Inactive',
  });

  const colorPalette = [
    { label: 'Orange', value: '#EA580C' },
    { label: 'Blue', value: '#0284C7' },
    { label: 'Purple', value: '#8B5CF6' },
    { label: 'Green', value: '#10B981' },
    { label: 'Pink', value: '#EC4899' },
    { label: 'Amber', value: '#F59E0B' },
  ];

  // Fetch subjects from MongoDB Atlas API
  const fetchSubjects = async () => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const res = await fetch('/api/admin/subjects', { cache: 'no-store' });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to fetch subjects from MongoDB.');
      }

      setSubjects(data.subjects || []);
      if (data.stats) {
        setStats(data.stats);
      }
    } catch (err: any) {
      console.error('Error fetching subjects:', err);
      setErrorMessage(err.message || 'Could not connect to MongoDB database.');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch active boards & classes from MongoDB for dropdowns
  const fetchMetadata = async () => {
    try {
      // 1. Fetch Boards
      const boardsRes = await fetch('/api/admin/boards');
      const boardsData = await boardsRes.json();
      if (boardsData?.success && boardsData?.boards) {
        setAvailableBoards(
          boardsData.boards.map((b: any) => ({
            shortCode: b.shortCode,
            name: b.name,
          }))
        );
      }

      // 2. Fetch Classes
      const classesRes = await fetch('/api/admin/classes');
      const classesData = await classesRes.json();
      if (classesData?.success && classesData?.classes) {
        setAvailableClasses(
          classesData.classes.map((c: any) => ({
            grade: c.grade,
            code: c.code,
          }))
        );
      }
    } catch (e) {
      console.error('Error fetching boards/classes metadata:', e);
    }
  };

  useEffect(() => {
    fetchSubjects();
    fetchMetadata();
  }, []);

  // Filtered subjects list
  const filteredSubjects = subjects.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.board.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.classLevel.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesBoard =
      selectedBoard === 'All' || s.board.toLowerCase().includes(selectedBoard.toLowerCase());
    const matchesClass = selectedClass === 'All' || s.classLevel === selectedClass;
    const matchesSection = selectedSection === 'All' || s.section === selectedSection;

    return matchesSearch && matchesBoard && matchesClass && matchesSection;
  });

  // Open Create Modal
  const openCreateModal = () => {
    const defaultBoard = availableBoards.length > 0 ? availableBoards[0].shortCode : 'CBSE';
    const defaultClass = availableClasses.length > 0 ? availableClasses[9]?.grade || availableClasses[0].grade : 'Class 10';

    setFormData({
      name: '',
      code: '',
      board: defaultBoard,
      classLevel: defaultClass,
      section: 'Secondary',
      chaptersCount: 12,
      questionsCount: 250,
      color: '#EA580C',
      description: '',
      status: 'Active',
    });
    setIsCreateModalOpen(true);
  };

  // Open Edit Modal
  const openEditModal = (sub: SubjectItem) => {
    setEditingSubject(sub);
    setFormData({
      name: sub.name,
      code: sub.code,
      board: sub.board,
      classLevel: sub.classLevel,
      section: sub.section || 'General',
      chaptersCount: sub.chaptersCount,
      questionsCount: sub.questionsCount,
      color: sub.color || '#EA580C',
      description: sub.description || '',
      status: sub.status,
    });
  };

  // Auto-generate Subject Code when name/board/class change
  const handleNameChange = (nameVal: string) => {
    const acronym = nameVal
      .split(' ')
      .map((w) => w[0])
      .join('')
      .toUpperCase()
      .slice(0, 4);

    const classNum = formData.classLevel.replace(/[^0-9]/g, '') || '10';
    const boardCode = formData.board.split('/')[0].trim().toUpperCase();

    const suggestedCode = `${boardCode}-${acronym || 'SUB'}-${classNum}`;

    setFormData((prev) => ({
      ...prev,
      name: nameVal,
      code: prev.code && !prev.code.includes('-SUB-') ? prev.code : suggestedCode,
    }));
  };

  // Handle Create Subject (MongoDB POST)
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.code.trim()) {
      alert('Please provide Subject Name and Subject Code.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/admin/subjects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Could not insert subject into MongoDB.');
      }

      setSuccessMessage(
        `Subject "${data.subject.name}" for ${data.subject.classLevel} (${data.subject.board}) created in MongoDB!`
      );
      setTimeout(() => setSuccessMessage(''), 4000);
      setIsCreateModalOpen(false);
      await fetchSubjects();
    } catch (err: any) {
      alert(err.message || 'Create subject failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Update Subject (MongoDB PUT)
  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSubject) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/admin/subjects/${editingSubject._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Could not update subject in MongoDB.');
      }

      setSuccessMessage(`Subject "${formData.name}" updated successfully in MongoDB!`);
      setTimeout(() => setSuccessMessage(''), 4000);
      setEditingSubject(null);
      await fetchSubjects();
    } catch (err: any) {
      alert(err.message || 'Update subject failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Delete Subject (MongoDB DELETE)
  const handleDeleteSubmit = async () => {
    if (!deletingSubject) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/admin/subjects/${deletingSubject._id}`, {
        method: 'DELETE',
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Could not delete subject from MongoDB.');
      }

      setSuccessMessage(`Subject "${deletingSubject.name}" deleted from MongoDB.`);
      setTimeout(() => setSuccessMessage(''), 4000);
      setDeletingSubject(null);
      await fetchSubjects();
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
            onClick={fetchSubjects}
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
            <span className="text-orange-600 font-bold">Subjects</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight">
            Curriculum Subjects
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Manage subject streams, syllabus mappings, and question banks by Class and Board.
          </p>
        </div>

        {/* Action Button: Add Subject */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={fetchSubjects}
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
            <span>Add New Subject</span>
          </button>
        </div>
      </div>

      {/* Live MongoDB Summary Stats Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl neu-card flex items-center gap-3.5">
          <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-orange-50 text-orange-600 shadow-xs shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-black text-slate-800">
              {isLoading ? '...' : stats.totalSubjects}
            </div>
            <div className="text-xs text-slate-400 font-medium">Mapped Subjects</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl neu-card flex items-center gap-3.5">
          <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-purple-50 text-purple-600 shadow-xs shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-black text-slate-800">
              {isLoading ? '...' : stats.totalChapters.toLocaleString()}
            </div>
            <div className="text-xs text-slate-400 font-medium">Total Chapters</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl neu-card flex items-center gap-3.5">
          <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 shadow-xs shrink-0">
            <FileQuestion className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-black text-slate-800">
              {isLoading ? '...' : stats.totalQuestions.toLocaleString()}
            </div>
            <div className="text-xs text-slate-400 font-medium">Question Repository</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl neu-card flex items-center gap-3.5">
          <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-amber-50 text-amber-600 shadow-xs shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-black text-slate-800">
              {isLoading ? '...' : stats.activeCount}
            </div>
            <div className="text-xs text-slate-400 font-medium">Active Curriculums</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar (Board, Class, Section, Search) */}
      <div className="p-4 rounded-2xl neu-card flex flex-col lg:flex-row items-center justify-between gap-4">
        {/* Dropdown Filters */}
        <div className="flex items-center gap-2.5 flex-wrap w-full lg:w-auto">
          {/* Board Filter */}
          <div className="flex items-center gap-1 text-xs">
            <span className="text-slate-400 font-bold hidden sm:inline">Board:</span>
            <select
              value={selectedBoard}
              onChange={(e) => setSelectedBoard(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-[#EFF2F8] neu-inset text-slate-700 font-bold text-xs focus:outline-none focus:ring-2 focus:ring-orange-400/50"
            >
              <option value="All">All Boards</option>
              {availableBoards.map((b) => (
                <option key={b.shortCode} value={b.shortCode}>
                  {b.shortCode}
                </option>
              ))}
              <option value="CBSE">CBSE</option>
              <option value="WBBSE">WBBSE</option>
              <option value="ICSE">ICSE</option>
            </select>
          </div>

          {/* Class Filter */}
          <div className="flex items-center gap-1 text-xs">
            <span className="text-slate-400 font-bold hidden sm:inline">Class:</span>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-[#EFF2F8] neu-inset text-slate-700 font-bold text-xs focus:outline-none focus:ring-2 focus:ring-orange-400/50"
            >
              <option value="All">All Classes</option>
              {availableClasses.map((c) => (
                <option key={c.code} value={c.grade}>
                  {c.grade}
                </option>
              ))}
              <option value="Class 10">Class 10</option>
              <option value="Class 12">Class 12</option>
            </select>
          </div>

          {/* Section Filter */}
          <div className="flex items-center gap-1 text-xs">
            <span className="text-slate-400 font-bold hidden sm:inline">Section:</span>
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-[#EFF2F8] neu-inset text-slate-700 font-bold text-xs focus:outline-none focus:ring-2 focus:ring-orange-400/50"
            >
              <option value="All">All Sections</option>
              <option value="Secondary">Secondary (9 - 10)</option>
              <option value="Science">Higher Secondary (Science)</option>
              <option value="Commerce">Higher Secondary (Commerce)</option>
              <option value="Humanities">Higher Secondary (Humanities)</option>
              <option value="Middle School">Middle School (6 - 8)</option>
              <option value="Primary">Primary (1 - 5)</option>
            </select>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative w-full lg:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search subject or code..."
            suppressHydrationWarning
            className="w-full pl-9 pr-4 py-2 bg-[#EFF2F8] neu-inset text-xs font-medium text-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400/40"
          />
        </div>
      </div>

      {/* Main Grid of Subjects (Connected to MongoDB) */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="p-5 rounded-2xl neu-card animate-pulse space-y-4">
              <div className="flex justify-between items-center">
                <div className="w-11 h-11 bg-slate-200 rounded-xl" />
                <div className="w-20 h-5 bg-slate-200 rounded-full" />
              </div>
              <div className="w-3/4 h-5 bg-slate-200 rounded" />
              <div className="w-full h-3.5 bg-slate-200 rounded" />
              <div className="pt-3 border-t border-slate-100 flex justify-between">
                <div className="w-24 h-4 bg-slate-200 rounded" />
                <div className="w-20 h-4 bg-slate-200 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredSubjects.length === 0 ? (
        <div className="p-12 text-center rounded-2xl neu-card space-y-3">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-orange-50 flex items-center justify-center text-orange-500">
            <BookOpen className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-800 text-base">No Curriculum Subjects Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            {searchQuery || selectedBoard !== 'All' || selectedClass !== 'All'
              ? 'No subjects match your selected filters. Try adjusting board, class or keyword.'
              : 'No subjects created yet. Click below to add the first subject to MongoDB.'}
          </p>
          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl neu-orange-button text-white text-xs font-bold shadow-md"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span>Add Subject</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredSubjects.map((s) => (
            <div
              key={s._id}
              className="p-5 rounded-2xl neu-card neu-card-hover flex flex-col justify-between relative group transition-all"
            >
              <div>
                {/* Card Top: Colored Icon + Code Badge + Actions */}
                <div className="flex items-center justify-between mb-3.5">
                  <div
                    className="flex items-center justify-center w-11 h-11 rounded-xl shadow-xs"
                    style={{ backgroundColor: `${s.color || '#EA580C'}15`, color: s.color || '#EA580C' }}
                  >
                    <BookOpen className="w-5 h-5" />
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200/60 font-mono">
                      {s.code}
                    </span>

                    {/* Edit / Delete Buttons */}
                    <div className="flex items-center opacity-70 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        onClick={() => openEditModal(s)}
                        title="Edit Subject (Update in MongoDB)"
                        className="p-1 rounded-lg text-slate-400 hover:text-orange-600 hover:bg-orange-50 transition-colors"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeletingSubject(s)}
                        title="Delete Subject (Remove from MongoDB)"
                        className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Subject Name */}
                <h3 className="text-lg font-bold text-slate-800 group-hover:text-orange-600 transition-colors line-clamp-1">
                  {s.name}
                </h3>

                {/* Board & Class & Section Badges */}
                <div className="flex items-center gap-2 flex-wrap mt-2">
                  <span className="px-2 py-0.5 rounded-md bg-orange-50 border border-orange-200/60 text-orange-700 text-[11px] font-bold">
                    {s.board}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-purple-50 border border-purple-200/60 text-purple-700 text-[11px] font-bold">
                    {s.classLevel}
                  </span>
                  {s.section && (
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[11px] font-medium">
                      {s.section}
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                  {s.description || 'Comprehensive curriculum subject and repository questions.'}
                </p>
              </div>

              {/* Card Footer: Metrics & View Questions */}
              <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs font-semibold">
                <div className="flex items-center gap-3 text-slate-500 text-[11px]">
                  <span>{s.chaptersCount} Chapters</span>
                  <span>•</span>
                  <span>{s.questionsCount.toLocaleString()} Questions</span>
                </div>

                <Link
                  href={`/admin/dashboard/questions?subject=${encodeURIComponent(s.name)}`}
                  className="flex items-center gap-1 text-orange-600 hover:text-orange-700 font-bold group-hover:translate-x-0.5 transition-transform"
                >
                  <span>Questions</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CREATE SUBJECT MODAL (INSERT) */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl p-6 bg-white rounded-3xl neu-card shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-orange-50 text-orange-600">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-base">Add New Curriculum Subject</h3>
                  <p className="text-xs text-slate-400">
                    Maps subject to specific Educational Board, Class, and Section
                  </p>
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
              {/* Row 1: Subject Name & Code */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-600 font-bold">Subject Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mathematics, Physics, Chemistry"
                    value={formData.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#EFF2F8] neu-inset rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-400/50"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-600 font-bold">Subject Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. CBSE-MATH-10"
                    value={formData.code}
                    onChange={(e) =>
                      setFormData({ ...formData, code: e.target.value.toUpperCase() })
                    }
                    className="w-full px-3.5 py-2.5 bg-[#EFF2F8] neu-inset rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-400/50 uppercase"
                  />
                </div>
              </div>

              {/* Row 2: Board & Class (Core Requirement) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-600 font-bold flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-orange-600" />
                    <span>Educational Board *</span>
                  </label>
                  <select
                    value={formData.board}
                    onChange={(e) => {
                      const newBoard = e.target.value;
                      setFormData((prev) => ({
                        ...prev,
                        board: newBoard,
                        code: prev.name
                          ? `${newBoard.split('/')[0].trim().toUpperCase()}-${prev.name
                              .split(' ')
                              .map((w) => w[0])
                              .join('')
                              .toUpperCase()
                              .slice(0, 4)}-${prev.classLevel.replace(/[^0-9]/g, '') || '10'}`
                          : prev.code,
                      }));
                    }}
                    className="w-full px-3.5 py-2.5 bg-[#EFF2F8] neu-inset rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-400/50 font-semibold"
                  >
                    {availableBoards.length > 0 ? (
                      availableBoards.map((b) => (
                        <option key={b.shortCode} value={b.shortCode}>
                          {b.shortCode} - {b.name}
                        </option>
                      ))
                    ) : (
                      <>
                        <option value="CBSE">CBSE (Central Board)</option>
                        <option value="WBBSE / WBCHSE">WBBSE / WBCHSE (West Bengal)</option>
                        <option value="ICSE / ISC">ICSE / ISC (CISCE)</option>
                        <option value="MSBSHSE">MSBSHSE (Maharashtra)</option>
                        <option value="CAIE">CAIE (Cambridge)</option>
                      </>
                    )}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-600 font-bold flex items-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5 text-amber-600" />
                    <span>Target Class *</span>
                  </label>
                  <select
                    value={formData.classLevel}
                    onChange={(e) => {
                      const newClass = e.target.value;
                      setFormData((prev) => ({
                        ...prev,
                        classLevel: newClass,
                        code: prev.name
                          ? `${prev.board.split('/')[0].trim().toUpperCase()}-${prev.name
                              .split(' ')
                              .map((w) => w[0])
                              .join('')
                              .toUpperCase()
                              .slice(0, 4)}-${newClass.replace(/[^0-9]/g, '') || '10'}`
                          : prev.code,
                      }));
                    }}
                    className="w-full px-3.5 py-2.5 bg-[#EFF2F8] neu-inset rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-400/50 font-semibold"
                  >
                    {availableClasses.length > 0 ? (
                      availableClasses.map((c) => (
                        <option key={c.code} value={c.grade}>
                          {c.grade} ({c.code})
                        </option>
                      ))
                    ) : (
                      <>
                        <option value="Class 1">Class 1</option>
                        <option value="Class 5">Class 5</option>
                        <option value="Class 8">Class 8</option>
                        <option value="Class 9">Class 9</option>
                        <option value="Class 10">Class 10</option>
                        <option value="Class 11">Class 11</option>
                        <option value="Class 12">Class 12</option>
                      </>
                    )}
                  </select>
                </div>
              </div>

              {/* Row 3: Section / Stream (Core Requirement) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-600 font-bold">Academic Section / Stream *</label>
                  <select
                    value={formData.section}
                    onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#EFF2F8] neu-inset rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-400/50 font-semibold"
                  >
                    <option value="Secondary">Secondary (General 9 - 10)</option>
                    <option value="Science">Higher Secondary (Science Stream)</option>
                    <option value="Commerce">Higher Secondary (Commerce Stream)</option>
                    <option value="Humanities">Higher Secondary (Arts / Humanities)</option>
                    <option value="Middle School">Middle School (6 - 8)</option>
                    <option value="Primary">Primary (1 - 5)</option>
                    <option value="Vocational">Vocational / Elective</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-600 font-bold">Accent Color Theme</label>
                  <div className="flex items-center gap-2 pt-1.5">
                    {colorPalette.map((c) => (
                      <button
                        key={c.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, color: c.value })}
                        style={{ backgroundColor: c.value }}
                        className={`w-7 h-7 rounded-xl transition-all ${
                          formData.color === c.value
                            ? 'ring-2 ring-offset-2 ring-slate-800 scale-110 shadow-sm'
                            : 'opacity-70 hover:opacity-100'
                        }`}
                        title={c.label}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Row 4: Chapters and Questions */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-600 font-bold">Total Chapters</label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={formData.chaptersCount}
                    onChange={(e) =>
                      setFormData({ ...formData, chaptersCount: Number(e.target.value) })
                    }
                    className="w-full px-3.5 py-2.5 bg-[#EFF2F8] neu-inset rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-400/50"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-600 font-bold">Initial Questions</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.questionsCount}
                    onChange={(e) =>
                      setFormData({ ...formData, questionsCount: Number(e.target.value) })
                    }
                    className="w-full px-3.5 py-2.5 bg-[#EFF2F8] neu-inset rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-400/50"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-600 font-bold">Description / Syllabus Scope</label>
                <textarea
                  rows={2}
                  placeholder="Topics covered, key units, textbooks, lab requirements..."
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
                  <span className="text-slate-700 font-bold">Active Curriculum Subject</span>
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
                    <span>Create Subject</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT SUBJECT MODAL (UPDATE) */}
      {editingSubject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl p-6 bg-white rounded-3xl neu-card shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-orange-50 text-orange-600">
                  <Pencil className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-base">Edit Curriculum Subject</h3>
                  <p className="text-xs text-slate-400">Update subject settings in MongoDB Atlas</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingSubject(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleUpdateSubmit} className="space-y-4 text-xs font-medium">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-600 font-bold">Subject Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#EFF2F8] neu-inset rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-400/50"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-600 font-bold">Subject Code *</label>
                  <input
                    type="text"
                    required
                    value={formData.code}
                    onChange={(e) =>
                      setFormData({ ...formData, code: e.target.value.toUpperCase() })
                    }
                    className="w-full px-3.5 py-2.5 bg-[#EFF2F8] neu-inset rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-400/50 uppercase"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-600 font-bold flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-orange-600" />
                    <span>Educational Board *</span>
                  </label>
                  <select
                    value={formData.board}
                    onChange={(e) => setFormData({ ...formData, board: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#EFF2F8] neu-inset rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-400/50 font-semibold"
                  >
                    {availableBoards.length > 0 ? (
                      availableBoards.map((b) => (
                        <option key={b.shortCode} value={b.shortCode}>
                          {b.shortCode} - {b.name}
                        </option>
                      ))
                    ) : (
                      <>
                        <option value="CBSE">CBSE</option>
                        <option value="WBBSE / WBCHSE">WBBSE / WBCHSE</option>
                        <option value="ICSE / ISC">ICSE / ISC</option>
                      </>
                    )}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-600 font-bold flex items-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5 text-amber-600" />
                    <span>Target Class *</span>
                  </label>
                  <select
                    value={formData.classLevel}
                    onChange={(e) => setFormData({ ...formData, classLevel: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#EFF2F8] neu-inset rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-400/50 font-semibold"
                  >
                    {availableClasses.length > 0 ? (
                      availableClasses.map((c) => (
                        <option key={c.code} value={c.grade}>
                          {c.grade}
                        </option>
                      ))
                    ) : (
                      <>
                        <option value="Class 10">Class 10</option>
                        <option value="Class 12">Class 12</option>
                      </>
                    )}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-600 font-bold">Academic Section / Stream</label>
                  <select
                    value={formData.section}
                    onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#EFF2F8] neu-inset rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-400/50 font-semibold"
                  >
                    <option value="Secondary">Secondary (General 9 - 10)</option>
                    <option value="Science">Higher Secondary (Science Stream)</option>
                    <option value="Commerce">Higher Secondary (Commerce Stream)</option>
                    <option value="Humanities">Higher Secondary (Arts / Humanities)</option>
                    <option value="Middle School">Middle School (6 - 8)</option>
                    <option value="Primary">Primary (1 - 5)</option>
                    <option value="Vocational">Vocational / Elective</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-600 font-bold">Accent Color</label>
                  <div className="flex items-center gap-2 pt-1.5">
                    {colorPalette.map((c) => (
                      <button
                        key={c.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, color: c.value })}
                        style={{ backgroundColor: c.value }}
                        className={`w-7 h-7 rounded-xl transition-all ${
                          formData.color === c.value
                            ? 'ring-2 ring-offset-2 ring-slate-800 scale-110 shadow-sm'
                            : 'opacity-70 hover:opacity-100'
                        }`}
                        title={c.label}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-600 font-bold">Total Chapters</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.chaptersCount}
                    onChange={(e) =>
                      setFormData({ ...formData, chaptersCount: Number(e.target.value) })
                    }
                    className="w-full px-3.5 py-2.5 bg-[#EFF2F8] neu-inset rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-400/50"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-600 font-bold">Questions Count</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.questionsCount}
                    onChange={(e) =>
                      setFormData({ ...formData, questionsCount: Number(e.target.value) })
                    }
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
                  <span className="text-slate-700 font-bold">Active Curriculum Subject</span>
                </label>
              </div>

              {/* Form Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingSubject(null)}
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

      {/* DELETE SUBJECT CONFIRMATION MODAL */}
      {deletingSubject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md p-6 bg-white rounded-3xl neu-card shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-rose-50 text-rose-600">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-base">Delete Curriculum Subject?</h3>
                <p className="text-xs text-slate-400">Permanently removes subject from MongoDB</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to permanently delete{' '}
              <strong className="text-slate-900">{deletingSubject.name}</strong> (
              <span className="text-orange-600 font-bold">{deletingSubject.code}</span>) under{' '}
              <span className="font-semibold text-slate-800">{deletingSubject.classLevel}</span> (
              {deletingSubject.board})?
            </p>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setDeletingSubject(null)}
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
                  <span>Yes, Delete Subject</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
