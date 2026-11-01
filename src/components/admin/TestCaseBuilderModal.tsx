import React, { useState } from 'react';
import { ProblemCase, TestCase, TestType, ComparisonMode, TestCaseVisibility } from '../../types';
import { Modal } from '../common/Modal';
import { StorageService } from '../../services/storage';
import { Plus, Trash2, CheckCircle2, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import { Badge } from '../common/Badge';

interface TestCaseBuilderModalProps {
  problemCase: ProblemCase | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

export const TestCaseBuilderModal: React.FC<TestCaseBuilderModalProps> = ({
  problemCase,
  isOpen,
  onClose,
  onUpdate,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState('');
  const [input, setInput] = useState('');
  const [expectedOutput, setExpectedOutput] = useState('');
  const [testType, setTestType] = useState<TestType>('positive');
  const [comparisonMode, setComparisonMode] = useState<ComparisonMode>('normalized');
  const [visibility, setVisibility] = useState<TestCaseVisibility>('public');
  const [weight, setWeight] = useState<number>(20);

  if (!problemCase) return null;

  const handleSaveTestCase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !expectedOutput.trim()) {
      alert('Nama dan Expected Output wajib diisi.');
      return;
    }

    const newTc: TestCase = {
      id: `tc-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      problem_case_id: problemCase.id,
      name: name.trim(),
      input,
      expected_output: expectedOutput,
      test_type: testType,
      comparison_mode: comparisonMode,
      visibility,
      weight: Number(weight) || 10,
      order: problemCase.test_cases.length + 1,
    };

    StorageService.saveTestCase(problemCase.id, newTc);
    setIsAdding(false);
    setName('');
    setInput('');
    setExpectedOutput('');
    onUpdate();
  };

  const handleDeleteTestCase = (testCaseId: string) => {
    if (confirm('Hapus test case ini?')) {
      StorageService.deleteTestCase(problemCase.id, testCaseId);
      onUpdate();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Test Case Builder: ${problemCase.title}`}
      maxWidth="4xl"
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h4 className="text-sm font-bold text-slate-800">
              Kelola Kasus Uji Otomatis (Test Cases)
            </h4>
            <p className="text-xs text-slate-500">
              Sistem akan menjalankan input terhadap C++ mahasiswa dan membandingkannya dengan Expected Output.
            </p>
          </div>

          <button
            onClick={() => setIsAdding(!isAdding)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{isAdding ? 'Batal Tambah' : 'Tambah Test Case Baru'}</span>
          </button>
        </div>

        {/* Add New Test Case Form */}
        {isAdding && (
          <form
            onSubmit={handleSaveTestCase}
            className="p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-4 text-xs animate-in fade-in"
          >
            <h5 className="font-bold text-slate-900 text-sm">Formulir Test Case Baru</h5>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Nama Test Case:
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Input Normal Batas Atas"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-hidden focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Jenis Pengujian:
                  </label>
                  <select
                    value={testType}
                    onChange={(e) => setTestType(e.target.value as TestType)}
                    className="w-full px-2.5 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-hidden"
                  >
                    <option value="positive">Positive</option>
                    <option value="negative">Negative</option>
                    <option value="boundary">Boundary</option>
                    <option value="edge_case">Edge Case</option>
                    <option value="error_handling">Error Handling</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Bobot (Poin):
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={50}
                    value={weight}
                    onChange={(e) => setWeight(Number(e.target.value))}
                    className="w-full px-2.5 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-hidden font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Mode Perbandingan (Comparison Mode):
                </label>
                <select
                  value={comparisonMode}
                  onChange={(e) => setComparisonMode(e.target.value as ComparisonMode)}
                  className="w-full px-2.5 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-hidden"
                >
                  <option value="normalized">Normalized Whitespace (Standar Competitive Programming)</option>
                  <option value="trimmed">Trimmed Whitespace</option>
                  <option value="exact">Exact Match</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Visibilitas Peserta:
                </label>
                <select
                  value={visibility}
                  onChange={(e) => setVisibility(e.target.value as TestCaseVisibility)}
                  className="w-full px-2.5 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-hidden"
                >
                  <option value="public">Public (Dapat dilihat saat Run/Test)</option>
                  <option value="hidden">Hidden (Hanya diuji saat final Submit)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1 font-mono">
                  Input (stdin):
                </label>
                <textarea
                  rows={4}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Masukkan input yang dialirkan ke std::cin..."
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-lg font-mono text-xs focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1 font-mono">
                  Expected Output (stdout):
                </label>
                <textarea
                  rows={4}
                  required
                  value={expectedOutput}
                  onChange={(e) => setExpectedOutput(e.target.value)}
                  placeholder="Keluaran yang harus dihasilkan std::cout..."
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-lg font-mono text-xs focus:outline-hidden"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-3.5 py-2 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold"
              >
                Simpan Test Case
              </button>
            </div>
          </form>
        )}

        {/* Existing Test Cases Table */}
        <div className="space-y-3">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Daftar Test Cases ({problemCase.test_cases.length} Total)
          </div>

          <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden text-xs">
            {problemCase.test_cases.map((tc, idx) => (
              <div key={tc.id} className="p-4 bg-white hover:bg-slate-50/50 transition space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-bold text-slate-400">#{idx + 1}</span>
                    <span className="font-bold text-slate-900 text-sm">{tc.name}</span>
                    <Badge variant={tc.visibility === 'public' ? 'info' : 'neutral'} size="sm">
                      {tc.visibility === 'public' ? (
                        <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> Public</span>
                      ) : (
                        <span className="flex items-center gap-1"><EyeOff className="w-3 h-3" /> Hidden</span>
                      )}
                    </Badge>
                    <Badge variant="neutral" size="sm">
                      {tc.test_type}
                    </Badge>
                  </div>

                  <div className="flex items-center space-x-3">
                    <span className="font-mono text-slate-600 font-semibold">
                      Bobot: {tc.weight} poin
                    </span>
                    <button
                      onClick={() => handleDeleteTestCase(tc.id)}
                      className="p-1 text-slate-400 hover:text-rose-600 rounded transition cursor-pointer"
                      title="Hapus Test Case"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-slate-400 block mb-0.5">
                      Input (stdin):
                    </span>
                    <pre className="p-2 bg-slate-900 text-emerald-400 rounded-lg font-mono text-[11px] overflow-x-auto whitespace-pre-wrap max-h-24">
                      {tc.input || '[No Input]'}
                    </pre>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-semibold text-slate-400 block mb-0.5">
                      Expected Output (stdout):
                    </span>
                    <pre className="p-2 bg-slate-900 text-sky-400 rounded-lg font-mono text-[11px] overflow-x-auto whitespace-pre-wrap max-h-24">
                      {tc.expected_output}
                    </pre>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
};
