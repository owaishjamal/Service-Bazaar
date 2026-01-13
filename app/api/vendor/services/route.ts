import { createServerClient } from "@/lib/supabase";
import { getCurrentUser } from "@/lib/auth";
import { z } from "zod";

export const runtime = "nodejs";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "vendor") {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = await createServerClient();
    const { data: services, error } = await supabase
      .from("services")
      .select("*")
      .eq("vendor_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching services:", error);
      return Response.json({ error: "Failed to fetch services" }, { status: 500 });
    }

    return Response.json({ services: services || [] });
  } catch (error) {
    console.error("Error fetching services:", error);
    return Response.json({ error: "Failed to fetch services" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "vendor") {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const schema = z.object({
      title: z.string().min(1),
      category: z.enum(["Dev", "Design", "QA", "DevOps", "UI/UX"]),
      price: z.number().min(0),
      eta_days: z.number().int().min(1),
      description: z.string().optional(),
      tech_stack: z.array(z.string()).optional().default([]),
    });

    const body = await req.json();
    const data = schema.parse(body);

    const supabase = await createServerClient();

    // CRITICAL: Ensure profile exists before creating service
    // Check if profile exists
    const { data: existingProfile } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", user.id)
      .single();

    if (!existingProfile) {
      // Profile doesn't exist - create it
      const { error: insertError } = await supabase
        .from("profiles")
        .insert({
          id: user.id,
          role: "vendor",
          full_name: user.name,
          trust_score: 100,
          skills: [],
        });

      if (insertError) {
        console.error("Error creating profile:", insertError);
        return Response.json({ 
          error: "Profile not found. Please contact support or try logging out and back in.",
          details: insertError.message 
        }, { status: 500 });
      }
    } else {
      // Profile exists - ensure it has vendor role
      await supabase
        .from("profiles")
        .update({ role: "vendor" })
        .eq("id", user.id);
    }

    // Now create the service
    const { data: service, error } = await supabase
      .from("services")
      .insert({
        vendor_id: user.id,
        title: data.title,
        category: data.category,
        price: data.price,
        eta_days: data.eta_days,
        description: data.description || "",
        tech_stack: data.tech_stack || [],
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating service:", error);
      return Response.json({ error: "Failed to create service: " + error.message }, { status: 500 });
    }

    return Response.json({ service });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json({ error: "Invalid input", details: error.errors }, { status: 400 });
    }
    console.error("Error creating service:", error);
    return Response.json({ error: "Failed to create service" }, { status: 500 });
  }
}
