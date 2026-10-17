import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from './supabase';

const PROGRESS_STORAGE_KEY = 'rn_architect_mastered_topics';

export function useTopicProgress() {
  const [completedTopicIds, setCompletedTopicIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(PROGRESS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    async function syncFromSupabase() {
      if (!isSupabaseConfigured) return;
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        if (!sessionData.session) return;

        const { data, error } = await supabase
          .from('user_progress')
          .select('topic_id');

        if (!error && data) {
          const idsFromDb = data.map((item: any) => item.topic_id);
          setCompletedTopicIds((prev) => {
            const merged = Array.from(new Set([...prev, ...idsFromDb]));
            localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(merged));
            return merged;
          });
        }
      } catch (err) {
        console.warn('Progress sync warning:', err);
      }
    }

    syncFromSupabase();
  }, []);

  const toggleTopicMastery = async (topicId: string): Promise<boolean> => {
    const isCompleted = completedTopicIds.includes(topicId);
    let updated: string[];

    if (isCompleted) {
      updated = completedTopicIds.filter((id) => id !== topicId);
    } else {
      updated = [...completedTopicIds, topicId];
    }

    setCompletedTopicIds(updated);
    localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(updated));

    // Sync to Supabase if authenticated
    if (isSupabaseConfigured) {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        if (sessionData.session?.user) {
          if (isCompleted) {
            await supabase
              .from('user_progress')
              .delete()
              .eq('topic_id', topicId)
              .eq('user_id', sessionData.session.user.id);
          } else {
            await supabase
              .from('user_progress')
              .insert({
                topic_id: topicId,
                user_id: sessionData.session.user.id,
              } as any);
          }
        }
      } catch (err) {
        console.warn('Could not sync progress to Supabase:', err);
      }
    }

    return !isCompleted;
  };

  const isTopicMastered = (topicId: string) => completedTopicIds.includes(topicId);

  return {
    completedTopicIds,
    masteredCount: completedTopicIds.length,
    toggleTopicMastery,
    isTopicMastered,
  };
}
