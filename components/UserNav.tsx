"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LogOut, User } from "lucide-react";

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

export function UserNav() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const response = await fetch("/api/auth/me");
      const data = await response.json();
      if (data.user) {
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Error checking user:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", { method: "POST" });
      if (response.ok) {
        setUser(null);
        // Clear any client-side storage
        if (typeof window !== "undefined") {
          sessionStorage.clear();
        }
        router.push("/");
        router.refresh();
        // Force a page reload to clear all state
        window.location.href = "/";
      }
    } catch (error) {
      console.error("Error logging out:", error);
      // Even if API fails, clear local state
      setUser(null);
      router.push("/");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-4">
        <div className="h-8 w-8 rounded-full bg-secondary animate-pulse" />
      </div>
    );
  }

  if (user) {
    const initials = user.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

    return (
      <div className="flex items-center gap-4">
        <Link href="/dashboard" className="hidden md:flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <Avatar className="h-8 w-8 border border-zinc-700">
            <AvatarFallback className="bg-gradient-to-br from-cyan-500/20 to-cyan-600/20 text-cyan-400 text-xs font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <span className="hidden lg:inline">{user.name}</span>
        </Link>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className="hidden md:flex items-center gap-2"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden lg:inline">Sign Out</span>
        </Button>
      </div>
    );
  }

  return (
    <Link href="/login">
      <Button variant="outline" className="hidden md:flex">
        Sign In
      </Button>
    </Link>
  );
}
