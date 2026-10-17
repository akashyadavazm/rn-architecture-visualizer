import { Module } from '../types';

export const SEED_MODULES: Module[] = [
  // =========================================================================
  // TRACK 1: INTERN & FOUNDATIONS
  // =========================================================================
  {
    id: 'mod-stage-1',
    stage_number: 1,
    track: 'Intern & Foundations',
    title: 'Stage 1: Intern Foundations & Project Architecture',
    description: 'Scalable Folder Structure, Metro Bundler, Strict TypeScript & Multi-Env Configs',
    icon_name: 'FolderTree',
    order_index: 1,
    topics: [
      {
        id: 'topic-1-1',
        module_id: 'mod-stage-1',
        stage_number: 1,
        track: 'Intern & Foundations',
        title: 'Scalable Folder Structure & Clean Barrel Architecture',
        slug: 'scalable-folder-structure-barrel-exports',
        difficulty: 'Beginner',
        read_time_minutes: 8,
        tldr_brief:
          'Structuring enterprise React Native codebases with modular feature slices, avoiding circular dependency cycles in Metro, and enforcing strict path aliases.',
        is_published: true,
        created_at: '2026-03-01T10:00:00Z',
        intern_checklist: [
          'Group code by Feature Slice (e.g. src/features/auth) rather than dumping 40 screens into a flat /screens folder.',
          'Never import from index barrels inside the same folder; direct file imports prevent Metro circular dependency crashes.',
          'Configure path aliases (@components, @screens, @services) in tsconfig.json and babel.config.js to eliminate ../../../ hell.',
          'Separate API networking services completely from UI presentation components.',
          'Store all TypeScript models in a centralized types/ directory or feature-local models.ts.',
        ],
        production_bug: {
          scenario: 'Metro Bundler silently freezes at 99.4% bundling or crashes with "Requiring unknown module <undefined>".',
          root_cause: 'Circular dependency created by index.ts barrel files cross-importing each other at module evaluation time.',
          fix: 'Eliminate circular barrel imports by using direct absolute file paths or ESLint plugin import/no-cycle in your CI pipeline.',
          fix_code: `// .eslintrc.js
module.exports = {
  rules: {
    'import/no-cycle': ['error', { maxDepth: 2 }],
  },
};`,
        },
        content_blocks: [
          {
            id: 'b1-1-1',
            type: 'text',
            title: 'Why Architecture Matters on Day One',
            body: `In small hobby apps, dumping all files into a single root folder works. In an enterprise team with 15 engineers, a sloppy architecture leads to:
1. **Metro Bundler Circular Locks**: Two files importing each other via index.ts causes undefined exports at runtime.
2. **Re-rendering Sprawl**: Mixing state management directly inside UI screen files prevents granular component memoization.
3. **Merge Conflict Chaos**: Five engineers editing the same monolith navigation file simultaneously.`,
          },
          {
            id: 'b1-1-2',
            type: 'code_comparison',
            title: 'Messy Monolith vs. Production Feature Architecture',
            mistakeLanguage: 'typescript',
            mistakeCode: `// ❌ JUNIOR TRAP: Tangled Imports & Inlined Business Logic
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
// ⚠️ Fragile relative path traversal
import { UserCard } from '../../../../components/UserCard';

export function ProfileScreen() {
  const [data, setData] = useState(null);

  // ⚠️ API fetch, token retrieval, and UI logic crammed in one file
  useEffect(() => {
    fetch('https://api.domain.com/user')
      .then(r => r.json())
      .then(d => setData(d));
  }, []);

  return <View><UserCard data={data} /></View>;
}`,
            mistakeExplanation:
              'Relative path nesting breaks easily when files move. Mixing raw network calls inside views prevents unit testing and caching.',
            solutionLanguage: 'typescript',
            solutionCode: `// ✅ ARCHITECT PATTERN: Clean Feature Slice with Service Separation
import React from 'react';
import { View } from 'react-native';
import { useUserProfile } from '@features/auth/hooks/useUserProfile';
import { UserProfileCard } from '@features/auth/components/UserProfileCard';
import { ScreenContainer } from '@components/layout/ScreenContainer';

export const ProfileScreen: React.FC = () => {
  // Encapsulated React Query hook with automatic offline caching
  const { profile, isLoading, error } = useUserProfile();

  return (
    <ScreenContainer loading={isLoading} error={error}>
      <UserProfileCard profile={profile} />
    </ScreenContainer>
  );
};`,
            solutionExplanation:
              'Leverages path aliases (@features, @components), separates data orchestration into a dedicated custom hook, and keeps JSX purely presentational.',
          },
        ],
      },
    ],
  },
  {
    id: 'mod-stage-2',
    stage_number: 2,
    track: 'Intern & Foundations',
    title: 'Stage 2: Pixel-Perfect Responsive UI & Styling',
    description: 'Yoga Flexbox Engine, Safe Areas, KeyboardAvoidance & Percentage Viewports',
    icon_name: 'Maximize2',
    order_index: 2,
    topics: [
      {
        id: 'topic-2-1',
        module_id: 'mod-stage-2',
        stage_number: 2,
        track: 'Intern & Foundations',
        title: 'Flexbox Deep Dive & Responsive wp/hp Dimension Scaling',
        slug: 'flexbox-responsive-dimension-scaling',
        difficulty: 'Beginner',
        read_time_minutes: 9,
        tldr_brief:
          'Mastering Meta Yoga Flexbox layout calculations, safe area insets on Android & iOS notch devices, and scaling UI gracefully across iPhone mini to iPad Pro.',
        is_published: true,
        created_at: '2026-03-02T10:00:00Z',
        intern_checklist: [
          'Never hardcode pixel widths like width: 360; use percentage or Dimensions.get("window").',
          'Always wrap root views with SafeAreaProvider and useSafeAreaInsets() rather than deprecated SafeAreaView.',
          'Use KeyboardAvoidingView with behavior={Platform.OS === "ios" ? "padding" : "height"} to prevent input overlap.',
          'Rely on Yoga flexbox gap, justifyContent, and alignItems instead of hardcoded marginTop offsets.',
          'Test all screens on at least two extremes: compact iPhone SE (375pt) and a large foldable/tablet (768pt+).',
        ],
        production_bug: {
          scenario: 'Submit button gets pushed completely beneath the keyboard on iPhone 15 Pro, making checkout impossible.',
          root_cause: 'Using default KeyboardAvoidingView without platform-specific offset adjustment or missing keyboardVerticalOffset.',
          fix: 'Apply Platform.select with header height offset or wrap forms with react-native-keyboard-aware-scroll-view.',
          fix_code: `<KeyboardAvoidingView
  behavior={Platform.OS === 'ios' ? 'padding' : undefined}
  keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
  style={{ flex: 1 }}
>
  <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
    {/* Form Inputs */}
  </ScrollView>
</KeyboardAvoidingView>`,
        },
        content_blocks: [
          {
            id: 'b2-1-1',
            type: 'text',
            title: 'How Yoga Flexbox Works Under The Hood',
            body: `React Native does not use browser CSS. Instead, it embeds **Yoga**, a high-performance cross-platform C++ Flexbox implementation created by Meta.

Key differences from browser web layout:
- \`flexDirection\` defaults to **\`column\`** (web defaults to \`row\`).
- Everything is calculated using Density-Independent Pixels (\`dp\` on Android, \`points\` on iOS).
- When you set a fixed pixel width like \`350px\`, on an iPhone SE (375px wide with 16px margins), the card **will overflow and clip**!`,
          },
          {
            id: 'b2-1-2',
            type: 'responsive_simulator',
            title: 'Interactive Screen Size Simulator',
          },
          {
            id: 'b2-1-3',
            type: 'code_comparison',
            title: 'Fixed Dimensions vs. Scalable Flexbox Utility',
            mistakeLanguage: 'typescript',
            mistakeCode: `// ❌ JUNIOR TRAP: Hardcoded pixels & manual offsets
const styles = StyleSheet.create({
  card: {
    width: 340, // ⚠️ Clips on compact devices!
    height: 180,
    marginTop: 45, // ⚠️ Overlaps on status bars without safe area
    marginLeft: 20,
  },
});`,
            mistakeExplanation:
              'Hardcoded dimensions cause horizontal clipping on small screens and awkward postage-stamp cards on foldables and tablets.',
            solutionLanguage: 'typescript',
            solutionCode: `// ✅ PRODUCTION PATTERN: Percentage utilities + Yoga flexbox
import { Dimensions, PixelRatio, StyleSheet } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Fluid percentage utility
export const wp = (percentage: number) => {
  return PixelRatio.roundToNearestPixel((SCREEN_WIDTH * percentage) / 100);
};

const styles = StyleSheet.create({
  card: {
    width: wp(90), // Automatically 90% of any viewport!
    alignSelf: 'center',
    padding: wp(4),
    gap: 12, // Yoga C++ native gap property
  },
});`,
            solutionExplanation:
              'Guarantees perfect proportional alignment across all form factors from small budget Androids to large iPads.',
          },
        ],
      },
    ],
  },

  // =========================================================================
  // TRACK 2: PRODUCTION ENGINEERING
  // =========================================================================
  {
    id: 'mod-stage-3',
    stage_number: 3,
    track: 'Production Engineering',
    title: 'Stage 3: Lists, Memory & 60FPS Rendering',
    description: 'FlatList Virtualization, FlashList Recycling, Image Caching & Memory Leaks',
    icon_name: 'Activity',
    order_index: 3,
    topics: [
      {
        id: 'topic-3-1',
        module_id: 'mod-stage-3',
        stage_number: 3,
        track: 'Production Engineering',
        title: 'FlatList vs. FlashList: Cell Recycling Architecture',
        slug: 'flatlist-vs-flashlist-cell-recycling',
        difficulty: 'Intermediate',
        read_time_minutes: 10,
        tldr_brief:
          'Eliminating white blank spaces and memory spikes during fast scrolls. How FlashList recycles view cells in native memory instead of mounting/unmounting hundreds of React components.',
        is_published: true,
        created_at: '2026-03-03T10:00:00Z',
        intern_checklist: [
          'Never use ScrollView for lists with more than 20 dynamic items; ScrollView renders every item simultaneously.',
          'Always supply a unique keyExtractor that uses item.id; using index causes full list re-renders on deletes/sorts.',
          'Define renderItem as a memoized named component outside the parent screen to prevent reallocation on every render.',
          'Set getItemLayout on FlatList if rows have fixed heights to skip dynamic native measurement passes.',
          'Adopt Shopify FlashList for heavy feeds to lock memory footprint to ~25MB via genuine native view recycling.',
        ],
        production_bug: {
          scenario: 'App crashes after user scrolls through 100 photo cards on Android with "OutOfMemoryError: Failed to allocate byte buffer".',
          root_cause: 'Using raw <Image /> tags inside an unbounded ScrollView or unoptimized FlatList without downsampling or memory cache limits.',
          fix: 'Replace with expo-image or react-native-fast-image with memory cache priority and recycling.',
          fix_code: `import { Image } from 'expo-image';

<Image
  source={{ uri: item.avatarUrl }}
  contentFit="cover"
  transition={200}
  cachePolicy="memory-disk"
  style={{ width: 64, height: 64, borderRadius: 32 }}
/>`,
        },
        content_blocks: [
          {
            id: 'b3-1-1',
            type: 'flatlist_recycler_visualizer',
            title: 'Virtualization & Cell Recycling Simulator',
          },
          {
            id: 'b3-1-2',
            type: 'code_comparison',
            title: 'Unoptimized FlatList vs. Production FlashList',
            mistakeLanguage: 'typescript',
            mistakeCode: `// ❌ JUNIOR TRAP: Inline renderItem & missing keyExtractor
export function ProductList({ products }) {
  return (
    <FlatList
      data={products}
      // ⚠️ Inline arrow function recreated on EVERY state change!
      renderItem={({ item, index }) => (
        <View key={index} style={{ height: 90 }}>
          <Text>{item.title}</Text>
        </View>
      )}
      // ⚠️ Massive windowSize caches 40 screens of views in RAM
      windowSize={41}
    />
  );
}`,
            mistakeExplanation:
              'Inline renderItem functions force every visible item to re-render whenever the parent state updates, causing dropped frames.',
            solutionLanguage: 'typescript',
            solutionCode: `// ✅ ARCHITECT PATTERN: Shopify FlashList with Strict Recycling
import React, { memo } from 'react';
import { FlashList } from '@shopify/flashlist';

const ProductRow = memo(({ title, price }: { title: string; price: number }) => (
  <View style={{ height: 80, padding: 12 }}>
    <Text>{title}</Text>
    <Text>{price}</Text>
  </View>
));

export function OptimizedProductFeed({ products }: { products: Product[] }) {
  return (
    <FlashList
      data={products}
      renderItem={({ item }) => <ProductRow title={item.title} price={item.price} />}
      estimatedItemSize={80} // Enables instant recycling without measurement passes
      keyExtractor={(item) => item.id}
    />
  );
}`,
            solutionExplanation:
              'FlashList recycles native UI views instead of destroying and recreating them, sustaining 60FPS with minimal RAM usage.',
          },
        ],
      },
    ],
  },
  {
    id: 'mod-stage-4',
    stage_number: 4,
    track: 'Production Engineering',
    title: 'Stage 4: API Layer, Auth Flows & Security',
    description: 'Axios JWT Refresh Queueing, MMKV Secure Storage, Deep Links & Biometrics',
    icon_name: 'ShieldCheck',
    order_index: 4,
    topics: [
      {
        id: 'topic-4-1',
        module_id: 'mod-stage-4',
        stage_number: 4,
        track: 'Production Engineering',
        title: 'Axios JWT Auto-Refresh Queue & MMKV Encryption',
        slug: 'jwt-refresh-queue-mmkv-encryption',
        difficulty: 'Intermediate',
        read_time_minutes: 11,
        tldr_brief:
          'Handling concurrent 401 Unauthorized API responses using a Promise queue, refreshing expired JWTs invisibly, and replacing slow AsyncStorage with C++ MMKV.',
        is_published: true,
        created_at: '2026-03-04T10:00:00Z',
        intern_checklist: [
          'Never store raw JWT auth tokens or encryption keys in AsyncStorage (it stores unencrypted plaintext on disk).',
          'Use react-native-mmkv with an encryption key stored in iOS Keychain / Android KeyStore.',
          'Implement an Axios response interceptor that queues concurrent 401 requests until a single refresh call finishes.',
          'Never trigger window.alert on auth errors; route users seamlessly through a structured auth state machine.',
          'Validate all incoming Deep Links / Universal Links against an allowed URL whitelist to prevent open redirect vulnerabilities.',
        ],
        production_bug: {
          scenario: 'When token expires, 5 simultaneous dashboard API calls trigger 5 simultaneous refresh requests, causing token rotation invalidation and unexpected logout.',
          root_cause: 'Lack of a mutex or request queue in the Axios 401 interceptor.',
          fix: 'Implement an isRefreshing flag and queue pending requests into an array of callbacks resolved by the single refresh response.',
          fix_code: `let isRefreshing = false;
let failedQueue: Array<{ resolve: Function; reject: Function }> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};`,
        },
        content_blocks: [
          {
            id: 'b4-1-1',
            type: 'text',
            title: 'Why AsyncStorage is a Security & Performance Liability',
            body: `\`AsyncStorage\` is an ancient React Native module with two critical vulnerabilities:
1. **Unencrypted Plaintext**: On rooted Android devices or backed-up iOS filesystems, tokens in AsyncStorage can be extracted in seconds.
2. **Bridge Serialization**: AsyncStorage writes asynchronously across the bridge serialized as JSON. A single large read blocks for 15ms.

**MMKV** (written in C++ by WeChat) uses \`mmap\` to bind OS memory directly to storage files, making read/writes **30x to 50x faster** than AsyncStorage with AES-256 encryption support.`,
          },
          {
            id: 'b4-1-2',
            type: 'code_comparison',
            title: 'Naive 401 Handler vs. Concurrent Token Queue Interceptor',
            mistakeLanguage: 'typescript',
            mistakeCode: `// ❌ JUNIOR TRAP: Multiple simultaneous refresh collisions
axios.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (error.response?.status === 401) {
      // ⚠️ Every failing API call fires its OWN refresh request!
      // Server rotates refresh token and invalidates all other requests
      const { data } = await axios.post('/auth/refresh');
      return axios(error.config);
    }
    return Promise.reject(error);
  }
);`,
            mistakeExplanation:
              'If 4 requests fail at once, 4 refresh calls fire in parallel, causing token desync and immediately kicking the user out of the app.',
            solutionLanguage: 'typescript',
            solutionCode: `// ✅ PRODUCTION PATTERN: Synchronized Token Refresh Queue
import axios from 'axios';
import { MMKV } from 'react-native-mmkv';

const storage = new MMKV({ id: 'secure-vault', encryptionKey: 'vault-secret-key' });
let isRefreshing = false;
let failedQueue: Array<{ resolve: (token: string) => void; reject: (err: any) => void }> = [];

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Queue pending calls until primary refresh resolves
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = \`Bearer \${token}\`;
          return axios(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = storage.getString('refresh_token');
        const { data } = await axios.post('/auth/refresh', { refreshToken });
        storage.set('access_token', data.accessToken);
        
        // Resolve all queued calls with new token
        failedQueue.forEach((p) => p.resolve(data.accessToken));
        failedQueue = [];
        return axios(originalRequest);
      } catch (refreshErr) {
        failedQueue.forEach((p) => p.reject(refreshErr));
        failedQueue = [];
        // Navigate cleanly to login
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);`,
            solutionExplanation:
              'Queues all secondary 401 failures into a promise buffer, executes a single refresh call, and replays all queued network requests flawlessly.',
          },
        ],
      },
    ],
  },
  {
    id: 'mod-stage-5',
    stage_number: 5,
    track: 'Production Engineering',
    title: 'Stage 5: State Management & Real-Time Sync',
    description: 'Redux Toolkit + MMKV Persist, React Query Server State & Socket.IO AppState',
    icon_name: 'Database',
    order_index: 5,
    topics: [
      {
        id: 'topic-5-1',
        module_id: 'mod-stage-5',
        stage_number: 5,
        track: 'Production Engineering',
        title: 'Redux Toolkit + React Query & Socket.IO AppState',
        slug: 'redux-toolkit-react-query-socket-appstate',
        difficulty: 'Intermediate',
        read_time_minutes: 10,
        tldr_brief:
          'Separating client UI state (Redux) from server cache (React Query), and managing real-time WebSocket connections safely during mobile app backgrounding.',
        is_published: true,
        created_at: '2026-03-05T10:00:00Z',
        intern_checklist: [
          'Do NOT store server cache data in Redux; use React Query (TanStack Query) for automatic background re-fetching and deduplication.',
          'Reserve Redux Toolkit for pure client state (active filters, drafting state, UI preferences).',
          'Listen to AppState ("active" | "background") to disconnect WebSockets when the user minimizes the app to preserve battery.',
          'Normalize nested state arrays with createEntityAdapter to ensure O(1) record lookups by ID.',
          'Never put non-serializable objects (class instances, functions, Promises) into Redux state.',
        ],
        production_bug: {
          scenario: 'Device battery drops by 35% overnight with app in background because Socket.IO keeps waking CPU radio.',
          root_cause: 'Unclosed WebSocket connection remaining active while mobile OS attempts to enter deep Doze mode.',
          fix: 'Bind AppState.addEventListener to disconnect sockets when state === "background" and reconnect on "active".',
          fix_code: `AppState.addEventListener('change', (nextState) => {
  if (nextState === 'background') {
    socket.disconnect();
  } else if (nextState === 'active') {
    socket.connect();
  }
});`,
        },
        content_blocks: [
          {
            id: 'b5-1-1',
            type: 'text',
            title: 'The Great Architectural Split: Client State vs Server Cache',
            body: `In legacy apps, engineers wrote hundreds of lines of boilerplate reducers to store API users, posts, and comments. 
In modern mobile architecture:
- **Server State (React Query)**: Cache lifetime, pagination, network retries, and optimistic updates.
- **Client State (Redux Toolkit)**: Ephemeral local state, multi-step checkout wizard state, and offline drafts.`,
          },
          {
            id: 'b5-1-2',
            type: 'code_comparison',
            title: 'Leaky Socket in Component vs. AppState-Aware Lifecycle Manager',
            mistakeLanguage: 'typescript',
            mistakeCode: `// ❌ JUNIOR TRAP: Memory leak & battery drain
export function ChatRoom() {
  useEffect(() => {
    // ⚠️ New socket created on every mount
    const socket = io('https://chat.domain.com');
    socket.on('message', (msg) => {
      // ⚠️ Continues listening even when app is minimized!
    });
  }, []);
  return <View />;
}`,
            mistakeExplanation:
              'Leaves dangling WebSocket listeners, keeps mobile radio transmitter awake, and drains device battery rapidly.',
            solutionLanguage: 'typescript',
            solutionCode: `// ✅ PRODUCTION PATTERN: Lifecycle-Aware Singleton Socket
import { useEffect } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { io, Socket } from 'socket.io-client';

class RealtimeManager {
  private socket: Socket | null = null;

  init() {
    this.socket = io('https://chat.domain.com', { autoConnect: false });
    this.socket.connect();

    AppState.addEventListener('change', this.handleAppStateChange);
  }

  private handleAppStateChange = (nextState: AppStateStatus) => {
    if (nextState === 'background' || nextState === 'inactive') {
      this.socket?.disconnect(); // Conserve battery & mobile data
    } else if (nextState === 'active' && !this.socket?.connected) {
      this.socket?.connect();
    }
  };
}

export const realtime = new RealtimeManager();`,
            solutionExplanation:
              'Lifecycle-aware socket manager respects mobile OS suspend modes, avoiding battery drain and socket ghost connections.',
          },
        ],
      },
    ],
  },

  // =========================================================================
  // TRACK 3: CORE INTERNALS & JSI
  // =========================================================================
  {
    id: 'mod-stage-6',
    stage_number: 6,
    track: 'Core Internals & JSI',
    title: 'Stage 6: 120Hz Animations & Gesture Handler',
    description: 'Reanimated 3 Worklets, useSharedValue, and Native UI Thread Worklet Execution',
    icon_name: 'Zap',
    order_index: 6,
    topics: [
      {
        id: 'topic-6-1',
        module_id: 'mod-stage-6',
        stage_number: 6,
        track: 'Core Internals & JSI',
        title: 'Reanimated 3 Worklets & 120Hz UI Thread Execution',
        slug: 'reanimated-3-worklets-120hz-execution',
        difficulty: 'Architect',
        read_time_minutes: 12,
        tldr_brief:
          'How React Native Reanimated worklets bypass the JavaScript event loop entirely, compiling mini JS functions into independent C++ runtime runlets executing at 120Hz on the platform UI thread.',
        is_published: true,
        created_at: '2026-03-06T10:00:00Z',
        intern_checklist: [
          'Never update useState inside an onScroll or onGestureEvent callback; it forces bridge roundtrips per finger pixel.',
          'Always mark worklet functions with the "worklet"; directive if passing them across thread boundaries.',
          'Use useSharedValue instead of standard React state for any value that drives visual animations.',
          'Always pair react-native-gesture-handler with Reanimated for gesture-driven layout transformations.',
          'Verify animations with Android Profile GPU Rendering to guarantee 0 dropped frames.',
        ],
        production_bug: {
          scenario: 'Swipe-to-delete animation stutters and freezes when user receives a push notification or during background network calls.',
          root_cause: 'Animation was driven by JS thread Animated.timing without useNativeDriver: true or using useState in PanResponder.',
          fix: 'Migrate gesture to react-native-gesture-handler Gesture.Pan() with Reanimated worklet driving transform on the UI thread.',
          fix_code: `const gesture = Gesture.Pan()
  .onChange((e) => {
    'worklet';
    translateX.value += e.changeX;
  });`,
        },
        content_blocks: [
          {
            id: 'b6-1-1',
            type: 'text',
            title: 'The "Worklet" Revolution: Eliminating the JS Thread',
            body: `In legacy React Native, gesture coordinates had to travel:
\`Native UI Thread -> Asynchronous Bridge -> JS Event Loop -> setState() -> Bridge -> Native UI Thread\`

If your JavaScript thread was busy sorting a list or parsing a 5MB JSON response, **the animation stuttered**.

**Reanimated 3 Worklets** compile marked JavaScript functions into secondary C++ JS runtimes running directly inside the Native UI Thread. Touch events update view matrix transforms at a locked 120Hz without ever waking the JS thread!`,
          },
          {
            id: 'b6-1-2',
            type: 'code_comparison',
            title: 'Laggy PanResponder vs. 120Hz Reanimated 3 Worklet',
            mistakeLanguage: 'typescript',
            mistakeCode: `// ❌ JUNIOR TRAP: useState inside gesture listener
const panResponder = PanResponder.create({
  onPanResponderMove: (_, gestureState) => {
    // ⚠️ Triggers full React re-render across bridge 60 times/sec!
    // Drops to 18fps on budget Android devices
    setCardOffset(gestureState.dx);
  },
});`,
            mistakeExplanation:
              'Forces a full React reconciliation pass and asynchronous bridge serialization for every single pixel of finger movement.',
            solutionLanguage: 'typescript',
            solutionCode: `// ✅ ARCHITECT PATTERN: 100% UI Thread Reanimated 3 Worklet
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

export function FluidCard() {
  const translateX = useSharedValue(0);

  const pan = Gesture.Pan()
    .onChange((event) => {
      'worklet'; // Compiles to UI thread runtime!
      translateX.value = event.translationX;
    })
    .onEnd(() => {
      'worklet';
      translateX.value = withSpring(0, { damping: 14 });
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <GestureDetector gesture={pan}>
      <Animated.View style={[styles.card, animatedStyle]} />
    </GestureDetector>
  );
}`,
            solutionExplanation:
              'The worklet code runs 100% on the platform UI thread. Even if JavaScript is locked doing heavy computation, the card glides at 120Hz.',
          },
        ],
      },
    ],
  },
  {
    id: 'mod-stage-7',
    stage_number: 7,
    track: 'Core Internals & JSI',
    title: 'Stage 7: Under the Hood — JSI, Fabric & C++ Shadow Tree',
    description: 'Death of the JSON Bridge, JSI HostObjects, Hermes Bytecode & Fabric Mounting',
    icon_name: 'Cpu',
    order_index: 7,
    topics: [
      {
        id: 'topic-7-1',
        module_id: 'mod-stage-7',
        stage_number: 7,
        track: 'Core Internals & JSI',
        title: 'Old Bridge vs. New Architecture JSI & Fabric',
        slug: 'old-bridge-vs-new-architecture-jsi',
        difficulty: 'Architect',
        read_time_minutes: 14,
        tldr_brief:
          'Deep architectural deconstruction of how Fabric replaces legacy UIManager with an immutable C++ shadow tree, synchronous Yoga layout, and JSI direct HostObject memory pointers.',
        is_published: true,
        created_at: '2026-03-07T10:00:00Z',
        intern_checklist: [
          'Enable the New Architecture in android/gradle.properties (newArchEnabled=true) and pod install with RCT_NEW_ARCH_ENABLED=1.',
          'Understand that JSI allows JavaScript to hold direct memory pointers to C++ HostObjects with zero serialization overhead.',
          'Never execute long-running CPU intensive work inside a synchronous JSI call, or you will freeze the JS event loop.',
          'Familiarize yourself with the 3 Fabric rendering phases: Render (JS/C++), Commit (Yoga flexbox on shadow thread), and Mount (UI thread diff mutation).',
          'Ensure your custom native modules migrate to TurboModule specs with Codegen.',
        ],
        production_bug: {
          scenario: 'Upgrading to React Native 0.76+ crashes on startup with "TurboModuleRegistry.getEnforcing(...): Spec not found".',
          root_cause: 'Native module lacks a Codegen TypeScript spec or build step did not generate the C++ abstract headers.',
          fix: 'Run npx react-native codegen and ensure package.json contains the "codegenConfig" dictionary declaration.',
          fix_code: `"codegenConfig": {
  "name": "NativeSecuritySpec",
  "type": "modules",
  "jsSrcsDir": "src"
}`,
        },
        content_blocks: [
          {
            id: 'b7-1-1',
            type: 'bridge_visualizer',
            title: 'JSI vs Bridge Execution Engine',
          },
          {
            id: 'b7-1-2',
            type: 'code_comparison',
            title: 'Asynchronous JSON Bridge vs. C++ HostObject JSI Direct Call',
            mistakeLanguage: 'javascript',
            mistakeCode: `// ❌ LEGACY BRIDGE: JSON serialization overhead (10-25ms)
NativeModules.SecurityManager.decryptToken(token, (err, result) => {
  // Asynchronous callback queued across FIFO JSON bridge
  setDecrypted(result);
});`,
            mistakeExplanation:
              'Payload must be converted to JSON string on JS thread, transferred over asynchronous FIFO queue, parsed by Java/Obj-C, then serialized back.',
            solutionLanguage: 'cpp',
            solutionCode: `// ✅ NEW ARCHITECTURE: JSI Synchronous C++ Direct Memory Call (0.01ms)
class SecurityHostObject : public jsi::HostObject {
public:
  jsi::Value get(jsi::Runtime& rt, const jsi::PropNameID& name) override {
    if (name.utf8(rt) == "decryptTokenDirect") {
      return jsi::Function::createFromHostFunction(
        rt, name, 1,
        [](jsi::Runtime& rt, const jsi::Value& thisVal,
           const jsi::Value* args, size_t count) {
          std::string token = args[0].getString(rt).utf8(rt);
          // Instant direct synchronous execution
          std::string decrypted = hardwareDecrypt(token);
          return jsi::String::createFromUtf8(rt, decrypted);
        });
    }
    return jsi::Value::undefined();
  }
};`,
            solutionExplanation:
              'JavaScript calls directly into C++ memory via HostObjects in 0.01ms with zero JSON serialization or thread queuing.',
          },
        ],
      },
    ],
  },

  // =========================================================================
  // TRACK 4: NATIVE & STORE RELEASE
  // =========================================================================
  {
    id: 'mod-stage-8',
    stage_number: 8,
    track: 'Native & Store Release',
    title: 'Stage 8: Native Bridging (Java/Kotlin & Swift) & Store CI/CD',
    description: 'Custom Platform Modules, Keystores, Provisioning Profiles & App Store Approvals',
    icon_name: 'Shield',
    order_index: 8,
    topics: [
      {
        id: 'topic-8-1',
        module_id: 'mod-stage-8',
        stage_number: 8,
        track: 'Native & Store Release',
        title: 'Native Modules in Kotlin/Swift & Production App Signing',
        slug: 'native-modules-swift-kotlin-store-release',
        difficulty: 'Architect',
        read_time_minutes: 13,
        tldr_brief:
          'Writing native hardware extensions in Kotlin and Swift, configuring Android release keystores (.jks), iOS certificates & provisioning profiles, and automated Fastlane CI/CD.',
        is_published: true,
        created_at: '2026-03-08T10:00:00Z',
        intern_checklist: [
          'Never commit release keystore passwords, alias keys, or Apple Developer p12 certificates to git repositories.',
          'Always generate Android App Bundles (.aab) instead of APKs to reduce production download size by up to 40%.',
          'Configure ProGuard/R8 rules in android/app/proguard-rules.pro to avoid stripping critical native JNI methods in release builds.',
          'Ensure iOS Info.plist contains all required Privacy descriptions (NSCameraUsageDescription, etc.) to prevent instant App Store rejection.',
          'Use Fastlane to automate version incrementing, testflight deploys, and screenshot generation.',
        ],
        production_bug: {
          scenario: 'Android release build crashes immediately on launch while debug build works perfectly.',
          root_cause: 'ProGuard / R8 code shrinking obfuscated or removed C++ JNI bridge methods or serialized model classes.',
          fix: 'Add keep rules in proguard-rules.pro to prevent R8 from stripping React Native and TurboModule symbols.',
          fix_code: `# android/app/proguard-rules.pro
-keep class com.facebook.react.** { *; }
-keep class com.facebook.jni.** { *; }
-keepclassmembers class * {
  @com.facebook.react.bridge.ReactMethod *;
}`,
        },
        content_blocks: [
          {
            id: 'b8-1-1',
            type: 'text',
            title: 'Native Extensions: Bridging Java/Kotlin & Swift',
            body: `Sometimes JavaScript libraries cannot fulfill low-level hardware needs:
- Custom BLE (Bluetooth Low Energy) peripheral negotiation.
- Biometric security hardware enclave encryption.
- Background location geofencing with OS power constraints.

In this stage, you build direct platform modules in **Kotlin (Android)** and **Swift (iOS)** adhering to TurboModule specifications.`,
          },
          {
            id: 'b8-1-2',
            type: 'code_comparison',
            title: 'Swift TurboModule Binding vs. Android Kotlin Module',
            mistakeLanguage: 'swift',
            mistakeCode: `// ❌ JUNIOR TRAP: Calling UI methods from background thread
@objc(LegacyDeviceModule)
class LegacyDeviceModule: NSObject {
  @objc func triggerVibration() {
    // ⚠️ Crashing bug: Accessing UIKit from non-main thread without dispatch
    let feedback = UINotificationFeedbackGenerator()
    feedback.notificationOccurred(.success)
  }
}`,
            mistakeExplanation:
              'Calling UIKit feedback generators or view managers off the main iOS thread causes random native SIGSEGV crashes.',
            solutionLanguage: 'swift',
            solutionCode: `// ✅ PRODUCTION PATTERN: Thread-Safe Swift Native Module
import Foundation
import UIKit

@objc(ProductionSecurityModule)
class ProductionSecurityModule: NSObject {
  
  @objc static func requiresMainQueueSetup() -> Bool {
    return true
  }

  @objc(authenticateBiometrics:rejecter:)
  func authenticateBiometrics(
    _ resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock
  ) {
    DispatchQueue.main.async {
      let feedback = UINotificationFeedbackGenerator()
      feedback.prepare()
      feedback.notificationOccurred(.success)
      resolve(["status": "authenticated", "timestamp": Date().timeIntervalSince1970])
    }
  }
}`,
            solutionExplanation:
              'Explicitly dispatches UIKit operations to the Main Queue and exposes typed Promise callbacks conforming to React Native protocols.',
          },
        ],
      },
    ],
  },
];
