'use client'

import { useState } from 'react'
import { Copy, Check, MessageCircle, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui'

interface Listing {
    id: string
    title: string
    slug: string
    type: string
    cover_image_url: string | null
    whatsapp_number: string | null
}

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://eventifi.com'

export default function SharePageClient({ listings }: { listings: Listing[] }) {
    const [copiedSlug, setCopiedSlug] = useState<string | null>(null)

    function getBookingUrl(slug: string) {
        return `${BASE_URL}/book/${slug}`
    }

    async function handleCopy(slug: string) {
        await navigator.clipboard.writeText(getBookingUrl(slug))
        setCopiedSlug(slug)
        setTimeout(() => setCopiedSlug(null), 2000)
    }

    function getWhatsAppShare(listing: Listing) {
        const url = encodeURIComponent(getBookingUrl(listing.slug))
        const text = encodeURIComponent(`Book ${listing.title} on Eventifi: `)
        return `https://wa.me/?text=${text}${url}`
    }

    return (
        <div className="space-y-8 max-w-2xl">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">Your Booking Links</h1>
                <p className="text-muted-foreground mt-2">
                    Share these links in your Instagram bio, WhatsApp status, or wherever you promote your listings.
                </p>
            </div>

            {listings.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-200">
                    <p className="text-4xl mb-4">🔗</p>
                    <h3 className="text-lg font-bold text-slate-900">No approved listings yet</h3>
                    <p className="text-slate-500 mt-1 text-sm">Once an admin approves your listings, booking links will appear here.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {listings.map((listing) => {
                        const url = getBookingUrl(listing.slug)
                        const isCopied = copiedSlug === listing.slug
                        return (
                            <div key={listing.id} className="bg-white border border-border rounded-2xl p-6 shadow-sm space-y-4">
                                <div className="flex items-start gap-4">
                                    {listing.cover_image_url ? (
                                        <img src={listing.cover_image_url} alt={listing.title} className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
                                    ) : (
                                        <div className="w-16 h-16 rounded-xl bg-orange-100 flex items-center justify-center text-2xl flex-shrink-0">
                                            {listing.type === 'venue' ? '🏛' : '✨'}
                                        </div>
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                                            {listing.type === 'venue' ? 'Venue' : 'Service'}
                                        </p>
                                        <h3 className="font-extrabold text-slate-900 text-lg leading-tight">{listing.title}</h3>
                                    </div>
                                </div>

                                {/* URL display */}
                                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
                                    <a
                                        href={url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-1 text-sm text-orange-600 font-mono truncate hover:underline"
                                    >
                                        {url}
                                    </a>
                                    <a href={url} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-slate-700 transition-colors flex-shrink-0">
                                        <ExternalLink className="w-4 h-4" />
                                    </a>
                                </div>

                                {/* Actions */}
                                <div className="flex flex-wrap gap-3">
                                    <Button
                                        onClick={() => handleCopy(listing.slug)}
                                        className={`flex items-center gap-2 font-bold text-sm transition-all ${isCopied
                                            ? 'bg-green-600 hover:bg-green-700 text-white'
                                            : 'bg-slate-900 hover:bg-slate-800 text-white'
                                            }`}
                                    >
                                        {isCopied ? (
                                            <><Check className="w-4 h-4" /> Copied!</>
                                        ) : (
                                            <><Copy className="w-4 h-4" /> Copy Link</>
                                        )}
                                    </Button>

                                    <a
                                        href={getWhatsAppShare(listing)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-bold text-sm rounded-lg transition-colors shadow-sm"
                                    >
                                        <MessageCircle className="w-4 h-4" /> Share on WhatsApp
                                    </a>
                                </div>

                                {/* Instagram tip */}
                                <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100 rounded-xl px-4 py-3">
                                    <p className="text-xs text-purple-700 font-medium">
                                        💡 <strong>Instagram tip:</strong> Go to your profile → Edit Profile → Website, and paste this link so customers can book directly from your bio.
                                    </p>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
