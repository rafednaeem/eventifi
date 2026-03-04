'use client'

import { useState } from 'react'
import { Calendar, Users, Check, X, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui'
import { updateBookingStatus } from './actions'

const STATUS_STYLES: Record<string, string> = {
    pending_deposit: 'bg-orange-100 text-orange-700',
    requested: 'bg-amber-100 text-amber-700',
    approved: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700',
    completed: 'bg-slate-100 text-slate-600',
    cancelled: 'bg-slate-100 text-slate-400',
}

interface BookingItem {
    id: string
    price_at_booking: number
    listing_id: string
    details: Record<string, string> | null
    listings: { title: string; type: string; owner_id: string }
}

interface Booking {
    id: string
    status: string
    event_date: string
    event_type: string
    guest_count: number | null
    total_amount: number
    deposit_amount: number
    created_at: string
    booking_items: BookingItem[]
}

export default function BookingsTab({ bookings }: { bookings: Booking[] }) {
    const [loadingId, setLoadingId] = useState<string | null>(null)
    const [localBookings, setLocalBookings] = useState(bookings)

    async function handleStatus(id: string, status: string) {
        setLoadingId(id)
        const result = await updateBookingStatus(id, status)
        if (result.success) {
            setLocalBookings(bs => bs.map(b => b.id === id ? { ...b, status } : b))
        }
        setLoadingId(null)
    }

    if (localBookings.length === 0) {
        return (
            <div className="text-center py-20 bg-card rounded-2xl border border-border">
                <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-bold text-slate-900">No confirmed bookings yet</h3>
                <p className="text-muted-foreground mt-1 text-sm">Convert inquiries into bookings to see them here.</p>
            </div>
        )
    }

    return (
        <div className="grid gap-5">
            {localBookings.map((booking) => (
                <div key={booking.id} className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
                    <div className="p-6 md:p-8 flex flex-col md:flex-row gap-6 justify-between items-start">
                        <div className="space-y-4 flex-1">
                            <div className="flex items-center gap-3 flex-wrap">
                                <span className={`px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wider ${STATUS_STYLES[booking.status] || 'bg-slate-100 text-slate-600'}`}>
                                    {booking.status.replace('_', ' ')}
                                </span>
                                <span className="text-sm text-slate-400">{new Date(booking.created_at).toLocaleDateString()}</span>
                            </div>

                            <h3 className="text-xl font-bold text-slate-900">
                                {booking.booking_items[0]?.details?.guest_name || 'Guest'}{' '}
                                <span className="text-slate-400 font-normal">for</span>{' '}
                                {booking.event_type}
                            </h3>

                            {booking.booking_items[0]?.details?.guest_phone && (
                                <p className="text-sm text-slate-500">📞 {booking.booking_items[0].details.guest_phone}</p>
                            )}

                            <div className="flex flex-wrap gap-4 text-sm text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-100">
                                <span className="flex items-center gap-2"><Calendar className="w-4 h-4 text-slate-400" />{new Date(booking.event_date).toLocaleDateString()}</span>
                                {booking.guest_count && <span className="flex items-center gap-2"><Users className="w-4 h-4 text-slate-400" />{booking.guest_count} guests</span>}
                            </div>

                            <div>
                                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Listings</h4>
                                <ul className="space-y-1.5">
                                    {booking.booking_items.map((item, i) => (
                                        <li key={i} className="flex justify-between items-center text-sm">
                                            <span className="font-bold text-slate-700">{item.listings?.title}</span>
                                            <span className="text-slate-500">PKR {item.price_at_booking?.toLocaleString()}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <div className="w-full md:w-auto md:min-w-[260px] bg-slate-50 rounded-xl p-6 border border-slate-100 flex flex-col justify-between gap-4">
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Total</span>
                                    <span className="font-bold text-slate-900">PKR {booking.total_amount?.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Deposit (10%)</span>
                                    <span className="font-bold text-green-600">PKR {booking.deposit_amount?.toLocaleString()}</span>
                                </div>
                            </div>

                            {(booking.status === 'requested' || booking.status === 'pending_deposit') ? (
                                <div className="grid grid-cols-2 gap-2">
                                    <Button
                                        variant="outline"
                                        onClick={() => handleStatus(booking.id, 'rejected')}
                                        disabled={loadingId === booking.id}
                                        className="border-red-200 text-red-600 hover:bg-red-50 text-sm font-bold"
                                    >
                                        {loadingId === booking.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <><X className="w-4 h-4 mr-1" />Decline</>}
                                    </Button>
                                    <Button
                                        onClick={() => handleStatus(booking.id, 'approved')}
                                        disabled={loadingId === booking.id}
                                        className="bg-green-600 hover:bg-green-700 text-white text-sm font-bold"
                                    >
                                        {loadingId === booking.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Check className="w-4 h-4 mr-1" />Approve</>}
                                    </Button>
                                </div>
                            ) : (
                                <div className="text-center py-3 bg-white rounded-lg border border-slate-200 text-xs font-bold text-slate-400 uppercase tracking-wider">
                                    {booking.status === 'approved' ? '✅ Approved' :
                                        booking.status === 'completed' ? '🏁 Completed' :
                                            booking.status === 'rejected' ? '❌ Declined' : '🚫 Cancelled'}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}
