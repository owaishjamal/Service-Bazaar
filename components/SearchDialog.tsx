"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

export function SearchDialog() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="hidden md:flex">
          <Search className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Search Services</DialogTitle>
          <DialogDescription>Find the perfect service for your needs</DialogDescription>
        </DialogHeader>
        <div className="mt-4 space-y-4">
          <Input 
            placeholder="Search by service name, vendor, or category..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            className="w-full" 
          />
          <Button 
            onClick={handleSearch}
            className="w-full bg-cyan-500 hover:bg-cyan-600 text-primary-foreground"
          >
            Search
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
