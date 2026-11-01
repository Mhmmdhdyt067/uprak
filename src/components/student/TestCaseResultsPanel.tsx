import React, { useState } from 'react';
import { TestCaseResult } from '../../types';
import { Play, CheckCircle2, XCircle, AlertCircle, Clock, Terminal, ChevronRight } from 'lucide-react';

interface TestCaseResultsPanelProps {
  results: TestCaseResult[];
  isRunning: boolean;
  onRunCustomInput?: (customInput: string) => void;
  customOutput?: string;
  isCustomRunning?: boolean;
}

export const TestCaseResultsPanel: React.FC<TestCaseResultsPanelProps> = ({
  results,
  isRunning,
  onRunCustomInput,
  customOutput,
  isCustomRunning = false,
}) => {
  const [activeTab, setActiveTab] = useState<'tests' | 'custom'>('tests');
  const [selectedTestIndex, setSelectedTestIndex] = useState<number>(0);
  const [customStdin, setCustomStdin] = useState<string>('');

  const publicResults = results.filter((r) => r.visibility === 'public');
  const passedCount = publicResults.filter((r) => r.is_passed).length;
  const totalCount = publicResults.length;
  const allPassed = totalCount > 0 && passedCount === totalCount;

  const currentTest = publicResults[selectedTestIndex] || publicResults[0];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pass':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="w-3 h-3" /> PASS
          </span>
        );
      case 'fail':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-rose-500/20 text-rose-400 border border-rose-500/30">
            <XCircle className="w-3 h-3" /> FAIL
          </span>
        );
      case 'compilation_error':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-rose-900/40 text-rose-300 border border-rose-800">
            <AlertCircle className="w-3 h-3" /> COMPILE ERROR
          </span>
        );
      case 'time_limit_exceeded':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <Clock className="w-3 h-3" /> TLE
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-orange-500/20 text-orange-400 border border-orange-500/30">
            <AlertCircle className="w-3 h-3" /> RUNTIME ERROR
          </span>
        );
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#0d1322] border-t border-slate-800 text-slate-300 overflow-hidden font-mono text-xs">
      {/* Top Header / Tab Bar */}
      <div className="h-9 bg-[#111827] border-b border-slate-800 px-3 flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveTab('tests')}
            className={`px-3 py-1 rounded text-xs font-semibold flex items-center gap-1.5 transition ${
              activeTab === 'tests'
                ? 'bg-slate-800 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Terminal className="w-3.5 h-3.5 text-blue-400" />
            <span>Hasil Test Cases</span>
            {totalCount > 0 && (
              <span
                className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] ${
                  allPassed ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-700 text-slate-300'
                }`}
              >
                {passedCount}/{totalCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('custom')}
            className={`px-3 py-1 rounded text-xs font-semibold flex items-center gap-1.5 transition ${
              activeTab === 'custom'
                ? 'bg-slate-800 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>Uji Input Mandiri (Custom Stdin)</span>
          </button>
        </div>

        {/* Global Test Status Summary */}
        {activeTab === 'tests' && publicResults.length > 0 && !isRunning && (
          <div className="text-[11px] font-semibold tracking-wider">
            {allPassed ? (
              <span className="text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {totalCount}/{totalCount} TEST CASES PASSED
              </span>
            ) : (
              <span className="text-amber-400 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {passedCount}/{totalCount} TEST CASES PASSED
              </span>
            )}
          </div>
        )}
      </div>

      {/* Main Tab Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'tests' ? (
          isRunning ? (
            <div className="h-full flex flex-col items-center justify-center space-y-2 text-slate-400">
              <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-xs text-blue-300 font-mono">Mengompilasi dan menguji di sandbox C++...</p>
            </div>
          ) : publicResults.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-1">
              <Play className="w-7 h-7 text-slate-600 mb-1" />
              <p className="text-xs text-slate-400">Belum ada evaluasi kode.</p>
              <p className="text-[11px] text-slate-500">
                Klik tombol <strong className="text-slate-300">Run & Test</strong> di atas untuk menjalankan test cases.
              </p>
            </div>
          ) : (
            <div className="h-full flex flex-col md:flex-row overflow-hidden">
              {/* Left Test Case Nav Pills */}
              <div className="w-full md:w-56 bg-slate-950/60 border-r border-slate-800/80 p-2 overflow-y-auto space-y-1.5 shrink-0">
                {publicResults.map((test, idx) => {
                  const isSelected = selectedTestIndex === idx;
                  return (
                    <button
                      key={test.id || idx}
                      onClick={() => setSelectedTestIndex(idx)}
                      className={`w-full text-left p-2 rounded-md transition flex items-center justify-between border ${
                        isSelected
                          ? 'bg-slate-800/90 border-slate-700 text-white shadow-xs'
                          : 'bg-slate-900/40 border-transparent text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                      }`}
                    >
                      <div className="truncate">
                        <div className="text-[11px] font-semibold text-slate-200 truncate">
                          Case {idx + 1}: {test.name}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          {test.execution_time_seconds.toFixed(3)}s • {test.memory_kb} KB
                        </div>
                      </div>
                      <div className="shrink-0 ml-1.5">
                        {test.is_passed ? (
                          <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block"></span>
                        ) : (
                          <span className="w-2 h-2 rounded-full bg-rose-400 inline-block"></span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Right Test Case Details Inspection */}
              {currentTest && (
                <div className="flex-1 p-3 overflow-y-auto space-y-3 bg-[#0d1322]">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
                    <div>
                      <h4 className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
                        <span>Test Case {selectedTestIndex + 1}: {currentTest.name}</span>
                      </h4>
                      <span className="text-[10px] text-slate-400">
                        Bobot Nilai: {currentTest.weight} poin • Waktu: {currentTest.execution_time_seconds.toFixed(3)}s
                      </span>
                    </div>
                    <div>{getStatusBadge(currentTest.status)}</div>
                  </div>

                  {/* Compilation Error or Runtime Error Notice */}
                  {currentTest.error_message && (
                    <div className="p-2.5 rounded-lg bg-rose-950/40 border border-rose-900 text-rose-300 text-xs font-mono space-y-1">
                      <div className="font-semibold text-rose-400 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>Keterangan Error:</span>
                      </div>
                      <pre className="whitespace-pre-wrap text-[11px] leading-tight">
                        {currentTest.error_message}
                      </pre>
                    </div>
                  )}

                  {/* Output Comparison Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px]">
                    <div>
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                        Expected Output (Keluaran yang Diharapkan):
                      </span>
                      <pre className="p-2 rounded bg-slate-950 border border-slate-800 text-sky-400 font-mono overflow-x-auto min-h-16 leading-tight whitespace-pre-wrap">
                        {currentTest.expected_output || '[Tidak Disediakan]'}
                      </pre>
                    </div>

                    <div>
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                        Actual Output (Keluaran Kode Anda):
                      </span>
                      <pre
                        className={`p-2 rounded border font-mono overflow-x-auto min-h-16 leading-tight whitespace-pre-wrap ${
                          currentTest.is_passed
                            ? 'bg-slate-950 border-emerald-900/60 text-emerald-400'
                            : 'bg-slate-950 border-rose-900/60 text-rose-400'
                        }`}
                      >
                        {currentTest.actual_output || (currentTest.status === 'compilation_error' ? '[Compilation Error]' : '[Output Kosong]')}
                      </pre>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        ) : (
          /* Custom Stdin Runner */
          <div className="h-full p-3 flex flex-col md:flex-row gap-3 overflow-y-auto">
            <div className="flex-1 flex flex-col">
              <label className="text-[10px] uppercase font-semibold text-slate-400 mb-1">
                Masukkan Custom Input (stdin):
              </label>
              <textarea
                value={customStdin}
                onChange={(e) => setCustomStdin(e.target.value)}
                placeholder="Ketik input untuk diuji terhadap kode C++ Anda..."
                className="flex-1 min-h-24 p-2 bg-slate-950 border border-slate-800 rounded font-mono text-xs text-slate-100 focus:outline-hidden focus:border-blue-500"
              />
              <button
                onClick={() => onRunCustomInput && onRunCustomInput(customStdin)}
                disabled={isCustomRunning}
                className="mt-2 self-start flex items-center gap-1.5 px-3 py-1.5 rounded bg-blue-600 hover:bg-blue-500 text-white font-sans text-xs font-medium disabled:opacity-50 transition"
              >
                <Play className="w-3 h-3 fill-current" />
                <span>{isCustomRunning ? 'Menjalankan...' : 'Jalankan dengan Custom Input'}</span>
              </button>
            </div>

            <div className="flex-1 flex flex-col">
              <label className="text-[10px] uppercase font-semibold text-slate-400 mb-1">
                Keluaran Program (stdout):
              </label>
              <pre className="flex-1 min-h-24 p-2 bg-slate-950 border border-slate-800 rounded font-mono text-xs text-emerald-400 overflow-x-auto whitespace-pre-wrap">
                {customOutput || '// Hasil stdout akan tampil di sini...'}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
