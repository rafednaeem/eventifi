import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import InquiriesTab from './inquiries-tab'
import BookingsTab from './bookings-tab'

export default async function OwnerBookingsPage({
    searchParams,
}: {
    searchParams: Promise<{ tab?: string }>
}) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) redirect('/login')

    const { tab } = await searchParams
    const activeTab = tab === 'bookings' ? 'bookings' : 'inquiries'

    // Fetch this user's listing IDs
    const { data: listings } = await supabase
        .from('listings')
        .select('id')
        .eq('owner_id', user.id)

    const listingIds = listings?.map(l => l.id) ?? []

    // Fetch inquiries linked to any of this user's listings
    const inquiries = listingIds.length > 0
        ? (await supabase
            .from('inquiries')
            .select(`
                id, status, guest_name, guest_email, guest_phone,
                event_date, event_type, guest_count, message, created_at,
                property_id, service_id
            `)
            .or(
                `property_id.in.(${listingIds.join(',')}),service_id.in.(${listingIds.join(',')})`
            )
            .order('created_at', { ascending: false })
        ).data ?? []
        : []

    // Fetch bookings linked to any of this user's listing items
    const bookings = listingIds.length > 0
        ? (await supabase
            .from('bookings')
            .select(`
                id, status, event_date, event_type, guest_count,
                total_amount, deposit_amount, created_at,
                booking_items!inner(
                    id, price_at_booking, listing_id, details,
                    listings!inner(title, type, owner_id)
                )
            `)
            .eq('booking_items.listings.owner_id', user.id)
            .order('created_at', { ascending: false })
        ).data ?? []
        : []

    // For each inquiry, figure out which listing it belongs to
    const listingMap: Record<string, { title: string; type: string }> = {}
    if (listings) {
        const { data: listingDetails } = await supabase
            .from('listings')
            .select('id, title, type')
            .in('id', listingIds)
        listingDetails?.forEach(l => { listingMap[l.id] = { title: l.title, type: l.type } })
    }

    // Attach listing info to each inquiry
    const enrichedInquiries = inquiries.map(inq => ({
        ...inq,
        listing: inq.property_id
            ? listingMap[inq.property_id]
            : inq.service_id
                ? listingMap[inq.service_id]
                : null,
        listingId: inq.property_id || inq.service_id || null,
    }))

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">Bookings & Inquiries</h1>
                <p className="text-muted-foreground mt-2">Manage incoming customer requests for your listings.</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 bg-slate-100 rounded-xl p-1 w-fit">
                <a
                    href="/dashboard/bookings?tab=inquiries"
                    className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'inquiries'
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-500 hover:text-slate-700'
                        }`}
                >
                    Inquiries
                    {inquiries.filter(i => i.status === 'new').length > 0 && (
                        <span className="ml-2 inline-flex items-center justify-center w-5 h-5 rounded-full bg-orange-500 text-white text-xs font-black">
                            {inquiries.filter(i => i.status === 'new').length}
                        </span>
                    )}
                </a>
                <a
                    href="/dashboard/bookings?tab=bookings"
                    className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'bookings'
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-500 hover:text-slate-700'
                        }`}
                >
                    Confirmed Bookings
                    {bookings.length > 0 && (
                        <span className="ml-2 inline-flex items-center justify-center w-5 h-5 rounded-full bg-green-500 text-white text-xs font-black">
                            {bookings.length}
                        </span>
                    )}
                </a>
            </div>

            {activeTab === 'inquiries' ? (
                <InquiriesTab inquiries={enrichedInquiries} />
            ) : (
                <BookingsTab bookings={bookings as any} />
            )}
        </div>
    )
}
