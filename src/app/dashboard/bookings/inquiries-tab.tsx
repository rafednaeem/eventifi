'use client'

import { useState } from 'react'
import { Calendar, Users, MessageSquare, Phone, Mail, CheckCircle, XCircle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui'
import { markInquiryContacted, convertInquiryToBooking, closeInquiry } from './actions'

const STATUS_STYLES: Record<string, string> = {
    new: 'bg-orange-100 text-orange-700',
    contacted: 'bg-blue-100 text-blue-700',
    converted: 'bg-green-100 text-green-700',
    closed: 'bg-slate-100 text-slate-500',
}

interface Inquiry {
    id: string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    status: any
    guest_name: string
    guest_email: string
    guest_phone: string
    event_date: string
    event_type: string
    guest_count: number | null
    message: string | null
    created_at: string
    listing: { title: string; type: string } | null
    listingId: string | null
}

export default function InquiriesTab({ inquiries }: { inquiries: Inquiry[] }) {
    const [converting, setConverting] = useState<string | null>(null)
    const [prices, setPrices] = useState<Record<string, string>>({})
    const [loadingId, setLoadingId] = useState<string | null>(null)

    async function handleMarkContacted(id: string) {
        setLoadingId(id)
        await markInquiryContacted(id)
        setLoadingId(null)
    }

    async function handleCloseInquiry(id: string) {
        setLoadingId(id)
        await closeInquiry(id)
        setLoadingId(null)
    }

    async function handleConvert(inquiry: Inquiry) {
        const amount = parseFloat(prices[inquiry.id] || '0')
        if (!amount || amount <= 0) {
            alert('Please enter a valid amount before converting.')
            return
        }
        if (!inquiry.listingId) {
            alert('Cannot convert: no listing linked to this inquiry.')
            return
        }
        setLoadingId(inquiry.id)
        await convertInquiryToBooking(inquiry.id, inquiry.listingId, amount)
        setLoadingId(null)
        setConverting(null)
    }

    if (inquiries.length === 0) {
        return (
            <div className="text-center py-20 bg-card rounded-2xl border border-border">
                <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-bold text-slate-900">No inquiries yet</h3>
                <p className="text-muted-foreground mt-1 text-sm">Share your booking link to start receiving inquiries.</p>
            </div>
        )
    }

    return (
        <div className="grid gap-5">
            {inquiries.map((inq) => (
                <div key={inq.id} className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
                    <div className="p-6 flex flex-col md:flex-row gap-6">
                        {/* Left: Info */}
                        <div className="flex-1 space-y-3">
                            <div className="flex items-center gap-3 flex-wrap">
                                <span className={`px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wider ${STATUS_STYLES[inq.status] || 'bg-slate-100 text-slate-500'}`}>
                                    {inq.status}
                                </span>
                                {inq.listing && (
                                    <span className="text-xs text-slate-500 bg-slate-50 border border-slate-200 px-2 py-1 rounded-full">
                                        {inq.listing.type === 'venue' ? '🏛' : '✨'} {inq.listing.title}
                                    </span>
                                )}
                                <span className="text-xs text-slate-400 ml-auto">
                                    {new Date(inq.created_at).toLocaleDateString()}
                                </span>
                            </div>

                            <h3 className="text-xl font-extrabold text-slate-900">{inq.guest_name}</h3>

                            <div className="flex flex-wrap gap-3 text-sm text-slate-600">
                                <span className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5 text-slate-400" />{inq.guest_phone}</span>
                                {inq.guest_email && <span className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5 text-slate-400" />{inq.guest_email}</span>}
                            </div>

                            <div className="flex flex-wrap gap-4 bg-slate-50 p-3 rounded-xl border border-slate-100 text-sm text-slate-600">
                                <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4 text-slate-400" />{new Date(inq.event_date).toLocaleDateString()}</span>
                                <span className="flex items-center gap-1.5">🎉 {inq.event_type}</span>
                                {inq.guest_count && <span className="flex items-center gap-1.5"><Users className="h-4 w-4 text-slate-400" />{inq.guest_count} guests</span>}
                            </div>

                            {inq.message && (
                                <p className="text-sm text-slate-500 italic border-l-2 border-slate-200 pl-3">&ldquo;{inq.message}&rdquo;</p>
                            )}
                        </div>

                        {/* Right: Actions */}
                        {(inq.status === 'new' || inq.status === 'contacted') && (
                            <div className="w-full md:w-56 flex flex-col gap-3 justify-start">
                                {/* Convert to Booking */}
                                {inq.status !== 'converted' && (
                                    <>
                                        {converting === inq.id ? (
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-slate-600">Total Amount (PKR)</label>
                                                <input
                                                    type="number"
                                                    placeholder="e.g. 150000"
                                                    value={prices[inq.id] || ''}
                                                    onChange={e => setPrices(p => ({ ...p, [inq.id]: e.target.value }))}
                                                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                                                />
                                                <div className="flex gap-2">
                                                    <Button
                                                        onClick={() => handleConvert(inq)}
                                                        disabled={loadingId === inq.id}
                                                        className="flex-1 bg-green-600 hover:bg-green-700 text-white text-xs font-bold"
                                                    >
                                                        {loadingId === inq.id ? <Loader2 className="w-3 h-3 animate-spin" /> : '✓ Confirm'}
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        onClick={() => setConverting(null)}
                                                        className="flex-1 text-xs"
                                                    >Cancel</Button>
                                                </div>
                                            </div>
                                        ) : (
                                            <Button
                                                onClick={() => setConverting(inq.id)}
                                                className="w-full bg-green-600 hover:bg-green-700 text-white text-sm font-bold"
                                            >
                                                <CheckCircle className="w-4 h-4 mr-1" /> Convert to Booking
                                            </Button>
                                        )}
                                    </>
                                )}

                                {inq.status === 'new' && (
                                    <Button
                                        variant="outline"
                                        onClick={() => handleMarkContacted(inq.id)}
                                        disabled={loadingId === inq.id}
                                        className="w-full text-sm border-blue-200 text-blue-600 hover:bg-blue-50"
                                    >
                                        {loadingId === inq.id ? <Loader2 className="w-4 h-4 animate-spin" /> : '📞 Mark Contacted'}
                                    </Button>
                                )}

                                <Button
                                    variant="outline"
                                    onClick={() => handleCloseInquiry(inq.id)}
                                    disabled={loadingId === inq.id}
                                    className="w-full text-sm border-red-200 text-red-500 hover:bg-red-50"
                                >
                                    <XCircle className="w-4 h-4 mr-1" /> Close
                                </Button>
                            </div>
                        )}

                        {(inq.status === 'converted' || inq.status === 'closed') && (
                            <div className="w-full md:w-56 flex items-center justify-center text-sm font-bold text-slate-400 uppercase tracking-wider bg-slate-50 rounded-xl border border-slate-100 p-4">
                                {inq.status === 'converted' ? '✅ Converted' : '🚫 Closed'}
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    )
}
