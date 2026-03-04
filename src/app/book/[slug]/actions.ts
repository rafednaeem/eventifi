'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function submitInquiry(formData: FormData) {
    const supabase = await createClient()

    const listingId = formData.get('listing_id') as string
    const listingType = formData.get('listing_type') as string // 'venue' | 'service'
    const guestName = formData.get('guest_name') as string
    const guestEmail = formData.get('guest_email') as string
    const guestPhone = formData.get('guest_phone') as string
    const eventDate = formData.get('event_date') as string
    const eventType = formData.get('event_type') as string
    const guestCount = parseInt(formData.get('guest_count') as string) || null
    const message = formData.get('message') as string

    // Check if logged-in user
    const { data: { user } } = await supabase.auth.getUser()

    const insertPayload: Record<string, unknown> = {
        guest_name: guestName,
        guest_email: guestEmail,
        guest_phone: guestPhone,
        event_date: eventDate,
        event_type: eventType,
        guest_count: guestCount,
        message,
        status: 'new',
        listing_id: listingId, // Use the unified ID
    }

    if (user) {
        insertPayload.user_id = user.id
    }

    const { error } = await supabase.from('inquiries').insert(insertPayload)

    if (error) {
        return { success: false, error: error.message }
    }

    revalidatePath('/dashboard/bookings')
    return { success: true }
}
