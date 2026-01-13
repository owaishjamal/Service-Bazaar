"use client";

import { useState, useEffect, useCallback } from "react";
import { Mic, MicOff, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VoiceSearchProps {
  onResult: (text: string) => void;
  onListening?: (isListening: boolean) => void;
}

export function VoiceSearch({ onResult, onListening }: VoiceSearchProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [transcript, setTranscript] = useState("");

  useEffect(() => {
    setIsSupported("webkitSpeechRecognition" in window || "SpeechRecognition" in window);
  }, []);

  const startListening = useCallback(() => {
    if (!isSupported) return;

    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      setIsListening(true);
      onListening?.(true);
    };

    recognition.onresult = (event: any) => {
      const current = event.resultIndex;
      const result = event.results[current];
      const text = result[0].transcript;
      setTranscript(text);

      if (result.isFinal) {
        onResult(text);
        setIsListening(false);
        onListening?.(false);
      }
    };

    recognition.onerror = () => {
      setIsListening(false);
      onListening?.(false);
    };

    recognition.onend = () => {
      setIsListening(false);
      onListening?.(false);
    };

    recognition.start();
  }, [isSupported, onResult, onListening]);

  if (!isSupported) return null;

  return (
    <div className="relative">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={startListening}
        disabled={isListening}
        className={`relative transition-all ${
          isListening 
            ? "bg-red-500/20 text-red-500 animate-pulse" 
            : "hover:bg-primary/10 hover:text-primary"
        }`}
      >
        {isListening ? (
          <div className="relative">
            <Mic className="h-4 w-4" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-ping" />
          </div>
        ) : (
          <Mic className="h-4 w-4" />
        )}
      </Button>
      
      {/* Voice feedback popup */}
      {isListening && transcript && (
        <div className="absolute top-full right-0 mt-2 p-3 bg-card border border-border rounded-lg shadow-lg min-w-[200px] animate-scale-in z-50">
          <p className="text-sm text-muted-foreground mb-1">Listening...</p>
          <p className="text-foreground font-medium">{transcript}</p>
        </div>
      )}
    </div>
  );
}

// Full Voice Search Modal
export function VoiceSearchModal({ 
  isOpen, 
  onClose, 
  onResult 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onResult: (text: string) => void;
}) {
  const [transcript, setTranscript] = useState("");
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    if (isOpen) {
      startListening();
    }
  }, [isOpen]);

  const startListening = () => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      onClose();
      return;
    }

    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onstart = () => setIsListening(true);

    recognition.onresult = (event: any) => {
      const current = event.resultIndex;
      const result = event.results[current];
      const text = result[0].transcript;
      setTranscript(text);

      if (result.isFinal) {
        onResult(text);
        setTimeout(() => {
          onClose();
          setTranscript("");
        }, 500);
      }
    };

    recognition.onerror = () => {
      setIsListening(false);
      onClose();
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" onClick={onClose} />
      <div className="fixed top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 animate-scale-in">
        <div className="bg-card border border-border rounded-3xl p-8 shadow-2xl shadow-primary/20 min-w-[300px] text-center">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 hover:bg-secondary rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
          
          {/* Animated mic icon */}
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className={`absolute inset-0 rounded-full bg-primary/20 ${isListening ? "animate-ping" : ""}`} />
            <div className={`absolute inset-2 rounded-full bg-primary/30 ${isListening ? "animate-pulse" : ""}`} />
            <div className="absolute inset-4 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
              <Mic className="h-8 w-8 text-white" />
            </div>
          </div>
          
          <h3 className="text-xl font-bold mb-2">
            {isListening ? "Listening..." : "Starting..."}
          </h3>
          
          <p className="text-muted-foreground text-sm mb-4">
            {transcript || "Say something like \"Find React services\""}
          </p>
          
          {transcript && (
            <div className="bg-secondary rounded-lg p-3 animate-fade-in">
              <p className="font-medium text-primary">{transcript}</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
