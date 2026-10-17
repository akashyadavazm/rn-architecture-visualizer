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
  UserCheck,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import { useTopicProgress } from '../lib/progressStore';
import { useAuth } from '../lib/authStore';
import { GlobalSearch } from './GlobalSearch';
import { AuthModal } from './AuthModal';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const location = useLocation();
  const { masteredCount } = useTopicProgress();
  const { currentUser, isAdmin } = useAuth();

  const totalTopics = 8; // 8 Stages in Full Curriculum
  const progressPercentage = Math.round((masteredCount / totalTopics) * 100);

  const navLinks = [
    { label: 'Roadmap', href: '/#roadmap' },
    { label: 'JSI Simulator', href: '/topic/old-bridge-vs-new-architecture-jsi' },
    { label: 'Responsive Studio', href: '/topic/flexbox-responsive-dimension-scaling' },
    { label: 'Supabase Schema', href: '/sql-schema' },
    { label: 'Admin CMS', href: '/admin' },
  ];

  const isActive = (path: string) => {
    if (path === '/#roadmap' && (location.pathname === '/' || location.hash === '#roadmap')) return true;
    if (path !== '/#roadmap' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <>
      {/* Outer Floating Wrapper (Relative anchor for mobile sibling dropdown) */}
      <div className="sticky top-4 z-50 px-4 sm:px-6 lg:px-8 w-full pointer-events-none relative">
        {/* Sleek Pill Header Bar - Fixed Height to prevent oval deformation */}
        <header className="pointer-events-auto h-16 bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/10 rounded-full mx-auto max-w-7xl px-5 sm:px-6 shadow-[0_8px_32px_rgba(0,0,0,0.5)] flex items-center justify-between gap-3 sm:gap-4 transition-all">
          {/* Far Left: Logo */}
          <Link
            to="/"
            className="group flex items-center gap-2.5 text-sm sm:text-base font-bold tracking-tight text-white whitespace-nowrap shrink-0"
          >
            <div className="w-8 h-8 rounded-full bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center text-emerald-400 group-hover:border-emerald-400 group-hover:shadow-[0_0_15px_rgba(52,211,153,0.3)] transition-all">
              <Terminal className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold tracking-tight">RN Architect</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950/70 text-cyan-400 border border-cyan-800/50 hidden lg:inline-block">
                8 Stages
              </span>
            </div>
          </Link>

          {/* Center: Clean Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-xs sm:text-sm font-medium text-slate-300">
            {navLinks.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={`transition-colors whitespace-nowrap relative py-1 ${
                  isActive(item.href)
                    ? 'text-emerald-400 font-semibold'
                    : 'hover:text-white'
                }`}
              >
                {item.label}
                {isActive(item.href) && (
                  <motion.div
                    layoutId="activeNavPill"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </nav>

          {/* Far Right: Search, Role Badge & Trigger */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Embedded Search Trigger */}
            <div className="w-32 sm:w-44 lg:w-48 hidden md:block">
              <GlobalSearch />
            </div>

            {/* Personal Learner Progress Badge */}
            <Link
              to="/#roadmap"
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:border-emerald-500/40 transition-colors text-xs font-mono"
              title={`${masteredCount} of ${totalTopics} stages mastered`}
            >
              <CheckCircle2
                className={`w-3.5 h-3.5 ${
                  masteredCount > 0 ? 'text-emerald-400' : 'text-slate-500'
                }`}
              />
              <span className="text-slate-200">
                <span className="text-emerald-400 font-bold">{masteredCount}</span>
                <span className="text-slate-500">/{totalTopics}</span>
              </span>
              <div className="w-8 h-1 bg-white/10 rounded-full overflow-hidden hidden xl:block">
                <div
                  className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 transition-all duration-500"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </Link>

            {/* Role Switcher Pill (Admin vs Student) */}
            <button
              type="button"
              onClick={() => setAuthModalOpen(true)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded-full border transition-all active:scale-95 ${
                isAdmin
                  ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-400 hover:shadow-[0_0_15px_rgba(52,211,153,0.3)]'
                  : 'bg-cyan-950/80 border-cyan-500/50 text-cyan-400 hover:shadow-[0_0_15px_rgba(6,182,212,0.3)]'
              }`}
              title="Click to switch role or view credentials"
            >
              {isAdmin ? (
                <>
                  <Shield className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="font-bold hidden xl:inline">Admin:</span>
                  <span className="truncate max-w-[120px] sm:max-w-none">{currentUser.email.split('@')[0]}</span>
                </>
              ) : (
                <>
                  <GraduationCap className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span className="font-bold hidden xl:inline">Learner:</span>
                  <span className="truncate max-w-[120px] sm:max-w-none">intern</span>
                </>
              )}
              <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
            </button>

            {/* Mobile Menu Hamburger Button */}
            <div className="flex lg:hidden items-center">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-slate-300 hover:text-white rounded-full bg-white/5 border border-white/10 focus:outline-none"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </header>

        {/* 
          CRITICAL FIX: Mobile Dropdown as an ABSOLUTE SIBLING CARD!
          Positioned below the top bar (top-20 left-4 right-4).
          NEVER expands inside the rounded-full header div!
        */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -12, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.96 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="lg:hidden pointer-events-auto absolute top-20 left-4 right-4 bg-[#0d0d0d]/95 backdrop-blur-2xl border border-white/15 rounded-2xl p-6 shadow-2xl z-50 space-y-4 max-w-7xl mx-auto"
            >
              {/* Mobile Search */}
              <div className="pb-1">
                <GlobalSearch />
              </div>

              {/* Progress and Role Header */}
              <div className="flex items-center justify-between py-2 border-b border-white/10 text-xs font-mono">
                <span className="text-slate-400">Roadmap Progress:</span>
                <span className="text-emerald-400 font-bold">{masteredCount} / {totalTopics} Mastered</span>
              </div>

              {/* Navigation Links */}
              <div className="space-y-1">
                {navLinks.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block py-2 text-sm font-medium rounded-lg px-2 transition-colors ${
                      isActive(item.href)
                        ? 'text-emerald-400 bg-white/5 font-semibold'
                        : 'text-slate-300 hover:text-white hover:bg-white/[0.03]'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>

              {/* Quick Role Switcher Button */}
              <div className="pt-2 border-t border-white/10 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setAuthModalOpen(true);
                  }}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-2 border ${
                    isAdmin
                      ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-400'
                      : 'bg-cyan-950/80 border-cyan-500/50 text-cyan-400'
                  }`}
                >
                  {isAdmin ? <Shield className="w-4 h-4" /> : <GraduationCap className="w-4 h-4" />}
                  <span>Switch Role: {isAdmin ? 'Admin Mode (Active)' : 'Student Mode (Active)'}</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Global Auth Modal */}
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </>
  );
};
