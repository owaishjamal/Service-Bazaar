-- =============================================
-- COMPLETE FIX - Run this entire script
-- =============================================

-- Step 1: Create profile for your user (if it doesn't exist)
-- This uses INSERT ... ON CONFLICT to safely create or update
INSERT INTO profiles (id, role, full_name, trust_score, skills)
SELECT 
  id,
  'vendor'::user_role,
  COALESCE(raw_user_meta_data->>'name', raw_user_meta_data->>'full_name', 'User'),
  100,
  ARRAY[]::TEXT[]
FROM auth.users 
WHERE email = 'jamalowaish9@gmail.com'
ON CONFLICT (id) DO UPDATE SET 
  role = 'vendor'::user_role,
  updated_at = NOW();

-- Step 2: Fix RLS policies for services (drop old ones first)
DROP POLICY IF EXISTS "Vendors can create their own services" ON services;
DROP POLICY IF EXISTS "Users can create their own services" ON services;
CREATE POLICY "Users can create their own services"
  ON services FOR INSERT
  WITH CHECK (auth.uid() = vendor_id);

DROP POLICY IF EXISTS "Vendors can update their own services" ON services;
DROP POLICY IF EXISTS "Users can update their own services" ON services;
CREATE POLICY "Users can update their own services"
  ON services FOR UPDATE
  USING (vendor_id = auth.uid());

-- Step 3: Fix RLS policies for orders (drop old ones first)
DROP POLICY IF EXISTS "Customers can create orders" ON orders;
DROP POLICY IF EXISTS "Users can create orders" ON orders;
CREATE POLICY "Users can create orders"
  ON orders FOR INSERT
  WITH CHECK (buyer_id = auth.uid());

DROP POLICY IF EXISTS "Vendors can update orders they're assigned to" ON orders;
DROP POLICY IF EXISTS "Users can update their orders" ON orders;
CREATE POLICY "Users can update their orders"
  ON orders FOR UPDATE
  USING (vendor_id = auth.uid() OR buyer_id = auth.uid());

-- Step 4: Verify your profile was created/updated
SELECT 
  u.email, 
  p.id,
  p.role, 
  p.full_name,
  p.created_at,
  p.updated_at
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
WHERE u.email = 'jamalowaish9@gmail.com';
