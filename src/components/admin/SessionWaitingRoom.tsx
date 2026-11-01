import React, { useEffect, useState } from 'react';
import { ExamSession, Participant } from '../../types';
import { StorageService } from '../../services/storage';
import { realtime } from '../../services/realtime';
import {
  Users,
  Play,
  Copy,
  Check,
  Plus,
  Trash2,
  Clock,
  ShieldCheck,
  ArrowLeft,
  CheckCircle2,
  Tv,
} from 'lucide-react';
import { Badge } from '../common/Badge';

interface SessionWaitingRoomProps {
  session: ExamSession;
  onBack: () => void;
  onGoToMonitoring: () => void;
}

export const SessionWaitingRoom: React.FC<SessionWaitingRoomProps> = ({
  session,
  onBack,
  onGoToMonitoring,
}) => {
  const [participants, setParticipants] = useState<Participant[]>(
    StorageService.getParticipantsBySession(session.id)
  );
  const [copiedToken, setCopiedToken] = useState(false);
  const [newNim, setNewNim] = useState('');
  const [newName, setNewName] = useState('');
  const [isAddingParticipant, setIsAddingParticipant] = useState(false);
  const [sessionState, setSessionState] = useState<ExamSession>(session);

  const refreshParticipants = () => {
    setParticipants(StorageService.getParticipantsBySession(session.id));
    const current = StorageService.getSessionById(session.id);
    if (current) setSessionState(current);
  };

  useEffect(() => {
    // Listen for participant registrations
    const unsubscribe = realtime.subscribe('*', () => {
      refreshParticipants();
    });

    const interval = setInterval(refreshParticipants, 2000);
    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, [session.id]);

  const handleCopyToken = () => {
    navigator.clipboard.writeText(session.token);
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 2000);
  };

  const handleStartExam = () => {
    if (confirm(`Mulai sesi ujian "${session.name}" sekarang? Peserta di ruang tunggu akan menerima hitung mundur 5 detik secara serentak.`)) {
      StorageService.updateSessionStatus(session.id, 'running');
      realtime.broadcast(`exam-session.${session.id}`, 'ExamSessionStarted', {
        sessionId: session.id,
        startedAt: new Date().toISOString(),
      });
      refreshParticipants();
      onGoToMonitoring();
    }
  };

  const handleAddManualParticipant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNim.trim() || !newName.trim()) return;

    try {
      StorageService.registerOrGetParticipant(session.id, newName.trim(), newNim.trim());
      setIsAddingParticipant(false);
      setNewNim('');
      setNewName('');
      refreshParticipants();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Gagal mendaftarkan peserta.');
    }
  };

  const isRunning = sessionState.status === 'running';

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Daftar Sesi</span>
        </button>

        <div className="flex items-center gap-3">
          <Badge
            variant={isRunning ? 'success' : 'warning'}
            size="md"
          >
            {sessionState.status}
          </Badge>

          {isRunning ? (
            <button
              onClick={onGoToMonitoring}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg shadow-emerald-600/30 transition cursor-pointer flex items-center gap-2"
            >
              <span>Ujian Sedang Berjalan • Buka Monitoring →</span>
            </button>
          ) : (
            <button
              onClick={handleStartExam}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/30 transition cursor-pointer flex items-center gap-2"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Mulai Ujian Praktikum (Start Exam)</span>
            </button>
          )}
        </div>
      </div>

      {/* Big Token Projector Display Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center md:text-left">
          <span className="text-xs uppercase font-mono tracking-widest text-blue-400 font-semibold flex items-center gap-2 justify-center md:justify-start">
            <Tv className="w-4 h-4" />
            Layar Pengumuman & Proyektor Lab
          </span>
          <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
            {session.name}
          </h2>
          <p className="text-xs text-slate-400 max-w-lg leading-relaxed">
            Instruksikan praktikan membuka URL ujian dan memasukkan token di bawah untuk masuk ke ruang tunggu.
          </p>
        </div>

        {/* Big Token Badge */}
        <div className="flex flex-col items-center">
          <div className="bg-slate-950 border border-slate-700/80 px-6 py-3 rounded-2xl text-center shadow-inner flex items-center gap-4">
            <div>
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">
                Token Masuk Ujian
              </span>
              <span className="text-3xl md:text-4xl font-black font-mono tracking-widest text-blue-400">
                {session.token}
              </span>
            </div>
            <button
              onClick={handleCopyToken}
              className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white transition border border-slate-800 cursor-pointer"
              title="Salin Token"
            >
              {copiedToken ? <Check className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5" />}
            </button>
          </div>
          <span className="text-[11px] text-slate-500 mt-2 font-mono">
            Durasi: {session.duration_minutes} Menit • Passing Grade: ≥ {session.passing_grade} Poin
          </span>
        </div>
      </div>

      {/* Participants Roster Table in Waiting Room */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-400" />
              <span>Daftar Peserta Terdaftar ({participants.length} Orang)</span>
            </h3>
            <span className="text-xs text-slate-400">
              Praktikan yang telah memverifikasi token dan terdaftar dalam sesi ini.
            </span>
          </div>

          {!isRunning && (
            <button
              onClick={() => setIsAddingParticipant(!isAddingParticipant)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isAddingParticipant ? 'Batal' : 'Tambah Peserta Manual'}</span>
            </button>
          )}
        </div>

        {/* Add Participant Manual Form */}
        {isAddingParticipant && (
          <form
            onSubmit={handleAddManualParticipant}
            className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex flex-col md:flex-row gap-3 text-xs animate-in fade-in"
          >
            <input
              type="text"
              required
              value={newName}
              onChange={(e) => setNewName(e.target.value.toUpperCase())}
              placeholder="NAMA LENGKAP"
              className="flex-1 px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-100 uppercase"
            />
            <input
              type="text"
              required
              value={newNim}
              onChange={(e) => setNewNim(e.target.value.toUpperCase())}
              placeholder="NIM"
              className="w-44 px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-100 font-mono uppercase"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg shrink-0 cursor-pointer"
            >
              Daftarkan
            </button>
          </form>
        )}

        {/* Participants Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-3">No</th>
                <th className="py-3 px-3">Nama Praktikan</th>
                <th className="py-3 px-3">NIM</th>
                <th className="py-3 px-3">Kasus 1 Ditugaskan</th>
                <th className="py-3 px-3">Kasus 2 Ditugaskan</th>
                <th className="py-3 px-3">Status Peserta</th>
                <th className="py-3 px-3 text-right">Heartbeat Terakhir</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {participants.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500 font-sans">
                    Belum ada mahasiswa yang masuk dengan token ini.
                  </td>
                </tr>
              ) : (
                participants.map((p, idx) => {
                  const case1 = p.assignments.find((a) => a.sequence_number === 1)?.problem_case;
                  const case2 = p.assignments.find((a) => a.sequence_number === 2)?.problem_case;

                  return (
                    <tr key={p.id} className="hover:bg-slate-950/40 transition">
                      <td className="py-3 px-3 text-slate-500">{idx + 1}</td>
                      <td className="py-3 px-3 font-sans font-bold text-slate-200">
                        {p.name}
                      </td>
                      <td className="py-3 px-3 text-blue-400 font-semibold">{p.nim}</td>
                      <td className="py-3 px-3 font-sans text-slate-300">
                        {case1?.title || 'Case 1'}
                      </td>
                      <td className="py-3 px-3 font-sans text-slate-300">
                        {case2?.title || 'Case 2'}
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider font-mono ${
                            p.status === 'in_progress'
                              ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                              : p.status === 'completed'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          }`}
                        >
                          {p.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right text-slate-400 font-sans text-[11px]">
                        {new Date(p.last_heartbeat).toLocaleTimeString('id-ID')}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
