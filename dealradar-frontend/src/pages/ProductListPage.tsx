import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { LayoutGrid } from "lucide-react";
import ProductGrid from "../components/ProductGrid";
import FilterSidebar from "../components/FilterSidebar";
import Pagination from "../components/Pagination";
import LoadingSkeleton from "../components/LoadingSkeleton";
import { useProducts } from "../hooks/useProducts";

// Demo data for filters
const DEMO_CATEGORIES = ["Elektronica", "Gaming", "Huishouden", "Sport", "Smartphones", "Camera's", "Wearables"];
const DEMO_BRANDS = ["Apple", "Samsung", "Sony", "Nintendo", "Logitech", "Bose", "Philips"];

export default function ProductListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const initialCategory = searchParams.get("category") ?? undefined;
  const initialBrand = searchParams.get("brand") ?? undefined;
  const initialPage = parseInt(searchParams.get("page") ?? "1", 10);
  const initialSort = searchParams.get("sort") ?? "newest";

  const [page, setPage] = useState(initialPage);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(initialCategory ?? null);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(initialBrand ?? null);
  const [sort, setSort] = useState(initialSort);
  // View mode can be extended later for list view
  const _viewMode = "grid";
  void _viewMode;

  const { data, isLoading } = useProducts({
    page,
    page_size: 12,
    category: selectedCategory ?? undefined,
    brand: selectedBrand ?? undefined,
    sort,
  });

  // Sync URL params
  useEffect(() => {
    const params = new URLSearchParams();
    if (page > 1) params.set("page", String(page));
    if (selectedCategory) params.set("category", selectedCategory);
    if (selectedBrand) params.set("brand", selectedBrand);
    if (sort !== "newest") params.set("sort", sort);
    setSearchParams(params, { replace: true });
  }, [page, selectedCategory, selectedBrand, sort, setSearchParams]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCategoryChange = (cat: string | null) => {
    setSelectedCategory(cat);
    setPage(1);
  };

  const handleBrandChange = (brand: string | null) => {
    setSelectedBrand(brand);
    setPage(1);
  };

  const handleSortChange = (newSort: string) => {
    setSort(newSort);
    setPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Alle producten</h1>
        <p className="text-gray-400">
          {data?.total ? `${data.total} producten gevonden` : "Ontdek ons complete aanbod"}
        </p>
      </div>

      <div className="flex gap-8">
        {/* Sidebar */}
        <FilterSidebar
          categories={DEMO_CATEGORIES}
          brands={DEMO_BRANDS}
          selectedCategory={selectedCategory}
          selectedBrand={selectedBrand}
          onCategoryChange={handleCategoryChange}
          onBrandChange={handleBrandChange}
          onSortChange={handleSortChange}
          sort={sort}
        />

        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Toolbar */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <LayoutGrid className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-400">Grid weergave</span>
            </div>
            {data && (
              <span className="text-sm text-gray-500">
                Pagina {data.page} van {Math.ceil(data.total / data.page_size)}
              </span>
            )}
          </div>

          {/* Products */}
          {isLoading ? (
            <LoadingSkeleton count={12} />
          ) : (
            <>
              <ProductGrid products={data?.products ?? []} />
              {data && (
                <Pagination
                  page={data.page}
                  pageSize={data.page_size}
                  total={data.total}
                  onPageChange={handlePageChange}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
