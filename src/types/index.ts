import type { ImageSourcePropType } from 'react-native';
export const categories = ['Relaxar', 'Criar', 'Aprender', 'Movimentar', 'Socializar', 'Organizar', 'Cozinhar'] as const;
export type Category = typeof categories[number];
export type Place = 'casa' | 'fora';
export type Company = 'sozinho' | 'acompanhado';
export type Activity = {
  id: string; title: string; description: string; category: Category;
  duration: number; cost: number; places: Place[]; company: Company[];
  image: ImageSourcePropType; materials: string[]; steps: string[];
};
export type Filters = { time: number | null; budget: number | null; place: Place | 'todos'; company: Company | 'todos' };
export type HistoryEntry = { id: string; activityId: string; date: string };
export type AppState = { filters: Filters; favorites: string[]; history: HistoryEntry[] };
export const defaultFilters: Filters = { time: 60, budget: 0, place: 'todos', company: 'todos' };
