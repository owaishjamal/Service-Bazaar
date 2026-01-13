/**
 * Seed script for Service Bazaar
 * Populates Supabase with mock data: 5 vendors, 10 services, 3 orders
 * 
 * Usage: 
 * 1. Set up your Supabase project and get the URL and anon key
 * 2. Run: npx tsx scripts/seed.ts
 * 
 * Make sure to set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
 * or pass them as environment variables
 */

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || "";

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Missing Supabase credentials. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Mock data
const vendors = [
  {
    id: "00000000-0000-0000-0000-000000000001",
    full_name: "CodeCraft Pro",
    bio: "Expert React and TypeScript developers with 10+ years of experience",
    trust_score: 95,
    skills: ["React", "TypeScript", "Next.js", "Node.js"],
  },
  {
    id: "00000000-0000-0000-0000-000000000002",
    full_name: "Design Studio X",
    bio: "Award-winning UI/UX design agency specializing in modern web applications",
    trust_score: 92,
    skills: ["Figma", "Design Systems", "UI/UX", "Prototyping"],
  },
  {
    id: "00000000-0000-0000-0000-000000000003",
    full_name: "QA Masters",
    bio: "Comprehensive testing solutions for web and mobile applications",
    trust_score: 88,
    skills: ["Cypress", "Jest", "Playwright", "Selenium"],
  },
  {
    id: "00000000-0000-0000-0000-000000000004",
    full_name: "InfraGenius",
    bio: "DevOps and infrastructure experts. Kubernetes, Docker, CI/CD specialists",
    trust_score: 97,
    skills: ["Docker", "Kubernetes", "GitHub Actions", "AWS", "Terraform"],
  },
  {
    id: "00000000-0000-0000-0000-000000000005",
    full_name: "API Experts",
    bio: "Backend development and API integration services",
    trust_score: 90,
    skills: ["Node.js", "REST", "GraphQL", "PostgreSQL", "MongoDB"],
  },
];

const services = [
  {
    vendor_id: "00000000-0000-0000-0000-000000000001",
    title: "React Code Review & Optimization",
    category: "Dev",
    price: 299.99,
    eta_days: 3,
    tech_stack: ["React", "TypeScript", "Next.js"],
    description: "Comprehensive code review and optimization for React applications",
  },
  {
    vendor_id: "00000000-0000-0000-0000-000000000002",
    title: "UI/UX Design System",
    category: "Design",
    price: 499.99,
    eta_days: 7,
    tech_stack: ["Figma", "Design Systems"],
    description: "Complete design system creation with component library",
  },
  {
    vendor_id: "00000000-0000-0000-0000-000000000003",
    title: "E2E Testing Suite",
    category: "QA",
    price: 399.99,
    eta_days: 5,
    tech_stack: ["Cypress", "Jest", "Playwright"],
    description: "End-to-end testing suite with comprehensive coverage",
  },
  {
    vendor_id: "00000000-0000-0000-0000-000000000004",
    title: "DevOps CI/CD Pipeline",
    category: "DevOps",
    price: 599.99,
    eta_days: 10,
    tech_stack: ["Docker", "Kubernetes", "GitHub Actions"],
    description: "Complete CI/CD pipeline setup with automated deployments",
  },
  {
    vendor_id: "00000000-0000-0000-0000-000000000005",
    title: "API Integration Service",
    category: "Dev",
    price: 249.99,
    eta_days: 4,
    tech_stack: ["Node.js", "REST", "GraphQL"],
    description: "Third-party API integration and backend development",
  },
  {
    vendor_id: "00000000-0000-0000-0000-000000000001",
    title: "Next.js Performance Optimization",
    category: "Dev",
    price: 349.99,
    eta_days: 5,
    tech_stack: ["Next.js", "React", "TypeScript"],
    description: "Performance optimization for Next.js applications",
  },
  {
    vendor_id: "00000000-0000-0000-0000-000000000002",
    title: "Mobile App UI Design",
    category: "UI/UX",
    price: 449.99,
    eta_days: 6,
    tech_stack: ["Figma", "Sketch", "Principle"],
    description: "Mobile app UI/UX design with interactive prototypes",
  },
  {
    vendor_id: "00000000-0000-0000-0000-000000000003",
    title: "Load Testing & Performance",
    category: "QA",
    price: 299.99,
    eta_days: 4,
    tech_stack: ["JMeter", "K6", "Artillery"],
    description: "Load testing and performance analysis",
  },
  {
    vendor_id: "00000000-0000-0000-0000-000000000004",
    title: "Cloud Infrastructure Setup",
    category: "DevOps",
    price: 799.99,
    eta_days: 14,
    tech_stack: ["AWS", "Terraform", "Kubernetes"],
    description: "Complete cloud infrastructure setup and configuration",
  },
  {
    vendor_id: "00000000-0000-0000-0000-000000000005",
    title: "GraphQL API Development",
    category: "Dev",
    price: 399.99,
    eta_days: 6,
    tech_stack: ["GraphQL", "Node.js", "PostgreSQL"],
    description: "GraphQL API development with schema design",
  },
];

const customers = [
  {
    id: "00000000-0000-0000-0000-000000000010",
    full_name: "TechStart Inc",
    bio: "Fast-growing tech startup",
    trust_score: 100,
    skills: [],
  },
];

async function seed() {
  console.log("🌱 Starting seed process...\n");

  try {
    // Note: In production, profiles should be created via auth.users triggers
    // For seeding, we'll assume auth.users exist or use service role key
    console.log("📝 Seeding profiles (vendors)...");
    for (const vendor of vendors) {
      const { error } = await supabase.from("profiles").upsert({
        id: vendor.id,
        role: "vendor",
        full_name: vendor.full_name,
        bio: vendor.bio,
        trust_score: vendor.trust_score,
        skills: vendor.skills,
      });
      if (error) {
        console.warn(`⚠️  Warning inserting vendor ${vendor.full_name}:`, error.message);
      } else {
        console.log(`✅ Created vendor: ${vendor.full_name}`);
      }
    }

    console.log("\n📝 Seeding customer profile...");
    for (const customer of customers) {
      const { error } = await supabase.from("profiles").upsert({
        id: customer.id,
        role: "customer",
        full_name: customer.full_name,
        bio: customer.bio,
        trust_score: customer.trust_score,
        skills: customer.skills,
      });
      if (error) {
        console.warn(`⚠️  Warning inserting customer ${customer.full_name}:`, error.message);
      } else {
        console.log(`✅ Created customer: ${customer.full_name}`);
      }
    }

    console.log("\n📦 Seeding services...");
    const serviceIds: string[] = [];
    for (const service of services) {
      const { data, error } = await supabase
        .from("services")
        .insert(service)
        .select("id")
        .single();
      if (error) {
        console.warn(`⚠️  Warning inserting service ${service.title}:`, error.message);
      } else {
        console.log(`✅ Created service: ${service.title}`);
        if (data) serviceIds.push(data.id);
      }
    }

    console.log("\n📋 Seeding orders...");
    if (serviceIds.length >= 3) {
      const orders = [
        {
          buyer_id: customers[0].id,
          service_id: serviceIds[0],
          vendor_id: vendors[0].id,
          status: "in_progress",
          amount: services[0].price,
          requirements_doc: "Need comprehensive code review for React app with TypeScript. Focus on performance optimization and best practices.",
        },
        {
          buyer_id: customers[0].id,
          service_id: serviceIds[1],
          vendor_id: vendors[1].id,
          status: "milestone_submitted",
          amount: services[1].price,
          requirements_doc: "Create a complete design system for our web application with component library and style guide.",
        },
        {
          buyer_id: customers[0].id,
          service_id: serviceIds[2],
          vendor_id: vendors[2].id,
          status: "completed",
          amount: services[2].price,
          requirements_doc: "Set up comprehensive E2E testing suite with Cypress and Playwright for our application.",
        },
      ];

      const orderIds: string[] = [];
      for (const order of orders) {
        const { data, error } = await supabase
          .from("orders")
          .insert(order)
          .select("id")
          .single();
        if (error) {
          console.warn(`⚠️  Warning inserting order:`, error.message);
        } else {
          console.log(`✅ Created order: ${order.status}`);
          if (data) orderIds.push(data.id);
        }
      }

      // Create order events
      console.log("\n📊 Seeding order events...");
      if (orderIds.length > 0) {
        const events = [
          {
            order_id: orderIds[0],
            status_from: null,
            status_to: "placed",
            note: "Order placed by customer",
            proof_url: null,
          },
          {
            order_id: orderIds[0],
            status_from: "placed",
            status_to: "accepted",
            note: "Order accepted by vendor",
            proof_url: null,
          },
          {
            order_id: orderIds[0],
            status_from: "accepted",
            status_to: "in_progress",
            note: "Work started on code review",
            proof_url: null,
          },
          {
            order_id: orderIds[1],
            status_from: null,
            status_to: "placed",
            note: "Order placed by customer",
            proof_url: null,
          },
          {
            order_id: orderIds[1],
            status_from: "placed",
            status_to: "accepted",
            note: "Order accepted by vendor",
            proof_url: null,
          },
          {
            order_id: orderIds[1],
            status_from: "accepted",
            status_to: "in_progress",
            note: "Design work started",
            proof_url: null,
          },
          {
            order_id: orderIds[1],
            status_from: "in_progress",
            status_to: "milestone_submitted",
            note: "Initial design system delivered",
            proof_url: "https://example.com/proof/design-system-v1.pdf",
          },
          {
            order_id: orderIds[2],
            status_from: null,
            status_to: "placed",
            note: "Order placed by customer",
            proof_url: null,
          },
          {
            order_id: orderIds[2],
            status_from: "placed",
            status_to: "accepted",
            note: "Order accepted by vendor",
            proof_url: null,
          },
          {
            order_id: orderIds[2],
            status_from: "accepted",
            status_to: "in_progress",
            note: "Testing suite development started",
            proof_url: null,
          },
          {
            order_id: orderIds[2],
            status_from: "in_progress",
            status_to: "final_delivered",
            note: "Complete testing suite delivered",
            proof_url: "https://example.com/proof/testing-suite.zip",
          },
          {
            order_id: orderIds[2],
            status_from: "final_delivered",
            status_to: "completed",
            note: "Order completed and accepted by customer",
            proof_url: null,
          },
        ];

        for (const event of events) {
          const { error } = await supabase.from("order_events").insert(event);
          if (error) {
            console.warn(`⚠️  Warning inserting event:`, error.message);
          }
        }
        console.log(`✅ Created ${events.length} order events`);
      }
    }

    console.log("\n✨ Seed completed successfully!");
    console.log("\n📊 Summary:");
    console.log(`   - ${vendors.length} vendors`);
    console.log(`   - ${services.length} services`);
    console.log(`   - ${customers.length} customer`);
    console.log(`   - 3 orders with events`);
  } catch (error) {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  }
}

// Run seed
seed();
