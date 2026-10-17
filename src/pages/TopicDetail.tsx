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
} from 'lucide-react';
import { Topic, ContentBlock } from '../types';
import { SEED_MODULES } from '../data/seedRoadmap';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { useTopicProgress } from '../lib/progressStore';
import { BridgeVisualizer } from '../components/BridgeVisualizer';
import { CodeComparisonBlock } from '../components/CodeComparisonBlock';

export const TopicDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [topic, setTopic] = useState<Topic | null>(null);
  const [loading, setLoading] = useState(true);
  const [copiedLink, setCopiedLink] = useState(false);
  const { isTopicMastered, toggleTopicMastery } = useTopicProgress();

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
        colors: ['#00ff88', '#00ccff', '#ffffff', '#38bdf8'],
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
      <div className="py-24 text-center space-y-4">
        <div className="w-10 h-10 border-2 border-[#00ff88] border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-xs font-mono text-slate-400">Decompressing architecture topic blocks...</p>
      </div>
    );
  }

  if (!topic) {
    return (
      <div className="border border-white/10 bg-[#0d0d0d] rounded-2xl p-12 text-center space-y-4 max-w-2xl mx-auto">
        <AlertTriangle className="w-10 h-10 text-amber-400 mx-auto" />
        <h2 className="text-xl font-bold text-white">Topic Not Found</h2>
        <p className="text-xs text-slate-400">
          No mobile architecture module matches slug: <code className="text-[#00ccff]">{slug}</code>
        </p>
        <div className="pt-2">
          <Link
            to="/#roadmap"
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-mono font-bold text-slate-950 bg-[#00ff88] rounded-lg"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Roadmap</span>
          </Link>
        </div>
      </div>
    );
  }

  const isMastered = isTopicMastered(topic.id);

  return (
    <article className="max-w-4xl mx-auto space-y-8">
      {/* Top Breadcrumb & Share */}
      <div className="flex items-center justify-between gap-4">
        <Link
          to="/#roadmap"
          className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-slate-400 hover:text-[#00ff88] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Roadmap</span>
        </Link>

        <button
          type="button"
          onClick={copyUrl}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono text-slate-300 hover:text-white border border-white/10 bg-black/60 rounded-lg transition-colors"
        >
          {copiedLink ? (
            <>
              <Check className="w-3.5 h-3.5 text-[#00ff88]" />
              <span className="text-[#00ff88]">Copied</span>
            </>
          ) : (
            <>
              <Share2 className="w-3.5 h-3.5" />
              <span>Share Topic</span>
            </>
          )}
        </button>
      </div>

      {/* Main Topic Header */}
      <header className="space-y-4 border-b border-white/10 pb-8">
        <div className="flex flex-wrap items-center gap-2.5 text-xs font-mono">
          <span className="px-2 py-0.5 rounded bg-purple-950/80 text-purple-300 border border-purple-800/60 font-bold">
            {topic.difficulty} Track
          </span>
          <span className="text-slate-600">·</span>
          <span className="text-slate-400 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span>{topic.read_time_minutes} min read</span>
          </span>
          {isMastered && (
            <>
              <span className="text-slate-600">·</span>
              <span className="text-[#00ff88] font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Mastered</span>
              </span>
            </>
          )}
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
          {topic.title}
        </h1>

        {/* 60-Second Architect Brief Card */}
        <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-emerald-950/30 to-cyan-950/30 border border-[#00ff88]/30 shadow-[0_0_25px_rgba(0,255,136,0.08)] space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono uppercase font-bold text-[#00ff88] tracking-wider">
            <Zap className="w-4 h-4 text-[#00ff88]" />
            <span>60-Second Architect Brief</span>
          </div>
          <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-normal">
            {topic.tldr_brief}
          </p>
        </div>
      </header>

      {/* Dynamic Content Blocks Rendering (Plugin/Block Architecture) */}
      <div className="space-y-8">
        {topic.content_blocks.map((block: ContentBlock) => {
          switch (block.type) {
            case 'text':
              return (
                <div key={block.id} className="space-y-3">
                  {block.title && (
                    <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00ff88]" />
                      <span>{block.title}</span>
                    </h3>
                  )}
                  <div className="text-sm sm:text-base text-slate-300 leading-relaxed space-y-3 whitespace-pre-line">
                    {block.body}
                  </div>
                </div>
              );

            case 'bridge_visualizer':
              return (
                <div key={block.id} className="my-6">
                  <BridgeVisualizer />
                </div>
              );

            case 'code_comparison':
              return (
                <div key={block.id} className="my-6">
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
                  className={`p-4 sm:p-5 rounded-xl border flex items-start gap-3 text-xs sm:text-sm ${
                    block.calloutType === 'warning'
                      ? 'bg-amber-950/20 border-amber-800/50 text-amber-200'
                      : block.calloutType === 'benchmark'
                      ? 'bg-cyan-950/20 border-cyan-800/50 text-[#00ccff]'
                      : 'bg-emerald-950/20 border-emerald-800/50 text-[#00ff88]'
                  }`}
                >
                  <Lightbulb className="w-5 h-5 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    {block.title && <p className="font-bold tracking-tight">{block.title}</p>}
                    <p className="text-slate-300 leading-relaxed">{block.body}</p>
                  </div>
                </div>
              );

            default:
              return null;
          }
        })}
      </div>

      {/* Completion & Mastery Actions Footer */}
      <footer className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <Link
          to="/#roadmap"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-400 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>All Roadmap Stages</span>
        </Link>

        {/* Celebratory Mark as Mastered button */}
        <motion.button
          type="button"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleMasteryClick}
          className={`inline-flex items-center gap-2.5 px-6 py-3 rounded-xl text-xs sm:text-sm font-mono font-bold transition-all shadow-xl ${
            isMastered
              ? 'bg-emerald-950 border border-emerald-500/80 text-[#00ff88] shadow-[0_0_20px_rgba(0,255,136,0.3)]'
              : 'bg-[#00ff88] hover:bg-[#33ff9f] text-slate-950 shadow-[0_0_25px_rgba(0,255,136,0.4)]'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>{isMastered ? 'Mastered! Click to Revoke' : 'Mark as Mastered (+1 Stage Mastery)'}</span>
        </motion.button>
      </footer>
    </article>
  );
};
