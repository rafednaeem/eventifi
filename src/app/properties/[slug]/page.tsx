import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { Navbar } from '@/components/layout/navbar'
import { Button, Input, Label } from '@/components/ui'
import { MapPin, Users, Building, ShieldCheck, Heart, Share2, Calendar, MessageSquare, Info } from 'lucide-react'
import { InquiryForm } from '@/components/properties/inquiry-form'
import { PropertyAvailability } from '@/components/properties/availability-calendar'

export default async function PropertyDetailPage({
    params,
}: {
    params: { slug: string }
}) {
    const supabase = await createClient()

    const { data: property } = await supabase
        .from('properties')
        .select(`
      *,
      property_categories (name, description),
      cities (name),
      property_images (*),
      profiles (full_name, avatar_url)
    `)
        .eq('slug', params.slug)
        .single()

    if (!property) {
        notFound()
    }

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />

            <main className="flex-1 pb-20">
                {/* Gallery Section */}
                <section className="container px-4 sm:px-8 max-w-7xl mx-auto pt-8">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h1 className="text-3xl font-black text-foreground">{property.name}</h1>
                            <div className="flex items-center mt-2 text-sm text-muted-foreground">
                                <MapPin className="h-4 w-4 mr-1 text-primary" />
                                {property.address}, {property.cities?.name}
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="gap-2">
                                <Share2 className="h-4 w-4" /> Share
                            </Button>
                            <Button variant="outline" size="sm" className="gap-2">
                                <Heart className="h-4 w-4" /> Save
                            </Button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-[500px]">
                        <div className="md:col-span-2 relative rounded-2xl overflow-hidden group">
                            <img
                                src={property.cover_image_url || property.property_images?.[0]?.image_url}
                                alt={property.name}
                                className="h-full w-full object-cover transition-transform group-hover:scale-105"
                            />
                            <div className="absolute top-4 left-4">
                                <span className="bg-white/90 px-3 py-1 rounded-full text-xs font-bold text-primary shadow-sm uppercase tracking-wider">
                                    Cover Photo
                                </span>
                            </div>
                        </div>
                        <div className="hidden md:grid md:col-span-2 grid-cols-2 gap-4">
                            {property.property_images?.slice(1, 5).map((img: any, i: number) => (
                                <div key={i} className="relative rounded-xl overflow-hidden group bg-muted">
                                    <img
                                        src={img.image_url}
                                        alt={`${property.name} gallery image ${i + 1}`}
                                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
                                    />
                                </div>
                            ))}
                            {(!property.property_images || property.property_images.length < 5) && (
                                <div className="rounded-xl border-2 border-dashed border-border flex items-center justify-center text-muted-foreground/20">
                                    <Building className="h-12 w-12" />
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* Content Section */}
                <section className="container px-4 sm:px-8 max-w-7xl mx-auto mt-12">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

                        {/* Left Column: Info */}
                        <div className="lg:col-span-2 space-y-12">
                            <div className="flex flex-wrap gap-8 py-8 border-y border-border">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                        <Users className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Capacity</p>
                                        <p className="font-bold">{property.capacity_min} - {property.capacity_max} Guests</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                        <ShieldCheck className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Status</p>
                                        <p className="font-bold">{property.is_verified ? 'Verified Venue' : 'Pending Verification'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                        <Building className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Type</p>
                                        <p className="font-bold">{property.property_categories?.name}</p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h2 className="text-2xl font-bold mb-4">About this property</h2>
                                <div className="prose prose-orange max-w-none text-muted-foreground leading-relaxed">
                                    {property.description}
                                </div>
                            </div>

                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-border">
                                    <h3 className="font-bold flex items-center gap-2 mb-4">
                                        <Info className="h-4 w-4 text-primary" /> Space Highlights
                                    </h3>
                                    <ul className="space-y-2 text-sm">
                                        <li className="flex items-center gap-2">• Generators / UPS Backup</li>
                                        <li className="flex items-center gap-2">• Dedicated Parking Staff</li>
                                        <li className="flex items-center gap-2">• External Catering Allowed</li>
                                        <li className="flex items-center gap-2">• Decor Customization</li>
                                    </ul>
                                </div>
                                <div className="p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-border">
                                    <h3 className="font-bold flex items-center gap-2 mb-4">
                                        <Calendar className="h-4 w-4 text-primary" /> Booking Rules
                                    </h3>
                                    <ul className="space-y-2 text-sm">
                                        <li className="flex items-center gap-2">• 50% Advance Payment</li>
                                        <li className="flex items-center gap-2">• Cancellation 2 weeks before</li>
                                        <li className="flex items-center gap-2">• Music allowed until 11 PM</li>
                                    </ul>
                                </div>
                            </div>

                            <div>
                                <h2 className="text-2xl font-bold mb-6">Booking Schedule</h2>
                                <div className="max-w-md">
                                    <PropertyAvailability propertyId={property.id} />
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Sticky Booking Card */}
                        <div className="lg:col-span-1">
                            <InquiryForm
                                propertyId={property.id}
                                priceMin={property.price_min || 0}
                            />
                        </div>

                    </div>
                </section>
            </main>
        </div>
    )
}
