"use client";

import { useState } from "react";
import { Star } from "lucide-react";

interface StarRatingProps {
  rating?: number;
  maxRating?: number;
  size?: "sm" | "md" | "lg";
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
  showValue?: boolean;
  className?: string;
}

export function StarRating({
  rating = 0,
  maxRating = 5,
  size = "md",
  interactive = false,
  onRatingChange,
  showValue = false,
  className = "",
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const sizes = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  };

  const handleClick = (index: number) => {
    if (!interactive) return;
    
    setIsAnimating(true);
    onRatingChange?.(index);
    setTimeout(() => setIsAnimating(false), 300);
  };

  const displayRating = hoverRating || rating;

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <div className="flex">
        {Array.from({ length: maxRating }).map((_, index) => {
          const starValue = index + 1;
          const isFilled = starValue <= displayRating;
          const isHalf = !isFilled && starValue - 0.5 <= displayRating;

          return (
            <button
              key={index}
              type="button"
              disabled={!interactive}
              onClick={() => handleClick(starValue)}
              onMouseEnter={() => interactive && setHoverRating(starValue)}
              onMouseLeave={() => interactive && setHoverRating(0)}
              className={`relative transition-all duration-200 ${
                interactive ? "cursor-pointer hover:scale-125" : "cursor-default"
              } ${isAnimating && isFilled ? "animate-bounce" : ""}`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Background star */}
              <Star
                className={`${sizes[size]} text-muted-foreground/30`}
                fill="currentColor"
              />
              
              {/* Filled star overlay */}
              <Star
                className={`${sizes[size]} absolute inset-0 text-yellow-400 transition-all duration-200 ${
                  isFilled ? "opacity-100 scale-100" : isHalf ? "opacity-50" : "opacity-0 scale-0"
                }`}
                fill="currentColor"
              />
            </button>
          );
        })}
      </div>
      
      {showValue && (
        <span className="ml-2 text-sm font-medium text-muted-foreground">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}

// Animated review submission
export function ReviewStars({
  onSubmit,
  className = "",
}: {
  onSubmit: (rating: number, review: string) => void;
  className?: string;
}) {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) return;
    
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    onSubmit(rating, review);
    setIsSubmitting(false);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="text-center">
        <p className="text-sm text-muted-foreground mb-2">Rate your experience</p>
        <StarRating
          rating={rating}
          interactive
          onRatingChange={setRating}
          size="lg"
          className="justify-center"
        />
        {rating > 0 && (
          <p className="text-sm text-primary mt-2 animate-fade-in">
            {rating === 5 && "Excellent! 🎉"}
            {rating === 4 && "Great! 😊"}
            {rating === 3 && "Good 👍"}
            {rating === 2 && "Fair 😐"}
            {rating === 1 && "Poor 😞"}
          </p>
        )}
      </div>
      
      {rating > 0 && (
        <div className="animate-slide-up">
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="Share your experience (optional)..."
            className="w-full p-3 bg-secondary border border-border rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
            rows={3}
          />
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full mt-3 py-3 bg-gradient-to-r from-primary to-purple-500 text-white rounded-xl font-semibold hover:scale-[1.02] transition-all disabled:opacity-50"
          >
            {isSubmitting ? "Submitting..." : "Submit Review"}
          </button>
        </div>
      )}
    </div>
  );
}
