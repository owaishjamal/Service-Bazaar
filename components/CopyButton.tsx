"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CopyButtonProps {
  text: string;
  className?: string;
  variant?: "default" | "ghost" | "outline";
  size?: "default" | "sm" | "lg" | "icon";
}

export function CopyButton({ 
  text, 
  className = "", 
  variant = "ghost",
  size = "icon"
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleCopy}
      className={`relative transition-all ${className}`}
    >
      <span
        className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
          copied ? "scale-100 opacity-100" : "scale-0 opacity-0"
        }`}
      >
        <Check className="h-4 w-4 text-green-500" />
      </span>
      <span
        className={`transition-all duration-300 ${
          copied ? "scale-0 opacity-0" : "scale-100 opacity-100"
        }`}
      >
        <Copy className="h-4 w-4" />
      </span>
    </Button>
  );
}

// Copy with text feedback
export function CopyWithFeedback({ 
  text, 
  label = "Copy",
  className = "" 
}: { 
  text: string; 
  label?: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleCopy}
      className={`gap-2 transition-all ${copied ? "border-green-500 text-green-500" : ""} ${className}`}
    >
      {copied ? (
        <>
          <Check className="h-4 w-4" />
          Copied!
        </>
      ) : (
        <>
          <Copy className="h-4 w-4" />
          {label}
        </>
      )}
    </Button>
  );
}
