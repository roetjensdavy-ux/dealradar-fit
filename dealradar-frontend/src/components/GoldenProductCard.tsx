import { Link } from "react-router-dom";
import { TrendingUp, Store, Award } from "lucide-react";
import type { Product } from "../types";

interface GoldenProductCardProps {
  product: Product;
  commission?: number;
}

export default function GoldenProductCard({ product, commission = 5 }: GoldenProductCardProps) {
  const potentialCommission = product.best_price
    ? (product.best_price * commission) / 100
    : 0;

  return (
    <Link
      to={`/products/${product.slug}`}
      className="glass-card overflow-hidden hover:border-[#ff9500]/40 transition-all duration-300 group block relative"
    >
      {/* Golden badge */}
      <div className="absolute top-3 left-3 z-10 bg-[#ff9500] text-[#0a0a14] px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1">
        <Award className="w-3.5 h-3.5" />
        Golden Deal
      </div>

      {/* Image */}
      <div className="aspect-square bg-white/5 relative overflow-hidden">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <TrendingUp className="w-16 h-16 text-[#ff9500]/30" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {product.brand && (
          <p className="text-xs text-[#ff9500] font-medium uppercase tracking-wide mb-1">
            {product.brand}
          </p>
        )}
        <h3 className="text-white font-semibold text-sm leading-tight mb-2 line-clamp-2 group-hover:text-[#ff9500] transition-colors">
          {product.name}
        </h3>
        {product.category && (
          <p className="text-xs text-gray-500 mb-3">{product.category}</p>
        )}

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5 text-gray-400">
            <Store className="w-3.5 h-3.5" />
            <span className="text-xs">{product.offer_count} retailers</span>
          </div>
          {product.best_price !== null && (
            <span className="text-[#00ff88] font-bold text-sm">
              €{product.best_price.toFixed(2)}
            </span>
          )}
        </div>

        {/* Commission indicator */}
        <div className="pt-3 border-t border-white/5">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">Potentiële commissie</span>
            <span className="text-[#ff9500] font-bold text-sm">
              €{potentialCommission.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
