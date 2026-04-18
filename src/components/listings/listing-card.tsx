import Link from 'next/link'
import { MapPin, Building, Users, Sparkles, Tag } from 'lucide-react'

interface ListingCardProps {
    listing: {
        id: string
        slug: string
        title: string
        type: string
        cover_image_url?: string
        base_price: number
        is_featured?: boolean
        cities?: { name: string }
        listing_venues?: Array<{ capacity_max: number }>
    }
}

export function ListingCard({ listing }: ListingCardProps) {
    return (
        <Link
            href={`/listing/${listing.slug}`}
            className="group flex flex-col bg-white rounded-3xl border border-slate-200 overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 active:scale-[0.99] block"
        >
            <div className="aspect-[4/3] relative bg-slate-100 overflow-hidden">
                {listing.cover_image_url ? (
                    <img
                        src={listing.cover_image_url}
                        alt={listing.title}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center bg-slate-100">
                        {listing.type === 'venue' ?
                            <Building className="h-10 w-10 text-slate-300" /> :
                            <Sparkles className="h-10 w-10 text-slate-300" />
                        }
                    </div>
                )}
                {listing.is_featured && (
                    <div className="absolute top-4 left-4 z-10">
                        <span className="bg-orange-500 text-white text-[10px] font-black px-3 py-1.5 rounded-full shadow-lg uppercase tracking-wider">
                            Featured
                        </span>
                    </div>
                )}
                <div className="absolute top-4 right-4 z-10">
                    <span className="bg-white/90 backdrop-blur-md text-slate-800 text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-sm">
                        {listing.type}
                    </span>
                </div>
                <div className="absolute bottom-4 left-4 right-4 z-10">
                    <span className="bg-white/95 backdrop-blur-md px-4 py-2 rounded-2xl text-sm font-bold text-orange-600 shadow-xl inline-block">
                        PKR {listing.base_price?.toLocaleString()}
                    </span>
                </div>
            </div>

            <div className="p-6">
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-orange-600 transition-colors line-clamp-1 mb-2">
                    {listing.title}
                </h3>
                <div className="flex items-center text-sm text-slate-500 mb-4">
                    <MapPin className="h-4 w-4 mr-1 text-orange-400" />
                    {listing.cities?.name || 'Various Locations'}
                </div>

                <div className="flex items-center gap-4 pt-4 border-t border-slate-100 text-sm">
                    {listing.type === 'venue' && listing.listing_venues?.[0] && (
                        <div className="flex items-center gap-1.5 text-slate-600 font-medium">
                            <Users className="h-4 w-4 text-orange-400" />
                            <span>Up to {listing.listing_venues[0].capacity_max}</span>
                        </div>
                    )}
                    {listing.type === 'service' && (
                        <div className="flex items-center gap-1.5 text-slate-600 font-medium">
                            <Tag className="h-4 w-4 text-blue-400" />
                            <span>Service Provider</span>
                        </div>
                    )}
                </div>
            </div>
        </Link>
    )
}
