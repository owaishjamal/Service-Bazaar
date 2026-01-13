import "./globals.css";
import Link from "next/link";
import Script from "next/script";
import { SearchDialog } from "@/components/SearchDialog";
import { UserNav } from "@/components/UserNav";
import { ThemeToggle } from "@/components/ThemeToggle";
import { CommandPalette, CommandPaletteButton } from "@/components/CommandPalette";
import { ToastProvider } from "@/components/Toast";
import { ScrollProgress, CircularScrollProgress } from "@/components/ScrollProgress";
import { OnboardingTour } from "@/components/OnboardingTour";
import { FloatingActionButton } from "@/components/FloatingActionButton";
import { ActivityPopup } from "@/components/LiveActivityFeed";
import { Chatbot } from "@/components/Chatbot";
import { Package } from "lucide-react";

export const metadata = {
  title: "Service Bazaar - Track Your Tech Services Like a FedEx Package",
  description: "Premium marketplace for technical services with logistics-style tracking",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground antialiased transition-colors duration-300">
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var stored = localStorage.getItem('theme');
                  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  var theme = stored || (prefersDark ? 'dark' : 'light');
                  if (theme === 'dark') {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                  document.documentElement.style.colorScheme = theme;
                } catch (e) {}
              })();
            `,
          }}
        />
        <ToastProvider>
          {/* Scroll Progress Bar */}
          <ScrollProgress />
          
          {/* Command Palette */}
          <CommandPalette />
          
          {/* Onboarding Tour */}
          <OnboardingTour />
          
          {/* Header */}
          <div className="border-b border-border sticky top-1 bg-background/80 backdrop-blur-xl z-40 shadow-lg shadow-primary/5 dark:shadow-primary/10 transition-all duration-300">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16">
                <Link 
                  href="/" 
                  className="flex items-center gap-2 text-xl font-bold group animate-fade-in"
                  data-tour="logo"
                >
                  <div className="p-1.5 rounded-lg bg-gradient-to-br from-primary/20 to-primary/30 group-hover:from-primary/30 group-hover:to-primary/40 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                    <Package className="h-5 w-5 text-primary" />
                  </div>
                  <span className="gradient-text">
                    Service Bazaar
                  </span>
                </Link>
                <nav className="hidden md:flex items-center gap-6">
                  <Link 
                    href="/marketplace" 
                    className="text-sm font-medium text-muted-foreground hover:text-foreground transition-all duration-300 hover:scale-105 relative group"
                    data-tour="marketplace"
                  >
                    Marketplace
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                  <Link 
                    href="/orders" 
                    className="text-sm font-medium text-muted-foreground hover:text-foreground transition-all duration-300 hover:scale-105 relative group"
                    data-tour="orders"
                  >
                    Orders
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                  <Link 
                    href="/vendor/dashboard" 
                    className="text-sm font-medium text-muted-foreground hover:text-foreground transition-all duration-300 hover:scale-105 relative group"
                  >
                    Vendor
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                </nav>
                <div className="flex items-center gap-3 animate-fade-in">
                  <div data-tour="search">
                    <CommandPaletteButton />
                  </div>
                  <div data-tour="theme">
                    <ThemeToggle />
                  </div>
                  <UserNav />
                </div>
              </div>
            </div>
          </div>
          
          {/* Main Content */}
          <main className="min-h-[calc(100vh-4rem)]">{children}</main>
          
          {/* Floating Elements */}
          <FloatingActionButton />
          <CircularScrollProgress />
          <ActivityPopup />
          <Chatbot />
        </ToastProvider>
      </body>
    </html>
  );
}
