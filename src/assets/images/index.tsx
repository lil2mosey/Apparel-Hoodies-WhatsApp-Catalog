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
    id: 'img-hoodie-half',
    key: 'hoodie-half',
    name: 'Half Hoodie (Sleeveless Fleece Hoodie)',
    category: 'hoodies',
    fileName: 'half-hoodie.svg',
    format: 'svg-vector',
    description: 'Sleeveless drop-armhole pullover fleece hoodie with kangaroo pocket and drawstrings',
    dimensions: '400x400 (Vector Scalable)',
  },
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
    id: 'img-poncho-fleece',
    key: 'poncho-fleece',
    name: 'Fringed Warm Fleece & Maasai Poncho',
    category: 'ponchos',
    fileName: 'fleece-poncho.svg',
    format: 'svg-vector',
    description: 'Signature warm draped fleece poncho with handcrafted fringe tassels and open neckline',
    dimensions: '400x400 (Vector Scalable)',
  },
  {
    id: 'img-tracksuit-set',
    key: 'tracksuit-set',
    name: '2-Piece Athletic Fleece Tracksuit (Jacket & Joggers)',
    category: 'tracksuits',
    fileName: 'athletic-tracksuit.svg',
    format: 'svg-vector',
    description: 'Matching full-zip fleece track jacket and cuffed jogger pants 2-piece set',
    dimensions: '400x400 (Vector Scalable)',
  },
  {
    id: 'img-brand-logo',
    key: 'muso-logo',
    name: "Gryson's Brand Monogram Logo",
    category: 'branding',
    fileName: 'grysons-brand-logo.svg',
    format: 'svg-vector',
    description: 'Official emblem for Gryson Apparel with Emerald green 3D G monogram and red accents',
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

  // 0. HALF HOODIE / SLEEVELESS HOODIE
  if (imageKey.includes('hoodie-half') || imageKey.includes('half-hoodie') || imageKey.includes('sleeveless-hoodie')) {
    return (
      <svg
        viewBox="0 0 400 400"
        className="w-full h-full max-h-full drop-shadow-md transition-transform duration-300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Sleeveless Body Contour */}
        <path
          d="M135 110 L108 140 L132 180 L142 165 L142 330 L258 330 L258 165 L268 180 L292 140 L265 110 Z"
          fill={hex}
          stroke="#000000"
          strokeWidth="2"
          strokeOpacity="0.15"
        />

        {/* Rolled / Ribbed Sleeveless Armhole Trim Left */}
        <path
          d="M108 140 C118 154, 126 168, 132 180 C136 175, 140 170, 142 165 C136 154, 128 144, 118 134 Z"
          fill={hex}
          filter="brightness(0.88)"
          stroke={stitchColor}
          strokeWidth="1.5"
        />
        {/* Rolled / Ribbed Sleeveless Armhole Trim Right */}
        <path
          d="M292 140 C282 154, 274 168, 268 180 C264 175, 260 170, 258 165 C264 154, 272 144, 282 134 Z"
          fill={hex}
          filter="brightness(0.88)"
          stroke={stitchColor}
          strokeWidth="1.5"
        />

        {/* Kangaroo Front Pocket */}
        <path
          d="M160 245 L240 245 L255 295 L145 295 Z"
          fill={hex}
          filter="brightness(0.93)"
          stroke={stitchColor}
          strokeWidth="2"
        />
        <path d="M160 245 L145 295" stroke={stitchColor} strokeWidth="2.5" strokeDasharray="3 3" />
        <path d="M240 245 L255 295" stroke={stitchColor} strokeWidth="2.5" strokeDasharray="3 3" />

        {/* Bottom Ribbed Hem */}
        <rect x="142" y="315" width="116" height="15" fill={hex} filter="brightness(0.85)" rx="2" />

        {/* Double-Lined Hood */}
        <path
          d="M150 110 C150 48, 250 48, 250 110 C250 125, 230 145, 200 145 C170 145, 150 125, 150 110 Z"
          fill={hex}
          filter="brightness(0.9)"
          stroke="#000000"
          strokeWidth="1.5"
          strokeOpacity="0.2"
        />
        <path
          d="M165 105 C175 75, 225 75, 235 105 C220 125, 180 125, 165 105 Z"
          fill="#111827"
          fillOpacity="0.38"
        />

        {/* White Hood Drawstrings with Dark Metal/Rubber Tips */}
        <path d="M185 130 Q180 175 180 200" stroke="#f8fafc" strokeWidth="3" strokeLinecap="round" />
        <rect x="178.5" y="196" width="3" height="8" rx="1" fill="#1e293b" />
        <path d="M215 130 Q220 175 220 200" stroke="#f8fafc" strokeWidth="3" strokeLinecap="round" />
        <rect x="218.5" y="196" width="3" height="8" rx="1" fill="#1e293b" />

        {/* Custom Text / Branding */}
        {customText && customText.trim() && (
          <g>
            <rect
              x="155"
              y="165"
              width="90"
              height="26"
              rx="4"
              fill={isWhiteOrLight ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.12)'}
            />
            <text
              x="200"
              y="182"
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

  // 9. FRINGED WARM FLEECE PONCHO
  if (imageKey.includes('poncho')) {
    return (
      <svg
        viewBox="0 0 400 400"
        className="w-full h-full max-h-full drop-shadow-md transition-transform duration-300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Triangular Draped Poncho Main Body */}
        <path
          d="M200 90 L340 270 L200 340 L60 270 Z"
          fill={hex}
          stroke="#000000"
          strokeWidth="2.5"
          strokeOpacity="0.2"
        />

        {/* Diagonal Soft Draping Fabric Folds */}
        <path d="M200 135 L120 275" stroke={stitchColor} strokeWidth="2" strokeDasharray="4 4" />
        <path d="M200 135 L280 275" stroke={stitchColor} strokeWidth="2" strokeDasharray="4 4" />
        <path d="M200 160 L200 330" stroke="#000000" strokeWidth="2" strokeOpacity="0.15" />

        {/* Decorative Maasai / Geometric Border Band Accent */}
        <path
          d="M75 260 L200 325 L325 260 L335 272 L200 338 L65 272 Z"
          fill={isWhiteOrLight ? 'rgba(0,0,0,0.12)' : 'rgba(255,255,255,0.2)'}
        />

        {/* Fringe Tassels along bottom V-shaped border */}
        {/* Left V-edge tassels */}
        {[
          { x1: 70, y1: 275, x2: 64, y2: 295 },
          { x1: 90, y1: 285, x2: 84, y2: 305 },
          { x1: 110, y1: 295, x2: 104, y2: 315 },
          { x1: 130, y1: 305, x2: 124, y2: 325 },
          { x1: 150, y1: 315, x2: 144, y2: 335 },
          { x1: 170, y1: 325, x2: 164, y2: 345 },
          { x1: 190, y1: 335, x2: 184, y2: 355 },
          { x1: 200, y1: 340, x2: 200, y2: 362 },
          { x1: 210, y1: 335, x2: 216, y2: 355 },
          { x1: 230, y1: 325, x2: 236, y2: 345 },
          { x1: 250, y1: 315, x2: 256, y2: 335 },
          { x1: 270, y1: 305, x2: 276, y2: 325 },
          { x1: 290, y1: 295, x2: 296, y2: 315 },
          { x1: 310, y1: 285, x2: 316, y2: 305 },
          { x1: 330, y1: 275, x2: 336, y2: 295 },
        ].map((fringe, i) => (
          <line
            key={i}
            x1={fringe.x1}
            y1={fringe.y1}
            x2={fringe.x2}
            y2={fringe.y2}
            stroke={isWhiteOrLight ? '#475569' : '#f8fafc'}
            strokeWidth="3.5"
            strokeLinecap="round"
          />
        ))}

        {/* Neckline Opening (V-Neck / Collar) */}
        <path
          d="M175 90 C175 130, 225 130, 225 90 Z"
          fill="#111827"
          fillOpacity="0.3"
          stroke={stitchColor}
          strokeWidth="2"
        />
        <path
          d="M165 85 Q200 120 235 85"
          stroke={stitchColor}
          strokeWidth="3"
          fill="none"
        />

        {/* Custom Text / Monogram Embroidered on Chest */}
        {customText && customText.trim() && (
          <g>
            <rect
              x="160"
              y="160"
              width="80"
              height="24"
              rx="4"
              fill={isWhiteOrLight ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.18)'}
            />
            <text
              x="200"
              y="176"
              fill={textColor}
              fontSize="10"
              fontWeight="800"
              letterSpacing="1.5"
              textAnchor="middle"
              className="uppercase font-mono"
            >
              {customText.length > 10 ? customText.substring(0, 8) + '..' : customText}
            </text>
          </g>
        )}
      </svg>
    );
  }

  // 10. 2-PIECE ATHLETIC FLEECE TRACKSUIT (JACKET + JOGGERS)
  if (imageKey.includes('tracksuit')) {
    return (
      <svg
        viewBox="0 0 400 400"
        className="w-full h-full max-h-full drop-shadow-md transition-transform duration-300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* --- PART 1: FULL-ZIP TRACK JACKET (TOP HALF) --- */}
        {/* Jacket Body & Sleeves */}
        <path
          d="M135 60 L85 105 L105 175 L135 160 L135 210 L265 210 L265 160 L295 175 L315 105 L265 60 Z"
          fill={hex}
          stroke="#000000"
          strokeWidth="2"
          strokeOpacity="0.2"
        />

        {/* White / Contrast Shoulder Athletic Stripes */}
        <path d="M135 60 L85 105 L95 115 L142 70 Z" fill="#ffffff" fillOpacity="0.85" />
        <path d="M265 60 L315 105 L305 115 L258 70 Z" fill="#ffffff" fillOpacity="0.85" />

        {/* High Stand Collar */}
        <path
          d="M165 48 L165 65 L235 65 L235 48 Z"
          fill={hex}
          filter="brightness(0.85)"
          stroke="#000000"
          strokeWidth="1.5"
          strokeOpacity="0.3"
        />

        {/* Front Full Metal Zipper */}
        <line x1="200" y1="48" x2="200" y2="210" stroke="#f1f5f9" strokeWidth="3" />
        <rect x="197" y="65" width="6" height="12" rx="1.5" fill="#1e293b" />

        {/* Zipper Side Pockets */}
        <line x1="155" y1="160" x2="155" y2="188" stroke="#000000" strokeWidth="2.5" strokeOpacity="0.35" strokeLinecap="round" />
        <line x1="245" y1="160" x2="245" y2="188" stroke="#000000" strokeWidth="2.5" strokeOpacity="0.35" strokeLinecap="round" />

        {/* Jacket Ribbed Hem */}
        <rect x="135" y="200" width="130" height="10" rx="1" fill={hex} filter="brightness(0.8)" />

        {/* Sleeve Cuffs */}
        <rect x="99" y="162" width="16" height="12" rx="2" transform="rotate(25 99 162)" fill={hex} filter="brightness(0.8)" />
        <rect x="285" y="168" width="16" height="12" rx="2" transform="rotate(-25 285 168)" fill={hex} filter="brightness(0.8)" />

        {/* Custom Text / Chest Crest Print */}
        {customText && customText.trim() && (
          <text
            x="165"
            y="115"
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

        {/* --- PART 2: MATCHING TAPERED JOGGERS (BOTTOM HALF) --- */}
        {/* Drawcord Elastic Waistband */}
        <rect x="145" y="222" width="110" height="12" rx="2" fill={hex} filter="brightness(0.85)" stroke="#000000" strokeWidth="1" strokeOpacity="0.2" />
        {/* White Drawstrings Hanging */}
        <path d="M194 232 Q190 252 192 260" stroke="#f8fafc" strokeWidth="2" strokeLinecap="round" />
        <path d="M206 232 Q210 252 208 260" stroke="#f8fafc" strokeWidth="2" strokeLinecap="round" />

        {/* Jogger Legs */}
        <path
          d="M145 234 L152 355 L178 355 L200 270 L222 355 L248 355 L255 234 Z"
          fill={hex}
          stroke="#000000"
          strokeWidth="2"
          strokeOpacity="0.2"
        />

        {/* Outer White Leg Stripe Accents */}
        <line x1="148" y1="234" x2="154" y2="355" stroke="#ffffff" strokeWidth="2.5" strokeOpacity="0.8" />
        <line x1="252" y1="234" x2="246" y2="355" stroke="#ffffff" strokeWidth="2.5" strokeOpacity="0.8" />

        {/* Inseam & Pocket Slits */}
        <line x1="156" y1="245" x2="170" y2="265" stroke="#000000" strokeWidth="2" strokeOpacity="0.3" strokeLinecap="round" />
        <line x1="244" y1="245" x2="230" y2="265" stroke="#000000" strokeWidth="2" strokeOpacity="0.3" strokeLinecap="round" />

        {/* Ribbed Ankle Cuffs */}
        <rect x="152" y="355" width="26" height="10" rx="2" fill={hex} filter="brightness(0.78)" />
        <rect x="222" y="355" width="26" height="10" rx="2" fill={hex} filter="brightness(0.78)" />
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
