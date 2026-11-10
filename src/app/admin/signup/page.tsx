'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  GraduationCap,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  ArrowUpRight,
  UserCheck,
  CheckCircle2,
} from 'lucide-react';

export default function AdminSignupPage() {
  const router = useRouter();
  const [name, setName] = useState('Sayril Amed');
  const [email, setEmail] = useState('sayril@dekheducation.com');
  const [role, setRole] = useState('Super Admin');
  const [password, setPassword] = useState('admin2026');
  const [confirmPassword, setConfirmPassword] = useState('admin2026');
  const [showPassword, setShowPassword] = useState(false);
  const [agreedTerms, setAgreedTerms] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const roles = [
    'Super Admin',
    'Academic Director',
    'Senior Question Reviewer',
    'Curriculum Manager',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please verify.');
      return;
    }

    if (!agreedTerms) {
      setErrorMessage('Please agree to the platform security terms.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const res = await fetch('/api/admin/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
          role,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMessage(data.message || 'Registration failed. Please check inputs.');
        setIsLoading(false);
        return;
      }

      setSuccessMessage('Admin registered into MongoDB successfully! Redirecting...');

      if (typeof window !== 'undefined' && data.admin) {
        localStorage.setItem('admin_user', JSON.stringify(data.admin));
      }

      setTimeout(() => {
        router.push('/admin/dashboard');
      }, 700);
    } catch (err: any) {
      console.error('Registration error:', err);
      setErrorMessage('Network or server error connecting to database.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F6FB] flex flex-col justify-between p-4 sm:p-6 relative overflow-hidden py-8">
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
          href="/user/signup"
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white neu-button text-xs font-bold text-slate-700 hover:text-orange-600 transition-colors"
        >
          <UserCheck className="w-4 h-4 text-emerald-600" />
          <span>Student Registration</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Centered Signup Card */}
      <div className="w-full max-w-lg mx-auto relative z-10 my-auto py-6">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100/80 text-orange-700 text-xs font-bold mb-3 border border-orange-200/60">
            <ShieldCheck className="w-3.5 h-3.5 text-orange-600" />
            <span>MongoDB Database Enrollment</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Create Admin Account 🛡️
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Register administrator credentials to save directly into Dekh Education database.
          </p>
        </div>

        {/* Main Neumorphic Card */}
        <div className="p-7 sm:p-9 rounded-3xl neu-card shadow-2xl space-y-5 bg-white">
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
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="text-slate-700 font-bold">Administrator Full Name *</label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. SK Sayril Amed"
                  suppressHydrationWarning
                  className="w-full pl-10 pr-4 py-3 bg-[#EFF2F8] neu-inset rounded-2xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-400/50 transition-all"
                />
              </div>
            </div>

            {/* Email Address */}
            <div className="space-y-1.5">
              <label className="text-slate-700 font-bold">Official Work Email *</label>
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

            {/* Role Dropdown */}
            <div className="space-y-1.5">
              <label className="text-slate-700 font-bold">Assigned Privileges / Role *</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                suppressHydrationWarning
                className="w-full px-4 py-3 bg-[#EFF2F8] neu-inset rounded-2xl text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-orange-400/50 transition-all"
              >
                {roles.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            {/* Password & Confirm */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1.5">
                <label className="text-slate-700 font-bold">Password *</label>
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
                    className="w-full pl-10 pr-9 py-3 bg-[#EFF2F8] neu-inset rounded-2xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-400/50 transition-all text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    suppressHydrationWarning
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-700 font-bold">Confirm Password *</label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••••••"
                    suppressHydrationWarning
                    className="w-full pl-10 pr-4 py-3 bg-[#EFF2F8] neu-inset rounded-2xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-400/50 transition-all text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Policy Checkbox */}
            <div className="pt-1">
              <label className="flex items-start gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={agreedTerms}
                  onChange={(e) => setAgreedTerms(e.target.checked)}
                  suppressHydrationWarning
                  className="w-4 h-4 mt-0.5 rounded text-orange-600 focus:ring-orange-500"
                />
                <span className="text-[11px] text-slate-500 font-medium leading-relaxed">
                  I agree to the Dekh Education{' '}
                  <span className="text-orange-600 font-bold underline">Institutional Security</span> and{' '}
                  <span className="text-orange-600 font-bold underline">Admin Role Governance Policy</span>.
                </span>
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
                  <span>Create Admin Account in Database</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Footer Link to Admin Login */}
          <div className="pt-3 text-center border-t border-slate-100">
            <p className="text-xs text-slate-500 font-medium">
              Already have an admin account?{' '}
              <Link
                href="/admin/login"
                className="font-bold text-orange-600 hover:text-orange-700 transition-colors"
              >
                Sign In here →
              </Link>
            </p>
          </div>
        </div>
      </div>

      <div className="text-center text-xs text-slate-400 font-medium py-2 z-10">
        <span>Connected to MongoDB Atlas • dekheducation database</span>
      </div>
    </div>
  );
}
