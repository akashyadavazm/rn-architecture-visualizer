import { Post } from '../types';

export const INITIAL_SEED_POSTS: Post[] = [
  {
    id: 'b1e457f9-23ef-4b8c-8f92-7cb6df990101',
    title: 'Fabric Renderer: Concurrent Root, Shadow Tree Immutability & C++ Commit Pipeline',
    slug: 'fabric-renderer-shadow-tree-commit-pipeline',
    category: 'Architecture',
    excerpt: 'An architectural deep dive into how Fabric replaces the legacy UIManager with an immutable C++ shadow tree, synchronous layout calculation via Yoga, and non-blocking multi-threaded frame delivery.',
    read_time_minutes: 12,
    is_published: true,
    author_id: 'a0000000-0000-0000-0000-000000000001',
    created_at: '2026-03-28T14:20:00Z',
    author: {
      id: 'a0000000-0000-0000-0000-000000000001',
      email: 'akashyadavazm@gmail.com',
      full_name: 'Akash Yadav',
      role: 'admin',
      avatar_url: null,
      created_at: '2026-01-01T00:00:00Z',
    },
    content: `## The Core Shift: Why Fabric Exists

In React Native's legacy architecture, every UI update traversed asynchronous message queues serialized as JSON over the bridge. This caused two fatal issues for senior developers:
1. **Asynchronous Frame Drops**: Fast gestures (like dragging lists or complex gestures) lagged because the UI thread could not wait for the JS thread.
2. **Jank & Whitespace during Fast Scrolling**: Native scroll views rendered blank slices while the JavaScript bridge queued layout calculations.

Fabric fundamentally restructures the rendering pipeline into three synchronous or concurrently scheduled phases executed directly in C++:

### Phase 1: App Operations (Render Phase)
React executes render logic and creates React Element trees in JavaScript. Under Fabric, this doesn't generate JSON bridge commands. Instead:
- JavaScript calls directly into C++ via **JSI** (JavaScript Interface).
- A corresponding **C++ Shadow Node** is created or cloned.
- Shadow Nodes are **completely immutable**. Any state mutation creates a new revision of the Shadow Node branch, preserving structural sharing.

\`\`\`cpp
// Conceptual C++ ShadowNode clone operation
std::shared_ptr<const ShadowNode> ShadowNode::clone(
    const PropsParserContext& context,
    const ShadowNodeFragment& fragment) const {
  return std::make_shared<ConcreteShadowNode>(*this, fragment);
}
\`\`\`

### Phase 2: Commit Phase (C++ Thread / Shadow Queue)
Once the new immutable shadow tree root is constructed:
- The tree is committed to the **Shadow Tree**.
- Yoga layout engine processes flexbox calculations **synchronously** in C++.
- Layout metrics (x, y, width, height, margins, padding) are calculated without waking the JavaScript thread.

### Phase 3: Mount Phase (Main / UI Thread)
- C++ calculates the structural diff between the previous Shadow Tree and the new Shadow Tree.
- Only the diff instructions (e.g. \`create\`, \`delete\`, \`update\`, \`insert\`) are dispatched to the native platform view manager.
- Native views (Android \`View\` / iOS \`UIView\`) are updated atomically on the UI thread.

### Senior Architecture Takeaway
Because shadow nodes are immutable and thread-safe via \`std::shared_ptr\`, React Native can perform speculative rendering and prioritize high-priority user touch events over low-priority background fetches, mirroring React 18+ concurrent scheduling on native threads.`
  },
  {
    id: 'c2e457f9-23ef-4b8c-8f92-7cb6df990102',
    title: 'JSI Memory Model: Shared Pointers, HostObjects, and Zero-Serialization Calls',
    slug: 'jsi-memory-model-hostobjects-zero-serialization',
    category: 'C++ / JSI',
    excerpt: 'Deconstructing the JavaScript Interface (JSI): how HostObjects bind native C++ methods directly to V8/Hermes runtimes without JSON encoding or bridge queuing.',
    read_time_minutes: 10,
    is_published: true,
    author_id: 'a0000000-0000-0000-0000-000000000001',
    created_at: '2026-03-24T09:15:00Z',
    author: {
      id: 'a0000000-0000-0000-0000-000000000001',
      email: 'akashyadavazm@gmail.com',
      full_name: 'Akash Yadav',
      role: 'admin',
      avatar_url: null,
      created_at: '2026-01-01T00:00:00Z',
    },
    content: `## The End of the JSON Bridge

Before JSI, communicating between JavaScript and Java/Obj-C required:
1. JavaScript serializing parameters into a JSON string.
2. Passing the string across the bridge via message queue.
3. Native side parsing the JSON string into native dictionaries.
4. Executing the method and serializing the return payload back across.

This overhead introduced a minimum penalty of **5ms to 20ms** per heavy operation and made synchronous native calls impossible.

### Enter JSI: Direct Engine Abstraction

\`jsi::Runtime\` is an engine-agnostic C++ abstraction layer developed by Meta. It allows C++ to interact directly with Hermes, JavaScriptCore, or V8 without knowing the engine's internal C API.

\`\`\`cpp
#include <jsi/jsi.h>

using namespace facebook::jsi;

class NativeCalculator : public HostObject {
 public:
  Value get(Runtime& runtime, const PropNameID& name) override {
    auto propName = name.utf8(runtime);
    
    if (propName == "computeFastHash") {
      return Function::createFromHostFunction(
          runtime,
          name,
          1,
          [](Runtime& rt, const Value& thisVal, const Value* args, size_t count) -> Value {
            if (count < 1 || !args[0].isString()) {
              throw JSError(rt, "Expected string argument");
            }
            std::string input = args[0].getString(rt).utf8(rt);
            // Instant synchronous C++ execution
            int64_t hashVal = std::hash<std::string>{}(input);
            return Value(static_cast<double>(hashVal));
          });
    }
    return Value::undefined();
  }
};
\`\`\`

### HostObjects and Lifetime Ownership
A \`HostObject\` lives in C++ heap memory. JavaScript holds a reference via a lightweight wrapper object.
- **Reference Counting**: Managed by \`std::shared_ptr<HostObject>\`.
- When JavaScript garbage-collects the wrapper, the reference counter decrements.
- If zero references remain, the C++ object destructor triggers automatically.

### Architectural Rules for Senior Engineers
- **Avoid Long Synchronous Tasks on JS Thread**: Because JSI calls can be synchronous, executing long CPU-bound routines directly in a JSI host function will freeze the JS event loop. Use worker threads or asynchronous C++ promises for heavy computations.`
  },
  {
    id: 'd3e457f9-23ef-4b8c-8f92-7cb6df990103',
    title: 'TurboModules Architecture: Codegen Specs, Hybrid C++ Objects & Lazy Loading',
    slug: 'turbomodules-codegen-specs-hybrid-objects',
    category: 'TurboModules',
    excerpt: 'How Codegen bridges TypeScript static typings into C++ abstract classes and Objective-C++ / JNI bindings, providing compile-time type safety and instant startup times.',
    read_time_minutes: 14,
    is_published: true,
    author_id: 'a0000000-0000-0000-0000-000000000001',
    created_at: '2026-03-18T11:45:00Z',
    author: {
      id: 'a0000000-0000-0000-0000-000000000001',
      email: 'akashyadavazm@gmail.com',
      full_name: 'Akash Yadav',
      role: 'admin',
      avatar_url: null,
      created_at: '2026-01-01T00:00:00Z',
    },
    content: `## The Problem with Legacy Native Modules

In traditional React Native:
- **Eager Initialization**: Every registered native module was instantiated during application startup, whether the user ever navigated to that screen or not.
- **Runtime Typo Vulnerabilities**: Calling a native method with incorrect parameter counts or mismatched types caused native crashes at runtime.

TurboModules solve this through **Lazy Instantiation** and **Codegen Compile-Time Typing**.

### 1. Codegen Specification File

You author a strict TypeScript or Flow specification file that defines the interface:

\`\`\`typescript
// NativeDeviceSecurity.ts
import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  getBiometricLevel(): Promise<number>;
  isHardwareKeySupported(): boolean;
  encryptPayload(payload: string, keyAlias: string): Promise<string>;
}

export default TurboModuleRegistry.getEnforcing<Spec>('NativeDeviceSecurity');
\`\`\`

### 2. Codegen Generation Pipeline

During build time (\`npx react-native codegen\`):
1. Parser scans \`Spec\` interfaces.
2. Emits C++ boilerplate:
   - \`NativeDeviceSecuritySpec.h\`
   - \`NativeDeviceSecuritySpecJNI.cpp\` (Android JNI glue)
   - \`NativeDeviceSecuritySpecObjC.h\` (iOS Obj-C++ protocol)

### 3. Native Implementation Contract

On iOS / Android, the compiler forces your class to implement the exact signature. Any missing method or type mismatch fails at compile time, eliminating an entire category of production crashes.

\`\`\`objc
// iOS TurboModule Implementation
#import "NativeDeviceSecuritySpec.h"

@interface NativeDeviceSecurity : NSObject <NativeDeviceSecuritySpec>
@end

@implementation NativeDeviceSecurity
RCT_EXPORT_MODULE()

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params {
  return std::make_shared<facebook::react::NativeDeviceSecuritySpecJSI>(params);
}

- (NSNumber *)isHardwareKeySupported {
  return @(YES);
}
@end
\`\`\`

### Startup Performance Impact
Because modules are registered in a lazy module provider lookup table, a TurboModule's C++ and native platform objects are only initialized the exact instant \`TurboModuleRegistry.get()\` is executed in JavaScript.`
  },
  {
    id: 'e4e457f9-23ef-4b8c-8f92-7cb6df990104',
    title: 'Hermes Garbage Collection Deep Dive: Segregated Allocator, TLABs & Card Marking',
    slug: 'hermes-gc-segregated-allocator-tlabs',
    category: 'Memory & Hermes',
    excerpt: 'Analyzing Hermes bytecode execution, generational GC design, thread-local allocation buffers (TLABs), and strategies for minimizing GC pauses in 120Hz React Native apps.',
    read_time_minutes: 15,
    is_published: true,
    author_id: 'a0000000-0000-0000-0000-000000000001',
    created_at: '2026-03-12T16:00:00Z',
    author: {
      id: 'a0000000-0000-0000-0000-000000000001',
      email: 'akashyadavazm@gmail.com',
      full_name: 'Akash Yadav',
      role: 'admin',
      avatar_url: null,
      created_at: '2026-01-01T00:00:00Z',
    },
    content: `## Why Hermes Outperforms Generic V8 on Mobile

V8 is engineered for desktop browsers with gigabytes of RAM and powerful multi-core desktop CPUs. On budget and mid-tier Android devices, V8 introduces:
- Heavy JIT compiler memory footprint
- JIT compilation warmup pauses
- Higher overall RAM consumption, triggering Android Low Memory Killer (LMK)

Hermes is a lightweight JavaScript engine built specifically for React Native with **Ahead-Of-Time (AOT) bytecode compilation**.

### Memory Architecture of Hermes GC

Hermes uses a generational, copying garbage collector designed for predictable mobile latency:

1. **Young Generation (Nursery)**:
   - Newly allocated objects are placed here.
   - Most objects in React (props objects, ephemeral state slices) die young.
   - Minor collections scan only this generation, executing in under **1–2 milliseconds**.

2. **Old Generation**:
   - Objects surviving multiple minor GC cycles are promoted to the Old Generation.
   - Managed with a segregated free-list allocator divided into size buckets to prevent memory fragmentation.

3. **Card Marking for Inter-Generational References**:
   - When an old object writes a reference to a young object, Hermes sets a bit on a "Card Table".
   - The minor GC only needs to scan marked cards rather than traversing the entire multi-megabyte old heap.

### Diagnostic Profiling Commands

Senior teams monitor Hermes heap snapshots directly via Chrome DevTools protocol:

\`\`\`bash
# Pull Hermes CPU and Memory Trace from connected device
adb reverse tcp:8097 tcp:8097
# Inspect heap sizes and allocation frequency
\`\`\`

### Practical Hermes Optimization Rules
- **Avoid Object Thrashing in Fast Iterations**: Avoid recreating nested callbacks or object literals inside FlatList \`renderItem\` or fast animation callbacks.
- **Precompiled Bytecode (.hbc)**: Ensure production release builds always bundle precompiled \`index.android.bundle.hbc\` so parsing occurs at build time, not device launch.`
  },
  {
    id: 'f5e457f9-23ef-4b8c-8f92-7cb6df990105',
    title: 'The Three-Tier Threading Model: UI Thread, Shadow Queue, and JS Runtime Interactions',
    slug: 'three-tier-threading-model-react-native',
    category: 'Threading',
    excerpt: 'Detailed operational breakdown of how React Native orchestrates the Main/UI thread, background Layout calculation queue, and the JavaScript runtime loop without deadlocks.',
    read_time_minutes: 11,
    is_published: true,
    author_id: 'a0000000-0000-0000-0000-000000000001',
    created_at: '2026-03-05T08:30:00Z',
    author: {
      id: 'a0000000-0000-0000-0000-000000000001',
      email: 'akashyadavazm@gmail.com',
      full_name: 'Akash Yadav',
      role: 'admin',
      avatar_url: null,
      created_at: '2026-01-01T00:00:00Z',
    },
    content: `## Concurrency & Thread Boundaries in React Native

A senior React Native engineer must maintain a mental model of the three foundational execution environments:

### 1. Main / UI Thread (Native Platform)
- Responsible for native OS view hierarchy layout passes, touch event dispatching, and hardware rendering (CoreAnimation / Android RenderNode).
- **Golden Rule**: Never block this thread for longer than **16.6ms** (60fps) or **8.33ms** (120fps ProMotion).

### 2. JavaScript Engine Thread
- Executes your business logic, React component lifecycle, Redux/Zustand reducers, and network callbacks.
- Single-threaded event loop driven by microtasks and macrotasks.

### 3. Shadow Queue / C++ Background Thread
- Offloads heavy layout math (Yoga flexbox traversal, text measurement, text layout via CoreText / HarfBuzz).
- Calculates structural diffs between shadow trees before presenting instructions to the UI thread.

### Thread Synchronization Patterns

How does touch interaction flow through this model?

\`\`\`
[User Touch on Screen]
       │
       ▼
(1) UI Thread (Captures MotionEvent / UIEvent)
       │
       ├──────────────────────────────────────────┐
       ▼ (Direct Synchronous Path)                ▼ (Async Dispatch)
Reanimated / Gesture Handler             JSI Event Dispatch
(Executes worklet on UI Thread)          (Queues to JS Event Loop)
       │                                          │
       ▼                                          ▼
Instant 120Hz Animation Frame            React State Update
\`\`\`

By leveraging the dual-path model, senior architectures delegate touch response and frame-critical animations to the UI thread (via Reanimated worklets) while routing complex state transitions to the asynchronous JS loop.`
  }
];
