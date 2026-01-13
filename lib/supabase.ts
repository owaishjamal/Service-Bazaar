import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY");
}

// Only set TLS rejection if explicitly enabled via environment variable
// This prevents the warning in production while allowing dev workarounds
// To enable: set ALLOW_INSECURE_TLS=true in your .env.local (NOT recommended for production)
if (process.env.ALLOW_INSECURE_TLS === 'true' && typeof process !== 'undefined' && process.env.NODE_ENV === 'development') {
  // @ts-ignore - Node.js global
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
  console.warn('⚠️  TLS certificate verification is disabled. This should only be used in development.');
}

// Server-side client (for API routes)
export async function createServerClient() {
  const cookieStore = await cookies();
  
  // Create Supabase client with retry logic
  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
    db: {
      schema: 'public',
    },
  });

  // Get session from cookies if available
  const accessToken = cookieStore.get("sb-access-token")?.value;
  const refreshToken = cookieStore.get("sb-refresh-token")?.value;

  if (accessToken && refreshToken) {
    try {
      const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      });
      
      if (sessionError) {
        // Try to refresh the session
        const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession({
          refresh_token: refreshToken,
        });
        
        if (refreshError || !refreshData.session) {
          // Session expired, clear cookies
          cookieStore.delete("sb-access-token");
          cookieStore.delete("sb-refresh-token");
        } else {
          // Update cookies with new session
          cookieStore.set("sb-access-token", refreshData.session.access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60,
            path: "/",
          });
          cookieStore.set("sb-refresh-token", refreshData.session.refresh_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60,
            path: "/",
          });
        }
      } else if (sessionData.session) {
        // Session is valid, ensure cookies are set
        cookieStore.set("sb-access-token", sessionData.session.access_token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 7 * 24 * 60 * 60,
          path: "/",
        });
        cookieStore.set("sb-refresh-token", sessionData.session.refresh_token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 7 * 24 * 60 * 60,
          path: "/",
        });
      }
    } catch (error) {
      // Session might be expired, clear cookies
      console.error("Error setting session:", error);
      cookieStore.delete("sb-access-token");
      cookieStore.delete("sb-refresh-token");
    }
  }

  return supabase;
}

// Client-side client (for browser)
export function createBrowserClient() {
  return createClient(supabaseUrl, supabaseAnonKey);
}

// Helper function to retry Supabase operations on network errors
export async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries = 3,
  delay = 1000
): Promise<T> {
  let lastError: Error | null = null;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error: any) {
      lastError = error;
      
      // Check if it's a network error that we should retry
      const isNetworkError = 
        error?.code === 'UND_ERR_SOCKET' ||
        error?.message?.includes('fetch failed') ||
        error?.message?.includes('ECONNRESET') ||
        error?.message?.includes('ETIMEDOUT');
      
      if (!isNetworkError || attempt === maxRetries) {
        throw error;
      }
      
      // Wait before retrying (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, delay * attempt));
    }
  }
  
  throw lastError || new Error('Operation failed after retries');
}
