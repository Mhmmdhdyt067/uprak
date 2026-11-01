import React, { useState } from 'react';
import { StorageService } from '../../services/storage';
import { User } from '../../types';
import { ShieldCheck, Lock, User as UserIcon, ArrowRight, AlertCircle, KeyRound, Sparkles } from 'lucide-react';

interface AdminLoginProps {
  onLoginSuccess: (user: User) => void;
  onGoToStudent: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess, onGoToStudent }) => {
  const [nim, setNim] = useState('ADMIN01');
  const [password, setPassword] = useState('AdminRahasia2026!');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const cleanNim = nim.trim().toUpperCase();

    // Verify against allowed admin credentials
    if (cleanNim === 'ADMIN01' && password === 'AdminRahasia2026!') {
      const user: User = {
        id: 'user-01',
        name: 'Koordinator Praktikum (Super Admin)',
        nim: 'ADMIN01',
        role: 'super_admin',
      };
      StorageService.setCurrentAdminUser(user);
      StorageService.logAudit('ADMIN_LOGIN', `Super Admin (${user.name}) berhasil masuk ke sistem.`, 'info');
      setLoading(false);
      onLoginSuccess(user);
      return;
    }

    if (cleanNim === 'ASLAB01' && password === 'AslabPass2026!') {
      const user: User = {
        id: 'user-02',
        name: 'Asisten Dosen Lab 1',
        nim: 'ASLAB01',
        role: 'assistant',
      };
      StorageService.setCurrentAdminUser(user);
      StorageService.logAudit('ADMIN_LOGIN', `Asisten Dosen (${user.name}) berhasil masuk ke sistem.`, 'info');
      setLoading(false);
      onLoginSuccess(user);
      return;
    }

    setError('NIM atau Password Administrator tidak cocok.');
    setLoading(false);
  };

  const handleSelectRole = (type: 'admin' | 'aslab') => {
    if (type === 'admin') {
      setNim('ADMIN01');
      setPassword('AdminRahasia2026!');
    } else {
      setNim('ASLAB01');
      setPassword('AslabPass2026!');
    }
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 relative overflow-hidden select-none">
      {/* Background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-600/10 blur-[130px] rounded-full pointer-events-none"></div>

      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl relative z-10">
        <div className="text-center mb-7">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-600/20 text-blue-400 border border-blue-500/30 mb-4 shadow-inner">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Administrator Portal
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manajemen Ujian Praktikum C++ & Monitoring Real-Time
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3.5 bg-rose-950/50 border border-rose-800/80 rounded-xl text-rose-300 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div className="leading-relaxed">{error}</div>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
              NIM / ID Administrator
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={nim}
                onChange={(e) => setNim(e.target.value)}
                placeholder="CONTOH: ADMIN01"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-sm font-mono focus:outline-hidden focus:border-blue-500 uppercase tracking-wider transition"
              />
              <UserIcon className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-hidden focus:border-blue-500 transition"
              />
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-3 py-3 px-4 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-semibold rounded-xl text-sm shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition disabled:opacity-50 cursor-pointer"
          >
            <KeyRound className="w-4 h-4" />
            <span>{loading ? 'Mengautentikasi...' : 'Masuk ke Dashboard'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Demo Fast Account Selector */}
        <div className="mt-6 pt-5 border-t border-slate-800/80">
          <span className="block text-[11px] font-semibold text-slate-400 mb-2 uppercase tracking-wider text-center">
            Pilih Akun Demo Development:
          </span>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => handleSelectRole('admin')}
              className="p-2 rounded-lg bg-slate-950 hover:bg-slate-800/80 border border-slate-800 text-left transition text-slate-300 hover:text-white cursor-pointer"
            >
              <div className="font-semibold text-blue-400">Super Admin</div>
              <div className="text-[10px] text-slate-400 font-mono">ADMIN01</div>
            </button>

            <button
              type="button"
              onClick={() => handleSelectRole('aslab')}
              className="p-2 rounded-lg bg-slate-950 hover:bg-slate-800/80 border border-slate-800 text-left transition text-slate-300 hover:text-white cursor-pointer"
            >
              <div className="font-semibold text-emerald-400">Asisten Dosen</div>
              <div className="text-[10px] text-slate-400 font-mono">ASLAB01</div>
            </button>
          </div>
        </div>

        <div className="mt-5 text-center">
          <button
            type="button"
            onClick={onGoToStudent}
            className="text-xs text-slate-400 hover:text-slate-200 transition cursor-pointer"
          >
            ← Kembali ke Portal Mahasiswa
          </button>
        </div>
      </div>
    </div>
  );
};
