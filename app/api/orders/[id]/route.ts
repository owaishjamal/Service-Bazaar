import { createServerClient } from "@/lib/supabase";
import { getCurrentUser } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const user = await getCurrentUser();
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = await createServerClient();

    // Get order with service
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select(`
        *,
        services!orders_service_id_fkey (
          id,
          title,
          price,
          eta_days,
          category
        )
      `)
      .eq("id", id)
      .single();

    if (orderError || !order) {
      return Response.json({ error: "Order not found" }, { status: 404 });
    }

    // Check authorization - allow admin to see all orders
    if (user.role !== "admin") {
      if (user.role === "customer" && order.buyer_id !== user.id) {
        return Response.json({ error: "Unauthorized" }, { status: 403 });
      }
      if (user.role === "vendor" && order.vendor_id !== user.id) {
        return Response.json({ error: "Unauthorized" }, { status: 403 });
      }
    }

    // Get buyer and vendor names
    const [buyerRes, vendorRes] = await Promise.all([
      supabase.from("profiles").select("full_name").eq("id", order.buyer_id).single(),
      supabase.from("profiles").select("full_name").eq("id", order.vendor_id).single(),
    ]);

    // Get events, reviews, and dispute
    const [eventsRes, reviewsRes, disputeRes] = await Promise.all([
      supabase
        .from("order_events")
        .select("*")
        .eq("order_id", id)
        .order("created_at", { ascending: true }),
      supabase
        .from("reviews")
        .select("*")
        .eq("order_id", id)
        .order("created_at", { ascending: false }),
      supabase
        .from("disputes")
        .select("*")
        .eq("order_id", id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
    ]);

    const service = order.services;
    const transformedOrder = {
      id: order.id,
      serviceId: order.service_id,
      buyerId: order.buyer_id,
      vendorId: order.vendor_id,
      status: order.status,
      amount: order.amount,
      requirements: order.requirements_doc,
      createdAt: new Date(order.created_at).getTime(),
      updatedAt: new Date(order.updated_at).getTime(),
      buyerName: buyerRes.data?.full_name,
      vendorName: vendorRes.data?.full_name,
    };

    const transformedService = service ? {
      id: service.id,
      title: service.title,
      price: service.price,
      etaDays: service.eta_days,
      category: service.category,
    } : null;

    const transformedEvents = eventsRes.data?.map((e: any) => ({
      ...e,
      orderId: e.order_id,
      proofUrl: e.proof_url,
      createdAt: new Date(e.created_at).getTime(),
    })) || [];

    const transformedReviews = reviewsRes.data?.map((r: any) => ({
      ...r,
      orderId: r.order_id,
      createdAt: new Date(r.created_at).getTime(),
    })) || [];

    const transformedDispute = disputeRes.data ? {
      ...disputeRes.data,
      orderId: disputeRes.data.order_id,
      createdAt: new Date(disputeRes.data.created_at).getTime(),
    } : null;

    return Response.json({
      order: transformedOrder,
      service: transformedService,
      events: transformedEvents,
      reviews: transformedReviews,
      dispute: transformedDispute,
    });
  } catch (error) {
    console.error("Error fetching order:", error);
    return Response.json({ error: "Failed to fetch order" }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const user = await getCurrentUser();
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { status } = body;

    if (!status) {
      return Response.json({ error: "Status is required" }, { status: 400 });
    }

    const supabase = await createServerClient();

    // Get order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("*")
      .eq("id", id)
      .single();

    if (orderError || !order) {
      return Response.json({ error: "Order not found" }, { status: 404 });
    }

    // Check authorization
    if (user.role !== "admin") {
      if (user.role === "customer" && order.buyer_id !== user.id) {
        return Response.json({ error: "Unauthorized" }, { status: 403 });
      }
      if (user.role === "vendor" && order.vendor_id !== user.id) {
        return Response.json({ error: "Unauthorized" }, { status: 403 });
      }
    }

    // Update order status (trigger will create event automatically)
    const { error: updateError } = await supabase
      .from("orders")
      .update({ status })
      .eq("id", id);

    if (updateError) {
      console.error("Error updating order:", updateError);
      return Response.json({ error: "Failed to update order" }, { status: 500 });
    }

    return Response.json({ success: true, status });
  } catch (error) {
    console.error("Error updating order:", error);
    return Response.json({ error: "Failed to update order" }, { status: 500 });
  }
}
