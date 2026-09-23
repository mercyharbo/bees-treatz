import React from 'react';

export default function OrderStatusPage({
  params,
}: {
  params: { orderId: string };
}) {
  return (
    <div className="container mx-auto max-w-2xl px-4 py-16 text-center space-y-4">
      <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-3xl text-emerald-600">
        ✓
      </div>
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Order #{params.orderId}</h1>
        <p className="text-sm text-muted-foreground">
          Live status tracking page ready for Bee&apos;s Treatz kitchen progress updates.
        </p>
      </div>
    </div>
  );
}
