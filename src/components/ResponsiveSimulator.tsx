import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Smartphone, Tablet, AlertTriangle, CheckCircle2, RotateCcw, Maximize2 } from 'lucide-react';

type ScreenPreset = 'iphone_se' | 'iphone_promax' | 'pixel_fold';
type ScalingMode = 'fixed_px' | 'responsive_yoga';

export const ResponsiveSimulator: React.FC = () => {
  const [preset, setPreset] = useState<ScreenPreset>('iphone_se');
  const [scalingMode, setScalingMode] = useState<ScalingMode>('responsive_yoga');

  const presets = {
    iphone_se: {
      name: 'iPhone SE / Small Android',
      width: 290,
      height: 400,
      diagonal: '4.7"',
      dpi: 'Compact 375pt',
    },
    iphone_promax: {
      name: 'iPhone 16 Pro Max',
      width: 360,
      height: 480,
      diagonal: '6.9"',
      dpi: 'Large 430pt',
    },
    pixel_fold: {
      name: 'Pixel Fold / Tablet View',
      width: 440,
      height: 420,
      diagonal: '7.6"',
      dpi: 'Expanded 768pt',
    },
  };

  const current = presets[preset];

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
      {/* Background Cyber Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#34d39912_1px,transparent_1px)] [background-size:18px_18px] pointer-events-none opacity-40" />

      {/* Header */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-semibold text-cyan-400 uppercase tracking-wider">
            <Maximize2 className="w-4 h-4 text-cyan-400" />
            <span>Yoga Engine Dimension Visualizer</span>
          </div>
          <h3 className="text-xl font-bold text-white tracking-tight mt-1">
            Screen Density & Viewport Scaling Simulator
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Compare fixed pixel traps (which clip on compact phones or look tiny on tablets) against responsive percentage scaling (`wp`/`hp`) + Flexbox alignment.
          </p>
        </div>

        {/* Scaling Mode Toggle */}
        <div className="flex items-center p-1 bg-black/60 border border-white/10 rounded-xl shrink-0">
          <button
            type="button"
            onClick={() => setScalingMode('fixed_px')}
            className={`px-3 py-1.5 text-xs font-mono font-semibold rounded-lg transition-all ${
              scalingMode === 'fixed_px'
                ? 'bg-red-500/20 text-red-300 border border-red-500/40 shadow-[0_0_15px_rgba(239,68,68,0.2)]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Fixed Pixels (Junior Trap)
          </button>
          <button
            type="button"
            onClick={() => setScalingMode('responsive_yoga')}
            className={`px-3 py-1.5 text-xs font-mono font-semibold rounded-lg transition-all ${
              scalingMode === 'responsive_yoga'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-[0_0_15px_rgba(52,211,153,0.3)]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Responsive wp/hp + Flexbox
          </button>
        </div>
      </div>

      {/* Device Preset Switcher */}
      <div className="relative z-10 flex flex-wrap items-center gap-2">
        <span className="text-xs font-mono text-slate-400 mr-2">Target Hardware:</span>
        {(['iphone_se', 'iphone_promax', 'pixel_fold'] as ScreenPreset[]).map((pKey) => (
          <button
            key={pKey}
            type="button"
            onClick={() => setPreset(pKey)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all flex items-center gap-1.5 border ${
              preset === pKey
                ? 'bg-white/10 text-white border-cyan-400/80 shadow-[0_0_10px_rgba(6,182,212,0.2)]'
                : 'bg-black/40 text-slate-400 border-white/5 hover:text-white'
            }`}
          >
            {pKey === 'pixel_fold' ? <Tablet className="w-3.5 h-3.5" /> : <Smartphone className="w-3.5 h-3.5" />}
            <span>{presets[pKey].name}</span>
          </button>
        ))}
      </div>

      {/* Interactive Simulation Stage */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-black/50 border border-white/10 rounded-2xl p-6">
        {/* Device Canvas Frame */}
        <div className="lg:col-span-7 flex justify-center items-center py-4">
          <motion.div
            layout
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            style={{ width: current.width, height: current.height }}
            className="bg-[#121212] border-4 border-slate-700/80 rounded-[32px] p-4 shadow-2xl relative flex flex-col justify-between overflow-hidden"
          >
            {/* Top Dynamic Island / Notch */}
            <div className="w-24 h-4 bg-black rounded-full mx-auto mb-3 shrink-0" />

            {/* Simulated Mobile Card Inside Viewport */}
            <div className="flex-1 flex flex-col justify-center">
              {scalingMode === 'fixed_px' ? (
                /* ❌ BROKEN FIXED PIXEL CONTAINER */
                <div
                  style={{ width: 330, height: 190 }}
                  className="bg-red-950/40 border-2 border-dashed border-red-500/80 rounded-xl p-4 shadow-lg shrink-0 relative"
                >
                  <div className="flex items-center justify-between text-xs font-mono text-red-300 mb-2">
                    <span className="flex items-center gap-1 font-bold">
                      <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                      <span>width: 330px (Fixed)</span>
                    </span>
                    <span className="text-[10px] bg-red-900/60 px-1.5 py-0.5 rounded">Clips / Overflows</span>
                  </div>

                  <p className="text-xs text-white font-bold">Checkout Summary Header</p>
                  <p className="text-[11px] text-slate-300 mt-1 line-clamp-2">
                    Hardcoded fixed pixel dimensions cause right-side truncation on iPhone SE and wasted margins on Foldables.
                  </p>

                  <div className="mt-3 flex gap-2">
                    <div className="w-28 h-7 bg-red-500/40 rounded flex items-center justify-center text-[10px] text-red-200 font-mono">
                      $49.00 Fixed
                    </div>
                    <div className="w-36 h-7 bg-white/10 rounded flex items-center justify-center text-[10px] text-slate-300 font-mono">
                      Overflow Cutoff...
                    </div>
                  </div>

                  {/* Red Overflow Marker */}
                  {current.width < 340 && (
                    <div className="absolute -right-3 top-1/2 -translate-y-1/2 bg-red-600 text-white font-mono text-[9px] px-1 py-0.5 rounded shadow">
                      ! CLIPPED
                    </div>
                  )}
                </div>
              ) : (
                /* ✅ RESPONSIVE YOGA & WP/HP CONTAINER */
                <div className="w-full bg-emerald-950/30 border border-emerald-500/60 rounded-xl p-4 shadow-lg flex flex-col justify-between">
                  <div className="flex items-center justify-between text-xs font-mono text-emerald-300 mb-2">
                    <span className="flex items-center gap-1 font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>width: '92%' + Flexbox</span>
                    </span>
                    <span className="text-[10px] bg-emerald-900/60 text-emerald-200 px-1.5 py-0.5 rounded">
                      Adaptive
                    </span>
                  </div>

                  <p className="text-xs text-white font-bold">Checkout Summary Header</p>
                  <p className="text-[11px] text-slate-300 mt-1">
                    Fluid percentage width with Yoga Flexbox gap ensures perfect proportion across all screen widths.
                  </p>

                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <div className="h-7 bg-emerald-500/20 border border-emerald-500/40 rounded flex items-center justify-center text-[10px] text-emerald-300 font-mono font-bold">
                      $49.00 Auto
                    </div>
                    <div className="h-7 bg-white/10 border border-white/10 rounded flex items-center justify-center text-[10px] text-white font-mono">
                      Pay Now
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Home Indicator Bar */}
            <div className="w-28 h-1 bg-white/30 rounded-full mx-auto mt-3 shrink-0" />
          </motion.div>
        </div>

        {/* Diagnostic Analysis Panel */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-4 rounded-xl bg-black/60 border border-white/10 space-y-2">
            <span className="text-xs font-mono uppercase text-cyan-400 font-bold block">
              Viewport Diagnostics
            </span>
            <div className="grid grid-cols-2 gap-2 font-mono text-xs">
              <div>
                <span className="text-slate-500 block text-[10px]">Viewport Width</span>
                <span className="text-white font-bold">{current.dpi}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Display Ratio</span>
                <span className="text-white font-bold">{current.diagonal}</span>
              </div>
            </div>
          </div>

          <div
            className={`p-4 rounded-xl border text-xs leading-relaxed space-y-2 ${
              scalingMode === 'fixed_px'
                ? 'bg-red-950/20 border-red-800/60 text-red-200'
                : 'bg-emerald-950/20 border-emerald-800/60 text-emerald-200'
            }`}
          >
            <p className="font-bold flex items-center gap-1.5 font-mono">
              {scalingMode === 'fixed_px' ? (
                <>
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                  <span>The Fixed Pixel Failure:</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>The Production Scaling Solution:</span>
                </>
              )}
            </p>
            <p className="text-slate-300">
              {scalingMode === 'fixed_px'
                ? 'Hardcoding width: 330px forces views wider than compact screens (e.g. 320pt on iPhone SE/mini or Android Go devices), pushing content off-screen and breaking horizontal scroll invariants.'
                : 'Using percentage-based utilities (e.g. `wp(92)`) paired with Yoga Flexbox constraints allows cards to expand on foldables and contract gracefully on compact devices without layout overflow.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
