import React, { useState } from 'react';
import { Cpu, Layers, Smartphone, RefreshCw, Zap, ArrowRight, CheckCircle2 } from 'lucide-react';

export const ArchitectureDiagram: React.FC = () => {
  const [selectedPhase, setSelectedPhase] = useState<'js' | 'cpp' | 'native'>('cpp');

  const phases = {
    js: {
      title: '1. JavaScript / React Runtime (Hermes Engine)',
      subtitle: 'React 18/19 Elements, Concurrent Fiber, JSI Bindings',
      color: 'border-amber-500/50 text-amber-300',
      description:
        'Executes application business logic, component lifecycles, and state management. Instead of serializing JSON strings to a bridge queue, it accesses C++ memory directly via JSI HostObjects.',
      specs: [
        'Hermes Ahead-of-Time (AOT) bytecode compilation',
        'Direct JSI pointer referencing without string serialization',
        'Synchronous invocations into native C++ TurboModules',
        'Segregated Free-List GC & TLAB nursery allocations',
      ],
      codeSample: `// JavaScript side direct invocation into C++ JSI
const deviceSecureKey = NativeSecurity.getHardwareKey();
// Direct zero-delay memory execution (0.01ms vs 12ms legacy bridge)`,
    },
    cpp: {
      title: '2. C++ Core: Shadow Tree & Yoga Flexbox',
      subtitle: 'Immutable Shadow Nodes, Synchronous Yoga Layout, C++ Diffing',
      color: 'border-cyan-500/50 text-cyan-300',
      description:
        'Fabric maintains an immutable C++ shadow tree representing UI components. When React commits a render pass, C++ clones shadow nodes with structural sharing and calculates Yoga flexbox layout without touching the JS thread.',
      specs: [
        'Immutable std::shared_ptr<const ShadowNode> tree structure',
        'Multi-threaded Yoga layout calculation on background thread',
        'Thread-safe structural cloning preserving unchanged node references',
        'Atomic commit phase dispatching calculated diffs to UI thread',
      ],
      codeSample: `// C++ Shadow Tree clone operation
auto newShadowNode = shadowNode->clone({
  .props = parseProps(rawProps),
  .children = updatedChildrenList
});
// Yoga layout executes synchronously on shadow thread`,
    },
    native: {
      title: '3. Native Platform & Host Views (Android / iOS)',
      subtitle: 'Main UI Thread, Native Views, Gesture Recognizers & Surface Mount',
      color: 'border-emerald-500/50 text-emerald-300',
      description:
        'The host operating system renders actual platform UI components (Android View / iOS UIView). The mounting phase applies the minimal diff produced by the C++ engine directly onto native view managers at 60/120Hz.',
      specs: [
        'Direct atomic view mutations without asynchronous frame drops',
        'Platform native accessibility (TalkBack & VoiceOver) bindings',
        'Native gesture recognizer worklets running uninterrupted at 120Hz',
        'Elimination of blank whitespace scrolling lag in virtualization',
      ],
      codeSample: `// Native Platform Mounting Phase
[self.mountingManager scheduleTransaction:diffTransaction];
// Atomically applies mutations on iOS/Android main thread`,
    },
  };

  const current = phases[selectedPhase];

  return (
    <div id="architecture-map" className="border border-slate-800 bg-slate-900/40 rounded-xl p-6 sm:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-cyan-400" />
            <span>Interactive Mobile Engine Architecture</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Explore the three-tier execution pipeline: JavaScript runtime, C++ shadow tree, and native OS threads.
          </p>
        </div>

        {/* Phase selector tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-950 border border-slate-800 rounded-lg shrink-0">
          <button
            type="button"
            onClick={() => setSelectedPhase('js')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
              selectedPhase === 'js'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            JS Runtime
          </button>
          <button
            type="button"
            onClick={() => setSelectedPhase('cpp')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
              selectedPhase === 'cpp'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            C++ Engine (Fabric)
          </button>
          <button
            type="button"
            onClick={() => setSelectedPhase('native')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
              selectedPhase === 'native'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Native Platform
          </button>
        </div>
      </div>

      {/* Visual Pipeline Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div
          onClick={() => setSelectedPhase('js')}
          className={`cursor-pointer border rounded-lg p-4 transition-all ${
            selectedPhase === 'js'
              ? 'border-amber-400/60 bg-amber-950/20 ring-1 ring-amber-400/30'
              : 'border-slate-800 bg-slate-950/50 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-amber-400 font-mono mb-2">
            <span className="flex items-center gap-1.5">
              <Cpu className="w-4 h-4" />
              <span>Hermes Engine</span>
            </span>
            <span className="text-slate-500">Tier 1</span>
          </div>
          <p className="text-sm font-semibold text-slate-200">JavaScript Thread</p>
          <p className="text-xs text-slate-400 mt-1 line-clamp-2">React Fiber, State hooks & JSI direct calls</p>
        </div>

        <div
          onClick={() => setSelectedPhase('cpp')}
          className={`cursor-pointer border rounded-lg p-4 transition-all ${
            selectedPhase === 'cpp'
              ? 'border-cyan-400/60 bg-cyan-950/20 ring-1 ring-cyan-400/30'
              : 'border-slate-800 bg-slate-950/50 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-cyan-400 font-mono mb-2">
            <span className="flex items-center gap-1.5">
              <Zap className="w-4 h-4" />
              <span>Fabric Core</span>
            </span>
            <span className="text-slate-500">Tier 2</span>
          </div>
          <p className="text-sm font-semibold text-slate-200">C++ Shadow Tree & Yoga</p>
          <p className="text-xs text-slate-400 mt-1 line-clamp-2">Immutable shadow nodes & layout diffing</p>
        </div>

        <div
          onClick={() => setSelectedPhase('native')}
          className={`cursor-pointer border rounded-lg p-4 transition-all ${
            selectedPhase === 'native'
              ? 'border-emerald-400/60 bg-emerald-950/20 ring-1 ring-emerald-400/30'
              : 'border-slate-800 bg-slate-950/50 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-emerald-400 font-mono mb-2">
            <span className="flex items-center gap-1.5">
              <Smartphone className="w-4 h-4" />
              <span>Host OS</span>
            </span>
            <span className="text-slate-500">Tier 3</span>
          </div>
          <p className="text-sm font-semibold text-slate-200">Native UI Thread</p>
          <p className="text-xs text-slate-400 mt-1 line-clamp-2">Android / iOS Views & 120Hz Gesture Worklets</p>
        </div>
      </div>

      {/* Selected Tier Deep Dive Panel */}
      <div className="bg-slate-950 border border-slate-800 rounded-lg p-5 sm:p-6 space-y-4">
        <div>
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <span>{current.title}</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">{current.subtitle}</p>
        </div>

        <p className="text-sm text-slate-300 leading-relaxed">{current.description}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Architecture Invariants
            </span>
            <ul className="space-y-1.5">
              {current.specs.map((spec, i) => (
                <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                  <span>{spec}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Engine Code Pattern
            </span>
            <pre className="p-3 bg-slate-900 border border-slate-800 rounded-md text-xs font-mono text-cyan-200 overflow-x-auto">
              <code>{current.codeSample}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
