import React, { useState } from 'react';
import { ProblemCase, TestCaseResult } from '../../types';
import { Modal } from '../common/Modal';
import { CppEngine } from '../../services/cppEngine';
import { StorageService } from '../../services/storage';
import { Play, CheckCircle2, XCircle, ShieldCheck, Clock } from 'lucide-react';

interface ReferenceSolutionModalProps {
  problemCase: ProblemCase | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

export const ReferenceSolutionModal: React.FC<ReferenceSolutionModalProps> = ({
  problemCase,
  isOpen,
  onClose,
  onUpdate,
}) => {
  const [isValidating, setIsValidating] = useState(false);
  const [results, setResults] = useState<TestCaseResult[]>([]);
  const [validationCompleted, setValidationCompleted] = useState(false);

  if (!problemCase || !problemCase.reference_solution) return null;

  const handleValidate = async () => {
    if (!problemCase || !problemCase.reference_solution) return;
    const refSol = problemCase.reference_solution;

    setIsValidating(true);
    setResults([]);

    try {
      const allResults = await CppEngine.executeAgainstTestCases(
        refSol.code,
        problemCase.test_cases
      );

      setResults(allResults);
      setValidationCompleted(true);

      const allPassed = allResults.every((r) => r.is_passed);
      if (allPassed) {
        refSol.is_valid = true;
        refSol.last_validated_at = new Date().toISOString();
        StorageService.saveProblemCase(problemCase);
        onUpdate();
      }
    } catch (e) {
      console.error('Validation error:', e);
    } finally {
      setIsValidating(false);
    }
  };

  const allPassed = results.length > 0 && results.every((r) => r.is_passed);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Validasi Reference Solution: ${problemCase.title}`}
      maxWidth="3xl"
    >
      <div className="space-y-5 text-xs">
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
          <div>
            <span className="font-semibold text-slate-800 text-sm block">
              Reference Solution C++17
            </span>
            <span className="text-slate-500 text-[11px]">
              Solusi acuan resmi untuk memastikan seluruh test case (public & hidden) valid.
            </span>
          </div>

          <button
            onClick={handleValidate}
            disabled={isValidating}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold transition disabled:opacity-50 cursor-pointer shadow-sm"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{isValidating ? 'Menguji...' : 'Jalankan Validasi Solusi'}</span>
          </button>
        </div>

        {/* Validation Results Banner */}
        {validationCompleted && (
          <div
            className={`p-4 rounded-xl border flex items-center justify-between ${
              allPassed
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-rose-50 border-rose-200 text-rose-800'
            }`}
          >
            <div className="flex items-center gap-2.5">
              {allPassed ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              ) : (
                <XCircle className="w-5 h-5 text-rose-600" />
              )}
              <div>
                <span className="font-bold text-sm block">
                  {allPassed ? 'Semua Test Case Berhasil Tervalidasi!' : 'Ditemukan Test Case yang Gagal'}
                </span>
                <span className="text-[11px]">
                  {results.filter((r) => r.is_passed).length} dari {results.length} test cases lulus evaluasi.
                </span>
              </div>
            </div>

            {allPassed && (
              <span className="px-3 py-1 rounded-full bg-emerald-600 text-white font-bold text-[10px] uppercase tracking-wider">
                100% VALID
              </span>
            )}
          </div>
        )}

        {/* Test Case Breakdown if run */}
        {results.length > 0 && (
          <div className="space-y-2">
            <h5 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
              Hasil Pengujian Test Case:
            </h5>
            <div className="divide-y divide-slate-100 border border-slate-200 rounded-lg overflow-hidden">
              {results.map((res, i) => (
                <div key={res.id || i} className="p-3 bg-white flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-slate-400">#{i + 1}</span>
                    <span className="font-semibold text-slate-800">{res.name}</span>
                    <span className="text-[10px] text-slate-400 font-mono">({res.visibility})</span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <span className="text-slate-500 font-mono text-[11px]">
                      {res.execution_time_seconds.toFixed(3)}s
                    </span>
                    {res.is_passed ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700">
                        PASS
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-700">
                        FAIL
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reference Source Code Viewer */}
        <div>
          <label className="block font-semibold text-slate-700 mb-1">
            Kode C++ Reference Solution:
          </label>
          <pre className="p-4 bg-slate-950 text-slate-100 rounded-xl font-mono text-xs overflow-x-auto leading-relaxed border border-slate-800 max-h-80">
            {problemCase.reference_solution.code}
          </pre>
        </div>
      </div>
    </Modal>
  );
};
