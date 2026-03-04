'use client'

import { useState } from 'react'
import { submitInquiry } from './actions'
import { Button } from '@/components/ui'
import { CheckCircle2, Loader2 } from 'lucide-react'

const EVENT_TYPES = ['Wedding', 'Birthday', 'Corporate Event', 'Engagement', 'Graduation', 'Seminar', 'Other']

interface BookingFormProps {
    listingId: string
    listingType: string
    whatsappNumber?: string | null
}

export default function BookingForm({ listingId, listingType, whatsappNumber }: BookingFormProps) {
    const [pending, setPending] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState<string | null>(null)

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setPending(true)
        setError(null)

        const formData = new FormData(e.currentTarget)
        formData.set('listing_id', listingId)
        formData.set('listing_type', listingType)

        const result = await submitInquiry(formData)
        setPending(false)

        if (result.success) {
            setSuccess(true)
        } else {
            setError(result.error || 'Something went wrong. Please try again.')
        }
    }

    if (success) {
        return (
            <div className="flex flex-col items-center justify-center py-10 text-center gap-4">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-extrabold text-slate-900">Inquiry Sent!</h3>
                <p className="text-slate-500 text-sm max-w-xs">
                    The venue has received your request and will contact you shortly.
                </p>
                {whatsappNumber && (
                    <a
                        href={`https://wa.me/${whatsappNumber.replace(/\D/g, '')}?text=Hi! I just sent a booking inquiry through Eventifi.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl text-sm transition-colors shadow-lg shadow-green-500/20"
                    >
                        <span>💬</span> Also message on WhatsApp
                    </a>
                )}
            </div>
        )
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full Name *</label>
                    <input
                        name="guest_name"
                        required
                        placeholder="Ahmed Khan"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                    />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Phone Number *</label>
                    <input
                        name="guest_phone"
                        required
                        type="tel"
                        placeholder="+92 300 1234567"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email Address</label>
                <input
                    name="guest_email"
                    type="email"
                    placeholder="you@example.com"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Event Date *</label>
                    <input
                        name="event_date"
                        required
                        type="date"
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                    />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Event Type *</label>
                    <select
                        name="event_type"
                        required
                        defaultValue=""
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                    >
                        <option value="" disabled>Select type</option>
                        {EVENT_TYPES.map(t => (
                            <option key={t} value={t}>{t}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Expected Guests</label>
                <input
                    name="guest_count"
                    type="number"
                    min={1}
                    placeholder="e.g. 200"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                />
            </div>

            <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Message (optional)</label>
                <textarea
                    name="message"
                    rows={3}
                    placeholder="Any special requirements or questions..."
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition resize-none"
                />
            </div>

            {error && (
                <p className="text-sm text-red-600 bg-red-50 px-4 py-3 rounded-xl border border-red-200">{error}</p>
            )}

            <Button
                type="submit"
                disabled={pending}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl shadow-lg shadow-orange-500/25 text-base transition-all"
            >
                {pending ? (
                    <span className="flex items-center justify-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" /> Sending...
                    </span>
                ) : 'Send Inquiry'}
            </Button>

            <p className="text-xs text-center text-slate-400">
                No payment required. The vendor will contact you directly.
            </p>
        </form>
    )
}
