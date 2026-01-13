-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK(role IN ('customer', 'seller')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Services table
CREATE TABLE IF NOT EXISTS public.services (
  id TEXT PRIMARY KEY,
  seller_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  delivery_type TEXT NOT NULL CHECK(delivery_type IN ('digital', 'physical', 'hybrid')),
  base_price INTEGER NOT NULL,
  image TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Offers table
CREATE TABLE IF NOT EXISTS public.offers (
  id TEXT PRIMARY KEY,
  service_id TEXT NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
  seller_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  price INTEGER NOT NULL,
  eta_days INTEGER NOT NULL,
  revisions INTEGER NOT NULL,
  rating REAL NOT NULL DEFAULT 0,
  trust_score INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Orders table
CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY,
  offer_id TEXT NOT NULL REFERENCES public.offers(id),
  customer_id UUID NOT NULL REFERENCES public.users(id),
  seller_id UUID NOT NULL REFERENCES public.users(id),
  requirements TEXT NOT NULL,
  scope TEXT NOT NULL,
  status TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expected_at TIMESTAMPTZ NOT NULL
);

-- Order events table
CREATE TABLE IF NOT EXISTS public.order_events (
  id TEXT PRIMARY KEY,
  order_id TEXT NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  status TEXT NOT NULL,
  note TEXT,
  proof_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reviews table
CREATE TABLE IF NOT EXISTS public.reviews (
  id TEXT PRIMARY KEY,
  order_id TEXT NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK(rating >= 1 AND rating <= 5),
  text TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Disputes table
CREATE TABLE IF NOT EXISTS public.disputes (
  id TEXT PRIMARY KEY,
  order_id TEXT NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  status TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_services_seller_id ON public.services(seller_id);
CREATE INDEX IF NOT EXISTS idx_offers_service_id ON public.offers(service_id);
CREATE INDEX IF NOT EXISTS idx_offers_seller_id ON public.offers(seller_id);
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON public.orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_seller_id ON public.orders(seller_id);
CREATE INDEX IF NOT EXISTS idx_orders_offer_id ON public.orders(offer_id);
CREATE INDEX IF NOT EXISTS idx_order_events_order_id ON public.order_events(order_id);
CREATE INDEX IF NOT EXISTS idx_reviews_order_id ON public.reviews(order_id);
CREATE INDEX IF NOT EXISTS idx_disputes_order_id ON public.disputes(order_id);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.disputes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users
CREATE POLICY "Users can view their own profile"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.users FOR UPDATE
  USING (auth.uid() = id);

-- RLS Policies for services (public read, seller write)
CREATE POLICY "Anyone can view services"
  ON public.services FOR SELECT
  USING (true);

CREATE POLICY "Sellers can create their own services"
  ON public.services FOR INSERT
  WITH CHECK (auth.uid() = seller_id);

CREATE POLICY "Sellers can update their own services"
  ON public.services FOR UPDATE
  USING (auth.uid() = seller_id);

CREATE POLICY "Sellers can delete their own services"
  ON public.services FOR DELETE
  USING (auth.uid() = seller_id);

-- RLS Policies for offers (public read, seller write)
CREATE POLICY "Anyone can view offers"
  ON public.offers FOR SELECT
  USING (true);

CREATE POLICY "Sellers can create their own offers"
  ON public.offers FOR INSERT
  WITH CHECK (auth.uid() = seller_id);

CREATE POLICY "Sellers can update their own offers"
  ON public.offers FOR UPDATE
  USING (auth.uid() = seller_id);

-- RLS Policies for orders
CREATE POLICY "Users can view their own orders"
  ON public.orders FOR SELECT
  USING (auth.uid() = customer_id OR auth.uid() = seller_id);

CREATE POLICY "Customers can create orders"
  ON public.orders FOR INSERT
  WITH CHECK (auth.uid() = customer_id);

CREATE POLICY "Sellers can update their own orders"
  ON public.orders FOR UPDATE
  USING (auth.uid() = seller_id);

-- RLS Policies for order_events
CREATE POLICY "Users can view events for their orders"
  ON public.order_events FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_events.order_id
      AND (orders.customer_id = auth.uid() OR orders.seller_id = auth.uid())
    )
  );

CREATE POLICY "Users can create events for their orders"
  ON public.order_events FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_events.order_id
      AND (orders.customer_id = auth.uid() OR orders.seller_id = auth.uid())
    )
  );

-- RLS Policies for reviews
CREATE POLICY "Anyone can view reviews"
  ON public.reviews FOR SELECT
  USING (true);

CREATE POLICY "Customers can create reviews for their orders"
  ON public.reviews FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = reviews.order_id
      AND orders.customer_id = auth.uid()
    )
  );

-- RLS Policies for disputes
CREATE POLICY "Users can view disputes for their orders"
  ON public.disputes FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = disputes.order_id
      AND (orders.customer_id = auth.uid() OR orders.seller_id = auth.uid())
    )
  );

CREATE POLICY "Customers can create disputes for their orders"
  ON public.disputes FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = disputes.order_id
      AND orders.customer_id = auth.uid()
    )
  );

-- Function to automatically create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', 'User'),
    COALESCE(NEW.raw_user_meta_data->>'role', 'customer')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create user profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


