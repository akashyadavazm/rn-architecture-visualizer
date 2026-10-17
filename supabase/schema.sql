-- ==============================================================================
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

-- Public can view diagrams and visual assets
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
  );
