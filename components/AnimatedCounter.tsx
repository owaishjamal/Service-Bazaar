"use client";

import { useEffect, useState, useRef } from "react";

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
}

export function AnimatedCounter({
  value,
  duration = 2000,
  prefix = "",
  suffix = "",
  decimals = 0,
  className = "",
}: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          animateValue(0, value, duration);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [value, duration, hasAnimated]);

  const animateValue = (start: number, end: number, duration: number) => {
    const startTime = performance.now();
    
    const step = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function (ease-out-expo)
      const easeOutExpo = 1 - Math.pow(2, -10 * progress);
      const current = start + (end - start) * easeOutExpo;
      
      setDisplayValue(current);
      
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };
    
    requestAnimationFrame(step);
  };

  const formattedValue = displayValue.toFixed(decimals);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {formattedValue}
      {suffix}
    </span>
  );
}

// Stats card with animation
interface StatCardProps {
  title: string;
  value: number;
  prefix?: string;
  suffix?: string;
  icon: React.ReactNode;
  trend?: number;
  color?: string;
}

export function AnimatedStatCard({
  title,
  value,
  prefix = "",
  suffix = "",
  icon,
  trend,
  color = "primary",
}: StatCardProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-primary/20 group">
      {/* Background gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br from-${color}/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <span className="text-muted-foreground text-sm font-medium">{title}</span>
          <div className={`p-2 rounded-lg bg-${color}/10 text-${color}`}>
            {icon}
          </div>
        </div>
        
        <div className="flex items-end gap-2">
          <AnimatedCounter
            value={value}
            prefix={prefix}
            suffix={suffix}
            className="text-3xl font-bold text-foreground"
          />
          
          {trend !== undefined && (
            <span className={`text-sm font-medium ${trend >= 0 ? "text-green-500" : "text-red-500"}`}>
              {trend >= 0 ? "↑" : "↓"} {Math.abs(trend)}%
            </span>
          )}
        </div>
      </div>
      
      {/* Decorative element */}
      <div className="absolute -right-4 -bottom-4 w-24 h-24 rounded-full bg-primary/5 group-hover:scale-150 transition-transform duration-500" />
    </div>
  );
}
