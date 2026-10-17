import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Zap,
  ArrowRight,
  Database,
  Code2,
  Sparkles,
  Layers,
  Cpu,
} from 'lucide-react';
import { Module } from '../types';
import { SEED_MODULES } from '../data/seedRoadmap';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { InteractiveRoadmap } from '../components/InteractiveRoadmap';
import { BridgeVisualizer } from '../components/BridgeVisualizer';
import { AbstractArchitectureHero } from '../components/AbstractArchitectureHero';

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
    <div className="w-full space-y-20 lg:space-y-28 py-4 sm:py-8">
      {/* 1. Redesigned 2-Column Hero Section */}
      <section className="relative w-full">
        {/* Subtle ambient lighting */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column: Typography, Badge & CTAs */}
          <div className="space-y-6 lg:space-y-8">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-semibold shadow-[0_0_15px_rgba(52,211,153,0.15)]">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Stages 1–4 · Senior Mobile Architecture</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
              Master React Native <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
                At The C++ & JSI Level
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-xl font-normal">
              An interactive visual curriculum for senior developers, mobile leads, and architects. Deconstruct the C++ Shadow Tree, zero-serialization HostObjects, 120Hz UI thread worklets, and native bridging in Java and Swift.
            </p>

            {/* Flexbox row for CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href="#roadmap"
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full text-xs sm:text-sm font-mono font-bold tracking-wide text-slate-950 bg-gradient-to-r from-emerald-400 to-cyan-400 hover:shadow-[0_0_30px_rgba(52,211,153,0.35)] active:scale-95 transition-all"
              >
                <span>Start Here Roadmap</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <Link
                to="/topic/old-bridge-vs-new-architecture-jsi"
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full text-xs sm:text-sm font-mono font-semibold text-slate-200 border border-white/10 bg-white/5 hover:bg-white/10 hover:border-emerald-500/30 transition-all active:scale-95"
              >
                <Zap className="w-4 h-4 text-cyan-400" />
                <span>Launch JSI Simulator</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Abstract Architecture Component */}
          <div className="w-full">
            <AbstractArchitectureHero />
          </div>
        </div>
      </section>

      {/* 2. BaaS & RLS Database Status Pill */}
      <section className="w-full">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8 hover:border-emerald-500/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
          <div className="flex items-start sm:items-center gap-4">
            <div className="p-3 rounded-xl bg-black/60 border border-white/10 text-emerald-400 shrink-0">
              <Database className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="space-y-1">
              <div className="text-sm font-mono font-bold text-white flex items-center gap-2">
                <span>Database Sync:</span>
                <span className="text-emerald-400 font-mono">
                  {dataSource === 'supabase'
                    ? 'Connected to PostgreSQL & Supabase Auth'
                    : 'Modular Offline Seed Engine (Zero Setup Needed)'}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Security Model: Row Level Security (RLS) guarded for owner <code className="text-cyan-400 font-mono">akashyadavazm@gmail.com</code>
              </p>
            </div>
          </div>

          <Link
            to="/sql-schema"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono font-medium text-slate-300 hover:text-white border border-white/10 bg-black/40 hover:border-emerald-500/30 transition-colors whitespace-nowrap shrink-0 self-start sm:self-auto"
          >
            <span>View SQL Blueprint</span>
            <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
          </Link>
        </div>
      </section>

      {/* 3. Flagship Interactive Feature: JSI vs Bridge Simulator */}
      <section className="w-full space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/10 pb-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono font-semibold text-cyan-400 uppercase tracking-wider">
              <Code2 className="w-4 h-4 text-cyan-400" />
              <span>Interactive Architecture Visualizer</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Test The JSI vs Bridge Execution Engine
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
              Simulate high-frequency mobile touch events to see FIFO queue stalling on the legacy JSON bridge vs 120Hz instantaneous C++ pointer execution.
            </p>
          </div>

          <Link
            to="/topic/old-bridge-vs-new-architecture-jsi"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            <span>Open Dedicated Paper</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Embedded Interactive Simulator */}
        <BridgeVisualizer />
      </section>

      {/* 4. The 4-Stage Interactive Roadmap */}
      <section className="w-full pt-4">
        <InteractiveRoadmap modules={modules} />
      </section>
    </div>
  );
};
