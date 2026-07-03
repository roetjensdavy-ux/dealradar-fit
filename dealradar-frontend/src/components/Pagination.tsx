import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ page, pageSize, total, onPageChange }: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(page, totalPages);

  const getPageNumbers = (): (number | "ellipsis")[] => {
    const pages: (number | "ellipsis")[] = [];
    
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }

    pages.push(1);
    
    if (currentPage > 3) pages.push("ellipsis");
    
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);
    
    for (let i = start; i <= end; i++) pages.push(i);
    
    if (currentPage < totalPages - 2) pages.push("ellipsis");
    
    pages.push(totalPages);
    
    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <nav className="flex items-center justify-center gap-2 mt-8" aria-label="Paginering">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className="flex items-center px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        aria-label="Vorige pagina"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {getPageNumbers().map((p, i) =>
        p === "ellipsis" ? (
          <span key={`ellipsis-${i}`} className="px-2 text-gray-500">...</span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              p === currentPage
                ? "bg-[#00ff88] text-[#0a0a14]"
                : "bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10"
            }`}
          >
            {p}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="flex items-center px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        aria-label="Volgende pagina"
      >
        <ChevronRight className="w-4 h-4" />
      </button>

      <span className="ml-4 text-sm text-gray-500">
        {total} resultaten
      </span>
    </nav>
  );
}
