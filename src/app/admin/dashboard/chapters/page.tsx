'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  BookText,
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
  BookOpen,
  FileQuestion,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

interface ChapterItem {
  _id: string;
  name: string;
  chapterNumber: number;
  subjectName: string;
  board: string;
  classLevel: string;
  totalQuestions: number;
  topics: string[];
  description?: string;
  status: 'Active' | 'Inactive';
  createdAt?: string;
}

interface ChapterStats {
  totalChapters: number;
  totalQuestions: number;
  uniqueSubjectsCount: number;
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

interface SubjectOption {
  name: string;
  board: string;
  classLevel: string;
}

export default function ChaptersPage() {
  const [chapters, setChapters] = useState<ChapterItem[]>([]);
  const [stats, setStats] = useState<ChapterStats>({
    totalChapters: 0,
    totalQuestions: 0,
    uniqueSubjectsCount: 0,
    activeCount: 0,
  });

  // Metadata from MongoDB
  const [availableBoards, setAvailableBoards] = useState<BoardOption[]>([]);
  const [availableClasses, setAvailableClasses] = useState<ClassOption[]>([]);
  const [availableSubjects, setAvailableSubjects] = useState<SubjectOption[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBoard, setSelectedBoard] = useState('All');
  const [selectedClass, setSelectedClass] = useState('All');
  const [selectedSubject, setSelectedSubject] = useState('All');

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingChapter, setEditingChapter] = useState<ChapterItem | null>(null);
  const [deletingChapter, setDeletingChapter] = useState<ChapterItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State (for both Create & Edit)
  const [formData, setFormData] = useState({
    name: '',
    chapterNumber: 1,
    subjectName: 'Mathematics',
    board: 'CBSE',
    classLevel: 'Class 10',
    totalQuestions: 100,
    topicsText: '',
    description: '',
    status: 'Active' as 'Active' | 'Inactive',
  });

  // Fetch Chapters from MongoDB Atlas API
  const fetchChapters = async () => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const res = await fetch('/api/admin/chapters', { cache: 'no-store' });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to fetch chapters from MongoDB.');
      }

      setChapters(data.chapters || []);
      if (data.stats) {
        setStats(data.stats);
      }
    } catch (err: any) {
      console.error('Error fetching chapters:', err);
      setErrorMessage(err.message || 'Could not connect to MongoDB database.');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch Boards, Classes, and Subjects for dynamic selectors
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

      // 3. Fetch Subjects
      const subjectsRes = await fetch('/api/admin/subjects');
      const subjectsData = await subjectsRes.json();
      if (subjectsData?.success && subjectsData?.subjects) {
        setAvailableSubjects(
          subjectsData.subjects.map((s: any) => ({
            name: s.name,
            board: s.board,
            classLevel: s.classLevel,
          }))
        );
      }
    } catch (e) {
      console.error('Error loading metadata:', e);
    }
  };

  useEffect(() => {
    fetchChapters();
    fetchMetadata();
  }, []);

  // Filter dynamic subjects based on chosen board & class in modal
  const modalSubjectOptions = availableSubjects.filter((s) => {
    const matchBoard =
      !formData.board || s.board.toLowerCase().includes(formData.board.toLowerCase());
    const matchClass = !formData.classLevel || s.classLevel === formData.classLevel;
    return matchBoard && matchClass;
  });

  // Filtered chapters list for display
  const filteredChapters = chapters.filter((ch) => {
    const matchesSearch =
      ch.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ch.subjectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ch.board.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ch.classLevel.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesBoard =
      selectedBoard === 'All' || ch.board.toLowerCase().includes(selectedBoard.toLowerCase());
    const matchesClass = selectedClass === 'All' || ch.classLevel === selectedClass;
    const matchesSubject =
      selectedSubject === 'All' ||
      ch.subjectName.toLowerCase() === selectedSubject.toLowerCase();

    return matchesSearch && matchesBoard && matchesClass && matchesSubject;
  });

  // Open Create Modal
  const openCreateModal = () => {
    const defaultBoard = availableBoards.length > 0 ? availableBoards[0].shortCode : 'CBSE';
    const defaultClass =
      availableClasses.length > 0
        ? availableClasses[9]?.grade || availableClasses[0].grade
        : 'Class 10';
    const defaultSubject =
      availableSubjects.length > 0 ? availableSubjects[0].name : 'Mathematics';

    setFormData({
      name: '',
      chapterNumber: chapters.length + 1,
      subjectName: defaultSubject,
      board: defaultBoard,
      classLevel: defaultClass,
      totalQuestions: 100,
      topicsText: '',
      description: '',
      status: 'Active',
    });
    setIsCreateModalOpen(true);
  };

  // Open Edit Modal
  const openEditModal = (ch: ChapterItem) => {
    setEditingChapter(ch);
    setFormData({
      name: ch.name,
      chapterNumber: ch.chapterNumber || 1,
      subjectName: ch.subjectName,
      board: ch.board,
      classLevel: ch.classLevel,
      totalQuestions: ch.totalQuestions || 0,
      topicsText: ch.topics ? ch.topics.join(', ') : '',
      description: ch.description || '',
      status: ch.status,
    });
  };

  // Handle Create Chapter (MongoDB POST)
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.subjectName.trim()) {
      alert('Please provide Chapter Name and Subject.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/admin/chapters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          topics: formData.topicsText,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Could not insert chapter into MongoDB.');
      }

      setSuccessMessage(
        `Chapter "${data.chapter.name}" created under ${data.chapter.subjectName} (${data.chapter.classLevel}) in MongoDB!`
      );
      setTimeout(() => setSuccessMessage(''), 4000);
      setIsCreateModalOpen(false);
      await fetchChapters();
    } catch (err: any) {
      alert(err.message || 'Create chapter failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Update Chapter (MongoDB PUT)
  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingChapter) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/admin/chapters/${editingChapter._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          topics: formData.topicsText,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Could not update chapter in MongoDB.');
      }

      setSuccessMessage(`Chapter "${formData.name}" updated successfully in MongoDB!`);
      setTimeout(() => setSuccessMessage(''), 4000);
      setEditingChapter(null);
      await fetchChapters();
    } catch (err: any) {
      alert(err.message || 'Update chapter failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Delete Chapter (MongoDB DELETE)
  const handleDeleteSubmit = async () => {
    if (!deletingChapter) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/admin/chapters/${deletingChapter._id}`, {
        method: 'DELETE',
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Could not delete chapter from MongoDB.');
      }

      setSuccessMessage(`Chapter "${deletingChapter.name}" removed from MongoDB.`);
      setTimeout(() => setSuccessMessage(''), 4000);
      setDeletingChapter(null);
      await fetchChapters();
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
            onClick={fetchChapters}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white text-rose-700 hover:bg-rose-100/70 border border-rose-300 text-xs font-bold transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry Connection</span>
          </button>
        </div>
      )}

      {/* Header (Matching Screenshot) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-1">
            <Link href="/admin/dashboard" className="hover:text-orange-500 transition-colors">
              Dashboard
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-orange-600 font-bold">Chapters</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight">
            Curriculum Chapters
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Organize chapters, topics, learning goals, and question mapping.
          </p>
        </div>

        {/* Action Button: Add Chapter */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={fetchChapters}
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
            <span>Add New Chapter</span>
          </button>
        </div>
      </div>

      {/* Summary Stat Cards Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl neu-card flex items-center gap-3.5">
          <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-orange-50 text-orange-600 shadow-xs shrink-0">
            <BookText className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-black text-slate-800">
              {isLoading ? '...' : stats.totalChapters}
            </div>
            <div className="text-xs text-slate-400 font-medium">Total Chapters</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl neu-card flex items-center gap-3.5">
          <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-purple-50 text-purple-600 shadow-xs shrink-0">
            <FileQuestion className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-black text-slate-800">
              {isLoading ? '...' : stats.totalQuestions.toLocaleString()}
            </div>
            <div className="text-xs text-slate-400 font-medium">Mapped Questions</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl neu-card flex items-center gap-3.5">
          <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 shadow-xs shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-black text-slate-800">
              {isLoading ? '...' : stats.uniqueSubjectsCount}
            </div>
            <div className="text-xs text-slate-400 font-medium">Covered Subjects</div>
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
            <div className="text-xs text-slate-400 font-medium">Active Chapters</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar (Board, Class, and Subject Based!) */}
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
              <option value="Class 9">Class 9</option>
              <option value="Class 12">Class 12</option>
            </select>
          </div>

          {/* Subject Filter (Dynamic) */}
          <div className="flex items-center gap-1 text-xs">
            <span className="text-slate-400 font-bold hidden sm:inline">Subject:</span>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-[#EFF2F8] neu-inset text-slate-700 font-bold text-xs focus:outline-none focus:ring-2 focus:ring-orange-400/50 max-w-[180px] truncate"
            >
              <option value="All">All Subjects</option>
              {Array.from(new Set(availableSubjects.map((s) => s.name))).map((sName) => (
                <option key={sName} value={sName}>
                  {sName}
                </option>
              ))}
              <option value="Mathematics">Mathematics</option>
              <option value="Physics">Physics</option>
              <option value="Chemistry">Chemistry</option>
              <option value="Biology">Biology</option>
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
            placeholder="Search chapters or topics..."
            suppressHydrationWarning
            className="w-full pl-9 pr-4 py-2 bg-[#EFF2F8] neu-inset text-xs font-medium text-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400/40"
          />
        </div>
      </div>

      {/* Main Table View (Matching Screenshot Exact Look) */}
      <div className="p-6 rounded-2xl neu-card overflow-x-auto shadow-sm">
        {isLoading ? (
          <div className="py-12 flex flex-col items-center justify-center space-y-3">
            <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
            <p className="text-xs text-slate-400 font-medium">Loading chapters from MongoDB...</p>
          </div>
        ) : filteredChapters.length === 0 ? (
          <div className="py-12 text-center space-y-3">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-orange-50 flex items-center justify-center text-orange-500">
              <BookText className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-800 text-base">No Curriculum Chapters Found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              {searchQuery || selectedBoard !== 'All' || selectedClass !== 'All' || selectedSubject !== 'All'
                ? 'No chapters match your selected filters. Adjust your filters or add a new chapter.'
                : 'No chapters created in the database yet. Click below to add one.'}
            </p>
            <button
              type="button"
              onClick={openCreateModal}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl neu-orange-button text-white text-xs font-bold shadow-md"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span>Add First Chapter</span>
            </button>
          </div>
        ) : (
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-4 px-4">CHAPTER NAME</th>
                <th className="py-4 px-4">SUBJECT</th>
                <th className="py-4 px-4">STANDARD</th>
                <th className="py-4 px-4">TOTAL QUESTIONS</th>
                <th className="py-4 px-4 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredChapters.map((ch) => (
                <tr key={ch._id} className="hover:bg-slate-50/80 transition-colors group">
                  {/* Chapter Name & Topics Badge */}
                  <td className="py-3.5 px-4 font-bold text-slate-800">
                    <div className="flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center text-[10px] font-extrabold shrink-0">
                        {ch.chapterNumber || '#'}
                      </span>
                      <div>
                        <span className="group-hover:text-orange-600 transition-colors block">
                          {ch.name}
                        </span>
                        {ch.topics && ch.topics.length > 0 && (
                          <span className="text-[10px] text-slate-400 font-normal line-clamp-1">
                            Topics: {ch.topics.join(' • ')}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Subject Name + Board Badge */}
                  <td className="py-3.5 px-4 font-semibold text-slate-700">
                    <div>
                      <span>{ch.subjectName}</span>
                      <span className="block text-[10px] text-slate-400 font-medium">
                        {ch.board}
                      </span>
                    </div>
                  </td>

                  {/* Standard / Class */}
                  <td className="py-3.5 px-4 text-slate-600 font-semibold">
                    <span className="px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 text-[11px] font-bold">
                      {ch.classLevel}
                    </span>
                  </td>

                  {/* Total Questions (Matching Screenshot Orange Text) */}
                  <td className="py-3.5 px-4 font-extrabold text-orange-600">
                    {ch.totalQuestions} Qs
                  </td>

                  {/* Actions: Edit / View and Delete */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="inline-flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => openEditModal(ch)}
                        className="text-orange-600 font-bold hover:text-orange-700 hover:underline px-2 py-1 rounded-lg transition-colors"
                      >
                        Edit / View
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeletingChapter(ch)}
                        title="Delete from MongoDB"
                        className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* CREATE CHAPTER MODAL (INSERT) */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl p-6 bg-white rounded-3xl neu-card shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-orange-50 text-orange-600">
                  <BookText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-base">Add New Curriculum Chapter</h3>
                  <p className="text-xs text-slate-400">
                    Create chapter under specific Board, Class, and Subject
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
              {/* Row 1: Board & Class (Core Requirement) */}
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
                        <option value="Class 9">Class 9</option>
                        <option value="Class 12">Class 12</option>
                      </>
                    )}
                  </select>
                </div>
              </div>

              {/* Row 2: Parent Subject (Dynamically filtered) */}
              <div className="space-y-1">
                <label className="text-slate-600 font-bold flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-purple-600" />
                  <span>Curriculum Subject *</span>
                </label>
                <div className="relative">
                  <select
                    value={formData.subjectName}
                    onChange={(e) => setFormData({ ...formData, subjectName: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#EFF2F8] neu-inset rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-400/50 font-semibold"
                  >
                    {modalSubjectOptions.length > 0 ? (
                      modalSubjectOptions.map((s, idx) => (
                        <option key={idx} value={s.name}>
                          {s.name} ({s.classLevel} - {s.board})
                        </option>
                      ))
                    ) : availableSubjects.length > 0 ? (
                      availableSubjects.map((s, idx) => (
                        <option key={idx} value={s.name}>
                          {s.name} ({s.classLevel} - {s.board})
                        </option>
                      ))
                    ) : (
                      <>
                        <option value="Mathematics">Mathematics</option>
                        <option value="Physics">Physics</option>
                        <option value="Chemistry">Chemistry</option>
                        <option value="Biology">Biology</option>
                      </>
                    )}
                  </select>
                </div>
              </div>

              {/* Row 3: Chapter Name & Chapter Sequence Number */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-slate-600 font-bold">Chapter Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Trigonometric Ratios & Identities"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#EFF2F8] neu-inset rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-400/50"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-600 font-bold">Chapter #</label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={formData.chapterNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, chapterNumber: Number(e.target.value) })
                    }
                    className="w-full px-3.5 py-2.5 bg-[#EFF2F8] neu-inset rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-400/50"
                  />
                </div>
              </div>

              {/* Row 4: Total Questions Count */}
              <div className="space-y-1">
                <label className="text-slate-600 font-bold">Total Questions in Chapter</label>
                <input
                  type="number"
                  min="0"
                  value={formData.totalQuestions}
                  onChange={(e) =>
                    setFormData({ ...formData, totalQuestions: Number(e.target.value) })
                  }
                  className="w-full px-3.5 py-2.5 bg-[#EFF2F8] neu-inset rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-400/50"
                />
              </div>

              {/* Row 5: Topics / Learning Objectives */}
              <div className="space-y-1">
                <label className="text-slate-600 font-bold">
                  Topics / Sub-units (Comma separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Ratios of Acute Angles, Proofs, Angle Identities"
                  value={formData.topicsText}
                  onChange={(e) => setFormData({ ...formData, topicsText: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#EFF2F8] neu-inset rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-400/50"
                />
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="text-slate-600 font-bold">Description / Syllabus Notes</label>
                <textarea
                  rows={2}
                  placeholder="Important formulas, textbook references, board weightage..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#EFF2F8] neu-inset rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-400/50"
                />
              </div>

              {/* Status */}
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
                  <span className="text-slate-700 font-bold">Active Curriculum Chapter</span>
                </label>
              </div>

              {/* Action Buttons */}
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
                    <span>Create Chapter</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT / VIEW CHAPTER MODAL (UPDATE) */}
      {editingChapter && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl p-6 bg-white rounded-3xl neu-card shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-orange-50 text-orange-600">
                  <Pencil className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-base">Edit / View Chapter</h3>
                  <p className="text-xs text-slate-400">Update chapter details in MongoDB Atlas</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingChapter(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleUpdateSubmit} className="space-y-4 text-xs font-medium">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-600 font-bold">Board *</label>
                  <select
                    value={formData.board}
                    onChange={(e) => setFormData({ ...formData, board: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#EFF2F8] neu-inset rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-400/50 font-semibold"
                  >
                    {availableBoards.length > 0 ? (
                      availableBoards.map((b) => (
                        <option key={b.shortCode} value={b.shortCode}>
                          {b.shortCode}
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
                  <label className="text-slate-600 font-bold">Class *</label>
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
                        <option value="Class 9">Class 9</option>
                      </>
                    )}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-600 font-bold">Subject *</label>
                <input
                  type="text"
                  required
                  value={formData.subjectName}
                  onChange={(e) => setFormData({ ...formData, subjectName: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#EFF2F8] neu-inset rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-400/50 font-semibold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-slate-600 font-bold">Chapter Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#EFF2F8] neu-inset rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-400/50"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-600 font-bold">Chapter #</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.chapterNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, chapterNumber: Number(e.target.value) })
                    }
                    className="w-full px-3.5 py-2.5 bg-[#EFF2F8] neu-inset rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-400/50"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-600 font-bold">Total Questions</label>
                <input
                  type="number"
                  min="0"
                  value={formData.totalQuestions}
                  onChange={(e) =>
                    setFormData({ ...formData, totalQuestions: Number(e.target.value) })
                  }
                  className="w-full px-3.5 py-2.5 bg-[#EFF2F8] neu-inset rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-400/50"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-600 font-bold">Topics (Comma separated)</label>
                <input
                  type="text"
                  value={formData.topicsText}
                  onChange={(e) => setFormData({ ...formData, topicsText: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#EFF2F8] neu-inset rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-400/50"
                />
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
                  <span className="text-slate-700 font-bold">Active Chapter</span>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingChapter(null)}
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

      {/* DELETE CHAPTER CONFIRMATION MODAL */}
      {deletingChapter && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md p-6 bg-white rounded-3xl neu-card shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-rose-50 text-rose-600">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-base">Delete Curriculum Chapter?</h3>
                <p className="text-xs text-slate-400">Permanently removes chapter from MongoDB</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to permanently delete{' '}
              <strong className="text-slate-900">{deletingChapter.name}</strong> under{' '}
              <span className="font-semibold text-slate-800">{deletingChapter.subjectName}</span> (
              {deletingChapter.classLevel} - {deletingChapter.board})?
            </p>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setDeletingChapter(null)}
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
                  <span>Yes, Delete Chapter</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
