import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, BarChart3, Package, AlertCircle } from "lucide-react";
import { useComparison } from "../hooks/useComparison";
import LoadingSkeleton from "../components/LoadingSkeleton";

function ErrorState({ message }: { message: string }) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
      <AlertCircle className="w-12 h-12 text-[#ff4444] mx-auto mb-4" />
      <p className="text-gray-400 text-lg">{message}</p>
    </div>
  );
}

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { data, isLoading, error } = useComparison(slug);

  if (isLoading) return <LoadingSkeleton type="detail" />;
  if (error) return <ErrorState message="Product kon niet geladen worden" />;
  if (!data) return <ErrorState message="Product niet gevonden" />;

  const { product, offers } = data;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 hover:text-[#00ff88] transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Terug
        </button>
        <span>/</span>
        {product.category && (
          <>
            <Link to={`/products?category=${encodeURIComponent(product.category)}`} className="hover:text-[#00ff88] transition-colors">
              {product.category}
            </Link>
            <span>/</span>
          </>
        )}
        <span className="text-gray-300 truncate max-w-xs">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        {/* Image */}
        <div className="glass-card overflow-hidden">
          <div className="aspect-square bg-white/5 flex items-center justify-center">
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <Package className="w-32 h-32 text-gray-600" />
            )}
          </div>
        </div>

        {/* Info */}
        <div>
          {product.brand && (
            <p className="text-[#00D4FF] font-medium uppercase tracking-wide text-sm mb-2">
              {product.brand}
            </p>
          )}
          <h1 className="text-3xl font-bold text-white mb-4">{product.name}</h1>
          {product.category && (
            <p className="text-gray-400 text-sm mb-4">
              {product.category}
              {product.subcategory ? ` / ${product.subcategory}` : ""}
            </p>
          )}

          {product.best_price !== null && (
            <div className="mb-6">
              <p className="text-sm text-gray-400 mb-1">Beste prijs vanaf</p>
              <p className="text-4xl font-bold text-[#00ff88]">
                €{product.best_price.toFixed(2)}
              </p>
            </div>
          )}

          {/* Description */}
          {product.description && (
            <div className="mb-6">
              <h2 className="text-white font-semibold mb-2">Beschrijving</h2>
              <p className="text-gray-400 text-sm leading-relaxed">{product.description}</p>
            </div>
          )}

          {/* Specifications */}
          {product.specifications && Object.keys(product.specifications).length > 0 && (
            <div className="mb-6">
              <h2 className="text-white font-semibold mb-3">Specificaties</h2>
              <dl className="space-y-2">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between py-2 border-b border-white/5">
                    <dt className="text-gray-400 text-sm capitalize">{key}</dt>
                    <dd className="text-white text-sm">{String(value)}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          {/* Offers preview */}
          {offers.length > 0 && (
            <div className="mb-6">
              <h2 className="text-white font-semibold mb-3">
                Beschikbare prijzen ({offers.length})
              </h2>
              <div className="space-y-2">
                {offers.slice(0, 3).map((offer) => (
                  <div
                    key={offer.id}
                    className="flex items-center justify-between px-4 py-3 rounded-lg bg-white/5"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-white/5 rounded flex items-center justify-center">
                        <span className="text-xs font-bold text-gray-400">
                          {offer.retailer.name.slice(0, 2)}
                        </span>
                      </div>
                      <span className="text-white text-sm">{offer.retailer.name}</span>
                    </div>
                    <span className="text-[#00ff88] font-bold">
                      €{offer.total_price.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to={`/compare/${product.slug}`}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-[#00ff88] text-[#0a0a14] font-bold hover:bg-[#00ff88]/90 transition-colors"
            >
              <BarChart3 className="w-5 h-5" />
              Bekijk alle prijzen
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
