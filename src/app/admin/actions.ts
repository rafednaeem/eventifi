'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateListingStatus(id: string, status: 'approved' | 'rejected' | 'pending') {
    const supabase = await createClient()

    const { error } = await supabase
        .from('listings')
        .update({ status })
        .eq('id', id)

    if (error) throw new Error(error.message)

    revalidatePath('/admin/listings')
    revalidatePath('/listing')
}

export async function toggleListingVerification(id: string, is_verified: boolean) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('listings')
        .update({ is_verified })
        .eq('id', id)

    if (error) throw new Error(error.message)

    revalidatePath('/admin/listings')
}

export async function toggleListingFeatured(id: string, is_featured: boolean) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('listings')
        .update({ is_featured })
        .eq('id', id)

    if (error) throw new Error(error.message)

    revalidatePath('/admin/listings')
}

export async function deleteListing(id: string) {
    const supabase = await createClient()

    // Delete listing (cascades should handle sub-tables)
    const { error } = await supabase
        .from('listings')
        .delete()
        .eq('id', id)

    if (error) throw new Error(error.message)

    revalidatePath('/admin/listings')
}

export async function upsertListing(data: any) {
    const supabase = await createClient()
    const { venue_details, service_details, ...listingData } = data

    // 1. Get current user (admin)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    // 2. Upsert high-level listing
    const { data: listing, error: lErr } = await supabase
        .from('listings')
        .upsert({
            ...listingData,
            owner_id: user.id,
            status: listingData.status || 'approved',
            is_active: true
        })
        .select()
        .single()

    if (lErr) throw new Error(`Listing error: ${lErr.message}`)

    // 3. Upsert sub-table data
    if (listing.type === 'venue' && venue_details) {
        const { error: vErr } = await supabase
            .from('listing_venues')
            .upsert({
                listing_id: listing.id,
                ...venue_details
            })
        if (vErr) throw new Error(`Venue error: ${vErr.message}`)

        // SYNC TO LEGACY
        await supabase.from('properties').upsert({
            owner_id: user.id,
            category_id: listingData.category_id,
            name: listingData.title,
            slug: listingData.slug,
            description: listingData.description,
            city_id: listingData.city_id,
            address: listingData.address,
            capacity_min: venue_details.capacity_min,
            capacity_max: venue_details.capacity_max,
            price_min: listingData.base_price,
            cover_image_url: listingData.cover_image_url,
            status: listingData.status || 'approved',
            is_active: true,
            is_verified: true
        }, { onConflict: 'slug' })

    } else if (listing.type === 'service' && service_details) {
        const { error: sErr } = await supabase
            .from('listing_services')
            .upsert({
                listing_id: listing.id,
                ...service_details
            })
        if (sErr) throw new Error(`Service error: ${sErr.message}`)

        // SYNC TO LEGACY
        await supabase.from('services').upsert({
            provider_id: user.id,
            category_id: listingData.category_id,
            name: listingData.title,
            slug: listingData.slug,
            description: listingData.description,
            city_id: listingData.city_id,
            price_min: listingData.base_price,
            cover_image_url: listingData.cover_image_url,
            status: listingData.status || 'approved',
            is_active: true,
            is_verified: true
        }, { onConflict: 'slug' })
    }

    revalidatePath('/admin/listings')
    revalidatePath('/listing')
    return listing
}
