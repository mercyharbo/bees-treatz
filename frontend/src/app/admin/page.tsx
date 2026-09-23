import React from 'react';

export default function AdminOrdersPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Kitchen Orders Feed</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Manage incoming orders, update cooking status, and print receipts.</p>
      </div>
      <div className="rounded-3xl border border-gray-200/80 dark:border-white/10 bg-white dark:bg-gray-900/60 dark:backdrop-blur-xl shadow-none p-12 text-center text-sm text-gray-600 dark:text-gray-400">
        Live Kitchen Orders board layout ready. Wire this to the backend API (`GET /api/orders`) once UI components are added.
      </div>
    </div>
  );
}
