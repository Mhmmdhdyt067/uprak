import React, { useState } from 'react';
import { ExamSession, SessionStatus } from '../../types';
import { StorageService } from '../../services/storage';
import { SessionWaitingRoom } from './SessionWaitingRoom';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';
import {
  Calendar,
  Plus,
  Clock,
  Play,
  Activity,
  CheckCircle2,
  Trash2,
  Tv,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';

interface AdminSessionManagementProps {
  onGoToMonitoring: (sessionId?: string) => void;
}

export const AdminSessionManagement: React.FC<AdminSessionManagementProps> = ({
  onGoToMonitoring,
}) => {
  const [sessions, setSessions] = useState<ExamSession[]>(StorageService.getExamSessions());
  const [activeWaitingRoomSession, setActiveWaitingRoomSession] = useState<ExamSession | null>(
    null
  );
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [examDate, setExamDate] = useState(new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState('08:30');
  const [duration, setDuration] = useState(90);
  const [token, setToken] = useState(`ALGO${Math.floor(10 + Math.random() * 89)}`);
  const [passingGrade, setPassingGrade] = useState(65);
  const [timeLimit, setTimeLimit] = useState(2.0);
  const [memoryLimit, setMemoryLimit] = useState(128);

  const refreshSessions = () => {
    setSessions(StorageService.getExamSessions());
  };

  const handleCreateSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newSession: ExamSession = {
      id: `sess-${Date.now()}`,
      name: name.trim(),
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: description.trim(),
      exam_date: examDate,
      start_time: startTime,
      duration_minutes: Number(duration) || 90,
      token: token.trim().toUpperCase(),
      compiler_version: 'C++17 (GCC 9.2.0)',
      execution_time_limit: Number(timeLimit) || 2.0,
      memory_limit_mb: Number(memoryLimit) || 128,
      passing_grade: Number(passingGrade) || 65,
      status: 'waiting',
      created_by: 'user-01',
      created_at: new Date().toISOString(),
    };

    StorageService.saveExamSession(newSession);
    setIsCreateModalOpen(false);
    refreshSessions();
    setActiveWaitingRoomSession(newSession);
  };

  const handleDeleteSession = (id: string, sessionName: string) => {
    if (confirm(`Hapus sesi ujian "${sessionName}"? Data peserta pada sesi ini akan terhapus.`)) {
      const remaining = sessions.filter((s) => s.id !== id);
      setSessions(remaining);
      localStorage.setItem('pces_exam_sessions', JSON.stringify(remaining));
      refreshSessions();
    }
  };

  if (activeWaitingRoomSession) {
    return (
      <SessionWaitingRoom
        session={activeWaitingRoomSession}
        onBack={() => setActiveWaitingRoomSession(null)}
        onGoToMonitoring={() => onGoToMonitoring(activeWaitingRoomSession.id)}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div>
          <span className="text-xs uppercase font-mono tracking-wider text-blue-400 font-semibold">
            Jadwal & Sesi Praktikum
          </span>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
            Manajemen Sesi Ujian & Token
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Buat sesi baru, atur alokasi waktu dan passing grade, dan luncurkan ruang tunggu untuk mahasiswa.
          </p>
        </div>

        <button
          onClick={() => {
            setToken(`ALGO${Math.floor(10 + Math.random() * 89)}`);
            setIsCreateModalOpen(true);
          }}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-600/30 transition shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Buat Sesi Ujian Baru</span>
        </button>
      </div>

      {/* Sessions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {sessions.map((sess) => {
          const participants = StorageService.getParticipantsBySession(sess.id);
          const inProgress = participants.filter((p) => p.status === 'in_progress').length;
          const completed = participants.filter((p) => p.status === 'completed').length;
          const isRunning = sess.status === 'running';

          return (
            <div
              key={sess.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between hover:border-slate-700 transition space-y-4"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Badge
                    variant={isRunning ? 'success' : sess.status === 'completed' ? 'neutral' : 'warning'}
                    size="sm"
                  >
                    {sess.status}
                  </Badge>

                  <div className="flex items-center gap-1.5 bg-slate-950 px-2.5 py-1 rounded-md border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase font-mono">Token:</span>
                    <span className="font-mono text-xs font-bold text-blue-400 tracking-wider">
                      {sess.token}
                    </span>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-white tracking-tight">{sess.name}</h3>
                {sess.description && (
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed line-clamp-2">
                    {sess.description}
                  </p>
                )}

                <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-800/80 text-xs">
                  <div className="text-slate-400 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-blue-400" />
                    <span>{sess.exam_date} ({sess.start_time})</span>
                  </div>

                  <div className="text-slate-400 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span>{sess.duration_minutes} Menit Pengerjaan</span>
                  </div>
                </div>

                <div className="mt-3 bg-slate-950/60 p-3 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] uppercase text-slate-500 font-semibold block">
                      Total Peserta Terdaftar
                    </span>
                    <span className="font-bold text-slate-200 text-sm">
                      {participants.length} Mahasiswa
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] uppercase text-slate-500 font-semibold block">
                      Status Progres
                    </span>
                    <span className="font-mono text-xs text-blue-400">
                      {inProgress} Sedang Ujian • {completed} Selesai
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveWaitingRoomSession(sess)}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition cursor-pointer"
                  >
                    <Tv className="w-3.5 h-3.5 text-blue-400" />
                    <span>Ruang Tunggu & Token</span>
                  </button>

                  <button
                    onClick={() => onGoToMonitoring(sess.id)}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 text-xs font-semibold transition cursor-pointer"
                  >
                    <Activity className="w-3.5 h-3.5" />
                    <span>Live Monitoring</span>
                  </button>
                </div>

                <button
                  onClick={() => handleDeleteSession(sess.id, sess.name)}
                  className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 rounded-lg transition cursor-pointer"
                  title="Hapus Sesi"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Session Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Buat Sesi Ujian Praktikum Baru"
        maxWidth="2xl"
      >
        <form onSubmit={handleCreateSession} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Nama Sesi Ujian:
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Ujian Praktikum Algoritma C++ - Shift Siang (Kelas B)"
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Deskripsi Sesi:
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Catatan pelaksanaan, shift, atau ruang lab..."
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-hidden"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Tanggal Pelaksanaan:
              </label>
              <input
                type="date"
                required
                value={examDate}
                onChange={(e) => setExamDate(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-hidden font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Waktu Mulai:
              </label>
              <input
                type="time"
                required
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-hidden font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Durasi Pengerjaan (Menit):
              </label>
              <input
                type="number"
                min={15}
                max={240}
                required
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-hidden font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Token Sesi Ujian (Unik):
              </label>
              <input
                type="text"
                required
                value={token}
                onChange={(e) => setToken(e.target.value.toUpperCase())}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-blue-600 font-mono font-bold tracking-widest uppercase focus:outline-hidden text-center"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Passing Grade (Min Skor):
              </label>
              <input
                type="number"
                min={0}
                max={100}
                required
                value={passingGrade}
                onChange={(e) => setPassingGrade(Number(e.target.value))}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg font-mono text-slate-900 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Batas Waktu CPU (detik):
              </label>
              <input
                type="number"
                step="0.5"
                min={0.5}
                max={10.0}
                value={timeLimit}
                onChange={(e) => setTimeLimit(Number(e.target.value))}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg font-mono text-slate-900 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Batas Memori (MB):
              </label>
              <input
                type="number"
                min={32}
                max={512}
                value={memoryLimit}
                onChange={(e) => setMemoryLimit(Number(e.target.value))}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg font-mono text-slate-900 focus:outline-hidden"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(false)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold shadow-md cursor-pointer"
            >
              Simpan Sesi Ujian
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
