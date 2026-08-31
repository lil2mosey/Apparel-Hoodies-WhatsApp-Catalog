import React, { useState } from 'react';
import { X, Ruler, CheckCircle2 } from 'lucide-react';
import { SIZE_CHART_DATA } from '../data/products';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCategory?: string;
}

export const SizeGuideModal: React.FC<SizeGuideModalProps> = ({
  isOpen,
  onClose,
  initialCategory = 'hoodies',
}) => {
  const [activeTab, setActiveTab] = useState<'hoodies' | 'polos' | 'caps'>(
    initialCategory.includes('polo') ? 'polos' : initialCategory.includes('cap') ? 'caps' : 'hoodies'
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        id="size-guide-modal"
        className="relative w-full max-w-2xl bg-white dark:bg-[#1a202c] rounded-3xl shadow-2xl border border-[#dfd7c9] dark:border-[#2d3748] overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#e5dfd3] dark:border-[#2d3748] bg-[#F9F8F3] dark:bg-[#12161c]">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 shadow-xs">
              <Ruler className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-neutral-900 dark:text-white font-heading">Apparel Size Guide</h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">Accurate sizing chart in inches & centimeters</p>
            </div>
          </div>
          <button
            id="close-size-guide-btn"
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-200/60 dark:hover:bg-neutral-800 rounded-full transition-colors"
            aria-label="Close size guide"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Tabs */}
        <div className="flex border-b border-neutral-200 dark:border-neutral-800 px-6 pt-3 gap-2 bg-[#F9F8F3] dark:bg-[#12161c]">
          <button
            id="tab-hoodies"
            onClick={() => setActiveTab('hoodies')}
            className={`pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition-all ${
              activeTab === 'hoodies'
                ? 'border-neutral-900 dark:border-white text-neutral-900 dark:text-white'
                : 'border-transparent text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-300'
            }`}
          >
            Hoodies & Sweatshirts
          </button>
          <button
            id="tab-polos"
            onClick={() => setActiveTab('polos')}
            className={`pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition-all ${
              activeTab === 'polos'
                ? 'border-neutral-900 dark:border-white text-neutral-900 dark:text-white'
                : 'border-transparent text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-300'
            }`}
          >
            Polo Shirts & Plain Tees
          </button>
          <button
            id="tab-caps"
            onClick={() => setActiveTab('caps')}
            className={`pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition-all ${
              activeTab === 'caps'
                ? 'border-neutral-900 dark:border-white text-neutral-900 dark:text-white'
                : 'border-transparent text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-300'
            }`}
          >
            Caps & Headwear
          </button>
        </div>

        {/* Content Table */}
        <div className="p-6 overflow-y-auto space-y-6">
          {activeTab === 'hoodies' && (
            <div>
              <div className="overflow-x-auto rounded-2xl border border-neutral-200 dark:border-neutral-800">
                <table className="w-full text-left text-sm">
                  <thead className="bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 uppercase font-black text-[11px] tracking-wider">
                    <tr>
                      <th className="px-4 py-3">Size</th>
                      <th className="px-4 py-3">Chest (Inches)</th>
                      <th className="px-4 py-3">Body Length</th>
                      <th className="px-4 py-3">Sleeve Length</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800 text-neutral-700 dark:text-neutral-300">
                    {SIZE_CHART_DATA.hoodies.map((row) => (
                      <tr key={row.size} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                        <td className="px-4 py-3 font-bold text-neutral-900 dark:text-white">{row.size}</td>
                        <td className="px-4 py-3">{row.chest}</td>
                        <td className="px-4 py-3">{row.length}</td>
                        <td className="px-4 py-3">{row.sleeve}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-3 text-xs text-neutral-500 dark:text-neutral-400">
                💡 <em>Tip: For an oversized, baggy streetwear look with our hoodies, we recommend ordering one size up.</em>
              </p>
            </div>
          )}

          {activeTab === 'polos' && (
            <div>
              <div className="overflow-x-auto rounded-2xl border border-neutral-200 dark:border-neutral-800">
                <table className="w-full text-left text-sm">
                  <thead className="bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 uppercase font-black text-[11px] tracking-wider">
                    <tr>
                      <th className="px-4 py-3">Size</th>
                      <th className="px-4 py-3">Chest (Inches)</th>
                      <th className="px-4 py-3">Length</th>
                      <th className="px-4 py-3">Shoulder Width</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800 text-neutral-700 dark:text-neutral-300">
                    {SIZE_CHART_DATA.polos.map((row) => (
                      <tr key={row.size} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                        <td className="px-4 py-3 font-bold text-neutral-900 dark:text-white">{row.size}</td>
                        <td className="px-4 py-3">{row.chest}</td>
                        <td className="px-4 py-3">{row.length}</td>
                        <td className="px-4 py-3">{row.shoulder}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-3 text-xs text-neutral-500 dark:text-neutral-400">
                💡 <em>Tip: Piqué polo shirts have a smart, tailored fit. Order true to size for regular fit.</em>
              </p>
            </div>
          )}

          {activeTab === 'caps' && (
            <div>
              <div className="overflow-x-auto rounded-2xl border border-neutral-200 dark:border-neutral-800">
                <table className="w-full text-left text-sm">
                  <thead className="bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 uppercase font-black text-[11px] tracking-wider">
                    <tr>
                      <th className="px-4 py-3">Size</th>
                      <th className="px-4 py-3">Head Circumference</th>
                      <th className="px-4 py-3">Crown Height</th>
                      <th className="px-4 py-3">Brim Length</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800 text-neutral-700 dark:text-neutral-300">
                    {SIZE_CHART_DATA.caps.map((row) => (
                      <tr key={row.size} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                        <td className="px-4 py-3 font-bold text-neutral-900 dark:text-white">{row.size}</td>
                        <td className="px-4 py-3">{row.circumference}</td>
                        <td className="px-4 py-3">{row.crown}</td>
                        <td className="px-4 py-3">{row.brim}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-3 text-xs text-neutral-500 dark:text-neutral-400">
                💡 <em>All caps come with an adjustable rear buckle strap to fit all adult head sizes comfortably.</em>
              </p>
            </div>
          )}

          {/* Measuring Instructions Box */}
          <div className="bg-[#F9F8F3] dark:bg-[#12161c] rounded-2xl p-4 border border-[#dfd7c9] dark:border-[#2d3748] space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300">How to measure:</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-neutral-600 dark:text-neutral-400">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-neutral-800 dark:text-neutral-200 shrink-0 mt-0.5" />
                <span><strong>Chest:</strong> Measure around the fullest part of your chest, keeping tape horizontal.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-neutral-800 dark:text-neutral-200 shrink-0 mt-0.5" />
                <span><strong>Length:</strong> Measure from the highest point of the shoulder down to the bottom hem.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-[#dfd7c9] dark:border-[#2d3748] bg-[#F9F8F3] dark:bg-[#12161c] flex justify-end">
          <button
            id="got-it-size-guide-btn"
            onClick={onClose}
            className="px-6 py-2.5 text-xs font-black text-white dark:text-neutral-900 bg-neutral-900 dark:bg-white hover:bg-neutral-800 dark:hover:bg-neutral-100 rounded-xl transition-colors"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
