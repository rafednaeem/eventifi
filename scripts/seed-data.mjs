import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Load environment variables from .env.local
const envFile = fs.readFileSync('.env.local', 'utf8');
const env = Object.fromEntries(
    envFile.split('\n')
        .filter(line => line.includes('='))
        .map(line => line.split('=').map(part => part.trim()))
);

const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error("Missing Supabase credentials in .env.local");
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

async function seed() {
    console.log("🚀 Starting Seeding Process...");

    // 1. Create/Get Dummy Owner
    console.log("👤 Setting up Dummy Owner...");
    const dummyEmail = 'admin@eventifi.com';

    const { data: userList, error: listError } = await supabase.auth.admin.listUsers();
    if (listError) {
        console.error("❌ Error listing users:", listError.message);
        return;
    }

    let ownerId = userList.users.find(u => u.email === dummyEmail)?.id;

    if (!ownerId) {
        console.log("➕ Creating new Admin user...");
        const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
            email: dummyEmail,
            password: 'password123',
            email_confirm: true,
            user_metadata: { full_name: 'EventiFi Admin', role: 'admin' }
        });

        if (authError) {
            console.error("❌ Error creating auth user:", authError.message);
            return;
        }
        ownerId = authUser.user.id;
    } else {
        console.log("ℹ️ Admin user already exists.");
    }

    console.log("👤 Using Owner ID:", ownerId);

    // Ensure profile exists
    const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
            id: ownerId,
            full_name: 'EventiFi Admin',
            email: dummyEmail,
            role: 'admin'
        });

    if (profileError) console.error("❌ Profile Error:", profileError.message);

    // 2. Fetch City and Category IDs
    const { data: cities } = await supabase.from('cities').select('*');
    const { data: propCats } = await supabase.from('property_categories').select('*');
    const { data: servCats } = await supabase.from('service_categories').select('*');

    const getCity = (name) => cities.find(c => c.name === name)?.id || cities[0].id;
    const getPropCat = (slug) => propCats.find(c => c.slug === slug)?.id || propCats[0].id;
    const getServCat = (slug) => servCats.find(c => c.slug === slug)?.id || servCats[0].id;

    // 3. Define Dummy Listings
    const dummyListings = [
        // --- VENUES ---
        {
            title: "Pearl Continental Grand Ballroom",
            type: "venue",
            slug: "pc-grand-ballroom-lahore",
            description: "An elegant and prestigious ballroom in Lahore's finest hotel. Ideal for high-end weddings, corporate galas, and international conferences.",
            base_price: 500000,
            city_id: getCity('Lahore'),
            address: "Shahrah-e-Quaid-e-Azam, Lahore",
            category_id: getPropCat('conference-banquet-halls'),
            cover_image_url: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=2000&auto=format&fit=crop",
            website_url: "https://www.pchotels.com/pclahore",
            phone_number: "+92 42 111 505 505",
            whatsapp_number: "+92 300 1234567",
            instagram_url: "https://instagram.com/pclahore",
            facebook_url: "https://facebook.com/pclahore",
            venue_details: {
                capacity_min: 300,
                capacity_max: 2000,
                indoor_outdoor: "indoor"
            }
        },
        {
            title: "Oakwood Retreat Murree",
            type: "venue",
            slug: "oakwood-retreat-murree",
            description: "A cozy and scenic holiday home nestled in the hills of Murree. Perfect for family getaways, intimate parties, and peaceful retreats.",
            base_price: 35000,
            city_id: getCity('Islamabad'),
            address: "Bhurban, Murree",
            category_id: getPropCat('private-villas'),
            cover_image_url: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2000&auto=format&fit=crop",
            website_url: "https://oakwoodretreat.com",
            phone_number: "+92 333 5556677",
            venue_details: {
                capacity_min: 5,
                capacity_max: 20,
                indoor_outdoor: "both"
            }
        },
        {
            title: "Turtle Bay Villa",
            type: "venue",
            slug: "turtle-bay-villa-karachi",
            description: "Exclusive beach house at Hawkesbay. Private access to the shore, modern amenities, and a spacious deck for sun-downer parties.",
            base_price: 65000,
            city_id: getCity('Karachi'),
            address: "Hawkesbay Beach, Karachi",
            category_id: getPropCat('beach-houses'),
            cover_image_url: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?q=80&w=2000&auto=format&fit=crop",
            phone_number: "+92 321 9988776",
            instagram_url: "https://instagram.com/turtlebaykarachi",
            venue_details: {
                capacity_min: 20,
                capacity_max: 100,
                indoor_outdoor: "both"
            }
        },
        {
            title: "Elite Sports Arena",
            type: "venue",
            slug: "elite-sports-arena-islamabad",
            description: "State-of-the-art sports complex with indoor courts and outdoor fields. Available for tournaments, fitness events, and sports-themed birthdays.",
            base_price: 15000,
            city_id: getCity('Islamabad'),
            address: "F-6, Islamabad",
            category_id: getPropCat('sports-courts'),
            cover_image_url: "https://images.unsplash.com/photo-1541252260730-0412e3e2108b?q=80&w=2000&auto=format&fit=crop",
            website_url: "https://elitesports.pk",
            phone_number: "+92 51 2223344",
            venue_details: {
                capacity_min: 10,
                capacity_max: 200,
                indoor_outdoor: "both"
            }
        },
        {
            title: "Green Valley Farm",
            type: "venue",
            slug: "green-valley-farm-lahore",
            description: "Expansive green lawns perfect for large-scale outdoor events, festivals, and traditional 'mehndi' functions.",
            base_price: 120000,
            city_id: getCity('Lahore'),
            address: "Bedian Road, Lahore",
            category_id: getPropCat('fields-lawns'),
            cover_image_url: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2000&auto=format&fit=crop",
            phone_number: "+92 300 8889900",
            facebook_url: "https://facebook.com/greenvalleyfarm",
            venue_details: {
                capacity_min: 500,
                capacity_max: 5000,
                indoor_outdoor: "outdoor"
            }
        },
        {
            title: "Pixel Perfect Studio",
            type: "venue",
            slug: "pixel-perfect-studio-karachi",
            description: "Professional photography and film studio with multi-purpose sets, high-end lighting, and equipment rentals.",
            base_price: 25000,
            city_id: getCity('Karachi'),
            address: "DHA Phase 6, Karachi",
            category_id: getPropCat('photography-studios'),
            cover_image_url: "https://images.unsplash.com/photo-1598449334855-00120ee12a7a?q=80&w=2000&auto=format&fit=crop",
            website_url: "https://pixelperfect.studio",
            phone_number: "+92 345 1122334",
            venue_details: {
                capacity_min: 5,
                capacity_max: 30,
                indoor_outdoor: "indoor"
            }
        },
        // --- SERVICES ---
        {
            title: "Spice Route Caterers",
            type: "service",
            slug: "spice-route-caterers",
            description: "Premium catering service offering a fusion of traditional Mughlai and modern Continental cuisines.",
            base_price: 1500,
            city_id: getCity('Lahore'),
            address: "Gulberg, Lahore",
            category_id: getServCat('catering'),
            cover_image_url: "https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=2000&auto=format&fit=crop",
            website_url: "https://spiceroute.pk",
            phone_number: "+92 312 4455667",
            instagram_url: "https://instagram.com/spiceroutecatering",
            service_details: {
                service_area: ["Lahore", "Islamabad", "Faisalabad"],
                packages: JSON.stringify([
                    { name: "Executive Menu", price: 1500, description: "Per person breakfast/lunch menu" },
                    { name: "Royal Dinner", price: 3500, description: "Per person full course dinner" }
                ])
            }
        },
        {
            title: "Glamour Glow Salon",
            type: "service",
            slug: "glamour-glow-bridal-styling",
            description: "Exquisite bridal makeup and hairstyling services. We bring the luxury salon experience to your doorstep.",
            base_price: 25000,
            city_id: getCity('Karachi'),
            address: "DHA Phase 5, Karachi",
            category_id: getServCat('beauty-styling'),
            cover_image_url: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=2000&auto=format&fit=crop",
            phone_number: "+92 331 7766554",
            instagram_url: "https://instagram.com/glamourglow",
            service_details: {
                service_area: ["Karachi"],
                packages: JSON.stringify([
                    { name: "Party Makeup", price: 25000, description: "Includes hair and subtle glam" },
                    { name: "Bridal Suite", price: 150000, description: "Full day styling and retouches" }
                ])
            }
        },
        {
            title: "SwiftEvent Transports",
            type: "service",
            slug: "swiftevent-transports",
            description: "Luxury car rentals and logistical support for event guests and VIPs.",
            base_price: 15000,
            city_id: getCity('Islamabad'),
            address: "Blue Area, Islamabad",
            category_id: getServCat('logistics'),
            cover_image_url: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=2000&auto=format&fit=crop",
            phone_number: "+92 51 8877665",
            service_details: {
                service_area: ["Islamabad", "Rawalpindi"],
                packages: JSON.stringify([
                    { name: "Standard Sedan", price: 15000, description: "8 hours with driver" },
                    { name: "Luxury SUV", price: 45000, description: "Perfect for VIP arrivals" }
                ])
            }
        },
        {
            title: "Vibe Masters Entertainment",
            type: "service",
            slug: "vibe-masters-djs",
            description: "Professional DJ services, live bands, and sound systems to keep your event alive and energetic.",
            base_price: 35000,
            city_id: getCity('Lahore'),
            address: "DHA Phase 4, Lahore",
            category_id: getServCat('entertainment'),
            cover_image_url: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=2000&auto=format&fit=crop",
            instagram_url: "https://instagram.com/vibemasters",
            phone_number: "+92 300 4455667",
            service_details: {
                service_area: ["Lahore", "Karachi"],
                packages: JSON.stringify([
                    { name: "DJ Basic", price: 35000, description: "Standard sound + lighting" },
                    { name: "Full Concert", price: 250000, description: "Stage, line array, and live performance" }
                ])
            }
        },
        {
            title: "Epic Frames Studio",
            type: "service",
            slug: "epic-frames-photography",
            description: "Storytelling through visuals. We specialize in weddings, corporate documentaries, and creative fashion shoots.",
            base_price: 50000,
            city_id: getCity('Islamabad'),
            address: "E-11, Islamabad",
            category_id: getServCat('photography-videography'),
            cover_image_url: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=2000&auto=format&fit=crop",
            website_url: "https://epicframes.pk",
            phone_number: "+92 333 1112233",
            instagram_url: "https://instagram.com/epicframes",
            service_details: {
                service_area: ["Nationwide"],
                packages: JSON.stringify([
                    { name: "Classic Shoot", price: 50000, description: "Soft copy + Album" },
                    { name: "Cinematic Film", price: 120000, description: "Full event coverage with drone" }
                ])
            }
        },
        {
            title: "Elegant Decorators",
            type: "service",
            slug: "elegant-decorators-karachi",
            description: "Floral arrangements, theme-based stages, and complete venue transformations.",
            base_price: 100000,
            city_id: getCity('Karachi'),
            address: "Tariq Road, Karachi",
            category_id: getServCat('decor-rentals'),
            cover_image_url: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=2000&auto=format&fit=crop",
            phone_number: "+92 321 4455778",
            facebook_url: "https://facebook.com/elegantdecorators",
            service_details: {
                service_area: ["Karachi", "Hyderabad"],
                packages: JSON.stringify([
                    { name: "Floral Decor", price: 100000, description: "Stage and entrance" },
                    { name: "Grand Theme", price: 500000, description: "Complete venue thematic redesign" }
                ])
            }
        },
        {
            title: "Dream Wedding Planners",
            type: "service",
            slug: "dream-weddings-lahore",
            description: "End-to-end event management. We handle everything while you enjoy your big day.",
            base_price: 75000,
            city_id: getCity('Lahore'),
            address: "Johar Town, Lahore",
            category_id: getServCat('event-planning'),
            cover_image_url: "https://images.unsplash.com/photo-1519222970733-f746152fe63b?q=80&w=2000&auto=format&fit=crop",
            website_url: "https://dreamweddings.pk",
            phone_number: "+92 315 6677889",
            service_details: {
                service_area: ["Lahore", "Islamabad", "Multan"],
                packages: JSON.stringify([
                    { name: "Wedding Day Coordination", price: 75000, description: "Support on the main day" },
                    { name: "Full Planning Package", price: 300000, description: "From venue selection to honeymoon coordination" }
                ])
            }
        },
        {
            title: "Pro Guard Security Services",
            type: "service",
            slug: "pro-guard-security",
            description: "Trained security personnel for private events, crowded venues, and VIP protection.",
            base_price: 20000,
            city_id: getCity('Karachi'),
            address: "Nazimabad, Karachi",
            category_id: getServCat('support-services'),
            cover_image_url: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=2000&auto=format&fit=crop",
            phone_number: "+92 301 2233445",
            service_details: {
                service_area: ["Karachi"],
                packages: JSON.stringify([
                    { name: "Standard Guard Team", price: 20000, description: "4 Guards for 6 hours" },
                    { name: "Bouncer Squad", price: 50000, description: "Includes VIP close protection" }
                ])
            }
        },
        {
            title: "Welcome Hospitality Staff",
            type: "service",
            slug: "welcome-hospitality-staff",
            description: "Professional waitstaff, hostesses, and guest relations managers for high-profile events.",
            base_price: 15000,
            city_id: getCity('Islamabad'),
            address: "G-10, Islamabad",
            category_id: getServCat('guest-services'),
            cover_image_url: "https://images.unsplash.com/photo-1531050171669-05a8b0ccb0d6?q=80&w=2000&auto=format&fit=crop",
            phone_number: "+92 51 4433221",
            service_details: {
                service_area: ["Islamabad", "Faisalabad"],
                packages: JSON.stringify([
                    { name: "Waitstaff Team", price: 15000, description: "Team of 5 for 4 hours" },
                    { name: "Guest Experience Team", price: 40000, description: "Hostesses and managers" }
                ])
            }
        }
    ];

    console.log("📝 Inserting Listings...");

    for (const item of dummyListings) {
        const { venue_details, service_details, ...listingData } = item;

        // 1. Unified Listings Table
        const { data: listing, error: lErr } = await supabase
            .from('listings')
            .upsert({
                ...listingData,
                owner_id: ownerId,
                status: 'approved',
                is_active: true
            }, { onConflict: 'slug' })
            .select()
            .single();

        if (lErr) {
            console.error(`❌ Error inserting listing ${item.title}:`, lErr.message);
            continue;
        }

        // 2. Sub-tables (Venues/Services)
        if (item.type === 'venue') {
            await supabase.from('listing_venues').upsert({
                listing_id: listing.id,
                ...venue_details
            });

            // SYNC TO LEGACY PROPERTIES TABLE
            await supabase.from('properties').upsert({
                owner_id: ownerId,
                category_id: item.category_id,
                name: item.title,
                slug: item.slug,
                description: item.description,
                city_id: item.city_id,
                address: item.address,
                capacity_min: venue_details.capacity_min,
                capacity_max: venue_details.capacity_max,
                price_min: item.base_price,
                cover_image_url: item.cover_image_url,
                status: 'approved',
                is_active: true,
                is_verified: true
            }, { onConflict: 'slug' });

        } else {
            await supabase.from('listing_services').upsert({
                listing_id: listing.id,
                ...service_details
            });

            // SYNC TO LEGACY SERVICES TABLE
            await supabase.from('services').upsert({
                provider_id: ownerId,
                category_id: item.category_id,
                name: item.title,
                slug: item.slug,
                description: item.description,
                city_id: item.city_id,
                price_min: item.base_price,
                cover_image_url: item.cover_image_url,
                status: 'approved',
                is_active: true,
                is_verified: true
            }, { onConflict: 'slug' });
        }

        console.log(`✅ Inserted/Updated & Synced: ${item.title}`);
    }

    console.log("\n✨ Seeding Complete!");
}

seed();
