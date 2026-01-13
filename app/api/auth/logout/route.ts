import { createServerClient } from "@/lib/supabase";
import { clearAuthCookies } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST() {
  try {
    const supabase = await createServerClient();
    await supabase.auth.signOut();
    await clearAuthCookies();

    return Response.json({ success: true });
  } catch (error) {
    console.error("Logout error:", error);
    return Response.json({ error: "Logout failed" }, { status: 500 });
  }
}
