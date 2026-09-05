import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { Search, User, Menu, X, ArrowRight } from "lucide-react";
import { useAppData } from "@/app/context/AppDataContext";

import imgLogo from "@/imports/HomePage/b34d701fd1ceed4106f0f96c9254084af23d9951.png";

const NAV_LINKS = [
  { label: "Home", path: "/" },
  { label: "Shop", path: "/shop" },
<<<<<<< HEAD
  { label: "Photobooth", path: "/photobooth" },
=======
>>>>>>> e63a3699c0a27185ff16bb9f55e6d00f0af4c6f4
];

export default function Navbar() {
  const location = useLocation();
  const { orders } = useAppData(); // Pulls all shop items directly
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 40);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function isActive(path: string) {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  }

  // Filter items across the entire app
  const searchResults = query.trim()
    ? orders.filter(
        (item) =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.category?.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 h-[72px] transition-all duration-300"
        style={{
          background: scrolled ? "rgba(30, 21, 24, 0.85)" : "transparent",
          backdropFilter: "blur(12px)",
          borderBottom: scrolled
            ? "1px solid rgba(232,160,190,0.1)"
            : "1px solid transparent",
        }}
      >
        <div className="max-w-[1280px] mx-auto h-full flex items-center px-6 md:px-12">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0 h-[48px]">
            <img
              src={imgLogo}
              alt="Logo"
              className="h-full w-auto object-contain"
            />
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex flex-1 items-center gap-10 pl-12">
            {NAV_LINKS.map(({ label, path }) => (
              <div key={path} className="relative pb-1">
                <Link
                  to={path}
                  className={`font-['Inter',sans-serif] text-[15px] tracking-wide transition-colors duration-200 ${
                    isActive(path)
                      ? "font-semibold text-[#E8A0BE]"
                      : "font-normal text-[#F5F0F0] hover:text-[#E8A0BE]"
                  }`}
                >
                  {label}
                </Link>
                {isActive(path) && (
                  <motion.div
                    layoutId="nav-underline"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#E8A0BE] rounded-full"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Right icons */}
          <div className="ml-auto flex items-center gap-5">
            {/* Desktop Search Button */}
            <button
              onClick={() => setSearchOpen(true)}
              type="button"
              aria-label="Search items"
              className="hidden md:flex text-[#F5F0F0] hover:text-[#E8A0BE] transition-colors duration-200 cursor-pointer p-1"
            >
              <Search className="w-5 h-5" strokeWidth={2} />
            </button>

            {/* Admin Login Button */}
            <Link
              to="/login"
              aria-label="Admin login"
              className="hidden md:flex text-[#F5F0F0] hover:text-[#E8A0BE] transition-colors duration-200 p-1"
            >
              <User className="w-5 h-5" strokeWidth={2} />
            </Link>

            {/* Mobile hamburger */}
            <button
              onClick={() => setDrawerOpen(true)}
              aria-label="Open menu"
<<<<<<< HEAD
              className="md:hidden text-[#F5F0F0] hover:text-[#E8A0BE] transition-colors p-1 cursor-pointer"
=======
              className="md:hidden text-[#F5F0F0] hover:text-[#E8A0BE] transition-colors p-1"
>>>>>>> e63a3699c0a27185ff16bb9f55e6d00f0af4c6f4
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </nav>

      {/* ── Search Popup Modal Overlay ───────────────────────── */}
      <AnimatePresence>
        {searchOpen && (
          <div className="fixed inset-0 z-[100] flex flex-col items-center justify-start pt-24 px-4">
            {/* Dark Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setSearchOpen(false);
                setQuery("");
              }}
<<<<<<< HEAD
              className="absolute inset-0 bg-black/80 backdrop-blur-md cursor-pointer"
=======
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
>>>>>>> e63a3699c0a27185ff16bb9f55e6d00f0af4c6f4
            />

            {/* Search Input Box */}
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="relative z-10 w-full max-w-[620px] bg-[#140e11] border border-[#E8A0BE]/30 rounded-[20px] shadow-[0_20px_60px_rgba(0,0,0,0.9)] overflow-hidden"
            >
              {/* Header Input Area */}
              <div className="flex items-center gap-3 px-6 h-16 border-b border-[#E8A0BE]/15">
                <Search className="w-5 h-5 text-[#E8A0BE] flex-shrink-0" />
                <input
                  type="text"
                  autoFocus
                  placeholder="Search bouquets, fuzzy wire crafts..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full bg-transparent text-white font-sans text-base outline-none placeholder:text-white/40"
                />
                <button
                  onClick={() => {
                    setSearchOpen(false);
                    setQuery("");
                  }}
<<<<<<< HEAD
                  className="text-white/60 hover:text-white transition-colors p-1 cursor-pointer"
=======
                  className="text-white/60 hover:text-white transition-colors p-1"
>>>>>>> e63a3699c0a27185ff16bb9f55e6d00f0af4c6f4
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Dynamic Live Results Container */}
              <div className="max-h-[380px] overflow-y-auto p-3 flex flex-col gap-1">
                {query.trim() === "" ? (
                  <p className="text-center py-8 text-sm text-white/40 font-sans">
                    Type a product name or category to search...
                  </p>
                ) : searchResults.length > 0 ? (
                  searchResults.map((item) => (
                    <Link
                      key={item.id}
                      to={`/shop/${encodeURIComponent(item.id)}`}
                      onClick={() => {
                        setSearchOpen(false);
                        setQuery("");
                      }}
                      className="flex items-center gap-4 p-3 rounded-[12px] hover:bg-white/5 transition-colors group"
                    >
                      <img
                        src={item.images?.[0]}
                        alt={item.title}
                        className="w-12 h-12 rounded-[8px] object-cover border border-white/10"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white group-hover:text-[#E8A0BE] transition-colors truncate">
                          {item.title}
                        </p>
                        <p className="text-xs text-[#E8A0BE] font-serif">
                          ₱{item.price}
                        </p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-white/40 group-hover:text-[#E8A0BE] transition-colors" />
                    </Link>
                  ))
                ) : (
                  <p className="text-center py-8 text-sm text-white/40 font-sans">
                    No products found matching &quot;{query}&quot;
                  </p>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
<<<<<<< HEAD
              className="fixed inset-0 bg-black/70 z-[60] md:hidden cursor-pointer"
=======
              className="fixed inset-0 bg-black/70 z-[60] md:hidden"
>>>>>>> e63a3699c0a27185ff16bb9f55e6d00f0af4c6f4
              onClick={() => setDrawerOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.25 }}
              className="fixed top-0 right-0 bottom-0 w-[280px] bg-[#1a0e14] z-[70] md:hidden flex flex-col p-6 border-l border-[#E8A0BE]/10"
            >
              <div className="flex justify-between items-center mb-10">
                <img src={imgLogo} alt="Logo" className="h-10 w-auto" />
                <button
                  onClick={() => setDrawerOpen(false)}
<<<<<<< HEAD
                  className="text-[#F5F0F0] hover:text-[#E8A0BE] transition-colors cursor-pointer"
=======
                  className="text-[#F5F0F0] hover:text-[#E8A0BE] transition-colors"
>>>>>>> e63a3699c0a27185ff16bb9f55e6d00f0af4c6f4
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <nav className="flex flex-col gap-1">
                {NAV_LINKS.map(({ label, path }) => (
                  <Link
                    key={path}
                    to={path}
                    onClick={() => setDrawerOpen(false)}
                    className={`px-4 py-3 rounded-[10px] font-['Inter',sans-serif] text-[16px] transition-colors ${
                      isActive(path)
                        ? "bg-[#E8A0BE]/10 text-[#E8A0BE] font-semibold"
                        : "text-[#F5F0F0] hover:bg-white/5"
                    }`}
                  >
                    {label}
                  </Link>
                ))}
              </nav>

              <div className="mt-auto flex items-center gap-4 pt-6 border-t border-[#E8A0BE]/10">
                <button
                  onClick={() => {
                    setDrawerOpen(false);
                    setSearchOpen(true);
                  }}
<<<<<<< HEAD
                  className="text-[#F5F0F0] cursor-pointer hover:text-[#E8A0BE] transition-colors"
=======
                  className="text-[#F5F0F0]"
>>>>>>> e63a3699c0a27185ff16bb9f55e6d00f0af4c6f4
                  aria-label="Search"
                >
                  <Search className="w-5 h-5" />
                </button>
                <Link
                  to="/login"
                  onClick={() => setDrawerOpen(false)}
<<<<<<< HEAD
                  className="text-[#F5F0F0] hover:text-[#E8A0BE] transition-colors"
=======
                  className="text-[#F5F0F0]"
>>>>>>> e63a3699c0a27185ff16bb9f55e6d00f0af4c6f4
                  aria-label="Admin login"
                >
                  <User className="w-5 h-5" />
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}