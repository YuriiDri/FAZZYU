import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight, ArrowLeft, Facebook } from "lucide-react";
import { useAppData } from "@/app/context/AppDataContext";

import imgSampleImage from "@/imports/ItemPage/8bbe4ef13bf84089b951b93a9d69a2de0996fbf9.png";
import imgThumb1 from "@/imports/ItemPage/d7078e40fc882ddccc638516132dfc75f027f319.png";
import imgThumb2 from "@/imports/ItemPage/cb355dfc381cb0a5d277a16df1bfa297ffd55503.png";

const fallbackImages = [imgSampleImage, imgThumb1, imgThumb2];

export default function ItemPage() {
  const { id: rawId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { orders } = useAppData();

  const id = rawId ? decodeURIComponent(rawId) : "";

  const order = orders.find(
    (o) =>
      String(o.id) === String(id) ||
      encodeURIComponent(String(o.id)) === rawId ||
      o.title.toLowerCase() === id.toLowerCase()
  );

  const images = order?.images && order.images.length > 0 ? order.images : fallbackImages;
  const [mainIndex, setMainIndex] = useState(0);

  useEffect(() => {
    setMainIndex(0);
  }, [id]);

  if (!order) {
    return (
      <div className="bg-[#1E1518] min-h-screen text-text-primary font-sans flex items-center justify-center p-6">
        <div className="text-center">
          <h2 className="font-serif text-2xl text-white mb-2">Item Not Found</h2>
          <p className="font-sans text-sm text-text-muted mb-6">
            The product you are looking for does not exist or has been removed.
          </p>
          <button
            onClick={() => navigate("/shop")}
            className="bg-brand-pink-deep text-white px-6 py-2.5 rounded-full font-sans text-sm hover:bg-accent-highlight transition-colors cursor-pointer"
          >
            Back to Shop
          </button>
        </div>
      </div>
    );
  }

  function prev() { setMainIndex((i) => (i - 1 + images.length) % images.length); }
  function next() { setMainIndex((i) => (i + 1) % images.length); }

  const isAvailable = order.status === "Available";

  // Formats the automated pre-filled text query string for Messenger
  const fbMessage = encodeURIComponent(
    `Hello! I would like to inquire about this item:\n\n• Product: ${order.title}\n• Price: ₱${order.price}\n• Link: ${window.location.href}`
  );
  const messengerUrl = `https://m.me/fazzyuu?text=${fbMessage}`;

  return (
    <div className="bg-bg-base min-h-screen text-text-primary font-sans">
      <div className="page-container py-8 lg:py-12">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35 }}
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 font-sans text-sm text-text-muted hover:text-text-primary transition-colors mb-8 group cursor-pointer"
        >
          <motion.span whileHover={{ x: -3 }}>
            <ArrowLeft className="w-4 h-4" />
          </motion.span>
          Back
        </motion.button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          {/* ── Left: Image Area ── */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex gap-3"
          >
            <div className="flex flex-col gap-2 w-[72px] flex-shrink-0">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setMainIndex(i)}
                  className={`block w-full rounded-[10px] overflow-hidden border-2 transition-all duration-200 cursor-pointer ${
                    mainIndex === i
                      ? "border-border-accent"
                      : "border-transparent opacity-50 hover:opacity-80"
                  }`}
                  style={{ aspectRatio: "1/1" }}
                >
                  <img src={img} alt={`Thumbnail ${i + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            <div className="flex-1 relative rounded-[16px] overflow-hidden" style={{ aspectRatio: "4/5" }}>
              <AnimatePresence mode="wait">
                <motion.img
                  key={mainIndex}
                  src={images[mainIndex]}
                  alt={order.title}
                  initial={{ opacity: 0, scale: 1.03 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.25 }}
                  className="w-full h-full object-cover"
                />
              </AnimatePresence>

              <button
                onClick={prev}
                aria-label="Previous image"
                className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center hover:bg-brand-pink-deep/70 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4 text-white" />
              </button>
              <button
                onClick={next}
                aria-label="Next image"
                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center hover:bg-brand-pink-deep/70 transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4 text-white" />
              </button>

              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                {images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setMainIndex(i)}
                    className={`h-1.5 rounded-full transition-all duration-200 cursor-pointer ${
                      mainIndex === i ? "bg-brand-pink w-4" : "bg-white/40 w-1.5"
                    }`}
                  />
                ))}
              </div>
            </div>
          </motion.div>

          {/* ── Right: Product Info ── */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="flex flex-col gap-5"
          >
            <div>
              <span
                className={`inline-block px-3 py-0.5 rounded-full font-sans text-[11px] font-medium ${
                  isAvailable
                    ? "bg-status-bg text-status-text"
                    : "bg-red-900/70 text-red-200"
                }`}
              >
                {order.status}
              </span>
            </div>

            <h1 className="font-serif leading-tight text-white" style={{ fontSize: "clamp(1.75rem, 2.5vw + 0.5rem, 2.75rem)" }}>
              {order.title}
            </h1>

            <p className="font-serif text-[2rem] text-accent-highlight leading-none">
              ₱{order.price}
            </p>

            <p className="font-sans text-sm text-text-muted leading-relaxed">
              {order.description || "Handcrafted wire creation made with love."}
            </p>

            {/* Facebook CTA */}
            <motion.a
              href={messengerUrl}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="mt-2 flex items-center justify-center gap-3 bg-brand-pink-deep text-white rounded-full py-3.5 font-sans font-medium text-[15px] cursor-pointer shadow-[0_4px_24px_rgba(212,106,147,0.35)] hover:shadow-[0_6px_36px_rgba(212,106,147,0.5)] transition-shadow"
            >
              <div className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center">
                <Facebook className="w-4 h-4 text-white" />
              </div>
              Inquire on Facebook
            </motion.a>
          </motion.div>
        </div>
      </div>

      <footer className="border-t border-border-accent/10 py-4 text-center mt-12">
        <p className="font-sans text-sm text-text-muted">© 2026 All rights reserved.</p>
      </footer>
    </div>
  );
}