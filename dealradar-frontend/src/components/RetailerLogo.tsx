import { Store } from "lucide-react";

interface RetailerLogoProps {
  name: string;
  logoUrl: string | null;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "w-6 h-6",
  md: "w-8 h-8",
  lg: "w-10 h-10",
};

export default function RetailerLogo({ name, logoUrl, size = "md" }: RetailerLogoProps) {
  if (logoUrl) {
    return (
      <img
        src={logoUrl}
        alt={name}
        className={`${sizeClasses[size]} object-contain rounded`}
        loading="lazy"
      />
    );
  }

  return (
    <div className={`${sizeClasses[size]} flex items-center justify-center bg-white/5 rounded`}>
      <Store className="w-4 h-4 text-gray-400" />
    </div>
  );
}
