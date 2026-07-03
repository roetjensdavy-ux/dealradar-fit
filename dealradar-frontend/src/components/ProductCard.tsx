import { Link } from "react-router-dom";
import { TrendingDown, Store } from "lucide-react";
import type { Product } from "../types";
import PriceBadge from "./PriceBadge";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link
      to={`/products/${product.slug}`}
      className="glass-card overflow-hidden hover:border-[#00ff88]/30 transition-all duration-300 group block"
    >
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
            <TrendingDown className="w-16 h-16 text-gray-600" />
          </div>
        )}
        {product.best_price !== null && (
          <div className="absolute top-3 right-3 bg-[#00ff88] text-[#0a0a14] px-2.5 py-1 rounded-full text-xs font-bold">
            Vanaf €{product.best_price.toFixed(2)}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {product.brand && (
          <p className="text-xs text-[#00D4FF] font-medium uppercase tracking-wide mb-1">
            {product.brand}
          </p>
        )}
        <h3 className="text-white font-semibold text-sm leading-tight mb-2 line-clamp-2 group-hover:text-[#00ff88] transition-colors">
          {product.name}
        </h3>
        {product.category && (
          <p className="text-xs text-gray-500 mb-3">{product.category}</p>
        )}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-gray-400">
            <Store className="w-3.5 h-3.5" />
            <span className="text-xs">{product.offer_count} retailers</span>
          </div>
          <PriceBadge badge={product.best_price !== null ? "cheapest" : null} />
        </div>
      </div>
    </Link>
  );
}
