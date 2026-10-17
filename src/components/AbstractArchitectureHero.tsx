import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, Zap, Activity, ShieldCheck, Terminal, Layers, ArrowRight, Check } from 'lucide-react';

export const AbstractArchitectureHero: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'jsi' | 'worklet' | 'shadow'>('jsi');

  const tabs = {
    jsi: {
      fileName: 'NativeSecurityHost.cpp',
      tag: 'JSI C++ Direct Memory',
      latency: '0.01ms',
      status: 'SYNCHRONOUS',
      code: `// C++ JSI HostObject Direct Pointer Binding
class SecurityModule : public jsi::HostObject {
public:
  jsi::Value get(jsi::Runtime& rt, const jsi::PropNameID& name) override {
    if (name.utf8(rt) == "verifyBiometrics") {
      return jsi::Function::createFromHostFunction(
        rt, name, 0,
        [](jsi::Runtime& rt, const jsi::Value& thisVal,
           const jsi::Value* args, size_t count) {
          // Zero JSON overhead: instant memory execution
          return jsi::Value(true);
        });
    }
    return jsi::Value::undefined();
  }
};`,
    },
    worklet: {
      fileName: 'GestureWorklet.ts',
      tag: 'UI Thread 120Hz',
      latency: '8.33ms / 120FPS',
      status: 'OFF-JS-THREAD',
      code: `// Reanimated 3 UI Thread Worklet
const panGesture = Gesture.Pan()
  .onChange((event) => {
    'worklet';
    // Bypasses JS event loop entirely
    translateX.value = event.translationX;
  })
  .onEnd(() => {
    'worklet';
    translateX.value = withSpring(0, { damping: 15 });
  });`,
    },
    shadow: {
      fileName: 'ShadowNodeCommit.cpp',
      tag: 'Fabric Immutability',
      latency: 'Concurrent C++',
      status: 'DIFFING',
      code: `// C++ Shadow Tree Structural Cloning
auto newShadowNode = shadowNode->clone({
  .props = parseProps(rawProps),
  .children = updatedChildren
});

// Yoga flexbox layout calculated in background C++
yogaNode->calculateLayout(width, height);`,
    },
  };

  const current = tabs[activeTab];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="relative w-full"
    >
      {/* Background Neon Halo */}
      <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 via-cyan-500/20 to-emerald-500/10 rounded-3xl blur-2xl opacity-75 pointer-events-none" />

      {/* Floating Glassmorphic Code Window */}
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
        className="relative bg-[#0a0a0a]/90 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.8)] overflow-hidden"
      >
        {/* Window Chrome / Title Bar */}
        <div className="px-5 py-3.5 bg-black/70 border-b border-white/10 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block border border-red-400/30" />
            <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block border border-amber-400/30" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block border border-emerald-400/30" />
            <span className="ml-2 text-xs font-mono text-slate-400 flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-emerald-400" />
              <span>{current.fileName}</span>
            </span>
          </div>

          <div className="flex items-center gap-2 font-mono text-[11px]">
            <span className="px-2 py-0.5 rounded-full bg-emerald-950/70 text-emerald-400 border border-emerald-800/60 font-semibold shadow-[0_0_10px_rgba(52,211,153,0.2)]">
              {current.status}
            </span>
          </div>
        </div>

        {/* Interactive Tabs */}
        <div className="flex items-center border-b border-white/10 bg-black/40 px-3 overflow-x-auto scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveTab('jsi')}
            className={`px-3.5 py-2 text-xs font-mono font-medium transition-colors border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'jsi'
                ? 'border-emerald-400 text-emerald-400 font-bold bg-white/5'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>JSI HostObjects</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('worklet')}
            className={`px-3.5 py-2 text-xs font-mono font-medium transition-colors border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'worklet'
                ? 'border-cyan-400 text-cyan-400 font-bold bg-white/5'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>120Hz Worklets</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('shadow')}
            className={`px-3.5 py-2 text-xs font-mono font-medium transition-colors border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'shadow'
                ? 'border-purple-400 text-purple-400 font-bold bg-white/5'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Fabric Shadow Tree</span>
          </button>
        </div>

        {/* Code Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="p-5 font-mono text-xs leading-relaxed overflow-x-auto max-h-[290px] scrollbar-thin"
          >
            <pre className="text-emerald-300/90 selection:bg-emerald-500/30">
              <code>{current.code}</code>
            </pre>
          </motion.div>
        </AnimatePresence>

        {/* Floating Metrics HUD Strip */}
        <div className="px-5 py-3.5 bg-black/80 border-t border-white/10 flex items-center justify-between font-mono text-[11px] text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
            <span>Latency: <strong className="text-white">{current.latency}</strong></span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-slate-500 hidden sm:inline">Zero JSON Serialization</span>
            <span className="text-cyan-400 font-semibold flex items-center gap-1">
              <Check className="w-3 h-3 text-emerald-400" />
              <span>Direct C++ Pointer</span>
            </span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
