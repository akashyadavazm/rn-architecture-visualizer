import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Shield, CheckCircle2, Menu, X } from 'lucide-react';
import { useTopicProgress } from '../lib/progressStore';
import { GlobalSearch } from './GlobalSearch';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { masteredCount } = useTopicProgress();

  const totalTopics = 4;
  const progressPercentage = Math.round((masteredCount / totalTopics) * 100);

  const navLinks = [
    { label: 'Roadmap', href: '/#roadmap' },
    { label: 'JSI Simulator', href: '/topic/old-bridge-vs-new-architecture-jsi' },
    { label: 'Supabase Schema', href: '/sql-schema' },
    { label: 'Admin', href: '/admin' },
  ];

  const isActive = (path: string) => {
    if (path === '/#roadmap' && (location.pathname === '/' || location.hash === '#roadmap')) return true;
    if (path !== '/#roadmap' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <div className="sticky top-4 z-50 px-4 sm:px-6 lg:px-8 w-full pointer-events-none">
      <header className="pointer-events-auto bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/10 rounded-full mx-auto max-w-7xl px-6 py-3 shadow-[0_8px_32px_rgba(0,0,0,0.5)] transition-all">
        <div className="flex items-center justify-between gap-4">
          {/* Far Left: Logo */}
          <Link
            to="/"
            className="group flex items-center gap-2.5 text-sm sm:text-base font-bold tracking-tight text-white whitespace-nowrap shrink-0"
          >
            <div className="w-8 h-8 rounded-full bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center text-emerald-400 group-hover:border-emerald-400 group-hover:shadow-[0_0_15px_rgba(52,211,153,0.3)] transition-all">
              <Terminal className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold tracking-tight">RN Architect</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950/70 text-cyan-400 border border-cyan-800/50 hidden md:inline-block">
                Core
              </span>
            </div>
          </Link>

          {/* Center: Perfectly Centered Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs sm:text-sm font-medium text-slate-300">
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

          {/* Far Right: Search, Mastery Badge, and Admin Button */}
          <div className="hidden sm:flex items-center gap-3 shrink-0">
            {/* Embedded Global Search Trigger */}
            <div className="w-44 lg:w-56">
              <GlobalSearch />
            </div>

            {/* Mastery Progress Badge */}
            <Link
              to="/#roadmap"
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:border-emerald-500/40 transition-colors text-xs font-mono"
              title={`${masteredCount} of ${totalTopics} topics mastered`}
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
              <div className="w-8 h-1 bg-white/10 rounded-full overflow-hidden hidden lg:block">
                <div
                  className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 transition-all duration-500"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </Link>

            {/* Admin Portal Button */}
            <Link
              to="/admin"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-950 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full hover:shadow-[0_0_20px_rgba(52,211,153,0.35)] transition-all whitespace-nowrap shrink-0 active:scale-95"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin</span>
            </Link>
          </div>

          {/* Mobile Hamburger Trigger */}
          <div className="flex sm:hidden items-center gap-2">
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

        {/* Mobile Dropdown Panel */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.18 }}
              className="sm:hidden mt-3 pt-4 border-t border-white/10 space-y-3"
            >
              <div className="pb-1">
                <GlobalSearch />
              </div>

              <div className="flex items-center justify-between py-1 text-xs font-mono text-slate-400">
                <span>Progress:</span>
                <span className="text-emerald-400 font-bold">{masteredCount} / {totalTopics} Mastered</span>
              </div>

              {navLinks.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block py-1.5 text-sm font-medium ${
                    isActive(item.href) ? 'text-emerald-400' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {item.label}
                </Link>
              ))}

              <div className="pt-2">
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-center w-full px-4 py-2 text-xs font-semibold text-slate-950 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full"
                >
                  Admin Portal (akashyadavazm@gmail.com)
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </div>
  );
};
