import { ShoppingCart, Search } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useSearch } from "@/contexts/SearchContext";
import { motion } from "framer-motion";
import React from "react";
import { useIsMobile } from "@/hooks/use-mobile";

export const Header = () => {
  const { getItemCount, toggleCart } = useCart();
  const { query, setQuery } = useSearch();
  const navigate = useNavigate();
  const itemCount = getItemCount();
  const isMobile = useIsMobile();

  const [visible, setVisible] = React.useState(true);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const lastScrollY = React.useRef(0);
  React.useEffect(() => {
    const onScroll = () => {
      const current = window.scrollY;
      if (current > lastScrollY.current && current > 10) setVisible(false);
      else setVisible(true);
      lastScrollY.current = current;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      navigate("/");
      setTimeout(() => {
        const el2 = document.getElementById(id);
        if (el2) el2.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 0);
    }
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: visible ? 0 : -100 }}
      transition={{ duration: 0.3 }}
      className="fixed top-10 left-0 right-0 z-40 bg-white text-black py-4 px-2 md:px-6 border-b border-gray-200"
    >
      <div className="container mx-auto flex items-center gap-4 md:gap-6 font-space">
        {/* Left */}
        <div className="flex items-center gap-2">
          {/* Mobile menu button */}
          <button
            className="md:hidden -ml-3"
            aria-label="Open menu"
            onClick={() => setMobileOpen(true)}
          >
            <img
              src="https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2Fec1073ac2e8842d98b753683a8fc29a5?format=webp&width=64"
              alt="Menu"
              className="h-7 w-7"
            />
          </button>
          <a
            href="/"
            aria-label="Home"
            className="flex items-center"
            onClick={(e) => {
              e.preventDefault();
              navigate("/");
            }}
          >
            {isMobile ? (
              <span
                style={{ fontFamily: "Poppins, sans-serif" }}
                className="text-[13px] font-medium tracking-wide leading-none select-none"
              >
                BURNITDOWNYT
              </span>
            ) : (
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2F82c0af6178024f2eaa8410500e19f4e2?format=webp&width=800"
                alt="BURNITDOWNYT"
                className="h-10 w-auto object-contain shrink-0"
              />
            )}
          </a>
        </div>

        {/* Center - Desktop navigation */}
        <div className="hidden md:flex flex-1 justify-center">
          <nav className="flex items-center gap-6">
            <Link
              to="/"
              className="hover:text-gray-600 transition-colors text-sm"
            >
              Home
            </Link>
            <button
              onClick={() => scrollTo("shop")}
              className="hover:text-gray-600 transition-colors text-sm"
            >
              Shop
            </button>
            <a
              href="https://www.instagram.com/burnitdownyt?igsh=MTExOGNwOHJhZWYyYQ%3D%3D&utm_source=qr"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-600 transition-colors text-sm"
            >
              Latest News
            </a>
            <button
              onClick={() => scrollTo("merch")}
              className="hover:text-gray-600 transition-colors text-sm"
            >
              Merch
            </button>
            <Link
              to="/info"
              className="hover:text-gray-600 transition-colors text-sm"
            >
              Info
            </Link>
            <a
              href="https://drive.google.com/file/d/1NYbtlrr0m_L64UMf7SP6k8dqafEjyvhe/view?usp=drivesdk"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-600 transition-colors text-sm"
            >
              Media Kit
            </a>
            <Link
              to="/contact"
              className="hover:text-gray-600 transition-colors text-sm"
            >
              Contact Us
            </Link>
          </nav>
        </div>

        {/* Right - search + cart (desktop) / cart only (mobile) */}
        <div className="ml-auto flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 border rounded-full px-3 py-1">
            <Search className="w-4 h-4" />
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                scrollTo("shop");
              }}
              placeholder="Search products"
              className="outline-none text-sm w-32 md:w-48"
            />
          </div>
          <button
            onClick={toggleCart}
            className="relative cursor-pointer hover:text-gray-600 transition-colors"
            aria-label="Open cart"
          >
            <ShoppingCart className="w-5 h-5" />
            {itemCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
              >
                {itemCount}
              </motion.span>
            )}
          </button>
        </div>

        {/* Mobile drawer */}
        {mobileOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setMobileOpen(false)}
            />
            <div className="absolute top-0 left-0 h-full w-72 bg-white shadow-xl p-6 overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <span className="font-bold">Menu</span>
                <button
                  onClick={() => setMobileOpen(false)}
                  aria-label="Close menu"
                >
                  ✕
                </button>
              </div>
              <div className="mb-4 flex items-center gap-2 border rounded-full px-3 py-2">
                <Search className="w-4 h-4" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      setMobileOpen(false);
                      setTimeout(() => scrollTo("shop"), 0);
                    }
                  }}
                  placeholder="Search products"
                  className="outline-none text-sm w-full"
                />
              </div>
              <ul className="space-y-3">
                <li>
                  <Link
                    to="/"
                    onClick={() => setMobileOpen(false)}
                    className="block"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setMobileOpen(false);
                      scrollTo("shop");
                    }}
                    className="block w-full text-left"
                  >
                    Shop
                  </button>
                </li>
                <li>
                  <a
                    href="https://www.instagram.com/burnitdownyt?igsh=MTExOGNwOHJhZWYyYQ%3D%3D&utm_source=qr"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    Latest News
                  </a>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setMobileOpen(false);
                      scrollTo("merch");
                    }}
                    className="block w-full text-left"
                  >
                    Merch
                  </button>
                </li>
                <li>
                  <Link
                    to="/info"
                    onClick={() => setMobileOpen(false)}
                    className="block"
                  >
                    Info
                  </Link>
                </li>
                <li>
                  <a
                    href="https://drive.google.com/file/d/1NYbtlrr0m_L64UMf7SP6k8dqafEjyvhe/view?usp=drivesdk"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    Media Kit
                  </a>
                </li>
                <li>
                  <Link
                    to="/contact"
                    onClick={() => setMobileOpen(false)}
                    className="block"
                  >
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </motion.header>
  );
};
