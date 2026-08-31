import React, { useState } from 'react';
import { X, Trash2, Send, ShoppingBag, Plus, Minus, Check, Copy, MessageSquare, Sparkles, MapPin, User, PhoneCall, ShieldCheck } from 'lucide-react';
import { CartItem, CustomerDetails, StoreContact } from '../types';
import { formatKSh, generateCartWhatsAppMessage, createWhatsAppUrl } from '../utils/whatsapp';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (cartItemId: string, newQty: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onClearCart: () => void;
  storeContact: StoreContact;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  storeContact,
}) => {
  const [customer, setCustomer] = useState<CustomerDetails>({
    name: '',
    phone: '',
    location: '',
    notes: '',
  });
  const [copied, setCopied] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  if (!isOpen) return null;

  const totalItemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalEstimatedPrice = cartItems.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);

  const formattedWhatsAppMsg = generateCartWhatsAppMessage(cartItems, customer, storeContact);

  const handleSendToWhatsApp = () => {
    if (cartItems.length === 0) return;
    const url = createWhatsAppUrl(storeContact.phone, formattedWhatsAppMsg);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(formattedWhatsAppMsg);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-neutral-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="absolute inset-y-0 right-0 flex max-w-full pl-10">
        <div
          id="cart-drawer-panel"
          className="w-screen max-w-md bg-white shadow-2xl border-l border-neutral-200 flex flex-col justify-between"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/70">
            <div className="flex items-center gap-2.5">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-neutral-900 text-white">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-bold text-neutral-900">Your Order Bag</h2>
                <p className="text-xs text-neutral-500">{totalItemsCount} item{totalItemsCount !== 1 ? 's' : ''} selected</p>
              </div>
            </div>
            <button
              id="close-cart-drawer-btn"
              onClick={onClose}
              className="p-2 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 overflow-y-auto flex-1 space-y-6">
            {cartItems.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mx-auto text-neutral-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-neutral-900">Your bag is empty</h3>
                  <p className="text-xs text-neutral-500 mt-1 max-w-xs mx-auto">
                    Browse our hoodies, polo shirts, sweatshirts, and caps to select sizes, colors, and quantities.
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold transition-all"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              <>
                {/* Cart Items List */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-neutral-600">Selected Items:</span>
                    <button
                      type="button"
                      onClick={onClearCart}
                      className="text-[11px] font-semibold text-red-600 hover:text-red-700"
                    >
                      Clear All
                    </button>
                  </div>

                  <div className="space-y-3 divide-y divide-neutral-100">
                    {cartItems.map((item) => {
                      const itemSubtotal = item.unitPrice * item.quantity;
                      return (
                        <div key={item.cartItemId} className="pt-3 first:pt-0 flex gap-3">
                          {/* Color swatch visual indicator */}
                          <div
                            className="w-12 h-12 rounded-xl border border-neutral-200 flex items-center justify-center shrink-0 shadow-xs relative"
                            style={{ backgroundColor: item.selectedColor.hex }}
                          >
                            <span className="text-[10px] font-extrabold text-white mix-blend-difference">
                              {item.selectedSize}
                            </span>
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-1">
                              <h4 className="text-xs font-bold text-neutral-900 truncate">{item.productName}</h4>
                              <button
                                type="button"
                                onClick={() => onRemoveItem(item.cartItemId)}
                                className="text-neutral-400 hover:text-red-600 p-1 transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            <div className="flex items-center gap-2 mt-0.5 text-[11px] text-neutral-500">
                              <span>Color: <strong>{item.selectedColor.name}</strong></span>
                              <span>•</span>
                              <span>Size: <strong>{item.selectedSize}</strong></span>
                            </div>

                            {item.customization && item.customization.enabled && item.customization.text && (
                              <div className="mt-1 inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
                                <Sparkles className="w-3 h-3 text-emerald-600" />
                                <span>Print: "{item.customization.text}" ({item.customization.type})</span>
                              </div>
                            )}

                            <div className="flex items-center justify-between mt-2 pt-1">
                              {/* Quantity buttons */}
                              <div className="flex items-center border border-neutral-200 rounded-lg bg-neutral-50 p-0.5">
                                <button
                                  type="button"
                                  onClick={() => onUpdateQuantity(item.cartItemId, item.quantity - 1)}
                                  className="w-6 h-6 flex items-center justify-center text-neutral-600 hover:bg-white rounded font-bold text-xs"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="w-7 text-center font-bold text-xs text-neutral-900">{item.quantity}</span>
                                <button
                                  type="button"
                                  onClick={() => onUpdateQuantity(item.cartItemId, item.quantity + 1)}
                                  className="w-6 h-6 flex items-center justify-center text-neutral-600 hover:bg-white rounded font-bold text-xs"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>

                              <span className="text-xs font-extrabold text-neutral-900">
                                {formatKSh(itemSubtotal)}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Customer Details Form (Optional) */}
                <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200/80 space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-neutral-700 block">
                    Your Information (For WhatsApp Message)
                  </span>

                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-600 mb-1 flex items-center gap-1">
                      <User className="w-3 h-3 text-neutral-500" />
                      Your Name
                    </label>
                    <input
                      type="text"
                      value={customer.name}
                      onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                      placeholder="e.g. Mary Wanjiku"
                      className="w-full px-3 py-1.5 rounded-lg border border-neutral-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 text-xs text-neutral-900 bg-white outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-600 mb-1 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-neutral-500" />
                      Delivery Town / Neighborhood
                    </label>
                    <input
                      type="text"
                      value={customer.location}
                      onChange={(e) => setCustomer({ ...customer, location: e.target.value })}
                      placeholder="e.g. Nairobi CBD, Thika Road, Mombasa..."
                      className="w-full px-3 py-1.5 rounded-lg border border-neutral-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 text-xs text-neutral-900 bg-white outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-600 mb-1">
                      Special Order Note (Optional)
                    </label>
                    <input
                      type="text"
                      value={customer.notes}
                      onChange={(e) => setCustomer({ ...customer, notes: e.target.value })}
                      placeholder="e.g. Urgently needed by Friday"
                      className="w-full px-3 py-1.5 rounded-lg border border-neutral-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 text-xs text-neutral-900 bg-white outline-hidden"
                    />
                  </div>
                </div>

                {/* Message preview toggle */}
                <div>
                  <button
                    type="button"
                    onClick={() => setShowPreview(!showPreview)}
                    className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>{showPreview ? 'Hide WhatsApp Text' : 'View Generated WhatsApp Message'}</span>
                  </button>

                  {showPreview && (
                    <div className="mt-2 space-y-1.5 animate-in fade-in">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] text-neutral-500">Will be sent to {storeContact.phone}</span>
                        <button
                          type="button"
                          onClick={handleCopyMessage}
                          className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
                        >
                          {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                          {copied ? 'Copied' : 'Copy'}
                        </button>
                      </div>
                      <div className="p-3 bg-neutral-900 text-emerald-200 rounded-xl font-mono text-[11px] whitespace-pre-wrap leading-relaxed max-h-36 overflow-y-auto">
                        {formattedWhatsAppMsg}
                      </div>
                    </div>
                  )}
                </div>

                {/* Trust info */}
                <div className="flex items-start gap-2 p-3 bg-emerald-50 rounded-xl border border-emerald-200/80 text-emerald-900 text-xs">
                  <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <span>
                    <strong>Direct seller chat:</strong> When you tap below, your exact order details will be sent directly to <strong>{storeContact.name} ({storeContact.phone})</strong> on WhatsApp where you will agree on payment & delivery.
                  </span>
                </div>
              </>
            )}
          </div>

          {/* Footer with checkout action */}
          {cartItems.length > 0 && (
            <div className="p-6 border-t border-neutral-100 bg-neutral-50 space-y-3">
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs text-neutral-500">
                  <span>Total Items:</span>
                  <span className="font-semibold text-neutral-900">{totalItemsCount} pcs</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-bold text-neutral-900">Estimated Total:</span>
                  <span className="text-xl font-extrabold text-neutral-900">{formatKSh(totalEstimatedPrice)}</span>
                </div>
              </div>

              <button
                id="send-order-whatsapp-cart-btn"
                type="button"
                onClick={handleSendToWhatsApp}
                className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold shadow-md shadow-emerald-600/25 transition-all transform active:scale-98"
              >
                <Send className="w-4 h-4" />
                <span>Send Order to WhatsApp ({storeContact.phone})</span>
              </button>

              <p className="text-[11px] text-neutral-500 text-center">
                No credit card needed • Payment discussed via WhatsApp
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
