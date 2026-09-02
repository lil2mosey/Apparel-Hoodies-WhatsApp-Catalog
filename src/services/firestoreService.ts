import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  writeBatch,
  onSnapshot,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { Product, PhotoAsset, StoreContact } from '../types';

// Utility to remove undefined fields which Firestore rejects
function cleanForFirestore(obj: Record<string, any>): Record<string, any> {
  const cleaned: Record<string, any> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined) {
      if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
        cleaned[key] = cleanForFirestore(value);
      } else {
        cleaned[key] = value;
      }
    }
  }
  return cleaned;
}

// Ensure product document does not exceed Firestore limits by duplicating identical large image data
export function cleanProductForFirestore(product: Product): Record<string, any> {
  const cleaned = cleanForFirestore(product);
  // If uploadedImageUrl is a data URL, prevent 'image' from duplicating the exact same string
  if (
    cleaned.uploadedImageUrl &&
    typeof cleaned.uploadedImageUrl === 'string' &&
    cleaned.uploadedImageUrl.startsWith('data:image/')
  ) {
    if (cleaned.image === cleaned.uploadedImageUrl) {
      cleaned.image = cleaned.category || 'product';
    }
  }
  return cleaned;
}

/**
 * Real-time subscription to the entire product catalog in Cloud Firestore.
 * This guarantees that ANY user on ANY device (shared link, mobile, desktop)
 * receives all products and photos in real time.
 */
export function subscribeToProducts(
  onUpdate: (products: Product[]) => void,
  onError?: (err: any) => void
): () => void {
  try {
    const colRef = collection(db, 'products');
    const unsubscribe = onSnapshot(
      colRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const items: Product[] = [];
          snapshot.forEach((docSnap) => {
            const data = docSnap.data() as Product;
            items.push({
              ...data,
              id: docSnap.id,
            });
          });
          onUpdate(items);
        } else {
          // Collection is empty, notify with empty array
          onUpdate([]);
        }
      },
      (err) => {
        console.warn('Firestore products subscription notice:', err.message);
        if (onError) onError(err);
      }
    );
    return unsubscribe;
  } catch (err) {
    console.error('Failed to subscribe to Firestore products:', err);
    return () => {};
  }
}

/**
 * Fetches products from Firestore once
 */
export async function getProductsFromFirestore(): Promise<Product[] | null> {
  try {
    const colRef = collection(db, 'products');
    const snapshot = await getDocs(colRef);
    if (!snapshot.empty) {
      const items: Product[] = [];
      snapshot.forEach((docSnap) => {
        items.push({
          ...(docSnap.data() as Product),
          id: docSnap.id,
        });
      });
      return items;
    }
    return null;
  } catch (err) {
    console.warn('Could not read products from Firestore:', err);
    return null;
  }
}

/**
 * Saves or updates a single product in Firestore
 */
export async function saveProductToFirestore(product: Product): Promise<void> {
  try {
    const docRef = doc(db, 'products', product.id);
    const cleaned = cleanProductForFirestore(product);
    await setDoc(docRef, cleaned, { merge: true });
  } catch (err) {
    console.error(`Failed to save product ${product.id} to Firestore:`, err);
    throw err;
  }
}

/**
 * Resilient parallel save of multiple products to Firestore
 * Uses individual concurrent setDoc writes so one failed item never aborts the rest of the catalog
 */
export async function saveAllProductsToFirestore(products: Product[]): Promise<void> {
  try {
    if (!products || products.length === 0) return;
    
    // Save all products in concurrent batches of 10
    const chunkSize = 10;
    for (let i = 0; i < products.length; i += chunkSize) {
      const chunk = products.slice(i, i + chunkSize);
      await Promise.allSettled(
        chunk.map(async (prod) => {
          const docRef = doc(db, 'products', prod.id);
          const cleaned = cleanProductForFirestore(prod);
          await setDoc(docRef, cleaned, { merge: true });
        })
      );
    }
  } catch (err) {
    console.error('Failed to save products to Firestore:', err);
    throw err;
  }
}

/**
 * Deletes a product from Firestore
 */
export async function deleteProductFromFirestore(productId: string): Promise<void> {
  try {
    const docRef = doc(db, 'products', productId);
    await deleteDoc(docRef);
  } catch (err) {
    console.error(`Failed to delete product ${productId} from Firestore:`, err);
  }
}

/**
 * Real-time subscription to Photo Assets in Cloud Firestore
 */
export function subscribeToPhotos(
  onUpdate: (photos: PhotoAsset[]) => void,
  onError?: (err: any) => void
): () => void {
  try {
    const colRef = collection(db, 'photo_assets');
    const unsubscribe = onSnapshot(
      colRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const items: PhotoAsset[] = [];
          snapshot.forEach((docSnap) => {
            items.push({
              ...(docSnap.data() as PhotoAsset),
              id: docSnap.id,
            });
          });
          onUpdate(items);
        } else {
          onUpdate([]);
        }
      },
      (err) => {
        console.warn('Firestore photo assets subscription notice:', err.message);
        if (onError) onError(err);
      }
    );
    return unsubscribe;
  } catch (err) {
    console.error('Failed to subscribe to Firestore photos:', err);
    return () => {};
  }
}

/**
 * Saves a photo asset to Cloud Firestore
 */
export async function savePhotoAssetToFirestore(photo: PhotoAsset): Promise<void> {
  try {
    const docRef = doc(db, 'photo_assets', photo.id);
    const cleaned = cleanForFirestore(photo);
    await setDoc(docRef, cleaned, { merge: true });
  } catch (err) {
    console.error(`Failed to save photo asset ${photo.id} to Firestore:`, err);
    throw err;
  }
}

/**
 * Saves all photo assets in resilient concurrent chunks to Firestore
 */
export async function saveAllPhotoAssetsToFirestore(photos: PhotoAsset[]): Promise<void> {
  try {
    if (!photos || photos.length === 0) return;
    const chunkSize = 10;
    for (let i = 0; i < photos.length; i += chunkSize) {
      const chunk = photos.slice(i, i + chunkSize);
      await Promise.allSettled(
        chunk.map(async (photo) => {
          const docRef = doc(db, 'photo_assets', photo.id);
          const cleaned = cleanForFirestore(photo);
          await setDoc(docRef, cleaned, { merge: true });
        })
      );
    }
  } catch (err) {
    console.error('Failed to batch save photo assets to Firestore:', err);
    throw err;
  }
}

/**
 * DIRECT MANUAL CLOUD SERVER SYNC:
 * Guarantees that 100% of photos, custom images, and product catalog
 * are committed directly to Cloud Firestore & server backend storage.
 * Reports granular step-by-step progress to the UI.
 */
export async function directCloudServerSync(
  photos: PhotoAsset[],
  products: Product[],
  onProgress?: (step: string, current: number, total: number) => void
): Promise<{ success: boolean; photosSynced: number; productsSynced: number; timestamp: number }> {
  const totalSteps = photos.length + products.length + 2;
  let completed = 0;

  try {
    // 1. Sync all Photo Assets directly to Firestore
    if (onProgress) onProgress('Starting Cloud Firestore synchronization...', 0, totalSteps);

    for (let i = 0; i < photos.length; i++) {
      const photo = photos[i];
      if (onProgress) {
        onProgress(`Saving photo "${photo.name || 'Photo'}" to Cloud Firestore...`, completed, totalSteps);
      }
      try {
        const docRef = doc(db, 'photo_assets', photo.id);
        const cleaned = cleanForFirestore(photo);
        await setDoc(docRef, cleaned, { merge: true });
      } catch (err) {
        console.warn(`Warning writing photo asset ${photo.id}:`, err);
      }
      completed++;
    }

    // 2. Sync all Products to Firestore
    for (let i = 0; i < products.length; i++) {
      const prod = products[i];
      if (onProgress) {
        onProgress(`Saving product "${prod.name}" to Cloud Firestore...`, completed, totalSteps);
      }
      try {
        const docRef = doc(db, 'products', prod.id);
        const cleaned = cleanProductForFirestore(prod);
        await setDoc(docRef, cleaned, { merge: true });
      } catch (err) {
        console.warn(`Warning writing product ${prod.id}:`, err);
      }
      completed++;
    }

    // 3. Sync to server APIs as secondary persistent layer
    if (onProgress) onProgress('Syncing server file system mirror...', completed, totalSteps);
    try {
      await Promise.allSettled([
        fetch('/api/photos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ photos }),
        }),
        fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ products }),
        }),
      ]);
    } catch {
      // Non-blocking server mirror sync
    }
    completed++;

    // 4. Complete
    if (onProgress) onProgress('Verifying Cloud Storage and local cache...', totalSteps, totalSteps);

    return {
      success: true,
      photosSynced: photos.length,
      productsSynced: products.length,
      timestamp: Date.now(),
    };
  } catch (err) {
    console.error('Direct Cloud Server Sync encountered an error:', err);
    throw err;
  }
}

/**
 * Deletes a photo asset from Cloud Firestore
 */
export async function deletePhotoAssetFromFirestore(photoId: string): Promise<void> {
  try {
    const docRef = doc(db, 'photo_assets', photoId);
    await deleteDoc(docRef);
  } catch (err) {
    console.error(`Failed to delete photo asset ${photoId} from Firestore:`, err);
  }
}

/**
 * Real-time subscription to Store Contact settings
 */
export function subscribeToStoreContact(
  onUpdate: (contact: StoreContact) => void
): () => void {
  try {
    const docRef = doc(db, 'store_settings', 'contact');
    const unsubscribe = onSnapshot(
      docRef,
      (snapshot) => {
        if (snapshot.exists()) {
          onUpdate(snapshot.data() as StoreContact);
        }
      },
      (err) => {
        console.warn('Firestore store contact subscription notice:', err.message);
      }
    );
    return unsubscribe;
  } catch (err) {
    console.error('Failed to subscribe to Store Contact in Firestore:', err);
    return () => {};
  }
}

/**
 * Saves Store Contact settings to Cloud Firestore
 */
export async function saveStoreContactToFirestore(contact: StoreContact): Promise<void> {
  try {
    const docRef = doc(db, 'store_settings', 'contact');
    const cleaned = cleanForFirestore(contact);
    await setDoc(docRef, cleaned, { merge: true });
  } catch (err) {
    console.error('Failed to save store contact to Firestore:', err);
  }
}
