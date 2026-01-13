"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Package, AlertTriangle, CheckCircle, Clock, TrendingUp } from "lucide-react";
import Link from "next/link";

// Mock data - will be replaced with Supabase queries
const customerOrders = [
  {
    id: "1",
    serviceTitle: "React Code Review",
    vendorName: "CodeCraft Pro",
    status: "in_progress",
    progress: 60,
    amount: 299.99,
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    serviceTitle: "UI/UX Design System",
    vendorName: "Design Studio X",
    status: "milestone_submitted",
    progress: 80,
    amount: 499.99,
    createdAt: "2024-01-10",
  },
  {
    id: "3",
    serviceTitle: "E2E Testing Suite",
    vendorName: "QA Masters",
    status: "completed",
    progress: 100,
    amount: 399.99,
    createdAt: "2024-01-05",
  },
];

const vendorOrders = {
  todo: [
    { id: "1", title: "API Integration", buyer: "Acme Corp", amount: 249.99, status: "placed" },
  ],
  inProgress: [
    { id: "2", title: "React Code Review", buyer: "TechStart", amount: 299.99, status: "in_progress" },
    { id: "3", title: "UI/UX Design", buyer: "DesignCo", amount: 499.99, status: "in_progress" },
  ],
  done: [
    { id: "4", title: "E2E Testing", buyer: "TestApp", amount: 399.99, status: "completed" },
  ],
};

const adminOrders = [
  {
    id: "1",
    serviceTitle: "React Code Review",
    buyer: "TechStart",
    vendor: "CodeCraft Pro",
    status: "in_progress",
    amount: 299.99,
    hasDispute: false,
  },
  {
    id: "2",
    serviceTitle: "UI/UX Design",
    buyer: "DesignCo",
    vendor: "Design Studio X",
    status: "disputed",
    amount: 499.99,
    hasDispute: true,
  },
  {
    id: "3",
    serviceTitle: "E2E Testing",
    buyer: "TestApp",
    vendor: "QA Masters",
    status: "completed",
    amount: 399.99,
    hasDispute: false,
  },
];

const statusColors: Record<string, string> = {
  placed: "bg-gray-500",
  accepted: "bg-blue-500",
  in_progress: "bg-cyan-500",
  milestone_submitted: "bg-purple-500",
  revision_requested: "bg-yellow-500",
  final_delivered: "bg-green-500",
  completed: "bg-green-600",
  disputed: "bg-red-500",
};

function CustomerView() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">My Orders</h2>
        <p className="text-muted-foreground">Track your active service deliveries</p>
      </div>
      <div className="grid gap-6">
        {customerOrders.map((order) => (
          <Card key={order.id} className="border-border hover:border-cyan-500/50 transition-colors">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{order.serviceTitle}</CardTitle>
                  <CardDescription className="mt-1">Vendor: {order.vendorName}</CardDescription>
                </div>
                <Badge
                  className={`${statusColors[order.status] || "bg-gray-500"} text-white`}
                >
                  {order.status.replace("_", " ")}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-semibold">{order.progress}%</span>
                </div>
                <Progress value={order.progress} className="h-2" />
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <div>
                  <p className="text-sm text-muted-foreground">Amount</p>
                  <p className="text-lg font-semibold text-cyan-400">${order.amount}</p>
                </div>
                <Link href={`/orders/${order.id}`}>
                  <Button variant="outline" className="border-cyan-500/30 hover:bg-cyan-500/10">
                    View Details
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function VendorView() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Order Board</h2>
        <p className="text-muted-foreground">Manage your service orders in a Kanban-style board</p>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              To Do
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[500px]">
              <div className="space-y-3">
                {vendorOrders.todo.map((order) => (
                  <Card
                    key={order.id}
                    className="border-border bg-secondary/50 cursor-move hover:border-cyan-500/50 transition-colors"
                  >
                    <CardContent className="p-4">
                      <h4 className="font-semibold mb-2">{order.title}</h4>
                      <p className="text-sm text-muted-foreground mb-2">Buyer: {order.buyer}</p>
                      <p className="text-sm font-semibold text-cyan-400">${order.amount}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              In Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[500px]">
              <div className="space-y-3">
                {vendorOrders.inProgress.map((order) => (
                  <Card
                    key={order.id}
                    className="border-border bg-secondary/50 cursor-move hover:border-cyan-500/50 transition-colors"
                  >
                    <CardContent className="p-4">
                      <h4 className="font-semibold mb-2">{order.title}</h4>
                      <p className="text-sm text-muted-foreground mb-2">Buyer: {order.buyer}</p>
                      <p className="text-sm font-semibold text-cyan-400">${order.amount}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Done
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[500px]">
              <div className="space-y-3">
                {vendorOrders.done.map((order) => (
                  <Card
                    key={order.id}
                    className="border-border bg-secondary/50 cursor-move hover:border-cyan-500/50 transition-colors"
                  >
                    <CardContent className="p-4">
                      <h4 className="font-semibold mb-2">{order.title}</h4>
                      <p className="text-sm text-muted-foreground mb-2">Buyer: {order.buyer}</p>
                      <p className="text-sm font-semibold text-cyan-400">${order.amount}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function AdminView() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Admin Dashboard</h2>
        <p className="text-muted-foreground">God Mode: View and manage all orders</p>
      </div>
      <Tabs defaultValue="orders" className="w-full">
        <TabsList>
          <TabsTrigger value="orders">All Orders</TabsTrigger>
          <TabsTrigger value="disputes">
            Disputes
            <Badge variant="destructive" className="ml-2">
              {adminOrders.filter((o) => o.hasDispute).length}
            </Badge>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="orders">
          <Card className="border-border">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Service</TableHead>
                    <TableHead>Buyer</TableHead>
                    <TableHead>Vendor</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {adminOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.serviceTitle}</TableCell>
                      <TableCell>{order.buyer}</TableCell>
                      <TableCell>{order.vendor}</TableCell>
                      <TableCell>
                        <Badge
                          className={`${statusColors[order.status] || "bg-gray-500"} text-white`}
                        >
                          {order.status.replace("_", " ")}
                        </Badge>
                      </TableCell>
                      <TableCell>${order.amount}</TableCell>
                      <TableCell>
                        <Link href={`/orders/${order.id}`}>
                          <Button variant="ghost" size="sm">
                            View
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="disputes">
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                Dispute Resolution Center
              </CardTitle>
              <CardDescription>Resolve customer-vendor disputes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {adminOrders
                  .filter((o) => o.hasDispute)
                  .map((order) => (
                    <Card key={order.id} className="border-red-500/30 bg-red-500/5">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-semibold mb-1">{order.serviceTitle}</h4>
                            <p className="text-sm text-muted-foreground">
                              Buyer: {order.buyer} • Vendor: {order.vendor}
                            </p>
                          </div>
                          <Badge variant="destructive">Disputed</Badge>
                        </div>
                        <div className="mt-4 flex gap-2">
                          <Link href={`/orders/${order.id}`}>
                            <Button variant="outline" size="sm">
                              View Details
                            </Button>
                          </Link>
                          <Button 
                            size="sm" 
                            className="bg-cyan-500 hover:bg-cyan-600 text-primary-foreground"
                            onClick={() => {
                              alert(`Resolving dispute for order ${order.id}. In production, this would update the dispute status in the database.`);
                            }}
                          >
                            Resolve
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                {adminOrders.filter((o) => o.hasDispute).length === 0 && (
                  <p className="text-center text-muted-foreground py-8">No active disputes</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function DashboardPage() {
  const [role, setRole] = useState<"customer" | "vendor" | "admin" | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get user role from API
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setRole(data.user.role as "customer" | "vendor" | "admin");
        }
        setLoading(false);
      })
      .catch(() => {
        setRole("customer");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {role === "customer" && <CustomerView />}
      {role === "vendor" && <VendorView />}
      {role === "admin" && <AdminView />}
    </div>
  );
}
