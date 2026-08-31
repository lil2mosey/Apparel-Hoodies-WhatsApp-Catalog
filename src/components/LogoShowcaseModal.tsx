import React from 'react';
import { X, Phone, MessageSquare, ShieldCheck, Download, Sparkles, Shirt } from 'lucide-react';
import { MusoBrandLogo } from './MusoBrandLogo';
import { StoreContact } from '../types';

interface LogoShowcaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  storeContact: StoreContact;
}

export const LogoShowcaseModal: React.FC<LogoShowcaseModalProps> = ({
  isOpen,
  onClose,
  storeContact,
}) => {
  if (!isOpen) return null;

  const directWhatsAppUrl = `https://wa.me/${storeContact.phone.replace(/\D/g, '')}?text=${encodeURIComponent(
    `Hello ${storeContact.name}! I saw your official brand logo for ${storeContact.businessName} and would like to place an order.`
  )}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        id="logo-showcase-modal"
        className="relative w-full max-w-lg bg-white dark:bg-[#1a202c] rounded-3xl shadow-2xl border border-[#dfd7c9] dark:border-[#2d3748] overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#e5dfd3] dark:border-[#2d3748] bg-[#F9F8F3] dark:bg-[#12161c]">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-wider text-neutral-800 dark:text-neutral-200 bg-[#EAE5DB] dark:bg-[#262e3b] border border-[#d8d0c3] dark:border-[#374151] px-2.5 py-1 rounded-md">
              Official Brand Identity
            </span>
          </div>
          <button
            id="close-logo-showcase-btn"
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-200/60 dark:hover:bg-neutral-800 rounded-full transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex flex-col items-center text-center">
          {/* Main Logo Graphic on High Contrast Stage */}
          <div className="w-full bg-[#EAE5DB] dark:bg-[#12161c] p-6 sm:p-8 rounded-2xl border border-[#d8d0c3] dark:border-[#2d3748] shadow-inner flex flex-col items-center justify-center">
            <MusoBrandLogo variant="full" size="lg" phone={storeContact.phone} />
          </div>

          {/* Business Details & Merch Info */}
          <div className="space-y-2 max-w-sm">
            <div className="flex items-center justify-center gap-2 text-neutral-600 dark:text-neutral-300 text-xs font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Authentic Kenyan Apparel Brand</span>
            </div>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Specialized in high-grade <strong>Hoodies</strong>, <strong>Polo Shirts</strong>, <strong>Sweatshirts</strong>, <strong>Caps</strong> & <strong>Plain Tees</strong>. Custom prints & embroidery available on request.
            </p>
          </div>

          {/* Quick Contact & Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full pt-2">
            <a
              href={`tel:${storeContact.phone}`}
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-900 dark:text-white text-xs font-bold transition-all"
            >
              <Phone className="w-4 h-4 text-red-500" />
              <span>Call {storeContact.phone}</span>
            </a>

            <a
              href={directWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-all"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Chat with Muso</span>
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-[#e5dfd3] dark:border-[#2d3748] bg-[#F9F8F3] dark:bg-[#12161c] text-center">
          <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
            Muso's Apparel & Custom Merch • Nairobi, Kenya • Countrywide Deliveries
          </p>
        </div>
      </div>
    </div>
  );
};
