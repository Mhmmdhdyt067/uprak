import React, { useEffect } from 'react';
import { Participant, ExamSession } from '../../types';
import { CheckCircle2, ShieldCheck, Home, FileText, Lock } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ExamCompletedProps {
  participant: Participant;
  session: ExamSession;
  onGoHome: () => void;
}

export const ExamCompleted: React.FC<ExamCompletedProps> = ({
  participant,
  session,
  onGoHome,
}) => {
  useEffect(() => {
    // Fire celebration confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#2563EB', '#10B981', '#F59E0B', '#6366F1'],
      });
    } catch {
      // Ignore if canvas-confetti is not loaded
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 relative overflow-hidden select-none">
      {/* Background radial glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-emerald-600/10 blur-[130px] rounded-full pointer-events-none"></div>

      {/* Main Completion Card */}
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl relative z-10 text-center animate-in fade-in zoom-in-95 duration-200">
        {/* Success Icon */}
        <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto mb-5 shadow-inner">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        {/* Title & Gratitude */}
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Ujian Praktikum Telah Selesai
        </h1>
        <p className="text-xs text-slate-400 mt-2 leading-relaxed">
          Terima kasih telah mengikuti sesi ujian praktikum pemrograman C++. Seluruh jawaban Anda
          telah berhasil disimpan dan terarsip aman di database ujian.
        </p>

        {/* Submission Receipt Details */}
        <div className="mt-6 bg-slate-950/70 rounded-xl p-5 border border-slate-800 text-left text-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
            <span className="text-slate-400">Nama Praktikan:</span>
            <span className="text-slate-100 font-bold">{participant.name}</span>
          </div>

          <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
            <span className="text-slate-400">NIM:</span>
            <span className="text-blue-400 font-mono font-semibold">{participant.nim}</span>
          </div>

          <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
            <span className="text-slate-400">Sesi Ujian:</span>
            <span className="text-slate-200 font-medium">{session.name}</span>
          </div>

          <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
            <span className="text-slate-400">Studi Kasus Selesai:</span>
            <span className="text-emerald-400 font-bold font-mono">2 / 2 Studi Kasus</span>
          </div>

          <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
            <span className="text-slate-400">Waktu Pengumpulan:</span>
            <span className="text-slate-300 font-mono">
              {participant.finished_at
                ? new Date(participant.finished_at).toLocaleString('id-ID')
                : new Date().toLocaleString('id-ID')}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400">Hash Tiket Verifikasi:</span>
            <span className="text-slate-500 font-mono text-[10px] truncate max-w-44">
              {participant.session_hash}
            </span>
          </div>
        </div>

        {/* Academic Confidentiality Notice (Rule 6.7 Compliance) */}
        <div className="mt-6 p-3.5 bg-blue-950/30 border border-blue-900/50 rounded-xl text-left flex items-start gap-3">
          <Lock className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
          <div className="text-[11px] text-slate-400 leading-normal">
            <strong className="text-blue-300 block font-semibold mb-0.5">
              Kerahasiaan Penilaian Akademik
            </strong>
            Sesuai regulasi praktikum, rekapitulasi nilai akhir dan status kelulusan akan
            diumumkan secara resmi oleh Tim Asisten Dosen setelah masa verifikasi selesai.
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-6">
          <button
            onClick={onGoHome}
            className="w-full py-3 px-4 bg-slate-800 hover:bg-slate-700 active:bg-slate-800 text-slate-200 rounded-xl text-xs font-semibold border border-slate-700 flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <Home className="w-4 h-4 text-slate-400" />
            <span>Kembali ke Halaman Depan</span>
          </button>
        </div>
      </div>
    </div>
  );
};
