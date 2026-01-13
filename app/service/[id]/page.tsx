"use client";

import { useState, use, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TiltCard } from "@/components/TiltCard";
import { AIRequirementsGenerator } from "@/components/AIRequirementsGenerator";
import { Star, Clock, User, Code, Sparkles, ArrowLeft, Shield, CheckCircle, Loader2, Zap } from "lucide-react";
import Link from "next/link";

// Mock data - will be replaced with Supabase queries
const mockService = {
  id: "1",
  title: "React Code Review & Optimization",
  category: "Dev",
  price: 299.99,
  etaDays: 3,
  vendorName: "CodeCraft Pro",
  trustScore: 95,
  techStack: ["React", "TypeScript", "Next.js", "Tailwind CSS"],
  description: "Comprehensive code review and optimization for React applications. Includes performance analysis, best practices recommendations, and refactoring suggestions.",
};

const comparisonServices = [
  {
    id: "2",
    title: "React Code Review Basic",
    category: "Dev",
    price: 199.99,
    etaDays: 5,
    vendorName: "DevReview Co",
    trustScore: 85,
    techStack: ["React"],
  },
  {
    id: "3",
    title: "Full-Stack Code Review",
    category: "Dev",
    price: 449.99,
    etaDays: 7,
    vendorName: "FullStack Experts",
    trustScore: 92,
    techStack: ["React", "Node.js", "PostgreSQL"],
  },
];

export default function ServiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const [requirements, setRequirements] = useState("");
  const [generatedRequirements, setGeneratedRequirements] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [service, setService] = useState(mockService);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch actual service data
    const fetchService = async () => {
      try {
        const response = await fetch(`/api/services/${id}`);
        if (response.ok) {
          const data = await response.json();
          setService({
            id: data.id,
            title: data.title,
            category: data.category,
            price: data.price,
            etaDays: data.eta_days,
            vendorName: data.profiles?.full_name || "Unknown Vendor",
            trustScore: data.profiles?.trust_score || 0,
            techStack: data.tech_stack || [],
            description: data.description || "",
          });
        }
      } catch (error) {
        console.error("Error fetching service:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchService();
  }, [id]);

  const handleGenerateScope = async () => {
    const finalRequirements = generatedRequirements || requirements;
    
    if (!finalRequirements.trim()) {
      alert("Please describe what you need before generating scope.");
      return;
    }

    setIsGenerating(true);
    
    // Simulate AI scope generation with realistic delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Generate scope based on requirements
    const scope = {
      deliverables: [
        "Code review report with detailed findings",
        "Performance optimization recommendations",
        "Best practices documentation",
        "Refactoring suggestions with code samples",
        "Security vulnerability assessment"
      ],
      timeline: `${service.etaDays} business days`,
      revisions: 2,
      acceptanceCriteria: [
        "All code reviewed and documented",
        "Performance improvements identified",
        "Best practices recommendations provided",
        "Clear action items for implementation"
      ]
    };

    // Store in sessionStorage and navigate to checkout
    sessionStorage.setItem("checkoutData", JSON.stringify({
      serviceId: id,
      service: service,
      requirements: finalRequirements,
      scope
    }));

    router.push(`/checkout/${id}`);
    setIsGenerating(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading service details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Service Header */}
        <div className="space-y-4 animate-fade-in">
          <div className="flex items-center gap-3">
            <Link href="/marketplace">
              <Button variant="ghost" size="sm" className="hover:scale-105 transition-transform">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Marketplace
              </Button>
            </Link>
            <Badge variant="outline" className="border-primary/30 text-primary font-semibold">
              {service.category}
            </Badge>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold">{service.title}</h1>
          
          <div className="flex flex-wrap items-center gap-6 text-muted-foreground">
            <div className="flex items-center gap-2 hover:text-foreground transition-colors">
              <User className="h-4 w-4" />
              <span>{service.vendorName}</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span>Trust Score: <strong className="text-foreground">{service.trustScore}/100</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span><strong className="text-foreground">{service.etaDays} days</strong> delivery</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-green-500" />
              <span className="text-green-600 dark:text-green-400">Money-back Guarantee</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="comparison">Comparison</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="space-y-6 animate-fade-in">
                <Card className="border-border">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-primary" />
                      Description
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">{service.description}</p>
                  </CardContent>
                </Card>
                
                <Card className="border-border">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Code className="h-5 w-5 text-primary" />
                      Tech Stack
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {service.techStack.map((tech) => (
                        <Badge 
                          key={tech} 
                          variant="secondary" 
                          className="px-3 py-1 hover:scale-105 transition-transform cursor-default"
                        >
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* What's Included */}
                <Card className="border-border">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      What's Included
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {[
                        "Detailed analysis and documentation",
                        "Up to 2 revision rounds",
                        "Direct communication with vendor",
                        "Money-back guarantee",
                        "Support during delivery"
                      ].map((item, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-muted-foreground">
                          <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="comparison" className="animate-fade-in">
                <Card className="border-border">
                  <CardHeader>
                    <CardTitle>Compare Services</CardTitle>
                    <CardDescription>See how this service compares to similar offerings</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Service</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead>ETA</TableHead>
                          <TableHead>Trust Score</TableHead>
                          <TableHead>Vendor</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow className="bg-primary/10 border-l-4 border-l-primary">
                          <TableCell className="font-semibold">{service.title}</TableCell>
                          <TableCell className="font-bold text-primary">${service.price}</TableCell>
                          <TableCell>{service.etaDays} days</TableCell>
                          <TableCell>
                            <Badge variant="secondary">{service.trustScore}/100 ⭐</Badge>
                          </TableCell>
                          <TableCell>{service.vendorName}</TableCell>
                        </TableRow>
                        {comparisonServices.map((compService) => (
                          <TableRow key={compService.id} className="hover:bg-secondary/50 transition-colors">
                            <TableCell>{compService.title}</TableCell>
                            <TableCell>${compService.price}</TableCell>
                            <TableCell>{compService.etaDays} days</TableCell>
                            <TableCell>{compService.trustScore}/100</TableCell>
                            <TableCell>{compService.vendorName}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="reviews" className="animate-fade-in">
                <Card className="border-border">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Star className="h-5 w-5 text-yellow-400" />
                      Reviews
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <Star className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                      <p className="text-muted-foreground">No reviews yet.</p>
                      <p className="text-sm text-muted-foreground/70">Be the first to review this service!</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar - Checkout */}
          <div className="space-y-6">
            <TiltCard>
              <Card className="border-border sticky top-24 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
                <CardHeader className="relative">
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-primary" />
                    Order Service
                  </CardTitle>
                  <CardDescription>Get started with AI-powered scope generation</CardDescription>
                </CardHeader>
                <CardContent className="relative space-y-6">
                  {/* Price Display */}
                  <div className="flex items-end justify-between p-4 rounded-xl bg-gradient-to-br from-primary/10 to-transparent border border-primary/20">
                    <div>
                      <p className="text-sm text-muted-foreground">Starting at</p>
                      <p className="text-4xl font-bold text-primary">${service.price}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Delivery</p>
                      <p className="font-semibold">{service.etaDays} days</p>
                    </div>
                  </div>
                  
                  {/* AI Requirements Generator */}
                  <AIRequirementsGenerator
                    serviceTitle={service.title}
                    serviceCategory={service.category}
                    onGenerated={(reqs) => setGeneratedRequirements(reqs)}
                  />
                  
                  {/* Manual Input */}
                  <div className="pt-4 border-t border-border">
                    <label className="text-sm font-medium mb-2 block">Or describe manually:</label>
                    <textarea
                      placeholder="e.g., I need a React Navbar with responsive design..."
                      value={requirements}
                      onChange={(e) => setRequirements(e.target.value)}
                      className="w-full min-h-[80px] p-3 bg-secondary border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 text-foreground resize-none transition-all"
                    />
                  </div>
                  
                  <Button 
                    onClick={handleGenerateScope}
                    disabled={isGenerating || (!requirements.trim() && !generatedRequirements)}
                    className="w-full h-14 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-primary-foreground font-bold text-lg rounded-xl shadow-lg shadow-primary/30 hover:shadow-xl hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isGenerating ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Generating Scope...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5" />
                        Continue to Checkout
                      </span>
                    )}
                  </Button>
                  
                  {/* Trust Indicators */}
                  <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Shield className="h-3 w-3 text-green-500" />
                      Secure
                    </div>
                    <div className="flex items-center gap-1">
                      <CheckCircle className="h-3 w-3 text-blue-500" />
                      Guaranteed
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TiltCard>
          </div>
        </div>
      </div>
    </div>
  );
}
