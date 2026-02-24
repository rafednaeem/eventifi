import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.join(__dirname, '../.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing environment variables')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testListing(slug) {
    console.log(`\n=== Testing Slug: ${slug} ===`)
    const { data: listing, error } = await supabase
        .from('listings')
        .select(`
            *,
            cities!left (name),
            profiles!left (full_name, avatar_url, phone, email),
            listing_venues!left (*),
            listing_services!left (*)
        `)
        .eq('slug', slug)
        .single()

    if (error) {
        console.error('Error fetching listing:', error.message)
        return
    }

    if (!listing) {
        console.warn('No listing found')
        return
    }

    console.log('Title:', listing.title)
    console.log('Type:', listing.type)

    console.log('listing_venues type:', typeof listing.listing_venues)
    console.log('listing_venues isArray:', Array.isArray(listing.listing_venues))
    if (listing.listing_venues) {
        const venue = Array.isArray(listing.listing_venues) ? listing.listing_venues[0] : listing.listing_venues
        console.log('Venue Data:', venue ? 'Found' : 'Missing')
        if (venue) console.log('Capacity Max:', venue.capacity_max)
    }

    console.log('listing_services isArray:', Array.isArray(listing.listing_services))
}

const slugs = ['pc-grand-ballroom-lahore', 'spice-route-caterers']
for (const slug of slugs) {
    await testListing(slug)
}
