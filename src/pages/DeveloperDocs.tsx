import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Terminal,
  Layers,
  Cpu,
  FileCode2,
  Activity,
  Rocket,
  Search,
  ChevronRight,
  ChevronDown,
  Copy,
  Check,
  BookOpen,
  ArrowRight,
  ArrowLeft,
  ExternalLink,
  Code2,
  Bookmark,
  Share2,
  Clock,
  Sparkles,
  Menu,
  X,
  FileText,
  GitBranch,
} from 'lucide-react';
import { DOCS_CATEGORIES, DocCategory, DocArticle } from '../data/docsData';
import { CliDoctorMatrix } from '../components/CliDoctorMatrix';

// Map icon name to Lucide Icon component
const CATEGORY_ICONS: Record<string, React.ElementType> = {
  Terminal,
  Layers,
  Cpu,
  FileCode2,
  Activity,
  Rocket,
  GitBranch,
};

export const DeveloperDocs: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedSlug = searchParams.get('topic') || 'environment-setup-cli';

  const [sidebarFilter, setSidebarFilter] = useState('');
  const [activeFilterCategory, setActiveFilterCategory] = useState<'all' | 'git' | 'setup' | 'arch'>('all');
  const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>({});
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeSectionId, setActiveSectionId] = useState<string>('');

  // Find active article
  const allArticles = useMemo(() => {
    return DOCS_CATEGORIES.flatMap((c) => c.articles);
  }, []);

  const activeArticle = useMemo(() => {
    const found = allArticles.find((a) => a.slug === requestedSlug);
    return found || allArticles[0];
  }, [allArticles, requestedSlug]);

  // Find previous and next articles for pagination
  const { prevArticle, nextArticle } = useMemo(() => {
    const currentIndex = allArticles.findIndex((a) => a.slug === activeArticle.slug);
    return {
      prevArticle: currentIndex > 0 ? allArticles[currentIndex - 1] : null,
      nextArticle: currentIndex < allArticles.length - 1 ? allArticles[currentIndex + 1] : null,
    };
  }, [allArticles, activeArticle]);

  // Handle switching article
  const handleSelectArticle = (slug: string) => {
    setSearchParams({ topic: slug });
    setMobileSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleCategory = (categoryId: string) => {
    setCollapsedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Scrollspy for "On this page" TOC
  useEffect(() => {
    const handleScroll = () => {
      const sections = activeArticle.sections.map((s) => document.getElementById(s.id));
      const scrollPos = window.scrollY + 200;

      for (let i = sections.length - 1; i >= 0; i--) {
        const el = sections[i];
        if (el && el.offsetTop <= scrollPos) {
          setActiveSectionId(activeArticle.sections[i].id);
          return;
        }
      }
      if (activeArticle.sections.length > 0) {
        setActiveSectionId(activeArticle.sections[0].id);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeArticle]);

  // Filter categories and articles
  const filteredCategories = useMemo(() => {
    let baseList = DOCS_CATEGORIES;

    // Filter by quick category tab
    if (activeFilterCategory === 'git') {
      baseList = baseList.filter((c) => c.id === 'git-mastery');
    } else if (activeFilterCategory === 'setup') {
      baseList = baseList.filter((c) => c.id === 'getting-started');
    } else if (activeFilterCategory === 'arch') {
      baseList = baseList.filter((c) => c.id === 'architecture-runtime' || c.id === 'native-modules');
    }

    if (!sidebarFilter.trim()) return baseList;
    const query = sidebarFilter.toLowerCase();
    return baseList.map((cat) => {
      const matchedArticles = cat.articles.filter(
        (art) =>
          art.title.toLowerCase().includes(query) ||
          art.subtitle.toLowerCase().includes(query) ||
          art.slug.toLowerCase().includes(query)
      );
      return {
        ...cat,
        articles: matchedArticles,
      };
    }).filter((cat) => cat.articles.length > 0);
  }, [sidebarFilter, activeFilterCategory]);

  return (
    <div className="min-h-screen text-slate-900 dark:text-slate-100 pb-24 transition-colors duration-150">
      {/* Container constraint strictly adhering to Golden Layout Rule */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-2">
        {/* Top Banner / Mobile Sidebar Drawer Trigger (Requirement 1 Fix) */}
        <div className="lg:hidden mb-4 flex items-center justify-between gap-3 p-3 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-xs">
          <button
            type="button"
            onClick={() => setMobileSidebarOpen(true)}
            className="flex items-center gap-1.5 text-xs font-mono font-semibold text-emerald-700 dark:text-emerald-400 shrink-0 whitespace-nowrap px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-500/40 active:scale-95 transition-all shadow-xs"
          >
            <Menu className="w-3.5 h-3.5" />
            <span>Docs Menu</span>
          </button>
          <span className="truncate min-w-0 flex-1 text-right text-xs text-slate-500 dark:text-slate-400 font-mono">
            {activeArticle.title}
          </span>
        </div>

        {/* 3-Column Responsive Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ========================================================= */}
          {/* LEFT COLUMN: Sticky Collapsible Sidebar (3 Cols)          */}
          {/* ========================================================= */}
          <aside className="hidden lg:block lg:col-span-3 sticky top-24 self-start max-h-[calc(100vh-7rem)] overflow-y-auto pr-3 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-white/10 scrollbar-track-transparent">
            {/* Sidebar Search */}
            <div className="relative mb-3">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={sidebarFilter}
                onChange={(e) => setSidebarFilter(e.target.value)}
                placeholder="Search commands & docs..."
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-white dark:bg-black/60 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/60 transition-all font-mono shadow-xs"
              />
              {sidebarFilter && (
                <button
                  type="button"
                  onClick={() => setSidebarFilter('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-white text-xs"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Quick Filter Category Tabs */}
            <div className="flex items-center gap-1.5 mb-4 overflow-x-auto pb-1 scrollbar-none text-[11px] font-mono">
              {[
                { id: 'all', label: 'All Docs' },
                { id: 'git', label: '⚡ Git', badge: true },
                { id: 'setup', label: 'CLI' },
                { id: 'arch', label: 'Engine' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveFilterCategory(tab.id as any)}
                  className={`px-2.5 py-1 rounded-lg transition-all shrink-0 font-semibold ${
                    activeFilterCategory === tab.id
                      ? 'bg-emerald-600 text-white dark:bg-emerald-500/20 dark:text-emerald-300 dark:border dark:border-emerald-500/40 shadow-xs'
                      : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/10'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Categories Tree */}
            <div className="space-y-3">
              {filteredCategories.map((cat) => {
                const IconComponent = CATEGORY_ICONS[cat.iconName] || BookOpen;
                const isCollapsed = !!collapsedCategories[cat.id];
                const hasActiveChild = cat.articles.some((a) => a.slug === activeArticle.slug);

                return (
                  <div
                    key={cat.id}
                    className={`rounded-xl border transition-colors overflow-hidden ${
                      cat.id === 'git-mastery'
                        ? 'border-emerald-200 dark:border-emerald-500/30 bg-emerald-50/40 dark:bg-emerald-950/20'
                        : 'border-slate-200 dark:border-white/5 bg-white dark:bg-white/[0.02]'
                    }`}
                  >
                    {/* Category Header */}
                    <button
                      type="button"
                      onClick={() => toggleCategory(cat.id)}
                      className={`w-full px-3 py-2.5 text-left flex items-center justify-between text-xs font-semibold tracking-wide transition-colors ${
                        hasActiveChild
                          ? 'text-emerald-700 dark:text-emerald-400 bg-slate-50 dark:bg-white/[0.04]'
                          : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <IconComponent
                          className={`w-3.5 h-3.5 shrink-0 ${
                            hasActiveChild
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : cat.id === 'git-mastery'
                              ? 'text-emerald-500'
                              : 'text-slate-400'
                          }`}
                        />
                        <span className="truncate">{cat.title}</span>
                      </div>
                      <ChevronDown
                        className={`w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform duration-200 ${
                          isCollapsed ? '-rotate-90' : 'rotate-0'
                        }`}
                      />
                    </button>

                    {/* Article Links */}
                    {!isCollapsed && (
                      <div className="px-2 py-1.5 space-y-0.5 border-t border-slate-100 dark:border-white/5">
                        {cat.articles.map((art) => {
                          const isSelected = art.slug === activeArticle.slug;
                          return (
                            <button
                              key={art.slug}
                              type="button"
                              onClick={() => handleSelectArticle(art.slug)}
                              className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition-all flex items-center justify-between group ${
                                isSelected
                                  ? 'bg-emerald-100 dark:bg-emerald-950/70 border border-emerald-300 dark:border-emerald-500/40 text-emerald-800 dark:text-emerald-300 font-semibold shadow-xs dark:shadow-[0_0_12px_rgba(52,211,153,0.15)]'
                                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/[0.04] border border-transparent'
                              }`}
                            >
                              <span className="truncate">{art.title}</span>
                              {isSelected && (
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 shrink-0 shadow-[0_0_8px_#34d399]" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </aside>

          {/* ========================================================= */}
          {/* MOBILE SIDEBAR DRAWER OVERLAY                              */}
          {/* ========================================================= */}
          <AnimatePresence>
            {mobileSidebarOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setMobileSidebarOpen(false)}
                  className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-md z-50 lg:hidden"
                />
                <motion.div
                  initial={{ x: '-100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '-100%' }}
                  transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                  className="fixed top-0 bottom-0 left-0 w-80 bg-white dark:bg-[#0d0d0d] border-r border-slate-200 dark:border-white/10 p-5 z-50 overflow-y-auto lg:hidden text-slate-900 dark:text-white shadow-2xl"
                >
                  <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-white/10 mb-4">
                    <span className="text-sm font-bold flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      Documentation Index
                    </span>
                    <button
                      type="button"
                      onClick={() => setMobileSidebarOpen(false)}
                      className="p-1 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    {filteredCategories.map((cat) => (
                      <div key={cat.id} className="space-y-1">
                        <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider py-1 truncate">
                          {cat.title}
                        </div>
                        {cat.articles.map((art) => (
                          <button
                            key={art.slug}
                            type="button"
                            onClick={() => handleSelectArticle(art.slug)}
                            className={`w-full text-left px-3 py-2 rounded-lg text-xs block truncate transition-colors ${
                              art.slug === activeArticle.slug
                                ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-400 font-bold border border-emerald-300 dark:border-emerald-500/30'
                                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                            }`}
                          >
                            {art.title}
                          </button>
                        ))}
                      </div>
                    ))}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* ========================================================= */}
          {/* MAIN CONTENT AREA: High-Density Technical Docs (6-7 Cols) */}
          {/* ========================================================= */}
          <main className="lg:col-span-6 xl:col-span-7 space-y-8 min-w-0">
            {/* Breadcrumbs with mobile truncation protection */}
            <nav className="flex items-center gap-1.5 text-xs font-mono text-slate-500 dark:text-slate-400 flex-wrap overflow-hidden">
              <Link to="/" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors shrink-0">
                Home
              </Link>
              <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />
              <Link to="/docs" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors shrink-0">
                Developer Docs
              </Link>
              <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />
              <span className="text-slate-700 dark:text-slate-300 truncate max-w-[120px] sm:max-w-none">{activeArticle.categoryTitle}</span>
              <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />
              <span className="text-emerald-700 dark:text-emerald-400 font-semibold truncate max-w-[150px] sm:max-w-none">{activeArticle.title}</span>
            </nav>

            {/* Document Header */}
            <div className="pb-6 border-b border-slate-200 dark:border-white/10 space-y-3">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-100 dark:bg-cyan-950/80 text-cyan-800 dark:text-cyan-400 border border-cyan-300 dark:border-cyan-800/40 text-xs font-mono font-semibold shrink-0">
                  {activeArticle.versionBadge}
                </span>
                <span className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 font-mono shrink-0">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  {activeArticle.readTime}
                </span>
                <span className="text-xs text-slate-400 font-mono shrink-0 truncate">
                  Module: {activeArticle.categoryId}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight break-words">
                {activeArticle.title}
              </h1>

              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                {activeArticle.subtitle}
              </p>
            </div>

            {/* Embedded Interactive Tool if applicable */}
            {activeArticle.interactiveComponent === 'cli_doctor_matrix' && (
              <CliDoctorMatrix />
            )}

            {/* Document Body Sections */}
            <div className="space-y-12">
              {activeArticle.sections.map((section) => (
                <section
                  key={section.id}
                  id={section.id}
                  className="scroll-mt-28 space-y-4"
                >
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2 border-b border-slate-200 dark:border-white/5 pb-2 break-words">
                    <span className="text-emerald-600 dark:text-emerald-400 font-mono text-sm shrink-0">#</span>
                    <span>{section.heading}</span>
                  </h2>

                  {/* Body Paragraphs */}
                  <div className="space-y-3 text-slate-700 dark:text-slate-300 text-sm sm:text-base leading-relaxed break-words">
                    {section.body.map((p, idx) => (
                      <p key={idx}>{p}</p>
                    ))}
                  </div>

                  {/* Code Snippet Block (High-contrast terminal syntax block across both themes) */}
                  {section.codeSnippet && (
                    <div className="rounded-xl overflow-hidden border border-slate-800 dark:border-white/10 bg-slate-950 text-slate-100 shadow-lg my-4">
                      {/* Code Snippet Top Bar */}
                      <div className="px-4 py-2.5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between text-xs font-mono">
                        <div className="flex items-center gap-2 text-slate-300 min-w-0 truncate">
                          <Code2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span className="truncate">{section.codeSnippet.filename || 'Terminal Command'}</span>
                          <span className="text-[10px] text-slate-400 uppercase px-1.5 py-0.5 rounded bg-white/10 shrink-0">
                            {section.codeSnippet.language}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            handleCopy(
                              section.codeSnippet?.code || '',
                              `code-${section.id}`
                            )
                          }
                          className="flex items-center gap-1.5 text-slate-400 hover:text-emerald-400 transition-colors p-1 shrink-0 ml-2"
                          title="Copy snippet"
                        >
                          {copiedKey === `code-${section.id}` ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span className="text-emerald-400 text-[11px] font-bold">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span className="text-[11px]">Copy Command</span>
                            </>
                          )}
                        </button>
                      </div>

                      {/* Code Area */}
                      <pre className="p-4 overflow-x-auto text-xs sm:text-sm font-mono text-emerald-300/95 leading-relaxed selection:bg-emerald-500/30 selection:text-white">
                        <code>{section.codeSnippet.code}</code>
                      </pre>
                    </div>
                  )}

                  {/* Callout box */}
                  {section.callout && (
                    <div
                      className={`p-4 rounded-xl border text-xs sm:text-sm my-4 leading-relaxed ${
                        section.callout.type === 'architect'
                          ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-500/40 text-emerald-950 dark:text-emerald-200'
                          : section.callout.type === 'warning'
                          ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-300 dark:border-amber-500/40 text-amber-950 dark:text-amber-200'
                          : 'bg-cyan-50 dark:bg-cyan-950/30 border-cyan-300 dark:border-cyan-500/40 text-cyan-950 dark:text-cyan-200'
                      }`}
                    >
                      <div className="font-bold mb-1 flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                        <span>{section.callout.title}</span>
                      </div>
                      <p className="text-slate-700 dark:text-slate-300 break-words">{section.callout.text}</p>
                    </div>
                  )}
                </section>
              ))}
            </div>

            {/* Pagination Controls */}
            <div className="pt-10 border-t border-slate-200 dark:border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {prevArticle ? (
                <button
                  type="button"
                  onClick={() => handleSelectArticle(prevArticle.slug)}
                  className="p-4 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:border-emerald-500/40 text-left transition-all group flex items-start gap-3 shadow-xs"
                >
                  <ArrowLeft className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <span className="block text-[11px] font-mono text-slate-400 uppercase">
                      Previous Topic
                    </span>
                    <span className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-300 transition-colors truncate block">
                      {prevArticle.title}
                    </span>
                  </div>
                </button>
              ) : (
                <div />
              )}

              {nextArticle && (
                <button
                  type="button"
                  onClick={() => handleSelectArticle(nextArticle.slug)}
                  className="p-4 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:border-cyan-500/40 text-right transition-all group flex items-start justify-end gap-3 shadow-xs"
                >
                  <div className="min-w-0">
                    <span className="block text-[11px] font-mono text-slate-400 uppercase">
                      Next Topic
                    </span>
                    <span className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition-colors truncate block">
                      {nextArticle.title}
                    </span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors shrink-0 mt-0.5" />
                </button>
              )}
            </div>
          </main>

          {/* ========================================================= */}
          {/* RIGHT COLUMN: "On This Page" Table of Contents (2-3 Cols) */}
          {/* ========================================================= */}
          <aside className="hidden xl:block xl:col-span-2 sticky top-24 self-start max-h-[calc(100vh-7rem)] overflow-y-auto pl-4 border-l border-slate-200 dark:border-white/10">
            <div className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>On This Page</span>
            </div>

            <nav className="space-y-1 text-xs">
              {activeArticle.toc.map((item) => {
                const isSelected = activeSectionId === item.id;
                return (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      const el = document.getElementById(item.id);
                      if (el) {
                        el.scrollIntoView({ behavior: 'smooth' });
                        setActiveSectionId(item.id);
                      }
                    }}
                    className={`block py-1.5 text-xs transition-colors truncate ${
                      isSelected
                        ? 'text-emerald-600 dark:text-emerald-400 font-semibold pl-2 border-l-2 border-emerald-500 dark:border-emerald-400 -ml-[17px]'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                  >
                    {item.label}
                  </a>
                );
              })}
            </nav>

            {/* Quick Actions */}
            <div className="mt-8 pt-4 border-t border-slate-200 dark:border-white/10 space-y-2">
              <button
                type="button"
                onClick={() => {
                  const url = window.location.href;
                  navigator.clipboard.writeText(url);
                  setCopiedKey('share-doc');
                  setTimeout(() => setCopiedKey(null), 2000);
                }}
                className="w-full py-1.5 px-2.5 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:border-emerald-500/40 text-[11px] font-mono text-slate-700 dark:text-slate-300 flex items-center justify-between transition-colors shadow-xs"
              >
                <span>Share Topic</span>
                {copiedKey === 'share-doc' ? <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" /> : <Share2 className="w-3 h-3 text-slate-400" />}
              </button>

              <Link
                to="/#roadmap"
                className="w-full py-1.5 px-2.5 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:border-cyan-500/40 text-[11px] font-mono text-slate-700 dark:text-slate-300 flex items-center justify-between transition-colors shadow-xs"
              >
                <span>Curriculum View</span>
                <ArrowRight className="w-3 h-3 text-cyan-600 dark:text-cyan-400" />
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};
