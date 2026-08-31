import React, { useState } from 'react';
import { X, MessageSquare, Phone, Store, MapPin, Check, RotateCcw } from 'lucide-react';
import { StoreContact } from '../types';
import { DEFAULT_STORE_CONTACT } from '../data/products';

interface WhatsAppSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  contact: StoreContact;
  onSaveContact: (contact: StoreContact) => void;
}

export const WhatsAppSettingsModal: React.FC<WhatsAppSettingsModalProps> = ({
  isOpen,
  onClose,
  contact,
  onSaveContact,
}) => {
  const [formData, setFormData] = useState<StoreContact>({ ...contact });
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveContact(formData);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 900);
  };

  const handleReset = () => {
    setFormData({ ...DEFAULT_STORE_CONTACT });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        id="whatsapp-settings-modal"
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-[#dfd7c9] overflow-hidden flex flex-col"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#e5dfd3] bg-[#F9F8F3]">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-emerald-700 text-white shadow-xs">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-neutral-900 font-heading">WhatsApp Contact Settings</h2>
              <p className="text-xs text-neutral-500">Configure recipient number for direct orders</p>
            </div>
          </div>
          <button
            id="close-whatsapp-settings-btn"
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-200/60 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-emerald-600" />
              WhatsApp Phone Number
            </label>
            <input
              id="settings-whatsapp-phone"
              type="text"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="e.g. 0735418753 or +254735418753"
              className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 text-sm font-medium text-neutral-900 transition-all outline-hidden"
            />
            <p className="mt-1 text-[11px] text-neutral-500">
              Orders will open directly in WhatsApp chat with this phone number.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5 flex items-center gap-1.5">
              <Store className="w-3.5 h-3.5 text-neutral-600" />
              Business / Sister's Name
            </label>
            <input
              id="settings-business-name"
              type="text"
              value={formData.businessName}
              onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
              placeholder="e.g. Carol's Apparel"
              className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 text-sm font-medium text-neutral-900 transition-all outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-neutral-600" />
              Location / Delivery Notice
            </label>
            <input
              id="settings-location"
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="e.g. Nairobi, Kenya • Delivery countrywide"
              className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 text-sm font-medium text-neutral-900 transition-all outline-hidden"
            />
          </div>

          <div className="pt-2 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-1.5 text-xs text-neutral-500 hover:text-neutral-800 font-semibold px-2 py-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Default
            </button>

            <button
              id="save-whatsapp-settings-btn"
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold shadow-xs transition-colors"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  Saved!
                </>
              ) : (
                'Save Settings'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
