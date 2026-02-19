import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { Navbar } from '@/components/layout/navbar'
import { Button } from '@/components/ui'
import { MapPin, Star, ShieldCheck, Heart, Share2, Calendar, MessageSquare, Info, CheckCircle, Briefcase } from 'lucide-react'
import { ServiceInquiryForm } from '@/components/services/inquiry-form'

export default async function ServiceDetailPage({
    params,
}: {
    params: { slug: string }
}) {
    const supabase = await createClient()

    const { data: service } = await supabase
        .from('services')
        .select(`
            *,
            service_categories (name, description),
            cities (name),
            service_images (*),
            profiles (full_name, avatar_url)
        `)
        .eq('slug', params.slug)
        .single()

    if (!service) {
        notFound()
    }

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />

            <main className="flex-1 pb-20">
                {/* Hero / Header Section */}
                <section className="container px-4 sm:px-8 max-w-7xl mx-auto pt-8">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-xs font-bold text-primary uppercase tracking-widest bg-primary/10 px-2 py-0.5 rounded">
                                    {service.service_categories?.name}
                                </span>
                            </div>
                            <h1 className="text-3xl font-black text-foreground">{service.name}</h1>
                            <div className="flex items-center mt-2 text-sm text-muted-foreground">
                                <MapPin className="h-4 w-4 mr-1 text-primary" />
                                Operates in {service.cities?.name} {service.is_verified && ' & surrounding areas'}
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="gap-2 rounded-full">
                                <Share2 className="h-4 w-4" /> Share
                            </Button>
                            <Button variant="outline" size="sm" className="gap-2 rounded-full">
                                <Heart className="h-4 w-4" /> Save
                            </Button>
                        </div>
                    </div>

                    {/* Image Gallery */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[400px]">
                        <div className="md:col-span-2 relative rounded-3xl overflow-hidden group">
                            <img
                                src={service.cover_image_url || 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30'}
                                alt={service.name}
                                className="h-full w-full object-cover transition-transform group-hover:scale-105"
                            />
                        </div>
                        <div className="hidden md:grid grid-rows-2 gap-4">
                            {service.service_images?.slice(0, 2).map((img: any, i: number) => (
                                <div key={i} className="relative rounded-2xl overflow-hidden group bg-muted">
                                    <img src={img.image_url} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                                </div>
                            ))}
                            {(!service.service_images || service.service_images.length < 2) && (
                                <div className="rounded-2xl border-2 border-dashed border-border flex flex-col items-center justify-center text-muted-foreground/20 bg-zinc-50">
                                    <Briefcase className="h-8 w-8 mb-2" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest">Portfolio</span>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* Content Section */}
                <section className="container px-4 sm:px-8 max-w-7xl mx-auto mt-12 text-zinc-900 dark:text-zinc-100">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

                        {/* Left Column: Info */}
                        <div className="lg:col-span-2 space-y-12">
                            <div className="flex flex-wrap gap-8 py-8 border-y border-border">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                        <Star className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Rating</p>
                                        <p className="font-bold">{service.rating || 'New Vendor'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                        <ShieldCheck className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Verified</p>
                                        <p className="font-bold">{service.is_verified ? 'Identity Verified' : 'In Review'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                        <CheckCircle className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Jobs Done</p>
                                        <p className="font-bold">12+ Events</p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h2 className="text-2xl font-bold mb-4">Expertise & Service Bio</h2>
                                <div className="prose prose-orange max-w-none text-muted-foreground leading-relaxed whitespace-pre-line">
                                    {service.description}
                                </div>
                            </div>

                            {/* Full Portfolio Grid (More Images) */}
                            {service.service_images && service.service_images.length > 0 && (
                                <div>
                                    <h2 className="text-2xl font-bold mb-6">Recent Work Portfolio</h2>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {service.service_images.map((img: any, i: number) => (
                                            <div key={i} className="aspect-square rounded-xl overflow-hidden cursor-zoom-in border border-border">
                                                <img src={img.image_url} alt={`Work ${i}`} className="h-full w-full object-cover hover:scale-110 transition-transform duration-500" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="p-8 rounded-3xl bg-zinc-50 dark:bg-zinc-900 border border-border">
                                    <h3 className="font-bold flex items-center gap-2 mb-4">
                                        <Info className="h-4 w-4 text-primary" /> What's Included
                                    </h3>
                                    <ul className="space-y-3 text-sm">
                                        <li className="flex items-center gap-3">
                                            <div className="h-1.5 w-1.5 rounded-full bg-primary" /> Professional On-site Team
                                        </li>
                                        <li className="flex items-center gap-3">
                                            <div className="h-1.5 w-1.5 rounded-full bg-primary" /> High-end Equipment
                                        </li>
                                        <li className="flex items-center gap-3">
                                            <div className="h-1.5 w-1.5 rounded-full bg-primary" /> Post-event Support / Editing
                                        </li>
                                    </ul>
                                </div>
                                <div className="p-8 rounded-3xl bg-zinc-50 dark:bg-zinc-900 border border-border">
                                    <h3 className="font-bold flex items-center gap-2 mb-4">
                                        <Calendar className="h-4 w-4 text-primary" /> Booking Policy
                                    </h3>
                                    <ul className="space-y-3 text-sm">
                                        <li className="flex items-center gap-3">
                                            <div className="h-1.5 w-1.5 rounded-full bg-primary" /> 20% Deposit to confirm
                                        </li>
                                        <li className="flex items-center gap-3">
                                            <div className="h-1.5 w-1.5 rounded-full bg-primary" /> Travel charges outside city
                                        </li>
                                        <li className="flex items-center gap-3">
                                            <div className="h-1.5 w-1.5 rounded-full bg-primary" /> Refundable until 30 days prior
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Sticky Inquiry Card */}
                        <div className="lg:col-span-1">
                            <ServiceInquiryForm
                                serviceId={service.id}
                                priceMin={service.price_min || 0}
                            />
                        </div>

                    </div>
                </section>
            </main>
        </div>
    )
}
