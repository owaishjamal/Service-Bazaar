"use client";

import { useState, useEffect } from "react";
import { Sparkles, Loader2, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface AIRequirementsGeneratorProps {
  serviceTitle: string;
  serviceCategory: string;
  onGenerated: (requirements: string) => void;
}

export function AIRequirementsGenerator({
  serviceTitle,
  serviceCategory,
  onGenerated,
}: AIRequirementsGeneratorProps) {
  const [input, setInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedRequirements, setGeneratedRequirements] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(true);

  // Smart suggestions based on category
  const suggestions: Record<string, string[]> = {
    Dev: [
      "I need a responsive landing page with animations",
      "Build a REST API with authentication",
      "Create a React component library",
      "Fix bugs in my Node.js backend",
      "Implement real-time chat feature",
    ],
    Design: [
      "Design a modern mobile app UI",
      "Create a brand identity package",
      "Design social media templates",
      "Make a logo with 3 variations",
      "Design an e-commerce website",
    ],
    QA: [
      "Write automated tests for my web app",
      "Perform security audit on my API",
      "Create a test plan document",
      "Load test my application",
      "Review code quality",
    ],
    DevOps: [
      "Set up CI/CD pipeline with GitHub Actions",
      "Configure AWS infrastructure",
      "Dockerize my application",
      "Set up monitoring and alerts",
      "Migrate database to cloud",
    ],
    "UI/UX": [
      "Create user journey maps",
      "Design a design system",
      "Conduct usability testing",
      "Create wireframes for mobile app",
      "Improve conversion rate on landing page",
    ],
  };

  const currentSuggestions = suggestions[serviceCategory] || suggestions.Dev;

  // Simulate AI generation
  const generateRequirements = async () => {
    if (!input.trim()) return;

    setIsGenerating(true);
    setShowSuggestions(false);

    // Simulate AI thinking with realistic delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Generate smart requirements based on input
    const requirements = generateSmartRequirements(input, serviceCategory);
    
    // Animate the requirements appearing one by one
    for (let i = 0; i < requirements.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      setGeneratedRequirements((prev) => [...prev, requirements[i]]);
    }

    setIsGenerating(false);
    onGenerated(requirements.join("\n• "));
  };

  const generateSmartRequirements = (input: string, category: string): string[] => {
    const baseRequirements: Record<string, string[]> = {
      Dev: [
        `Code must follow best practices and be well-documented`,
        `Include comprehensive error handling`,
        `Provide unit tests with >80% coverage`,
        `Use TypeScript for type safety`,
        `Include deployment instructions`,
      ],
      Design: [
        `Provide source files in Figma/Sketch format`,
        `Include responsive variations for mobile/tablet/desktop`,
        `Follow brand guidelines and color scheme`,
        `Deliver assets in multiple formats (PNG, SVG)`,
        `Include style guide documentation`,
      ],
      QA: [
        `Document all test cases and scenarios`,
        `Provide detailed bug reports with reproduction steps`,
        `Include performance benchmarks`,
        `Deliver test automation scripts`,
        `Create test coverage report`,
      ],
      DevOps: [
        `Include infrastructure as code (Terraform/CDK)`,
        `Set up proper staging and production environments`,
        `Configure security best practices`,
        `Document deployment procedures`,
        `Include monitoring dashboards`,
      ],
      "UI/UX": [
        `Deliver interactive prototypes`,
        `Include user research findings`,
        `Provide accessibility guidelines`,
        `Document design decisions`,
        `Include component specifications`,
      ],
    };

    const inputLower = input.toLowerCase();
    const requirements = [
      `Project scope: ${input}`,
      ...baseRequirements[category] || baseRequirements.Dev,
    ];

    // Add context-specific requirements
    if (inputLower.includes("landing")) {
      requirements.push("Optimize for SEO and page load speed");
    }
    if (inputLower.includes("api") || inputLower.includes("backend")) {
      requirements.push("Include API documentation (Swagger/OpenAPI)");
    }
    if (inputLower.includes("mobile") || inputLower.includes("responsive")) {
      requirements.push("Ensure cross-browser and cross-device compatibility");
    }
    if (inputLower.includes("auth") || inputLower.includes("login")) {
      requirements.push("Implement secure authentication with JWT/OAuth");
    }
    if (inputLower.includes("real-time") || inputLower.includes("chat")) {
      requirements.push("Use WebSocket for real-time communication");
    }

    return requirements;
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
    setShowSuggestions(false);
  };

  const reset = () => {
    setInput("");
    setGeneratedRequirements([]);
    setShowSuggestions(true);
  };

  return (
    <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-transparent">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className="p-1.5 rounded-lg bg-primary/10">
            <Wand2 className="h-4 w-4 text-primary" />
          </div>
          AI Requirements Generator
          <Badge variant="secondary" className="ml-auto text-xs">
            <Sparkles className="h-3 w-3 mr-1" />
            Powered by AI
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Input */}
        <div className="relative">
          <Textarea
            placeholder="Describe what you need in plain English..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="min-h-[100px] bg-background resize-none pr-24"
          />
          <Button
            size="sm"
            onClick={generateRequirements}
            disabled={isGenerating || !input.trim()}
            className="absolute bottom-3 right-3 bg-gradient-to-r from-primary to-primary/80"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-1" />
                Generate
              </>
            )}
          </Button>
        </div>

        {/* Suggestions */}
        {showSuggestions && (
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground font-medium">Try these suggestions:</p>
            <div className="flex flex-wrap gap-2">
              {currentSuggestions.map((suggestion, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="text-xs px-3 py-1.5 rounded-full bg-secondary hover:bg-secondary/80 text-muted-foreground hover:text-foreground transition-all hover:scale-105"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Generated Requirements */}
        {generatedRequirements.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground font-medium">Generated Requirements:</p>
              <Button variant="ghost" size="sm" onClick={reset} className="text-xs h-7">
                Reset
              </Button>
            </div>
            <ul className="space-y-2">
              {generatedRequirements.map((req, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2 text-sm animate-slide-up"
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  <span className="w-5 h-5 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="text-muted-foreground">{req}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
