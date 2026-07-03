import { Search, X, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useSearch } from "../hooks/useSearch";

interface SearchBarProps {
  variant?: "hero" | "nav";
}

export default function SearchBar({ variant = "hero" }: SearchBarProps) {
  const { query, setQuery, results, isLoading, hasQuery } = useSearch();
  const isHero = variant === "hero";

  return (
    <div className={`relative ${isHero ? "w-full max-w-2xl mx-auto" : "w-full max-w-md"}`}>
      <div className="relative">
        <Search className={`absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 ${isHero ? "w-6 h-6" : "w-5 h-5"}`} />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Zoek naar producten..."
          className={`w-full bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#00ff88]/50 focus:ring-1 focus:ring-[#00ff88]/50 transition-all ${
            isHero
              ? "pl-14 pr-12 py-4 rounded-2xl text-lg"
              : "pl-12 pr-10 py-2.5 rounded-xl text-sm"
          }`}
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Autocomplete dropdown */}
      {hasQuery && query.length >= 2 && (
        <div className="absolute top-full left-0 right-0 mt-2 glass-card overflow-hidden z-50">
          {isLoading ? (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="w-5 h-5 text-[#00ff88] animate-spin" />
            </div>
          ) : results.length > 0 ? (
            <ul className="max-h-80 overflow-y-auto py-2">
              {results.map((product) => (
                <li key={product.id}>
                  <Link
                    to={`/products/${product.slug}`}
                    onClick={() => setQuery("")}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors"
                  >
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-10 h-10 object-cover rounded"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-white/5 rounded flex items-center justify-center">
                        <Search className="w-4 h-4 text-gray-500" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm truncate">{product.name}</p>
                      {product.brand && (
                        <p className="text-gray-500 text-xs">{product.brand}</p>
                      )}
                    </div>
                    {product.best_price !== null && (
                      <span className="text-[#00ff88] font-semibold text-sm">
                        €{product.best_price.toFixed(2)}
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-6">
              <p className="text-gray-400 text-sm">Geen resultaten gevonden</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
