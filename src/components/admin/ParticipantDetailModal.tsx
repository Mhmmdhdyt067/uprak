import React, { useState } from 'react';
import { Participant } from '../../types';
import { Modal } from '../common/Modal';
import { StorageService } from '../../services/storage';
import {
  Code,
  CheckCircle2,
  XCircle,
  Clock,
  Terminal,
  User,
  Award,
  AlertCircle,
} from 'lucide-react';
import { Badge } from '../common/Badge';

interface ParticipantDetailModalProps {
  participant: Participant | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

export const ParticipantDetailModal: React.FC<ParticipantDetailModalProps> = ({
  participant,
  isOpen,
  onClose,
  onUpdate,
}) => {
  const [selectedCaseSeq, setSelectedCaseSeq] = useState<1 | 2>(1);

  if (!participant) return null;

  const currentAssignment =
    participant.assignments.find((a) => a.sequence_number === selectedCaseSeq) ||
    participant.assignments[0];

  const problem = currentAssignment?.problem_case;
  const submission = currentAssignment?.submission;
  const testResults = submission?.test_case_results || [];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Inspeksi Lembar Jawaban: ${participant.name} (${participant.nim})`}
      maxWidth="5xl"
    >
      <div className="space-y-5 text-xs text-slate-700">
        {/* Student Profile Quick Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 bg-slate-50 border border-slate-200 rounded-xl">
          <div>
            <span className="text-[10px] uppercase font-semibold text-slate-400 block">
              Nama Lengkap
            </span>
            <span className="font-bold text-slate-900 text-sm">{participant.name}</span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-semibold text-slate-400 block">
              NIM
            </span>
            <span className="font-mono text-blue-600 font-bold text-sm">{participant.nim}</span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-semibold text-slate-400 block">
              Status Pengerjaan
            </span>
            <span className="font-semibold text-slate-800 capitalize">{participant.status}</span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-semibold text-slate-400 block">
              Total Skor Akumulasi
            </span>
            <span className="font-mono font-black text-blue-600 text-base">
              {participant.total_score} <span className="text-xs font-normal text-slate-500">/ 100</span>
            </span>
          </div>
        </div>

        {/* Case 1 vs Case 2 Tab Selector */}
        <div className="flex items-center space-x-2 border-b border-slate-200 pb-2">
          {participant.assignments.map((asg) => {
            const isSelected = selectedCaseSeq === asg.sequence_number;
            return (
              <button
                key={asg.id}
                onClick={() => setSelectedCaseSeq(asg.sequence_number)}
                className={`px-4 py-2 rounded-lg font-semibold text-xs flex items-center gap-2 transition cursor-pointer ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <span>Studi Kasus #{asg.sequence_number}</span>
                <span className="font-mono text-[10px] bg-black/20 px-1.5 py-0.5 rounded">
                  {asg.score.toFixed(1)} Pts
                </span>
              </button>
            );
          })}
        </div>

        {/* Case Detail Section */}
        {problem && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-slate-900 text-sm">{problem.title}</h4>
                <p className="text-slate-500 text-xs mt-0.5">{problem.synopsis}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={currentAssignment.status === 'submitted' ? 'success' : 'warning'}>
                  {currentAssignment.status}
                </Badge>
                <span className="font-mono font-bold text-slate-800 text-sm">
                  Skor: {currentAssignment.score} / {currentAssignment.max_score}
                </span>
              </div>
            </div>

            {/* Test Case Evaluation Results if Submitted */}
            {testResults.length > 0 && (
              <div className="space-y-2">
                <h5 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                  Rincian Evaluasi Seluruh Test Cases (Public & Hidden):
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                  {testResults.map((tr, idx) => (
                    <div
                      key={tr.id || idx}
                      className={`p-2.5 rounded-lg border text-[11px] ${
                        tr.is_passed
                          ? 'bg-emerald-50/60 border-emerald-200 text-emerald-900'
                          : 'bg-rose-50/60 border-rose-200 text-rose-900'
                      }`}
                    >
                      <div className="flex items-center justify-between font-semibold mb-1">
                        <span className="truncate">{tr.name}</span>
                        {tr.is_passed ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        ) : (
                          <XCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                        )}
                      </div>
                      <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                        <span>{tr.visibility}</span>
                        <span>{tr.execution_time_seconds.toFixed(3)}s</span>
                        <span className="font-bold text-slate-700">+{tr.score_earned} Poin</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Source Code Viewer (Live Draft or Final Submission) */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                  <Terminal className="w-4 h-4 text-slate-600" />
                  <span>
                    Source Code C++ ({currentAssignment.status === 'submitted' ? 'Jawaban Final' : 'Draft Terakhir'}):
                  </span>
                </span>
                <span className="text-[11px] text-slate-400 font-mono">
                  Tersimpan: {new Date(currentAssignment.last_saved_at).toLocaleTimeString('id-ID')}
                </span>
              </div>

              <pre className="p-4 bg-slate-950 text-slate-100 rounded-xl font-mono text-xs overflow-x-auto leading-relaxed border border-slate-800 max-h-96">
                {currentAssignment.code_draft || '// Tidak ada kode yang tersimpan.'}
              </pre>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
