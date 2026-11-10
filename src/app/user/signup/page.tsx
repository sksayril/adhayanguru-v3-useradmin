'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  GraduationCap,
  Sparkles,
  BookOpen,
  Award,
  ArrowRight,
  Shield,
  Eye,
  EyeOff,
  User,
  Mail,
  Phone,
  Lock,
  Layers,
  ArrowUpRight,
  CheckCircle2,
} from 'lucide-react';

export default function UserSignupPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [grade, setGrade] = useState('Class 10');
  const [board, setBoard] = useState('CBSE');
  const [parentPhone, setParentPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [success, setSuccess] = useState(false);

  const classes = ['Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'];
  const boards = ['CBSE', 'ICSE', 'WBCHSE (State Board)', 'Cambridge (CAIE)', 'IB Continuum'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !password) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please verify.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      const res = await fetch('/api/user/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: fullName,
          email,
          password,
          classLevel: grade,
          board,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMessage(data.message || 'Signup failed. Please try again.');
        setIsLoading(false);
        return;
      }

      setSuccess(true);
      if (typeof window !== 'undefined' && data.student) {
        localStorage.setItem('student_user', JSON.stringify(data.student));
      }

      setTimeout(() => {
        router.push('/user/dashboard');
      }, 500);
    } catch (err: any) {
      console.error('Student signup error:', err);
      setErrorMessage('Database error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-100 flex flex-col justify-between">
      {/* Top Navbar */}
      <header className="px-6 py-4 border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-extrabold text-white text-base tracking-tight block">Dekh Education</span>
            <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block">Student Learning Portal</span>
          </div>
        </div>

        {/* Link to Admin Portal */}
        <Link
          href="/admin/login"
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-xs font-semibold text-slate-300 hover:text-white transition-all group"
        >
          <Shield className="w-3.5 h-3.5 text-orange-400" />
          <span>Faculty / Admin Portal</span>
          <ArrowUpRight className="w-3 h-3 text-slate-400 group-hover:text-white transition-colors" />
        </Link>
      </header>

      {/* Main Split-Screen Section */}
      <main className="flex-1 max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 items-center p-4 sm:p-8 gap-8 lg:gap-12 py-8">
        {/* Left Side: Features and Value Proposition */}
        <div className="lg:col-span-5 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>100% Free Curriculum Enrollment</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
            Join Thousands of High-Achieving Students.
          </h1>

          <p className="text-sm text-slate-400 leading-relaxed">
            Get instant access to curated questions, instant AI formula checkers, chapter revision notes, and full mock test papers.
          </p>

          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-800/40 border border-slate-800">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
                <BookOpen className="w-4 h-4" />
              </div>
              <span className="text-xs font-medium text-slate-300">
                NCERT & Board Aligned Chapter Solutions
              </span>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-800/40 border border-slate-800">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <Award className="w-4 h-4" />
              </div>
              <span className="text-xs font-medium text-slate-300">
                Verified Answer Keys and Step-by-Step Marking
              </span>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-800/40 border border-slate-800">
              <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
                <Layers className="w-4 h-4" />
              </div>
              <span className="text-xs font-medium text-slate-300">
                Personalized Weakness Analysis & Revision Reminders
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: Student Registration Form */}
        <div className="lg:col-span-7 w-full max-w-lg mx-auto">
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl relative overflow-hidden backdrop-blur-xl">
            <div className="mb-5">
              <h2 className="text-2xl font-black text-white tracking-tight">Create Student Account</h2>
              <p className="text-xs text-slate-400 mt-0.5">Select your class and board to tailor your study dashboard.</p>
            </div>

            {success ? (
              <div className="p-6 rounded-2xl bg-emerald-950/60 border border-emerald-500/30 text-center space-y-4 animate-in zoom-in-95 duration-200">
                <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Registration Successful! 🎉</h3>
                  <p className="text-xs text-slate-300 mt-1">
                    Your {board} ({grade}) account has been created.
                  </p>
                </div>
                <Link
                  href="/user/login"
                  className="inline-block w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs"
                >
                  Go to Student Login
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3.5 text-xs font-semibold">
                {errorMessage && (
                  <div className="p-2.5 rounded-xl bg-rose-950/60 border border-rose-500/30 text-rose-300 text-xs">
                    {errorMessage}
                  </div>
                )}

                {/* Full Name */}
                <div className="space-y-1">
                  <label className="text-slate-300 font-bold">Student Full Name *</label>
                  <div className="relative">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Diya Mukherjee"
                      suppressHydrationWarning
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-800/80 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs font-medium"
                    />
                  </div>
                </div>

                {/* Class Standard and Board */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-slate-300 font-bold">Standard / Class *</label>
                    <select
                      value={grade}
                      onChange={(e) => setGrade(e.target.value)}
                      suppressHydrationWarning
                      className="w-full px-3 py-2.5 bg-slate-800/80 border border-slate-700/80 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs font-medium"
                    >
                      {classes.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-300 font-bold">Educational Board *</label>
                    <select
                      value={board}
                      onChange={(e) => setBoard(e.target.value)}
                      suppressHydrationWarning
                      className="w-full px-3 py-2.5 bg-slate-800/80 border border-slate-700/80 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs font-medium"
                    >
                      {boards.map((b) => (
                        <option key={b} value={b}>
                          {b}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Parent Mobile & Student Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-slate-300 font-bold">Parent Mobile Number</label>
                    <div className="relative">
                      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                        <Phone className="w-3.5 h-3.5" />
                      </div>
                      <input
                        type="tel"
                        value={parentPhone}
                        onChange={(e) => setParentPhone(e.target.value)}
                        placeholder="+91 98301 23456"
                        suppressHydrationWarning
                        className="w-full pl-9 pr-3 py-2.5 bg-slate-800/80 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs font-medium"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-300 font-bold">Student Email *</label>
                    <div className="relative">
                      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                        <Mail className="w-3.5 h-3.5" />
                      </div>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="diya@example.com"
                        suppressHydrationWarning
                        className="w-full pl-9 pr-3 py-2.5 bg-slate-800/80 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs font-medium"
                      />
                    </div>
                  </div>
                </div>

                {/* Password and Confirm */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-slate-300 font-bold">Password *</label>
                    <div className="relative">
                      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                        <Lock className="w-3.5 h-3.5" />
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••••••"
                        suppressHydrationWarning
                        className="w-full pl-9 pr-8 py-2.5 bg-slate-800/80 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs font-medium"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        suppressHydrationWarning
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1"
                      >
                        {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-300 font-bold">Confirm Password *</label>
                    <div className="relative">
                      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                        <Lock className="w-3.5 h-3.5" />
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••••••"
                        suppressHydrationWarning
                        className="w-full pl-9 pr-3 py-2.5 bg-slate-800/80 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs font-medium"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-1">
                  <label className="flex items-start gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={agreed}
                      onChange={(e) => setAgreed(e.target.checked)}
                      suppressHydrationWarning
                      className="w-3.5 h-3.5 mt-0.5 rounded text-indigo-600 focus:ring-indigo-500 bg-slate-800 border-slate-700"
                    />
                    <span className="text-[11px] text-slate-400 leading-tight">
                      I agree to the Dekh Education student learning honor code.
                    </span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  suppressHydrationWarning
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-600 to-indigo-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold text-xs shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Start Learning for Free</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </form>
            )}

            <div className="pt-4 mt-4 text-center border-t border-slate-800">
              <p className="text-xs text-slate-400 font-medium">
                Already registered as student?{' '}
                <Link
                  href="/user/login"
                  className="font-bold text-indigo-400 hover:text-indigo-300 underline underline-offset-4"
                >
                  Sign In here →
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center text-xs text-slate-500 py-4 border-t border-slate-800/60">
        Dekh Education Student Portal • Designed for Excellence in K-12 Learning
      </footer>
    </div>
  );
}

