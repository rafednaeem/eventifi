import { createClient } from '@/lib/supabase/server'
import {
    Plus,
    Search,
    MapPin,
    Building2,
    Briefcase,
    ExternalLink,
    Edit3,
    Trash2,
    ShieldCheck,
    Star
} from 'lucide-react'
import { Button, Input, cn } from '@/components/ui'
import Link from 'next/link'
import {
    updateListingStatus,
    toggleListingVerification,
    toggleListingFeatured,
    deleteListing
} from '../actions'

export default async function AdminListingsPage({
    searchParams,
}: {
    searchParams: { status?: string; search?: string; type?: string }
}) {
    const supabase = await createClient()
    const status = searchParams.status || 'all'
    const search = searchParams.search || ''
    const type = searchParams.type || 'all'

    let query = supabase
        .from('listings')
        .select(`
            *,
            cities (name),
            profiles (full_name, email)
        `)
        .order('created_at', { ascending: false })

    if (status !== 'all') query = query.eq('status', status)
    if (type !== 'all') query = query.eq('type', type)
    if (search) query = query.ilike('title', `%${search}%`)

    const { data: listings } = await query

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black tracking-tight">Marketplace Listings</h1>
                    <p className="text-muted-foreground mt-2">Manage all venues and services on the platform.</p>
                </div>
                <Link href="/admin/listings/new">
                    <Button className="rounded-2xl h-12 px-6 gap-2">
                        <Plus className="h-5 w-5" /> Add New Listing
                    </Button>
                </Link>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by title..."
                        className="pl-10 h-12 bg-card border-border rounded-2xl"
                        defaultValue={search}
                    />
                </div>
                <div className="flex gap-2">
                    {['all', 'venue', 'service'].map((t) => (
                        <Link key={t} href={`/admin/listings?type=${t}`}>
                            <Button
                                variant={type === t ? 'primary' : 'outline'}
                                size="sm"
                                className="rounded-xl capitalize h-12 px-6"
                            >
                                {t}s
                            </Button>
                        </Link>
                    ))}
                </div>
            </div>

            <div className="bg-card border border-border rounded-[2.5rem] overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-zinc-50 border-b border-border">
                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Listing Detail</th>
                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-center">Owner</th>
                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-center">Admin Controls</th>
                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-right px-8">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {listings?.map((listing: any) => (
                            <tr key={listing.id} className="group hover:bg-zinc-50/50 transition-colors">
                                <td className="px-6 py-6">
                                    <div className="flex items-center gap-4">
                                        <div className="h-16 w-16 bg-muted rounded-2xl overflow-hidden shrink-0 border border-border relative">
                                            <img src={listing.cover_image_url} alt="" className="h-full w-full object-cover" />
                                            <div className="absolute top-1 left-1">
                                                {listing.type === 'venue' ? (
                                                    <Building2 className="h-4 w-4 text-white bg-orange-600 rounded-md p-0.5" />
                                                ) : (
                                                    <Briefcase className="h-4 w-4 text-white bg-blue-600 rounded-md p-0.5" />
                                                )}
                                            </div>
                                        </div>
                                        <div>
                                            <p className="font-bold text-lg leading-tight">{listing.title}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className={cn(
                                                    "text-[10px] font-black uppercase tracking-tighter px-2 py-0.5 rounded",
                                                    listing.status === 'approved' ? "bg-green-100 text-green-700" :
                                                        listing.status === 'pending' ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"
                                                )}>
                                                    {listing.status}
                                                </span>
                                                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                                    <MapPin className="h-3 w-3" /> {listing.cities?.name}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-6">
                                    <div className="text-center">
                                        <p className="text-xs font-bold text-foreground">{listing.profiles?.full_name}</p>
                                        <p className="text-[10px] text-muted-foreground mt-0.5">{listing.profiles?.email}</p>
                                    </div>
                                </td>
                                <td className="px-6 py-6">
                                    <div className="flex items-center justify-center gap-3">
                                        <form action={async () => {
                                            'use server'
                                            await toggleListingVerification(listing.id, !listing.is_verified)
                                        }}>
                                            <button className={cn(
                                                "p-2 rounded-xl border transition-all",
                                                listing.is_verified ? "bg-blue-50 border-blue-100 text-blue-600 shadow-sm" : "bg-white border-zinc-200 text-zinc-400 opacity-50 gray-scale hover:opacity-100"
                                            )}>
                                                <ShieldCheck className="h-5 w-5" />
                                            </button>
                                        </form>
                                        <form action={async () => {
                                            'use server'
                                            await toggleListingFeatured(listing.id, !listing.is_featured)
                                        }}>
                                            <button className={cn(
                                                "p-2 rounded-xl border transition-all",
                                                listing.is_featured ? "bg-amber-50 border-amber-100 text-amber-600 shadow-sm" : "bg-white border-zinc-200 text-zinc-400 opacity-50 gray-scale hover:opacity-100"
                                            )}>
                                                <Star className="h-5 w-5" />
                                            </button>
                                        </form>
                                    </div>
                                </td>
                                <td className="px-6 py-6 text-right px-8">
                                    <div className="flex items-center justify-end gap-2">
                                        <Link href={`/admin/listings/${listing.id}/edit`}>
                                            <Button variant="outline" size="sm" className="h-9 w-9 p-0 rounded-xl hover:bg-primary/5 hover:text-primary border-zinc-200">
                                                <Edit3 className="h-4 w-4" />
                                            </Button>
                                        </Link>
                                        <form action={async () => {
                                            'use server'
                                            await deleteListing(listing.id)
                                        }} onReset={(e) => {
                                            if (!confirm('Are you sure? This cannot be undone.')) e.preventDefault()
                                        }}>
                                            <Button variant="ghost" size="sm" className="h-9 w-9 p-0 rounded-xl text-destructive hover:bg-destructive/10">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </form>
                                        <Link href={`/listing/${listing.slug}`} target="_blank">
                                            <Button variant="ghost" size="sm" className="h-9 w-9 p-0 rounded-xl">
                                                <ExternalLink className="h-4 w-4" />
                                            </Button>
                                        </Link>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
