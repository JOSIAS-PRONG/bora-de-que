import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SQLite from 'expo-sqlite';
import type { HistoryEntry } from '../types';
import { LEGACY_KEY } from './preferences';

let connection: Promise<SQLite.SQLiteDatabase> | undefined;
async function openDatabase() {
  const db = await SQLite.openDatabaseAsync('bora-de-que.db');
  try {
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS history (
        id TEXT PRIMARY KEY NOT NULL, activityId TEXT NOT NULL,
        date TEXT NOT NULL, photoUri TEXT
      );
      CREATE TABLE IF NOT EXISTS migrations (id TEXT PRIMARY KEY NOT NULL);
    `);
    const migrated = await db.getFirstAsync('SELECT id FROM migrations WHERE id = ?', 'asyncstorage-v1');
    if (!migrated) {
      const raw = await AsyncStorage.getItem(LEGACY_KEY);
      const legacy = raw ? JSON.parse(raw) : {};
      const entries: unknown = legacy.history ?? [];
      if (!Array.isArray(entries)) throw new Error('Histórico antigo inválido; dados originais preservados.');
      // Insert and marker commit together. A crash rolls back both; retries never duplicate IDs.
      await db.withTransactionAsync(async () => {
        for (const item of entries) {
          if (!item || typeof item.id !== 'string' || !item.id || typeof item.activityId !== 'string'
            || typeof item.date !== 'string' || !Number.isFinite(Date.parse(item.date))) {
            throw new Error('Registro antigo inválido; migração cancelada sem apagar dados.');
          }
          const existing = await db.getFirstAsync<HistoryEntry>('SELECT * FROM history WHERE id = ?', item.id);
          if (existing && (existing.activityId !== item.activityId || existing.date !== item.date)) {
            throw new Error('IDs conflitantes no histórico antigo; dados preservados.');
          }
          await db.runAsync('INSERT OR IGNORE INTO history (id, activityId, date, photoUri) VALUES (?, ?, ?, ?)',
            item.id, item.activityId, item.date, typeof item.photoUri === 'string' ? item.photoUri : null);
        }
        await db.runAsync('INSERT INTO migrations (id) VALUES (?)', 'asyncstorage-v1');
      });
    }
    // Keep the legacy value intact as a backup. Only SQLite is queried for history.
    return db;
  } catch (error) { await db.closeAsync(); throw error; }
}
function database() {
  if (!connection) connection = openDatabase().catch(error => { connection = undefined; throw error; });
  return connection;
}
export async function listHistory() {
  return (await database()).getAllAsync<HistoryEntry>('SELECT * FROM history ORDER BY date DESC, id DESC');
}
export async function insertHistory(entry: HistoryEntry) {
  await (await database()).runAsync('INSERT INTO history (id, activityId, date) VALUES (?, ?, ?)', entry.id, entry.activityId, entry.date);
}
export async function deleteHistory(id: string) {
  await (await database()).runAsync('DELETE FROM history WHERE id = ?', id);
}
export async function updateHistoryPhoto(id: string, photoUri: string) {
  const result = await (await database()).runAsync('UPDATE history SET photoUri = ? WHERE id = ?', photoUri, id);
  if (!result.changes) throw new Error('O registro não está mais no histórico.');
}
