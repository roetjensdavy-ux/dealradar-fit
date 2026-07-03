import { TrendingDown, Shield, Zap } from "lucide-react";
import SearchBar from "./SearchBar";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden py-16 sm:py-24">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#00ff88]/5 via-transparent to-transparent pointer-events-none" />
      
      {/* Subtle grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#00ff88]/10 border border-[#00ff88]/20 text-[#00ff88] text-sm font-medium mb-8">
          <Zap className="w-4 h-4" />
          Vergelijk prijzen van 50+ retailers
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight">
          Vind de beste prijs voor{" "}
          <span className="text-[#00ff88]">elk product</span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          Vergelijk prijzen bij alle grote retailers en bespaar tot wel 40% op je aankopen. 
          Wij zoeken, jij bespaart.
        </p>

        {/* Search bar */}
        <SearchBar variant="hero" />

        {/* Trust indicators */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 sm:gap-10">
          <div className="flex items-center gap-2 text-gray-500">
            <TrendingDown className="w-5 h-5 text-[#00ff88]" />
            <span className="text-sm">Beste prijzen gegarandeerd</span>
          </div>
          <div className="flex items-center gap-2 text-gray-500">
            <Shield className="w-5 h-5 text-[#00D4FF]" />
            <span className="text-sm">Betrouwbare retailers</span>
          </div>
          <div className="flex items-center gap-2 text-gray-500">
            <Zap className="w-5 h-5 text-[#ff9500]" />
            <span className="text-sm">Realtime prijsupdates</span>
          </div>
        </div>
      </div>
    </section>
  );
}
