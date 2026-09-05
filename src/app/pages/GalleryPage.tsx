import { Link } from "react-router";
import { motion } from "motion/react";
import { useAppData } from "@/app/context/AppDataContext";
import { HeartButton } from "@/app/components/HeartButton";

export default function GalleryPage() {
  const { galleryImages, products } = useAppData();

  function getProductForImage(img: { productId?: number }) {
    if (img.productId === undefined) return undefined;
    return products.find((p) => p.id === img.productId);
  }

  return (
    <div className="bg-bg-base min-h-screen text-text-primary font-sans">
      <div className="page-container py-10 lg:py-14">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <h1 className="font-serif" style={{ fontSize: "clamp(2rem, 3.5vw + 0.5rem, 3rem)" }}>
            Our <span className="text-accent-highlight italic">Gallery</span>
          </h1>
          <p className="font-sans text-sm text-text-muted mt-1">
            Every handmade piece, in one place.
          </p>
        </motion.div>

        {galleryImages.length === 0 ? (
          <div className="text-center py-20 font-sans text-base text-text-muted">
            No photos in the gallery yet.
          </div>
        ) : (
          <div
            className="grid gap-4"
            style={{ gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))" }}
          >
            {galleryImages.map((img, idx) => {
              const product = getProductForImage(img);
              return (
                <motion.div
                  key={img.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: idx * 0.04 }}
                  className="relative group rounded-[16px] overflow-hidden border border-border-accent/20 hover:border-border-accent/40 transition-colors"
                  style={{ aspectRatio: "4/5" }}
                >
                  {product ? (
                    <Link to={`/shop/${product.id}`} className="block w-full h-full">
                      <img
                        src={img.src}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </Link>
                  ) : (
                    <img
                      src={img.src}
                      alt=""
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  )}

                  {/* Bottom overlay */}
                  {product && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/75 to-transparent px-4 py-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <p className="font-sans font-medium text-[13px] text-white leading-tight">
                        {product.name}
                      </p>
                      <p className="font-serif text-[1rem] text-accent-highlight mt-0.5">
                        ₱{product.price}
                      </p>
                    </div>
                  )}

                  {/* Heart button */}
                  {product && (
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <HeartButton productId={product.id} imageIndex={idx} />
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      <footer className="border-t border-border-accent/10 py-4 text-center mt-12">
        <p className="font-sans text-sm text-text-muted">© 2026 All rights reserved.</p>
      </footer>
    </div>
  );
}
