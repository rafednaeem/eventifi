'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function submitInquiry(formData: FormData) {
    const supabase = await createClient()

    const property_id = formData.get('property_id') as string
    const event_date = formData.get('event_date') as string
    const guests = parseInt(formData.get('guests') as string)
    const message = formData.get('message') as string

    const { data: { user } } = await supabase.auth.getUser()

    const { error } = await supabase
        .from('inquiries')
        .insert({
            user_id: user?.id, // Optional, can be guest
            property_id,
            event_date,
            guests,
            message,
            status: 'new'
        })

    if (error) {
        return { error: error.message }
    }

    revalidatePath(`/properties/${property_id}`) // This would need the slug really
    return { success: true }
}
