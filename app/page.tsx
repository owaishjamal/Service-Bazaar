"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ParticleBackground } from "@/components/ParticleBackground";
import { TiltCard } from "@/components/TiltCard";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { TypewriterText, ScrambleText } from "@/components/TypewriterText";
import { GlowingCard } from "@/components/GradientBorderCard";
import { 
  Package, 
  Zap, 
  Shield, 
  TrendingUp, 
  Users, 
  Code, 
  Palette, 
  CheckCircle,
  ArrowRight,
  Sparkles,
  BarChart3,
  Clock,
  Star,
  Rocket,
  Globe,
  Lock,
  Award
} from "lucide-react";

export default function HomePage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const features = [
    {
      icon: Package,
      title: "Track Like FedEx",
      description: "Real-time tracking for every service delivery milestone",
      color: "from-cyan-500 to-blue-500"
    },
    {
      icon: Shield,
      title: "Secure Payments",
      description: "Escrow system ensures you only pay when satisfied",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: Zap,
      title: "Fast Delivery",
      description: "Get your services delivered on time, every time",
      color: "from-yellow-500 to-orange-500"
    },
    {
      icon: TrendingUp,
      title: "Quality Assured",
      description: "Vetted vendors with proven track records",
      color: "from-purple-500 to-pink-500"
    }
  ];

  const stats = [
    { label: "Active Vendors", value: 2500, suffix: "+" },
    { label: "Services Listed", value: 15000, suffix: "+" },
    { label: "Orders Completed", value: 98000, suffix: "+" },
    { label: "Customer Rating", value: 4.9, suffix: "/5" },
  ];

  const consumerBenefits = [
    "Browse thousands of professional services",
    "Compare prices and delivery times",
    "Track orders in real-time",
    "Secure payment with escrow",
    "Request revisions anytime",
    "Rate and review vendors"
  ];

  const vendorBenefits = [
    "Reach thousands of potential customers",
    "Set your own prices and timelines",
    "Manage orders from one dashboard",
    "Build your reputation and trust score",
    "Get paid securely and on time",
    "Grow your freelance business"
  ];

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden transition-colors duration-300">
      {/* Particle Background */}
      <ParticleBackground />
      
      {/* Animated background gradient following mouse */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none transition-opacity duration-300 z-0"
        style={{
          background: `radial-gradient(800px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(6, 182, 212, 0.15), transparent 40%)`
        }}
      />

      {/* Hero Section */}
      <section className="relative z-10 pt-20 pb-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-8 animate-slide-up">
            {/* Floating badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-8 animate-bounce-slow hover:scale-105 transition-transform duration-300 backdrop-blur-sm">
              <Sparkles className="h-4 w-4 animate-pulse" />
              <span>🚀 Hackathon Winner 2026</span>
              <Sparkles className="h-4 w-4 animate-pulse" />
            </div>
            
            <h1 className="text-6xl md:text-8xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent animate-gradient bg-[length:200%_200%]">
                Service Bazaar
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed animate-fade-in" style={{ animationDelay: "100ms" }}>
              The premium marketplace for{" "}
              <TypewriterText 
                texts={["React Development", "UI/UX Design", "DevOps Setup", "Code Reviews", "QA Testing"]}
                className="text-primary font-bold"
              />
              <br />
              <span className="text-primary font-bold text-2xl md:text-3xl">with logistics-style tracking.</span>
            </p>

            {/* Typewriter-like tagline */}
            <div className="flex justify-center gap-4 text-lg font-semibold">
              <span className="text-cyan-400">Transparency</span>
              <span className="text-muted-foreground">•</span>
              <span className="text-blue-400">Trust</span>
              <span className="text-muted-foreground">•</span>
              <span className="text-purple-400">Delivery</span>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8 animate-slide-up" style={{ animationDelay: "200ms" }}>
              <Link href="/register">
                <Button size="lg" className="group bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 hover:from-cyan-600 hover:via-blue-600 hover:to-purple-600 text-white px-10 py-7 text-xl font-bold shadow-2xl shadow-primary/50 hover:shadow-primary/70 transition-all duration-300 hover:scale-105 rounded-2xl">
                  <Rocket className="mr-2 h-6 w-6 group-hover:animate-bounce" />
                  Get Started Free
                  <ArrowRight className="ml-2 h-6 w-6 transition-transform duration-300 group-hover:translate-x-2" />
                </Button>
              </Link>
              <Link href="/marketplace">
                <Button size="lg" variant="outline" className="border-2 border-border hover:border-primary px-10 py-7 text-xl font-bold transition-all duration-300 hover:scale-105 rounded-2xl backdrop-blur-sm">
                  <Globe className="mr-2 h-6 w-6" />
                  Explore Marketplace
                </Button>
              </Link>
            </div>

            {/* Quick stats */}
            <div className="pt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {stats.map((stat, idx) => (
                <div 
                  key={idx} 
                  className="text-center animate-scale-in"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <div className="text-3xl md:text-4xl font-bold text-primary">
                    <AnimatedCounter 
                      value={stat.value} 
                      suffix={stat.suffix}
                      decimals={stat.value < 10 ? 1 : 0}
                    />
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid with 3D Tilt */}
      <section className="relative z-10 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 animate-fade-in">
            Why Choose <span className="text-primary">Service Bazaar</span>?
          </h2>
          <p className="text-muted-foreground text-center mb-12 text-lg">Experience the future of service marketplaces</p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, idx) => (
              <TiltCard key={idx} className="animate-scale-in" style={{ animationDelay: `${idx * 100}ms` }}>
                <Card className="border-border bg-card/80 backdrop-blur-sm hover:border-primary/50 transition-all duration-300 h-full">
                  <CardContent className="p-6 space-y-4">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-lg`}>
                      <feature.icon className="h-7 w-7 text-white" />
                    </div>
                    <h3 className="text-xl font-bold">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="relative z-10 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap justify-center items-center gap-8 text-muted-foreground">
            <div className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-green-500" />
              <span>256-bit SSL Encryption</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-yellow-500" />
              <span>Verified Vendors Only</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-500" />
              <span>Money-Back Guarantee</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-purple-500" />
              <span>4.9★ Average Rating</span>
            </div>
          </div>
        </div>
      </section>

      {/* Consumer & Vendor Sections */}
      <section className="relative z-10 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-24">
          {/* Consumer Section */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 animate-slide-up">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
                  <Users className="h-7 w-7 text-white" />
                </div>
                <h2 className="text-4xl md:text-5xl font-bold">For Consumers</h2>
              </div>
              <p className="text-xl text-muted-foreground">
                Find the perfect technical service for your project. Browse, compare, and order with confidence.
              </p>
              <ul className="space-y-4">
                {consumerBenefits.map((benefit, idx) => (
                  <li 
                    key={idx} 
                    className="flex items-center gap-3 text-muted-foreground animate-slide-in-right hover:text-foreground transition-colors"
                    style={{ animationDelay: `${idx * 50}ms` }}
                  >
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="h-4 w-4 text-primary" />
                    </div>
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
              <div className="pt-4">
                <Link href="/register">
                  <Button size="lg" className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-xl hover:scale-105 transition-all">
                    Start Shopping
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
            <TiltCard className="animate-fade-in" style={{ animationDelay: "200ms" }}>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/30 to-cyan-500/30 rounded-2xl blur-3xl" />
                <Card className="relative border-border bg-card/80 backdrop-blur-sm p-8">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Badge className="bg-blue-500/20 text-blue-600 dark:text-blue-400 border-blue-500/30 font-bold">Marketplace</Badge>
                      <Star className="h-5 w-5 text-yellow-400 animate-pulse" />
                    </div>
                    <h3 className="text-2xl font-bold">Browse Services</h3>
                    <p className="text-muted-foreground">
                      Filter by category, price, delivery time, and vendor ratings. Find exactly what you need.
                    </p>
                    <div className="grid grid-cols-2 gap-4 pt-4">
                      <div className="p-4 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 hover:scale-105 transition-transform">
                        <Code className="h-6 w-6 text-primary mb-2" />
                        <p className="text-sm font-semibold">Dev Services</p>
                      </div>
                      <div className="p-4 rounded-xl bg-gradient-to-br from-purple-500/10 to-purple-500/5 border border-purple-500/20 hover:scale-105 transition-transform">
                        <Palette className="h-6 w-6 text-purple-400 mb-2" />
                        <p className="text-sm font-semibold">Design Services</p>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </TiltCard>
          </div>

          {/* Vendor Section */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <TiltCard className="order-2 lg:order-1 animate-fade-in" style={{ animationDelay: "200ms" }}>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-2xl blur-3xl" />
                <Card className="relative border-border bg-card/80 backdrop-blur-sm p-8">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Badge className="bg-purple-500/20 text-purple-600 dark:text-purple-400 border-purple-500/30 font-bold">Vendor Dashboard</Badge>
                      <BarChart3 className="h-5 w-5 text-purple-400 animate-pulse" />
                    </div>
                    <h3 className="text-2xl font-bold">Manage Your Business</h3>
                    <p className="text-muted-foreground">
                      Upload services, manage orders, track earnings, and grow your reputation.
                    </p>
                    <div className="grid grid-cols-2 gap-4 pt-4">
                      <div className="p-4 rounded-xl bg-gradient-to-br from-purple-500/10 to-purple-500/5 border border-purple-500/20 hover:scale-105 transition-transform">
                        <Package className="h-6 w-6 text-purple-400 mb-2" />
                        <p className="text-sm font-semibold">Upload Services</p>
                      </div>
                      <div className="p-4 rounded-xl bg-gradient-to-br from-green-500/10 to-green-500/5 border border-green-500/20 hover:scale-105 transition-transform">
                        <Clock className="h-6 w-6 text-green-400 mb-2" />
                        <p className="text-sm font-semibold">Track Orders</p>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </TiltCard>
            <div className="space-y-6 animate-slide-up order-1 lg:order-2">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
                  <TrendingUp className="h-7 w-7 text-white" />
                </div>
                <h2 className="text-4xl md:text-5xl font-bold">For Vendors</h2>
              </div>
              <p className="text-xl text-muted-foreground">
                Grow your freelance business. Reach customers, deliver services, and build your reputation.
              </p>
              <ul className="space-y-4">
                {vendorBenefits.map((benefit, idx) => (
                  <li 
                    key={idx} 
                    className="flex items-center gap-3 text-muted-foreground animate-slide-in-right hover:text-foreground transition-colors"
                    style={{ animationDelay: `${idx * 50}ms` }}
                  >
                    <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="h-4 w-4 text-purple-400" />
                    </div>
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
              <div className="pt-4">
                <Link href="/register">
                  <Button size="lg" className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold rounded-xl shadow-lg shadow-purple-500/30 hover:shadow-xl hover:scale-105 transition-all">
                    Start Selling
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-purple-500/20 rounded-3xl blur-3xl" />
            <Card className="relative border-border bg-card/80 backdrop-blur-sm p-12 rounded-3xl">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Ready to <span className="text-primary">Transform</span> Your Workflow?
              </h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join thousands of professionals already using Service Bazaar to deliver exceptional results.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link href="/register">
                  <Button size="lg" className="bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 text-white px-10 py-6 text-lg font-bold rounded-xl hover:scale-105 transition-transform">
                    <Rocket className="mr-2 h-5 w-5" />
                    Start Free Today
                  </Button>
                </Link>
                <Link href="/login">
                  <Button size="lg" variant="outline" className="border-2 px-10 py-6 text-lg font-bold rounded-xl hover:scale-105 transition-transform">
                    Sign In
                  </Button>
                </Link>
              </div>
              <p className="text-sm text-muted-foreground mt-6">
                Press <kbd className="px-2 py-1 bg-secondary rounded text-xs font-mono">⌘K</kbd> to quickly navigate anywhere
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-8 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-muted-foreground">
          <p>© 2026 Service Bazaar. Built with ❤️ for the Hackathon.</p>
        </div>
      </footer>
    </div>
  );
}
