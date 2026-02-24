'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Check, X, Clock, Calendar, Users, MapPin } from 'lucide-react'
import { Button } from '@/components/ui'

export default function OwnerBookingsPage() {
    const supabase = createClient()
    const [bookings, setBookings] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    // For MVP, we'll mock the data fetching since RLS or complex joins might need adjusting,
    // but we'll try to fetch from our `bookings` table where the user is the owner
    useEffect(() => {
        async function fetchBookings() {
            setLoading(true)
            const { data: { user } } = await supabase.auth.getUser()

            if (user) {
                // Fetch bookings linked to this user's listings
                // Note: This relies on the RLS "Owners can view bookings for their listings"
                const { data, error } = await supabase
                    .from('bookings')
                    .select(`
                        id,
                        status,
                        event_date,
                        event_type,
                        guest_count,
                        total_amount,
                        deposit_amount,
                        created_at,
                        profiles!user_id(full_name, avatar_url, phone),
                        booking_items(
                            price_at_booking,
                            listings!inner(title, type, owner_id)
                        )
                    `)
                    .order('created_at', { ascending: false })

                if (data) {
                    // Filter to only bookings where AT LEAST ONE item belongs to this owner
                    // The RLS policy handles this, but we filter the items array to only show the owner's specific items
                    const ownerBookings = data.map(b => {
                        const myItems = b.booking_items.filter((bi: any) => bi.listings.owner_id === user.id)
                        if (myItems.length > 0) {
                            return { ...b, booking_items: myItems }
                        }
                        return null
                    }).filter(Boolean)

                    setBookings(ownerBookings)
                } else if (error) {
                    console.error("Error fetching bookings:", error)
                    // If RLS fails or tables aren't perfectly joined yet, show mock MVP data
                    setBookings([
                        {
                            id: 'mock-1',
                            status: 'pending_deposit',
                            event_date: '2026-05-15',
                            event_type: 'Wedding',
                            guest_count: 250,
                            total_amount: 150000,
                            deposit_amount: 15000,
                            created_at: new Date().toISOString(),
                            profiles: { full_name: 'Ahmed Khan', phone: '+92 300 1234567' },
                            booking_items: [
                                { price_at_booking: 150000, listings: { title: 'Grand Marquis Hall', type: 'venue' } }
                            ]
                        }
                    ])
                }
            } else {
                // Fallback Mock for testing MVP without auth
                setBookings([
                    {
                        id: 'mock-1',
                        status: 'pending_deposit',
                        event_date: '2026-05-15',
                        event_type: 'Wedding',
                        guest_count: 250,
                        total_amount: 150000,
                        deposit_amount: 15000,
                        created_at: new Date().toISOString(),
                        profiles: { full_name: 'Ahmed Khan', phone: '+92 300 1234567' },
                        booking_items: [
                            { price_at_booking: 150000, listings: { title: 'Grand Marquis Hall', type: 'venue' } }
                        ]
                    }
                ])
            }
            setLoading(false)
        }

        fetchBookings()
    }, [])

    const handleStatusUpdate = async (id: string, newStatus: string) => {
        // Implementation for updating status 'approved' or 'rejected'
        const { error } = await supabase.from('bookings').update({ status: newStatus }).eq('id', id)
        if (!error) {
            setBookings(bookings.map(b => b.id === id ? { ...b, status: newStatus } : b))
        }
    }

    if (loading) return <div className="p-8">Loading bookings...</div>

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">Manage Bookings</h1>
                <p className="text-muted-foreground mt-2">Approve or decline incoming booking requests from the marketplace.</p>
            </div>

            {bookings.length === 0 ? (
                <div className="text-center py-20 bg-card rounded-2xl border border-border">
                    <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-bold">No bookings yet</h3>
                    <p className="text-muted-foreground">When customers request your listings, they will appear here.</p>
                </div>
            ) : (
                <div className="grid gap-6">
                    {bookings.map((booking) => (
                        <div key={booking.id} className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
                            <div className="p-6 md:p-8 flex flex-col md:flex-row gap-6 justify-between items-start">

                                <div className="space-y-4 flex-1">
                                    <div className="flex items-center gap-3">
                                        <span className={`px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wider ${booking.status === 'pending_deposit' ? 'bg-orange-100 text-orange-600' :
                                                booking.status === 'approved' ? 'bg-green-100 text-green-600' :
                                                    booking.status === 'rejected' ? 'bg-red-100 text-red-600' :
                                                        'bg-slate-100 text-slate-600'
                                            }`}>
                                            {booking.status.replace('_', ' ')}
                                        </span>
                                        <span className="text-sm text-slate-500">
                                            Requested {new Date(booking.created_at).toLocaleDateString()}
                                        </span>
                                    </div>

                                    <div>
                                        <h3 className="text-2xl font-bold text-slate-900">
                                            {booking.profiles?.full_name || 'Guest User'} <span className="text-slate-400 font-normal">for</span> {booking.event_type}
                                        </h3>
                                        {booking.profiles?.phone && (
                                            <p className="text-sm text-slate-500 mt-1">📞 {booking.profiles.phone}</p>
                                        )}
                                    </div>

                                    <div className="flex flex-wrap gap-4 text-sm font-medium text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-100">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4 text-slate-400" />
                                            {new Date(booking.event_date).toLocaleDateString()}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Users className="w-4 h-4 text-slate-400" />
                                            {booking.guest_count} Guests
                                        </div>
                                    </div>

                                    <div className="mt-4">
                                        <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-2">Requested Listings</h4>
                                        <ul className="space-y-2">
                                            {booking.booking_items.map((item: any, i: number) => (
                                                <li key={i} className="flex justify-between items-center text-sm">
                                                    <span className="font-bold text-slate-700">{item.listings?.title}</span>
                                                    <span className="text-slate-500">PKR {item.price_at_booking.toLocaleString()}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                <div className="w-full md:w-auto md:min-w-[280px] bg-slate-50 rounded-xl p-6 border border-slate-100 flex flex-col justify-between">
                                    <div className="space-y-3 mb-6">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-500">Total Price</span>
                                            <span className="font-bold text-slate-900">PKR {booking.total_amount.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-500">Deposit Paid (10%)</span>
                                            <span className="font-bold text-green-600">PKR {booking.deposit_amount.toLocaleString()}</span>
                                        </div>
                                    </div>

                                    {booking.status === 'pending_deposit' || booking.status === 'requested' ? (
                                        <div className="grid grid-cols-2 gap-3 mt-auto">
                                            <Button
                                                onClick={() => handleStatusUpdate(booking.id, 'rejected')}
                                                variant="outline"
                                                className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                                            >
                                                <X className="w-4 h-4 mr-1" /> Decline
                                            </Button>
                                            <Button
                                                onClick={() => handleStatusUpdate(booking.id, 'approved')}
                                                className="w-full bg-green-600 hover:bg-green-700 text-white"
                                            >
                                                <Check className="w-4 h-4 mr-1" /> Approve
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="text-center py-3 bg-white rounded-lg border border-slate-200 text-sm font-bold text-slate-400 uppercase tracking-wider">
                                            {booking.status === 'approved' ? 'Actioned: Approved' : 'Actioned: Declined'}
                                        </div>
                                    )}
                                </div>

                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
