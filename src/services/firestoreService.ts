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
          // Collection is empty, notify with empty array so caller can seed if necessary
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
    const cleaned = cleanForFirestore(product);
    await setDoc(docRef, cleaned, { merge: true });
  } catch (err) {
    console.error(`Failed to save product ${product.id} to Firestore:`, err);
    throw err;
  }
}

/**
 * Batch saves multiple products to Firestore (up to 500 per batch)
 */
export async function saveAllProductsToFirestore(products: Product[]): Promise<void> {
  try {
    if (!products || products.length === 0) return;
    
    // Chunk into batches of 400 to remain well within Firestore's 500 limit
    const chunkSize = 400;
    for (let i = 0; i < products.length; i += chunkSize) {
      const batch = writeBatch(db);
      const chunk = products.slice(i, i + chunkSize);
      
      for (const prod of chunk) {
        const docRef = doc(db, 'products', prod.id);
        const cleaned = cleanForFirestore(prod);
        batch.set(docRef, cleaned, { merge: true });
      }
      
      await batch.commit();
    }
  } catch (err) {
    console.error('Failed to batch save products to Firestore:', err);
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
