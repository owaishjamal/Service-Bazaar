"use client";

import { useState, useEffect } from "react";
import { Clock } from "lucide-react";

interface CountdownTimerProps {
  targetDate: Date;
  label?: string;
  onComplete?: () => void;
  className?: string;
}

export function CountdownTimer({
  targetDate,
  label = "Delivery in",
  onComplete,
  className = "",
}: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = targetDate.getTime() - new Date().getTime();

      if (difference <= 0) {
        setIsComplete(true);
        onComplete?.();
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate, onComplete]);

  if (isComplete) {
    return (
      <div className={`text-green-500 font-semibold animate-pulse ${className}`}>
        ✓ Ready for delivery!
      </div>
    );
  }

  return (
    <div className={`${className}`}>
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
        <Clock className="h-4 w-4" />
        <span>{label}</span>
      </div>
      <div className="flex gap-2">
        <TimeUnit value={timeLeft.days} label="Days" />
        <TimeUnit value={timeLeft.hours} label="Hrs" />
        <TimeUnit value={timeLeft.minutes} label="Min" />
        <TimeUnit value={timeLeft.seconds} label="Sec" highlight />
      </div>
    </div>
  );
}

function TimeUnit({
  value,
  label,
  highlight = false,
}: {
  value: number;
  label: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex flex-col items-center">
      <div
        className={`w-14 h-14 rounded-xl flex items-center justify-center text-xl font-bold transition-all ${
          highlight
            ? "bg-primary/20 text-primary animate-pulse"
            : "bg-secondary text-foreground"
        }`}
      >
        {String(value).padStart(2, "0")}
      </div>
      <span className="text-xs text-muted-foreground mt-1">{label}</span>
    </div>
  );
}

// Compact countdown for cards
export function CompactCountdown({
  targetDate,
  className = "",
}: {
  targetDate: Date;
  className?: string;
}) {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = targetDate.getTime() - new Date().getTime();

      if (difference <= 0) {
        return "Ready!";
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);

      if (days > 0) return `${days}d ${hours}h`;
      if (hours > 0) return `${hours}h ${minutes}m`;
      return `${minutes}m`;
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 60000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <span className={`font-mono ${className}`}>
      {timeLeft}
    </span>
  );
}
