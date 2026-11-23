import { useState } from "react";
import { Link } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  SlidersHorizontal,
  ChevronDown,
  ArrowRight,
  Facebook,
  Sparkles,
  Star,
  Eye,
  EyeOff,
  Trash2,
} from "lucide-react";
import { useAppData, type Order } from "@/app/context/AppDataContext";
import { useHighlightedProducts } from "@/app/hooks/useHighlightedProducts";

import imgFallback from "@/imports/ShopPage/bd0d35e3b33ca2ee7e667baf374d09ada53d69bc.png";

const SORT_OPTIONS = ["Popular", "Price: Low to High", "Price: High to Low", "Newest"];

type ShopItem = {
  id: string;
  name: string;
  price: number;
  category: string;
  status: Order["status"];
  image: string;
};

export default function ShopPage() {
  const { orders } = useAppData();
  const {
    highlightedIds,
    isHighlighted,
    toggleHighlight,
    clearHighlights,
  } = useHighlightedProducts();

  const [activeCategory, setActiveCategory] = useState("All");
  const [sortBy, setSortBy] = useState("Popular");
  const [showSort, setShowSort] = useState(false);
  const [isHighlightsHidden, setIsHighlightsHidden] = useState(false);

  // Only hide orders that are client-submitted custom orders (starting with #YC-CUST-).
  const shopItems: ShopItem[] = orders
    .filter((o) => !o.id.startsWith("#YC-CUST-"))
    .map((o) => ({
      id: o.id,
      name: o.title,
      price: o.price,
      category: o.category,
      status: o.status,
      image: o.images && o.images.length > 0 ? o.images[0] : imgFallback,
    }));

  // Preserve the order in which items were highlighted
  const highlightedItems: ShopItem[] = highlightedIds
    .map((id) => shopItems.find((item) => item.id === id))
    .filter((item): item is ShopItem => Boolean(item));

  const categories = [
    "All",
    ...Array.from(new Set(shopItems.map((i) => i.category).filter(Boolean))),
  ];

  const filtered = shopItems
    .filter((p) => activeCategory === "All" || p.category === activeCategory)
    .sort((a, b) => {
      if (sortBy === "Price: Low to High") return a.price - b.price;
      if (sortBy === "Price: High to Low") return b.price - a.price;
      return 0;
    });

  return (
    <div className="bg-bg-base min-h-screen text-text-primary font-sans relative">
      <div className="page-container py-10 lg:py-14">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <h1
            className="font-serif"
            style={{ fontSize: "clamp(2rem, 3.5vw + 0.5rem, 3rem)" }}
          >
            Shop Our Creations
          </h1>
          <p className="font-sans text-sm text-text-muted mt-2">
            Handmade fuzzy wire bouquets, dolls, and themed crafts.
          </p>
        </motion.div>

        {/* Highlighted Bouquets Showcase (Renders ONLY when at least 1 product is starred) */}
        <AnimatePresence>
          {highlightedItems.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
              className="mb-8 rounded-[20px] bg-bg-surface/90 border border-[#ca498c]/35 p-5 sm:p-6 shadow-[0_8px_32px_rgba(202,73,140,0.14)]"
            >
              {/* Top Row: Title & Red Clear Highlights Button */}
              <div
                className={`flex flex-wrap items-center justify-between gap-3 ${
                  isHighlightsHidden ? "" : "mb-4"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-8 h-8 rounded-full bg-[#ca498c]/20 border border-[#ca498c]/40 flex items-center justify-center text-[#E8A0BE]">
                    <Star className="w-4 h-4 fill-amber-300 text-amber-300" />
                  </span>
                  <div>
                    <h2 className="font-serif text-xl sm:text-2xl text-text-primary leading-tight">
                      Highlighted Bouquets
                    </h2>
                    <p className="font-sans text-xs text-text-muted">
                      {isHighlightsHidden
                        ? `${highlightedItems.length} starred ${
                            highlightedItems.length === 1 ? "item" : "items"
                          } hidden`
                        : `Your starred favorites (${highlightedItems.length})`}
                    </p>
                  </div>
                </div>

                {/* Red Clear Highlights Button */}
                <button
                  type="button"
                  onClick={() => {
                    clearHighlights();
                    setIsHighlightsHidden(false);
                  }}
                  className="text-xs font-medium text-red-200 hover:text-white transition-colors px-3.5 py-1.5 rounded-full bg-red-600/25 hover:bg-red-600/45 border border-red-500/50 hover:border-red-400 flex items-center gap-1.5 cursor-pointer shadow-[0_2px_12px_rgba(220,38,38,0.2)]"
                >
                  <Trash2 className="w-3.5 h-3.5 text-red-400" />
                  <span>Clear highlights</span>
                </button>
              </div>

              {/* Collapsible Highlighted Bouquets Grid */}
              <AnimatePresence initial={false}>
                {!isHighlightsHidden && (
                  <motion.div
                    key="highlighted-grid"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div
                      className="grid gap-5 pt-1"
                      style={{
                        gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                      }}
                    >
                      {highlightedItems.map((item, i) => (
                        <ProductCard
                          key={`highlight-${item.id}`}
                          item={item}
                          index={i}
                          highlighted={true}
                          onToggleHighlight={toggleHighlight}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Bottom-Right Hide / Unhide Toggle */}
              <div className="mt-4 pt-3 border-t border-border-accent/15 flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsHighlightsHidden((prev) => !prev)}
                  className="text-xs font-medium text-text-muted hover:text-[#E8A0BE] transition-colors px-3.5 py-1.5 rounded-full bg-black/30 hover:bg-black/50 border border-border-accent/25 hover:border-[#ca498c]/50 flex items-center gap-1.5 cursor-pointer"
                >
                  {isHighlightsHidden ? (
                    <>
                      <Eye className="w-3.5 h-3.5 text-[#E8A0BE]" />
                      <span>Unhide highlights</span>
                    </>
                  ) : (
                    <>
                      <EyeOff className="w-3.5 h-3.5 text-text-muted" />
                      <span>Hide highlights</span>
                    </>
                  )}
                </button>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* Filter row */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.08 }}
          className="flex flex-wrap items-center gap-2 mb-8"
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`h-11 px-5 rounded-full font-sans text-[13px] font-medium transition-all duration-200 cursor-pointer ${
                activeCategory === cat
                  ? "bg-brand-pink-deep text-white shadow-[0_4px_20px_rgba(212,106,147,0.35)]"
                  : "bg-bg-surface border border-border-accent/30 text-text-muted hover:border-border-accent hover:text-text-primary"
              }`}
            >
              {cat}
            </button>
          ))}

          <div className="ml-auto flex items-center gap-2">
            {/* Sort dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowSort((v) => !v)}
                className="h-11 px-4 rounded-[10px] bg-bg-surface border border-border-accent/30 flex items-center gap-2 font-sans text-[13px] text-text-muted hover:border-border-accent transition-colors min-w-[160px] cursor-pointer"
              >
                <span className="flex-1 text-left">{sortBy}</span>
                <ChevronDown
                  className={`w-4 h-4 flex-shrink-0 transition-transform ${
                    showSort ? "rotate-180" : ""
                  }`}
                />
              </button>
              <AnimatePresence>
                {showSort && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 right-0 mt-1 bg-bg-surface border border-border-accent/30 rounded-[10px] overflow-hidden z-30 shadow-xl"
                  >
                    {SORT_OPTIONS.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => {
                          setSortBy(opt);
                          setShowSort(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 font-sans text-[13px] transition-colors cursor-pointer ${
                          sortBy === opt
                            ? "text-brand-pink bg-brand-pink/5"
                            : "text-text-muted hover:bg-white/5 hover:text-text-primary"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Filter button */}
            <button className="h-11 px-4 rounded-[10px] bg-bg-surface border border-border-accent/30 flex items-center gap-2 font-sans text-[13px] text-text-muted hover:border-border-accent hover:text-text-primary transition-colors cursor-pointer">
              <SlidersHorizontal className="w-4 h-4" />
              Filter
            </button>
          </div>
        </motion.div>

        {/* Product grid */}
        <AnimatePresence mode="popLayout">
          <motion.div
            key={activeCategory + sortBy}
            className="grid gap-6"
            style={{
              gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
            }}
          >
            {filtered.map((item, i) => (
              <ProductCard
                key={item.id}
                item={item}
                index={i}
                highlighted={isHighlighted(item.id)}
                onToggleHighlight={toggleHighlight}
              />
            ))}
            {filtered.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full text-center py-20 font-sans text-base text-text-muted"
              >
                No products in this category yet.
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <footer className="border-t border-border-accent/10 py-4 text-center mt-8">
        <p className="font-sans text-sm text-text-muted">
          © 2026 All rights reserved.
        </p>
      </footer>

      {/* Floating Customize Yours Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <Link
          to="/shop/customize"
          className="flex items-center gap-2.5 px-6 py-3.5 bg-[#ca498c] hover:bg-[#b83d7a] text-white rounded-full shadow-[0_6px_30px_rgba(209,126,165,0.6)] font-sans font-medium text-sm transition-all transform hover:scale-105 active:scale-95 cursor-pointer border border-white/20"
        >
          <Sparkles className="w-4 h-4 text-white animate-pulse" />
          <span>Customize Yours</span>
        </Link>
      </div>
    </div>
  );
}

function ProductCard({
  item,
  index,
  highlighted,
  onToggleHighlight,
}: {
  item: ShopItem;
  index: number;
  highlighted: boolean;
  onToggleHighlight: (id: string) => void;
}) {
  const isAvailable = item.status === "Available";

  const fbMessage = encodeURIComponent(
    `Hello! I would like to inquire about this item:\n\n• Product: ${item.name}\n• Price: ₱${item.price}\n• Link: ${window.location.origin}/shop/${encodeURIComponent(item.id)}`
  );
  const messengerUrl = `https://m.me/fazzyuu?text=${fbMessage}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 12, scale: 0.97 }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
      layout
      whileHover={{ y: -4, scale: 1.02 }}
      className={`flex flex-col rounded-[16px] overflow-hidden bg-bg-surface border transition-all duration-200 shadow-[0_2px_16px_rgba(0,0,0,0.4)] ${
        highlighted
          ? "border-[#ca498c]/70 shadow-[0_4px_24px_rgba(202,73,140,0.25)]"
          : "border-border-accent/20 hover:border-border-accent/50"
      }`}
    >
      <Link to={`/shop/${encodeURIComponent(item.id)}`} className="block group">
        <div className="relative overflow-hidden" style={{ aspectRatio: "4/3" }}>
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />

          {/* Upper-Left Highlight Star Button */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onToggleHighlight(item.id);
            }}
            aria-label={
              highlighted ? "Remove from highlights" : "Highlight bouquet"
            }
            title={highlighted ? "Remove highlight" : "Highlight this creation"}
            className={`absolute top-3 left-3 z-10 w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-200 cursor-pointer ${
              highlighted
                ? "bg-[#ca498c] border-[#fdd0d0]/60 text-amber-300 shadow-[0_2px_14px_rgba(202,73,140,0.75)] scale-105"
                : "bg-black/55 backdrop-blur-md border-white/20 text-white/80 hover:text-amber-300 hover:border-[#ca498c]/60 hover:bg-black/75"
            }`}
          >
            <Star
              className={`w-4 h-4 transition-transform ${
                highlighted ? "fill-amber-300 text-amber-300" : ""
              }`}
            />
          </button>

          {/* Upper-Right Status Badge */}
          <div className="absolute top-3 right-3">
            <span
              className={`px-2.5 py-0.5 rounded-full font-sans text-[11px] font-medium ${
                isAvailable
                  ? "bg-status-bg text-status-text"
                  : "bg-red-900/70 text-red-200"
              }`}
            >
              {item.status}
            </span>
          </div>
        </div>

        <div className="px-4 pt-3 pb-1 flex items-end justify-between gap-2">
          <div className="min-w-0">
            <p className="font-sans text-[13px] font-medium text-text-primary truncate leading-snug group-hover:text-brand-pink transition-colors">
              {item.name}
            </p>
            <p className="font-serif text-[1.2rem] text-accent-highlight leading-tight mt-0.5">
              ₱{item.price}
            </p>
          </div>
          <div className="flex-shrink-0 text-text-muted group-hover:text-brand-pink transition-colors">
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </Link>

      <div className="px-4 pb-4 pt-2 mt-auto">
        <a
          href={messengerUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-2 bg-[#ca498c] hover:bg-[#b83d7a] text-white text-[13px] font-medium py-2 px-3 rounded-full transition-colors cursor-pointer shadow-md"
        >
          <Facebook className="w-4 h-4" />
          Inquire on Facebook
        </a>
      </div>
    </motion.div>
  );
}