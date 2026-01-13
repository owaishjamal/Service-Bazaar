"use client";

import { useState, useEffect } from "react";
import { ServiceCard } from "@/components/ServiceCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Filter, X } from "lucide-react";
import Link from "next/link";

interface Service {
  id: string;
  title: string;
  category: string;
  price: number;
  eta_days: number;
  tech_stack: string[];
  description?: string;
  vendor_id: string;
  profiles?: {
    full_name: string;
    trust_score: number;
  };
}

const categories = ["All", "Dev", "Design", "QA", "DevOps", "UI/UX"];

export default function MarketplacePage() {
  const [services, setServices] = useState<Service[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });
  const [compareList, setCompareList] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchServices();
  }, []);

  useEffect(() => {
    filterServices();
  }, [services, searchQuery, selectedCategory, priceRange]);

  const fetchServices = async () => {
    try {
      const response = await fetch("/api/services");
      if (response.ok) {
        const data = await response.json();
        setServices(data);
        setFilteredServices(data);
      }
    } catch (error) {
      console.error("Error fetching services:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterServices = () => {
    let filtered = [...services];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (service) =>
          service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          service.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          service.tech_stack.some((tech) =>
            tech.toLowerCase().includes(searchQuery.toLowerCase())
          )
      );
    }

    // Category filter
    if (selectedCategory !== "All") {
      filtered = filtered.filter((service) => service.category === selectedCategory);
    }

    // Price filter
    filtered = filtered.filter(
      (service) => service.price >= priceRange.min && service.price <= priceRange.max
    );

    setFilteredServices(filtered);
  };

  const handleCompareChange = (serviceId: string, checked: boolean) => {
    const newCompareList = new Set(compareList);
    if (checked) {
      newCompareList.add(serviceId);
    } else {
      newCompareList.delete(serviceId);
    }
    setCompareList(newCompareList);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground">Loading marketplace...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            Marketplace
          </h1>
          <p className="text-muted-foreground">
            Browse and compare professional technical services
          </p>
        </div>

        {/* Search and Filters */}
        <Card className="border-border bg-card">
          <CardContent className="p-6 space-y-6">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search services, technologies, or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={
                    selectedCategory === category
                      ? "bg-primary hover:bg-primary/90"
                      : ""
                  }
                >
                  {category}
                </Button>
              ))}
            </div>

            {/* Price Range */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Min Price</label>
                <Input
                  type="number"
                  placeholder="0"
                  value={priceRange.min}
                  onChange={(e) =>
                    setPriceRange({ ...priceRange, min: Number(e.target.value) })
                  }
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Max Price</label>
                <Input
                  type="number"
                  placeholder="10000"
                  value={priceRange.max}
                  onChange={(e) =>
                    setPriceRange({ ...priceRange, max: Number(e.target.value) })
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Compare Section */}
        {compareList.size > 0 && (
          <Card className="border-cyan-500/50 bg-cyan-500/10">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge className="bg-cyan-500 text-white">
                    {compareList.size} selected
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    Services selected for comparison
                  </span>
                </div>
                <Link href={`/compare/${Array.from(compareList)[0]}`}>
                  <Button size="sm" className="bg-cyan-500 hover:bg-cyan-600">
                    Compare
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Services Grid */}
        {filteredServices.length === 0 ? (
          <Card className="border-border">
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground text-lg">
                No services found matching your criteria.
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("All");
                  setPriceRange({ min: 0, max: 10000 });
                }}
              >
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service) => (
              <ServiceCard
                key={service.id}
                id={service.id}
                title={service.title}
                category={service.category}
                price={service.price}
                etaDays={service.eta_days}
                vendorName={service.profiles?.full_name || "Unknown Vendor"}
                trustScore={service.profiles?.trust_score || 0}
                techStack={service.tech_stack}
                onCompareChange={handleCompareChange}
                isCompareSelected={compareList.has(service.id)}
              />
            ))}
          </div>
        )}

        {/* Results Count */}
        <div className="text-center text-muted-foreground">
          Showing {filteredServices.length} of {services.length} services
        </div>
      </div>
    </div>
  );
}
