import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  ArrowLeft,
  Clock,
  CheckCircle2,
  Share2,
  Check,
  Zap,
  ShieldCheck,
  AlertTriangle,
  Lightbulb,
  Sparkles,
  ArrowRight,
  ListTodo,
  Bug,
  Edit3,
  Shield,
} from 'lucide-react';
import { Topic, ContentBlock } from '../types';
import { SEED_MODULES } from '../data/seedRoadmap';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { useTopicProgress } from '../lib/progressStore';
import { useAuth } from '../lib/authStore';
import { BridgeVisualizer } from '../components/BridgeVisualizer';
import { CodeComparisonBlock } from '../components/CodeComparisonBlock';
import { ResponsiveSimulator } from '../components/ResponsiveSimulator';
import { FlatListRecyclerVisualizer } from '../components/FlatListRecyclerVisualizer';

export const TopicDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [topic, setTopic] = useState<Topic | null>(null);
  const [loading, setLoading] = useState(true);
  const [copiedLink, setCopiedLink] = useState(false);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  const { isTopicMastered, toggleTopicMastery } = useTopicProgress();
  const { isAdmin } = useAuth();

  // Load completed checklist items from localStorage
  useEffect(() => {
    if (!slug) return;
    try {
      const saved = localStorage.getItem(`checklist_${slug}`);
      if (saved) setCheckedItems(JSON.parse(saved));
    } catch {
      // ignore
    }
  }, [slug]);

  const toggleChecklistItem = (index: number) => {
    if (!slug) return;
    setCheckedItems((prev) => {
      const next = { ...prev, [index]: !prev[index] };
      localStorage.setItem(`checklist_${slug}`, JSON.stringify(next));
      return next;
    });
  };

  useEffect(() => {
    async function fetchTopic() {
      if (!slug) {
        setLoading(false);
        return;
      }
      setLoading(true);

      // Attempt Supabase fetch if configured
      if (isSupabaseConfigured) {
        try {
          const { data, error } = await supabase
            .from('topics')
            .select('*')
            .eq('slug', slug)
            .single();

          if (!error && data) {
            setTopic(data as Topic);
            setLoading(false);
            return;
          }
        } catch (e) {
          console.warn('Supabase fetch error, fallback to seed:', e);
        }
      }

      // Fallback to seed roadmap
      let found: Topic | null = null;
      for (const mod of SEED_MODULES) {
        const match = mod.topics?.find((t) => t.slug === slug);
        if (match) {
          found = match;
          break;
        }
      }

      setTopic(found);
      setLoading(false);
    }

    fetchTopic();
  }, [slug]);

  const handleMasteryClick = async () => {
    if (!topic) return;
    const nowMastered = await toggleTopicMastery(topic.id);

    if (nowMastered) {
      confetti({
        particleCount: 85,
        spread: 70,
        origin: { y: 0.75 },
        colors: ['#34d399', '#06b6d4', '#ffffff', '#38bdf8'],
      });
    }
  };

  const copyUrl = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  if (loading) {
    return (
      <div className="py-28 text-center space-y-4">
        <div className="w-10 h-10 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-xs font-mono text-slate-400">Decompressing architecture curriculum blocks...</p>
      </div>
    );
  }

  if (!topic) {
    return (
      <div className="border border-white/10 bg-[#0d0d0d] rounded-3xl p-12 text-center space-y-4 max-w-2xl mx-auto my-12">
        <AlertTriangle className="w-10 h-10 text-amber-400 mx-auto" />
        <h2 className="text-xl font-bold text-white">Topic Not Found</h2>
        <p className="text-xs text-slate-400">
          No mobile architecture module matches slug: <code className="text-cyan-400">{slug}</code>
        </p>
        <div className="pt-2">
          <Link
            to="/#roadmap"
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-mono font-bold text-slate-950 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Roadmap</span>
          </Link>
        </div>
      </div>
    );
  }

  const isMastered = isTopicMastered(topic.id);
  const checklistTotal = topic.intern_checklist?.length || 0;
  const checklistCompleted = Object.values(checkedItems).filter(Boolean).length;

  return (
    <article className="max-w-4xl mx-auto space-y-12 relative">
      {/* 
        ADMIN-ONLY FLOATING ACTION BUTTON:
        Allows instant editing of this specific topic in the CMS portal
      */}
      {isAdmin && (
        <div className="fixed bottom-6 right-6 z-40">
          <Link
            to={`/admin?editTopic=${topic.id}`}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono text-xs font-bold shadow-[0_0_25px_rgba(52,211,153,0.5)] transition-all active:scale-95 border border-emerald-300"
          >
            <Edit3 className="w-4 h-4" />
            <span>Edit Topic (Admin)</span>
          </Link>
        </div>
      )}

      {/* Top Breadcrumb & Share */}
      <div className="flex items-center justify-between gap-4">
        <Link
          to="/#roadmap"
          className="inline-flex items-center gap-2 text-xs font-mono font-semibold text-slate-400 hover:text-emerald-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to 8-Stage Roadmap</span>
        </Link>

        <div className="flex items-center gap-3">
          {isAdmin && (
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 flex items-center gap-1">
              <Shield className="w-3 h-3" />
              <span>Admin Mode</span>
            </span>
          )}

          <button
            type="button"
            onClick={copyUrl}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-mono text-slate-300 hover:text-white border border-white/10 bg-white/5 rounded-full transition-colors"
          >
            {copiedLink ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" />
                <span>Share Topic</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Topic Header */}
      <header className="space-y-6 border-b border-white/10 pb-10">
        <div className="flex flex-wrap items-center gap-2.5 text-xs font-mono">
          <span className="px-3 py-1 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-800/60 font-bold">
            {topic.track}
          </span>
          <span className="text-slate-600">·</span>
          <span className="px-2.5 py-0.5 rounded-full bg-purple-950/80 text-purple-300 border border-purple-800/50">
            {topic.difficulty} Tier
          </span>
          <span className="text-slate-600">·</span>
          <span className="text-slate-400 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span>{topic.read_time_minutes} min read</span>
          </span>
          {isMastered && (
            <>
              <span className="text-slate-600">·</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Mastered</span>
              </span>
            </>
          )}
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-[1.15]">
          {topic.title}
        </h1>

        {/* 60-Second Architect Brief Hero Card */}
        <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-black to-cyan-950/40 border border-emerald-500/30 shadow-[0_0_30px_rgba(52,211,153,0.12)] space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono uppercase font-bold text-emerald-400 tracking-wider">
            <Zap className="w-4 h-4 text-emerald-400" />
            <span>60-Second Architect Brief</span>
          </div>
          <p className="text-base sm:text-lg text-slate-200 leading-relaxed font-normal">
            {topic.tldr_brief}
          </p>
        </div>
      </header>

      {/* Intern Practical Checklist ("Do This In Your Project Today") */}
      {topic.intern_checklist && topic.intern_checklist.length > 0 && (
        <section className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-2 text-sm font-bold text-white font-mono">
              <ListTodo className="w-4 h-4 text-cyan-400" />
              <span>Intern Practical Checklist (&ldquo;Do This In Your Project Today&rdquo;)</span>
            </div>
            <span className="text-xs font-mono text-emerald-400 font-bold">
              {checklistCompleted} / {checklistTotal} Done
            </span>
          </div>

          <div className="space-y-3">
            {topic.intern_checklist.map((item, idx) => {
              const isChecked = !!checkedItems[idx];
              return (
                <div
                  key={idx}
                  onClick={() => toggleChecklistItem(idx)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                    isChecked
                      ? 'bg-emerald-950/30 border-emerald-500/50 text-slate-300'
                      : 'bg-black/40 border-white/5 hover:border-white/20 text-slate-300'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 border transition-colors ${
                      isChecked
                        ? 'bg-emerald-500 border-emerald-400 text-slate-950'
                        : 'border-white/20 bg-black/60'
                    }`}
                  >
                    {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                  <p className={`text-xs sm:text-sm leading-relaxed ${isChecked ? 'line-through text-slate-500' : ''}`}>
                    {item}
                  </p>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Dynamic Content Blocks Rendering */}
      <div className="space-y-10">
        {topic.content_blocks.map((block: ContentBlock) => {
          switch (block.type) {
            case 'text':
              return (
                <div key={block.id} className="space-y-4">
                  {block.title && (
                    <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                      <span>{block.title}</span>
                    </h3>
                  )}
                  <div className="text-sm sm:text-base text-slate-300 leading-relaxed space-y-4 whitespace-pre-line font-normal">
                    {block.body}
                  </div>
                </div>
              );

            case 'bridge_visualizer':
              return (
                <div key={block.id} className="my-8">
                  <BridgeVisualizer />
                </div>
              );

            case 'responsive_simulator':
              return (
                <div key={block.id} className="my-8">
                  <ResponsiveSimulator />
                </div>
              );

            case 'flatlist_recycler_visualizer':
              return (
                <div key={block.id} className="my-8">
                  <FlatListRecyclerVisualizer />
                </div>
              );

            case 'code_comparison':
              return (
                <div key={block.id} className="my-8">
                  <CodeComparisonBlock
                    title={block.title}
                    mistakeCode={block.mistakeCode}
                    mistakeExplanation={block.mistakeExplanation}
                    mistakeLanguage={block.mistakeLanguage}
                    solutionCode={block.solutionCode}
                    solutionExplanation={block.solutionExplanation}
                    solutionLanguage={block.solutionLanguage}
                  />
                </div>
              );

            case 'callout':
              return (
                <div
                  key={block.id}
                  className={`p-6 rounded-2xl border flex items-start gap-4 text-xs sm:text-sm ${
                    block.calloutType === 'warning'
                      ? 'bg-amber-950/20 border-amber-800/50 text-amber-200'
                      : block.calloutType === 'benchmark'
                      ? 'bg-cyan-950/20 border-cyan-800/50 text-cyan-300'
                      : 'bg-emerald-950/20 border-emerald-800/50 text-emerald-300'
                  }`}
                >
                  <Lightbulb className="w-5 h-5 shrink-0 mt-0.5 text-emerald-400" />
                  <div className="space-y-1.5">
                    {block.title && <p className="font-bold tracking-tight text-white">{block.title}</p>}
                    <p className="text-slate-300 leading-relaxed">{block.body}</p>
                  </div>
                </div>
              );

            default:
              return null;
          }
        })}
      </div>

      {/* Common Production Bug & Fix */}
      {topic.production_bug && (
        <section className="bg-red-950/20 border border-red-900/40 rounded-2xl p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-red-400 font-mono">
            <Bug className="w-4 h-4 text-red-400" />
            <span>Common Production Bug &amp; Fix</span>
          </div>

          <div className="space-y-3 text-xs sm:text-sm leading-relaxed">
            <div>
              <span className="font-mono text-red-300 uppercase font-bold text-[11px] block mb-1">Crash Scenario:</span>
              <p className="text-slate-200 bg-black/50 p-3 rounded-lg border border-red-900/30">
                {topic.production_bug.scenario}
              </p>
            </div>

            <div>
              <span className="font-mono text-amber-300 uppercase font-bold text-[11px] block mb-1">Root Cause:</span>
              <p className="text-slate-300">
                {topic.production_bug.root_cause}
              </p>
            </div>

            <div>
              <span className="font-mono text-emerald-400 uppercase font-bold text-[11px] block mb-1">Production Fix:</span>
              <p className="text-slate-300 mb-2">
                {topic.production_bug.fix}
              </p>
              {topic.production_bug.fix_code && (
                <pre className="p-4 bg-black/80 border border-emerald-900/40 rounded-xl text-xs font-mono text-emerald-300 overflow-x-auto">
                  <code>{topic.production_bug.fix_code}</code>
                </pre>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Topic Mastery CTA Footer */}
      <footer className="pt-10 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6">
        <Link
          to="/#roadmap"
          className="inline-flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>All 8 Stages</span>
        </Link>

        <motion.button
          type="button"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleMasteryClick}
          className={`inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full text-xs sm:text-sm font-mono font-bold transition-all shadow-xl ${
            isMastered
              ? 'bg-emerald-950 border border-emerald-500/80 text-emerald-300 shadow-[0_0_20px_rgba(52,211,153,0.3)]'
              : 'bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-950 shadow-[0_0_25px_rgba(52,211,153,0.4)]'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>{isMastered ? 'Mastered! Click to Revoke' : 'Mark Topic as Mastered (+1 Stage Mastery)'}</span>
        </motion.button>
      </footer>
    </article>
  );
};
