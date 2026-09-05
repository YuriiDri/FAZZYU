import { useState } from "react";
import { Link } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { SlidersHorizontal, ChevronDown, ArrowRight } from "lucide-react";
import { useAppData, type Order } from "@/app/context/AppDataContext";

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
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortBy, setSortBy] = useState("Popular");
  const [showSort, setShowSort] = useState(false);

  // Index 0 of o.images is always the primary cover photo set via the heart button
  const shopItems: ShopItem[] = orders.map((o) => ({
    id: o.id,
    name: o.title,
    price: o.price,
    category: o.category,
    status: o.status,
    image: o.images && o.images.length > 0 ? o.images[0] : imgFallback,
  }));

  const categories = ["All", ...Array.from(new Set(shopItems.map((i) => i.category).filter(Boolean)))];

  const filtered = shopItems
    .filter((p) => activeCategory === "All" || p.category === activeCategory)
    .sort((a, b) => {
      if (sortBy === "Price: Low to High") return a.price - b.price;
      if (sortBy === "Price: High to Low") return b.price - a.price;
      return 0;
    });

  return (
    <div className="bg-bg-base min-h-screen text-text-primary font-sans">
      <div className="page-container py-10 lg:py-14">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <h1 className="font-serif" style={{ fontSize: "clamp(2rem, 3.5vw + 0.5rem, 3rem)" }}>
            Shop Our Creations
          </h1>
          <p className="font-sans text-sm text-text-muted mt-2">
            Handmade fuzzy wire bouquets, dolls, and themed crafts.
          </p>
        </motion.div>

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
                <ChevronDown className={`w-4 h-4 flex-shrink-0 transition-transform ${showSort ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence>
                {showSort && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 right-0 mt-1 bg-bg-surface border border-border-accent/30 rounded-[10px] overflow-hidden z-30"
                  >
                    {SORT_OPTIONS.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => { setSortBy(opt); setShowSort(false); }}
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
            style={{ gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))" }}
          >
            {filtered.map((item, i) => (
              <ProductCard key={item.id} item={item} index={i} />
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
        <p className="font-sans text-sm text-text-muted">© 2026 All rights reserved.</p>
      </footer>
    </div>
  );
}

function ProductCard({ item, index }: { item: ShopItem; index: number }) {
  const isAvailable = item.status === "Available";

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 12, scale: 0.97 }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
      layout
      whileHover={{ y: -4, scale: 1.02 }}
    >
      <Link to={`/shop/${encodeURIComponent(item.id)}`} className="block group">
        <div className="rounded-[16px] overflow-hidden bg-bg-surface border border-border-accent/20 group-hover:border-border-accent/50 transition-all duration-200 shadow-[0_2px_16px_rgba(0,0,0,0.4)]">
          {/* Image 4:3 */}
          <div className="relative overflow-hidden" style={{ aspectRatio: "4/3" }}>
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {/* Status pill */}
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

          {/* Footer */}
          <div className="px-4 py-3 flex items-end justify-between gap-2">
            <div className="min-w-0">
              <p className="font-sans text-[13px] font-medium text-text-primary truncate leading-snug">
                {item.name}
              </p>
              <p className="font-serif text-[1.2rem] text-accent-highlight leading-tight mt-0.5">
                ₱{item.price}
              </p>
            </div>
            <motion.div
              whileHover={{ x: 3 }}
              className="flex-shrink-0 text-text-muted group-hover:text-brand-pink transition-colors"
            >
              <ArrowRight className="w-4 h-4" />
            </motion.div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}