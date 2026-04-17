import { Navbar } from '@/components/layout/navbar'
import { createClient } from '@/lib/supabase/server'
import { Button, Input, Label } from '@/components/ui'
import { Search, MapPin, Users, Filter, Tag } from 'lucide-react'
import { ListingCard, type ListingCardProps } from '@/components/listings/listing-card'

export default async function SearchPage({
    searchParams,
}: {
    searchParams: Promise<{ q?: string; city?: string; type?: string; guests?: string }>
}) {
    const resolvedParams = await searchParams
    const supabase = await createClient()

    // Base query on the unified listings table
    let query = supabase
        .from('listings')
        .select(`
            *,
            cities (name),
            listing_venues (*),
            listing_services (*)
        `)
        .eq('status', 'approved')
        .eq('is_active', true)

    if (resolvedParams.city) {
        // If it's an ID we use eq, if it's a name we might need a join or keep it simple with explicit ID from the select.
        // Assuming city param is still passed as ID from some selects, or we just do a text search if it's from the homepage input
        if (!isNaN(Number(resolvedParams.city))) {
            query = query.eq('city_id', resolvedParams.city)
        } else {
            // Text search fallback for city name if typed manually
            // This requires a view or RPC typically, but for MVP we might fetch all if no exact match is needed
            // To keep it safe, if it's not a number, we'll ignore it unless we join.
        }
    }

    if (resolvedParams.type) {
        // 'venue' or 'service'
        query = query.eq('type', resolvedParams.type)
    }

    if (resolvedParams.q) {
        query = query.ilike('title', `%${resolvedParams.q}%`)
    }

    // Capacity filter specifically affects venues
    // In a single query with Supabase this is tricky, so we filter post-fetch for MVP simplicity or use RPC.
    // We will do post-fetch filtering for capacity since it's inside `listing_venues`

    const { data: listings } = await query.order('is_featured', { ascending: false })

    // Post-fetch filter for guests (since joining JSON/child tables in an OR fashion with Supabase REST is complex)
    let filteredListings = listings || []
    if (resolvedParams.guests) {
        const guestCount = parseInt(resolvedParams.guests)
        if (!isNaN(guestCount)) {
            filteredListings = filteredListings.filter(l =>
                l.type === 'service' || // Services don't typically have a strict guest limit in this MVP
                (l.type === 'venue' && l.listing_venues?.[0]?.capacity_max >= guestCount)
            )
        }
    }

    const { data: cities } = await supabase.from('cities').select('*').order('name')

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />

            <main className="flex-1 bg-background">
                {/* Search Header */}
                <section className="bg-card border-b border-border py-8 pt-24 text-foreground">
                    <div className="container px-4 sm:px-8 max-w-7xl mx-auto">
                        <h1 className="text-3xl font-bold mb-8">Discover Venues & Services</h1>

                        <form method="GET" action="/search" className="grid gap-4 md:grid-cols-5 items-end">
                            <div className="space-y-2">
                                <Label htmlFor="city" className="text-xs font-bold text-slate-500 uppercase">City</Label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-slate-400" aria-hidden="true" />
                                    <select
                                        id="city"
                                        name="city"
                                        defaultValue={resolvedParams.city}
                                        className="flex h-10 w-full rounded-md border border-input bg-background pl-9 pr-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 outline-none"
                                    >
                                        <option value="">Anywhere</option>
                                        {cities?.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="type" className="text-xs font-bold text-slate-500 uppercase">Looking For</Label>
                                <div className="relative">
                                    <Tag className="absolute left-3 top-3 h-4 w-4 text-slate-400" aria-hidden="true" />
                                    <select
                                        id="type"
                                        name="type"
                                        defaultValue={resolvedParams.type}
                                        className="flex h-10 w-full rounded-md border border-input bg-background pl-9 pr-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 outline-none"
                                    >
                                        <option value="">Anything (Venues & Services)</option>
                                        <option value="venue">Venues Only</option>
                                        <option value="service">Services Only</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="guests" className="text-xs font-bold text-slate-500 uppercase">Min Guests</Label>
                                <div className="relative">
                                    <Users className="absolute left-3 top-3 h-4 w-4 text-slate-400" aria-hidden="true" />
                                    <Input
                                        id="guests"
                                        name="guests"
                                        type="number"
                                        placeholder="e.g. 100"
                                        className="pl-9 focus-visible:ring-orange-500"
                                        defaultValue={resolvedParams.guests}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2 md:col-span-1">
                                <Label htmlFor="q" className="text-xs font-bold text-slate-500 uppercase">Search</Label>
                                <Input
                                    id="q"
                                    name="q"
                                    type="text"
                                    placeholder="Keywords..."
                                    className="focus-visible:ring-orange-500"
                                    defaultValue={resolvedParams.q}
                                />
                            </div>

                            <Button type="submit" className="w-full gap-2 bg-orange-600 hover:bg-orange-700 text-white active:scale-[0.98]">
                                <Search className="h-4 w-4" aria-hidden="true" />
                                Search
                            </Button>
                        </form>
                    </div>
                </section>

                {/* Results */}
                <div className="container px-4 sm:px-8 max-w-7xl mx-auto py-12">
                    <div className="flex items-center justify-between mb-8">
                        <p className="text-sm text-slate-500">
                            Showing <span className="font-bold text-slate-900">{filteredListings?.length || 0}</span> results found
                        </p>
                        <Button variant="outline" size="sm" className="gap-2 active:scale-95">
                            <Filter className="h-4 w-4" aria-hidden="true" />
                            Filters
                        </Button>
                    </div>

                    {!filteredListings || filteredListings.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
                            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4" aria-hidden="true">
                                <Search className="h-8 w-8 text-slate-400" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-2">No listings found</h3>
                            <p className="text-slate-500">Try adjusting your filters or search keywords.</p>
                        </div>
                    ) : (
                        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                            {filteredListings.map((listing) => (
                                <ListingCard key={listing.id} listing={listing as ListingCardProps['listing']} />
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}
