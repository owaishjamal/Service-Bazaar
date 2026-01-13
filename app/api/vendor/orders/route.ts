import { createServerClient } from "@/lib/supabase";
import { getCurrentUser } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "vendor") {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = await createServerClient();
    const { data: orders, error } = await supabase
      .from("orders")
      .select(`
        *,
        services!orders_service_id_fkey (
          title
        ),
        profiles!orders_buyer_id_fkey (
          full_name
        )
      `)
      .eq("vendor_id", user.id)
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      console.error("Error fetching orders:", error);
      return Response.json({ error: "Failed to fetch orders" }, { status: 500 });
    }

    const transformed = orders?.map((o: any) => ({
      id: o.id,
      status: o.status,
      amount: parseFloat(o.amount),
      created_at: o.created_at,
      services: o.services,
      profiles: o.profiles,
    })) || [];

    return Response.json({ orders: transformed });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return Response.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}
