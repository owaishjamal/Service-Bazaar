import { createServerClient } from "./supabase";
import { cookies } from "next/headers";

export type UserRole = "customer" | "vendor" | "admin";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  created_at?: string;
  createdAt?: number;
}

// Get Supabase client with user's session
export async function getSupabaseClient() {
  const supabase = createServerClient();
  return supabase;
}

// Get current authenticated user
export async function getCurrentUser(): Promise<User | null> {
  try {
    const supabase = await getSupabaseClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error || !user) return null;
    
    // Get active role from cookie (this is what the user selected during login)
    const cookieStore = await cookies();
    const activeRole = cookieStore.get("active-role")?.value as UserRole | undefined;
    
    // Get user profile from profiles table
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name, role, created_at")
      .eq("id", user.id)
      .single();
    
    // Role priority: cookie > profile > metadata > default
    const role = activeRole || profile?.role || (user.user_metadata?.role as UserRole) || "customer";
    
    return {
      id: user.id,
      email: user.email || "",
      name: profile?.full_name || user.user_metadata?.name || user.user_metadata?.full_name || "User",
      role: role,
      created_at: profile?.created_at,
    };
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
}

// Helper to set auth cookies
export async function setAuthCookies(accessToken: string, refreshToken: string) {
  const cookieStore = await cookies();
  cookieStore.set("sb-access-token", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60, // 7 days
    path: "/",
  });
  cookieStore.set("sb-refresh-token", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60, // 7 days
    path: "/",
  });
}

// Helper to clear auth cookies
export async function clearAuthCookies() {
  const cookieStore = await cookies();
  cookieStore.delete("sb-access-token");
  cookieStore.delete("sb-refresh-token");
  cookieStore.delete("active-role");
}
