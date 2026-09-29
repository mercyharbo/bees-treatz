'use client';

import React from 'react';
import { Check } from 'lucide-react';
import { OptionGroup } from '@/types/menu';
import { useMenuStore } from '@/store/useMenuStore';
import { cn } from '@/lib/utils';

interface OptionGroupRadioProps {
  group: OptionGroup;
}

export function OptionGroupRadio({ group }: OptionGroupRadioProps) {
  const selectedOptions = useMenuStore((state) => state.selectedOptions);
  const selectOption = useMenuStore((state) => state.selectOption);

  const selectedForGroup = selectedOptions[group.id]?.optionName;

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
          {group.name}
        </label>
        {group.required && (
          <span className="text-[10px] font-semibold text-orange-600 dark:text-orange-400">
            Required
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {group.options.map((opt) => {
          const isSelected = selectedForGroup === opt.name;
          const hasAddPrice = opt.additionalPrice > 0;

          return (
            <button
              key={opt.id}
              type="button"
              onClick={() =>
                selectOption(
                  group.id,
                  group.name,
                  opt.name,
                  opt.additionalPrice
                )
              }
              className={cn(
                'p-3 rounded-xl border text-left text-xs font-semibold transition-all flex items-center justify-between cursor-pointer',
                isSelected
                  ? 'border-orange-500 bg-orange-50/70 dark:bg-orange-950/30 text-orange-900 dark:text-orange-200'
                  : 'border-gray-200 dark:border-white/10 bg-gray-50/40 dark:bg-gray-800/40 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-white/20'
              )}
            >
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    'w-4 h-4 rounded-full border flex items-center justify-center transition-colors shrink-0',
                    isSelected
                      ? 'border-orange-600 bg-orange-600 text-white'
                      : 'border-gray-300 dark:border-gray-600 bg-transparent'
                  )}
                >
                  {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                </div>
                <span>{opt.name}</span>
              </div>

              {hasAddPrice && (
                <span className="text-[11px] font-bold text-orange-600 dark:text-orange-400 shrink-0">
                  +£{opt.additionalPrice.toFixed(2)}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
