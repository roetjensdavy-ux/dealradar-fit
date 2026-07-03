import { Award, TrendingUp } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "../utils/api";
import GoldenProductCard from "../components/GoldenProductCard";
import LoadingSkeleton from "../components/LoadingSkeleton";

export default function GoldenProductsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["golden-products"],
    queryFn: api.getGoldenProducts,
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-[#ff9500]/10 flex items-center justify-center">
            <Award className="w-6 h-6 text-[#ff9500]" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Golden Products</h1>
            <p className="text-gray-400">
              Producten met de hoogste commissie en beste deals
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          <div className="glass-card p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#ff9500]/10 flex items-center justify-center">
              <Award className="w-5 h-5 text-[#ff9500]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{data?.items.length ?? 0}</p>
              <p className="text-sm text-gray-500">Golden products</p>
            </div>
          </div>
          <div className="glass-card p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#00ff88]/10 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-[#00ff88]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">5%</p>
              <p className="text-sm text-gray-500">Gemiddelde commissie</p>
            </div>
          </div>
          <div className="glass-card p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#00D4FF]/10 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-[#00D4FF]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">€500+</p>
              <p className="text-sm text-gray-500">Potentiële inkomsten</p>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {isLoading ? (
        <LoadingSkeleton count={8} />
      ) : (
        <>
          {data && data.items.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {data.items.map((product) => (
                <GoldenProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="glass-card p-12 text-center">
              <Award className="w-12 h-12 text-[#ff9500]/30 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-white mb-2">
                Geen golden products gevonden
              </h2>
              <p className="text-gray-400">
                Golden products worden binnenkort toegevoegd. Kom later terug!
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
