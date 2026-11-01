import React, { useEffect, useState } from 'react';
import { Participant, ExamSession } from '../../types';
import { StorageService } from '../../services/storage';
import { realtime } from '../../services/realtime';
import { ParticipantDetailModal } from './ParticipantDetailModal';
import {
  Activity,
  Users,
  Search,
  Eye,
  CheckCircle2,
  Clock,
  RefreshCw,
  AlertCircle,
  Wifi,
  Sparkles,
} from 'lucide-react';
import { Badge } from '../common/Badge';

interface LiveMonitoringProps {
  initialSessionId?: string;
}

export const LiveMonitoring: React.FC<LiveMonitoringProps> = ({ initialSessionId }) => {
  const sessions = StorageService.getExamSessions();
  const [selectedSessionId, setSelectedSessionId] = useState<string>(
    initialSessionId || sessions[0]?.id || ''
  );
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [inspectParticipant, setInspectParticipant] = useState<Participant | null>(null);
  const [recentEvents, setRecentEvents] = useState<string[]>([]);
  const [lastRefreshed, setLastRefreshed] = useState<string>(new Date().toLocaleTimeString('id-ID'));

  const refreshData = () => {
    if (!selectedSessionId) return;
    const list = StorageService.getParticipantsBySession(selectedSessionId);
    setParticipants(list);
    setLastRefreshed(new Date().toLocaleTimeString('id-ID'));
  };

  useEffect(() => {
    refreshData();

    // Subscribe to realtime broadcast events on the monitoring channel
    const unsubscribe = realtime.subscribe(`admin-monitoring.${selectedSessionId}`, (data: unknown) => {
      const eventData = data as { event?: string; payload?: Record<string, unknown>; timestamp?: string };
      const eventName = eventData.event || 'Update';
      const p = eventData.payload || {};

      let eventMsg = `[${new Date().toLocaleTimeString('id-ID')}] Event: ${eventName}`;
      if (eventName === 'ParticipantTested') {
        eventMsg = `[${new Date().toLocaleTimeString('id-ID')}] ${p.nim} menguji Studi Kasus #${p.sequence} (${p.passed}/${p.total} Pass)`;
      } else if (eventName === 'CaseSubmitted') {
        eventMsg = `[${new Date().toLocaleTimeString('id-ID')}] ${p.nim} mengumpulkan Studi Kasus #${p.sequence} (Skor: ${p.score})`;
      } else if (eventName === 'AutoSubmitted') {
        eventMsg = `[${new Date().toLocaleTimeString('id-ID')}] Waktu habis: ${p.nim} di-auto-submit oleh sistem`;
      }

      setRecentEvents((prev) => [eventMsg, ...prev.slice(0, 5)]);
      refreshData();
    });

    // 2-second polling fallback
    const interval = setInterval(refreshData, 2000);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, [selectedSessionId]);

  const activeSession = sessions.find((s) => s.id === selectedSessionId);

  const filteredParticipants = participants.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.nim.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-mono tracking-wider text-blue-400 font-semibold">
              Live Monitoring Room
            </span>
            <span className="flex items-center gap-1 text-[11px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-mono font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              WebSocket Live Reverb
            </span>
          </div>

          <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
            Pemantauan Real-Time Pengerjaan Praktikum
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Pantau progres penulisan kode, rasio test cases yang berhasil, dan status pengerjaan praktikan secara langsung.
          </p>
        </div>

        {/* Session Selector & Manual Refresh */}
        <div className="flex items-center space-x-3 shrink-0">
          <select
            value={selectedSessionId}
            onChange={(e) => setSelectedSessionId(e.target.value)}
            className="bg-slate-950 border border-slate-700 text-slate-100 text-xs rounded-xl px-3.5 py-2.5 focus:outline-hidden cursor-pointer"
          >
            {sessions.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.token}) - {s.status}
              </option>
            ))}
          </select>

          <button
            onClick={refreshData}
            title="Refresh Data"
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Live Event Ticker Banner */}
      {recentEvents.length > 0 && (
        <div className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 flex items-center space-x-3 text-xs overflow-hidden">
          <span className="text-[10px] uppercase font-bold font-mono tracking-wider text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded shrink-0">
            Live Stream
          </span>
          <div className="font-mono text-slate-300 truncate text-[11px]">
            {recentEvents[0]}
          </div>
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900 border border-slate-800 rounded-xl p-4">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch}
            placeholder="Cari berdasarkan nama atau NIM..."
            className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 text-xs focus:outline-hidden focus:border-blue-500 placeholder:text-slate-500"
          />
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <span className="text-xs text-slate-400 whitespace-nowrap">Filter Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-slate-300 text-xs rounded-lg px-3 py-2 focus:outline-hidden cursor-pointer"
          >
            <option value="all">Semua Status ({participants.length})</option>
            <option value="in_progress">Sedang Mengerjakan</option>
            <option value="completed">Sudah Submit</option>
            <option value="waiting">Ruang Tunggu</option>
          </select>
        </div>
      </div>

      {/* Live Monitoring Participants Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-4">Praktikan</th>
                <th className="py-3.5 px-4">NIM</th>
                <th className="py-3.5 px-4">Studi Kasus 1</th>
                <th className="py-3.5 px-4">Studi Kasus 2</th>
                <th className="py-3.5 px-4">Status Peserta</th>
                <th className="py-3.5 px-4">Total Skor</th>
                <th className="py-3.5 px-4 text-right">Aksi Inspeksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {filteredParticipants.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-500 font-sans">
                    Tidak ada data peserta ditemukan pada sesi ini.
                  </td>
                </tr>
              ) : (
                filteredParticipants.map((p) => {
                  const asg1 = p.assignments.find((a) => a.sequence_number === 1);
                  const asg2 = p.assignments.find((a) => a.sequence_number === 2);

                  const renderCaseStatus = (asg: typeof asg1) => {
                    if (!asg) return <span className="text-slate-600">-</span>;
                    if (asg.status === 'submitted') {
                      const passCount = asg.submission?.passed_test_cases ?? (asg.score > 0 ? 3 : 0);
                      const totalCount = asg.submission?.total_test_cases ?? 3;
                      return (
                        <div className="flex items-center gap-1.5 font-bold">
                          <span className="text-emerald-400">{passCount}/{totalCount} Pass</span>
                          <span className="text-[10px] text-slate-400 font-normal">({asg.score.toFixed(1)} Pts)</span>
                        </div>
                      );
                    }
                    if (asg.status === 'active') {
                      return (
                        <span className="text-blue-400 flex items-center gap-1 font-sans text-[11px] font-semibold">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></span>
                          In Progress
                        </span>
                      );
                    }
                    return <span className="text-slate-500 font-sans text-[11px]">Terkunci (Pending)</span>;
                  };

                  return (
                    <tr key={p.id} className="hover:bg-slate-950/40 transition">
                      {/* Name */}
                      <td className="py-3.5 px-4 font-sans font-bold text-slate-200">
                        {p.name}
                      </td>

                      {/* NIM */}
                      <td className="py-3.5 px-4 text-blue-400 font-semibold font-mono">
                        {p.nim}
                      </td>

                      {/* Case 1 */}
                      <td className="py-3.5 px-4">
                        {renderCaseStatus(asg1)}
                      </td>

                      {/* Case 2 */}
                      <td className="py-3.5 px-4">
                        {renderCaseStatus(asg2)}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase font-mono ${
                            p.status === 'completed'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : p.status === 'in_progress'
                              ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                              : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          }`}
                        >
                          {p.status.replace('_', ' ')}
                        </span>
                      </td>

                      {/* Score */}
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-sm text-slate-100">
                          {p.total_score.toFixed(1)}
                        </span>
                        <span className="text-slate-500 text-[10px] font-normal"> / 100</span>
                      </td>

                      {/* Action Detail */}
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => setInspectParticipant(p)}
                          className="px-3 py-1.5 rounded-lg bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 border border-blue-500/20 text-xs font-semibold font-sans transition cursor-pointer flex items-center gap-1.5 ml-auto"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Inspeksi Kode</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Participant Detail Code & Grade Modal */}
      {inspectParticipant && (
        <ParticipantDetailModal
          participant={inspectParticipant}
          isOpen={!!inspectParticipant}
          onClose={() => setInspectParticipant(null)}
          onUpdate={refreshData}
        />
      )}
    </div>
  );
};
