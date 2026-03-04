import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import BookingForm from './booking-form'
import { MapPin, Users, Star, Phone, Instagram, Facebook } from 'lucide-react'

interface Props {
    params: Promise<{ slug: string }>
}

export default async function PublicBookingPage({ params }: Props) {
    const { slug } = await params
    const supabase = await createClient()

    // Fetch listing by slug
    const { data: listing } = await supabase
        .from('listings')
        .select(`
            id, title, slug, description, base_price, type,
            cover_image_url, gallery_urls, address,
            whatsapp_number, phone_number, instagram_url, facebook_url,
            cities(name),
            listing_venues(capacity_min, capacity_max, indoor_outdoor, amenities),
            listing_services(packages, service_area)
        `)
        .eq('slug', slug)
        .eq('status', 'approved')
        .eq('is_active', true)
        .single()

    if (!listing) {
        notFound()
    }

    const venue = listing.listing_venues?.[0] ?? null
    const service = listing.listing_services?.[0] ?? null
    const city = (listing.cities as any)?.name ?? ''

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Hero */}
            <div className="relative h-64 md:h-96 w-full overflow-hidden bg-slate-200">
                {listing.cover_image_url ? (
                    <img
                        src={listing.cover_image_url}
                        alt={listing.title}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-400 to-orange-600">
                        <span className="text-8xl">🎪</span>
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
                    <div className="max-w-4xl mx-auto">
                        <span className="inline-block px-3 py-1 text-xs font-bold bg-orange-500 text-white rounded-full uppercase tracking-wider mb-3">
                            {listing.type === 'venue' ? '🏛 Venue' : '✨ Service'}
                        </span>
                        <h1 className="text-3xl md:text-4xl font-extrabold text-white">{listing.title}</h1>
                        {city && (
                            <p className="flex items-center gap-1.5 text-white/80 mt-2 text-sm">
                                <MapPin className="h-4 w-4" /> {city}
                                {listing.address ? ` — ${listing.address}` : ''}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 md:px-6 py-10 grid grid-cols-1 lg:grid-cols-5 gap-8">

                {/* Info Column */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Pricing */}
                    <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
                        <p className="text-sm text-muted-foreground mb-1">Starting from</p>
                        <p className="text-3xl font-extrabold text-slate-900">
                            PKR {listing.base_price?.toLocaleString()}
                        </p>
                        {venue && (
                            <div className="flex items-center gap-2 mt-3 text-sm text-slate-600">
                                <Users className="h-4 w-4 text-slate-400" />
                                {venue.capacity_min}–{venue.capacity_max} guests
                            </div>
                        )}
                        {venue?.indoor_outdoor && (
                            <span className="inline-block mt-2 px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-xs font-medium capitalize">
                                {venue.indoor_outdoor}
                            </span>
                        )}
                    </div>

                    {/* Description */}
                    {listing.description && (
                        <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
                            <h3 className="font-bold text-sm uppercase tracking-wider text-slate-400 mb-3">About</h3>
                            <p className="text-slate-700 text-sm leading-relaxed">{listing.description}</p>
                        </div>
                    )}

                    {/* Amenities */}
                    {venue?.amenities && Array.isArray(venue.amenities) && venue.amenities.length > 0 && (
                        <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
                            <h3 className="font-bold text-sm uppercase tracking-wider text-slate-400 mb-3">Amenities</h3>
                            <div className="flex flex-wrap gap-2">
                                {(venue.amenities as string[]).map((a: string) => (
                                    <span key={a} className="px-2 py-1 bg-slate-100 rounded text-xs font-medium text-slate-700">
                                        {a}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Contact */}
                    <div className="bg-white rounded-2xl border border-border p-6 shadow-sm space-y-3">
                        <h3 className="font-bold text-sm uppercase tracking-wider text-slate-400">Contact</h3>
                        {listing.phone_number && (
                            <a href={`tel:${listing.phone_number}`} className="flex items-center gap-2 text-sm text-slate-700 hover:text-orange-600 transition-colors">
                                <Phone className="h-4 w-4 text-slate-400" /> {listing.phone_number}
                            </a>
                        )}
                        {listing.whatsapp_number && (
                            <a
                                href={`https://wa.me/${listing.whatsapp_number.replace(/\D/g, '')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-sm text-green-600 hover:text-green-700 font-medium"
                            >
                                <span className="text-base">💬</span> Chat on WhatsApp
                            </a>
                        )}
                        {listing.instagram_url && (
                            <a href={listing.instagram_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-pink-600 hover:text-pink-700">
                                <Instagram className="h-4 w-4" /> Instagram
                            </a>
                        )}
                        {listing.facebook_url && (
                            <a href={listing.facebook_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700">
                                <Facebook className="h-4 w-4" /> Facebook
                            </a>
                        )}
                    </div>
                </div>

                {/* Booking Form Column */}
                <div className="lg:col-span-3">
                    <div className="bg-white rounded-2xl border border-border shadow-sm p-6 md:p-8">
                        <div className="flex items-center gap-2 mb-6">
                            <Star className="h-5 w-5 text-orange-500 fill-orange-500" />
                            <h2 className="text-xl font-extrabold text-slate-900">Request a Booking</h2>
                        </div>
                        <BookingForm
                            listingId={listing.id}
                            listingType={listing.type}
                            whatsappNumber={listing.whatsapp_number}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
