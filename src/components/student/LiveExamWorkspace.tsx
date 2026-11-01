import React, { useEffect, useState } from 'react';
import { Participant, ExamSession, TestCaseResult, Submission } from '../../types';
import { ProblemPanel } from './ProblemPanel';
import { CppEditor } from '../editor/CppEditor';
import { TestCaseResultsPanel } from './TestCaseResultsPanel';
import { StorageService } from '../../services/storage';
import { CppEngine } from '../../services/cppEngine';
import { ScoringService } from '../../services/scoring';
import { realtime } from '../../services/realtime';
import {
  Terminal,
  Play,
  CheckCircle,
  Clock,
  Wifi,
  CloudCheck,
  AlertTriangle,
  Award,
} from 'lucide-react';

interface LiveExamWorkspaceProps {
  participant: Participant;
  session: ExamSession;
  onExamCompleted: () => void;
}

export const LiveExamWorkspace: React.FC<LiveExamWorkspaceProps> = ({
  participant: initialParticipant,
  session,
  onExamCompleted,
}) => {
  const [participant, setParticipant] = useState<Participant>(initialParticipant);
  const [activeSequence, setActiveSequence] = useState<1 | 2>(1);
  const [code, setCode] = useState<string>('');
  const [saveStatus, setSaveStatus] = useState<string>('Tersimpan di server');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [testResults, setTestResults] = useState<TestCaseResult[]>([]);
  const [customOutput, setCustomOutput] = useState<string>('');
  const [isCustomRunning, setIsCustomRunning] = useState<boolean>(false);
  const [confirmSubmitOpen, setConfirmSubmitOpen] = useState<boolean>(false);

  // Server countdown timer calculation
  const calculateRemainingSeconds = (): number => {
    if (!session.actual_start_at) {
      return session.duration_minutes * 60;
    }
    const startMs = new Date(session.actual_start_at).getTime();
    const durationMs = session.duration_minutes * 60 * 1000;
    const endMs = startMs + durationMs;
    const nowMs = Date.now();
    return Math.max(0, Math.floor((endMs - nowMs) / 1000));
  };

  const [remainingSeconds, setRemainingSeconds] = useState<number>(calculateRemainingSeconds());

  // Determine current active assignment
  const currentAssignment =
    participant.assignments.find((a) => a.sequence_number === activeSequence) ||
    participant.assignments[0];

  const currentProblem = currentAssignment?.problem_case;

  // Sync active assignment and code
  useEffect(() => {
    // If Case 1 is already submitted, default to Case 2
    const asg1 = participant.assignments.find((a) => a.sequence_number === 1);
    const asg2 = participant.assignments.find((a) => a.sequence_number === 2);

    if (asg1?.status === 'submitted' && asg2?.status === 'active') {
      setActiveSequence(2);
      setCode(asg2.code_draft || '');
    } else {
      setActiveSequence(1);
      setCode(asg1?.code_draft || '');
    }
  }, [participant]);

  // Periodic Countdown decrement & Auto-submit trigger
  useEffect(() => {
    const timer = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          triggerAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [code, activeSequence]);

  // Autosave debouncing
  useEffect(() => {
    setSaveStatus('Menyimpan...');
    const timeout = setTimeout(() => {
      StorageService.saveParticipantDraft(participant.session_hash, activeSequence, code);
      setSaveStatus(`Tersimpan (${new Date().toLocaleTimeString('id-ID')})`);
    }, 1200);

    return () => clearTimeout(timeout);
  }, [code, activeSequence, participant.session_hash]);

  const formatTimer = (totalSec: number): string => {
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;
    if (h > 0) {
      return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    }
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // Run tests against public test cases
  const handleRunTests = async () => {
    if (!currentProblem || isRunning) return;
    setIsRunning(true);

    try {
      const publicCases = currentProblem.test_cases.filter((tc) => tc.visibility === 'public');
      const results = await CppEngine.executeAgainstTestCases(code, publicCases, {
        cpuTimeLimit: session.execution_time_limit,
        memoryLimitMb: session.memory_limit_mb,
      });

      setTestResults(results);

      // Broadcast progress to live monitoring
      realtime.broadcast(`admin-monitoring.${session.id}`, 'ParticipantTested', {
        participantId: participant.id,
        nim: participant.nim,
        sequence: activeSequence,
        passed: results.filter((r) => r.is_passed).length,
        total: results.length,
      });
    } catch (e) {
      console.error('Run tests error:', e);
    } finally {
      setIsRunning(false);
    }
  };

  // Run custom input
  const handleRunCustomInput = (customStdin: string) => {
    setIsCustomRunning(true);
    try {
      const stdout = CppEngine.emulateCppExecution(code, customStdin);
      setCustomOutput(stdout);
    } catch (err: unknown) {
      setCustomOutput(err instanceof Error ? `Runtime Error: ${err.message}` : 'Error during execution');
    } finally {
      setIsCustomRunning(false);
    }
  };

  // Final Submit current case
  const handleSubmitCase = async () => {
    if (!currentProblem || isSubmitting) return;
    setIsSubmitting(true);
    setConfirmSubmitOpen(false);

    try {
      // Evaluate against ALL test cases (public + hidden)
      const allCases = currentProblem.test_cases;
      const results = await CppEngine.executeAgainstTestCases(code, allCases, {
        cpuTimeLimit: session.execution_time_limit,
        memoryLimitMb: session.memory_limit_mb,
      });

      const { score, passedCount, totalCount } = ScoringService.calculateSubmissionScore(
        results,
        currentProblem.max_score
      );

      const submission: Submission = {
        id: `sub-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        participant_assignment_id: currentAssignment.id,
        code,
        language_id: 54,
        status: 'submitted',
        score,
        passed_test_cases: passedCount,
        total_test_cases: totalCount,
        submitted_at: new Date().toISOString(),
        test_case_results: results,
      };

      const { nextCaseAvailable, participant: updatedP } = StorageService.submitCaseAssignment(
        participant.session_hash,
        activeSequence,
        submission,
        false
      );

      setParticipant(updatedP);

      // Broadcast event
      realtime.broadcast(`admin-monitoring.${session.id}`, 'CaseSubmitted', {
        participantId: updatedP.id,
        nim: updatedP.nim,
        sequence: activeSequence,
        score,
        isCompleted: !nextCaseAvailable,
      });

      if (nextCaseAvailable) {
        setActiveSequence(2);
        const asg2 = updatedP.assignments.find((a) => a.sequence_number === 2);
        setCode(asg2?.code_draft || '');
        setTestResults([]);
      } else {
        onExamCompleted();
      }
    } catch (e) {
      console.error('Submit error:', e);
      alert('Gagal mengumpulkan jawaban. Coba kembali.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Trigger auto submit when time runs out
  const triggerAutoSubmit = async () => {
    if (!currentProblem) return;
    try {
      const allCases = currentProblem.test_cases;
      const results = await CppEngine.executeAgainstTestCases(code, allCases, {
        cpuTimeLimit: session.execution_time_limit,
        memoryLimitMb: session.memory_limit_mb,
      });

      const { score, passedCount, totalCount } = ScoringService.calculateSubmissionScore(
        results,
        currentProblem.max_score
      );

      const submission: Submission = {
        id: `sub-auto-${Date.now()}`,
        participant_assignment_id: currentAssignment.id,
        code,
        language_id: 54,
        status: 'auto_submitted',
        score,
        passed_test_cases: passedCount,
        total_test_cases: totalCount,
        submitted_at: new Date().toISOString(),
        test_case_results: results,
      };

      StorageService.submitCaseAssignment(
        participant.session_hash,
        activeSequence,
        submission,
        true
      );

      realtime.broadcast(`admin-monitoring.${session.id}`, 'AutoSubmitted', {
        participantId: participant.id,
        nim: participant.nim,
        sequence: activeSequence,
      });

      onExamCompleted();
    } catch (e) {
      console.error('Auto-submit error:', e);
      onExamCompleted();
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-slate-950 font-sans select-none">
      {/* Top Main Navigation Header */}
      <header className="h-14 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-4 z-20 shrink-0">
        {/* Brand & Participant Identity */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center">
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-slate-100 tracking-wide text-xs md:text-sm block leading-none">
                PRACTICAL CODING EXAM
              </span>
              <span className="text-[10px] text-blue-400 font-mono leading-none">
                {session.name}
              </span>
            </div>
          </div>

          <div className="hidden lg:flex items-center space-x-2 border-l border-slate-800 pl-3 text-xs">
            <span className="text-slate-400">Praktikan:</span>
            <span className="text-slate-200 font-semibold">{participant.name}</span>
            <span className="text-blue-400 font-mono text-[11px]">({participant.nim})</span>
          </div>
        </div>

        {/* Center: Case Indicator & Server Countdown Timer */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5 bg-slate-950 px-3 py-1 rounded-lg border border-slate-800 text-xs">
            <span className="text-slate-400 text-[11px]">Kasus:</span>
            <span className="px-2 py-0.5 rounded bg-blue-600/30 text-blue-400 font-semibold font-mono border border-blue-500/30 text-[11px]">
              {activeSequence} / 2
            </span>
          </div>

          <div
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg border transition-all ${
              remainingSeconds < 300
                ? 'bg-rose-950/40 border-rose-800/80 text-rose-300 animate-pulse'
                : 'bg-slate-950 border-slate-800 text-slate-100'
            }`}
          >
            <Clock
              className={`w-4 h-4 ${
                remainingSeconds < 300 ? 'text-rose-400 animate-pulse' : 'text-amber-400'
              }`}
            />
            <span className="font-mono text-xs md:text-sm font-bold tracking-widest">
              {formatTimer(remainingSeconds)}
            </span>
          </div>
        </div>

        {/* Right Action Controls: Run, Submit, Autosave */}
        <div className="flex items-center space-x-3">
          <div className="hidden sm:flex items-center space-x-1 text-[11px] text-slate-400">
            <CloudCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="truncate max-w-32">{saveStatus}</span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleRunTests}
              disabled={isRunning || isSubmitting}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 active:bg-slate-800 text-slate-100 text-xs font-semibold border border-slate-700 transition disabled:opacity-50 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current text-emerald-400" />
              <span>{isRunning ? 'Menguji...' : 'Run & Test'}</span>
            </button>

            <button
              onClick={() => setConfirmSubmitOpen(true)}
              disabled={isSubmitting || currentAssignment?.status === 'submitted'}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white text-xs font-semibold shadow-md shadow-blue-600/30 transition disabled:opacity-50 cursor-pointer"
            >
              <CheckCircle className="w-3.5 h-3.5" />
              <span>
                {activeSequence === 1 ? 'Kumpulkan Studi Kasus 1' : 'Kumpulkan & Selesai Ujian'}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace Split: Left (Problem) | Right (Editor + Test Panel) */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Left Problem Panel */}
        <div className="w-full md:w-5/12 lg:w-4/12 h-1/2 md:h-full shrink-0">
          {currentProblem ? (
            <ProblemPanel problem={currentProblem} sequenceNumber={activeSequence} />
          ) : (
            <div className="p-4 text-slate-400 text-xs">Memuat data soal...</div>
          )}
        </div>

        {/* Right Split: Code Editor (Top) + Test Results (Bottom) */}
        <div className="w-full md:w-7/12 lg:w-8/12 h-1/2 md:h-full flex flex-col overflow-hidden bg-[#0a0e18]">
          {/* Top Code Editor */}
          <div className="flex-1 min-h-[45%] overflow-hidden">
            <CppEditor
              value={code}
              onChange={(newVal) => setCode(newVal)}
              readOnly={currentAssignment?.status === 'submitted'}
              onResetCode={() => {
                if (confirm('Kembalikan kode ke template dasar? Perubahan Anda akan direset.')) {
                  setCode(
                    `#include <iostream>\n\nusing namespace std;\n\nint main() {\n    // Tulis solusi C++ Anda di sini\n    \n    return 0;\n}\n`
                  );
                }
              }}
            />
          </div>

          {/* Bottom Test Results Panel */}
          <div className="h-56 md:h-64 shrink-0">
            <TestCaseResultsPanel
              results={testResults}
              isRunning={isRunning}
              onRunCustomInput={handleRunCustomInput}
              customOutput={customOutput}
              isCustomRunning={isCustomRunning}
            />
          </div>
        </div>
      </div>

      {/* Submission Confirmation Modal */}
      {confirmSubmitOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl text-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center mb-4 border border-blue-500/30">
              <CheckCircle className="w-6 h-6" />
            </div>

            <h3 className="text-base font-bold text-white mb-2">
              Kumpulkan Solusi Studi Kasus #{activeSequence}?
            </h3>

            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Jawaban terakhir Anda akan dievaluasi terhadap seluruh test cases (termasuk hidden
              cases) di server. Setelah dikumpulkan, Anda{' '}
              <strong className="text-rose-400">
                tidak dapat mengubah atau mengedit kembali solusi ini
              </strong>
              .
            </p>

            <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800 text-xs mb-5 space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-400">Studi Kasus:</span>
                <span className="text-slate-200 font-semibold">{currentProblem?.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Skor Maksimal:</span>
                <span className="text-amber-400 font-mono font-semibold">
                  {currentProblem?.max_score} Poin
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Tahap Berikutnya:</span>
                <span className="text-blue-400 font-semibold">
                  {activeSequence === 1 ? 'Membuka Studi Kasus 2' : 'Menyelesaikan Ujian'}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={() => setConfirmSubmitOpen(false)}
                className="px-4 py-2 text-xs text-slate-400 hover:text-slate-200 transition"
              >
                Batal & Lanjut Coding
              </button>

              <button
                type="button"
                onClick={handleSubmitCase}
                disabled={isSubmitting}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer"
              >
                {isSubmitting ? (
                  <span>Mengirim & Menilai...</span>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    <span>Ya, Kumpulkan Solusi</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
