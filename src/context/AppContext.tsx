import React, { createContext, useEffect, useRef, useState, type PropsWithChildren } from 'react';
import { activityById } from '../data/activities';
import { emptyState, loadState, saveState } from '../services/storage';
import { drawActivity } from '../utils/activities';
import type { Activity, Filters, SavedState } from '../types';
type AppContextValue = SavedState & {
  ready: boolean; error: string | null; dismissError: () => void;
  setFilters: (filters: Filters) => void; toggleFavorite: (id: string) => void;
  complete: (id: string) => boolean; removeEntry: (id: string) => void;
  draw: (candidates: Activity[]) => Activity | undefined;
};
export const AppContext = createContext<AppContextValue | undefined>(undefined);
export function AppProvider({ children }: PropsWithChildren) {
  const [state, setState] = useState<SavedState>(emptyState);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const current = useRef(state);
  const lastDraw = useRef<string | undefined>(undefined);
  const lastCompletion = useRef(new Map<string, number>());
  const sequence = useRef(0);
  useEffect(() => {
    let active = true;
    loadState(new Set(activityById.keys())).then(saved => {
      if (active) { current.current = saved; setState(saved); }
    }).catch(() => { if (active) setError('Não foi possível recuperar os dados salvos. Você pode continuar usando o aplicativo.'); })
      .finally(() => { if (active) setReady(true); });
    return () => { active = false; };
  }, []);
  // Persist only user mutations, never the initial/default render or hydration.
  function update(transform: (previous: SavedState) => SavedState) {
    if (!ready) return;
    const next = transform(current.current);
    current.current = next;
    setState(next);
    void saveState(next).catch(() => setError('Não foi possível salvar. Esta mudança pode não ser mantida ao reabrir o aplicativo.'));
  }
  function complete(id: string) {
    if (!ready || !activityById.has(id)) return false;
    const now = Date.now();
    if (now - (lastCompletion.current.get(id) ?? 0) < 2000) return false;
    lastCompletion.current.set(id, now);
    update(s => ({ ...s, history: [{ id: `${now}-${++sequence.current}-${Math.random().toString(36).slice(2, 9)}`, activityId: id, date: new Date(now).toISOString() }, ...s.history] }));
    return true;
  }
  const value: AppContextValue = {
    ...state, ready, error, dismissError: () => setError(null),
    setFilters: filters => update(s => ({ ...s, filters })),
    toggleFavorite: id => { if (activityById.has(id)) update(s => ({ ...s, favorites: s.favorites.includes(id) ? s.favorites.filter(f => f !== id) : [...s.favorites, id] })); },
    complete, removeEntry: id => update(s => ({ ...s, history: s.history.filter(entry => entry.id !== id) })),
    draw: candidates => { const chosen = drawActivity(candidates, lastDraw.current); if (chosen) lastDraw.current = chosen.id; return chosen; },
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
