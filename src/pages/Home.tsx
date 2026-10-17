import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Terminal,
  Zap,
  ArrowRight,
  Database,
  Shield,
  Activity,
  Layers,
  Sparkles,
  CheckCircle2,
  Code2,
} from 'lucide-react';
import { Module } from '../types';
import { SEED_MODULES } from '../data/seedRoadmap';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { InteractiveRoadmap } from '../components/InteractiveRoadmap';
import { BridgeVisualizer } from '../components/BridgeVisualizer';

export const Home: React.FC = () => {
  const [modules, setModules] = useState<Module[]>(SEED_MODULES);
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState<'supabase' | 'local_seed'>('local_seed');

  useEffect(() => {
    async function loadCurriculum() {
      if (!isSupabaseConfigured) {
        setModules(SEED_MODULES);
        setDataSource('local_seed');
        return;
      }

      setLoading(true);
      try {
        const { data: modulesData, error: modErr } = await supabase
          .from('modules')
          .select('*, topics(*)')
          .order('stage_number', { ascending: true });

        if (!modErr && modulesData && modulesData.length > 0) {
          setModules(modulesData as Module[]);
          setDataSource('supabase');
        } else {
          setModules(SEED_MODULES);
          setDataSource('local_seed');
        }
      } catch (err) {
        console.warn('Error loading modules from Supabase:', err);
        setModules(SEED_MODULES);
        setDataSource('local_seed');
      } finally {
        setLoading(false);
      }
    }

    loadCurriculum();
  }, []);

  return (
    <div className="space-y-16">
      {/* Cyber-Architect Hero Section */}
      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-[#111111] to-[#0a0a0a] p-6 sm:p-10 lg:p-14 shadow-2xl">
        {/* Neon Glow accents */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#00ff88]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#00ccff]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-[#00ff88]/30 text-[#00ff88] text-xs font-mono font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Full-Stack Mobile Architecture Platform</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Master React Native <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00ff88] via-[#00ccff] to-cyan-400">
                At The C++ & JSI Level
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-xl font-normal">
              An interactive, visual educational platform for senior developers and architects. Deconstruct the C++ Shadow Tree, zero-serialization JSI HostObjects, 120Hz Reanimated worklets, and native bridging in Java and Swift.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href="#roadmap"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs sm:text-sm font-mono font-bold tracking-wide text-slate-950 bg-[#00ff88] hover:bg-[#33ff9f] active:bg-[#00cc6a] shadow-[0_0_25px_rgba(0,255,136,0.4)] transition-all"
              >
                <span>Start Here Roadmap</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <Link
                to="/topic/old-bridge-vs-new-architecture-jsi"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-mono font-semibold text-slate-200 border border-white/10 bg-slate-900/80 hover:bg-slate-800 hover:border-white/20 transition-all"
              >
                <Zap className="w-4 h-4 text-[#00ccff]" />
                <span>Launch JSI Simulator</span>
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-2xl overflow-hidden border border-white/10 bg-black/60 shadow-2xl relative group">
              <img
                src="/src/assets/images/rn_architecture_blueprint_1792259680402.jpg"
                alt="React Native Architecture Blueprint"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent flex items-end p-5">
                <div className="flex items-center justify-between w-full text-xs font-mono">
                  <span className="text-[#00ff88] font-bold">4 Stages of Mastery</span>
                  <span className="text-slate-400">JSI · Worklets · Sockets · Codegen</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Database & Progress Status Bar */}
      <section className="rounded-2xl border border-white/10 bg-[#0d0d0d] p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-slate-900 border border-white/10 text-[#00ff88] shrink-0">
            <Database className="w-4 h-4" />
          </div>
          <div className="space-y-0.5">
            <div className="text-xs font-mono font-semibold text-slate-200 flex items-center gap-2">
              <span>BaaS State:</span>
              <span className="text-[#00ff88]">
                {dataSource === 'supabase'
                  ? 'Connected to PostgreSQL & Supabase Auth'
                  : 'Modular Local Seed Active (Offline Ready)'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Admin account configured: <code className="text-[#00ccff]">akashyadavazm@gmail.com</code>
            </p>
          </div>
        </div>

        <Link
          to="/sql-schema"
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-mono text-slate-300 hover:text-white border border-white/10 bg-black/60 rounded-lg transition-colors whitespace-nowrap shrink-0 self-start sm:self-auto"
        >
          <span>View Supabase SQL Blueprint</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </section>

      {/* Flagship Interactive Feature: The Live Simulator Preview */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono font-semibold text-[#00ccff] uppercase tracking-wider">
              <Code2 className="w-4 h-4 text-[#00ccff]" />
              <span>Stage 1 Flagship Visualizer</span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Test The JSI vs Bridge Execution Engine
            </h2>
          </div>

          <Link
            to="/topic/old-bridge-vs-new-architecture-jsi"
            className="text-xs font-mono text-[#00ff88] hover:underline flex items-center gap-1 hidden sm:flex"
          >
            <span>Open Dedicated Topic</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Embedded Interactive Simulator */}
        <BridgeVisualizer />
      </section>

      {/* The 4-Stage Interactive Roadmap */}
      <InteractiveRoadmap modules={modules} />
    </div>
  );
};
