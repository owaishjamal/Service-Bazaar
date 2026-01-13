"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { X, ChevronRight, ChevronLeft, Sparkles, Rocket } from "lucide-react";

interface TourStep {
  target: string;
  title: string;
  content: string;
  position?: "top" | "bottom" | "left" | "right";
}

const tourSteps: TourStep[] = [
  {
    target: "[data-tour='logo']",
    title: "Welcome to Service Bazaar! 🎉",
    content: "Track your tech services like FedEx packages. Let me show you around!",
    position: "bottom",
  },
  {
    target: "[data-tour='marketplace']",
    title: "Marketplace",
    content: "Browse thousands of professional services from verified vendors.",
    position: "bottom",
  },
  {
    target: "[data-tour='orders']",
    title: "Order Tracking",
    content: "Track all your orders in real-time with our logistics-style tracking system.",
    position: "bottom",
  },
  {
    target: "[data-tour='search']",
    title: "Quick Search",
    content: "Press ⌘K anytime to quickly navigate or search for anything!",
    position: "bottom",
  },
  {
    target: "[data-tour='theme']",
    title: "Theme Toggle",
    content: "Switch between light and dark mode based on your preference.",
    position: "left",
  },
];

export function OnboardingTour() {
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [hasSeenTour, setHasSeenTour] = useState(true);

  useEffect(() => {
    const seen = localStorage.getItem("hasSeenTour");
    if (!seen) {
      setHasSeenTour(false);
      // Auto-start tour after a delay for new users
      setTimeout(() => setIsActive(true), 2000);
    }
  }, []);

  useEffect(() => {
    if (!isActive) return;

    const step = tourSteps[currentStep];
    const element = document.querySelector(step.target);

    if (element) {
      const rect = element.getBoundingClientRect();
      const scrollTop = window.scrollY;
      const scrollLeft = window.scrollX;

      let top = rect.bottom + scrollTop + 10;
      let left = rect.left + scrollLeft + rect.width / 2 - 150;

      if (step.position === "top") {
        top = rect.top + scrollTop - 150;
      } else if (step.position === "left") {
        top = rect.top + scrollTop;
        left = rect.left + scrollLeft - 320;
      } else if (step.position === "right") {
        top = rect.top + scrollTop;
        left = rect.right + scrollLeft + 10;
      }

      // Keep within viewport
      left = Math.max(10, Math.min(left, window.innerWidth - 320));

      setPosition({ top, left });

      // Highlight element
      element.classList.add("tour-highlight");
      return () => element.classList.remove("tour-highlight");
    }
  }, [isActive, currentStep]);

  const nextStep = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeTour();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const completeTour = () => {
    setIsActive(false);
    setCurrentStep(0);
    localStorage.setItem("hasSeenTour", "true");
    setHasSeenTour(true);
  };

  const startTour = () => {
    setCurrentStep(0);
    setIsActive(true);
  };

  if (!isActive) {
    // Show "Start Tour" button for users who haven't seen it
    if (!hasSeenTour) {
      return (
        <Button
          onClick={startTour}
          className="fixed bottom-6 left-6 z-50 bg-gradient-to-r from-primary to-purple-500 text-white shadow-lg shadow-primary/30 hover:scale-105 transition-all animate-bounce-slow"
        >
          <Sparkles className="h-4 w-4 mr-2" />
          Take a Tour
        </Button>
      );
    }
    return null;
  }

  const step = tourSteps[currentStep];

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-[100]" onClick={completeTour} />
      
      {/* Tooltip */}
      <div
        className="fixed z-[101] w-[300px] animate-scale-in"
        style={{ top: position.top, left: position.left }}
      >
        <div className="bg-card border border-primary/30 rounded-2xl shadow-2xl shadow-primary/20 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary/20 to-purple-500/20 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Rocket className="h-4 w-4 text-primary" />
              <span className="text-xs font-medium text-muted-foreground">
                Step {currentStep + 1} of {tourSteps.length}
              </span>
            </div>
            <button
              onClick={completeTour}
              className="p-1 hover:bg-secondary rounded-full transition-colors"
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>
          
          {/* Content */}
          <div className="p-4">
            <h3 className="text-lg font-bold mb-2">{step.title}</h3>
            <p className="text-muted-foreground text-sm mb-4">{step.content}</p>
            
            {/* Progress dots */}
            <div className="flex justify-center gap-1 mb-4">
              {tourSteps.map((_, idx) => (
                <div
                  key={idx}
                  className={`w-2 h-2 rounded-full transition-all ${
                    idx === currentStep
                      ? "bg-primary w-4"
                      : idx < currentStep
                      ? "bg-primary/50"
                      : "bg-secondary"
                  }`}
                />
              ))}
            </div>
            
            {/* Navigation */}
            <div className="flex justify-between gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={prevStep}
                disabled={currentStep === 0}
                className="flex-1"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back
              </Button>
              <Button
                size="sm"
                onClick={nextStep}
                className="flex-1 bg-gradient-to-r from-primary to-purple-500"
              >
                {currentStep === tourSteps.length - 1 ? (
                  "Finish"
                ) : (
                  <>
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
        
        {/* Arrow pointer */}
        <div
          className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-card border-l border-t border-primary/30 rotate-45"
          style={{ display: step.position === "bottom" ? "block" : "none" }}
        />
      </div>

      <style jsx global>{`
        .tour-highlight {
          position: relative;
          z-index: 101;
          box-shadow: 0 0 0 4px rgba(6, 182, 212, 0.5), 0 0 20px rgba(6, 182, 212, 0.3);
          border-radius: 8px;
        }
      `}</style>
    </>
  );
}
