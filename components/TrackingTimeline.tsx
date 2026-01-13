"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, Clock, FileText, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

type OrderStatus =
  | "placed"
  | "accepted"
  | "in_progress"
  | "milestone_submitted"
  | "revision_requested"
  | "final_delivered"
  | "completed"
  | "disputed";

interface OrderEvent {
  id: string;
  status_from: OrderStatus | null;
  status_to: OrderStatus;
  note?: string;
  proof_url?: string;
  created_at: string;
}

interface TrackingTimelineProps {
  currentStatus: OrderStatus;
  events: OrderEvent[];
}

const statusConfig: Record<OrderStatus, { label: string; color: string; icon: React.ReactNode }> = {
  placed: { label: "Order Placed", color: "bg-gray-500", icon: <Clock className="h-4 w-4" /> },
  accepted: { label: "Accepted", color: "bg-blue-500", icon: <Check className="h-4 w-4" /> },
  in_progress: { label: "In Progress", color: "bg-cyan-500", icon: <Clock className="h-4 w-4" /> },
  milestone_submitted: { label: "Milestone Submitted", color: "bg-purple-500", icon: <FileText className="h-4 w-4" /> },
  revision_requested: { label: "Revision Requested", color: "bg-yellow-500", icon: <FileText className="h-4 w-4" /> },
  final_delivered: { label: "Final Delivered", color: "bg-green-500", icon: <Check className="h-4 w-4" /> },
  completed: { label: "Completed", color: "bg-green-600", icon: <Check className="h-4 w-4" /> },
  disputed: { label: "Disputed", color: "bg-red-500", icon: <FileText className="h-4 w-4" /> },
};

const statusOrder: OrderStatus[] = [
  "placed",
  "accepted",
  "in_progress",
  "milestone_submitted",
  "revision_requested",
  "final_delivered",
  "completed",
  "disputed",
];

export function TrackingTimeline({ currentStatus, events }: TrackingTimelineProps) {
  const currentIndex = statusOrder.indexOf(currentStatus);
  const eventMap = new Map(events.map((e) => [e.status_to, e]));

  return (
    <Card className="border-2 border-border bg-gradient-to-br from-card/50 to-card backdrop-blur-sm">
      <CardContent className="p-6">
        <div className="space-y-6">
          {statusOrder.map((status, index) => {
            const isCompleted = index <= currentIndex;
            const isCurrent = index === currentIndex;
            const isFuture = index > currentIndex;
            const event = eventMap.get(status);
            const config = statusConfig[status];

            return (
              <div key={status} className="relative flex gap-4">
                {/* Timeline Line */}
                {index < statusOrder.length - 1 && (
                  <div
                    className={cn(
                      "absolute left-5 top-10 h-full w-0.5",
                      isCompleted ? "bg-cyan-500" : "bg-secondary"
                    )}
                  />
                )}

                {/* Status Icon */}
                <div
                  className={cn(
                    "relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all",
                    isCompleted
                      ? "border-cyan-500 bg-cyan-500/20"
                      : isCurrent
                      ? "border-cyan-500 bg-cyan-500/20 animate-pulse"
                      : "border-border bg-secondary"
                  )}
                >
                  <div className={cn("text-white", isCompleted || isCurrent ? "opacity-100" : "opacity-50")}>
                    {config.icon}
                  </div>
                </div>

                {/* Status Content */}
                <div className="flex-1 pb-8">
                  <div className="flex items-center justify-between mb-2">
                    <h3
                      className={cn(
                        "font-semibold",
                        isCompleted || isCurrent ? "text-foreground" : "text-muted-foreground"
                      )}
                    >
                      {config.label}
                    </h3>
                    {isCurrent && (
                      <Badge variant="default" className="bg-cyan-500 text-primary-foreground animate-pulse">
                        Active
                      </Badge>
                    )}
                    {isCompleted && !isCurrent && (
                      <Badge variant="secondary" className="bg-green-500/20 text-green-400">
                        Done
                      </Badge>
                    )}
                  </div>

                  {event && (
                    <div className="space-y-2">
                      {event.note && (
                        <p className="text-sm text-muted-foreground">{event.note}</p>
                      )}
                      {event.proof_url && isCompleted && (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" className="gap-2">
                              <Eye className="h-3 w-3" />
                              View Proof
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Proof Document</DialogTitle>
                              <DialogDescription>Milestone proof for {config.label}</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <p className="text-sm text-muted-foreground">{event.note || "No description provided"}</p>
                              <div className="rounded-lg border border-border p-4 bg-secondary">
                                <a
                                  href={event.proof_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-cyan-400 hover:text-cyan-300 underline break-all"
                                >
                                  {event.proof_url}
                                </a>
                              </div>
                              <p className="text-xs text-muted-foreground">
                                Submitted: {new Date(event.created_at).toLocaleString()}
                              </p>
                            </div>
                          </DialogContent>
                        </Dialog>
                      )}
                      {!isFuture && (
                        <p className="text-xs text-muted-foreground">
                          {new Date(event.created_at).toLocaleString()}
                        </p>
                      )}
                    </div>
                  )}

                  {isFuture && (
                    <p className="text-sm text-muted-foreground italic">Pending...</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
