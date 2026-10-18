import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Terminal, Database, Shield, ArrowUpRight } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#050505] text-slate-900 dark:text-slate-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-500 dark:selection:text-emerald-300 transition-colors duration-150">
      {/* Vercel / Next.js Docs Two-Tier Sticky Header */}
      <Navbar />

      {/* Main Container strictly constrained to max-w-7xl mx-auto px-6 with generous top/bottom padding */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-10 sm:py-16">
        {children}
      </main>

      {/* Cyber-Architect Footer constrained to max-w-7xl px-6 */}
      <footer className="border-t border-slate-200 dark:border-white/10 bg-white dark:bg-[#050505] py-14 text-slate-600 dark:text-slate-400 text-xs font-mono mt-auto transition-colors duration-150">
        <div className="max-w-7xl mx-auto px-6 w-full flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div className="space-y-2">
            <p className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
              <span>React Native Cyber-Architect</span>
            </p>
            <p className="text-slate-500 font-sans text-xs max-w-md">
              Senior Mobile Architecture, C++ JSI HostObjects, Native 120Hz Worklets, and Threading Internals.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6 sm:gap-8 text-slate-600 dark:text-slate-400">
            <Link to="/docs" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex items-center gap-1.5">
              <Terminal className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Developer Docs</span>
            </Link>
            <Link to="/sql-schema" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex items-center gap-1.5">
              <Database className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              <span>Supabase Schema</span>
            </Link>
            <Link to="/admin" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Admin</span>
            </Link>
            <a
              href="https://github.com/facebook/react-native"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-900 dark:hover:text-white transition-colors flex items-center gap-1"
            >
              <Terminal className="w-4 h-4" />
              <span>RN Core</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 w-full mt-8 pt-8 border-t border-slate-200 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between text-slate-500 dark:text-slate-600 gap-4 text-[11px]">
          <span>Engine Pipeline: JSI · Hermes AOT · Fabric Shadow Nodes · Reanimated 3</span>
          <span>Lead: akashyadavazm@gmail.com</span>
        </div>
      </footer>
    </div>
  );
};
