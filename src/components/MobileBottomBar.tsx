import React, { useState, useEffect, useRef } from 'react';
import { 
  SlidersHorizontal, 
  Search, 
  Ruler, 
  MessageSquare, 
  X, 
  Check, 
  Shirt,
  Sparkles,
  ArrowUpDown
} from 'lucide-react';
import { ProductCategory, StoreContact } from '../types';
import { CATEGORIES } from '../data/products';

interface MobileBottomBarProps {
  selectedCategory: ProductCategory;
  onSelectCategory: (category: ProductCategory) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortBy: 'featured' | 'price-asc' | 'price-desc';
  onSortChange: (sort: 'featured' | 'price-asc' | 'price-desc') => void;
  onOpenSizeGuide: () => void;
  storeContact: StoreContact;
  totalProductsCount: number;
  filteredCount: number;
}

export const MobileBottomBar: React.FC<MobileBottomBarProps> = ({
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  onOpenSizeGuide,
  storeContact,
  totalProductsCount,
  filteredCount,
}) => {
  const [isCategorySheetOpen, setIsCategorySheetOpen] = useState(false);
  const [isSearchSheetOpen, setIsSearchSheetOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Focus search input when sheet opens
  useEffect(() => {
    if (isSearchSheetOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [isSearchSheetOpen]);

  // Close sheets on escape key or back
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsCategorySheetOpen(false);
        setIsSearchSheetOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const activeCategoryObj = CATEGORIES.find(c => c.id === selectedCategory);
  const hasActiveFilters = selectedCategory !== 'all' || searchQuery.trim().length > 0;

  const handleResetFilters = () => {
    onSelectCategory('all');
    onSearchChange('');
    setIsCategorySheetOpen(false);
    setIsSearchSheetOpen(false);
  };

  const directWhatsAppUrl = `https://wa.me/${storeContact.phone.replace(/\D/g, '')}?text=${encodeURIComponent(
    `Hello ${storeContact.name}! I'm browsing your online apparel catalog on mobile and would like to order.`
  )}`;

  return (
    <>
      {/* ========================================================================= */}
      {/* 1. PERSISTENT MOBILE BOTTOM ACTION BAR */}
      {/* ========================================================================= */}
      <div 
        id="mobile-bottom-action-bar"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#12161c]/95 backdrop-blur-md border-t border-[#dfd7c9] dark:border-[#2d3748] shadow-2xl px-3 py-2 pb-[max(0.6rem,env(safe-area-inset-bottom))] transition-colors"
      >
        <div className="max-w-md mx-auto flex items-center justify-between gap-1.5">
          {/* Categories Filter Button */}
          <button
            id="mobile-nav-categories-btn"
            type="button"
            onClick={() => {
              setIsCategorySheetOpen(!isCategorySheetOpen);
              setIsSearchSheetOpen(false);
            }}
            className={`flex-1 flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition-all ${
              selectedCategory !== 'all' || isCategorySheetOpen
                ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-xs'
                : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
            }`}
          >
            <div className="relative">
              <SlidersHorizontal className="w-4 h-4" />
              {selectedCategory !== 'all' && (
                <span className="absolute -top-1 -right-1.5 w-2 h-2 rounded-full bg-amber-400 ring-2 ring-white dark:ring-neutral-900" />
              )}
            </div>
            <span className="text-[10px] font-extrabold mt-0.5 max-w-[70px] truncate text-center">
              {selectedCategory === 'all' ? 'Categories' : activeCategoryObj?.label || 'Filter'}
            </span>
          </button>

          {/* Search Button */}
          <button
            id="mobile-nav-search-btn"
            type="button"
            onClick={() => {
              setIsSearchSheetOpen(!isSearchSheetOpen);
              setIsCategorySheetOpen(false);
            }}
            className={`flex-1 flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition-all ${
              searchQuery.trim() || isSearchSheetOpen
                ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-xs'
                : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
            }`}
          >
            <div className="relative">
              <Search className="w-4 h-4" />
              {searchQuery.trim() && (
                <span className="absolute -top-1 -right-1.5 w-2 h-2 rounded-full bg-amber-400 ring-2 ring-white dark:ring-neutral-900" />
              )}
            </div>
            <span className="text-[10px] font-extrabold mt-0.5 text-center">
              {searchQuery.trim() ? 'Searching' : 'Search'}
            </span>
          </button>

          {/* Size Guide Button */}
          <button
            id="mobile-nav-sizeguide-btn"
            type="button"
            onClick={onOpenSizeGuide}
            className="flex-1 flex flex-col items-center justify-center py-1.5 px-2 rounded-xl text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all"
          >
            <Ruler className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span className="text-[10px] font-extrabold mt-0.5 text-center">Size Guide</span>
          </button>

          {/* Direct WhatsApp Order CTA Button */}
          <a
            id="mobile-nav-whatsapp-cta"
            href={directWhatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1.5 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-md active:scale-95 transition-all text-xs font-black"
          >
            <MessageSquare className="w-4 h-4 fill-current shrink-0" />
            <span className="text-[11px] whitespace-nowrap">WhatsApp</span>
          </a>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. SLIDE-UP CATEGORY FILTER DRAWER / SHEET */}
      {/* ========================================================================= */}
      {isCategorySheetOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex flex-col justify-end bg-neutral-950/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div 
            className="fixed inset-0"
            onClick={() => setIsCategorySheetOpen(false)}
          />

          <div 
            id="mobile-category-sheet"
            className="relative z-10 bg-white dark:bg-[#1a202c] rounded-t-3xl border-t border-[#dfd7c9] dark:border-[#2d3748] p-5 pb-8 shadow-2xl max-h-[85vh] overflow-y-auto space-y-4 animate-in slide-in-from-bottom duration-250"
          >
            {/* Handle pill */}
            <div className="w-12 h-1.5 rounded-full bg-neutral-300 dark:bg-neutral-700 mx-auto" />

            {/* Header */}
            <div className="flex items-center justify-between pb-2 border-b border-[#e5dfd3] dark:border-[#2d3748]">
              <div>
                <h3 className="text-base font-black text-neutral-900 dark:text-white font-heading">
                  Filter Apparel Category
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  Showing {filteredCount} of {totalProductsCount} items
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsCategorySheetOpen(false)}
                className="p-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Categories List */}
            <div className="grid grid-cols-1 gap-2 pt-1">
              {CATEGORIES.map((cat) => {
                const isSelected = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    id={`mobile-cat-select-${cat.id}`}
                    type="button"
                    onClick={() => {
                      onSelectCategory(cat.id);
                      setIsCategorySheetOpen(false);
                    }}
                    className={`flex items-center justify-between p-3.5 rounded-2xl text-xs font-bold transition-all ${
                      isSelected
                        ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-md ring-2 ring-neutral-900 dark:ring-white'
                        : 'bg-[#F9F8F3] dark:bg-[#12161c] text-neutral-800 dark:text-neutral-200 border border-[#dfd7c9] dark:border-[#2d3748] hover:bg-neutral-100 dark:hover:bg-neutral-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl ${isSelected ? 'bg-neutral-800 dark:bg-neutral-100 text-white dark:text-neutral-900' : 'bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300'}`}>
                        <Shirt className="w-4 h-4" />
                      </div>
                      <span className="text-sm">{cat.label}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {isSelected && (
                        <Check className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Sort options in Category Sheet */}
            <div className="pt-3 border-t border-[#e5dfd3] dark:border-[#2d3748] space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-neutral-700 dark:text-neutral-300">
                <span className="flex items-center gap-1.5">
                  <ArrowUpDown className="w-3.5 h-3.5 text-neutral-500" />
                  Sort Order
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'featured', label: 'Featured' },
                  { id: 'price-asc', label: 'Price: Low' },
                  { id: 'price-desc', label: 'Price: High' },
                ].map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => onSortChange(s.id as any)}
                    className={`py-2 px-2 rounded-xl text-[11px] font-bold text-center border transition-all ${
                      sortBy === s.id
                        ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 border-neutral-900 dark:border-white shadow-xs'
                        : 'bg-white dark:bg-[#12161c] text-neutral-700 dark:text-neutral-300 border-[#dfd7c9] dark:border-[#2d3748]'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Reset Action */}
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="w-full py-3 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 text-xs font-bold transition-colors"
              >
                Reset All Filters
              </button>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. SLIDE-UP SEARCH DRAWER / SHEET */}
      {/* ========================================================================= */}
      {isSearchSheetOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex flex-col justify-end bg-neutral-950/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div 
            className="fixed inset-0"
            onClick={() => setIsSearchSheetOpen(false)}
          />

          <div 
            id="mobile-search-sheet"
            className="relative z-10 bg-white dark:bg-[#1a202c] rounded-t-3xl border-t border-[#dfd7c9] dark:border-[#2d3748] p-5 pb-8 shadow-2xl space-y-4 animate-in slide-in-from-bottom duration-250"
          >
            {/* Handle pill */}
            <div className="w-12 h-1.5 rounded-full bg-neutral-300 dark:bg-neutral-700 mx-auto" />

            {/* Header */}
            <div className="flex items-center justify-between pb-1">
              <h3 className="text-base font-black text-neutral-900 dark:text-white font-heading">
                Search Catalog
              </h3>
              <button
                type="button"
                onClick={() => setIsSearchSheetOpen(false)}
                className="p-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input
                ref={searchInputRef}
                id="mobile-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search hoodies, polo, caps, colors..."
                className="w-full pl-12 pr-10 py-3.5 rounded-2xl bg-[#F9F8F3] dark:bg-[#12161c] border-2 border-[#dfd7c9] dark:border-[#2d3748] focus:border-neutral-900 dark:focus:border-white text-sm font-semibold text-neutral-900 dark:text-white outline-hidden transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-neutral-200 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Quick Search Tag Pills */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                Popular Searches
              </span>
              <div className="flex flex-wrap gap-2">
                {['Heavyweight Hoodie', 'Polo Shirts', 'Sweatshirt', 'Baseball Cap', 'Black', 'Navy Blue', 'Maroon'].map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => {
                      onSearchChange(tag);
                      setIsSearchSheetOpen(false);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 text-xs font-semibold hover:bg-neutral-200 dark:hover:bg-neutral-700 border border-neutral-200 dark:border-neutral-700 transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Search Results Summary & Close CTA */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setIsSearchSheetOpen(false)}
                className="w-full py-3.5 rounded-2xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-black shadow-md transition-all"
              >
                View {filteredCount} Result{filteredCount !== 1 ? 's' : ''}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
