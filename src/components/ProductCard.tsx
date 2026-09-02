import React, { useState } from 'react';
import { Send, Eye, MessageSquare, Plus, Minus, Sparkles, Ruler } from 'lucide-react';
import { Product, ColorOption, ApparelSize } from '../types';
import { ProductVisual } from './ProductVisual';
import { formatKSh } from '../utils/whatsapp';

interface ProductCardProps {
  product: Product;
  onOpenDetails: (product: Product) => void;
  onDirectOrder: (product: Product, color: ColorOption, size: ApparelSize, qty: number) => void;
  onOpenSizeGuide: (category: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onOpenDetails,
  onDirectOrder,
  onOpenSizeGuide,
}) => {
  const [selectedColor, setSelectedColor] = useState<ColorOption>(product.colors[0] || { name: 'Black', hex: '#171717' });
  const [selectedSize, setSelectedSize] = useState<ApparelSize>(product.sizes[0] || 'L');
  const [quantity, setQuantity] = useState<number>(1);

  const handleSendToWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDirectOrder(product, selectedColor, selectedSize, quantity);
  };

  const hasUploadedPhoto = !!product.uploadedImageUrl;

  return (
    <div
      id={`product-card-${product.id}`}
      className="group relative flex flex-col justify-between bg-white dark:bg-[#1a202c] rounded-3xl border border-[#e2dcce] dark:border-[#2d3748] shadow-xs hover:shadow-lg transition-all duration-300 overflow-hidden"
    >
      {/* Top Media & Badges */}
      <div className="relative p-4 pb-0 cursor-pointer" onClick={() => onOpenDetails(product)}>
        {/* Badges */}
        <div className="absolute top-6 left-6 z-10 flex flex-col gap-1.5 pointer-events-none">
          {product.popularBadge && (
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-900 bg-amber-200/90 dark:bg-amber-400 dark:text-neutral-900 backdrop-blur-xs px-2.5 py-0.5 rounded-md shadow-xs">
              {product.popularBadge}
            </span>
          )}
          {product.customizable && (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-neutral-800 dark:text-neutral-200 bg-[#EAE5DB] dark:bg-[#262e3b] border border-[#d8d0c3] dark:border-[#374151] backdrop-blur-xs px-2 py-0.5 rounded-md shadow-xs">
              <Sparkles className="w-2.5 h-2.5 text-amber-600 dark:text-amber-400" />
              Custom Print Ready
            </span>
          )}
        </div>

        {/* Quick View Button on Hover */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onOpenDetails(product);
          }}
          className="absolute top-6 right-6 z-10 w-8 h-8 rounded-full bg-white/90 dark:bg-[#12161c]/90 shadow-sm flex items-center justify-center text-neutral-700 dark:text-neutral-200 hover:bg-neutral-900 hover:text-white dark:hover:bg-white dark:hover:text-neutral-900 transition-all opacity-0 group-hover:opacity-100"
          title="Quick preview"
        >
          <Eye className="w-4 h-4" />
        </button>

        {/* Visual: Uploaded Real Photo OR Dynamic Mockup */}
        {hasUploadedPhoto ? (
          <div className="relative flex items-center justify-center overflow-hidden rounded-2xl bg-neutral-100 dark:bg-[#12161c] border border-[#d8d0c3] dark:border-[#2d3748] aspect-[4/3] group-hover:scale-[1.02] transition-transform duration-300">
            <img
              src={product.uploadedImageUrl}
              alt={product.name}
              className="w-full h-full object-cover object-center"
              referrerPolicy="no-referrer"
            />
            <div className="absolute bottom-2 left-2 bg-neutral-900/80 backdrop-blur-xs text-white text-[9px] font-black px-2 py-0.5 rounded-md">
              Real Photo
            </div>
          </div>
        ) : (
          <ProductVisual
            category={product.category}
            imageType={product.image}
            color={selectedColor}
            size="md"
            className="group-hover:scale-[1.02] transition-transform duration-300"
          />
        )}
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        {/* Title & Price */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              {product.category.replace('-', ' ')}
            </span>
            <span className="text-base font-black text-neutral-900 dark:text-white font-mono">
              {formatKSh(product.price)}
            </span>
          </div>

          <h3
            onClick={() => onOpenDetails(product)}
            className="text-sm font-bold text-neutral-900 dark:text-white hover:text-neutral-700 dark:hover:text-neutral-300 cursor-pointer transition-colors leading-snug line-clamp-1 font-heading"
          >
            {product.name}
          </h3>

          <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-1">{product.subtitle}</p>
        </div>

        {/* Color Swatches Selector */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-neutral-600 dark:text-neutral-400 font-semibold">1. Choose Colour:</span>
            <span className="font-bold text-neutral-900 dark:text-white bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded-md text-[10px]">
              {selectedColor.name}
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5 items-center">
            {product.colors.slice(0, 8).map((col) => {
              const isSelected = selectedColor.name === col.name;
              return (
                <button
                  key={col.name}
                  type="button"
                  onClick={() => setSelectedColor(col)}
                  title={col.name}
                  className={`relative w-6 h-6 rounded-full border transition-all ${
                    isSelected
                      ? 'border-neutral-900 dark:border-white ring-2 ring-neutral-900 dark:ring-white scale-110 z-1 shadow-xs'
                      : 'border-neutral-300 dark:border-neutral-600 hover:scale-105'
                  }`}
                  style={{ backgroundColor: col.hex }}
                />
              );
            })}
            {product.colors.length > 8 && (
              <button
                type="button"
                onClick={() => onOpenDetails(product)}
                className="text-[10px] text-neutral-500 dark:text-neutral-400 font-bold hover:text-neutral-900 dark:hover:text-white px-1"
              >
                +{product.colors.length - 8} more
              </button>
            )}
          </div>
        </div>

        {/* Size Selector */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-neutral-600 dark:text-neutral-400 font-semibold">2. Choose Size:</span>
            <button
              type="button"
              onClick={() => onOpenSizeGuide(product.category)}
              className="text-neutral-700 dark:text-neutral-300 hover:underline font-bold flex items-center gap-0.5 text-[10px]"
            >
              <Ruler className="w-2.5 h-2.5" />
              Size Guide
            </button>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {product.sizes.map((sz) => (
              <button
                key={sz}
                type="button"
                onClick={() => setSelectedSize(sz)}
                className={`min-w-[32px] px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  selectedSize === sz
                    ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-xs scale-105'
                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                }`}
              >
                {sz}
              </button>
            ))}
          </div>
        </div>

        {/* Quantity & Direct WhatsApp Action */}
        <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">Quantity:</span>
            <div className="flex items-center border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-[#12161c] p-0.5">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-6 h-6 flex items-center justify-center text-neutral-600 dark:text-neutral-300 hover:bg-white dark:hover:bg-neutral-800 rounded font-bold text-xs"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="w-6 text-center font-bold text-xs text-neutral-900 dark:text-white">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="w-6 h-6 flex items-center justify-center text-neutral-600 dark:text-neutral-300 hover:bg-white dark:hover:bg-neutral-800 rounded font-bold text-xs"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Primary Send Details to WhatsApp Button */}
          <button
            id={`whatsapp-order-${product.id}`}
            type="button"
            onClick={handleSendToWhatsApp}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-900 text-xs sm:text-sm font-black shadow-xs active:scale-[0.99] transition-all"
          >
            <Send className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
            <span>Send Details to WhatsApp</span>
          </button>
        </div>
      </div>
    </div>
  );
};

