import React from 'react';
import { ColorOption } from '../../types';

/**
 * ============================================================================
 * MUSO APPAREL - CENTRALIZED IMAGE & ASSET MANAGEMENT SYSTEM
 * ============================================================================
 * ALL product images, garment mockups, brand assets, category graphics,
 * and custom image mappings are organized and managed from this single folder:
 * `/src/assets/images/`
 */

export interface ImageAssetMeta {
  id: string;
  key: string;
  name: string;
  category: string;
  fileName: string;
  format: 'svg-vector' | 'raster-photo';
  description: string;
  dimensions: string;
  customPhotoUrl?: string; // Optional custom photo replacement URL
}

// Global registry of all image assets managed in this folder
export const ALL_IMAGE_ASSETS: ImageAssetMeta[] = [
  {
    id: 'img-hoodie-pullover',
    key: 'hoodie-pullover',
    name: 'Pullover Heavyweight Fleece Hoodie',
    category: 'hoodies',
    fileName: 'pullover-hoodie.svg',
    format: 'svg-vector',
    description: 'Heavyweight fleece pullover hoodie with kangaroo pocket and drawstrings',
    dimensions: '400x400 (Vector Scalable)',
  },
  {
    id: 'img-hoodie-zip',
    key: 'hoodie-zip',
    name: 'Full-Zip Heavyweight Fleece Hoodie',
    category: 'hoodies',
    fileName: 'zip-hoodie.svg',
    format: 'svg-vector',
    description: 'Full-zip front hoodie with metal zipper and dual split pockets',
    dimensions: '400x400 (Vector Scalable)',
  },
  {
    id: 'img-sweatshirt',
    key: 'sweatshirt',
    name: 'Classic Crewneck Sweatshirt',
    category: 'sweatshirts',
    fileName: 'crewneck-sweatshirt.svg',
    format: 'svg-vector',
    description: 'Casual drop-shoulder crewneck pullover sweatshirt with ribbed collar',
    dimensions: '400x400 (Vector Scalable)',
  },
  {
    id: 'img-polo-pique',
    key: 'polo-pique',
    name: 'Piqué Cotton Collar Polo Shirt',
    category: 'polo-shirts',
    fileName: 'polo-shirt.svg',
    format: 'svg-vector',
    description: 'Classic 3-button ribbed collar polo shirt with sleeve cuffs',
    dimensions: '400x400 (Vector Scalable)',
  },
  {
    id: 'img-cap-cotton',
    key: 'cap-cotton',
    name: '6-Panel Cotton Twill Baseball Cap',
    category: 'caps',
    fileName: 'cotton-cap.svg',
    format: 'svg-vector',
    description: 'Curved visor 6-panel baseball cap with ventilation eyelets and back strap',
    dimensions: '400x400 (Vector Scalable)',
  },
  {
    id: 'img-tshirt-crewneck',
    key: 'tshirt-crewneck',
    name: 'Premium Plain Crewneck T-Shirt',
    category: 'plain-tshirts',
    fileName: 'plain-tee.svg',
    format: 'svg-vector',
    description: '100% combed cotton plain crewneck t-shirt for daily wear & custom print',
    dimensions: '400x400 (Vector Scalable)',
  },
  {
    id: 'img-vest-reflective',
    key: 'vest-reflective',
    name: 'High-Visibility Reflective Safety Vest',
    category: 'vests',
    fileName: 'reflective-vest.svg',
    format: 'svg-vector',
    description: 'Safety vest with 2-inch wide 360-degree reflective silver stripes',
    dimensions: '400x400 (Vector Scalable)',
  },
  {
    id: 'img-vest-puffer',
    key: 'vest-puffer',
    name: 'Insulated Quilted Puffer Vest',
    category: 'vests',
    fileName: 'puffer-jacket.svg',
    format: 'svg-vector',
    description: 'Sleeveless insulated puffer bodywarmer with stand collar and zipper',
    dimensions: '400x400 (Vector Scalable)',
  },
  {
    id: 'img-brand-logo',
    key: 'muso-logo',
    name: "Muso's Brand Monogram Logo",
    category: 'branding',
    fileName: 'muso-brand-logo.svg',
    format: 'svg-vector',
    description: 'Official emblem for Muso Apparel with Emerald green gradient and gold star',
    dimensions: '100x100 (Vector Scalable)',
  },
];

/**
 * Custom override image storage support (stored in memory/localStorage if user enters custom photos)
 */
const customPhotoStorageKey = 'muso_custom_image_overrides';

export function getCustomPhotoOverrides(): Record<string, string> {
  try {
    const saved = localStorage.getItem(customPhotoStorageKey);
    if (saved) return JSON.parse(saved);
  } catch {
    // ignore
  }
  return {};
}

export function saveCustomPhotoOverride(imageKey: string, url: string) {
  try {
    const current = getCustomPhotoOverrides();
    if (url.trim()) {
      current[imageKey] = url.trim();
    } else {
      delete current[imageKey];
    }
    localStorage.setItem(customPhotoStorageKey, JSON.stringify(current));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('muso_images_updated', { detail: { imageKey } }));
    }
  } catch {
    // ignore
  }
}

/**
 * Returns whether an image key has a custom photo URL attached
 */
export function getProductImageUrl(imageKey: string): string | null {
  const overrides = getCustomPhotoOverrides();
  return overrides[imageKey] || null;
}

/**
 * Render Garment Vector Graphic with accurate colors, shading, and custom typography preview
 */
export function renderGarmentGraphic(
  imageKey: string,
  color: ColorOption,
  customText?: string
): React.ReactNode {
  const hex = color?.hex || '#171717';
  const isWhiteOrLight = ['#ffffff', '#fff', '#d4c5b9', '#38bdf8', '#c084fc', '#eab308', '#94a3b8'].includes(
    hex.toLowerCase()
  );
  const textColor = isWhiteOrLight ? '#1e293b' : '#ffffff';
  const stitchColor = isWhiteOrLight ? 'rgba(0,0,0,0.15)' : 'rgba(255,255,255,0.2)';

  // 1. PULLOVER HOODIE
  if (imageKey.includes('hoodie-pullover')) {
    return (
      <svg
        viewBox="0 0 400 400"
        className="w-full h-full max-h-full drop-shadow-md transition-transform duration-300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Main Body */}
        <path
          d="M130 110 L80 160 L105 250 L140 230 L140 330 L260 330 L260 230 L295 250 L320 160 L270 110 Z"
          fill={hex}
          stroke="#000000"
          strokeWidth="2"
          strokeOpacity="0.15"
        />

        {/* Left Sleeve crease */}
        <path d="M140 180 L105 250" stroke={stitchColor} strokeWidth="2.5" />
        {/* Right Sleeve crease */}
        <path d="M260 180 L295 250" stroke={stitchColor} strokeWidth="2.5" />

        {/* Kangaroo Pocket */}
        <path
          d="M160 245 L240 245 L255 295 L145 295 Z"
          fill={hex}
          filter="brightness(0.93)"
          stroke={stitchColor}
          strokeWidth="2"
        />
        <path d="M160 245 L145 295" stroke={stitchColor} strokeWidth="2.5" strokeDasharray="3 3" />
        <path d="M240 245 L255 295" stroke={stitchColor} strokeWidth="2.5" strokeDasharray="3 3" />

        {/* Bottom Hem & Cuffs */}
        <rect x="140" y="315" width="120" height="15" fill={hex} filter="brightness(0.85)" rx="2" />
        <rect x="95" y="235" width="20" height="15" transform="rotate(-30 95 235)" fill={hex} filter="brightness(0.85)" rx="2" />
        <rect x="290" y="225" width="20" height="15" transform="rotate(30 290 225)" fill={hex} filter="brightness(0.85)" rx="2" />

        {/* Hood */}
        <path
          d="M150 110 C150 50, 250 50, 250 110 C250 125, 230 145, 200 145 C170 145, 150 125, 150 110 Z"
          fill={hex}
          filter="brightness(0.9)"
          stroke="#000000"
          strokeWidth="1.5"
          strokeOpacity="0.2"
        />
        <path
          d="M165 105 C175 75, 225 75, 235 105 C220 125, 180 125, 165 105 Z"
          fill="#111827"
          fillOpacity="0.4"
        />

        {/* Drawstrings */}
        <path d="M185 130 Q180 170 180 190" stroke="#f8fafc" strokeWidth="3" strokeLinecap="round" />
        <circle cx="180" cy="192" r="2.5" fill="#94a3b8" />
        <path d="M215 130 Q220 170 220 190" stroke="#f8fafc" strokeWidth="3" strokeLinecap="round" />
        <circle cx="220" cy="192" r="2.5" fill="#94a3b8" />

        {/* Custom Text / Name Print */}
        {customText && customText.trim() && (
          <g>
            <rect
              x="155"
              y="168"
              width="90"
              height="26"
              rx="4"
              fill={isWhiteOrLight ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.12)'}
            />
            <text
              x="200"
              y="185"
              fill={textColor}
              fontSize="12"
              fontWeight="800"
              letterSpacing="1.5"
              textAnchor="middle"
              className="uppercase font-mono"
            >
              {customText.length > 12 ? customText.substring(0, 10) + '...' : customText}
            </text>
          </g>
        )}
      </svg>
    );
  }

  // 2. FULL-ZIP HOODIE
  if (imageKey.includes('hoodie-zip')) {
    return (
      <svg
        viewBox="0 0 400 400"
        className="w-full h-full max-h-full drop-shadow-md transition-transform duration-300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Left Side */}
        <path
          d="M130 110 L80 160 L105 250 L140 230 L140 330 L198 330 L198 135 L160 110 Z"
          fill={hex}
          stroke="#000000"
          strokeWidth="1.5"
          strokeOpacity="0.2"
        />
        {/* Right Side */}
        <path
          d="M270 110 L320 160 L295 250 L260 230 L260 330 L202 330 L202 135 L240 110 Z"
          fill={hex}
          stroke="#000000"
          strokeWidth="1.5"
          strokeOpacity="0.2"
        />

        {/* Metal Full Zipper Line */}
        <line x1="200" y1="130" x2="200" y2="330" stroke="#94a3b8" strokeWidth="3.5" strokeDasharray="3 2" />
        {/* Zip Puller */}
        <rect x="197" y="145" width="6" height="12" rx="1.5" fill="#64748b" stroke="#334155" strokeWidth="1" />

        {/* Split Kangaroo Pockets */}
        <path d="M150 245 L195 245 L195 295 L145 295 Z" fill={hex} filter="brightness(0.93)" stroke={stitchColor} strokeWidth="2" />
        <path d="M250 245 L205 245 L205 295 L255 295 Z" fill={hex} filter="brightness(0.93)" stroke={stitchColor} strokeWidth="2" />

        {/* Ribbed Bottom & Cuffs */}
        <rect x="140" y="315" width="120" height="15" fill={hex} filter="brightness(0.85)" rx="2" />
        <rect x="95" y="235" width="20" height="15" transform="rotate(-30 95 235)" fill={hex} filter="brightness(0.85)" rx="2" />
        <rect x="290" y="225" width="20" height="15" transform="rotate(30 290 225)" fill={hex} filter="brightness(0.85)" rx="2" />

        {/* Hood */}
        <path
          d="M150 110 C150 50, 250 50, 250 110 C250 125, 230 145, 200 145 C170 145, 150 125, 150 110 Z"
          fill={hex}
          filter="brightness(0.9)"
          stroke="#000000"
          strokeWidth="1.5"
          strokeOpacity="0.2"
        />

        {/* Custom Text Print on Left Chest */}
        {customText && customText.trim() && (
          <text
            x="165"
            y="180"
            fill={textColor}
            fontSize="10"
            fontWeight="800"
            letterSpacing="1"
            textAnchor="middle"
            className="uppercase font-mono"
          >
            {customText.length > 8 ? customText.substring(0, 7) + '..' : customText}
          </text>
        )}
      </svg>
    );
  }

  // 3. CREWNECK SWEATSHIRT
  if (imageKey.includes('sweatshirt')) {
    return (
      <svg
        viewBox="0 0 400 400"
        className="w-full h-full max-h-full drop-shadow-md transition-transform duration-300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Main Body */}
        <path
          d="M140 100 L85 145 L110 245 L145 225 L145 330 L255 330 L255 225 L290 245 L315 145 L260 100 Z"
          fill={hex}
          stroke="#000000"
          strokeWidth="2"
          strokeOpacity="0.15"
        />

        {/* Raglan / Drop Shoulder Seams */}
        <path d="M165 105 L145 160 L110 245" stroke={stitchColor} strokeWidth="2.5" />
        <path d="M235 105 L255 160 L290 245" stroke={stitchColor} strokeWidth="2.5" />

        {/* Crew Collar with ribbed finish */}
        <path
          d="M160 100 C160 120, 240 120, 240 100 C240 90, 160 90, 160 100 Z"
          fill={hex}
          filter="brightness(0.85)"
          stroke="#000000"
          strokeWidth="1.5"
          strokeOpacity="0.3"
        />
        {/* V-stitch notch at neck */}
        <polygon points="193,115 207,115 200,125" fill="none" stroke={stitchColor} strokeWidth="2" />

        {/* Ribbed Hem & Cuffs */}
        <rect x="145" y="315" width="110" height="15" fill={hex} filter="brightness(0.85)" rx="2" />
        <rect x="100" y="230" width="20" height="15" transform="rotate(-30 100 230)" fill={hex} filter="brightness(0.85)" rx="2" />
        <rect x="285" y="220" width="20" height="15" transform="rotate(30 285 220)" fill={hex} filter="brightness(0.85)" rx="2" />

        {/* Custom Text / Branding */}
        {customText && customText.trim() && (
          <g>
            <rect
              x="150"
              y="170"
              width="100"
              height="28"
              rx="4"
              fill={isWhiteOrLight ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.12)'}
            />
            <text
              x="200"
              y="188"
              fill={textColor}
              fontSize="12"
              fontWeight="800"
              letterSpacing="1.5"
              textAnchor="middle"
              className="uppercase font-mono"
            >
              {customText.length > 12 ? customText.substring(0, 10) + '...' : customText}
            </text>
          </g>
        )}
      </svg>
    );
  }

  // 4. POLO SHIRT
  if (imageKey.includes('polo')) {
    return (
      <svg
        viewBox="0 0 400 400"
        className="w-full h-full max-h-full drop-shadow-md transition-transform duration-300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Main Body */}
        <path
          d="M140 100 L95 130 L115 190 L145 180 L145 330 L255 330 L255 180 L285 190 L305 130 L260 100 Z"
          fill={hex}
          stroke="#000000"
          strokeWidth="2"
          strokeOpacity="0.15"
        />

        {/* Sleeve Cuffs */}
        <rect x="100" y="176" width="28" height="10" transform="rotate(-15 100 176)" fill={hex} filter="brightness(0.88)" />
        <rect x="272" y="169" width="28" height="10" transform="rotate(15 272 169)" fill={hex} filter="brightness(0.88)" />

        {/* Polo Placket & Buttons */}
        <rect x="192" y="100" width="16" height="55" fill={hex} filter="brightness(0.92)" stroke="#000000" strokeWidth="1" strokeOpacity="0.2" />
        <circle cx="200" cy="115" r="2" fill="#ffffff" stroke="#94a3b8" strokeWidth="1" />
        <circle cx="200" cy="130" r="2" fill="#ffffff" stroke="#94a3b8" strokeWidth="1" />
        <circle cx="200" cy="145" r="2" fill="#ffffff" stroke="#94a3b8" strokeWidth="1" />

        {/* Folded Collar Wings */}
        <path d="M150 95 L192 125 L180 85 Z" fill={hex} filter="brightness(0.85)" stroke="#000000" strokeWidth="1.5" strokeOpacity="0.2" />
        <path d="M250 95 L208 125 L220 85 Z" fill={hex} filter="brightness(0.85)" stroke="#000000" strokeWidth="1.5" strokeOpacity="0.2" />

        {/* Left Chest Embroidery / Custom Name */}
        <circle cx="168" cy="160" r="10" fill={isWhiteOrLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.1)'} />
        {customText && customText.trim() ? (
          <text
            x="168"
            y="163"
            fill={textColor}
            fontSize="8"
            fontWeight="800"
            letterSpacing="0.5"
            textAnchor="middle"
            className="uppercase font-mono"
          >
            {customText.length > 7 ? customText.substring(0, 5) + '..' : customText}
          </text>
        ) : (
          <text x="168" y="163" fill={textColor} fontSize="8" fontWeight="bold" textAnchor="middle">
            ★
          </text>
        )}
      </svg>
    );
  }

  // 5. 6-PANEL COTTON CAP
  if (imageKey.includes('cap')) {
    return (
      <svg
        viewBox="0 0 400 400"
        className="w-full h-full max-h-full drop-shadow-md transition-transform duration-300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Cap Crown / Dome */}
        <path
          d="M110 240 C100 130, 300 130, 290 240 Z"
          fill={hex}
          stroke="#000000"
          strokeWidth="2"
          strokeOpacity="0.2"
        />

        {/* Curved Visor / Brim */}
        <path
          d="M100 240 C90 270, 310 270, 300 240 C320 280, 80 280, 100 240 Z"
          fill={hex}
          filter="brightness(0.85)"
          stroke="#000000"
          strokeWidth="2"
          strokeOpacity="0.3"
        />

        {/* Panel Seam Lines */}
        <path d="M200 140 L200 240" stroke={stitchColor} strokeWidth="2.5" />
        <path d="M200 140 Q150 170 130 240" stroke={stitchColor} strokeWidth="2" />
        <path d="M200 140 Q250 170 270 240" stroke={stitchColor} strokeWidth="2" />

        {/* Eyelets (ventilation holes) */}
        <circle cx="160" cy="180" r="3" fill="#111827" stroke={stitchColor} strokeWidth="1.5" />
        <circle cx="200" cy="175" r="3" fill="#111827" stroke={stitchColor} strokeWidth="1.5" />
        <circle cx="240" cy="180" r="3" fill="#111827" stroke={stitchColor} strokeWidth="1.5" />

        {/* Top Button */}
        <circle cx="200" cy="138" r="6" fill={hex} filter="brightness(0.75)" stroke="#000000" strokeWidth="1" strokeOpacity="0.3" />

        {/* Front Custom Embroidery Badge */}
        {customText && customText.trim() ? (
          <g>
            <rect
              x="160"
              y="200"
              width="80"
              height="24"
              rx="4"
              fill={isWhiteOrLight ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.15)'}
              stroke={stitchColor}
              strokeWidth="1.5"
            />
            <text
              x="200"
              y="216"
              fill={textColor}
              fontSize="11"
              fontWeight="900"
              letterSpacing="1"
              textAnchor="middle"
              className="uppercase font-mono"
            >
              {customText.length > 9 ? customText.substring(0, 7) + '...' : customText}
            </text>
          </g>
        ) : (
          <path
            d="M190 205 L200 195 L210 205 L205 218 L195 218 Z"
            fill={textColor}
            fillOpacity="0.4"
          />
        )}
      </svg>
    );
  }

  // 6. PLAIN CREWNECK TEE
  if (imageKey.includes('tshirt')) {
    return (
      <svg
        viewBox="0 0 400 400"
        className="w-full h-full max-h-full drop-shadow-md transition-transform duration-300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Main Body & Short Sleeves */}
        <path
          d="M145 105 L95 135 L120 185 L145 175 L145 330 L255 330 L255 175 L280 185 L305 135 L255 105 Z"
          fill={hex}
          stroke="#000000"
          strokeWidth="2"
          strokeOpacity="0.15"
        />

        {/* Crew Neck Collar */}
        <path
          d="M165 105 C165 125, 235 125, 235 105 C235 95, 165 95, 165 105 Z"
          fill={hex}
          filter="brightness(0.9)"
          stroke="#000000"
          strokeWidth="1.5"
          strokeOpacity="0.2"
        />

        {/* Sleeve Seams */}
        <path d="M145 105 L145 175" stroke={stitchColor} strokeWidth="2" />
        <path d="M255 105 L255 175" stroke={stitchColor} strokeWidth="2" />

        {/* Custom Text Print */}
        {customText && customText.trim() && (
          <g>
            <rect
              x="160"
              y="170"
              width="80"
              height="28"
              rx="4"
              fill={isWhiteOrLight ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.12)'}
            />
            <text
              x="200"
              y="188"
              fill={textColor}
              fontSize="12"
              fontWeight="800"
              letterSpacing="1.5"
              textAnchor="middle"
              className="uppercase font-mono"
            >
              {customText.length > 12 ? customText.substring(0, 10) + '...' : customText}
            </text>
          </g>
        )}
      </svg>
    );
  }

  // 7. REFLECTIVE SAFETY VEST
  if (imageKey.includes('reflective')) {
    return (
      <svg
        viewBox="0 0 400 400"
        className="w-full h-full max-h-full drop-shadow-md transition-transform duration-300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Sleeveless Vest Body */}
        <path
          d="M140 100 L115 150 L140 180 L140 330 L260 330 L260 180 L285 150 L260 100 Z"
          fill={hex}
          stroke="#000000"
          strokeWidth="2"
          strokeOpacity="0.2"
        />

        {/* Deep V-Neck Opening */}
        <path d="M165 100 L200 180 L235 100 Z" fill="#1e293b" fillOpacity="0.25" />

        {/* 2-Inch High Visibility Reflective Silver Stripes */}
        {/* Top Horizontal Stripe */}
        <rect x="140" y="210" width="120" height="18" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1" />
        {/* Bottom Horizontal Stripe */}
        <rect x="140" y="260" width="120" height="18" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1" />
        {/* Vertical Shoulder Overlap Stripes */}
        <rect x="155" y="100" width="16" height="110" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1" />
        <rect x="229" y="100" width="16" height="110" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1" />

        {/* Front Velcro closure line */}
        <line x1="200" y1="180" x2="200" y2="330" stroke="#000000" strokeWidth="2" strokeOpacity="0.4" strokeDasharray="4 2" />

        {/* Custom Text / Company Logo on Right Chest */}
        {customText && customText.trim() && (
          <text
            x="245"
            y="150"
            fill="#0f172a"
            fontSize="9"
            fontWeight="900"
            textAnchor="middle"
            className="uppercase font-mono bg-white"
          >
            {customText.length > 7 ? customText.substring(0, 6) + '..' : customText}
          </text>
        )}
      </svg>
    );
  }

  // 8. PUFFER VEST / BODYWARMER
  if (imageKey.includes('puffer')) {
    return (
      <svg
        viewBox="0 0 400 400"
        className="w-full h-full max-h-full drop-shadow-md transition-transform duration-300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Sleeveless Puffer Body */}
        <path
          d="M140 100 L115 150 L140 180 L140 330 L260 330 L260 180 L285 150 L260 100 Z"
          fill={hex}
          stroke="#000000"
          strokeWidth="2"
          strokeOpacity="0.2"
        />

        {/* Stand Collar */}
        <rect x="160" y="85" width="80" height="25" rx="4" fill={hex} filter="brightness(0.9)" stroke="#000000" strokeWidth="1.5" strokeOpacity="0.3" />

        {/* Quilted Horizontal Puffer Baffles */}
        <path d="M140 145 C170 152, 230 152, 260 145" stroke="#000000" strokeWidth="2.5" strokeOpacity="0.3" />
        <path d="M140 190 C170 197, 230 197, 260 190" stroke="#000000" strokeWidth="2.5" strokeOpacity="0.3" />
        <path d="M140 235 C170 242, 230 242, 260 235" stroke="#000000" strokeWidth="2.5" strokeOpacity="0.3" />
        <path d="M140 280 C170 287, 230 287, 260 280" stroke="#000000" strokeWidth="2.5" strokeOpacity="0.3" />

        {/* Front Metal Zipper */}
        <line x1="200" y1="85" x2="200" y2="330" stroke="#94a3b8" strokeWidth="3" />
        <rect x="197" y="110" width="6" height="12" rx="1" fill="#475569" />

        {/* Zipper Side Pockets */}
        <line x1="155" y1="260" x2="175" y2="280" stroke="#000000" strokeWidth="3" strokeOpacity="0.4" />
        <line x1="245" y1="260" x2="225" y2="280" stroke="#000000" strokeWidth="3" strokeOpacity="0.4" />

        {/* Custom Text Print */}
        {customText && customText.trim() && (
          <text
            x="165"
            y="130"
            fill={textColor}
            fontSize="9"
            fontWeight="800"
            letterSpacing="1"
            textAnchor="middle"
            className="uppercase font-mono"
          >
            {customText.length > 7 ? customText.substring(0, 6) + '..' : customText}
          </text>
        )}
      </svg>
    );
  }

  // Fallback to pullover hoodie
  return (
    <svg viewBox="0 0 400 400" className="w-full h-full" fill="none">
      <rect x="120" y="100" width="160" height="220" rx="16" fill={hex} />
      <text x="200" y="210" fill={textColor} fontSize="14" fontWeight="bold" textAnchor="middle">
        {imageKey}
      </text>
    </svg>
  );
}
