export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Architect';

export interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  role: 'admin' | 'author' | 'reader';
  avatar_url: string | null;
  created_at: string;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  category: 'Architecture' | 'C++ / JSI' | 'Memory & Hermes' | 'Threading' | 'TurboModules' | 'Performance';
  read_time_minutes: number;
  is_published: boolean;
  author_id: string | null;
  author?: Profile | null;
  created_at: string;
  updated_at?: string;
}

export interface Module {
  id: string;
  stage_number: number; // 1 to 4
  title: string;
  description: string;
  icon_name: string;
  order_index: number;
  topics?: Topic[];
}

export type ContentBlockType =
  | 'text'
  | 'code_comparison'
  | 'bridge_visualizer'
  | 'callout'
  | 'diagram_explainer';

export interface ContentBlock {
  id: string;
  type: ContentBlockType;
  title?: string;
  body?: string;
  // For code comparison blocks
  mistakeCode?: string;
  mistakeExplanation?: string;
  mistakeLanguage?: string;
  solutionCode?: string;
  solutionExplanation?: string;
  solutionLanguage?: string;
  // Custom props for interactive visualizers
  visualizerVariant?: 'bridge_comparison' | 'worklet_thread' | 'memory_allocator';
  calloutType?: 'warning' | 'architect_tip' | 'benchmark';
}

export interface Topic {
  id: string;
  module_id: string;
  title: string;
  slug: string;
  difficulty: DifficultyLevel;
  tldr_brief: string;
  read_time_minutes: number;
  content_blocks: ContentBlock[];
  is_published: boolean;
  created_at: string;
}

export interface UserProgress {
  id: string;
  topic_id: string;
  completed_at: string;
}

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      modules: {
        Row: Module;
        Insert: Partial<Module> & { title: string; stage_number: number };
        Update: Partial<Module>;
        Relationships: [];
      };
      topics: {
        Row: Topic;
        Insert: Partial<Topic> & { module_id: string; title: string; slug: string };
        Update: Partial<Topic>;
        Relationships: [];
      };
      user_progress: {
        Row: UserProgress;
        Insert: Partial<UserProgress> & { topic_id: string };
        Update: Partial<UserProgress>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
