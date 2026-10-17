import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  ShieldCheck,
  Lock,
  PlusCircle,
  Edit3,
  Trash2,
  Eye,
  EyeOff,
  Database,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Send,
  UploadCloud,
  FileCode,
  Shield,
  Layers,
  GraduationCap,
} from 'lucide-react';
import { useAuth } from '../lib/authStore';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { SEED_MODULES } from '../data/seedRoadmap';
import { Topic, Module, TrackType, DifficultyLevel } from '../types';

export const Admin: React.FC = () => {
  const { currentUser, isAdmin, loginAsDemo } = useAuth();
  const [searchParams] = useSearchParams();
  const editTopicId = searchParams.get('editTopic');

  const [modules, setModules] = useState<Module[]>(SEED_MODULES);
  const [selectedModuleId, setSelectedModuleId] = useState<string>('mod-stage-1');
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [track, setTrack] = useState<TrackType>('Intern & Foundations');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('Beginner');
  const [readTime, setReadTime] = useState(8);
  const [tldrBrief, setTldrBrief] = useState('');
  const [checklistText, setChecklistText] = useState('');
  const [mistakeCode, setMistakeCode] = useState('');
  const [solutionCode, setSolutionCode] = useState('');
  const [bugScenario, setBugScenario] = useState('');
  const [bugFix, setBugFix] = useState('');
  const [isPublished, setIsPublished] = useState(true);

  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isSyncingSeed, setIsSyncingSeed] = useState(false);

  // If editTopicId passed, prefill form
  useEffect(() => {
    if (!editTopicId) return;

    for (const mod of modules) {
      const match = mod.topics?.find((t) => t.id === editTopicId);
      if (match) {
        setSelectedModuleId(match.module_id);
        setTitle(match.title);
        setSlug(match.slug);
        setTrack(match.track);
        setDifficulty(match.difficulty);
        setReadTime(match.read_time_minutes);
        setTldrBrief(match.tldr_brief);
        setChecklistText(match.intern_checklist?.join('\n') || '');
        setIsPublished(match.is_published);

        // Find code comparison block
        const codeBlock = match.content_blocks.find((b) => b.type === 'code_comparison');
        if (codeBlock) {
          setMistakeCode(codeBlock.mistakeCode || '');
          setSolutionCode(codeBlock.solutionCode || '');
        }

        if (match.production_bug) {
          setBugScenario(match.production_bug.scenario);
          setBugFix(match.production_bug.fix);
        }
        break;
      }
    }
  }, [editTopicId, modules]);

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!editTopicId) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, '')
      );
    }
  };

  const handleTogglePublish = async (topicId: string) => {
    setModules((prev) =>
      prev.map((m) => ({
        ...m,
        topics: m.topics?.map((t) => (t.id === topicId ? { ...t, is_published: !t.is_published } : t)),
      }))
    );
    setStatusMsg({ type: 'success', text: 'Topic publication status updated' });
    setTimeout(() => setStatusMsg(null), 3000);
  };

  const handleDeleteTopic = (topicId: string) => {
    if (!confirm('Are you sure you want to delete this topic from curriculum?')) return;
    setModules((prev) =>
      prev.map((m) => ({
        ...m,
        topics: m.topics?.filter((t) => t.id !== topicId),
      }))
    );
    setStatusMsg({ type: 'success', text: 'Topic deleted successfully' });
    setTimeout(() => setStatusMsg(null), 3000);
  };

  const handleSaveTopic = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatusMsg(null);

    const checklist = checklistText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    const newTopic: Topic = {
      id: editTopicId || `topic-${Date.now()}`,
      module_id: selectedModuleId,
      track,
      title,
      slug,
      difficulty,
      read_time_minutes: readTime,
      tldr_brief: tldrBrief,
      intern_checklist: checklist,
      production_bug: bugScenario ? { scenario: bugScenario, root_cause: 'Production invariant violation', fix: bugFix } : undefined,
      is_published: isPublished,
      created_at: new Date().toISOString(),
      content_blocks: [
        {
          id: `b-${Date.now()}-1`,
          type: 'text',
          title: 'Architectural Deep Dive',
          body: tldrBrief,
        },
        ...(mistakeCode && solutionCode
          ? [
              {
                id: `b-${Date.now()}-2`,
                type: 'code_comparison' as const,
                title: 'Junior Mistake vs. Architect Solution',
                mistakeCode,
                solutionCode,
                mistakeExplanation: 'Common failure pattern causing dropped frames or memory leaks.',
                solutionExplanation: 'Production-ready pattern eliminating the defect.',
              },
            ]
          : []),
      ],
    };

    // Update local state
    setModules((prev) =>
      prev.map((m) => {
        if (m.id === selectedModuleId) {
          const exists = m.topics?.some((t) => t.id === newTopic.id);
          const updatedTopics = exists
            ? m.topics?.map((t) => (t.id === newTopic.id ? newTopic : t))
            : [...(m.topics || []), newTopic];
          return { ...m, topics: updatedTopics };
        }
        return m;
      })
    );

    // Save to Supabase if live
    if (isSupabaseConfigured) {
      try {
        await (supabase.from('topics') as any).upsert([newTopic]);
      } catch (err) {
        console.warn('Supabase topic save error:', err);
      }
    }

    setLoading(false);
    setStatusMsg({ type: 'success', text: `Topic "${title}" saved and live in curriculum!` });
    setTimeout(() => setStatusMsg(null), 4000);

    // Reset form if not editing
    if (!editTopicId) {
      setTitle('');
      setSlug('');
      setTldrBrief('');
      setChecklistText('');
      setMistakeCode('');
      setSolutionCode('');
      setBugScenario('');
      setBugFix('');
    }
  };

  const handleSeedSupabase = async () => {
    setIsSyncingSeed(true);
    setStatusMsg(null);

    try {
      if (!isSupabaseConfigured) {
        throw new Error('Supabase URL & Anon Key are in placeholder state. Set them in .env first.');
      }

      // Push modules and topics
      for (const mod of SEED_MODULES) {
        await (supabase.from('modules') as any).upsert([
          {
            id: mod.id,
            stage_number: mod.stage_number,
            title: mod.title,
            description: mod.description,
            icon_name: mod.icon_name,
            order_index: mod.order_index,
          },
        ]);

        if (mod.topics) {
          await (supabase.from('topics') as any).upsert(mod.topics);
        }
      }

      setStatusMsg({ type: 'success', text: 'All 8 Stages & Topics successfully seeded to PostgreSQL database!' });
    } catch (e: any) {
      setStatusMsg({ type: 'error', text: e.message || 'Seeding error' });
    } finally {
      setIsSyncingSeed(false);
    }
  };

  // -------------------------------------------------------------------------
  // 403 LOCK SCREEN FOR STUDENTS / UNAUTHORIZED USERS
  // -------------------------------------------------------------------------
  if (!isAdmin) {
    return (
      <div className="max-w-xl mx-auto my-16 text-center space-y-6 bg-white/5 border border-white/10 rounded-3xl p-8 sm:p-12 shadow-2xl">
        <div className="w-16 h-16 rounded-2xl bg-red-950/60 border border-red-500/40 text-red-400 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(239,68,68,0.2)]">
          <Lock className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-mono font-bold text-red-400 uppercase tracking-widest">
            HTTP 403: Forbidden
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Restricted to Principal Architect
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
            The Admin CMS and topic publisher is strictly reserved for <code className="text-cyan-400 font-mono">akashyadavazm@gmail.com</code>.
            You are currently logged in with a Student / Learner account.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-black/60 border border-white/10 text-xs font-mono text-slate-400 space-y-1">
          <p>Current Profile: <strong className="text-white">{currentUser.email}</strong></p>
          <p>Role: <span className="text-cyan-400 font-bold">Learner (Read-Only)</span></p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => loginAsDemo('admin')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-xs font-mono font-bold text-slate-950 bg-gradient-to-r from-emerald-400 to-cyan-400 hover:shadow-[0_0_20px_rgba(52,211,153,0.35)] transition-all"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Switch to Architect Account (akashyadavazm@gmail.com)</span>
          </button>

          <Link
            to="/#roadmap"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-5 py-3 rounded-full text-xs font-mono text-slate-300 hover:text-white bg-white/5 border border-white/10 transition-colors"
          >
            <span>Return to Roadmap</span>
          </Link>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------------------
  // ADMIN CMS PORTAL (akashyadavazm@gmail.com)
  // -------------------------------------------------------------------------
  return (
    <div className="space-y-12 max-w-6xl mx-auto">
      {/* Header */}
      <div className="border-b border-white/10 pb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-semibold text-emerald-400 uppercase tracking-widest">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Principal Architect CMS Console</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-1">
            Curriculum &amp; Production Content Manager
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 font-mono">
            Full RLS Authority: <span className="text-cyan-400">{currentUser.email}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleSeedSupabase}
            disabled={isSyncingSeed}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-mono font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 transition-all disabled:opacity-50"
          >
            <UploadCloud className="w-4 h-4" />
            <span>{isSyncingSeed ? 'Syncing...' : 'Push Seed to Supabase'}</span>
          </button>

          <Link
            to="/sql-schema"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-mono text-slate-300 hover:text-white bg-white/5 border border-white/10 transition-colors"
          >
            <Database className="w-4 h-4 text-emerald-400" />
            <span>SQL Schema</span>
          </Link>
        </div>
      </div>

      {/* Status banner */}
      {statusMsg && (
        <div
          className={`p-4 rounded-2xl border text-xs font-mono flex items-start gap-2.5 ${
            statusMsg.type === 'success'
              ? 'bg-emerald-950/40 border-emerald-500/80 text-emerald-300'
              : 'bg-red-950/40 border-red-500/80 text-red-300'
          }`}
        >
          {statusMsg.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          )}
          <span>{statusMsg.text}</span>
        </div>
      )}

      {/* Main CMS Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form: Topic Authoring & Editor */}
        <div className="lg:col-span-7 bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <h3 className="text-base font-bold text-white font-mono flex items-center gap-2">
              <PlusCircle className="w-4 h-4 text-emerald-400" />
              <span>{editTopicId ? 'Edit Curriculum Topic' : 'Author New Curriculum Topic'}</span>
            </h3>
            {editTopicId && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                EDITING: {editTopicId}
              </span>
            )}
          </div>

          <form onSubmit={handleSaveTopic} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">Target Stage</label>
              <select
                value={selectedModuleId}
                onChange={(e) => setSelectedModuleId(e.target.value)}
                className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-200 font-mono focus:outline-none focus:border-emerald-400"
              >
                {modules.map((m) => (
                  <option key={m.id} value={m.id}>
                    Stage {m.stage_number}: {m.title} ({m.track})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">Topic Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g. Fast C++ JSI Encryption HostObjects"
                required
                className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-400"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Track</label>
                <select
                  value={track}
                  onChange={(e) => setTrack(e.target.value as TrackType)}
                  className="w-full bg-black/60 border border-white/10 rounded-xl px-2 py-2 text-xs text-slate-200 font-mono focus:outline-none focus:border-emerald-400"
                >
                  <option value="Intern & Foundations">Intern & Foundations</option>
                  <option value="Production Engineering">Production Engineering</option>
                  <option value="Core Internals & JSI">Core Internals & JSI</option>
                  <option value="Native & Store Release">Native & Store Release</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Difficulty</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as DifficultyLevel)}
                  className="w-full bg-black/60 border border-white/10 rounded-xl px-2 py-2 text-xs text-slate-200 font-mono focus:outline-none focus:border-emerald-400"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Architect">Architect</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Read Time (min)</label>
                <input
                  type="number"
                  min={1}
                  max={60}
                  value={readTime}
                  onChange={(e) => setReadTime(parseInt(e.target.value) || 5)}
                  className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">60-Second Architect Brief (TL;DR)</label>
              <textarea
                rows={3}
                value={tldrBrief}
                onChange={(e) => setTldrBrief(e.target.value)}
                placeholder="High-level production summary of the problem, cause, and architecture solution..."
                required
                className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-400 leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">
                Intern Practical Checklist (One task per line)
              </label>
              <textarea
                rows={3}
                value={checklistText}
                onChange={(e) => setChecklistText(e.target.value)}
                placeholder="Always use SafeAreaProvider over deprecated SafeAreaView&#10;Never store unencrypted tokens in AsyncStorage"
                className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-200 font-mono focus:outline-none focus:border-emerald-400"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono text-red-400 mb-1">Junior Mistake Code</label>
                <textarea
                  rows={4}
                  value={mistakeCode}
                  onChange={(e) => setMistakeCode(e.target.value)}
                  placeholder="// ❌ JUNIOR TRAP: setState in onScroll"
                  className="w-full bg-black/60 border border-red-900/40 rounded-xl p-3 text-xs text-red-200 font-mono focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-emerald-400 mb-1">Architect Solution Code</label>
                <textarea
                  rows={4}
                  value={solutionCode}
                  onChange={(e) => setSolutionCode(e.target.value)}
                  placeholder="// ✅ ARCHITECT PATTERN: 120Hz Worklet"
                  className="w-full bg-black/60 border border-emerald-900/40 rounded-xl p-3 text-xs text-emerald-200 font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Crash Bug Scenario</label>
                <input
                  type="text"
                  value={bugScenario}
                  onChange={(e) => setBugScenario(e.target.value)}
                  placeholder="App crashes on Android fast fling with OOM"
                  className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Production Fix</label>
                <input
                  type="text"
                  value={bugFix}
                  onChange={(e) => setBugFix(e.target.value)}
                  placeholder="Switch FlatList to FlashList with estimatedItemSize"
                  className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-400"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center gap-2 text-xs font-mono text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPublished}
                  onChange={(e) => setIsPublished(e.target.checked)}
                  className="rounded text-emerald-500 focus:ring-0"
                />
                <span>Published (Visible to Students)</span>
              </label>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-mono font-bold text-slate-950 bg-gradient-to-r from-emerald-400 to-cyan-400 hover:shadow-[0_0_20px_rgba(52,211,153,0.35)] transition-all disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{loading ? 'Saving...' : editTopicId ? 'Update Topic' : 'Publish to Curriculum'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Live Topic Tree & Management */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white font-mono flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>Curriculum Topics ({modules.reduce((acc, m) => acc + (m.topics?.length || 0), 0)})</span>
            </h3>

            <div className="space-y-4 max-h-[640px] overflow-y-auto pr-2 scrollbar-thin">
              {modules.map((m) => (
                <div key={m.id} className="p-3 bg-black/50 border border-white/5 rounded-xl space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-300">
                    <span className="text-emerald-400">Stage {m.stage_number}</span>
                    <span className="text-slate-500">{m.track}</span>
                  </div>

                  <div className="space-y-1.5">
                    {m.topics?.map((topic) => (
                      <div
                        key={topic.id}
                        className="p-2.5 bg-white/[0.03] hover:bg-white/[0.06] rounded-lg border border-white/5 flex items-center justify-between gap-3 text-xs"
                      >
                        <div className="truncate flex-1">
                          <p className="font-bold text-white truncate">{topic.title}</p>
                          <p className="text-[10px] text-slate-400 font-mono">
                            {topic.difficulty} · {topic.read_time_minutes} min
                          </p>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          {/* Publish Toggle */}
                          <button
                            type="button"
                            onClick={() => handleTogglePublish(topic.id)}
                            className={`p-1 rounded ${
                              topic.is_published
                                ? 'text-emerald-400 hover:text-emerald-300'
                                : 'text-slate-500 hover:text-slate-300'
                            }`}
                            title={topic.is_published ? 'Published (click to draft)' : 'Draft (click to publish)'}
                          >
                            {topic.is_published ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                          </button>

                          {/* Edit Button */}
                          <Link
                            to={`/admin?editTopic=${topic.id}`}
                            className="p-1 text-cyan-400 hover:text-cyan-300 rounded"
                            title="Edit this topic"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </Link>

                          {/* Delete Button */}
                          <button
                            type="button"
                            onClick={() => handleDeleteTopic(topic.id)}
                            className="p-1 text-slate-500 hover:text-red-400 rounded"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
