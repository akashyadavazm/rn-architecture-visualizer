import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Shield, GraduationCap, CheckCircle2, Lock, Mail, Key, Sparkles, ArrowRight, UserCheck } from 'lucide-react';
import { useAuth, DEMO_USERS } from '../lib/authStore';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, isAdmin, loginAsDemo, loginWithCredentials, logout } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handle1ClickLogin = (role: 'admin' | 'student') => {
    loginAsDemo(role);
    setSuccessMsg(`Switched role to ${role === 'admin' ? 'Principal Mobile Architect' : 'Intern / Developer'}`);
    setTimeout(() => {
      setSuccessMsg(null);
      onClose();
    }, 900);
  };

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    const res = await loginWithCredentials(email, password);
    setLoading(false);

    if (res.success) {
      setSuccessMsg(`Successfully authenticated as ${email}`);
      setTimeout(() => {
        setSuccessMsg(null);
        onClose();
      }, 900);
    } else {
      setErrorMsg(res.error || 'Authentication error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-md"
      />

      {/* Modal Dialog Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-lg bg-[#0d0d0d] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.9)] z-10 space-y-6"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-5">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-semibold text-emerald-400 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Role-Based Access Console</span>
            </div>
            <h3 className="text-xl font-bold text-white tracking-tight mt-1">
              Select or Switch Role
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Test both roles to preview student learning vs principal architect capabilities.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-full bg-white/5 hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Current Active User Status */}
        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                isAdmin
                  ? 'bg-emerald-950/70 border-emerald-500/50 text-emerald-400'
                  : 'bg-cyan-950/70 border-cyan-500/50 text-cyan-400'
              }`}
            >
              {isAdmin ? <Shield className="w-5 h-5" /> : <GraduationCap className="w-5 h-5" />}
            </div>
            <div>
              <p className="text-xs font-mono text-slate-400">Currently Active:</p>
              <p className="text-sm font-bold text-white flex items-center gap-2">
                <span>{currentUser.email}</span>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                    isAdmin
                      ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                      : 'bg-cyan-950 text-cyan-400 border-cyan-800'
                  }`}
                >
                  {isAdmin ? '🛡️ Admin' : '🎓 Student'}
                </span>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              logout();
              setSuccessMsg('Reset to standard Student profile');
              setTimeout(() => setSuccessMsg(null), 1000);
            }}
            className="text-xs font-mono text-slate-400 hover:text-red-400 transition-colors"
          >
            Reset
          </button>
        </div>

        {/* Alerts */}
        {successMsg && (
          <div className="p-3 bg-emerald-950/40 border border-emerald-800/80 rounded-xl text-xs font-mono text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}
        {errorMsg && (
          <div className="p-3 bg-red-950/40 border border-red-800/80 rounded-xl text-xs font-mono text-red-300">
            {errorMsg}
          </div>
        )}

        {/* 1-Click Role Fill & Login Buttons */}
        <div className="space-y-3">
          <span className="text-xs font-mono uppercase text-slate-400 font-bold block">
            1-Click Test Credentials (Immediate Demo)
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Admin Preset */}
            <div
              onClick={() => handle1ClickLogin('admin')}
              className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                isAdmin
                  ? 'border-emerald-400/80 bg-emerald-950/30 ring-1 ring-emerald-400/30'
                  : 'border-white/10 bg-white/5 hover:border-emerald-500/40 hover:bg-white/[0.08]'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-400">
                  <Shield className="w-4 h-4" />
                  <span>Admin / Architect</span>
                </span>
                {isAdmin && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
              </div>
              <p className="text-xs font-bold text-white truncate">akashyadavazm@gmail.com</p>
              <p className="text-[11px] font-mono text-slate-400 mt-1">Key: Architect@2026</p>
              <div className="mt-3 pt-2 border-t border-white/5 text-[10px] text-emerald-400 font-mono flex items-center justify-between">
                <span>Full CMS & Stage Editing</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </div>

            {/* Student Preset */}
            <div
              onClick={() => handle1ClickLogin('student')}
              className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                !isAdmin
                  ? 'border-cyan-400/80 bg-cyan-950/30 ring-1 ring-cyan-400/30'
                  : 'border-white/10 bg-white/5 hover:border-cyan-500/40 hover:bg-white/[0.08]'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="flex items-center gap-1.5 text-xs font-mono font-bold text-cyan-400">
                  <GraduationCap className="w-4 h-4" />
                  <span>Student / Intern</span>
                </span>
                {!isAdmin && <CheckCircle2 className="w-4 h-4 text-cyan-400" />}
              </div>
              <p className="text-xs font-bold text-white truncate">intern@reactnative.dev</p>
              <p className="text-[11px] font-mono text-slate-400 mt-1">Key: Intern@2026</p>
              <div className="mt-3 pt-2 border-t border-white/5 text-[10px] text-cyan-400 font-mono flex items-center justify-between">
                <span>Personal Mastery & Simulators</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </div>
          </div>
        </div>

        {/* Manual Credentials Form */}
        <form onSubmit={handleManualSubmit} className="space-y-3 pt-2 border-t border-white/10">
          <span className="text-[11px] font-mono uppercase text-slate-400 font-semibold block">
            Or Sign In With Custom Account
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <div className="relative">
                <Mail className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-black/60 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 font-mono focus:outline-none focus:border-emerald-400"
                />
              </div>
            </div>

            <div>
              <div className="relative">
                <Key className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-black/60 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 font-mono focus:outline-none focus:border-emerald-400"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !email}
            className="w-full py-2.5 rounded-xl text-xs font-mono font-bold text-slate-950 bg-gradient-to-r from-emerald-400 to-cyan-400 hover:shadow-[0_0_20px_rgba(52,211,153,0.35)] transition-all disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Sign In with Account'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};
