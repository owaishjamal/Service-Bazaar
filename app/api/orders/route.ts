import { createServerClient } from "@/lib/supabase";
import { getCurrentUser } from "@/lib/auth";
import { nanoid } from "nanoid";
import { z } from "zod";
import { genScope } from "@/lib/scope";

export const runtime = "nodejs";

export async function GET(req: Request) {
  try {
    const supabase = await createServerClient();
    const url = new URL(req.url);
    const offerId = url.searchParams.get("offerId");

    if (offerId) {
      // Get offer and service for checkout
      const { data: offer, error: offerError } = await supabase
        .from("offers")
        .select(`
          *,
          services!offers_service_id_fkey (*)
        `)
        .eq("id", offerId)
        .single();

      if (offerError || !offer) {
        return Response.json({ error: "Offer not found" }, { status: 404 });
      }

      const scope = genScope("", offer.eta_days, offer.revisions);
      
      return Response.json({
        offer: {
          ...offer,
          etaDays: offer.eta_days,
          trustScore: offer.trust_score,
        },
        service: {
          ...offer.services,
          deliveryType: offer.services.delivery_type,
          basePrice: offer.services.base_price,
        },
        scope,
      });
    }

    // Get orders for seller dashboard
    const user = await getCurrentUser();
    if (!user || user.role !== "seller") {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: orders, error } = await supabase
      .from("orders")
      .select(`
        id,
        status,
        created_at,
        services:offers!orders_offer_id_fkey (
          services!offers_service_id_fkey (
            title
          )
        ),
        users!orders_customer_id_fkey (
          name
        )
      `)
      .eq("seller_id", user.id)
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
      serviceTitle: o.services?.services?.title || "Unknown",
      buyerName: o.users?.name || "Unknown",
    })) || [];

    return Response.json({ orders: transformed });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return Response.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const schema = z.object({ offerId: z.string(), requirements: z.string().optional().default("") });
    const { offerId, requirements } = schema.parse(body);

    const supabase = await createServerClient();
    const { data: offer, error } = await supabase
      .from("offers")
      .select("eta_days, revisions")
      .eq("id", offerId)
      .single();

    if (error || !offer) {
      return Response.json({ error: "Offer not found" }, { status: 404 });
    }

    const scope = genScope(requirements, offer.eta_days, offer.revisions);
    return Response.json({ scope });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json({ error: "Invalid request data", details: error.errors }, { status: 400 });
    }
    console.error("Error generating scope:", error);
    return Response.json({ error: "Failed to generate scope" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== "customer" && user.role !== "vendor" && user.role !== "admin")) {
      return Response.json({ error: "Unauthorized. You must be a customer to place orders." }, { status: 401 });
    }

    const schema = z.object({
      service_id: z.string(),
      requirements: z.string().optional().default(""),
      amount: z.number().optional(),
    });
    const { service_id, requirements, amount } = schema.parse(await req.json());

    const supabase = await createServerClient();

    // CRITICAL: Ensure buyer profile exists before creating order
    const { data: existingProfile } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", user.id)
      .single();

    if (!existingProfile) {
      // Profile doesn't exist - create it
      const { error: insertError } = await supabase
        .from("profiles")
        .insert({
          id: user.id,
          role: "customer",
          full_name: user.name,
          trust_score: 100,
          skills: [],
        });

      if (insertError) {
        console.error("Error creating profile:", insertError);
        return Response.json({ 
          error: "Profile not found. Please contact support or try logging out and back in.",
          details: insertError.message 
        }, { status: 500 });
      }
    }

    // Get service to find vendor and details
    const { data: service, error: serviceError } = await supabase
      .from("services")
      .select("vendor_id, price, eta_days")
      .eq("id", service_id)
      .single();

    if (serviceError || !service) {
      return Response.json({ error: "Service not found" }, { status: 404 });
    }

    // Create order with new schema
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        buyer_id: user.id,
        service_id: service_id,
        vendor_id: service.vendor_id,
        status: "placed",
        amount: amount || service.price,
        requirements_doc: requirements || "",
      })
      .select()
      .single();

    if (orderError) {
      console.error("Error creating order:", orderError);
      return Response.json({ error: "Failed to create order", details: orderError.message }, { status: 500 });
    }

    // Order event will be created automatically by the trigger, but we can create the initial one
    await supabase
      .from("order_events")
      .insert({
        order_id: order.id,
        status_from: null,
        status_to: "placed",
        note: "Order placed successfully",
        proof_url: null,
        created_by: user.id,
      });

    return Response.json({ id: order.id });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json({ error: "Invalid request data", details: error.errors }, { status: 400 });
    }
    console.error("Error creating order:", error);
    return Response.json({ error: "Failed to create order" }, { status: 500 });
  }
}
