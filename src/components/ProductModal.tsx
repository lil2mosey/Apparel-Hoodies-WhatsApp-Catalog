import React, { useState } from 'react';
import { X, Send, Ruler, Sparkles, Check, CheckCircle2, MessageSquare, Shirt, Maximize2, Minimize2, ZoomIn } from 'lucide-react';
import { Product, ColorOption, ApparelSize, StoreContact } from '../types';
import { ProductVisual } from './ProductVisual';
import { formatKSh } from '../utils/whatsapp';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onDirectOrder: (product: Product, color: ColorOption, size: ApparelSize, qty: number, customText?: string) => void;
  onOpenSizeGuide: (category: string) => void;
  storeContact: StoreContact;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  onClose,
  product,
  onDirectOrder,
  onOpenSizeGuide,
  storeContact,
}) => {
  if (!isOpen || !product) return null;

  const [selectedColor, setSelectedColor] = useState<ColorOption>(product.colors[0] || { name: 'Black', hex: '#171717' });
  const [selectedSize, setSelectedSize] = useState<ApparelSize>(product.sizes[0] || 'L');
  const [quantity, setQuantity] = useState<number>(1);
  const [customText, setCustomText] = useState<string>('');
  const [customType, setCustomType] = useState<'print' | 'embroidery'>('print');
  const [enableCustomization, setEnableCustomization] = useState(false);
  const [imageFitMode, setImageFitMode] = useState<'cover' | 'contain'>('cover');
  const [isZoomed, setIsZoomed] = useState(false);

  const totalPrice = product.price * quantity;
  const hasUploadedPhoto = !!product.uploadedImageUrl;

  const handleInstantWhatsApp = () => {
    onDirectOrder(
      product,
      selectedColor,
      selectedSize,
      quantity,
      enableCustomization && customText.trim() ? customText.trim() : undefined
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        id="product-detail-modal"
        className="relative w-full max-w-4xl bg-white dark:bg-[#1a202c] rounded-3xl shadow-2xl border border-[#dfd7c9] dark:border-[#2d3748] overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#e5dfd3] dark:border-[#2d3748] bg-[#F9F8F3] dark:bg-[#12161c]">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-wider text-neutral-800 dark:text-neutral-200 bg-[#EAE5DB] dark:bg-[#262e3b] border border-[#d8d0c3] dark:border-[#374151] px-2.5 py-1 rounded-md">
              {product.category.replace('-', ' ')}
            </span>
            {product.popularBadge && (
              <span className="text-xs font-bold text-amber-900 bg-amber-200 dark:bg-amber-400 dark:text-neutral-900 px-2.5 py-1 rounded-md">
                {product.popularBadge}
              </span>
            )}
          </div>
          <button
            id="close-product-modal-btn"
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-200/60 dark:hover:bg-neutral-800 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left: Product Media (Uploaded Photo or Mockup) */}
            <div className="lg:col-span-6 flex flex-col items-center space-y-4">
              <div className="w-full flex items-center justify-center">
                {hasUploadedPhoto ? (
                  <div className="w-full aspect-[4/5] max-h-[480px] rounded-2xl bg-neutral-950/5 dark:bg-neutral-950/40 border border-[#d8d0c3] dark:border-[#2d3748] overflow-hidden flex items-center justify-center relative shadow-sm group">
                    <img
                      src={product.uploadedImageUrl}
                      alt={product.name}
                      className={`w-full h-full transition-all duration-300 ${
                        imageFitMode === 'cover'
                          ? 'object-cover object-center group-hover:scale-105'
                          : 'object-contain p-2'
                      }`}
                      referrerPolicy="no-referrer"
                    />

                    {/* View Controls: Fit / Fill Toggle */}
                    <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-neutral-900/80 backdrop-blur-md rounded-xl p-1 text-white shadow-lg border border-white/10">
                      <button
                        type="button"
                        onClick={() => setImageFitMode(imageFitMode === 'cover' ? 'contain' : 'cover')}
                        className="px-2.5 py-1 text-[11px] font-bold rounded-lg hover:bg-white/20 transition-colors flex items-center gap-1"
                        title={imageFitMode === 'cover' ? 'Switch to uncropped full view' : 'Switch to edge-to-edge fill'}
                      >
                        {imageFitMode === 'cover' ? (
                          <>
                            <Minimize2 className="w-3 h-3" />
                            <span>Uncrop</span>
                          </>
                        ) : (
                          <>
                            <Maximize2 className="w-3 h-3" />
                            <span>Fill Frame</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Quick indicator */}
                    <div className="absolute bottom-3 left-3 bg-neutral-900/75 backdrop-blur-md text-white text-[10px] font-extrabold px-2.5 py-1 rounded-lg border border-white/10 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span>Original Garment Photo</span>
                    </div>
                  </div>
                ) : (
                  <ProductVisual
                    category={product.category}
                    imageType={product.image}
                    color={selectedColor}
                    customText={enableCustomization ? customText : ''}
                    size="xl"
                  />
                )}
              </div>

              {/* Color thumbnails selector */}
              <div className="w-full space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
                    1. Choose Colour ({product.colors.length}):
                  </span>
                  <span className="text-xs font-bold text-neutral-900 dark:text-white bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded-md">
                    {selectedColor.name}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((col) => {
                    const isSelected = selectedColor.name === col.name;
                    return (
                      <button
                        key={col.name}
                        type="button"
                        onClick={() => setSelectedColor(col)}
                        title={col.name}
                        className={`group relative flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all ${
                          isSelected
                            ? 'border-neutral-900 dark:border-white ring-2 ring-neutral-900/30 dark:ring-white/30 scale-110'
                            : 'border-white dark:border-neutral-700 shadow-xs hover:scale-105'
                        }`}
                        style={{ backgroundColor: col.hex }}
                      >
                        {isSelected && (
                          <Check
                            className={`w-4 h-4 ${
                              ['#ffffff', '#fff', '#d4c5b9', '#38bdf8', '#c084fc', '#eab308', '#94a3b8'].includes(
                                col.hex.toLowerCase()
                              )
                                ? 'text-neutral-900'
                                : 'text-white'
                            }`}
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Fabric Specs Badge */}
              <div className="w-full p-3.5 bg-[#F9F8F3] dark:bg-[#12161c] rounded-2xl border border-[#e5dfd3] dark:border-[#2d3748] text-xs text-neutral-600 dark:text-neutral-300 space-y-1">
                <p><strong>Fabric:</strong> {product.fabric}</p>
                <p><strong>Fit:</strong> {product.fit}</p>
              </div>
            </div>

            {/* Right: Product Details & Selectors */}
            <div className="lg:col-span-6 space-y-5">
              <div>
                <h1 className="text-2xl font-black text-neutral-900 dark:text-white leading-tight font-heading">
                  {product.name}
                </h1>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">{product.subtitle}</p>
                <div className="flex items-baseline gap-3 mt-3">
                  <span className="text-3xl font-black text-neutral-900 dark:text-white font-mono">
                    {formatKSh(product.price)}
                  </span>
                  <span className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">per item</span>
                </div>
              </div>

              <div className="border-t border-neutral-100 dark:border-neutral-800 pt-4">
                <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">{product.description}</p>
              </div>

              {/* Features List */}
              <div className="space-y-1.5">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300">Features:</span>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-neutral-600 dark:text-neutral-400">
                  {product.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-neutral-800 dark:text-neutral-200 shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Size Selection */}
              <div className="space-y-2 border-t border-neutral-100 dark:border-neutral-800 pt-4">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
                    2. Choose Size: <span className="text-neutral-900 dark:text-white font-black">{selectedSize}</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => onOpenSizeGuide(product.category)}
                    className="text-xs font-bold text-neutral-700 dark:text-neutral-300 hover:underline flex items-center gap-1"
                  >
                    <Ruler className="w-3.5 h-3.5" />
                    Size Guide
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => setSelectedSize(sz)}
                      className={`min-w-[48px] px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
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

              {/* Custom Personalization Toggle */}
              {product.customizable && (
                <div className="p-4 bg-[#F9F8F3] dark:bg-[#12161c] rounded-2xl border border-[#e5dfd3] dark:border-[#2d3748] space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-white flex items-center gap-1.5 cursor-pointer">
                      <Sparkles className="w-4 h-4 text-amber-600" />
                      Custom Name / Logo Print (Optional)
                    </label>
                    <input
                      type="checkbox"
                      id="customization-checkbox"
                      checked={enableCustomization}
                      onChange={(e) => setEnableCustomization(e.target.checked)}
                      className="w-4 h-4 accent-neutral-900 cursor-pointer rounded"
                    />
                  </div>

                  {enableCustomization && (
                    <div className="space-y-2.5 pt-1 animate-in fade-in">
                      <input
                        type="text"
                        value={customText}
                        onChange={(e) => setCustomText(e.target.value)}
                        placeholder="e.g. Muso, Brand Name, Initials..."
                        className="w-full px-3 py-2 rounded-xl border border-[#d8d0c3] dark:border-[#374151] text-xs font-bold text-neutral-900 dark:text-white bg-white dark:bg-[#1a202c] transition-all outline-hidden"
                      />
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setCustomType('print')}
                          className={`px-3 py-1.5 rounded-lg text-[11px] font-bold ${
                            customType === 'print' ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900' : 'bg-white dark:bg-[#1a202c] text-neutral-700 dark:text-neutral-300 border border-[#d8d0c3] dark:border-[#2d3748]'
                          }`}
                        >
                          Screen / Vinyl Print
                        </button>
                        <button
                          type="button"
                          onClick={() => setCustomType('embroidery')}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold ${
                            customType === 'embroidery' ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900' : 'bg-white dark:bg-[#1a202c] text-neutral-700 dark:text-neutral-300 border border-[#d8d0c3] dark:border-[#2d3748]'
                          }`}
                        >
                          Embroidery
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Quantity Stepper */}
              <div className="flex items-center justify-between border-t border-neutral-100 dark:border-neutral-800 pt-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 block mb-1">Quantity:</span>
                  <div className="flex items-center border border-neutral-200 dark:border-neutral-700 rounded-xl bg-neutral-50 dark:bg-[#12161c] p-1">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="w-8 h-8 flex items-center justify-center text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-800 rounded-lg font-bold text-base transition-colors"
                    >
                      -
                    </button>
                    <span className="w-10 text-center font-black text-neutral-900 dark:text-white text-sm">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => q + 1)}
                      className="w-8 h-8 flex items-center justify-center text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-800 rounded-lg font-bold text-base transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs text-neutral-500 dark:text-neutral-400 font-medium block">Total Estimate:</span>
                  <span className="text-2xl font-black text-neutral-900 dark:text-white font-mono">{formatKSh(totalPrice)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer with Direct WhatsApp Action */}
        <div className="px-6 py-4 border-t border-[#e5dfd3] dark:border-[#2d3748] bg-[#F9F8F3] dark:bg-[#12161c] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-neutral-700 dark:text-neutral-300 text-center sm:text-left flex items-center gap-1.5 font-medium">
            <MessageSquare className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>Chat directly with <strong>{storeContact.name}</strong> ({storeContact.phone}) to confirm delivery.</span>
          </div>

          <button
            id="direct-whatsapp-modal-btn"
            type="button"
            onClick={handleInstantWhatsApp}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-900 text-sm font-black shadow-xs transition-all active:scale-98"
          >
            <Send className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
            <span>Send Details to WhatsApp</span>
          </button>
        </div>
      </div>
    </div>
  );
};
