import { ExternalLink, Package, Truck, Check, X } from "lucide-react";
import type { Offer, ComparisonDetail } from "../types";
import PriceBadge from "./PriceBadge";
import RetailerLogo from "./RetailerLogo";
import { api } from "../utils/api";

interface ComparisonTableProps {
  offers: Offer[];
  cheapestId?: string;
  comparison?: ComparisonDetail;
}

export default function ComparisonTable({ offers, cheapestId, comparison }: ComparisonTableProps) {
  const handleClick = async (offer: Offer, productId: string) => {
    try {
      await api.trackClick({
        product_id: productId,
        offer_id: offer.id,
        retailer_id: offer.retailer.id,
      });
    } catch {
      // Silently fail tracking
    }
    if (offer.affiliate_url) {
      window.open(offer.affiliate_url, "_blank", "noopener,noreferrer");
    } else if (offer.product_url) {
      window.open(offer.product_url, "_blank", "noopener,noreferrer");
    }
  };

  if (offers.length === 0) {
    return (
      <div className="glass-card p-8 text-center">
        <p className="text-gray-400">Geen prijzen gevonden voor dit product</p>
      </div>
    );
  }

  return (
    <div className="glass-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10 bg-white/5">
              <th className="text-left px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">
                Retailer
              </th>
              <th className="text-left px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">
                <div className="flex items-center gap-1.5">
                  <Package className="w-3.5 h-3.5" />
                  Prijs
                </div>
              </th>
              <th className="text-left px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">
                <div className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5" />
                  Verzending
                </div>
              </th>
              <th className="text-left px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">
                Totaal
              </th>
              <th className="text-left px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">
                Voorraad
              </th>
              <th className="text-left px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">
                Badge
              </th>
              <th className="text-right px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">
                Actie
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {offers.map((offer) => {
              const isCheapest = offer.id === cheapestId || offer.badge === "cheapest";
              const savings = comparison
                ? comparison.most_expensive.total_price - offer.total_price
                : 0;

              return (
                <tr
                  key={offer.id}
                  className={`hover:bg-white/[0.03] transition-colors ${
                    isCheapest ? "border-l-2 border-l-[#00ff88] bg-[#00ff88]/[0.02]" : ""
                  }`}
                >
                  {/* Retailer */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <RetailerLogo
                        name={offer.retailer.name}
                        logoUrl={offer.retailer.logo_url}
                        size="sm"
                      />
                      <span className="text-white font-medium text-sm">
                        {offer.retailer.name}
                      </span>
                    </div>
                  </td>

                  {/* Price */}
                  <td className="px-6 py-4">
                    <span className={`text-lg font-bold ${isCheapest ? "text-[#00ff88]" : "text-white"}`}>
                      €{offer.price.toFixed(2)}
                    </span>
                    {savings > 0 && isCheapest && (
                      <p className="text-xs text-[#00ff88]/70 mt-0.5">
                        Bespaar €{savings.toFixed(2)}
                      </p>
                    )}
                  </td>

                  {/* Shipping */}
                  <td className="px-6 py-4">
                    <span className="text-gray-300 text-sm">
                      {offer.shipping_cost === 0
                        ? "Gratis"
                        : `€${offer.shipping_cost.toFixed(2)}`}
                    </span>
                  </td>

                  {/* Total */}
                  <td className="px-6 py-4">
                    <span className={`font-bold ${isCheapest ? "text-[#00ff88]" : "text-white"}`}>
                      €{offer.total_price.toFixed(2)}
                    </span>
                  </td>

                  {/* Stock */}
                  <td className="px-6 py-4">
                    {offer.in_stock ? (
                      <span className="inline-flex items-center gap-1 text-[#00ff88] text-sm">
                        <Check className="w-4 h-4" />
                        Op voorraad
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[#ff4444] text-sm">
                        <X className="w-4 h-4" />
                        Uitverkocht
                      </span>
                    )}
                  </td>

                  {/* Badge */}
                  <td className="px-6 py-4">
                    <PriceBadge badge={offer.badge} />
                  </td>

                  {/* Action */}
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleClick(offer, offer.retailer.id)}
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        isCheapest
                          ? "bg-[#00ff88] text-[#0a0a14] hover:bg-[#00ff88]/90"
                          : "bg-white/10 text-white hover:bg-white/20"
                      }`}
                    >
                      Bekijk
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
