-- Enable RLS for all tables
ALTER TABLE "service_types" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "zones" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "zone_day_assignments" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "bookings" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "blocks" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "booking_requests" ENABLE ROW LEVEL SECURITY;

-- Policies for service_types
-- Allow public read access for active services
CREATE POLICY "Allow public read access to active services" ON "service_types"
AS PERMISSIVE FOR SELECT
TO public
USING (active = true);

-- Allow admin full access
CREATE POLICY "Allow admin full access on service_types" ON "service_types"
FOR ALL
TO authenticated
USING (is_admin());

-- Policies for zones
-- Allow public read access for active zones
CREATE POLICY "Allow public read access to active zones" ON "zones"
AS PERMISSIVE FOR SELECT
TO public
USING (active = true);

-- Allow admin full access
CREATE POLICY "Allow admin full access on zones" ON "zones"
FOR ALL
TO authenticated
USING (is_admin());

-- Policies for zone_day_assignments
-- Allow public read access
CREATE POLICY "Allow public read access on zone_day_assignments" ON "zone_day_assignments"
AS PERMISSIVE FOR SELECT
TO public
USING (true);

-- Allow admin full access
CREATE POLICY "Allow admin full access on zone_day_assignments" ON "zone_day_assignments"
FOR ALL
TO authenticated
USING (is_admin());

-- Policies for bookings
-- Deny all access to bookings from public
CREATE POLICY "Deny all access to bookings" ON "bookings"
AS RESTRICTIVE FOR ALL
TO public
USING (false);

-- Allow admin full access
CREATE POLICY "Allow admin full access on bookings" ON "bookings"
FOR ALL
TO authenticated
USING (is_admin());

-- Policies for blocks
-- Deny all access to blocks from public
CREATE POLICY "Deny all access to blocks" ON "blocks"
AS RESTRICTIVE FOR ALL
TO public
USING (false);

-- Allow admin full access
CREATE POLICY "Allow admin full access on blocks" ON "blocks"
FOR ALL
TO authenticated
USING (is_admin());

-- Policies for booking_requests
-- Allow public to create booking requests
CREATE POLICY "Allow public to create booking requests" ON "booking_requests"
AS PERMISSIVE FOR INSERT
TO public
WITH CHECK (true);

-- Deny public read access
CREATE POLICY "Deny public read access on booking_requests" ON "booking_requests"
AS RESTRICTIVE FOR SELECT
TO public
USING (false);

-- Allow admin full access
CREATE POLICY "Allow admin full access on booking_requests" ON "booking_requests"
FOR ALL
TO authenticated
USING (is_admin());
