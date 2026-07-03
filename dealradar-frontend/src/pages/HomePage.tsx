import { Link } from "react-router-dom";
import { Search, BarChart3, Wallet, ArrowRight, ShoppingBag, Gamepad2, Home, Dumbbell, Laptop, Smartphone, Camera, Watch } from "lucide-react";
import HeroSection from "../components/HeroSection";
import ProductGrid from "../components/ProductGrid";
import LoadingSkeleton from "../components/LoadingSkeleton";
import { useProducts } from "../hooks/useProducts";

const categories = [
  { name: "Elektronica", icon: Laptop, slug: "elektronica" },
  { name: "Gaming", icon: Gamepad2, slug: "gaming" },
  { name: "Huishouden", icon: Home, slug: "huishouden" },
  { name: "Sport", icon: Dumbbell, slug: "sport" },
  { name: "Smartphones", icon: Smartphone, slug: "smartphones" },
  { name: "Camera's", icon: Camera, slug: "camera" },
  { name: "Wearables", icon: Watch, slug: "wearables" },
  { name: "Alle producten", icon: ShoppingBag, slug: "" },
];

const steps = [
  {
    icon: Search,
    title: "Zoek je product",
    description: "Zoek naar het product dat je wilt kopen. Wij hebben duizenden producten in onze database.",
    color: "#00ff88",
  },
  {
    icon: BarChart3,
    title: "Vergelijk prijzen",
    description: "Bekijk prijzen van alle grote retailers op één plek. Geen tabbladen meer wisselen.",
    color: "#00D4FF",
  },
  {
    icon: Wallet,
    title: "Bespaar geld",
    description: "Kies de beste deal en bespaar tot wel 40% op je aankopen. Elke euro telt.",
    color: "#ff9500",
  },
];

export default function HomePage() {
  const { data, isLoading } = useProducts({ page: 1, page_size: 8, sort: "newest" });

  return (
    <div>
      {/* Hero */}
      <HeroSection />

      {/* Featured products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Uitgelichte deals</h2>
            <p className="text-gray-400">De beste prijzen van dit moment</p>
          </div>
          <Link
            to="/products"
            className="hidden sm:inline-flex items-center gap-2 text-[#00ff88] hover:text-[#00ff88]/80 transition-colors font-medium"
          >
            Bekijk alles
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {isLoading ? (
          <LoadingSkeleton count={8} />
        ) : (
          <>
            <ProductGrid products={data?.products ?? []} />
            <div className="sm:hidden mt-6 text-center">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 text-[#00ff88] font-medium"
              >
                Bekijk alles
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </>
        )}
      </section>

      {/* How it works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">Hoe het werkt</h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            In drie simpele stappen vind je de beste prijs voor elk product
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={step.title} className="glass-card p-8 text-center group hover:border-white/15 transition-colors relative">
              {/* Step number */}
              <div 
                className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                style={{ backgroundColor: `${step.color}15`, color: step.color }}
              >
                {index + 1}
              </div>

              <div 
                className="w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-5"
                style={{ backgroundColor: `${step.color}10` }}
              >
                <step.icon className="w-7 h-7" style={{ color: step.color }} />
              </div>

              <h3 className="text-white font-semibold text-lg mb-3">{step.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">Populaire categorieën</h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            Kies een categorie en ontdek de beste deals
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              to={cat.slug ? `/products?category=${encodeURIComponent(cat.slug)}` : "/products"}
              className="glass-card p-6 text-center hover:border-[#00ff88]/30 transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mx-auto mb-3 group-hover:bg-[#00ff88]/10 transition-colors">
                <cat.icon className="w-6 h-6 text-gray-400 group-hover:text-[#00ff88] transition-colors" />
              </div>
              <span className="text-white font-medium text-sm group-hover:text-[#00ff88] transition-colors">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="glass-card p-8 sm:p-12 text-center relative overflow-hidden">
          {/* Background glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#00ff88]/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              Klaar om te besparen?
            </h2>
            <p className="text-gray-400 max-w-lg mx-auto mb-8">
              Start nu met vergelijken en ontdek hoeveel je kunt besparen op je volgende aankoop.
            </p>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[#00ff88] text-[#0a0a14] font-bold text-lg hover:bg-[#00ff88]/90 transition-colors"
            >
              <Search className="w-5 h-5" />
              Start met zoeken
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
