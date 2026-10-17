import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Moon, Sun, Monitor, Check } from 'lucide-react';
import { useTheme, ThemePreference } from '../lib/themeContext';

interface ThemeSwitcherProps {
  variant?: 'compact' | 'segmented';
  className?: string;
}

export const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({
  variant = 'compact',
  className = '',
}) => {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownOpen]);

  const themeOptions: { value: ThemePreference; label: string; icon: React.ElementType }[] = [
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'system', label: 'System', icon: Monitor },
  ];

  const currentIcon =
    theme === 'system' ? Monitor : resolvedTheme === 'dark' ? Moon : Sun;
  const CurrentIconComponent = currentIcon;

  // Segmented variant for mobile drawer or wide settings
  if (variant === 'segmented') {
    return (
      <div
        className={`flex items-center p-1 rounded-xl bg-slate-200/80 dark:bg-black/60 border border-slate-300 dark:border-white/10 ${className}`}
      >
        {themeOptions.map((opt) => {
          const Icon = opt.icon;
          const isSelected = theme === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => setTheme(opt.value)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-mono font-semibold transition-all relative ${
                isSelected
                  ? 'text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {isSelected && (
                <motion.div
                  layoutId="segmentedThemePill"
                  className="absolute inset-0 rounded-lg bg-white dark:bg-emerald-950/90 border border-slate-300 dark:border-emerald-500/40"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-1">
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-emerald-600 dark:text-emerald-400' : ''}`} />
                <span>{opt.label}</span>
              </span>
            </button>
          );
        })}
      </div>
    );
  }

  // Compact dropdown variant for Desktop Navbar
  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <button
        type="button"
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center justify-center p-2 rounded-full border bg-white/80 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:border-emerald-500/40 dark:hover:border-emerald-500/40 transition-all shrink-0 active:scale-95 shadow-xs"
        title={`Current theme: ${theme} (${resolvedTheme}) - Click to toggle`}
        aria-label="Toggle theme"
      >
        <CurrentIconComponent className="w-3.5 h-3.5" />
      </button>

      <AnimatePresence>
        {dropdownOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-36 rounded-xl bg-white dark:bg-[#0d0d0d] border border-slate-200 dark:border-white/15 p-1.5 shadow-xl z-50 font-mono text-xs"
          >
            <div className="px-2 py-1 text-[10px] text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-100 dark:border-white/5 mb-1">
              Select Theme
            </div>
            {themeOptions.map((opt) => {
              const Icon = opt.icon;
              const isSelected = theme === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    setTheme(opt.value);
                    setDropdownOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition-colors ${
                    isSelected
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 font-bold'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Icon className="w-3.5 h-3.5" />
                    <span>{opt.label}</span>
                  </span>
                  {isSelected && <Check className="w-3 h-3 text-emerald-500" />}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
