"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Order {
  id: string;
  serviceTitle: string;
  sellerName: string;
  status: string;
  createdAt: number;
}

export default function OrdersPage() {
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const checkAuth = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      
      if (!data.user) {
        router.push("/login");
        return;
      }

      // Allow both "customer" role and check if user is authenticated
      const userRole = data.user.role;
      if (userRole !== "customer" && userRole !== "vendor" && userRole !== "admin") {
        router.push("/login");
        return;
      }

      setUser(data.user);
      loadOrders();
    } catch (error) {
      console.error("Auth check error:", error);
      router.push("/login");
    }
  }, [router]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  async function loadOrders() {
    try {
      const res = await fetch("/api/customer/orders");
      const data = await res.json();
      setOrders(data.orders || []);
      setLoading(false);
    } catch (error) {
      console.error("Error loading orders:", error);
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">My Orders</h1>
        <p className="text-muted-foreground">Track all your service orders</p>
      </div>

      {orders.length === 0 ? (
        <div className="bg-gradient-to-br from-card/50 to-card rounded-xl border-2 border-border p-12 text-center backdrop-blur-sm">
          <p className="text-muted-foreground text-lg mb-6">You haven&apos;t placed any orders yet.</p>
          <Link
            href="/"
            className="inline-block px-8 py-4 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-primary-foreground rounded-xl font-semibold shadow-lg shadow-cyan-500/30 hover:shadow-xl transition-all hover-lift"
          >
            Browse Services
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/orders/${order.id}`}
              className="block bg-gradient-to-br from-card/50 to-card rounded-xl border-2 border-border p-6 hover:border-cyan-500/50 hover:shadow-xl hover:shadow-cyan-500/20 transition-all hover-lift backdrop-blur-sm"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground text-lg mb-2">{order.serviceTitle}</h3>
                  <p className="text-sm text-muted-foreground">Seller: {order.sellerName}</p>
                  <div className="flex items-center gap-3 mt-4">
                    <span className={`text-xs px-3 py-1.5 rounded-full font-medium ${
                      order.status === "COMPLETED" ? "bg-green-500/20 text-green-400 border border-green-500/30" :
                      order.status === "IN_PROGRESS" ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30" :
                      order.status === "PLACED" ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30" :
                      order.status === "DISPUTE_OPEN" ? "bg-red-500/20 text-red-400 border border-red-500/30" :
                      "bg-secondary text-muted-foreground border border-border"
                    }`}>
                      {order.status.replace(/_/g, " ")}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Ordered on {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="text-cyan-400 ml-4">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

