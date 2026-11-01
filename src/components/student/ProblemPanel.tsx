import React, { useState } from 'react';
import { ProblemCase } from '../../types';
import { Copy, Check, Clock, Award, Gauge, BookOpen } from 'lucide-react';
import { Badge } from '../common/Badge';

interface ProblemPanelProps {
  problem: ProblemCase;
  sequenceNumber: 1 | 2;
}

export const ProblemPanel: React.FC<ProblemPanelProps> = ({ problem, sequenceNumber }) => {
  const [copiedInput, setCopiedInput] = useState(false);
  const [copiedOutput, setCopiedOutput] = useState(false);

  const copyToClipboard = (text: string, isInput: boolean) => {
    navigator.clipboard.writeText(text);
    if (isInput) {
      setCopiedInput(true);
      setTimeout(() => setCopiedInput(false), 2000);
    } else {
      setCopiedOutput(true);
      setTimeout(() => setCopiedOutput(false), 2000);
    }
  };

  const difficultyVariant = {
    easy: 'success',
    medium: 'warning',
    hard: 'danger',
  }[problem.difficulty] as 'success' | 'warning' | 'danger';

  return (
    <div className="h-full flex flex-col bg-slate-900 border-r border-slate-800 text-slate-300 text-sm overflow-hidden select-text">
      {/* Header Bar */}
      <div className="p-4 border-b border-slate-800 bg-slate-950/60 shrink-0">
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <span className="text-[11px] font-mono uppercase tracking-wider text-blue-400 font-semibold flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5" />
            Studi Kasus #{sequenceNumber} dari 2
          </span>
          <Badge variant={difficultyVariant} size="sm">
            {problem.difficulty}
          </Badge>
        </div>
        <h1 className="text-lg font-bold text-white tracking-tight leading-snug">
          {problem.title}
        </h1>
        <div className="flex items-center gap-4 mt-2 text-xs text-slate-400">
          <span className="flex items-center gap-1">
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span>Skor Maksimal: <strong className="text-slate-200 font-mono">{problem.max_score} Poin</strong></span>
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-blue-400" />
            <span>Estimasi: {problem.estimated_duration_minutes} Menit</span>
          </span>
        </div>
      </div>

      {/* Scrollable Problem Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5 text-xs leading-relaxed">
        {/* Synopsis */}
        <div className="bg-slate-800/40 p-3 rounded-lg border border-slate-800">
          <h2 className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
            Sinopsis
          </h2>
          <p className="text-slate-300 font-normal leading-normal">
            {problem.synopsis}
          </p>
        </div>

        {/* Description & Rules */}
        <div>
          <h2 className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
            Deskripsi Masalah
          </h2>
          <div className="text-slate-300 whitespace-pre-line space-y-2 leading-relaxed bg-slate-950/30 p-3 rounded-lg border border-slate-800/80">
            {problem.description}
          </div>
        </div>

        {/* Instructions */}
        {problem.instructions && (
          <div>
            <h2 className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Petunjuk Khusus
            </h2>
            <div className="text-slate-300 bg-blue-950/20 border border-blue-900/40 p-3 rounded-lg text-blue-200/90 leading-normal">
              {problem.instructions}
            </div>
          </div>
        )}

        {/* Input & Output Specifications */}
        <div className="grid grid-cols-1 gap-3">
          <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-800">
            <h3 className="text-[11px] font-semibold text-slate-200 mb-1 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
              Format Masukan (Input)
            </h3>
            <p className="font-mono text-slate-300 text-[11px] whitespace-pre-line">
              {problem.input_format}
            </p>
          </div>

          <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-800">
            <h3 className="text-[11px] font-semibold text-slate-200 mb-1 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              Format Keluaran (Output)
            </h3>
            <p className="font-mono text-slate-300 text-[11px] whitespace-pre-line">
              {problem.output_format}
            </p>
          </div>
        </div>

        {/* Example Input & Output with copy button */}
        <div className="space-y-3 pt-2">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-semibold text-slate-300">Contoh Masukan (Example Input):</span>
              <button
                onClick={() => copyToClipboard(problem.example_input, true)}
                className="flex items-center gap-1 text-[10px] text-slate-400 hover:text-slate-200 px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 transition"
              >
                {copiedInput ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedInput ? 'Tersalin' : 'Salin'}</span>
              </button>
            </div>
            <pre className="p-2.5 bg-slate-950 rounded-lg text-emerald-400 font-mono text-xs border border-slate-800 overflow-x-auto leading-tight">
              {problem.example_input}
            </pre>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-semibold text-slate-300">Contoh Keluaran (Example Output):</span>
              <button
                onClick={() => copyToClipboard(problem.example_output, false)}
                className="flex items-center gap-1 text-[10px] text-slate-400 hover:text-slate-200 px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 transition"
              >
                {copiedOutput ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedOutput ? 'Tersalin' : 'Salin'}</span>
              </button>
            </div>
            <pre className="p-2.5 bg-slate-950 rounded-lg text-sky-400 font-mono text-xs border border-slate-800 overflow-x-auto leading-tight">
              {problem.example_output}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
