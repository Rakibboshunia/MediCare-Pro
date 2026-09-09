'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { EyeIcon, EyeSlashIcon, LockClosedIcon, EnvelopeIcon, UserIcon } from '@heroicons/react/24/outline';

const DEMO_EMAIL = 'admin@medicarepro.com';
const DEMO_PASSWORD = 'admin123';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    await new Promise(r => setTimeout(r, 700));

    if (isLogin) {
      if (email === DEMO_EMAIL && password === DEMO_PASSWORD) {
        router.push('/');
      } else {
        setError('Invalid email or password. Use the demo credentials below.');
        setLoading(false);
      }
    } else {
      // For registration, just redirect (no backend)
      router.push('/');
    }
  };

  const fillDemo = () => {
    setEmail(DEMO_EMAIL);
    setPassword(DEMO_PASSWORD);
    setError('');
  };

  const inputClass = "w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm outline-none transition-all focus:border-purple-400 focus:shadow-[0_0_0_2px_rgba(168,85,247,0.3)] placeholder:text-white/40";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 p-4">

      {/* Background orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-violet-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
          {/* Logo / Header */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center shadow-lg mb-4">
              <span className="text-white text-2xl font-bold">M</span>
            </div>
            <h1 className="text-2xl font-bold text-white">MediCare Pro</h1>
            <p className="text-white/50 text-sm mt-1">
              {isLogin ? 'Welcome back to your workspace' : 'Create your account'}
            </p>
          </div>

          {/* Tab Toggle */}
          <div className="flex bg-white/5 rounded-xl p-1 mb-6">
            <button
              type="button"
              onClick={() => { setIsLogin(true); setError(''); }}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all border-none cursor-pointer ${isLogin ? 'bg-gradient-to-r from-purple-600 to-violet-600 text-white shadow-md' : 'text-white/50 hover:text-white/80 bg-transparent'}`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setIsLogin(false); setError(''); }}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all border-none cursor-pointer ${!isLogin ? 'bg-gradient-to-r from-purple-600 to-violet-600 text-white shadow-md' : 'text-white/50 hover:text-white/80 bg-transparent'}`}
            >
              Sign Up
            </button>
          </div>

          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            {/* Error */}
            {error && (
              <div className="px-4 py-3 bg-red-500/20 border border-red-500/30 rounded-xl text-red-300 text-sm animate-pulse">
                {error}
              </div>
            )}

            {/* Full Name (signup) */}
            {!isLogin && (
              <div className="relative">
                <label className="block mb-2 text-sm font-medium text-white/70">Full Name</label>
                <UserIcon className="absolute left-3 top-[42px] w-4 h-4 text-white/40 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Dr. John Doe"
                  required={!isLogin}
                  className={inputClass}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            )}

            {/* Email */}
            <div className="relative">
              <label className="block mb-2 text-sm font-medium text-white/70">Email Address</label>
              <EnvelopeIcon className="absolute left-3 top-[42px] w-4 h-4 text-white/40 pointer-events-none" />
              <input
                type="email"
                placeholder="admin@medicarepro.com"
                required
                className={inputClass}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Password */}
            <div className="relative">
              <label className="block mb-2 text-sm font-medium text-white/70">Password</label>
              <LockClosedIcon className="absolute left-3 top-[42px] w-4 h-4 text-white/40 pointer-events-none" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                required
                className={`${inputClass} pr-10`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[42px] text-white/40 hover:text-white/70 transition-colors bg-transparent border-none cursor-pointer p-0"
              >
                {showPassword ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
              </button>
            </div>

            {/* Forgot password */}
            {isLogin && (
              <div className="text-right -mt-1">
                <a href="#" className="text-purple-400 text-xs hover:text-purple-300 transition-colors">Forgot password?</a>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 mt-1 bg-gradient-to-r from-purple-600 to-violet-600 text-white font-semibold rounded-xl transition-all hover:opacity-90 hover:shadow-lg hover:shadow-purple-500/30 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer border-none text-base"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Processing...
                </span>
              ) : (isLogin ? 'Sign In' : 'Create Account')}
            </button>
          </form>

          {/* Demo credentials hint */}
          {isLogin && (
            <div className="mt-4 p-3 bg-purple-500/10 border border-purple-500/20 rounded-xl">
              <p className="text-xs text-white/50 text-center mb-1">Demo credentials</p>
              <p className="text-xs text-purple-300 text-center font-mono">{DEMO_EMAIL} / {DEMO_PASSWORD}</p>
              <button
                type="button"
                onClick={fillDemo}
                className="mt-2 w-full text-xs text-purple-400 hover:text-purple-300 transition-colors bg-transparent border-none cursor-pointer py-1"
              >
                Click to fill automatically →
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-white/30 text-xs mt-6">
          © 2025 MediCare Pro · All rights reserved
        </p>
      </div>
    </div>
  );
}
