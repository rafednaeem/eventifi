'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Check, X, Building2, Briefcase, MapPin, Tag, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui'

export default function AdminVerificationPage() {
    const supabase = createClient()
    const [pendingListings, setPendingListings] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    // For MVP, we'll fetch all listings with status = 'pending'
    // Security note: In a real app, RLS policy would strictly enforce only users with role='admin' can see this
    useEffect(() => {
        async function fetchPending() {
            setLoading(true)

            const { data, error } = await supabase
                .from('listings')
                .select(`
                    id,
                    title,
                    type,
                    description,
                    base_price,
                    created_at,
                    cover_image_url,
                    cities(name),
                    profiles!owner_id(full_name, email)
                `)
                .eq('status', 'pending')
                .order('created_at', { ascending: false })

            if (data) {
                setPendingListings(data)
            } else if (error) {
                console.error("Error fetching pending listings:", error)
            }

            setLoading(false)
        }

        fetchPending()
    }, [])

    const handleAction = async (id: string, newStatus: string) => {
        // Optimistic UI update
        const previousListings = [...pendingListings]
        setPendingListings(pendingListings.filter(l => l.id !== id))

        const { error } = await supabase
            .from('listings')
            .update({ status: newStatus })
            .eq('id', id)

        if (error) {
            console.error("Action failed:", error)
            alert("Failed to update listing status.")
            // Revert on failure
            setPendingListings(previousListings)
        }
    }

    if (loading) return <div className="p-8">Loading pending listings...</div>

    return (
        <div className="space-y-8 pb-12">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
                    <ShieldCheck className="w-8 h-8 text-blue-600" /> Admin: Verify Listings
                </h1>
                <p className="text-muted-foreground mt-2">
                    Review and approve new venues and services before they go live on the EventiFi Marketplace.
                </p>
            </div>

            {pendingListings.length === 0 ? (
                <div className="text-center py-20 bg-blue-50/50 rounded-2xl border border-blue-100 border-dashed">
                    <div className="w-16 h-16 bg-blue-100 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Check className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">All Caught Up!</h3>
                    <p className="text-slate-500">There are no pending listings awaiting your review right now.</p>
                </div>
            ) : (
                <div className="space-y-6">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-sm font-bold">
                            {pendingListings.length} Pending Approval
                        </span>
                    </div>

                    <div className="grid gap-6">
                        {pendingListings.map((listing) => (
                            <div key={listing.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm flex flex-col md:flex-row">

                                {/* Image Area */}
                                <div className="md:w-64 h-48 md:h-auto bg-slate-100 shrink-0 relative">
                                    {listing.cover_image_url ? (
                                        <img src={listing.cover_image_url} alt={listing.title} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-300 bg-slate-50">
                                            {listing.type === 'venue' ? <Building2 className="w-12 h-12" /> : <Briefcase className="w-12 h-12" />}
                                        </div>
                                    )}
                                    <div className="absolute top-4 left-4">
                                        <span className={`px-3 py-1 text-xs font-bold rounded-lg uppercase tracking-wider shadow-sm backdrop-blur-md ${listing.type === 'venue' ? 'bg-orange-500/90 text-white' : 'bg-pink-500/90 text-white'
                                            }`}>
                                            {listing.type}
                                        </span>
                                    </div>
                                </div>

                                {/* Content Area */}
                                <div className="p-6 md:p-8 flex-1 flex flex-col justify-between">
                                    <div>
                                        <div className="flex justify-between items-start gap-4 mb-2">
                                            <h3 className="text-xl font-bold text-slate-900">{listing.title}</h3>
                                            <span className="text-sm font-medium text-slate-400">
                                                Submitted {new Date(listing.created_at).toLocaleDateString()}
                                            </span>
                                        </div>

                                        <p className="text-slate-500 text-sm mb-4 line-clamp-2">{listing.description}</p>

                                        <div className="flex flex-wrap gap-x-6 gap-y-2 mb-6 text-sm">
                                            <div className="flex items-center gap-1.5 text-slate-600">
                                                <MapPin className="w-4 h-4 text-slate-400" />
                                                <span className="font-medium">{listing.cities?.name || 'No City'}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 text-slate-600">
                                                <Tag className="w-4 h-4 text-slate-400" />
                                                <span className="font-medium">PKR {listing.base_price.toLocaleString()} Base Price</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 text-slate-600">
                                                <span className="text-slate-400">👤 Owner:</span>
                                                <span className="font-medium">{listing.profiles?.full_name || 'Unknown'} ({listing.profiles?.email || 'No email'})</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-4 border-t border-slate-100 pt-6 mt-auto">
                                        <Button
                                            onClick={() => handleAction(listing.id, 'rejected')}
                                            variant="outline"
                                            className="h-12 w-32 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 font-bold"
                                        >
                                            <X className="w-5 h-5 mr-2" /> Reject
                                        </Button>
                                        <Button
                                            onClick={() => handleAction(listing.id, 'approved')}
                                            className="h-12 flex-1 bg-green-600 hover:bg-green-700 text-white font-bold text-base shadow-lg shadow-green-600/20"
                                        >
                                            <Check className="w-5 h-5 mr-2" /> Approve & Publish
                                        </Button>
                                    </div>
                                </div>

                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
