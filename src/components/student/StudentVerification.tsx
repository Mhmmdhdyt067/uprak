import React, { useState } from 'react';
import { StorageService } from '../../services/storage';
import { Terminal, ShieldCheck, ArrowRight, AlertCircle, Info, Sparkles } from 'lucide-react';

interface StudentVerificationProps {
  onVerified: () => void;
  onGoToAdmin: () => void;
}

export const StudentVerification: React.FC<StudentVerificationProps> = ({
  onVerified,
  onGoToAdmin,
}) => {
  const [name, setName] = useState('');
  const [nim, setNim] = useState('');
  const [token, setToken] = useState('ALGO26');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanName = name.trim().toUpperCase();
    const cleanNim = nim.trim().toUpperCase();
    const cleanToken = token.trim().toUpperCase();

    if (!cleanName) {
      setError('Nama Lengkap wajib diisi.');
      return;
    }
    if (!cleanNim) {
      setError('Nomor Induk Mahasiswa (NIM) wajib diisi.');
      return;
    }
    if (!cleanToken) {
      setError('Token Sesi Ujian wajib diisi.');
      return;
    }

    setLoading(true);

    try {
      const session = StorageService.getSessionByToken(cleanToken);
      if (!session) {
        setError('Token sesi ujian tidak valid atau tidak ditemukan.');
        setLoading(false);
        return;
      }

      if (session.status === 'completed' || session.status === 'cancelled') {
        setError('Sesi ujian ini telah ditutup atau dibatalkan.');
        setLoading(false);
        return;
      }

      // Check if participant already completed
      const existing = StorageService.getParticipantsBySession(session.id).find(
        (p) => p.nim.toUpperCase() === cleanNim
      );

      if (existing && existing.status === 'completed') {
        setError('NIM ini sudah menyelesaikan ujian pada sesi ini dan tidak dapat mengulang.');
        setLoading(false);
        return;
      }

      // Register or retrieve session
      StorageService.registerOrGetParticipant(session.id, cleanName, cleanNim);
      setLoading(false);
      onVerified();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan sistem.');
      setLoading(false);
    }
  };

  const handleDemoFill = () => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    setName(`MAHASISWA PRAKTIKAN ${randomNum}`);
    setNim(`2026${randomNum}`);
    setToken('ALGO26');
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none"></div>

      {/* Main Verification Card */}
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-600/20 text-blue-400 border border-blue-500/30 mb-4 shadow-inner">
            <Terminal className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Portal Ujian Praktikum
          </h1>
          <p className="text-xs text-slate-400 mt-1.5">
            Algoritma & Pemrograman C++ • Live Coding Examination
          </p>
        </div>

        {/* Error Notice */}
        {error && (
          <div className="mb-6 p-3.5 bg-rose-950/50 border border-rose-800/80 rounded-xl text-rose-300 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div className="leading-relaxed">{error}</div>
          </div>
        )}

        {/* Verification Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
              Nama Lengkap Mahasiswa
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value.toUpperCase())}
              placeholder="CONTOH: MUHAMMAD HIDAYAT"
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-hidden focus:border-blue-500 font-medium tracking-wide placeholder:text-slate-600 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
              Nomor Induk Mahasiswa (NIM)
            </label>
            <input
              type="text"
              required
              value={nim}
              onChange={(e) => setNim(e.target.value.toUpperCase())}
              placeholder="CONTOH: 2605120401"
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-sm font-mono focus:outline-hidden focus:border-blue-500 tracking-wider placeholder:text-slate-600 transition"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Token Sesi Ujian
              </label>
              <span className="text-[10px] text-blue-400 font-mono">Token aktif: ALGO26</span>
            </div>
            <input
              type="text"
              required
              value={token}
              onChange={(e) => setToken(e.target.value.toUpperCase())}
              placeholder="TOKEN SESI (MISAL: ALGO26)"
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-blue-400 text-sm font-mono font-bold tracking-widest focus:outline-hidden focus:border-blue-500 uppercase placeholder:text-slate-600 transition text-center"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 px-4 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-semibold rounded-xl text-sm shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition disabled:opacity-50 cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{loading ? 'Memverifikasi...' : 'Verifikasi & Masuk Ujian'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Fill Testing Helper */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <button
            type="button"
            onClick={handleDemoFill}
            className="flex items-center gap-1.5 text-blue-400 hover:text-blue-300 text-[11px] font-medium transition cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Isi Data Praktikan Acak</span>
          </button>

          <button
            type="button"
            onClick={onGoToAdmin}
            className="text-slate-400 hover:text-slate-200 text-[11px] transition cursor-pointer"
          >
            Login Admin / Aslab →
          </button>
        </div>
      </div>

      {/* Security & Rules Disclaimer Footer */}
      <div className="mt-6 text-center text-xs text-slate-500 max-w-md leading-relaxed flex items-center justify-center gap-1.5">
        <Info className="w-3.5 h-3.5 text-slate-500 shrink-0" />
        <span>Satu NIM hanya diperkenankan mengikuti satu kali ujian pada sesi yang sama.</span>
      </div>
    </div>
  );
};
