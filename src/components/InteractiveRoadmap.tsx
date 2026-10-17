import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Cpu,
  Zap,
  Activity,
  ShieldCheck,
  ChevronDown,
  ChevronRight,
  Clock,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Layers,
} from 'lucide-react';
import { Module, Topic } from '../types';
import { useTopicProgress } from '../lib/progressStore';

interface InteractiveRoadmapProps {
  modules: Module[];
}

export const InteractiveRoadmap: React.FC<InteractiveRoadmapProps> = ({ modules }) => {
  // Default to Stage 1 expanded
  const [expandedStage, setExpandedStage] = useState<number>(1);
  const { isTopicMastered } = useTopicProgress();

  const getStageIcon = (stageNumber: number) => {
    switch (stageNumber) {
      case 1:
        return <Cpu className="w-5 h-5 text-[#00ff88]" />;
      case 2:
        return <Zap className="w-5 h-5 text-[#00ccff]" />;
      case 3:
        return <Activity className="w-5 h-5 text-amber-400" />;
      case 4:
        return <ShieldCheck className="w-5 h-5 text-purple-400" />;
      default:
        return <Layers className="w-5 h-5 text-[#00ff88]" />;
    }
  };

  const getDifficultyBadge = (difficulty: Topic['difficulty']) => {
    switch (difficulty) {
      case 'Architect':
        return (
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-purple-950/80 text-purple-300 border border-purple-800/60">
            Architect Level
          </span>
        );
      case 'Intermediate':
        return (
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-950/80 text-[#00ccff] border border-cyan-800/60">
            Intermediate
          </span>
        );
      default:
        return (
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-950/80 text-[#00ff88] border border-emerald-800/60">
            Beginner
          </span>
        );
    }
  };

  return (
    <div id="roadmap" className="space-y-6">
      {/* Section Title */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-semibold text-[#00ff88] uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-[#00ff88]" />
            <span>Interactive Curriculum Blueprint</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
            The 4-Stage Senior Mobile Roadmap
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Click any stage node below to reveal in-depth architectural topics, interactive engine visualizers, and code comparisons.
          </p>
        </div>

        <div className="text-xs font-mono text-slate-400 shrink-0">
          <span>Stages: </span>
          <span className="text-[#00ff88] font-bold">1 → 4 (Foundation to Mastery)</span>
        </div>
      </div>

      {/* Connected Node Tree */}
      <div className="relative space-y-4">
        {/* Subtle connecting vertical cyber spine */}
        <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-gradient-to-b from-[#00ff88]/60 via-[#00ccff]/60 to-purple-500/40 hidden sm:block pointer-events-none" />

        {modules.map((module) => {
          const isExpanded = expandedStage === module.stage_number;
          const stageTopics = module.topics || [];
          const masteredInStage = stageTopics.filter((t) => isTopicMastered(t.id)).length;
          const isAllMastered = stageTopics.length > 0 && masteredInStage === stageTopics.length;

          return (
            <motion.div
              key={module.id}
              layout
              transition={{ layout: { duration: 0.3, type: 'spring', damping: 25, stiffness: 300 } }}
              className={`relative z-10 rounded-2xl border transition-all overflow-hidden ${
                isExpanded
                  ? 'border-emerald-500/40 bg-white/5 shadow-[0_0_30px_rgba(52,211,153,0.15)]'
                  : 'border-white/10 bg-white/[0.03] hover:border-emerald-500/30 hover:bg-white/5'
              }`}
            >
              {/* Stage Header Button (Interactive Node) */}
              <button
                type="button"
                onClick={() => setExpandedStage(isExpanded ? 0 : module.stage_number)}
                className="w-full text-left p-6 sm:p-8 flex items-start sm:items-center justify-between gap-6 focus:outline-none"
              >
                <div className="flex items-start sm:items-center gap-5">
                  {/* Node Icon Circle */}
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border transition-all ${
                      isExpanded
                        ? 'bg-black/80 border-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.3)]'
                        : isAllMastered
                        ? 'bg-emerald-950/60 border-emerald-500'
                        : 'bg-black/50 border-white/10'
                    }`}
                  >
                    {getStageIcon(module.stage_number)}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono uppercase font-bold tracking-wider text-slate-400">
                        Stage {module.stage_number}
                      </span>
                      {isAllMastered && (
                        <span className="text-[10px] font-mono text-[#00ff88] flex items-center gap-0.5">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Complete</span>
                        </span>
                      )}
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                      {module.title}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-1">
                      {module.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 pt-1 sm:pt-0">
                  <span className="text-xs font-mono text-slate-400 hidden sm:inline">
                    {stageTopics.length} {stageTopics.length === 1 ? 'Topic' : 'Topics'}
                  </span>
                  <div
                    className={`p-1.5 rounded-lg border transition-transform duration-200 ${
                      isExpanded
                        ? 'bg-[#00ff88]/10 text-[#00ff88] border-[#00ff88]/30 rotate-180'
                        : 'bg-black/40 text-slate-400 border-white/5'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </div>
              </button>

              {/* Collapsible Topics Container */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                    className="border-t border-white/10 bg-black/40 px-5 sm:px-6 py-5 space-y-4"
                  >
                    <div className="grid grid-cols-1 gap-3">
                      {stageTopics.map((topic) => {
                        const mastered = isTopicMastered(topic.id);
                        return (
                          <div
                            key={topic.id}
                            className={`p-5 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                              mastered
                                ? 'border-emerald-500/40 bg-emerald-950/20'
                                : 'border-white/10 bg-black/60 hover:border-emerald-500/30 hover:bg-black/80'
                            }`}
                          >
                            <div className="space-y-2 max-w-2xl">
                              <div className="flex flex-wrap items-center gap-2">
                                {getDifficultyBadge(topic.difficulty)}
                                <span className="text-slate-600 text-xs">·</span>
                                <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                                  <Clock className="w-3 h-3 text-slate-500" />
                                  <span>{topic.read_time_minutes} min read</span>
                                </span>
                                {mastered && (
                                  <>
                                    <span className="text-slate-600 text-xs">·</span>
                                    <span className="text-xs font-mono text-emerald-400 flex items-center gap-1 font-semibold">
                                      <CheckCircle2 className="w-3.5 h-3.5" />
                                      <span>Mastered</span>
                                    </span>
                                  </>
                                )}
                              </div>

                              <Link to={`/topic/${topic.slug}`} className="block group">
                                <h4 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors">
                                  {topic.title}
                                </h4>
                              </Link>

                              <p className="text-xs text-slate-300 leading-relaxed">
                                {topic.tldr_brief}
                              </p>
                            </div>

                            <div className="shrink-0 self-end sm:self-center">
                              <Link
                                to={`/topic/${topic.slug}`}
                                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-mono font-bold text-slate-950 bg-gradient-to-r from-emerald-400 to-cyan-400 hover:shadow-[0_0_20px_rgba(52,211,153,0.35)] active:scale-95 rounded-lg transition-all whitespace-nowrap"
                              >
                                <span>Launch Deep Dive</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                              </Link>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
