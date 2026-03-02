'use client'

import { useState } from 'react'
import { submitInquiry } from '@/app/properties/actions' // We can reuse the same action logic
import { Button, Input, Label } from '@/components/ui'
import { MessageSquare, Loader2, CheckCircle, Info } from 'lucide-react'

interface ServiceInquiryFormProps {
    serviceId: string
    priceMin: number
}

export function ServiceInquiryForm({ serviceId, priceMin }: ServiceInquiryFormProps) {
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState<string | null>(null)

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const formData = new FormData(e.currentTarget)
        formData.append('service_id', serviceId)

        // Using the same server action since it's generic enough for now
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
                <h3 className="text-xl font-bold text-green-900">Request Sent!</h3>
                <p className="text-sm text-green-700">
                    The service provider has been notified. They will contact you shortly with a quote.
                </p>
                <Button variant="outline" className="w-full rounded-full" onClick={() => setSuccess(false)}>
                    Send another request
                </Button>
            </div>
        )
    }

    return (
        <div className="sticky top-24 p-8 rounded-[40px] bg-white dark:bg-zinc-900 border border-border shadow-2xl ring-1 ring-black/5">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mb-1">Packages Start At</p>
                    <p className="text-3xl font-black text-primary">PKR {priceMin.toLocaleString()}</p>
                </div>
                <div className="text-right">
                    <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center text-primary font-black animate-pulse">
                        !
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                    <div className="p-3 rounded-xl bg-destructive/10 text-destructive text-xs font-medium">
                        {error}
                    </div>
                )}

                <div className="space-y-2">
                    <Label htmlFor="event_date" className="text-xs font-bold uppercase tracking-wider ml-1">Event Date</Label>
                    <Input id="event_date" name="event_date" type="date" className="rounded-2xl h-12" required />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="message" className="text-xs font-bold uppercase tracking-wider ml-1">Requirements</Label>
                    <textarea
                        id="message"
                        name="message"
                        rows={4}
                        className="flex w-full rounded-2xl border border-input bg-background px-3 py-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        placeholder="Tell them about your event (Venue location, hours needed, specific requests)..."
                        required
                    />
                </div>

                <Button size="lg" disabled={loading} className="w-full mt-4 flex items-center gap-2 h-14 text-lg rounded-2xl shadow-lg shadow-primary/20 transition-all active:scale-95">
                    {loading ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                        <>
                            <MessageSquare className="h-5 w-5" />
                            Check Availability
                        </>
                    )}
                </Button>

                <p className="text-[10px] text-center text-muted-foreground mt-4 px-4">
                    By sending, you agree to Eventifi&apos;s service matching terms. Vendors typically respond within 2-4 hours.
                </p>
            </form>
        </div>
    )
}
