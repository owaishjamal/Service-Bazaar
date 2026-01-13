import Link from "next/link";
import { getBaseUrl } from "@/lib/utils";

async function getOffers(id: string) {
  const r = await fetch(`${getBaseUrl()}/api/offers/${id}`, { cache: "no-store" });
  if (!r.ok) throw new Error("Failed to fetch offers");
  return r.json();
}

async function getService(id: string) {
  const r = await fetch(`${getBaseUrl()}/api/services/${id}`, { cache: "no-store" });
  if (!r.ok) throw new Error("Failed to fetch service");
  return r.json();
}

export default async function ComparePage({ params }: { params: { id: string } }) {
  const s = await getService(params.id);
  const offers = await getOffers(params.id);

  return (
    <div className="space-y-4">
      <div className="rounded-3xl border p-6">
        <div className="text-2xl font-semibold">Compare sellers</div>
        <div className="text-gray-600 mt-1">{s.title}</div>
      </div>

      <div className="rounded-2xl border overflow-hidden">
        <div className="grid grid-cols-6 gap-0 bg-gray-50 text-xs font-semibold">
          <div className="p-3 col-span-2">Seller</div>
          <div className="p-3">Price</div>
          <div className="p-3">ETA</div>
          <div className="p-3">Revs</div>
          <div className="p-3">Trust</div>
        </div>
        {offers.map((o: any) => (
          <div key={o.id} className="grid grid-cols-6 border-t text-sm">
            <div className="p-3 col-span-2">
              <div className="font-medium">{o.sellerName}</div>
              <div className="text-xs text-gray-600">Rating {o.rating.toFixed(1)}</div>
            </div>
            <div className="p-3">₹{o.price}</div>
            <div className="p-3">{o.etaDays}d</div>
            <div className="p-3">{o.revisions}</div>
            <div className="p-3">{o.trustScore}/100</div>
            <div className="p-2 col-span-6">
              <Link className="inline-flex rounded-xl bg-black text-white px-4 py-2" href={`/checkout/${o.id}`}>
                Choose {o.sellerName}
              </Link>
            </div>
          </div>
        ))}
      </div>

      <Link className="underline text-sm" href={`/service/${params.id}`}>
        Back
      </Link>
    </div>
  );
}
