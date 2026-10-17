import { Module } from '../types';

export const SEED_MODULES: Module[] = [
  {
    id: 'mod-stage-1',
    stage_number: 1,
    title: 'Stage 1: Under the Hood',
    description: 'JSI, C++ HostObjects, Hermes Bytecode, and the Death of the JSON Bridge',
    icon_name: 'Cpu',
    order_index: 1,
    topics: [
      {
        id: 'topic-1-1',
        module_id: 'mod-stage-1',
        title: 'Old Bridge vs. New Architecture JSI',
        slug: 'old-bridge-vs-new-architecture-jsi',
        difficulty: 'Architect',
        read_time_minutes: 8,
        tldr_brief:
          'Why the legacy JSON bridge created asynchronous bottlenecks and how JSI (JavaScript Interface) exposes C++ HostObjects directly to the JS runtime with zero serialization.',
        is_published: true,
        created_at: '2026-03-20T10:00:00Z',
        content_blocks: [
          {
            id: 'b1-1',
            type: 'text',
            title: 'The Fatal Flaw of the Legacy Bridge',
            body: `In the legacy React Native architecture, communication between the JavaScript realm (running Hermes or V8) and Native realm (Java/Kotlin or Obj-C/Swift) relied entirely on an asynchronous, batched JSON message queue known as the Bridge.

Every touch event, native module call, and layout measurement had to undergo:
1. Serialization into a UTF-8 JSON string on the source thread.
2. Transfer across an asynchronous FIFO queue.
3. Deserialization into native objects or JS dictionaries on the receiving thread.

This introduced a non-negotiable overhead of 5ms to 25ms per roundtrip, making 60FPS/120FPS frame guarantees impossible during intense touch interactions or fast scroll gestures.`,
          },
          {
            id: 'b1-2',
            type: 'bridge_visualizer',
            title: 'Interactive Execution Comparison',
            visualizerVariant: 'bridge_comparison',
          },
          {
            id: 'b1-3',
            type: 'text',
            title: 'How JSI Transforms Execution',
            body: `JSI (JavaScript Interface) eliminates the bridge entirely. JSI is a unified C++ abstraction layer that lets the JavaScript engine directly hold references to C++ HostObjects.

When JavaScript invokes a native function via JSI:
- No JSON string is created.
- No asynchronous message queue is traversed.
- The JS thread synchronously dereferences a shared C++ memory pointer (via std::shared_ptr<HostObject>) and executes the native method in less than 0.02ms.`,
          },
          {
            id: 'b1-4',
            type: 'code_comparison',
            title: 'Legacy Bridge Call vs. JSI Synchronous Invocations',
            mistakeLanguage: 'javascript',
            mistakeCode: `// ❌ LEGACY BRIDGE (Asynchronous, JSON Serialized)
import { NativeModules } from 'react-native';

const { EncryptionModule } = NativeModules;

// Queued asynchronously across JSON bridge
// Takes 10ms - 25ms; cannot guarantee frame alignment
EncryptionModule.hashToken(payload, (error, hash) => {
  if (!error) {
    setToken(hash); // Rerenders after bridge latency!
  }
});`,
            mistakeExplanation:
              'Requires JSON serialization, traverses asynchronous FIFO bridge queue, and causes layout delays during rapid gestures.',
            solutionLanguage: 'cpp',
            solutionCode: `// ✅ NEW ARCHITECTURE: JSI Direct HostObject (Synchronous C++)
// Invoked in 0.01ms with direct memory access

class JSIEncryptionHost : public jsi::HostObject {
 public:
  jsi::Value get(jsi::Runtime& runtime, const jsi::PropNameID& name) override {
    if (name.utf8(runtime) == "hashTokenDirect") {
      return jsi::Function::createFromHostFunction(
        runtime, name, 1,
        [](jsi::Runtime& rt, const jsi::Value& thisVal, const jsi::Value* args, size_t count) {
          std::string token = args[0].getString(rt).utf8(rt);
          // Instant synchronous calculation directly in C++
          std::string result = fastCryptoHash(token);
          return jsi::String::createFromUtf8(rt, result);
        }
      );
    }
    return jsi::Value::undefined();
  }
};`,
            solutionExplanation:
              'Direct memory binding via C++ HostObjects, zero serialization, instant synchronous return value available in the same JavaScript tick.',
          },
          {
            id: 'b1-5',
            type: 'callout',
            calloutType: 'architect_tip',
            title: 'Architect Rule of Thumb',
            body:
              'While JSI allows synchronous native calls, never execute blocking CPU-heavy operations synchronously on the JS thread. Long-running native tasks should return a JSI C++ Promise to keep the JS event loop fluid.',
          },
        ],
      },
    ],
  },
  {
    id: 'mod-stage-2',
    stage_number: 2,
    title: 'Stage 2: 60FPS UI & Animations',
    description: 'Worklets, Gesture Handler 2.0, Reanimated 3, and UI Thread Offloading',
    icon_name: 'Zap',
    order_index: 2,
    topics: [
      {
        id: 'topic-2-1',
        module_id: 'mod-stage-2',
        title: 'JS Thread vs UI Thread Worklets',
        slug: 'js-thread-vs-ui-thread-worklets',
        difficulty: 'Intermediate',
        read_time_minutes: 7,
        tldr_brief:
          'How React Native Reanimated worklets bypass the JavaScript event loop by compiling small JS functions into independent C++ runtime runlets that execute directly on the 120Hz platform UI Thread.',
        is_published: true,
        created_at: '2026-03-21T10:00:00Z',
        content_blocks: [
          {
            id: 'b2-1',
            type: 'text',
            title: 'Why JavaScript Thread State Drops Frames',
            body: `The standard React state cycle (e.g. useState / useReducer) runs on the JavaScript thread. 
When a user performs a gesture (like swiping a card or scrolling a heavy list):
1. Native UI thread captures the touch event.
2. It sends the coordinates to the JS thread.
3. React re-evaluates the component tree and schedules a render pass.
4. If the JS thread is busy parsing JSON, sorting data, or doing analytics, the touch event is delayed.
5. The device drops below 60fps, causing noticeable micro-stutter and gesture disconnect.`,
          },
          {
            id: 'b2-2',
            type: 'code_comparison',
            title: 'Laggy JS Thread Handler vs. 120Hz Worklet',
            mistakeLanguage: 'typescript',
            mistakeCode: `// ❌ LAGGY: Managing gesture coordinates in React JS state
import React, { useState } from 'react';
import { PanResponder, View } from 'react-native';

export function DraggableCard() {
  const [posX, setPosX] = useState(0);

  const panResponder = PanResponder.create({
    onPanResponderMove: (_, gestureState) => {
      // ⚠️ Triggers a full React re-render across the bridge on EVERY finger pixel!
      // Drops to 24fps when JS thread has background workloads
      setPosX(gestureState.dx);
    },
  });

  return <View style={{ transform: [{ translateX: posX }] }} {...panResponder.panHandlers} />;
}`,
            mistakeExplanation:
              'Sends every finger touch coordinate across the thread boundary, triggering frequent React re-renders and bridge congestion.',
            solutionLanguage: 'typescript',
            solutionCode: `// ✅ ARCHITECT: Reanimated 3 UI Thread Worklet
import React from 'react';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

export function FluidDraggableCard() {
  const translateX = useSharedValue(0);

  // 'worklet' compiled code executes purely on UI Thread
  const panGesture = Gesture.Pan()
    .onChange((event) => {
      'worklet';
      translateX.value = event.translationX; // Instant 120Hz direct mutation!
    })
    .onEnd(() => {
      'worklet';
      translateX.value = withSpring(0);
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={[{ width: 120, height: 120 }, animatedStyle]} />
    </GestureDetector>
  );
}`,
            solutionExplanation:
              'Compiles directly into a UI-thread worklet. Updates view transformations natively at 120Hz ProMotion without ever touching or waiting for the JavaScript event loop.',
          },
          {
            id: 'b2-3',
            type: 'callout',
            calloutType: 'benchmark',
            title: 'Performance Benchmark',
            body:
              'Standard PanResponder with useState drops to 32 FPS on high-speed scroll swipes. Reanimated worklets sustain a consistent 59.8–60 FPS on Android and 120 FPS on iOS ProMotion displays.',
          },
        ],
      },
    ],
  },
  {
    id: 'mod-stage-3',
    stage_number: 3,
    title: 'Stage 3: Scalable State & Real-Time Sync',
    description: 'Socket.IO, Normalized RTK Entities, and Offline Reconnect Orchestration',
    icon_name: 'Activity',
    order_index: 3,
    topics: [
      {
        id: 'topic-3-1',
        module_id: 'mod-stage-3',
        title: 'Socket.IO & Redux Toolkit Architecture',
        slug: 'socket-io-redux-toolkit-architecture',
        difficulty: 'Intermediate',
        read_time_minutes: 9,
        tldr_brief:
          'Architecting battery-efficient WebSocket listeners in React Native, avoiding background thread memory leaks, and normalizing high-frequency state updates through RTK slice selectors.',
        is_published: true,
        created_at: '2026-03-22T10:00:00Z',
        content_blocks: [
          {
            id: 'b3-1',
            type: 'text',
            title: 'The Challenge of Mobile WebSockets',
            body: `Mobile devices behave fundamentally differently than desktop browsers:
- OS enters deep sleep / doze mode when the screen turns off.
- The app transitions between Active, Inactive, and Background states.
- Network connections silently drop when switching between 5G cell towers and Wi-Fi.

Binding raw socket listeners directly inside component \`useEffect\` hooks leads to duplicate listener proliferation, missed packets, and severe battery drain.`,
          },
          {
            id: 'b3-2',
            type: 'code_comparison',
            title: 'Component Leak vs. Singleton Middleware Manager',
            mistakeLanguage: 'typescript',
            mistakeCode: `// ❌ LEAKY: Subscribing inside component body
import React, { useEffect } from 'react';
import io from 'socket.io-client';

export function OrderLiveFeed() {
  useEffect(() => {
    const socket = io('https://api.domain.com');
    
    // ⚠️ New socket connection spawned every mount/remount!
    // Fails to close on app backgrounding, draining battery
    socket.on('price_tick', (data) => {
      console.log('Got tick', data);
    });
  }, []);

  return <div />;
}`,
            mistakeExplanation:
              'Spawns redundant WebSocket connections, fails to handle mobile AppState suspension, and leaks memory when views unmount.',
            solutionLanguage: 'typescript',
            solutionCode: `// ✅ ARCHITECT: Redux Middleware with AppState Lifecycle
import { Middleware } from '@reduxjs/toolkit';
import { AppState, AppStateStatus } from 'react-native';
import { io, Socket } from 'socket.io-client';
import { upsertOrderTick } from './ordersSlice';

let socket: Socket | null = null;

export const socketMiddleware: Middleware = (store) => {
  // Gracefully disconnect on background to conserve mobile battery
  AppState.addEventListener('change', (nextState: AppStateStatus) => {
    if (nextState === 'background' && socket?.connected) {
      socket.disconnect();
    } else if (nextState === 'active' && !socket?.connected) {
      socket?.connect();
    }
  });

  return (next) => (action) => {
    // Normalizes high-frequency incoming streaming packets
    return next(action);
  };
};`,
            solutionExplanation:
              'Centralized lifecycle-aware socket singleton that automatically disconnects on mobile backgrounding and resumes cleanly on wake.',
          },
        ],
      },
    ],
  },
  {
    id: 'mod-stage-4',
    stage_number: 4,
    title: 'Stage 4: Native Bridging & Store Mastery',
    description: 'TurboModule C++ Codegen Specs, Swift Protocols, and Android JNI',
    icon_name: 'ShieldCheck',
    order_index: 4,
    topics: [
      {
        id: 'topic-4-1',
        module_id: 'mod-stage-4',
        title: 'Java & Swift Native Modules',
        slug: 'java-swift-native-modules',
        difficulty: 'Architect',
        read_time_minutes: 11,
        tldr_brief:
          'Authoring compile-time type-safe TurboModules using Codegen: from TypeScript interface specifications to Objective-C++ protocols and Android JNI wrappers.',
        is_published: true,
        created_at: '2026-03-23T10:00:00Z',
        content_blocks: [
          {
            id: 'b4-1',
            type: 'text',
            title: 'From Reflection to Compile-Time Codegen',
            body: `In legacy React Native, creating a Native Module relied on runtime Java Reflection on Android and Objective-C runtime inspection on iOS:
- If a method argument was mistyped, the app crashed at runtime.
- Every module had to be eagerly instantiated on app startup.

In the TurboModules architecture, you declare a strict TypeScript Spec. Codegen parses the Spec at build-time and outputs C++ abstract interfaces that enforce matching signatures in Swift and Kotlin at compile time.`,
          },
          {
            id: 'b4-2',
            type: 'code_comparison',
            title: 'Legacy Reflection Module vs. TurboModule Codegen Spec',
            mistakeLanguage: 'java',
            mistakeCode: `// ❌ LEGACY ANDROID MODULE (Runtime Reflection & Eager Load)
public class LegacyBiometrics extends ReactContextBaseJavaModule {
  @ReactMethod
  public void verifyBiometrics(String prompt, Callback callback) {
    // Vulnerable to type mismatches and runtime crashes
    // Eagerly instantiated on app start even if user never touches biometrics
    callback.invoke(null, true);
  }
}`,
            mistakeExplanation:
              'Eagerly initializes native classes on app launch slowing startup by 200ms+, and lacks compile-time type safety across languages.',
            solutionLanguage: 'typescript',
            solutionCode: `// ✅ TURBOMODULE SPEC (TypeScript Spec parsed by Codegen)
import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  authenticateBiometrics(prompt: string): Promise<boolean>;
  getHardwareSecurityLevel(): number;
}

// Lazy instantiated only on first explicit call!
export default TurboModuleRegistry.getEnforcing<Spec>('NativeBiometrics');`,
            solutionExplanation:
              'Generates strict C++ abstract classes for iOS and Android. Compilers enforce exact method signatures, with lazy zero-cost startup.',
          },
        ],
      },
    ],
  },
];
