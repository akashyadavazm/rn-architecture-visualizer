import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Terminal, Database, Shield, ArrowUpRight } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#050505] text-slate-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-300">
      {/* Floating Navbar */}
      <Navbar />

      {/* Main Container strictly constrained to max-w-7xl with generous breathing room */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 lg:px-8 py-10 sm:py-16">
        {children}
      </main>

      {/* Cyber-Architect Footer constrained to max-w-7xl */}
      <footer className="border-t border-white/10 bg-[#050505] py-16 text-slate-400 text-xs font-mono mt-auto">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div className="space-y-2">
            <p className="font-bold text-white text-sm flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
              <span>React Native Cyber-Architect</span>
            </p>
            <p className="text-slate-500 font-sans text-xs max-w-md">
              Senior Mobile Architecture, C++ JSI HostObjects, Native 120Hz Worklets, and Threading Internals.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-8 text-slate-400">
            <Link to="/sql-schema" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
              <Database className="w-4 h-4 text-cyan-400" />
              <span>Supabase Schema</span>
            </Link>
            <Link to="/admin" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>Admin (akashyadavazm@gmail.com)</span>
            </Link>
            <a
              href="https://github.com/facebook/react-native"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors flex items-center gap-1"
            >
              <Terminal className="w-4 h-4" />
              <span>RN Core</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full mt-8 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-slate-600 gap-4 text-[11px]">
          <span>Engine Pipeline: JSI · Hermes AOT · Fabric Shadow Nodes · Reanimated 3</span>
          <span>Lead: akashyadavazm@gmail.com</span>
        </div>
      </footer>
    </div>
  );
};
