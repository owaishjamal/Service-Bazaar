"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Users, TrendingUp } from "lucide-react";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState<"customer" | "vendor" | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedRole) {
      setError("Please select a role");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          name,
          role: selectedRole,
        }),
      });

      const data = await res.json();

      if (!res.ok && !data.requiresConfirmation) {
        setError(data.error || "Registration failed");
        setLoading(false);
        return;
      }

      if (data.requiresConfirmation) {
        // Show confirmation message
        alert("Please check your email to confirm your account, then sign in.");
        window.location.href = "/login";
        return;
      }

      // Registration successful, redirect based on role
      window.location.href = selectedRole === "vendor" ? "/vendor/dashboard" : "/marketplace";
    } catch (err) {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-background px-4 py-12">
      <div className="w-full max-w-md">
        <Card className="border-border bg-gradient-to-br from-card/50 to-card backdrop-blur-sm">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Create Account
              </h1>
              <p className="text-muted-foreground">Join our marketplace today</p>
            </div>

            {error && (
              <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Role Selection */}
              <div>
                <label className="block text-sm font-medium mb-3">
                  I want to
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
                    <div className="font-semibold text-sm">Buy Services</div>
                    <div className="text-xs mt-1 text-muted-foreground">As Customer</div>
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
                    <div className="font-semibold text-sm">Sell Services</div>
                    <div className="text-xs mt-1 text-muted-foreground">As Vendor</div>
                  </button>
                </div>
              </div>

              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={loading}
                  className="w-full px-4 py-3 bg-secondary border border-border rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition disabled:opacity-50"
                  placeholder="John Doe"
                />
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
                  minLength={6}
                  disabled={loading}
                  className="w-full px-4 py-3 bg-secondary border border-border rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition disabled:opacity-50"
                  placeholder="••••••"
                />
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                  disabled={loading}
                  className="w-full px-4 py-3 bg-secondary border border-border rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition disabled:opacity-50"
                  placeholder="••••••"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading || !selectedRole}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 rounded-xl font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-cyan-500/50"
              >
                {loading ? "Creating account..." : "Create Account"}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link href="/login" className="text-cyan-400 font-semibold hover:text-cyan-300">
                  Sign in
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
