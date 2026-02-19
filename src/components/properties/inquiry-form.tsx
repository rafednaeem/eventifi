'use client'

import { useState } from 'react'
import { submitInquiry } from '@/app/properties/actions'
import { Button, Input, Label } from '@/components/ui'
import { MessageSquare, Loader2, CheckCircle } from 'lucide-react'

interface InquiryFormProps {
    propertyId: string
    priceMin: number
}

export function InquiryForm({ propertyId, priceMin }: InquiryFormProps) {
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const [availability, setAvailability] = useState<string[]>([])

    useState(() => {
        async function fetchAvailability() {
            const { createClient } = await import('@/lib/supabase/client')
            const supabase = createClient()
            const { data } = await supabase
                .from('availability')
                .select('date')
                .eq('property_id', propertyId)

            if (data) setAvailability(data.map((a: { date: string }) => a.date))
        }
        fetchAvailability()
    })

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const formData = new FormData(e.currentTarget)
        const date = formData.get('event_date') as string

        if (availability.includes(date)) {
            setError('This date is already booked. Please choose another date.')
            setLoading(false)
            return
        }

        formData.append('property_id', propertyId)

        const result = await submitInquiry(formData)

        if (result.error) {
            setError(result.error)
            setLoading(false)
        } else {
            setSuccess(true)
            setLoading(false)
        }
    }

    if (success) {
        return (
            <div className="p-8 rounded-3xl bg-green-50 border border-green-100 text-center space-y-4">
                <div className="h-12 w-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto">
                    <CheckCircle className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-green-900">Inquiry Sent!</h3>
                <p className="text-sm text-green-700">
                    The property owner has been notified. They usually respond within 24 hours.
                </p>
                <Button variant="outline" className="w-full" onClick={() => setSuccess(false)}>
                    Send another inquiry
                </Button>
            </div>
        )
    }

    return (
        <div className="sticky top-24 p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-border shadow-2xl ring-1 ring-black/5">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">Est. Starting Price</p>
                    <p className="text-3xl font-black text-primary">PKR {priceMin.toLocaleString()}</p>
                </div>
                <div className="text-right">
                    <p className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded font-black uppercase tracking-tighter">Instant Response</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                    <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-xs">
                        {error}
                    </div>
                )}

                <div className="space-y-2">
                    <Label htmlFor="event_date">Event Date</Label>
                    <Input id="event_date" name="event_date" type="date" required />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="guests">Approx. Guests</Label>
                    <Input id="guests" name="guests" type="number" placeholder="e.g. 250" required />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <textarea
                        id="message"
                        name="message"
                        rows={3}
                        className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        placeholder="Ask about availability or food packages..."
                        required
                    />
                </div>

                <Button size="lg" disabled={loading} className="w-full mt-4 flex items-center gap-2 h-12 text-lg">
                    {loading ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                        <>
                            <MessageSquare className="h-5 w-5" />
                            Send Inquiry
                        </>
                    )}
                </Button>
            </form>

            <div className="mt-8 pt-6 border-t border-border space-y-4">
                <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                        <svg className="h-5 w-5 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-sm font-bold">Eventifi Protected</p>
                        <p className="text-[10px] text-muted-foreground tracking-wide">We verify all owners to prevent booking fraud.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
