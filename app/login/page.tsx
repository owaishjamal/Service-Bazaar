"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Users, TrendingUp } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState<"customer" | "vendor" | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedRole) {
      setError("Please select a role");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Login with credentials
      const loginRes = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role: selectedRole }),
      });

      const loginData = await loginRes.json();

      if (!loginRes.ok) {
        setError(loginData.error || "Login failed");
        setLoading(false);
        return;
      }

      // Redirect based on selected role
      window.location.href = selectedRole === "vendor" ? "/vendor/dashboard" : "/marketplace";
    } catch (err) {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-background px-4">
      <div className="w-full max-w-md">
        <Card className="border-border bg-gradient-to-br from-card/50 to-card backdrop-blur-sm">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Welcome Back
              </h1>
              <p className="text-muted-foreground">Sign in to your account</p>
            </div>

            {error && (
              <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Role Selection */}
              <div>
                <label className="block text-sm font-medium mb-3">
                  I want to sign in as
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedRole("customer")}
                    className={`p-4 rounded-xl border-2 transition ${
                      selectedRole === "customer"
                        ? "border-cyan-500 bg-cyan-500/10 text-cyan-400"
                        : "border-border hover:border-zinc-600"
                    }`}
                  >
                    <Users className="h-5 w-5 mx-auto mb-2" />
                    <div className="font-semibold text-sm">Customer</div>
                    <div className="text-xs mt-1 text-muted-foreground">Browse & Order</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedRole("vendor")}
                    className={`p-4 rounded-xl border-2 transition ${
                      selectedRole === "vendor"
                        ? "border-purple-500 bg-purple-500/10 text-purple-400"
                        : "border-border hover:border-zinc-600"
                    }`}
                  >
                    <TrendingUp className="h-5 w-5 mx-auto mb-2" />
                    <div className="font-semibold text-sm">Vendor</div>
                    <div className="text-xs mt-1 text-muted-foreground">Manage & Sell</div>
                  </button>
                </div>
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  className="w-full px-4 py-3 bg-secondary border border-border rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition disabled:opacity-50"
                  placeholder="you@example.com"
                />
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-2">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  className="w-full px-4 py-3 bg-secondary border border-border rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition disabled:opacity-50"
                  placeholder="••••••••"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading || !selectedRole}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 rounded-xl font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-cyan-500/50"
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link href="/register" className="text-cyan-400 font-semibold hover:text-cyan-300">
                  Sign up
                </Link>
              </p>
            </div>

            <div className="mt-6 pt-6 border-t border-border">
              <div className="text-center">
                <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
                  ← Back to home
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
