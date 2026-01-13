"use client";

import { useEffect, useState } from "react";

interface ConfettiPiece {
  id: number;
  x: number;
  color: string;
  delay: number;
  duration: number;
  size: number;
}

export function useConfetti() {
  const [isActive, setIsActive] = useState(false);

  const fire = () => {
    setIsActive(true);
    setTimeout(() => setIsActive(false), 3000);
  };

  return { isActive, fire };
}

export function Confetti({ isActive }: { isActive: boolean }) {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);

  useEffect(() => {
    if (isActive) {
      const colors = [
        "#06b6d4", // cyan
        "#22d3ee", // light cyan
        "#a855f7", // purple
        "#ec4899", // pink
        "#f59e0b", // amber
        "#10b981", // emerald
        "#3b82f6", // blue
      ];

      const newPieces: ConfettiPiece[] = [];
      for (let i = 0; i < 100; i++) {
        newPieces.push({
          id: i,
          x: Math.random() * 100,
          color: colors[Math.floor(Math.random() * colors.length)],
          delay: Math.random() * 0.5,
          duration: 2 + Math.random() * 2,
          size: 8 + Math.random() * 8,
        });
      }
      setPieces(newPieces);
    } else {
      setPieces([]);
    }
  }, [isActive]);

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {pieces.map((piece) => (
        <div
          key={piece.id}
          className="absolute animate-confetti"
          style={{
            left: `${piece.x}%`,
            top: "-20px",
            width: `${piece.size}px`,
            height: `${piece.size}px`,
            backgroundColor: piece.color,
            borderRadius: Math.random() > 0.5 ? "50%" : "2px",
            animationDelay: `${piece.delay}s`,
            animationDuration: `${piece.duration}s`,
            transform: `rotate(${Math.random() * 360}deg)`,
          }}
        />
      ))}
    </div>
  );
}

// Success celebration component
export function SuccessCelebration({ 
  show, 
  message = "🎉 Success!", 
  subMessage = "Order placed successfully" 
}: { 
  show: boolean; 
  message?: string;
  subMessage?: string;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setVisible(true);
      const timer = setTimeout(() => setVisible(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [show]);

  if (!visible) return null;

  return (
    <>
      <Confetti isActive={visible} />
      <div className="fixed inset-0 flex items-center justify-center z-40 pointer-events-none">
        <div className="bg-card border border-primary shadow-2xl shadow-primary/30 rounded-2xl p-8 text-center animate-bounce-in">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-foreground mb-2">{message}</h2>
          <p className="text-muted-foreground">{subMessage}</p>
        </div>
      </div>
    </>
  );
}
