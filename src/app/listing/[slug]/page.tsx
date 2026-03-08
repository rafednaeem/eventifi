import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { Navbar } from '@/components/layout/navbar'
import { Button } from '@/components/ui'
import {
    MapPin, Users, Building, ShieldCheck, Heart, Share2,
    Calendar, MessageSquare, Info, Globe, Phone, Instagram,
    Facebook, MessageCircle, Sparkles, Tag, CheckCircle2
} from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function ListingDetailPage({
    params,
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params
    const supabase = await createClient()

    // 1. Fetch listing details with related data
    console.log('--- START FETCH ---');
    console.log('REQUESTED SLUG:', slug);

    const { data: listing, error } = await supabase
        .from('listings')
        .select(`
            *,
            cities!left (name),
            profiles!left (full_name, avatar_url, phone, email),
            listing_venues!left (*),
            listing_services!left (*)
        `)
        .eq('slug', slug)
        .single()

    if (error) {
        console.error('CRITICAL: Error fetching listing:', { slug, error, errorCode: error.code, message: error.message });
    }

    if (!listing) {
        console.warn('NOT FOUND: Listing is null for slug:', slug);
        notFound()
    }

    console.log('SUCCESS: Listing found:', listing.title, 'Type:', listing.type);
    console.log('Full Listing Data keys:', Object.keys(listing));
    console.log('listing_venues content:', listing.listing_venues);
    console.log('listing_services content:', listing.listing_services);
    console.log('--- End Fetch ---');

    const isVenue = listing.type === 'venue'
    const venueData = listing.listing_venues?.[0] || {}
    const serviceData = listing.listing_services?.[0] || {}

    return (
        <div className="flex flex-col min-h-screen bg-slate-50/50">
            <Navbar />

            <main className="flex-1 pb-20 pt-24">
                {/* Hero Gallery Section */}
                <section className="container mx-auto px-4 max-w-7xl">
                    <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm mb-12">
                        <div className="p-8 md:p-12">
                            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
                                <div>
                                    <div className="flex items-center gap-2 mb-4">
                                        <span className="bg-orange-600 text-white text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg shadow-orange-500/20">
                                            {listing.type === 'venue' ? 'Premium Venue' : 'Top Service'}
                                        </span>
                                        {listing.is_featured && (
                                            <span className="bg-amber-100 text-amber-700 text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest border border-amber-200">
                                                Featured
                                            </span>
                                        )}
                                    </div>
                                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                                        {listing.title}
                                    </h1>
                                    <div className="flex items-center mt-4 text-slate-500 font-medium">
                                        <MapPin className="h-5 w-5 mr-2 text-orange-500" />
                                        <span className="text-lg">{listing.address}, {listing.cities?.name}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Button variant="outline" className="rounded-2xl h-12 px-6 border-slate-200 text-slate-600 hover:bg-slate-50 font-bold gap-2">
                                        <Share2 className="h-4 w-4" /> Share
                                    </Button>
                                    <Button variant="outline" className="rounded-2xl h-12 w-12 border-slate-200 text-slate-600 hover:bg-slate-50 font-bold">
                                        <Heart className="h-5 w-5" />
                                    </Button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[400px] md:h-[550px]">
                                <div className="md:col-span-2 relative rounded-3xl overflow-hidden group">
                                    <img
                                        src={listing.cover_image_url || 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=2000'}
                                        alt={listing.title}
                                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                </div>
                                <div className="hidden md:grid gap-6">
                                    {listing.gallery_urls?.slice(0, 2).map((url: string, i: number) => (
                                        <div key={i} className="relative rounded-3xl overflow-hidden group bg-slate-100 h-full">
                                            <img
                                                src={url}
                                                alt={`${listing.title} gallery ${i + 1}`}
                                                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            />
                                        </div>
                                    )) || (
                                            <div className="rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-300 gap-4 h-full">
                                                <Building className="h-16 w-16" />
                                                <p className="font-bold uppercase tracking-widest text-xs">More Photos Coming Soon</p>
                                            </div>
                                        )}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Content Section */}
                <section className="container mx-auto px-4 max-w-7xl">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        {/* Left Column: Details */}
                        <div className="lg:col-span-2 space-y-12">
                            {/* Key Features Bar */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-8 bg-white border border-slate-100 rounded-[2rem] shadow-sm">
                                {isVenue ? (
                                    <>
                                        <div className="flex flex-col gap-2">
                                            <div className="flex items-center gap-2 text-orange-500">
                                                <Users className="h-5 w-5" />
                                                <span className="text-[10px] font-black uppercase tracking-widest">Capacity</span>
                                            </div>
                                            <p className="text-xl font-black text-slate-900">{venueData?.capacity_min || 0} - {venueData?.capacity_max || 'N/A'} Max</p>
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <div className="flex items-center gap-2 text-indigo-500">
                                                <Building className="h-5 w-5" />
                                                <span className="text-[10px] font-black uppercase tracking-widest">Space</span>
                                            </div>
                                            <p className="text-xl font-black text-slate-900 capitalize">{venueData?.indoor_outdoor}</p>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="flex flex-col gap-2">
                                            <div className="flex items-center gap-2 text-orange-500">
                                                <Sparkles className="h-5 w-5" />
                                                <span className="text-[10px] font-black uppercase tracking-widest">Type</span>
                                            </div>
                                            <p className="text-xl font-black text-slate-900 capitalize">{listing.type}</p>
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <div className="flex items-center gap-2 text-indigo-500">
                                                <Tag className="h-5 w-5" />
                                                <span className="text-[10px] font-black uppercase tracking-widest">Packages</span>
                                            </div>
                                            <p className="text-xl font-black text-slate-900">{serviceData?.packages?.length || 0} Options</p>
                                        </div>
                                    </>
                                )}
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-2 text-emerald-500">
                                        <ShieldCheck className="h-5 w-5" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Verified</span>
                                    </div>
                                    <p className="text-xl font-black text-slate-900">{listing.is_verified ? 'Verified Partner' : 'Under Review'}</p>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-2 text-amber-500">
                                        <Calendar className="h-5 w-5" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Booking</span>
                                    </div>
                                    <p className="text-xl font-black text-slate-900">Open</p>
                                </div>
                            </div>

                            {/* Description */}
                            <div className="bg-white p-10 md:p-12 border border-slate-100 rounded-[3rem] shadow-sm">
                                <h2 className="text-3xl font-black text-slate-900 mb-8 border-b border-slate-50 pb-6 uppercase tracking-tight">Overview</h2>
                                <div className="prose prose-slate max-w-none text-slate-600 text-lg leading-relaxed">
                                    {listing.description}
                                </div>
                            </div>

                            {/* Specific Details (Venues / Services) */}
                            {isVenue ? (
                                <div className="bg-slate-900 p-10 md:p-12 rounded-[3rem] text-white shadow-xl shadow-slate-200">
                                    <h2 className="text-3xl font-black mb-10 uppercase tracking-tight flex items-center gap-4">
                                        <Building className="w-8 h-8 text-orange-500" />
                                        Venue Amenities
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-6">
                                            <h3 className="text-orange-500 font-black text-sm uppercase tracking-widest">Facilities</h3>
                                            <ul className="space-y-4">
                                                {['Generators / UPS Backup', 'Dedicated Parking Staff', 'Air Conditioning', 'VIP Lounges'].map((item) => (
                                                    <li key={item} className="flex items-center gap-3 text-slate-300">
                                                        <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                                                        {item}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div className="space-y-6">
                                            <h3 className="text-orange-500 font-black text-sm uppercase tracking-widest">Event Rules</h3>
                                            <ul className="space-y-4">
                                                {['Music allowed until 11 PM', 'External catering allowed', 'Fireworks prohibited', 'Parking for 50+ cars'].map((item) => (
                                                    <li key={item} className="flex items-center gap-3 text-slate-300">
                                                        <Info className="h-5 w-5 text-blue-500" />
                                                        {item}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-white p-10 md:p-12 border border-slate-100 rounded-[3rem] shadow-sm">
                                    <h2 className="text-3xl font-black text-slate-900 mb-10 uppercase tracking-tight flex items-center gap-4">
                                        <Sparkles className="w-8 h-8 text-orange-500" />
                                        Service Packages
                                    </h2>
                                    <div className="grid gap-8">
                                        {serviceData?.packages?.map((pkg: any, idx: number) => (
                                            <div key={idx} className="group p-8 border border-slate-100 rounded-3xl hover:border-orange-200 hover:shadow-xl hover:shadow-orange-500/5 transition-all duration-300">
                                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                                                    <h3 className="text-2xl font-black text-slate-900 group-hover:text-orange-600 transition-colors uppercase tracking-tight">{pkg.name}</h3>
                                                    <div className="bg-orange-50 text-orange-600 px-6 py-2 rounded-2xl font-black text-xl">
                                                        PKR {pkg.price?.toLocaleString()}
                                                    </div>
                                                </div>
                                                <p className="text-slate-500 text-lg">{pkg.description}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Right Column: Sticky Sidebar */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-32 space-y-8">
                                {/* Pricing & Booking Card */}
                                <div className="bg-white border border-slate-200 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 overflow-hidden">
                                    <div className="p-8 md:p-10">
                                        <div className="flex items-center justify-between mb-8">
                                            <div>
                                                <span className="text-slate-400 font-black text-[10px] uppercase tracking-widest">Base Price</span>
                                                <p className="text-3xl font-black text-slate-900">
                                                    PKR {listing.base_price?.toLocaleString()}
                                                    {isVenue ? <span className="text-sm font-bold text-slate-400 ml-2 italic">/ event</span> : <span className="text-sm font-bold text-slate-400 ml-2 italic">/ starting</span>}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="space-y-4 mb-8">
                                            <Link href={`/book/${listing.slug}`} className="w-full">
                                                <Button className="w-full h-16 rounded-[1.25rem] bg-orange-600 hover:bg-orange-700 text-white font-black text-lg shadow-xl shadow-orange-500/30 transition-all hover:-translate-y-1 active:scale-95 gap-3">
                                                    <Calendar className="w-5 h-5" />
                                                    Book This {isVenue ? 'Venue' : 'Service'}
                                                </Button>
                                            </Link>
                                            {listing.phone_number && (
                                                <a href={`tel:${listing.phone_number}`} className="w-full">
                                                    <Button variant="outline" className="w-full h-16 rounded-[1.25rem] border-slate-200 text-slate-800 font-black text-lg hover:bg-slate-50 transition-all gap-3">
                                                        <Phone className="w-5 h-5" />
                                                        Call to Book
                                                    </Button>
                                                </a>
                                            )}
                                            <Link href={`/book/${listing.slug}`} className="w-full">
                                                <Button variant="ghost" className="w-full h-12 rounded-[1rem] text-slate-500 font-bold hover:bg-slate-50 transition-all gap-2">
                                                    <MessageSquare className="w-4 h-4" />
                                                    Send Inquiry
                                                </Button>
                                            </Link>
                                        </div>

                                        {/* Social & Contact Links */}
                                        <div className="space-y-3 pt-6 border-t border-slate-50">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Direct Contact</p>

                                            {listing.whatsapp_number && (
                                                <a href={`https://wa.me/${listing.whatsapp_number}`} target="_blank" className="flex items-center gap-4 p-4 rounded-2xl border border-emerald-50 bg-emerald-50/10 text-emerald-700 hover:bg-emerald-50 transition-colors group">
                                                    <div className="h-10 w-10 flex items-center justify-center bg-emerald-500 text-white rounded-xl shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform">
                                                        <MessageCircle className="h-5 w-5" />
                                                    </div>
                                                    <div>
                                                        <span className="text-[10px] font-black uppercase tracking-widest block opacity-60">WhatsApp</span>
                                                        <span className="font-bold">{listing.whatsapp_number}</span>
                                                    </div>
                                                </a>
                                            )}

                                            <div className="grid grid-cols-2 gap-3">
                                                {listing.phone_number && (
                                                    <a href={`tel:${listing.phone_number}`} className="flex flex-col gap-2 p-4 rounded-2xl border border-slate-100 hover:bg-slate-50 transition-colors group">
                                                        <Phone className="h-5 w-5 text-indigo-500 group-hover:scale-110 transition-transform" />
                                                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Call Now</span>
                                                    </a>
                                                )}
                                                {listing.website_url && (
                                                    <a href={listing.website_url} target="_blank" className="flex flex-col gap-2 p-4 rounded-2xl border border-slate-100 hover:bg-slate-50 transition-colors group">
                                                        <Globe className="h-5 w-5 text-blue-500 group-hover:scale-110 transition-transform" />
                                                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Website</span>
                                                    </a>
                                                )}
                                            </div>

                                            <div className="grid grid-cols-2 gap-3">
                                                {listing.instagram_url && (
                                                    <a href={listing.instagram_url} target="_blank" className="flex flex-col gap-2 p-4 rounded-2xl border border-slate-100 hover:bg-slate-50 transition-colors group">
                                                        <Instagram className="h-5 w-5 text-pink-600 group-hover:scale-110 transition-transform" />
                                                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Instagram</span>
                                                    </a>
                                                )}
                                                {listing.facebook_url && (
                                                    <a href={listing.facebook_url} target="_blank" className="flex flex-col gap-2 p-4 rounded-2xl border border-slate-100 hover:bg-slate-50 transition-colors group">
                                                        <Facebook className="h-5 w-5 text-blue-700 group-hover:scale-110 transition-transform" />
                                                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Facebook</span>
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Owner Info Card */}
                                <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-xl shadow-slate-200">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="h-16 w-16 rounded-2xl bg-orange-500 flex items-center justify-center overflow-hidden">
                                            {listing.profiles?.avatar_url ? (
                                                <img src={listing.profiles.avatar_url} alt={listing.profiles.full_name} className="h-full w-full object-cover" />
                                            ) : (
                                                <span className="text-2xl font-black">{listing.profiles?.full_name?.charAt(0) || 'E'}</span>
                                            )}
                                        </div>
                                        <div>
                                            <span className="text-[10px] font-black text-orange-500 uppercase tracking-[0.2em] block">Owner / Manager</span>
                                            <h4 className="text-xl font-bold">{listing.profiles?.full_name || 'EventiFi Partner'}</h4>
                                        </div>
                                    </div>
                                    <p className="text-slate-400 text-sm italic mb-6">"Our team is dedicated to making your special moments unforgettable. We look forward to hosting you!"</p>
                                    <Button variant="outline" className="w-full rounded-xl border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white transition-all uppercase tracking-widest text-[10px] h-12">
                                        View Profile
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    )
}
