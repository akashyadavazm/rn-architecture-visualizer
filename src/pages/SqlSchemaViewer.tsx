import React, { useState } from 'react';
import { Copy, Check, Terminal, Database, Shield, HardDrive, ArrowRight, Sparkles } from 'lucide-react';

const SCHEMA_SQL = `-- ==============================================================================
-- SUPABASE POSTGRESQL SCHEMA: REACT NATIVE CYBER-ARCHITECT ROADMAP
-- Admin / Owner: akashyadavazm@gmail.com
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Modules Table (Roadmap Stages 1-4)
CREATE TABLE IF NOT EXISTS public.modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stage_number INTEGER NOT NULL CHECK (stage_number BETWEEN 1 AND 4),
  title TEXT NOT NULL,
  description TEXT,
  icon_name TEXT DEFAULT 'Cpu',
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Topics Table (Modular Plugin/Block Architecture)
CREATE TABLE IF NOT EXISTS public.topics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id UUID NOT NULL REFERENCES public.modules(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('Beginner', 'Intermediate', 'Architect')),
  tldr_brief TEXT NOT NULL,
  read_time_minutes INTEGER DEFAULT 5,
  content_blocks JSONB NOT NULL DEFAULT '[]'::jsonb,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indices for rapid query routing
CREATE INDEX IF NOT EXISTS idx_topics_module_id ON public.topics(module_id);
CREATE INDEX IF NOT EXISTS idx_topics_slug ON public.topics(slug);
CREATE INDEX IF NOT EXISTS idx_topics_published ON public.topics(is_published);

-- 4. User Progress Table (Topic Mastery Tracking)
CREATE TABLE IF NOT EXISTS public.user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  topic_id UUID NOT NULL REFERENCES public.topics(id) ON DELETE CASCADE,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_user_topic_progress UNIQUE (user_id, topic_id)
);

CREATE INDEX IF NOT EXISTS idx_user_progress_user ON public.user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_topic ON public.user_progress(topic_id);

-- 5. Enable Row Level Security (RLS)
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;

-- -----------------------------------------------------------------------------
-- 6. RLS Policies: Public Read & Strict Admin CRUD (akashyadavazm@gmail.com)
-- -----------------------------------------------------------------------------

-- MODULES POLICIES
CREATE POLICY "Public read modules"
  ON public.modules FOR SELECT
  USING (true);

CREATE POLICY "Admin full CRUD on modules"
  ON public.modules FOR ALL
  TO authenticated
  USING ((auth.jwt() ->> 'email') = 'akashyadavazm@gmail.com')
  WITH CHECK ((auth.jwt() ->> 'email') = 'akashyadavazm@gmail.com');

-- TOPICS POLICIES
CREATE POLICY "Public read published topics"
  ON public.topics FOR SELECT
  USING (is_published = true OR (auth.jwt() ->> 'email') = 'akashyadavazm@gmail.com');

CREATE POLICY "Admin full CRUD on topics"
  ON public.topics FOR ALL
  TO authenticated
  USING ((auth.jwt() ->> 'email') = 'akashyadavazm@gmail.com')
  WITH CHECK ((auth.jwt() ->> 'email') = 'akashyadavazm@gmail.com');

-- USER PROGRESS POLICIES
CREATE POLICY "Users can view their own progress"
  ON public.user_progress FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR (auth.jwt() ->> 'email') = 'akashyadavazm@gmail.com');

CREATE POLICY "Users can track their own progress"
  ON public.user_progress FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can toggle their progress"
  ON public.user_progress FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id OR (auth.jwt() ->> 'email') = 'akashyadavazm@gmail.com');

-- -----------------------------------------------------------------------------
-- 7. Storage Bucket: 'rn-architecture-assets'
-- -----------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public)
VALUES ('rn-architecture-assets', 'rn-architecture-assets', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Public read for diagrams & benchmark screenshots
CREATE POLICY "Public read on rn-architecture-assets"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'rn-architecture-assets');

-- Admin write only (akashyadavazm@gmail.com)
CREATE POLICY "Admin manage rn-architecture-assets"
  ON storage.objects FOR ALL
  TO authenticated
  USING (
    bucket_id = 'rn-architecture-assets' AND
    (auth.jwt() ->> 'email') = 'akashyadavazm@gmail.com'
  )
  WITH CHECK (
    bucket_id = 'rn-architecture-assets' AND
    (auth.jwt() ->> 'email') = 'akashyadavazm@gmail.com'
  );`;

export const SqlSchemaViewer: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(SCHEMA_SQL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="border-b border-white/10 pb-6">
        <div className="flex items-center gap-2 text-xs font-mono font-semibold text-[#00ff88] uppercase tracking-widest">
          <Database className="w-4 h-4 text-[#00ff88]" />
          <span>Part 1: Supabase Backend Schema</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight mt-2">
          PostgreSQL Database & Storage Script
        </h1>
        <p className="text-sm text-slate-400 mt-2 max-w-3xl leading-relaxed">
          Copy and run the script below in your Supabase SQL Editor. It initializes the <code className="text-[#00ccff]">modules</code>, <code className="text-[#00ccff]">topics</code> (with JSONB content blocks), <code className="text-[#00ccff]">user_progress</code> tables, Row Level Security (RLS) policies scoped to <code className="text-[#00ff88]">akashyadavazm@gmail.com</code>, and the <code className="text-[#00ccff]">rn-architecture-assets</code> public bucket.
        </p>
      </div>

      {/* Feature cards breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="border border-white/10 bg-[#0d0d0d] rounded-2xl p-5 space-y-2">
          <div className="flex items-center gap-2 text-[#00ff88] text-xs font-mono font-semibold">
            <Database className="w-4 h-4" />
            <span>Modules & Topics (JSONB)</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Dynamic content blocks allow plug-and-play visualizers, code comparisons, and technical briefs without schema migrations.
          </p>
        </div>

        <div className="border border-white/10 bg-[#0d0d0d] rounded-2xl p-5 space-y-2">
          <div className="flex items-center gap-2 text-[#00ccff] text-xs font-mono font-semibold">
            <Shield className="w-4 h-4" />
            <span>Strict Admin RLS</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Public read access for published curriculum. Full insert/update/delete authority restricted strictly to <code className="text-white">akashyadavazm@gmail.com</code>.
          </p>
        </div>

        <div className="border border-white/10 bg-[#0d0d0d] rounded-2xl p-5 space-y-2">
          <div className="flex items-center gap-2 text-purple-400 text-xs font-mono font-semibold">
            <HardDrive className="w-4 h-4" />
            <span>rn-architecture-assets Bucket</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            High-speed public storage bucket for C++ shadow tree diagrams, memory profiles, and architecture blueprints.
          </p>
        </div>
      </div>

      {/* SQL Code Block */}
      <div className="border border-white/10 bg-black rounded-2xl overflow-hidden shadow-2xl">
        <div className="bg-slate-900/90 border-b border-white/10 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
            <Terminal className="w-4 h-4 text-[#00ff88]" />
            <span>supabase/schema.sql</span>
          </div>

          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-mono font-bold text-slate-950 bg-[#00ff88] hover:bg-[#33ff9f] active:bg-[#00cc6a] rounded-lg shadow-[0_0_15px_rgba(0,255,136,0.3)] transition-all"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy SQL Script</span>
              </>
            )}
          </button>
        </div>

        <div className="p-4 sm:p-6 overflow-x-auto max-h-[550px] scrollbar-thin">
          <pre className="text-xs font-mono text-slate-200 leading-relaxed">
            <code>{SCHEMA_SQL}</code>
          </pre>
        </div>
      </div>

      {/* Supabase Execution Steps */}
      <div className="border border-white/10 bg-[#0d0d0d] rounded-2xl p-6 space-y-4">
        <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#00ff88]" />
          <span>Execution Protocol:</span>
        </h3>
        <ol className="list-decimal list-inside space-y-2 text-xs text-slate-300 font-sans leading-relaxed">
          <li>Log in to <a href="https://supabase.com" target="_blank" rel="noreferrer" className="text-[#00ccff] hover:underline">Supabase Dashboard</a> and open your project.</li>
          <li>Click <strong>SQL Editor</strong> in the left navigation sidebar.</li>
          <li>Paste the copied script and press <strong>Run</strong>.</li>
          <li>Copy your <strong>Project URL</strong> and <strong>Anon Key</strong> from <strong>Project Settings &gt; API</strong> into your environment configuration.</li>
        </ol>
      </div>
    </div>
  );
};
