import React, { useEffect, useState } from 'react';
import { Participant, ExamSession } from '../../types';
import { StorageService } from '../../services/storage';
import { realtime } from '../../services/realtime';
import { Clock, BookCheck, ShieldAlert, Wifi, Terminal, AlertTriangle } from 'lucide-react';

interface StudentWaitingRoomProps {
  participant: Participant;
  session: ExamSession;
  onStartExam: () => void;
  onExit: () => void;
}

export const StudentWaitingRoom: React.FC<StudentWaitingRoomProps> = ({
  participant,
  session,
  onStartExam,
  onExit,
}) => {
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isSessionRunning, setIsSessionRunning] = useState<boolean>(session.status === 'running');

  // Check if session started
  useEffect(() => {
    // If session is already running when page loads, start countdown immediately
    if (session.status === 'running') {
      setIsSessionRunning(true);
      setCountdown(5);
    }

    // Subscribe to realtime broadcast
    const unsubscribe = realtime.subscribe(`exam-session.${session.id}`, (data: unknown) => {
      const eventData = data as { event?: string };
      if (eventData.event === 'ExamSessionStarted') {
        setIsSessionRunning(true);
        setCountdown(5);
      }
    });

    // Also poll every 3s in case websocket is disconnected
    const interval = setInterval(() => {
      const current = StorageService.getSessionById(session.id);
      if (current && current.status === 'running' && countdown === null) {
        setIsSessionRunning(true);
        setCountdown(5);
      }
    }, 2500);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, [session.id, session.status, countdown]);

  // Countdown timer effect
  useEffect(() => {
    if (countdown === null) return;
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      onStartExam();
    }
  }, [countdown, onStartExam]);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-blue-600/10 blur-[140px] rounded-full pointer-events-none"></div>

      {/* Synchronized Countdown Overlay if triggered */}
      {countdown !== null && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center animate-in fade-in duration-300">
          <div className="text-center space-y-4">
            <span className="text-xs font-mono uppercase tracking-widest text-blue-400 font-semibold">
              Ujian Dimulai Dalam Waktu
            </span>
            <div className="text-8xl md:text-9xl font-black font-mono text-white tracking-tighter animate-pulse scale-110 transition-transform">
              {countdown}
            </div>
            <p className="text-sm text-slate-400">
              Mempersiapkan editor C++ dan 2 studi kasus acak Anda...
            </p>
          </div>
        </div>
      )}

      {/* Main Waiting Room Card */}
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden relative z-10">
        {/* Top Header */}
        <div className="p-6 bg-slate-950/70 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white tracking-tight leading-tight">
                Ruang Tunggu Praktikan
              </h1>
              <span className="text-xs text-blue-400 font-mono">
                {session.name}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2 bg-emerald-950/40 border border-emerald-900/60 px-3 py-1.5 rounded-lg text-emerald-400 text-xs">
            <Wifi className="w-3.5 h-3.5 animate-pulse" />
            <span>Terhubung • Sinkron Server</span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 text-sm">
          {/* Student Profile Card */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-4 bg-slate-950/60 rounded-xl border border-slate-800 text-xs">
            <div>
              <span className="text-slate-500 uppercase tracking-wider block font-semibold text-[10px]">
                Nama Mahasiswa
              </span>
              <span className="text-slate-200 font-bold text-sm tracking-wide">
                {participant.name}
              </span>
            </div>

            <div>
              <span className="text-slate-500 uppercase tracking-wider block font-semibold text-[10px]">
                NIM
              </span>
              <span className="text-blue-400 font-mono font-semibold text-sm">
                {participant.nim}
              </span>
            </div>

            <div>
              <span className="text-slate-500 uppercase tracking-wider block font-semibold text-[10px]">
                Durasi Pengerjaan
              </span>
              <span className="text-amber-400 font-bold text-sm flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> {session.duration_minutes} Menit
              </span>
            </div>
          </div>

          {/* Status Banner */}
          <div className="p-4 rounded-xl bg-blue-950/30 border border-blue-900/40 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5 animate-spin" />
            </div>
            <div>
              <div className="font-semibold text-blue-300 text-xs">
                {isSessionRunning ? 'Sesi Ujian Telah Dimulai!' : 'Menunggu Asisten Memulai Sesi Ujian'}
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                {isSessionRunning
                  ? 'Sesi ujian telah aktif di server. Klik tombol di bawah jika editor tidak langsung terbuka.'
                  : 'Harap tetap berada di halaman ini. Layar akan otomatis beralih ke editor coding saat instruktur menekan tombol Start Exam.'}
              </p>
            </div>
          </div>

          {/* Exam Rules & Conduct */}
          <div className="space-y-2 text-xs">
            <h3 className="font-semibold text-slate-300 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
              <BookCheck className="w-4 h-4 text-blue-400" />
              Tata Tertib & Ketentuan Ujian
            </h3>
            <ul className="space-y-2 text-slate-400 bg-slate-950/40 p-4 rounded-xl border border-slate-800 list-disc list-inside leading-relaxed">
              <li>
                Setiap praktikan memperoleh <strong>2 studi kasus algoritma C++</strong> yang dipilih secara acak oleh sistem.
              </li>
              <li>
                Sistem penilaian menggunakan <strong>bobot test cases otomatis</strong> (Public & Hidden Test Cases).
              </li>
              <li>
                Setelah Studi Kasus 1 disubmit, editor akan berpindah ke Studi Kasus 2. Jawaban yang telah disubmit <strong>tidak dapat diubah</strong>.
              </li>
              <li>
                Kode program tersimpan otomatis (autosave) secara berkala ke database ujian.
              </li>
              <li>
                Bila waktu ujian habis, sistem akan melakukan <strong>Auto-Submission</strong> draft jawaban terakhir secara otomatis.
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={onExit}
            className="px-4 py-2 text-xs text-slate-400 hover:text-slate-200 transition"
          >
            ← Kembali ke Verifikasi
          </button>

          <button
            onClick={() => {
              // Direct start button
              setIsSessionRunning(true);
              setCountdown(3);
            }}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white text-xs font-semibold shadow-lg shadow-blue-600/30 flex items-center gap-2 transition cursor-pointer"
          >
            <span>Mulai Ujian Sekarang</span>
          </button>
        </div>
      </div>
    </div>
  );
};
