import React from 'react';

export default function OrderStatusPage({
  params,
}: {
  params: { orderId: string };
}) {
  return (
    <div className="container mx-auto max-w-2xl px-4 pt-28 pb-16">
      <div className="rounded-3xl border border-gray-200/80 dark:border-white/10 bg-white dark:bg-gray-900/60 dark:backdrop-blur-xl shadow-none p-8 sm:p-12 text-center space-y-4">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15 text-3xl text-emerald-600 dark:text-emerald-400">
          ✓
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Order #{params.orderId}</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto">
            Live status tracking page ready for Bee&apos;s Treatz kitchen progress updates.
          </p>
        </div>
      </div>
    </div>
  );
}
