"use client";

export function TypingIndicator({ name = "Vendor" }: { name?: string }) {
  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground animate-fade-in">
      <div className="flex gap-1">
        <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
        <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
        <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
      </div>
      <span>{name} is typing...</span>
    </div>
  );
}
