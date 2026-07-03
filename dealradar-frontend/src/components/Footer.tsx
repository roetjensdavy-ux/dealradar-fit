import { Link } from "react-router-dom";
import { Radar, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-[#0a0a14]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <Radar className="w-6 h-6 text-[#00ff88]" />
              <span className="text-white font-bold text-lg">DealRadar.fit</span>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed">
              Vergelijk prijzen van duizenden producten bij alle grote retailers. Bespaar geld op elke aankoop.
            </p>
          </div>

          {/* Producten */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">Producten</h4>
            <ul className="space-y-2.5">
              <li>
                <Link to="/products" className="text-gray-500 hover:text-[#00ff88] transition-colors text-sm">
                  Alle producten
                </Link>
              </li>
              <li>
                <Link to="/golden-products" className="text-gray-500 hover:text-[#00ff88] transition-colors text-sm">
                  Golden Deals
                </Link>
              </li>
            </ul>
          </div>

          {/* Informatie */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">Informatie</h4>
            <ul className="space-y-2.5">
              <li>
                <span className="text-gray-500 text-sm">Hoe het werkt</span>
              </li>
              <li>
                <span className="text-gray-500 text-sm">Affiliate programma</span>
              </li>
              <li>
                <span className="text-gray-500 text-sm">Privacy beleid</span>
              </li>
            </ul>
          </div>

          {/* Categorieën */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">Populair</h4>
            <ul className="space-y-2.5">
              {["Elektronica", "Gaming", "Huishouden", "Sport"].map((cat) => (
                <li key={cat}>
                  <Link
                    to={`/products?category=${encodeURIComponent(cat)}`}
                    className="text-gray-500 hover:text-[#00ff88] transition-colors text-sm"
                  >
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-600 text-sm">
            &copy; {new Date().getFullYear()} DealRadar.fit. Alle rechten voorbehouden.
          </p>
          <p className="text-gray-600 text-sm flex items-center gap-1">
            Gemaakt met <Heart className="w-3.5 h-3.5 text-[#ff4444]" /> voor deal jagers
          </p>
        </div>
      </div>
    </footer>
  );
}
