import { Heart } from "lucide-react";
import { motion } from "motion/react";
import { useAppData } from "@/app/context/AppDataContext";

interface HeartButtonProps {
  productId: number;
  imageIndex: number;
}

export function HeartButton({ productId, imageIndex }: HeartButtonProps) {
  const { getPrimaryImageIndex, setPrimaryImage } = useAppData();
  const isPrimary = getPrimaryImageIndex(productId) === imageIndex;

  return (
    <motion.button
      whileTap={{ scale: 0.85 }}
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        setPrimaryImage(productId, imageIndex);
      }}
      className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 ${
        isPrimary
          ? "bg-[#d17ea5] shadow-[0_0_12px_rgba(209,126,165,0.6)]"
          : "bg-black/50 hover:bg-[#d17ea5]/60 backdrop-blur-sm"
      }`}
      aria-label={isPrimary ? "Primary image" : "Set as primary image"}
    >
      <Heart className={`w-4 h-4 ${isPrimary ? "fill-white text-white" : "text-white"}`} />
    </motion.button>
  );
}
