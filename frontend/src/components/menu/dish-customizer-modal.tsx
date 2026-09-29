'use client';

import React from 'react';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMenuStore } from '@/store/useMenuStore';
import { OptionGroupRadio } from './option-group-radio';

export function DishCustomizerModal() {
  const isOpen = useMenuStore((state) => state.isCustomizerOpen);
  const item = useMenuStore((state) => state.selectedItemForCustomization);
  const selectedOptions = useMenuStore((state) => state.selectedOptions);
  const quantity = useMenuStore((state) => state.customizationQuantity);
  const notes = useMenuStore((state) => state.customizationNotes);

  const closeCustomizer = useMenuStore((state) => state.closeCustomizer);
  const setQuantity = useMenuStore((state) => state.setCustomizationQuantity);
  const setNotes = useMenuStore((state) => state.setCustomizationNotes);
  const addToCart = useMenuStore((state) => state.addCustomizedItemToCart);

  if (!isOpen || !item) return null;

  const additionalTotal = Object.values(selectedOptions).reduce(
    (sum, opt) => sum + (Number(opt.additionalPrice) || 0),
    0
  );
  const unitPrice = item.basePrice + additionalTotal;
  const totalPrice = unitPrice * quantity;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-xl max-h-[90vh] flex flex-col rounded-2xl border border-gray-200/80 dark:border-white/10 bg-white dark:bg-gray-900 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-gray-100 dark:border-white/10 flex items-start justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-lg font-extrabold text-gray-900 dark:text-white">
              {item.name}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
              {item.description}
            </p>
          </div>
          <button
            type="button"
            onClick={closeCustomizer}
            className="p-1 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Options Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {item.optionGroups &&
            item.optionGroups.map((group) => (
              <OptionGroupRadio key={group.id} group={group} />
            ))}

          {/* Kitchen Notes */}
          <div className="space-y-2">
            <label
              htmlFor="special-instructions"
              className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300"
            >
              Special Instructions (Optional)
            </label>
            <textarea
              id="special-instructions"
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Extra spicy, separate swallow, allergen precautions..."
              className="w-full rounded-xl border border-gray-200 dark:border-white/15 bg-white dark:bg-gray-900 px-3 py-2 text-xs text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
        </div>

        {/* Footer / Add to Cart CTA */}
        <div className="p-4 sm:p-5 border-t border-gray-100 dark:border-white/10 bg-gray-50/50 dark:bg-gray-900/80 flex items-center justify-between gap-4">
          {/* Quantity Controls */}
          <div className="flex items-center gap-2 border border-gray-200 dark:border-white/15 rounded-xl p-1 bg-white dark:bg-gray-800">
            <button
              type="button"
              onClick={() => setQuantity(quantity - 1)}
              disabled={quantity <= 1}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-30 cursor-pointer"
              aria-label="Decrease quantity"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-6 text-center text-xs font-extrabold text-gray-900 dark:text-white">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity(quantity + 1)}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
              aria-label="Increase quantity"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Add Button */}
          <Button
            type="button"
            onClick={addToCart}
            className="flex-1 text-xs font-bold h-10 px-5 flex items-center justify-center gap-2 cursor-pointer shadow-none"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Add to Order • £{totalPrice.toFixed(2)}</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
