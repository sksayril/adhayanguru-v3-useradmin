'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  GraduationCap,
  BookOpen,
  Sparkles,
  Award,
  Flame,
  CheckCircle2,
  ArrowRight,
  Shield,
  Eye,
  EyeOff,
  User,
  Lock,
  ArrowUpRight,
} from 'lucide-react';

export default function UserLoginPage() {
  const router = useRouter();
  const [loginMethod, setLoginMethod] = useState<'id' | 'email'>('id');
  const [studentId, setStudentId] = useState('STD-10021');
  const [email, setEmail] = useState('student@dekheducation.com');
  const [password, setPassword] = useState('student123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loginSuccess, setLoginSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    const identifier = loginMethod === 'id' ? studentId : email;
    if (!identifier || !password) {
      setErrorMessage('Please enter both your Student ID / Email and password.');
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMessage(data.message || 'Invalid student credentials.');
        setIsLoading(false);
        return;
      }

      setLoginSuccess(true);
      if (typeof window !== 'undefined' && data.student) {
        localStorage.setItem('student_user', JSON.stringify(data.student));
      }

      setTimeout(() => {
        router.push('/user/dashboard');
      }, 500);
    } catch (err: any) {
      console.error('Student login error:', err);
      setErrorMessage('Network or database connection error. Please try again.');
      setIsLoading(false);
    }
  };

  const handleDemoFill = () => {
    setLoginMethod('id');
    setStudentId('STD-10021');
    setPassword('student123');
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
          <span>Admin & Faculty Login</span>
          <ArrowUpRight className="w-3 h-3 text-slate-400 group-hover:text-white transition-colors" />
        </Link>
      </header>

      {/* Main Split-Screen Section */}
      <main className="flex-1 max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 items-center p-4 sm:p-8 gap-8 lg:gap-12">
        {/* Left Hero Section: Visuals, Badges, Benefits */}
        <div className="lg:col-span-6 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-bold">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Interactive Learning & Smart Mock Tests</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Master Your Syllabus.{' '}
            <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">
              Score 95%+
            </span>{' '}
            in Board Exams.
          </h1>

          <p className="text-sm sm:text-base text-slate-400 font-normal leading-relaxed max-w-xl">
            Access chapter-wise MCQs, descriptive solutions, previous year papers, and performance analytics for CBSE, ICSE, and State Boards.
          </p>

          {/* Gamified Floating Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
            <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/80 backdrop-blur-md flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center shrink-0">
                <Flame className="w-5 h-5 fill-orange-500 text-orange-500" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Daily Streak Active</p>
                <p className="text-[11px] text-slate-400">Join 12,480 active peers</p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/80 backdrop-blur-md flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <Award className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">48,560+ Solved Qs</p>
                <p className="text-[11px] text-slate-400">Math, Science, English</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Form Section: Modern Student Auth Card */}
        <div className="lg:col-span-6 w-full max-w-md mx-auto">
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl relative overflow-hidden backdrop-blur-xl">
            {/* Ambient inner glow */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="mb-6">
              <h2 className="text-2xl font-black text-white tracking-tight">Student Sign In</h2>
              <p className="text-xs text-slate-400 mt-1">Enter your student ID or email to begin learning.</p>
            </div>

            {/* Login Method Toggle */}
            <div className="flex p-1 bg-slate-800/80 rounded-xl mb-5 text-xs font-bold">
              <button
                type="button"
                onClick={() => setLoginMethod('id')}
                suppressHydrationWarning
                className={`flex-1 py-2 rounded-lg transition-all ${
                  loginMethod === 'id'
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Roll / Student ID
              </button>
              <button
                type="button"
                onClick={() => setLoginMethod('email')}
                suppressHydrationWarning
                className={`flex-1 py-2 rounded-lg transition-all ${
                  loginMethod === 'email'
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Email Address
              </button>
            </div>

            {loginSuccess ? (
              <div className="p-6 rounded-2xl bg-indigo-950/60 border border-indigo-500/30 text-center space-y-4 animate-in zoom-in-95 duration-200">
                <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Welcome Back, Aarav! 🎉</h3>
                  <p className="text-xs text-slate-300 mt-1">
                    Class 10 (CBSE) • Your chapters are loaded and ready for today&apos;s practice.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setLoginSuccess(false)}
                  className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs"
                >
                  Continue to Learning Hub
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold">
                {loginMethod === 'id' ? (
                  <div className="space-y-1.5">
                    <label className="text-slate-300 font-bold">Student Roll ID *</label>
                    <div className="relative">
                      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                        <User className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        required
                        value={studentId}
                        onChange={(e) => setStudentId(e.target.value)}
                        placeholder="e.g. STD-10021"
                        suppressHydrationWarning
                        className="w-full pl-10 pr-4 py-3 bg-slate-800/80 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs font-medium"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <label className="text-slate-300 font-bold">Student / Parent Email *</label>
                    <div className="relative">
                      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                        <User className="w-4 h-4" />
                      </div>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="student@dekheducation.com"
                        suppressHydrationWarning
                        className="w-full pl-10 pr-4 py-3 bg-slate-800/80 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs font-medium"
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-slate-300 font-bold">Password *</label>
                    <a
                      href="#forgot"
                      onClick={(e) => {
                        e.preventDefault();
                        alert('Ask your school administrator or check registered parent mobile for PIN reset.');
                      }}
                      className="text-[11px] text-indigo-400 hover:text-indigo-300 font-bold"
                    >
                      Forgot PIN / Password?
                    </a>
                  </div>
                  <div className="relative">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      suppressHydrationWarning
                      className="w-full pl-10 pr-10 py-3 bg-slate-800/80 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      suppressHydrationWarning
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      suppressHydrationWarning
                      className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 bg-slate-800 border-slate-700"
                    />
                    <span className="text-xs text-slate-400 font-medium">Remember my login</span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  suppressHydrationWarning
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-600 to-indigo-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold text-sm shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Start Learning Now</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Quick Demo Student Autofill */}
            <div className="mt-4 p-3 rounded-xl bg-slate-800/50 border border-slate-700/60 flex items-center justify-between">
              <div className="text-[11px] text-slate-400">
                <span className="font-bold text-indigo-400">Demo Student: </span>
                <span>STD-10021 (Class 10)</span>
              </div>
              <button
                type="button"
                onClick={handleDemoFill}
                suppressHydrationWarning
                className="px-2.5 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500 hover:text-white text-[10px] font-bold transition-colors"
              >
                Auto Fill
              </button>
            </div>

            {/* Link to Student Signup */}
            <div className="pt-4 mt-4 text-center border-t border-slate-800">
              <p className="text-xs text-slate-400 font-medium">
                New student at Dekh Education?{' '}
                <Link
                  href="/user/signup"
                  className="font-bold text-indigo-400 hover:text-indigo-300 underline underline-offset-4"
                >
                  Create Student Account →
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

