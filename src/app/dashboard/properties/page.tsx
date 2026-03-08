import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { cn, Button } from '@/components/ui'
import { Building, MapPin, Plus, MoreVertical, Edit3, Trash2, Calendar as CalendarIcon } from 'lucide-react'

export default async function PropertiesPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const { data: properties } = await supabase
        .from('listings')
        .select(`
      *,
      listing_venues (capacity_min, capacity_max),
      cities (name)
    `)
        .eq('owner_id', user.id)
        .eq('type', 'venue')
        .order('created_at', { ascending: false })

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">My Properties</h1>
                    <p className="text-muted-foreground mt-1">Manage your event spaces and their status.</p>
                </div>
                <Link href="/dashboard/properties/new">
                    <Button className="flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        Add Property
                    </Button>
                </Link>
            </div>

            {!properties || properties.length === 0 ? (
                <div className="rounded-2xl border-2 border-dashed border-border p-20 flex flex-col items-center justify-center text-center">
                    <div className="h-16 w-16 rounded-full bg-primary/5 text-primary/40 flex items-center justify-center mb-4">
                        <Building className="h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-bold">No properties yet</h3>
                    <p className="text-muted-foreground mt-2 mb-6 max-w-sm">
                        Start by adding your first venue to reach thousands of event planners in Pakistan.
                    </p>
                    <Link href="/dashboard/properties/new">
                        <Button variant="outline">Create Your First Listing</Button>
                    </Link>
                </div>
            ) : (
                <div className="grid gap-6">
                    {properties.map((property: any) => (
                        <div
                            key={property.id}
                            className="group relative flex flex-col sm:flex-row overflow-hidden rounded-xl border border-border bg-card transition-all hover:shadow-md"
                        >
                            <div className="relative h-48 w-full sm:h-auto sm:w-64 bg-muted overflow-hidden">
                                {property.cover_image_url ? (
                                    <img
                                        src={property.cover_image_url}
                                        alt={property.name}
                                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center">
                                        <Building className="h-12 w-12 text-muted-foreground/20" />
                                    </div>
                                )}
                                <div className="absolute top-4 left-4">
                                    <span className={cn(
                                        "inline-flex items-center rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white",
                                        property.status === 'approved' ? 'bg-green-500' :
                                            property.status === 'pending' ? 'bg-orange-500' : 'bg-red-500'
                                    )}>
                                        {property.status}
                                    </span>
                                </div>
                            </div>

                            <div className="flex flex-1 flex-col p-6">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="text-xs font-bold text-primary uppercase tracking-widest">
                                            {property.type}
                                        </p>
                                        <h2 className="text-xl font-bold mt-1 group-hover:text-primary transition-colors">
                                            {property.title}
                                        </h2>
                                        <div className="flex items-center mt-2 text-sm text-muted-foreground">
                                            <MapPin className="mr-1 h-3 w-3" />
                                            {property.address}, {property.cities?.name}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Link href={`/dashboard/properties/${property.id}/calendar`}>
                                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-primary hover:bg-primary/10">
                                                <CalendarIcon className="h-4 w-4" />
                                            </Button>
                                        </Link>
                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                            <Edit3 className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10">
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>

                                <div className="mt-auto pt-6 flex items-center justify-between border-t border-border/50">
                                    <div className="flex gap-4">
                                        <div>
                                            <p className="text-[10px] text-muted-foreground uppercase font-bold">Capacity</p>
                                            <p className="text-sm font-semibold">{property.listing_venues?.capacity_min || 0}-{property.listing_venues?.capacity_max || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-muted-foreground uppercase font-bold">Base Price</p>
                                            <p className="text-sm font-semibold">PKR {property.base_price?.toLocaleString()}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className={cn(
                                            "h-2 w-2 rounded-full",
                                            property.is_active ? "bg-green-500" : "bg-zinc-300"
                                        )} />
                                        <span className="text-[10px] font-bold uppercase text-muted-foreground">
                                            {property.is_active ? "Active" : "Inactive"}
                                        </span>
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
