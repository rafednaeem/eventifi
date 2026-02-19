import { Navbar } from '@/components/layout/navbar'
import { createClient } from '@/lib/supabase/server'
import { Button, Input, Label } from '@/components/ui'
import Link from 'next/link'
import { Search, Sparkles, Star, MapPin } from 'lucide-react'

export default async function ServicesSearchPage({
    searchParams,
}: {
    searchParams: { city?: string; type?: string }
}) {
    const supabase = await createClient()

    const { data: cities } = await supabase.from('cities').select('*').order('name')
    const { data: categories } = await supabase.from('service_categories').select('*').order('name')

    // Fetch services with basic filtering
    let query = supabase
        .from('services')
        .select(`
            *,
            service_categories (name, slug),
            cities (name)
        `)
        .eq('status', 'approved')

    if (searchParams.city && searchParams.city !== 'all') {
        query = query.eq('city_id', parseInt(searchParams.city))
    }

    if (searchParams.type && searchParams.type !== 'all') {
        const { data: cat } = await supabase
            .from('service_categories')
            .select('id')
            .eq('slug', searchParams.type)
            .single()
        if (cat) query = query.eq('category_id', cat.id)
    }

    const { data: services } = await query.order('is_featured', { ascending: false })

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />

            <main className="flex-1 pb-20">
                <section className="bg-orange-50 dark:bg-zinc-900 border-b border-orange-100 py-16">
                    <div className="container px-4 sm:px-8 max-w-7xl mx-auto">
                        <h1 className="text-4xl font-black tracking-tight mb-4 text-zinc-900 dark:text-zinc-100">Event Services & Vendors</h1>
                        <p className="text-muted-foreground text-lg max-w-2xl">
                            From award-winning catering to cinematic photography, find top-rated professionals for your big day.
                        </p>
                    </div>
                </section>

                <section className="container px-4 sm:px-8 max-w-7xl mx-auto mt-12 text-zinc-900 dark:text-zinc-100">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {/* Filters Sidebar */}
                        <aside className="space-y-8">
                            <div>
                                <h3 className="font-bold text-lg mb-4">Refine Search</h3>
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <Label>City</Label>
                                        <select
                                            className="w-full h-10 rounded-xl border border-border bg-background px-3 text-sm focus:ring-2 focus:ring-primary outline-none"
                                            defaultValue={searchParams.city || 'all'}
                                        >
                                            <option value="all">All Cities</option>
                                            {cities?.map((city: any) => (
                                                <option key={city.id} value={city.id}>{city.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Service Type</Label>
                                        <select
                                            className="w-full h-10 rounded-xl border border-border bg-background px-3 text-sm focus:ring-2 focus:ring-primary outline-none"
                                            defaultValue={searchParams.type || 'all'}
                                        >
                                            <option value="all">All Services</option>
                                            {categories?.map((cat: any) => (
                                                <option key={cat.id} value={cat.slug}>{cat.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </aside>

                        {/* Results Grid */}
                        <div className="md:col-span-3">
                            <div className="flex items-center justify-between mb-8">
                                <p className="text-sm font-medium text-muted-foreground">
                                    Showing <span className="text-foreground font-bold">{services?.length || 0}</span> specialized vendors
                                </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {services?.map((service: any) => (
                                    <Link
                                        key={service.id}
                                        href={`/services/${service.slug}`}
                                        className="group relative flex flex-col bg-card border border-border rounded-2xl overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1"
                                    >
                                        <div className="relative aspect-square overflow-hidden">
                                            <img
                                                src={service.cover_image_url || 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30'}
                                                alt={service.name}
                                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                            {service.is_featured && (
                                                <div className="absolute top-3 left-3">
                                                    <span className="bg-primary text-white text-[10px] font-black uppercase px-2 py-1 rounded shadow-lg tracking-tighter">
                                                        Featured
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-5 flex flex-col flex-1">
                                            <div className="flex items-center gap-2 text-[10px] font-bold text-primary uppercase tracking-widest mb-2">
                                                {service.service_categories?.name}
                                            </div>
                                            <h3 className="font-bold text-lg mb-2 line-clamp-1">{service.name}</h3>
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
                                                <MapPin className="h-3 w-3" />
                                                {service.cities?.name} {service.is_verified && '• Verified'}
                                            </div>

                                            <div className="mt-auto pt-4 border-t border-border flex items-center justify-between">
                                                <div className="flex items-center gap-1">
                                                    <Star className="h-3 w-3 text-orange-400 fill-orange-400" />
                                                    <span className="text-xs font-bold">{service.rating || 'New'}</span>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-xs text-muted-foreground">Starts at</p>
                                                    <p className="text-sm font-black text-primary">PKR {service.price_min?.toLocaleString()}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>

                            {(!services || services.length === 0) && (
                                <div className="py-20 text-center border-2 border-dashed border-border rounded-3xl">
                                    <p className="text-muted-foreground">No vendors matched your exact criteria. Try broadening your search.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            </main>
        </div>
    )
}
