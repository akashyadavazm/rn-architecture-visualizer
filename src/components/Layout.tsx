import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Terminal, Database, Shield, ArrowUpRight } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-slate-100 flex flex-col font-sans selection:bg-[#00ff88]/30 selection:text-[#00ff88]">
      {/* Top Navbar */}
      <Navbar />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {children}
      </main>

      {/* Cyber-Architect Footer */}
      <footer className="border-t border-white/10 bg-[#070707] py-10 mt-16 text-slate-400 text-xs font-mono">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <p className="font-bold text-white text-sm flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#00ff88]" />
              <span>React Native Cyber-Architect</span>
            </p>
            <p className="text-slate-500 font-sans">
              Senior Mobile Architecture, JSI, Native Worklets, and C++ Bridging.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-slate-400">
            <Link to="/sql-schema" className="hover:text-[#00ff88] transition-colors flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-[#00ccff]" />
              <span>Supabase Schema</span>
            </Link>
            <Link to="/admin" className="hover:text-[#00ff88] transition-colors flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-[#00ff88]" />
              <span>Admin (akashyadavazm@gmail.com)</span>
            </Link>
            <a
              href="https://github.com/facebook/react-native"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors flex items-center gap-1"
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>RN Core</span>
              <ArrowUpRight className="w-3 h-3" />
            </a>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-slate-600 gap-3 text-[11px]">
          <span>Engine Pipeline: JSI · Hermes AOT · Fabric Shadow Nodes · Reanimated 3</span>
          <span>Owner: akashyadavazm@gmail.com</span>
        </div>
      </footer>
    </div>
  );
};
