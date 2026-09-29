import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { existsSync } from 'node:fs';
import type { Activity } from '../src/types';
import { categories } from '../src/types';
import { filterActivities } from '../src/utils/activities';
// Node does not load PNGs; validate their existence, then expose a numeric asset ID.
const require = createRequire(import.meta.url);
require.extensions['.png'] = (module, filename) => { assert.ok(existsSync(filename)); module.exports = 1; };
const { activities } = require('../src/data/activities') as { activities: Activity[] };
test('catálogo contém ao menos 24 atividades com IDs únicos', () => { assert.ok(activities.length >= 24); assert.equal(new Set(activities.map(a => a.id)).size, activities.length); });
test('todas as atividades têm conteúdo completo e dados válidos', () => {
  for (const a of activities) {
    assert.ok(a.id && a.title && a.description && a.image);
    assert.ok(categories.includes(a.category));
    assert.ok(a.duration > 0 && a.cost >= 0);
    assert.ok(a.places.length > 0 && a.places.every(p => ['casa', 'fora'].includes(p)));
    assert.ok(a.company.length > 0 && a.company.every(c => ['sozinho', 'acompanhado'].includes(c)));
    assert.ok(a.materials.length && a.steps.length >= 2);
  }
});
test('todas as categorias estão representadas', () => assert.equal(new Set(activities.map(a => a.category)).size, categories.length));
test('há opções curtas e gratuitas para cada combinação de ambiente e companhia', () => {
  for (const place of ['casa', 'fora'] as const) for (const company of ['sozinho', 'acompanhado'] as const) {
    assert.ok(filterActivities(activities, { time: 15, budget: 0, place, company }).length > 0);
  }
});
