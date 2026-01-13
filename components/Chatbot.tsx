"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User, Sparkles } from "lucide-react";
import { TypingIndicator } from "./TypingIndicator";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

const BOT_RESPONSES: Record<string, string[]> = {
  greeting: [
    "Hello! 👋 I'm here to help you with Service Bazaar. How can I assist you today?",
    "Hi there! Welcome to Service Bazaar! What would you like to know?",
    "Hey! 👋 I'm your assistant. Ask me anything about our platform!",
  ],
  help: [
    "I can help you with:\n• Understanding how Service Bazaar works\n• Creating an account or logging in\n• Browsing and ordering services\n• Tracking your orders\n• Becoming a vendor\n• Payment and escrow system\n\nWhat would you like to know more about?",
  ],
  account: [
    "To create an account:\n1. Click 'Register' in the top right\n2. Choose your role (Customer, Vendor, or both)\n3. Fill in your details\n4. Start using the platform!\n\nYou can use the same email for both customer and vendor roles!",
  ],
  order: [
    "To place an order:\n1. Browse the marketplace\n2. Click on a service you like\n3. Click 'Order Now'\n4. Describe your requirements (or use AI to generate scope)\n5. Complete checkout\n\nYou'll be able to track your order in real-time, just like a FedEx package! 📦",
  ],
  tracking: [
    "Order tracking works like this:\n• **Placed** - Your order is submitted\n• **Accepted** - Vendor accepted your order\n• **In Progress** - Work has started\n• **Milestone Submitted** - Vendor completed a milestone\n• **Final Delivered** - All work is done\n• **Completed** - You've approved and paid\n\nYou can see all updates in real-time on your Orders page!",
  ],
  vendor: [
    "To become a vendor:\n1. Register and select 'Vendor' role\n2. Go to Vendor Dashboard\n3. Click 'Create New Service'\n4. Fill in service details\n5. Set your pricing\n6. Start receiving orders!\n\nYou can manage all your orders and track their status from your dashboard.",
  ],
  payment: [
    "Our payment system uses **escrow**:\n• Payment is held securely until you're satisfied\n• You can request revisions if needed\n• Once you approve, payment is released to the vendor\n• Disputes are handled through our system\n\nThis ensures both parties are protected! 💰",
  ],
  features: [
    "Service Bazaar has amazing features:\n✨ Logistics-style tracking\n🤖 AI-powered scope generation\n🎙️ Voice search\n⌘K Command palette\n🌗 Light/Dark mode\n📊 Real-time updates\n⭐ Trust scores\n🎊 And much more!\n\nTry exploring the platform to see them all!",
  ],
  default: [
    "I'm not sure I understand. Could you rephrase that? I can help with:\n• Account setup\n• Ordering services\n• Tracking orders\n• Becoming a vendor\n• Payment questions\n• Platform features\n\nWhat would you like to know?",
  ],
};

function getBotResponse(userMessage: string): string {
  const lowerMessage = userMessage.toLowerCase().trim();

  // Greetings
  if (
    lowerMessage.match(/^(hi|hello|hey|greetings|good morning|good afternoon|good evening)/)
  ) {
    return BOT_RESPONSES.greeting[
      Math.floor(Math.random() * BOT_RESPONSES.greeting.length)
    ];
  }

  // Help
  if (
    lowerMessage.match(/help|assist|support|what can you do|how can you help/)
  ) {
    return BOT_RESPONSES.help[0];
  }

  // Account related
  if (
    lowerMessage.match(/account|sign up|register|signup|create account|sign in|login/)
  ) {
    return BOT_RESPONSES.account[0];
  }

  // Order related
  if (
    lowerMessage.match(/order|buy|purchase|how to order|place order|checkout/)
  ) {
    return BOT_RESPONSES.order[0];
  }

  // Tracking
  if (
    lowerMessage.match(/track|tracking|status|where is my order|order status|progress/)
  ) {
    return BOT_RESPONSES.tracking[0];
  }

  // Vendor
  if (
    lowerMessage.match(/vendor|sell|seller|become a vendor|upload service|create service/)
  ) {
    return BOT_RESPONSES.vendor[0];
  }

  // Payment
  if (
    lowerMessage.match(/payment|pay|money|price|cost|escrow|refund|dispute/)
  ) {
    return BOT_RESPONSES.payment[0];
  }

  // Features
  if (
    lowerMessage.match(/feature|what can|capabilities|what does|tell me about/)
  ) {
    return BOT_RESPONSES.features[0];
  }

  // Default
  return BOT_RESPONSES.default[0];
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! 👋 I'm your Service Bazaar assistant. How can I help you today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue.trim(),
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate bot thinking time
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getBotResponse(userMessage.text),
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickQuestions = [
    "How do I place an order?",
    "How does tracking work?",
    "How to become a vendor?",
    "What is escrow?",
  ];

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-24 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 text-white shadow-lg shadow-primary/30 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-xl group ${
          isOpen ? "scale-0 opacity-0" : "scale-100 opacity-100"
        }`}
        aria-label="Open chatbot"
      >
        <MessageCircle className="h-6 w-6 group-hover:scale-110 transition-transform" />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-background animate-pulse"></span>
      </button>

      {/* Chat Window */}
      <div
        className={`fixed bottom-24 right-6 z-50 w-96 h-[600px] bg-card border border-border rounded-2xl shadow-2xl flex flex-col transition-all duration-300 ${
          isOpen
            ? "scale-100 opacity-100 translate-y-0"
            : "scale-95 opacity-0 translate-y-4 pointer-events-none"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-gradient-to-r from-primary/10 to-secondary/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 flex items-center justify-center">
              <Bot className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Service Bazaar AI</h3>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                Online
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="w-8 h-8 rounded-full hover:bg-muted flex items-center justify-center transition-colors"
            aria-label="Close chatbot"
          >
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-background/50">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 animate-fade-in ${
                message.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {message.sender === "bot" && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                  <Bot className="h-4 w-4 text-white" />
                </div>
              )}
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
                  message.sender === "user"
                    ? "bg-primary text-primary-foreground rounded-br-sm"
                    : "bg-muted text-foreground rounded-bl-sm"
                }`}
              >
                <p className="text-sm whitespace-pre-line">{message.text}</p>
                <p className="text-xs opacity-70 mt-1">
                  {message.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              {message.sender === "user" && (
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <User className="h-4 w-4 text-primary" />
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3 justify-start animate-fade-in">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                <Bot className="h-4 w-4 text-white" />
              </div>
              <div className="bg-muted rounded-2xl rounded-bl-sm px-4 py-3">
                <TypingIndicator />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Questions */}
        {messages.length === 1 && (
          <div className="px-4 pb-2 border-t border-border bg-muted/30">
            <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              Quick questions:
            </p>
            <div className="flex flex-wrap gap-2">
              {quickQuestions.map((question, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setInputValue(question);
                    setTimeout(() => handleSend(), 100);
                  }}
                  className="text-xs px-3 py-1.5 bg-background border border-border rounded-full hover:bg-primary/10 hover:border-primary/50 transition-all duration-200 text-foreground"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="p-4 border-t border-border bg-card">
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1 px-4 py-2.5 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-foreground placeholder:text-muted-foreground transition-all"
            />
            <button
              onClick={handleSend}
              disabled={!inputValue.trim()}
              className="w-11 h-11 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 text-white flex items-center justify-center hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg"
              aria-label="Send message"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Press Enter to send • Shift+Enter for new line
          </p>
        </div>
      </div>
    </>
  );
}
