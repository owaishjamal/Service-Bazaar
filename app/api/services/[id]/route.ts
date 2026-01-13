import { createServerClient } from "@/lib/supabase";

export const runtime = "nodejs";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = await createServerClient();
    const { data: service, error } = await supabase
      .from("services")
      .select("*")
      .eq("id", params.id)
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
