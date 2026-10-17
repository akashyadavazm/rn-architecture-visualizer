import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Shield, CheckCircle2, Menu, X, Sparkles } from 'lucide-react';
import { useTopicProgress } from '../lib/progressStore';
import { GlobalSearch } from './GlobalSearch';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { masteredCount } = useTopicProgress();

  const totalTopics = 4; // 4 Core Stages in Phase 1
  const progressPercentage = Math.round((masteredCount / totalTopics) * 100);

  const navLinks = [
    { label: 'Roadmap', href: '/#roadmap' },
    { label: 'JSI Visualizer', href: '/topic/old-bridge-vs-new-architecture-jsi' },
    { label: 'Supabase Schema', href: '/sql-schema' },
    { label: 'Admin Portal', href: '/admin' },
  ];

  const isActive = (path: string) => {
    if (path === '/#roadmap' && (location.pathname === '/' || location.hash === '#roadmap')) return true;
    if (path !== '/#roadmap' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-50 bg-[#0a0a0a]/90 backdrop-blur-xl border-b border-white/10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4 lg:gap-8">
        {/* Brand Zone */}
        <Link
          to="/"
          className="group flex items-center gap-2.5 text-base sm:text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0"
        >
          <div className="w-8 h-8 rounded-lg bg-emerald-950/80 border border-[#00ff88]/40 flex items-center justify-center text-[#00ff88] group-hover:border-[#00ff88] group-hover:shadow-[0_0_15px_rgba(0,255,136,0.3)] transition-all">
            <Terminal className="w-4 h-4 text-[#00ff88]" />
          </div>
          <div className="flex flex-col">
            <span className="leading-tight flex items-center gap-1.5">
              <span>RN Architect</span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 rounded bg-cyan-950/80 text-[#00ccff] border border-cyan-800/60 hidden sm:inline">
                Core
              </span>
            </span>
            <span className="text-[10px] text-slate-400 font-mono tracking-wider hidden sm:block">
              Mobile Systems Engineering
            </span>
          </div>
        </Link>

        {/* Global Search Component in Navbar */}
        <div className="flex-1 max-w-xs md:max-w-sm hidden sm:block">
          <GlobalSearch />
        </div>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-5 text-xs sm:text-sm font-medium text-slate-300 shrink-0">
          {navLinks.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={`transition-colors whitespace-nowrap shrink-0 pb-0.5 ${
                isActive(item.href)
                  ? 'text-[#00ff88] font-semibold border-b-2 border-[#00ff88]'
                  : 'hover:text-white hover:border-b-2 hover:border-slate-500'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right Section: Progress pill & Admin Trigger */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Progress Indicator */}
          <Link
            to="/#roadmap"
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-white/10 hover:border-[#00ff88]/40 transition-colors text-xs font-mono"
            title={`${masteredCount} of ${totalTopics} topics mastered`}
          >
            <CheckCircle2
              className={`w-3.5 h-3.5 ${
                masteredCount > 0 ? 'text-[#00ff88]' : 'text-slate-500'
              }`}
            />
            <span className="text-slate-200">
              <span className="text-[#00ff88] font-bold">{masteredCount}</span>
              <span className="text-slate-500">/{totalTopics}</span>
              <span className="text-slate-400 ml-1 hidden xl:inline">Mastered</span>
            </span>
            <div className="w-10 h-1 bg-slate-800 rounded-full overflow-hidden hidden xl:block">
              <motion.div
                className="h-full bg-gradient-to-r from-[#00ccff] to-[#00ff88]"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </Link>

          {/* Admin Access Button */}
          <Link
            to="/admin"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-950 bg-[#00ff88] rounded-md hover:bg-[#33ff9f] active:bg-[#00cc6a] hover:shadow-[0_0_20px_rgba(0,255,136,0.4)] transition-all whitespace-nowrap shrink-0"
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Admin</span>
          </Link>

          {/* Mobile Search & Hamburger Button */}
          <div className="flex sm:hidden items-center gap-1">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-400 hover:text-white rounded-md focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer with GlobalSearch */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="sm:hidden border-b border-white/10 bg-[#0f0f0f] px-4 pt-3 pb-5 space-y-3"
          >
            {/* Mobile Global Search Input */}
            <div className="pb-1">
              <GlobalSearch />
            </div>

            <div className="flex items-center justify-between py-2 border-b border-white/10 text-xs font-mono">
              <span className="text-slate-400">Roadmap Progress</span>
              <span className="text-[#00ff88] font-bold">{masteredCount} / {totalTopics} Mastered</span>
            </div>

            {navLinks.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block py-2 text-sm font-medium ${
                  isActive(item.href) ? 'text-[#00ff88]' : 'text-slate-300 hover:text-white'
                }`}
              >
                {item.label}
              </Link>
            ))}

            <div className="pt-2">
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center w-full px-4 py-2 text-xs font-semibold text-slate-950 bg-[#00ff88] rounded-md"
              >
                Admin Access (akashyadavazm@gmail.com)
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
