'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

interface CsvRow {
    title: string
    description?: string
    base_price: string
    city: string
    address?: string
    type: string
    whatsapp_number?: string
    phone_number?: string
}

function generateSlug(title: string) {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-')
        .slice(0, 80) + '-' + Math.random().toString(36).slice(2, 7)
}

export async function importListingsFromCsv(rows: CsvRow[]) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { success: false, error: 'Not authenticated', count: 0 }

    // Resolve city names to IDs
    const { data: cities } = await supabase.from('cities').select('id, name')
    const cityMap: Record<string, number> = {}
    cities?.forEach(c => { cityMap[c.name.toLowerCase()] = c.id })

    const toInsert = rows
        .filter(row => row.title && row.type && (row.type === 'venue' || row.type === 'service'))
        .map(row => ({
            owner_id: user.id,
            title: row.title.trim(),
            slug: generateSlug(row.title),
            description: row.description?.trim() || null,
            base_price: parseFloat(row.base_price) || 0,
            type: row.type as 'venue' | 'service',
            city_id: cityMap[row.city?.toLowerCase()] || null,
            address: row.address?.trim() || null,
            whatsapp_number: row.whatsapp_number?.trim() || null,
            phone_number: row.phone_number?.trim() || null,
            status: 'pending',
            is_active: true,
        }))

    if (toInsert.length === 0) {
        return { success: false, error: 'No valid rows to import. Make sure "type" is "venue" or "service".', count: 0 }
    }

    const { error } = await supabase.from('listings').insert(toInsert)
    if (error) return { success: false, error: error.message, count: 0 }

    revalidatePath('/dashboard/listings')
    revalidatePath('/dashboard/import')
    return { success: true, count: toInsert.length }
}
