import { createServerClient } from "@/lib/supabase";
import { getCurrentUser } from "@/lib/auth";
import { nanoid } from "nanoid";
import { z } from "zod";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return Response.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    const schema = z.object({ orderId: z.string(), reason: z.string().min(1) });
    const { orderId, reason } = schema.parse(await req.json());

    const supabase = await createServerClient();

    // Verify order exists and belongs to user
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("customer_id")
      .eq("id", orderId)
      .single();

    if (orderError || !order) {
      return Response.json({ ok: false, error: "Order not found" }, { status: 404 });
    }

    if (order.customer_id !== user.id) {
      return Response.json({ ok: false, error: "Unauthorized" }, { status: 403 });
    }

    const now = new Date();

    // Create dispute
    const { error: disputeError } = await supabase
      .from("disputes")
      .insert({
        id: nanoid(10),
        order_id: orderId,
        reason,
        status: "OPEN",
        created_at: now.toISOString(),
      });

    if (disputeError) {
      console.error("Error creating dispute:", disputeError);
      return Response.json({ ok: false, error: "Failed to create dispute" }, { status: 500 });
    }

    // Update order status
    await supabase
      .from("orders")
      .update({ status: "DISPUTE_OPEN" })
      .eq("id", orderId);

    // Create order event
    await supabase
      .from("order_events")
      .insert({
        id: nanoid(10),
        order_id: orderId,
        status: "DISPUTE_OPEN",
        note: "Dispute opened",
        proof_url: "",
        created_at: now.toISOString(),
      });

    return Response.json({ ok: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json({ ok: false, error: "Invalid request data", details: error.errors }, { status: 400 });
    }
    console.error("Error creating dispute:", error);
    return Response.json({ ok: false, error: "Failed to create dispute" }, { status: 500 });
  }
}
