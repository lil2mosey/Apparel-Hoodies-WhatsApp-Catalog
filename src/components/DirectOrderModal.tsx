import React, { useState } from 'react';
import { X, MessageSquare, Send, Check, Sparkles, Copy, ArrowRight, ShieldCheck } from 'lucide-react';
import { Product, ColorOption, ApparelSize, StoreContact } from '../types';
import { ProductVisual } from './ProductVisual';
import { generateSingleItemWhatsAppMessage, createWhatsAppUrl, formatKSh } from '../utils/whatsapp';

interface DirectOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  initialColor?: ColorOption;
  initialSize?: ApparelSize;
  initialQuantity?: number;
  storeContact: StoreContact;
}

export const DirectOrderModal: React.FC<DirectOrderModalProps> = ({
  isOpen,
  onClose,
  product,
  initialColor,
  initialSize,
  initialQuantity = 1,
  storeContact,
}) => {
  if (!isOpen || !product) return null;

  const [selectedColor, setSelectedColor] = useState<ColorOption>(
    initialColor || product.colors[0] || { name: 'Black', hex: '#171717' }
  );
  const [selectedSize, setSelectedSize] = useState<ApparelSize>(
    initialSize || product.sizes[0] || 'L'
  );
  const [quantity, setQuantity] = useState<number>(initialQuantity);
  const [customText, setCustomText] = useState<string>('');
  const [customerName, setCustomerName] = useState<string>('');
  const [customerLocation, setCustomerLocation] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [imageError, setImageError] = useState(false);

  const itemTotal = product.price * quantity;
  const photoSrc = product.uploadedImageUrl || (product.image && (product.image.startsWith('data:image/') || product.image.startsWith('http://') || product.image.startsWith('https://') || product.image.startsWith('/')) ? product.image : undefined);
  const hasUploadedPhoto = Boolean(!imageError && photoSrc && photoSrc.trim().length > 0);

  const messageText = generateSingleItemWhatsAppMessage(
    product,
    selectedColor,
    selectedSize,
    quantity,
    customText,
    customerName,
    customerLocation,
    storeContact
  );

  const handleOpenWhatsApp = () => {
    const url = createWhatsAppUrl(storeContact.phone, messageText);
    window.open(url, '_blank', 'noopener,noreferrer');
    onClose();
  };

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(messageText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        id="direct-order-modal"
        className="relative w-full max-w-2xl bg-white dark:bg-[#1a202c] rounded-3xl shadow-2xl border border-[#dfd7c9] dark:border-[#2d3748] overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#e5dfd3] dark:border-[#2d3748] bg-[#F9F8F3] dark:bg-[#12161c]">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 shadow-xs">
              <MessageSquare className="w-5 h-5 text-emerald-400 dark:text-emerald-600" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-neutral-900 dark:text-white font-heading">Direct WhatsApp Order</h2>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 font-medium">Send item details straight to {storeContact.name} ({storeContact.phone})</p>
            </div>
          </div>
          <button
            id="close-direct-order-btn"
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-200/60 dark:hover:bg-neutral-800 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Top Product Summary & Visual */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center bg-[#F9F8F3] dark:bg-[#12161c] p-4 rounded-2xl border border-[#dfd7c9] dark:border-[#2d3748]">
            <div className="sm:col-span-5 flex items-center justify-center">
              {hasUploadedPhoto && photoSrc ? (
                <div className="w-full aspect-[4/3] rounded-xl bg-neutral-100 dark:bg-[#1a202c] border border-[#d8d0c3] dark:border-[#2d3748] overflow-hidden flex items-center justify-center">
                  <img
                    src={photoSrc}
                    alt={product.name}
                    loading="eager"
                    decoding="async"
                    className="w-full h-full object-cover object-center"
                    referrerPolicy="no-referrer"
                    onError={() => setImageError(true)}
                  />
                </div>
              ) : (
                <ProductVisual
                  category={product.category}
                  imageType={product.image}
                  color={selectedColor}
                  customText={customText}
                  size="md"
                />
              )}
            </div>
            <div className="sm:col-span-7 space-y-2">
              <span className="inline-block text-[11px] font-black uppercase tracking-wider text-neutral-800 dark:text-neutral-200 bg-[#EAE5DB] dark:bg-[#262e3b] border border-[#d8d0c3] dark:border-[#374151] px-2.5 py-0.5 rounded-md">
                {product.category.replace('-', ' ')}
              </span>
              <h3 className="text-base font-black text-neutral-900 dark:text-white leading-snug font-heading">{product.name}</h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-2">{product.subtitle}</p>
              <div className="flex items-baseline gap-2 pt-1">
                <span className="text-xl font-black text-neutral-900 dark:text-white font-mono">{formatKSh(itemTotal)}</span>
                <span className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">({formatKSh(product.price)} each × {quantity})</span>
              </div>
            </div>
          </div>

          {/* Color Selection */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
                1. Select Color: <span className="text-neutral-900 dark:text-white font-bold">{selectedColor.name}</span>
              </label>
            </div>
            <div className="flex flex-wrap gap-2">
              {product.colors.map((col) => {
                const isSelected = selectedColor.name === col.name;
                return (
                  <button
                    key={col.name}
                    type="button"
                    onClick={() => setSelectedColor(col)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                      isSelected
                        ? 'border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-white dark:text-neutral-900 shadow-xs'
                        : 'border-[#d8d0c3] dark:border-[#374151] bg-white dark:bg-[#1a202c] text-neutral-700 dark:text-neutral-300 hover:border-neutral-400'
                    }`}
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-black/20 shrink-0"
                      style={{ backgroundColor: col.hex }}
                    />
                    {col.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Size & Quantity Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Size */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-2">
                2. Select Size: <span className="text-neutral-900 dark:text-white font-bold">{selectedSize}</span>
              </label>
              <div className="flex flex-wrap gap-1.5">
                {product.sizes.map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => setSelectedSize(sz)}
                    className={`min-w-[42px] px-3 py-2 rounded-xl border text-xs font-bold transition-all ${
                      selectedSize === sz
                        ? 'border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-white dark:text-neutral-900 shadow-xs'
                        : 'border-[#d8d0c3] dark:border-[#374151] bg-white dark:bg-[#1a202c] text-neutral-700 dark:text-neutral-300 hover:border-neutral-400'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-2">
                3. Quantity:
              </label>
              <div className="flex items-center gap-3">
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
                <span className="text-xs text-neutral-500 dark:text-neutral-400 font-bold">pcs</span>
              </div>
            </div>
          </div>

          {/* Optional Custom Print / Name Branding */}
          {product.customizable && (
            <div className="p-3.5 bg-[#F9F8F3] dark:bg-[#12161c] rounded-2xl border border-[#dfd7c9] dark:border-[#2d3748] space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-neutral-800 dark:text-neutral-200 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  Custom Name or Text (Optional)
                </label>
                <span className="text-[11px] text-neutral-500 dark:text-neutral-400">e.g. "Muso", Company Name</span>
              </div>
              <input
                type="text"
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                placeholder="Type name / text to print or embroider on item..."
                className="w-full px-3 py-2 rounded-xl border border-[#d8d0c3] dark:border-[#374151] text-xs font-bold text-neutral-900 dark:text-white transition-all outline-hidden bg-white dark:bg-[#1a202c]"
              />
            </div>
          )}

          {/* Customer Name & Location (Optional quick details) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                Your Name (Optional)
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="e.g. John Doe"
                className="w-full px-3 py-2 rounded-xl border border-[#d8d0c3] dark:border-[#374151] text-xs font-bold text-neutral-900 dark:text-white transition-all outline-hidden bg-white dark:bg-[#1a202c]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                Delivery Town / Area (Optional)
              </label>
              <input
                type="text"
                value={customerLocation}
                onChange={(e) => setCustomerLocation(e.target.value)}
                placeholder="e.g. Nairobi CBD / Westlands / Nakuru"
                className="w-full px-3 py-2 rounded-xl border border-[#d8d0c3] dark:border-[#374151] text-xs font-bold text-neutral-900 dark:text-white transition-all outline-hidden bg-white dark:bg-[#1a202c]"
              />
            </div>
          </div>

          {/* WhatsApp Message Live Preview Box */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-neutral-700 dark:text-neutral-300" />
                Message Preview for WhatsApp ({storeContact.phone}):
              </span>
              <button
                type="button"
                onClick={handleCopyMessage}
                className="text-xs font-bold text-neutral-800 dark:text-neutral-200 hover:underline flex items-center gap-1"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied!' : 'Copy Text'}
              </button>
            </div>
            <div className="p-3.5 bg-neutral-900 dark:bg-[#12161c] text-neutral-100 rounded-2xl font-mono text-[11px] whitespace-pre-wrap leading-relaxed border border-neutral-800 dark:border-neutral-700 max-h-36 overflow-y-auto">
              {messageText}
            </div>
          </div>

          {/* Trust Notice */}
          <div className="flex items-center gap-2.5 p-3.5 bg-[#EAE5DB] dark:bg-[#262e3b] rounded-2xl border border-[#d8d0c3] dark:border-[#374151] text-neutral-800 dark:text-neutral-200 text-xs">
            <ShieldCheck className="w-4 h-4 text-neutral-700 dark:text-neutral-300 shrink-0" />
            <span>
              <strong>Direct communication with {storeContact.name}.</strong> Clicking below will launch WhatsApp chat ({storeContact.phone}) to confirm delivery and payment (M-Pesa).
            </span>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-[#e5dfd3] dark:border-[#2d3748] bg-[#F9F8F3] dark:bg-[#12161c] flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 text-sm font-bold text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            id="launch-whatsapp-direct-btn"
            type="button"
            onClick={handleOpenWhatsApp}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-900 text-sm font-black shadow-xs transition-all active:scale-98"
          >
            <Send className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
            <span>Send Details to WhatsApp</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
