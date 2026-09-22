import React, { useState, useEffect } from 'react';
import { Send, Eye, MessageSquare, Plus, Minus, Sparkles, Ruler, Tag, ChevronDown } from 'lucide-react';
import { Product, ColorOption, ApparelSize, PoloFilterState, PoloDesignOption } from '../types';
import { POLO_DESIGNS } from '../data/products';
import { ProductVisual } from './ProductVisual';
import { formatKSh } from '../utils/whatsapp';

interface ProductCardProps {
  product: Product;
  onOpenDetails: (product: Product, designId?: string) => void;
  onDirectOrder: (product: Product, color: ColorOption, size: ApparelSize, qty: number, designName?: string) => void;
  onOpenSizeGuide: (category: string) => void;
  onFilterTagClick?: (group: any, value: string) => void;
  activePoloFilters?: PoloFilterState;
  selectedPoloDesignId?: string;
  onSelectPoloDesign?: (designId: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onOpenDetails,
  onDirectOrder,
  onOpenSizeGuide,
  onFilterTagClick,
  activePoloFilters,
  selectedPoloDesignId,
  onSelectPoloDesign,
}) => {
  const isPolo = product.category === 'polo-shirts';
  const poloDesignList: PoloDesignOption[] = React.useMemo(() => {
    if (product.poloDesigns && product.poloDesigns.length > 0) {
      return product.poloDesigns;
    }
    return POLO_DESIGNS;
  }, [product.poloDesigns]);

  const [internalDesignId, setInternalDesignId] = useState<string>(() => {
    return selectedPoloDesignId || poloDesignList[0]?.id || 'classic-solid-pique';
  });

  // Keep in sync if parent selectedPoloDesignId changes
  useEffect(() => {
    if (selectedPoloDesignId) {
      setInternalDesignId(selectedPoloDesignId);
    }
  }, [selectedPoloDesignId]);

  const currentDesign = React.useMemo(() => {
    const found = poloDesignList.find(d => d.id === internalDesignId);
    return found || poloDesignList[0];
  }, [poloDesignList, internalDesignId]);

  const handleDesignChange = (newDesignId: string) => {
    setInternalDesignId(newDesignId);
    if (onSelectPoloDesign) {
      onSelectPoloDesign(newDesignId);
    }
  };

  const validColors = React.useMemo(() => {
    if (!product.colors || !Array.isArray(product.colors)) return [{ name: 'Jet Black', hex: '#171717' }];
    const filtered = product.colors.filter((c): c is ColorOption => Boolean(c && typeof c === 'object' && c.name && c.hex));
    return filtered.length > 0 ? filtered : [{ name: 'Jet Black', hex: '#171717' }];
  }, [product.colors]);

  const [selectedColor, setSelectedColor] = useState<ColorOption>(validColors[0]);
  const [selectedSize, setSelectedSize] = useState<ApparelSize>(product.sizes?.[0] || 'L');
  const [quantity, setQuantity] = useState<number>(1);
  const [imageError, setImageError] = useState(false);
  const imgRef = React.useRef<HTMLImageElement | null>(null);

  React.useEffect(() => {
    if (validColors.length > 0) {
      setSelectedColor((curr) => {
        if (!curr || !curr.name) return validColors[0];
        const match = validColors.find((c) => c.name === curr.name);
        return match || validColors[0];
      });
    }
  }, [validColors]);

  const handleSendToWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation();
    const designSummary = isPolo && currentDesign
      ? `${currentDesign.name} (${currentDesign.sleeveLength}, ${currentDesign.fit}, ${currentDesign.fabricWeight})`
      : undefined;
    onDirectOrder(product, selectedColor || validColors[0], selectedSize, quantity, designSummary);
  };

  const designPhoto = isPolo && currentDesign ? (currentDesign.uploadedImageUrl || currentDesign.image) : undefined;
  const photoSrc = designPhoto || product.uploadedImageUrl || (product.image && (product.image.startsWith('data:image/') || product.image.startsWith('http://') || product.image.startsWith('https://') || product.image.startsWith('/')) ? product.image : undefined);
  const hasUploadedPhoto = Boolean(!imageError && photoSrc && photoSrc.trim().length > 0);

  useEffect(() => {
    setImageError(false);
    if (imgRef.current && imgRef.current.complete) {
      if (imgRef.current.naturalWidth === 0) {
        setImageError(true);
      }
    }
  }, [photoSrc]);

  return (
    <div
      id={`product-card-${product.id}`}
      className="group relative flex flex-col justify-between bg-white dark:bg-[#1a202c] rounded-3xl border border-[#e2dcce] dark:border-[#2d3748] shadow-xs hover:shadow-lg transition-all duration-300 overflow-hidden"
    >
      {/* Top Media & Badges */}
      <div className="relative p-4 pb-0 cursor-pointer" onClick={() => onOpenDetails(product, isPolo ? currentDesign.id : undefined)}>
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
            onOpenDetails(product, isPolo ? currentDesign.id : undefined);
          }}
          className="absolute top-6 right-6 z-10 w-8 h-8 rounded-full bg-white/90 dark:bg-[#12161c]/90 shadow-sm flex items-center justify-center text-neutral-700 dark:text-neutral-200 hover:bg-neutral-900 hover:text-white dark:hover:bg-white dark:hover:text-neutral-900 transition-all opacity-0 group-hover:opacity-100"
          title="Quick preview"
        >
          <Eye className="w-4 h-4" />
        </button>

        {/* Visual: Uploaded Real Photo OR Dynamic Mockup */}
        {hasUploadedPhoto && photoSrc ? (
          <div className="relative flex items-center justify-center overflow-hidden rounded-2xl bg-neutral-100 dark:bg-[#12161c] border border-[#d8d0c3] dark:border-[#2d3748] aspect-[4/3] group-hover:scale-[1.02] transition-transform duration-300">
            <img
              ref={imgRef}
              src={photoSrc}
              alt={product.name}
              decoding="async"
              loading="eager"
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
              referrerPolicy="no-referrer"
              onLoad={(e) => {
                const target = e.currentTarget as HTMLImageElement;
                if (target.naturalWidth === 0) {
                  setImageError(true);
                }
              }}
              onError={() => {
                setImageError(true);
              }}
            />
            <div className="absolute bottom-2 left-2 bg-neutral-900/80 backdrop-blur-xs text-white text-[9px] font-black px-2 py-0.5 rounded-md z-2">
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
            onClick={() => onOpenDetails(product, isPolo ? currentDesign.id : undefined)}
            className="text-sm font-bold text-neutral-900 dark:text-white hover:text-neutral-700 dark:hover:text-neutral-300 cursor-pointer transition-colors leading-snug line-clamp-1 font-heading"
          >
            {product.name}
          </h3>

          <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-1">
            {isPolo ? currentDesign.subtitle : product.subtitle}
          </p>

          {/* Polo Design Dropdown Selector */}
          {isPolo && (
            <div className="mt-2.5 p-3 rounded-xl bg-[#F6F3EC] dark:bg-[#1e2531] border border-[#e2dacf] dark:border-[#2d3748] space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <label htmlFor={`polo-design-select-${product.id}`} className="font-extrabold text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  <span>Choose Polo Design / Style:</span>
                </label>
                <span className="text-[10px] font-bold text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/40 px-2 py-0.5 rounded-md">
                  Same KSh 1,000
                </span>
              </div>

              <div className="relative">
                <select
                  id={`polo-design-select-${product.id}`}
                  value={currentDesign.id}
                  onChange={(e) => handleDesignChange(e.target.value)}
                  className="w-full appearance-none bg-white dark:bg-[#131822] text-neutral-900 dark:text-neutral-100 text-xs font-bold px-3 py-2 pr-8 rounded-lg border border-[#d5ccbf] dark:border-[#374151] focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white cursor-pointer shadow-2xs"
                >
                  {poloDesignList.map((design) => (
                    <option key={design.id} value={design.id}>
                      {design.name} — {design.sleeveLength} • {design.fit}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 pointer-events-none" />
              </div>

              {/* Dynamic specs of the selected design */}
              <div className="flex flex-wrap gap-1 pt-1" aria-label="Selected polo design attributes">
                {[
                  { group: 'stylePattern' as const, val: currentDesign.stylePattern },
                  { group: 'sleeveLength' as const, val: currentDesign.sleeveLength },
                  { group: 'fit' as const, val: currentDesign.fit },
                  { group: 'fabricWeight' as const, val: currentDesign.fabricWeight },
                  { group: 'fabricType' as const, val: currentDesign.fabricType },
                  { group: 'closureType' as const, val: currentDesign.closureType },
                ]
                  .filter((item): item is { group: any; val: string } => Boolean(item.val))
                  .slice(0, 4)
                  .map((item) => {
                    const isActive = activePoloFilters?.[item.group as keyof PoloFilterState]?.includes(item.val as any);
                    return (
                      <button
                        key={item.group}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onFilterTagClick) {
                            onFilterTagClick(item.group, item.val);
                          }
                        }}
                        className={`text-[10px] px-2 py-0.5 rounded-md font-bold transition-all ${
                          isActive
                            ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 ring-1 ring-neutral-900 shadow-2xs'
                            : 'bg-white dark:bg-[#131822] text-neutral-700 dark:text-neutral-300 border border-[#ded5c7] dark:border-[#2d3748] hover:bg-neutral-100 dark:hover:bg-neutral-700'
                        }`}
                        title={`Filter by ${item.val}`}
                      >
                        {item.val}
                      </button>
                    );
                  })}
              </div>
            </div>
          )}
        </div>

        {/* Color Swatches Selector */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-neutral-600 dark:text-neutral-400 font-semibold">1. Choose Colour:</span>
            <span className="font-bold text-neutral-900 dark:text-white bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded-md text-[10px]">
              {selectedColor?.name || validColors[0]?.name || 'Standard'}
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5 items-center">
            {validColors.slice(0, 8).map((col) => {
              const isSelected = (selectedColor?.name || validColors[0]?.name) === col.name;
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
            {validColors.length > 8 && (
              <button
                type="button"
                onClick={() => onOpenDetails(product)}
                className="text-[10px] text-neutral-500 dark:text-neutral-400 font-bold hover:text-neutral-900 dark:hover:text-white px-1"
              >
                +{validColors.length - 8} more
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

