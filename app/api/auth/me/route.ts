import { getCurrentUser } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET() {
  try {
    const user = await getCurrentUser();
    return Response.json({ user });
  } catch (error) {
    console.error("Get user error:", error);
    return Response.json({ user: null });
  }
}
