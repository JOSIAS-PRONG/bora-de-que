import React, { createContext, useRef, useState, type PropsWithChildren } from 'react';
import { activityById } from '../data/activities';
import { defaultFilters } from '../types';
import { drawActivity } from '../utils/activities';
import type { Activity, Filters, AppState } from '../types';
type AppContextValue = AppState & {
  setFilters: (filters: Filters) => void; toggleFavorite: (id: string) => void;
  complete: (id: string) => boolean; removeEntry: (id: string) => void;
  draw: (candidates: Activity[]) => Activity | undefined;
};
export const AppContext = createContext<AppContextValue | undefined>(undefined);
export function AppProvider({ children }: PropsWithChildren) {
  const [state, setState] = useState<AppState>(() => ({ filters: { ...defaultFilters }, favorites: [], history: [] }));
  const current = useRef(state);
  const lastDraw = useRef<string | undefined>(undefined);
  const lastCompletion = useRef(new Map<string, number>());
  const sequence = useRef(0);
  function update(transform: (previous: AppState) => AppState) {
    const next = transform(current.current);
    current.current = next;
    setState(next);
  }
  function complete(id: string) {
    if (!activityById.has(id)) return false;
    const now = Date.now();
    if (now - (lastCompletion.current.get(id) ?? 0) < 2000) return false;
    lastCompletion.current.set(id, now);
    update(s => ({ ...s, history: [{ id: `${now}-${++sequence.current}-${Math.random().toString(36).slice(2, 9)}`, activityId: id, date: new Date(now).toISOString() }, ...s.history] }));
    return true;
  }
  const value: AppContextValue = {
    ...state,
    setFilters: filters => update(s => ({ ...s, filters })),
    toggleFavorite: id => { if (activityById.has(id)) update(s => ({ ...s, favorites: s.favorites.includes(id) ? s.favorites.filter(f => f !== id) : [...s.favorites, id] })); },
    complete, removeEntry: id => update(s => ({ ...s, history: s.history.filter(entry => entry.id !== id) })),
    draw: candidates => { const chosen = drawActivity(candidates, lastDraw.current); if (chosen) lastDraw.current = chosen.id; return chosen; },
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
