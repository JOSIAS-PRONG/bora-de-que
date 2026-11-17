import AsyncStorage from '@react-native-async-storage/async-storage';
import { defaultFilters, type AppState } from '../types';

export const LEGACY_KEY = '@bora-de-que/state/v1';
const KEY = '@bora-de-que/preferences/v2';
type Preferences = Pick<AppState, 'filters' | 'favorites'>;

export async function loadPreferences(): Promise<Preferences> {
  const raw = await AsyncStorage.getItem(KEY) ?? await AsyncStorage.getItem(LEGACY_KEY);
  const value = raw ? JSON.parse(raw) : {};
  const f = value?.filters ?? {};
  return {
    favorites: Array.isArray(value?.favorites) ? [...new Set<string>(value.favorites.filter((id: unknown) => typeof id === 'string'))] : [],
    filters: {
      time: [null, 15, 30, 60, 120].includes(f.time) ? f.time : defaultFilters.time,
      budget: [null, 0, 20, 50].includes(f.budget) ? f.budget : defaultFilters.budget,
      place: ['casa', 'fora', 'todos'].includes(f.place) ? f.place : defaultFilters.place,
      company: ['sozinho', 'acompanhado', 'todos'].includes(f.company) ? f.company : defaultFilters.company,
    },
  };
}
let writes: Promise<void> = Promise.resolve();
export function savePreferences({ filters, favorites }: Preferences) {
  const json = JSON.stringify({ filters, favorites });
  const next = writes.catch(() => undefined).then(() => AsyncStorage.setItem(KEY, json));
  writes = next;
  return next;
}
