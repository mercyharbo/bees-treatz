import React from 'react';

export default function CheckoutPage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 pt-28 pb-16 space-y-6">
      <div className="space-y-1">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Checkout</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Complete your order with UK delivery or collection.</p>
      </div>
      <div className="rounded-3xl border border-gray-200/80 dark:border-white/10 bg-white dark:bg-gray-900/60 dark:backdrop-blur-xl shadow-none p-8 text-center text-sm text-gray-600 dark:text-gray-400">
        Checkout view structure ready. Connect your customer cart and Stripe card element here.
      </div>
    </div>
  );
}
