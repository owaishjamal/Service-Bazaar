"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Service {
  id: string;
  title: string;
  category: string;
  description: string;
  deliveryType: string;
  basePrice: number;
  createdAt: number;
}

interface Order {
  id: string;
  serviceTitle: string;
  customerName: string;
  status: string;
  createdAt: number;
}

export default function SellerDashboard() {
  const [user, setUser] = useState<any>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const router = useRouter();

  const checkAuth = useCallback(async () => {
    const res = await fetch("/api/auth/me");
    const data = await res.json();
    
    if (!data.user || data.user.role !== "seller") {
      router.push("/login");
      return;
    }

    setUser(data.user);
    loadData();
  }, [router]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  async function loadData() {
    try {
      const [servicesRes, ordersRes] = await Promise.all([
        fetch("/api/seller/services"),
        fetch("/api/seller/orders"),
      ]);

      const servicesData = await servicesRes.json();
      const ordersData = await ordersRes.json();

      setServices(servicesData.services || []);
      setOrders(ordersData.orders || []);
      setLoading(false);
    } catch (error) {
      console.error("Error loading data:", error);
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Seller Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage your services and orders</p>
        </div>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition shadow-lg"
        >
          {showCreateForm ? "Cancel" : "+ Create Service"}
        </button>
      </div>

      {showCreateForm && (
        <ServiceCreateForm
          onSuccess={() => {
            setShowCreateForm(false);
            loadData();
          }}
        />
      )}

      <div className="grid lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">My Services</h2>
          <div className="space-y-3">
            {services.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                <p className="text-gray-500">No services yet. Create your first service!</p>
              </div>
            ) : (
              services.map((service) => (
                <Link
                  key={service.id}
                  href={`/service/${service.id}`}
                  className="block bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{service.title}</h3>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">{service.description}</p>
                      <div className="flex items-center gap-3 mt-3">
                        <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                          {service.category}
                        </span>
                        <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded-full">
                          {service.deliveryType}
                        </span>
                        <span className="text-sm font-semibold text-gray-900">₹{service.basePrice}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Orders</h2>
          <div className="space-y-3">
            {orders.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                <p className="text-gray-500">No orders yet.</p>
              </div>
            ) : (
              orders.map((order) => (
                <Link
                  key={order.id}
                  href={`/orders/${order.id}`}
                  className="block bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{order.serviceTitle}</h3>
                      <p className="text-sm text-gray-600 mt-1">Customer: {order.customerName}</p>
                      <div className="flex items-center gap-2 mt-3">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          order.status === "COMPLETED" ? "bg-green-100 text-green-700" :
                          order.status === "IN_PROGRESS" ? "bg-blue-100 text-blue-700" :
                          order.status === "PLACED" ? "bg-yellow-100 text-yellow-700" :
                          "bg-gray-100 text-gray-700"
                        }`}>
                          {order.status}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ServiceCreateForm({ onSuccess }: { onSuccess: () => void }) {
  const [formData, setFormData] = useState({
    title: "",
    category: "Design",
    description: "",
    deliveryType: "digital",
    basePrice: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/seller/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          basePrice: parseInt(formData.basePrice),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to create service");
        setLoading(false);
        return;
      }

      onSuccess();
    } catch (err) {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-lg">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Create New Service</h3>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Service Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
            placeholder="e.g., Logo Design Service"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
            >
              <option value="Design">Design</option>
              <option value="Coding">Coding</option>
              <option value="Academics">Academics</option>
              <option value="Delivery">Delivery</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Type</label>
            <select
              value={formData.deliveryType}
              onChange={(e) => setFormData({ ...formData, deliveryType: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
            >
              <option value="digital">Digital</option>
              <option value="physical">Physical</option>
              <option value="hybrid">Hybrid</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
            placeholder="Describe your service in detail..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Base Price (₹)</label>
          <input
            type="number"
            value={formData.basePrice}
            onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
            required
            min="1"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
            placeholder="999"
          />
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Service"}
          </button>
        </div>
      </form>
    </div>
  );
}

