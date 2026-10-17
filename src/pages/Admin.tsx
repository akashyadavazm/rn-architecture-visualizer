import React, { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { ShieldCheck, Lock, Mail, Key, Database, AlertCircle, CheckCircle2, Send, PlusCircle, Sparkles } from 'lucide-react';
import { SEED_MODULES } from '../data/seedRoadmap';

export const Admin: React.FC = () => {
  const [email, setEmail] = useState('akashyadavazm@gmail.com');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [sessionUser, setSessionUser] = useState<any>(null);

  // Quick topic creator
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [stageNumber, setStageNumber] = useState<number>(1);
  const [difficulty, setDifficulty] = useState<'Beginner' | 'Intermediate' | 'Architect'>('Architect');
  const [readTime, setReadTime] = useState(8);
  const [tldrBrief, setTldrBrief] = useState('');
  const [creatingTopic, setCreatingTopic] = useState(false);

  useEffect(() => {
    async function checkSession() {
      if (isSupabaseConfigured) {
        try {
          const { data } = await supabase.auth.getSession();
          setSessionUser(data.session?.user || null);
        } catch (e) {
          console.warn('Session check warning:', e);
        }
      }
    }
    checkSession();
  }, []);

  const handleTitleChange = (val: string) => {
    setTitle(val);
    setSlug(
      val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '')
    );
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSupabaseConfigured) {
      setMessage({
        type: 'info',
        text: 'Supabase credentials are not yet set in .env. Once configured, you can sign in directly with akashyadavazm@gmail.com.',
      });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setMessage({ type: 'error', text: error.message });
      } else {
        setSessionUser(data.user);
        setMessage({ type: 'success', text: `Authenticated successfully as ${data.user?.email}` });
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Authentication error' });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTopic = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSupabaseConfigured) {
      setMessage({
        type: 'info',
        text: 'Live Supabase connection is required to push topics to PostgreSQL. Connect VITE_SUPABASE_URL & VITE_SUPABASE_ANON_KEY.',
      });
      return;
    }

    setCreatingTopic(true);
    setMessage(null);

    try {
      // Find or pick module_id for stage
      const matchingModule = SEED_MODULES.find((m) => m.stage_number === stageNumber);
      const moduleId = matchingModule?.id || 'mod-stage-1';

      const payload = {
        module_id: moduleId,
        title,
        slug,
        difficulty,
        read_time_minutes: readTime,
        tldr_brief: tldrBrief,
        content_blocks: [
          {
            id: `block-${Date.now()}`,
            type: 'text',
            title: 'Architect Overview',
            body: tldrBrief,
          },
        ],
        is_published: true,
      };

      const { error } = await (supabase.from('topics') as any).insert([payload]);

      if (error) {
        setMessage({ type: 'error', text: `Insert error: ${error.message}` });
      } else {
        setMessage({ type: 'success', text: `Topic "${title}" added to Stage ${stageNumber} successfully!` });
        setTitle('');
        setSlug('');
        setTldrBrief('');
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to create topic' });
    } finally {
      setCreatingTopic(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="border-b border-white/10 pb-6">
        <div className="flex items-center gap-2 text-xs font-mono font-semibold text-[#00ff88] uppercase tracking-widest">
          <ShieldCheck className="w-4 h-4 text-[#00ff88]" />
          <span>Admin Portal & Security Console</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight mt-2">
          Curriculum & Content Management
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 font-mono">
          Strict RLS Security Owner: <span className="text-[#00ccff]">akashyadavazm@gmail.com</span>
        </p>
      </div>

      {/* Status banner */}
      {message && (
        <div
          className={`p-4 rounded-xl border text-xs font-mono flex items-start gap-2.5 ${
            message.type === 'success'
              ? 'bg-emerald-950/40 border-emerald-800 text-[#00ff88]'
              : message.type === 'error'
              ? 'bg-red-950/40 border-red-800 text-red-300'
              : 'bg-cyan-950/40 border-cyan-800 text-[#00ccff]'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Supabase Status Card */}
      <div className="border border-white/10 bg-[#0d0d0d] rounded-2xl p-5 sm:p-6 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-bold text-white font-mono">
            <Database className="w-4 h-4 text-[#00ff88]" />
            <span>Supabase Auth & RLS Status</span>
          </div>
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-black/60 border border-white/10 text-slate-300">
            {isSupabaseConfigured ? 'CONNECTED' : 'STANDBY'}
          </span>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed font-sans">
          {isSupabaseConfigured
            ? 'Supabase client is configured. Authentication and topic modifications are guarded by JWT email checks for akashyadavazm@gmail.com.'
            : 'Supabase URL and Anon key are currently in placeholder state in .env. Enter your live project keys to enable full PostgreSQL syncing.'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Auth Box */}
        <div className="border border-white/10 bg-[#0d0d0d] rounded-2xl p-6 space-y-5">
          <div className="flex items-center gap-2 text-sm font-bold text-white font-mono">
            <Lock className="w-4 h-4 text-[#00ff88]" />
            <span>Admin Authentication</span>
          </div>

          {sessionUser ? (
            <div className="space-y-4 font-mono">
              <div className="p-3 bg-emerald-950/30 border border-emerald-800/60 rounded-xl text-xs text-[#00ff88] space-y-1">
                <p className="font-bold">Active Session:</p>
                <p className="text-white">{sessionUser.email}</p>
                <p className="text-slate-400 text-[11px]">Role: Administrator (Full RLS CRUD)</p>
              </div>
              <button
                type="button"
                onClick={async () => {
                  await supabase.auth.signOut();
                  setSessionUser(null);
                }}
                className="w-full px-4 py-2 text-xs font-semibold text-slate-200 bg-slate-900 hover:bg-slate-800 border border-white/10 rounded-lg transition-colors"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">
                  Admin Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-black border border-white/10 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-200 font-mono focus:outline-none focus:border-[#00ff88] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Key className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-black border border-white/10 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-200 font-mono focus:outline-none focus:border-[#00ff88] transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-mono font-bold text-slate-950 bg-[#00ff88] hover:bg-[#33ff9f] rounded-lg shadow-[0_0_15px_rgba(0,255,136,0.3)] transition-all disabled:opacity-50"
              >
                {loading ? 'Authenticating...' : 'Sign In as Owner'}
              </button>
            </form>
          )}
        </div>

        {/* Quick Topic Creator */}
        <div className="border border-white/10 bg-[#0d0d0d] rounded-2xl p-6 space-y-5">
          <div className="flex items-center gap-2 text-sm font-bold text-white font-mono">
            <PlusCircle className="w-4 h-4 text-[#00ccff]" />
            <span>Publish New Roadmap Topic</span>
          </div>

          <form onSubmit={handleCreateTopic} className="space-y-3.5">
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">Topic Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g. Memory Alignment & Hermes TLABs"
                required
                className="w-full bg-black border border-white/10 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-[#00ff88]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Stage (1-4)</label>
                <select
                  value={stageNumber}
                  onChange={(e) => setStageNumber(parseInt(e.target.value) || 1)}
                  className="w-full bg-black border border-white/10 rounded-lg px-2 py-1.5 text-xs text-slate-200 font-mono focus:outline-none focus:border-[#00ff88]"
                >
                  <option value={1}>Stage 1: Under the Hood</option>
                  <option value={2}>Stage 2: 60FPS UI & Animations</option>
                  <option value={3}>Stage 3: Scalable State</option>
                  <option value={4}>Stage 4: Native Bridging</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Difficulty</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as any)}
                  className="w-full bg-black border border-white/10 rounded-lg px-2 py-1.5 text-xs text-slate-200 font-mono focus:outline-none focus:border-[#00ff88]"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Architect">Architect</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">60-Second Architect Brief</label>
              <textarea
                rows={3}
                value={tldrBrief}
                onChange={(e) => setTldrBrief(e.target.value)}
                placeholder="Core architectural problem, root cause, and production solution..."
                required
                className="w-full bg-black border border-white/10 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-[#00ff88]"
              />
            </div>

            <button
              type="submit"
              disabled={creatingTopic}
              className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-mono font-bold text-slate-950 bg-[#00ccff] hover:bg-[#33d6ff] rounded-lg transition-all disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{creatingTopic ? 'Publishing...' : 'Add Topic Block to Supabase'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
