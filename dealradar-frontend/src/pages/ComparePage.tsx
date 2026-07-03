import { useParams, Link } from "react-router-dom";
import { ArrowLeft, AlertCircle, TrendingDown } from "lucide-react";
import { useComparison } from "../hooks/useComparison";
import ComparisonTable from "../components/ComparisonTable";
import LoadingSkeleton from "../components/LoadingSkeleton";

function ErrorState({ message }: { message: string }) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
      <AlertCircle className="w-12 h-12 text-[#ff4444] mx-auto mb-4" />
      <p className="text-gray-400 text-lg">{message}</p>
    </div>
  );
}

function NotFoundState() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
      <TrendingDown className="w-12 h-12 text-gray-600 mx-auto mb-4" />
      <p className="text-gray-400 text-lg">Geen vergelijkingsgegevens gevonden</p>
      <Link to="/products" className="text-[#00ff88] hover:underline mt-4 inline-block">
        Bekijk alle producten
      </Link>
    </div>
  );
}

export default function ComparePage() {
  const { slug } = useParams<{ slug: string }>();
  const { data, isLoading, error } = useComparison(slug);

  if (isLoading) return <LoadingSkeleton type="detail" />;
  if (error) return <ErrorState message="Vergelijking kon niet geladen worden" />;
  if (!data) return <NotFoundState />;

  const { product, offers, comparison, total_offers, in_stock_count } = data;

  // comparison.cheapest is een FULL Offer object!
  const cheapest = comparison.cheapest;
  const mostExpensive = comparison.most_expensive;
  const [minPrice, maxPrice] = comparison.price_range;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link to="/products" className="flex items-center gap-1 hover:text-[#00ff88] transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Producten
        </Link>
        <span>/</span>
        <Link to={`/products/${product.slug}`} className="hover:text-[#00ff88] transition-colors truncate max-w-xs">
          {product.name}
        </Link>
        <span>/</span>
        <span className="text-gray-300">Vergelijking</span>
      </nav>

      {/* Product header */}
      <div className="glass-card p-6 mb-6">
        <div className="flex flex-col sm:flex-row items-start gap-6">
          {product.image_url && (
            <img
              src={product.image_url}
              alt={product.name}
              className="w-24 h-24 object-cover rounded-lg"
            />
          )}
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">{product.name}</h1>
            {product.brand && <p className="text-gray-400 mb-2">{product.brand}</p>}
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span>{total_offers} prijzen vergeleken</span>
              <span>{in_stock_count} op voorraad</span>
            </div>
          </div>
        </div>
      </div>

      {/* Prijs vergelijking samenvatting */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="glass-card p-4 text-center">
          <p className="text-sm text-gray-400">Goedkoopste</p>
          <p className="text-2xl font-bold text-[#00ff88]">
            €{minPrice.toFixed(2)}
          </p>
          <p className="text-sm text-gray-400">{cheapest.retailer.name}</p>
        </div>
        <div className="glass-card p-4 text-center">
          <p className="text-sm text-gray-400">Duurste</p>
          <p className="text-2xl font-bold text-[#ff4444]">
            €{maxPrice.toFixed(2)}
          </p>
          <p className="text-sm text-gray-400">{mostExpensive.retailer.name}</p>
        </div>
        <div className="glass-card p-4 text-center">
          <p className="text-sm text-gray-400">Jouw besparing</p>
          <p className="text-2xl font-bold text-[#ff9500]">
            €{comparison.savings_amount.toFixed(2)}
          </p>
          <p className="text-sm text-gray-400">{comparison.savings_percentage.toFixed(1)}% goedkoper</p>
        </div>
      </div>

      {/* Extra stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="glass-card p-3 text-center">
          <p className="text-lg font-bold text-white">€{comparison.average_price.toFixed(2)}</p>
          <p className="text-xs text-gray-500">Gemiddelde prijs</p>
        </div>
        <div className="glass-card p-3 text-center">
          <p className="text-lg font-bold text-[#00ff88]">€{comparison.cheapest_price.toFixed(2)}</p>
          <p className="text-xs text-gray-500">Laagste prijs</p>
        </div>
        <div className="glass-card p-3 text-center">
          <p className="text-lg font-bold text-[#ff4444]">€{comparison.most_expensive_price.toFixed(2)}</p>
          <p className="text-xs text-gray-500">Hoogste prijs</p>
        </div>
        <div className="glass-card p-3 text-center">
          <p className="text-lg font-bold text-[#00D4FF]">{total_offers}</p>
          <p className="text-xs text-gray-500">Aantal aanbiedingen</p>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-white mb-4">Alle prijzen vergeleken</h2>
        <ComparisonTable
          offers={offers}
          cheapestId={cheapest.id}
          comparison={comparison}
        />
      </div>
    </div>
  );
}
