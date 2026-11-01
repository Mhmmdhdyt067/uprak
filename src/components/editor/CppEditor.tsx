import React, { useRef, useState } from 'react';
import { RotateCcw, Maximize2, Minimize2, Copy, Check } from 'lucide-react';

interface CppEditorProps {
  value: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
  onResetCode?: () => void;
  fileName?: string;
  compilerBadge?: string;
}

export const CppEditor: React.FC<CppEditorProps> = ({
  value,
  onChange,
  readOnly = false,
  onResetCode,
  fileName = 'main.cpp',
  compilerBadge = 'C++17 (GCC 9.2.0)',
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [fontSize, setFontSize] = useState<number>(14);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const lines = value.split('\n');
  const lineCount = Math.max(lines.length, 1);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (readOnly) return;

    const textarea = textareaRef.current;
    if (!textarea) return;

    const { selectionStart, selectionEnd } = textarea;

    // Handle Tab: insert 4 spaces
    if (e.key === 'Tab') {
      e.preventDefault();
      const tabSpaces = '    ';
      const newValue =
        value.substring(0, selectionStart) + tabSpaces + value.substring(selectionEnd);
      onChange(newValue);

      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = selectionStart + tabSpaces.length;
      }, 0);
      return;
    }

    // Auto-close brackets
    const pairs: Record<string, string> = {
      '(': ')',
      '[': ']',
      '{': '}',
      '"': '"',
      "'": "'",
    };

    if (pairs[e.key]) {
      e.preventDefault();
      const openChar = e.key;
      const closeChar = pairs[openChar];
      const selectedText = value.substring(selectionStart, selectionEnd);

      const newValue =
        value.substring(0, selectionStart) +
        openChar +
        selectedText +
        closeChar +
        value.substring(selectionEnd);
      onChange(newValue);

      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = selectionStart + 1;
      }, 0);
      return;
    }

    // Handle Enter inside {}: auto-indent
    if (e.key === 'Enter') {
      const prevChar = value[selectionStart - 1];
      const nextChar = value[selectionStart];
      if (prevChar === '{' && nextChar === '}') {
        e.preventDefault();
        const newValue =
          value.substring(0, selectionStart) + '\n    \n' + value.substring(selectionEnd);
        onChange(newValue);
        setTimeout(() => {
          textarea.selectionStart = textarea.selectionEnd = selectionStart + 5;
        }, 0);
        return;
      }
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={`flex flex-col bg-[#0b0f19] border border-slate-800 rounded-lg overflow-hidden transition-all ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none border-none' : 'h-full'
      }`}
    >
      {/* Editor Top Toolbar */}
      <div className="h-10 bg-[#111726] border-b border-slate-800 px-3 flex items-center justify-between text-xs select-none">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5 bg-slate-900/90 px-2.5 py-1 rounded border border-slate-700/60">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
            <span className="font-mono text-slate-200 font-medium text-[11px]">{fileName}</span>
          </div>
          <span className="text-[10px] bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded font-mono">
            {compilerBadge}
          </span>
          {readOnly && (
            <span className="text-[10px] bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2 py-0.5 rounded font-mono font-semibold">
              READ-ONLY (SUBMITTED)
            </span>
          )}
        </div>

        {/* Toolbar Controls */}
        <div className="flex items-center space-x-2 text-slate-400">
          {/* Font Size Selector */}
          <div className="flex items-center space-x-1 bg-slate-900/80 px-2 py-0.5 rounded border border-slate-800">
            <span className="text-[10px] text-slate-400">Font:</span>
            <select
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              className="bg-transparent text-slate-300 text-[11px] focus:outline-hidden cursor-pointer"
            >
              <option value={12} className="bg-slate-900">12px</option>
              <option value={13} className="bg-slate-900">13px</option>
              <option value={14} className="bg-slate-900">14px</option>
              <option value={16} className="bg-slate-900">16px</option>
              <option value={18} className="bg-slate-900">18px</option>
            </select>
          </div>

          {/* Copy Button */}
          <button
            onClick={handleCopy}
            title="Salin Kode"
            className="p-1 hover:text-slate-200 hover:bg-slate-800 rounded transition"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          {/* Reset Code Button */}
          {!readOnly && onResetCode && (
            <button
              onClick={onResetCode}
              title="Reset ke Template Awal"
              className="flex items-center space-x-1 px-2 py-1 text-[11px] hover:text-rose-300 hover:bg-rose-950/40 rounded transition border border-transparent hover:border-rose-900/50"
            >
              <RotateCcw className="w-3 h-3 text-rose-400" />
              <span>Reset</span>
            </button>
          )}

          {/* Fullscreen Button */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            title={isFullscreen ? 'Keluar Fullscreen' : 'Fullscreen'}
            className="p-1 hover:text-slate-200 hover:bg-slate-800 rounded transition"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Editor Body: Line Numbers + Textarea */}
      <div className="flex-1 flex overflow-hidden relative font-mono">
        {/* Line Numbers Column */}
        <div
          className="w-12 py-3 bg-[#0c121e] border-r border-slate-800 text-slate-600 select-none text-right pr-3 shrink-0 overflow-hidden"
          style={{ fontSize: `${fontSize}px`, lineHeight: '1.6' }}
        >
          {Array.from({ length: lineCount }).map((_, i) => (
            <div key={i} className="hover:text-slate-400 transition-colors">
              {i + 1}
            </div>
          ))}
        </div>

        {/* Text Input Area */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          readOnly={readOnly}
          spellCheck={false}
          autoCapitalize="off"
          autoComplete="off"
          autoCorrect="off"
          className="flex-1 p-3 bg-transparent text-slate-100 resize-none focus:outline-hidden font-mono leading-relaxed overflow-auto selection:bg-blue-600/40 selection:text-white"
          style={{
            fontSize: `${fontSize}px`,
            lineHeight: '1.6',
            tabSize: 4,
          }}
          placeholder="// Tulis kode C++ Anda di sini..."
        />
      </div>

      {/* Editor Status Bar */}
      <div className="h-6 bg-[#0c111c] border-t border-slate-800 px-3 flex items-center justify-between text-[11px] font-mono text-slate-400 select-none">
        <div className="flex items-center space-x-3">
          <span>Baris: {lineCount}</span>
          <span>Karakter: {value.length}</span>
        </div>
        <div className="flex items-center space-x-3">
          <span>Tab: 4 Spasi</span>
          <span>UTF-8</span>
          <span className="text-emerald-400">● C++ Ready</span>
        </div>
      </div>
    </div>
  );
};
