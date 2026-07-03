interface PriceBadgeProps {
  badge: "cheapest" | "best_deal" | null;
}

export default function PriceBadge({ badge }: PriceBadgeProps) {
  if (!badge) return null;

  const styles = {
    cheapest: "bg-[#00ff88]/10 text-[#00ff88] border border-[#00ff88]/30",
    best_deal: "bg-[#ff9500]/10 text-[#ff9500] border border-[#ff9500]/30",
  };

  const labels = {
    cheapest: "Goedkoopst",
    best_deal: "Beste Deal",
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${styles[badge]}`}>
      {labels[badge]}
    </span>
  );
}
