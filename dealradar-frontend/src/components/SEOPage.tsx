import { Link } from "react-router-dom";
import type { Product } from "../types";
import ProductCard from "./ProductCard";
import { TrendingUp, Search } from "lucide-react";

interface SEOPageProps {
  title: string;
  description: string;
  products: Product[];
  relatedTerms?: string[];
}

export default function SEOPageComponent({ title, description, products, relatedTerms }: SEOPageProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumbs */}
      <nav className="text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-[#00ff88] transition-colors">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-300">{title}</span>
      </nav>

      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">{title}</h1>
        <p className="text-gray-400 text-lg max-w-3xl leading-relaxed">{description}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <div className="glass-card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#00ff88]/10 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-[#00ff88]" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{products.length}</p>
            <p className="text-sm text-gray-500">Producten gevonden</p>
          </div>
        </div>
        <div className="glass-card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#00D4FF]/10 flex items-center justify-center">
            <Search className="w-5 h-5 text-[#00D4FF]" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">50+</p>
            <p className="text-sm text-gray-500">Retailers gescand</p>
          </div>
        </div>
        <div className="glass-card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#ff9500]/10 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-[#ff9500]" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">40%</p>
            <p className="text-sm text-gray-500">Maximale besparing</p>
          </div>
        </div>
      </div>

      {/* Products grid */}
      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-10">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="glass-card p-12 text-center mb-10">
          <Search className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">Geen producten gevonden voor deze zoekterm</p>
        </div>
      )}

      {/* Related terms */}
      {relatedTerms && relatedTerms.length > 0 && (
        <div className="glass-card p-6">
          <h2 className="text-white font-semibold mb-4">Gerelateerde zoektermen</h2>
          <div className="flex flex-wrap gap-2">
            {relatedTerms.map((term) => (
              <span
                key={term}
                className="px-3 py-1.5 rounded-lg bg-white/5 text-gray-400 text-sm border border-white/5"
              >
                {term}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="mt-10 glass-card p-8 text-center">
        <h2 className="text-2xl font-bold text-white mb-3">
          Zoek je iets anders?
        </h2>
        <p className="text-gray-400 mb-6">
          Gebruik onze zoekbalk om direct prijzen te vergelijken voor elk product.
        </p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#00ff88] text-[#0a0a14] font-semibold hover:bg-[#00ff88]/90 transition-colors"
        >
          <Search className="w-5 h-5" />
          Bekijk alle producten
        </Link>
      </div>
    </div>
  );
}
