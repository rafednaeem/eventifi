-- ==========================================
-- EVENTIFI UNIFIED MARKETPLACE SCHEMA
-- ==========================================

-- 1. Create Base Listings Table
CREATE TABLE public.listings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    base_price NUMERIC(10, 2) NOT NULL,
    city_id INTEGER REFERENCES cities(id) ON DELETE SET NULL,
    address TEXT,
    type VARCHAR(50) NOT NULL CHECK (type IN ('venue', 'service')),
    category_id INTEGER, -- References either property_categories or service_categories temporarily
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    is_active BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    cover_image_url TEXT,
    gallery_urls TEXT[]
);

-- 2. Create Venue-Specific Data Table
CREATE TABLE public.listing_venues (
    listing_id UUID PRIMARY KEY REFERENCES public.listings(id) ON DELETE CASCADE,
    capacity_min INTEGER DEFAULT 0,
    capacity_max INTEGER NOT NULL,
    indoor_outdoor VARCHAR(50) CHECK (indoor_outdoor IN ('indoor', 'outdoor', 'both')),
    amenities JSONB DEFAULT '[]'::jsonb
);

-- 3. Create Service-Specific Data Table
CREATE TABLE public.listing_services (
    listing_id UUID PRIMARY KEY REFERENCES public.listings(id) ON DELETE CASCADE,
    service_area JSONB DEFAULT '[]'::jsonb, -- Array of city names or IDs where the service is available
    packages JSONB DEFAULT '[]'::jsonb -- Array of { name, price, description, includes }
);

-- 4. Unified Bookings Table (Minimal MVP Version)
CREATE TABLE public.bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    event_date DATE NOT NULL,
    event_type VARCHAR(100),
    guest_count INTEGER,
    total_amount NUMERIC(10, 2) NOT NULL,
    deposit_amount NUMERIC(10, 2) NOT NULL, -- 10-20% of total
    status VARCHAR(50) DEFAULT 'pending_deposit' CHECK (status IN ('pending_deposit', 'requested', 'approved', 'rejected', 'completed', 'cancelled'))
);

-- 5. Booking Items (Allows adding 1 Venue + N Services to a cart)
CREATE TABLE public.booking_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
    listing_id UUID REFERENCES public.listings(id) ON DELETE CASCADE,
    price_at_booking NUMERIC(10, 2) NOT NULL,
    details JSONB -- Snapshot of selected package or venue specifics
);

-- ==========================================
-- RLS POLICIES (Row Level Security)
-- ==========================================

-- Enable RLS
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listing_venues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listing_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_items ENABLE ROW LEVEL SECURITY;

-- Listings Policies
CREATE POLICY "Public profiles are viewable by everyone." 
ON public.listings FOR SELECT USING (status = 'approved' AND is_active = true);

CREATE POLICY "Users can view their own pending/rejected listings." 
ON public.listings FOR SELECT USING (auth.uid() = owner_id);

CREATE POLICY "Users can insert their own listings." 
ON public.listings FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update own listings." 
ON public.listings FOR UPDATE USING (auth.uid() = owner_id);

-- Venue/Service Policies (inherit from listing owner basically, simplified here to public read, owner write)
CREATE POLICY "Public read venues" ON public.listing_venues FOR SELECT USING (true);
CREATE POLICY "Public read services" ON public.listing_services FOR SELECT USING (true);

-- Bookings Policies
CREATE POLICY "Users can view own bookings" ON public.bookings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Owners can view bookings for their listings" ON public.bookings FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM public.booking_items bi
        JOIN public.listings l ON bi.listing_id = l.id
        WHERE bi.booking_id = public.bookings.id AND l.owner_id = auth.uid()
    )
);
CREATE POLICY "Users can create bookings" ON public.bookings FOR INSERT WITH CHECK (auth.uid() = user_id);

-- End of Migration
