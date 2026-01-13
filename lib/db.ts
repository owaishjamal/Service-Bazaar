import { createServerClient } from "./supabase";

// Supabase client for database operations
// Note: This is kept for backward compatibility, but API routes should use createServerClient() directly
export async function getDB() {
  return await createServerClient();
}

// Helper function to get current user from Supabase
export async function getCurrentUserFromDB() {
  const supabase = await getDB();
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) return null;
  
  // Get user profile
  const { data: profile } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();
  
  return profile;
}
