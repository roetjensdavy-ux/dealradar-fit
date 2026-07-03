import { SlidersHorizontal, X } from "lucide-react";
import { useState } from "react";

interface FilterSidebarProps {
  categories: string[];
  brands: string[];
  selectedCategory: string | null;
  selectedBrand: string | null;
  onCategoryChange: (cat: string | null) => void;
  onBrandChange: (brand: string | null) => void;
  onSortChange: (sort: string) => void;
  sort: string;
}

export default function FilterSidebar({
  categories,
  brands,
  selectedCategory,
  selectedBrand,
  onCategoryChange,
  onBrandChange,
  onSortChange,
  sort,
}: FilterSidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const sortOptions = [
    { value: "price_asc", label: "Prijs: laag naar hoog" },
    { value: "price_desc", label: "Prijs: hoog naar laag" },
    { value: "name_asc", label: "Naam: A-Z" },
    { value: "newest", label: "Nieuwste eerst" },
  ];

  const hasFilters = selectedCategory || selectedBrand;

  const filterContent = (
    <div className="space-y-6">
      {/* Sort */}
      <div>
        <h3 className="text-white font-semibold mb-3 text-sm uppercase tracking-wide">Sorteren</h3>
        <select
          value={sort}
          onChange={(e) => onSortChange(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#00ff88]/50"
        >
          {sortOptions.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-[#0a0a14]">
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Categories */}
      {categories.length > 0 && (
        <div>
          <h3 className="text-white font-semibold mb-3 text-sm uppercase tracking-wide">Categorie</h3>
          <div className="space-y-1.5 max-h-48 overflow-y-auto">
            <button
              onClick={() => onCategoryChange(null)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                !selectedCategory ? "bg-[#00ff88]/10 text-[#00ff88]" : "text-gray-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              Alle categorieën
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => onCategoryChange(cat === selectedCategory ? null : cat)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  cat === selectedCategory ? "bg-[#00ff88]/10 text-[#00ff88]" : "text-gray-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Brands */}
      {brands.length > 0 && (
        <div>
          <h3 className="text-white font-semibold mb-3 text-sm uppercase tracking-wide">Merk</h3>
          <div className="space-y-1.5 max-h-48 overflow-y-auto">
            <button
              onClick={() => onBrandChange(null)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                !selectedBrand ? "bg-[#00ff88]/10 text-[#00ff88]" : "text-gray-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              Alle merken
            </button>
            {brands.map((brand) => (
              <button
                key={brand}
                onClick={() => onBrandChange(brand === selectedBrand ? null : brand)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  brand === selectedBrand ? "bg-[#00ff88]/10 text-[#00ff88]" : "text-gray-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                {brand}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Clear filters */}
      {hasFilters && (
        <button
          onClick={() => {
            onCategoryChange(null);
            onBrandChange(null);
          }}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white transition-colors text-sm"
        >
          <X className="w-4 h-4" />
          Wis filters
        </button>
      )}
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 transition-colors mb-4"
      >
        <SlidersHorizontal className="w-4 h-4" />
        Filters
        {hasFilters && (
          <span className="w-5 h-5 rounded-full bg-[#00ff88] text-[#0a0a14] text-xs font-bold flex items-center justify-center">
            !
          </span>
        )}
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
      )}

      {/* Mobile drawer */}
      <div
        className={`lg:hidden fixed top-0 left-0 bottom-0 w-80 max-w-[85vw] z-50 bg-[#0a0a14] border-r border-white/10 p-6 overflow-y-auto transform transition-transform duration-300 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-white font-bold text-lg">Filters</h2>
          <button onClick={() => setMobileOpen(false)} className="text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>
        {filterContent}
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-64 shrink-0">
        <div className="sticky top-24 glass-card p-5">
          {filterContent}
        </div>
      </aside>
    </>
  );
}
