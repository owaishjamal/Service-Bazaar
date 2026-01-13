"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Star, User } from "lucide-react";
import Link from "next/link";

interface ServiceCardProps {
  id: string;
  title: string;
  category: string;
  price: number;
  etaDays: number;
  vendorName: string;
  trustScore: number;
  techStack?: string[];
  onCompareChange?: (id: string, checked: boolean) => void;
  isCompareSelected?: boolean;
}

export function ServiceCard({
  id,
  title,
  category,
  price,
  etaDays,
  vendorName,
  trustScore,
  techStack = [],
  onCompareChange,
  isCompareSelected = false,
}: ServiceCardProps) {
  return (
    <Card className="group hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/20 hover-lift bg-gradient-to-br from-card/50 to-card backdrop-blur-sm border-2 animate-fade-in">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg mb-2 group-hover:text-primary transition-colors duration-300">{title}</CardTitle>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline" className="border-primary/30 text-primary animate-scale-in">
                {category}
              </Badge>
            </div>
          </div>
          {onCompareChange && (
            <Checkbox
              checked={isCompareSelected}
              onCheckedChange={(checked) => onCompareChange(id, checked as boolean)}
              className="mt-1 transition-transform duration-300 hover:scale-110"
            />
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Price:</span>
            <span className="font-semibold text-primary transition-all duration-300 group-hover:scale-110">${price.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">ETA:</span>
            <span className="font-semibold">{etaDays} days</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground flex items-center gap-1">
              <User className="h-3 w-3 transition-transform duration-300 group-hover:scale-110" />
              Vendor:
            </span>
            <span className="font-semibold">{vendorName}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground flex items-center gap-1">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 transition-transform duration-300 group-hover:rotate-12" />
              Trust:
            </span>
            <span className="font-semibold">{trustScore}/100</span>
          </div>
          {techStack.length > 0 && (
            <div className="pt-2 border-t border-border animate-slide-up">
              <div className="flex flex-wrap gap-1">
                {techStack.slice(0, 3).map((tech, idx) => (
                  <Badge 
                    key={idx} 
                    variant="secondary" 
                    className="text-xs transition-all duration-300 hover:scale-105"
                    style={{ animationDelay: `${idx * 50}ms` }}
                  >
                    {tech}
                  </Badge>
                ))}
                {techStack.length > 3 && (
                  <Badge variant="secondary" className="text-xs">
                    +{techStack.length - 3}
                  </Badge>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Link href={`/service/${id}`} className="w-full">
          <Button className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-primary-foreground font-semibold shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all duration-300 hover:scale-105">
            View Details
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
