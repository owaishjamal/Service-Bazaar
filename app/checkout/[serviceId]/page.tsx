"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SuccessCelebration } from "@/components/Confetti";
import { CheckCircle, ArrowLeft, Shield, Clock, Star, CreditCard, Loader2 } from "lucide-react";
import Link from "next/link";

export default function CheckoutPage({ params }: { params: Promise<{ serviceId: string }> }) {
  const router = useRouter();
  const { serviceId } = use(params);
  const [checkoutData, setCheckoutData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  useEffect(() => {
    const data = sessionStorage.getItem("checkoutData");
    if (data) {
      setCheckoutData(JSON.parse(data));
    } else {
      router.push(`/service/${serviceId}`);
    }
  }, [serviceId, router]);

  const handlePlaceOrder = async () => {
    if (!checkoutData) return;

    setLoading(true);
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service_id: checkoutData.serviceId,
          requirements: checkoutData.requirements,
          amount: checkoutData.service.price,
        }),
      });

      if (response.ok) {
        const order = await response.json();
        sessionStorage.removeItem("checkoutData");
        setOrderId(order.id);
        setShowCelebration(true);
        
        // Navigate after celebration
        setTimeout(() => {
          router.push(`/orders/${order.id}`);
        }, 3000);
      } else {
        const error = await response.json();
        alert(error.error || "Failed to place order. Please try again.");
        setLoading(false);
      }
    } catch (error) {
      console.error("Error placing order:", error);
      alert("An error occurred. Please try again.");
      setLoading(false);
    }
  };

  if (!checkoutData) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading checkout...</p>
        </div>
      </div>
    );
  }

  const { service, requirements, scope } = checkoutData;

  return (
    <div className="min-h-screen py-8 px-4">
      <SuccessCelebration 
        show={showCelebration} 
        message="Order Placed!"
        subMessage="Redirecting to your order tracking page..."
      />
      
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 animate-fade-in">
          <Link href={`/service/${serviceId}`}>
            <Button variant="ghost" size="sm" className="hover:scale-105 transition-transform">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Secure Checkout</h1>
            <p className="text-muted-foreground">Complete your order</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Order Summary */}
          <Card className="border-border bg-card animate-slide-up">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" />
                Order Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-xl bg-gradient-to-br from-primary/10 to-transparent border border-primary/20">
                <h3 className="font-semibold text-lg">{service.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">by {service.vendorName}</p>
              </div>
              
              <div className="space-y-3 pt-4 border-t border-border">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    Price
                  </span>
                  <span className="font-bold text-lg text-primary">${service.price}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Delivery Time
                  </span>
                  <span className="font-semibold">{service.etaDays} days</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Star className="h-4 w-4" />
                    Vendor Rating
                  </span>
                  <Badge variant="secondary" className="font-semibold">
                    {service.trustScore}/100 ⭐
                  </Badge>
                </div>
              </div>
              
              <div className="pt-4 border-t border-border">
                <div className="flex justify-between items-center text-xl font-bold">
                  <span>Total</span>
                  <span className="text-primary">${service.price}</span>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="pt-4 flex flex-wrap gap-2">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Shield className="h-3 w-3 text-green-500" />
                  <span>Secure Payment</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <CheckCircle className="h-3 w-3 text-blue-500" />
                  <span>Money-back Guarantee</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Scope & Requirements */}
          <Card className="border-border bg-card animate-slide-up" style={{ animationDelay: "100ms" }}>
            <CardHeader>
              <CardTitle>Scope of Work</CardTitle>
              <CardDescription>Generated from your requirements</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Your Requirements</label>
                <div className="text-sm text-muted-foreground bg-secondary p-4 rounded-xl">
                  {requirements || "No specific requirements provided"}
                </div>
              </div>
              
              {scope && (
                <div>
                  <label className="text-sm font-medium mb-2 block">Generated Scope</label>
                  <div className="bg-gradient-to-br from-secondary to-secondary/50 p-4 rounded-xl space-y-3">
                    {scope.deliverables && (
                      <div>
                        <p className="text-xs font-bold text-primary mb-2 uppercase tracking-wider">
                          📦 Deliverables:
                        </p>
                        <ul className="text-sm text-muted-foreground space-y-2">
                          {scope.deliverables.map((item: string, idx: number) => (
                            <li key={idx} className="flex items-start gap-2">
                              <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {scope.timeline && (
                      <div className="pt-2 border-t border-border">
                        <p className="text-xs font-bold text-primary mb-1 uppercase tracking-wider">
                          ⏱️ Timeline:
                        </p>
                        <p className="text-sm text-muted-foreground">{scope.timeline}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              <Button
                onClick={handlePlaceOrder}
                disabled={loading || showCelebration}
                className="w-full h-14 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold text-lg rounded-xl shadow-lg shadow-green-500/30 hover:shadow-xl hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Processing...
                  </span>
                ) : showCelebration ? (
                  <span className="flex items-center gap-2">
                    🎉 Order Placed!
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    Place Order - ${service.price}
                  </span>
                )}
              </Button>
              
              <p className="text-xs text-center text-muted-foreground">
                By placing this order, you agree to our Terms of Service
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
