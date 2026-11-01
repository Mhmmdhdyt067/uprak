import React, { useState } from 'react';
import { ProblemCase, Difficulty } from '../../types';
import { StorageService } from '../../services/storage';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';
import { TestCaseBuilderModal } from './TestCaseBuilderModal';
import { ReferenceSolutionModal } from './ReferenceSolutionModal';
import {
  Code2,
  Plus,
  Search,
  ListChecks,
  CheckCircle2,
  ShieldCheck,
  Trash2,
  Edit3,
  Award,
  Clock,
  ExternalLink,
} from 'lucide-react';

export const AdminCaseManagement: React.FC = () => {
  const [cases, setCases] = useState<ProblemCase[]>(StorageService.getProblemCases());
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');

  // Modals state
  const [testCaseModalCase, setTestCaseModalCase] = useState<ProblemCase | null>(null);
  const [referenceModalCase, setReferenceModalCase] = useState<ProblemCase | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Form state for creating new problem case
  const [newTitle, setNewTitle] = useState('');
  const [newSynopsis, setNewSynopsis] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newInstructions, setNewInstructions] = useState('');
  const [newInputFormat, setNewInputFormat] = useState('');
  const [newOutputFormat, setNewOutputFormat] = useState('');
  const [newExampleInput, setNewExampleInput] = useState('');
  const [newExampleOutput, setNewExampleOutput] = useState('');
  const [newDifficulty, setNewDifficulty] = useState<Difficulty>('medium');
  const [newDuration, setNewDuration] = useState(30);

  const refreshCases = () => {
    setCases(StorageService.getProblemCases());
  };

  const handleCreateCase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newCase: ProblemCase = {
      id: `case-${Date.now()}`,
      title: newTitle.trim(),
      slug: newTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      synopsis: newSynopsis.trim(),
      description: newDescription.trim(),
      instructions: newInstructions.trim() || 'Gunakan C++17 standar, baca dari stdin dan cetak ke stdout.',
      input_format: newInputFormat.trim(),
      output_format: newOutputFormat.trim(),
      example_input: newExampleInput.trim(),
      example_output: newExampleOutput.trim(),
      difficulty: newDifficulty,
      estimated_duration_minutes: Number(newDuration) || 30,
      max_score: 50,
      status: 'published',
      test_cases: [
        {
          id: `tc-${Date.now()}-1`,
          problem_case_id: `case-${Date.now()}`,
          name: 'Contoh Input Standar',
          input: newExampleInput.trim(),
          expected_output: newExampleOutput.trim(),
          test_type: 'positive',
          comparison_mode: 'normalized',
          visibility: 'public',
          weight: 25,
          order: 1,
        },
      ],
      reference_solution: {
        id: `ref-${Date.now()}`,
        problem_case_id: `case-${Date.now()}`,
        language: 'cpp17',
        code: `#include <iostream>\n\nusing namespace std;\n\nint main() {\n    // Solusi acuan\n    return 0;\n}\n`,
        is_valid: true,
        last_validated_at: new Date().toISOString(),
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    StorageService.saveProblemCase(newCase);
    setIsCreateModalOpen(false);
    refreshCases();
  };

  const handleDeleteCase = (id: string, title: string) => {
    if (confirm(`Yakin ingin menghapus studi kasus "${title}"?`)) {
      StorageService.deleteProblemCase(id);
      refreshCases();
    }
  };

  const filteredCases = cases.filter((c) => {
    const matchSearch =
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.synopsis.toLowerCase().includes(searchTerm.toLowerCase());
    const matchDiff = selectedDifficulty === 'all' || c.difficulty === selectedDifficulty;
    return matchSearch && matchDiff;
  });

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div>
          <span className="text-xs uppercase font-mono tracking-wider text-blue-400 font-semibold">
            Bank Soal Algoritma C++
          </span>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
            Manajemen Studi Kasus & Test Cases
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Kelola {cases.length} studi kasus, konfigurasikan kasus uji otomatis, dan validasi dengan reference solution.
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-600/30 transition shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Studi Kasus Baru</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900 border border-slate-800 rounded-xl p-4">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari studi kasus berdasarkan judul / konsep..."
            className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 text-xs focus:outline-hidden focus:border-blue-500 placeholder:text-slate-500"
          />
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <span className="text-xs text-slate-400 whitespace-nowrap">Tingkat Kesulitan:</span>
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-slate-300 text-xs rounded-lg px-3 py-2 focus:outline-hidden cursor-pointer"
          >
            <option value="all">Semua Tingkat</option>
            <option value="easy">Easy (Dasar)</option>
            <option value="medium">Medium (Menengah)</option>
            <option value="hard">Hard (Kompleks)</option>
          </select>
        </div>
      </div>

      {/* Cases Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCases.map((item, index) => {
          const diffBadge = {
            easy: 'success',
            medium: 'warning',
            hard: 'danger',
          }[item.difficulty] as 'success' | 'warning' | 'danger';

          return (
            <div
              key={item.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between hover:border-slate-700 transition"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-mono text-blue-400 font-semibold">
                    Kasus #{index + 1}
                  </span>
                  <Badge variant={diffBadge} size="sm">
                    {item.difficulty}
                  </Badge>
                </div>

                <h3 className="text-base font-bold text-white tracking-tight line-clamp-1">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                  {item.synopsis}
                </p>

                <div className="flex items-center gap-4 mt-4 pt-3 border-t border-slate-800/80 text-xs text-slate-400">
                  <span className="flex items-center gap-1 font-mono">
                    <Award className="w-3.5 h-3.5 text-amber-400" />
                    <span>{item.max_score} Pts</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <ListChecks className="w-3.5 h-3.5 text-blue-400" />
                    <span>{item.test_cases.length} Kasus Uji</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{item.estimated_duration_minutes}m</span>
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between gap-2">
                <div className="flex items-center space-x-1.5">
                  <button
                    onClick={() => setTestCaseModalCase(item)}
                    className="px-2.5 py-1.5 rounded-lg bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 border border-blue-500/20 text-xs font-semibold transition cursor-pointer flex items-center gap-1"
                  >
                    <ListChecks className="w-3.5 h-3.5" />
                    <span>Test Cases</span>
                  </button>

                  <button
                    onClick={() => setReferenceModalCase(item)}
                    className="px-2.5 py-1.5 rounded-lg bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-400 border border-emerald-500/20 text-xs font-semibold transition cursor-pointer flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Validasi Solusi</span>
                  </button>
                </div>

                <button
                  onClick={() => handleDeleteCase(item.id, item.title)}
                  className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 rounded-lg transition cursor-pointer"
                  title="Hapus Soal"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Test Case Builder Modal */}
      {testCaseModalCase && (
        <TestCaseBuilderModal
          problemCase={testCaseModalCase}
          isOpen={!!testCaseModalCase}
          onClose={() => setTestCaseModalCase(null)}
          onUpdate={refreshCases}
        />
      )}

      {/* Reference Solution Validation Modal */}
      {referenceModalCase && (
        <ReferenceSolutionModal
          problemCase={referenceModalCase}
          isOpen={!!referenceModalCase}
          onClose={() => setReferenceModalCase(null)}
          onUpdate={refreshCases}
        />
      )}

      {/* Create Problem Case Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Tambah Studi Kasus C++ Baru"
        maxWidth="3xl"
      >
        <form onSubmit={handleCreateCase} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Judul Studi Kasus:
            </label>
            <input
              type="text"
              required
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Contoh: Pencarian Elemen Terbesar Menggunakan Divide and Conquer"
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-hidden"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Tingkat Kesulitan:
              </label>
              <select
                value={newDifficulty}
                onChange={(e) => setNewDifficulty(e.target.value as Difficulty)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-hidden"
              >
                <option value="easy">Easy (Dasar)</option>
                <option value="medium">Medium (Menengah)</option>
                <option value="hard">Hard (Kompleks)</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Estimasi Durasi (Menit):
              </label>
              <input
                type="number"
                min={10}
                max={120}
                value={newDuration}
                onChange={(e) => setNewDuration(Number(e.target.value))}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-hidden font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Sinopsis Singkat:
            </label>
            <input
              type="text"
              required
              value={newSynopsis}
              onChange={(e) => setNewSynopsis(e.target.value)}
              placeholder="Ringkasan 1-2 kalimat mengenai masalah..."
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Deskripsi Masalah Lengkap:
            </label>
            <textarea
              rows={4}
              required
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              placeholder="Jelaskan spesifikasi permasalahan, batasan variabel (constraints), dan aturan output..."
              className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-hidden font-mono"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Format Masukan (Input Format):
              </label>
              <textarea
                rows={2}
                value={newInputFormat}
                onChange={(e) => setNewInputFormat(e.target.value)}
                placeholder="Baris 1: Integer N..."
                className="w-full p-2 bg-white border border-slate-300 rounded-lg font-mono focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Format Keluaran (Output Format):
              </label>
              <textarea
                rows={2}
                value={newOutputFormat}
                onChange={(e) => setNewOutputFormat(e.target.value)}
                placeholder="Cetak hasil pada satu baris..."
                className="w-full p-2 bg-white border border-slate-300 rounded-lg font-mono focus:outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Contoh Input (stdin):
              </label>
              <textarea
                rows={3}
                value={newExampleInput}
                onChange={(e) => setNewExampleInput(e.target.value)}
                placeholder="Contoh input..."
                className="w-full p-2 bg-white border border-slate-300 rounded-lg font-mono focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Contoh Output (stdout):
              </label>
              <textarea
                rows={3}
                value={newExampleOutput}
                onChange={(e) => setNewExampleOutput(e.target.value)}
                placeholder="Contoh output..."
                className="w-full p-2 bg-white border border-slate-300 rounded-lg font-mono focus:outline-hidden"
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
              className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold shadow-md"
            >
              Simpan Studi Kasus
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
