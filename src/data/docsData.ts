export interface DocSection {
  id: string;
  heading: string;
  body: string[];
  codeSnippet?: {
    language: string;
    filename?: string;
    code: string;
    copyableText?: string;
    runnableCommand?: string;
  };
  callout?: {
    type: 'note' | 'warning' | 'architect';
    title: string;
    text: string;
  };
}

export interface DocArticle {
  id: string;
  slug: string;
  categoryId: string;
  categoryTitle: string;
  title: string;
  subtitle: string;
  versionBadge: string;
  readTime: string;
  toc: { id: string; label: string }[];
  interactiveComponent?: 'cli_doctor_matrix';
  sections: DocSection[];
}

export interface DocCategory {
  id: string;
  title: string;
  description: string;
  iconName: string;
  articles: DocArticle[];
}

export const DOCS_CATEGORIES: DocCategory[] = [
  {
    id: 'getting-started',
    title: '1. Getting Started & CLI Setup',
    description: 'Toolchain bootstrapping, OS matrix, environment variables, and Doctor diagnostics.',
    iconName: 'Terminal',
    articles: [
      {
        id: 'environment-setup-cli',
        slug: 'environment-setup-cli',
        categoryId: 'getting-started',
        categoryTitle: 'Getting Started & CLI Setup',
        title: 'Environment Setup & OS Toolchain Matrix',
        subtitle: 'Production setup for Bare React Native CLI vs Expo on macOS, Linux, and Windows.',
        versionBadge: 'RN 0.76+ New Arch Default',
        readTime: '6 min read',
        interactiveComponent: 'cli_doctor_matrix',
        toc: [
          { id: 'interactive-doctor', label: 'Interactive Environment Matrix' },
          { id: 'cli-vs-expo', label: 'Bare CLI vs Expo Prebuild' },
          { id: 'java-jdk-env', label: 'JDK 17 & ANDROID_HOME Vars' },
          { id: 'init-command', label: 'Creating a New Architecture Project' },
        ],
        sections: [
          {
            id: 'interactive-doctor',
            heading: 'Interactive Toolchain Matrix & Doctor Diagnostic',
            body: [
              'React Native 0.76+ ships with the New Architecture (Fabric + TurboModules + Bridgeless Mode) enabled by default. Setting up your host system requires synchronized Node, JDK, and platform SDK toolchains.',
              'Use the interactive matrix below to select your host OS and target platform to instantly reveal the exact Terminal setup scripts, paths, and automated diagnostic checks.',
            ],
          },
          {
            id: 'cli-vs-expo',
            heading: 'Bare React Native CLI vs Expo Prebuild',
            body: [
              'Modern mobile architecture gives you two main pipelines: Bare React Native CLI (`@react-native-community/cli`) and Expo with Continuous Native Generation (`expo prebuild`).',
              'For heavy custom C++ libraries, bespoke JSI bindings, or proprietary enterprise hardware SDKs, Bare CLI gives you direct access to `ios/` and `android/` directories without build hooks.',
            ],
            codeSnippet: {
              language: 'bash',
              filename: 'Terminal',
              code: `# Install Community CLI and bootstrap latest React Native project
npx @react-native-community/cli@latest init VisionMobileApp --version 0.76.5

# For Expo Prebuild workflow (Config Plugins generation):
npx create-expo-app@latest VisionMobileApp --template default
cd VisionMobileApp && npx expo run:ios`,
              copyableText: 'npx @react-native-community/cli@latest init VisionMobileApp --version 0.76.5',
            },
          },
          {
            id: 'java-jdk-env',
            heading: 'JDK 17 & Android SDK Path Conventions',
            body: [
              'React Native requires OpenJDK 17 (Microsoft OpenJDK or Azul Zulu). Older JDK 8 or 11 releases will fail during Gradle 8.x configuration. Always verify your environment exports in your shell configuration (`~/.zshrc` or `~/.bashrc`).',
            ],
            codeSnippet: {
              language: 'bash',
              filename: '~/.zshrc',
              code: `# Android SDK Platform Tools & NDK paths
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
export PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin

# Zulu OpenJDK 17 Path
export JAVA_HOME=/Library/Java/JavaVirtualMachines/zulu-17.jdk/Contents/Home
export PATH=$JAVA_HOME/bin:$PATH`,
              copyableText: 'export ANDROID_HOME=$HOME/Library/Android/sdk\nexport JAVA_HOME=/Library/Java/JavaVirtualMachines/zulu-17.jdk/Contents/Home',
            },
            callout: {
              type: 'architect',
              title: 'Architect Tip: NDK Version Pinning',
              text: 'Ensure Android NDK `26.1.10909125` is installed via Android Studio SDK Manager. React Native C++ builds rely on Clang toolchains pinned to specific NDK revisions to prevent symbol resolution discrepancies across Hermes and JNI.',
            },
          },
          {
            id: 'init-command',
            heading: 'Verifying New Architecture in Project Template',
            body: [
              'In React Native 0.76+, the `newArchEnabled` flag is `true` by default in both `android/gradle.properties` and `ios/Podfile.properties.json`. Check `RCTAppDelegate` or `ReactNativeHost` to confirm Bridgeless mode is active.',
            ],
            codeSnippet: {
              language: 'bash',
              filename: 'Terminal Verification',
              code: `# Verify active Android architecture flag
grep "newArchEnabled" android/gradle.properties
# Output: newArchEnabled=true

# Launch Metro bundler with clean cache
npx react-native start --reset-cache`,
            },
          },
        ],
      },
      {
        id: 'doctor-cli-diagnostics',
        slug: 'doctor-cli-diagnostics',
        categoryId: 'getting-started',
        categoryTitle: 'Getting Started & CLI Setup',
        title: 'Doctor CLI & Native Troubleshooting',
        subtitle: 'Automated environment validation, Cocoapods resolution, and Android emulator fixes.',
        versionBadge: 'CLI Built-in',
        readTime: '5 min read',
        toc: [
          { id: 'doctor-command', label: 'Running react-native doctor' },
          { id: 'common-errors', label: 'Resolving Top 4 Toolchain Failures' },
          { id: 'metro-ports', label: 'Metro 8081 Port Conflicts' },
        ],
        sections: [
          {
            id: 'doctor-command',
            heading: 'Running react-native doctor',
            body: [
              'The React Native CLI includes a built-in doctor command that automatically checks Node.js, Watchman, Android SDK, environment variables, JDK, CocoaPods, and Xcode Command Line Tools. It can even automatically fix common issues.',
            ],
            codeSnippet: {
              language: 'bash',
              filename: 'Terminal',
              code: `# Run interactive doctor check with auto-fix prompts
npx react-native doctor

# Fix Cocoapods dependency locks:
cd ios && bundle exec pod install --repo-update`,
              runnableCommand: 'npx react-native doctor',
            },
          },
          {
            id: 'common-errors',
            heading: 'Resolving Top 4 Toolchain Failures',
            body: [
              '1. **SDK Licenses not accepted**: Run `$ANDROID_HOME/cmdline-tools/latest/bin/sdkmanager --licenses` and press `y` to accept all platform licenses.',
              '2. **Watchman ENOSPC limits on Linux**: Increase inotify limit via `echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.d/99-watchman.conf && sudo sysctl -p`.',
              '3. **CocoaPods CDN Timeout**: If `pod install` hangs on trunk CDN, use Git repo: `pod repo remove trunk && pod install`.',
              '4. **Unsupported class file major version 65**: You are running Java 21 instead of JDK 17 with Gradle 8. Set `JAVA_HOME` to JDK 17.',
            ],
          },
          {
            id: 'metro-ports',
            heading: 'Metro Port 8081 Conflicts & ADB Reverse',
            body: [
              'If port 8081 is claimed by McAfee, Docker, or another background daemon, Metro will fail to serve your JS bundle. Always use adb reverse for USB physical devices:',
            ],
            codeSnippet: {
              language: 'bash',
              filename: 'Terminal Fix',
              code: `# Forward device port to development host over ADB
adb reverse tcp:8081 tcp:8081

# Or run Metro on custom port
npx react-native start --port 8088
# In Android: adb reverse tcp:8088 tcp:8088`,
            },
          },
        ],
      },
    ],
  },
  {
    id: 'core-components',
    title: '2. Core Components & Yoga Layout',
    description: 'Deep dive into View, Text, VirtualizedList recycling, and Yoga sub-pixel layout math.',
    iconName: 'Layers',
    articles: [
      {
        id: 'view-text-image-internals',
        slug: 'view-text-image-internals',
        categoryId: 'core-components',
        categoryTitle: 'Core Components & Yoga Layout',
        title: 'View, Text & Image Native Shadow Nodes',
        subtitle: 'How React virtual elements map into C++ Yoga nodes and platform native views.',
        versionBadge: 'Fabric Architecture',
        readTime: '7 min read',
        toc: [
          { id: 'view-mapping', label: 'View -> ViewShadowNode Mapping' },
          { id: 'text-inline-nodes', label: 'Text & TextLayoutManager Caching' },
          { id: 'image-memory-cache', label: 'Image Loading & Memory Footprint' },
        ],
        sections: [
          {
            id: 'view-mapping',
            heading: 'View to ViewShadowNode Translation',
            body: [
              'In the Fabric Renderer, a `<View>` JSX element does not directly create a `UIView` or `android.view.ViewGroup` during render. Instead, it instantiates an immutable `ViewShadowNode` in C++.',
              'The Yoga layout engine computes dimensions (width, height, flex, margins) on background threads. Only when the commit diff detects structural changes does the Mount layer allocate native hardware views.',
            ],
            codeSnippet: {
              language: 'tsx',
              filename: 'OptimizedView.tsx',
              code: `import React, { memo } from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';

// Setting collapsable={true} (default on Android) lets the native layout
// engine flatten nested intermediate layout containers into a single canvas
export const LayoutContainer: React.FC<ViewProps> = memo(({ children, style, ...rest }) => (
  <View collapsable={true} style={[styles.container, style]} {...rest}>
    {children}
  </View>
));

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
});`,
            },
          },
          {
            id: 'text-inline-nodes',
            heading: 'Text & TextLayoutManager Caching',
            body: [
              'Unlike web browsers where text inherits CSS freely, React Native `<Text>` requires intrinsic text measurement calculated via `TextLayoutManager` in C++. Nested `<Text>` elements form a unified native `NSAttributedString` or `SpannableString` rather than nested native views.',
            ],
            callout: {
              type: 'warning',
              title: 'Zero Unwrapped Text Rule',
              text: 'Never place raw strings directly inside `<View>`. Android crashes with an `IllegalStateException` or `Unexpected text node` error because ViewGroup cannot host text runs without a TextView peer.',
            },
          },
        ],
      },
      {
        id: 'flatlist-vs-flashlist',
        slug: 'flatlist-vs-flashlist',
        categoryId: 'core-components',
        categoryTitle: 'Core Components & Yoga Layout',
        title: 'FlatList vs FlashList: Cell Recycling Mechanics',
        subtitle: 'Eliminating blank scroll areas and bridging the gap between JS Windowing and Native Recycling.',
        versionBadge: 'Performance Guide',
        readTime: '8 min read',
        toc: [
          { id: 'virtualized-recycling', label: 'FlatList Virtualization Limits' },
          { id: 'flashlist-recycling', label: 'Shopify FlashList Cell Recycling' },
          { id: 'key-extractor-pitfall', label: 'getItemLayout & keyExtractor Pitfalls' },
        ],
        sections: [
          {
            id: 'virtualized-recycling',
            heading: 'FlatList Virtualization vs True Native Recycling',
            body: [
              'React Native\'s default `<FlatList>` does not recycle native views. It unmounts offscreen React component trees and frees them via JS garbage collection, then mounts new ones when scrolling into view.',
              'Fast scrolling on lower-end Android devices exhausts JS thread allocation speed, resulting in the dreaded "white blank cards" while the user waits for mount batches.',
            ],
          },
          {
            id: 'flashlist-recycling',
            heading: 'Shopify FlashList: True View Recycling in React Native',
            body: [
              '`@shopify/flash-list` replaces unmount/remount cycles with cell recycling: the native views stay attached to the view hierarchy and are simply rebound with new props via `estimatedItemSize`.',
            ],
            codeSnippet: {
              language: 'tsx',
              filename: 'RecycledFeed.tsx',
              code: `import React, { useCallback } from 'react';
import { FlashList } from '@shopify/flash-list';
import { View, Text, StyleSheet } from 'react-native';

interface FeedItem {
  id: string;
  title: string;
  timestamp: number;
}

export const RecycledFeed: React.FC<{ data: FeedItem[] }> = ({ data }) => {
  const renderItem = useCallback(({ item }: { item: FeedItem }) => (
    <View style={styles.card}>
      <Text style={styles.title}>{item.title}</Text>
    </View>
  ), []);

  return (
    <FlashList
      data={data}
      renderItem={renderItem}
      estimatedItemSize={72} // Crucial for instant layout sizing
      keyExtractor={(item) => item.id}
    />
  );
};

const styles = StyleSheet.create({
  card: { height: 72, padding: 16, borderBottomWidth: 1, borderBottomColor: '#222' },
  title: { color: '#fff', fontSize: 16, fontWeight: '600' },
});`,
            },
          },
        ],
      },
      {
        id: 'yoga-flexbox-cheatsheet',
        slug: 'yoga-flexbox-cheatsheet',
        categoryId: 'core-components',
        categoryTitle: 'Core Components & Yoga Layout',
        title: 'Yoga 3.0 Flexbox Calculations & Sub-pixel Layout Jitter',
        subtitle: 'Mastering flex directions, aspectRatio, and pixel-density rounding on HDPI displays.',
        versionBadge: 'Yoga 3.0 Engine',
        readTime: '6 min read',
        toc: [
          { id: 'yoga-defaults', label: 'Yoga vs CSS Default Inversions' },
          { id: 'subpixel-jitter', label: 'PixelRatio.roundToNearestPixel()' },
          { id: 'aspect-ratio', label: 'aspectRatio in Dynamic Grids' },
        ],
        sections: [
          {
            id: 'yoga-defaults',
            heading: 'Yoga Defaults vs W3C CSS Defaults',
            body: [
              'React Native uses Yoga, an open-source C++ implementation of Flexbox. Note key differences from web CSS:',
              '1. `flexDirection` defaults to `column` (not `row`).',
              '2. `flexShrink` defaults to `0` (not `1`). Items will not shrink automatically unless specified.',
              '3. `position` defaults to `relative`.',
              '4. Dimensions are unitless and represent logical pixels (density-independent pixels, dp / pt).',
            ],
          },
          {
            id: 'subpixel-jitter',
            heading: 'Eliminating Sub-pixel Hairline Jitter',
            body: [
              'When dividing screen widths (e.g. 3 columns on a 412dp screen = 137.333dp), the native GPU canvas must round to physical pixels. If unrounded, adjacent borders will flicker or render 1px gaps during scroll.',
            ],
            codeSnippet: {
              language: 'ts',
              filename: 'pixelMath.ts',
              code: `import { PixelRatio } from 'react-native';

// Round exact fractional calculations to physical hardware screen pixels
export function snapToPhysicalPixel(dpValue: number): number {
  return PixelRatio.roundToNearestPixel(dpValue);
}

// 1 physical pixel hairline thickness
export const HAIRLINE = StyleSheet.hairlineWidth;`,
            },
          },
        ],
      },
    ],
  },
  {
    id: 'architecture-runtime',
    title: '3. Architecture & Runtime Internals',
    description: 'Fabric render pipeline, Turbomodules, JSI C++ HostObjects, and Hermes engine internals.',
    iconName: 'Cpu',
    articles: [
      {
        id: 'fabric-render-pipeline',
        slug: 'fabric-render-pipeline',
        categoryId: 'architecture-runtime',
        categoryTitle: 'Architecture & Runtime Internals',
        title: 'Fabric Render Pipeline: Render, Commit & Mount',
        subtitle: 'The 3-phase immutable C++ shadow tree commit cycle and concurrent React 19 scheduling.',
        versionBadge: 'Deep Internals',
        readTime: '9 min read',
        toc: [
          { id: 'render-phase', label: 'Phase 1: Render (JS Thread)' },
          { id: 'commit-phase', label: 'Phase 2: Commit & Diff (C++ Thread)' },
          { id: 'mount-phase', label: 'Phase 3: Mount (UI Thread)' },
          { id: 'bridgeless-mode', label: 'Bridgeless Architecture in RN 0.76' },
        ],
        sections: [
          {
            id: 'render-phase',
            heading: 'Phase 1: Render Phase on the JavaScript Thread',
            body: [
              'React executes user JSX code and builds the React Element tree. In Fabric, React Native invokes C++ JSI bindings directly to instantiate C++ Shadow Nodes for each element. This happens concurrently without blocking native UI scrolling.',
            ],
          },
          {
            id: 'commit-phase',
            heading: 'Phase 2: Commit, Yoga Layout & Tree Diffing',
            body: [
              'Once the React tree render completes, React commits the new shadow tree to C++. The Yoga layout engine calculates dimensions, flex alignments, and positions on background threads.',
              'Fabric performs an immutable tree diff between the previous shadow tree and the new shadow tree, producing a lightweight array of UI mutations (Create, Delete, Insert, Update).',
            ],
            codeSnippet: {
              language: 'cpp',
              filename: 'ShadowTree.cpp (Conceptual C++ Pipeline)',
              code: `// C++ ShadowTree commit sequence
UnsharedShadowNode ShadowTree::commit(
  const ShadowTreeCommitTransaction& transaction
) const {
  // 1. Calculate Yoga Layout asynchronously
  layoutTree();

  // 2. Diff current shadow tree against next shadow tree
  auto mutations = calculateMutations(currentRevision_, nextRevision_);

  // 3. Dispatch mutation batch to platform mount layer
  mountingCoordinator_->scheduleAndPerformMount(mutations);
  return nextRevision_;
}`,
            },
          },
          {
            id: 'mount-phase',
            heading: 'Phase 3: Mount Phase on the Platform UI Thread',
            body: [
              'The mutations list is dispatched to the platform UI thread (Android Main Looper or iOS main runloop). The native mounting engine applies the exact view mutations to `UIView` or `android.view.View` objects in a single continuous UI frame.',
            ],
          },
          {
            id: 'bridgeless-mode',
            heading: 'Bridgeless Mode in React Native 0.76+',
            body: [
              'Bridgeless Mode eliminates `RCTBridge` and `BridgeExecutor` completely. In Bridgeless mode, the JavaScript runtime is owned directly by `ReactInstance` via JSI. Native modules are resolved dynamically via TurboModuleRegistry without queuing JSON strings.',
            ],
          },
        ],
      },
      {
        id: 'jsi-and-turbomodules',
        slug: 'jsi-and-turbomodules',
        categoryId: 'architecture-runtime',
        categoryTitle: 'Architecture & Runtime Internals',
        title: 'JSI HostObjects & TurboModules Spec System',
        subtitle: 'Direct memory pointer invocation without async serializing JSON packets.',
        versionBadge: 'C++ / JSI',
        readTime: '10 min read',
        toc: [
          { id: 'jsi-mechanics', label: 'Why JSI Replaces the JSON Bridge' },
          { id: 'cpp-hostobject', label: 'Writing a C++ JSI HostObject' },
          { id: 'turbomodule-registry', label: 'TurboModuleRegistry.getEnforcing()' },
        ],
        sections: [
          {
            id: 'jsi-mechanics',
            heading: 'Why JSI Replaces the JSON Bridge',
            body: [
              'In the legacy architecture, every communication between JavaScript and native Java/Swift had to be converted into a JSON string, sent over an asynchronous message queue, parsed by the receiver, and executed asynchronously.',
              'JSI (JavaScript Interface) provides a lightweight, engine-agnostic C++ abstraction layer. JavaScript code holds direct references to C++ HostObjects in memory. Calling a native method is as fast as calling any regular JavaScript function—nanosecond latency with zero JSON overhead.',
            ],
          },
          {
            id: 'cpp-hostobject',
            heading: 'Writing a Minimal C++ HostObject',
            body: [
              'A JSI HostObject implements `jsi::HostObject` and overrides `get()` to expose native methods directly to the JavaScript runtime global scope.',
            ],
            codeSnippet: {
              language: 'cpp',
              filename: 'FastCryptoHostObject.cpp',
              code: `#include <jsi/jsi.h>

using namespace facebook;

class FastCryptoHostObject : public jsi::HostObject {
public:
  jsi::Value get(jsi::Runtime &runtime, const jsi::PropNameID &name) override {
    auto propName = name.utf8(runtime);

    if (propName == "sha256HashSync") {
      return jsi::Function::createFromHostFunction(
        runtime,
        name,
        1, // 1 argument
        [](jsi::Runtime &rt, const jsi::Value &thisVal, const jsi::Value *args, size_t count) -> jsi::Value {
          std::string input = args[0].asString(rt).utf8(rt);
          std::string computedHash = performNativeSha256(input);
          return jsi::String::createFromUtf8(rt, computedHash);
        }
      );
    }
    return jsi::Value::undefined();
  }
};`,
            },
          },
          {
            id: 'turbomodule-registry',
            heading: 'TurboModuleRegistry & Lazy Instantiation',
            body: [
              'TurboModules are initialized lazily. In legacy React Native, all 50+ native modules were instantiated at app launch during `didFinishLaunchingWithOptions`, significantly slowing startup. TurboModules are loaded into memory only on the exact frame their method is called.',
            ],
          },
        ],
      },
      {
        id: 'hermes-engine-bytecode',
        slug: 'hermes-engine-bytecode',
        categoryId: 'architecture-runtime',
        categoryTitle: 'Architecture & Runtime Internals',
        title: 'Hermes Bytecode Engine, Segregated GC & Memory Profiling',
        subtitle: 'Ahead-of-time bytecode compilation, generational garbage collection, and heap analysis.',
        versionBadge: 'Hermes Engine',
        readTime: '8 min read',
        toc: [
          { id: 'hermes-aot', label: 'Hermes AOT Compilation (.hbc)' },
          { id: 'generational-gc', label: 'Segregated Generational GC' },
          { id: 'heap-profiling', label: 'Generating Heap Snapshots via Chrome DevTools' },
        ],
        sections: [
          {
            id: 'hermes-aot',
            heading: 'Ahead-of-Time Bytecode Compilation (HBC)',
            body: [
              'Unlike standard V8 or JavaScriptCore which parse plain JS source code text at app launch, the Hermes compiler converts JavaScript source code into Hermes Bytecode (`.hbc`) during the release build.',
              'This reduces cold start Time-to-Interactive (TTI) by up to 50% because the mobile device directly memory-maps (`mmap`) bytecode into RAM without parsing or compiling tokens at runtime.',
            ],
          },
          {
            id: 'generational-gc',
            heading: 'Segregated Generational Garbage Collector',
            body: [
              'Hermes uses a generational garbage collector with segregated free lists. Short-lived temporary objects (like navigation params, re-render states) are allocated in Young Generation memory and cleaned up rapidly without pausing the UI thread.',
            ],
            codeSnippet: {
              language: 'bash',
              filename: 'Terminal Command',
              code: `# Inspect Hermes bytecode metadata in release APK
hermesc -emit-binary index.android.bundle -out index.android.hbc

# Run hermes memory profiler via adb
adb shell am broadcast -a "com.yourapp.HERMES_HEAP_CAPTURE"`,
            },
          },
        ],
      },
    ],
  },
  {
    id: 'native-modules',
    title: '4. Native Modules & Bridging',
    description: 'Codegen specs in TypeScript, writing Swift and modern Kotlin modules with type safety.',
    iconName: 'FileCode2',
    articles: [
      {
        id: 'turbo-module-codegen',
        slug: 'turbo-module-codegen',
        categoryId: 'native-modules',
        categoryTitle: 'Native Modules & Bridging',
        title: 'TurboModule Specs via TypeScript Codegen',
        subtitle: 'Authoring strict type contracts that auto-generate C++ glue code and platform interfaces.',
        versionBadge: 'Codegen Specs',
        readTime: '7 min read',
        toc: [
          { id: 'codegen-spec', label: 'Writing NativeSpec.ts' },
          { id: 'running-codegen', label: 'Invoking the Codegen CLI' },
          { id: 'generated-cpp', label: 'Analyzing the Generated C++ Headers' },
        ],
        sections: [
          {
            id: 'codegen-spec',
            heading: 'Writing the TypeScript NativeSpec',
            body: [
              'React Native Codegen generates C++ glue code directly from TypeScript or Flow interfaces. The spec must extend `TurboModule` and follow strict type signatures (only primitives, promises, and typed objects).',
            ],
            codeSnippet: {
              language: 'ts',
              filename: 'NativeHapticEngine.ts',
              code: `import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  // Synchronous method returning boolean
  readonly isSupported: () => boolean;

  // Asynchronous method returning typed Promise
  readonly triggerHaptic: (intensity: 'light' | 'medium' | 'heavy') => Promise<boolean>;

  // Synchronous JSI direct return
  readonly getEngineVersion: () => string;
}

export default TurboModuleRegistry.getEnforcing<Spec>('NativeHapticEngine');`,
            },
          },
          {
            id: 'running-codegen',
            heading: 'Invoking the Codegen CLI',
            body: [
              'Run the Codegen script in your project root or let Gradle/CocoaPods trigger it during the native build step:',
            ],
            codeSnippet: {
              language: 'bash',
              filename: 'Terminal',
              code: `# Trigger Codegen for iOS Pods
cd ios && RCT_NEW_ARCH_ENABLED=1 bundle exec pod install

# In Android, Gradle automatically invokes generateCodegenArtifactsFromSchema
./gradlew generateCodegenArtifactsFromSchema`,
            },
          },
        ],
      },
      {
        id: 'swift-kotlin-native-modules',
        slug: 'swift-kotlin-native-modules',
        categoryId: 'native-modules',
        categoryTitle: 'Native Modules & Bridging',
        title: 'Implementing Swift & Modern Kotlin TurboModules',
        subtitle: 'Concrete implementations implementing generated specs on iOS and Android.',
        versionBadge: 'Swift / Kotlin',
        readTime: '8 min read',
        toc: [
          { id: 'kotlin-module', label: 'Kotlin NativeHapticEngineSpec' },
          { id: 'swift-module', label: 'Swift HapticEngine Implementation' },
        ],
        sections: [
          {
            id: 'kotlin-module',
            heading: 'Kotlin Implementation for Android',
            body: [
              'In Android, your class inherits from the auto-generated `NativeHapticEngineSpec` abstract class, which guarantees compiler errors if your method signatures do not match the TypeScript specification.',
            ],
            codeSnippet: {
              language: 'kotlin',
              filename: 'android/src/main/java/com/app/NativeHapticEngineModule.kt',
              code: `package com.app

import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.app.specs.NativeHapticEngineSpec

class NativeHapticEngineModule(reactContext: ReactApplicationContext) :
    NativeHapticEngineSpec(reactContext) {

    override fun getName(): String = "NativeHapticEngine"

    override fun isSupported(): Boolean = true

    override fun triggerHaptic(intensity: String, promise: Promise) {
        try {
            // Native Android Vibrator invocation
            val vibrator = reactApplicationContext.getSystemService(Vibrator::class.java)
            vibrator?.vibrate(VibrationEffect.createOneShot(50, VibrationEffect.DEFAULT_AMPLITUDE))
            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject("E_HAPTIC_FAIL", e.message)
        }
    }

    override fun getEngineVersion(): String = "2.4.0-turbomodule"
}`,
            },
          },
          {
            id: 'swift-module',
            heading: 'Swift Implementation for iOS',
            body: [
              'In iOS, create the Swift class and expose it via an Objective-C++ bridge conforming to the generated protocol.',
            ],
            codeSnippet: {
              language: 'swift',
              filename: 'ios/NativeHapticEngine.swift',
              code: `import Foundation
import UIKit

@objc(NativeHapticEngine)
public class NativeHapticEngine: NSObject {
  
  @objc
  public func isSupported() -> Bool {
    return true
  }

  @objc
  public func triggerHaptic(_ intensity: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    DispatchQueue.main.async {
      let generator = UIImpactFeedbackGenerator(style: .medium)
      generator.prepare()
      generator.impactOccurred()
      resolve(true)
    }
  }

  @objc
  public func getEngineVersion() -> String {
    return "2.4.0-turbomodule-ios"
  }
}`,
            },
          },
        ],
      },
    ],
  },
  {
    id: 'performance-profiling',
    title: '5. Performance & Profiling',
    description: 'Systrace, Flipper, React DevTools, Hermes memory leaks, and eliminating JS frame drops.',
    iconName: 'Activity',
    articles: [
      {
        id: 'frame-rate-js-ui-profiling',
        slug: 'frame-rate-js-ui-profiling',
        categoryId: 'performance-profiling',
        categoryTitle: 'Performance & Profiling',
        title: 'Diagnosing JS vs UI Thread Frame Drops',
        subtitle: 'Pinpointing 60fps/120fps hitching, long microtasks, and touch-to-visual response delays.',
        versionBadge: 'Profiling',
        readTime: '7 min read',
        toc: [
          { id: 'thread-isolation', label: 'JS Thread vs UI Thread Work' },
          { id: 'flipper-perf-monitor', label: 'In-App Perf Monitor & Systrace' },
          { id: 'worklets-reanimated', label: 'Offloading to UI Thread with Worklets' },
        ],
        sections: [
          {
            id: 'thread-isolation',
            heading: 'Understanding JS Thread vs UI Thread Workload',
            body: [
              'React Native applications execute on multiple threads:',
              '- **JavaScript Thread**: Handles business logic, React component diffing, API responses, Redux/Zustand dispatches.',
              '- **Native UI Thread**: Handles touch events, gestures, native scrolling, and view compositing.',
              'If the JavaScript thread is blocked by a 120ms JSON parsing loop, native gestures will continue scrolling smoothly, but buttons will not respond to touches until the JS thread event loop clears.',
            ],
          },
          {
            id: 'flipper-perf-monitor',
            heading: 'In-App Perf Monitor Diagnostics',
            body: [
              'Open the in-app Developer Menu (`Cmd+D` in iOS Simulator or `Cmd+M` in Android Emulator) and select **"Show Perf Monitor"**.',
              '- **UI: 60 FPS / JS: 15 FPS**: Your JS thread is starved (e.g. infinite re-renders or unmemoized heavy lists).',
              '- **UI: 25 FPS / JS: 60 FPS**: Your native GPU/view hierarchy is overdrawn (e.g. excessive elevation shadows or unscaled bitmap images).',
            ],
          },
        ],
      },
      {
        id: 'bundle-size-and-treeshaking',
        slug: 'bundle-size-and-treeshaking',
        categoryId: 'performance-profiling',
        categoryTitle: 'Performance & Profiling',
        title: 'Bundle Size Reduction & Tree-Shaking',
        subtitle: 'Pruning unused lodash/moment bloat and configuring Hermes bytecode optimization.',
        versionBadge: 'Production Optimization',
        readTime: '6 min read',
        toc: [
          { id: 'metro-visualizer', label: 'Visualizing Bundle Size with Metro' },
          { id: 'babel-transform', label: 'Babel Plugin Import Transforms' },
        ],
        sections: [
          {
            id: 'metro-visualizer',
            heading: 'Analyzing Bundle Bloat with react-native-bundle-visualizer',
            body: [
              'Run the bundle visualizer to generate an interactive treemap of every npm package packaged into your production bundle:',
            ],
            codeSnippet: {
              language: 'bash',
              filename: 'Terminal',
              code: `# Generate interactive bundle treemap
npx react-native-bundle-visualizer

# Common culprits to replace:
# 1. moment.js (68KB) -> date-fns or dayjs (4KB)
# 2. lodash (72KB) -> lodash-es with cherry-picked imports`,
            },
          },
        ],
      },
    ],
  },
  {
    id: 'publishing-cicd',
    title: '6. Publishing & CI/CD',
    description: 'Android App Bundles (AAB), Keystore signing, iOS Fastlane, and Hermes ProGuard rules.',
    iconName: 'Rocket',
    articles: [
      {
        id: 'android-keystore-aab',
        slug: 'android-keystore-aab',
        categoryId: 'publishing-cicd',
        categoryTitle: 'Publishing & CI/CD',
        title: 'Android Keystore Signing & ProGuard/R8 Rules',
        subtitle: 'Generating upload keys, securing credentials, and protecting Hermes C++ symbols from R8 stripping.',
        versionBadge: 'Android Production',
        readTime: '7 min read',
        toc: [
          { id: 'generate-keystore', label: 'Generating Production Keystore' },
          { id: 'gradle-signing', label: 'Configuring gradle.properties' },
          { id: 'proguard-rules', label: 'Critical Hermes & JSI ProGuard Rules' },
        ],
        sections: [
          {
            id: 'generate-keystore',
            heading: 'Generating the Production Upload Keystore',
            body: [
              'Use JDK `keytool` to generate a 2048-bit RSA key valid for 25 years. Store this file outside version control.',
            ],
            codeSnippet: {
              language: 'bash',
              filename: 'Terminal Keytool',
              code: `keytool -genkeypair -v -storetype PKCS12 -keystore my-upload-key.keystore \\
  -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000`,
            },
          },
          {
            id: 'proguard-rules',
            heading: 'Critical ProGuard & R8 Hermes Rules',
            body: [
              'When building a release APK/AAB with `minifyEnabled true`, R8 obfuscates Java class and method names. If JNI native C++ methods rely on exact Java class signatures, your app will crash on launch with an `UnsatisfiedLinkError`.',
            ],
            codeSnippet: {
              language: 'proguard',
              filename: 'android/app/proguard-rules.pro',
              code: `# Preserve React Native C++ JNI classes
-keep class com.facebook.react.** { *; }
-keep class com.facebook.hermes.unicode.** { *; }
-keep class com.facebook.jni.** { *; }

# Preserve TurboModule generated specs
-keep class com.app.specs.** { *; }

# Keep annotations used by Codegen
-keepattributes *Annotation*
-keepclassmembers class * {
    @com.facebook.react.uimanager.annotations.ReactProp <methods>;
}`,
            },
          },
        ],
      },
      {
        id: 'ios-fastlane-provisioning',
        slug: 'ios-fastlane-provisioning',
        categoryId: 'publishing-cicd',
        categoryTitle: 'Publishing & CI/CD',
        title: 'iOS Fastlane Match & App Store Automation',
        subtitle: 'Git-based encrypted certificates, App Store Connect API keys, and testflight distribution.',
        versionBadge: 'iOS Production',
        readTime: '6 min read',
        toc: [
          { id: 'fastlane-init', label: 'Fastlane Match Initialization' },
          { id: 'fastfile-lane', label: 'Automated Fastfile Release Lane' },
        ],
        sections: [
          {
            id: 'fastlane-init',
            heading: 'Deterministic Certificates with Fastlane Match',
            body: [
              'Fastlane Match creates a central encrypted Git repository containing iOS distribution certificates and provisioning profiles, shared securely across developer machines and CI/CD runners.',
            ],
            codeSnippet: {
              language: 'ruby',
              filename: 'ios/fastlane/Fastfile',
              code: `default_platform(:ios)

platform :ios do
  desc "Push a new beta build to TestFlight"
  lane :beta do
    # Fetch team certificates from encrypted Git repo
    match(type: "appstore", readonly: is_ci)

    # Increment build number
    increment_build_number(xcodeproj: "VisionMobileApp.xcodeproj")

    # Build signed iOS archive (.ipa)
    build_app(
      workspace: "VisionMobileApp.xcworkspace",
      scheme: "VisionMobileApp",
      export_method: "app-store"
    )

    # Upload to Apple TestFlight via API Key
    upload_to_testflight(
      api_key_path: "fastlane/api_key.json",
      skip_waiting_for_build_processing: true
    )
  end
end`,
            },
          },
        ],
      },
    ],
  },
];
