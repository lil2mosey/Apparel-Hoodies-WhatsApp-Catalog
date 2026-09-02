import React, { useState, useMemo, useEffect } from 'react';
import { 
  MessageSquare, 
  Sparkles, 
  Ruler, 
  Truck, 
  SlidersHorizontal,
  Flame,
  Shirt,
  ShieldCheck,
  Send,
  Lock,
  ArrowRight,
  Eye
} from 'lucide-react';
import { 
  Product, 
  ProductCategory, 
  ColorOption, 
  ApparelSize, 
  StoreContact,
  PhotoAsset,
  AppTheme,
  AppViewMode
} from './types';
import { PRODUCTS, CATEGORIES, DEFAULT_STORE_CONTACT } from './data/products';
import { Navbar } from './components/Navbar';
import { ProductCard } from './components/ProductCard';
import { ProductModal } from './components/ProductModal';
import { DirectOrderModal } from './components/DirectOrderModal';
import { SizeGuideModal } from './components/SizeGuideModal';
import { LogoShowcaseModal } from './components/LogoShowcaseModal';
import { MusoAdminPortal } from './components/MusoAdminPortal';
import { OwnerAuthModal, OwnerPinForm, OwnerSetupPasslockForm } from './components/OwnerAuthModal';
import { Footer } from './components/Footer';
import { MobileBottomBar } from './components/MobileBottomBar';
import { MusoBrandLogo } from './components/MusoBrandLogo';
import { 
  savePersistentData, 
  getPersistentData, 
  savePhotoAssetToDB, 
  getAllPhotoAssetsFromDB,
  syncProductsToServer,
  fetchProductsFromServer,
  syncPhotosToServer,
  fetchPhotosFromServer,
  syncContactToServer,
  fetchContactFromServer
} from './utils/imageStorage';
import {
  subscribeToProducts,
  saveAllProductsToFirestore,
  subscribeToPhotos,
  savePhotoAssetToFirestore,
  subscribeToStoreContact,
  saveStoreContactToFirestore,
} from './services/firestoreService';
import { saveCustomPhotoOverride } from './assets/images';

// Helper to check if current browser URL corresponds to /admin
const checkIsAdminPath = () => {
  if (typeof window === 'undefined') return false;
  const path = window.location.pathname.toLowerCase();
  const hash = window.location.hash.toLowerCase();
  const search = window.location.search.toLowerCase();
  return path === '/admin' || path.startsWith('/admin/') || hash === '#admin' || search.includes('admin=true') || search.includes('view=admin');
};

export default function App() {
  // Theme state (Light / Dark)
  const [theme, setTheme] = useState<AppTheme>(() => {
    try {
      const savedTheme = localStorage.getItem('muso_theme');
      if (savedTheme === 'dark' || savedTheme === 'light') return savedTheme;
    } catch {
      // ignore
    }
    return 'light';
  });

  // Synchronize dark mode class on <html> and <body>
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    if (theme === 'dark') {
      root.classList.add('dark');
      body.classList.add('dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      body.classList.remove('dark');
      root.style.colorScheme = 'light';
    }
    try {
      localStorage.setItem('muso_theme', theme);
    } catch {
      // ignore
    }
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Owner Authentication Session
  const [isOwnerAuthenticated, setIsOwnerAuthenticated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('muso_owner_authenticated') === 'true';
    } catch {
      return false;
    }
  });

  // Track if custom master passlock has been configured
  const [isOwnerPinCreated, setIsOwnerPinCreated] = useState<boolean>(() => {
    try {
      const pin = localStorage.getItem('muso_owner_pin');
      const isSet = localStorage.getItem('muso_owner_pin_created');
      return Boolean(isSet === 'true' && pin && pin.length >= 4);
    } catch {
      return false;
    }
  });

  // Owner PIN / Passlock
  const [ownerPin, setOwnerPin] = useState<string>(() => {
    try {
      return localStorage.getItem('muso_owner_pin') || '';
    } catch {
      return '';
    }
  });

  const handleSetOwnerPasslock = (newPin: string) => {
    setOwnerPin(newPin);
    setIsOwnerPinCreated(true);
    setIsOwnerAuthenticated(true);
    try {
      localStorage.setItem('muso_owner_pin', newPin);
      localStorage.setItem('muso_owner_pin_created', 'true');
      sessionStorage.setItem('muso_owner_authenticated', 'true');
    } catch {
      // ignore
    }
  };

  const handleUpdateOwnerPin = (newPin: string) => {
    setOwnerPin(newPin);
    setIsOwnerPinCreated(true);
    try {
      localStorage.setItem('muso_owner_pin', newPin);
      localStorage.setItem('muso_owner_pin_created', 'true');
    } catch {
      // ignore
    }
  };

  const handleResetOwnerPasslockSetup = () => {
    try {
      localStorage.removeItem('muso_owner_pin');
      localStorage.removeItem('muso_owner_pin_created');
      sessionStorage.removeItem('muso_owner_authenticated');
    } catch {
      // ignore
    }
    setOwnerPin('');
    setIsOwnerPinCreated(false);
    setIsOwnerAuthenticated(false);
  };

  // View Mode: 'customer' | 'admin'
  const [viewMode, setViewMode] = useState<AppViewMode>(() => {
    if (checkIsAdminPath()) return 'admin';
    try {
      const savedMode = localStorage.getItem('muso_view_mode');
      if (savedMode === 'admin' || savedMode === 'customer') return savedMode;
    } catch {
      // ignore
    }
    return 'customer';
  });

  // Synchronize browser history and URL with viewMode
  useEffect(() => {
    const handleLocationChange = () => {
      const isAdmin = checkIsAdminPath();
      if (isAdmin) {
        setViewMode('admin');
      } else {
        setViewMode('customer');
      }
    };

    // Listen to popstate (back/forward button) and hashchange
    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);

    // Initial check on mount
    if (checkIsAdminPath()) {
      setViewMode('admin');
    }

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  // Owner Auth Dialog State
  const [isOwnerAuthModalOpen, setIsOwnerAuthModalOpen] = useState(false);

  // Products state (persisted to localStorage & IndexedDB with smart merge)
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('muso_products_catalog');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const userCustomMap = new Map<string, Product>();
          parsed.forEach((p: Product) => userCustomMap.set(p.id, p));

          const mergedDefaults = PRODUCTS.map((defaultProd) => {
            const userProd = userCustomMap.get(defaultProd.id);
            if (userProd) {
              return {
                ...defaultProd,
                ...userProd,
                uploadedImageUrl: userProd.uploadedImageUrl || defaultProd.uploadedImageUrl,
                image: userProd.uploadedImageUrl || userProd.image || defaultProd.image,
                price: typeof userProd.price === 'number' ? userProd.price : defaultProd.price,
                inStock: userProd.inStock !== undefined ? userProd.inStock : defaultProd.inStock,
                customizable: userProd.customizable !== undefined ? userProd.customizable : defaultProd.customizable,
                colors: (userProd.colors && userProd.colors.length > 0) ? userProd.colors : defaultProd.colors,
                sizes: (userProd.sizes && userProd.sizes.length > 0) ? userProd.sizes : defaultProd.sizes,
              };
            }
            return defaultProd;
          });

          const defaultIds = new Set(PRODUCTS.map((p) => p.id));
          const userCreatedItems = parsed.filter((p: Product) => !defaultIds.has(p.id));

          return [...mergedDefaults, ...userCreatedItems];
        }
      }
    } catch {
      // ignore
    }
    return PRODUCTS;
  });

  // Instantly hydrate cached catalog & photos from IndexedDB on startup (~5ms)
  // This eliminates the 5-second network delay on page refresh and displays images immediately
  useEffect(() => {
    getPersistentData<Product[]>('products_catalog').then((dbProducts) => {
      if (dbProducts && Array.isArray(dbProducts) && dbProducts.length > 0) {
        setProducts((current) => {
          const currentHasCustom = current.some((p) => p.uploadedImageUrl);
          if (!currentHasCustom) {
            return dbProducts;
          }
          return current;
        });

        dbProducts.forEach((p) => {
          const photo = p.uploadedImageUrl || (p.image && (p.image.startsWith('data:image/') || p.image.startsWith('http') || p.image.startsWith('/')) ? p.image : undefined);
          if (photo) {
            saveCustomPhotoOverride(p.id, photo);
          }
        });
      }
    });

    getPersistentData<PhotoAsset[]>('photo_assets').then((dbPhotos) => {
      if (dbPhotos && Array.isArray(dbPhotos) && dbPhotos.length > 0) {
        setPhotoAssets((current) => (current.length === 0 ? dbPhotos : current));
      }
    });
  }, []);

  // Real-time Cloud Firestore subscription + local IndexedDB & localStorage caching
  useEffect(() => {
    // 1. Real-time Cloud Firestore products subscription
    // Guarantees ANY user on ANY device or shared link receives the exact same photos & pricing
    const unsubscribeProducts = subscribeToProducts(
      (firestoreProducts) => {
        if (firestoreProducts && Array.isArray(firestoreProducts) && firestoreProducts.length > 0) {
          setProducts(firestoreProducts);
          savePersistentData('products_catalog', firestoreProducts);
          try {
            localStorage.setItem('muso_products_catalog', JSON.stringify(firestoreProducts));
          } catch {
            // ignore
          }

          // Register photo overrides so all visual components update immediately
          firestoreProducts.forEach((p) => {
            const photo = p.uploadedImageUrl || (p.image && (p.image.startsWith('data:image/') || p.image.startsWith('http') || p.image.startsWith('/')) ? p.image : undefined);
            if (photo) {
              saveCustomPhotoOverride(p.id, photo);
              saveCustomPhotoOverride(p.image, photo);
            }
          });
        }
      },
      (err) => {
        console.warn('Firestore products subscription notice, falling back to cached storage:', err);
        // Fallback to local storage if offline
        getPersistentData<Product[]>('products_catalog').then((dbProducts) => {
          if (dbProducts && Array.isArray(dbProducts) && dbProducts.length > 0) {
            setProducts(dbProducts);
          }
        });
      }
    );

    // 2. Real-time Photo Assets subscription in Cloud Firestore
    const unsubscribePhotos = subscribeToPhotos((firestorePhotos) => {
      if (firestorePhotos && Array.isArray(firestorePhotos) && firestorePhotos.length > 0) {
        setPhotoAssets(firestorePhotos);
        savePersistentData('photo_assets', firestorePhotos);
        try {
          localStorage.setItem('muso_photo_assets', JSON.stringify(firestorePhotos));
        } catch {
          // ignore
        }
      } else {
        getAllPhotoAssetsFromDB().then((assets) => {
          if (assets && assets.length > 0) {
            setPhotoAssets((prev) => {
              const existingIds = new Set(prev.map((a) => a.id));
              const newAssets = assets.filter((a) => !existingIds.has(a.id));
              return [...prev, ...newAssets];
            });
          }
        });
      }
    });

    // 3. Real-time Store Contact subscription in Cloud Firestore
    const unsubscribeContact = subscribeToStoreContact((firestoreContact) => {
      if (firestoreContact && firestoreContact.phone) {
        setStoreContact(firestoreContact);
        savePersistentData('store_contact', firestoreContact);
        try {
          localStorage.setItem('muso_store_contact', JSON.stringify(firestoreContact));
        } catch {
          // ignore
        }
      }
    });

    return () => {
      unsubscribeProducts();
      unsubscribePhotos();
      unsubscribeContact();
    };
  }, []);

  const handleSaveProducts = (newProducts: Product[]) => {
    setProducts(newProducts);
    savePersistentData('products_catalog', newProducts);
    // Register photo overrides immediately
    newProducts.forEach((p) => {
      const photo = p.uploadedImageUrl || (p.image && (p.image.startsWith('data:image/') || p.image.startsWith('http') || p.image.startsWith('/')) ? p.image : undefined);
      if (photo) {
        saveCustomPhotoOverride(p.id, photo);
      }
    });
    // Persist to Cloud Firestore for permanent global access
    saveAllProductsToFirestore(newProducts).catch((err) => {
      console.error('Failed to sync products to Firestore:', err);
    });
    syncProductsToServer(newProducts);
    try {
      localStorage.setItem('muso_products_catalog', JSON.stringify(newProducts));
    } catch {
      // ignore
    }
  };

  // Store contact state (persisted to localStorage & Firestore)
  const [storeContact, setStoreContact] = useState<StoreContact>(() => {
    const CONTACT_VERSION = 'v3_gryson';
    try {
      const savedVersion = localStorage.getItem('muso_contact_version');
      const saved = localStorage.getItem('muso_store_contact');
      if (saved && savedVersion === CONTACT_VERSION) {
        return JSON.parse(saved);
      }
      localStorage.setItem('muso_contact_version', CONTACT_VERSION);
      localStorage.setItem('muso_store_contact', JSON.stringify(DEFAULT_STORE_CONTACT));
    } catch {
      // ignore
    }
    return DEFAULT_STORE_CONTACT;
  });

  const handleSaveContact = (contact: StoreContact) => {
    setStoreContact(contact);
    savePersistentData('store_contact', contact);
    saveStoreContactToFirestore(contact).catch((err) => {
      console.error('Failed to sync contact to Firestore:', err);
    });
    syncContactToServer(contact);
    try {
      localStorage.setItem('muso_store_contact', JSON.stringify(contact));
    } catch {
      // ignore
    }
  };

  // Photo assets state (persisted to localStorage, IndexedDB and Cloud Firestore)
  const [photoAssets, setPhotoAssets] = useState<PhotoAsset[]>(() => {
    try {
      const saved = localStorage.getItem('muso_photo_assets');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [];
  });

  const handleSavePhotoAssets = (assets: PhotoAsset[]) => {
    setPhotoAssets(assets);
    savePersistentData('photo_assets', assets);
    assets.forEach((asset) => {
      savePhotoAssetToFirestore(asset).catch(() => {});
      savePhotoAssetToDB(asset);
    });
    syncPhotosToServer(assets);
    try {
      localStorage.setItem('muso_photo_assets', JSON.stringify(assets));
    } catch {
      // ignore
    }
  };

  // Reset entire catalog back to defaults
  const handleResetToDefaults = () => {
    setProducts(PRODUCTS);
    setStoreContact(DEFAULT_STORE_CONTACT);
    setPhotoAssets([]);
    setOwnerPin('1234');
    try {
      localStorage.removeItem('muso_products_catalog');
      localStorage.removeItem('muso_store_contact');
      localStorage.removeItem('muso_photo_assets');
      localStorage.removeItem('muso_owner_pin');
    } catch {
      // ignore
    }
  };

  // Handle owner successful login
  const handleOwnerAuthSuccess = () => {
    setIsOwnerAuthenticated(true);
    setViewMode('admin');
    setIsOwnerAuthModalOpen(false);
    try {
      sessionStorage.setItem('muso_owner_authenticated', 'true');
      localStorage.setItem('muso_view_mode', 'admin');
      if (window.location.pathname !== '/admin') {
        window.history.pushState(null, '', '/admin');
      }
    } catch {
      // ignore
    }
  };

  // Switch to customer storefront view
  const handleSwitchToCustomerView = () => {
    setViewMode('customer');
    try {
      localStorage.setItem('muso_view_mode', 'customer');
      if (window.location.pathname === '/admin') {
        window.history.pushState(null, '', '/');
      }
    } catch {
      // ignore
    }
  };

  // Navigate to Admin / Owner Studio
  const handleNavigateToAdmin = () => {
    if (isOwnerAuthenticated) {
      setViewMode('admin');
      try {
        window.history.pushState(null, '', '/admin');
      } catch {
        // ignore
      }
    } else {
      setIsOwnerAuthModalOpen(true);
    }
  };

  // Handle owner lock / logout
  const handleLockOwnerSession = () => {
    setIsOwnerAuthenticated(false);
    setViewMode('customer');
    try {
      sessionStorage.removeItem('muso_owner_authenticated');
      localStorage.setItem('muso_view_mode', 'customer');
      if (window.location.pathname === '/admin') {
        window.history.pushState(null, '', '/');
      }
    } catch {
      // ignore
    }
  };

  // Customer filters & search state
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc'>('featured');

  // Customer Modals
  const [selectedProductForModal, setSelectedProductForModal] = useState<Product | null>(null);
  const [directOrderProduct, setDirectOrderProduct] = useState<{
    product: Product;
    color: ColorOption;
    size: ApparelSize;
    quantity: number;
    customText?: string;
  } | null>(null);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState<boolean>(false);
  const [sizeGuideCategory, setSizeGuideCategory] = useState<string>('hoodies');
  const [isLogoShowcaseOpen, setIsLogoShowcaseOpen] = useState<boolean>(false);

  // Direct WhatsApp order trigger
  const handleOpenDirectOrder = (
    product: Product,
    color: ColorOption,
    size: ApparelSize,
    qty: number,
    customText?: string
  ) => {
    setSelectedProductForModal(null);
    setDirectOrderProduct({
      product,
      color,
      size,
      quantity: qty,
      customText,
    });
  };

  // Open size guide
  const handleOpenSizeGuide = (category = 'hoodies') => {
    setSizeGuideCategory(category);
    setIsSizeGuideOpen(true);
  };

  // Filtered & Sorted products for Customer view
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Category filter
      if (selectedCategory !== 'all' && p.category !== selectedCategory) {
        return false;
      }
      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesCategory = p.category.toLowerCase().includes(q);
        const matchesDescription = p.description.toLowerCase().includes(q);
        const matchesColors = p.colors.some((c) => c.name.toLowerCase().includes(q));
        if (!matchesName && !matchesCategory && !matchesDescription && !matchesColors) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      // Default: in-stock and featured first
      if (a.inStock !== false && b.inStock === false) return -1;
      if (a.inStock === false && b.inStock !== false) return 1;
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return 0;
    });
  }, [products, selectedCategory, searchQuery, sortBy]);

  // Compute category counts dynamically
  const categoriesWithCounts = useMemo(() => {
    return CATEGORIES.map(cat => {
      if (cat.id === 'all') {
        return { ...cat, count: products.length };
      }
      const count = products.filter(p => p.category === cat.id).length;
      return { ...cat, count };
    });
  }, [products]);

  // =========================================================================
  // VIEW MODE: ADMIN (OWNER PORTAL)
  // =========================================================================
  if (viewMode === 'admin') {
    // If not authenticated, render dedicated in-page PIN Unlock or First-Time Setup Screen
    if (!isOwnerAuthenticated) {
      return (
        <div className="min-h-screen bg-[#F9F8F3] dark:bg-[#11151c] flex flex-col font-sans text-neutral-900 dark:text-neutral-100 transition-colors duration-200 selection:bg-neutral-900 selection:text-white dark:selection:bg-white dark:selection:text-neutral-900">
          {/* Top Bar for Admin Login */}
          <div className="border-b border-[#e5dfd3] dark:border-[#2d3748] bg-white dark:bg-[#1a202c] px-4 py-3 flex items-center justify-between">
            <button
              onClick={handleSwitchToCustomerView}
              className="flex items-center gap-2 text-xs font-bold text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-colors"
            >
              <ArrowRight className="w-4 h-4 rotate-180" />
              <span>Back to Storefront (Public Catalog)</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleToggleTheme}
                className="p-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700 transition-colors"
                title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
              >
                {theme === 'dark' ? (
                  <span className="text-amber-400 text-xs font-bold flex items-center gap-1">☀️ Light</span>
                ) : (
                  <span className="text-neutral-700 text-xs font-bold flex items-center gap-1">🌙 Dark</span>
                )}
              </button>
            </div>
          </div>

          {/* Centered Login / Setup Card */}
          <div className="flex-1 flex items-center justify-center p-4 sm:p-6">
            <div className="w-full max-w-md bg-white dark:bg-[#1a202c] rounded-3xl shadow-2xl border border-[#dfd7c9] dark:border-[#2d3748] p-6 sm:p-8 space-y-6">
              <div className="text-center space-y-2">
                <div className="flex justify-center mb-1">
                  <div className="w-16 h-16 rounded-2xl bg-[#EAE5DB] dark:bg-[#232a35] border border-[#d8d0c3] dark:border-[#374151] flex items-center justify-center p-1.5 shadow-xs overflow-hidden">
                    <MusoBrandLogo className="w-full h-full object-contain" />
                  </div>
                </div>
                <h1 className="text-xl sm:text-2xl font-black text-neutral-900 dark:text-white font-heading">
                  {isOwnerPinCreated ? 'Muso Owner Studio' : 'Create Admin Passlock'}
                </h1>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-xs mx-auto">
                  {isOwnerPinCreated
                    ? 'Enter your private master passlock to unlock owner management, prices, and photo assets.'
                    : 'Set up your secret admin passlock before entering the Studio for the first time. This key protects your catalog.'}
                </p>
              </div>

              {/* Owner Passcode Form: First-Time Setup or Existing PIN Unlock */}
              {isOwnerPinCreated ? (
                <OwnerPinForm
                  onSuccess={handleOwnerAuthSuccess}
                  correctPin={ownerPin}
                  onReturnToStore={handleSwitchToCustomerView}
                  onResetSetup={handleResetOwnerPasslockSetup}
                />
              ) : (
                <OwnerSetupPasslockForm
                  onSetPasslock={handleSetOwnerPasslock}
                  onReturnToStore={handleSwitchToCustomerView}
                />
              )}
            </div>
          </div>
        </div>
      );
    }

    return (
      <>
        <MusoAdminPortal
          products={products}
          onSaveProducts={handleSaveProducts}
          storeContact={storeContact}
          onSaveStoreContact={handleSaveContact}
          photoAssets={photoAssets}
          onSavePhotoAssets={handleSavePhotoAssets}
          theme={theme}
          onToggleTheme={handleToggleTheme}
          onSwitchToCustomerView={handleSwitchToCustomerView}
          onOpenLogoShowcase={() => setIsLogoShowcaseOpen(true)}
          onLockOwnerSession={handleLockOwnerSession}
          ownerPin={ownerPin}
          onUpdateOwnerPin={handleUpdateOwnerPin}
          onResetToDefaults={handleResetToDefaults}
        />

        <LogoShowcaseModal
          isOpen={isLogoShowcaseOpen}
          onClose={() => setIsLogoShowcaseOpen(false)}
          storeContact={storeContact}
        />
      </>
    );
  }

  // =========================================================================
  // VIEW MODE: CUSTOMER STOREFRONT
  // =========================================================================
  return (
    <div className="min-h-screen bg-[#F9F8F3] dark:bg-[#11151c] flex flex-col font-sans text-neutral-900 dark:text-neutral-100 transition-colors duration-200 selection:bg-neutral-900 selection:text-white dark:selection:bg-white dark:selection:text-neutral-900">
      {/* Top Navbar */}
      <Navbar
        onOpenLogoShowcase={() => setIsLogoShowcaseOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        storeContact={storeContact}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        isOwnerAuthenticated={isOwnerAuthenticated}
        onReturnToStudio={handleNavigateToAdmin}
        onOwnerLogout={handleLockOwnerSession}
        onNavigateAdmin={handleNavigateToAdmin}
      />

      {/* Hero Banner Section */}
      <section className="relative overflow-hidden bg-neutral-900 dark:bg-[#0c0f14] text-white py-12 px-4 sm:px-6 lg:px-8 border-b border-neutral-800">
        {/* Subtle background ambient accents */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-neutral-700/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#EAE5DB]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            {/* Left Customer Info */}
            <div className="max-w-2xl text-center lg:text-left space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-neutral-200 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Choose Size & Colour • Send Details Directly to WhatsApp</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-white font-heading">
                Quality Hoodies, Tracksuits, Ponchos, Polo Shirts & Tees
              </h1>

              <p className="text-sm sm:text-base text-neutral-300 leading-relaxed max-w-xl">
                Select your apparel size and color, then tap <strong>Send details to WhatsApp</strong>. Chat with <strong>{storeContact.name} ({storeContact.phone})</strong> to finalize payment (M-Pesa) and prompt countrywide delivery!
              </p>

              <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-4">
                <a
                  href={`https://wa.me/${storeContact.phone.replace(/\D/g, '')}?text=${encodeURIComponent(
                    `Hello ${storeContact.name}! I'm checking out your online apparel catalog and would like to order.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white hover:bg-neutral-200 text-neutral-900 text-sm font-extrabold shadow-lg transition-all transform active:scale-98"
                >
                  <MessageSquare className="w-4 h-4 text-emerald-600" />
                  <span>Chat on WhatsApp ({storeContact.phone})</span>
                </a>

                <button
                  type="button"
                  onClick={() => handleOpenSizeGuide('hoodies')}
                  className="flex items-center gap-2 px-5 py-3.5 rounded-xl bg-neutral-800/80 hover:bg-neutral-800 text-white text-sm font-semibold border border-neutral-700 transition-colors"
                >
                  <Ruler className="w-4 h-4 text-neutral-300" />
                  <span>Size Measurement Guide</span>
                </button>
              </div>
            </div>

            {/* Right: Featured Brand Card in Light Beige / Sand (#EAE5DB) */}
            <div className="w-full max-w-md bg-[#EAE5DB] dark:bg-[#1a202c] text-neutral-900 dark:text-white p-6 rounded-3xl border border-[#d8d0c3] dark:border-[#2d3748] shadow-lg flex flex-col items-center text-center space-y-4">
              <div className="bg-white dark:bg-[#12161c] p-4 rounded-2xl border border-[#d8d0c3] dark:border-[#2d3748] shadow-xs w-full flex flex-col items-center justify-center">
                <MusoBrandLogo variant="full" size="lg" phone={storeContact.phone} />
              </div>
              <div className="space-y-1">
                <h2 className="text-sm font-extrabold uppercase tracking-wider text-neutral-800 dark:text-neutral-200">
                  Direct WhatsApp Apparel Ordering
                </h2>
                <p className="text-xs text-neutral-600 dark:text-neutral-400">
                  Pick size & colour • Direct WhatsApp seller chat • Delivery countrywide
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2 w-full pt-1">
                <div className="bg-white/90 dark:bg-[#12161c] p-2.5 rounded-xl border border-[#d8d0c3] dark:border-[#2d3748] text-left">
                  <span className="text-[10px] font-bold uppercase text-neutral-600 dark:text-neutral-400 block">Quality</span>
                  <span className="text-xs font-extrabold text-neutral-900 dark:text-white">Heavyweight Cotton</span>
                </div>
                <div className="bg-white/90 dark:bg-[#12161c] p-2.5 rounded-xl border border-[#d8d0c3] dark:border-[#2d3748] text-left">
                  <span className="text-[10px] font-bold uppercase text-neutral-600 dark:text-neutral-400 block">Custom</span>
                  <span className="text-xs font-extrabold text-neutral-900 dark:text-white">Print & Embroidery</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Customer Catalog */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Category Filter Pills & Controls Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#e5dfd3] dark:border-[#2d3748]">
          {/* Categories Horizontal Scroll */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {categoriesWithCounts.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  id={`cat-btn-${cat.id}`}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    isSelected
                      ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-xs'
                      : 'bg-white dark:bg-[#1a202c] text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 border border-[#e5dfd3] dark:border-[#2d3748]'
                  }`}
                >
                  <span>{cat.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      isSelected
                        ? 'bg-neutral-700 text-white dark:bg-neutral-200 dark:text-neutral-900'
                        : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400'
                    }`}
                  >
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Sort selector & Count */}
          <div className="flex items-center justify-between md:justify-end gap-3 text-xs text-neutral-500 dark:text-neutral-400">
            <span className="font-semibold text-neutral-800 dark:text-neutral-200">
              Showing {filteredProducts.length} item{filteredProducts.length !== 1 ? 's' : ''}
            </span>

            <div className="flex items-center gap-1.5 bg-white dark:bg-[#1a202c] border border-[#e5dfd3] dark:border-[#2d3748] rounded-xl px-2.5 py-1.5 shadow-2xs">
              <SlidersHorizontal className="w-3.5 h-3.5 text-neutral-500 dark:text-neutral-400" />
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-xs font-semibold text-neutral-800 dark:text-white outline-hidden cursor-pointer"
              >
                <option value="featured" className="dark:bg-[#1a202c]">Featured First</option>
                <option value="price-asc" className="dark:bg-[#1a202c]">Price: Low to High</option>
                <option value="price-desc" className="dark:bg-[#1a202c]">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Product Cards Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-[#1a202c] rounded-3xl border border-[#e5dfd3] dark:border-[#2d3748] p-8 space-y-4">
            <div className="w-16 h-16 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mx-auto text-neutral-400">
              <Shirt className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-neutral-900 dark:text-white">No items found</h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 max-w-sm mx-auto">
                No apparel matched your current search or category filter. Try clearing your search query.
              </p>
            </div>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="px-5 py-2.5 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-bold transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onOpenDetails={setSelectedProductForModal}
                onDirectOrder={(prod, col, sz, qty) => handleOpenDirectOrder(prod, col, sz, qty)}
                onOpenSizeGuide={handleOpenSizeGuide}
              />
            ))}
          </div>
        )}

        {/* Bulk Orders & Wholesale Banner */}
        <div className="mt-12 bg-[#EAE5DB] dark:bg-[#1a202c] border border-[#d8d0c3] dark:border-[#2d3748] rounded-3xl p-6 sm:p-8 text-neutral-900 dark:text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs">
          <div className="space-y-2 text-center md:text-left max-w-xl">
            <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-neutral-900 dark:text-neutral-100 bg-white/90 dark:bg-neutral-800 border border-[#d8d0c3] dark:border-[#2d3748] px-3 py-1 rounded-full shadow-2xs">
              <Flame className="w-3.5 h-3.5 text-amber-600" />
              <span>Bulk & Custom Orders</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-neutral-900 dark:text-white font-heading">
              Ordering for your brand, team, event, school, or group?
            </h3>
            <p className="text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed font-medium">
              We offer special discounted wholesale rates for bulk orders on plain and customized hoodies, polo shirts, sweatshirts, and caps. Message Muso directly on WhatsApp to get a custom quote!
            </p>
          </div>

          <a
            id="bulk-inquiry-whatsapp-btn"
            href={`https://wa.me/${storeContact.phone.replace(/\D/g, '')}?text=${encodeURIComponent(
              `Hello ${storeContact.name}, I am interested in placing a bulk/wholesale apparel order. Please share your wholesale price list and bulk discounts!`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 flex items-center gap-2 px-6 py-3.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-900 text-sm font-extrabold shadow-md transition-all transform active:scale-98"
          >
            <MessageSquare className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
            <span>Inquire Bulk Discounts</span>
          </a>
        </div>
      </main>

      {/* Floating WhatsApp Quick Action Button for Desktop */}
      <aside aria-label="WhatsApp chat actions" className="hidden md:flex fixed bottom-6 right-6 z-40 flex-col items-end gap-3 pointer-events-auto">
        <a
          id="floating-whatsapp-btn"
          href={`https://wa.me/${storeContact.phone.replace(/\D/g, '')}?text=${encodeURIComponent(
            `Hello ${storeContact.name}, I'm browsing your online apparel catalog!`
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-2.5 px-4 py-3 rounded-full bg-emerald-600 text-white shadow-xl hover:bg-emerald-500 transition-all transform hover:scale-105 active:scale-95 border-2 border-white/20"
          title="Direct WhatsApp Chat"
        >
          <MessageSquare className="w-5 h-5 fill-current" />
          <span className="text-xs font-extrabold pr-1">WhatsApp Muso ({storeContact.phone})</span>
        </a>
      </aside>

      {/* Persistent Mobile Bottom Action Bar (Categories, Search, Size Guide, WhatsApp) */}
      <MobileBottomBar
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        sortBy={sortBy}
        onSortChange={setSortBy}
        onOpenSizeGuide={() => handleOpenSizeGuide('hoodies')}
        storeContact={storeContact}
        totalProductsCount={products.length}
        filteredCount={filteredProducts.length}
      />

      {/* Modals */}
      {selectedProductForModal && (
        <ProductModal
          isOpen={!!selectedProductForModal}
          onClose={() => setSelectedProductForModal(null)}
          product={selectedProductForModal}
          onDirectOrder={handleOpenDirectOrder}
          onOpenSizeGuide={handleOpenSizeGuide}
          storeContact={storeContact}
        />
      )}

      {directOrderProduct && (
        <DirectOrderModal
          isOpen={!!directOrderProduct}
          onClose={() => setDirectOrderProduct(null)}
          product={directOrderProduct.product}
          initialColor={directOrderProduct.color}
          initialSize={directOrderProduct.size}
          initialQuantity={directOrderProduct.quantity}
          storeContact={storeContact}
        />
      )}

      <SizeGuideModal
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
        initialCategory={sizeGuideCategory}
      />

      <LogoShowcaseModal
        isOpen={isLogoShowcaseOpen}
        onClose={() => setIsLogoShowcaseOpen(false)}
        storeContact={storeContact}
      />

      <OwnerAuthModal
        isOpen={isOwnerAuthModalOpen}
        onClose={() => setIsOwnerAuthModalOpen(false)}
        onSuccess={handleOwnerAuthSuccess}
        correctPin={ownerPin}
        isPinCreated={isOwnerPinCreated}
        onSetPasslock={handleSetOwnerPasslock}
        onResetSetup={handleResetOwnerPasslockSetup}
      />

      {/* Footer */}
      <Footer
        storeContact={storeContact}
        onSelectCategory={setSelectedCategory}
        onOpenSizeGuide={() => handleOpenSizeGuide('hoodies')}
        onOpenOwnerAuth={handleNavigateToAdmin}
        isOwnerAuthenticated={isOwnerAuthenticated}
        onOpenStudio={handleNavigateToAdmin}
      />
    </div>
  );
}
