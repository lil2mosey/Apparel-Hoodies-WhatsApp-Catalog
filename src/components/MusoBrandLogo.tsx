import React, { useState } from 'react';

const officialLogoImg = '/grysons-logo.jpg';

interface GrysonBrandLogoProps {
  variant?: 'full' | 'emblem' | 'icon' | 'card';
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'custom';
  className?: string;
  phone?: string;
  usePhoto?: boolean;
}

export const GrysonBrandLogo: React.FC<GrysonBrandLogoProps> = ({
  variant = 'full',
  size = 'md',
  className = '',
  phone = '0735418753',
  usePhoto = true,
}) => {
  const [imgError, setImgError] = useState(false);

  // Dimension mapping
  const sizeStyles = {
    sm: variant === 'full' || variant === 'card' ? 'w-32' : 'w-9 h-9',
    md: variant === 'full' || variant === 'card' ? 'w-48 sm:w-56' : 'w-11 h-11 sm:w-12 sm:h-12',
    lg: variant === 'full' || variant === 'card' ? 'w-64 sm:w-72' : 'w-16 h-16 sm:w-20 sm:h-20',
    xl: variant === 'full' || variant === 'card' ? 'w-80 sm:w-96' : 'w-24 h-24 sm:w-28 sm:h-28',
    custom: '',
  };

  const selectedSizeClass = sizeStyles[size];

  // SVG Emblem recreation of Gryson's uploaded brand logo
  const EmblemSVG = ({ className = 'w-full h-full' }: { className?: string }) => (
    <svg
      viewBox="0 0 400 400"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Gryson's Apparel & Custom Merch Official Logo"
    >
      <defs>
        {/* Arc path for circular text around the emblem */}
        <path
          id="grysonTopArcPath"
          d="M 45 200 A 155 155 0 1 1 355 200 A 155 155 0 0 1 45 200"
          fill="none"
        />

        {/* Green 3D gradients for the faceted 'G' monogram */}
        <linearGradient id="grysonEmeraldMain" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10b981" />
          <stop offset="50%" stopColor="#059669" />
          <stop offset="100%" stopColor="#047857" />
        </linearGradient>

        <linearGradient id="grysonEmeraldLight" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6ee7b7" />
          <stop offset="100%" stopColor="#10b981" />
        </linearGradient>

        <linearGradient id="grysonEmeraldDark" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#047857" />
          <stop offset="100%" stopColor="#064e3b" />
        </linearGradient>

        <linearGradient id="grysonRedAccent" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ef4444" />
          <stop offset="100%" stopColor="#b91c1c" />
        </linearGradient>

        {/* Drop shadow filter for 3D elements */}
        <filter id="grysonShadow" x="-10%" y="-10%" width="125%" height="125%">
          <feDropShadow dx="0" dy="3" stdDeviation="3" floodOpacity="0.25" />
        </filter>
        <filter id="monogramGlow" x="-15%" y="-15%" width="130%" height="130%">
          <feDropShadow dx="0" dy="4" stdDeviation="5" floodOpacity="0.3" />
        </filter>
      </defs>

      {/* Outer Slate / Dark Charcoal Ring Frame */}
      <circle cx="200" cy="200" r="190" fill="#242c38" />

      {/* Red Outer Accent Trim Arcs */}
      <path
        d="M 50 250 A 175 175 0 0 0 140 365"
        stroke="url(#grysonRedAccent)"
        strokeWidth="6"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M 260 365 A 175 175 0 0 0 350 250"
        stroke="url(#grysonRedAccent)"
        strokeWidth="6"
        strokeLinecap="round"
        fill="none"
      />

      {/* Inner White Display Stage for the G and Garments */}
      <circle cx="200" cy="200" r="142" fill="#FFFFFF" stroke="#242c38" strokeWidth="2" filter="url(#grysonShadow)" />
      
      {/* Subtle Inner Accent Ring */}
      <circle cx="200" cy="200" r="136" stroke="#f1f5f9" strokeWidth="2" fill="none" />

      {/* Circular Border Banner Text with all 7 item categories */}
      <text
        fill="#FFFFFF"
        fontSize="11.5"
        fontWeight="800"
        letterSpacing="1.2"
        className="uppercase select-none"
        style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}
      >
        <textPath href="#grysonTopArcPath" startOffset="50%" textAnchor="middle">
          Hoodies, Polo Shirts, Sweatshirts, Ponchos, Tracksuits, Caps, Plain Tees.
        </textPath>
      </text>

      {/* =========================================================================
          7 APPAREL ICONS (Arranged symmetrically in the white circle around the G)
          ========================================================================= */}
      <g fill="#242c38" stroke="#242c38" strokeLinecap="round" strokeLinejoin="round">
        
        {/* 1. PONCHO ICON (Top Left - Fringed Draped Poncho) */}
        <g transform="translate(100, 80) scale(0.68)">
          <path d="M 25 10 L 48 35 L 2 35 Z" fill="#242c38" />
          <path d="M 20 10 L 25 18 L 30 10" stroke="#ffffff" strokeWidth="2" fill="none" />
          <line x1="4" y1="35" x2="4" y2="40" stroke="#242c38" strokeWidth="1.8" />
          <line x1="10" y1="35" x2="10" y2="40" stroke="#242c38" strokeWidth="1.8" />
          <line x1="16" y1="35" x2="16" y2="40" stroke="#242c38" strokeWidth="1.8" />
          <line x1="22" y1="35" x2="22" y2="40" stroke="#242c38" strokeWidth="1.8" />
          <line x1="28" y1="35" x2="28" y2="40" stroke="#242c38" strokeWidth="1.8" />
          <line x1="34" y1="35" x2="34" y2="40" stroke="#242c38" strokeWidth="1.8" />
          <line x1="40" y1="35" x2="40" y2="40" stroke="#242c38" strokeWidth="1.8" />
          <line x1="46" y1="35" x2="46" y2="40" stroke="#242c38" strokeWidth="1.8" />
        </g>

        {/* 2. TRACKSUIT SET ICON (Top Right - Zip Jacket + Joggers) */}
        <g transform="translate(260, 80) scale(0.68)">
          <path d="M 8 16 L 16 12 L 24 12 L 32 16 L 38 24 L 34 26 L 30 22 L 30 36 L 10 36 L 10 22 L 6 26 L 2 24 Z" fill="#242c38" />
          <line x1="20" y1="12" x2="20" y2="36" stroke="#ffffff" strokeWidth="1.5" />
          <line x1="10" y1="18" x2="6" y2="24" stroke="#ffffff" strokeWidth="1.2" />
          <line x1="30" y1="18" x2="34" y2="24" stroke="#ffffff" strokeWidth="1.2" />
          <path d="M 12 39 L 28 39 L 26 54 L 22 54 L 20 44 L 18 54 L 14 54 Z" fill="#242c38" />
          <line x1="13" y1="40" x2="15" y2="53" stroke="#ffffff" strokeWidth="1" />
          <line x1="27" y1="40" x2="25" y2="53" stroke="#ffffff" strokeWidth="1" />
        </g>

        {/* 3. HOODIE ICON (Middle Left) */}
        <g transform="translate(76, 175) scale(0.65)">
          <path d="M 12 24 C 12 10, 36 10, 36 24 Z" fill="#242c38" />
          <path d="M 6 24 L 14 42 L 20 42 L 18 32 L 30 32 L 28 42 L 34 42 L 42 24 Z" fill="#242c38" />
          <path d="M 18 32 L 30 32 L 28 40 L 20 40 Z" fill="#ffffff" />
        </g>

        {/* 4. PLAIN CREWNECK T-SHIRT ICON (Middle Right) */}
        <g transform="translate(285, 175) scale(0.65)">
          <path d="M 10 18 L 16 14 C 20 18, 28 18, 32 14 L 38 18 L 34 28 L 30 27 L 30 44 L 18 44 L 18 27 L 14 28 Z" fill="#242c38" />
        </g>

        {/* 5. POLO SHIRT ICON (Bottom Left) */}
        <g transform="translate(100, 260) scale(0.65)">
          <path d="M 8 20 L 18 18 L 24 24 L 30 18 L 40 20 L 36 28 L 32 27 L 32 44 L 16 44 L 16 27 L 12 28 Z" fill="#242c38" />
          <path d="M 18 18 L 24 26 L 21 19 Z" fill="#ffffff" />
          <path d="M 30 18 L 24 26 L 27 19 Z" fill="#ffffff" />
        </g>

        {/* 6. SWEATSHIRT ICON (Bottom Center) */}
        <g transform="translate(182, 275) scale(0.65)">
          <path d="M 8 18 L 16 14 C 20 18, 28 18, 32 14 L 40 18 L 35 32 L 30 30 L 30 44 L 18 44 L 18 30 L 13 32 Z" fill="#242c38" />
          <path d="M 19 15 C 22 18, 26 18, 29 15" stroke="#ffffff" strokeWidth="1.5" fill="none" />
        </g>

        {/* 7. BASEBALL CAP ICON (Bottom Right) */}
        <g transform="translate(262, 260) scale(0.65)">
          <path d="M 10 30 C 10 16, 34 16, 38 30 Z" fill="#242c38" />
          <path d="M 8 30 C 16 33, 36 32, 44 29 C 40 35, 24 36, 8 30 Z" fill="#242c38" />
          <circle cx="24" cy="16" r="2.2" fill="#ffffff" />
        </g>
      </g>

      {/* =========================================================================
          CENTRAL 3D FACETED EMERALD GREEN 'G' MONOGRAM
          ========================================================================= */}
      <g filter="url(#monogramGlow)" transform="translate(200, 195)">
        <path
          d="M 18 -58 C 4 -58, -12 -54, -26 -44 C -44 -30, -55 -8, -55 16 C -55 42, -42 64, -20 74 C -4 82, 16 82, 32 74 C 44 68, 52 56, 52 40 L 52 10 L 0 10 L 0 28 L 30 28 L 30 38 C 30 46, 22 56, 12 60 C -2 64, -18 64, -28 52 C -38 40, -40 24, -40 12 C -40 -8, -32 -26, -18 -36 C -8 -44, 4 -46, 16 -46 C 26 -46, 36 -42, 44 -34 L 54 -46 C 44 -54, 32 -58, 18 -58 Z"
          fill="url(#grysonEmeraldMain)"
        />
        <path
          d="M 18 -58 C 4 -58, -12 -54, -26 -44 C -44 -30, -55 -8, -55 16 C -55 24, -50 20, -45 10 C -45 -12, -34 -30, -18 -38 C -6 -44, 6 -46, 16 -46 C 28 -46, 38 -40, 46 -32 L 54 -46 C 44 -54, 32 -58, 18 -58 Z"
          fill="url(#grysonEmeraldLight)"
        />
        <path
          d="M 52 10 L 0 10 L 0 28 L 30 28 L 52 28 Z"
          fill="url(#grysonEmeraldDark)"
        />
        <path
          d="M 0 10 L 30 28 L 0 28 Z"
          fill="url(#grysonEmeraldMain)"
        />
        <path
          d="M 30 28 L 52 28 L 52 40 C 52 56, 44 68, 32 74 L 24 64 C 34 58, 36 50, 36 40 L 30 40 Z"
          fill="url(#grysonEmeraldLight)"
        />
        <path
          d="M -20 74 C -4 82, 16 82, 32 74 L 24 64 C 12 70, -2 70, -14 62 Z"
          fill="url(#grysonEmeraldDark)"
        />
      </g>
    </svg>
  );

  // If icon-only or emblem-only variant requested
  if (variant === 'icon' || variant === 'emblem') {
    return (
      <div className={`relative inline-flex items-center justify-center shrink-0 ${selectedSizeClass} ${className}`}>
        {usePhoto && !imgError ? (
          <img
            src={officialLogoImg}
            alt="Gryson's Apparel Official Logo"
            className="w-full h-full object-contain rounded-full shadow-xs"
            onError={() => setImgError(true)}
            referrerPolicy="no-referrer"
          />
        ) : (
          <EmblemSVG className="w-full h-full drop-shadow-sm" />
        )}
      </div>
    );
  }

  // Card Variant: Clean framed badge replicating the full exact card from user's image
  if (variant === 'card') {
    return (
      <div className={`relative flex flex-col items-center bg-white dark:bg-[#1a202c] p-5 sm:p-7 rounded-3xl border border-neutral-200/80 dark:border-neutral-700/80 shadow-lg ${selectedSizeClass} ${className}`}>
        <div className="w-full aspect-square max-w-[240px] flex items-center justify-center">
          {usePhoto && !imgError ? (
            <img
              src={officialLogoImg}
              alt="Gryson's Apparel & Custom Merch Official Logo"
              className="w-full h-full object-contain rounded-2xl"
              onError={() => setImgError(true)}
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center">
              <EmblemSVG className="w-full h-full" />
            </div>
          )}
        </div>
      </div>
    );
  }

  // Full variant: Official Logo Graphic Image with Fallback
  return (
    <div className={`flex flex-col items-center text-center select-none ${selectedSizeClass} ${className}`}>
      {/* Central Circular Emblem */}
      <div className="w-full aspect-square max-w-[240px] drop-shadow-md flex items-center justify-center">
        {usePhoto && !imgError ? (
          <img
            src={officialLogoImg}
            alt="Gryson's Apparel & Custom Merch"
            className="w-full h-full object-contain rounded-2xl"
            onError={() => setImgError(true)}
            referrerPolicy="no-referrer"
          />
        ) : (
          <EmblemSVG className="w-full h-full" />
        )}
      </div>

      {/* Fallback typography in case only SVG is rendered */}
      {(!usePhoto || imgError) && (
        <div className="mt-3 space-y-0.5">
          <h2 className="text-sm sm:text-base md:text-xl font-black tracking-tight text-neutral-900 dark:text-white leading-tight uppercase font-heading">
            GRYSON'S
          </h2>
          <h3 className="text-[11px] sm:text-xs md:text-sm font-black tracking-widest text-neutral-800 dark:text-neutral-300 uppercase font-heading">
            APPAREL & CUSTOM MERCH
          </h3>
          <p className="text-xs sm:text-sm md:text-base font-extrabold text-[#b91c1c] dark:text-[#f87171] tracking-wider font-mono pt-0.5">
            {phone}
          </p>
        </div>
      )}
    </div>
  );
};

// Aliased export to preserve backwards compatibility across existing components
export const MusoBrandLogo = GrysonBrandLogo;
