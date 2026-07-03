import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Radar, Award, ShoppingBag } from "lucide-react";
import SearchBar from "./SearchBar";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { to: "/products", label: "Producten", icon: ShoppingBag },
    { to: "/golden-products", label: "Golden Deals", icon: Award },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#0a0a14]/80 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <Radar className="w-8 h-8 text-[#00ff88]" />
            <div className="flex items-baseline gap-0">
              <span className="text-white font-bold text-xl tracking-tight">DealRadar</span>
              <span className="text-[#00ff88] font-light text-sm">.fit</span>
            </div>
          </Link>

          {/* Desktop search */}
          <div className="hidden md:block flex-1 max-w-md mx-8">
            <SearchBar variant="nav" />
          </div>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/5 transition-colors text-sm font-medium"
              >
                <link.icon className="w-4 h-4" />
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/5"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-[#0a0a14]/95 backdrop-blur-xl border-t border-white/5">
          <div className="px-4 py-4 space-y-4">
            <SearchBar variant="nav" />
            <nav className="space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                >
                  <link.icon className="w-4 h-4" />
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
