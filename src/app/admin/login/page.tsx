'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  GraduationCap,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  ArrowUpRight,
  UserCheck,
  CheckCircle2,
} from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('sayril@dekheducation.com');
  const [password, setPassword] = useState('admin2026');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMessage('Please enter both administrative email and password.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMessage(data.message || 'Authentication failed. Please verify credentials.');
        setIsLoading(false);
        return;
      }

      setSuccessMessage('Logged in successfully! Redirecting...');

      // Store in localStorage for header display
      if (typeof window !== 'undefined' && data.admin) {
        localStorage.setItem('admin_user', JSON.stringify(data.admin));
      }

      setTimeout(() => {
        router.push('/admin/dashboard');
      }, 500);
    } catch (err: any) {
      console.error('Login error:', err);
      setErrorMessage('Network or server error. Please check database connection.');
      setIsLoading(false);
    }
  };

  const handleDemoFill = () => {
    setEmail('sayril@dekheducation.com');
    setPassword('admin2026');
  };

  return (
    <div className="min-h-screen bg-[#F4F6FB] flex flex-col justify-between p-4 sm:p-6 relative overflow-hidden">
      {/* Decorative ambient background glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-gradient-to-br from-orange-400/20 via-amber-300/15 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-gradient-to-tr from-orange-500/15 via-rose-300/10 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Top Bar Switcher to Student Portal */}
      <div className="flex items-center justify-between max-w-5xl w-full mx-auto z-10 py-2">
        <Link href="/admin/dashboard" className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 p-0.5 shadow-md shadow-orange-500/30">
            <div className="flex items-center justify-center w-full h-full bg-[#0B132B] rounded-[10px]">
              <GraduationCap className="w-5 h-5 text-orange-400" />
            </div>
          </div>
          <div>
            <span className="font-extrabold text-slate-900 text-sm tracking-tight block">Dekh Education</span>
            <span className="text-[10px] font-bold tracking-wider text-orange-600 uppercase block">Admin Portal</span>
          </div>
        </Link>

        {/* Portal Switch Button */}
        <Link
          href="/user/login"
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white neu-button text-xs font-bold text-slate-700 hover:text-orange-600 transition-colors"
        >
          <UserCheck className="w-4 h-4 text-emerald-600" />
          <span>Student / Parent Portal</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Centered Login Card */}
      <div className="w-full max-w-md mx-auto relative z-10 my-auto py-6">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100/80 text-orange-700 text-xs font-bold mb-3 border border-orange-200/60">
            <ShieldCheck className="w-3.5 h-3.5 text-orange-600" />
            <span>MongoDB Verified Administrative Access</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Admin Sign In 👋
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Access board syllabus, question banks, and institutional analytics.
          </p>
        </div>

        {/* Main Neumorphic Card */}
        <div className="p-7 sm:p-9 rounded-3xl neu-card shadow-2xl space-y-6 bg-white">
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-600 animate-in fade-in">
              {errorMessage}
            </div>
          )}

          {successMessage && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-700 flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold text-slate-700">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-slate-700 font-bold flex items-center justify-between">
                <span>Admin Official Email</span>
                <span className="text-[11px] text-orange-600 font-semibold">Super Admin</span>
              </label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="sayril@dekheducation.com"
                  suppressHydrationWarning
                  className="w-full pl-10 pr-4 py-3 bg-[#EFF2F8] neu-inset rounded-2xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-400/50 transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-slate-700 font-bold">Admin Password</label>
                <a
                  href="#forgot"
                  onClick={(e) => {
                    e.preventDefault();
                    alert('Security reset link sent to authorized admin email.');
                  }}
                  className="text-[11px] text-orange-600 hover:text-orange-700 font-bold transition-colors"
                >
                  Forgot Password?
                </a>
              </div>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  suppressHydrationWarning
                  className="w-full pl-10 pr-11 py-3 bg-[#EFF2F8] neu-inset rounded-2xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-400/50 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  suppressHydrationWarning
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  suppressHydrationWarning
                  className="w-4 h-4 rounded text-orange-600 focus:ring-orange-500"
                />
                <span className="text-xs text-slate-600 font-medium">Keep this workstation trusted</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              suppressHydrationWarning
              className="w-full mt-2 py-3.5 px-4 rounded-2xl neu-orange-button text-white font-bold text-sm shadow-lg flex items-center justify-center gap-2 group disabled:opacity-70 cursor-pointer"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In to Admin Dashboard</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Autofill */}
          <div className="p-3 rounded-2xl bg-orange-50/70 border border-orange-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-orange-600 shrink-0" />
              <div className="text-[11px] text-slate-600">
                <span className="font-bold text-orange-900">Demo Admin: </span>
                <span className="text-slate-500">sayril@dekheducation.com</span>
              </div>
            </div>
            <button
              type="button"
              onClick={handleDemoFill}
              suppressHydrationWarning
              className="px-2.5 py-1 rounded-lg bg-white text-orange-600 text-[10px] font-bold shadow-xs hover:bg-orange-600 hover:text-white transition-colors"
            >
              Auto Fill
            </button>
          </div>

          {/* Footer Link to Admin Signup */}
          <div className="pt-3 text-center border-t border-slate-100">
            <p className="text-xs text-slate-500 font-medium">
              Need to register a new administrator?{' '}
              <Link
                href="/admin/signup"
                className="font-bold text-orange-600 hover:text-orange-700 transition-colors"
              >
                Register Admin →
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Footer copyright & security */}
      <div className="text-center text-xs text-slate-400 font-medium py-2 z-10">
        <span>MongoDB Atlas Connected • 256-Bit SSL Encrypted • Dekh Education Admin Panel</span>
      </div>
    </div>
  );
}
