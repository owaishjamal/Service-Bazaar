import { createServerClient } from "@/lib/supabase";
import { getCurrentUser } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "customer") {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = await createServerClient();
    const { data: orders, error } = await supabase
      .from("orders")
      .select(`
        id,
        status,
        created_at,
        services!orders_service_id_fkey (
          title,
          vendor_id
        ),
        profiles!orders_vendor_id_fkey (
          full_name
        )
      `)
      .eq("buyer_id", user.id)
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      console.error("Error fetching orders:", error);
      return Response.json({ error: "Failed to fetch orders" }, { status: 500 });
    }

    const transformed = orders?.map((o: any) => ({
      id: o.id,
      status: o.status,
      createdAt: new Date(o.created_at).getTime(),
      serviceTitle: o.services?.title || "Unknown",
      sellerName: o.profiles?.full_name || "Unknown",
    })) || [];

    return Response.json({ orders: transformed });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return Response.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}
