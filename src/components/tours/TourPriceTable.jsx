import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function TourPriceTable({ tiers }) {
  if (!Array.isArray(tiers) || tiers.length === 0) return null;
  return (
    <Card className="border border-neutral-200">
      <CardContent className="p-0">
        <div className="w-full overflow-x-auto">
          <table className="min-w-[480px] text-sm">
            <thead className="bg-emerald-50 text-emerald-900">
              <tr className="border-b border-emerald-100">
                <th className="px-4 py-3 text-left">Paket</th>
                <th className="px-4 py-3 text-left">Rentang Pax</th>
                <th className="px-4 py-3 text-left">Armada</th>
                <th className="px-4 py-3 text-right">Harga</th>
              </tr>
            </thead>
            <tbody>
              {tiers.map((t, idx) => (
                <tr key={idx} className="border-b border-neutral-100">
                  <td className="px-4 py-3">{t.name || "Paket"}</td>
                  <td className="px-4 py-3">
                    {[t.paxMin, t.paxMax].filter(Boolean).join(" - ") || "-"}
                  </td>
                  <td className="px-4 py-3">{t.carName || "-"}</td>
                  <td className="px-4 py-3 text-right font-bold text-emerald-700">
                    {typeof t.price === "number"
                      ? new Intl.NumberFormat("id-ID", {
                          style: "currency",
                          currency: "IDR",
                          minimumFractionDigits: 0,
                        }).format(t.price)
                      : t.price || "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
