import React, { useState, useRef } from 'react';
import {
  Shirt,
  Plus,
  Edit2,
  Trash2,
  Upload,
  Image as ImageIcon,
  MessageSquare,
  Phone,
  Save,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  Eye,
  Sliders,
  Sun,
  Moon,
  Tag,
  Palette,
  Layers,
  ArrowLeft,
  X,
  FileDown,
  FileUp,
  AlertCircle,
  ExternalLink,
  DollarSign,
  Info,
  Lock,
  Copy,
  Check,
  LogOut,
  Wand2
} from 'lucide-react';
import { 
  Product, 
  ProductCategory, 
  StoreContact, 
  PhotoAsset, 
  AppTheme, 
  ColorOption, 
  ApparelSize 
} from '../types';
import { MusoBrandLogo } from './MusoBrandLogo';
import { COMMON_COLORS, CATEGORIES } from '../data/products';
import { compressAndResizeImage, uploadImageToServer } from '../utils/imageStorage';
import { saveCustomPhotoOverride } from '../assets/images';

interface MusoAdminPortalProps {
  products: Product[];
  onSaveProducts: (products: Product[]) => void;
  storeContact: StoreContact;
  onSaveStoreContact: (contact: StoreContact) => void;
  photoAssets: PhotoAsset[];
  onSavePhotoAssets: (assets: PhotoAsset[]) => void;
  theme: AppTheme;
  onToggleTheme: () => void;
  onSwitchToCustomerView: () => void;
  onOpenLogoShowcase: () => void;
  onLockOwnerSession: () => void;
  ownerPin: string;
  onUpdateOwnerPin: (newPin: string) => void;
  onResetToDefaults: () => void;
}

export const MusoAdminPortal: React.FC<MusoAdminPortalProps> = ({
  products,
  onSaveProducts,
  storeContact,
  onSaveStoreContact,
  photoAssets,
  onSavePhotoAssets,
  theme,
  onToggleTheme,
  onSwitchToCustomerView,
  onOpenLogoShowcase,
  onLockOwnerSession,
  ownerPin,
  onUpdateOwnerPin,
  onResetToDefaults,
}) => {
  // Navigation tabs in Admin
  const [activeTab, setActiveTab] = useState<'products' | 'photos' | 'store-settings' | 'order-simulator' | 'backup'>('products');

  // Contact form state
  const [contactForm, setContactForm] = useState<StoreContact>(storeContact);
  const [contactSavedAlert, setContactSavedAlert] = useState(false);

  // Security / PIN state
  const [currentPinInput, setCurrentPinInput] = useState('');
  const [newPinInput, setNewPinInput] = useState('');
  const [pinChangeSuccess, setPinChangeSuccess] = useState(false);
  const [pinChangeError, setPinChangeError] = useState('');

  // Product editing modal / state
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchProductQuery, setSearchProductQuery] = useState('');
  const [filterProductCategory, setFilterProductCategory] = useState<ProductCategory>('all');

  // Custom Color creation in Product Editor
  const [customColorName, setCustomColorName] = useState('');
  const [customColorHex, setCustomColorHex] = useState('#000000');

  // New photo upload state
  const fileInputRef = useRef<HTMLInputElement>(null);
  const productPhotoInputRef = useRef<HTMLInputElement>(null);
  const [uploadCategory, setUploadCategory] = useState<ProductCategory>('all');
  const [photoUrlInput, setPhotoUrlInput] = useState('');
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [uploadSuccessNotification, setUploadSuccessNotification] = useState<string | null>(null);
  const [uploadTargetProductId, setUploadTargetProductId] = useState<string | undefined>(undefined);

  // Mockup Generator Studio State
  const [mockupGarmentType, setMockupGarmentType] = useState<ProductCategory>('hoodies');
  const [mockupColor, setMockupColor] = useState<string>('#171717');
  const [mockupColorName, setMockupColorName] = useState<string>('Jet Black');
  const [mockupText, setMockupText] = useState<string>("MUSO APPAREL");
  const [mockupCreatedAlert, setMockupCreatedAlert] = useState(false);

  // Default empty product template
  const createBlankProduct = (): Product => ({
    id: `prod-${Date.now()}`,
    name: '',
    category: 'hoodies',
    subtitle: 'High-density premium cotton fabric',
    description: 'High quality apparel crafted for comfort, durability, and custom branding.',
    price: 2000,
    currency: 'KSh',
    image: 'hoodie-pullover',
    featured: false,
    popularBadge: 'New Item',
    colors: [COMMON_COLORS.black, COMMON_COLORS.white, COMMON_COLORS.maroon, COMMON_COLORS.navyBlue],
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    fabric: '100% Premium Heavyweight Cotton',
    fit: 'Regular Unisex Fit',
    features: ['Double-stitched seams', 'Colorfast dye', 'Print & embroidery ready'],
    customizable: true,
    inStock: true,
    uploadedImageUrl: ''
  });

  // Handle opening product modal
  const handleOpenAddProduct = () => {
    setEditingProduct(createBlankProduct());
    setIsProductModalOpen(true);
  };

  const handleOpenEditProduct = (prod: Product) => {
    setEditingProduct({ ...prod, colors: [...prod.colors], sizes: [...prod.sizes] });
    setIsProductModalOpen(true);
  };

  const handleDuplicateProduct = (prod: Product) => {
    const duplicated: Product = {
      ...prod,
      id: `prod-${Date.now()}`,
      name: `${prod.name} (Copy)`,
      colors: [...prod.colors],
      sizes: [...prod.sizes],
      features: [...prod.features]
    };
    onSaveProducts([duplicated, ...products]);
  };

  const handleDeleteProduct = (id: string) => {
    if (window.confirm('Are you sure you want to delete this product from the catalog?')) {
      const updated = products.filter(p => p.id !== id);
      onSaveProducts(updated);
    }
  };

  const handleToggleProductStock = (id: string) => {
    const updated = products.map(p => {
      if (p.id === id) {
        return { ...p, inStock: p.inStock === false ? true : false };
      }
      return p;
    });
    onSaveProducts(updated);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct || !editingProduct.name.trim()) {
      alert('Please enter a product title.');
      return;
    }

    if (editingProduct.sizes.length === 0) {
      alert('Please select at least one available size.');
      return;
    }

    if (editingProduct.colors.length === 0) {
      alert('Please select at least one available color.');
      return;
    }

    const existingIndex = products.findIndex(p => p.id === editingProduct.id);
    let updated: Product[];
    if (existingIndex >= 0) {
      updated = [...products];
      updated[existingIndex] = editingProduct;
    } else {
      updated = [editingProduct, ...products];
    }

    const effectivePhoto = editingProduct.uploadedImageUrl || (editingProduct.image && (editingProduct.image.startsWith('data:image/') || editingProduct.image.startsWith('/uploads/') || editingProduct.image.startsWith('http')) ? editingProduct.image : undefined);
    if (effectivePhoto) {
      saveCustomPhotoOverride(editingProduct.id, effectivePhoto);
    }

    onSaveProducts(updated);
    setIsProductModalOpen(false);
    setEditingProduct(null);
  };

  // Add custom color swatch to editing product
  const handleAddCustomColor = () => {
    if (!customColorName.trim()) return;
    if (!editingProduct) return;

    const newColor: ColorOption = {
      name: customColorName.trim(),
      hex: customColorHex,
      textColor: '#FFFFFF'
    };

    setEditingProduct({
      ...editingProduct,
      colors: [...editingProduct.colors, newColor]
    });

    setCustomColorName('');
  };

  // Helper to find similar products based on filename or search keywords
  const findSimilarProducts = (text: string, currentProducts: Product[]): Product[] => {
    const clean = text.toLowerCase().replace(/[-_.]/g, ' ');
    return currentProducts.filter(p => {
      const pName = p.name.toLowerCase();
      const pCat = p.category.toLowerCase().replace('-', ' ');
      const pId = p.id.toLowerCase();
      
      // Check explicit keyword associations
      if ((clean.includes('half') || clean.includes('sleeveless')) && (pName.includes('half') || pName.includes('sleeveless') || pId.includes('half'))) return true;
      if (clean.includes('zip') && (pName.includes('zip') || pId.includes('zip'))) return true;
      if (clean.includes('pullover') && (pName.includes('pullover') || pId.includes('pullover'))) return true;
      if (clean.includes('polo') && (pName.includes('polo') || pCat.includes('polo'))) return true;
      if ((clean.includes('sweatshirt') || clean.includes('sweater') || clean.includes('crewneck')) && (pName.includes('sweatshirt') || pCat.includes('sweatshirt'))) return true;
      if ((clean.includes('poncho') || clean.includes('fringe') || clean.includes('maasai')) && (pName.includes('poncho') || pCat.includes('poncho'))) return true;
      if ((clean.includes('tracksuit') || clean.includes('jogger') || clean.includes('athletic')) && (pName.includes('tracksuit') || pCat.includes('tracksuit'))) return true;
      if ((clean.includes('cap') || clean.includes('hat') || clean.includes('baseball')) && (pName.includes('cap') || pCat.includes('caps'))) return true;
      if ((clean.includes('plain') || clean.includes('tshirt') || clean.includes('t-shirt') || clean.includes('tee')) && (pName.includes('t-shirt') || pCat.includes('plain-tshirts'))) return true;
      if (clean.includes('hoodie') && !clean.includes('half') && !clean.includes('zip') && (pName.includes('pullover') || pName.includes('hoodie'))) return true;
      
      // General token matching
      const tokens = clean.split(/\s+/).filter(t => t.length > 2 && !['image', 'whatsapp', 'img', 'photo', 'screen', 'shot', 'file'].includes(t));
      return tokens.some(t => pName.includes(t) || pCat.includes(t) || pId.includes(t));
    });
  };

  // Handle Photo File Upload with Auto-Matching and Client-Side Optimization
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>, targetProductId?: string) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file (PNG, JPG, WEBP).');
      return;
    }

    const effectiveTargetId = targetProductId || uploadTargetProductId;
    setIsUploadingPhoto(true);

    try {
      // Compress and resize client-side to ensure instant performance & zero storage quota errors
      const compressedDataUrl = await compressAndResizeImage(file, 1200, 0.88);
      // Upload to server so the photo gets a permanent public URL and sticks across all shared links
      const serverUrl = await uploadImageToServer(compressedDataUrl, file.name);
      const dataUrl = serverUrl || compressedDataUrl;

      const newAsset: PhotoAsset = {
        id: `photo-${Date.now()}`,
        name: file.name.replace(/\.[^/.]+$/, ""),
        url: dataUrl,
        category: uploadCategory,
        dateAdded: new Date().toLocaleDateString(),
        fileSize: `${Math.round((compressedDataUrl.length * 0.75) / 1024)} KB (Web Ready)`,
        assignedProductId: effectiveTargetId
      };

      const updatedAssets = [newAsset, ...photoAssets];
      onSavePhotoAssets(updatedAssets);

      // If uploaded directly in product editor modal
      if (editingProduct) {
        setEditingProduct({
          ...editingProduct,
          uploadedImageUrl: dataUrl,
          image: dataUrl
        });
      }

      // 1. Direct Target Product ID passed
      if (effectiveTargetId) {
        const targetProduct = products.find(p => p.id === effectiveTargetId);
        const updated = products.map(p => {
          if (p.id === effectiveTargetId) {
            return {
              ...p,
              uploadedImageUrl: dataUrl,
              image: dataUrl
            };
          }
          return p;
        });
        saveCustomPhotoOverride(effectiveTargetId, dataUrl);
        onSaveProducts(updated);
        setUploadSuccessNotification(`Photo updated for "${targetProduct?.name || 'Item'}" and is now active on customer store!`);
        setTimeout(() => setUploadSuccessNotification(null), 4500);
      } else {
        // 2. Auto-Match based on similar product name
        const matched = findSimilarProducts(file.name, products);
        if (matched.length > 0) {
          const matchedIds = new Set(matched.map(m => m.id));
          const updated = products.map(p => {
            if (matchedIds.has(p.id)) {
              saveCustomPhotoOverride(p.id, dataUrl);
              return {
                ...p,
                uploadedImageUrl: dataUrl,
                image: dataUrl
              };
            }
            return p;
          });
          onSaveProducts(updated);
          const matchedNames = matched.map(m => m.name).join(', ');
          setUploadSuccessNotification(`Photo matched by filename and updated for: ${matchedNames} on customer store!`);
          setTimeout(() => setUploadSuccessNotification(null), 5000);
        } else {
          setUploadSuccessNotification(`Photo "${file.name}" saved to Photo Library. Select "Assign to Product" below to show it on the customer store.`);
          setTimeout(() => setUploadSuccessNotification(null), 4000);
        }
      }
    } catch (err) {
      console.error('Photo optimization error:', err);
    } finally {
      setIsUploadingPhoto(false);
      setUploadTargetProductId(undefined);
      if (e.target) e.target.value = '';
    }
  };

  // Trigger file upload for a specific product
  const triggerUploadForProduct = (productId: string) => {
    setUploadTargetProductId(productId);
    fileInputRef.current?.click();
  };

  // Remove uploaded photo from a product (reverts to standard vector preview)
  const handleRemovePhotoFromProduct = (productId: string) => {
    const updated = products.map(p => {
      if (p.id === productId) {
        return {
          ...p,
          uploadedImageUrl: undefined,
          image: p.category.includes('hoodie') ? (p.name.toLowerCase().includes('half') ? 'hoodie-half' : 'hoodie-pullover') : p.category
        };
      }
      return p;
    });
    saveCustomPhotoOverride(productId, '');
    onSaveProducts(updated);
    setUploadSuccessNotification('Photo removed. Item reverted to high-precision graphic on customer store.');
    setTimeout(() => setUploadSuccessNotification(null), 3000);
  };

  // Add photo via Web URL
  const handleAddPhotoUrl = () => {
    if (!photoUrlInput.trim()) return;

    const newAsset: PhotoAsset = {
      id: `photo-${Date.now()}`,
      name: `Photo Asset ${photoAssets.length + 1}`,
      url: photoUrlInput.trim(),
      category: uploadCategory,
      dateAdded: new Date().toLocaleDateString(),
      fileSize: 'Web URL Link',
    };

    onSavePhotoAssets([newAsset, ...photoAssets]);
    setPhotoUrlInput('');
    setUploadSuccessNotification('Image URL added to photo library.');
    setTimeout(() => setUploadSuccessNotification(null), 3000);
  };

  // Delete photo asset
  const handleDeletePhoto = (id: string) => {
    if (window.confirm('Delete this photo asset?')) {
      onSavePhotoAssets(photoAssets.filter(a => a.id !== id));
    }
  };

  // Assign photo to product
  const handleAssignPhotoToProduct = (photoUrl: string, productId: string) => {
    const targetProduct = products.find(p => p.id === productId);
    const updated = products.map(p => {
      if (p.id === productId) {
        return {
          ...p,
          uploadedImageUrl: photoUrl,
          image: photoUrl
        };
      }
      return p;
    });
    saveCustomPhotoOverride(productId, photoUrl);
    onSaveProducts(updated);
    setUploadSuccessNotification(`Photo assigned to "${targetProduct?.name || 'Item'}" and updated on customer storefront!`);
    setTimeout(() => setUploadSuccessNotification(null), 4000);
  };

  // Auto-apply photo to all similar items
  const handleApplyPhotoToSimilarProducts = (photoUrl: string, photoName: string) => {
    const matched = findSimilarProducts(photoName, products);
    if (matched.length === 0) {
      alert(`No products found matching "${photoName}". Please use the dropdown to assign directly.`);
      return;
    }
    const matchedIds = new Set(matched.map(m => m.id));
    const updated = products.map(p => {
      if (matchedIds.has(p.id)) {
        saveCustomPhotoOverride(p.id, photoUrl);
        return {
          ...p,
          uploadedImageUrl: photoUrl,
          image: photoUrl
        };
      }
      return p;
    });
    onSaveProducts(updated);
    setUploadSuccessNotification(`Photo applied to all matching items (${matched.map(m => m.name).join(', ')}) on customer store!`);
    setTimeout(() => setUploadSuccessNotification(null), 5000);
  };

  // Save Store Settings
  const handleSaveContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveStoreContact(contactForm);
    setContactSavedAlert(true);
    setTimeout(() => setContactSavedAlert(false), 3000);
  };

  // Change Owner Passlock / PIN
  const handleChangePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPinChangeError('');
    setPinChangeSuccess(false);

    if (ownerPin && currentPinInput !== ownerPin) {
      setPinChangeError('Current passlock is incorrect.');
      return;
    }

    if (newPinInput.length < 4) {
      setPinChangeError('New passlock must be at least 4 digits or characters.');
      return;
    }

    onUpdateOwnerPin(newPinInput);
    setPinChangeSuccess(true);
    setCurrentPinInput('');
    setNewPinInput('');
    setTimeout(() => setPinChangeSuccess(false), 3500);
  };

  // Create Mockup Studio Asset
  const handleCreateMockupAsset = () => {
    // Generate an SVG data URI of the garment mockup
    const svgString = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
      <rect width="400" height="400" fill="#EAE5DB"/>
      <g transform="translate(40, 30)">
        <path d="M 80 40 Q 160 80 240 40 L 300 100 L 260 140 L 230 120 L 230 320 L 90 320 L 90 120 L 60 140 L 20 100 Z" fill="${mockupColor}" stroke="#262626" stroke-width="4"/>
        <circle cx="160" cy="50" r="30" fill="none" stroke="#262626" stroke-width="4"/>
        <text x="160" y="190" font-family="sans-serif" font-size="16" font-weight="900" text-anchor="middle" fill="#FFFFFF">${mockupText}</text>
        <text x="160" y="215" font-family="sans-serif" font-size="10" font-weight="700" text-anchor="middle" fill="#EAE5DB">${mockupColorName}</text>
      </g>
    </svg>`;
    const dataUri = `data:image/svg+xml;utf8,${encodeURIComponent(svgString)}`;

    const newAsset: PhotoAsset = {
      id: `mockup-${Date.now()}`,
      name: `${mockupColorName} ${mockupGarmentType.toUpperCase()} Mockup`,
      url: dataUri,
      category: mockupGarmentType,
      dateAdded: new Date().toLocaleDateString(),
      fileSize: 'Mockup Graphic',
    };

    onSavePhotoAssets([newAsset, ...photoAssets]);
    setMockupCreatedAlert(true);
    setTimeout(() => setMockupCreatedAlert(false), 3000);
  };

  // Backup & Restore
  const handleExportData = () => {
    const dataToExport = {
      storeContact,
      products,
      photoAssets,
      ownerPin,
      exportDate: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `muso-apparel-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.products && Array.isArray(parsed.products)) {
          onSaveProducts(parsed.products);
        }
        if (parsed.storeContact) {
          onSaveStoreContact(parsed.storeContact);
          setContactForm(parsed.storeContact);
        }
        if (parsed.photoAssets && Array.isArray(parsed.photoAssets)) {
          onSavePhotoAssets(parsed.photoAssets);
        }
        if (parsed.ownerPin) {
          onUpdateOwnerPin(parsed.ownerPin);
        }
        alert('Catalog & Store data restored successfully!');
      } catch (err) {
        alert('Failed to parse backup JSON file.');
      }
    };
    reader.readAsText(file);
  };

  const allAvailableSizes: ApparelSize[] = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', 'One Size'];

  // Filtered Products for Admin
  const adminFilteredProducts = products.filter(p => {
    if (filterProductCategory !== 'all' && p.category !== filterProductCategory) return false;
    if (searchProductQuery.trim()) {
      const q = searchProductQuery.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-[#F9F8F3] dark:bg-[#11151c] text-neutral-900 dark:text-neutral-100 flex flex-col font-sans transition-colors duration-200">
      {/* Top Admin Navigation Header */}
      <header className="sticky top-0 z-30 bg-white/95 dark:bg-[#1a202c]/95 backdrop-blur-md border-b border-[#e5dfd3] dark:border-[#2d3748] shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
          {/* Brand & Studio Title */}
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenLogoShowcase}
              className="group flex items-center gap-2.5 text-left focus:outline-hidden"
              title="Click to view full official logo"
            >
              <MusoBrandLogo variant="emblem" size="md" />
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-base sm:text-lg font-black tracking-tight font-heading text-neutral-900 dark:text-white">
                    Gryson Studio Manager
                  </h1>
                  <span className="text-[10px] font-black uppercase tracking-wider bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 px-2 py-0.5 rounded-full">
                    Owner Portal
                  </span>
                </div>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 hidden sm:block">
                  Add photos, edit catalog products, pricing & WhatsApp orders
                </p>
              </div>
            </button>
          </div>

          {/* Right Action Controls: Theme Toggle, Preview Customer Store, Lock */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Theme Toggle */}
            <button
              id="admin-theme-toggle-btn"
              type="button"
              onClick={onToggleTheme}
              className="p-2.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700 transition-colors"
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-neutral-600" />
              )}
            </button>

            {/* View Customer Storefront Button */}
            <button
              id="switch-to-customer-view-btn"
              type="button"
              onClick={onSwitchToCustomerView}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-900 text-xs font-black shadow-md hover:shadow-lg transition-all active:scale-98"
              title="Exit admin panel and return to Customer Storefront"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Exit to Customer Store</span>
              <span className="sm:hidden">Exit Store</span>
            </button>

            {/* Lock / Log Out */}
            <button
              id="admin-lock-session-btn"
              type="button"
              onClick={onLockOwnerSession}
              className="p-2 sm:px-3 sm:py-2 rounded-xl bg-neutral-100 hover:bg-red-100 dark:bg-neutral-800 dark:hover:bg-red-950/40 text-neutral-700 hover:text-red-700 dark:text-neutral-300 dark:hover:text-red-300 border border-neutral-200 dark:border-neutral-700 transition-colors flex items-center gap-1.5 text-xs font-bold"
              title="Lock / Log out of Owner Portal"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Lock Session</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation Bar */}
        <div className="border-t border-[#e5dfd3] dark:border-[#2d3748] bg-[#F9F8F3] dark:bg-[#12161c]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-1 overflow-x-auto py-1.5 scrollbar-none">
            <button
              id="admin-tab-products"
              onClick={() => setActiveTab('products')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                activeTab === 'products'
                  ? 'bg-white dark:bg-[#1a202c] text-neutral-900 dark:text-white shadow-xs border border-[#e5dfd3] dark:border-[#2d3748]'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-white/50'
              }`}
            >
              <Shirt className="w-4 h-4" />
              <span>Products Catalog ({products.length})</span>
            </button>

            <button
              id="admin-tab-photos"
              onClick={() => setActiveTab('photos')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                activeTab === 'photos'
                  ? 'bg-white dark:bg-[#1a202c] text-neutral-900 dark:text-white shadow-xs border border-[#e5dfd3] dark:border-[#2d3748]'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-white/50'
              }`}
            >
              <ImageIcon className="w-4 h-4" />
              <span>Photo Studio & Uploads ({photoAssets.length})</span>
            </button>

            <button
              id="admin-tab-settings"
              onClick={() => setActiveTab('store-settings')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                activeTab === 'store-settings'
                  ? 'bg-white dark:bg-[#1a202c] text-neutral-900 dark:text-white shadow-xs border border-[#e5dfd3] dark:border-[#2d3748]'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-white/50'
              }`}
            >
              <Phone className="w-4 h-4" />
              <span>Profile & WhatsApp Settings</span>
            </button>

            <button
              id="admin-tab-orders"
              onClick={() => setActiveTab('order-simulator')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                activeTab === 'order-simulator'
                  ? 'bg-white dark:bg-[#1a202c] text-neutral-900 dark:text-white shadow-xs border border-[#e5dfd3] dark:border-[#2d3748]'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-white/50'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp Simulator</span>
            </button>

            <button
              id="admin-tab-backup"
              onClick={() => setActiveTab('backup')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                activeTab === 'backup'
                  ? 'bg-white dark:bg-[#1a202c] text-neutral-900 dark:text-white shadow-xs border border-[#e5dfd3] dark:border-[#2d3748]'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-white/50'
              }`}
            >
              <Sliders className="w-4 h-4" />
              <span>Backup & Data</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Real-time Notification Banner */}
        {uploadSuccessNotification && (
          <div className="p-4 rounded-2xl bg-emerald-600 text-white font-bold text-xs flex items-center justify-between shadow-lg animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-200" />
              <span>{uploadSuccessNotification}</span>
            </div>
            <button
              onClick={() => setUploadSuccessNotification(null)}
              className="p-1 hover:bg-emerald-700 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 1: PRODUCT CATALOG MANAGEMENT */}
        {/* ========================================================================= */}
        {activeTab === 'products' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Top Toolbar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-[#1a202c] p-6 rounded-2xl border border-[#e5dfd3] dark:border-[#2d3748] shadow-xs">
              <div>
                <h2 className="text-xl font-black tracking-tight font-heading text-neutral-900 dark:text-white">
                  Apparel Catalog & Pricing Manager
                </h2>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                  Add new items, update prices, change cover photos, and toggle stock availability. One item per customer line.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  id="admin-add-product-btn"
                  type="button"
                  onClick={handleOpenAddProduct}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-900 text-xs font-black shadow-xs transition-all active:scale-98 shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Product</span>
                </button>
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
              <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 scrollbar-none">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setFilterProductCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                      filterProductCategory === cat.id
                        ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-xs'
                        : 'bg-white dark:bg-[#1a202c] text-neutral-700 dark:text-neutral-300 border border-[#e5dfd3] dark:border-[#2d3748]'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              <input
                type="text"
                value={searchProductQuery}
                onChange={(e) => setSearchProductQuery(e.target.value)}
                placeholder="Filter by product name..."
                className="w-full sm:w-64 px-4 py-2 rounded-xl bg-white dark:bg-[#1a202c] border border-[#e5dfd3] dark:border-[#2d3748] text-xs text-neutral-900 dark:text-white outline-hidden focus:border-neutral-900"
              />
            </div>

            {/* Product Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {adminFilteredProducts.map((product) => {
                const photoSrc = product.uploadedImageUrl || (product.image && (product.image.startsWith('data:image/') || product.image.startsWith('http://') || product.image.startsWith('https://') || product.image.startsWith('/')) ? product.image : undefined);
                const hasUploadedPhoto = Boolean(photoSrc && photoSrc.trim().length > 0);
                return (
                  <div
                    key={product.id}
                    className="bg-white dark:bg-[#1a202c] rounded-2xl border border-[#e5dfd3] dark:border-[#2d3748] p-5 flex flex-col justify-between shadow-xs hover:shadow-md transition-all space-y-4"
                  >
                    {/* Top Info & Image Preview */}
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <span className="text-[10px] font-extrabold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 bg-[#EAE5DB] dark:bg-[#262e3b] px-2.5 py-0.5 rounded-md border border-[#d8d0c3] dark:border-[#374151]">
                            {product.category.replace('-', ' ')}
                          </span>
                          <h3 className="text-base font-bold text-neutral-900 dark:text-white mt-1.5 leading-snug">
                            {product.name}
                          </h3>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-base font-black text-neutral-900 dark:text-white font-mono">
                            {product.currency} {product.price.toLocaleString()}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleToggleProductStock(product.id)}
                            className="block text-[10px] font-bold mt-1 text-left"
                            title="Click to toggle stock status"
                          >
                            {product.inStock !== false ? (
                              <span className="text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800">
                                ● In Stock
                              </span>
                            ) : (
                              <span className="text-red-500 bg-red-50 dark:bg-red-950/40 px-2 py-0.5 rounded-md border border-red-200 dark:border-red-800">
                                ○ Out of Stock
                              </span>
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Photo Thumbnail Stage with 1-Click Uploader */}
                      <div className="relative group aspect-16/9 rounded-xl bg-neutral-100 dark:bg-[#12161c] border border-[#d8d0c3] dark:border-[#2d3748] overflow-hidden flex items-center justify-center">
                        {hasUploadedPhoto && photoSrc ? (
                          <img
                            src={photoSrc}
                            alt={product.name}
                            className="w-full h-full object-cover object-center"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="flex flex-col items-center text-center p-3 text-neutral-500 dark:text-neutral-400">
                            <Shirt className="w-8 h-8 opacity-60 mb-1" />
                            <span className="text-xs font-semibold">Standard Vector Graphic</span>
                          </div>
                        )}

                        {/* Quick Overlay Action on Image */}
                        <div className="absolute inset-0 bg-neutral-950/70 backdrop-blur-2xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
                          <button
                            type="button"
                            onClick={() => triggerUploadForProduct(product.id)}
                            className="px-3 py-1.5 rounded-lg bg-white text-neutral-900 font-bold text-xs shadow-md hover:bg-neutral-100 flex items-center gap-1.5 transition-transform active:scale-95"
                            title="Upload/Replace Photo for this item"
                          >
                            <Upload className="w-3.5 h-3.5" />
                            <span>{hasUploadedPhoto ? 'Change Photo' : 'Upload Photo'}</span>
                          </button>
                          {hasUploadedPhoto && (
                            <button
                              type="button"
                              onClick={() => handleRemovePhotoFromProduct(product.id)}
                              className="px-2.5 py-1.5 rounded-lg bg-red-600 text-white font-bold text-xs shadow-md hover:bg-red-700 transition-transform active:scale-95"
                              title="Revert back to clean vector graphic"
                            >
                              Reset
                            </button>
                          )}
                        </div>

                        {product.popularBadge && (
                          <div className="absolute top-2 left-2 bg-amber-500 text-white text-[10px] font-black px-2 py-0.5 rounded-md shadow-xs">
                            {product.popularBadge}
                          </div>
                        )}

                        {hasUploadedPhoto && (
                          <div className="absolute bottom-2 left-2 bg-emerald-600 text-white text-[9px] font-black px-2 py-0.5 rounded-md shadow-xs">
                            ● Custom Photo Active
                          </div>
                        )}
                      </div>

                      {/* Specs */}
                      <p className="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-2">
                        {product.description || product.subtitle}
                      </p>

                      {/* Color dots preview */}
                      <div className="flex items-center gap-1.5 pt-1 overflow-x-auto">
                        <span className="text-[10px] font-bold text-neutral-500 mr-1">Colors:</span>
                        {product.colors.slice(0, 6).map((c, i) => (
                          <span
                            key={i}
                            className="w-4 h-4 rounded-full border border-neutral-300 shrink-0"
                            style={{ backgroundColor: c.hex }}
                            title={c.name}
                          />
                        ))}
                        {product.colors.length > 6 && (
                          <span className="text-[10px] font-bold text-neutral-400">+{product.colors.length - 6}</span>
                        )}
                      </div>

                      {/* Sizes badges */}
                      <div className="flex flex-wrap gap-1 pt-1">
                        {product.sizes.map((s) => (
                          <span
                            key={s}
                            className="text-[10px] font-bold bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 px-1.5 py-0.5 rounded-md border border-neutral-200 dark:border-neutral-700"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-3 border-t border-[#e5dfd3] dark:border-[#2d3748] flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => handleOpenEditProduct(product)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-200 dark:text-neutral-900 text-xs font-bold transition-all shadow-xs"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Edit Product</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDuplicateProduct(product)}
                        className="p-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 transition-colors"
                        title="Duplicate item"
                      >
                        <Copy className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteProduct(product.id)}
                        className="p-2 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                        title="Delete product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: PHOTO STUDIO, UPLOADER & MOCKUP GENERATOR */}
        {/* ========================================================================= */}
        {activeTab === 'photos' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Storefront Garments Live Image Synchronizer */}
            <div className="bg-white dark:bg-[#1a202c] p-6 rounded-2xl border border-[#e5dfd3] dark:border-[#2d3748] shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800 mb-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Live Customer Storefront Sync</span>
                  </div>
                  <h2 className="text-lg font-black tracking-tight font-heading text-neutral-900 dark:text-white">
                    Storefront Items Image Manager ({products.length} Products)
                  </h2>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    One of each garment item available to customers. Uploading a photo here instantly updates the customer storefront.
                  </p>
                </div>
              </div>

              {/* Grid of one of each item */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pt-2">
                {products.map((p) => {
                  const photoSrc = p.uploadedImageUrl || (p.image && (p.image.startsWith('data:image/') || p.image.startsWith('http://') || p.image.startsWith('https://') || p.image.startsWith('/')) ? p.image : undefined);
                  const hasPhoto = Boolean(photoSrc && photoSrc.trim().length > 0);
                  return (
                    <div
                      key={p.id}
                      className="bg-[#F9F8F3] dark:bg-[#12161c] border border-[#e5dfd3] dark:border-[#2d3748] rounded-xl p-3 flex flex-col justify-between space-y-3"
                    >
                      {/* Top info */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <span className="text-[9px] font-extrabold uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
                            {p.category.replace('-', ' ')}
                          </span>
                          <h4 className="text-xs font-bold text-neutral-900 dark:text-white truncate">
                            {p.name}
                          </h4>
                          <span className="text-[11px] font-black text-neutral-700 dark:text-neutral-300 font-mono">
                            {p.currency} {p.price.toLocaleString()}
                          </span>
                        </div>

                        {hasPhoto ? (
                          <span className="text-[9px] font-black text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full shrink-0">
                            Photo Active
                          </span>
                        ) : (
                          <span className="text-[9px] font-bold text-neutral-500 bg-neutral-200 dark:bg-neutral-800 px-2 py-0.5 rounded-full shrink-0">
                            Graphic
                          </span>
                        )}
                      </div>

                      {/* Image Preview */}
                      <div className="aspect-16/10 rounded-lg bg-neutral-100 dark:bg-[#1a202c] border border-[#d8d0c3] dark:border-[#374151] overflow-hidden flex items-center justify-center relative">
                        {hasPhoto && photoSrc ? (
                          <img
                            src={photoSrc}
                            alt={p.name}
                            className="w-full h-full object-cover object-center"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="flex flex-col items-center text-center p-2 text-neutral-400">
                            <Shirt className="w-6 h-6 opacity-60 mb-0.5" />
                            <span className="text-[10px] font-semibold">Standard Vector Graphic</span>
                          </div>
                        )}
                      </div>

                      {/* Quick Upload / Actions */}
                      <div className="flex items-center gap-1.5 pt-1">
                        <button
                          type="button"
                          onClick={() => triggerUploadForProduct(p.id)}
                          className="flex-1 py-1.5 px-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-neutral-900 font-bold text-[11px] flex items-center justify-center gap-1 transition-all shadow-xs"
                          title="Upload or change photo for this item"
                        >
                          <Upload className="w-3 h-3" />
                          <span>{hasPhoto ? 'Replace Photo' : 'Upload Photo'}</span>
                        </button>

                        {hasPhoto && (
                          <button
                            type="button"
                            onClick={() => handleRemovePhotoFromProduct(p.id)}
                            className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 text-[11px] font-bold transition-colors"
                            title="Reset to default vector preview"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 1. Upload Dropzone */}
            <div className="bg-white dark:bg-[#1a202c] p-6 rounded-2xl border border-[#e5dfd3] dark:border-[#2d3748] shadow-xs space-y-5">
              <div>
                <h2 className="text-xl font-black tracking-tight font-heading text-neutral-900 dark:text-white">
                  Muso Photo Studio & Garment Uploader
                </h2>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                  Upload photos from your device. When uploading, photos will automatically match and update customer items with similar names (e.g. "half hoodie", "polo", "sweatshirt", "cap").
                </p>
              </div>

              {/* Upload Dropzone */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-[#d8d0c3] dark:border-[#374151] hover:border-neutral-900 dark:hover:border-white rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all bg-[#F9F8F3] dark:bg-[#12161c]"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileSelect(e)}
                  className="hidden"
                />
                <div className="w-12 h-12 rounded-2xl bg-[#EAE5DB] dark:bg-[#1a202c] flex items-center justify-center text-neutral-800 dark:text-neutral-200 mb-3 border border-[#d8d0c3] dark:border-[#2d3748]">
                  <Upload className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-extrabold text-neutral-900 dark:text-white">
                  Click or tap to upload apparel photo from device
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                  PNG, JPG, or WEBP. File names automatically sync to similar items on customer storefront!
                </p>
              </div>

              {/* Or Add from Image URL */}
              <div className="pt-2">
                <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Or Paste an Image URL from the Web:
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={photoUrlInput}
                    onChange={(e) => setPhotoUrlInput(e.target.value)}
                    placeholder="https://images.unsplash.com/... or direct image link"
                    className="flex-1 px-4 py-2.5 rounded-xl bg-neutral-50 dark:bg-[#12161c] border border-[#e5dfd3] dark:border-[#2d3748] text-xs text-neutral-900 dark:text-white outline-hidden focus:border-neutral-900"
                  />
                  <button
                    type="button"
                    onClick={handleAddPhotoUrl}
                    className="px-5 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-900 text-xs font-bold shrink-0 transition-all"
                  >
                    Add URL
                  </button>
                </div>
              </div>
            </div>

            {/* 2. Create Garment Mockup Studio */}
            <div className="bg-white dark:bg-[#1a202c] p-6 rounded-2xl border border-[#e5dfd3] dark:border-[#2d3748] shadow-xs space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 px-2.5 py-0.5 rounded-full border border-amber-200 dark:border-amber-800 mb-1">
                    <Wand2 className="w-3 h-3" />
                    <span>Mockup Creator</span>
                  </div>
                  <h3 className="text-base font-black text-neutral-900 dark:text-white font-heading">
                    Create New Garment Mockup Photo
                  </h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    Generate instant styled garment graphics with your custom brand text.
                  </p>
                </div>
              </div>

              {mockupCreatedAlert && (
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>New mockup asset created and added to your photo gallery!</span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                {/* Mockup Preview Stage */}
                <div className="md:col-span-5 aspect-square rounded-2xl bg-[#EAE5DB] dark:bg-[#12161c] border border-[#d8d0c3] dark:border-[#2d3748] p-6 flex flex-col items-center justify-center relative shadow-inner">
                  <svg className="w-48 h-48 drop-shadow-md" viewBox="0 0 400 400">
                    <path
                      d="M 80 40 Q 160 80 240 40 L 300 100 L 260 140 L 230 120 L 230 320 L 90 320 L 90 120 L 60 140 L 20 100 Z"
                      fill={mockupColor}
                      stroke="#262626"
                      strokeWidth="4"
                    />
                    <circle cx="160" cy="50" r="30" fill="none" stroke="#262626" strokeWidth="4" />
                    <text
                      x="160"
                      y="190"
                      fontFamily="sans-serif"
                      fontSize="16"
                      fontWeight="900"
                      textAnchor="middle"
                      fill="#FFFFFF"
                    >
                      {mockupText}
                    </text>
                    <text
                      x="160"
                      y="215"
                      fontFamily="sans-serif"
                      fontSize="10"
                      fontWeight="700"
                      textAnchor="middle"
                      fill="#EAE5DB"
                    >
                      {mockupColorName}
                    </text>
                  </svg>
                </div>

                {/* Mockup Controls */}
                <div className="md:col-span-7 space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                      Garment Type:
                    </label>
                    <select
                      value={mockupGarmentType}
                      onChange={(e) => setMockupGarmentType(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl bg-neutral-50 dark:bg-[#12161c] border border-[#e5dfd3] dark:border-[#2d3748] text-xs font-bold text-neutral-900 dark:text-white"
                    >
                      <option value="hoodies">Pullover Fleece Hoodie</option>
                      <option value="polo-shirts">Piqué Polo Shirt</option>
                      <option value="sweatshirts">Crewneck Sweatshirt</option>
                      <option value="caps">6-Panel Cotton Cap</option>
                      <option value="plain-tshirts">Plain T-Shirt</option>
                      <option value="vests">Safety / Puffer Vest</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                      Garment Base Color:
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {Object.values(COMMON_COLORS).slice(0, 10).map((c) => (
                        <button
                          key={c.name}
                          type="button"
                          onClick={() => {
                            setMockupColor(c.hex);
                            setMockupColorName(c.name);
                          }}
                          className={`w-7 h-7 rounded-full border-2 transition-transform ${
                            mockupColor === c.hex ? 'scale-115 border-neutral-900 dark:border-white shadow-md' : 'border-neutral-300'
                          }`}
                          style={{ backgroundColor: c.hex }}
                          title={c.name}
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                      Front Printed / Embroidered Text:
                    </label>
                    <input
                      type="text"
                      value={mockupText}
                      onChange={(e) => setMockupText(e.target.value)}
                      placeholder="e.g. MUSO APPAREL"
                      className="w-full px-3 py-2 rounded-xl bg-neutral-50 dark:bg-[#12161c] border border-[#e5dfd3] dark:border-[#2d3748] text-xs font-bold text-neutral-900 dark:text-white"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleCreateMockupAsset}
                    className="w-full py-3 px-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-900 text-xs font-black shadow-xs transition-all flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Save Mockup as New Photo Asset</span>
                  </button>
                </div>
              </div>
            </div>

            {/* 3. Uploaded Photos Gallery */}
            <div className="bg-white dark:bg-[#1a202c] p-6 rounded-2xl border border-[#e5dfd3] dark:border-[#2d3748] shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                  All Photo Assets Library ({photoAssets.length})
                </h3>
              </div>

              {photoAssets.length === 0 ? (
                <div className="py-12 text-center text-neutral-500 dark:text-neutral-400 text-xs space-y-2">
                  <ImageIcon className="w-8 h-8 mx-auto opacity-40" />
                  <p>No photos uploaded yet. Use the upload box above or the mockup creator!</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {photoAssets.map((asset) => (
                    <div
                      key={asset.id}
                      className="group relative bg-[#F9F8F3] dark:bg-[#12161c] rounded-xl border border-[#e5dfd3] dark:border-[#2d3748] overflow-hidden p-2 flex flex-col justify-between"
                    >
                      <div className="aspect-square rounded-lg overflow-hidden bg-[#EAE5DB] dark:bg-[#1a202c] flex items-center justify-center relative">
                        <img
                          src={asset.url}
                          alt={asset.name}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <button
                          onClick={() => handleDeletePhoto(asset.id)}
                          className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 hover:bg-red-600 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Delete photo"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="pt-2 space-y-1.5">
                        <p className="text-xs font-bold text-neutral-800 dark:text-neutral-200 truncate">
                          {asset.name}
                        </p>
                        <p className="text-[10px] text-neutral-400">
                          {asset.dateAdded} • {asset.fileSize}
                        </p>

                        {/* Assign to product dropdown & Auto-Sync */}
                        <div className="pt-1 space-y-1">
                          <select
                            onChange={(e) => {
                              if (e.target.value) {
                                handleAssignPhotoToProduct(asset.url, e.target.value);
                                e.target.value = '';
                              }
                            }}
                            className="w-full text-[11px] font-bold p-1.5 rounded-lg bg-white dark:bg-[#1a202c] border border-[#e5dfd3] dark:border-[#2d3748] text-neutral-800 dark:text-neutral-200 outline-hidden"
                            defaultValue=""
                          >
                            <option value="" disabled>
                              Assign to Product...
                            </option>
                            {products.map((p) => (
                              <option key={p.id} value={p.id}>
                                {p.name}
                              </option>
                            ))}
                          </select>

                          <button
                            type="button"
                            onClick={() => handleApplyPhotoToSimilarProducts(asset.url, asset.name)}
                            className="w-full text-[10px] font-bold py-1 px-1.5 rounded-md bg-[#EAE5DB] dark:bg-[#262e3b] text-neutral-800 dark:text-neutral-200 hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-colors flex items-center justify-center gap-1"
                            title="Apply to all items matching the name of this photo"
                          >
                            <Sparkles className="w-3 h-3 text-amber-500" />
                            <span>Auto-Sync by Name</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: STORE PROFILE & WHATSAPP SETTINGS & SECURITY */}
        {/* ========================================================================= */}
        {activeTab === 'store-settings' && (
          <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in duration-200">
            {/* Store Contact & WhatsApp Details */}
            <div className="bg-white dark:bg-[#1a202c] p-6 sm:p-8 rounded-2xl border border-[#e5dfd3] dark:border-[#2d3748] shadow-xs space-y-6">
              <div>
                <h2 className="text-xl font-black tracking-tight font-heading text-neutral-900 dark:text-white">
                  Store Profile & WhatsApp Details
                </h2>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                  Customer order clicks will be directed straight to this WhatsApp number.
                </p>
              </div>

              {contactSavedAlert && (
                <div className="flex items-center gap-2 p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Store profile and contact details saved successfully!</span>
                </div>
              )}

              <form onSubmit={handleSaveContactSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                    Store Owner / Contact Name
                  </label>
                  <input
                    type="text"
                    required
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 dark:bg-[#12161c] border border-[#e5dfd3] dark:border-[#2d3748] text-xs font-semibold text-neutral-900 dark:text-white outline-hidden focus:border-neutral-900"
                    placeholder="Muso"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                      Local WhatsApp Phone
                    </label>
                    <input
                      type="text"
                      required
                      value={contactForm.phone}
                      onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 dark:bg-[#12161c] border border-[#e5dfd3] dark:border-[#2d3748] text-xs font-mono font-bold text-neutral-900 dark:text-white outline-hidden focus:border-neutral-900"
                      placeholder="0735418753"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                      International WhatsApp Code
                    </label>
                    <input
                      type="text"
                      required
                      value={contactForm.intlPhone}
                      onChange={(e) => setContactForm({ ...contactForm, intlPhone: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 dark:bg-[#12161c] border border-[#e5dfd3] dark:border-[#2d3748] text-xs font-mono font-bold text-neutral-900 dark:text-white outline-hidden focus:border-neutral-900"
                      placeholder="254735418753"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                    Business Name
                  </label>
                  <input
                    type="text"
                    required
                    value={contactForm.businessName}
                    onChange={(e) => setContactForm({ ...contactForm, businessName: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 dark:bg-[#12161c] border border-[#e5dfd3] dark:border-[#2d3748] text-xs font-semibold text-neutral-900 dark:text-white outline-hidden focus:border-neutral-900"
                    placeholder="Muso's Apparel & Custom Merch"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                    Location & Delivery Description
                  </label>
                  <input
                    type="text"
                    value={contactForm.location}
                    onChange={(e) => setContactForm({ ...contactForm, location: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 dark:bg-[#12161c] border border-[#e5dfd3] dark:border-[#2d3748] text-xs text-neutral-900 dark:text-white outline-hidden focus:border-neutral-900"
                    placeholder="Nairobi, Kenya • Delivery countrywide"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                    M-Pesa Till / Paybill / Number (For customer payments)
                  </label>
                  <input
                    type="text"
                    value={contactForm.mpesaNumber || ''}
                    onChange={(e) => setContactForm({ ...contactForm, mpesaNumber: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 dark:bg-[#12161c] border border-[#e5dfd3] dark:border-[#2d3748] text-xs font-mono text-neutral-900 dark:text-white outline-hidden focus:border-neutral-900"
                    placeholder="e.g. Till: 123456 or Send Money to 0735418753"
                  />
                </div>

                <div className="pt-3">
                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-900 text-xs font-black shadow-xs transition-all active:scale-98"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Store Profile</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Owner PIN Security Setting */}
            <div className="bg-white dark:bg-[#1a202c] p-6 sm:p-8 rounded-2xl border border-[#e5dfd3] dark:border-[#2d3748] shadow-xs space-y-5">
              <div>
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-neutral-800 dark:text-neutral-200" />
                  <h3 className="text-base font-black text-neutral-900 dark:text-white font-heading">
                    Owner Access PIN Security
                  </h3>
                </div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                  Change the passcode used to unlock the owner management portal.
                </p>
              </div>

              {pinChangeSuccess && (
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 text-emerald-800 dark:text-emerald-300 text-xs font-bold">
                  Owner PIN updated successfully!
                </div>
              )}

              {pinChangeError && (
                <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-300 text-red-800 dark:text-red-300 text-xs font-bold">
                  {pinChangeError}
                </div>
              )}

              <form onSubmit={handleChangePinSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                      Current Passlock:
                    </label>
                    <input
                      type="password"
                      required
                      value={currentPinInput}
                      onChange={(e) => setCurrentPinInput(e.target.value)}
                      placeholder="Enter current passlock"
                      className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 dark:bg-[#12161c] border border-[#e5dfd3] dark:border-[#2d3748] text-xs font-mono text-neutral-900 dark:text-white outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                      New Passlock:
                    </label>
                    <input
                      type="password"
                      required
                      value={newPinInput}
                      onChange={(e) => setNewPinInput(e.target.value)}
                      placeholder="New passlock (min 4 chars)"
                      className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 dark:bg-[#12161c] border border-[#e5dfd3] dark:border-[#2d3748] text-xs font-mono text-neutral-900 dark:text-white outline-hidden"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="py-2.5 px-5 rounded-xl bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-900 text-xs font-bold transition-all shadow-xs"
                >
                  Update Master Passlock
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: WHATSAPP ORDER SIMULATOR & INQUIRY PREVIEW */}
        {/* ========================================================================= */}
        {activeTab === 'order-simulator' && (
          <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-[#1a202c] p-6 sm:p-8 rounded-2xl border border-[#e5dfd3] dark:border-[#2d3748] shadow-xs space-y-5">
              <div>
                <h2 className="text-xl font-black tracking-tight font-heading text-neutral-900 dark:text-white">
                  WhatsApp Direct Order Generator
                </h2>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                  Preview exactly how customer messages arrive on your WhatsApp ({storeContact.phone}).
                </p>
              </div>

              {/* Sample WhatsApp message bubble */}
              <div className="bg-[#EAE5DB] dark:bg-[#12161c] p-5 rounded-2xl border border-[#d8d0c3] dark:border-[#2d3748] space-y-3 font-mono text-xs text-neutral-800 dark:text-neutral-200">
                <div className="flex items-center gap-2 pb-2 border-b border-[#d8d0c3] dark:border-[#2d3748] font-sans font-bold">
                  <MessageSquare className="w-4 h-4 text-emerald-600" />
                  <span>Incoming Customer Order Template:</span>
                </div>
                <div className="whitespace-pre-wrap leading-relaxed">
{`*✨ NEW APPAREL ORDER REQUEST - ${storeContact.businessName.toUpperCase()}*

Hello ${storeContact.name}, I would like to order:

• *Item:* Premium Pullover Fleece Hoodie
• *Category:* Hoodies
• *Size:* XL
• *Colour:* Jet Black
• *Quantity:* 2
• *Estimated Unit Price:* KSh 1,500
• *Total Estimate:* KSh 3,000

*Custom Merch / Text:* "Muso Studio" (Embroidery on chest)
*Customer Delivery Location:* Nairobi CBD

Please confirm stock availability and M-Pesa payment details!`}
                </div>
              </div>

              {/* Direct test WhatsApp button */}
              <div className="pt-2">
                <a
                  href={`https://wa.me/${storeContact.phone.replace(/\D/g, '')}?text=${encodeURIComponent(
                    `Hello ${storeContact.name}! Test message from Muso Studio Manager. Website WhatsApp connection is working!`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-xs transition-all"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Send Test WhatsApp Ping to {storeContact.phone}</span>
                </a>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: BACKUP & DATA RESET */}
        {/* ========================================================================= */}
        {activeTab === 'backup' && (
          <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-200">
            {/* Live Shared Link & Cloud Firestore Real-time Auto-Sync Status */}
            <div className="bg-emerald-50 dark:bg-emerald-950/30 p-6 rounded-2xl border border-emerald-200 dark:border-emerald-800 space-y-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <h3 className="text-sm font-black text-emerald-950 dark:text-emerald-200">
                  Automatic Real-time Cloud Sync Active
                </h3>
              </div>
              <p className="text-xs text-emerald-800 dark:text-emerald-300 leading-relaxed">
                You do <strong>not</strong> need to press any sync button! Every time you pick a photo or edit a product, it uploads directly to Cloud Firestore automatically in the background. Anyone opening your website on any phone, tablet, or browser receives the live updates instantly.
              </p>
              <div className="pt-2 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const url = window.location.origin;
                    navigator.clipboard.writeText(url);
                    setUploadSuccessNotification('Customer Store Link copied to clipboard!');
                    setTimeout(() => setUploadSuccessNotification(null), 3000);
                  }}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-all shadow-xs"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Storefront Link for Customers</span>
                </button>
              </div>
            </div>

            <div className="bg-white dark:bg-[#1a202c] p-6 sm:p-8 rounded-2xl border border-[#e5dfd3] dark:border-[#2d3748] shadow-xs space-y-6">
              <div>
                <h2 className="text-xl font-black tracking-tight font-heading text-neutral-900 dark:text-white">
                  Backup & Catalog Persistence
                </h2>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                  Export your entire catalog, pricing, and uploaded photos as a JSON file or restore from a previous backup.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={handleExportData}
                  className="flex flex-col items-center text-center p-6 rounded-2xl bg-[#F9F8F3] dark:bg-[#12161c] hover:bg-[#EAE5DB] dark:hover:bg-[#1e242e] border border-[#e5dfd3] dark:border-[#2d3748] transition-all space-y-2 group"
                >
                  <FileDown className="w-8 h-8 text-neutral-800 dark:text-neutral-200 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-bold text-neutral-900 dark:text-white">
                    Export Backup (JSON)
                  </span>
                  <span className="text-[11px] text-neutral-500 dark:text-neutral-400">
                    Download all products, photos & settings to your computer
                  </span>
                </button>

                <label className="flex flex-col items-center text-center p-6 rounded-2xl bg-[#F9F8F3] dark:bg-[#12161c] hover:bg-[#EAE5DB] dark:hover:bg-[#1e242e] border border-[#e5dfd3] dark:border-[#2d3748] transition-all space-y-2 cursor-pointer group">
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportData}
                    className="hidden"
                  />
                  <FileUp className="w-8 h-8 text-neutral-800 dark:text-neutral-200 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-bold text-neutral-900 dark:text-white">
                    Import / Restore (JSON)
                  </span>
                  <span className="text-[11px] text-neutral-500 dark:text-neutral-400">
                    Upload a previously saved catalog backup
                  </span>
                </label>
              </div>

              {/* Reset to factory defaults button */}
              <div className="pt-4 border-t border-[#e5dfd3] dark:border-[#2d3748]">
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm('Reset all catalog products and store settings back to original default setup?')) {
                      onResetToDefaults();
                      alert('Catalog reset to original defaults.');
                    }
                  }}
                  className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-red-50 hover:bg-red-100 dark:bg-red-950/30 dark:hover:bg-red-950/50 text-red-700 dark:text-red-300 text-xs font-bold transition-colors border border-red-200 dark:border-red-800"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Reset Catalog to Original Defaults</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ========================================================================= */}
      {/* PRODUCT ADD / EDIT MODAL */}
      {/* ========================================================================= */}
      {isProductModalOpen && editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            id="admin-product-edit-modal"
            className="relative w-full max-w-3xl bg-white dark:bg-[#1a202c] rounded-3xl shadow-2xl border border-[#dfd7c9] dark:border-[#2d3748] overflow-hidden flex flex-col max-h-[92vh]"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#e5dfd3] dark:border-[#2d3748] bg-[#F9F8F3] dark:bg-[#12161c]">
              <div className="flex items-center gap-2">
                <Shirt className="w-5 h-5 text-neutral-800 dark:text-neutral-200" />
                <h3 className="text-base font-black text-neutral-900 dark:text-white font-heading">
                  {editingProduct.id.startsWith('prod-') ? 'Add New Product to Catalog' : 'Edit Apparel Item'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsProductModalOpen(false)}
                className="p-2 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSaveProduct} className="p-6 overflow-y-auto space-y-5">
              {/* Product Photo Upload / Preview */}
              <div>
                <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Product Cover Photo
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center bg-[#F9F8F3] dark:bg-[#12161c] p-4 rounded-2xl border border-[#e5dfd3] dark:border-[#2d3748]">
                  <div className="sm:col-span-4 aspect-4/3 rounded-xl bg-[#EAE5DB] dark:bg-[#1a202c] border border-[#d8d0c3] dark:border-[#2d3748] overflow-hidden flex items-center justify-center">
                    {editingProduct.uploadedImageUrl ? (
                      <img
                        src={editingProduct.uploadedImageUrl}
                        alt="Product preview"
                        className="w-full h-full object-contain"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="text-center p-2 text-neutral-400">
                        <Shirt className="w-8 h-8 mx-auto mb-1 opacity-50" />
                        <span className="text-[10px]">Standard Garment Graphic</span>
                      </div>
                    )}
                  </div>

                  <div className="sm:col-span-8 space-y-2">
                    <input
                      ref={productPhotoInputRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileSelect(e, editingProduct.id)}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => productPhotoInputRef.current?.click()}
                      className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-900 text-xs font-bold transition-all"
                    >
                      <Upload className="w-4 h-4" />
                      <span>Upload Real Photo from Device</span>
                    </button>

                    <div className="pt-1">
                      <input
                        type="url"
                        placeholder="Or paste direct image URL..."
                        value={editingProduct.uploadedImageUrl || ''}
                        onChange={(e) =>
                          setEditingProduct({
                            ...editingProduct,
                            uploadedImageUrl: e.target.value,
                            image: e.target.value
                          })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#1a202c] border border-[#e5dfd3] dark:border-[#2d3748] text-xs text-neutral-900 dark:text-white outline-hidden"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Title & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                    Product Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingProduct.name}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    placeholder="e.g. Premium Heavyweight Fleece Hoodie"
                    className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 dark:bg-[#12161c] border border-[#e5dfd3] dark:border-[#2d3748] text-xs text-neutral-900 dark:text-white font-bold outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                    Category *
                  </label>
                  <select
                    value={editingProduct.category}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        category: e.target.value as any
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 dark:bg-[#12161c] border border-[#e5dfd3] dark:border-[#2d3748] text-xs font-bold text-neutral-900 dark:text-white outline-hidden"
                  >
                    <option value="hoodies">Hoodies</option>
                    <option value="polo-shirts">Polo Shirts</option>
                    <option value="sweatshirts">Sweatshirts</option>
                    <option value="caps">Caps</option>
                    <option value="plain-tshirts">Plain T-Shirts</option>
                    <option value="vests">Vests</option>
                  </select>
                </div>
              </div>

              {/* Price, Badge & Stock */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                    Price (KSh) *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="50"
                    value={editingProduct.price}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        price: Number(e.target.value) || 0
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 dark:bg-[#12161c] border border-[#e5dfd3] dark:border-[#2d3748] text-xs font-mono font-bold text-neutral-900 dark:text-white outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                    Badge (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Best Seller / Popular"
                    value={editingProduct.popularBadge || ''}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        popularBadge: e.target.value
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 dark:bg-[#12161c] border border-[#e5dfd3] dark:border-[#2d3748] text-xs text-neutral-900 dark:text-white outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                    Availability
                  </label>
                  <select
                    value={editingProduct.inStock !== false ? 'in-stock' : 'out-of-stock'}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        inStock: e.target.value === 'in-stock'
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 dark:bg-[#12161c] border border-[#e5dfd3] dark:border-[#2d3748] text-xs font-bold text-neutral-900 dark:text-white outline-hidden"
                  >
                    <option value="in-stock">In Stock (Available)</option>
                    <option value="out-of-stock">Out of Stock</option>
                  </select>
                </div>
              </div>

              {/* Description & Subtitle */}
              <div>
                <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                  Description / Merch Features
                </label>
                <textarea
                  rows={3}
                  value={editingProduct.description}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, description: e.target.value })
                  }
                  placeholder="Describe material, fleece thickness, kangaroo pocket, drawstrings, or print suitability..."
                  className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 dark:bg-[#12161c] border border-[#e5dfd3] dark:border-[#2d3748] text-xs text-neutral-900 dark:text-white outline-hidden"
                />
              </div>

              {/* Color Swatches Management */}
              <div>
                <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Available Color Options ({editingProduct.colors.length} selected)
                </label>
                
                {/* Active Colors List */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {editingProduct.colors.map((c, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs font-semibold"
                    >
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-neutral-300 shrink-0"
                        style={{ backgroundColor: c.hex }}
                      />
                      <span>{c.name}</span>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = editingProduct.colors.filter((_, i) => i !== idx);
                          setEditingProduct({ ...editingProduct, colors: updated });
                        }}
                        className="text-neutral-400 hover:text-red-500 ml-1"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Quick Add Palette Colors */}
                <div className="p-3 bg-[#F9F8F3] dark:bg-[#12161c] rounded-xl border border-[#e5dfd3] dark:border-[#2d3748] space-y-2">
                  <span className="text-[11px] font-bold text-neutral-600 dark:text-neutral-400 block">
                    Click to Add from Popular Apparel Palette:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {Object.values(COMMON_COLORS).map((c) => {
                      const alreadyAdded = editingProduct.colors.some(existing => existing.name === c.name);
                      return (
                        <button
                          key={c.name}
                          type="button"
                          disabled={alreadyAdded}
                          onClick={() => {
                            setEditingProduct({
                              ...editingProduct,
                              colors: [...editingProduct.colors, c]
                            });
                          }}
                          className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-medium border transition-all ${
                            alreadyAdded
                              ? 'opacity-40 cursor-not-allowed bg-neutral-100 dark:bg-neutral-800'
                              : 'bg-white dark:bg-[#1a202c] hover:border-neutral-900'
                          }`}
                        >
                          <span
                            className="w-2.5 h-2.5 rounded-full border border-neutral-300"
                            style={{ backgroundColor: c.hex }}
                          />
                          <span>{c.name}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Add Custom Color */}
                  <div className="pt-2 flex items-center gap-2">
                    <input
                      type="color"
                      value={customColorHex}
                      onChange={(e) => setCustomColorHex(e.target.value)}
                      className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0 p-0"
                      title="Choose custom hex color"
                    />
                    <input
                      type="text"
                      value={customColorName}
                      onChange={(e) => setCustomColorName(e.target.value)}
                      placeholder="Custom color name (e.g. Mint Green)"
                      className="flex-1 px-3 py-1.5 rounded-lg bg-white dark:bg-[#1a202c] border border-[#e5dfd3] dark:border-[#2d3748] text-xs text-neutral-900 dark:text-white outline-hidden"
                    />
                    <button
                      type="button"
                      onClick={handleAddCustomColor}
                      className="px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-neutral-900 text-xs font-bold"
                    >
                      + Add Color
                    </button>
                  </div>
                </div>
              </div>

              {/* Available Sizes Toggle */}
              <div>
                <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-2">
                  Available Sizes ({editingProduct.sizes.length} selected)
                </label>
                <div className="flex flex-wrap gap-2">
                  {allAvailableSizes.map((size) => {
                    const isSelected = editingProduct.sizes.includes(size);
                    return (
                      <button
                        key={size}
                        type="button"
                        onClick={() => {
                          const newSizes = isSelected
                            ? editingProduct.sizes.filter((s) => s !== size)
                            : [...editingProduct.sizes, size];
                          setEditingProduct({ ...editingProduct, sizes: newSizes });
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          isSelected
                            ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-xs'
                            : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500 hover:bg-neutral-200'
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Modal Actions */}
              <div className="pt-4 border-t border-[#e5dfd3] dark:border-[#2d3748] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-900 text-xs font-black shadow-xs transition-all"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Floating Quick Return to Customer Storefront Button */}
      <aside aria-label="Quick Actions" className="fixed bottom-5 right-5 z-40">
        <button
          type="button"
          onClick={onSwitchToCustomerView}
          className="flex items-center gap-2.5 px-5 py-3 rounded-full bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-900 font-extrabold text-xs shadow-2xl hover:scale-105 active:scale-95 transition-all border border-white/20 dark:border-neutral-900/20"
          title="Exit Owner Studio and return to Customer Storefront"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Exit Admin & Return to Store</span>
        </button>
      </aside>
    </div>
  );
};
