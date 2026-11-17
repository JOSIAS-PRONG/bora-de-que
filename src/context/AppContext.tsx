import React, { createContext, useEffect, useRef, useState, type PropsWithChildren } from 'react';
import { activityById } from '../data/activities';
import { defaultFilters } from '../types';
import { drawActivity } from '../utils/activities';
import type { Activity, Filters, AppState } from '../types';
import { loadPreferences, savePreferences } from '../services/preferences';
import { listHistory, insertHistory, deleteHistory, updateHistoryPhoto } from '../services/history';
import { removePhoto } from '../services/photos';

type AppContextValue = AppState & {
  ready: boolean; loading: boolean; error: string | null;
  retry: () => void; dismissError: () => void;
  setFilters: (filters: Filters) => void; toggleFavorite: (id: string) => void;
  complete: (id: string) => Promise<boolean>; removeEntry: (id: string) => Promise<boolean>;
  attachPhoto: (id: string, path: string) => Promise<boolean>;
  draw: (candidates: Activity[]) => Activity | undefined;
};
export const AppContext = createContext<AppContextValue | undefined>(undefined);
export function AppProvider({ children }: PropsWithChildren) {
  const [state, setState] = useState<AppState>(() => ({ filters: { ...defaultFilters }, favorites: [], history: [] }));
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);
  const current = useRef(state);
  const lastDraw = useRef<string | undefined>(undefined);
  const lastCompletion = useRef(new Map<string, number>());
  const completing = useRef(new Set<string>());
  const sequence = useRef(0);
  const writes = useRef<Promise<unknown>>(Promise.resolve());

  useEffect(() => {
    let active = true;
    setLoading(true); setError(null);
    Promise.all([loadPreferences(), listHistory()]).then(([preferences, history]) => {
      if (!active) return;
      const next = { ...preferences, history };
      current.current = next; setState(next); setReady(true);
    }).catch(() => {
      if (active) setError('Não foi possível abrir os dados ou migrar o histórico. Os dados originais foram preservados. Tente novamente.');
    }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [attempt]);

  function updatePreferences(transform: (previous: AppState) => AppState) {
    if (!ready) return;
    const next = transform(current.current);
    current.current = next; setState(next);
    void savePreferences(next).catch(() => setError('Não foi possível salvar suas preferências. A mudança pode não permanecer ao reabrir.'));
  }
  // Serialize database mutations and reload from SQLite, the only source of history.
  function mutateHistory(action: () => Promise<void>): Promise<boolean> {
    const next = writes.current.catch(() => undefined).then(async () => {
      try {
        await action();
        const history = await listHistory();
        current.current = { ...current.current, history }; setState(current.current);
        return true;
      } catch {
        setError('Não foi possível atualizar o histórico. Confira os registros antes de tentar novamente.');
        return false;
      }
    });
    writes.current = next;
    return next;
  }
  async function complete(id: string) {
    if (!ready || !activityById.has(id) || completing.current.has(id)) return false;
    const now = Date.now();
    if (now - (lastCompletion.current.get(id) ?? 0) < 2000) return false;
    completing.current.add(id);
    const ok = await mutateHistory(() => insertHistory({ id: `${now}-${++sequence.current}-${Math.random().toString(36).slice(2, 9)}`, activityId: id, date: new Date(now).toISOString() }));
    completing.current.delete(id);
    if (ok) lastCompletion.current.set(id, Date.now());
    return ok;
  }
  const value: AppContextValue = {
    ...state, ready, loading, error,
    retry: () => setAttempt(n => n + 1), dismissError: () => setError(null),
    setFilters: filters => updatePreferences(s => ({ ...s, filters })),
    toggleFavorite: id => { if (activityById.has(id)) updatePreferences(s => ({ ...s, favorites: s.favorites.includes(id) ? s.favorites.filter(f => f !== id) : [...s.favorites, id] })); },
    complete,
    removeEntry: id => mutateHistory(async () => {
      const oldPhoto = current.current.history.find(h => h.id === id)?.photoUri;
      await deleteHistory(id); removePhoto(oldPhoto);
    }),
    attachPhoto: (id, path) => mutateHistory(async () => {
      const oldPhoto = current.current.history.find(h => h.id === id)?.photoUri;
      try { await updateHistoryPhoto(id, path); }
      catch (error) { removePhoto(path); throw error; }
      removePhoto(oldPhoto);
    }),
    draw: candidates => { const chosen = drawActivity(candidates, lastDraw.current); if (chosen) lastDraw.current = chosen.id; return chosen; },
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
