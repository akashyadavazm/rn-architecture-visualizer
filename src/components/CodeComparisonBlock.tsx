import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check, AlertTriangle, ShieldCheck, Columns, Square } from 'lucide-react';

interface CodeComparisonBlockProps {
  title?: string;
  mistakeCode?: string;
  mistakeExplanation?: string;
  mistakeLanguage?: string;
  solutionCode?: string;
  solutionExplanation?: string;
  solutionLanguage?: string;
}

export const CodeComparisonBlock: React.FC<CodeComparisonBlockProps> = ({
  title = 'Code Architecture Comparison',
  mistakeCode = '',
  mistakeExplanation = '',
  mistakeLanguage = 'typescript',
  solutionCode = '',
  solutionExplanation = '',
  solutionLanguage = 'typescript',
}) => {
  const [activeTab, setActiveTab] = useState<'mistake' | 'solution'>('solution');
  const [isSplitView, setIsSplitView] = useState(false);
  const [copiedMistake, setCopiedMistake] = useState(false);
  const [copiedSolution, setCopiedSolution] = useState(false);

  const copyToClipboard = (text: string, type: 'mistake' | 'solution') => {
    navigator.clipboard.writeText(text);
    if (type === 'mistake') {
      setCopiedMistake(true);
      setTimeout(() => setCopiedMistake(false), 2000);
    } else {
      setCopiedSolution(true);
      setTimeout(() => setCopiedSolution(false), 2000);
    }
  };

  return (
    <div className="border border-white/10 bg-[#0d0d0d] rounded-2xl overflow-hidden shadow-xl space-y-0">
      {/* Top Bar Header */}
      <div className="bg-black/60 border-b border-white/10 px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-3">
        <h4 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#00ff88]"></span>
          <span>{title}</span>
        </h4>

        {/* View mode & Tab toggles */}
        <div className="flex items-center gap-2">
          {/* Split / Tabbed View toggle (visible on md screens and up) */}
          <div className="hidden md:flex items-center p-0.5 bg-black/60 border border-white/10 rounded-lg">
            <button
              type="button"
              onClick={() => setIsSplitView(false)}
              className={`p-1.5 rounded text-xs transition-colors ${
                !isSplitView ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="Tabbed view"
            >
              <Square className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setIsSplitView(true)}
              className={`p-1.5 rounded text-xs transition-colors ${
                isSplitView ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="Split side-by-side view"
            >
              <Columns className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Active Tab Buttons (when not in split view) */}
          {!isSplitView && (
            <div className="flex items-center p-1 bg-black/60 border border-white/10 rounded-xl">
              <button
                type="button"
                onClick={() => setActiveTab('mistake')}
                className={`px-3 py-1 text-xs font-mono font-semibold rounded-lg transition-all ${
                  activeTab === 'mistake'
                    ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Common Mistake
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('solution')}
                className={`px-3 py-1 text-xs font-mono font-semibold rounded-lg transition-all ${
                  activeTab === 'solution'
                    ? 'bg-emerald-500/20 text-[#00ff88] border border-[#00ff88]/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Architect Solution
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Code Area */}
      {isSplitView ? (
        /* Split Side-by-Side View */
        <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-white/10">
          {/* Mistake Side */}
          <div className="flex flex-col">
            <div className="px-4 py-2 bg-red-950/20 border-b border-red-900/30 flex items-center justify-between text-xs font-mono text-red-300">
              <span className="flex items-center gap-1.5 font-bold">
                <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                <span>Common Mistake (Lag / Leak)</span>
              </span>
              <button
                type="button"
                onClick={() => copyToClipboard(mistakeCode, 'mistake')}
                className="hover:text-white flex items-center gap-1 transition-colors"
              >
                {copiedMistake ? <Check className="w-3 h-3 text-[#00ff88]" /> : <Copy className="w-3 h-3" />}
                <span>{copiedMistake ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <pre className="p-4 bg-[#0a0a0a] text-xs font-mono text-red-200/90 overflow-x-auto flex-1">
              <code>{mistakeCode}</code>
            </pre>
            {mistakeExplanation && (
              <div className="p-3 bg-red-950/10 border-t border-red-900/20 text-xs text-red-300/90 leading-relaxed">
                {mistakeExplanation}
              </div>
            )}
          </div>

          {/* Solution Side */}
          <div className="flex flex-col">
            <div className="px-4 py-2 bg-emerald-950/20 border-b border-emerald-900/30 flex items-center justify-between text-xs font-mono text-[#00ff88]">
              <span className="flex items-center gap-1.5 font-bold">
                <ShieldCheck className="w-3.5 h-3.5 text-[#00ff88]" />
                <span>Architect Solution (Production Ready)</span>
              </span>
              <button
                type="button"
                onClick={() => copyToClipboard(solutionCode, 'solution')}
                className="hover:text-white flex items-center gap-1 transition-colors"
              >
                {copiedSolution ? <Check className="w-3 h-3 text-[#00ff88]" /> : <Copy className="w-3 h-3" />}
                <span>{copiedSolution ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <pre className="p-4 bg-[#0a0a0a] text-xs font-mono text-emerald-200/90 overflow-x-auto flex-1">
              <code>{solutionCode}</code>
            </pre>
            {solutionExplanation && (
              <div className="p-3 bg-emerald-950/10 border-t border-emerald-900/20 text-xs text-[#00ff88]/90 leading-relaxed">
                {solutionExplanation}
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Tabbed View */
        <AnimatePresence mode="wait">
          {activeTab === 'mistake' ? (
            <motion.div
              key="mistake-tab"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
              className="flex flex-col"
            >
              <div className="px-4 py-2 bg-red-950/20 border-b border-red-900/30 flex items-center justify-between text-xs font-mono text-red-300">
                <span className="flex items-center gap-1.5 font-bold">
                  <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                  <span>Common Mistake (Frame Drops & Leakage)</span>
                </span>
                <button
                  type="button"
                  onClick={() => copyToClipboard(mistakeCode, 'mistake')}
                  className="hover:text-white flex items-center gap-1 transition-colors"
                >
                  {copiedMistake ? <Check className="w-3 h-3 text-[#00ff88]" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedMistake ? 'Copied' : 'Copy Code'}</span>
                </button>
              </div>
              <pre className="p-4 sm:p-5 bg-[#0a0a0a] text-xs sm:text-[13px] font-mono text-red-200/90 overflow-x-auto leading-relaxed">
                <code>{mistakeCode}</code>
              </pre>
              {mistakeExplanation && (
                <div className="p-4 bg-red-950/10 border-t border-red-900/20 text-xs text-red-300/90 leading-relaxed flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <span>{mistakeExplanation}</span>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="solution-tab"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
              className="flex flex-col"
            >
              <div className="px-4 py-2 bg-emerald-950/20 border-b border-emerald-900/30 flex items-center justify-between text-xs font-mono text-[#00ff88]">
                <span className="flex items-center gap-1.5 font-bold">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#00ff88]" />
                  <span>Architect Solution (60FPS / 120FPS Production Ready)</span>
                </span>
                <button
                  type="button"
                  onClick={() => copyToClipboard(solutionCode, 'solution')}
                  className="hover:text-white flex items-center gap-1 transition-colors"
                >
                  {copiedSolution ? <Check className="w-3 h-3 text-[#00ff88]" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedSolution ? 'Copied' : 'Copy Code'}</span>
                </button>
              </div>
              <pre className="p-4 sm:p-5 bg-[#0a0a0a] text-xs sm:text-[13px] font-mono text-emerald-200/90 overflow-x-auto leading-relaxed">
                <code>{solutionCode}</code>
              </pre>
              {solutionExplanation && (
                <div className="p-4 bg-emerald-950/10 border-t border-emerald-900/20 text-xs text-[#00ff88]/90 leading-relaxed flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#00ff88] shrink-0 mt-0.5" />
                  <span>{solutionExplanation}</span>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
};
