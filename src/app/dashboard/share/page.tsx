import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import SharePageClient from './share-client'

export default async function SharePage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    // Fetch user's approved listings
    const { data: listings } = await supabase
        .from('listings')
        .select('id, title, slug, type, cover_image_url, whatsapp_number')
        .eq('owner_id', user.id)
        .eq('status', 'approved')
        .order('created_at', { ascending: false })

    return <SharePageClient listings={listings || []} />
}
