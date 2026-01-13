import { createServerClient } from "@/lib/supabase";
import { getCurrentUser } from "@/lib/auth";
import { cookies } from "next/headers";
import { z } from "zod";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const schema = z.object({
      role: z.enum(["customer", "vendor"]),
    });

    const { role } = schema.parse(await req.json());

    const supabase = await createServerClient();
    
    // Verify user has this role
    const { data: profile } = await supabase
      .from("profiles")
      .select("roles, role")
      .eq("id", user.id)
      .single();

    // Get available roles as strings
    let availableRoles: string[] = [];
    if (profile) {
      if (profile.roles && Array.isArray(profile.roles) && profile.roles.length > 0) {
        availableRoles = profile.roles.map((r: any) => String(r));
      } else if (profile.role) {
        availableRoles = [String(profile.role)];
      } else {
        availableRoles = ["customer"];
      }
    } else {
      availableRoles = ["customer"];
    }

    // Check if user has access to the requested role
    const hasRole = availableRoles.some((r) => r.toLowerCase() === role.toLowerCase());
    if (!hasRole) {
      return Response.json({ error: "You don't have access to this role" }, { status: 403 });
    }

    // Store active role in cookie
    const cookieStore = await cookies();
    cookieStore.set("active-role", role, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });

    return Response.json({ success: true, role });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json({ error: "Invalid input", details: error.errors }, { status: 400 });
    }
    console.error("Set role error:", error);
    return Response.json({ error: "Failed to set role" }, { status: 500 });
  }
}
