import { createServerClient } from "@/lib/supabase";

export const runtime = "nodejs";

export async function GET() {
  try {
    const supabase = await createServerClient();
    const { data: services, error } = await supabase
      .from("services")
      .select(`
        *,
        profiles!services_vendor_id_fkey (
          full_name,
          trust_score
        )
      `)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching services:", error);
      return Response.json({ error: "Failed to fetch services" }, { status: 500 });
    }

    return Response.json(services || []);
  } catch (error) {
    console.error("Error fetching services:", error);
    return Response.json({ error: "Failed to fetch services" }, { status: 500 });
  }
}
