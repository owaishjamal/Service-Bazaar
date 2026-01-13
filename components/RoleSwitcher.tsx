"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, Store, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import { UserRole } from "@/lib/auth";

interface RoleSwitcherProps {
  onRoleChange?: (role: UserRole) => void;
}

export function RoleSwitcher({ onRoleChange }: RoleSwitcherProps) {
  const [role, setRole] = useState<UserRole>("customer");
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("dev-role") as UserRole | null;
    if (stored && ["customer", "vendor", "seller", "admin"].includes(stored)) {
      setRole(stored);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("dev-role", role);
    onRoleChange?.(role);
  }, [role, onRoleChange]);

  const roles: { value: UserRole; label: string; icon: React.ReactNode; color: string }[] = [
    { value: "customer", label: "Customer", icon: <User className="h-4 w-4" />, color: "bg-blue-500" },
    { value: "vendor", label: "Vendor", icon: <Store className="h-4 w-4" />, color: "bg-purple-500" },
    { value: "admin", label: "Admin", icon: <Shield className="h-4 w-4" />, color: "bg-red-500" },
  ];

  const currentRole = roles.find((r) => r.value === role);

  return (
    <div
      className={cn(
        "fixed bottom-6 right-6 z-50 transition-all duration-300",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
      )}
    >
      <div className="bg-card border-2 border-border rounded-xl shadow-2xl p-3 flex flex-col gap-2 min-w-[200px] backdrop-blur-xl bg-card/95">
        <div className="flex items-center justify-between px-2 py-1">
          <span className="text-xs font-semibold text-muted-foreground">DEV MODE</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => setIsVisible(!isVisible)}
          >
            ×
          </Button>
        </div>
        <div className="space-y-1">
          {roles.map((r) => (
            <button
              key={r.value}
              onClick={() => setRole(r.value)}
              className={cn(
                "w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all",
                role === r.value
                  ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                  : "hover:bg-secondary text-muted-foreground hover:text-foreground"
              )}
            >
              <div className={cn("p-1 rounded", r.color)}>{r.icon}</div>
              <span>{r.label}</span>
              {role === r.value && (
                <Badge variant="secondary" className="ml-auto text-xs">
                  Active
                </Badge>
              )}
            </button>
          ))}
        </div>
        <div className="px-2 pt-2 border-t border-border">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className={cn("h-2 w-2 rounded-full", currentRole?.color)} />
            <span>Current: {currentRole?.label}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function useRole(): UserRole {
  const [role, setRole] = useState<UserRole>("customer");

  useEffect(() => {
    const stored = localStorage.getItem("dev-role") as UserRole | null;
    if (stored && ["customer", "vendor", "seller", "admin"].includes(stored)) {
      setRole(stored);
    }
    const handleStorageChange = () => {
      const updated = localStorage.getItem("dev-role") as UserRole | null;
      if (updated && ["customer", "vendor", "seller", "admin"].includes(updated)) {
        setRole(updated);
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return role;
}
