import React from 'react';
import { StorageService } from '../../services/storage';
import { AdminTab } from './AdminNavbar';
import {
  Code2,
  Calendar,
  Users,
  Activity,
  CheckCircle2,
  TrendingUp,
  Award,
  ArrowUpRight,
  ShieldAlert,
  Play,
  FileSpreadsheet,
} from 'lucide-react';

interface AdminDashboardProps {
  onNavigate: (tab: AdminTab) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const cases = StorageService.getProblemCases();
  const sessions = StorageService.getExamSessions();
  const participants = StorageService.getParticipants();
  const logs = StorageService.getAuditLogs().slice(0, 6);

  const activeSessions = sessions.filter((s) => s.status === 'running');
  const inProgressParticipants = participants.filter((p) => p.status === 'in_progress');
  const completedParticipants = participants.filter((p) => p.status === 'completed');

  const totalScores = completedParticipants.reduce((sum, p) => sum + (p.total_score || 0), 0);
  const avgScore = completedParticipants.length > 0 ? (totalScores / completedParticipants.length).toFixed(1) : '0.0';

  const passedCount = completedParticipants.filter((p) => p.is_passed).length;
  const passRate =
    completedParticipants.length > 0
      ? Math.round((passedCount / completedParticipants.length) * 100)
      : 0;

  // Score distribution calculation
  const scoreBuckets = [
    { label: '0 - 40', count: completedParticipants.filter((p) => p.total_score < 40).length },
    { label: '41 - 60', count: completedParticipants.filter((p) => p.total_score >= 40 && p.total_score < 60).length },
    { label: '61 - 75', count: completedParticipants.filter((p) => p.total_score >= 60 && p.total_score < 75).length },
    { label: '76 - 85', count: completedParticipants.filter((p) => p.total_score >= 75 && p.total_score < 85).length },
    { label: '86 - 100', count: completedParticipants.filter((p) => p.total_score >= 85).length },
  ];
  const maxBucketCount = Math.max(...scoreBuckets.map((b) => b.count), 1);

  return (
    <div className="space-y-6">
      {/* Top Welcome & Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div>
          <span className="text-xs uppercase font-mono tracking-wider text-blue-400 font-semibold">
            Laboratorium Algoritma & Pemrograman
          </span>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
            Dashboard Evaluasi Ujian Praktikum
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Pantau jalannya ujian praktikum secara real-time, kelola 12 bank studi kasus C++,
            dan analisa performa komputasi praktikan.
          </p>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={() => onNavigate('monitoring')}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-600/30 transition cursor-pointer"
          >
            <Activity className="w-4 h-4 animate-pulse" />
            <span>Buka Live Monitoring</span>
          </button>

          <button
            onClick={() => onNavigate('reports')}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Rekap Nilai</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Cases */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Bank Studi Kasus
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center">
              <Code2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold font-mono text-white mt-3">
            {cases.length}
          </div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
            <span className="text-emerald-400 font-semibold">{cases.filter(c => c.status === 'published').length} Kasus Aktif</span>
            <span>• 100% C++17</span>
          </div>
        </div>

        {/* Live Participants */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Praktikan Sedang Ujian
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <Activity className="w-4 h-4 animate-pulse" />
            </div>
          </div>
          <div className="text-3xl font-bold font-mono text-emerald-400 mt-3">
            {inProgressParticipants.length}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            dari total <strong className="text-slate-200">{participants.length} peserta</strong> terdaftar
          </div>
        </div>

        {/* Average Score */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Rata-Rata Nilai
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-600/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold font-mono text-white mt-3">
            {avgScore} <span className="text-xs font-normal text-slate-400 font-sans">/ 100</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
            <span>Berdasarkan {completedParticipants.length} praktikan selesai</span>
          </div>
        </div>

        {/* Pass Rate % */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Tingkat Kelulusan
            </span>
            <div className="w-8 h-8 rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold font-mono text-indigo-400 mt-3">
            {passRate}%
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Passing Grade standar: <strong className="text-slate-200">≥ 65.0</strong>
          </div>
        </div>
      </div>

      {/* Two Column Section: Analytics & Audit Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left (2 Cols): Score Distribution Chart & Active Session Quick Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Score Distribution Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-white tracking-tight">
                  Distribusi Nilai Mahasiswa
                </h3>
                <span className="text-xs text-slate-400">
                  Histogram rentang perolehan skor praktikum
                </span>
              </div>
              <span className="text-xs bg-slate-800 px-2.5 py-1 rounded-md text-slate-300 font-mono">
                Total Selesai: {completedParticipants.length}
              </span>
            </div>

            {/* Custom SVG / Bar Histogram */}
            <div className="space-y-3 pt-2">
              {scoreBuckets.map((bucket) => {
                const percentage =
                  maxBucketCount > 0 ? (bucket.count / maxBucketCount) * 100 : 0;
                return (
                  <div key={bucket.label} className="space-y-1">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-slate-300 font-medium">Rentang {bucket.label}</span>
                      <span className="text-slate-400">{bucket.count} Mahasiswa</span>
                    </div>
                    <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-800 flex">
                      <div
                        className="h-full bg-linear-to-r from-blue-600 to-indigo-500 rounded-full transition-all duration-500"
                        style={{ width: `${Math.max(percentage, bucket.count > 0 ? 8 : 0)}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Active Sessions Overview */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-white tracking-tight">
                  Sesi Ujian Praktikum Terjadwal & Aktif
                </h3>
                <span className="text-xs text-slate-400">
                  Token sesi dan durasi pengerjaan saat ini
                </span>
              </div>
              <button
                onClick={() => onNavigate('sessions')}
                className="text-xs text-blue-400 hover:text-blue-300 font-semibold transition cursor-pointer flex items-center gap-1"
              >
                <span>Kelola Semua Sesi</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {sessions.map((sess) => (
                <div
                  key={sess.id}
                  className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-100">{sess.name}</span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase font-mono ${
                          sess.status === 'running'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {sess.status}
                      </span>
                    </div>
                    <div className="text-slate-400 text-[11px] flex items-center gap-3">
                      <span>Token: <strong className="text-blue-400 font-mono tracking-wider">{sess.token}</strong></span>
                      <span>Durasi: {sess.duration_minutes} Menit</span>
                      <span>Passing Grade: {sess.passing_grade} Poin</span>
                    </div>
                  </div>

                  <button
                    onClick={() => onNavigate('monitoring')}
                    className="px-3 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 text-xs font-semibold border border-blue-500/30 transition cursor-pointer"
                  >
                    Pantau Sesi →
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right (1 Col): System Activity Logs & Case Difficulty Distribution */}
        <div className="space-y-6">
          {/* Difficulty Breakdown */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <h3 className="text-sm font-bold text-white tracking-tight mb-1">
              Komposisi Tingkat Kesulitan
            </h3>
            <span className="text-xs text-slate-400 block mb-4">
              Sebaran 12 studi kasus algoritma
            </span>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-emerald-950/20 border border-emerald-900/40">
                <span className="font-semibold text-emerald-400">Easy (Tingkat Dasar)</span>
                <span className="font-mono text-slate-200 font-bold">
                  {cases.filter((c) => c.difficulty === 'easy').length} Soal
                </span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-amber-950/20 border border-amber-900/40">
                <span className="font-semibold text-amber-400">Medium (Menengah)</span>
                <span className="font-mono text-slate-200 font-bold">
                  {cases.filter((c) => c.difficulty === 'medium').length} Soal
                </span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-rose-950/20 border border-rose-900/40">
                <span className="font-semibold text-rose-400">Hard (Kompleks)</span>
                <span className="font-mono text-slate-200 font-bold">
                  {cases.filter((c) => c.difficulty === 'hard').length} Soal
                </span>
              </div>
            </div>
          </div>

          {/* Audit Logs Stream */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white tracking-tight">
                Log Aktivitas Sistem
              </h3>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            </div>

            <div className="space-y-3 text-xs">
              {logs.map((log) => (
                <div key={log.id} className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] text-blue-400 font-semibold uppercase">
                      {log.event}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {new Date(log.timestamp).toLocaleTimeString('id-ID')}
                    </span>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    {log.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
