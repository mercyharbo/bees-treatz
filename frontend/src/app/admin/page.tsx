import React from 'react';

export default function AdminOrdersPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold">Kitchen Orders Feed</h1>
        <p className="text-sm text-muted-foreground">Manage incoming orders, update cooking status, and print receipts.</p>
      </div>
      <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-card p-12 text-center text-sm text-muted-foreground">
        Live Kitchen Orders board layout ready. Wire this to the backend API (`GET /api/orders`) once UI components are added.
      </div>
    </div>
  );
}
