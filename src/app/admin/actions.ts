'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updatePropertyStatus(id: string, status: 'approved' | 'rejected' | 'pending') {
    const supabase = await createClient()

    const { error } = await supabase
        .from('properties')
        .update({ status })
        .eq('id', id)

    if (error) throw new Error(error.message)

    revalidatePath('/admin/properties')
    revalidatePath('/properties')
}

export async function togglePropertyVerification(id: string, is_verified: boolean) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('properties')
        .update({ is_verified })
        .eq('id', id)

    if (error) throw new Error(error.message)

    revalidatePath('/admin/properties')
}

export async function togglePropertyFeatured(id: string, is_featured: boolean) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('properties')
        .update({ is_featured })
        .eq('id', id)

    if (error) throw new Error(error.message)

    revalidatePath('/admin/properties')
}

export async function updateServiceStatus(id: string, status: 'approved' | 'rejected' | 'pending') {
    const supabase = await createClient()

    const { error } = await supabase
        .from('services')
        .update({ status })
        .eq('id', id)

    if (error) throw new Error(error.message)

    revalidatePath('/admin/services')
    revalidatePath('/services')
}

export async function toggleServiceVerification(id: string, is_verified: boolean) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('services')
        .update({ is_verified })
        .eq('id', id)

    if (error) throw new Error(error.message)

    revalidatePath('/admin/services')
}

export async function toggleServiceFeatured(id: string, is_featured: boolean) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('services')
        .update({ is_featured })
        .eq('id', id)

    if (error) throw new Error(error.message)

    revalidatePath('/admin/services')
}
