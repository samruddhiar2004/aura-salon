'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, Sparkles, ArrowRight, AlertCircle } from 'lucide-react';
import { siteConfig } from '@/lib/config';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('admin@aura-salon.com');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg('');
    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    try {
      setLoading(true);
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        setErrorMsg(data.error || 'Invalid credentials');
        return;
      }

      router.push('/admin');
      router.refresh();
    } catch (err) {
      console.error(err);
      setErrorMsg('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F5F2EB] flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-[#1C1917] text-[#FAFAF7] flex items-center justify-center mx-auto shadow-soft font-serif font-bold text-xl">
            A
          </div>
          <h1 className="font-serif text-3xl font-bold text-[#1C1917]">
            {siteConfig.name}
          </h1>
          <p className="text-xs uppercase tracking-widest text-[#B8976C] font-semibold">
            Salon Staff & Manager Portal
          </p>
        </div>

        {/* Form Card */}
        <form
          onSubmit={handleLogin}
          className="bg-white p-8 rounded-3xl border border-[#E8DEC9] shadow-elevated space-y-5"
        >
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-[#1C1917] mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#78716C] absolute left-3.5 top-3" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2.5 text-sm border border-[#E8DEC9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B8976C]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1C1917] mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#78716C] absolute left-3.5 top-3" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2.5 text-sm border border-[#E8DEC9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B8976C]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#1C1917] text-[#FAFAF7] hover:bg-[#B8976C] text-sm font-semibold rounded-xl transition-all duration-200 flex items-center justify-center space-x-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <span>Log In to Dashboard</span>
                <ArrowRight className="w-4 h-4 text-[#B8976C]" />
              </>
            )}
          </button>

          {/* Quick Demo Hint */}
          <div className="pt-3 border-t border-[#E8DEC9] text-center text-[11px] text-[#78716C]">
            <span>Demo Credentials: </span>
            <code className="bg-[#F5F2EB] px-1.5 py-0.5 rounded text-[#1C1917] font-mono">
              admin@aura-salon.com
            </code>
            <span> / </span>
            <code className="bg-[#F5F2EB] px-1.5 py-0.5 rounded text-[#1C1917] font-mono">
              admin123
            </code>
          </div>
        </form>
      </div>
    </div>
  );
}
