import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Check, X } from "lucide-react";

interface TermsModalProps {
  isOpen?: boolean;
  setIsOpen?: (val: boolean) => void;
}

export default function TermsModal({ isOpen: externalIsOpen, setIsOpen: externalSetIsOpen }: TermsModalProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);

  // Support both standalone usage (auto-trigger on first load) and controlled usage via props
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;
  const setIsOpen = externalSetIsOpen !== undefined ? externalSetIsOpen : setInternalIsOpen;

  useEffect(() => {
    if (externalIsOpen === undefined) {
      const hasAccepted = localStorage.getItem("fazzyu_terms_accepted");
      if (!hasAccepted) {
        setInternalIsOpen(true);
      }
    }
  }, [externalIsOpen]);

  function handleAccept() {
    localStorage.setItem("fazzyu_terms_accepted", "true");
    setIsOpen(false);
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="w-full max-w-lg bg-[#140e11] border border-white/20 rounded-[24px] p-6 sm:p-8 shadow-[0_10px_50px_rgba(209,126,165,0.3)] text-white relative overflow-hidden"
          >
            {/* Ambient background glow */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#ca498c]/20 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#ca498c]/20 border border-[#ca498c]/40 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-[#ca498c]" />
                </div>
                <h2 className="font-serif text-2xl text-white">Store Rules & Guidelines</h2>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/70 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-white/70 text-xs sm:text-sm mb-5 leading-relaxed">
              Before exploring our handmade fuzzy wire bouquets, dolls, and custom creations, please take a quick moment to review our store rules and guidelines:
            </p>

            <div className="bg-black/40 border border-white/10 rounded-[16px] p-4 space-y-3 max-h-[220px] overflow-y-auto pr-1 text-xs text-white/80 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              <div className="flex items-start gap-2">
                <span className="text-[#ca498c] font-bold">•</span>
                <p><strong className="text-white">Photo & Content Copyright:</strong> Strictly no one is allowed to use, copy, or reuse any product photos, images, text, or website information belonging to Fazzyu Creations without explicit prior permission.</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-[#ca498c] font-bold">•</span>
                <p><strong className="text-white">Custom Orders & Inquiries:</strong> All custom arrangements require clear details and reference photos. Final pricing may vary based on flower count and complexity.</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-[#ca498c] font-bold">•</span>
                <p><strong className="text-white">Free Delivery & Meetups:</strong> Free delivery applies strictly within selected Las Piñas areas (Pulanglupa Uno, Naga Road, etc.). Check our delivery guide for specific locations.</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-[#ca498c] font-bold">•</span>
                <p><strong className="text-white">Payment & Confirmation:</strong> Payments are processed via GCASH or Cash. Orders require at least a 30% downpayment and are confirmed once details are synchronized via our Facebook Messenger link.</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-[#ca498c] font-bold">•</span>
                <p><strong className="text-white">Production Timeline:</strong> Please allow 2 to 5 days for crafting and completion of your handmade items.</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-[#ca498c] font-bold">•</span>
                <p><strong className="text-white">Handmade Variation:</strong> Because every single piece is uniquely handcrafted with wire and yarn, slight variations make each creation truly one-of-a-kind.</p>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end">
              <button
                onClick={handleAccept}
                className="w-full sm:w-auto h-12 px-8 bg-[#ca498c] hover:bg-[#b83d7a] text-white font-medium rounded-full shadow-[0_4px_20px_rgba(209,126,165,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer text-sm"
              >
                <Check className="w-4 h-4" /> I Understand & Agree
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}