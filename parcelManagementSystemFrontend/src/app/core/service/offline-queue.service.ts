// offline-queue.service.ts
import { Injectable } from '@angular/core';
import { openDB, IDBPDatabase } from 'idb';

export interface OfflineRequest {
  id?: number;
  url: string;
  method: string;
  headers?: Record<string, string>;
  isFormData?: boolean;
  // if isFormData -> Array of entries { key, _isFile, file?, value }
  // else -> JSON-serializable body
  body?: any;
  createdAt: number;
  attempts?: number;
}

@Injectable({
  providedIn: 'root'
})
export class OfflineQueueService {
  private dbPromise: Promise<IDBPDatabase>;
  private syncing = false;

  constructor() {
    this.dbPromise = openDB('parcel-offline-db', 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('request-queue')) {
          db.createObjectStore('request-queue', { keyPath: 'id', autoIncrement: true });
        }
      }
    });

    // Start sync when we come online
    window.addEventListener('online', () => {
      console.log('[OfflineQueue] online -> attempting sync');
      this.forceSync().catch(e => console.warn(e));
    });
  }

  /** Enqueue a request. Accepts FormData or plain JSON body. Returns id */
  async enqueue(req: { url: string; method?: string; headers?: Record<string,string>; body?: any }) {
    const db = await this.dbPromise;

    const record: OfflineRequest = {
      url: req.url,
      method: (req.method || 'GET').toUpperCase(),
      headers: req.headers || {},
      createdAt: Date.now(),
      attempts: 0,
      isFormData: false,
      body: null
    };

    // If body is FormData, convert to array of entries preserving File/Blob (structured clone)
    if (req.body instanceof FormData) {
      record.isFormData = true;
      const entries: any[] = [];
      for (const pair of Array.from((req.body as FormData).entries())) {
        const [key, value] = pair as [string, any];
        if (value instanceof File || value instanceof Blob) {
          // store file object directly - structured clone supports this
          entries.push({ key, _isFile: true, file: value });
        } else {
          entries.push({ key, _isFile: false, value: String(value ?? '') });
        }
      }
      record.body = entries;
    } else {
      // JSON / primitive body
      record.isFormData = false;
      record.body = req.body ?? null;
    }

    const id = await db.add('request-queue', record);
    console.log('[OfflineQueue] enqueued id=', id, 'url=', record.url, 'isFormData=', record.isFormData);
    return id;
  }

  /** return all queued items (useful for debugging) */
  async getAll() {
    const db = await this.dbPromise;
    return db.getAll('request-queue') as Promise<OfflineRequest[]>;
  }

  async forceSync() {
    return this.syncQueue(true);
  }

  /** Sync queue: read all items first then process one-by-one (no long-lived txs) */
  private async syncQueue(force = false) {
    if (this.syncing && !force) {
      console.log('[OfflineQueue] already syncing — skipping');
      return;
    }
    this.syncing = true;

    const db = await this.dbPromise;
    try {
      const items = await db.getAll('request-queue') as OfflineRequest[];
      if (!items || items.length === 0) {
        console.log('[OfflineQueue] nothing to sync');
        this.syncing = false;
        return;
      }

      console.log('[OfflineQueue] will sync', items.length, 'items');

      for (const item of items) {
        try {
          const baseInit: RequestInit = {
            method: item.method,
            credentials: 'include', // include cookies
            headers: {}
          };
          if (item.headers) baseInit.headers = { ...(item.headers || {}) };

          let finalInit: RequestInit = { ...baseInit };

          if (item.isFormData && Array.isArray(item.body)) {
            // reconstruct FormData
            const fd = new FormData();
            for (const entry of item.body) {
              if (entry._isFile) {
                // entry.file is a File/Blob preserved by structured clone
                fd.append(entry.key, entry.file);
              } else {
                fd.append(entry.key, entry.value);
              }
            }
            finalInit.body = fd;
            // do not set Content-Type for multipart
            if (finalInit.headers) delete (finalInit.headers as any)['Content-Type'];
          } else if (item.body != null) {
            finalInit.body = JSON.stringify(item.body);
            finalInit.headers = { ...(finalInit.headers || {}), 'Content-Type': 'application/json' };
          }

          console.log('[OfflineQueue] replaying', item.method, item.url);
          const res = await fetch(item.url, finalInit);

          // debug text (helpful when server returns JSON error)
          let text = '';
          try { text = await res.text(); } catch (e) {}

          console.log('[OfflineQueue][DEBUG] status', res.status, 'for', item.url, 'text=', text);

          if (res.ok) {
            // remove record using a short transaction
            const tx = db.transaction('request-queue', 'readwrite');
            await tx.objectStore('request-queue').delete(item.id!);
            await tx.done;
            console.log('[OfflineQueue] replay success id=', item.id);
          } else {
            // server returned error (4xx/5xx). update attempts and keep for retry/backoff.
            item.attempts = (item.attempts || 0) + 1;
            const tx = db.transaction('request-queue', 'readwrite');
            await tx.objectStore('request-queue').put(item);
            await tx.done;
            console.warn('[OfflineQueue] server returned', res.status, 'for', item.url);
            // break on auth failures to allow user to re-auth
            if (res.status === 401 || res.status === 403) {
              console.warn('[OfflineQueue] auth error — stop processing queue');
              break;
            }
          }

        } catch (err) {
          console.warn('[OfflineQueue] network/fetch error for id=', item.id, err);
          // increment attempts and update in db (best-effort) then stop processing
          try {
            item.attempts = (item.attempts || 0) + 1;
            const tx = db.transaction('request-queue', 'readwrite');
            await tx.objectStore('request-queue').put(item);
            await tx.done;
          } catch (e) {
            console.warn('[OfflineQueue] failed to update attempts', e);
          }
          // stop processing further items — we'll try again next online event
          break;
        }
      } // end for
    } catch (outer) {
      console.error('[OfflineQueue] sync failed', outer);
    } finally {
      this.syncing = false;
      console.log('[OfflineQueue] sync complete');
    }
  }
}
