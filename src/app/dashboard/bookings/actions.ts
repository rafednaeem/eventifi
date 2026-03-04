'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

/** Mark an inquiry as contacted */
export async function markInquiryContacted(inquiryId: string) {
    const supabase = await createClient()
    const { error } = await supabase
        .from('inquiries')
        .update({ status: 'contacted', updated_at: new Date().toISOString() })
        .eq('id', inquiryId)
    if (error) return { success: false, error: error.message }
    revalidatePath('/dashboard/bookings')
    return { success: true }
}

/** Convert an inquiry into a formal booking */
export async function convertInquiryToBooking(
    inquiryId: string,
    listingId: string,
    totalAmount: number,
) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { success: false, error: 'Not authenticated' }

    // Fetch inquiry details
    const { data: inquiry, error: inquiryErr } = await supabase
        .from('inquiries')
        .select('*')
        .eq('id', inquiryId)
        .single()

    if (inquiryErr || !inquiry) return { success: false, error: 'Inquiry not found' }

    // Create booking
    const { data: booking, error: bookingErr } = await supabase
        .from('bookings')
        .insert({
            user_id: inquiry.user_id || null,
            event_date: inquiry.event_date,
            event_type: inquiry.event_type,
            guest_count: inquiry.guest_count,
            total_amount: totalAmount,
            deposit_amount: Math.round(totalAmount * 0.1),
            status: 'requested',
        })
        .select('id')
        .single()

    if (bookingErr || !booking) return { success: false, error: bookingErr?.message || 'Failed to create booking' }

    // Create booking item linked to the listing
    const { error: itemErr } = await supabase.from('booking_items').insert({
        booking_id: booking.id,
        listing_id: listingId,
        price_at_booking: totalAmount,
        details: {
            guest_name: inquiry.guest_name,
            guest_phone: inquiry.guest_phone,
            guest_email: inquiry.guest_email,
            message: inquiry.message,
        },
    })

    if (itemErr) return { success: false, error: itemErr.message }

    // Mark inquiry as converted
    await supabase
        .from('inquiries')
        .update({ status: 'converted', updated_at: new Date().toISOString() })
        .eq('id', inquiryId)

    revalidatePath('/dashboard/bookings')
    return { success: true, bookingId: booking.id }
}

/** Update booking status (approve / reject / complete) */
export async function updateBookingStatus(bookingId: string, status: string) {
    const supabase = await createClient()
    const { error } = await supabase
        .from('bookings')
        .update({ status })
        .eq('id', bookingId)
    if (error) return { success: false, error: error.message }
    revalidatePath('/dashboard/bookings')
    return { success: true }
}

/** Close an inquiry (no interest) */
export async function closeInquiry(inquiryId: string) {
    const supabase = await createClient()
    const { error } = await supabase
        .from('inquiries')
        .update({ status: 'closed', updated_at: new Date().toISOString() })
        .eq('id', inquiryId)
    if (error) return { success: false, error: error.message }
    revalidatePath('/dashboard/bookings')
    return { success: true }
}
