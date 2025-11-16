// src/storage/localDb.ts
import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase("local.db");

// Initialize both tables: items + pending queue
export function initDb() {
  db.transaction(tx => {
    tx.executeSql(
      "CREATE TABLE IF NOT EXISTS items (id INTEGER PRIMARY KEY, name TEXT, synced INTEGER);"
    );
    tx.executeSql(
      "CREATE TABLE IF NOT EXISTS pending (id INTEGER PRIMARY KEY AUTOINCREMENT, itemId INTEGER, name TEXT, action TEXT);"
    );
  });
}

// ---------------- Items Table ----------------
export function getLocalData(callback: (rows: any[]) => void) {
  db.transaction(tx => {
    tx.executeSql("SELECT * FROM items;", [], (_, { rows }) => {
      callback(rows._array);
    });
  });
}

export function saveDataLocally(items: any[]) {
  db.transaction(tx => {
    tx.executeSql("DELETE FROM items;");
    items.forEach(item => {
      tx.executeSql("INSERT INTO items (id, name, synced) VALUES (?, ?, 1);", [
        item.id,
        item.name,
      ]);
    });
  });
}

export function markUnsyncedChange(item: { id: number; name: string }) {
  db.transaction(tx => {
    tx.executeSql("INSERT OR REPLACE INTO items (id, name, synced) VALUES (?, ?, 0);", [
      item.id,
      item.name,
    ]);
  });
}

// ---------------- Pending Queue ----------------
export function queueChange(item: { id: number; name: string }, action: string) {
  db.transaction(tx => {
    tx.executeSql("INSERT INTO pending (itemId, name, action) VALUES (?, ?, ?);", [
      item.id,
      item.name,
      action,
    ]);
  });
}

export function getPendingChanges(): Promise<any[]> {
  return new Promise(resolve => {
    db.transaction(tx => {
      tx.executeSql("SELECT * FROM pending;", [], (_, { rows }) => {
        resolve(rows._array);
      });
    });
  });
}

export function clearPendingChange(id: number) {
  db.transaction(tx => {
    tx.executeSql("DELETE FROM pending WHERE id = ?;", [id]);
  });
}