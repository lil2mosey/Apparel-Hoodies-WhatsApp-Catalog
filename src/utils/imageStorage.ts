// Robust IndexedDB client storage for high-resolution uploaded images and product catalog
// This prevents localStorage quota limits (5MB) and avoids image loss during app re-renders or code updates.

const DB_NAME = 'grysons_apparel_store_db';
const DB_VERSION = 1;
const PHOTO_STORE = 'photos';
const CATALOG_STORE = 'catalog_state';

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported'));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(PHOTO_STORE)) {
        db.createObjectStore(PHOTO_STORE, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(CATALOG_STORE)) {
        db.createObjectStore(CATALOG_STORE, { keyPath: 'key' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Save any large data item (products, custom photos, etc.)
export async function savePersistentData<T>(key: string, data: T): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(CATALOG_STORE, 'readwrite');
      const store = tx.objectStore(CATALOG_STORE);
      store.put({ key, data, updatedAt: Date.now() });
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch {
    // Fallback to localStorage if IndexedDB is unavailable
    try {
      localStorage.setItem(`persistent_${key}`, JSON.stringify(data));
    } catch {
      // ignore
    }
  }
}

// Retrieve persistent data
export async function getPersistentData<T>(key: string): Promise<T | null> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(CATALOG_STORE, 'readonly');
      const store = tx.objectStore(CATALOG_STORE);
      const request = store.get(key);
      request.onsuccess = () => {
        if (request.result && request.result.data) {
          resolve(request.result.data);
        } else {
          // Check fallback localStorage
          try {
            const fallback = localStorage.getItem(`persistent_${key}`);
            resolve(fallback ? JSON.parse(fallback) : null);
          } catch {
            resolve(null);
          }
        }
      };
      request.onerror = () => resolve(null);
    });
  } catch {
    try {
      const fallback = localStorage.getItem(`persistent_${key}`);
      return fallback ? JSON.parse(fallback) : null;
    } catch {
      return null;
    }
  }
}

// Save Photo Asset to IndexedDB
export async function savePhotoAssetToDB(asset: { id: string; name: string; url: string; category?: string; dateAdded: string; fileSize?: string; assignedProductId?: string }): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(PHOTO_STORE, 'readwrite');
      const store = tx.objectStore(PHOTO_STORE);
      store.put(asset);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch {
    // ignore
  }
}

// Get all Photo Assets from IndexedDB
export async function getAllPhotoAssetsFromDB(): Promise<any[]> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(PHOTO_STORE, 'readonly');
      const store = tx.objectStore(PHOTO_STORE);
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => resolve([]);
    });
  } catch {
    return [];
  }
}

// Delete Photo Asset
export async function deletePhotoAssetFromDB(id: string): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(PHOTO_STORE, 'readwrite');
      const store = tx.objectStore(PHOTO_STORE);
      store.delete(id);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch {
    // ignore
  }
}
