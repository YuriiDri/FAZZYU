import { useState, useCallback, useEffect, useRef } from "react";
import { Link } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight, ChevronDown, Facebook, Mail } from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/app/components/Card";
import { useAppData } from "@/app/context/AppDataContext";

import imgHeroBg from "@/imports/image.png";
import imgGalleryFallback from "@/imports/HomePage/8bbe4ef13bf84089b951b93a9d69a2de0996fbf9.png";
import imgMap from "@/imports/HomePage/b984e134a710d20bae607ec5d2a67a05932b3602.png";

const FALLBACK_SLIDES = [imgGalleryFallback];

function fadeInUp(delay = 0) {
  return {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.4, delay, ease: [0.25, 0.1, 0.25, 1] as const },
    viewport: { once: true, margin: "-60px" },
  } as const;
}

export default function HomePage() {
  return (
    <div className="bg-[#1E1518] text-text-primary min-h-screen font-sans overflow-x-hidden relative">
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background:
            "radial-gradient(circle at 55% 25%, rgba(220, 115, 156, 0.45) 0%, rgba(150, 95, 120, 0.25) 45%, rgba(30, 21, 24, 0.95) 85%)",
        }}
      />

      <div className="relative z-10 w-full overflow-hidden">
        <HeroSection />
        <GallerySection />
        <DeliverySection />
        <ContactSection />
        <footer className="border-t border-border-accent/10 py-4 text-center">
          <p className="font-sans text-sm text-text-muted">
            © 2026 All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
}

/* ── Hero ───────────────────────────────────────────────── */
function HeroSection() {
  return (
    <section
      className="relative flex items-center overflow-hidden"
      style={{ minHeight: "calc(100vh - 72px)" }}
    >
      <div 
        className="absolute right-[5%] lg:right-[10%] top-1/2 -translate-y-1/2 w-[350px] lg:w-[600px] h-[350px] lg:h-[600px] rounded-full pointer-events-none select-none z-0 blur-[100px]"
        style={{
          background: "radial-gradient(circle, rgba(240, 170, 200, 0.55) 0%, rgba(212, 106, 147, 0.3) 55%, transparent 100%)"
        }}
      />

      <div 
        className="absolute right-0 top-0 bottom-0 w-full lg:w-[68%] flex items-center justify-end lg:justify-center pointer-events-none select-none z-10 opacity-100 transition-opacity duration-300"
        style={{
          WebkitMaskImage: "linear-gradient(to bottom, black 88%, transparent 100%)",
          maskImage: "linear-gradient(to bottom, black 88%, transparent 100%)",
        }}
      >
        <style>{`
          @media (max-width: 767px) {
            .hero-bg-img-container {
              opacity: 0.55 !important;
            }
          }
        `}</style>
        <div className="hero-bg-img-container w-full h-full flex items-center justify-end lg:justify-center">
          <img
            src={imgHeroBg}
            alt=""
            aria-hidden
            className="max-h-[80vh] lg:max-h-[100vh] w-auto max-w-full object-contain drop-shadow-[0_15px_45px_rgba(212,106,147,0.35)]"
          />
        </div>
      </div>

      <div
        className="absolute inset-0 pointer-events-none z-15"
        style={{
          background:
            "linear-gradient(90deg, #1E1518 0%, #1E1518 30%, rgba(30,21,24,0.4) 55%, transparent 75%)",
        }}
      />

      <div className="page-container relative z-20 w-full grid grid-cols-1 lg:grid-cols-2 gap-8 py-16 lg:py-0">
        <div className="flex flex-col gap-4 justify-center items-start text-left max-w-[500px]">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.05 }}
          >
            <span className="inline-flex items-center bg-white/10 rounded-full px-5 py-1.5 text-[11px] tracking-[0.1em] uppercase font-sans text-text-primary">
              Handmade with love.
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.12 }}
            className="font-serif leading-tight text-white text-3xl sm:text-4xl lg:text-6xl"
          >
            Crafted with{" "}
            <span className="text-accent-highlight italic">Creativity,</span>
            <br />
            Made For You.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.22 }}
            className="font-sans text-sm sm:text-base text-text-muted leading-relaxed max-w-[420px]"
          >
            Unique and affordable fuzzy wire crafts and bouquets that speak from the heart.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.32 }}
          >
            <Link to="/shop">
              <motion.span
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center justify-center bg-brand-pink-deep text-white rounded-full px-8 lg:px-10 py-3 font-sans font-medium text-[15px] cursor-pointer shadow-[0_4px_32px_rgba(212,106,147,0.35)] transition-shadow hover:shadow-[0_6px_48px_rgba(212,106,147,0.5)]"
              >
                Shop Now
              </motion.span>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ── Gallery Preview (Dynamically Measured Width) ────────── */
function GallerySection() {
  const { galleryImages, getPrimaryImageIndex } = useAppData();

  const rawSlides = galleryImages.length > 0
    ? galleryImages.map((img) => img.src)
    : FALLBACK_SLIDES;

  const slides = [...rawSlides];
  
  if (galleryImages.length > 0) {
    const primaryIndex = galleryImages.findIndex(
      (img, idx) =>
        img.productId !== undefined && getPrimaryImageIndex(img.productId) === idx
    );

    if (primaryIndex > 0) {
      const [primaryImg] = slides.splice(primaryIndex, 1);
      slides.unshift(primaryImg);
    }
  }

  const [index, setIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [cardWidth, setCardWidth] = useState(260);
  const [maxIndex, setMaxIndex] = useState(0);

  useEffect(() => {
    function updateDimensions() {
      if (containerRef.current && cardRef.current) {
        const containerWidth = containerRef.current.clientWidth;
        const currentCardWidth = cardRef.current.offsetWidth || 260;
        setCardWidth(currentCardWidth);

        const gap = 16;
        const cardWithGap = currentCardWidth + gap;
        const visibleCount = Math.floor((containerWidth + gap) / cardWithGap) || 1;
        const calculatedMax = Math.max(0, slides.length - visibleCount);
        setMaxIndex(calculatedMax);
        if (index > calculatedMax) {
          setIndex(calculatedMax);
        }
      }
    }

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    const timer = setTimeout(updateDimensions, 50);
    return () => {
      window.removeEventListener("resize", updateDimensions);
      clearTimeout(timer);
    };
  }, [slides.length, index]);

  const prev = useCallback(() => setIndex((i) => Math.max(0, i - 1)), []);
  const next = useCallback(() => setIndex((i) => Math.min(maxIndex, i + 1)), [maxIndex]);

  return (
    <section className="py-12 lg:py-24 overflow-hidden">
      <div className="page-container w-full max-w-full">
        <Card variant="solid-border" className="px-4 py-6 sm:px-6 sm:py-8 lg:px-12 lg:py-10">
          <div className="mb-6">
            <motion.h2 {...fadeInUp(0)} className="font-serif text-2xl lg:text-[2rem] leading-tight text-text-primary">
              Our <span className="text-brand-pink italic">Gallery</span>
            </motion.h2>
            <motion.p {...fadeInUp(0.06)} className="font-sans text-xs lg:text-sm text-text-muted mt-1">
              A few of our handmade favorites.
            </motion.p>
          </div>

          <motion.div {...fadeInUp(0.1)} className="relative w-full">
            <div ref={containerRef} className="overflow-hidden rounded-[12px] w-full">
              <motion.div
                className="flex gap-4 w-full"
                animate={{ x: `calc(-${index} * (${cardWidth}px + 16px))` }}
                transition={{ type: "spring", stiffness: 280, damping: 32 }}
              >
                {slides.map((src, i) => (
                  <motion.div
                    key={i}
                    ref={i === 0 ? cardRef : null}
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                    className="flex-shrink-0 w-full sm:w-[260px] rounded-[12px] overflow-hidden mx-auto"
                    style={{ aspectRatio: "3/4" }}
                  >
                    <img
                      src={src}
                      alt={`Gallery ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                ))}
              </motion.div>
            </div>

            <button
              onClick={prev}
              disabled={index === 0}
              aria-label="Previous"
              className="absolute left-2 sm:-left-4 lg:-left-6 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-bg-surface/90 border border-border-accent/40 flex items-center justify-center disabled:opacity-25 hover:border-border-accent transition-colors cursor-pointer z-20 shadow-lg"
            >
              <ChevronLeft className="w-4 h-4 text-text-primary" />
            </button>
            <button
              onClick={next}
              disabled={index >= maxIndex}
              aria-label="Next"
              className="absolute right-2 sm:-right-4 lg:-right-6 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-bg-surface/90 border border-border-accent/40 flex items-center justify-center disabled:opacity-25 hover:border-border-accent transition-colors cursor-pointer z-20 shadow-lg"
            >
              <ChevronRight className="w-4 h-4 text-text-primary" />
            </button>
          </motion.div>
        </Card>
      </div>
    </section>
  );
}

/* ── Delivery ────────────────────────────────────────────── */
function DeliverySection() {
  const [isOpen, setIsOpen] = useState(false);

  const deliveryLocations = [
    "Along NagaRoad (PulangLupa Uno - CAA)",
    "Along Fruto Santos Ave Road (Sakayan sa PulangLupa Uno - 711 Bandang pa zapote)",
    "Along Tramo (Pulanglupa Uno - Bamboo Organ)",
    "Along Vergon (Aurora Drive Road)",
    "CAA (Saging to Balikatan)",
  ];

  return (
    <section className="py-12 lg:py-24">
      <div className="page-container">
        <motion.div {...fadeInUp(0)}>
          <Card variant="glow-border" className="p-5 sm:p-6 lg:p-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="flex flex-col gap-4">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <svg width="40" height="32" viewBox="0 0 66 52" fill="none">
                      <path
                        d="M42 4H4C2.9 4 2 4.9 2 6V38C2 39.1 2.9 40 4 40H8.5C9.4 43.4 12.4 46 16 46C19.6 46 22.6 43.4 23.5 40H42.5C43.4 43.4 46.4 46 50 46C53.6 46 56.6 43.4 57.5 40H62C63.1 40 64 39.1 64 38V26L54 8H42V4ZM42 12H51.5L59 24H42V12ZM16 42C13.8 42 12 40.2 12 38C12 35.8 13.8 34 16 34C18.2 34 20 35.8 20 38C20 40.2 18.2 42 16 42ZM50 42C47.8 42 46 40.2 46 38C46 35.8 47.8 34 50 34C52.2 34 54 35.8 54 38C54 40.2 52.2 42 50 42Z"
                        fill="#e8a0be"
                      />
                    </svg>
                  </div>
                  <h2 className="font-serif leading-tight text-xl sm:text-2xl lg:text-3xl">
                    We Offer{" "}
                    <span className="text-accent-highlight">Free Delivery!</span>
                  </h2>
                </div>
                <p className="font-sans text-sm sm:text-base text-text-muted leading-relaxed max-w-[400px]">
                  Within selected areas of Las Piñas — Pulanglupa Uno, Naga Road Area
                </p>

                <div className="mt-2 w-full max-w-[420px]">
                  <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center justify-between w-full px-4 py-3 bg-[#1E1518] border border-border-accent/30 rounded-[10px] font-sans text-xs sm:text-sm font-medium text-text-primary hover:border-border-accent transition-colors cursor-pointer"
                  >
                    <span>View Free Delivery Locations</span>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden w-full"
                      >
                        <div className="mt-2 p-4 bg-[#1E1518]/90 border border-border-accent/30 rounded-[10px] flex flex-col gap-3 font-sans text-sm text-text-muted">
                          <p className="font-medium text-text-primary text-[12px] sm:text-[13px] leading-relaxed pb-2.5 border-b border-border-accent/20">
                            Message us for inquiries of your locations, we offer free delivery, meet up and delivery
                          </p>
                          <ul className="flex flex-col gap-2">
                            {deliveryLocations.map((loc, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <span className="text-brand-pink mt-0.5 font-bold">•</span>
                                <span className="text-text-muted text-[12px] sm:text-[13px]">{loc}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <div className="relative rounded-[12px] overflow-hidden border border-border-accent/20 w-full" style={{ aspectRatio: "4/3" }}>
                <img src={imgMap} alt="Delivery area map" className="w-full h-full object-cover" />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-[200px] sm:w-[300px] h-[150px] sm:h-[200px] rounded-full opacity-25"
                    style={{ background: "radial-gradient(ellipse, rgba(212,106,147,0.8) 0%, transparent 70%)" }} />
                </div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full">
                  <svg width="30" height="36" viewBox="0 0 62 62" fill="none">
                    <path d="M31 4C19.4 4 10 13.4 10 25C10 38.5 31 58 31 58C31 58 52 38.5 52 25C52 13.4 42.6 4 31 4ZM31 32C27.1 32 24 28.9 24 25C24 21.1 27.1 18 31 18C34.9 18 38 21.1 38 25C38 28.9 34.9 32 31 32Z" fill="#d46a93" />
                  </svg>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}

/* ── Contact ─────────────────────────────────────────────── */
function ContactSection() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !message.trim()) {
      toast.error("Please fill in all fields.");
      return;
    }
    toast.success("Message sent! We'll get back to you soon.");
    setName("");
    setMessage("");
  }

  return (
    <section className="py-12 lg:py-24">
      <div className="page-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div {...fadeInUp(0)}>
            <Card variant="flat" className="h-full p-5 sm:p-6 lg:p-8 flex flex-col gap-6">
              <h2 className="font-serif leading-tight text-xl sm:text-2xl lg:text-3xl">
                {"Let's Create Something "}
                <span className="text-accent-highlight italic">Beautiful Together!</span>
              </h2>

              <div className="flex flex-col gap-4 sm:gap-5 mt-2">
                <a
                  href="https://www.facebook.com/fazzyuu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 group"
                >
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-[10px] bg-brand-pink-deep flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-200">
                    <Facebook className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-sans text-sm sm:text-[15px] text-text-primary group-hover:text-brand-pink transition-colors">
                    Message us on Facebook
                  </span>
                </a>

                <a
                  href="https://www.tiktok.com/@ate_yuriiiiiii"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 group"
                >
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-[10px] bg-brand-pink-deep flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-200">
                    <TikTokIcon />
                  </div>
                  <span className="font-sans text-sm sm:text-[15px] text-text-primary group-hover:text-brand-pink transition-colors">
                    @ate_yuriiiiiii
                  </span>
                </a>

                <a
                  href="mailto:lucasjoshmarie2005@gmail.com"
                  className="flex items-center gap-4 group"
                >
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-[10px] bg-brand-pink-deep flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-200">
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-sans text-xs sm:text-[14px] text-text-primary group-hover:text-brand-pink transition-colors break-all">
                    lucasjoshmarie2005@gmail.com
                  </span>
                </a>
              </div>
            </Card>
          </motion.div>

          <motion.div {...fadeInUp(0.08)}>
            <Card variant="flat" className="h-full p-5 sm:p-6 lg:p-8">
              <h3 className="font-serif text-xl lg:text-[1.5rem] text-text-primary mb-4 sm:mb-6">
                Send us a message!
              </h3>
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input
                  type="text"
                  placeholder="Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-11 sm:h-12 bg-[#1E1518] rounded-[10px] px-4 font-sans text-sm text-text-primary placeholder:text-text-muted outline-none border border-border-accent/30 focus:border-border-accent transition-colors"
                />
                <textarea
                  placeholder="Your Message…"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  className="w-full bg-[#1E1518] rounded-[10px] px-4 py-3 font-sans text-sm text-text-primary placeholder:text-text-muted outline-none border border-border-accent/30 focus:border-border-accent transition-colors resize-none"
                />
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full h-11 sm:h-12 bg-brand-pink-deep text-white rounded-full font-sans font-medium text-sm sm:text-[15px] cursor-pointer hover:bg-accent-highlight transition-colors"
                >
                  Send a Message
                </motion.button>
              </form>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function TikTokIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05A6.34 6.34 0 003.15 15.3a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.61a8.18 8.18 0 004.78 1.53V6.7a4.85 4.85 0 01-1.02-.01z" />
    </svg>
  );
}