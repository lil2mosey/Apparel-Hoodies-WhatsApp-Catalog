export type ProductCategory = 
  | 'all' 
  | 'hoodies' 
  | 'sweatshirts' 
  | 'polo-shirts' 
  | 'ponchos'
  | 'tracksuits'
  | 'caps' 
  | 'plain-tshirts' 
  | 'vests';

export interface ColorOption {
  name: string;
  hex: string;
  twClass?: string;
  textColor?: string; // For text on top of color swatch
}

export type ApparelSize = 'XS' | 'S' | 'M' | 'L' | 'XL' | '2XL' | '3XL' | 'One Size';

export interface Product {
  id: string;
  name: string;
  category: 'hoodies' | 'sweatshirts' | 'polo-shirts' | 'ponchos' | 'tracksuits' | 'caps' | 'plain-tshirts' | 'vests';
  subtitle: string;
  description: string;
  price: number; // in KSh
  currency: string;
  image: string; // image ID or data URL or external URL
  featured?: boolean;
  popularBadge?: string;
  colors: ColorOption[];
  sizes: ApparelSize[];
  fabric: string;
  fit: string;
  features: string[];
  customizable: boolean; // supports custom name printing/embroidery like "Gryson"
  inStock?: boolean;
  stockQty?: number;
  uploadedImageUrl?: string; // Custom uploaded real photo
}

export interface PhotoAsset {
  id: string;
  name: string;
  url: string; // Data URL or Web URL
  category?: ProductCategory;
  dateAdded: string;
  fileSize?: string;
  assignedProductId?: string;
}

export interface CartItem {
  cartItemId: string;
  productId: string;
  productName: string;
  category: string;
  selectedColor: ColorOption;
  selectedSize: ApparelSize;
  quantity: number;
  unitPrice: number;
  currency: string;
  customization?: {
    enabled: boolean;
    text: string;
    type: 'print' | 'embroidery';
    placement?: 'chest' | 'back' | 'sleeve';
  };
  notes?: string;
}

export interface CustomerDetails {
  name: string;
  phone: string;
  location: string;
  notes: string;
}

export interface StoreContact {
  name: string;
  phone: string; // e.g. "0735418753"
  intlPhone: string; // e.g. "254735418753"
  businessName: string;
  tagline: string;
  location: string;
  mpesaNumber?: string; // e.g. Till number or M-Pesa direct number
  mpesaName?: string;
  announcement?: string;
}

export type AppTheme = 'light' | 'dark';
export type AppViewMode = 'customer' | 'admin';
