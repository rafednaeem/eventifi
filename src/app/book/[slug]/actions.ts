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
    }

    if (user) {
        insertPayload.user_id = user.id
    }

    if (listingType === 'venue') {
        // Try to link to the properties table if we can find a matching property
        const { data: prop } = await supabase
            .from('properties')
            .select('id')
            .eq('id', listingId)
            .single()
        if (prop) insertPayload.property_id = prop.id
    } else if (listingType === 'service') {
        const { data: svc } = await supabase
            .from('services')
            .select('id')
            .eq('id', listingId)
            .single()
        if (svc) insertPayload.service_id = svc.id
    }

    const { error } = await supabase.from('inquiries').insert(insertPayload)

    if (error) {
        return { success: false, error: error.message }
    }

    revalidatePath('/dashboard/bookings')
    return { success: true }
}
