'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createMockBooking(totalAmount: number, depositAmount: number) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        throw new Error('You must be logged in to checkout.')
    }

    // Fetch the first available real listing to associate this booking with
    // so it doesn't fail foreign key UUID constraints
    const { data: anyListing } = await supabase
        .from('listings')
        .select('id')
        .limit(1)
        .single()

    const validListingId = anyListing?.id

    // Insert booking
    const { data: booking, error: bookingErr } = await supabase
        .from('bookings')
        .insert({
            user_id: user.id,
            event_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
            event_type: 'Mock Event',
            guest_count: 100,
            total_amount: totalAmount,
            deposit_amount: depositAmount,
            status: 'requested'
        })
        .select()
        .single()

    if (bookingErr) {
        console.error("Booking Error:", bookingErr)
        throw new Error("Failed to create booking: " + bookingErr.message)
    }

    // Insert booking item only if we have a valid listing UUID
    if (validListingId) {
        const { error: itemErr } = await supabase
            .from('booking_items')
            .insert({
                booking_id: booking.id,
                listing_id: validListingId,
                price_at_booking: totalAmount,
                details: { type: 'Mock Package' }
            })

        if (itemErr) {
            console.error("Booking Item Error:", itemErr)
        }
    }

    revalidatePath('/dashboard/bookings')
    return booking
}
