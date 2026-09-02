import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  initializeFirestore,
  getFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
  doc,
  getDocFromServer,
  type Firestore,
} from 'firebase/firestore';
import firebaseConfigData from '../../firebase-applet-config.json';

const firebaseConfig = {
  apiKey: firebaseConfigData.apiKey,
  authDomain: firebaseConfigData.authDomain,
  projectId: firebaseConfigData.projectId,
  storageBucket: firebaseConfigData.storageBucket,
  messagingSenderId: firebaseConfigData.messagingSenderId,
  appId: firebaseConfigData.appId,
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

export const FIRESTORE_DATABASE_ID =
  firebaseConfigData.firestoreDatabaseId || '(default)';

let firestoreInstance: Firestore;
try {
  const customDbId =
    firebaseConfigData.firestoreDatabaseId && firebaseConfigData.firestoreDatabaseId !== '(default)'
      ? firebaseConfigData.firestoreDatabaseId
      : undefined;

  firestoreInstance = initializeFirestore(
    app,
    {
      localCache: persistentLocalCache({
        tabManager: persistentMultipleTabManager(),
      }),
    },
    customDbId
  );
} catch {
  // If already initialized or unsupported in current environment, fall back to getFirestore
  firestoreInstance =
    firebaseConfigData.firestoreDatabaseId && firebaseConfigData.firestoreDatabaseId !== '(default)'
      ? getFirestore(app, firebaseConfigData.firestoreDatabaseId)
      : getFirestore(app);
}

export const db: Firestore = firestoreInstance;

/**
 * Validates active online connection directly to the Firestore database
 */
export async function testFirestoreConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firestore database notice: client is offline or connecting.', error);
      return false;
    }
    // Any other response (like doc not existing) means we successfully communicated with Firestore
    return true;
  }
}

export { app };

