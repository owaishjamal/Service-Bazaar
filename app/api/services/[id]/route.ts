import { createServerClient } from "@/lib/supabase";

export const runtime = "nodejs";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const supabase = await createServerClient();
    const { data: service, error } = await supabase
      .from("services")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !service) {
      return Response.json(null);
    }

    // Transform to match expected format
    const transformed = {
      ...service,
      deliveryType: service.delivery_type,
      basePrice: service.base_price,
    };

    return Response.json(transformed);
  } catch (error) {
    console.error("Error fetching service:", error);
    return Response.json({ error: "Failed to fetch service" }, { status: 500 });
  }
}
