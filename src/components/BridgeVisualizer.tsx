import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap,
  Play,
  RotateCcw,
  Cpu,
  Layers,
  Smartphone,
  AlertTriangle,
  CheckCircle2,
  Activity,
  ArrowRight,
  Flame,
} from 'lucide-react';

type ArchitectureMode = 'legacy' | 'jsi';

export const BridgeVisualizer: React.FC = () => {
  const [mode, setMode] = useState<ArchitectureMode>('legacy');
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationStep, setSimulationStep] = useState<number>(0);
  const [fps, setFps] = useState<number>(60);
  const [touchCount, setTouchCount] = useState<number>(0);
  const [packetsInFlight, setPacketsInFlight] = useState<
    Array<{ id: number; timestamp: number; payload: string }>
  >([]);

  // Simulation handler
  const handleSimulateTouch = (burst = false) => {
    if (isSimulating && !burst) return;
    setIsSimulating(true);
    setTouchCount((prev) => prev + (burst ? 5 : 1));

    if (mode === 'legacy') {
      // Legacy Bridge: Simulates JSON serialization delay, queue wait, and frame drops
      setSimulationStep(1); // JS Thread serializing
      setFps(burst ? 24 : 32);

      const packetId = Date.now();
      setPacketsInFlight((prev) => [
        ...prev,
        {
          id: packetId,
          timestamp: packetId,
          payload: `{"type":"onTouchMove","x":${Math.floor(Math.random() * 300)},"y":${Math.floor(
            Math.random() * 600
          )}}`,
        },
      ]);

      setTimeout(() => {
        setSimulationStep(2); // Bridge FIFO Queue
      }, 500);

      setTimeout(() => {
        setSimulationStep(3); // Native thread parsing JSON
      }, 1000);

      setTimeout(() => {
        setSimulationStep(4); // Rendered with lag
        setIsSimulating(false);
        setFps(60);
        setPacketsInFlight([]);
      }, 1500);
    } else {
      // New Architecture (JSI): Instantaneous synchronous pointer invocation
      setSimulationStep(1);
      setFps(60);

      const packetId = Date.now();
      setPacketsInFlight((prev) => [
        ...prev,
        {
          id: packetId,
          timestamp: packetId,
          payload: `HostObject::dispatch(0x7ffd98a1, ${Math.floor(Math.random() * 300)})`,
        },
      ]);

      setTimeout(() => {
        setSimulationStep(3); // Directly on native view in 1 frame
      }, 120);

      setTimeout(() => {
        setSimulationStep(4);
        setIsSimulating(false);
        setPacketsInFlight([]);
      }, 350);
    }
  };

  const handleReset = () => {
    setIsSimulating(false);
    setSimulationStep(0);
    setFps(60);
    setPacketsInFlight([]);
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8 hover:border-emerald-500/30 transition-colors shadow-2xl relative overflow-hidden space-y-8">
      {/* Background cyber grid effect */}
      <div className="absolute inset-0 bg-[radial-gradient(#34d39915_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none opacity-40" />

      {/* Header & Mode Switcher */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#00ccff]">
            <Zap className="w-4 h-4 text-[#00ccff]" />
            <span>Interactive Execution Engine</span>
          </div>
          <h3 className="text-xl font-bold text-white tracking-tight mt-1">
            Old Bridge vs. New Architecture JSI Simulator
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Simulate a mobile touch event to visualize data serialization bottlenecks in the legacy JSON bridge vs direct C++ HostObject memory invocation in JSI.
          </p>
        </div>

        {/* Mode Toggle Tabs */}
        <div className="flex items-center p-1 bg-black/60 border border-white/10 rounded-xl shrink-0 self-start md:self-auto">
          <button
            type="button"
            onClick={() => {
              setMode('legacy');
              handleReset();
            }}
            className={`px-3 py-1.5 text-xs font-mono font-semibold rounded-lg transition-all ${
              mode === 'legacy'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Legacy Bridge (Async JSON)
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('jsi');
              handleReset();
            }}
            className={`px-3 py-1.5 text-xs font-mono font-semibold rounded-lg transition-all ${
              mode === 'jsi'
                ? 'bg-emerald-500/20 text-[#00ff88] border border-[#00ff88]/40 shadow-[0_0_15px_rgba(0,255,136,0.3)]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            New Architecture (JSI C++)
          </button>
        </div>
      </div>

      {/* Real-time Telemetry HUD */}
      <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
        <div className="p-3 bg-black/50 border border-white/5 rounded-xl">
          <span className="text-[11px] text-slate-400 block">Frame Rate</span>
          <div className="flex items-center gap-2 mt-1">
            <span
              className={`text-xl font-bold ${
                fps < 45 ? 'text-amber-400' : 'text-[#00ff88]'
              }`}
            >
              {fps} FPS
            </span>
            {fps < 45 ? (
              <span className="text-[10px] text-amber-400 flex items-center gap-0.5">
                <AlertTriangle className="w-3 h-3" />
                <span>Dropped</span>
              </span>
            ) : (
              <span className="text-[10px] text-[#00ff88] flex items-center gap-0.5">
                <CheckCircle2 className="w-3 h-3" />
                <span>Butter</span>
              </span>
            )}
          </div>
        </div>

        <div className="p-3 bg-black/50 border border-white/5 rounded-xl">
          <span className="text-[11px] text-slate-400 block">Roundtrip Latency</span>
          <div className="text-xl font-bold mt-1 text-slate-200">
            {mode === 'legacy' ? '16.7 ms' : '0.02 ms'}
          </div>
        </div>

        <div className="p-3 bg-black/50 border border-white/5 rounded-xl">
          <span className="text-[11px] text-slate-400 block">Memory Model</span>
          <div className="text-xs font-semibold mt-1 text-slate-200 truncate">
            {mode === 'legacy' ? 'JSON String UTF-8' : 'Direct C++ Pointer'}
          </div>
        </div>

        <div className="p-3 bg-black/50 border border-white/5 rounded-xl">
          <span className="text-[11px] text-slate-400 block">Queue Overhead</span>
          <div className="text-xs font-semibold mt-1 text-slate-200">
            {mode === 'legacy' ? 'Async FIFO Batched' : 'Zero (Direct Access)'}
          </div>
        </div>
      </div>

      {/* The 3-Tier Pipeline Canvas */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-4 min-h-[220px]">
        {/* Tier 1: JS Thread */}
        <div
          className={`p-4 rounded-xl border transition-all duration-300 flex flex-col justify-between ${
            simulationStep === 1
              ? 'border-amber-400 bg-amber-950/20 shadow-[0_0_20px_rgba(245,158,11,0.2)]'
              : 'border-white/10 bg-black/40'
          }`}
        >
          <div>
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
              <span className="flex items-center gap-1.5 text-amber-300 font-semibold">
                <Cpu className="w-4 h-4" />
                <span>JavaScript Thread</span>
              </span>
              <span className="text-[10px] text-slate-500">Tier 1</span>
            </div>
            <p className="text-xs text-slate-300">
              React Component event listeners and Hermes JS execution loop.
            </p>
          </div>

          <div className="mt-4 p-2.5 bg-black/70 border border-white/5 rounded-lg font-mono text-[11px]">
            {mode === 'legacy' ? (
              <span className="text-amber-200/90">
                JSON.stringify(touchEvent)
              </span>
            ) : (
              <span className="text-[#00ff88]">
                NativeBridge.onTouch(x, y)
              </span>
            )}
          </div>
        </div>

        {/* Tier 2: The Transmission Zone (Bridge vs JSI) */}
        <div
          className={`p-4 rounded-xl border transition-all duration-300 flex flex-col justify-between relative ${
            mode === 'legacy'
              ? simulationStep === 2
                ? 'border-amber-500 bg-amber-950/30'
                : 'border-dashed border-white/15 bg-black/30'
              : simulationStep === 2 || simulationStep === 3
              ? 'border-[#00ccff] bg-cyan-950/30 shadow-[0_0_25px_rgba(0,204,255,0.25)]'
              : 'border-cyan-500/30 bg-black/30'
          }`}
        >
          <div>
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
              <span
                className={`flex items-center gap-1.5 font-semibold ${
                  mode === 'legacy' ? 'text-amber-400' : 'text-[#00ccff]'
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>{mode === 'legacy' ? 'Async FIFO Bridge' : 'JSI C++ Memory Bus'}</span>
              </span>
              <span className="text-[10px] text-slate-500">Tier 2</span>
            </div>
            <p className="text-xs text-slate-300">
              {mode === 'legacy'
                ? 'Serialization queue. Causes thread contention & jank during high-velocity gestures.'
                : 'Zero-overhead shared pointers (std::shared_ptr<HostObject>).'}
            </p>
          </div>

          {/* Animated Packet Stream */}
          <div className="my-3 h-12 flex items-center justify-center relative overflow-hidden rounded bg-black/60 border border-white/5">
            <AnimatePresence>
              {isSimulating && (
                <motion.div
                  key="packet"
                  initial={{ x: -100, opacity: 0, scale: 0.8 }}
                  animate={
                    mode === 'legacy'
                      ? { x: [ -80, 0, 80 ], opacity: [ 0, 1, 0 ], scale: [ 0.8, 1, 0.8 ] }
                      : { x: [ -80, 80 ], opacity: [ 0, 1, 0 ], scale: [ 1, 1.1, 1 ] }
                  }
                  transition={{
                    duration: mode === 'legacy' ? 1.2 : 0.25,
                    ease: mode === 'legacy' ? 'easeInOut' : 'linear',
                  }}
                  className={`px-3 py-1 rounded text-[10px] font-mono font-bold flex items-center gap-1.5 shadow-lg ${
                    mode === 'legacy'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/60'
                      : 'bg-emerald-500/30 text-[#00ff88] border border-[#00ff88]'
                  }`}
                >
                  <Activity className="w-3 h-3" />
                  <span>{mode === 'legacy' ? 'ASYNC_JSON_PACKET' : 'JSI_DIRECT_PTR'}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {!isSimulating && (
              <span className="text-[11px] font-mono text-slate-600">
                Channel idle · Ready for touch input
              </span>
            )}
          </div>

          <div className="text-[10px] font-mono text-slate-400 flex items-center justify-between">
            <span>Transfer Type</span>
            <span className={mode === 'legacy' ? 'text-amber-400' : 'text-[#00ff88]'}>
              {mode === 'legacy' ? 'Batched Async' : 'Synchronous'}
            </span>
          </div>
        </div>

        {/* Tier 3: Native Platform UI Thread */}
        <div
          className={`p-4 rounded-xl border transition-all duration-300 flex flex-col justify-between ${
            simulationStep === 3 || simulationStep === 4
              ? 'border-[#00ff88] bg-emerald-950/20 shadow-[0_0_20px_rgba(0,255,136,0.2)]'
              : 'border-white/10 bg-black/40'
          }`}
        >
          <div>
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
              <span className="flex items-center gap-1.5 text-[#00ff88] font-semibold">
                <Smartphone className="w-4 h-4" />
                <span>Native Platform UI Thread</span>
              </span>
              <span className="text-[10px] text-slate-500">Tier 3</span>
            </div>
            <p className="text-xs text-slate-300">
              Android View / iOS UIView hardware drawing via Choreographer / DisplayLink.
            </p>
          </div>

          <div className="mt-4 p-2.5 bg-black/70 border border-white/5 rounded-lg font-mono text-[11px]">
            {mode === 'legacy' ? (
              <span className="text-slate-400">
                parseJSON() &gt; mutateView()
              </span>
            ) : (
              <span className="text-[#00ff88]">
                atomicCommit() &gt; hardwareRender()
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-white/10">
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => handleSimulateTouch(false)}
            disabled={isSimulating}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono font-bold tracking-wide transition-all ${
              mode === 'legacy'
                ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                : 'bg-[#00ff88] hover:bg-[#33ff9f] text-slate-950 shadow-[0_0_20px_rgba(0,255,136,0.4)]'
            } disabled:opacity-50`}
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Simulate Touch Event</span>
          </button>

          <button
            type="button"
            onClick={() => handleSimulateTouch(true)}
            disabled={isSimulating}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-mono font-medium text-slate-200 border border-white/10 bg-slate-900 hover:bg-slate-800 transition-colors disabled:opacity-50"
          >
            <Flame className="w-3.5 h-3.5 text-orange-400" />
            <span>Simulate Fast Swipe Burst (10 Events)</span>
          </button>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="text-xs font-mono text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Simulator</span>
        </button>
      </div>

      {/* Dynamic Architect Takeaway Box */}
      <div className="relative z-10 p-4 rounded-xl bg-black/60 border border-white/5 text-xs space-y-1.5">
        <span className="font-mono uppercase font-bold text-[#00ccff] tracking-wider block">
          Architect Analysis
        </span>
        {mode === 'legacy' ? (
          <p className="text-slate-300 leading-relaxed">
            In the Legacy Bridge, batching causes touch coordinates to queue behind heavy JavaScript iterations. By the time the Native UI thread deserializes the JSON string, the display frame has already ticked, causing frame drops from 60 FPS down to 24–32 FPS.
          </p>
        ) : (
          <p className="text-slate-300 leading-relaxed">
            In the New Architecture, JSI exposes the C++ HostObject directly into the Hermes JavaScript runtime. The native method is invoked in the very same CPU cycle without message queues or JSON encoding, locking the animation cleanly at 60 FPS / 120 FPS.
          </p>
        )}
      </div>
    </div>
  );
};
