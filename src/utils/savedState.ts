import { defaultFilters, type Filters, type HistoryEntry, type SavedState } from '../types';
export const emptyState = (): SavedState => ({ filters: { ...defaultFilters }, favorites: [], history: [] });
const object = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v);
export function sanitizeState(value: unknown, validIds: Set<string>): SavedState {
  const clean = emptyState();
  if (!object(value)) return clean;
  if (Array.isArray(value.favorites)) clean.favorites = [...new Set(value.favorites.filter((id): id is string => typeof id === 'string' && validIds.has(id)))];
  if (object(value.filters)) {
    const f = value.filters;
    if ([15, 30, 60, 120, null].includes(f.time as number | null)) clean.filters.time = f.time as Filters['time'];
    if ([0, 20, 50, null].includes(f.budget as number | null)) clean.filters.budget = f.budget as Filters['budget'];
    if (['casa', 'fora', 'todos'].includes(String(f.place))) clean.filters.place = f.place as Filters['place'];
    if (['sozinho', 'acompanhado', 'todos'].includes(String(f.company))) clean.filters.company = f.company as Filters['company'];
  }
  if (Array.isArray(value.history)) {
    const seen = new Set<string>();
    clean.history = value.history.filter((entry): entry is HistoryEntry => {
      if (!object(entry) || typeof entry.id !== 'string' || !entry.id || seen.has(entry.id)
        || typeof entry.activityId !== 'string' || !validIds.has(entry.activityId)
        || typeof entry.date !== 'string' || !/^\d{4}-\d{2}-\d{2}T/.test(entry.date) || !Number.isFinite(Date.parse(entry.date))) return false;
      seen.add(entry.id); return true;
    }).sort((a, b) => Date.parse(b.date) - Date.parse(a.date));
  }
  return clean;
}
