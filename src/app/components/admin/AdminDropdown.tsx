import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown } from "lucide-react";

interface AdminDropdownProps {
  options: string[];
  value: string;
  onChange: (v: string) => void;
  className?: string;
}

export function AdminDropdown({ options, value, onChange, className = "" }: AdminDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full h-[48px] px-4 bg-[#141414] border border-[rgba(255,255,255,0.25)] rounded-[10px] flex items-center justify-between gap-2 text-[rgba(255,255,255,0.74)] font-['Roboto',sans-serif] text-[16px] transition-colors hover:border-[rgba(255,255,255,0.4)]"
      >
        <span>{value}</span>
        <ChevronDown
          className={`w-4 h-4 flex-shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 right-0 top-full mt-1 bg-[#1a1a1a] border border-[#878787] rounded-bl-[10px] rounded-br-[10px] overflow-hidden z-50"
          >
            {options.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => {
                  onChange(opt);
                  setOpen(false);
                }}
                className={`w-full h-[48px] px-4 text-left font-['Roboto',sans-serif] text-[16px] border border-[rgba(255,255,255,0.25)] transition-colors ${
                  value === opt
                    ? "bg-[rgba(202,73,140,0.2)] text-white"
                    : "bg-transparent text-[rgba(255,255,255,0.75)] hover:bg-[rgba(255,255,255,0.05)]"
                }`}
              >
                {opt}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
