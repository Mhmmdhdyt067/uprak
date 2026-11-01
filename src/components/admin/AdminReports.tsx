import React, { useState } from 'react';
import { StorageService } from '../../services/storage';
import {
  FileSpreadsheet,
  Download,
  Printer,
  Search,
  CheckCircle2,
  XCircle,
  Award,
  Filter,
  FileText,
  Building,
} from 'lucide-react';
import { Badge } from '../common/Badge';

export const AdminReports: React.FC = () => {
  const settings = StorageService.getSettings();
  const sessions = StorageService.getExamSessions();
  const participants = StorageService.getParticipants();
  const cases = StorageService.getProblemCases();

  const [selectedSessionId, setSelectedSessionId] = useState<string>(
    sessions[0]?.id || ''
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'passed' | 'failed'>('all');
  const [isPrintView, setIsPrintView] = useState(false);

  const activeSession = sessions.find((s) => s.id === selectedSessionId) || sessions[0];
  const sessionParticipants = participants.filter((p) => p.exam_session_id === selectedSessionId);

  const passingGrade = activeSession?.passing_grade || 65;

  const filteredList = sessionParticipants.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.nim.toLowerCase().includes(searchTerm.toLowerCase());
    const isPassed = p.total_score >= passingGrade;
    const matchStatus =
      statusFilter === 'all' ||
      (statusFilter === 'passed' && isPassed) ||
      (statusFilter === 'failed' && !isPassed);
    return matchSearch && matchStatus;
  });

  const totalParticipants = sessionParticipants.length;
  const completedCount = sessionParticipants.filter((p) => p.status === 'completed').length;
  const passedCount = sessionParticipants.filter((p) => p.total_score >= passingGrade).length;
  const passRate = completedCount > 0 ? Math.round((passedCount / completedCount) * 100) : 0;
  const avgScore =
    completedCount > 0
      ? (
          sessionParticipants.reduce((sum, p) => sum + p.total_score, 0) / completedCount
        ).toFixed(1)
      : '0.0';

  // Export CSV
  const handleExportCSV = () => {
    const headers = [
      'NIM',
      'Nama Praktikan',
      'Sesi Ujian',
      'Studi Kasus 1',
      'Skor Kasus 1',
      'Studi Kasus 2',
      'Skor Kasus 2',
      'Total Nilai',
      'Status Kelulusan',
      'Waktu Submit',
    ];

    const rows = sessionParticipants.map((p) => {
      const asg1 = p.assignments.find((a) => a.sequence_number === 1);
      const asg2 = p.assignments.find((a) => a.sequence_number === 2);
      const isPass = p.total_score >= passingGrade;

      return [
        `"${p.nim}"`,
        `"${p.name}"`,
        `"${activeSession?.name || ''}"`,
        `"${asg1?.problem_case?.title || 'Case 1'}"`,
        asg1?.score.toFixed(1) || '0.0',
        `"${asg2?.problem_case?.title || 'Case 2'}"`,
        asg2?.score.toFixed(1) || '0.0',
        p.total_score.toFixed(1),
        isPass ? 'LULUS' : 'TIDAK LULUS',
        p.finished_at ? `"${new Date(p.finished_at).toLocaleString('id-ID')}"` : '"Belum"',
      ].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Rekap_Nilai_${activeSession?.token || 'Exam'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isPrintView) {
    return (
      <div className="bg-white text-slate-900 p-8 max-w-4xl mx-auto space-y-6 print:p-0">
        <div className="flex items-center justify-between border-b pb-4">
          <button
            onClick={() => setIsPrintView(false)}
            className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-semibold print:hidden cursor-pointer"
          >
            ← Kembali ke Tampilan Dashboard
          </button>
          <button
            onClick={() => window.print()}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold print:hidden cursor-pointer flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak PDF / Print</span>
          </button>
        </div>

        {/* Formal University Transcript Header */}
        <div className="text-center space-y-1 border-b-2 border-slate-900 pb-4">
          <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500">
            {settings.institution_name}
          </h2>
          <h1 className="text-xl font-black uppercase text-slate-900">
            BERITA ACARA & REKAPITULASI HASIL UJIAN PRAKTIKUM
          </h1>
          <p className="text-xs font-medium text-slate-600">
            Mata Kuliah: {settings.course_name} • {settings.academic_year}
          </p>
        </div>

        {/* Session Meta */}
        <div className="grid grid-cols-2 gap-4 text-xs font-mono py-2">
          <div>
            <div>Sesi: <strong>{activeSession?.name}</strong></div>
            <div>Token Ujian: <strong>{activeSession?.token}</strong></div>
            <div>Tanggal: {activeSession?.exam_date}</div>
          </div>
          <div className="text-right">
            <div>Passing Grade Standar: <strong>≥ {passingGrade}.00</strong></div>
            <div>Rata-Rata Nilai: <strong>{avgScore} / 100</strong></div>
            <div>Persentase Kelulusan: <strong>{passRate}%</strong></div>
          </div>
        </div>

        {/* Printable Table */}
        <table className="w-full text-left text-xs border border-slate-300 border-collapse">
          <thead>
            <tr className="bg-slate-100 border-b border-slate-300 font-bold uppercase text-[10px]">
              <th className="p-2 border-r border-slate-300">No</th>
              <th className="p-2 border-r border-slate-300">NIM</th>
              <th className="p-2 border-r border-slate-300">Nama Praktikan</th>
              <th className="p-2 border-r border-slate-300 text-center">Case 1</th>
              <th className="p-2 border-r border-slate-300 text-center">Case 2</th>
              <th className="p-2 border-r border-slate-300 text-center">Total Nilai</th>
              <th className="p-2 text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            {sessionParticipants.map((p, idx) => {
              const asg1 = p.assignments.find((a) => a.sequence_number === 1);
              const asg2 = p.assignments.find((a) => a.sequence_number === 2);
              const isPassed = p.total_score >= passingGrade;

              return (
                <tr key={p.id} className="border-b border-slate-200">
                  <td className="p-2 border-r border-slate-300 font-mono text-center">{idx + 1}</td>
                  <td className="p-2 border-r border-slate-300 font-mono font-semibold">{p.nim}</td>
                  <td className="p-2 border-r border-slate-300 font-semibold">{p.name}</td>
                  <td className="p-2 border-r border-slate-300 font-mono text-center">
                    {asg1?.score.toFixed(1) || '0.0'}
                  </td>
                  <td className="p-2 border-r border-slate-300 font-mono text-center">
                    {asg2?.score.toFixed(1) || '0.0'}
                  </td>
                  <td className="p-2 border-r border-slate-300 font-mono font-black text-center">
                    {p.total_score.toFixed(1)}
                  </td>
                  <td className="p-2 text-center font-bold">
                    <span className={isPassed ? 'text-emerald-700' : 'text-rose-700'}>
                      {isPassed ? 'LULUS' : 'TIDAK LULUS'}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Signatures Block */}
        <div className="grid grid-cols-2 pt-12 text-xs">
          <div>
            <p>Mengetahui,</p>
            <p className="font-semibold text-slate-800 mt-0.5">Asisten Penanggung Jawab Lab</p>
            <div className="h-16"></div>
            <p className="font-bold underline">Asisten Laboratorium C++</p>
            <p className="text-slate-500 font-mono">NIM / NIP: ASLAB01</p>
          </div>

          <div className="text-right">
            <p>Disahkan oleh,</p>
            <p className="font-semibold text-slate-800 mt-0.5">Koordinator Praktikum</p>
            <div className="h-16"></div>
            <p className="font-bold underline">{settings.coordinator_name}</p>
            <p className="text-slate-500 font-mono">NIDN: 0418098201</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div>
          <span className="text-xs uppercase font-mono tracking-wider text-blue-400 font-semibold">
            Hasil & Evaluasi Praktikum
          </span>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
            Rekapitulasi Nilai & Laporan Evaluasi
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Laporan lengkap nilai akhir mahasiswa, status kelulusan passing grade, serta ekspor format Excel/CSV/PDF.
          </p>
        </div>

        {/* Export Action Controls */}
        <div className="flex items-center space-x-2.5 shrink-0">
          <button
            onClick={handleExportCSV}
            className="flex items-center space-x-2 px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition cursor-pointer"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>Ekspor Excel / CSV</span>
          </button>

          <button
            onClick={() => setIsPrintView(true)}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-600/30 transition cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Berita Acara PDF</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <span className="text-[11px] font-semibold text-slate-400 uppercase">
            Total Praktikan
          </span>
          <div className="text-2xl font-bold text-white font-mono mt-1">
            {totalParticipants} Mahasiswa
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <span className="text-[11px] font-semibold text-slate-400 uppercase">
            Rata-Rata Nilai
          </span>
          <div className="text-2xl font-bold text-blue-400 font-mono mt-1">
            {avgScore} <span className="text-xs text-slate-500 font-sans">/ 100</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <span className="text-[11px] font-semibold text-slate-400 uppercase">
            Persentase Kelulusan
          </span>
          <div className="text-2xl font-bold text-emerald-400 font-mono mt-1">
            {passRate}%
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <span className="text-[11px] font-semibold text-slate-400 uppercase">
            Passing Grade
          </span>
          <div className="text-2xl font-bold text-amber-400 font-mono mt-1">
            ≥ {passingGrade} Poin
          </div>
        </div>
      </div>

      {/* Filter and Session Selector */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900 border border-slate-800 rounded-xl p-4">
        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <span className="text-xs text-slate-400 whitespace-nowrap">Pilih Sesi Ujian:</span>
          <select
            value={selectedSessionId}
            onChange={(e) => setSelectedSessionId(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-slate-100 text-xs rounded-lg px-3 py-2 focus:outline-hidden cursor-pointer"
          >
            {sessions.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.token})
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari nama / NIM..."
              className="w-full pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 text-xs focus:outline-hidden"
            />
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2" />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'all' | 'passed' | 'failed')}
            className="bg-slate-950 border border-slate-800 text-slate-300 text-xs rounded-lg px-3 py-1.5 focus:outline-hidden cursor-pointer"
          >
            <option value="all">Semua Kelulusan</option>
            <option value="passed">Hanya Lulus (≥ {passingGrade})</option>
            <option value="failed">Tidak Lulus (&lt; {passingGrade})</option>
          </select>
        </div>
      </div>

      {/* Grade Book Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">No</th>
                <th className="py-3 px-4">Praktikan</th>
                <th className="py-3 px-4">NIM</th>
                <th className="py-3 px-4">Studi Kasus 1</th>
                <th className="py-3 px-4">Studi Kasus 2</th>
                <th className="py-3 px-4">Total Nilai</th>
                <th className="py-3 px-4">Status Kelulusan</th>
                <th className="py-3 px-4 text-right">Waktu Submit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {filteredList.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-slate-500 font-sans">
                    Tidak ada data nilai pada sesi ini.
                  </td>
                </tr>
              ) : (
                filteredList.map((p, idx) => {
                  const asg1 = p.assignments.find((a) => a.sequence_number === 1);
                  const asg2 = p.assignments.find((a) => a.sequence_number === 2);
                  const isPassed = p.total_score >= passingGrade;

                  return (
                    <tr key={p.id} className="hover:bg-slate-950/40 transition">
                      <td className="py-3.5 px-4 text-slate-500">{idx + 1}</td>
                      <td className="py-3.5 px-4 font-sans font-bold text-slate-200">
                        {p.name}
                      </td>
                      <td className="py-3.5 px-4 text-blue-400 font-semibold">{p.nim}</td>
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-slate-200">
                          {asg1?.score.toFixed(1) || '0.0'}
                        </span>
                        <span className="text-[10px] text-slate-500 font-normal"> / 50</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-slate-200">
                          {asg2?.score.toFixed(1) || '0.0'}
                        </span>
                        <span className="text-[10px] text-slate-500 font-normal"> / 50</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-black text-sm text-slate-100">
                          {p.total_score.toFixed(1)}
                        </span>
                        <span className="text-slate-500 text-[10px] font-normal"> / 100</span>
                      </td>
                      <td className="py-3.5 px-4">
                        {isPassed ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                            <CheckCircle2 className="w-3 h-3" /> LULUS
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase font-mono bg-rose-500/20 text-rose-400 border border-rose-500/30">
                            <XCircle className="w-3 h-3" /> TIDAK LULUS
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right text-slate-400 font-sans text-[11px]">
                        {p.finished_at
                          ? new Date(p.finished_at).toLocaleTimeString('id-ID')
                          : 'Sedang Berjalan'}
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
