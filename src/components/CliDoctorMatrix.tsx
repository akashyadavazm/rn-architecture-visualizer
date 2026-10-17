import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Terminal,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Copy,
  Check,
  Play,
  RotateCcw,
  Sparkles,
  Apple,
  Monitor,
  Laptop,
  Smartphone,
  ShieldAlert,
} from 'lucide-react';

type HostOS = 'macos-arm' | 'macos-intel' | 'windows' | 'linux';
type TargetPlatform = 'android' | 'ios' | 'both';

interface DiagnosticCheck {
  id: string;
  name: string;
  category: 'node' | 'android' | 'ios' | 'system';
  status: 'passed' | 'warning' | 'error';
  version: string;
  details: string;
  fixCommand?: string;
}

export const CliDoctorMatrix: React.FC = () => {
  const [hostOS, setHostOS] = useState<HostOS>('macos-arm');
  const [targetPlatform, setTargetPlatform] = useState<TargetPlatform>('both');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Diagnostic Simulator State
  const [isDiagnosing, setIsDiagnosing] = useState(false);
  const [hasDiagnosed, setHasDiagnosed] = useState(false);
  const [activeCheckIndex, setActiveCheckIndex] = useState(-1);
  const [simulatedChecks, setSimulatedChecks] = useState<DiagnosticCheck[]>([]);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Adjust platform if switching to Windows/Linux
  const handleOSChange = (newOS: HostOS) => {
    setHostOS(newOS);
    if ((newOS === 'windows' || newOS === 'linux') && targetPlatform === 'ios') {
      setTargetPlatform('android');
    }
  };

  const getScripts = () => {
    if (hostOS === 'macos-arm' || hostOS === 'macos-intel') {
      const isBoth = targetPlatform === 'both';
      const isIos = targetPlatform === 'ios' || isBoth;
      return {
        packageManager: 'Homebrew (macOS)',
        installCmd: `# 1. Install Node.js, Watchman, and Zulu OpenJDK 17
brew install node watchman
brew install --cask zulu@17

${isIos ? '# 2. iOS Toolchain: CocoaPods and Xcode Command Line Tools\nsudo gem install cocoapods\nxcode-select --install' : ''}

# 3. Verify toolchain installation
node -v && watchman -v && javac -version`,
        envVars: `# Add to ~/.zshrc (or ~/.bash_profile)
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
export PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin

# Azul Zulu OpenJDK 17
export JAVA_HOME=/Library/Java/JavaVirtualMachines/zulu-17.jdk/Contents/Home
export PATH=$JAVA_HOME/bin:$PATH`,
        doctorCmd: 'npx @react-native-community/cli doctor',
        verifyCmd: 'npx react-native start --reset-cache',
      };
    }

    if (hostOS === 'windows') {
      return {
        packageManager: 'Chocolatey / Scoop (Windows 10/11)',
        installCmd: `# Run PowerShell as Administrator:
choco install -y nodejs-lts microsoft-openjdk17 python

# Note: iOS simulator & builds require macOS host.
# For Android: install Android Studio from https://developer.android.com/studio`,
        envVars: `# Windows System Environment Variables (Run in Admin PowerShell):
[Environment]::SetEnvironmentVariable("ANDROID_HOME", "$env:LOCALAPPDATA\\Android\\Sdk", "User")
[Environment]::SetEnvironmentVariable("JAVA_HOME", "C:\\Program Files\\Microsoft\\jdk-17.0.12.7-hotspot", "Machine")
# Add platform-tools to PATH:
$oldPath = [Environment]::GetEnvironmentVariable("PATH", "User")
[Environment]::SetEnvironmentVariable("PATH", "$oldPath;$env:LOCALAPPDATA\\Android\\Sdk\\platform-tools", "User")`,
        doctorCmd: 'npx react-native doctor',
        verifyCmd: 'npx react-native run-android',
      };
    }

    // Linux
    return {
      packageManager: 'APT / Snap (Ubuntu / Debian)',
      installCmd: `# 1. Install Node 20 LTS and OpenJDK 17
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs openjdk-17-jdk git

# 2. Increase Watchman inotify limits for deep file watching
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.d/99-watchman.conf && sudo sysctl -p`,
      envVars: `# Add to ~/.bashrc or ~/.zshrc
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
export PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin

export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
export PATH=$JAVA_HOME/bin:$PATH`,
      doctorCmd: 'npx react-native doctor',
      verifyCmd: 'npx react-native run-android',
    };
  };

  const scripts = getScripts();

  // Run Simulated Diagnostics
  const runDiagnostics = () => {
    setIsDiagnosing(true);
    setHasDiagnosed(false);
    setActiveCheckIndex(0);

    const baseChecks: DiagnosticCheck[] = [
      {
        id: 'node',
        name: 'Node.js Runtime',
        category: 'node',
        status: 'passed',
        version: 'v20.18.0 (LTS)',
        details: 'Supported Node release satisfies requirement >= 18.0.0',
      },
      {
        id: 'watchman',
        name: 'Watchman File Watcher',
        category: 'system',
        status: hostOS === 'windows' ? 'passed' : 'passed',
        version: 'v2024.10.14.00',
        details: 'Inotify watches initialized without descriptor leaks',
      },
      {
        id: 'jdk',
        name: 'JDK Runtime Environment',
        category: 'android',
        status: 'passed',
        version: 'OpenJDK 17.0.12 (Zulu)',
        details: 'Satisfies Gradle 8.x JVM requirements. JAVA_HOME valid',
      },
      {
        id: 'android-sdk',
        name: 'Android SDK Platform 34',
        category: 'android',
        status: 'passed',
        version: 'API 34 (Android 14)',
        details: 'build-tools 34.0.0 and platform-tools 35.0.1 located in ANDROID_HOME',
      },
      {
        id: 'ndk',
        name: 'Android NDK Toolchain',
        category: 'android',
        status: 'warning',
        version: '26.1.10909125 missing',
        details: 'C++ Fabric CMake build may fallback or trigger slow JNI compilation',
        fixCommand: '$ANDROID_HOME/cmdline-tools/latest/bin/sdkmanager "ndk;26.1.10909125"',
      },
    ];

    if (hostOS.startsWith('macos') && (targetPlatform === 'ios' || targetPlatform === 'both')) {
      baseChecks.push(
        {
          id: 'xcode',
          name: 'Xcode Command Line Tools',
          category: 'ios',
          status: 'passed',
          version: '15.4 (15F31d)',
          details: 'Clang compiler & SDKs found at /Applications/Xcode.app',
        },
        {
          id: 'cocoapods',
          name: 'CocoaPods Dependency Manager',
          category: 'ios',
          status: 'passed',
          version: '1.15.2',
          details: 'Podfile.lock resolver ready with CDN trunk repo',
        }
      );
    }

    setSimulatedChecks(baseChecks);

    let current = 0;
    const interval = setInterval(() => {
      current++;
      if (current >= baseChecks.length) {
        clearInterval(interval);
        setIsDiagnosing(false);
        setHasDiagnosed(true);
        setActiveCheckIndex(-1);
      } else {
        setActiveCheckIndex(current);
      }
    }, 380);
  };

  return (
    <div className="my-8 rounded-2xl bg-white dark:bg-[#0d0d0d]/90 border border-slate-200 dark:border-white/10 p-5 sm:p-7 shadow-xl dark:shadow-2xl relative overflow-hidden transition-colors duration-150 text-slate-900 dark:text-white">
      {/* Glow highlight */}
      <div className="absolute -top-24 -right-24 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-500/30 text-[11px] font-mono font-semibold">
              CLI Toolchain Hub
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">React Native 0.76+</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Terminal className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            Environment Matrix & Doctor Diagnostics
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-2xl font-normal">
            Select your development machine OS and target mobile platform to generate verified setup scripts and run an in-browser diagnostic scan.
          </p>
        </div>

        {/* Doctor Trigger */}
        <div className="shrink-0">
          <button
            type="button"
            onClick={runDiagnostics}
            disabled={isDiagnosing}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-bold text-xs uppercase tracking-wider hover:opacity-95 active:scale-95 transition-all shadow-[0_0_20px_rgba(52,211,153,0.3)] disabled:opacity-50"
          >
            {isDiagnosing ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                >
                  <RotateCcw className="w-4 h-4" />
                </motion.div>
                <span>Diagnosing Toolchain...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Run Doctor Simulator</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Selectors Grid: Spacious 2-Column layout to eliminate card overflow */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 py-6 border-b border-slate-200 dark:border-white/10 relative z-10">
        {/* Host OS Selector */}
        <div className="space-y-2">
          <label className="block text-xs font-mono font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            1. Select Host Machine OS
          </label>
          <div className="grid grid-cols-2 gap-3">
            {[
              { id: 'macos-arm', title: 'macOS', sub: 'Apple Silicon (M1–M4)', icon: Apple },
              { id: 'macos-intel', title: 'macOS', sub: 'Intel (x86_64)', icon: Apple },
              { id: 'windows', title: 'Windows', sub: 'Windows 10 / 11 (PowerShell)', icon: Monitor },
              { id: 'linux', title: 'Linux', sub: 'Ubuntu / Debian (APT)', icon: Laptop },
            ].map((os) => {
              const Icon = os.icon;
              const isSelected = hostOS === os.id;
              return (
                <button
                  key={os.id}
                  type="button"
                  onClick={() => handleOSChange(os.id as HostOS)}
                  className={`min-w-0 p-3.5 break-words rounded-xl border text-left transition-all flex flex-col justify-between gap-2.5 ${
                    isSelected
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-slate-900 dark:text-white shadow-sm dark:shadow-[0_0_15px_rgba(52,211,153,0.2)] ring-1 ring-emerald-500/40'
                      : 'bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/[0.08]'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <Icon className={`w-4 h-4 ${isSelected ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`} />
                    {isSelected && <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />}
                  </div>
                  <div>
                    <div className="text-xs font-bold leading-tight text-slate-900 dark:text-white">{os.title}</div>
                    <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 leading-tight mt-0.5">{os.sub}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Target Platform Selector */}
        <div className="space-y-2">
          <label className="block text-xs font-mono font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            2. Select Target Platform
          </label>
          <div className="grid grid-cols-2 gap-3">
            {[
              { id: 'android', title: 'Android', sub: 'APK, AAB & NDK' },
              { id: 'ios', title: 'iOS', sub: 'Simulator & CocoaPods', disabled: hostOS === 'windows' || hostOS === 'linux' },
              { id: 'both', title: 'Universal', sub: 'Android & iOS Toolchain', disabled: hostOS === 'windows' || hostOS === 'linux', fullWidth: true },
            ].map((plat) => {
              const isSelected = targetPlatform === plat.id;
              return (
                <button
                  key={plat.id}
                  type="button"
                  disabled={plat.disabled}
                  onClick={() => setTargetPlatform(plat.id as TargetPlatform)}
                  className={`min-w-0 p-3.5 break-words rounded-xl border text-left transition-all flex flex-col justify-between gap-1.5 ${
                    plat.fullWidth ? 'col-span-2' : ''
                  } ${
                    plat.disabled
                      ? 'opacity-40 cursor-not-allowed bg-slate-100 dark:bg-black/40 border-slate-200 dark:border-white/5 text-slate-400 dark:text-slate-600'
                      : isSelected
                      ? 'bg-cyan-50 dark:bg-cyan-950/60 border-cyan-500 text-slate-900 dark:text-white shadow-sm dark:shadow-[0_0_15px_rgba(6,182,212,0.2)] ring-1 ring-cyan-500/40'
                      : 'bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/[0.08]'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-xs font-bold leading-tight text-slate-900 dark:text-white">{plat.title}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />}
                  </div>
                  <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                    {plat.disabled ? 'Requires macOS Host' : plat.sub}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Diagnostic Simulator Output (if run or running) */}
      <AnimatePresence>
        {(isDiagnosing || hasDiagnosed) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="my-5 p-4 rounded-xl bg-slate-950 text-slate-100 border border-slate-800 dark:border-white/15 overflow-hidden font-mono shadow-inner"
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/10 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-slate-200 font-bold">npx react-native doctor simulation</span>
              </div>
              <span className="text-slate-400 text-[11px]">
                Target: {hostOS.toUpperCase()} → {targetPlatform.toUpperCase()}
              </span>
            </div>

            <div className="space-y-2.5 pt-3">
              {simulatedChecks.map((chk, idx) => {
                const isActive = activeCheckIndex === idx;
                const isPending = isDiagnosing && idx > activeCheckIndex;
                return (
                  <div
                    key={chk.id}
                    className={`p-2.5 rounded-lg border text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 transition-all ${
                      isActive
                        ? 'bg-emerald-950/40 border-emerald-500/50 scale-[1.01]'
                        : isPending
                        ? 'opacity-40 bg-white/[0.02] border-white/5'
                        : chk.status === 'warning'
                        ? 'bg-amber-950/30 border-amber-500/30'
                        : 'bg-white/[0.03] border-white/10'
                    }`}
                  >
                    <div className="flex items-start gap-2.5 min-w-0">
                      {isPending ? (
                        <div className="w-4 h-4 rounded-full border-2 border-slate-600 border-t-transparent animate-spin shrink-0 mt-0.5" />
                      ) : chk.status === 'passed' ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      ) : chk.status === 'warning' ? (
                        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                      )}
                      <div className="min-w-0">
                        <div className="font-semibold text-slate-100 flex items-center gap-2 flex-wrap">
                          <span>{chk.name}</span>
                          <span className="text-[10px] text-slate-400 bg-white/5 px-1.5 py-0.2 rounded truncate">
                            {chk.version}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5 break-words">{chk.details}</p>
                      </div>
                    </div>

                    {chk.fixCommand && (
                      <div className="shrink-0 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleCopy(chk.fixCommand || '', chk.id)}
                          className="px-2.5 py-1 rounded-md bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-[10px] flex items-center gap-1.5 transition-all"
                        >
                          {copiedKey === chk.id ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                          <span>Copy Fix</span>
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {hasDiagnosed && (
              <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
                <span className="text-emerald-400 font-bold">✔ System scan complete: 4 Passed, 1 Recommended Fix</span>
                <button
                  type="button"
                  onClick={() => setHasDiagnosed(false)}
                  className="text-slate-400 hover:text-white underline"
                >
                  Dismiss
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Terminal Script Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-5 relative z-10">
        {/* Card 1: Toolchain Installation */}
        <div className="rounded-xl bg-slate-950 text-slate-100 border border-slate-800 dark:border-white/10 p-4 flex flex-col justify-between shadow-md">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
              <Terminal className="w-3.5 h-3.5 text-emerald-400" />
              <span>Toolchain Setup Commands ({scripts.packageManager})</span>
            </div>
            <button
              type="button"
              onClick={() => handleCopy(scripts.installCmd, 'install')}
              className="text-slate-400 hover:text-emerald-400 transition-colors p-1"
              title="Copy commands"
            >
              {copiedKey === 'install' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
          <pre className="font-mono text-xs text-emerald-300/90 whitespace-pre-wrap overflow-x-auto py-3 leading-relaxed">
            {scripts.installCmd}
          </pre>
          <div className="text-[11px] font-mono text-slate-400 pt-2 border-t border-white/5">
            Tip: Run in terminal or PowerShell as administrator
          </div>
        </div>

        {/* Card 2: Environment Variables */}
        <div className="rounded-xl bg-slate-950 text-slate-100 border border-slate-800 dark:border-white/10 p-4 flex flex-col justify-between shadow-md">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Required Shell Environment Exports</span>
            </div>
            <button
              type="button"
              onClick={() => handleCopy(scripts.envVars, 'env')}
              className="text-slate-400 hover:text-cyan-400 transition-colors p-1"
              title="Copy environment exports"
            >
              {copiedKey === 'env' ? <Check className="w-3.5 h-3.5 text-cyan-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
          <pre className="font-mono text-xs text-cyan-300/90 whitespace-pre-wrap overflow-x-auto py-3 leading-relaxed">
            {scripts.envVars}
          </pre>
          <div className="text-[11px] font-mono text-slate-400 pt-2 border-t border-white/5">
            After editing, run: <code className="text-white">source ~/.zshrc</code>
          </div>
        </div>
      </div>
    </div>
  );
};
