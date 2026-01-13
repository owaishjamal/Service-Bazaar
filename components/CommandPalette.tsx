"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { 
  Search, 
  Home, 
  ShoppingBag, 
  Package, 
  User, 
  Settings, 
  LogOut,
  TrendingUp,
  FileText,
  Zap,
  Command
} from "lucide-react";

interface CommandItem {
  id: string;
  name: string;
  shortcut?: string;
  icon: React.ReactNode;
  action: () => void;
  category: string;
}

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const commands: CommandItem[] = [
    {
      id: "home",
      name: "Go to Home",
      shortcut: "G H",
      icon: <Home className="h-4 w-4" />,
      action: () => router.push("/"),
      category: "Navigation",
    },
    {
      id: "marketplace",
      name: "Browse Marketplace",
      shortcut: "G M",
      icon: <ShoppingBag className="h-4 w-4" />,
      action: () => router.push("/marketplace"),
      category: "Navigation",
    },
    {
      id: "orders",
      name: "View Orders",
      shortcut: "G O",
      icon: <Package className="h-4 w-4" />,
      action: () => router.push("/orders"),
      category: "Navigation",
    },
    {
      id: "vendor-dashboard",
      name: "Vendor Dashboard",
      shortcut: "G V",
      icon: <TrendingUp className="h-4 w-4" />,
      action: () => router.push("/vendor/dashboard"),
      category: "Navigation",
    },
    {
      id: "dashboard",
      name: "Dashboard",
      shortcut: "G D",
      icon: <FileText className="h-4 w-4" />,
      action: () => router.push("/dashboard"),
      category: "Navigation",
    },
    {
      id: "login",
      name: "Sign In",
      icon: <User className="h-4 w-4" />,
      action: () => router.push("/login"),
      category: "Account",
    },
    {
      id: "register",
      name: "Create Account",
      icon: <Zap className="h-4 w-4" />,
      action: () => router.push("/register"),
      category: "Account",
    },
    {
      id: "logout",
      name: "Sign Out",
      icon: <LogOut className="h-4 w-4" />,
      action: async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        window.location.href = "/";
      },
      category: "Account",
    },
  ];

  const filteredCommands = commands.filter((command) =>
    command.name.toLowerCase().includes(search.toLowerCase()) ||
    command.category.toLowerCase().includes(search.toLowerCase())
  );

  const groupedCommands = filteredCommands.reduce((acc, command) => {
    if (!acc[command.category]) {
      acc[command.category] = [];
    }
    acc[command.category].push(command);
    return acc;
  }, {} as Record<string, CommandItem[]>);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Open with Cmd+K or Ctrl+K
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
        setSearch("");
        setSelectedIndex(0);
      }

      if (!isOpen) return;

      // Close with Escape
      if (e.key === "Escape") {
        setIsOpen(false);
        setSearch("");
      }

      // Navigate with arrows
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => 
          prev < filteredCommands.length - 1 ? prev + 1 : 0
        );
      }

      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => 
          prev > 0 ? prev - 1 : filteredCommands.length - 1
        );
      }

      // Execute with Enter
      if (e.key === "Enter" && filteredCommands[selectedIndex]) {
        e.preventDefault();
        filteredCommands[selectedIndex].action();
        setIsOpen(false);
        setSearch("");
      }
    },
    [isOpen, filteredCommands, selectedIndex]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [search]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-fade-in"
        onClick={() => setIsOpen(false)}
      />
      
      {/* Command Palette */}
      <div className="fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-xl z-50 animate-scale-in">
        <div className="bg-card border border-border rounded-2xl shadow-2xl shadow-primary/20 overflow-hidden">
          {/* Search Input */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
            <Search className="h-5 w-5 text-muted-foreground" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Type a command or search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground"
            />
            <kbd className="px-2 py-1 text-xs bg-secondary rounded-md text-muted-foreground">
              ESC
            </kbd>
          </div>

          {/* Commands List */}
          <div className="max-h-80 overflow-y-auto p-2">
            {Object.entries(groupedCommands).map(([category, items]) => (
              <div key={category} className="mb-2">
                <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {category}
                </div>
                {items.map((command, idx) => {
                  const globalIndex = filteredCommands.indexOf(command);
                  return (
                    <button
                      key={command.id}
                      onClick={() => {
                        command.action();
                        setIsOpen(false);
                        setSearch("");
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
                        selectedIndex === globalIndex
                          ? "bg-primary/10 text-primary"
                          : "hover:bg-secondary text-foreground"
                      }`}
                    >
                      <span className={selectedIndex === globalIndex ? "text-primary" : "text-muted-foreground"}>
                        {command.icon}
                      </span>
                      <span className="flex-1 text-left">{command.name}</span>
                      {command.shortcut && (
                        <kbd className="px-2 py-1 text-xs bg-secondary rounded-md text-muted-foreground">
                          {command.shortcut}
                        </kbd>
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
            
            {filteredCommands.length === 0 && (
              <div className="px-3 py-8 text-center text-muted-foreground">
                No commands found for &quot;{search}&quot;
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-4 py-2 border-t border-border text-xs text-muted-foreground">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-secondary rounded">↑</kbd>
                <kbd className="px-1.5 py-0.5 bg-secondary rounded">↓</kbd>
                to navigate
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-secondary rounded">↵</kbd>
                to select
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Command className="h-3 w-3" />
              <span>K to toggle</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// Helper button to show in header
export function CommandPaletteButton() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const openPalette = () => {
    const event = new KeyboardEvent("keydown", {
      key: "k",
      metaKey: true,
      bubbles: true,
    });
    document.dispatchEvent(event);
  };

  if (!mounted) return null;

  return (
    <button
      onClick={openPalette}
      className="hidden sm:flex items-center gap-2 px-3 py-1.5 text-sm text-muted-foreground bg-secondary hover:bg-secondary/80 rounded-lg transition-all hover:scale-105"
    >
      <Search className="h-4 w-4" />
      <span>Search...</span>
      <kbd className="px-1.5 py-0.5 text-xs bg-background rounded border border-border">
        ⌘K
      </kbd>
    </button>
  );
}
