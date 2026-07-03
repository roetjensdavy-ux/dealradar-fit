interface LoadingSkeletonProps {
  count?: number;
  type?: "card" | "table" | "detail";
}

function CardSkeleton() {
  return (
    <div className="glass-card p-4 animate-pulse">
      <div className="aspect-square bg-white/5 rounded-lg mb-4" />
      <div className="h-4 bg-white/5 rounded w-3/4 mb-2" />
      <div className="h-4 bg-white/5 rounded w-1/2 mb-4" />
      <div className="h-6 bg-white/5 rounded w-1/3" />
    </div>
  );
}

function TableSkeleton() {
  return (
    <div className="glass-card overflow-hidden animate-pulse">
      <div className="h-12 bg-white/5 border-b border-white/5" />
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-16 bg-white/[0.02] border-b border-white/5" />
      ))}
    </div>
  );
}

function DetailSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="aspect-square bg-white/5 rounded-lg" />
        <div>
          <div className="h-8 bg-white/5 rounded w-3/4 mb-4" />
          <div className="h-4 bg-white/5 rounded w-1/2 mb-2" />
          <div className="h-4 bg-white/5 rounded w-2/3 mb-6" />
          <div className="h-12 bg-white/5 rounded w-1/3 mb-4" />
          <div className="h-20 bg-white/5 rounded w-full" />
        </div>
      </div>
    </div>
  );
}

export default function LoadingSkeleton({ count = 8, type = "card" }: LoadingSkeletonProps) {
  if (type === "table") return <TableSkeleton />;
  if (type === "detail") return <DetailSkeleton />;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[...Array(count)].map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}
