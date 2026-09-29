'use client';

import React, { useState } from 'react';
import { Minus, Plus, ShoppingBag, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MenuItem, OptionGroup } from '@/types/menu';
import { useMenuStore } from '@/store/useMenuStore';
import { cn } from '@/lib/utils';

interface MenuDetailsOptionsProps {
  item: MenuItem;
}

export function MenuDetailsOptions({ item }: MenuDetailsOptionsProps) {
  const [justAdded, setJustAdded] = useState(false);
  const selectedOptions = useMenuStore((state) => state.selectedOptions);
  const quantity = useMenuStore((state) => state.customizationQuantity);
  const notes = useMenuStore((state) => state.customizationNotes);

  const selectOption = useMenuStore((state) => state.selectOption);
  const setQuantity = useMenuStore((state) => state.setCustomizationQuantity);
  const setNotes = useMenuStore((state) => state.setCustomizationNotes);
  const addToCart = useMenuStore((state) => state.addCustomizedItemToCart);
  const initItemDetails = useMenuStore((state) => state.initItemDetails);

  // Filter for direct Size and Spice Level groups per design
  const allGroups = item.optionGroups || [];
  const sizeAndSpiceGroups = allGroups.filter((g) => {
    const lower = g.name.toLowerCase();
    return lower.includes('size') || lower.includes('tub') || lower.includes('portion') || lower.includes('spice');
  });
  const groupsToDisplay: OptionGroup[] = sizeAndSpiceGroups.length > 0 ? sizeAndSpiceGroups : allGroups;

  const additionalTotal = Object.values(selectedOptions).reduce(
    (sum, opt) => sum + (Number(opt.additionalPrice) || 0),
    0
  );
  const unitPrice = item.basePrice + additionalTotal;
  const totalPrice = unitPrice * quantity;

  const handleAddToCart = () => {
    if (useMenuStore.getState().selectedItemForCustomization?.id !== item.id) {
      initItemDetails(item);
    }
    addToCart();
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  };

  return (
    <div className="space-y-5 pt-3">
      {/* Compact Segmented Pills for Size & Spice */}
      {groupsToDisplay.map((group) => {
        const selectedOptName = selectedOptions[group.id]?.optionName;
        return (
          <div key={group.id} className="space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              {group.name}
            </span>
            <div className="flex flex-wrap gap-2">
              {group.options.map((opt) => {
                const isSelected = selectedOptName === opt.name;
                const hasAddPrice = opt.additionalPrice > 0;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => selectOption(group.id, group.name, opt.name, opt.additionalPrice)}
                    className={cn(
                      'px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer border',
                      isSelected
                        ? 'bg-orange-500 text-white border-orange-500 shadow-sm'
                        : 'bg-gray-100 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-white/10 hover:border-gray-300'
                    )}
                  >
                    <span>{opt.name}</span>
                    {hasAddPrice && (
                      <span className={cn('ml-1 text-[10px]', isSelected ? 'text-white/90' : 'text-orange-500')}>
                        +£{opt.additionalPrice.toFixed(2)}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Allergies & Special Notes Textarea */}
      <div className="space-y-1.5">
        <label htmlFor="allergy-notes" className="text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
          Allergies & Special Instructions
        </label>
        <textarea
          id="allergy-notes"
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Any allergies, dietary restrictions, or notes for the admin & kitchen (e.g. no shellfish, extra spicy)..."
          className="w-full rounded-xl border border-gray-200 dark:border-white/15 bg-gray-50/50 dark:bg-gray-800/50 px-3.5 py-2.5 text-xs text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all resize-none"
        />
      </div>

      {/* Total Price on Top, Stepper & Add to Order underneath */}
      <div className="pt-3 border-t border-gray-100 dark:border-white/10 space-y-3">
        <div>
          <span className="text-[10px] uppercase tracking-wider font-semibold text-gray-400 block">
            Total
          </span>
          <span className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
            £{totalPrice.toFixed(2)}
          </span>
        </div>

        {/* Stepper (rounded only) & Solid Orange Add to Order Button underneath price */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 border border-gray-200 dark:border-white/15 rounded p-1 bg-gray-50/60 dark:bg-gray-800/40 shrink-0">
            <button
              type="button"
              onClick={() => setQuantity(quantity - 1)}
              disabled={quantity <= 1}
              className="w-9 h-9 rounded flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700 disabled:opacity-30 transition-colors cursor-pointer"
              aria-label="Decrease quantity"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-8 text-center text-sm font-extrabold text-gray-900 dark:text-white">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity(quantity + 1)}
              className="w-9 h-9 rounded flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700 transition-colors cursor-pointer"
              aria-label="Increase quantity"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          <Button
            type="button"
            onClick={handleAddToCart}
            className="flex-1 h-11 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 cursor-pointer shadow-none"
          >
            {justAdded ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Added!</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Order</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
