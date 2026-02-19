import { Navbar } from '@/components/layout/navbar'
import { createClient } from '@/lib/supabase/server'
import { Button, Input } from '@/components/ui'
import Link from 'next/link'
import { Search, MapPin, Building, Users, Filter } from 'lucide-react'

export default async function PropertiesSearchPage({
    searchParams,
}: {
    searchParams: { city?: string; category?: string; guests?: string }
}) {
    const supabase = await createClient()

    // Fetch data
    const { data: properties } = await supabase
        .from('properties')
        .select(`
      *,
      property_categories (name),
      cities (name)
    `)
        .eq('status', 'approved')
        .eq('is_active', true)
        .order('is_featured', { ascending: false })

    const { data: cities } = await supabase.from('cities').select('*').order('name')
    const { data: categories } = await supabase.from('property_categories').select('*').order('name')

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />

            <main className="flex-1 bg-zinc-50 dark:bg-zinc-950">
                {/* Search Header */}
                <section className="bg-white dark:bg-zinc-900 border-b border-border py-8">
                    <div className="container px-4 sm:px-8 max-w-7xl mx-auto">
                        <h1 className="text-2xl font-bold mb-6">Find Event Properties</h1>

                        <div className="grid gap-4 md:grid-cols-4 items-end">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Location</label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <select className="flex h-10 w-full rounded-md border border-input bg-background pl-9 pr-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                                        <option value="">All Pakistan</option>
                                        {cities?.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Venue Type</label>
                                <div className="relative">
                                    <Building className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <select className="flex h-10 w-full rounded-md border border-input bg-background pl-9 pr-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                                        <option value="">Any Type</option>
                                        {categories?.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Min Guests</label>
                                <div className="relative">
                                    <Users className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input type="number" placeholder="e.g. 100" className="pl-9" />
                                </div>
                            </div>

                            <Button className="w-full gap-2">
                                <Search className="h-4 w-4" />
                                Search Venues
                            </Button>
                        </div>
                    </div>
                </section>

                {/* Results */}
                <div className="container px-4 sm:px-8 max-w-7xl mx-auto py-12">
                    <div className="flex items-center justify-between mb-8">
                        <p className="text-sm text-muted-foreground">
                            Showing <span className="font-bold text-foreground">{properties?.length || 0}</span> event spaces found
                        </p>
                        <Button variant="outline" size="sm" className="gap-2">
                            <Filter className="h-3 w-3" />
                            More Filters
                        </Button>
                    </div>

                    {!properties || properties.length === 0 ? (
                        <div className="text-center py-20">
                            <p className="text-muted-foreground">No properties found matching your criteria.</p>
                        </div>
                    ) : (
                        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                            {properties.map((property) => (
                                <Link
                                    key={property.id}
                                    href={`/properties/${property.slug}`}
                                    className="group flex flex-col rounded-2xl border border-border bg-card overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1"
                                >
                                    <div className="aspect-[16/10] relative bg-muted overflow-hidden">
                                        {property.cover_image_url ? (
                                            <img
                                                src={property.cover_image_url}
                                                alt={property.name}
                                                className="h-full w-full object-cover transition-transform group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center">
                                                <Building className="h-10 w-10 text-muted-foreground/20" />
                                            </div>
                                        )}
                                        {property.is_featured && (
                                            <div className="absolute top-4 left-4">
                                                <span className="bg-primary text-white text-[10px] font-black px-2 py-1 rounded shadow-lg uppercase tracking-tighter">
                                                    Featured
                                                </span>
                                            </div>
                                        )}
                                        <div className="absolute bottom-4 left-4 right-4">
                                            <span className="bg-white/90 dark:bg-black/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-primary">
                                                PKR {property.price_min?.toLocaleString()} / event
                                            </span>
                                        </div>
                                    </div>

                                    <div className="p-5">
                                        <p className="text-[10px] font-bold text-primary uppercase tracking-widest leading-none mb-2">
                                            {property.property_categories?.name}
                                        </p>
                                        <h3 className="text-xl font-bold group-hover:text-primary transition-colors line-clamp-1">
                                            {property.name}
                                        </h3>
                                        <div className="flex items-center mt-2 text-xs text-muted-foreground">
                                            <MapPin className="h-3 w-3 mr-1" />
                                            {property.address}, {property.cities?.name}
                                        </div>

                                        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border/50 text-xs">
                                            <div className="flex items-center gap-1">
                                                <Users className="h-3 w-3 text-muted-foreground" />
                                                <span className="font-semibold">{property.capacity_max} Guests</span>
                                            </div>
                                            {property.is_verified && (
                                                <div className="flex items-center gap-1 text-green-600 font-bold ml-auto">
                                                    <span className="h-4 w-4 bg-green-100 rounded-full flex items-center justify-center text-[8px]">✓</span>
                                                    <span>Verified</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}
