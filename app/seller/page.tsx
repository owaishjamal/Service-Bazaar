"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function Seller() {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch("/api/orders");
        if (!r.ok) {
          console.error("Failed to load orders:", r.statusText);
          return;
        }
        const j = await r.json();
        setOrders(j.orders || []);
      } catch (error) {
        console.error("Error loading orders:", error);
      }
    })();
  }, []);

  return (
    <div className="space-y-4">
      <div className="rounded-3xl border p-6">
        <div className="text-2xl font-semibold">Seller dashboard</div>
        <div className="text-gray-600 mt-1">Accept and update milestones with proof.</div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {orders.map((o) => (
          <Link key={o.id} href={`/orders/${o.id}`} className="rounded-2xl border p-4 hover:shadow-sm transition">
            <div className="font-semibold">{o.serviceTitle}</div>
            <div className="text-sm text-gray-600 mt-1">
              Buyer: {o.buyerName} • Seller: {o.sellerName}
            </div>
            <div className="text-xs text-gray-600 mt-2">Status: {o.status}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
