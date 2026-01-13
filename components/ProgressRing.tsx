"use client";

import { useEffect, useState, useRef } from "react";

interface ProgressRingProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
  showPercentage?: boolean;
  color?: string;
  animated?: boolean;
}

export function ProgressRing({
  progress,
  size = 120,
  strokeWidth = 8,
  className = "",
  showPercentage = true,
  color = "primary",
  animated = true,
}: ProgressRingProps) {
  const [displayProgress, setDisplayProgress] = useState(0);
  const displayProgressRef = useRef(displayProgress);
  
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (displayProgress / 100) * circumference;

  useEffect(() => {
    displayProgressRef.current = displayProgress;
  }, [displayProgress]);

  useEffect(() => {
    if (!animated) {
      setDisplayProgress(progress);
      return;
    }

    // Animate progress
    const duration = 1500;
    const startTime = performance.now();
    const startProgress = displayProgressRef.current;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progressRatio = Math.min(elapsed / duration, 1);
      
      // Easing function
      const easeOutExpo = 1 - Math.pow(2, -10 * progressRatio);
      
      const currentProgress = startProgress + (progress - startProgress) * easeOutExpo;
      setDisplayProgress(currentProgress);

      if (progressRatio < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [progress, animated]);

  const colors: Record<string, string> = {
    primary: "#06b6d4",
    purple: "#8b5cf6",
    green: "#10b981",
    orange: "#f59e0b",
    red: "#ef4444",
  };

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-secondary"
        />
        
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={colors[color] || colors.primary}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-300"
        />
        
        {/* Gradient definition */}
        <defs>
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>
      </svg>
      
      {/* Center content */}
      {showPercentage && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold">{Math.round(displayProgress)}%</span>
          <span className="text-xs text-muted-foreground">Complete</span>
        </div>
      )}
    </div>
  );
}

// Multi-segment ring for order status
export function OrderProgressRing({
  currentStep,
  totalSteps,
  size = 100,
  className = "",
}: {
  currentStep: number;
  totalSteps: number;
  size?: number;
  className?: string;
}) {
  const progress = (currentStep / totalSteps) * 100;
  const statusLabels = ["Placed", "Accepted", "In Progress", "Review", "Delivered", "Complete"];
  const currentLabel = statusLabels[Math.min(currentStep, statusLabels.length - 1)];

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <ProgressRing
        progress={progress}
        size={size}
        showPercentage={false}
        color={progress === 100 ? "green" : "primary"}
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-lg font-bold">{currentStep}/{totalSteps}</span>
        <span className="text-xs text-muted-foreground">{currentLabel}</span>
      </div>
    </div>
  );
}
