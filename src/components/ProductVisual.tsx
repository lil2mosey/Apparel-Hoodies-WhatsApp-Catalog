import React, { useState, useEffect } from 'react';
import { ColorOption } from '../types';
import { renderGarmentGraphic, getProductImageUrl } from '../assets/images';

interface ProductVisualProps {
  category?: string;
  imageType: string;
  color: ColorOption;
  customText?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const ProductVisual: React.FC<ProductVisualProps> = ({
  category = 'hoodies',
  imageType,
  color,
  customText,
  className = '',
  size = 'md',
}) => {
  const hex = color?.hex || '#171717';
  // Check if imageType is already a full image URL or base64 data string
  const isDirectImageUrl = imageType && (imageType.startsWith('data:image/') || imageType.startsWith('http://') || imageType.startsWith('https://') || imageType.startsWith('/'));
  const [customPhotoUrl, setCustomPhotoUrl] = useState<string | null>(() => isDirectImageUrl ? imageType : getProductImageUrl(imageType));

  useEffect(() => {
    if (isDirectImageUrl) {
      setCustomPhotoUrl(imageType);
      return;
    }

    setCustomPhotoUrl(getProductImageUrl(imageType));

    const handleUpdate = () => {
      setCustomPhotoUrl(getProductImageUrl(imageType));
    };

    window.addEventListener('muso_images_updated', handleUpdate);
    return () => {
      window.removeEventListener('muso_images_updated', handleUpdate);
    };
  }, [imageType, isDirectImageUrl]);

  // Determine size classes
  const sizeMap = {
    sm: 'w-24 h-24',
    md: 'w-full aspect-[4/3] max-h-56',
    lg: 'w-full aspect-square max-h-80',
    xl: 'w-full aspect-[4/3] max-h-96',
  };

  const containerClass = sizeMap[size] || sizeMap.md;

  return (
    <div
      id={`visual-container-${imageType}`}
      className={`relative flex items-center justify-center overflow-hidden rounded-xl bg-[#EAE5DB] border border-[#d8d0c3] p-4 transition-all duration-300 ${containerClass} ${className}`}
    >
      {/* Background ambient radial glow matched to garment color */}
      <div
        className="absolute inset-0 opacity-25 blur-xl transition-colors duration-500 pointer-events-none"
        style={{ backgroundColor: hex }}
      />

      {/* If a custom photo URL is supplied, render image tag */}
      {customPhotoUrl ? (
        <img
          src={customPhotoUrl}
          alt={`${imageType} preview`}
          className="w-full h-full object-contain drop-shadow-md z-10"
          referrerPolicy="no-referrer"
        />
      ) : (
        /* Render centralized garment SVG graphic from /src/assets/images/ */
        <div className="w-full h-full flex items-center justify-center z-10 transition-transform duration-300">
          {renderGarmentGraphic(imageType, color, customText)}
        </div>
      )}
    </div>
  );
};
