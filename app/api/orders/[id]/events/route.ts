import { createServerClient } from "@/lib/supabase";
import { getCurrentUser } from "@/lib/auth";
import { nanoid } from "nanoid";
import { z } from "zod";
import { Flow } from "@/lib/model";

export const runtime = "nodejs";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const user = await getCurrentUser();
    if (!user) {
      return Response.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    const schema = z.object({
      status_to: z.string(),
      note: z.string().optional().default(""),
      proof_url: z.string().optional().default(""),
    });
    const { status_to, note, proof_url } = schema.parse(await req.json());

    const supabase = await createServerClient();

    // Get order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("*")
      .eq("id", id)
      .single();

    if (orderError || !order) {
      return Response.json({ ok: false, error: "Order not found" }, { status: 404 });
    }

    // Check authorization
    if (user.role === "vendor" && order.vendor_id !== user.id) {
      return Response.json({ ok: false, error: "Unauthorized" }, { status: 403 });
    }
    if (user.role === "customer" && order.buyer_id !== user.id) {
      return Response.json({ ok: false, error: "Unauthorized" }, { status: 403 });
    }

    // Only vendors can update status (except for revision_requested which customers can trigger)
    if (user.role === "customer" && !["revision_requested", "disputed"].includes(status_to)) {
      return Response.json({ ok: false, error: "Only vendors can update order status" }, { status: 403 });
    }

    const now = new Date();

    // Update order status
    const { error: updateError } = await supabase
      .from("orders")
      .update({ status: status_to })
      .eq("id", id);

    if (updateError) {
      console.error("Error updating order:", updateError);
      return Response.json({ ok: false, error: "Failed to update order" }, { status: 500 });
    }

    // Create order event (status change will also trigger auto-event, but we create one with note/proof)
    const { error: eventError } = await supabase
      .from("order_events")
      .insert({
        order_id: id,
        status_from: order.status,
        status_to: status_to,
        note: note || `Status changed to ${status_to}`,
        proof_url: proof_url || null,
        created_by: user.id,
      });

    if (eventError) {
      console.error("Error creating event:", eventError);
      return Response.json({ ok: false, error: "Failed to create event" }, { status: 500 });
    }

    return Response.json({ ok: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json({ ok: false, error: "Invalid request data", details: error.errors }, { status: 400 });
    }
    console.error("Error updating order event:", error);
    return Response.json({ ok: false, error: "Failed to update order event" }, { status: 500 });
  }
}
