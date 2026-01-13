import { createServerClient } from "@/lib/supabase";
import { getCurrentUser } from "@/lib/auth";
import { nanoid } from "nanoid";
import { z } from "zod";

export const runtime = "nodejs";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "seller") {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = await createServerClient();
    const { data: services, error } = await supabase
      .from("services")
      .select("*")
      .eq("seller_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching services:", error);
      return Response.json({ error: "Failed to fetch services" }, { status: 500 });
    }

    const transformed = services?.map((s: any) => ({
      ...s,
      deliveryType: s.delivery_type,
      basePrice: s.base_price,
      createdAt: new Date(s.created_at).getTime(),
    })) || [];

    return Response.json({ services: transformed });
  } catch (error) {
    console.error("Error fetching services:", error);
    return Response.json({ error: "Failed to fetch services" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "seller") {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const schema = z.object({
      title: z.string().min(1),
      category: z.string(),
      description: z.string().min(1),
      deliveryType: z.enum(["digital", "physical", "hybrid"]),
      basePrice: z.number().int().min(1),
    });

    const data = schema.parse(await req.json());

    const supabase = await createServerClient();
    const serviceId = nanoid(10);
    const now = new Date();

    // Create service
    const { error: serviceError } = await supabase
      .from("services")
      .insert({
        id: serviceId,
        seller_id: user.id,
        title: data.title,
        category: data.category,
        description: data.description,
        delivery_type: data.deliveryType,
        base_price: data.basePrice,
        image: "",
        created_at: now.toISOString(),
      });

    if (serviceError) {
      console.error("Error creating service:", serviceError);
      return Response.json({ error: "Failed to create service" }, { status: 500 });
    }

    // Create an offer for this service
    const offerId = nanoid(10);
    const { error: offerError } = await supabase
      .from("offers")
      .insert({
        id: offerId,
        service_id: serviceId,
        seller_id: user.id,
        price: data.basePrice,
        eta_days: 3,
        revisions: 2,
        rating: 0,
        trust_score: 80,
        created_at: now.toISOString(),
      });

    if (offerError) {
      console.error("Error creating offer:", offerError);
      // Service was created, so we'll still return success
    }

    return Response.json({ id: serviceId, offerId });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json({ error: "Invalid input", details: error.errors }, { status: 400 });
    }
    console.error("Error creating service:", error);
    return Response.json({ error: "Failed to create service" }, { status: 500 });
  }
}
