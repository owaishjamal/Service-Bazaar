"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AnimatedCounter, AnimatedStatCard } from "@/components/AnimatedCounter";
import { TiltCard } from "@/components/TiltCard";
import { SuccessCelebration } from "@/components/Confetti";
import { Plus, Package, DollarSign, TrendingUp, Clock, Loader2, Sparkles, Rocket, Eye } from "lucide-react";
import Link from "next/link";

interface Service {
  id: string;
  title: string;
  category: string;
  price: number;
  eta_days: number;
  tech_stack: string[];
  description?: string;
  created_at: string;
}

interface Order {
  id: string;
  status: string;
  amount: number;
  created_at: string;
  services?: {
    title: string;
  };
  profiles?: {
    full_name: string;
  };
}

export default function VendorDashboard() {
  const router = useRouter();
  const [services, setServices] = useState<Service[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [showServiceDialog, setShowServiceDialog] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [newService, setNewService] = useState({
    title: "",
    category: "Dev",
    price: "",
    eta_days: "",
    description: "",
    tech_stack: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [servicesRes, ordersRes] = await Promise.all([
        fetch("/api/vendor/services"),
        fetch("/api/vendor/orders"),
      ]);

      if (servicesRes.ok) {
        const servicesData = await servicesRes.json();
        setServices(servicesData.services || []);
      }

      if (ordersRes.ok) {
        const ordersData = await ordersRes.json();
        setOrders(ordersData.orders || []);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateService = async () => {
    if (!newService.title || !newService.price || !newService.eta_days) {
      alert("Please fill in all required fields");
      return;
    }

    setIsCreating(true);
    try {
      const techStack = newService.tech_stack
        .split(",")
        .map((tech) => tech.trim())
        .filter((tech) => tech.length > 0);

      const response = await fetch("/api/vendor/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newService.title,
          category: newService.category,
          price: parseFloat(newService.price),
          eta_days: parseInt(newService.eta_days),
          description: newService.description,
          tech_stack: techStack,
        }),
      });

      if (response.ok) {
        setShowServiceDialog(false);
        setNewService({
          title: "",
          category: "Dev",
          price: "",
          eta_days: "",
          description: "",
          tech_stack: "",
        });
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
        fetchData();
      } else {
        const error = await response.json();
        alert(error.error || "Failed to create service");
      }
    } catch (error) {
      console.error("Error creating service:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      placed: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      accepted: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
      in_progress: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      milestone_submitted: "bg-purple-500/20 text-purple-400 border-purple-500/30",
      revision_requested: "bg-orange-500/20 text-orange-400 border-orange-500/30",
      final_delivered: "bg-green-500/20 text-green-400 border-green-500/30",
      completed: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
      disputed: "bg-red-500/20 text-red-400 border-red-500/30",
    };
    return colors[status] || "bg-muted text-muted-foreground border-border";
  };

  const stats = {
    totalServices: services.length,
    totalOrders: orders.length,
    activeOrders: orders.filter((o) => !["completed", "disputed"].includes(o.status)).length,
    totalRevenue: orders
      .filter((o) => o.status === "completed")
      .reduce((sum, o) => sum + o.amount, 0),
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
      <SuccessCelebration 
        show={showSuccess} 
        message="Service Created!"
        subMessage="Your service is now live on the marketplace"
      />
      
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-fade-in">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent">
              Vendor Dashboard
            </h1>
            <p className="text-muted-foreground mt-2">
              Manage your services and track your orders
            </p>
          </div>
          <Dialog open={showServiceDialog} onOpenChange={setShowServiceDialog}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold shadow-lg shadow-purple-500/30 hover:shadow-xl hover:scale-105 transition-all">
                <Plus className="h-4 w-4 mr-2" />
                Upload Service
                <Sparkles className="h-4 w-4 ml-2" />
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-border max-w-lg">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Rocket className="h-5 w-5 text-primary" />
                  Create New Service
                </DialogTitle>
                <DialogDescription>
                  Add a new service to your marketplace
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Service Title *</label>
                  <Input
                    placeholder="e.g., React Code Review"
                    value={newService.title}
                    onChange={(e) =>
                      setNewService({ ...newService, title: e.target.value })
                    }
                    className="bg-secondary border-border"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Category *</label>
                  <select
                    value={newService.category}
                    onChange={(e) =>
                      setNewService({ ...newService, category: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                  >
                    <option value="Dev">Development</option>
                    <option value="Design">Design</option>
                    <option value="QA">QA & Testing</option>
                    <option value="DevOps">DevOps</option>
                    <option value="UI/UX">UI/UX</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Price ($) *</label>
                    <Input
                      type="number"
                      placeholder="299.99"
                      value={newService.price}
                      onChange={(e) =>
                        setNewService({ ...newService, price: e.target.value })
                      }
                      className="bg-secondary border-border"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">ETA (Days) *</label>
                    <Input
                      type="number"
                      placeholder="5"
                      value={newService.eta_days}
                      onChange={(e) =>
                        setNewService({ ...newService, eta_days: e.target.value })
                      }
                      className="bg-secondary border-border"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Tech Stack (comma-separated)</label>
                  <Input
                    placeholder="React, TypeScript, Next.js"
                    value={newService.tech_stack}
                    onChange={(e) =>
                      setNewService({ ...newService, tech_stack: e.target.value })
                    }
                    className="bg-secondary border-border"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Description</label>
                  <Textarea
                    placeholder="Describe your service in detail..."
                    value={newService.description}
                    onChange={(e) =>
                      setNewService({ ...newService, description: e.target.value })
                    }
                    className="bg-secondary border-border resize-none"
                    rows={4}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setShowServiceDialog(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateService}
                  disabled={isCreating}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  {isCreating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Create Service
                    </>
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats with Animation */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <TiltCard className="animate-scale-in" style={{ animationDelay: "0ms" }}>
            <Card className="border-border bg-card h-full">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Total Services</p>
                    <p className="text-3xl font-bold">
                      <AnimatedCounter value={stats.totalServices} />
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-purple-500/10">
                    <Package className="h-6 w-6 text-purple-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TiltCard>
          
          <TiltCard className="animate-scale-in" style={{ animationDelay: "100ms" }}>
            <Card className="border-border bg-card h-full">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Total Orders</p>
                    <p className="text-3xl font-bold">
                      <AnimatedCounter value={stats.totalOrders} />
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-cyan-500/10">
                    <TrendingUp className="h-6 w-6 text-cyan-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TiltCard>
          
          <TiltCard className="animate-scale-in" style={{ animationDelay: "200ms" }}>
            <Card className="border-border bg-card h-full">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Active Orders</p>
                    <p className="text-3xl font-bold text-yellow-400">
                      <AnimatedCounter value={stats.activeOrders} />
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-yellow-500/10">
                    <Clock className="h-6 w-6 text-yellow-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TiltCard>
          
          <TiltCard className="animate-scale-in" style={{ animationDelay: "300ms" }}>
            <Card className="border-border bg-card h-full">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Total Revenue</p>
                    <p className="text-3xl font-bold text-green-400">
                      $<AnimatedCounter value={stats.totalRevenue} decimals={2} />
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-green-500/10">
                    <DollarSign className="h-6 w-6 text-green-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TiltCard>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="services" className="space-y-6 animate-fade-in">
          <TabsList className="bg-secondary border-border">
            <TabsTrigger value="services" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
              My Services
            </TabsTrigger>
            <TabsTrigger value="orders" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
              Orders
            </TabsTrigger>
          </TabsList>

          <TabsContent value="services" className="space-y-4">
            {services.length === 0 ? (
              <Card className="border-border border-dashed">
                <CardContent className="p-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Package className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">No Services Yet</h3>
                  <p className="text-muted-foreground mb-6">
                    Upload your first service to start receiving orders
                  </p>
                  <Button
                    onClick={() => setShowServiceDialog(true)}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Upload Your First Service
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((service, idx) => (
                  <TiltCard key={service.id} className="animate-scale-in" style={{ animationDelay: `${idx * 50}ms` }}>
                    <Card className="border-border bg-card hover:border-purple-500/50 transition-all h-full">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-lg">{service.title}</CardTitle>
                          <Badge variant="outline" className="border-primary/30 text-primary">
                            {service.category}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Price</span>
                            <span className="font-bold text-purple-400">
                              ${service.price}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Delivery</span>
                            <span>{service.eta_days} days</span>
                          </div>
                        </div>
                        {service.tech_stack && service.tech_stack.length > 0 && (
                          <div className="flex flex-wrap gap-1 pt-2 border-t border-border">
                            {service.tech_stack.slice(0, 3).map((tech, i) => (
                              <Badge key={i} variant="secondary" className="text-xs">
                                {tech}
                              </Badge>
                            ))}
                            {service.tech_stack.length > 3 && (
                              <Badge variant="secondary" className="text-xs">
                                +{service.tech_stack.length - 3}
                              </Badge>
                            )}
                          </div>
                        )}
                        <Link href={`/service/${service.id}`} className="block pt-2">
                          <Button variant="outline" className="w-full">
                            <Eye className="h-4 w-4 mr-2" />
                            View Service
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  </TiltCard>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="orders" className="space-y-4">
            {orders.length === 0 ? (
              <Card className="border-border border-dashed">
                <CardContent className="p-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Clock className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">No Orders Yet</h3>
                  <p className="text-muted-foreground">
                    Orders will appear here when customers purchase your services
                  </p>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead>Order ID</TableHead>
                      <TableHead>Service</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order, idx) => (
                      <TableRow 
                        key={order.id} 
                        className="animate-fade-in hover:bg-secondary/50"
                        style={{ animationDelay: `${idx * 50}ms` }}
                      >
                        <TableCell className="font-mono text-xs">
                          {order.id.slice(0, 8)}...
                        </TableCell>
                        <TableCell className="font-medium">
                          {order.services?.title || "Unknown Service"}
                        </TableCell>
                        <TableCell>
                          {order.profiles?.full_name || "Unknown Customer"}
                        </TableCell>
                        <TableCell className="font-semibold text-primary">${order.amount}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(order.status)}>
                            {order.status.replace("_", " ")}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Link href={`/orders/${order.id}`}>
                            <Button variant="outline" size="sm" className="hover:scale-105 transition-transform">
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
