"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, Star, CheckCircle, Package, Zap } from "lucide-react";

interface Activity {
  id: string;
  type: "order" | "review" | "completed" | "new_service";
  user: string;
  service: string;
  timestamp: Date;
}

const generateRandomActivity = (): Activity => {
  const types = ["order", "review", "completed", "new_service"] as const;
  const users = [
    "Alex M.", "Sarah K.", "John D.", "Emily R.", "Michael T.", 
    "Jessica L.", "David W.", "Amanda S.", "Chris P.", "Laura B."
  ];
  const services = [
    "React Code Review", "Logo Design", "API Development", "UI/UX Audit",
    "DevOps Setup", "Mobile App Design", "Database Optimization", "SEO Audit"
  ];

  return {
    id: Math.random().toString(36).substr(2, 9),
    type: types[Math.floor(Math.random() * types.length)],
    user: users[Math.floor(Math.random() * users.length)],
    service: services[Math.floor(Math.random() * services.length)],
    timestamp: new Date(),
  };
};

export function LiveActivityFeed() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Initial activities
    const initial = Array.from({ length: 3 }, generateRandomActivity);
    setActivities(initial);

    // Add new activity every 5-10 seconds
    const interval = setInterval(() => {
      const newActivity = generateRandomActivity();
      setActivities((prev) => [newActivity, ...prev.slice(0, 4)]);
    }, Math.random() * 5000 + 5000);

    return () => clearInterval(interval);
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case "order":
        return <ShoppingBag className="h-4 w-4 text-blue-400" />;
      case "review":
        return <Star className="h-4 w-4 text-yellow-400" />;
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case "new_service":
        return <Package className="h-4 w-4 text-purple-400" />;
      default:
        return <Zap className="h-4 w-4 text-primary" />;
    }
  };

  const getMessage = (activity: Activity) => {
    switch (activity.type) {
      case "order":
        return <><strong>{activity.user}</strong> ordered <strong>{activity.service}</strong></>;
      case "review":
        return <><strong>{activity.user}</strong> left a 5-star review</>;
      case "completed":
        return <><strong>{activity.service}</strong> was delivered</>;
      case "new_service":
        return <><strong>{activity.service}</strong> is now available</>;
      default:
        return "New activity";
    }
  };

  if (!isVisible || activities.length === 0) return null;

  return (
    <div className="fixed bottom-6 left-6 z-40 max-w-sm animate-slide-up">
      <div className="bg-card/95 backdrop-blur-sm border border-border rounded-xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="px-4 py-2 bg-gradient-to-r from-primary/10 to-purple-500/10 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-xs font-semibold text-muted-foreground">Live Activity</span>
          </div>
          <button
            onClick={() => setIsVisible(false)}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Hide
          </button>
        </div>
        
        {/* Activities */}
        <div className="p-2 space-y-1 max-h-[200px] overflow-hidden">
          {activities.slice(0, 4).map((activity, idx) => (
            <div
              key={activity.id}
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-secondary/50 transition-all animate-slide-in-right"
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              <div className="p-1.5 rounded-full bg-secondary">
                {getIcon(activity.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-foreground truncate">
                  {getMessage(activity)}
                </p>
                <p className="text-xs text-muted-foreground">Just now</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Compact notification popup version
export function ActivityPopup() {
  const [activity, setActivity] = useState<Activity | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const showActivity = () => {
      const newActivity = generateRandomActivity();
      setActivity(newActivity);
      setIsVisible(true);
      setTimeout(() => setIsVisible(false), 4000);
    };

    // Show first after 3 seconds, then every 8-15 seconds
    const timeout = setTimeout(showActivity, 3000);
    const interval = setInterval(showActivity, Math.random() * 7000 + 8000);

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, []);

  if (!isVisible || !activity) return null;

  const getMessage = () => {
    switch (activity.type) {
      case "order":
        return `${activity.user} just ordered ${activity.service}`;
      case "review":
        return `${activity.user} left a 5-star review ⭐`;
      case "completed":
        return `${activity.service} was delivered 🎉`;
      case "new_service":
        return `New: ${activity.service} is now available! ✨`;
      default:
        return "New activity on the platform";
    }
  };

  return (
    <div className="fixed bottom-6 left-6 z-40 animate-slide-up">
      <div className="bg-card border border-border rounded-xl shadow-xl px-4 py-3 max-w-xs">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <p className="text-sm">{getMessage()}</p>
        </div>
      </div>
    </div>
  );
}
