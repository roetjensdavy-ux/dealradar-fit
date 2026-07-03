import { useParams } from "react-router-dom";
import { useComparison } from "../hooks/useComparison";
import ComparisonTable from "../components/ComparisonTable";
import LoadingSkeleton from "../components/LoadingSkeleton";
import { AlertCircle, Search } from "lucide-react";

function ErrorState({ message }: { message: string }) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
      <AlertCircle className="w-12 h-12 text-[#ff4444] mx-auto mb-4" />
      <p className="text-gray-400 text-lg">{message}</p>
    </div>
  );
}

export default function SEOPage() {
  const { slug } = useParams<{ slug: string }>();
  // The slug comes in as "product-slug-prijsvergelijking", we need to strip the suffix
  const productSlug = slug?.replace(/-prijsvergelijking$/, "") ?? slug;
  
  const { data, isLoading, error } = useComparison(productSlug);

  if (isLoading) return <LoadingSkeleton type="detail" />;
  if (error) return <ErrorState message="Pagina kon niet geladen worden" />;
  if (!data) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <Search className="w-12 h-12 text-gray-600 mx-auto mb-4" />
        <p className="text-gray-400 text-lg">Product niet gevonden</p>
      </div>
    );
  }

  const { product, offers, comparison } = data;
  const cheapest = comparison.cheapest;
  const [minPrice, maxPrice] = comparison.price_range;

  // SEO meta data
  const pageTitle = `${product.name} prijsvergelijking - Vergelijk prijzen | DealRadar.fit`;
  const pageDescription = `Vergelijk prijzen voor ${product.name}. Vanaf €${minPrice.toFixed(2)} bij ${cheapest.retailer.name}. Bespaar €${comparison.savings_amount.toFixed(2)} (${comparison.savings_percentage.toFixed(0)}%) door prijzen te vergelijken bij ${offers.length} retailers.`;
  
  // Update document title
  if (typeof document !== "undefined") {
    document.title = pageTitle;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute("content", pageDescription);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* SEO Header */}
      <div className="mb-8">
        <nav className="text-sm text-gray-500 mb-4">
          <span>Home</span>
          <span className="mx-2">/</span>
          <span className="text-gray-300">{product.name} prijsvergelijking</span>
        </nav>
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
          {product.name} prijsvergelijking
        </h1>
        <p className="text-gray-400 text-lg max-w-3xl">
          Vergelijk prijzen voor <strong className="text-white">{product.name}</strong> bij alle grote retailers. 
          De goedkoopste prijs is <strong className="text-[#00ff88]">€{minPrice.toFixed(2)}</strong> bij {cheapest.retailer.name}.
          Bespaar tot <strong className="text-[#ff9500]">€{comparison.savings_amount.toFixed(2)}</strong> door te vergelijken.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="glass-card p-4 text-center">
          <p className="text-sm text-gray-400">Goedkoopste prijs</p>
          <p className="text-2xl font-bold text-[#00ff88]">€{minPrice.toFixed(2)}</p>
          <p className="text-sm text-gray-400">{cheapest.retailer.name}</p>
        </div>
        <div className="glass-card p-4 text-center">
          <p className="text-sm text-gray-400">Hoogste prijs</p>
          <p className="text-2xl font-bold text-[#ff4444]">€{maxPrice.toFixed(2)}</p>
        </div>
        <div className="glass-card p-4 text-center">
          <p className="text-sm text-gray-400">Jouw besparing</p>
          <p className="text-2xl font-bold text-[#ff9500]">€{comparison.savings_amount.toFixed(2)}</p>
          <p className="text-sm text-gray-400">{comparison.savings_percentage.toFixed(1)}% korting</p>
        </div>
      </div>

      {/* Product Info */}
      {product.description && (
        <div className="glass-card p-6 mb-6">
          <h2 className="text-xl font-bold text-white mb-3">
            Over {product.name}
          </h2>
          <p className="text-gray-400 leading-relaxed">{product.description}</p>
          {product.brand && (
            <p className="text-gray-500 text-sm mt-3">Merk: {product.brand}</p>
          )}
        </div>
      )}

      {/* Price comparison table */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-white mb-4">
          {product.name} prijzen vergeleken
        </h2>
        <ComparisonTable
          offers={offers}
          cheapestId={cheapest.id}
          comparison={comparison}
        />
      </div>

      {/* SEO Content */}
      <div className="glass-card p-6 mb-8">
        <h2 className="text-xl font-bold text-white mb-3">
          Waarom {product.name} prijzen vergelijken?
        </h2>
        <div className="space-y-3 text-gray-400 leading-relaxed">
          <p>
            Door prijzen te vergelijken voor {product.name} kun je flink besparen. 
            Onze prijsvergelijking toont je direct de goedkoopste aanbieder. 
            Het prijsverschil kan oplopen tot €{comparison.savings_amount.toFixed(2)}, 
            wat neerkomt op een besparing van {comparison.savings_percentage.toFixed(0)}%.
          </p>
          <p>
            We vergelijken prijzen bij {offers.length} betrouwbare retailers. 
            De gemiddelde prijs ligt rond de €{comparison.average_price.toFixed(2)}, 
            maar met onze vergelijking betaal je slechts €{minPrice.toFixed(2)} bij {cheapest.retailer.name}.
          </p>
          {product.brand && (
            <p>
              {product.name} van {product.brand} is een populair product. 
              Door onze prijsvergelijking te gebruiken, weet je zeker dat je nooit te veel betaalt. 
              We updaten onze prijzen meerdere keren per dag, zodat je altijd de meest actuele deals ziet.
            </p>
          )}
        </div>
      </div>

      {/* FAQ for SEO */}
      <div className="glass-card p-6">
        <h2 className="text-xl font-bold text-white mb-4">
          Veelgestelde vragen over {product.name}
        </h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-white font-semibold mb-1">
              Waar kan ik {product.name} het goedkoopst kopen?
            </h3>
            <p className="text-gray-400 text-sm">
              De goedkoopste prijs voor {product.name} is momenteel €{minPrice.toFixed(2)} bij {cheapest.retailer.name}.
              Gebruik onze prijsvergelijking om altijd de laagste prijs te vinden.
            </p>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-1">
              Wat is het prijsverschil voor {product.name}?
            </h3>
            <p className="text-gray-400 text-sm">
              Het prijsverschil voor {product.name} is €{comparison.savings_amount.toFixed(2)}. 
              De goedkoopste prijs is €{minPrice.toFixed(2)} en de duurste is €{maxPrice.toFixed(2)}.
            </p>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-1">
              Is {product.name} op voorraad?
            </h3>
            <p className="text-gray-400 text-sm">
              {product.name} is op voorraad bij {data.in_stock_count} van de {offers.length} retailers. 
              Controleer de voorraadstatus in onze prijsvergelijkingstabel.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
