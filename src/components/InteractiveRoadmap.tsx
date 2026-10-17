import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FolderTree,
  Maximize2,
  Activity,
  ShieldCheck,
  Database,
  Zap,
  Cpu,
  Shield,
  ChevronDown,
  Clock,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Layers,
  Eye,
  EyeOff,
  Edit3,
} from 'lucide-react';
import { Module, Topic, TrackType } from '../types';
import { useTopicProgress } from '../lib/progressStore';
import { useAuth } from '../lib/authStore';

interface InteractiveRoadmapProps {
  modules: Module[];
}

export const InteractiveRoadmap: React.FC<InteractiveRoadmapProps> = ({ modules }) => {
  const [selectedTrack, setSelectedTrack] = useState<string>('All Tracks');
  const [expandedStage, setExpandedStage] = useState<number>(1);
  const { isTopicMastered } = useTopicProgress();
  const { isAdmin } = useAuth();

  // Track filters
  const tracks: Array<'All Tracks' | TrackType> = [
    'All Tracks',
    'Intern & Foundations',
    'Production Engineering',
    'Core Internals & JSI',
    'Native & Store Release',
  ];

  const filteredModules = modules.filter((m) => {
    if (selectedTrack === 'All Tracks') return true;
    return m.track === selectedTrack;
  });

  const getStageIcon = (stageNumber: number) => {
    switch (stageNumber) {
      case 1:
        return <FolderTree className="w-5 h-5 text-emerald-400" />;
      case 2:
        return <Maximize2 className="w-5 h-5 text-cyan-400" />;
      case 3:
        return <Activity className="w-5 h-5 text-amber-400" />;
      case 4:
        return <ShieldCheck className="w-5 h-5 text-purple-400" />;
      case 5:
        return <Database className="w-5 h-5 text-blue-400" />;
      case 6:
        return <Zap className="w-5 h-5 text-emerald-400" />;
      case 7:
        return <Cpu className="w-5 h-5 text-cyan-400" />;
      case 8:
        return <Shield className="w-5 h-5 text-red-400" />;
      default:
        return <Layers className="w-5 h-5 text-emerald-400" />;
    }
  };

  const getDifficultyBadge = (difficulty: Topic['difficulty']) => {
    switch (difficulty) {
      case 'Architect':
        return (
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-purple-950/80 text-purple-300 border border-purple-800/60">
            Architect
          </span>
        );
      case 'Intermediate':
        return (
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-800/60">
            Intermediate
          </span>
        );
      default:
        return (
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-800/60">
            Intern / Foundation
          </span>
        );
    }
  };

  return (
    <div id="roadmap" className="space-y-8">
      {/* Section Title & Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-semibold text-emerald-400 uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>Categorized Multi-Track Curriculum</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
            The 8-Stage Senior Roadmap
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            From Day 1 Intern foundations and Yoga Flexbox to 120Hz Reanimated worklets, C++ JSI direct memory, and Native Swift/Kotlin bridging.
          </p>
        </div>

        <div className="text-xs font-mono text-slate-400 shrink-0">
          <span>Curriculum: </span>
          <span className="text-emerald-400 font-bold">8 Stages · 4 Specialized Tracks</span>
        </div>
      </div>

      {/* Track Filter Tabs (Zero-Pill interactive controls) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {tracks.map((track) => (
          <button
            key={track}
            type="button"
            onClick={() => setSelectedTrack(track)}
            className={`px-4 py-2 text-xs font-mono rounded-full transition-all whitespace-nowrap shrink-0 border ${
              selectedTrack === track
                ? 'bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-950 font-bold border-transparent shadow-[0_0_20px_rgba(52,211,153,0.3)]'
                : 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/[0.08]'
            }`}
          >
            {track}
          </button>
        ))}
      </div>

      {/* Connected 8-Stage Node Tree */}
      <div className="relative space-y-4">
        {/* Continuous cyber vertical spine */}
        <div className="absolute left-8 top-8 bottom-8 w-0.5 bg-gradient-to-b from-emerald-400/80 via-cyan-400/80 to-purple-500/50 hidden sm:block pointer-events-none" />

        {filteredModules.map((module) => {
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
              {/* Stage Node Button */}
              <button
                type="button"
                onClick={() => setExpandedStage(isExpanded ? 0 : module.stage_number)}
                className="w-full text-left p-6 sm:p-8 flex items-start sm:items-center justify-between gap-6 focus:outline-none"
              >
                <div className="flex items-start sm:items-center gap-5">
                  {/* Stage Icon Node */}
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border transition-all ${
                      isExpanded
                        ? 'bg-black/80 border-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.35)]'
                        : isAllMastered
                        ? 'bg-emerald-950/70 border-emerald-500 text-emerald-400'
                        : 'bg-black/50 border-white/10'
                    }`}
                  >
                    {getStageIcon(module.stage_number)}
                  </div>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[11px] font-mono uppercase font-bold tracking-wider text-emerald-400">
                        Stage {module.stage_number}
                      </span>
                      <span className="text-slate-600">·</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 text-slate-300 border border-white/10">
                        {module.track}
                      </span>
                      {isAllMastered && (
                        <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1 font-semibold ml-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Mastered</span>
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
                    className={`p-2 rounded-full border transition-transform duration-200 ${
                      isExpanded
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 rotate-180'
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
                    className="border-t border-white/10 bg-black/40 px-6 sm:px-8 py-6 space-y-4"
                  >
                    <div className="grid grid-cols-1 gap-4">
                      {stageTopics.map((topic) => {
                        const mastered = isTopicMastered(topic.id);
                        return (
                          <div
                            key={topic.id}
                            className={`p-6 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-6 ${
                              mastered
                                ? 'border-emerald-500/40 bg-emerald-950/20 shadow-[0_0_20px_rgba(52,211,153,0.1)]'
                                : 'border-white/10 bg-black/60 hover:border-emerald-500/30 hover:bg-black/80'
                            }`}
                          >
                            <div className="space-y-2.5 max-w-2xl">
                              <div className="flex flex-wrap items-center gap-2">
                                {getDifficultyBadge(topic.difficulty)}
                                <span className="text-slate-600 text-xs">·</span>
                                <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                                  <span>{topic.read_time_minutes} min read</span>
                                </span>
                                {topic.intern_checklist && (
                                  <>
                                    <span className="text-slate-600 text-xs">·</span>
                                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950/60 text-cyan-300 border border-cyan-800/40">
                                      {topic.intern_checklist.length} Practical Tasks
                                    </span>
                                  </>
                                )}
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
                                <h4 className="text-base sm:text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">
                                  {topic.title}
                                </h4>
                              </Link>

                              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                                {topic.tldr_brief}
                              </p>
                            </div>

                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 shrink-0 self-end sm:self-center">
                              {/* Admin-only controls */}
                              {isAdmin && (
                                <Link
                                  to={`/admin?editTopic=${topic.id}`}
                                  className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-mono text-slate-400 hover:text-white bg-white/5 border border-white/10 rounded-lg hover:border-emerald-400/40 transition-colors"
                                  title="Edit Topic in Admin CMS"
                                >
                                  <Edit3 className="w-3.5 h-3.5 text-emerald-400" />
                                  <span>Edit</span>
                                </Link>
                              )}

                              <Link
                                to={`/topic/${topic.slug}`}
                                className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-mono font-bold text-slate-950 bg-gradient-to-r from-emerald-400 to-cyan-400 hover:shadow-[0_0_20px_rgba(52,211,153,0.35)] active:scale-95 rounded-full transition-all whitespace-nowrap"
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
