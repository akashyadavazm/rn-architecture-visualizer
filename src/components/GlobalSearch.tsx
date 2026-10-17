import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  X,
  Cpu,
  Zap,
  Activity,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  FileCode,
  CornerDownLeft,
  Clock,
  Layers,
} from 'lucide-react';
import { SEED_MODULES } from '../data/seedRoadmap';
import { INITIAL_SEED_POSTS } from '../data/seedData';
import { Topic, Module } from '../types';

interface SearchResultItem {
  id: string;
  type: 'topic' | 'module' | 'deep_dive';
  title: string;
  subtitle: string;
  slug?: string;
  stageNumber?: number;
  difficulty?: string;
  readTime?: number;
  highlightMatch?: string;
}

export const GlobalSearch: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Listen for global Cmd+K or Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      } else if (e.key === 'Escape' && isOpen) {
        e.preventDefault();
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Gather all searchable items
  const allResults: SearchResultItem[] = [];

  // 1. Modules
  SEED_MODULES.forEach((mod) => {
    allResults.push({
      id: `mod-${mod.id}`,
      type: 'module',
      title: mod.title,
      subtitle: mod.description,
      stageNumber: mod.stage_number,
    });

    // 2. Topics inside modules
    mod.topics?.forEach((topic) => {
      // Find extra content block hits if applicable
      const contentText = topic.content_blocks
        .map((b) => `${b.title || ''} ${b.body || ''} ${b.mistakeCode || ''} ${b.solutionCode || ''}`)
        .join(' ');

      allResults.push({
        id: `topic-${topic.id}`,
        type: 'topic',
        title: topic.title,
        subtitle: topic.tldr_brief,
        slug: topic.slug,
        stageNumber: mod.stage_number,
        difficulty: topic.difficulty,
        readTime: topic.read_time_minutes,
        highlightMatch: contentText,
      });
    });
  });

  // 3. Deep Dive articles from seedData
  INITIAL_SEED_POSTS.forEach((post) => {
    allResults.push({
      id: `post-${post.id}`,
      type: 'deep_dive',
      title: post.title,
      subtitle: post.excerpt || 'Technical architecture paper',
      slug: post.slug,
      difficulty: 'Architect',
      readTime: post.read_time_minutes,
      highlightMatch: post.content,
    });
  });

  // Filter based on query
  const cleanQuery = query.trim().toLowerCase();
  const filteredResults = cleanQuery
    ? allResults.filter((item) => {
        const titleMatch = item.title.toLowerCase().includes(cleanQuery);
        const subMatch = item.subtitle.toLowerCase().includes(cleanQuery);
        const slugMatch = item.slug?.toLowerCase().includes(cleanQuery);
        const stageMatch = item.stageNumber?.toString() === cleanQuery;
        const bodyMatch = item.highlightMatch?.toLowerCase().includes(cleanQuery);
        return titleMatch || subMatch || slugMatch || stageMatch || bodyMatch;
      }).slice(0, 8)
    : [];

  // Reset selectedIndex when results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Handle keyboard navigation within results
  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) =>
        filteredResults.length > 0 ? (prev + 1) % filteredResults.length : 0
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) =>
        filteredResults.length > 0
          ? (prev - 1 + filteredResults.length) % filteredResults.length
          : 0
      );
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredResults[selectedIndex]) {
        handleSelectItem(filteredResults[selectedIndex]);
      }
    }
  };

  const handleSelectItem = (item: SearchResultItem) => {
    setIsOpen(false);
    if (item.type === 'module') {
      navigate('/#roadmap');
    } else if (item.type === 'topic') {
      navigate(`/topic/${item.slug}`);
    } else {
      navigate(`/post/${item.slug}`);
    }
  };

  const getResultIcon = (item: SearchResultItem) => {
    if (item.type === 'module') {
      return <Layers className="w-4 h-4 text-[#00ccff]" />;
    }
    if (item.type === 'deep_dive') {
      return <FileCode className="w-4 h-4 text-purple-400" />;
    }
    switch (item.stageNumber) {
      case 1:
        return <Cpu className="w-4 h-4 text-emerald-400" />;
      case 2:
        return <Zap className="w-4 h-4 text-[#00ccff]" />;
      case 3:
        return <Activity className="w-4 h-4 text-amber-400" />;
      case 4:
        return <ShieldCheck className="w-4 h-4 text-purple-400" />;
      default:
        return <Cpu className="w-4 h-4 text-emerald-400" />;
    }
  };

  const suggestedKeywords = ['JSI', 'Worklets', 'Hermes GC', 'TurboModules', 'Socket.IO', 'Codegen', 'Swift'];

  return (
    <div ref={searchContainerRef} className="relative w-full max-w-xs md:max-w-sm">
      {/* Search Input Trigger */}
      <div
        onClick={() => setIsOpen(true)}
        className="relative flex items-center w-full h-9 px-3 rounded-lg bg-black/60 border border-white/10 hover:border-white/20 transition-all cursor-pointer group"
      >
        <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-400 transition-colors shrink-0" />
        <span className="text-xs text-slate-400 ml-2.5 truncate font-sans">
          {query ? query : 'Search topics, JSI, worklets...'}
        </span>
        <div className="ml-auto flex items-center gap-1 shrink-0">
          <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-white/5 border border-white/10 rounded">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Dropdown Result List (Animated with Framer Motion) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="absolute left-0 sm:left-auto sm:right-0 top-11 w-[92vw] sm:w-[480px] max-w-[96vw] bg-[#0c0c0c] border border-white/15 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.85)] z-50 overflow-hidden"
          >
            {/* Active Search Header inside Dropdown */}
            <div className="p-3 bg-black/70 border-b border-white/10 flex items-center gap-2.5">
              <Search className="w-4 h-4 text-emerald-400 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleInputKeyDown}
                placeholder="Search topics, modules, C++, JSI, Swift..."
                className="w-full bg-transparent text-xs sm:text-sm text-white placeholder-slate-500 font-sans focus:outline-none"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="p-1 text-slate-400 hover:text-white rounded"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Results Body */}
            <div className="max-h-[380px] overflow-y-auto p-2 scrollbar-thin divide-y divide-white/5">
              {query.trim() === '' ? (
                /* Empty state: Show Suggested Topics & Roadmap Shortcuts */
                <div className="p-4 space-y-4">
                  <div className="flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Popular Architecture Searches</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {suggestedKeywords.map((kw) => (
                      <button
                        key={kw}
                        type="button"
                        onClick={() => setQuery(kw)}
                        className="px-2.5 py-1 text-xs font-mono rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-emerald-400 transition-colors"
                      >
                        {kw}
                      </button>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-white/10">
                    <span className="text-[11px] font-mono uppercase text-slate-400 font-semibold block mb-2">
                      Roadmap Quick Jump
                    </span>
                    <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                      {SEED_MODULES.map((mod) => (
                        <button
                          key={mod.id}
                          type="button"
                          onClick={() => handleSelectItem({ id: mod.id, type: 'module', title: mod.title, subtitle: mod.description, stageNumber: mod.stage_number })}
                          className="p-2 rounded-lg bg-black/40 hover:bg-slate-900 border border-white/5 hover:border-[#00ff88]/30 text-left transition-colors flex items-center gap-2"
                        >
                          {getResultIcon({ id: mod.id, type: 'module', title: mod.title, subtitle: mod.description, stageNumber: mod.stage_number })}
                          <span className="text-slate-300 truncate">Stage {mod.stage_number}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : filteredResults.length > 0 ? (
                /* Populated Results List */
                <div className="space-y-1">
                  {filteredResults.map((item, index) => {
                    const isSelected = index === selectedIndex;
                    return (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -4 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.12, delay: index * 0.02 }}
                        onClick={() => handleSelectItem(item)}
                        onMouseEnter={() => setSelectedIndex(index)}
                        className={`p-3 rounded-xl cursor-pointer transition-all flex items-start gap-3 ${
                          isSelected
                            ? 'bg-[#00ff88]/10 border border-[#00ff88]/40 shadow-[0_0_15px_rgba(0,255,136,0.1)]'
                            : 'hover:bg-white/5 border border-transparent'
                        }`}
                      >
                        <div
                          className={`p-2 rounded-lg shrink-0 mt-0.5 border ${
                            isSelected
                              ? 'bg-slate-900 border-[#00ff88]/60'
                              : 'bg-black/60 border-white/10'
                          }`}
                        >
                          {getResultIcon(item)}
                        </div>

                        <div className="space-y-1 flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h4
                              className={`text-xs sm:text-sm font-bold truncate ${
                                isSelected ? 'text-emerald-400' : 'text-white'
                              }`}
                            >
                              {item.title}
                            </h4>

                            {item.difficulty && (
                              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-purple-950/80 text-purple-300 border border-purple-800/50 shrink-0">
                                {item.difficulty}
                              </span>
                            )}
                          </div>

                          <p className="text-[11px] sm:text-xs text-slate-400 line-clamp-2 leading-relaxed">
                            {item.subtitle}
                          </p>

                          <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500 pt-0.5">
                            {item.stageNumber && (
                              <span>Stage {item.stageNumber}</span>
                            )}
                            {item.readTime && (
                              <>
                                <span>·</span>
                                <span>{item.readTime} min read</span>
                              </>
                            )}
                            <span>·</span>
                            <span className="capitalize">{item.type.replace('_', ' ')}</span>
                          </div>
                        </div>

                        <div className="shrink-0 pt-1 text-slate-400 self-center">
                          <ArrowRight
                            className={`w-3.5 h-3.5 transition-transform ${
                              isSelected
                                ? 'text-[#00ff88] translate-x-0.5'
                                : 'text-slate-600'
                            }`}
                          />
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                /* No Results Found */
                <div className="p-8 text-center space-y-3">
                  <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-slate-500">
                    <Search className="w-4 h-4" />
                  </div>
                  <p className="text-xs font-semibold text-slate-300">
                    No results found for &ldquo;{query}&rdquo;
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Try searching for <span className="text-[#00ff88]">JSI</span>, <span className="text-[#00ccff]">Worklets</span>, <span className="text-purple-400">TurboModules</span>, or <span className="text-amber-400">Hermes</span>.
                  </p>
                </div>
              )}
            </div>

            {/* Footer keyboard navigation hints */}
            <div className="px-4 py-2 bg-black/80 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-slate-500">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <kbd className="px-1 py-0.5 text-[9px] bg-white/5 border border-white/10 rounded">↑↓</kbd>
                  <span>to navigate</span>
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1 py-0.5 text-[9px] bg-white/5 border border-white/10 rounded">↵</kbd>
                  <span>to select</span>
                </span>
              </div>
              <span className="flex items-center gap-1">
                <kbd className="px-1 py-0.5 text-[9px] bg-white/5 border border-white/10 rounded">esc</kbd>
                <span>to close</span>
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
