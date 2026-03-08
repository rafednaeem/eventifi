import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui'
import { Plus, Briefcase, MapPin, Star, MoreVertical } from 'lucide-react'

export default async function MyServicesPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const { data: services } = await supabase
        .from('listings')
        .select(`
            *,
            listing_services (service_area, packages),
            cities (name)
        `)
        .eq('owner_id', user.id)
        .eq('type', 'service')
        .order('created_at', { ascending: false })

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">My Services</h1>
                    <p className="text-muted-foreground mt-2">Manage your professional event services and portfolio.</p>
                </div>
                <Link href="/dashboard/services/new">
                    <Button className="gap-2">
                        <Plus className="h-4 w-4" /> Add Service
                    </Button>
                </Link>
            </div>

            {!services || services.length === 0 ? (
                <div className="rounded-2xl border-2 border-dashed border-border p-20 flex flex-col items-center justify-center text-center">
                    <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                        <Briefcase className="h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-bold">No services listed yet</h3>
                    <p className="text-muted-foreground mt-2 max-w-sm">
                        Start offering your skills to customers by creating your first service listing.
                    </p>
                    <Link href="/dashboard/services/new" className="mt-6">
                        <Button variant="outline">Create your first service</Button>
                    </Link>
                </div>
            ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {services.map((service: any) => (
                        <div key={service.id} className="group overflow-hidden rounded-2xl border border-border bg-card transition-all hover:shadow-lg">
                            <div className="relative aspect-video overflow-hidden">
                                <img
                                    src={service.cover_image_url || 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30'}
                                    alt={service.title}
                                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                                />
                                <div className="absolute top-3 right-3">
                                    <div className={`px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter shadow-sm border ${service.status === 'approved' ? 'bg-green-500 text-white border-green-600' :
                                        service.status === 'pending' ? 'bg-amber-500 text-white border-amber-600' :
                                            'bg-red-500 text-white border-red-600'
                                        }`}>
                                        {service.status}
                                    </div>
                                </div>
                            </div>

                            <div className="p-5 space-y-3">
                                <div className="flex items-center gap-2 text-[10px] font-bold text-primary uppercase tracking-widest leading-none">
                                    {service.type}
                                </div>
                                <h3 className="font-bold text-lg truncate">{service.title}</h3>

                                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                    <div className="flex items-center gap-1">
                                        <MapPin className="h-3 w-3" />
                                        {service.cities?.name}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Star className="h-3 w-3 text-orange-400 fill-orange-400" />
                                        {service.rating || 'New'}
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-border flex items-center justify-between">
                                    <div className="text-sm">
                                        <span className="text-muted-foreground">Starting</span>
                                        <p className="font-bold text-primary">PKR {service.base_price?.toLocaleString()}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button variant="ghost" size="sm" className="h-8 w-8">
                                            <MoreVertical className="h-4 w-4" />
                                        </Button>
                                        <Link href={`/dashboard/services/${service.id}`}>
                                            <Button variant="outline" size="sm">Edit</Button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
