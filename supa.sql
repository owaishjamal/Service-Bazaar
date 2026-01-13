-- Service Bazaar: Complete Database Schema
-- Supabase SQL Migration

-- ============================================
-- ENUMS
-- ============================================

CREATE TYPE user_role AS ENUM ('customer', 'vendor', 'admin');
CREATE TYPE order_status AS ENUM (
  'placed',
  'accepted',
  'in_progress',
  'milestone_submitted',
  'revision_requested',
  'final_delivered',
  'completed',
  'disputed'
);

-- ============================================
-- TABLES
-- ============================================

-- Profiles table (extends auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role NOT NULL DEFAULT 'customer',
  full_name TEXT,
  bio TEXT,
  trust_score INTEGER DEFAULT 100 CHECK (trust_score >= 0 AND trust_score <= 100),
  skills TEXT[] DEFAULT '{}',
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Services table
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Dev', 'Design', 'QA', 'DevOps', 'UI/UX')),
  price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
  eta_days INTEGER NOT NULL CHECK (eta_days > 0),
  tech_stack TEXT[] DEFAULT '{}',
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Orders table
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  vendor_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status order_status NOT NULL DEFAULT 'placed',
  amount DECIMAL(10, 2) NOT NULL CHECK (amount >= 0),
  requirements_doc TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Order Events table (tracking timeline)
CREATE TABLE order_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  status_from order_status,
  status_to order_status NOT NULL,
  note TEXT,
  proof_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES profiles(id)
);

-- Disputes table
CREATE TABLE disputes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'resolved', 'closed')),
  resolution_note TEXT,
  created_by UUID NOT NULL REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ,
  resolved_by UUID REFERENCES profiles(id)
);

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_services_vendor ON services(vendor_id);
CREATE INDEX idx_services_category ON services(category);
CREATE INDEX idx_orders_buyer ON orders(buyer_id);
CREATE INDEX idx_orders_vendor ON orders(vendor_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_order_events_order ON order_events(order_id);
CREATE INDEX idx_disputes_order ON disputes(order_id);
CREATE INDEX idx_disputes_status ON disputes(status);

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to auto-create order event on status change
CREATE OR REPLACE FUNCTION create_order_event()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO order_events (order_id, status_from, status_to, note, created_by)
    VALUES (NEW.id, OLD.status, NEW.status, 'Status changed', NEW.vendor_id);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER order_status_change_event
  AFTER UPDATE OF status ON orders
  FOR EACH ROW
  WHEN (OLD.status IS DISTINCT FROM NEW.status)
  EXECUTE FUNCTION create_order_event();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE disputes ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view all profiles"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Services policies
CREATE POLICY "Anyone can view services"
  ON services FOR SELECT
  USING (true);

CREATE POLICY "Vendors can create their own services"
  ON services FOR INSERT
  WITH CHECK (
    auth.uid() = vendor_id AND
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'vendor')
  );

CREATE POLICY "Vendors can update their own services"
  ON services FOR UPDATE
  USING (
    vendor_id = auth.uid() AND
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'vendor')
  );

-- Orders policies
CREATE POLICY "Users can view their own orders (as buyer or vendor)"
  ON orders FOR SELECT
  USING (
    buyer_id = auth.uid() OR
    vendor_id = auth.uid() OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Customers can create orders"
  ON orders FOR INSERT
  WITH CHECK (
    buyer_id = auth.uid() AND
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'customer')
  );

CREATE POLICY "Vendors can update orders they're assigned to"
  ON orders FOR UPDATE
  USING (
    vendor_id = auth.uid() AND
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'vendor')
  );

CREATE POLICY "Admins can update any order"
  ON orders FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Order Events policies
CREATE POLICY "Users can view events for their orders"
  ON order_events FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_events.order_id
      AND (orders.buyer_id = auth.uid() OR orders.vendor_id = auth.uid())
    ) OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Vendors can create events for their orders"
  ON order_events FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_events.order_id
      AND orders.vendor_id = auth.uid()
    ) OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Disputes policies
CREATE POLICY "Users can view disputes for their orders"
  ON disputes FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = disputes.order_id
      AND (orders.buyer_id = auth.uid() OR orders.vendor_id = auth.uid())
    ) OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Users can create disputes for their orders"
  ON disputes FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = disputes.order_id
      AND (orders.buyer_id = auth.uid() OR orders.vendor_id = auth.uid())
    )
  );

CREATE POLICY "Admins can update disputes"
  ON disputes FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================
-- INITIAL DATA (Optional - for testing)
-- ============================================

-- Note: Profiles will be created via auth.users triggers in production
-- This is just for reference
