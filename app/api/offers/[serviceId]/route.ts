import { createServerClient } from "@/lib/supabase";

export const runtime = "nodejs";

export async function GET(_: Request, { params }: { params: Promise<{ serviceId: string }> }) {
  try {
    const { serviceId } = await params;
    const supabase = await createServerClient();
    const { data: offers, error } = await supabase
      .from("offers")
      .select(`
        *,
        users!offers_seller_id_fkey (
          name
        )
      `)
      .eq("service_id", serviceId)
      .order("trust_score", { ascending: false })
      .order("rating", { ascending: false });

    if (error) {
      console.error("Error fetching offers:", error);
      return Response.json({ error: "Failed to fetch offers" }, { status: 500 });
    }

    // Transform the data
    const transformed = offers?.map((o: any) => ({
      ...o,
      sellerName: o.users?.name || "Unknown",
      serviceId: o.service_id,
      sellerId: o.seller_id,
      etaDays: o.eta_days,
      trustScore: o.trust_score,
    })) || [];

    return Response.json(transformed);
  } catch (error) {
    console.error("Error fetching offers:", error);
    return Response.json({ error: "Failed to fetch offers" }, { status: 500 });
  }
}
