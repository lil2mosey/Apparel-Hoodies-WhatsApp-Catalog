import React from 'react';
import { MessageSquare, MapPin, Sparkles, Ruler, Truck, Lock } from 'lucide-react';
import { StoreContact, ProductCategory } from '../types';
import { MusoBrandLogo } from './MusoBrandLogo';

interface FooterProps {
  storeContact: StoreContact;
  onSelectCategory: (category: ProductCategory) => void;
  onOpenSizeGuide: () => void;
  onOpenOwnerAuth: () => void;
  isOwnerAuthenticated?: boolean;
  onOpenStudio?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  storeContact,
  onSelectCategory,
  onOpenSizeGuide,
  isOwnerAuthenticated = false,
  onOpenStudio,
}) => {
  return (
    <footer className="bg-neutral-900 dark:bg-[#10141a] text-neutral-300 border-t border-neutral-800 dark:border-neutral-800 pb-20 md:pb-0">
      {/* How WhatsApp Ordering Works Banner */}
      <div className="border-b border-neutral-800/80 bg-neutral-950/60 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-8">
            <span className="text-xs font-black uppercase tracking-widest text-neutral-400">Simple 3-Step Process</span>
            <h2 className="text-xl sm:text-2xl font-black text-white mt-1 font-heading">How WhatsApp Ordering Works</h2>
            <p className="text-xs text-neutral-400 mt-1.5">Direct seller contact with instant confirmation and no checkout hurdles</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Step 1 */}
            <div className="bg-neutral-900/90 rounded-2xl p-6 border border-neutral-800 flex flex-col items-start space-y-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 text-white flex items-center justify-center font-black text-base border border-white/20">
                1
              </div>
              <h3 className="text-base font-bold text-white">Select Colors & Sizes</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Choose your favorite hoodies, polo shirts, sweatshirts, or caps. Pick your exact sizes, colors, quantities, and optional custom text printing.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-neutral-900/90 rounded-2xl p-6 border border-neutral-800 flex flex-col items-start space-y-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 text-white flex items-center justify-center font-black text-base border border-white/20">
                2
              </div>
              <h3 className="text-base font-bold text-white">Tap "Send to WhatsApp"</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Our catalog prepares a clean, itemized order summary. With one tap, it opens directly into WhatsApp chat with <strong>{storeContact.name} ({storeContact.phone})</strong>.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-neutral-900/90 rounded-2xl p-6 border border-neutral-800 flex flex-col items-start space-y-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 text-white flex items-center justify-center font-black text-base border border-white/20">
                3
              </div>
              <h3 className="text-base font-bold text-white">Confirm Payment & Delivery</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Discuss payment methods (M-Pesa / Bank) and delivery locations directly with the seller. Fast shipping arranged right to your doorstep.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <MusoBrandLogo variant="emblem" size="sm" />
              <span className="text-base font-bold text-white font-heading">{storeContact.businessName}</span>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Premium plain and custom branded hoodies, tracksuits, ponchos, polo shirts, sweatshirts, plain tees, and caps with direct WhatsApp ordering.
            </p>
            <div className="flex items-center gap-2 text-xs text-neutral-400">
              <MapPin className="w-4 h-4 text-neutral-400 shrink-0" />
              <span>{storeContact.location}</span>
            </div>
          </div>

          {/* Catalog Categories */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Categories</h4>
            <ul className="space-y-2 text-xs text-neutral-400">
              <li>
                <button
                  onClick={() => onSelectCategory('hoodies')}
                  className="hover:text-white transition-colors"
                >
                  Pullover & Zip-Up Hoodies
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('tracksuits')}
                  className="hover:text-white transition-colors font-medium text-emerald-400"
                >
                  2-Piece Athletic Tracksuits
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('ponchos')}
                  className="hover:text-white transition-colors font-medium text-emerald-400"
                >
                  Fringed Fleece & Maasai Ponchos
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('polo-shirts')}
                  className="hover:text-white transition-colors"
                >
                  Piqué Polo T-Shirts
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('sweatshirts')}
                  className="hover:text-white transition-colors"
                >
                  Crewneck Sweatshirts
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('caps')}
                  className="hover:text-white transition-colors"
                >
                  6-Panel Cotton Caps
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('plain-tshirts')}
                  className="hover:text-white transition-colors"
                >
                  Plain Crewneck T-Shirts
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('vests')}
                  className="hover:text-white transition-colors"
                >
                  Safety & Puffer Vests
                </button>
              </li>
            </ul>
          </div>

          {/* Helpful Links for Customer */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Customer Information</h4>
            <ul className="space-y-2 text-xs text-neutral-400">
              <li>
                <button
                  onClick={onOpenSizeGuide}
                  className="flex items-center gap-1.5 hover:text-white transition-colors"
                >
                  <Ruler className="w-3.5 h-3.5" />
                  <span>Size Measurement Guide</span>
                </button>
              </li>
              <li className="flex items-center gap-1.5 text-neutral-400">
                <Truck className="w-3.5 h-3.5 text-neutral-400" />
                <span>Nairobi & Countrywide Delivery</span>
              </li>
              <li className="flex items-center gap-1.5 text-neutral-400">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Custom Name Embroidery & Print</span>
              </li>
            </ul>
          </div>

          {/* Contact Direct */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Direct WhatsApp Ordering</h4>
            <p className="text-xs text-neutral-400">
              Questions regarding colors, bulk orders, or custom designs? Chat directly on WhatsApp with Gryson:
            </p>
            <a
              id="footer-whatsapp-chat-button"
              href={`https://wa.me/${storeContact.phone.replace(/\D/g, '')}?text=${encodeURIComponent(
                `Hello ${storeContact.name}, I'm checking out your apparel catalog!`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-neutral-200 text-neutral-900 text-xs font-bold shadow-xs transition-colors"
            >
              <MessageSquare className="w-4 h-4 text-emerald-600" />
              <span>WhatsApp: {storeContact.phone}</span>
            </a>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-12 pt-6 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-neutral-500">
          <p>© {new Date().getFullYear()} {storeContact.businessName}. All rights reserved.</p>
          
          <div className="flex items-center gap-4">
            <span className="text-[11px] text-neutral-600">Nairobi, Kenya</span>
            
            {/* Owner Studio button only if currently authenticated */}
            {isOwnerAuthenticated && onOpenStudio && (
              <button
                type="button"
                onClick={onOpenStudio}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-amber-300 text-xs font-bold transition-colors border border-amber-500/30"
              >
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span>Gryson Studio (/admin)</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};
