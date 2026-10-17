import { useState, useEffect } from 'react';
import { CurrentUser, UserRole } from '../types';
import { supabase, isSupabaseConfigured } from './supabase';

const AUTH_STORAGE_KEY = 'rn_architecture_auth_user';

export const DEMO_USERS: Record<UserRole, CurrentUser> = {
  admin: {
    id: 'usr-admin-akash',
    email: 'akashyadavazm@gmail.com',
    full_name: 'Akash Yadav (Principal Architect)',
    role: 'admin',
    isDemo: true,
  },
  student: {
    id: 'usr-student-intern',
    email: 'intern@reactnative.dev',
    full_name: 'Dev Intern / Student',
    role: 'student',
    isDemo: true,
  },
};

// Global listener pattern for instant reactivity across components
let globalUser: CurrentUser = (() => {
  try {
    const saved = localStorage.getItem(AUTH_STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    // ignore
  }
  // Default to student/learner for new visitors so they have immediate learner capability
  return DEMO_USERS.student;
})();

const listeners = new Set<(user: CurrentUser) => void>();

function notify(user: CurrentUser) {
  globalUser = user;
  try {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
  } catch (e) {
    // ignore
  }
  listeners.forEach((listener) => listener(user));
}

export function useAuth() {
  const [currentUser, setCurrentUser] = useState<CurrentUser>(globalUser);

  useEffect(() => {
    const listener = (user: CurrentUser) => setCurrentUser(user);
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  // Sync Supabase Auth session if available
  useEffect(() => {
    if (!isSupabaseConfigured) return;

    async function checkSupabaseSession() {
      try {
        const { data } = await supabase.auth.getSession();
        if (data.session?.user) {
          const userEmail = data.session.user.email || '';
          const role: UserRole = userEmail === 'akashyadavazm@gmail.com' ? 'admin' : 'student';
          notify({
            id: data.session.user.id,
            email: userEmail,
            full_name:
              (data.session.user.user_metadata?.full_name as string) ||
              (role === 'admin' ? 'Akash Yadav (Principal Architect)' : 'RN Developer'),
            role,
            isDemo: false,
          });
        }
      } catch (err) {
        console.warn('Supabase auth session check failed:', err);
      }
    }

    checkSupabaseSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const userEmail = session.user.email || '';
        const role: UserRole = userEmail === 'akashyadavazm@gmail.com' ? 'admin' : 'student';
        notify({
          id: session.user.id,
          email: userEmail,
          full_name:
            (session.user.user_metadata?.full_name as string) ||
            (role === 'admin' ? 'Akash Yadav (Principal Architect)' : 'RN Developer'),
          role,
          isDemo: false,
        });
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const loginAsDemo = (role: UserRole) => {
    notify(DEMO_USERS[role]);
  };

  const loginWithCredentials = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    const trimmedEmail = email.trim().toLowerCase();

    // Check for demo presets directly
    if (trimmedEmail === 'akashyadavazm@gmail.com') {
      notify(DEMO_USERS.admin);
      return { success: true };
    }

    if (trimmedEmail === 'intern@reactnative.dev') {
      notify(DEMO_USERS.student);
      return { success: true };
    }

    // Attempt live Supabase Auth if configured
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: trimmedEmail,
          password: pass,
        });
        if (error) {
          return { success: false, error: error.message };
        }
        if (data.user) {
          const role: UserRole = trimmedEmail === 'akashyadavazm@gmail.com' ? 'admin' : 'student';
          notify({
            id: data.user.id,
            email: trimmedEmail,
            full_name: (data.user.user_metadata?.full_name as string) || trimmedEmail.split('@')[0],
            role,
            isDemo: false,
          });
          return { success: true };
        }
      } catch (e: any) {
        return { success: false, error: e.message || 'Supabase authentication failed' };
      }
    }

    // Default fallback to custom student
    notify({
      id: `usr-${Date.now()}`,
      email: trimmedEmail,
      full_name: trimmedEmail.split('@')[0],
      role: trimmedEmail === 'akashyadavazm@gmail.com' ? 'admin' : 'student',
      isDemo: true,
    });
    return { success: true };
  };

  const logout = async () => {
    if (isSupabaseConfigured) {
      try {
        await supabase.auth.signOut();
      } catch (e) {
        // ignore
      }
    }
    // Switch to clean student profile
    notify(DEMO_USERS.student);
  };

  return {
    currentUser,
    isAdmin: currentUser.role === 'admin',
    isStudent: currentUser.role === 'student',
    loginAsDemo,
    loginWithCredentials,
    logout,
  };
}
