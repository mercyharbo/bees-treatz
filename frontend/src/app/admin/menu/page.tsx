import React from 'react';

export default function AdminMenuPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold">Menu &amp; Stock Availability</h1>
        <p className="text-sm text-muted-foreground">Toggle items sold out when the kitchen runs low on ingredients.</p>
      </div>
      <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-card p-12 text-center text-sm text-muted-foreground">
        Menu item availability controls ready. Connect with backend API (`PATCH /api/menu/:id/availability`).
      </div>
    </div>
  );
}
