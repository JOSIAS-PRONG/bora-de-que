import type { Activity, Category, Filters } from '../types';
export const normalize = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('pt-BR').trim();
export function filterActivities(activities: Activity[], filters: Filters): Activity[] {
  return activities.filter(a => (filters.time === null || a.duration <= filters.time)
    && (filters.budget === null || a.cost <= filters.budget)
    && (filters.place === 'todos' || a.places.includes(filters.place))
    && (filters.company === 'todos' || a.company.includes(filters.company)));
}
export function searchActivities(activities: Activity[], query: string, category?: Category): Activity[] {
  return activities.filter(a => normalize(a.title).includes(normalize(query)) && (!category || a.category === category));
}
export function drawActivity(activities: Activity[], lastId?: string, random = Math.random): Activity | undefined {
  const candidates = activities.length > 1 ? activities.filter(a => a.id !== lastId) : activities;
  return candidates.length ? candidates[Math.min(candidates.length - 1, Math.max(0, Math.floor(random() * candidates.length)))] : undefined;
}
export const price = (cost: number) => cost === 0 ? 'Grátis' : `R$ ${cost.toFixed(2).replace('.', ',')}`;
export const duration = (minutes: number) => minutes < 60 ? `${minutes} min` : `${Math.floor(minutes / 60)}h${minutes % 60 ? ` ${minutes % 60}min` : ''}`;
export function filterSummary(f: Filters) {
  return `${f.time === null ? 'Tempo livre' : `Até ${duration(f.time)}`} · ${f.budget === null ? 'Sem limite de custo' : f.budget === 0 ? 'Grátis' : `Até ${price(f.budget)}`} · ${f.place === 'todos' ? 'Qualquer lugar' : f.place === 'casa' ? 'Em casa' : 'Fora de casa'} · ${f.company === 'todos' ? 'Qualquer companhia' : f.company === 'sozinho' ? 'Sozinho' : 'Acompanhado'}`;
}
