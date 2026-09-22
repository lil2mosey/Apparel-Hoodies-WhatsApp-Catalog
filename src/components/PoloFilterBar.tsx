import React, { useState, useMemo } from 'react';
import {
  SlidersHorizontal,
  X,
  RotateCcw,
  Sparkles,
  Shirt,
  Layers,
  Tag,
  Ruler,
  ChevronDown,
  ChevronUp,
  Check,
  CheckCircle2,
  Filter
} from 'lucide-react';
import {
  PoloFilterState,
  PoloStylePattern,
  PoloSleeveLength,
  PoloFit,
  PoloFabricWeight,
  PoloFabricType,
  PoloClosureType,
  Product
} from '../types';

export interface PoloFilterBarProps {
  filters: PoloFilterState;
  onToggleFilter: (group: keyof PoloFilterState, value: string) => void;
  onClearAll: () => void;
  onSelectOnly: (group: keyof PoloFilterState, value: string) => void;
  poloProducts: Product[];
  filteredCount: number;
  isOpenDefault?: boolean;
}

export const POLO_FILTER_CONFIG = [
  {
    key: 'stylePattern' as const,
    label: 'Style / Pattern',
    icon: Sparkles,
    options: ['Plain / Solid', 'Contrast Tipped', 'Striped'] as PoloStylePattern[],
  },
  {
    key: 'sleeveLength' as const,
    label: 'Sleeve Length',
    icon: Shirt,
    options: ['Short Sleeve', 'Long Sleeve'] as PoloSleeveLength[],
  },
  {
    key: 'fit' as const,
    label: 'Fit',
    icon: Ruler,
    options: ['Regular Fit', 'Slim Fit', 'Oversized'] as PoloFit[],
  },
  {
    key: 'fabricWeight' as const,
    label: 'Fabric Weight (GSM)',
    icon: Layers,
    options: [
      'Lightweight (<180 GSM)',
      'Midweight (180–210 GSM)',
      'Heavyweight (220+ GSM)',
    ] as PoloFabricWeight[],
  },
  {
    key: 'fabricType' as const,
    label: 'Fabric Type',
    icon: Layers,
    options: ['Piqué Cotton', 'Interlock', 'Cotton Blend'] as PoloFabricType[],
  },
  {
    key: 'closureType' as const,
    label: 'Closure Type',
    icon: Tag,
    options: ['2-Button Placket', '3-Button Placket'] as PoloClosureType[],
  },
];

export const INITIAL_POLO_FILTERS: PoloFilterState = {
  stylePattern: [],
  sleeveLength: [],
  fit: [],
  fabricWeight: [],
  fabricType: [],
  closureType: [],
};

export const PoloFilterBar: React.FC<PoloFilterBarProps> = ({
  filters,
  onToggleFilter,
  onClearAll,
  onSelectOnly,
  poloProducts,
  filteredCount,
  isOpenDefault = true,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(isOpenDefault);

  // Total count of active filters applied
  const totalActiveFilters = useMemo(() => {
    return (
      filters.stylePattern.length +
      filters.sleeveLength.length +
      filters.fit.length +
      filters.fabricWeight.length +
      filters.fabricType.length +
      filters.closureType.length
    );
  }, [filters]);

  // Calculate live count of items for each option dynamically across all designs
  const optionCounts = useMemo(() => {
    const counts: Record<string, number> = {};

    const allDesignsOrProducts = poloProducts.flatMap((product) => {
      if (product.poloDesigns && product.poloDesigns.length > 0) {
        return product.poloDesigns.map((d) => ({
          stylePattern: d.stylePattern,
          sleeveLength: d.sleeveLength,
          fit: d.fit,
          fabricWeight: d.fabricWeight,
          fabricType: d.fabricType,
          closureType: d.closureType,
        }));
      }
      return [{
        stylePattern: product.poloAttributes?.stylePattern || product.stylePattern,
        sleeveLength: product.poloAttributes?.sleeveLength || product.sleeveLength,
        fit: product.poloAttributes?.fit || product.fit,
        fabricWeight: product.poloAttributes?.fabricWeight || product.fabricWeight,
        fabricType: product.poloAttributes?.fabricType || product.fabricType,
        closureType: product.poloAttributes?.closureType || product.closureType,
      }];
    });

    POLO_FILTER_CONFIG.forEach((group) => {
      group.options.forEach((opt) => {
        // Count how many polo designs match this option given the other ACTIVE filters
        const matchingCount = allDesignsOrProducts.filter((attrs) => {
          // Must match current option for this group
          if (attrs[group.key] !== opt) {
            return false;
          }

          // Check other groups
          for (const otherGroup of POLO_FILTER_CONFIG) {
            if (otherGroup.key === group.key) continue;
            const activeInOther = filters[otherGroup.key];
            if (activeInOther && activeInOther.length > 0) {
              const val = attrs[otherGroup.key];
              if (!val || !activeInOther.includes(val as any)) {
                return false;
              }
            }
          }

          return true;
        }).length;

        counts[`${group.key}:${opt}`] = matchingCount;
      });
    });

    return counts;
  }, [poloProducts, filters]);

  // Quick preset pills
  const presets = [
    { label: 'All Polos', active: totalActiveFilters === 0, action: onClearAll },
    {
      label: 'Classic Solid (2-Button)',
      active:
        filters.stylePattern.includes('Plain / Solid') &&
        filters.closureType.includes('2-Button Placket'),
      action: () => {
        onClearAll();
        onToggleFilter('stylePattern', 'Plain / Solid');
        onToggleFilter('closureType', '2-Button Placket');
      },
    },
    {
      label: 'Contrast Tipped',
      active: filters.stylePattern.includes('Contrast Tipped'),
      action: () => onSelectOnly('stylePattern', 'Contrast Tipped'),
    },
    {
      label: 'Long Sleeve Executive',
      active: filters.sleeveLength.includes('Long Sleeve'),
      action: () => onSelectOnly('sleeveLength', 'Long Sleeve'),
    },
    {
      label: 'Heavyweight Piqué (220+ GSM)',
      active:
        filters.fabricWeight.includes('Heavyweight (220+ GSM)') &&
        filters.fabricType.includes('Piqué Cotton'),
      action: () => {
        onClearAll();
        onToggleFilter('fabricWeight', 'Heavyweight (220+ GSM)');
        onToggleFilter('fabricType', 'Piqué Cotton');
      },
    },
    {
      label: 'Modern Slim Fit',
      active: filters.fit.includes('Slim Fit'),
      action: () => onSelectOnly('fit', 'Slim Fit'),
    },
  ];

  return (
    <section
      aria-label="Polo shirts dynamic filters"
      id="polo-dynamic-filters-panel"
      className="bg-white dark:bg-[#1a202c] rounded-3xl border border-[#dfd7c9] dark:border-[#2d3748] shadow-xs overflow-hidden transition-all mb-6"
    >
      {/* Filter Header & Collapsible Bar */}
      <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#ece6da] dark:border-[#2d3748]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#EAE5DB] dark:bg-[#242d3d] border border-[#d8d0c3] dark:border-[#374151] flex items-center justify-center text-neutral-900 dark:text-white shrink-0">
            <Filter className="w-5 h-5 text-neutral-800 dark:text-neutral-200" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-black text-neutral-900 dark:text-white font-heading tracking-tight">
                Polo Shirt Dynamic Filters & Attributes
              </h2>
              {totalActiveFilters > 0 && (
                <span
                  id="active-filters-count-badge"
                  className="px-2 py-0.5 rounded-full text-[11px] font-black bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-2xs"
                >
                  {totalActiveFilters} active
                </span>
              )}
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Filter across pattern, sleeve length, fit, fabric weight, knit type & placket closure.
            </p>
          </div>
        </div>

        {/* Right Action Controls: Matching count, Clear all, Expand toggle */}
        <div className="flex items-center gap-2 self-end sm:self-center">
          <span className="text-xs font-bold text-neutral-700 dark:text-neutral-300 bg-[#F9F8F3] dark:bg-[#12161c] px-3 py-1.5 rounded-xl border border-[#e5dfd3] dark:border-[#2d3748]">
            Showing <strong>{filteredCount}</strong> of <strong>{poloProducts.length}</strong> polos
          </span>

          {totalActiveFilters > 0 && (
            <button
              id="clear-all-polo-filters-btn"
              type="button"
              onClick={onClearAll}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 text-xs font-bold transition-colors"
              title="Reset all polo filters"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}

          <button
            type="button"
            id="toggle-polo-filters-accordion-btn"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 text-xs font-bold shadow-2xs hover:opacity-90 transition-opacity"
            aria-expanded={isExpanded}
          >
            <span>{isExpanded ? 'Collapse' : 'Filter Options'}</span>
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Quick Filter Presets Row */}
      <div className="px-4 sm:px-5 py-2.5 bg-[#FAF9F5] dark:bg-[#151a24] border-b border-[#ece6da] dark:border-[#2d3748] flex items-center gap-2 overflow-x-auto scrollbar-none">
        <span className="text-[11px] font-extrabold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 shrink-0">
          Presets:
        </span>
        {presets.map((preset, idx) => (
          <button
            key={idx}
            type="button"
            onClick={preset.action}
            className={`shrink-0 px-3 py-1 rounded-xl text-xs font-bold transition-all ${
              preset.active
                ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-2xs'
                : 'bg-white dark:bg-[#1a202c] text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 border border-[#e5dfd3] dark:border-[#2d3748]'
            }`}
          >
            {preset.label}
          </button>
        ))}
      </div>

      {/* Active Filter Chips (if any) */}
      {totalActiveFilters > 0 && (
        <div className="px-4 sm:px-5 py-2 bg-amber-500/5 dark:bg-amber-400/5 border-b border-[#ece6da] dark:border-[#2d3748] flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-bold text-neutral-500 dark:text-neutral-400">
            Active:
          </span>
          {POLO_FILTER_CONFIG.map((group) => {
            const activeValues = filters[group.key] || [];
            return activeValues.map((val) => (
              <span
                key={`${group.key}-${val}`}
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-white dark:bg-[#1a202c] border border-neutral-300 dark:border-neutral-600 text-neutral-800 dark:text-neutral-200 text-xs font-bold shadow-2xs"
              >
                <span className="text-[10px] text-neutral-500 dark:text-neutral-400 font-semibold">
                  {group.label}:
                </span>
                <span>{val}</span>
                <button
                  type="button"
                  onClick={() => onToggleFilter(group.key, val)}
                  className="hover:text-red-600 dark:hover:text-red-400 p-0.5"
                  title={`Remove ${val} filter`}
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ));
          })}
        </div>
      )}

      {/* Filter Body: 6 Dimensional Filter Columns */}
      {isExpanded && (
        <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {POLO_FILTER_CONFIG.map((group) => {
            const GroupIcon = group.icon;
            const activeItems = filters[group.key] || [];

            return (
              <div
                key={group.key}
                id={`filter-group-${group.key}`}
                className="bg-[#FBF9F5] dark:bg-[#141923] rounded-2xl p-4 border border-[#e5dfd3] dark:border-[#2b3545] flex flex-col justify-between space-y-3"
              >
                {/* Group Title */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <GroupIcon className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />
                    <span className="text-xs font-black uppercase tracking-wider text-neutral-800 dark:text-neutral-200 font-heading">
                      {group.label}
                    </span>
                  </div>
                  {activeItems.length > 0 && (
                    <span className="text-[10px] font-bold text-neutral-600 dark:text-neutral-400 bg-white dark:bg-[#1e2633] px-2 py-0.5 rounded-md border border-[#e5dfd3] dark:border-[#374151]">
                      {activeItems.length} picked
                    </span>
                  )}
                </div>

                {/* Options List */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {group.options.map((opt) => {
                    const isSelected = activeItems.includes(opt as any);
                    const countKey = `${group.key}:${opt}`;
                    const count = optionCounts[countKey] ?? 0;
                    const isDisabled = count === 0 && !isSelected;

                    return (
                      <button
                        key={opt}
                        type="button"
                        id={`filter-opt-${group.key}-${opt.replace(/\s+/g, '-').toLowerCase()}`}
                        onClick={() => onToggleFilter(group.key, opt)}
                        disabled={isDisabled}
                        className={`group relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                          isSelected
                            ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-sm ring-2 ring-neutral-900/20 dark:ring-white/20'
                            : isDisabled
                            ? 'opacity-40 bg-neutral-100 dark:bg-neutral-800 text-neutral-400 dark:text-neutral-600 cursor-not-allowed border border-transparent'
                            : 'bg-white dark:bg-[#1e2633] text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-[#252f40] border border-[#e5dfd3] dark:border-[#2d3748]'
                        }`}
                        title={
                          isDisabled
                            ? `No polo shirts currently match ${opt} with current filters`
                            : `Filter by ${group.label}: ${opt}`
                        }
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 shrink-0 stroke-[2.5]" />}
                        <span>{opt}</span>
                        <span
                          className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                            isSelected
                              ? 'bg-neutral-700 text-white dark:bg-neutral-200 dark:text-neutral-900'
                              : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 group-hover:bg-neutral-200 dark:group-hover:bg-neutral-700'
                          }`}
                        >
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
