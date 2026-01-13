import { createServerClient } from "@/lib/supabase";
import { setAuthCookies } from "@/lib/auth";
import { z } from "zod";
import { cookies } from "next/headers";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const schema = z.object({
      email: z.string().email(),
      password: z.string().min(1),
      role: z.enum(["customer", "vendor"]),
    });

    const { email, password, role } = schema.parse(await req.json());

    const supabase = await createServerClient();

    // Sign in with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      return Response.json({ error: "Invalid email or password" }, { status: 401 });
    }

    if (!authData.user || !authData.session) {
      return Response.json({ error: "Login failed" }, { status: 500 });
    }

    // Set auth cookies
    await setAuthCookies(authData.session.access_token, authData.session.refresh_token);

    // Set the active role cookie - this is what the user selected
    const cookieStore = await cookies();
    cookieStore.set("active-role", role, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

    // IMPORTANT: Update profile role in database
    // This is required for RLS policies to work correctly
    // We need to set the session first so RLS allows the update
    await supabase.auth.setSession({
      access_token: authData.session.access_token,
      refresh_token: authData.session.refresh_token,
    });

    // Now update the profile role
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ role: role })
      .eq("id", authData.user.id);

    if (updateError) {
      console.log("Could not update profile role:", updateError);
      // Don't fail - try to create profile if it doesn't exist
      const { error: insertError } = await supabase
        .from("profiles")
        .insert({
          id: authData.user.id,
          role: role,
          full_name: authData.user.user_metadata?.name || "User",
          trust_score: 100,
          skills: [],
        });
      
      if (insertError) {
        console.log("Could not insert profile:", insertError);
      }
    }

    // Get user profile for display name
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name, role")
      .eq("id", authData.user.id)
      .single();

    // Return user data
    return Response.json({
      user: {
        id: authData.user.id,
        email: authData.user.email || "",
        name: profile?.full_name || authData.user.user_metadata?.name || "User",
        role: role,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json({ error: "Invalid input", details: error.errors }, { status: 400 });
    }
    console.error("Login error:", error);
    return Response.json({ error: "Login failed" }, { status: 500 });
  }
}
