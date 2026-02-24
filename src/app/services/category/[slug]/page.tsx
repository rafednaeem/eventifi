import { createClient } from '@/lib/supabase/server'
import { Navbar } from '@/components/layout/navbar'
import { ListingCard } from '@/components/listings/listing-card'
import { notFound } from 'next/navigation'
import { Sparkles, MapPin } from 'lucide-react'

export default async function ServiceCategoryPage({
    params,
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params
    const supabase = await createClient()

    // 1. Fetch category details
    const { data: category, error: catErr } = await supabase
        .from('service_categories')
        .select('*')
        .eq('slug', slug)
        .single()

    if (catErr || !category) {
        return notFound()
    }

    // 2. Fetch listings in this category
    const { data: listings } = await supabase
        .from('listings')
        .select(`
            *,
            cities (name),
            listing_services (*)
        `)
        .eq('type', 'service')
        .eq('category_id', category.id)
        .eq('status', 'approved')
        .eq('is_active', true)
        .order('is_featured', { ascending: false })

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />

            <main className="flex-1 bg-gray-50 pt-24 pb-20">
                <header className="bg-slate-900 border-b border-slate-800 py-12 mb-12 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl"></div>

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <div className="flex items-center gap-3 text-orange-500 font-bold tracking-wider uppercase text-sm mb-4">
                            <Sparkles className="w-5 h-5" />
                            <span>Service Category</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
                            {category.name}
                        </h1>
                        <p className="text-lg text-slate-400 max-w-2xl">
                            {category.description || `Find top-rated ${category.name.toLowerCase()} experts for your event.`}
                        </p>
                    </div>
                </header>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {!listings || listings.length === 0 ? (
                        <div className="text-center py-24 bg-white rounded-[2rem] border border-gray-100 shadow-sm">
                            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Sparkles className="w-10 h-10 text-gray-300" />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900 mb-2">No services found</h2>
                            <p className="text-slate-500">We don't have any listings in this category yet.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {listings.map((listing) => (
                                <ListingCard key={listing.id} listing={listing as any} />
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}
