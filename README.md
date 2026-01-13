<p align="center">
  <img src="https://img.shields.io/badge/StackHack-3.0-cyan?style=for-the-badge&logo=hack-the-box&logoColor=white" alt="StackHack 3.0"/>
  <img src="https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js 15"/>
  <img src="https://img.shields.io/badge/Supabase-Database-green?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase"/>
  <img src="https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"/>
</p>

<h1 align="center">🚀 Service Bazaar</h1>

<p align="center">
  <strong>Track Your Tech Services Like a FedEx Package</strong>
</p>

<p align="center">
  A premium marketplace for technical services with logistics-style tracking system.
  <br/>
  Built for <strong>StackHack 3.0</strong> - Mercer | Mettl's Full-Stack Coding Hackathon
</p>

<p align="center">
  <a href="#-features">Features</a> •
  <a href="#-demo">Demo</a> •
  <a href="#%EF%B8%8F-tech-stack">Tech Stack</a> •
  <a href="#-installation">Installation</a> •
  <a href="#-architecture">Architecture</a>
</p>

---

## 🎯 Problem Statement

Freelance marketplaces lack transparency in service delivery. Customers often face:
- **No visibility** into work progress
- **Unclear timelines** and milestones
- **Disputes** due to miscommunication
- **Trust issues** with new vendors

## 💡 Our Solution

**Service Bazaar** brings **logistics-style tracking** to technical services:

- 📦 **Track like FedEx** - Real-time status updates at every milestone
- 🔐 **Escrow payments** - Pay only when satisfied
- 📊 **Trust scores** - Data-driven vendor ratings
- 🤖 **AI-powered** - Smart scope generation from natural language

---

## ✨ Features

### 🎨 Core Features

| Feature | Description |
|---------|-------------|
| **Logistics Tracking** | State machine-based order tracking with proof attachments |
| **Dual Roles** | Same user can be both Customer and Vendor |
| **Smart Checkout** | AI generates scope of work from plain English |
| **Real-time Updates** | Supabase Realtime for instant status changes |
| **Trust System** | Vendor trust scores based on delivery history |

### 🚀 WOW Features (19 Total!)

<details>
<summary><strong>Click to expand all features</strong></summary>

#### Navigation & Search
1. **⌘K Command Palette** - Navigate anywhere instantly (like Linear/Notion)
2. **🎙️ Voice Search** - Search by speaking (Web Speech API)
3. **🔍 Smart Search** - Fuzzy search with suggestions

#### Visual Effects
4. **🎊 Confetti Celebrations** - On successful order placement
5. **✨ Particle Background** - Interactive mouse-following particles
6. **🎴 3D Tilt Cards** - Cards tilt towards cursor on hover
7. **📊 Animated Counters** - Numbers animate when scrolling into view
8. **⌨️ Typewriter Text** - Auto-typing effect on landing page
9. **✨ Gradient Borders** - Animated gradient card borders

#### User Experience
10. **📊 Scroll Progress** - Progress bar + circular back-to-top
11. **🎯 Onboarding Tour** - Interactive step-by-step guide
12. **📡 Live Activity Feed** - Real-time activity notifications
13. **🔔 Toast Notifications** - Beautiful alert system
14. **🔘 Floating Action Button** - Quick access menu

#### Components
15. **💀 Skeleton Loading** - Beautiful loading placeholders
16. **📋 Copy to Clipboard** - With success animation
17. **⏱️ Countdown Timer** - For delivery estimates
18. **⭐ Star Rating** - Interactive with animations
19. **🔄 Progress Ring** - Circular progress indicator

</details>

### 🌗 Theme Support

- **Light Mode** - Clean, professional look
- **Dark Mode** - Easy on the eyes
- **System Preference** - Auto-detects your preference

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **Icons:** Lucide React
- **Animations:** CSS Keyframes + Custom Hooks

### Backend
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth
- **Real-time:** Supabase Realtime
- **API:** Next.js Route Handlers

### Architecture
- **Pattern:** Feature-based folder structure
- **State:** React Server Components + Client State
- **Validation:** Zod schemas
- **Security:** Row Level Security (RLS)

---

## 📸 Screenshots

<table>
<tr>
<td width="50%">

### 🏠 Landing Page
- Particle background
- Animated stats
- Typewriter effect
- 3D tilt cards

</td>
<td width="50%">

### 🛒 Marketplace
- Filter by category
- Compare services
- Voice search
- Smart sorting

</td>
</tr>
<tr>
<td width="50%">

### 📊 Vendor Dashboard
- Animated statistics
- Service management
- Order tracking
- Revenue analytics

</td>
<td width="50%">

### 📦 Order Tracking
- Timeline view
- Status updates
- Proof attachments
- Chat system

</td>
</tr>
</table>

---

## 🚀 Installation

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account

### Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/owaish-jamal/service-bazaar.git
cd service-bazaar

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# Edit .env.local with your Supabase credentials

# 4. Run the development server
npm run dev

# 5. Open http://localhost:3000
```

### Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Database Setup

Run the SQL schema in your Supabase SQL Editor:

```bash
# The schema is in supa.sql
# Copy and run it in Supabase Dashboard > SQL Editor
```

---

## 📁 Project Structure

```
service-bazaar/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   │   ├── auth/          # Authentication endpoints
│   │   ├── orders/        # Order management
│   │   ├── services/      # Service CRUD
│   │   └── vendor/        # Vendor-specific APIs
│   ├── checkout/          # Checkout flow
│   ├── dashboard/         # User dashboard
│   ├── login/             # Authentication
│   ├── marketplace/       # Service browsing
│   ├── orders/            # Order tracking
│   ├── register/          # User registration
│   ├── service/           # Service details
│   └── vendor/            # Vendor dashboard
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── AIRequirementsGenerator.tsx
│   ├── AnimatedCounter.tsx
│   ├── CommandPalette.tsx
│   ├── Confetti.tsx
│   ├── CountdownTimer.tsx
│   ├── FloatingActionButton.tsx
│   ├── GradientBorderCard.tsx
│   ├── LiveActivityFeed.tsx
│   ├── OnboardingTour.tsx
│   ├── ParticleBackground.tsx
│   ├── ProgressRing.tsx
│   ├── ScrollProgress.tsx
│   ├── ServiceCard.tsx
│   ├── Skeleton.tsx
│   ├── StarRating.tsx
│   ├── ThemeToggle.tsx
│   ├── TiltCard.tsx
│   ├── Toast.tsx
│   ├── TrackingTimeline.tsx
│   ├── TypewriterText.tsx
│   └── VoiceSearch.tsx
├── lib/                   # Utility functions
│   ├── auth.ts           # Authentication helpers
│   ├── db.ts             # Database utilities
│   ├── supabase.ts       # Supabase client
│   └── utils.ts          # General utilities
└── supabase/             # Database schema
    └── migrations/       # SQL migrations
```

---

## 🔐 Database Schema

```sql
-- Core Tables
profiles       -- User profiles with roles
services       -- Service listings
orders         -- Order records
order_events   -- Tracking events
disputes       -- Dispute management

-- Enums
user_role      -- customer, vendor, admin
order_status   -- placed, accepted, in_progress, 
               -- milestone_submitted, revision_requested,
               -- final_delivered, completed, disputed
```

---

## 🎮 How to Use

### As a Customer

1. **Sign Up** → Choose "Customer" role
2. **Browse** → Explore marketplace
3. **Order** → Select service, describe requirements
4. **Track** → Watch real-time progress updates
5. **Review** → Rate and review the service

### As a Vendor

1. **Sign Up** → Choose "Vendor" role
2. **Dashboard** → Access vendor dashboard
3. **Upload** → Create new services
4. **Manage** → Accept and fulfill orders
5. **Deliver** → Submit milestones with proofs

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `⌘K` / `Ctrl+K` | Open command palette |
| `↑` `↓` | Navigate in palette |
| `Enter` | Select item |
| `Esc` | Close dialogs |

---

## 🏆 Hackathon Information

<table>
<tr>
<td>

### StackHack 3.0

**Mercer | Mettl's Full-Stack Coding Hackathon**

> "Unleash your full-stack prowess and code your way to glory!"

</td>
<td>

### Built By

**Owaish Jamal**

- Full-Stack Development
- UI/UX Design
- System Architecture

</td>
</tr>
</table>

---

## 🤝 Contributing

This project was built for StackHack 3.0. Feel free to fork and improve!

```bash
# Fork the repo
# Create your feature branch
git checkout -b feature/AmazingFeature

# Commit your changes
git commit -m 'Add some AmazingFeature'

# Push to the branch
git push origin feature/AmazingFeature

# Open a Pull Request
```

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<p align="center">
  <strong>Built with ❤️ for StackHack 3.0</strong>
  <br/>
  <sub>© 2026 Owaish Jamal</sub>
</p>

<p align="center">
  <a href="#-service-bazaar">Back to top ↑</a>
</p>
