'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        setError('Invalid email or password');
        setLoading(false);
      } else {
        router.push('/');
        router.refresh();
      }
    } catch {
      setError('An unexpected error occurred');
      setLoading(false);
    }
  };

  const inputClass = "w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm outline-none transition-all focus:border-purple-400 focus:shadow-[0_0_0_2px_rgba(168,85,247,0.3)] placeholder:text-white/40";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 p-4">
      <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
        <div className="flex flex-col items-center mb-8">
          <img src="/logo.png" alt="MediCare Pro Logo" className="w-16 h-16 object-contain rounded-2xl shadow-lg bg-white mb-4" />
          <h1 className="text-2xl font-bold text-white">MediCare Pro</h1>
          <p className="text-white/50 text-sm">Welcome back to your workspace</p>
        </div>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          {error && (
            <div className="px-4 py-3 bg-red-500/20 border border-red-500/30 rounded-xl text-red-300 text-sm">
              {error}
            </div>
          )}

          {!isLogin && (
            <div>
              <label className="block mb-2 text-sm font-medium text-white/70">Full Name</label>
              <input type="text" placeholder="Dr. John Doe" required={!isLogin} className={inputClass} />
            </div>
          )}

          <div>
            <label className="block mb-2 text-sm font-medium text-white/70">Email Address</label>
            <input
              type="email"
              placeholder="admin@medicarepro.com"
              required
              className={inputClass}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-white/70">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              required
              className={inputClass}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {isLogin && (
            <div className="text-right">
              <a href="#" className="text-purple-400 text-sm hover:text-purple-300 transition-colors">Forgot password?</a>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 mt-2 bg-gradient-to-r from-purple-600 to-violet-600 text-white font-semibold rounded-xl transition-all hover:opacity-90 hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer border-none text-base"
          >
            {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
          </button>
        </form>

        <div className="mt-6 text-center text-white/50 text-sm">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button
            type="button"
            className="text-purple-400 font-medium hover:text-purple-300 transition-colors bg-transparent border-none cursor-pointer"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? 'Sign up' : 'Sign in'}
          </button>
        </div>
      </div>
    </div>
  );
}
