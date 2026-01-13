import { createServerClient } from "@/lib/supabase";
import { setAuthCookies } from "@/lib/auth";
import { z } from "zod";
import { cookies } from "next/headers";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const schema = z.object({
      email: z.string().email(),
      password: z.string().min(6),
      name: z.string().min(1),
      role: z.enum(["customer", "vendor"]),
    });

    const { email, password, name, role } = schema.parse(await req.json());

    const supabase = await createServerClient();

    // Sign up user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          role,
        },
      },
    });

    if (authError) {
      return Response.json({ error: authError.message }, { status: 400 });
    }

    if (!authData.user) {
      return Response.json({ error: "Registration failed" }, { status: 500 });
    }

    // If no session (email confirmation required), return early
    if (!authData.session) {
      return Response.json({ 
        error: "Please check your email to confirm your account. Then you can sign in.",
        requiresConfirmation: true,
        user: {
          id: authData.user.id,
          email: authData.user.email || "",
          name: name,
          role: role,
        }
      }, { status: 200 });
    }

    // Set auth cookies
    await setAuthCookies(authData.session.access_token, authData.session.refresh_token);

    // Set the active role cookie
    const cookieStore = await cookies();
    cookieStore.set("active-role", role, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

    // Wait a moment for any database triggers
    await new Promise(resolve => setTimeout(resolve, 500));

    // Try to create/update profile with the selected role
    // Method 1: Try direct insert
    const { error: insertError } = await supabase
      .from("profiles")
      .insert({
        id: authData.user.id,
        role: role,
        full_name: name,
        trust_score: 100,
        skills: [],
      });

    if (insertError) {
      // Profile might already exist (from trigger), try update
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ role: role, full_name: name })
        .eq("id", authData.user.id);
      
      if (updateError) {
        console.log("Could not update profile:", updateError);
        // Don't fail - the cookie role is what matters
      }
    }

    // Return success
    return Response.json({
      user: {
        id: authData.user.id,
        email: authData.user.email || "",
        name: name,
        role: role,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json({ error: "Invalid input", details: error.errors }, { status: 400 });
    }
    console.error("Registration error:", error);
    return Response.json({ error: "Registration failed" }, { status: 500 });
  }
}
