// src/services/dataService.ts

import { addItemToServer, fetchDataFromServer, pushUpdateToServer } from "../api/dataApi";
import {
    clearPendingChange,
    getLocalData,
    getPendingChanges,
    initDb,
    markUnsyncedChange,
    queueChange,
    saveDataLocally,
} from "../storage/localDb";

// Initialize the local database
export async function initialize() {
  initDb();
}

// Load data from local DB
export async function loadLocal(callback: (rows: any[]) => void) {
  getLocalData(callback);
}

// Sync with server: fetch latest data, update local DB
export async function syncWithServer(callback: (rows: any[]) => void) {
  try {
    const serverData = await fetchDataFromServer();
    saveDataLocally(serverData);
    getLocalData(callback);
  } catch (err) {
    console.log("⚠️ Offline mode, using local data");
    getLocalData(callback);
  }
}

// Update an item: mark unsynced + queue change
export async function updateItem(item: { id: number; name: string }, callback: (rows: any[]) => void) {
  markUnsyncedChange(item);
  queueChange(item, "update");
  getLocalData(callback);
}

// Add a new item: queue change
export async function addItem(item: { name: string }, callback: (rows: any[]) => void) {
  queueChange({ id: Date.now(), name: item.name }, "add");
  getLocalData(callback);
}

// Process pending changes when back online
export async function processQueue(callback: (rows: any[]) => void) {
  const pending = await getPendingChanges();
  for (const change of pending) {
    try {
      if (change.action === "update") {
        await pushUpdateToServer({ id: change.itemId, name: change.name });
      } else if (change.action === "add") {
        await addItemToServer({ name: change.name });
      }
      clearPendingChange(change.id);
    } catch {
      console.log("⚠️ Still offline, will retry later");
    }
  }
  await syncWithServer(callback);
}