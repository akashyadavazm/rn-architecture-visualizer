import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Terminal,
  Shield,
  GraduationCap,
  CheckCircle2,
  Menu,
  X,
  ChevronDown,
  Sparkles,
  Zap,
  Cpu,
  Layers,
  Database,
  GitBranch,
} from 'lucide-react';
import { useTopicProgress } from '../lib/progressStore';
import { useAuth } from '../lib/authStore';
import { GlobalSearch } from './GlobalSearch';
import { AuthModal } from './AuthModal';
import { ThemeSwitcher } from './ThemeSwitcher';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const location = useLocation();
  const { masteredCount } = useTopicProgress();
  const { currentUser, isAdmin } = useAuth();

  const totalTopics = 8;
  const progressPercentage = Math.round((masteredCount / totalTopics) * 100);

  // Horizontal Navigation Tabs for Tier 2
  const navTabs = [
    { label: 'Roadmap', href: '/#roadmap' },
    { label: 'Developer Docs', href: '/docs' },
    { label: 'Git Commands', href: '/docs?topic=git-essential-commands' },
    { label: 'JSI Simulator', href: '/topic/old-bridge-vs-new-architecture-jsi' },
    { label: 'Responsive Studio', href: '/topic/flexbox-responsive-dimension-scaling' },
    { label: 'SQL Schema', href: '/sql-schema' },
    { label: 'Admin CMS', href: '/admin' },
  ];

  // Check link active state
  const isActive = (path: string) => {
    if (path === '/#roadmap') {
      return location.pathname === '/' || location.hash === '#roadmap';
    }
    if (path.includes('?topic=')) {
      const topic = path.split('?topic=')[1];
      return location.pathname === '/docs' && location.search.includes(topic);
    }
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* 
        Permanent Layout: Vercel / Next.js Docs Two-Tier Edge-to-Edge Sticky Header
        Full width, sticky top, two distinct vertical tiers with zero clipping
      */}
      <header className="sticky top-0 z-50 w-full bg-white/95 dark:bg-[#0a0a0a]/95 backdrop-blur-2xl border-b border-slate-200 dark:border-white/10 transition-colors duration-150 shadow-[0_4px_20px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
        
        {/* =========================================================================
            TIER 1: Utility & Brand Bar (h-14 px-4 sm:px-6 lg:px-8 border-b)
            ========================================================================= */}
        <div className="h-14 border-b border-slate-200/80 dark:border-white/5 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto h-full flex items-center justify-between gap-3 sm:gap-6">
            
            {/* Left: Brand Icon (>_), Title & Version Badge */}
            <Link
              to="/"
              className="flex items-center gap-2.5 text-sm sm:text-base font-bold tracking-tight text-slate-900 dark:text-white shrink-0 group"
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:border-emerald-500 group-hover:shadow-[0_0_15px_rgba(52,211,153,0.25)] transition-all">
                <span className="font-mono text-xs font-black">&gt;_</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold tracking-tight">RN Architect</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-semibold hidden sm:inline-block">
                  v0.87
                </span>
              </div>
            </Link>

            {/* Center: Wide Command Palette Search Bar */}
            <div className="hidden md:flex flex-1 max-w-md mx-2 sm:mx-4 items-center justify-center">
              <GlobalSearch
                variant="wide"
                placeholder="Search docs, JSI, Git commands..."
              />
            </div>

            {/* Right: Zero Crowding Action Cluster */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              
              {/* 1. Mastery Progress Counter */}
              <Link
                to="/#roadmap"
                className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:border-emerald-500/40 text-xs font-mono text-slate-700 dark:text-slate-200 transition-colors"
                title={`${masteredCount} of ${totalTopics} stages mastered`}
              >
                <CheckCircle2
                  className={`w-3.5 h-3.5 ${
                    masteredCount > 0 ? 'text-emerald-500' : 'text-slate-400'
                  }`}
                />
                <span>
                  <strong className="text-emerald-600 dark:text-emerald-400 font-bold">{masteredCount}</strong>
                  <span className="text-slate-400">/{totalTopics}</span>
                  <span className="hidden xl:inline ml-1 text-slate-500 dark:text-slate-400">Mastered</span>
                </span>
                <div className="w-8 h-1 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden hidden xl:block">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 transition-all duration-300"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
              </Link>

              {/* 2. Global Theme Toggle Button */}
              <ThemeSwitcher variant="compact" className="hidden sm:block" />

              {/* 3. Full, Unclipped Admin / User Profile Badge */}
              <button
                type="button"
                onClick={() => setAuthModalOpen(true)}
                className={`flex items-center gap-2 px-3 sm:px-3.5 py-1.5 text-xs font-mono rounded-full border transition-all active:scale-95 shrink-0 ${
                  isAdmin
                    ? 'bg-emerald-50 dark:bg-emerald-950/80 border-emerald-300 dark:border-emerald-500/50 text-emerald-700 dark:text-emerald-300 hover:shadow-[0_0_15px_rgba(52,211,153,0.2)]'
                    : 'bg-cyan-50 dark:bg-cyan-950/80 border-cyan-300 dark:border-cyan-500/50 text-cyan-700 dark:text-cyan-300 hover:shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                }`}
                title={`Click to view profile or switch role (${currentUser.email})`}
              >
                {isAdmin ? (
                  <>
                    <Shield className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span className="font-bold">Admin:</span>
                    <span className="text-[11px] text-emerald-700 dark:text-emerald-300/90 font-medium whitespace-nowrap">
                      {currentUser.email}
                    </span>
                  </>
                ) : (
                  <>
                    <GraduationCap className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400 shrink-0" />
                    <span className="font-bold">Learner:</span>
                    <span className="text-[11px] text-cyan-700 dark:text-cyan-300/90 font-medium whitespace-nowrap">
                      {currentUser.email.split('@')[0]}
                    </span>
                  </>
                )}
                <ChevronDown className="w-3 h-3 text-slate-400 shrink-0 ml-0.5" />
              </button>

              {/* 4. Mobile Hamburger Menu Button */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-slate-700 dark:text-slate-300 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:text-slate-900 dark:hover:text-white shrink-0"
                aria-label="Toggle navigation"
              >
                {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* =========================================================================
            TIER 2: Navigation Sub-Bar (h-11 px-4 sm:px-6 lg:px-8)
            ========================================================================= */}
        <div className="h-11 px-4 sm:px-6 lg:px-8 overflow-x-auto no-scrollbar">
          <div className="max-w-7xl mx-auto h-full flex items-center justify-between gap-4">
            
            {/* Left / Center Navigation Tabs with Neon Active Indicator */}
            <nav className="flex items-center gap-1 sm:gap-2 h-full overflow-x-auto no-scrollbar shrink-0">
              {navTabs.map((tab) => {
                const active = isActive(tab.href);
                return (
                  <Link
                    key={tab.label}
                    to={tab.href}
                    className={`relative h-full flex items-center px-3 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
                      active
                        ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <span>{tab.label}</span>
                    {active && (
                      <motion.div
                        layoutId="vercelTier2Tab"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500 to-cyan-500 shadow-[0_0_8px_rgba(52,211,153,0.8)]"
                        transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                      />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Right Side of Sub-Bar: Quick-Access Action & Status */}
            <div className="hidden md:flex items-center gap-3 shrink-0">
              <Link
                to="/topic/old-bridge-vs-new-architecture-jsi"
                className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25 text-xs font-mono font-medium transition-all hover:scale-[1.02]"
                title="Launch JSI & Architecture Simulators"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                <span>⚡ Architecture Labs</span>
              </Link>
              <div className="hidden xl:flex items-center gap-1.5 text-[11px] font-mono text-slate-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>RN 0.76+ TurboModules & Hermes Ready</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 
        Mobile Responsive Drawer (Absolute Dropdown)
        Triggers on small screens when hamburger is clicked
      */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.96 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="lg:hidden fixed top-16 left-4 right-4 bg-white/95 dark:bg-[#0d0d0d]/95 backdrop-blur-2xl border border-slate-200 dark:border-white/15 rounded-2xl p-5 shadow-2xl z-50 space-y-4 max-w-lg mx-auto text-slate-900 dark:text-white max-h-[85vh] overflow-y-auto"
          >
            {/* Mobile Search */}
            <div className="pb-1">
              <GlobalSearch variant="wide" />
            </div>

            {/* Progress and Role Header */}
            <div className="flex items-center justify-between py-2 border-b border-slate-200 dark:border-white/10 text-xs font-mono">
              <span className="text-slate-500 dark:text-slate-400">Curriculum Progress:</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                {masteredCount} / {totalTopics} Mastered
              </span>
            </div>

            {/* Navigation Tabs List */}
            <div className="space-y-1">
              {navTabs.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block py-2 text-sm font-medium rounded-lg px-2.5 transition-colors ${
                    isActive(item.href)
                      ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-white/5 font-semibold'
                      : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.03]'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Mobile Theme Switcher Section */}
            <div className="pt-3 border-t border-slate-200 dark:border-white/10 space-y-2">
              <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Color Theme
              </div>
              <ThemeSwitcher variant="segmented" />
            </div>

            {/* Quick Role Switcher Button */}
            <div className="pt-2 border-t border-slate-200 dark:border-white/10 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setAuthModalOpen(true);
                }}
                className={`w-full py-2.5 px-4 rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-2 border ${
                  isAdmin
                    ? 'bg-emerald-50 dark:bg-emerald-950/80 border-emerald-300 dark:border-emerald-500/50 text-emerald-700 dark:text-emerald-400'
                    : 'bg-cyan-50 dark:bg-cyan-950/80 border-cyan-300 dark:border-cyan-500/50 text-cyan-700 dark:text-cyan-400'
                }`}
              >
                {isAdmin ? <Shield className="w-4 h-4" /> : <GraduationCap className="w-4 h-4" />}
                <span>Switch Role: {isAdmin ? 'Admin Mode (Active)' : 'Student Mode (Active)'}</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Auth Modal for User Credentials & Role Switching */}
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </>
  );
};
