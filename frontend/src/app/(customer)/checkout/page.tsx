import React from 'react';

export default function CheckoutPage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-8 space-y-6">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold">Checkout</h1>
        <p className="text-sm text-muted-foreground">Complete your order with UK delivery or collection.</p>
      </div>
      <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-6 text-center text-sm text-muted-foreground">
        Checkout view structure ready. Connect your customer cart and Stripe card element here.
      </div>
    </div>
  );
}
