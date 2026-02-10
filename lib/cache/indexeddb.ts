/**
 * IndexedDB Wrapper for Dynamic Data Caching
 * Provides TTL-based invalidation and type-safe storage
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

class IndexedDBCache {
  private dbName = 'deathtosaas-cache';
  private version = 1;
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        // Create object stores for different data types
        if (!db.objectStoreNames.contains('userData')) {
          db.createObjectStore('userData', { keyPath: 'key' });
        }
        if (!db.objectStoreNames.contains('deals')) {
          db.createObjectStore('deals', { keyPath: 'key' });
        }
        if (!db.objectStoreNames.contains('apps')) {
          db.createObjectStore('apps', { keyPath: 'key' });
        }
        if (!db.objectStoreNames.contains('marketplace')) {
          db.createObjectStore('marketplace', { keyPath: 'key' });
        }
      };
    });
  }

  private async getStore(storeName: string): Promise<IDBObjectStore> {
    if (!this.db) {
      await this.init();
    }
    if (!this.db) {
      throw new Error('Failed to initialize IndexedDB');
    }
    const transaction = this.db.transaction([storeName], 'readwrite');
    return transaction.objectStore(storeName);
  }

  /**
   * Store data with TTL
   */
  async set<T>(
    storeName: string,
    key: string,
    data: T,
    ttl: number = 5 * 60 * 1000 // Default 5 minutes
  ): Promise<void> {
    const store = await this.getStore(storeName);
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl,
    };
    return new Promise((resolve, reject) => {
      const request = store.put({ key, ...entry });
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Get data if not expired
   */
  async get<T>(storeName: string, key: string): Promise<T | null> {
    const store = await this.getStore(storeName);
    return new Promise((resolve, reject) => {
      const request = store.get(key);
      request.onsuccess = () => {
        const result = request.result as { key: string } & CacheEntry<T> | undefined;
        if (!result) {
          resolve(null);
          return;
        }

        const { data, timestamp, ttl } = result;
        const now = Date.now();
        const age = now - timestamp;

        if (age > ttl) {
          // Expired, delete and return null
          this.delete(storeName, key).catch(() => {});
          resolve(null);
          return;
        }

        resolve(data);
      };
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Delete specific key
   */
  async delete(storeName: string, key: string): Promise<void> {
    const store = await this.getStore(storeName);
    return new Promise((resolve, reject) => {
      const request = store.delete(key);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Clear all data in a store
   */
  async clear(storeName: string): Promise<void> {
    const store = await this.getStore(storeName);
    return new Promise((resolve, reject) => {
      const request = store.clear();
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Clear all expired entries across all stores
   */
  async clearExpired(): Promise<void> {
    if (!this.db) {
      await this.init();
    }
    if (!this.db) return;

    const storeNames = ['userData', 'deals', 'apps', 'marketplace'];
    const now = Date.now();

    for (const storeName of storeNames) {
      const transaction = this.db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.openCursor();

      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result;
        if (cursor) {
          const entry = cursor.value as { key: string } & CacheEntry<unknown>;
          const age = now - entry.timestamp;
          if (age > entry.ttl) {
            cursor.delete();
          }
          cursor.continue();
        }
      };
    }
  }

  /**
   * Get all keys in a store
   */
  async keys(storeName: string): Promise<string[]> {
    const store = await this.getStore(storeName);
    return new Promise((resolve, reject) => {
      const request = store.getAllKeys();
      request.onsuccess = () => {
        resolve(request.result as string[]);
      };
      request.onerror = () => reject(request.error);
    });
  }
}

// Singleton instance
let cacheInstance: IndexedDBCache | null = null;

export function getIndexedDBCache(): IndexedDBCache {
  if (!cacheInstance) {
    cacheInstance = new IndexedDBCache();
  }
  return cacheInstance;
}

// Convenience functions for specific data types
export const userDataCache = {
  set: <T>(key: string, data: T, ttl?: number) =>
    getIndexedDBCache().set<T>('userData', key, data, ttl),
  get: <T>(key: string) => getIndexedDBCache().get<T>('userData', key),
  delete: (key: string) => getIndexedDBCache().delete('userData', key),
  clear: () => getIndexedDBCache().clear('userData'),
};

export const dealsCache = {
  set: <T>(key: string, data: T, ttl?: number) =>
    getIndexedDBCache().set<T>('deals', key, data, ttl),
  get: <T>(key: string) => getIndexedDBCache().get<T>('deals', key),
  delete: (key: string) => getIndexedDBCache().delete('deals', key),
  clear: () => getIndexedDBCache().clear('deals'),
};

export const appsCache = {
  set: <T>(key: string, data: T, ttl?: number) =>
    getIndexedDBCache().set<T>('apps', key, data, ttl),
  get: <T>(key: string) => getIndexedDBCache().get<T>('apps', key),
  delete: (key: string) => getIndexedDBCache().delete('apps', key),
  clear: () => getIndexedDBCache().clear('apps'),
};

export const marketplaceCache = {
  set: <T>(key: string, data: T, ttl?: number) =>
    getIndexedDBCache().set<T>('marketplace', key, data, ttl),
  get: <T>(key: string) => getIndexedDBCache().get<T>('marketplace', key),
  delete: (key: string) => getIndexedDBCache().delete('marketplace', key),
  clear: () => getIndexedDBCache().clear('marketplace'),
};

// Initialize on module load (client-side only)
// This runs at module load time, so we need to check for window
// But we should do this lazily to avoid hydration issues
let initialized = false;

function initializeCache() {
  if (typeof window !== 'undefined' && !initialized) {
    initialized = true;
    getIndexedDBCache().init().catch(console.error);
    
    // Clean up expired entries every 10 minutes
    setInterval(() => {
      getIndexedDBCache().clearExpired().catch(console.error);
    }, 10 * 60 * 1000);
  }
}

// Initialize lazily on first use or after mount
if (typeof window !== 'undefined') {
  // Use requestIdleCallback if available, otherwise setTimeout
  if ('requestIdleCallback' in window) {
    requestIdleCallback(initializeCache);
  } else {
    setTimeout(initializeCache, 0);
  }
}
