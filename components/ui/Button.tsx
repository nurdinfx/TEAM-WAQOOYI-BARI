"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface ButtonProps {
  children: React.ReactNode;
  variant?: "gold" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  href?: string;
  onClick?: () => void;
  className?: string;
}

export function Button({
  children,
  variant = "gold",
  size = "md",
  href,
  onClick,
  className,
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center font-semibold rounded-full transition-all duration-300 relative overflow-hidden";

  const variants = {
    gold: "bg-gradient-to-r from-gold-dark via-gold to-gold-light text-navy hover:shadow-[0_0_30px_rgba(212,175,55,0.5)]",
    outline:
      "border-2 border-gold/50 text-gold hover:bg-gold/10 hover:border-gold",
    ghost: "text-gold hover:bg-gold/10",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  const combined = cn(baseStyles, variants[variant], sizes[size], className);

  if (href) {
    return (
      <Link href={href}>
        <motion.span
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={combined}
        >
          {children}
        </motion.span>
      </Link>
    );
  }

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={combined}
    >
      {children}
    </motion.button>
  );
}
