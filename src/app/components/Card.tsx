import { cn } from "@/app/components/ui/utils";
import type { ReactNode } from "react";

type CardVariant = "solid-border" | "glow-border" | "flat";

interface CardProps {
  variant?: CardVariant;
  className?: string;
  children: ReactNode;
}

export function Card({ variant = "solid-border", className, children }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-[16px] bg-[#241119]",
        variant === "solid-border" && "border border-[#E8A0BE]",
        variant === "glow-border" &&
          "border border-[#E8A0BE] shadow-[0_0_40px_rgba(232,160,190,0.15)]",
        className
      )}
    >
      {children}
    </div>
  );
}
