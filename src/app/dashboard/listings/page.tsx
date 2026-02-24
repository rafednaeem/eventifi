'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Building2, Briefcase, Plus, MapPin, Eye, Edit, Trash2, Tag } from 'lucide-react'
import { Button } from '@/components/ui'
import Link from 'next/link'

export default function OwnerListingsPage() {
    const supabase = createClient()
    const [listings, setListings] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchListings() {
            setLoading(true)
            const { data: { user } } = await supabase.auth.getUser()

            if (user) {
                const { data, error } = await supabase
                    .from('listings')
                    .select(`
                        id,
                        title,
                        type,
                        base_price,
                        status,
                        is_active,
                        cover_image_url,
                        created_at,
                        cities(name)
                    `)
                    .eq('owner_id', user.id)
                    .order('created_at', { ascending: false })

                if (data) {
                    setListings(data)
                } else if (error) {
                    console.error("Error fetching listings:", error)
                }
            }
            setLoading(false)
        }

        fetchListings()
    }, [])

    if (loading) return <div className="p-8">Loading your listings...</div>

    const venues = listings.filter(l => l.type === 'venue')
    const services = listings.filter(l => l.type === 'service')

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">My Listings</h1>
                    <p className="text-muted-foreground mt-2">Manage your venues and services on EventiFi.</p>
                </div>
                <div className="flex gap-3">
                    <Link href="/dashboard/listings/new-venue">
                        <Button className="bg-slate-900 hover:bg-slate-800 text-white font-bold shadow-lg">
                            <Plus className="w-4 h-4 mr-2" /> Add Venue
                        </Button>
                    </Link>
                    <Link href="/dashboard/listings/new-service">
                        <Button className="bg-orange-500 hover:bg-orange-600 text-white font-bold shadow-lg shadow-orange-500/20">
                            <Plus className="w-4 h-4 mr-2" /> Add Service
                        </Button>
                    </Link>
                </div>
            </div>

            {listings.length === 0 ? (
                <div className="text-center py-20 bg-card rounded-2xl border border-border border-dashed">
                    <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Building2 className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">No listings found</h3>
                    <p className="text-slate-500 mb-8 max-w-sm mx-auto">
                        You haven't added any venues or services yet. Start earning by creating your first listing!
                    </p>
                    <div className="flex justify-center gap-4">
                        <Link href="/dashboard/listings/new-venue">
                            <Button variant="outline" className="border-slate-300 font-bold">Add a Venue</Button>
                        </Link>
                        <Link href="/dashboard/listings/new-service">
                            <Button variant="outline" className="border-slate-300 font-bold">Add a Service</Button>
                        </Link>
                    </div>
                </div>
            ) : (
                <div className="space-y-12">

                    {/* Venues Section */}
                    {venues.length > 0 && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
                                <Building2 className="w-5 h-5 text-orange-500" /> My Venues
                            </h2>
                            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
                                {venues.map((venue) => (
                                    <ListingCard key={venue.id} item={venue} />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Services Section */}
                    {services.length > 0 && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
                                <Briefcase className="w-5 h-5 text-pink-500" /> My Services
                            </h2>
                            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
                                {services.map((service) => (
                                    <ListingCard key={service.id} item={service} />
                                ))}
                            </div>
                        </div>
                    )}

                </div>
            )}
        </div>
    )
}

function ListingCard({ item }: { item: any }) {
    return (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 flex flex-col group">
            <div className="relative h-48 bg-slate-100">
                {item.cover_image_url ? (
                    <img src={item.cover_image_url} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                        {item.type === 'venue' ? <Building2 className="w-8 h-8 opacity-50 mb-2" /> : <Briefcase className="w-8 h-8 opacity-50 mb-2" />}
                        <span className="text-xs uppercase tracking-wider font-bold">No Image</span>
                    </div>
                )}
                <div className="absolute top-4 right-4 flex gap-2">
                    <span className={`px-2.5 py-1 text-xs font-bold rounded-lg shadow-sm backdrop-blur-md ${item.status === 'approved' ? 'bg-green-500/90 text-white' :
                            item.status === 'pending' ? 'bg-orange-500/90 text-white' :
                                'bg-red-500/90 text-white'
                        }`}>
                        {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                    </span>
                    {!item.is_active && (
                        <span className="px-2.5 py-1 text-xs font-bold rounded-lg shadow-sm bg-slate-900/90 text-white backdrop-blur-md">Hidden</span>
                    )}
                </div>
            </div>

            <div className="p-5 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2 gap-4">
                    <h3 className="font-bold text-lg text-slate-900 line-clamp-1">{item.title}</h3>
                </div>

                <div className="flex flex-wrap gap-y-2 gap-x-4 mb-4 text-sm text-slate-500">
                    {item.cities?.name && (
                        <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" />{item.cities.name}</span>
                    )}
                    <span className="flex items-center gap-1.5"><Tag className="w-3.5 h-3.5" />PKR {item.base_price.toLocaleString()}</span>
                </div>

                <div className="mt-auto pt-4 border-t border-slate-100 flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1 font-bold border-slate-200 text-slate-600 hover:text-slate-900">
                        <Edit className="w-4 h-4 mr-2 text-slate-400" /> Edit
                    </Button>
                    <Button variant="outline" size="icon" className="shrink-0 border-slate-200 text-slate-400 hover:text-orange-600 hover:border-orange-200 hover:bg-orange-50">
                        <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="icon" className="shrink-0 border-slate-200 text-slate-400 hover:text-red-600 hover:border-red-200 hover:bg-red-50">
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
            </div>
        </div>
    )
}
