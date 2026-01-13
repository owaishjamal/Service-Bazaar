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

    const schema = z.object({
      orderId: z.string(),
      rating: z.number().int().min(1).max(5),
      text: z.string().min(1),
    });
    const { orderId, rating, text } = schema.parse(await req.json());

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

    // Create review
    const { error: reviewError } = await supabase
      .from("reviews")
      .insert({
        id: nanoid(10),
        order_id: orderId,
        rating,
        text,
        created_at: new Date().toISOString(),
      });

    if (reviewError) {
      console.error("Error creating review:", reviewError);
      return Response.json({ ok: false, error: "Failed to create review" }, { status: 500 });
    }

    return Response.json({ ok: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json({ ok: false, error: "Invalid request data", details: error.errors }, { status: 400 });
    }
    console.error("Error creating review:", error);
    return Response.json({ ok: false, error: "Failed to create review" }, { status: 500 });
  }
}
