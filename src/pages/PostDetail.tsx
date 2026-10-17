import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Post } from '../types';
import { INITIAL_SEED_POSTS } from '../data/seedData';
import { ArrowLeft, Clock, Calendar, Share2, Check, BookOpen, User, Layers } from 'lucide-react';

export const PostDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function loadPost() {
      if (!slug) {
        setLoading(false);
        return;
      }

      setLoading(true);

      if (isSupabaseConfigured) {
        try {
          const { data, error } = await supabase
            .from('posts')
            .select('*, author:profiles(id, email, full_name, role, avatar_url)')
            .eq('slug', slug)
            .single();

          if (!error && data) {
            setPost(data as Post);
            setLoading(false);
            return;
          }
        } catch (e) {
          console.warn('Error fetching single post from Supabase:', e);
        }
      }

      // Check local seed posts
      const localPost = INITIAL_SEED_POSTS.find((p) => p.slug === slug);
      setPost(localPost || null);
      setLoading(false);
    }

    loadPost();
  }, [slug]);

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center space-y-3">
        <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-xs text-slate-400">Loading technical architecture paper...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="border border-slate-800 rounded-xl p-12 text-center space-y-4">
        <p className="text-lg font-semibold text-slate-200">Article Not Found</p>
        <p className="text-xs text-slate-400">
          We could not locate an architecture article with slug: <code className="text-cyan-400">{slug}</code>
        </p>
        <div className="pt-2">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-950 bg-cyan-400 rounded-md hover:bg-cyan-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Deep Dives</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <article className="max-w-4xl mx-auto space-y-8">
      {/* Back Link */}
      <div>
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-cyan-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Deep Dives</span>
        </Link>
      </div>

      {/* Header Info */}
      <header className="space-y-4 border-b border-slate-800 pb-8">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="font-semibold text-cyan-400">{post.category}</span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span>{post.read_time_minutes} min read</span>
          </span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span>Published {formatDate(post.created_at)}</span>
        </div>

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight" style={{ textWrap: 'balance' }}>
          {post.title}
        </h1>

        {post.excerpt && (
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
            {post.excerpt}
          </p>
        )}

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-cyan-900/50 border border-cyan-700/60 flex items-center justify-center text-xs font-bold text-cyan-300">
              {post.author?.full_name ? post.author.full_name.charAt(0) : 'A'}
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-200">
                {post.author?.full_name || 'Akash Yadav'}
              </p>
              <p className="text-[11px] text-slate-500">
                {post.author?.email || 'akashyadavazm@gmail.com'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={copyLink}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white border border-slate-800 bg-slate-900 rounded-md transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied Link</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" />
                <span>Share</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Article Body Content */}
      <div className="prose prose-invert max-w-none space-y-6 text-slate-300 leading-relaxed text-sm sm:text-base">
        {post.content.split('\n\n').map((paragraph: string, idx: number) => {
          if (paragraph.startsWith('## ')) {
            return (
              <h2 key={idx} className="text-xl sm:text-2xl font-bold text-white tracking-tight pt-6 border-t border-slate-800/80">
                {paragraph.replace('## ', '')}
              </h2>
            );
          }
          if (paragraph.startsWith('### ')) {
            return (
              <h3 key={idx} className="text-base sm:text-lg font-semibold text-cyan-300 tracking-tight pt-4">
                {paragraph.replace('### ', '')}
              </h3>
            );
          }
          if (paragraph.startsWith('```')) {
            const cleanCode = paragraph
              .replace(/```(cpp|typescript|objc|bash)?\n/, '')
              .replace(/```$/, '');
            return (
              <div key={idx} className="my-4">
                <pre className="p-4 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-cyan-200 overflow-x-auto">
                  <code>{cleanCode}</code>
                </pre>
              </div>
            );
          }
          return (
            <p key={idx} className="text-slate-300">
              {paragraph}
            </p>
          );
        })}
      </div>

      {/* Bottom Navigation */}
      <div className="pt-10 border-t border-slate-800 flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white border border-slate-800 bg-slate-900 rounded-md transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>All Articles</span>
        </Link>

        <Link
          to="/sql-schema"
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-950 bg-cyan-400 rounded-md hover:bg-cyan-300 transition-colors"
        >
          <span>View Supabase Schema</span>
        </Link>
      </div>
    </article>
  );
};
