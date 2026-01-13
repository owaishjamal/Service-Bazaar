"use client";

import { ReactNode } from "react";

interface GradientBorderCardProps {
  children: ReactNode;
  className?: string;
  gradientColors?: string;
  borderWidth?: number;
  animated?: boolean;
}

export function GradientBorderCard({
  children,
  className = "",
  gradientColors = "from-cyan-500 via-blue-500 to-purple-500",
  borderWidth = 2,
  animated = true,
}: GradientBorderCardProps) {
  return (
    <div className={`relative rounded-xl p-[${borderWidth}px] ${className}`}>
      {/* Gradient border */}
      <div
        className={`absolute inset-0 rounded-xl bg-gradient-to-r ${gradientColors} ${
          animated ? "animate-gradient bg-[length:200%_200%]" : ""
        }`}
      />
      
      {/* Content */}
      <div className="relative bg-card rounded-[10px] h-full">
        {children}
      </div>
    </div>
  );
}

// Glowing card variant
export function GlowingCard({
  children,
  className = "",
  glowColor = "primary",
}: {
  children: ReactNode;
  className?: string;
  glowColor?: "primary" | "purple" | "green" | "orange";
}) {
  const colors = {
    primary: "shadow-primary/30 hover:shadow-primary/50",
    purple: "shadow-purple-500/30 hover:shadow-purple-500/50",
    green: "shadow-green-500/30 hover:shadow-green-500/50",
    orange: "shadow-orange-500/30 hover:shadow-orange-500/50",
  };

  return (
    <div
      className={`bg-card border border-border rounded-xl shadow-lg ${colors[glowColor]} transition-all duration-300 hover:scale-[1.02] ${className}`}
    >
      {children}
    </div>
  );
}

// Shimmer effect card
export function ShimmerCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`relative overflow-hidden rounded-xl bg-card border border-border ${className}`}>
      {children}
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </div>
  );
}
