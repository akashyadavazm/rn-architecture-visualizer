import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Layers, Activity, AlertTriangle, CheckCircle2, Play, RotateCcw, Cpu } from 'lucide-react';

type ListEngine = 'scrollview' | 'unoptimized_flatlist' | 'flashlist_recycler';

export const FlatListRecyclerVisualizer: React.FC = () => {
  const [engine, setEngine] = useState<ListEngine>('flashlist_recycler');
  const [scrollIndex, setScrollIndex] = useState(25);
  const [isFlinging, setIsFlinging] = useState(false);

  const handleSimulateFastFling = () => {
    setIsFlinging(true);
    let current = scrollIndex;
    const interval = setInterval(() => {
      current += 6;
      if (current >= 80) {
        setScrollIndex(80);
        clearInterval(interval);
        setIsFlinging(false);
      } else {
        setScrollIndex(current);
      }
    }, 120);
  };

  const handleReset = () => {
    setScrollIndex(10);
    setIsFlinging(false);
  };

  // Metrics by engine
  const stats = {
    scrollview: {
      allocatedCells: 1000,
      activeNativeViews: 1000,
      memoryUsage: '198 MB (RAM Leak Hazard)',
      fps: isFlinging ? 18 : 34,
      blankSpaces: false,
      status: 'CRASH RISK (OOM on Low-End Android)',
      tagColor: 'text-red-400 border-red-500/40 bg-red-950/40',
    },
    unoptimized_flatlist: {
      allocatedCells: 1000,
      activeNativeViews: 84, // windowSize 21
      memoryUsage: '82 MB',
      fps: isFlinging ? 28 : 55,
      blankSpaces: isFlinging, // Shows white blank flash on fast scroll!
      status: 'WHITE BLANKS ON FLING',
      tagColor: 'text-amber-400 border-amber-500/40 bg-amber-950/40',
    },
    flashlist_recycler: {
      allocatedCells: 1000,
      activeNativeViews: 12, // Strict 10-12 recycled cells!
      memoryUsage: '26 MB (Optimal)',
      fps: 60,
      blankSpaces: false,
      status: 'ZERO-BLANK RECYCLED 60FPS',
      tagColor: 'text-emerald-400 border-emerald-500/40 bg-emerald-950/40',
    },
  };

  const currentStats = stats[engine];

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(#06b6d412_1px,transparent_1px)] [background-size:18px_18px] pointer-events-none opacity-40" />

      {/* Header */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-semibold text-emerald-400 uppercase tracking-wider">
            <Layers className="w-4 h-4 text-emerald-400" />
            <span>Virtualization & Memory Profiler</span>
          </div>
          <h3 className="text-xl font-bold text-white tracking-tight mt-1">
            ScrollView vs FlatList vs FlashList Cell Recycler
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Simulate fast scrolling through 1,000 list rows to inspect why standard ScrollView triggers Out-Of-Memory (OOM) crashes, while cell recycling reuses the same 12 native views indefinitely.
          </p>
        </div>

        {/* Engine Switcher Tabs */}
        <div className="flex items-center p-1 bg-black/60 border border-white/10 rounded-xl shrink-0">
          <button
            type="button"
            onClick={() => setEngine('scrollview')}
            className={`px-2.5 py-1.5 text-xs font-mono font-semibold rounded-lg transition-all ${
              engine === 'scrollview'
                ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            ScrollView
          </button>
          <button
            type="button"
            onClick={() => setEngine('unoptimized_flatlist')}
            className={`px-2.5 py-1.5 text-xs font-mono font-semibold rounded-lg transition-all ${
              engine === 'unoptimized_flatlist'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            FlatList (Unoptimized)
          </button>
          <button
            type="button"
            onClick={() => setEngine('flashlist_recycler')}
            className={`px-2.5 py-1.5 text-xs font-mono font-semibold rounded-lg transition-all ${
              engine === 'flashlist_recycler'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-[0_0_15px_rgba(52,211,153,0.3)]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            FlashList Recycler
          </button>
        </div>
      </div>

      {/* Telemetry HUD */}
      <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
        <div className="p-3 bg-black/60 border border-white/5 rounded-xl">
          <span className="text-[11px] text-slate-400 block">Memory Footprint</span>
          <div className="text-base sm:text-lg font-bold text-white mt-1">{currentStats.memoryUsage}</div>
        </div>

        <div className="p-3 bg-black/60 border border-white/5 rounded-xl">
          <span className="text-[11px] text-slate-400 block">Active Native Views</span>
          <div className="text-base sm:text-lg font-bold text-white mt-1">
            {currentStats.activeNativeViews} <span className="text-xs text-slate-500 font-normal">/ 1,000</span>
          </div>
        </div>

        <div className="p-3 bg-black/60 border border-white/5 rounded-xl">
          <span className="text-[11px] text-slate-400 block">Scroll FPS</span>
          <div
            className={`text-base sm:text-lg font-bold mt-1 ${
              currentStats.fps < 40 ? 'text-red-400' : 'text-emerald-400'
            }`}
          >
            {currentStats.fps} FPS
          </div>
        </div>

        <div className="p-3 bg-black/60 border border-white/5 rounded-xl">
          <span className="text-[11px] text-slate-400 block">Cell Engine State</span>
          <div className="text-xs font-bold text-cyan-300 mt-1 truncate">{currentStats.status}</div>
        </div>
      </div>

      {/* Interactive Simulation Track */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-black/50 border border-white/10 rounded-2xl p-6">
        {/* Visualized Mobile Viewport */}
        <div className="lg:col-span-6 flex justify-center">
          <div className="w-72 h-80 bg-[#121212] border-2 border-slate-700 rounded-3xl p-3 flex flex-col justify-between overflow-hidden shadow-2xl relative">
            <div className="flex items-center justify-between pb-2 border-b border-white/10 text-[10px] font-mono text-slate-400">
              <span>Feed: Item #{scrollIndex}</span>
              <span className="text-cyan-400">{engine.toUpperCase()}</span>
            </div>

            {/* List Rows Simulation */}
            <div className="flex-1 overflow-hidden space-y-2 py-2 relative">
              {currentStats.blankSpaces ? (
                /* Unoptimized blank white box during fling */
                <div className="h-full bg-white/90 rounded-xl flex items-center justify-center animate-pulse text-black font-bold text-xs">
                  <span>⚠️ BLANK SCREEN (Bridge Waiting...)</span>
                </div>
              ) : (
                /* Active Visible Cells */
                [0, 1, 2, 3, 4].map((offset) => {
                  const itemIndex = scrollIndex + offset;
                  return (
                    <motion.div
                      key={`${engine}-${itemIndex}`}
                      initial={{ opacity: 0.8, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-2.5 rounded-lg bg-white/5 border border-white/10 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-md bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-mono text-[10px] font-bold">
                          #{itemIndex}
                        </div>
                        <div>
                          <p className="text-[11px] font-bold text-white">Order Record {itemIndex}</p>
                          <p className="text-[9px] text-slate-400">Cell recycled & rebound</p>
                        </div>
                      </div>
                      <span className="text-[9px] font-mono text-slate-500">Recycled</span>
                    </motion.div>
                  );
                })
              )}
            </div>

            {/* Bottom scroll position indicator */}
            <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-slate-500">
              <span>Offset: {scrollIndex * 60}px</span>
              <span>Total: 1,000</span>
            </div>
          </div>
        </div>

        {/* Controls & Architecture Takeaway */}
        <div className="lg:col-span-6 space-y-4">
          <div className="space-y-2">
            <span className="text-xs font-mono uppercase text-slate-400 font-bold block">
              Scroll Simulation Controls
            </span>
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleSimulateFastFling}
                disabled={isFlinging}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold text-slate-950 bg-gradient-to-r from-emerald-400 to-cyan-400 hover:shadow-[0_0_20px_rgba(52,211,153,0.35)] transition-all disabled:opacity-50"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Simulate 120Hz Fast Fling Scroll</span>
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="p-2 text-slate-400 hover:text-white rounded-lg bg-black/60 border border-white/10 text-xs font-mono flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-black/60 border border-white/10 text-xs space-y-2 leading-relaxed">
            <p className="font-bold text-cyan-300 font-mono">Cell Recycling Architecture Takeaway:</p>
            {engine === 'scrollview' && (
              <p className="text-red-200">
                ScrollView creates 1,000 real native views at launch. On high-density screens, this creates immediate memory thrashing and Android Low-Memory-Killer (LMK) crash terminations.
              </p>
            )}
            {engine === 'unoptimized_flatlist' && (
              <p className="text-amber-200">
                FlatList virtualizes views, but relies on asynchronous JavaScript bridge calls to measure and mount cells. On fast scrolls, the user outpaces the JS thread, exposing blank white canvas gaps.
              </p>
            )}
            {engine === 'flashlist_recycler' && (
              <p className="text-emerald-200">
                FlashList maintains a persistent pool of ~12 native view cells. As items scroll off screen, they are NOT destroyed. Instead, they are instantaneously repositioned and rebound with new props, locking memory to 26MB and sustaining 60/120FPS.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
