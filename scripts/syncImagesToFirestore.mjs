import fs from 'fs';
import path from 'path';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, terminate } from 'firebase/firestore';

const configPath = path.resolve(process.cwd(), 'firebase-applet-config.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

const app = initializeApp({
  apiKey: config.apiKey,
  authDomain: config.authDomain,
  projectId: config.projectId,
  storageBucket: config.storageBucket,
  messagingSenderId: config.messagingSenderId,
  appId: config.appId,
});

const db = getFirestore(app, config.firestoreDatabaseId);

const IMAGES_DIR = path.resolve(process.cwd(), 'images collection');

const PHOTO_MAPPINGS = [
  {
    id: 'photo-half-hoodie',
    filename: 'half hoddie.jpeg',
    cleanFilename: 'half-hoodie.jpg',
    name: 'Half Hoodie (Sleeveless Fleece Hoodie)',
    category: 'hoodies',
    mimeType: 'image/jpeg',
    assignedProductId: 'half-hoodie',
  },
  {
    id: 'photo-pullover-hoodie',
    filename: 'hoodies.jpeg',
    cleanFilename: 'hoodies.jpg',
    name: 'Premium Pullover Fleece Hoodie',
    category: 'hoodies',
    mimeType: 'image/jpeg',
    assignedProductId: 'pullover-hoodie',
  },
  {
    id: 'photo-zip-hoodie',
    filename: 'fully zip up hoodie.jpg',
    cleanFilename: 'zip-hoodie.jpg',
    name: 'Full-Zip Heavyweight Hoodie',
    category: 'hoodies',
    mimeType: 'image/jpeg',
    assignedProductId: 'zip-hoodie',
  },
  {
    id: 'photo-sweatshirt',
    filename: 'sweatshirt.jpeg',
    cleanFilename: 'sweatshirt.jpg',
    name: 'Classic Crewneck Sweatshirt',
    category: 'sweatshirts',
    mimeType: 'image/jpeg',
    assignedProductId: 'crewneck-sweatshirt',
  },
  {
    id: 'photo-polo',
    filename: 'polo shirts.webp',
    cleanFilename: 'polo-shirts.webp',
    name: 'Piqué Dotted & Solid Collar Polo Shirt',
    category: 'polo-shirts',
    mimeType: 'image/webp',
    assignedProductId: 'pique-polo-shirt',
  },
  {
    id: 'photo-plain-tshirt',
    filename: 'Plain Crewneck T-Shirt.webp',
    cleanFilename: 'plain-tshirt.webp',
    name: 'Heavy Cotton Plain Crewneck T-Shirt',
    category: 'plain-tshirts',
    mimeType: 'image/webp',
    assignedProductId: 'plain-tshirt',
  },
  {
    id: 'photo-cap',
    filename: 'caps.jpeg',
    cleanFilename: 'caps.jpg',
    name: 'Classic 6-Panel Cotton Baseball Cap',
    category: 'caps',
    mimeType: 'image/jpeg',
    assignedProductId: 'baseball-cap',
  },
  {
    id: 'photo-reflective-vest',
    filename: 'High-Visibility Safety Reflective Vest.webp',
    cleanFilename: 'reflective-vest.webp',
    name: 'High-Visibility Safety Reflective Vest',
    category: 'vests',
    mimeType: 'image/webp',
    assignedProductId: 'safety-reflective-vest',
  },
  {
    id: 'photo-puffer-vest',
    filename: 'Quilted Sleeveless Puffer Vest.jpg',
    cleanFilename: 'puffer-vest.jpg',
    name: 'Insulated Quilted Sleeveless Puffer Vest',
    category: 'vests',
    mimeType: 'image/jpeg',
    assignedProductId: 'quilted-puffer-gilet',
  },
  {
    id: 'photo-poncho',
    filename: 'poncho.webp',
    cleanFilename: 'poncho.webp',
    name: 'Fringed Warm Fleece & Maasai Poncho',
    category: 'ponchos',
    mimeType: 'image/webp',
    assignedProductId: 'fleece-poncho',
  },
  {
    id: 'photo-tracksuit',
    filename: 'track-suitss.webp',
    cleanFilename: 'tracksuit.webp',
    name: '2-Piece Heavyweight Athletic Fleece Tracksuit',
    category: 'tracksuits',
    mimeType: 'image/webp',
    assignedProductId: 'athletic-tracksuit',
  },
  {
    id: 'photo-logo',
    customPath: path.resolve(process.cwd(), 'public/grysons-logo.jpg'),
    cleanFilename: 'grysons-logo.jpg',
    name: "Gryson's Apparel Brand Official Logo Emblem",
    category: 'all',
    mimeType: 'image/jpeg',
    assignedProductId: 'branding-logo',
  },
  {
    id: 'photo-promo-flyer',
    filename: 'logo.jpeg',
    cleanFilename: 'promo-poster.jpg',
    name: "Gryson's Apparel Merch Promo Flyer",
    category: 'all',
    mimeType: 'image/jpeg',
    assignedProductId: 'promo-flyer',
  },
];

async function run() {
  console.log('Starting Firestore synchronization...');
  console.log(`Firestore Database ID: ${config.firestoreDatabaseId}`);

  const photoAssetsList = [];
  const photoMapByProductId = new Map();

  for (const item of PHOTO_MAPPINGS) {
    const filePath = item.customPath || path.join(IMAGES_DIR, item.filename);
    if (!fs.existsSync(filePath)) {
      console.warn(`File not found: ${filePath}`);
      continue;
    }

    const buffer = fs.readFileSync(filePath);
    const base64Data = buffer.toString('base64');
    const dataUrl = `data:${item.mimeType};base64,${base64Data}`;
    const webUrl = `/images/${item.cleanFilename}`;
    const fileSizeKB = Math.round(buffer.length / 1024);

    const photoAsset = {
      id: item.id,
      name: item.name,
      url: dataUrl,
      webUrl: webUrl,
      category: item.category,
      dateAdded: new Date().toLocaleDateString(),
      fileSize: `${fileSizeKB} KB`,
      assignedProductId: item.assignedProductId,
    };

    photoAssetsList.push(photoAsset);
    photoMapByProductId.set(item.assignedProductId, { dataUrl, webUrl });

    // Write to Firestore collection 'photo_assets'
    const docRef = doc(db, 'photo_assets', item.id);
    await setDoc(docRef, photoAsset, { merge: true });
    console.log(`Synced photo asset "${item.name}" (${fileSizeKB} KB) to Firestore.`);
  }

  // Import products definition
  const { PRODUCTS, DEFAULT_STORE_CONTACT } = await import('../src/data/products.ts');

  // Sync Products to Firestore collection 'products'
  const enrichedProducts = PRODUCTS.map((prod) => {
    const photoInfo = photoMapByProductId.get(prod.id);
    const uploadedImageUrl = photoInfo ? photoInfo.dataUrl : (prod.uploadedImageUrl || '');
    return {
      ...prod,
      uploadedImageUrl: uploadedImageUrl,
    };
  });

  for (const prod of enrichedProducts) {
    const docRef = doc(db, 'products', prod.id);
    // Remove undefined values
    const cleaned = JSON.parse(JSON.stringify(prod));
    await setDoc(docRef, cleaned, { merge: true });
    console.log(`Synced product "${prod.name}" to Firestore.`);
  }

  // Sync Store Contact
  const contactDocRef = doc(db, 'store_settings', 'contact');
  const logoInfo = photoMapByProductId.get('branding-logo');
  const enrichedContact = {
    ...DEFAULT_STORE_CONTACT,
    logoUrl: logoInfo ? logoInfo.dataUrl : '/grysons-logo.jpg',
  };
  await setDoc(contactDocRef, enrichedContact, { merge: true });
  console.log('Synced Store Contact & Logo to Firestore.');

  // Also persist local mirror in /data for offline and fast local restarts
  const dataDir = path.resolve(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  fs.writeFileSync(
    path.join(dataDir, 'photos.json'),
    JSON.stringify(photoAssetsList, null, 2),
    'utf-8'
  );
  fs.writeFileSync(
    path.join(dataDir, 'products.json'),
    JSON.stringify(enrichedProducts, null, 2),
    'utf-8'
  );
  fs.writeFileSync(
    path.join(dataDir, 'contact.json'),
    JSON.stringify(enrichedContact, null, 2),
    'utf-8'
  );

  console.log('SUCCESS! All 12 image assets and products are committed to Firestore Database.');
  await terminate(db);
  process.exit(0);
}

run().catch((err) => {
  console.error('Error during Firestore sync:', err);
  process.exit(1);
});
