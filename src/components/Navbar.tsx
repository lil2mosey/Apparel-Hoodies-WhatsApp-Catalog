import React from 'react';
import { MessageSquare, Search, Phone, Sparkles, Sun, Moon, ArrowLeft, LogOut, ShieldCheck } from 'lucide-react';
import { StoreContact, ProductCategory, AppTheme } from '../types';
import { MusoBrandLogo } from './MusoBrandLogo';

interface NavbarProps {
  onOpenLogoShowcase: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCategory: ProductCategory;
  onSelectCategory: (cat: ProductCategory) => void;
  storeContact: StoreContact;
  theme: AppTheme;
  onToggleTheme: () => void;
  isOwnerAuthenticated?: boolean;
  onReturnToStudio?: () => void;
  onOwnerLogout?: () => void;
  onNavigateAdmin?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenLogoShowcase,
  searchQuery,
  onSearchChange,
  storeContact,
  theme,
  onToggleTheme,
  isOwnerAuthenticated = false,
  onReturnToStudio,
  onOwnerLogout,
  onNavigateAdmin,
}) => {
  const directWhatsAppUrl = `https://wa.me/${storeContact.phone.replace(/\D/g, '')}?text=${encodeURIComponent(
    `Hello ${storeContact.name}! I'm browsing your online apparel catalog and would like to order or ask a question.`
  )}`;

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#1a202c]/95 backdrop-blur-md border-b border-[#e5dfd3] dark:border-[#2d3748] transition-colors duration-200">
      {/* If Owner is logged in and viewing Customer Preview, show sticky top Owner bar */}
      {isOwnerAuthenticated && onReturnToStudio && (
        <div className="bg-neutral-900 text-white text-xs py-2 px-4 border-b border-neutral-700 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-bold text-neutral-200">
              👑 Owner Mode Active: Viewing Customer Storefront
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              id="return-to-studio-btn"
              type="button"
              onClick={onReturnToStudio}
              className="px-3 py-1 rounded-lg bg-white text-neutral-900 hover:bg-neutral-200 text-xs font-black transition-all flex items-center gap-1 shadow-xs"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Muso Studio (/admin)</span>
            </button>
            {onOwnerLogout && (
              <button
                id="owner-logout-btn"
                type="button"
                onClick={onOwnerLogout}
                className="px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-red-900/60 text-neutral-300 hover:text-red-200 text-xs font-bold transition-all flex items-center gap-1 border border-neutral-700"
                title="Lock / Log Out of Owner Session"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Lock Session</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Top Notification Announcement Bar */}
      <div className="bg-neutral-900 dark:bg-[#11151c] text-white text-xs py-2 px-4 border-b border-neutral-800 dark:border-neutral-800/80">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-medium text-neutral-300">
              Direct WhatsApp Ordering • Choose Size & Colour • Fast Countrywide Delivery!
            </span>
          </div>
          <div className="flex items-center gap-3 text-neutral-400 text-[11px]">
            <span>Nairobi & Countrywide</span>
            <span>•</span>
            <a
              href={`tel:${storeContact.phone}`}
              className="text-neutral-200 hover:text-white font-bold hover:underline flex items-center gap-1"
            >
              <Phone className="w-3 h-3 text-red-400" />
              {storeContact.phone}
            </a>
          </div>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
        {/* Brand Logo & Name */}
        <button
          onClick={onOpenLogoShowcase}
          className="group flex items-center gap-3 text-left focus:outline-hidden"
          title="Click to view full official brand logo"
        >
          <MusoBrandLogo variant="emblem" size="md" className="shrink-0 group-hover:scale-105 transition-transform" />
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-base sm:text-lg font-black text-neutral-900 dark:text-white tracking-tight font-heading group-hover:text-neutral-700 dark:group-hover:text-neutral-300 transition-colors">
                {storeContact.businessName}
              </h1>
              <span className="hidden md:inline-flex items-center gap-0.5 text-[10px] font-bold text-neutral-800 dark:text-neutral-200 bg-[#EAE5DB] dark:bg-[#262e3b] border border-[#d8d0c3] dark:border-[#374151] px-2 py-0.5 rounded-full">
                <Sparkles className="w-2.5 h-2.5 text-amber-600" />
                Official Logo
              </span>
            </div>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400 hidden sm:block font-medium">
              Hoodies • Tracksuits • Ponchos • Polo Shirts • Sweatshirts • Caps • Tees
            </p>
          </div>
        </button>

        {/* Search Bar */}
        <div className="flex-1 max-w-md hidden md:block">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              id="search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search tracksuits, ponchos, hoodies, polos, colors..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-neutral-100 dark:bg-[#12161c] border border-neutral-200 dark:border-neutral-700 focus:bg-white dark:focus:bg-[#181f2a] focus:border-neutral-900 dark:focus:border-white text-xs text-neutral-900 dark:text-white placeholder:text-neutral-400 transition-all outline-hidden"
            />
          </div>
        </div>

        {/* Actions: Theme Toggle, WhatsApp Chat */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Theme Toggle (Light / Dark) */}
          <button
            id="header-theme-toggle-btn"
            type="button"
            onClick={onToggleTheme}
            className="p-2.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-200 border border-neutral-200/80 dark:border-neutral-700 transition-colors"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-neutral-600" />
            )}
          </button>

          {/* Direct WhatsApp Chat CTA button for Customers */}
          <a
            id="header-whatsapp-chat-link"
            href={directWhatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-900 text-xs font-black shadow-xs transition-all active:scale-98"
          >
            <MessageSquare className="w-3.5 h-3.5 text-emerald-400 dark:text-emerald-600" />
            <span className="hidden sm:inline">WhatsApp Muso</span>
            <span className="sm:hidden">Chat</span>
          </a>
        </div>
      </div>

      {/* Mobile Search input */}
      <div className="px-4 pb-3 md:hidden">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            id="mobile-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search hoodies, polo shirts, caps..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-neutral-100 dark:bg-[#12161c] border border-neutral-200 dark:border-neutral-700 focus:bg-white dark:focus:bg-[#181f2a] focus:border-neutral-900 dark:focus:border-white text-xs text-neutral-900 dark:text-white placeholder:text-neutral-400 transition-all outline-hidden"
          />
        </div>
      </div>
    </header>
  );
};
