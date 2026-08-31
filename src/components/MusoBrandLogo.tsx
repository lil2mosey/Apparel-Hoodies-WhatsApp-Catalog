import React from 'react';

interface MusoBrandLogoProps {
  variant?: 'full' | 'emblem' | 'icon';
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'custom';
  className?: string;
  phone?: string;
}

export const MusoBrandLogo: React.FC<MusoBrandLogoProps> = ({
  variant = 'full',
  size = 'md',
  className = '',
  phone = '0735418753',
}) => {
  // Dimension mapping
  const sizeStyles = {
    sm: variant === 'full' ? 'w-28' : 'w-9 h-9',
    md: variant === 'full' ? 'w-44' : 'w-12 h-12',
    lg: variant === 'full' ? 'w-64' : 'w-20 h-20',
    xl: variant === 'full' ? 'w-80' : 'w-28 h-28',
    custom: '',
  };

  const selectedSizeClass = sizeStyles[size];

  // SVG Emblem recreation of the uploaded logo
  const EmblemSVG = ({ className = 'w-full h-full' }: { className?: string }) => (
    <svg
      viewBox="0 0 360 360"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Muso's Apparel Logo"
    >
      <defs>
        {/* Arc path for circular top text */}
        <path
          id="musoTopArcPath"
          d="M 52 180 A 128 128 0 0 1 308 180"
          fill="none"
        />

        {/* Green fabric gradients for the 3D folded 'M' */}
        <linearGradient id="musoGreenMain" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>

        <linearGradient id="musoGreenDark" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#047857" />
          <stop offset="100%" stopColor="#065f46" />
        </linearGradient>

        <linearGradient id="musoGreenLight" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#34d399" />
          <stop offset="100%" stopColor="#10b981" />
        </linearGradient>

        {/* Soft shadow filter */}
        <filter id="logoShadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="4" stdDeviation="4" floodOpacity="0.25" />
        </filter>
      </defs>

      {/* Main Dark Charcoal / Slate Circular Emblem */}
      <circle cx="180" cy="180" r="160" fill="#232a35" />

      {/* Outer Concentric Red Rings */}
      <circle cx="180" cy="180" r="150" stroke="#d9383a" strokeWidth="4" strokeOpacity="0.9" />
      <circle cx="180" cy="180" r="136" stroke="#d9383a" strokeWidth="3" />
      <circle cx="180" cy="180" r="130" stroke="#b91c1c" strokeWidth="1.5" strokeOpacity="0.6" />

      {/* Top Arc Curved Text */}
      <text
        fill="#FFFFFF"
        fontSize="11"
        fontWeight="800"
        letterSpacing="1.4"
        className="uppercase select-none"
        style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}
      >
        <textPath href="#musoTopArcPath" startOffset="50%" textAnchor="middle">
          Hoodies, Polo Shirts, Sweatshirts, Caps, Plain Tees.
        </textPath>
      </text>

      {/* 5 Apparel Icons arranged symmetrically in arc */}
      <g fill="#FFFFFF" stroke="#FFFFFF" strokeLinecap="round" strokeLinejoin="round">
        {/* 1. Pullover Hoodie Icon (Upper Left) */}
        <g transform="translate(130, 80) scale(0.65)">
          {/* Hood */}
          <path d="M12 28 C12 12, 36 12, 36 28 Z" fill="#ffffff" />
          {/* Body & Sleeves */}
          <path d="M6 28 L14 46 L20 46 L18 36 L30 36 L28 46 L34 46 L42 28 Z" fill="#ffffff" />
          {/* Kangaroo Pocket */}
          <path d="M18 36 L30 36 L28 44 L20 44 Z" fill="#232a35" />
        </g>

        {/* 2. Polo Shirt Icon (Top Center) */}
        <g transform="translate(164, 73) scale(0.68)">
          <path d="M8 22 L18 20 L24 26 L30 20 L40 22 L36 30 L32 29 L32 46 L16 46 L16 29 L12 30 Z" fill="#ffffff" />
          {/* Collar flaps */}
          <path d="M18 20 L24 28 L21 21 Z" fill="#232a35" />
          <path d="M30 20 L24 28 L27 21 Z" fill="#232a35" />
          <line x1="24" y1="28" x2="24" y2="35" stroke="#232a35" strokeWidth="1.5" />
        </g>

        {/* 3. Baseball Cap Icon (Upper Right) */}
        <g transform="translate(198, 83) scale(0.65)">
          {/* Cap Crown */}
          <path d="M10 32 C10 18, 34 18, 38 32 Z" fill="#ffffff" />
          {/* Curved Visor / Brim */}
          <path d="M8 32 C16 35, 36 34, 44 31 C40 37, 24 38, 8 32 Z" fill="#ffffff" />
          {/* Top button */}
          <circle cx="24" cy="18" r="2" fill="#ffffff" />
        </g>

        {/* 4. Crewneck Sweatshirt Icon (Middle Left) */}
        <g transform="translate(108, 122) scale(0.62)">
          <path d="M8 20 L16 16 C20 20, 28 20, 32 16 L40 20 L35 34 L30 32 L30 46 L18 46 L18 32 L13 34 Z" fill="#ffffff" />
        </g>

        {/* 5. Plain Crewneck T-Shirt Icon (Middle Right) */}
        <g transform="translate(228, 122) scale(0.62)">
          <path d="M10 20 L16 16 C20 19, 28 19, 32 16 L38 20 L34 30 L30 29 L30 46 L18 46 L18 29 L14 30 Z" fill="#ffffff" />
        </g>
      </g>

      {/* Central Large 3D Folded Emerald Green "M" Graphic with Sweater Sleeve */}
      <g filter="url(#logoShadow)">
        {/* Left Vertical Pillar of 'M' */}
        <path
          d="M 136 116 L 165 116 L 165 204 L 136 190 Z"
          fill="url(#musoGreenMain)"
        />
        {/* Left Bottom Base extension */}
        <path
          d="M 136 190 L 165 204 L 165 242 L 136 242 Z"
          fill="url(#musoGreenLight)"
        />

        {/* Central Left Diagonal Slope of 'M' */}
        <path
          d="M 165 116 L 202 216 L 180 236 L 148 150 Z"
          fill="url(#musoGreenDark)"
        />

        {/* Central Right Diagonal Slope of 'M' */}
        <path
          d="M 180 236 L 210 116 L 236 116 L 196 230 Z"
          fill="url(#musoGreenMain)"
        />

        {/* Right Pillar & Folded Fabric Sleeve with Ribbed Cuff */}
        {/* Upper Right Pillar */}
        <path
          d="M 210 116 L 246 116 L 246 194 L 215 194 Z"
          fill="url(#musoGreenLight)"
        />

        {/* Folded Drape Sleeve (curved outer fold) */}
        <path
          d="M 215 174 C 230 170, 246 170, 252 188 L 250 232 C 248 238, 235 242, 222 242 C 210 242, 204 236, 204 228 L 206 182 Z"
          fill="url(#musoGreenMain)"
        />

        {/* Sleeve Inner Fold Crease Shadow */}
        <path
          d="M 218 184 C 228 190, 236 200, 234 226 L 222 240 C 215 240, 212 234, 212 228 Z"
          fill="url(#musoGreenDark)"
        />

        {/* Ribbed Sleeve Cuff at bottom right */}
        <path
          d="M 230 216 L 250 216 L 248 238 L 230 238 Z"
          fill="url(#musoGreenLight)"
          stroke="#047857"
          strokeWidth="1.5"
        />
        {/* Ribbing lines */}
        <line x1="235" y1="218" x2="235" y2="236" stroke="#065f46" strokeWidth="1" />
        <line x1="240" y1="218" x2="240" y2="236" stroke="#065f46" strokeWidth="1" />
        <line x1="245" y1="218" x2="245" y2="236" stroke="#065f46" strokeWidth="1" />
      </g>
    </svg>
  );

  // If icon-only or emblem-only variant requested
  if (variant === 'icon' || variant === 'emblem') {
    return (
      <div className={`relative inline-flex items-center justify-center shrink-0 ${selectedSizeClass} ${className}`}>
        <EmblemSVG className="w-full h-full drop-shadow-sm" />
      </div>
    );
  }

  // Full variant: Emblem + Typography ("MUSO'S APPAREL", "& CUSTOM MERCH", "0735418753")
  return (
    <div className={`flex flex-col items-center text-center select-none ${selectedSizeClass} ${className}`}>
      {/* Central Circular Emblem */}
      <div className="w-full aspect-square max-w-[240px] drop-shadow-md">
        <EmblemSVG className="w-full h-full" />
      </div>

      {/* Brand Typography matching uploaded logo design */}
      <div className="mt-3 space-y-0.5">
        <h2 className="text-sm sm:text-base md:text-lg font-black tracking-tight text-neutral-900 dark:text-white leading-tight uppercase font-heading">
          Muso's Apparel
        </h2>
        <h3 className="text-xs sm:text-sm md:text-base font-black tracking-tight text-neutral-800 dark:text-neutral-300 uppercase font-heading">
          & Custom Merch
        </h3>
        <p className="text-xs sm:text-sm md:text-base font-extrabold text-[#cc2229] dark:text-[#f87171] tracking-wider font-mono pt-0.5">
          {phone}
        </p>
      </div>
    </div>
  );
};
