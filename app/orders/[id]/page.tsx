"use client";

import { useState, useEffect, use } from "react";
import { TrackingTimeline } from "@/components/TrackingTimeline";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { MessageSquare, Send, Upload, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";

// Mock data - will be replaced with Supabase queries and realtime subscriptions
const mockOrder = {
  id: "1",
  serviceTitle: "React Code Review & Optimization",
  vendorName: "CodeCraft Pro",
  buyerName: "TechStart Inc",
  status: "in_progress" as const,
  amount: 299.99,
  requirements: "Need comprehensive code review for React app with TypeScript. Focus on performance optimization and best practices.",
  createdAt: "2024-01-15T10:00:00Z",
};

const mockEvents = [
  {
    id: "1",
    status_from: null,
    status_to: "placed" as const,
    note: "Order placed by customer",
    proof_url: undefined,
    created_at: "2024-01-15T10:00:00Z",
  },
  {
    id: "2",
    status_from: "placed" as const,
    status_to: "accepted" as const,
    note: "Order accepted by vendor",
    proof_url: undefined,
    created_at: "2024-01-15T11:30:00Z",
  },
  {
    id: "3",
    status_from: "accepted" as const,
    status_to: "in_progress" as const,
    note: "Work started on code review",
    proof_url: undefined,
    created_at: "2024-01-15T14:00:00Z",
  },
];

const mockMessages = [
  { id: "1", sender: "buyer", message: "When can we expect the first milestone?", timestamp: "2024-01-15T10:30:00Z" },
  { id: "2", sender: "vendor", message: "I&apos;ll submit the initial review by tomorrow evening.", timestamp: "2024-01-15T10:35:00Z" },
  { id: "3", sender: "buyer", message: "Great! Looking forward to it.", timestamp: "2024-01-15T10:40:00Z" },
];

export default function OrderTrackingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [role, setRole] = useState<"customer" | "vendor" | null>(null);
  const [messages, setMessages] = useState(mockMessages);
  const [newMessage, setNewMessage] = useState("");
  const [proofUrl, setProofUrl] = useState("");
  const [proofNote, setProofNote] = useState("");

  useEffect(() => {
    // Get user role from API
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setRole(data.user.role as "customer" | "vendor");
        }
      })
      .catch(() => setRole("customer"));
  }, []);

  const isVendor = role === "vendor";
  const isCustomer = role === "customer";

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    const message = {
      id: Date.now().toString(),
      sender: isVendor ? "vendor" : "buyer",
      message: newMessage,
      timestamp: new Date().toISOString(),
    };
    setMessages([...messages, message]);
    setNewMessage("");
    // TODO: Send to Supabase
  };

  const handleSubmitMilestone = async () => {
    if (!proofUrl.trim()) {
      alert("Please provide a proof URL");
      return;
    }

    try {
      // In production, this would call the API
      const response = await fetch(`/api/orders/${id}/events`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status_to: "milestone_submitted",
          note: proofNote || "Milestone submitted",
          proof_url: proofUrl,
        }),
      });

      if (response.ok) {
        alert("Milestone submitted successfully!");
        setProofUrl("");
        setProofNote("");
        // Refresh page or update state
        window.location.reload();
      } else {
        alert("Failed to submit milestone. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting milestone:", error);
      alert("An error occurred. Please try again.");
    }
  };

  const handleRequestRevision = async () => {
    if (!confirm("Are you sure you want to request a revision?")) return;

    try {
      const response = await fetch(`/api/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "revision_requested" }),
      });

      if (response.ok) {
        alert("Revision requested successfully!");
        window.location.reload();
      } else {
        alert("Failed to request revision. Please try again.");
      }
    } catch (error) {
      console.error("Error requesting revision:", error);
      alert("An error occurred. Please try again.");
    }
  };

  const handleAccept = async () => {
    if (!confirm("Accept this delivery as complete?")) return;

    try {
      const response = await fetch(`/api/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "completed" }),
      });

      if (response.ok) {
        alert("Order completed successfully!");
        window.location.reload();
      } else {
        alert("Failed to complete order. Please try again.");
      }
    } catch (error) {
      console.error("Error accepting delivery:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">
              ← Back to Dashboard
            </Button>
          </Link>
          <h1 className="text-3xl font-bold mt-2">{mockOrder.serviceTitle}</h1>
          <p className="text-muted-foreground mt-1">
            {isVendor ? `Buyer: ${mockOrder.buyerName}` : `Vendor: ${mockOrder.vendorName}`}
          </p>
        </div>
        <div className="text-right">
          <Badge className="bg-cyan-500 text-primary-foreground text-sm px-3 py-1">
            {mockOrder.status.replace("_", " ")}
          </Badge>
          <p className="text-2xl font-bold text-cyan-400 mt-2">${mockOrder.amount}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left Column - Chat & Requirements */}
        <div className="space-y-6">
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Communication
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[400px] p-4">
                <div className="space-y-4">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.sender === (isVendor ? "vendor" : "buyer") ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          msg.sender === (isVendor ? "vendor" : "buyer")
                            ? "bg-cyan-500/20 text-cyan-100"
                            : "bg-secondary text-foreground"
                        }`}
                      >
                        <p className="text-sm">{msg.message}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(msg.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              <div className="border-t border-border p-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    className="flex-1"
                  />
                  <Button onClick={handleSendMessage} className="bg-cyan-500 hover:bg-cyan-600 text-primary-foreground">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader>
              <CardTitle>Requirements</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{mockOrder.requirements}</p>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          {isVendor && (
            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full bg-cyan-500 hover:bg-cyan-600 text-primary-foreground font-semibold">
                  <Upload className="h-4 w-4 mr-2" />
                  Submit Milestone
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Submit Milestone Proof</DialogTitle>
                  <DialogDescription>Upload proof of milestone completion</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Proof URL</label>
                    <Input
                      placeholder="https://example.com/proof.pdf"
                      value={proofUrl}
                      onChange={(e) => setProofUrl(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Note</label>
                    <Textarea
                      placeholder="Describe what was completed..."
                      value={proofNote}
                      onChange={(e) => setProofNote(e.target.value)}
                      rows={4}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button 
                    variant="outline"
                    onClick={() => {
                      setProofUrl("");
                      setProofNote("");
                    }}
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleSubmitMilestone}
                    disabled={!proofUrl.trim()}
                    className="bg-cyan-500 hover:bg-cyan-600 text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Submit
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}

          {isCustomer && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleRequestRevision}
                className="flex-1 border-yellow-500/30 hover:bg-yellow-500/10"
              >
                <XCircle className="h-4 w-4 mr-2" />
                Request Revision
              </Button>
              <Button
                onClick={handleAccept}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Accept Delivery
              </Button>
            </div>
          )}
        </div>

        {/* Right Column - Tracking Timeline */}
        <div>
          <TrackingTimeline currentStatus={mockOrder.status} events={mockEvents} />
        </div>
      </div>
    </div>
  );
}
