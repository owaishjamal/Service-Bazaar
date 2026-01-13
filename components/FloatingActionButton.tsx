"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Plus, 
  X, 
  MessageCircle, 
  ShoppingBag, 
  Upload, 
  HelpCircle,
  Mic
} from "lucide-react";
import { VoiceSearchModal } from "./VoiceSearch";

interface FABAction {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  color?: string;
}

export function FloatingActionButton() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [showVoiceSearch, setShowVoiceSearch] = useState(false);

  const actions: FABAction[] = [
    {
      icon: <ShoppingBag className="h-5 w-5" />,
      label: "Browse Services",
      onClick: () => router.push("/marketplace"),
      color: "bg-blue-500 hover:bg-blue-600",
    },
    {
      icon: <Upload className="h-5 w-5" />,
      label: "Upload Service",
      onClick: () => router.push("/vendor/dashboard"),
      color: "bg-purple-500 hover:bg-purple-600",
    },
    {
      icon: <Mic className="h-5 w-5" />,
      label: "Voice Search",
      onClick: () => setShowVoiceSearch(true),
      color: "bg-green-500 hover:bg-green-600",
    },
    {
      icon: <HelpCircle className="h-5 w-5" />,
      label: "Help & Support",
      onClick: () => alert("Help center coming soon!"),
      color: "bg-orange-500 hover:bg-orange-600",
    },
  ];

  return (
    <>
      <VoiceSearchModal
        isOpen={showVoiceSearch}
        onClose={() => setShowVoiceSearch(false)}
        onResult={(text) => {
          router.push(`/marketplace?search=${encodeURIComponent(text)}`);
        }}
      />
      
      <div className="fixed bottom-6 right-6 z-50 flex flex-col-reverse items-end gap-3">
        {/* Action buttons */}
        {isOpen && actions.map((action, idx) => (
          <button
            key={idx}
            onClick={() => {
              action.onClick();
              setIsOpen(false);
            }}
            className={`flex items-center gap-3 px-4 py-3 ${action.color} text-white rounded-full shadow-lg hover:scale-105 transition-all animate-scale-in`}
            style={{ animationDelay: `${idx * 50}ms` }}
          >
            <span className="text-sm font-medium whitespace-nowrap">{action.label}</span>
            {action.icon}
          </button>
        ))}
        
        {/* Main FAB */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-14 h-14 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg shadow-primary/30 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-xl ${
            isOpen ? "rotate-45" : ""
          }`}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Plus className="h-6 w-6" />}
        </button>
      </div>
    </>
  );
}
