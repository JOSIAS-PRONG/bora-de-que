import AsyncStorage from '@react-native-async-storage/async-storage';
import type { SavedState } from '../types';
import { emptyState, sanitizeState } from '../utils/savedState';
export { emptyState } from '../utils/savedState';
export const STORAGE_KEY = '@bora-de-que/state/v1';
export async function loadState(validIds: Set<string>): Promise<SavedState> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  return raw === null ? emptyState() : sanitizeState(JSON.parse(raw), validIds);
}
// Serialize writes: an older, slower operation cannot overwrite newer changes.
let queue: Promise<void> = Promise.resolve();
export function saveState(state: SavedState): Promise<void> {
  const json = JSON.stringify(state);
  const write = queue.catch(() => undefined).then(() => AsyncStorage.setItem(STORAGE_KEY, json));
  queue = write;
  return write;
}
